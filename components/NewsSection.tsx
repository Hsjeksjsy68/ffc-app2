import React, { useState, useCallback } from 'react';
import { getLatestNews } from '../services/geminiService';
import { NewsResult } from '../types';
import { Spinner } from './Spinner';
import { SearchIcon, LinkIcon } from './Icons';
import ClubLeaders from './ClubLeaders';

const NewsSection: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('What was the score of the last match?');
  const [result, setResult] = useState<NewsResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const newsResult = await getLatestNews(prompt);
      setResult(newsResult);
    } catch (e: any) {
      setError(`Failed to fetch news. ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [prompt, loading]);

  return (
    <div className="animate-fade-in space-y-6">
      <ClubLeaders />
      
      <div className="text-center">
        <h2 className="text-3xl font-bold text-brand-orange">Latest News & Info</h2>
        <p className="text-gray-300 mt-2">Get up-to-the-minute news about Flameunter FC, powered by Google Search.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sticky top-20 bg-brand-dark py-2 z-1">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Latest transfer news..."
          className="flex-grow bg-brand-gray border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-brand-red focus:outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {loading ? <Spinner /> : <SearchIcon className="h-5 w-5" />}
          <span>{loading ? 'Searching...' : 'Search'}</span>
        </button>
      </div>
      
      {error && <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-md">{error}</div>}
      
      {result && (
        <div className="bg-brand-gray p-6 rounded-lg shadow-xl animate-fade-in-up">
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-brand-orange pb-2">Result</h3>
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.text.replace(/\n/g, '<br />') }} />

          {result.sources && result.sources.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Sources:</h4>
              <ul className="space-y-2">
                {result.sources.map((source, index) => source.web && (
                  <li key={index} className="flex items-start gap-2">
                    <LinkIcon className="h-5 w-5 text-brand-orange mt-1 flex-shrink-0" />
                    <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                      {source.web.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsSection;