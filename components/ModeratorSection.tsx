import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from './Spinner';
import { LockIcon, LogoutIcon, PlayersIcon, NewsIcon, ModeratorIcon, CalendarIcon } from './Icons';
import { Player, TeamNewsItem, PlayerStats, MatchInfo } from '../types';
import * as api from '../services/mockApiService';

// FIX: Made children prop optional to resolve type errors.
const AdminCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children?: React.ReactNode }) => (
    <div className="bg-brand-gray p-6 rounded-lg shadow-xl animate-fade-in-up w-full">
        <div className="flex items-center gap-3 mb-4 border-b-2 border-brand-orange pb-3">
            {icon}
            <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        {children}
    </div>
);

// FIX: Defined a type for component props to help TypeScript with type inference.
type PlayerStatsManagerProps = {
    playerId: string;
    playerName: string;
};

// FIX: Explicitly type the component as React.FC to ensure TypeScript recognizes it as a React component and handles the `key` prop correctly.
const PlayerStatsManager: React.FC<PlayerStatsManagerProps> = ({ playerId, playerName }) => {
    const [seasonStats, setSeasonStats] = useState<PlayerStats[] | null>(null);
    const [allTimeStats, setAllTimeStats] = useState<PlayerStats[] | null>(null);
    const [activeTab, setActiveTab] = useState<'season' | 'allTime'>('season');
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localError, setLocalError] = useState('');
    const [localSuccess, setLocalSuccess] = useState('');

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setLocalError('');
        setLocalSuccess('');
        try {
            const { seasonStats: currentSeasonStats, allTimeStats: currentAllTimeStats } = await api.getPlayerStatsForEditing(playerId);
            setSeasonStats(currentSeasonStats);
            setAllTimeStats(currentAllTimeStats);
        } catch (e: any) {
            setLocalError(e.message);
        } finally {
            setLoading(false);
        }
    }, [playerId]);

    const handleStatChange = (index: number, field: 'label' | 'value', value: string) => {
        const currentStats = activeTab === 'season' ? seasonStats : allTimeStats;
        const setStats = activeTab === 'season' ? setSeasonStats : setAllTimeStats;
        if (currentStats && setStats) {
            const newStats = [...currentStats];
            newStats[index] = { ...newStats[index], [field]: value };
            setStats(newStats);
        }
    };
    
    const handleAddStat = () => {
        const currentStats = activeTab === 'season' ? seasonStats : allTimeStats;
        const setStats = activeTab === 'season' ? setSeasonStats : setAllTimeStats;
        if (currentStats && setStats) {
            setStats([...currentStats, { label: '', value: '' }]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!seasonStats || !allTimeStats) return;

        setIsSubmitting(true);
        setLocalError('');
        setLocalSuccess('');
        try {
            await api.updatePlayerStats(playerId, { seasonStats, allTimeStats });
            setLocalSuccess(`Stats for ${playerName} published successfully!`);
            await fetchStats(); 
        } catch (e: any) {
            setLocalError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
        if (e.currentTarget.open && !seasonStats) {
            fetchStats();
        }
    };

    return (
        <details onToggle={handleToggle} className="bg-brand-dark p-3 rounded-md transition-all duration-300">
            <summary className="font-semibold cursor-pointer select-none">{playerName} ({playerId})</summary>
            <div className="mt-3 border-t border-gray-700 pt-3">
                {loading && <div className="flex justify-center"><Spinner /></div>}
                {localError && <p className="text-red-400 text-sm mb-2">{localError}</p>}
                {(seasonStats && allTimeStats) && (
                    <form className="space-y-2" onSubmit={handleSubmit}>
                        <div className="flex mb-3 border-b border-gray-600">
                             <button 
                                type="button"
                                onClick={() => setActiveTab('season')}
                                className={`px-3 py-1 text-xs font-semibold rounded-t-md transition-colors duration-200 ${activeTab === 'season' ? 'bg-brand-gray/80 text-white' : 'bg-transparent text-gray-400 hover:bg-brand-gray/50'}`}
                            >
                                Current Season
                            </button>
                             <button 
                                type="button"
                                onClick={() => setActiveTab('allTime')}
                                className={`px-3 py-1 text-xs font-semibold rounded-t-md transition-colors duration-200 ${activeTab === 'allTime' ? 'bg-brand-gray/80 text-white' : 'bg-transparent text-gray-400 hover:bg-brand-gray/50'}`}
                            >
                                All Time
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 items-center mb-1">
                            <h4 className="text-xs font-bold text-gray-400 uppercase">Statistic</h4>
                            <h4 className="text-xs font-bold text-gray-400 uppercase sm:mt-0 mt-2">Value</h4>
                        </div>
                        {(activeTab === 'season' ? seasonStats : allTimeStats).map((stat, index) => (
                            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 items-center">
                                <input
                                    value={stat.label}
                                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                                    placeholder="e.g., Tackles"
                                    className="w-full bg-brand-gray p-1 rounded-md text-sm text-white focus:ring-1 focus:ring-brand-red focus:outline-none"
                                />
                                <input
                                    value={stat.value}
                                    onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                                    placeholder="e.g., 95%"
                                    className="w-full bg-brand-gray p-1 rounded-md text-sm text-white focus:ring-1 focus:ring-brand-red focus:outline-none"
                                />
                            </div>
                        ))}
                        
                        <button
                            type="button"
                            onClick={handleAddStat}
                            className="w-full text-sm text-center py-1 text-blue-400 hover:bg-brand-gray rounded-md"
                        >
                            + Add Stat to {activeTab === 'season' ? 'Season' : 'All Time'}
                        </button>
                        
                        {localSuccess && <p className="text-green-400 text-sm mt-2">{localSuccess}</p>}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 mt-3 bg-blue-600 text-white text-sm font-bold py-2 px-3 rounded-md hover:bg-blue-700 disabled:bg-gray-500"
                        >
                            {isSubmitting ? <Spinner /> : 'Publish All Stats'}
                        </button>
                    </form>
                )}
            </div>
        </details>
    );
};


const ModeratorDashboard = ({ onLogout }: { onLogout: () => void }) => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [news, setNews] = useState<TeamNewsItem[]>([]);
    const [upcomingMatches, setUpcomingMatches] = useState<MatchInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const refreshData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [playerList, newsList, matchList] = await Promise.all([
                api.getAllPlayers(),
                api.getTeamNews(),
                api.getUpcomingMatches(),
            ]);
            setPlayers(playerList);
            setNews(newsList);
            setUpcomingMatches(matchList);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const handleAddPlayer = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        const form = e.currentTarget;
        const newPlayer = {
            id: (form.elements.namedItem('playerId') as HTMLInputElement).value,
            name: (form.elements.namedItem('playerName') as HTMLInputElement).value,
            password: (form.elements.namedItem('password') as HTMLInputElement).value,
        };

        if(!newPlayer.id || !newPlayer.name || !newPlayer.password) {
            setError("All fields are required to add a player.");
            return;
        }

        try {
            await api.addNewPlayer(newPlayer);
            setSuccess(`Player ${newPlayer.name} added successfully!`);
            form.reset();
            await refreshData();
        } catch(e: any) {
            setError(e.message);
        }
    };
    
    const handleAddNews = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        const form = e.currentTarget;
        const title = (form.elements.namedItem('newsTitle') as HTMLInputElement).value;
        if (!title) {
            setError("News title cannot be empty.");
            return;
        }
        
        try {
            await api.publishTeamNews(title);
            setSuccess(`News item published!`);
            form.reset();
            await refreshData();
        } catch(e: any) {
             setError(e.message);
        }
    };

    const handleMatchChange = (index: number, field: keyof MatchInfo, value: string) => {
        const updatedMatches = [...upcomingMatches];
        updatedMatches[index] = { ...updatedMatches[index], [field]: value };
        setUpcomingMatches(updatedMatches);
    };

    const handleUpdateMatches = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        try {
            await api.updateUpcomingMatches(upcomingMatches);
            setSuccess('Upcoming matches schedule updated successfully!');
            await refreshData();
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-brand-orange">Moderator Control Panel</h2>
                <button onClick={onLogout} className="flex items-center gap-2 text-gray-300 hover:text-white bg-brand-gray px-3 py-2 rounded-md">
                    <LogoutIcon className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>
            {error && <p className="text-red-400 text-sm bg-red-900/50 p-3 rounded-md">{error}</p>}
            {success && <p className="text-green-400 text-sm bg-green-900/50 p-3 rounded-md">{success}</p>}

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-6">
                    <AdminCard title="Add New Player" icon={<PlayersIcon className="h-6 w-6 text-brand-orange" />}>
                        <form onSubmit={handleAddPlayer} className="space-y-3">
                            <input name="playerId" placeholder="Player ID (e.g., FFC-008)" className="w-full bg-brand-dark border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-brand-red focus:outline-none" />
                            <input name="playerName" placeholder="Player Name" className="w-full bg-brand-dark border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-brand-red focus:outline-none" />
                            <input name="password" type="password" placeholder="Temporary Password" className="w-full bg-brand-dark border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-brand-red focus:outline-none" />
                            <button type="submit" className="w-full bg-brand-red text-white font-bold py-2 px-4 rounded-md hover:bg-red-700">Add Player</button>
                        </form>
                    </AdminCard>
                     <AdminCard title="Publish Team News" icon={<NewsIcon className="h-6 w-6 text-brand-orange" />}>
                        <h4 className="font-semibold mb-2">Current Bulletin:</h4>
                        <ul className="space-y-1 list-disc list-inside text-gray-300 mb-4">
                            {news.map(item => <li key={item.id}>{item.title}</li>)}
                        </ul>
                        <form onSubmit={handleAddNews} className="space-y-3">
                            <input name="newsTitle" placeholder="Enter new announcement..." className="w-full bg-brand-dark border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-brand-red focus:outline-none" />
                            <button type="submit" className="w-full bg-brand-red text-white font-bold py-2 px-4 rounded-md hover:bg-red-700">Publish News</button>
                        </form>
                    </AdminCard>
                     <AdminCard title="Edit Upcoming Matches" icon={<CalendarIcon className="h-6 w-6 text-brand-orange" />}>
                        <form onSubmit={handleUpdateMatches} className="space-y-4">
                            {upcomingMatches.map((match, index) => (
                                <div key={index} className="p-3 bg-brand-dark rounded-md space-y-2 border border-gray-700">
                                    <h4 className="font-semibold text-gray-300">Match {index + 1}</h4>
                                    <div className="space-y-1">
                                        <input value={match.opponent} onChange={(e) => handleMatchChange(index, 'opponent', e.target.value)} placeholder="Opponent" className="w-full bg-brand-gray border-gray-600 rounded-md p-1.5 text-sm text-white focus:ring-1 focus:ring-brand-red focus:outline-none" />
                                        <input value={match.competition} onChange={(e) => handleMatchChange(index, 'competition', e.target.value)} placeholder="Competition" className="w-full bg-brand-gray border-gray-600 rounded-md p-1.5 text-sm text-white focus:ring-1 focus:ring-brand-red focus:outline-none" />
                                        <input value={match.date} onChange={(e) => handleMatchChange(index, 'date', e.target.value)} placeholder="Date (YYYY-MM-DD)" className="w-full bg-brand-gray border-gray-600 rounded-md p-1.5 text-sm text-white focus:ring-1 focus:ring-brand-red focus:outline-none" />
                                        <input value={match.time} onChange={(e) => handleMatchChange(index, 'time', e.target.value)} placeholder="Time" className="w-full bg-brand-gray border-gray-600 rounded-md p-1.5 text-sm text-white focus:ring-1 focus:ring-brand-red focus:outline-none" />
                                        <input value={match.venue} onChange={(e) => handleMatchChange(index, 'venue', e.target.value)} placeholder="Venue" className="w-full bg-brand-gray border-gray-600 rounded-md p-1.5 text-sm text-white focus:ring-1 focus:ring-brand-red focus:outline-none" />
                                        <input value={match.score || ''} onChange={(e) => handleMatchChange(index, 'score', e.target.value)} placeholder="Score (e.g. 2 - 1)" className="w-full bg-brand-gray border-gray-600 rounded-md p-1.5 text-sm text-white focus:ring-1 focus:ring-brand-red focus:outline-none" />
                                    </div>
                                </div>
                            ))}
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">Publish Schedule</button>
                        </form>
                    </AdminCard>
                </div>
                <div className="flex-1">
                    <AdminCard title="Manage Player Stats" icon={<PlayersIcon className="h-6 w-6 text-brand-orange" />}>
                       {loading ? <Spinner /> : (
                            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                               {players.map(player => (
                                    <PlayerStatsManager key={player.id} playerId={player.id} playerName={player.name} />
                               ))}
                            </div>
                       )}
                    </AdminCard>
                </div>
            </div>
        </div>
    );
};

const ModeratorLogin = ({ onLogin }: { onLogin: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const form = e.target as HTMLFormElement;
        const username = (form.elements.namedItem('username') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        
        try {
            await api.loginModerator(username, password);
            onLogin();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-brand-gray p-8 rounded-lg shadow-xl">
                <div className="text-center mb-6">
                    <ModeratorIcon className="h-12 w-12 mx-auto text-brand-orange" />
                    <h2 className="text-3xl font-bold text-brand-orange mt-4">Moderator Login</h2>
                    <p className="text-gray-300 mt-2">Access the admin control panel.</p>
                </div>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="w-full bg-brand-dark border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-brand-red focus:outline-none"
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full bg-brand-dark border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-brand-red focus:outline-none"
                            placeholder="Password"
                        />
                    </div>
                     {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {loading ? <Spinner /> : <LockIcon className="h-5 w-5" />}
                        <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}


const ModeratorSection: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (!isLoggedIn) {
        return <ModeratorLogin onLogin={() => setIsLoggedIn(true)} />;
    }

    return <ModeratorDashboard onLogout={() => setIsLoggedIn(false)} />;
};

export default ModeratorSection;
