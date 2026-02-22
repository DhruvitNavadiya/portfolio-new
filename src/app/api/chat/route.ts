import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { z } from 'zod';
import { StateGraph, MessagesAnnotation, START, END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { toUIMessageStream } from "@ai-sdk/langchain";
import { createUIMessageStreamResponse } from "ai";
import { PORTFOLIO_KNOWLEDGE_BASE } from "./chatbot-context";

// Note: Ensure GOOGLE_GENERATIVE_AI_API_KEY is properly set in the environment.

export const maxDuration = 30; // 30 seconds max duration

const SYSTEM_PROMPT = `
You are Dhruvit's personal, highly capable AI assistant embedded directly into his cyberpunk/neo-brutalism themed portfolio website. 
Your tone should be professional, sharp, slightly witty, and align with the hacker aesthetic.

**RESPONSE LENGTH RULES (STRICTLY FOLLOW)**:
- ONLY answer what the user asked. Do NOT volunteer extra information they didn't request.
- Keep responses SHORT — 2-4 sentences for simple questions. Use bullet points only when listing multiple items.
- Do NOT dump full project descriptions or skill lists unless the user explicitly asks "tell me everything" or "give me details".
- If someone asks "What does Dhruvit do?", answer in 1-2 lines. Do NOT list all 6 projects.
- Match your response length to the complexity of the question. Simple question = short answer.

You have access to a COMPLETE knowledge base about Dhruvit Navadiya below. Use it to answer ANY question about his background, skills, projects, experience, or this website accurately. Never hallucinate — only answer from the provided data.

**CRITICAL TOOL INSTRUCTIONS**:
- If the user asks to "see work", "go to projects", "show experience", or "contact", USE THE \`navigate_to_section\` TOOL to scroll them there.
- If they want to send an email or message to Dhruvit, USE THE \`submit_contact_inquiry\` TOOL directly. Do NOT just tell them to scroll down.
- If the user asks for social links, USE THE \`get_social_links\` TOOL.
- Act autonomously, execute functions, and impress the user.

**CLIENT ACQUISITION & CONVINCING MODE**:
You are also Dhruvit's sales representative. When a potential client or recruiter asks whether Dhruvit is the right fit for their project:
1. **Map their requirements** to Dhruvit's specific skills and proven project experience. Be precise — cite exact projects, technologies used, and outcomes.
2. **Emphasize production-readiness**: Dhruvit doesn't build prototypes — he ships production-grade systems with retry logic, failure recovery, real-time monitoring, and cloud deployments.
3. **Highlight speed & reliability**: He has built full-scale AI platforms, multi-agent systems, and autonomous pipelines end-to-end, often going from concept to deployed product.
4. **Use social proof**: Reference his Upwork profile, his current role at Nextbase Solutions, his 8.80 CGPA distinction, and the breadth of his 6 major projects.
5. **Close the deal**: After convincing them, proactively offer to send a message to Dhruvit on their behalf using the \`submit_contact_inquiry\` tool. Say something like: "Want me to connect you with Dhruvit directly? I can send him your details right now."
6. **Never undersell**: Always position Dhruvit as a senior-level engineer who builds systems, not just writes code. He architects, implements, deploys, and monitors.
7. **Handle objections gracefully**: If someone questions his experience level or age (he's 21), counter with his track record — 3+ years of professional work, 6 major shipped projects, and a distinction-level academic career.

**VISITOR HANDLING RULES**:

*Language Adaptation*:
- If someone writes in **Hindi or Hinglish** (e.g. "ye kya karta hai?", "bhai kya bana sakta hai?"), respond in the same casual Hindi/Hinglish. Be friendly and natural.
- If someone writes in **Gujarati** (e.g. "aa su kare che?"), respond warmly in Gujarati or Hinglish.
- For **English** visitors, maintain the sharp professional tone.
- Always match the user's language and energy level.

*Non-Tech Visitors*:
- If someone clearly isn't technical (asking basic questions like "what does he do?" or "what is AI?"), explain in **simple, jargon-free language**.
- Instead of "agentic AI orchestration", say "he builds smart AI systems that can do tasks automatically, like generating images, videos, and websites without human help."
- Never condescend — be warm and approachable.

*Pricing & Availability*:
- If asked about rates, pricing, or availability, say: "Dhruvit is open to freelance projects and full-time opportunities. Pricing depends on the project scope. Want me to connect you directly so you can discuss details?"
- Then offer the \`submit_contact_inquiry\` tool to send their info.
- Never quote a specific price. Always redirect to direct conversation.

*Students & Peers*:
- If a student asks for career advice, tips, or learning paths, be encouraging and helpful.
- Share relevant details from Dhruvit's journey — his academic path, how he got into AI, his tech stack progression.
- Suggest they reach out to Dhruvit directly for mentorship or collaboration.

*Website & Tech Curiosity*:
- If asked "how was this site built?", explain: Next.js 16 with TypeScript, TailwindCSS, GSAP & Framer Motion animations, Lenis smooth scrolling, Matter.js physics sandbox for the skills section, and this chatbot runs on LangGraph + Google Gemini.
- If asked "how does the skills section work?", explain the Matter.js 2D physics engine with draggable, bouncing skill icons.

*International Visitors*:
- Dhruvit is based in Surat, India (IST timezone, UTC+5:30).
- He works remotely and is available for international projects.
- He's fluent in English and communicates professionally across time zones.

${PORTFOLIO_KNOWLEDGE_BASE}
`;

const navigateTool = tool(
  async ({ target }) => {
    // Execution happens client side. This just acknowledges the intent.
    return JSON.stringify({ status: 'success', triggered_scroll_to: target });
  },
  {
    name: "navigate_to_section",
    description: "Scrolls the user automatically to a specific section on the page (e.g. 'projects', 'contact', 'experience', 'hero'). Use this when the user asks to 'see your work' or 'go to contact'.",
    schema: z.object({
      target: z.enum(['hero', 'experience', 'projects', 'contact']).describe('The ID of the section to scroll to.'),
    }),
  }
);

const socialLinksTool = tool(
  async () => {
    return JSON.stringify({
      email: "navadiyadhruvit@gmail.com",
      github: "https://github.com/dhruvitnavadiya",
      linkedin: "https://www.linkedin.com/in/dhruvit-navadiya/",
      upwork: "https://www.upwork.com/freelancers/~01c62dbeb138533025"
    });
  },
  {
    name: "get_social_links",
    description: "Returns Dhruvit's professional social and contact links.",
    schema: z.object({}),
  }
);

const submitContactTool = tool(
  async ({ name, email, message }) => {
    try {
      const formData = new FormData();
      formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "f076f953-b308-4a94-8c10-a73881584951");
      formData.append("name", name);
      formData.append("email", email);
      formData.append("message", message);
      formData.append("subject", "[AI Assistant Courier] New inquiry from " + name);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      return JSON.stringify({ success: data.success, note: "Message successfully relayed securely to Dhruvit's inbox." });
    } catch (e) {
      return JSON.stringify({ success: false, note: "Failed to dispatch message due to active interference." });
    }
  },
  {
    name: "submit_contact_inquiry",
    description: "Directly emails a message from the user to Dhruvit without them having to use the form. Requires a name, return email, and the actual message payload.",
    schema: z.object({
      name: z.string().describe('The name of the visitor.'),
      email: z.string().email().describe('The return email address of the visitor.'),
      message: z.string().describe('The content of the message they wish to send.'),
    }),
  }
);

