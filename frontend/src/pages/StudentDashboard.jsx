import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { celebrateTaskCompletion } from '../utils/confetti';
import StressInput from '../components/StressInput';
import TaskCard from '../components/TaskCard';
import TaskInput from '../components/TaskInput';
import ProgressStats from '../components/ProgressStats';
import EmptyState from '../components/EmptyState';
import { SkeletonCard, SkeletonStats } from '../components/Skeleton';
import { Loader2, Zap, BookOpen, AlertTriangle, Plus, BarChart3, ListTodo, UserCircle, Search, Filter } from 'lucide-react';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const { error: showError, success } = useToast();
    const [showProgress, setShowProgress] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [showStressModal, setShowStressModal] = useState(false);
    const [showTaskInput, setShowTaskInput] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSubject, setFilterSubject] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('dueDate');
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
            celebrateTaskCompletion(); // 🎉 Confetti!
            success('Task completed! Great work! 🎉');
            fetchDashboard();
        } catch (error) {
            console.error(error);
            showError('Failed to complete task');
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

    // Filter and sort tasks
    const getFilteredAndSortedTasks = () => {
        if (!data?.tasks) return [];

        let filtered = data.tasks;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply subject filter
        if (filterSubject !== 'all') {
            filtered = filtered.filter(task => task.subject?._id === filterSubject);
        }

        // Apply status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(task => task.status === filterStatus);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'dueDate':
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'priority':
                    return (b.weightage || 0) - (a.weightage || 0);
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        return filtered;
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
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => window.location.href = '/student/profile'}
                            className="bg-academic-100 text-academic-700 px-3 py-1.5 rounded-md text-sm flex items-center gap-1 hover:bg-academic-200 transition-all hover:scale-105"
                        >
                            <UserCircle size={16} />
                            Profile
                        </button>
                        <button
                            onClick={() => window.location.href = '/student/analytics'}
                            className="bg-sage-100 text-sage-700 px-3 py-1.5 rounded-md text-sm flex items-center gap-1 hover:bg-sage-200 transition-all hover:scale-105"
                        >
                            <BarChart3 size={16} />
                            Analytics
                        </button>
                        <button
                            onClick={() => setShowProgress(!showProgress)}
                            className="bg-academic-100 text-academic-700 px-3 py-1.5 rounded-md text-sm flex items-center gap-1 hover:bg-academic-200 transition-all hover:scale-105"
                        >
                            <ListTodo size={16} />
                            Progress
                        </button>
                        <button onClick={logout} className="text-sm text-academic-500 hover:text-red-600 transition-colors">Logout</button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 space-y-6">
                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg border border-academic-200 p-4 space-y-3">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-academic-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-academic-600" />
                            <select
                                value={filterSubject}
                                onChange={(e) => setFilterSubject(e.target.value)}
                                className="px-3 py-1.5 text-sm border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500"
                            >
                                <option value="all">All Subjects</option>
                                {subjects?.map(subject => (
                                    <option key={subject._id} value={subject._id}>{subject.name}</option>
                                ))}
                            </select>
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-1.5 text-sm border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500"
                        >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-1.5 text-sm border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500"
                        >
                            <option value="dueDate">Sort by Due Date</option>
                            <option value="priority">Sort by Priority</option>
                            <option value="title">Sort by Title</option>
                        </select>

                        {(searchQuery || filterSubject !== 'all' || filterStatus !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilterSubject('all');
                                    setFilterStatus('all');
                                }}
                                className="px-3 py-1.5 text-sm text-sage-700 hover:text-sage-900 font-medium"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>


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
                        {getFilteredAndSortedTasks().length > 0 && (
                            <span className="text-sm font-normal text-academic-500">
                                ({getFilteredAndSortedTasks().length} {getFilteredAndSortedTasks().length === 1 ? 'task' : 'tasks'})
                            </span>
                        )}
                    </h2>
                    {getFilteredAndSortedTasks().length === 0 ? (
                        <EmptyState
                            icon={ListTodo}
                            title={searchQuery || filterSubject !== 'all' || filterStatus !== 'all' ? "No Tasks Found" : "No Tasks Yet"}
                            message={searchQuery || filterSubject !== 'all' || filterStatus !== 'all' ? "Try adjusting your filters or search query." : "Start by adding your first task! Track assignments, set deadlines, and let our AI help you prioritize your workload."}
                            actionText={searchQuery || filterSubject !== 'all' || filterStatus !== 'all' ? "Clear Filters" : "Add Your First Task"}
                            onAction={() => {
                                if (searchQuery || filterSubject !== 'all' || filterStatus !== 'all') {
                                    setSearchQuery('');
                                    setFilterSubject('all');
                                    setFilterStatus('all');
                                } else {
                                    setShowTaskInput(true);
                                }
                            }}
                            variant="primary"
                        />
                    ) : (
                        <div className="space-y-3">
                            {getFilteredAndSortedTasks().map(task => (
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
