'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMillionSocket } from '@/hooks/useMillionSocket';
import { QuestionCard } from '../../components/QuestionCard';
import { Leaderboard } from '../../components/Leaderboard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Play, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MillionRoomPage() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId as string;

    const {
        connected,
        startRound,
        submitAnswer,
        onRoomJoined,
        onRoundStarted,
        onQuestionSent,
        onQuestionResult,
        onLeaderboardUpdated,
        onRoundFinished,
    } = useMillionSocket(roomId);

    const [room, setRoom] = useState<any>(null);
    const [participants, setParticipants] = useState<any[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [isRoundActive, setIsRoundActive] = useState(false);
    const [roundFinished, setRoundFinished] = useState(false);
    const [winner, setWinner] = useState<any>(null);

    // Listen to events
    useEffect(() => {
        if (!connected) return;

        const cleanups = [
            onRoomJoined?.((data) => {
                console.log('Player joined:', data);
                // Update participants
            }),

            onRoundStarted?.((data) => {
                console.log('Round started:', data);
                setIsRoundActive(true);
                setRoundFinished(false);
                setCurrentQuestion(null);
            }),

            onQuestionSent?.((data) => {
                console.log('Question received:', data);
                setCurrentQuestion(data);
            }),

            onQuestionResult?.((data) => {
                console.log('Question result:', data);
                // Show result animation
                setTimeout(() => {
                    setCurrentQuestion(null);
                }, 2000);
            }),

            onLeaderboardUpdated?.((data) => {
                console.log('Leaderboard updated:', data);
                setLeaderboard(data.leaderboard);
            }),

            onRoundFinished?.((data) => {
                console.log('Round finished:', data);
                setIsRoundActive(false);
                setRoundFinished(true);
                setWinner(data.winner);
                setLeaderboard(data.finalLeaderboard);
            }),
        ];

        return () => {
            cleanups.forEach(cleanup => cleanup?.());
        };
    }, [connected]);

    const handleStartRound = async () => {
        try {
            await startRound(roomId);
        } catch (error: any) {
            console.error('Failed to start round:', error);
            alert(error.message);
        }
    };

    const handleSubmitAnswer = async (chosenIndex: number, timeTaken: number) => {
        if (!currentQuestion) return;

        try {
            await submitAnswer({
                roomId,
                questionId: currentQuestion.question.id,
                chosenIndex,
                timeTaken,
            });
        } catch (error: any) {
            console.error('Failed to submit answer:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8" dir="rtl">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/student/million')}
                        className="gap-2"
                    >
                        <ArrowRight className="w-5 h-5" />
                        العودة للقائمة
                    </Button>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow">
                            <Users className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">{participants.length} لاعب</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Question */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {!isRoundActive && !roundFinished && (
                                <motion.div
                                    key="waiting"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center"
                                    dir="rtl"
                                >
                                    <Play className="w-24 h-24 text-blue-600 mx-auto mb-6" />
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                        في انتظار بدء الجولة...
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                                        سيبدأ المضيف الجولة قريباً
                                    </p>
                                    {/* Host can start round */}
                                    <Button
                                        onClick={handleStartRound}
                                        size="lg"
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-xl px-8 py-6"
                                    >
                                        <Play className="w-6 h-6 ml-2" />
                                        بدء الجولة
                                    </Button>
                                </motion.div>
                            )}

                            {isRoundActive && currentQuestion && (
                                <QuestionCard
                                    key={currentQuestion.question.id}
                                    question={currentQuestion.question}
                                    timeLimit={currentQuestion.timeLimit}
                                    onSubmit={handleSubmitAnswer}
                                />
                            )}

                            {roundFinished && winner && (
                                <motion.div
                                    key="finished"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center"
                                    dir="rtl"
                                >
                                    <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-6" />
                                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                        انتهت الجولة! 🎉
                                    </h2>
                                    <p className="text-2xl text-gray-700 dark:text-gray-300 mb-2">
                                        الفائز: <span className="font-bold text-blue-600">{winner.name}</span>
                                    </p>
                                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                                        {winner.totalPoints} نقطة
                                    </p>
                                    <Button
                                        onClick={handleStartRound}
                                        size="lg"
                                        className="bg-gradient-to-r from-purple-500 to-blue-600"
                                    >
                                        جولة جديدة
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column - Leaderboard */}
                    <div>
                        <Leaderboard
                            entries={leaderboard}
                            currentUserId="current-user-id" // Get from auth
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
