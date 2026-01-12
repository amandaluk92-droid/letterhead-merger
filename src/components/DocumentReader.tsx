import { useState } from 'react';
import * as mammoth from 'mammoth';
import { extractImagesFromHtml, ExtractedImage } from '../utils/imageExtractor';

interface DocumentReaderProps {
  file: File;
  label?: string;
}

export const DocumentReader = ({ file, label = 'Document' }: DocumentReaderProps) => {
  const [extractedText, setExtractedText] = useState<string>('');
  const [extractedImages, setExtractedImages] = useState<ExtractedImage[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readMethod, setReadMethod] = useState<string>('');

  const readDocument = async () => {
    setIsReading(true);
    setError(null);
    setExtractedText('');
    setExtractedImages([]);
    setReadMethod('');
    
    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      
      console.log(`[DOCUMENT READER] Reading ${label}:`, {
        fileName: file.name,
        fileSize: file.size,
        extension: extension
      });
      
      if (extension === 'txt') {
        // Plain text - simplest
        setReadMethod('Plain Text');
        const text = await file.text();
        setExtractedText(text);
        console.log(`[DOCUMENT READER] Plain text extracted:`, {
          length: text.length,
          preview: text.substring(0, 100)
        });
      } else if (extension === 'docx') {
        // Use mammoth
        setReadMethod('Mammoth (DOCX)');
        const arrayBuffer = await file.arrayBuffer();
        
        // Try raw text extraction first
        try {
          const rawResult = await mammoth.extractRawText({ arrayBuffer });
          const rawText = rawResult.value || '';
          console.log(`[DOCUMENT READER] Raw text extracted:`, {
            length: rawText.length,
            preview: rawText.substring(0, 100)
          });
          
          // Also try HTML conversion (this includes images)
          const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
          const html = htmlResult.value;
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          const htmlText = tempDiv.textContent || tempDiv.innerText || '';
          
          // Extract images from HTML
          const images = extractImagesFromHtml(html);
          setExtractedImages(images);
          
          console.log(`[DOCUMENT READER] HTML text extracted:`, {
            length: htmlText.length,
            preview: htmlText.substring(0, 100),
            imageCount: images.length
          });
          
          if (images.length > 0) {
            console.log(`[DOCUMENT READER] Images found:`, images.map(img => ({
              alt: img.alt,
              mimeType: img.mimeType,
              hasData: !!img.base64Data
            })));
          }
          
          // Use whichever has more content
          const finalText = htmlText.length > rawText.length ? htmlText : rawText;
          setExtractedText(finalText || rawText || htmlText);
        } catch (e) {
          throw new Error(`Mammoth extraction failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
      } else if (extension === 'html' || extension === 'htm') {
        // HTML
        setReadMethod('HTML');
        const text = await file.text();
        const div = document.createElement('div');
        div.innerHTML = text;
        const extracted = div.textContent || div.innerText || '';
        setExtractedText(extracted);
        
        // Extract images from HTML
        const images = extractImagesFromHtml(text);
        setExtractedImages(images);
        
        console.log(`[DOCUMENT READER] HTML extracted:`, {
          length: extracted.length,
          preview: extracted.substring(0, 100),
          imageCount: images.length
        });
      } else {
        // Try as text file
        setReadMethod('Generic Text');
        try {
          const text = await file.text();
          setExtractedText(text);
          console.log(`[DOCUMENT READER] Generic text extracted:`, {
            length: text.length,
            preview: text.substring(0, 100)
          });
        } catch (e) {
          throw new Error(`Unsupported file format: ${extension}. Please use .txt, .docx, or .html`);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to read document';
      setError(errorMessage);
      console.error(`[DOCUMENT READER] Error reading ${label}:`, err);
    } finally {
      setIsReading(false);
    }
  };

  const words = extractedText.trim().split(/\s+/).filter(w => w.length > 0);
  const firstWord = words[0] || '';

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">{label} Reader Test</h3>
      <div className="mb-3">
        <p className="text-sm text-gray-600">
          <strong>File:</strong> {file.name} ({Math.round(file.size / 1024)} KB)
        </p>
      </div>
      
      <button
        onClick={readDocument}
        disabled={isReading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isReading ? 'Reading...' : 'Read Document'}
      </button>
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {readMethod && !error && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          ✓ Read using: {readMethod}
        </div>
      )}
      
      {extractedImages.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">
            Extracted Images ({extractedImages.length})
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {extractedImages.map((img, idx) => (
              <div key={idx} className="border rounded p-2">
                <img 
                  src={img.src} 
                  alt={img.alt || `Image ${idx + 1}`} 
                  className="max-w-full h-auto border rounded"
                  style={{ maxHeight: '200px' }}
                />
                <p className="text-xs text-gray-600 mt-1">
                  {img.alt || `Image ${idx + 1}`} 
                  {img.mimeType && ` (${img.mimeType})`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {extractedText && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">
            Extracted Text ({extractedText.length} characters, {words.length} words)
          </h4>
          <div className="bg-gray-50 p-3 rounded border max-h-60 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm">
              {extractedText.substring(0, 1000)}
              {extractedText.length > 1000 && '...'}
            </pre>
          </div>
          {firstWord && (
            <p className="mt-2 text-sm text-gray-600">
              <strong>First word:</strong> "{firstWord}"
            </p>
          )}
          {words.length > 0 && (
            <p className="mt-1 text-sm text-gray-600">
              <strong>Word count:</strong> {words.length} words
            </p>
          )}
        </div>
      )}
    </div>
  );
};
