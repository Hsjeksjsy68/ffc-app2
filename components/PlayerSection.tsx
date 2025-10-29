
import React, { useState, useEffect } from 'react';
import { Spinner } from './Spinner';
import { LockIcon, LogoutIcon, StatsIcon, CalendarIcon, NewsIcon, TacticIcon } from './Icons';
import { Player, DashboardData } from '../types';
import { loginPlayer, getPlayerDashboardData } from '../services/mockApiService';

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

const TacticsBoard = () => (
    <div className="relative bg-green-700/50 border-2 border-green-500 rounded-lg p-4 aspect-[4/3] w-full max-w-md mx-auto">
        {/* Field Markings */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white/50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-white/50 rounded-lg"></div>
        <div className="absolute top-1/2 left-0 h-24 w-10 border-t-2 border-b-2 border-r-2 border-white/50 rounded-r-lg -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 h-24 w-10 border-t-2 border-b-2 border-l-2 border-white/50 rounded-l-lg -translate-y-1/2"></div>
        
        {/* Players (4-3-3 Formation) */}
        <div className="absolute w-full h-full text-white text-xs font-bold flex items-center justify-center">
            {/* Goalkeeper */}
            <div className="absolute top-1/2 left-[5%] -translate-y-1/2 w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center">GK</div>
            {/* Defenders */}
            <div className="absolute top-[20%] left-[25%] -translate-y-1/2 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center">RB</div>
            <div className="absolute top-[40%] left-[20%] -translate-y-1/2 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center">CB</div>
            <div className="absolute top-[60%] left-[20%] -translate-y-1/2 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center">CB</div>
            <div className="absolute top-[80%] left-[25%] -translate-y-1/2 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center">LB</div>
            {/* Midfielders */}
            <div className="absolute top-1/2 left-[48%] -translate-y-1/2 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center">CM</div>
            <div className="absolute top-[30%] left-[55%] -translate-y-1/2 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center">CM</div>
            <div className="absolute top-[70%] left-[55%] -translate-y-1/2 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center">CM</div>
            {/* Forwards */}
            <div className="absolute top-[25%] left-[80%] -translate-y-1/2 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center">RW</div>
            <div className="absolute top-1/2 left-[85%] -translate-y-1/2 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center">ST</div>
            <div className="absolute top-[75%] left-[80%] -translate-y-1/2 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center">LW</div>
        </div>
    </div>
);


const DashboardCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children?: React.ReactNode }) => (
    <div className="bg-brand-gray p-6 rounded-lg shadow-xl animate-fade-in-up">
        <div className="flex items-center gap-3 mb-4 border-b-2 border-brand-orange pb-3">
            {icon}
            <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        {children}
    </div>
);

const PlayerDashboard = ({ player, onLogout }: { player: Player; onLogout: () => void }) => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeStatTab, setActiveStatTab] = useState<'season' | 'allTime'>('season');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getPlayerDashboardData(player.id);
                setDashboardData(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [player.id]);


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-brand-orange">Welcome, {player.name}</h2>
                <button onClick={onLogout} className="flex items-center gap-2 text-gray-300 hover:text-white bg-brand-gray px-3 py-2 rounded-md">
                    <LogoutIcon className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>

            {loading && (
                <div className="text-center p-10 bg-brand-gray rounded-lg">
                    <Spinner />
                    <p className="mt-4 text-gray-300">Loading Dashboard...</p>
                </div>
            )}
            
            {error && <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-md">{error}</div>}

            {dashboardData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DashboardCard title="Your Performance Stats" icon={<StatsIcon className="h-6 w-6 text-brand-orange" />}>
                        <div className="flex mb-4 border-b border-gray-700">
                            <button 
                                onClick={() => setActiveStatTab('season')}
                                className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 ${activeStatTab === 'season' ? 'border-b-2 border-brand-orange text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Current Season
                            </button>
                            <button 
                                onClick={() => setActiveStatTab('allTime')}
                                className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 ${activeStatTab === 'allTime' ? 'border-b-2 border-brand-orange text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                All Time
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {(activeStatTab === 'season' ? dashboardData.seasonStats : dashboardData.allTimeStats).map(stat => (
                                <div key={stat.label} className="bg-brand-dark p-3 rounded-md text-center">
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-gray-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>

                    <DashboardCard title="Next Match" icon={<CalendarIcon className="h-6 w-6 text-brand-orange" />}>
                        <div className="space-y-2 text-gray-200">
                            <p className="text-2xl font-bold">vs {dashboardData.nextMatch.opponent}</p>
                            <p>{dashboardData.nextMatch.competition}</p>
                            <p>{formatDateForDisplay(dashboardData.nextMatch.date)} @ {dashboardData.nextMatch.time}</p>
                            <p className="text-sm text-gray-400">{dashboardData.nextMatch.venue}</p>
                        </div>
                    </DashboardCard>
                    
                    <DashboardCard title="Team Bulletin" icon={<NewsIcon className="h-6 w-6 text-brand-orange" />}>
                        <ul className="space-y-2 list-disc list-inside text-gray-300">
                            {dashboardData.teamNews.map(item => <li key={item.id}>{item.title}</li>)}
                        </ul>
                    </DashboardCard>
                    
                    <DashboardCard title="Tactical Briefing: 4-3-3 Attacking" icon={<TacticIcon className="h-6 w-6 text-brand-orange" />}>
                        <TacticsBoard />
                    </DashboardCard>
                </div>
            )}
        </div>
    );
};


const PlayerLogin = ({ onLogin }: { onLogin: (player: Player) => void }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const form = e.target as HTMLFormElement;
        const playerId = (form.elements.namedItem('playerId') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;

        if (!playerId || !password) {
            setError('Player ID and Password are required.');
            setLoading(false);
            return;
        }
        
        try {
            const loggedInPlayer = await loginPlayer(playerId, password);
            onLogin(loggedInPlayer);
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
                    <h2 className="text-3xl font-bold text-brand-orange">Official Player Portal</h2>
                    <p className="text-gray-300 mt-2">Access your dashboard and match info.</p>
                </div>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="playerId">Player ID</label>
                        <input
                            type="text"
                            id="playerId"
                            name="playerId"
                            className="w-full bg-brand-dark border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-brand-red focus:outline-none"
                            placeholder="e.g., FFC-007"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full bg-brand-dark border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-brand-red focus:outline-none"
                            placeholder="••••••••"
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

const PlayerSection: React.FC = () => {
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

    const handleLogin = (player: Player) => {
        setCurrentPlayer(player);
    };
    
    const handleLogout = () => {
        setCurrentPlayer(null);
    };

    if (!currentPlayer) {
        return <PlayerLogin onLogin={handleLogin} />;
    }

    return <PlayerDashboard player={currentPlayer} onLogout={handleLogout} />;
};

export default PlayerSection;