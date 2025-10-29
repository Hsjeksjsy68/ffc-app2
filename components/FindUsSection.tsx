import React, { useState, useCallback } from 'react';
import { findPlaces } from '../services/geminiService';
import { MapResult } from '../types';
import { Spinner } from './Spinner';
import { MapPinIcon, LinkIcon } from './Icons';

const FindUsSection: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('Find the official stadium');
  const [result, setResult] = useState<MapResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);

  const handleGetLocation = () => {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        setLoading(false);
      },
      (err) => {
        setError(`Could not get location: ${err.message}`);
        setLoading(false);
      }
    );
  };
  
  const handleSearch = useCallback(async () => {
    if (!prompt.trim() || loading) return;
    if (!location) {
      setError("Please allow location access first.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const mapResult = await findPlaces(prompt, location);
      setResult(mapResult);
    } catch (e: any) {
      setError(`Failed to find places. ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [prompt, loading, location]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-brand-orange">Find Us</h2>
        <p className="text-gray-300 mt-2">Discover locations related to the club using Google Maps.</p>
      </div>

      {!location ? (
        <div className="text-center p-6 bg-brand-gray rounded-lg">
          <p className="mb-4">We need your location to find places near you.</p>
          <button
            onClick={handleGetLocation}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition duration-200 disabled:bg-gray-500"
          >
            {loading ? <Spinner /> : <MapPinIcon className="h-5 w-5" />}
            <span>Allow Location Access</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2 sticky top-20 bg-brand-dark py-2 z-1">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Pubs for fans..."
            className="flex-grow bg-brand-gray border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-brand-red focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition duration-200 disabled:bg-gray-500"
          >
            {loading ? <Spinner /> : <MapPinIcon className="h-5 w-5" />}
            <span>{loading ? 'Finding...' : 'Find'}</span>
          </button>
        </div>
      )}

      {error && <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-md">{error}</div>}
      
      {result && (
        <div className="bg-brand-gray p-6 rounded-lg shadow-xl animate-fade-in-up">
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-brand-orange pb-2">Result</h3>
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.text.replace(/\n/g, '<br />') }} />

          {result.sources && result.sources.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Locations:</h4>
              <ul className="space-y-2">
                {result.sources.map((source, index) => source.maps && (
                  <li key={index} className="flex items-start gap-2">
                    <LinkIcon className="h-5 w-5 text-brand-orange mt-1 flex-shrink-0" />
                    <a href={source.maps.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                      {source.maps.title}
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

export default FindUsSection;