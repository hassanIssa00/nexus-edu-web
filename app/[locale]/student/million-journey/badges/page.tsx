'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Award } from 'lucide-react';

interface Badge {
    id: string;
    badgeCode: string;
    badgeName: string;
    badgeNameAr: string;
    description: string;
    descriptionAr: string;
    icon_url?: string;
    colorHex: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    pointsReward: number;
    earned?: boolean;
    earnedAt?: Date;
    progress?: number;
}

export default function BadgesPage() {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            // TODO: Replace with actual API call
            const mockBadges: Badge[] = [
                {
                    id: '1',
                    badgeCode: 'CONSISTENCY_30',
                    badgeName: 'Consistency Champion',
                    badgeNameAr: 'بطل الاستمرارية',
                    description: '30 days login streak',
                    descriptionAr: '30 يوم حضور متواصل',
                    colorHex: '#3B82F6',
                    rarity: 'rare',
                    pointsReward: 200,
                    earned: true,
                    earnedAt: new Date(),
                },
                {
                    id: '2',
                    badgeCode: 'EXCELLENCE_95',
                    badgeName: 'Excellence Badge',
                    badgeNameAr: 'وسام التميز',
                    description: '95%+ average grade',
                    descriptionAr: 'معدل 95% أو أكثر',
                    colorHex: '#10B981',
                    rarity: 'epic',
                    pointsReward: 300,
                    earned: false,
                    progress: 87,
                },
                {
                    id: '3',
                    badgeCode: 'CREATIVITY_5',
                    badgeName: 'Creative Mind',
                    badgeNameAr: 'عقل مبدع',
                    description: 'Complete 5 creative projects',
                    descriptionAr: 'أكمل 5 مشاريع إبداعية',
                    colorHex: '#8B5CF6',
                    rarity: 'rare',
                    pointsReward: 250,
                    earned: false,
                    progress: 60,
                },
            ];

            setBadges(mockBadges);
        } catch (error) {
            console.error('Error fetching badges:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRarityColor = (rarity: string) => {
        const colors = {
            common: 'from-gray-400 to-gray-600',
            rare: 'from-blue-400 to-blue-600',
            epic: 'from-purple-400 to-purple-600',
            legendary: 'from-yellow-400 to-yellow-600',
        };
        return colors[rarity as keyof typeof colors] || colors.common;
    };

    const earnedBadges = badges.filter(b => b.earned);
    const lockedBadges = badges.filter(b => !b.earned);

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
                    Badges Collection
                </h1>
                <p className="text-lg text-muted-foreground">
                    {earnedBadges.length} / {badges.length} Earned
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-card border rounded-lg p-6 text-center">
                    <Trophy className="w-12 h-12 mx-auto mb-2 text-yellow-500" />
                    <h3 className="text-3xl font-bold">{earnedBadges.length}</h3>
                    <p className="text-muted-foreground">Earned</p>
                </div>

                <div className="bg-card border rounded-lg p-6 text-center">
                    <Lock className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                    <h3 className="text-3xl font-bold">{lockedBadges.length}</h3>
                    <p className="text-muted-foreground">Locked</p>
                </div>

                <div className="bg-card border rounded-lg p-6 text-center">
                    <Award className="w-12 h-12 mx-auto mb-2 text-purple-500" />
                    <h3 className="text-3xl font-bold">
                        {earnedBadges.reduce((sum, b) => sum + b.pointsReward, 0)}
                    </h3>
                    <p className="text-muted-foreground">Points Earned</p>
                </div>
            </div>

            {/* Earned Badges */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Earned Badges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {earnedBadges.map((badge, index) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className={`bg-gradient-to-br ${getRarityColor(badge.rarity)} p-1 rounded-xl`}>
                                <div className="bg-card rounded-lg p-6 h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                            <Trophy className="w-8 h-8 text-white" />
                                        </div>
                                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary text-primary-foreground">
                                            +{badge.pointsReward} pts
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-lg mb-2">{badge.badgeName}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {badge.description}
                                    </p>

                                    <div className="text-xs text-muted-foreground">
                                        Earned: {badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Locked Badges */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Locked Badges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lockedBadges.map((badge, index) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-card border rounded-lg p-6 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-gray-800/10 backdrop-blur-sm" />

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center opacity-50">
                                        <Lock className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-700 text-gray-300">
                                        +{badge.pointsReward} pts
                                    </span>
                                </div>

                                <h3 className="font-bold text-lg mb-2 opacity-70">{badge.badgeName}</h3>
                                <p className="text-sm text-muted-foreground mb-4 opacity-50">
                                    {badge.description}
                                </p>

                                {badge.progress !== undefined && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-semibold">{badge.progress}%</span>
                                        </div>
                                        <div className="w-full bg-secondary rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${badge.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
