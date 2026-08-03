'use client';

import { useTranslations } from 'next-intl';
import { Trophy, Gamepad2, Target, Award, Star, Crown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function GamesPage() {
    const t = useTranslations();
    const [games, setGames] = useState<any[]>([]);
    const [gameStats, setGameStats] = useState({ completed: 0, points: 0, rank: '-' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await apiClient.get('/games');
                const data = res.data?.data || res.data || [];
                setGames(Array.isArray(data) ? data : []);

                // Fetch player stats if available
                try {
                    const statsRes = await apiClient.get('/games/my-stats');
                    const s = statsRes.data?.data || statsRes.data;
                    if (s) setGameStats({ completed: s.completed || 0, points: s.points || 0, rank: s.rank ? `#${s.rank}` : '-' });
                } catch { /* stats not available yet */ }
            } catch (error) {
                console.error('Error fetching games:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    // We can keep achievements hardcoded or derived from progress later
    const achievements = [
        { title: 'بطل الألعاب', icon: Crown, earned: true, points: 500 },
        { title: 'ماستر الذاكرة', icon: Trophy, earned: true, points: 300 },
        { title: 'خبير الألغاز', icon: Star, earned: false, points: 400 },
        { title: 'نجم الفريق', icon: Award, earned: false, points: 600 },
    ];

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">🎮 الألعاب التعليمية</h1>
                    <p className="text-muted-foreground mt-2">
                        العب وتعلم مع أصدقائك في ألعاب تفاعلية ممتعة
                    </p>
                </div>
                <Link
                    href="/student/leaderboard"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                    🏆 لوحة المتصدرين
                </Link>
            </div>

            {/* Stats Cards — real values from API */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { icon: Gamepad2, label: 'ألعاب مكتملة', value: gameStats.completed, from: 'from-blue-500', to: 'to-blue-600' },
                    { icon: Trophy, label: 'إجمالي النقاط', value: gameStats.points.toLocaleString('ar-SA'), from: 'from-purple-500', to: 'to-purple-600' },
                    { icon: Star, label: 'الجوائز', value: `${achievements.filter(a => a.earned).length}/${achievements.length}`, from: 'from-green-500', to: 'to-green-600' },
                    { icon: Crown, label: 'الترتيب', value: gameStats.rank, from: 'from-orange-500', to: 'to-orange-600' },
                ].map((s, i) => (
                    <div key={i} className={`bg-gradient-to-br ${s.from} ${s.to} text-white p-6 rounded-xl`}>
                        <div className="flex items-center gap-3">
                            <s.icon className="w-8 h-8" />
                            <div>
                                <p className="text-sm opacity-90">{s.label}</p>
                                <p className="text-3xl font-bold">{s.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Games Grid */}
            <div>
                <h2 className="text-2xl font-bold mb-4">الألعاب المتاحة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {games.map((game, idx) => {
                        const icons = [Target, Gamepad2, Star, Award];
                        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500'];
                        const difficulties = ['easy', 'medium', 'hard'];
                        
                        const Icon = game.icon || icons[idx % icons.length];
                        const color = game.color || colors[idx % colors.length];
                        const difficulty = game.difficulty || difficulties[idx % difficulties.length];
                        const players = game.players || game.playerCount || 0;

                        return (
                            <Link
                                key={game.id}
                                href={`/student/games/${game.id}`}
                                className="group"
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all hover:shadow-lg">
                                    <div className={`${color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{game.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {game.description || game.subject?.name || 'لعبة تعليمية ممتعة'}
                                    </p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className={`px-2 py-1 rounded ${difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {difficulty === 'easy' ? 'سهل' : difficulty === 'medium' ? 'متوسط' : 'صعب'}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {players} لاعب
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Achievements */}
            <div>
                <h2 className="text-2xl font-bold mb-4">🏆 الجوائز والإنجازات</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {achievements.map((achievement, idx) => {
                        const Icon = achievement.icon;
                        return (
                            <div
                                key={idx}
                                className={`p-6 rounded-xl border-2 ${achievement.earned
                                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
                                        : 'bg-gray-50 border-gray-200 opacity-60'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`${achievement.earned ? 'bg-yellow-500' : 'bg-gray-300'
                                        } w-12 h-12 rounded-full flex items-center justify-center`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{achievement.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {achievement.points} نقطة
                                        </p>
                                    </div>
                                </div>
                                {achievement.earned && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                        ✓ تم الحصول عليها
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
