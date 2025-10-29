import React, { useState, useEffect } from 'react';
import { getClubLeaders } from '../services/mockApiService';
import { ClubLeadersData } from '../types';
import { Spinner } from './Spinner';
import { GoalIcon, AssistIcon, GAIcon } from './Icons';

const LeaderCard = ({ title, icon, playerName, value }: { title: string, icon: React.ReactNode, playerName: string, value: string }) => (
    <div className="flex-1 bg-brand-gray p-4 rounded-lg shadow-lg flex items-center gap-4">
        <div className="flex-shrink-0 text-brand-orange">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400 uppercase tracking-wider">{title}</p>
            <p className="text-lg font-bold text-white">{playerName}</p>
            <p className="text-2xl font-bold text-brand-orange">{value}</p>
        </div>
    </div>
);


const ClubLeaders: React.FC = () => {
    const [leaders, setLeaders] = useState<ClubLeadersData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getClubLeaders();
                setLeaders(data);
            } catch (e: any) {
                setError("Could not load club leaders.");
            } finally {
                setLoading(false);
            }
        };
        fetchLeaders();
    }, []);

    if (loading) {
        return (
            <div className="mb-6 bg-brand-dark p-6 rounded-lg flex justify-center items-center gap-4">
                <Spinner />
                <p className="text-gray-300">Loading Club Leaders...</p>
            </div>
        );
    }

    if (error) {
        return <div className="mb-6 bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-md">{error}</div>
    }

    return (
        <div className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-white text-center mb-4">Season Leaders</h2>
            <div className="flex flex-col md:flex-row gap-4">
                {leaders && (
                    <>
                        <LeaderCard 
                            title="Top Scorer" 
                            icon={<GoalIcon className="h-10 w-10" />}
                            playerName={leaders.topScorer.name}
                            value={leaders.topScorer.value}
                        />
                         <LeaderCard 
                            title="Top Assister" 
                            icon={<AssistIcon className="h-10 w-10" />}
                            playerName={leaders.topAssister.name}
                            value={leaders.topAssister.value}
                        />
                         <LeaderCard 
                            title="Top G/A" 
                            icon={<GAIcon className="h-10 w-10" />}
                            playerName={leaders.topGA.name}
                            value={leaders.topGA.value}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ClubLeaders;
