import React, { useCallback, useState } from 'react';
import { DocumentFile } from '../types';
import { validateDocxFile, formatFileSize } from '../utils/fileUtils';

interface FileUploadProps {
  label: string;
  acceptMultiple?: boolean;
  onFilesSelected: (files: DocumentFile[]) => void;
  selectedFiles: DocumentFile[];
  onFileRemove?: (index: number) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  acceptMultiple = false,
  onFilesSelected,
  selectedFiles,
  onFileRemove,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setError(null);
      const validFiles: DocumentFile[] = [];
      const invalidFiles: string[] = [];

      Array.from(files).forEach((file) => {
        if (validateDocxFile(file)) {
          validFiles.push({
            file,
            name: file.name,
            size: file.size,
          });
        } else {
          invalidFiles.push(file.name);
        }
      });

      if (invalidFiles.length > 0) {
        setError(`Invalid file(s): ${invalidFiles.join(', ')}. Only .docx files are supported.`);
      }

      if (validFiles.length > 0) {
        if (acceptMultiple) {
          onFilesSelected([...selectedFiles, ...validFiles]);
        } else {
          onFilesSelected(validFiles);
        }
      }
    },
    [acceptMultiple, onFilesSelected, selectedFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
    },
    [handleFileSelect]
  );

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple={acceptMultiple}
          onChange={handleInputChange}
          className="hidden"
          id={`file-upload-${label.toLowerCase().replace(/\s+/g, '-')}`}
        />
        <label
          htmlFor={`file-upload-${label.toLowerCase().replace(/\s+/g, '-')}`}
          className="cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-600">
              {isDragging ? 'Drop files here' : 'Drag and drop files here, or click to select'}
            </p>
            <p className="text-xs text-gray-500 mt-1">.docx files only</p>
            {acceptMultiple && (
              <p className="text-xs text-gray-500">Multiple files allowed</p>
            )}
          </div>
        </label>
      </div>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Selected Files ({selectedFiles.length}):
          </h4>
          <div className="space-y-1">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <svg
                    className="w-5 h-5 text-blue-500 flex-shrink-0"
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
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                </div>
                {onFileRemove && (
                  <button
                    onClick={() => onFileRemove(index)}
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Remove file"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

