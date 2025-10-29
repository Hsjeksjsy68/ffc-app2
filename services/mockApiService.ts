import { Player, DashboardData, TeamNewsItem, PlayerStats, ClubLeadersData, MatchInfo } from '../types';

// --- MOCK DATABASE --- //
// Using `let` to allow the data to be mutated by moderator actions.

let mockUsers = [
    { id: '1002022', password: 'abdurrakib10s2022', name: 'Abdur Rakib' },
    { id: '4002022', password: 'razzakc2022', name: 'Abdur Razzak' },
    { id: '6902024', password: 'raiyanjrc2024', name: 'Raiyan JR' },
    { id: '9002023', password: 'raiyanaminc2023', name: 'Raiyan Amin' },
    { id: '8002023', password: 'samiahmedc2023', name: 'Sami Ahmed' },
    { id: '5002025', password: 'sahilc2025', name: 'Sahil' },
    { id: '3002023', password: 'atifshahilc2023', name: 'Atif Shahil' },
    { id: '6002023', password: 'tanvirc2023', name: 'Tanvir' },
    { id: '1902024', password: 'rafic2024', name: 'Rafi' },
    { id: '2002024', password: 'abidc2024', name: 'Abid' }
];

const defaultSeasonStats: PlayerStats[] = [
    { label: 'Matches Played', value: '0' },
    { label: 'Goals', value: '0' },
    { label: 'Assists', value: '0' },
    { label: 'G/A', value: '0' },
    { label: 'Shots on Target', value: '0' },
    { label: 'Pass Accuracy', value: '0%' },
    { label: 'Tackles Won', value: '0' },
    { label: 'Rating', value: 'N/A' },
];

const defaultAllTimeStats: PlayerStats[] = [
    { label: 'Appearances', value: '0' },
    { label: 'Goals', value: '0' },
    { label: 'Assists', value: '0' },
    { label: 'Trophies', value: '0' },
];

let mockPlayerData: { [key: string]: { seasonStats: PlayerStats[], allTimeStats: PlayerStats[] } } = {};
mockUsers.forEach(user => {
    mockPlayerData[user.id] = {
        seasonStats: JSON.parse(JSON.stringify(defaultSeasonStats)),
        allTimeStats: JSON.parse(JSON.stringify(defaultAllTimeStats))
    };
});

// Add some sample data for the leaders board
mockPlayerData['1002022'].seasonStats = [
    { label: 'Matches Played', value: '5' },
    { label: 'Goals', value: '4' },
    { label: 'Assists', value: '2' },
    { label: 'G/A', value: '6' },
    { label: 'Shots on Target', value: '8' },
    { label: 'Pass Accuracy', value: '85%' },
    { label: 'Tackles Won', value: '10' },
    { label: 'Rating', value: '8.1' },
];

mockPlayerData['4002022'].seasonStats = [
    { label: 'Matches Played', value: '5' },
    { label: 'Goals', value: '1' },
    { label: 'Assists', value: '5' },
    { label: 'G/A', value: '6' },
    { label: 'Shots on Target', value: '3' },
    { label: 'Pass Accuracy', value: '92%' },
    { label: 'Tackles Won', value: '15' },
    { label: 'Rating', value: '7.8' },
];

mockPlayerData['6902024'].seasonStats = [
    { label: 'Matches Played', value: '4' },
    { label: 'Goals', value: '3' },
    { label: 'Assists', value: '3' },
    { label: 'G/A', value: '6' },
    { label: 'Shots on Target', value: '5' },
    { label: 'Pass Accuracy', value: '88%' },
    { label: 'Tackles Won', value: '7' },
    { label: 'Rating', value: '7.9' },
];


let mockUpcomingMatches: MatchInfo[] = [
    {
        opponent: 'Rival FC',
        competition: 'Premier League',
        date: '2024-08-28',
        time: '15:00 GMT',
        venue: 'Flameunter Stadium (Home)',
        score: '3 - 1'
    },
    {
        opponent: 'Oceanic Wanderers',
        competition: 'FA Cup - 3rd Round',
        date: '2024-09-01',
        time: '19:45 GMT',
        venue: 'The Coral Arena (Away)',
        score: '2 - 2'
    },
    {
        opponent: 'Mountain Giants',
        competition: 'Premier League',
        date: '2024-09-05',
        time: '16:30 GMT',
        venue: 'The Summit Ground (Away)'
    },
    {
        opponent: 'City United',
        competition: 'Premier League',
        date: '2024-09-11',
        time: '15:00 GMT',
        venue: 'Flameunter Stadium (Home)'
    }
];

let mockTeamNews: TeamNewsItem[] = [
    { id: 1, title: 'Training session moved to 11 AM tomorrow.' },
    { id: 2, title: 'Pre-match press conference at 2 PM on Friday.' },
    { id: 3, title: 'Physio report available in the medical room.' },
];


// --- MOCK API FUNCTIONS --- //

// --- Player-Facing Functions --- //

export const loginPlayer = (playerId: string, password: string): Promise<Player> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = mockUsers.find(p => p.id === playerId && p.password === password);
            if (user) {
                const { password, ...playerData } = user;
                resolve(playerData);
            } else {
                reject(new Error('Invalid Player ID or Password.'));
            }
        }, 1000);
    });
};

