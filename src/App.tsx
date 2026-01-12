import { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { FormattingPanel } from './components/FormattingPanel';
import { DocumentPreview } from './components/DocumentPreview';
import { ProgressIndicator } from './components/ProgressIndicator';
import { DocumentReader } from './components/DocumentReader';
import { DocumentFile, FormattingOptions, MergedDocument, MergeProgress } from './types';
import { mergeMultipleDocuments, simpleMergeTest } from './services/letterheadMerger';
import { Packer } from 'docx';

function App() {
  const [letterheadFile, setLetterheadFile] = useState<DocumentFile | null>(null);
  const [targetFiles, setTargetFiles] = useState<DocumentFile[]>([]);
  const [formatting, setFormatting] = useState<FormattingOptions>({
    fontFamily: 'Arial',
    fontSize: 12,
    color: '#000000',
    bold: false,
    italic: false,
    underline: false,
    characterSpacing: 0,
    textAlignment: 'left',
    lineSpacing: 1.0,
    paragraphSpacing: { before: 0, after: 0 },
    scaling: 1.0,
  });
  const [mergedDocuments, setMergedDocuments] = useState<MergedDocument[]>([]);
  const [progress, setProgress] = useState<MergeProgress>({
    current: 0,
    total: 0,
    status: 'idle',
  });
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [testMode, setTestMode] = useState(true); // Start in test mode

  const handleLetterheadSelect = useCallback((files: DocumentFile[]) => {
    if (files.length > 0) {
      setLetterheadFile(files[0]);
      setError(null);
    } else {
      setLetterheadFile(null);
    }
  }, []);

  const handleTargetFilesSelect = useCallback((files: DocumentFile[]) => {
    setTargetFiles(files);
    setError(null);
  }, []);

  const handleTargetFileRemove = useCallback((index: number) => {
    setTargetFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleMerge = useCallback(async () => {
    if (!letterheadFile) {
      setError('Please upload a letterhead document first.');
      return;
    }

    if (targetFiles.length === 0) {
      setError('Please upload at least one target document to merge.');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setProgress({
      current: 0,
      total: targetFiles.length,
      status: 'processing',
      message: testMode ? 'Starting simple merge test...' : 'Starting merge process...',
    });

    try {
      let documents;
      
      if (testMode) {
        // Use simple merge test (with formatting if provided)
        console.log('[APP] Using simple merge test mode', {
          formattingProvided: !!formatting
        });
        documents = [];
        for (let i = 0; i < targetFiles.length; i++) {
          setProgress({
            current: i + 1,
            total: targetFiles.length,
            status: 'processing',
            message: `Testing merge ${i + 1} of ${targetFiles.length}...`,
          });
          // Pass formatting to simpleMergeTest so it can apply formatting
          const merged = await simpleMergeTest(letterheadFile.file, targetFiles[i].file, formatting);
          documents.push(merged);
        }
      } else {
        // Use full merge with formatting
        console.log('[APP] Using full merge with formatting');
        documents = await mergeMultipleDocuments(
          letterheadFile.file,
          targetFiles.map((f) => f.file),
          formatting,
          (current, total) => {
            setProgress({
              current,
              total,
              status: 'processing',
              message: `Processing document ${current} of ${total}...`,
            });
          }
        );
      }

      // Convert documents to blobs and create MergedDocument objects
      const merged: MergedDocument[] = [];
      for (let i = 0; i < documents.length; i++) {
        const blob = await Packer.toBlob(documents[i]);
        merged.push({
          name: `merged_${targetFiles[i].name}`,
          blob,
          document: documents[i],
        });
      }

      setMergedDocuments(merged);
      setProgress({
        current: targetFiles.length,
        total: targetFiles.length,
        status: 'completed',
        message: testMode 
          ? 'Simple merge test completed successfully! Switch to normal mode for formatting.' 
          : 'All documents merged successfully!',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during merging.';
      setError(errorMessage);
      setProgress({
        current: 0,
        total: targetFiles.length,
        status: 'error',
        message: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [letterheadFile, targetFiles, formatting, testMode]);

  const handleClearMerged = useCallback(() => {
    setMergedDocuments([]);
    setProgress({
      current: 0,
      total: 0,
      status: 'idle',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Letterhead Merger
              </h1>
              <p className="text-gray-600">
                Merge your company letterhead with multiple Word documents in one go
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg shadow-sm border">
                <input
                  type="checkbox"
                  checked={testMode}
                  onChange={(e) => setTestMode(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-sm font-medium">
                  {testMode ? '🧪 Test Mode' : '✨ Normal Mode'}
                </span>
              </label>
            </div>
          </div>
          
          {testMode && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Test Mode Active:</strong> This mode uses simple text merging without formatting. 
                Use this to verify that documents can be read and merged correctly. Switch to Normal Mode 
                for full formatting options.
              </p>
            </div>
          )}
        </header>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <div className="flex items-center space-x-2">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - File Uploads */}
          <div className="lg:col-span-1 space-y-6">
            <FileUpload
              label="Letterhead Template"
              acceptMultiple={false}
              onFilesSelected={handleLetterheadSelect}
              selectedFiles={letterheadFile ? [letterheadFile] : []}
            />
            
            {testMode && letterheadFile && (
              <DocumentReader file={letterheadFile.file} label="Letterhead" />
            )}

            <FileUpload
              label="Target Documents"
              acceptMultiple={true}
              onFilesSelected={handleTargetFilesSelect}
              selectedFiles={targetFiles}
              onFileRemove={handleTargetFileRemove}
            />
            
            {testMode && targetFiles.length > 0 && (
              <div className="space-y-4">
                {targetFiles.map((file, index) => (
                  <DocumentReader 
                    key={index} 
                    file={file.file} 
                    label={`Target Document ${index + 1}`} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Middle Column - Formatting Panel */}
          <div className="lg:col-span-1">
            <FormattingPanel
              formatting={formatting}
              onFormattingChange={setFormatting}
            />
          </div>

          {/* Right Column - Preview and Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Actions
              </h3>
              <button
                onClick={handleMerge}
                disabled={isProcessing || !letterheadFile || targetFiles.length === 0}
                className={`w-full px-6 py-3 rounded-md font-medium transition-colors ${
                  isProcessing || !letterheadFile || targetFiles.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Merge All Documents'}
              </button>
              {letterheadFile && targetFiles.length > 0 && (
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Ready to merge {targetFiles.length} document{targetFiles.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <ProgressIndicator progress={progress} />
          </div>
        </div>

        {/* Merged Documents Preview */}
        <DocumentPreview
          mergedDocuments={mergedDocuments}
          onClear={handleClearMerged}
        />
      </div>
    </div>
  );
}

export default App;

