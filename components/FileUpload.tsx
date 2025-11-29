import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { extractTextFromFile } from '../services/fileParser';

interface FileUploadProps {
  onDataReady: (text: string) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataReady, isProcessing }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [textInput, setTextInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = async (file: File) => {
    setError(null);
    try {
      const text = await extractTextFromFile(file);
      if (text.length < 50) throw new Error("The file seems empty or could not be read.");
      onDataReady(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error reading file");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim().length < 50) {
      setError("Please enter enough text to analyze (min 50 chars).");
      return;
    }
    onDataReady(textInput);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-4 text-sm font-medium transition-colors ${
            activeTab === 'upload' ? 'bg-legal-50 text-legal-800 border-b-2 border-legal-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Upload Document
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          className={`flex-1 py-4 text-sm font-medium transition-colors ${
            activeTab === 'paste' ? 'bg-legal-50 text-legal-800 border-b-2 border-legal-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Paste Text
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'upload' ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center transition-all ${
              dragActive ? 'border-legal-500 bg-legal-50' : 'border-slate-300 hover:border-legal-400 hover:bg-slate-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
              disabled={isProcessing}
            />
            <UploadCloud className={`w-12 h-12 mb-4 ${dragActive ? 'text-legal-600' : 'text-slate-400'}`} />
            <p className="text-lg font-medium text-slate-700 mb-2">Drag & drop or click to upload</p>
            <p className="text-sm text-slate-500">Supports PDF, DOCX, TXT</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <textarea
              className="w-full h-64 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-legal-500 focus:border-transparent resize-none font-mono text-sm"
              placeholder="Paste the relevant contract clauses here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isProcessing}
            />
            <button
              onClick={handleTextSubmit}
              disabled={isProcessing || !textInput.trim()}
              className="self-end px-6 py-2 bg-legal-600 text-white rounded-lg hover:bg-legal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Analyze Text
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;