export const getPlayerDashboardData = (playerId: string): Promise<DashboardData> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            const playerData = mockPlayerData[playerId];
            if (playerData) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const nextFixture = mockUpcomingMatches.find(match => {
                    const matchDate = new Date(match.date);
                    // Adjust for timezone when creating date from string
                    const userTimezoneOffset = matchDate.getTimezoneOffset() * 60000;
                    const localMatchDate = new Date(matchDate.getTime() + userTimezoneOffset);
                    return localMatchDate >= today;
                }) || mockUpcomingMatches[mockUpcomingMatches.length - 1];

                resolve({
                    ...playerData,
                    nextMatch: nextFixture,
                    teamNews: mockTeamNews,
                });
            } else {
                reject(new Error('Could not find data for the specified player.'));
            }
        }, 1200);
     });
};


// --- Moderator-Facing Functions --- //

export const loginModerator = (username: string, pass: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === '111' && pass === '111') {
                resolve(true);
            } else {
                reject(new Error('Invalid moderator credentials.'));
            }
        }, 500);
    });
};

export const getAllPlayers = (): Promise<Player[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockUsers.map(({ password, ...player }) => player));
        }, 500);
    });
};

export const getTeamNews = (): Promise<TeamNewsItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockTeamNews);
        }, 500);
    });
};

export const addNewPlayer = (player: { id: string; name: string; password?: string; }): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (mockUsers.some(u => u.id === player.id)) {
                return reject(new Error(`Player with ID ${player.id} already exists.`));
            }
            mockUsers.push({
                id: player.id,
                name: player.name,
                password: player.password || 'defaultpass',
            });
            // Add default stats for the new player
            mockPlayerData[player.id] = {
                seasonStats: JSON.parse(JSON.stringify(defaultSeasonStats)),
                allTimeStats: JSON.parse(JSON.stringify(defaultAllTimeStats))
            };
            resolve();
        }, 700);
    });
};

export const getPlayerStatsForEditing = (playerId: string): Promise<{ seasonStats: PlayerStats[], allTimeStats: PlayerStats[] }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const playerData = mockPlayerData[playerId];
            if (playerData) {
                resolve({
                    seasonStats: JSON.parse(JSON.stringify(playerData.seasonStats)),
                    allTimeStats: JSON.parse(JSON.stringify(playerData.allTimeStats))
                });
            } else {
                reject(new Error(`Could not find stats for player ${playerId}.`));
            }
        }, 600);
    });
};

export const updatePlayerStats = (playerId: string, newStats: { seasonStats: PlayerStats[], allTimeStats: PlayerStats[] }): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!mockPlayerData[playerId]) {
                return reject(new Error(`Player with ID ${playerId} not found.`));
            }
            mockPlayerData[playerId].seasonStats = newStats.seasonStats.filter(s => s.label.trim() && s.value.trim());
            mockPlayerData[playerId].allTimeStats = newStats.allTimeStats.filter(s => s.label.trim() && s.value.trim());
            resolve();
        }, 700);
    });
};

export const publishTeamNews = (title: string): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newId = mockTeamNews.length > 0 ? Math.max(...mockTeamNews.map(n => n.id)) + 1 : 1;
            mockTeamNews.push({ id: newId, title });
            resolve();
        }, 700);
    });
};

export const updateUpcomingMatches = (matches: MatchInfo[]): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            mockUpcomingMatches = matches;
            resolve();
        }, 700);
    });
};

// --- Fan-Facing Functions --- //
export const getUpcomingMatches = (): Promise<MatchInfo[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockUpcomingMatches);
        }, 800);
    });
};

export const getClubLeaders = (): Promise<ClubLeadersData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let topScorer = { name: 'N/A', value: '0' };
            let topAssister = { name: 'N/A', value: '0' };
            let topGA = { name: 'N/A', value: '0' };

            let maxGoals = -1;
            let maxAssists = -1;
            let maxGA = -1;

            mockUsers.forEach(user => {
                const stats = mockPlayerData[user.id]?.seasonStats;
                if (stats) {
                    const goalsStat = stats.find(s => s.label === 'Goals');
                    const assistsStat = stats.find(s => s.label === 'Assists');
                    const gaStat = stats.find(s => s.label === 'G/A');

                    const goals = goalsStat ? parseInt(goalsStat.value, 10) : 0;
                    if (goals > maxGoals) {
                        maxGoals = goals;
                        topScorer = { name: user.name, value: goalsStat?.value || '0' };
                    }

                    const assists = assistsStat ? parseInt(assistsStat.value, 10) : 0;
                    if (assists > maxAssists) {
                        maxAssists = assists;
                        topAssister = { name: user.name, value: assistsStat?.value || '0' };
                    }

                    const ga = gaStat ? parseInt(gaStat.value, 10) : 0;
                    if (ga > maxGA) {
                        maxGA = ga;
                        topGA = { name: user.name, value: gaStat?.value || '0' };
                    }
                }
            });

            resolve({ topScorer, topAssister, topGA });
        }, 800);
    });
};
