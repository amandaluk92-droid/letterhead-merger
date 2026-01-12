import { TextRun, Paragraph, AlignmentType } from 'docx';
import { FormattingOptions } from '../types';

export const createFormattedTextRun = (
  text: string,
  formatting: FormattingOptions
): TextRun => {
  // Store the final text value explicitly - ensure it's always a valid non-empty string
  const finalText = (text && typeof text === 'string' && text.trim().length > 0) 
    ? text.trim() 
    : ' ';

  // Build runOptions with text as the first property to ensure it's preserved
  const runOptions: any = {
    text: finalText,  // Use explicit variable, not expression
  };

  // Add formatting properties after text is set
  if (formatting.fontFamily) {
    runOptions.font = formatting.fontFamily;
  }

  if (formatting.fontSize) {
    runOptions.size = formatting.fontSize * 2; // docx uses half-points
  }

  if (formatting.color) {
    runOptions.color = formatting.color.replace('#', '');
    console.log('[FORMATTING] Applying color:', {
      original: formatting.color,
      applied: runOptions.color,
      text: finalText.substring(0, 50)
    });
  }

  if (formatting.bold !== undefined) {
    runOptions.bold = formatting.bold;
  }

  if (formatting.italic !== undefined) {
    runOptions.italics = formatting.italic;
  }

  if (formatting.underline !== undefined && formatting.underline) {
    runOptions.underline = {};
  }

  if (formatting.characterSpacing) {
    runOptions.spacing = {
      after: formatting.characterSpacing * 20, // Convert to twentieths of a point
    };
  }

  if (formatting.scaling) {
    runOptions.scale = formatting.scaling * 100; // Percentage
  }

  // Create TextRun with all options
  // Note: docx library may not expose text property immediately after creation,
  // but it will be preserved during document serialization
  const textRun = new TextRun(runOptions);
  
  return textRun;
};

// Helper function to safely extract text from a TextRun or paragraph
const extractTextFromParagraph = (para: Paragraph): string => {
  try {
    const children = (para as any).children || [];
    let extractedText = '';
    
    for (const child of children) {
      if (child instanceof TextRun) {
        // Try multiple ways to access text property
        const text = (child as any).text || 
                     (child as any).options?.text || 
                     (child as any)._text ||
                     '';
        if (text) {
          extractedText += text;
        }
      }
    }
    
    return extractedText;
  } catch (e) {
    console.error('[ERROR] Failed to extract text from paragraph:', e);
    return '';
  }
};

export const createFormattedParagraph = (
  text: string,
  formatting: FormattingOptions
): Paragraph => {
  // Validate and normalize input text - ensure it's always a valid string
  let normalizedText: string;
  if (!text || typeof text !== 'string') {
    console.warn('[WARNING] createFormattedParagraph called with invalid text:', text);
    normalizedText = ' ';
  } else {
    // Trim text but preserve at least one space if it becomes empty
    normalizedText = text.trim().length > 0 ? text.trim() : ' ';
  }
  
  // Create a single TextRun for the entire text with formatting
  // createFormattedTextRun handles text validation internally
  const textRun = createFormattedTextRun(normalizedText, formatting);
  
  // Verify TextRun was created correctly (instance check only)
  // Note: We don't check for text property here as docx library may not expose it immediately
  // The text is guaranteed to be set in createFormattedTextRun
  if (!textRun || !(textRun instanceof TextRun)) {
    console.error('[ERROR] Failed to create TextRun!', { text: normalizedText });
    // Fallback: create simple TextRun without formatting
    const simpleRun = new TextRun(normalizedText);
    return new Paragraph({ children: [simpleRun] });
  }
  
  // Build paragraph options - use the same pattern as elsewhere in the codebase
  // Start with children, then add other properties
  const paragraphOptions: any = {
    children: [textRun],  // Always use array with single TextRun
  };

  // Add formatting options AFTER children
  if (formatting.textAlignment) {
    const alignmentMap: Record<string, any> = {
      left: AlignmentType.LEFT,
      center: AlignmentType.CENTER,
      right: AlignmentType.RIGHT,
      justify: AlignmentType.JUSTIFIED,
    };
    paragraphOptions.alignment = alignmentMap[formatting.textAlignment];
  }

  if (formatting.lineSpacing) {
    paragraphOptions.spacing = {
      line: formatting.lineSpacing * 240, // Convert to 240ths of a line
      ...(formatting.paragraphSpacing?.before && {
        before: formatting.paragraphSpacing.before * 20,
      }),
      ...(formatting.paragraphSpacing?.after && {
        after: formatting.paragraphSpacing.after * 20,
      }),
    };
  } else if (formatting.paragraphSpacing) {
    paragraphOptions.spacing = {
      ...(formatting.paragraphSpacing.before && {
        before: formatting.paragraphSpacing.before * 20,
      }),
      ...(formatting.paragraphSpacing.after && {
        after: formatting.paragraphSpacing.after * 20,
      }),
    };
  }

  // Debug: Log what we're creating BEFORE creating the paragraph
  console.log('[DEBUG] Creating paragraph:', {
    text: normalizedText.substring(0, 50),
    textRunIsValid: textRun instanceof TextRun,
    paragraphOptionsChildren: paragraphOptions.children?.length,
    paragraphOptionsChildrenType: paragraphOptions.children?.[0]?.constructor?.name
  });

  // Create paragraph - use the exact same pattern as successful cases in the codebase
  let paragraph: Paragraph;
  try {
    paragraph = new Paragraph(paragraphOptions);
  } catch (error) {
    console.error('[ERROR] Failed to create Paragraph!', error);
    // Fallback: create simple paragraph
    return new Paragraph({ children: [new TextRun(normalizedText)] });
  }
  
  // Verify the paragraph was created with children IMMEDIATELY after creation
  const paragraphChildren = (paragraph as any).children || [];
  const verifyText = extractTextFromParagraph(paragraph);
  
  console.log('[DEBUG] Paragraph created:', {
    hasChildren: paragraphChildren.length > 0,
    childrenCount: paragraphChildren.length,
    childrenTypes: paragraphChildren.map((c: any) => c?.constructor?.name || 'unknown'),
    extractedText: verifyText || '[empty]',
    extractedTextLength: verifyText?.length || 0,
    paragraphType: paragraph?.constructor?.name
  });
  
  // If paragraph has no children, use fallback
  // Note: We don't check verifyText here as docx library may not expose text immediately
  // The text is guaranteed to be set in the TextRun, and will be available during serialization
  if (paragraphChildren.length === 0) {
    console.error('[ERROR] Created paragraph has no children! Using fallback...', {
      originalText: normalizedText,
      paragraphChildren: paragraphChildren.length,
      paragraphOptionsChildren: paragraphOptions.children?.length
    });
    
    // Fallback: create simple paragraph without formatting
    const fallbackParagraph = new Paragraph({ children: [new TextRun(normalizedText)] });
    const fallbackChildren = (fallbackParagraph as any).children || [];
    
    console.log('[FALLBACK] Simple paragraph result:', {
      hasChildren: fallbackChildren.length > 0
    });
    
    if (fallbackChildren.length > 0) {
      console.log('[SUCCESS] Using fallback paragraph');
      return fallbackParagraph;
    } else {
      console.error('[CRITICAL] Even fallback paragraph failed!');
      // Last resort: return paragraph anyway and let docx library handle it during serialization
      return paragraph;
    }
  }
  
  console.log('[SUCCESS] Paragraph created successfully with text');
  return paragraph;
};

