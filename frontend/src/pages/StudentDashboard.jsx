import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StressInput from '../components/StressInput';
import TaskCard from '../components/TaskCard';
import TaskInput from '../components/TaskInput';
import ProgressStats from '../components/ProgressStats';
import EmptyState from '../components/EmptyState';
import { SkeletonCard, SkeletonStats } from '../components/Skeleton';
import { Loader2, Zap, BookOpen, AlertTriangle, Plus, BarChart3, ListTodo } from 'lucide-react';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const { error: showError, success } = useToast();
    const [showProgress, setShowProgress] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [showStressModal, setShowStressModal] = useState(false);
    const [showTaskInput, setShowTaskInput] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const fetchDashboard = async () => {
        try {
            const res = await api.get('/student/dashboard');
            setData(res.data);
            if (!res.data.todayLog) {
                setShowStressModal(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleStressSubmit = async (logData) => {
        try {
            const res = await api.post('/student/log', logData);
            setData(prev => ({
                ...prev,
                todayLog: res.data.log,
                recoveryPlan: res.data.recoveryPlan
            }));
            setShowStressModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            await api.put(`/student/task/${taskId}/complete`);
            fetchDashboard();
        } catch (error) {
            console.error(error);
        }
    };

    const handleTaskSaved = () => {
        fetchDashboard();
        setEditingTask(null);
    };

    const handleSubjectAdded = () => {
        fetchDashboard();
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowTaskInput(true);
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await api.delete(`/student/task/${taskId}`);
            fetchDashboard();
        } catch (err) {
            showError('Failed to delete task');
        }
    };

    const handleCloseTaskInput = () => {
        setShowTaskInput(false);
        setEditingTask(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-academic-50">
                <header className="bg-white border-b border-academic-200 sticky top-0 z-10">
                    <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-serif font-bold text-academic-900">Rebound</h1>
                            <p className="text-xs text-academic-500">Loading...</p>
                        </div>
                    </div>
                </header>
                <main className="max-w-4xl mx-auto p-4 space-y-6">
                    <SkeletonStats />
                    <div className="space-y-3">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </main>
            </div>
        );
    }

    const { recoveryPlan, tasks, subjects } = data || {};

    return (
        <div className="min-h-screen bg-academic-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-academic-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-2">
                    <div>
                        <h1 className="text-xl font-serif font-bold text-academic-900">Rebound</h1>
                        <p className="text-xs text-academic-500">Welcome back, {user?.name}</p>
                    </div>
                    <div className="flex gap-2 items-center flex-wrap">
                        <button
                            onClick={() => window.location.href = '/student/analytics'}
                            className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-md text-sm flex items-center gap-1 hover:bg-purple-200 transition-colors"
                        >
                            <BarChart3 size={16} />
                            <span className="hidden sm:inline">Analytics</span>
                        </button>
                        <button
                            onClick={() => setShowTaskInput(true)}
                            className="bg-academic-900 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1 hover:bg-academic-800 transition-colors"
                        >
                            <Plus size={16} />
                            <span className="hidden sm:inline">Add Task</span>
                        </button>
                        <button onClick={logout} className="text-sm text-academic-500 hover:text-red-600">Logout</button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 space-y-6">

                {/* Status Section */}
                {recoveryPlan && (
                    <section className="bg-sage-50 border border-sage-200 p-4 rounded-lg animate-slideUp">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="text-sage-600" size={20} />
                            <h2 className="font-serif font-bold text-sage-800">Recovery Strategy</h2>
                        </div>
                        <p className="text-sm text-sage-900 font-medium mb-1">
                            {recoveryPlan.strategy}
                        </p>
                        <p className="text-xs text-sage-700">
                            Based on your stress level ({data?.todayLog?.stressLevel}/10), we've capped your workload to <strong>{recoveryPlan.allowedHours} hours</strong> for today.
                        </p>
                    </section>
                )}

                {/* Priority Plan */}
                <section>
                    <h2 className="text-xl font-serif font-bold text-academic-800 mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-amber-600" />
                        Today's Focus
                    </h2>

                    {recoveryPlan?.recommendedTasks?.length > 0 ? (
                        <div className="space-y-3">
                            {recoveryPlan.recommendedTasks.map(task => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onComplete={handleCompleteTask}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                    showScore={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-academic-400 bg-white rounded border border-dashed border-academic-300">
                            No urgent tasks for today! Great job.
                        </div>
                    )}
                </section>

                {/* All Tasks / Backlog */}
                <section>
                    <h2 className="text-lg font-serif font-bold text-academic-700 mb-4 mt-8 flex items-center gap-2">
                        <BookOpen size={18} />
                        All Assignments
                    </h2>
                    {tasks?.length === 0 ? (
                        <EmptyState
                            icon={ListTodo}
                            title="No Tasks Yet"
                            message="Start by adding your first task! Track assignments, set deadlines, and let our AI help you prioritize your workload."
                            actionText="Add Your First Task"
                            onAction={() => setShowTaskInput(true)}
                            variant="primary"
                        />
                    ) : (
                        <div className="space-y-3 opacity-80">
                            {tasks?.filter(t => !recoveryPlan?.recommendedTasks?.find(rt => rt._id === t._id)).map(task => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onComplete={handleCompleteTask}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Modals */}
            {showStressModal && (
                <StressInput onSubmit={handleStressSubmit} onClose={() => setShowStressModal(false)} />
            )}

            {showTaskInput && (
                <TaskInput
                    subjects={subjects || []}
                    task={editingTask}
                    onTaskSaved={handleTaskSaved}
                    onSubjectAdded={handleSubjectAdded}
                    onClose={handleCloseTaskInput}
                />
            )}
        </div>
    );
};

export default StudentDashboard;
