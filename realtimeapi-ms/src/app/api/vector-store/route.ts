import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, vectorStoreId, fileName } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Missing OpenAI API key' }, { status: 500 });
    }

    if (action === 'create') {
      // Create a new vector store
      const response = await fetch('https://api.openai.com/v1/vector_stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2',
        },
        body: JSON.stringify({
          name: `Knowledge Base - ${new Date().toISOString()}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create vector store: ${response.statusText}`);
      }

      const vectorStore = await response.json();
      return NextResponse.json({
        success: true,
        vectorStore: {
          id: vectorStore.id,
          name: vectorStore.name,
          created_at: vectorStore.created_at,
          file_count: vectorStore.file_counts?.completed || 0
        }
      });
    }

    if (action === 'list_files' && vectorStoreId) {
      console.log('📋 Listing files for vector store:', vectorStoreId);
      
      // List files in vector store
      const response = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/files`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to list files: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📁 Raw vector store files:', data.data.map((f: any) => ({ 
        id: f.id, 
        status: f.status,
        created_at: f.created_at 
      })));
      
      // Enhance file data with actual file details from OpenAI Files API
      const enhancedFiles = await Promise.all(
        data.data.map(async (vectorFile: any) => {
          try {
            // Get actual file details to get filename and other metadata
            const fileResponse = await fetch(`https://api.openai.com/v1/files/${vectorFile.id}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
              },
            });

            if (fileResponse.ok) {
              const fileDetails = await fileResponse.json();
              console.log(`📄 File details for ${vectorFile.id}:`, {
                filename: fileDetails.filename,
                bytes: fileDetails.bytes,
                status: vectorFile.status
              });
              
              return {
                ...vectorFile,
                filename: fileDetails.filename,
                bytes: fileDetails.bytes,
                created_at: fileDetails.created_at,
                purpose: fileDetails.purpose
              };
            } else {
              console.warn(`⚠️ Failed to fetch file details for ${vectorFile.id}`);
              return vectorFile;
            }
          } catch (error) {
            console.error(`❌ Error fetching details for file ${vectorFile.id}:`, error);
            return vectorFile;
          }
        })
      );

      return NextResponse.json({
        success: true,
        files: enhancedFiles
      });
    }

    if (action === 'delete_file' && vectorStoreId && fileName) {
      // Delete a file from vector store
      const response = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/files/${fileName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`);
      }

      return NextResponse.json({
        success: true,
        message: 'File deleted successfully'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action or missing parameters'
    }, { status: 400 });

  } catch (error) {
    console.error('Vector store API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process vector store request'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vectorStoreId = searchParams.get('vectorStoreId');
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Missing OpenAI API key' }, { status: 500 });
    }

    if (vectorStoreId) {
      // Get vector store details
      const storeResponse = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });

      const filesResponse = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/files`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });

      if (!storeResponse.ok || !filesResponse.ok) {
        throw new Error('Failed to retrieve vector store data');
      }

      const vectorStore = await storeResponse.json();
      const filesData = await filesResponse.json();

      // Enhance file data with actual file details from OpenAI Files API
      const enhancedFiles = await Promise.all(
        filesData.data.map(async (vectorFile: any) => {
          try {
            // Get actual file details to get filename and other metadata
            const fileResponse = await fetch(`https://api.openai.com/v1/files/${vectorFile.id}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
              },
            });

            if (fileResponse.ok) {
              const fileDetails = await fileResponse.json();
              return {
                ...vectorFile,
                filename: fileDetails.filename,
                bytes: fileDetails.bytes,
                created_at: fileDetails.created_at,
                purpose: fileDetails.purpose
              };
            } else {
              // Fallback to vector store data if file details fetch fails
              return vectorFile;
            }
          } catch (error) {
            console.error(`Failed to fetch details for file ${vectorFile.id}:`, error);
            return vectorFile;
          }
        })
      );

      return NextResponse.json({
        success: true,
        vectorStore: {
          id: vectorStore.id,
          name: vectorStore.name,
          created_at: vectorStore.created_at,
          file_count: vectorStore.file_counts?.completed || 0
        },
        files: enhancedFiles
      });
    }

    // List all vector stores
    const response = await fetch('https://api.openai.com/v1/vector_stores', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list vector stores: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      vectorStores: data.data
    });

  } catch (error) {
    console.error('Vector store GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve vector store data'
    }, { status: 500 });
  }
} 