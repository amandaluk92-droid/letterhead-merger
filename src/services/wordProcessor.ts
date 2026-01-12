import * as mammoth from 'mammoth';
import { Document, Paragraph, TextRun, Packer } from 'docx';
import { ParsedDocument } from '../types';
import { extractImagesFromHtml } from '../utils/imageExtractor';

export const parseWordDocument = async (file: File): Promise<ParsedDocument> => {
  try {
    // #region agent log
    const log11 = {location:'wordProcessor.ts:5',message:'parseWordDocument called',data:{fileName:file.name,fileSize:file.size},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    console.log('[DEBUG]', log11);
    fetch('http://127.0.0.1:7242/ingest/3d6920d2-a564-4071-9c9b-bec23e20d003',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(log11)}).catch((e)=>console.error('[LOG ERROR]',e));
    // #endregion
    const arrayBuffer = await file.arrayBuffer();
    
    // Try extracting raw text first as a fallback
    let rawTextFallback = '';
    try {
      const rawResult = await mammoth.extractRawText({ arrayBuffer });
      rawTextFallback = rawResult.value || '';
    } catch (e) {
      console.warn('Raw text extraction failed:', e);
    }
    
    // Use mammoth to convert to HTML for easier text extraction
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const html = result.value;
    
    // Extract images from HTML
    const images = extractImagesFromHtml(html);
    console.log('[PARSE] Images extracted:', {
      count: images.length,
      images: images.map(img => ({ alt: img.alt, mimeType: img.mimeType }))
    });
    
    // #region agent log
    const log12 = {location:'wordProcessor.ts:11',message:'after mammoth convertToHtml',data:{htmlLength:html.length,htmlPreview:html.substring(0,300),hasContent:html.trim().length>0,imageCount:images.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    console.log('[DEBUG]', log12);
    fetch('http://127.0.0.1:7242/ingest/3d6920d2-a564-4071-9c9b-bec23e20d003',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(log12)}).catch((e)=>console.error('[LOG ERROR]',e));
    // #endregion
    
    // Extract text from HTML (simple approach)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    let text = tempDiv.textContent || tempDiv.innerText || '';
    
    // If HTML extraction yielded no text, use raw text fallback
    if (text.trim().length === 0 && rawTextFallback.trim().length > 0) {
      text = rawTextFallback;
      // #region agent log
      const log12b = {location:'wordProcessor.ts:20',message:'using raw text fallback',data:{rawTextLength:rawTextFallback.length,rawTextPreview:rawTextFallback.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
      console.log('[DEBUG]', log12b);
      fetch('http://127.0.0.1:7242/ingest/3d6920d2-a564-4071-9c9b-bec23e20d003',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(log12b)}).catch((e)=>console.error('[LOG ERROR]',e));
      // #endregion
    }
    // #region agent log
    const log13 = {location:'wordProcessor.ts:16',message:'after extracting text from HTML',data:{textLength:text.length,textPreview:text.substring(0,200),isEmpty:text.trim().length===0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    console.log('[DEBUG]', log13);
    fetch('http://127.0.0.1:7242/ingest/3d6920d2-a564-4071-9c9b-bec23e20d003',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(log13)}).catch((e)=>console.error('[LOG ERROR]',e));
    // #endregion
    
    // Validate that we have content before proceeding
    if (!text || text.trim().length === 0) {
      console.error('[ERROR] No text extracted from document:', file.name);
      // Return empty structure but don't throw - let caller handle it
      return {
        paragraphs: [],
        sections: [],
        metadata: {
          title: file.name,
        },
      };
    }
    
    // Split into paragraphs - handle both \n and \r\n
    // Keep paragraphs even if they're just whitespace (they might be intentional spacing)
    const paragraphTexts = text.split(/\r?\n+/);
    
    // Filter out only completely empty lines, but keep whitespace-only if they exist
    const nonEmptyParagraphs = paragraphTexts.filter((p) => p.trim().length > 0);
    
    // #region agent log
    const log14 = {location:'wordProcessor.ts:19',message:'after splitting into paragraphs',data:{paragraphTextsCount:nonEmptyParagraphs.length,totalLines:paragraphTexts.length,firstFewParagraphs:nonEmptyParagraphs.slice(0,3).join(' || ')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    console.log('[DEBUG]', log14);
    fetch('http://127.0.0.1:7242/ingest/3d6920d2-a564-4071-9c9b-bec23e20d003',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(log14)}).catch((e)=>console.error('[LOG ERROR]',e));
    // #endregion
    
    // If no paragraphs found, try treating entire text as one paragraph
    if (nonEmptyParagraphs.length === 0 && text.trim().length > 0) {
      console.warn('[WARNING] No paragraphs found from line breaks, using entire text as single paragraph');
      nonEmptyParagraphs.push(text.trim());
    }
    
    // Create docx Paragraph objects from text
    const paragraphs = nonEmptyParagraphs.map(
      (text) => new Paragraph({ children: [new TextRun(text.trim())] })
    );
    
    const firstParaText = paragraphs.length > 0 && ((paragraphs[0] as any).children || []).length > 0
      ? ((paragraphs[0] as any).children[0] instanceof TextRun ? ((paragraphs[0] as any).children[0] as any).text : 'N/A')
      : 'N/A';
    console.log('[PARSE RESULT]', {
      fileName: file.name,
      paragraphCount: paragraphs.length,
      totalTextLength: text.length,
      firstParagraphText: firstParaText
    });
    
    return {
      paragraphs,
      sections: [],
      images: images, // Include extracted images
      metadata: {
        title: file.name,
      },
    };
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3d6920d2-a564-4071-9c9b-bec23e20d003',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'wordProcessor.ts:34',message:'parseWordDocument error',data:{error:error instanceof Error?error.message:'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    throw new Error(`Failed to parse Word document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const extractDocumentContent = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    throw new Error(`Failed to extract document content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const createDocumentFromContent = (
  content: Paragraph[]
): Document => {
  return new Document({
    sections: [
      {
        properties: {},
        children: content,
      },
    ],
  });
};

export const exportDocumentToBlob = async (doc: Document): Promise<Blob> => {
  return await Packer.toBlob(doc);
};


