import React, { useState, useEffect } from 'react';
import { getUpcomingMatches } from '../services/mockApiService';
import { MatchInfo } from '../types';
import { Spinner } from './Spinner';
import { LogoIcon, CalendarIcon, ClockIcon, MapPinIcon } from './Icons';

const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    // Adjust for timezone when creating date from string to prevent off-by-one day errors.
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + userTimezoneOffset);
    return localDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const MatchCard = ({ match }: { match: MatchInfo }) => {
    const isHome = match.venue.toLowerCase().includes('home');
    
    const matchDate = new Date(match.date);
    // Set hours to the end of the day to ensure today's matches are not considered "past"
    matchDate.setHours(23, 59, 59, 999);
    const today = new Date();
    const hasHappened = matchDate < today;

    return (
        <div className="bg-brand-gray rounded-lg shadow-xl overflow-hidden flex flex-col animate-fade-in-up">
            <div className="p-4 bg-brand-dark/50">
                <p className="text-center font-semibold text-brand-orange">{match.competition}</p>
            </div>
            <div className="flex-grow flex flex-col justify-center p-6 space-y-4">
                <div className="flex items-center justify-around text-center">
                    <div className="flex flex-col items-center gap-2">
                        <LogoIcon className="h-16 w-16" />
                        <span className="font-bold text-lg">Flameunter FC</span>
                    </div>

                    {hasHappened && match.score ? (
                        <span className="text-4xl font-bold text-white mx-4">{match.score}</span>
                    ) : (
                        <span className="text-4xl font-bold text-gray-500 mx-4">VS</span>
                    )}

                    <div className="flex flex-col items-center gap-2">
                        <div className="h-16 w-16 bg-brand-light rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-brand-dark">?</span>
                        </div>
                        <span className="font-bold text-lg">{match.opponent}</span>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-brand-dark/30 border-t border-gray-700 space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span>{formatDateForDisplay(match.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span>{match.time}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span className={`${isHome ? 'font-semibold text-green-400' : 'text-yellow-400'}`}>{match.venue}</span>
                </div>
            </div>
        </div>
    );
};

const ScheduleSection: React.FC = () => {
    const [matches, setMatches] = useState<MatchInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getUpcomingMatches();
                setMatches(data);
            } catch (e: any) {
                setError('Failed to fetch upcoming matches.');
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    return (
        <div className="animate-fade-in space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-brand-orange">Match Schedule</h2>
                <p className="text-gray-300 mt-2">Check out the schedule and results for our recent and upcoming matches.</p>
            </div>

            {loading && (
                <div className="text-center p-10">
                    <Spinner />
                    <p className="mt-4 text-gray-300">Loading schedule...</p>
                </div>
            )}

            {error && <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-md">{error}</div>}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matches.map((match, index) => (
                        <MatchCard key={index} match={match} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScheduleSection;