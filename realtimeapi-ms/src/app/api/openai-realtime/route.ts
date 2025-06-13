import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { prompt, experience, vectorStoreId } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new Response('Missing OpenAI API key', { status: 500 });
  }

  // System-level context maintenance rules (always applied)
  const contextRules = `SYSTEM CONTEXT RULES (ALWAYS FOLLOW):
1. MAINTAIN CONVERSATION CONTEXT: Always remember and reference previous parts of our conversation. When users ask follow-up questions, consider the full conversation history.
2. REFERENCE PREVIOUS TOPICS: If a user asks "what about that?" or "tell me more" or similar follow-ups, refer back to what we were discussing.
3. BUILD ON PREVIOUS RESPONSES: Each response should acknowledge and build upon previous exchanges in the conversation.
4. CONVERSATION CONTINUITY: Treat each interaction as part of an ongoing dialogue, not isolated queries.
5. CONTEXT AWARENESS: Always consider what has been said before when formulating responses.

SEARCH INSTRUCTIONS:
- ALWAYS search uploaded documents THOROUGHLY for any information related to the user's query
- If documents contain relevant information, provide a comprehensive answer based on the documents
- If documents don't contain sufficient information, or if user specifically asks to "check online" or "search web", then use web search
- MAINTAIN CONTEXT from previous messages in this conversation
- Be thorough and detailed in your analysis of document content
- If user says "check online", "search web", or similar, ALWAYS use web search

USER ROLE INSTRUCTIONS:`;

  const systemPrompt = experience
    ? `${contextRules}\nYou are simulating the experience: ${experience}. ${prompt}`
    : `${contextRules}\n${prompt}`;

  // Build tools array - always include web search, add file search if vector store provided
  const tools: any[] = [
    { 
      type: 'web_search_preview',
      search_context_size: 'medium'
    }
  ];
  
  if (vectorStoreId) {
    tools.push({
      type: 'file_search',
      vector_store_ids: [vectorStoreId],
      max_num_results: 10,
      ranking_options: {
        ranker: 'auto',
        score_threshold: 0
      }
    });
  }

  console.log('🛠️ Realtime API using tools:', tools.map(t => t.type));

  const requestBody = {
    model: 'gpt-4o',
    input: systemPrompt,
    tools: tools,
    stream: true,
    temperature: 1,
    top_p: 1,
    max_output_tokens: null,
    parallel_tool_calls: true
  };

  console.log('📤 Realtime API sending to Responses API:', { ...requestBody, input: `${systemPrompt.substring(0, 100)}...` });

  // Use Responses API instead of basic realtime endpoint
  const openaiRes = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'OpenAI-Beta': 'assistants=v2',
    },
    body: JSON.stringify(requestBody),
  });

  if (!openaiRes.ok) {
    const text = await openaiRes.text();
    console.error('❌ Responses API error:', text);
    return new Response(text, { status: openaiRes.status });
  }

  return new Response(openaiRes.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

export function GET() {
  return new Response('Method Not Allowed', { status: 405 });
} 