'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gamepad2, Trophy, Users, Clock, Loader2, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { motion } from 'framer-motion';

interface GameRoom {
    id: string;
    title: string;
    playerCount: number;
    maxPlayers: number;
    status: string;
    type?: string;
    createdAt: string;
}

interface GameStats {
    totalRooms: number;
    activePlayers: number;
    completedGames: number;
    todaySessions: number;
}

export default function GamesManagementPage() {
    const [rooms, setRooms] = useState<GameRoom[]>([]);
    const [stats, setStats] = useState<GameStats>({ totalRooms: 0, activePlayers: 0, completedGames: 0, todaySessions: 0 });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/million/rooms');
            const data: GameRoom[] = res.data?.data || res.data || [];
            setRooms(data);

            // Compute stats from rooms
            setStats({
                totalRooms: data.length,
                activePlayers: data.filter(r => r.status === 'playing' || r.status === 'waiting')
                    .reduce((s, r) => s + (r.playerCount || 0), 0),
                completedGames: data.filter(r => r.status === 'finished').length,
                todaySessions: data.filter(r => {
                    const created = new Date(r.createdAt);
                    const today = new Date();
                    return created.toDateString() === today.toDateString();
                }).length,
            });
        } catch {
            setRooms([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const statCards = [
        { icon: Gamepad2, title: 'إجمالي الغرف', value: stats.totalRooms, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { icon: Users, title: 'اللاعبون النشطون', value: stats.activePlayers, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { icon: Trophy, title: 'ألعاب مكتملة', value: stats.completedGames, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
        { icon: Clock, title: 'جلسات اليوم', value: stats.todaySessions, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    ];

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">🎮 إدارة الألعاب</h1>
                    <p className="text-muted-foreground mt-1">إدارة الألعاب التعليمية والمسابقات</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="gap-1">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    تحديث
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-8 bg-muted animate-pulse rounded w-16" />
                                ) : (
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Rooms Table */}
            <Card>
                <CardHeader>
                    <CardTitle>غرف المليون النشطة</CardTitle>
                    <CardDescription>قائمة بجميع الغرف الحالية في منصة المليون</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => <div key={i} className="h-14 bg-muted animate-pulse rounded-xl" />)}
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="text-center py-12">
                            <Gamepad2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground">لا توجد غرف نشطة حالياً</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {rooms.map((room, i) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/40 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                                            <Gamepad2 className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{room.title}</h3>
                                            <p className="text-xs text-muted-foreground">
                                                {room.type || 'عام'} · {new Date(room.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {room.playerCount}/{room.maxPlayers || 10}
                                        </div>
                                        <Badge variant={
                                            room.status === 'playing' ? 'default' :
                                            room.status === 'waiting' ? 'secondary' : 'outline'
                                        }>
                                            {room.status === 'playing' ? '🔥 جارٍ' :
                                             room.status === 'waiting' ? '⏳ انتظار' : '✅ منتهي'}
                                        </Badge>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
