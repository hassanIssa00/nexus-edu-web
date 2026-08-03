'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeaderboardEntry {
    studentId: string;
    rank: number;
    totalPoints: number;
    level: string;
    studentName: string;
    avatar?: string;
    badges: number;
    consistencyIndex: number;
}

export default function LeaderboardPage() {
    const [classLeaderboard, setClassLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [gradeLeaderboard, setGradeLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [schoolLeaderboard, setSchoolLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboards();
    }, []);

    const fetchLeaderboards = async () => {
        try {
            // TODO: Replace with actual API calls
            const mockData: LeaderboardEntry[] = [
                {
                    studentId: '1',
                    rank: 1,
                    totalPoints: 15000,
                    level: 'Elite Student',
                    studentName: 'Ahmed Ali',
                    badges: 6,
                    consistencyIndex: 0.92,
                },
                {
                    studentId: '2',
                    rank: 2,
                    totalPoints: 12500,
                    level: 'Achiever',
                    studentName: 'Sara Mohammed',
                    badges: 5,
                    consistencyIndex: 0.88,
                },
                {
                    studentId: '3',
                    rank: 3,
                    totalPoints: 11000,
                    level: 'Achiever',
                    studentName: 'Omar Hassan',
                    badges: 4,
                    consistencyIndex: 0.85,
                },
            ];

            setClassLeaderboard(mockData);
            setGradeLeaderboard(mockData);
            setSchoolLeaderboard(mockData);
        } catch (error) {
            console.error('Error fetching leaderboards:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return { icon: Crown, color: 'text-yellow-500', emoji: '🥇' };
        if (rank === 2) return { icon: Medal, color: 'text-gray-400', emoji: '🥈' };
        if (rank === 3) return { icon: Trophy, color: 'text-orange-600', emoji: '🥉' };
        return { icon: Award, color: 'text-gray-500', emoji: null };
    };

    const LeaderboardTable = ({ data }: { data: LeaderboardEntry[] }) => (
        <div className="space-y-3">
            {data.map((entry, index) => {
                const { icon: Icon, color, emoji } = getRankIcon(entry.rank);

                return (
                    <motion.div
                        key={entry.studentId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`bg-card border rounded-lg p-4 flex items-center gap-4 ${entry.rank <= 3 ? 'border-primary/50 shadow-lg' : ''
                            }`}
                    >
                        {/* Rank */}
                        <div className="flex-shrink-0 w-16 text-center">
                            {emoji ? (
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl">{emoji}</span>
                                    <span className={`text-lg font-bold ${color}`}>#{entry.rank}</span>
                                </div>
                            ) : (
                                <span className="text-2xl font-bold text-muted-foreground">#{entry.rank}</span>
                            )}
                        </div>

                        {/* Avatar & Name */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{entry.studentName}</h3>
                            <p className="text-sm text-muted-foreground">{entry.level}</p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                    {entry.totalPoints.toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground">Points</div>
                            </div>

                            <div className="text-center">
                                <div className="text-xl font-semibold">{entry.badges}</div>
                                <div className="text-xs text-muted-foreground">Badges</div>
                            </div>

                            <div className="text-center">
                                <div className="text-xl font-semibold">{(entry.consistencyIndex * 100).toFixed(0)}%</div>
                                <div className="text-xs text-muted-foreground">Consistency</div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6 space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
                    Leaderboards
                </h1>
                <p className="text-lg text-muted-foreground">
                    Compete with your classmates and reach the top!
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="class" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="class">Class</TabsTrigger>
                    <TabsTrigger value="grade">Grade</TabsTrigger>
                    <TabsTrigger value="school">School</TabsTrigger>
                    <TabsTrigger value="top50">Top 50</TabsTrigger>
                </TabsList>

                <TabsContent value="class">
                    <div className="bg-card/50 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Class Leaderboard</h2>
                        <LeaderboardTable data={classLeaderboard} />
                    </div>
                </TabsContent>

                <TabsContent value="grade">
                    <div className="bg-card/50 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Grade Leaderboard</h2>
                        <LeaderboardTable data={gradeLeaderboard} />
                    </div>
                </TabsContent>

                <TabsContent value="school">
                    <div className="bg-card/50 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">School Leaderboard</h2>
                        <LeaderboardTable data={schoolLeaderboard} />
                    </div>
                </TabsContent>

                <TabsContent value="top50">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-2 border-yellow-400 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Trophy className="w-8 h-8 text-yellow-600" />
                            <h2 className="text-2xl font-bold">Top 50 Finalists</h2>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">
                            These are the top performers competing for the 1,000,000 SAR prize!
                        </p>
                        <LeaderboardTable data={classLeaderboard} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