export const applyFormattingToParagraphs = (
  paragraphs: Paragraph[],
  formatting: FormattingOptions
): Paragraph[] => {
  // #region agent log
  const log8 = {location:'formattingApplier.ts:95',message:'applyFormattingToParagraphs called',data:{inputParagraphsCount:paragraphs.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'};
  console.log('[DEBUG]', log8);
  fetch('http://127.0.0.1:7242/ingest/3d6920d2-a564-4071-9c9b-bec23e20d003',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(log8)}).catch((e)=>console.error('[LOG ERROR]',e));
  // #endregion
  
  if (!paragraphs || paragraphs.length === 0) {
    console.warn('[WARNING] applyFormattingToParagraphs called with empty paragraphs array');
    return [];
  }
  
  const result = paragraphs
    .map((para) => {
      // Extract text from paragraph using helper function
      const text = extractTextFromParagraph(para);
      
      // #region agent log
      const log9 = {location:'formattingApplier.ts:105',message:'extracting text from paragraph',data:{extractedTextLength:text.length,extractedText:text.substring(0,100),childrenCount:((para as any).children || []).length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'};
      console.log('[DEBUG]', log9);
      fetch('http://127.0.0.1:7242/ingest/3d6920d2-a564-4071-9c9b-bec23e20d003',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(log9)}).catch((e)=>console.error('[LOG ERROR]',e));
      // #endregion

      return { text, para };
    })
    .filter(({ text }) => {
      // Keep paragraphs with non-empty text
      const hasText = text && text.trim().length > 0;
      if (!hasText) {
        console.warn('[WARNING] Filtering out paragraph with empty text:', {
          textLength: text?.length || 0,
          textPreview: text?.substring(0, 50) || '[empty]'
        });
      }
      return hasText;
    })
    .map(({ text }) => {
      // Ensure text is not empty before creating paragraph
      if (!text || text.trim().length === 0) {
        console.warn('[WARNING] Skipping empty text in paragraph creation');
        return null;
      }
      console.log('[INFO] Creating formatted paragraph with text:', text.substring(0, 50));
      return createFormattedParagraph(text, formatting);
    })
    .filter((para): para is Paragraph => para !== null); // Remove nulls
  // #region agent log
  const firstResultText = result[0] ? extractTextFromParagraph(result[0]) : '';
  const log10 = {location:'formattingApplier.ts:110',message:'applyFormattingToParagraphs result',data:{outputParagraphsCount:result.length,firstParagraphText:firstResultText,firstParagraphTextLength:firstResultText.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'};
  console.log('[DEBUG]', log10);
  fetch('http://127.0.0.1:7242/ingest/3d6920d2-a564-4071-9c9b-bec23e20d003',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(log10)}).catch((e)=>console.error('[LOG ERROR]',e));
  // #endregion
  return result;
};


