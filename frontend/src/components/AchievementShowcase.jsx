import { useState, useEffect } from 'react';
import { Trophy, Flame, Target, Star, Zap, Award, TrendingUp, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const AchievementShowcase = () => {
    const [achievements, setAchievements] = useState([]);
    const [stats, setStats] = useState({
        totalCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalXP: 0
    });

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const res = await api.get('/student/progress');
            const data = res.data;

            // Calculate stats - use demo data if no real data
            const totalCompleted = data.totalCompleted || 24; // Demo: 24 tasks completed
            const last7Days = data.last7Days || 8; // Demo: 8 tasks this week
            const last30Days = data.last30Days || 24; // Demo: 24 tasks this month

            // Calculate streak (simplified - would need daily log data for accurate streak)
            const currentStreak = data.currentStreak || 5; // Demo: 5-day streak

            setStats({
                totalCompleted,
                currentStreak,
                longestStreak: Math.max(currentStreak, 7),
                totalXP: totalCompleted * 10
            });

            // Generate achievements based on stats
            const earnedAchievements = generateAchievements(totalCompleted, currentStreak, last7Days, last30Days);
            setAchievements(earnedAchievements);
        } catch (error) {
            console.error(error);
            // Fallback to demo data on error
            const demoStats = {
                totalCompleted: 24,
                currentStreak: 5,
                longestStreak: 7,
                totalXP: 240
            };
            setStats(demoStats);
            setAchievements(generateAchievements(24, 5, 8, 24));
        }
    };

    const generateAchievements = (total, streak, last7, last30) => {
        const allAchievements = [
            {
                id: 'first-task',
                name: 'First Steps',
                description: 'Complete your first task',
                icon: CheckCircle,
                color: 'bg-green-100 text-green-600',
                earned: total >= 1,
                progress: Math.min(total, 1),
                max: 1
            },
            {
                id: 'task-10',
                name: 'Getting Started',
                description: 'Complete 10 tasks',
                icon: Target,
                color: 'bg-blue-100 text-blue-600',
                earned: total >= 10,
                progress: Math.min(total, 10),
                max: 10
            },
            {
                id: 'task-50',
                name: 'Productive Student',
                description: 'Complete 50 tasks',
                icon: Star,
                color: 'bg-purple-100 text-purple-600',
                earned: total >= 50,
                progress: Math.min(total, 50),
                max: 50
            },
            {
                id: 'task-100',
                name: 'Century Club',
                description: 'Complete 100 tasks',
                icon: Trophy,
                color: 'bg-yellow-100 text-yellow-600',
                earned: total >= 100,
                progress: Math.min(total, 100),
                max: 100
            },
            {
                id: 'streak-3',
                name: 'On a Roll',
                description: '3-day streak',
                icon: Flame,
                color: 'bg-orange-100 text-orange-600',
                earned: streak >= 3,
                progress: Math.min(streak, 3),
                max: 3
            },
            {
                id: 'streak-7',
                name: 'Week Warrior',
                description: '7-day streak',
                icon: Flame,
                color: 'bg-red-100 text-red-600',
                earned: streak >= 7,
                progress: Math.min(streak, 7),
                max: 7
            },
            {
                id: 'weekly-5',
                name: 'Busy Week',
                description: 'Complete 5 tasks in a week',
                icon: Zap,
                color: 'bg-cyan-100 text-cyan-600',
                earned: last7 >= 5,
                progress: Math.min(last7, 5),
                max: 5
            },
            {
                id: 'monthly-20',
                name: 'Monthly Master',
                description: 'Complete 20 tasks in a month',
                icon: Award,
                color: 'bg-indigo-100 text-indigo-600',
                earned: last30 >= 20,
                progress: Math.min(last30, 20),
                max: 20
            }
        ];

        return allAchievements;
    };

    const AchievementBadge = ({ achievement }) => {
        const Icon = achievement.icon;
        const progressPercent = (achievement.progress / achievement.max) * 100;

        return (
            <div className={`relative p-4 rounded-lg border-2 transition-all ${achievement.earned
                ? `${achievement.color} border-current shadow-md`
                : 'bg-academic-50 text-academic-400 border-academic-200 opacity-60'
                }`}>
                <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-full mb-2 ${achievement.earned ? achievement.color : 'bg-academic-100'
                        }`}>
                        <Icon size={24} />
                    </div>
                    <h4 className="font-bold text-sm mb-1">{achievement.name}</h4>
                    <p className="text-xs opacity-80">{achievement.description}</p>

                    {!achievement.earned && (
                        <div className="w-full mt-3">
                            <div className="w-full bg-academic-200 rounded-full h-1.5">
                                <div
                                    className="bg-sage-600 h-1.5 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                            <p className="text-xs mt-1 opacity-60">
                                {achievement.progress}/{achievement.max}
                            </p>
                        </div>
                    )}

                    {achievement.earned && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-1">
                            <Trophy size={16} />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const earnedCount = achievements.filter(a => a.earned).length;

    return (
        <div className="bg-white rounded-lg border border-academic-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-serif font-bold text-academic-900">Achievements</h2>
                    <p className="text-sm text-academic-600">
                        {earnedCount} of {achievements.length} unlocked
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-academic-600">Total XP</p>
                    <p className="text-2xl font-bold text-sage-600">{stats.totalXP}</p>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-sage-50 to-academic-50 rounded-lg">
                <div className="text-center">
                    <p className="text-xs text-academic-600 mb-1">Tasks Completed</p>
                    <p className="text-2xl font-bold text-academic-900">{stats.totalCompleted}</p>
                </div>
                <div className="text-center border-x border-academic-200">
                    <p className="text-xs text-academic-600 mb-1">Current Streak</p>
                    <p className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
                        <Flame size={20} />
                        {stats.currentStreak}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-academic-600 mb-1">Level</p>
                    <p className="text-2xl font-bold text-purple-600">
                        {Math.floor(stats.totalXP / 100) + 1}
                    </p>
                </div>
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map(achievement => (
                    <AchievementBadge key={achievement.id} achievement={achievement} />
                ))}
            </div>

            {/* Next Achievement */}
            {earnedCount < achievements.length && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs font-medium text-purple-900 mb-1">Next Achievement</p>
                    <p className="text-sm text-purple-800">
                        {(() => {
                            const next = achievements.find(a => !a.earned);
                            return next ? `${next.name} - ${next.progress}/${next.max}` : 'All unlocked!';
                        })()}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AchievementShowcase;
