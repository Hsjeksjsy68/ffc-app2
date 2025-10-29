import React, { useState, useCallback } from 'react';
import { generateFanArt } from '../services/geminiService';
import { ImageResult, AspectRatio } from '../types';
import { Spinner } from './Spinner';
import { ArtIcon } from './Icons';

const FanArtGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A phoenix mascot breathing fire over a soccer stadium');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [result, setResult] = useState<ImageResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const imageResult = await generateFanArt(prompt, aspectRatio);
      setResult(imageResult);
    } catch (e: any) {
      setError(`Failed to generate art. ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [prompt, aspectRatio, loading]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-brand-orange">Fan Art Generator</h2>
        <p className="text-gray-300 mt-2">Create unique, AI-powered art for your favorite team.</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the fan art you want to create..."
          rows={3}
          className="w-full bg-brand-gray border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-brand-red focus:outline-none"
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
            className="flex-grow bg-brand-gray border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-brand-red focus:outline-none"
          >
            {Object.values(AspectRatio).map((ratio) => (
              <option key={ratio} value={ratio}>{ratio}</option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition duration-200 disabled:bg-gray-500"
          >
            {loading ? <Spinner /> : <ArtIcon className="h-5 w-5" />}
            <span>{loading ? 'Generating...' : 'Generate Art'}</span>
          </button>
        </div>
      </div>
      
      {error && <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-md">{error}</div>}
      
      {loading && (
         <div className="text-center p-6 bg-brand-gray rounded-lg">
            <Spinner />
            <p className="mt-4 text-gray-300">Creating your masterpiece... this can take a moment.</p>
         </div>
      )}

      {result && (
        <div className="bg-brand-gray p-6 rounded-lg shadow-xl animate-fade-in-up">
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-brand-orange pb-2">Your Creation</h3>
          <img src={result.url} alt={result.prompt} className="w-full max-w-lg mx-auto rounded-md shadow-lg" />
          <p className="text-center text-gray-400 italic mt-4">"{result.prompt}"</p>
        </div>
      )}
    </div>
  );
};

export default FanArtGenerator;