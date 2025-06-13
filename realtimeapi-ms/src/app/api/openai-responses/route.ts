import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { prompt, stream = false, vectorStoreId } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    console.log('🔧 Responses API called with:', { 
      promptLength: prompt?.length, 
      stream, 
      vectorStoreId: vectorStoreId ? 'provided' : 'none' 
    });

    if (!apiKey) {
      console.error('❌ Missing OpenAI API key');
      return new Response(JSON.stringify({ error: 'Missing OpenAI API key' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!prompt) {
      console.error('❌ Missing prompt');
      return new Response(JSON.stringify({ error: 'Missing prompt' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

    console.log('🛠️ Using tools:', tools.map(t => t.type));

    const requestBody = {
      model: 'gpt-4o',
      input: prompt,
      tools: tools,
      stream: stream,
      temperature: 1,
      top_p: 1,
      max_output_tokens: null,
      parallel_tool_calls: true
    };

    console.log('📤 Sending to OpenAI:', { ...requestBody, input: `${prompt.substring(0, 100)}...` });

    const openaiRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 OpenAI response status:', openaiRes.status);

    if (!openaiRes.ok) {
      const text = await openaiRes.text();
      console.error('❌ OpenAI API error:', text);
      return new Response(JSON.stringify({ 
        error: `OpenAI API error: ${openaiRes.status}`,
        details: text 
      }), { 
        status: openaiRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (stream) {
      // Return streaming response with proper headers
      return new Response(openaiRes.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    } else {
      // Return regular JSON response
      const data = await openaiRes.json();
      console.log('📦 Non-streaming response:', data);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('❌ Responses API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export function GET() {
  return new Response('Method Not Allowed', { status: 405 });
} 