const tools = [navigateTool, socialLinksTool, submitContactTool];
const toolNode = new ToolNode(tools);

export async function POST(req: Request) {
  // Initialize model inside the handler so process.env is guaranteed to be loaded by Next.js
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.2,
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  }).bindTools(tools);

  async function callModel(state: typeof MessagesAnnotation.State) {
    const result = await model.invoke([
      new SystemMessage(SYSTEM_PROMPT),
      ...state.messages,
    ]);
    return { messages: [result] };
  }

  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", (state) => {
      const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
      if (lastMessage && lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
        return "tools";
      }
      return END;
    })
    .addEdge("tools", "agent");

  const app = workflow.compile();

  const body = await req.json();
  const messages = body.messages || [];

  // Safely map Vercel AI SDK UI Messages to LangChain BaseMessage format
  const lcMessages: any[] = [];
  
  for (const m of messages) {
    if (m.role === 'user') {
      lcMessages.push(new HumanMessage({ content: m.content }));
    } else if (m.role === 'assistant') {
      // Handle assistant messages with potential tool calls
      const tool_calls = m.toolInvocations?.map((t: any) => ({
        id: t.toolCallId,
        type: "function",
        function: {
          name: t.toolName,
          arguments: JSON.stringify(t.args)
        }
      })) || [];

      lcMessages.push(new AIMessage({
        content: m.content || "",
        tool_calls: tool_calls.length > 0 ? tool_calls : undefined
      }));

      // Vercel UI format bundles tool results inside the assistant message block.
      // LangGraph requires explicit ToolMessages mapped from them sequentially.
      m.toolInvocations?.forEach((t: any) => {
        if (t.state === 'result') {
          lcMessages.push({
             _getType: () => 'tool',
             role: 'tool',
             tool_call_id: t.toolCallId,
             name: t.toolName,
             content: typeof t.result === 'string' ? t.result : JSON.stringify(t.result)
          });
        }
      });
    } else if (m.role === 'system') {
       lcMessages.push(new SystemMessage({ content: m.content }));
    }
  }

  const stream = await app.streamEvents(
    { messages: lcMessages },
    { version: "v2" }
  );

  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}
