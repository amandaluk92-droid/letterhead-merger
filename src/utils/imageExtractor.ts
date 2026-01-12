/**
 * Utility functions for extracting images from DOCX files
 */

export interface ExtractedImage {
  src: string; // base64 data URI
  alt?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  base64Data?: string; // Just the base64 part without data URI prefix
}

/**
 * Extract images from Mammoth HTML output
 */
export const extractImagesFromHtml = (html: string): ExtractedImage[] => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  const images: ExtractedImage[] = [];
  const imgElements = tempDiv.querySelectorAll('img');
  
  imgElements.forEach((img, index) => {
    const src = img.getAttribute('src') || '';
    
    if (src.startsWith('data:image/')) {
      // Extract base64 data and mime type
      const match = src.match(/data:image\/(\w+);base64,(.+)/);
      if (match) {
        const [, mimeType, base64Data] = match;
        const width = img.width || img.getAttribute('width') ? parseInt(img.getAttribute('width') || '0') : undefined;
        const height = img.height || img.getAttribute('height') ? parseInt(img.getAttribute('height') || '0') : undefined;
        
        images.push({
          src: src,
          alt: img.getAttribute('alt') || `Image ${index + 1}`,
          width: width || undefined,
          height: height || undefined,
          mimeType: mimeType,
          base64Data: base64Data
        });
      }
    }
  });
  
  return images;
};

/**
 * Convert base64 string to Uint8Array (for docx ImageRun)
 */
export const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Get image dimensions from base64 (optional, for better sizing)
 */
export const getImageDimensions = (base64Data: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      // Default dimensions if we can't load
      resolve({ width: 200, height: 200 });
    };
    img.src = `data:image/png;base64,${base64Data}`;
  });
};
