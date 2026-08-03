'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export function XpBar() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  // Define thresholds locally for now to calculate progress
  const LEVEL_THRESHOLDS = [0, 500, 1500, 3000, 5000, 8000, 12000, 20000];

  useEffect(() => {
    if (!user?.id) return;

    const fetchRank = async () => {
      try {
        const { apiClient } = await import('@/lib/api/client');
        const res = await apiClient.get('/gamification/rank');
        if (res.data) {
          setPoints(res.data.points || 0);
          setLevel(res.data.level || 1);
        }
      } catch (err) {
        console.error('Failed to fetch rank for XP bar', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRank();
  }, [user]);

  if (loading || !user) return null;

  const currentLevelMin = LEVEL_THRESHOLDS[level - 1] || 0;
  const currentLevelMax = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  
  // Calculate percentage within the current level
  const progressPercentage = Math.min(
    Math.max(
      ((points - currentLevelMin) / (currentLevelMax - currentLevelMin)) * 100, 
      0
    ), 
    100
  );

  return (
    <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-1.5">
        <div className="bg-yellow-400 rounded-full p-1 shadow-sm">
          <Star className="w-4 h-4 text-yellow-900 fill-current" />
        </div>
        <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{points}</span>
      </div>
      
      <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      
      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
        <span className="text-white text-xs font-bold">{level}</span>
      </div>
    </div>
  );
}
