import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import MessageModal from '../components/MessageModal';
import EmptyState from '../components/EmptyState';
import { SkeletonStudentCard } from '../components/Skeleton';
import { InfoTooltip } from '../components/Tooltip';
import { Loader2, AlertCircle, CheckCircle, HelpCircle, MessageSquare, Users } from 'lucide-react';
import clsx from 'clsx';

const TeacherDashboard = () => {
    const { user, logout } = useAuth();
    const { success } = useToast();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await api.get('/teacher/students');
                setStudents(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const getRiskColor = (level) => {
        switch (level) {
            case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-academic-50">
                <header className="bg-white border-b border-academic-200 sticky top-0 z-10">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-serif font-bold text-academic-900">Rebound Educator</h1>
                            <p className="text-xs text-academic-500">Loading...</p>
                        </div>
                    </div>
                </header>
                <main className="max-w-6xl mx-auto p-4 sm:p-6">
                    <h2 className="text-2xl font-serif font-bold text-academic-800 mb-6">Student Risk Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <SkeletonStudentCard />
                        <SkeletonStudentCard />
                        <SkeletonStudentCard />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-academic-50">
            <header className="bg-white border-b border-academic-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-serif font-bold text-academic-900">Rebound Educator</h1>
                        <p className="text-xs text-academic-500">Instructor Dashboard</p>
                    </div>
                    <button onClick={logout} className="text-sm text-academic-500 hover:text-red-600">Logout</button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-4 sm:p-6">
                <h2 className="text-2xl font-serif font-bold text-academic-800 mb-6">Student Risk Overview</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {students.map(student => (
                        <div key={student._id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-academic-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-academic-900">{student.name}</h3>
                                    <p className="text-sm text-academic-500">{student.email}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className={clsx("px-2 py-1 rounded text-xs font-bold border", getRiskColor(student.riskLevel))}>
                                        {student.riskLevel} Risk
                                    </span>
                                    <InfoTooltip text="Risk calculated from stress levels, missed tasks, and workload backlog" position="left" />
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-academic-700">
                                <div className="flex justify-between border-b border-academic-100 pb-2">
                                    <span>Missed Tasks</span>
                                    <span className={student.missedTasks > 0 ? "text-red-600 font-bold" : ""}>
                                        {student.missedTasks}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-academic-100 pb-2">
                                    <span>Latest Stress Report</span>
                                    <span className="font-medium">
                                        {student.latestStress !== 'N/A' ? `${student.latestStress}/10` : 'No Data'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-academic-100 flex gap-2">
                                <button
                                    onClick={() => setSelectedStudent(student)}
                                    className="flex-1 py-2 bg-sage-50 text-sage-700 rounded hover:bg-sage-100 text-sm font-medium transition-colors flex items-center justify-center gap-1"
                                >
                                    <MessageSquare size={14} />
                                    Message
                                </button>
                                {student.riskLevel === 'High' || student.riskLevel === 'Critical' ? (
                                    <button className="flex-1 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100 text-sm font-medium transition-colors">
                                        Escalate
                                    </button>
                                ) : (
                                    <button className="flex-1 py-2 bg-academic-50 text-academic-600 rounded hover:bg-academic-100 text-sm font-medium transition-colors">
                                        Details
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {selectedStudent && (
                <MessageModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    onSent={() => success('Message sent successfully!')}
                />
            )}
        </div>
    );
};

export default TeacherDashboard;
