import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Starting file upload process...');
    const startTime = Date.now();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const vectorStoreId = formData.get('vectorStoreId') as string;
    const apiKey = process.env.OPENAI_API_KEY;

    console.log('📁 File details:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      vectorStoreId: vectorStoreId
    });

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Missing OpenAI API key' }, { status: 500 });
    }

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!vectorStoreId) {
      return NextResponse.json({ success: false, error: 'No vector store ID provided' }, { status: 400 });
    }

    // Step 1: Upload file to OpenAI
    console.log('⬆️ Step 1: Uploading file to OpenAI...');
    const uploadStartTime = Date.now();
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('purpose', 'assistants');

    const uploadResponse = await fetch('https://api.openai.com/v1/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: uploadFormData,
    });

    const uploadTime = Date.now() - uploadStartTime;
    console.log(`✅ File upload completed in ${uploadTime}ms`);

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('❌ Upload failed:', errorText);
      throw new Error(`Failed to upload file: ${errorText}`);
    }

    const uploadedFile = await uploadResponse.json();
    console.log('📄 Uploaded file details:', {
      id: uploadedFile.id,
      filename: uploadedFile.filename,
      bytes: uploadedFile.bytes,
      status: uploadedFile.status
    });

    // Step 2: Add file to vector store
    console.log('📚 Step 2: Adding file to vector store...');
    const vectorStoreStartTime = Date.now();
    
    const addToStoreResponse = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        file_id: uploadedFile.id,
      }),
    });

    const vectorStoreTime = Date.now() - vectorStoreStartTime;
    console.log(`✅ Vector store addition completed in ${vectorStoreTime}ms`);

    if (!addToStoreResponse.ok) {
      const errorText = await addToStoreResponse.text();
      console.error('❌ Vector store addition failed:', errorText);
      throw new Error(`Failed to add file to vector store: ${errorText}`);
    }

    const vectorStoreFile = await addToStoreResponse.json();
    console.log('📊 Vector store file details:', {
      id: vectorStoreFile.id,
      status: vectorStoreFile.status,
      created_at: vectorStoreFile.created_at
    });

    const totalTime = Date.now() - startTime;
    console.log(`🎉 Total upload process completed in ${totalTime}ms`);

    return NextResponse.json({
      success: true,
      file: {
        id: uploadedFile.id,
        filename: uploadedFile.filename,
        bytes: uploadedFile.bytes,
        created_at: uploadedFile.created_at,
        vector_store_id: vectorStoreId,
        status: vectorStoreFile.status
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file'
    }, { status: 500 });
  }
} 