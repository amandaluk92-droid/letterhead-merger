// Quick test script to check if mammoth can extract from the letterhead file
// This can be run in browser console

async function testLetterheadExtraction(file) {
  console.log('Testing letterhead extraction...');
  console.log('File name:', file.name);
  console.log('File size:', file.size, 'bytes');
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    console.log('ArrayBuffer created:', arrayBuffer.byteLength, 'bytes');
    
    // Test raw text extraction
    console.time('Raw text extraction');
    const mammoth = await import('mammoth');
    const rawResult = await mammoth.extractRawText({ arrayBuffer });
    console.timeEnd('Raw text extraction');
    console.log('Raw text length:', rawResult.value.length);
    console.log('Raw text preview:', rawResult.value.substring(0, 200));
    
    // Test HTML conversion
    console.time('HTML conversion');
    const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
    console.timeEnd('HTML conversion');
    console.log('HTML length:', htmlResult.value.length);
    console.log('HTML preview:', htmlResult.value.substring(0, 500));
    
    // Extract text from HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlResult.value;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    console.log('Extracted text length:', text.length);
    console.log('Extracted text preview:', text.substring(0, 200));
    
    return {
      success: true,
      rawTextLength: rawResult.value.length,
      htmlLength: htmlResult.value.length,
      textLength: text.length
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Usage: In browser console, select the letterhead file and run:
// testLetterheadExtraction(document.querySelector('input[type="file"]').files[0])
