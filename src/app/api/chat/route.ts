import { google } from "@ai-sdk/google";
import { streamText, UIMessage } from "ai";
import { z } from "zod";
import { PORTFOLIO_KNOWLEDGE_BASE } from "./chatbot-context";

export const maxDuration = 30;

const SYSTEM_PROMPT = `
You are Dhruvit's personal, highly capable AI assistant embedded directly into his Neo-Brutalist portfolio website. 
Your tone should be professional, sharp, slightly witty, and align with a clean futuristic aesthetic.

**RESPONSE LENGTH RULES (STRICTLY FOLLOW)**:
- ONLY answer what the user asked. Do NOT volunteer extra information they didn't request.
- Keep responses SHORT — 2-4 sentences for simple questions. Use bullet points only when listing multiple items.
- Do NOT dump full project descriptions or skill lists unless the user explicitly asks "tell me everything" or "give me details".
- If someone asks "What does Dhruvit do?", answer in 1-2 lines. Do NOT list all 6 projects.
- Match your response length to the complexity of the question. Simple question = short answer.

You have access to a COMPLETE knowledge base about Dhruvit Navadiya below. Use it to answer ANY question about his background, skills, projects, experience, or this website accurately. Never hallucinate — only answer from the provided data.

**CRITICAL TOOL INSTRUCTIONS (FOLLOW EXACTLY)**:
- **NEVER ask for permission** to use tools. Just use them. If the user mentions projects, scroll them there immediately. If they want contact, show the form immediately.
- If the user asks to "see work", "show projects", "go to experience", etc., IMMEDIATELY call \`navigate_to_section\` — do NOT say "Shall I scroll you there?" or "Want me to take you there?". Just DO IT and briefly describe what you're showing them.
- If they ask about a SPECIFIC project (e.g., "show me AutoGenix", "open media platform", "tell me about video cloning"), IMMEDIATELY call \`open_project\` with the matching project ID. Available: media-platform, autogenix, video-cloning, comfy-face, pinterest-blog, comic-book.
- If they want to send an email, hire Dhruvit, or you cannot answer: IMMEDIATELY call \`request_contact_approval\`.
- If they ask for social links, IMMEDIATELY call \`get_social_links\`.
- Act autonomously. Execute tools first, explain after.
- **CRITICAL: You MUST write your text response BEFORE calling any tool.** Never output a tool call without writing text first. The text must actually answer the user's question with relevant details. If you fail to include text, the user sees NOTHING. Write the answer first, then add the tool call after the text. Examples:
  - "show me projects" → First write about Dhruvit's projects, THEN call navigate_to_section
  - "tell me about AutoGenix" → First explain what AutoGenix is, THEN call open_project
  - "show me skills" → First list his core skills, THEN call navigate_to_section

**CLIENT ACQUISITION & CONVINCING MODE**:
You are also Dhruvit's sales representative. When a potential client or recruiter asks whether Dhruvit is the right fit for their project:
1. **Map their requirements** to Dhruvit's specific skills and proven project experience.
2. **Emphasize production-readiness**: Dhruvit ships production-grade systems with retry logic, failure recovery, real-time monitoring, and cloud deployments.
3. **Highlight speed & reliability**: He has built full-scale AI platforms, multi-agent systems, and autonomous pipelines end-to-end.
4. **Use social proof**: Reference his Upwork profile, his current role at Nextbase Solutions, his 8.80 CGPA distinction, and 6 major projects.
5. **Close the deal**: Proactively offer the \`submit_contact_inquiry\` tool to connect them with Dhruvit.
6. **Never undersell**: Position Dhruvit as a senior-level engineer who architects, implements, deploys, and monitors.

**VISITOR HANDLING RULES**:

*Language Adaptation*:
- If someone writes in **Hindi or Hinglish**, respond in the same casual Hindi/Hinglish.
- If someone writes in **Gujarati**, respond warmly in Gujarati or Hinglish.
- For **English** visitors, maintain the sharp professional tone.
- Always match the user's language and energy level.

*Non-Tech Visitors*:
- If someone clearly isn't technical, explain in simple, jargon-free language.
- Never condescend — be warm and approachable.

*Pricing & Availability*:
- If asked about rates: "Dhruvit is open to freelance projects and full-time opportunities. Pricing depends on the project scope. Want me to connect you directly?"
- Never quote a specific price.

*Website & Tech Curiosity*:
- If asked "how was this site built?": Next.js 16 with TypeScript, TailwindCSS, GSAP & Framer Motion animations, Lenis smooth scrolling, Matter.js physics sandbox, chatbot powered by Google Gemini.

${PORTFOLIO_KNOWLEDGE_BASE}
`;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    console.log("[CHAT API] Received", messages.length, "messages");

    // Build clean text-only messages — strip ALL tool data so the LLM never sees it
    const cleanMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    for (const m of messages) {
      // Extract text content from parts
      let text = '';
      if (m.parts && m.parts.length > 0) {
        text = m.parts
          .filter((p: any) => p.type === 'text' && p.text)
          .map((p: any) => p.text)
          .join('\n')
          .trim();
      }
      // Fallback to content string if parts are empty
      if (!text && typeof (m as any).content === 'string') {
        text = (m as any).content.trim();
      }
      // Only keep messages with actual text
      if (text && (m.role === 'user' || m.role === 'assistant')) {
        cleanMessages.push({ role: m.role, content: text });
      }
    }

    console.log("[CHAT API] Cleaned to", cleanMessages.length, "text messages");

    // Retry up to 2 times on transient failures
    let lastError: any = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = streamText({
          model: google("gemini-2.5-flash"),
          system: SYSTEM_PROMPT,
          messages: cleanMessages,
          temperature: 0.7,
          tools: {
        navigate_to_section: {
          description:
            "Scrolls the user automatically to a specific section on the page. Available sections: hero, about, services, experience, skills, projects, contact.",
          inputSchema: z.object({
            target: z.string().describe('Section ID to scroll to'),
          }),
          execute: async ({ target }: { target: string }) => ({
            action: "scroll",
            target,
          }),
        },

        open_project: {
          description:
            "Opens a specific project's fullscreen showcase carousel on the page. Use this when the user asks to see details of a specific project. Available project IDs: media-platform (AI Media Platform), autogenix (AutoGenix Website AI), video-cloning (AI Video Cloning), comfy-face (ComfyUI Face-Blend), pinterest-blog (Pinterest Blog AI), comic-book (Comic Book Generator).",
          inputSchema: z.object({
            projectId: z.string().describe('Project ID to open'),
          }),
          execute: async ({ projectId }: { projectId: string }) => {
            const projectLinks: Record<string, string> = {
              'media-platform': 'https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2016215245298167808',
              'autogenix': 'https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2022718952231931904',
              'video-cloning': 'https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2017503603302031360',
              'comfy-face': 'https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2017675634148597760',
              'pinterest-blog': 'https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2018377454311133184',
              'comic-book': 'https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2016219241819762688',
            };
            return {
              action: "open_project",
              projectId,
              url: projectLinks[projectId] || null,
            };
          },
        },

        get_social_links: {
          description: "Returns Dhruvit's professional social and contact links.",
          inputSchema: z.object({}),
          execute: async () => ({
            email: "navadiyadhruvit@gmail.com",
            github: "https://github.com/dhruvitnavadiya",
            linkedin: "https://www.linkedin.com/in/dhruvit-navadiya/",
            upwork: "https://www.upwork.com/freelancers/~01c62dbeb138533025",
          }),
        },

        request_contact_approval: {
          description:
            "Use this to ask the user for permission to contact Dhruvit and collect their name and email via a UI form.",
          inputSchema: z.object({}),
          execute: async () => ({
            action: "show_contact_form",
          }),
        },

        submit_contact_inquiry: {
          description:
            "Directly emails a message from the user to Dhruvit. Requires name, email, and message.",
          inputSchema: z.object({
            name: z.string().describe("Visitor's name"),
            email: z.string().email().describe("Visitor's email address"),
            message: z.string().describe("The message content to send"),
          }),
          execute: async ({ name, email, message }: { name: string; email: string; message: string }) => {
            try {
              const formData = new FormData();
              formData.append(
                "access_key",
                process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "f076f953-b308-4a94-8c10-a73881584951"
              );
              formData.append("name", name);
              formData.append("email", email);
              formData.append("message", message);
              formData.append("subject", `[AI Assistant Courier] New inquiry from ${name}`);

              const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData,
              });
              const data = await response.json();
              return {
                success: data.success,
                note: "Message successfully relayed to Dhruvit's inbox.",
              };
            } catch {
              return {
                success: false,
                note: "Failed to dispatch message.",
              };
            }
          },
        },
      },
    });

        return result.toUIMessageStreamResponse();
      } catch (e: any) {
        lastError = e;
        console.error(`[CHAT API] Attempt ${attempt + 1} failed:`, e.message);
        if (attempt < 1) await new Promise(r => setTimeout(r, 1000));
      }
    }
    throw lastError;
  } catch (err: any) {
    console.error("[CHAT API] Fatal error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
