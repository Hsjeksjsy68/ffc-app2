import React, { useState, useCallback, useRef } from 'react';
import { fileToBase64, analyzeMatchPhoto } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { Spinner } from './Spinner';
import { AnalyzeIcon, UploadIcon } from './Icons';

const MatchAnalyzer: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!file || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const imageBase64 = await fileToBase64(file);
      const analysisResult = await analyzeMatchPhoto(prompt, imageBase64, file.type);
      setResult(analysisResult);
    } catch (e: any) {
      setError(`Failed to analyze photo. ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [file, prompt, loading]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-brand-orange">Match Photo Analyzer</h2>
        <p className="text-gray-300 mt-2">Upload a photo from a match and get an AI-powered analysis.</p>
      </div>

      <div className="space-y-4">
        <div
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-brand-red transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          {preview ? (
            <img src={preview} alt="Match preview" className="max-h-60 mx-auto rounded-md" />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <UploadIcon className="h-12 w-12 mb-2" />
              <p>Click to upload an image</p>
              <p className="text-sm">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
        </div>

        {file && (
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Optional: Ask a specific question..."
              className="flex-grow bg-brand-gray border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-brand-red focus:outline-none"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !file}
              className="flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? <Spinner /> : <AnalyzeIcon className="h-5 w-5" />}
              <span>{loading ? 'Analyzing...' : 'Analyze Photo'}</span>
            </button>
          </div>
        )}
      </div>

      {error && <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-md">{error}</div>}
      
      {loading && (
         <div className="text-center p-6 bg-brand-gray rounded-lg">
            <Spinner />
            <p className="mt-4 text-gray-300">Analyzing the action...</p>
         </div>
      )}

      {result && (
        <div className="bg-brand-gray p-6 rounded-lg shadow-xl animate-fade-in-up">
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-brand-orange pb-2">Analysis</h3>
          <p className="text-gray-200 whitespace-pre-wrap">{result.text}</p>
        </div>
      )}
    </div>
  );
};

export default MatchAnalyzer;