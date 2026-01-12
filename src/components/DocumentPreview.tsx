import React from 'react';
import { saveAs } from 'file-saver';
import { MergedDocument } from '../types';

interface DocumentPreviewProps {
  mergedDocuments: MergedDocument[];
  onClear?: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  mergedDocuments,
  onClear,
}) => {
  const handleDownload = async (doc: MergedDocument) => {
    try {
      saveAs(doc.blob, doc.name);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  const handleDownloadAll = async () => {
    for (const doc of mergedDocuments) {
      await handleDownload(doc);
      // Small delay between downloads to avoid browser blocking
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  const handleDownloadAsZip = async () => {
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (const doc of mergedDocuments) {
        zip.file(doc.name, doc.blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'merged-documents.zip');
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Failed to create zip file. Please try again.');
    }
  };

  if (mergedDocuments.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No merged documents yet. Upload files and click "Merge All" to begin.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Merged Documents ({mergedDocuments.length})
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleDownloadAll}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
          >
            Download All
          </button>
          <button
            onClick={handleDownloadAsZip}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
          >
            Download as ZIP
          </button>
          {onClear && (
            <button
              onClick={onClear}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {mergedDocuments.map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <svg
                className="w-6 h-6 text-blue-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700 truncate">
                {doc.name}
              </span>
            </div>
            <button
              onClick={() => handleDownload(doc)}
              className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm flex-shrink-0"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

