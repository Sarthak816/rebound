import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../utils/api';

const StressTimeline = () => {
    const [stressData, setStressData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStressData();
    }, []);

    const fetchStressData = async () => {
        try {
            const res = await api.get('/student/progress');
            const stressTrend = res.data.stressTrend || [];

            // If no stress data, generate demo data
            const dataToUse = stressTrend.length > 0 ? stressTrend : generateDemoStressData();

            // Format data for chart
            const formattedData = dataToUse.map(item => ({
                date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                stress: item.stressLevel,
                fullDate: item.date
            }));

            setStressData(formattedData);
        } catch (error) {
            console.error(error);
            // Fallback to demo data on error
            const demoData = generateDemoStressData();
            const formattedData = demoData.map(item => ({
                date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                stress: item.stressLevel,
                fullDate: item.date
            }));
            setStressData(formattedData);
        } finally {
            setLoading(false);
        }
    };

    const generateDemoStressData = () => {
        const now = new Date();
        const demoData = [];

        // Generate stress data for the past 14 days with a realistic pattern
        const baseStress = 5;
        for (let i = 13; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Create a wave pattern with some randomness
            const wave = Math.sin(i / 3) * 2;
            const random = (Math.random() - 0.5) * 1.5;
            const stress = Math.max(1, Math.min(10, baseStress + wave + random));

            demoData.push({
                date: date.toISOString(),
                stressLevel: Math.round(stress * 10) / 10
            });
        }

        return demoData;
    };

    const getAverageStress = () => {
        if (stressData.length === 0) return 0;
        const sum = stressData.reduce((acc, item) => acc + item.stress, 0);
        return (sum / stressData.length).toFixed(1);
    };

    const getTrend = () => {
        if (stressData.length < 2) return 'neutral';
        const recent = stressData.slice(-3);
        const older = stressData.slice(-6, -3);

        if (recent.length === 0 || older.length === 0) return 'neutral';

        const recentAvg = recent.reduce((acc, item) => acc + item.stress, 0) / recent.length;
        const olderAvg = older.reduce((acc, item) => acc + item.stress, 0) / older.length;

        if (recentAvg > olderAvg + 0.5) return 'increasing';
        if (recentAvg < olderAvg - 0.5) return 'decreasing';
        return 'stable';
    };

    const getStressLevel = (avg) => {
        if (avg <= 3) return { label: 'Low', color: 'text-green-600', bg: 'bg-green-50' };
        if (avg <= 6) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50' };
        return { label: 'High', color: 'text-red-600', bg: 'bg-red-50' };
    };

    const avgStress = getAverageStress();
    const trend = getTrend();
    const stressLevel = getStressLevel(avgStress);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-academic-200">
                    <p className="text-xs text-academic-600">{payload[0].payload.date}</p>
                    <p className="text-sm font-bold text-academic-900">
                        Stress: {payload[0].value}/10
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-academic-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-academic-200 rounded w-1/3 mb-4"></div>
                    <div className="h-48 bg-academic-100 rounded"></div>
                </div>
            </div>
        );
    }

    if (stressData.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-academic-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="text-sage-600" size={20} />
                    <h3 className="text-lg font-serif font-bold text-academic-900">Stress Timeline</h3>
                </div>
                <p className="text-sm text-academic-500">No stress data yet. Log your daily stress to see trends!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-academic-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Activity className="text-sage-600" size={20} />
                    <h3 className="text-lg font-serif font-bold text-academic-900">Stress Timeline</h3>
                </div>
                <div className="flex items-center gap-2">
                    {trend === 'increasing' && <TrendingUp className="text-red-600" size={18} />}
                    {trend === 'decreasing' && <TrendingDown className="text-green-600" size={18} />}
                    <span className="text-xs text-academic-600">
                        {trend === 'increasing' ? 'Rising' : trend === 'decreasing' ? 'Improving' : 'Stable'}
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className={`p-3 rounded-lg ${stressLevel.bg}`}>
                    <p className="text-xs text-academic-600 mb-1">Average Stress</p>
                    <p className={`text-2xl font-bold ${stressLevel.color}`}>{avgStress}/10</p>
                    <p className="text-xs text-academic-500 mt-1">{stressLevel.label}</p>
                </div>
                <div className="p-3 rounded-lg bg-academic-50">
                    <p className="text-xs text-academic-600 mb-1">Highest</p>
                    <p className="text-2xl font-bold text-red-600">
                        {Math.max(...stressData.map(d => d.stress))}/10
                    </p>
                    <p className="text-xs text-academic-500 mt-1">Peak stress</p>
                </div>
                <div className="p-3 rounded-lg bg-academic-50">
                    <p className="text-xs text-academic-600 mb-1">Lowest</p>
                    <p className="text-2xl font-bold text-green-600">
                        {Math.min(...stressData.map(d => d.stress))}/10
                    </p>
                    <p className="text-xs text-academic-500 mt-1">Best day</p>
                </div>
            </div>

            {/* Chart */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stressData}>
                        <defs>
                            <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis
                            domain={[0, 10]}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="stress"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            fill="url(#stressGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Insights */}
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs font-medium text-purple-900 mb-1">Insight</p>
                <p className="text-sm text-purple-800">
                    {trend === 'increasing' && 'Your stress has been rising. Consider taking breaks and prioritizing self-care.'}
                    {trend === 'decreasing' && 'Great job! Your stress is trending down. Keep up the good work!'}
                    {trend === 'stable' && `Your stress is stable around ${avgStress}/10. Maintain your current routine.`}
                </p>
            </div>
        </div>
    );
};

export default StressTimeline;
