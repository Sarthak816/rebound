import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../utils/api';
import { InfoTooltip } from './Tooltip';

const TaskBreakdown = ({ taskTitle, onSubtasksGenerated }) => {
    const { error: showError } = useToast();
    const [loading, setLoading] = useState(false);
    const [breakdown, setBreakdown] = useState(null);
    const [spiciness, setSpiciness] = useState(2);
    const [showBreakdown, setShowBreakdown] = useState(false);

    const handleBreakdown = async () => {
        setLoading(true);
        try {
            const res = await api.post('/student/task/breakdown', {
                title: taskTitle,
                spiciness
            });
            setBreakdown(res.data);
            setShowBreakdown(true);
            if (onSubtasksGenerated) {
                onSubtasksGenerated(res.data.subtasks, res.data.totalEstimatedTime);
            }
        } catch (error) {
            console.error(error);
            showError('Failed to break down task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={handleBreakdown}
                    disabled={loading || !taskTitle}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-md text-sm hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        <Sparkles size={16} />
                    )}
                    Break Down Task
                </button>

                {breakdown && (
                    <button
                        type="button"
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        className="text-sm text-academic-600 flex items-center gap-1"
                    >
                        {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {showBreakdown ? 'Hide' : 'Show'} Breakdown
                    </button>
                )}
            </div>

            {/* Spiciness Level */}
            <div className="flex items-center gap-3 text-xs">
                <label className="text-academic-600 flex items-center gap-1">
                    Detail Level:
                    <InfoTooltip text="Choose how granular you want the task breakdown: Simple (3-5 steps), Normal (5-8 steps), or Detailed (8-12 steps)" position="right" />
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3].map(level => (
                        <button
                            key={level}
                            type="button"
                            onClick={() => setSpiciness(level)}
                            className={`px-2 py-1 rounded ${spiciness === level
                                ? 'bg-purple-600 text-white'
                                : 'bg-academic-100 text-academic-600 hover:bg-academic-200'
                                }`}
                        >
                            {level === 1 ? 'Simple' : level === 2 ? 'Normal' : 'Detailed'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Breakdown Display */}
            {breakdown && showBreakdown && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-purple-900">
                            Suggested Steps ({breakdown.subtasks.length})
                        </p>
                        <p className="text-xs text-purple-600">
                            Total: ~{Math.round(breakdown.totalEstimatedTime / 60)}h {breakdown.totalEstimatedTime % 60}m
                        </p>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {breakdown.subtasks.map((subtask, idx) => (
                            <div
                                key={idx}
                                className="flex items-start gap-2 p-2 bg-white rounded text-sm"
                            >
                                <span className="text-purple-600 font-medium min-w-[20px]">{idx + 1}.</span>
                                <div className="flex-1">
                                    <p className="text-academic-800">{subtask.title}</p>
                                    <p className="text-xs text-academic-500">~{subtask.estimatedTime} min</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-purple-700 italic">
                        Note: These steps will be saved with your task
                    </p>
                </div>
            )}
        </div>
    );
};

export default TaskBreakdown;
