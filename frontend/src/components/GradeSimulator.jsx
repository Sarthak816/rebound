import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import api from '../utils/api';

const GradeSimulator = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [simulatedGrade, setSimulatedGrade] = useState(85);
    const [currentGrade, setCurrentGrade] = useState(75); // Demo: current grade is 75%

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/student/dashboard');
            const apiTasks = res.data.tasks || [];
            const pendingTasks = apiTasks.filter(t => t.status === 'Pending');

            // If no pending tasks, use demo data
            if (pendingTasks.length === 0) {
                const demoTasks = generateDemoTasks();
                setTasks(demoTasks);
                setSelectedTask(demoTasks[0]);
            } else {
                setTasks(pendingTasks);
                setSelectedTask(pendingTasks[0]);
            }
        } catch (error) {
            console.error(error);
            // Fallback to demo data on error
            const demoTasks = generateDemoTasks();
            setTasks(demoTasks);
            setSelectedTask(demoTasks[0]);
        }
    };

    const generateDemoTasks = () => {
        const now = new Date();
        return [
            {
                _id: 'demo-1',
                title: 'Final Project Submission',
                weightage: 30,
                dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Pending'
            },
            {
                _id: 'demo-2',
                title: 'Midterm Exam',
                weightage: 25,
                dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Pending'
            },
            {
                _id: 'demo-3',
                title: 'Weekly Quiz',
                weightage: 10,
                dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Pending'
            },
            {
                _id: 'demo-4',
                title: 'Lab Report',
                weightage: 15,
                dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Pending'
            }
        ];
    };

    const calculateImpact = () => {
        if (!selectedTask) return { finalGrade: 0, impact: 0, change: 0 };

        const taskWeight = selectedTask.weightage || 10;
        const contribution = (simulatedGrade / 100) * taskWeight;

        // Simplified calculation: assume current grade is based on completed tasks
        const totalWeight = 100;
        const remainingWeight = totalWeight - taskWeight;
        const currentContribution = (currentGrade / 100) * remainingWeight;

        const finalGrade = ((contribution + currentContribution) / totalWeight) * 100;
        const impact = finalGrade - currentGrade;

        return {
            finalGrade: finalGrade.toFixed(1),
            impact: impact.toFixed(1),
            change: impact > 0 ? 'increase' : impact < 0 ? 'decrease' : 'neutral'
        };
    };

    const result = calculateImpact();

    const getGradeColor = (grade) => {
        if (grade >= 90) return 'text-green-600';
        if (grade >= 80) return 'text-blue-600';
        if (grade >= 70) return 'text-yellow-600';
        if (grade >= 60) return 'text-orange-600';
        return 'text-red-600';
    };

    const getGradeLetter = (grade) => {
        if (grade >= 90) return 'A';
        if (grade >= 80) return 'B';
        if (grade >= 70) return 'C';
        if (grade >= 60) return 'D';
        return 'F';
    };

    const getChangeIcon = () => {
        if (result.change === 'increase') return <TrendingUp className="text-green-600" size={20} />;
        if (result.change === 'decrease') return <TrendingDown className="text-red-600" size={20} />;
        return <Minus className="text-academic-400" size={20} />;
    };

    if (tasks.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-academic-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Calculator className="text-sage-600" size={20} />
                    <h3 className="text-lg font-serif font-bold text-academic-900">Grade Impact Simulator</h3>
                </div>
                <p className="text-sm text-academic-500">No pending tasks to simulate</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-academic-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Calculator className="text-sage-600" size={20} />
                <h3 className="text-lg font-serif font-bold text-academic-900">Grade Impact Simulator</h3>
            </div>

            {/* Current Grade Input */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-academic-700 mb-2">
                    Current Course Grade
                </label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentGrade}
                    onChange={(e) => setCurrentGrade(Number(e.target.value))}
                    className="w-full p-2 border border-academic-300 rounded focus:ring-2 focus:ring-sage-500"
                    placeholder="Enter your current grade %"
                />
            </div>

            {/* Task Selection */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-academic-700 mb-2">
                    Select Task to Simulate
                </label>
                <select
                    value={selectedTask?._id || ''}
                    onChange={(e) => setSelectedTask(tasks.find(t => t._id === e.target.value))}
                    className="w-full p-2 border border-academic-300 rounded focus:ring-2 focus:ring-sage-500"
                >
                    {tasks.map(task => (
                        <option key={task._id} value={task._id}>
                            {task.title} ({task.weightage}% of grade)
                        </option>
                    ))}
                </select>
            </div>

            {/* Grade Slider */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-academic-700">
                        What if I get...
                    </label>
                    <span className={`text-2xl font-bold ${getGradeColor(simulatedGrade)}`}>
                        {simulatedGrade}%
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={simulatedGrade}
                    onChange={(e) => setSimulatedGrade(Number(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer accent-sage-600"
                />
                <div className="flex justify-between text-xs text-academic-400 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                </div>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-br from-sage-50 to-academic-50 rounded-lg p-6 border border-sage-200">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-academic-600 mb-1">Your Final Grade</p>
                        <p className={`text-3xl font-bold ${getGradeColor(result.finalGrade)}`}>
                            {result.finalGrade}%
                        </p>
                        <p className="text-sm text-academic-500 mt-1">
                            Grade: {getGradeLetter(result.finalGrade)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-academic-600 mb-1">Impact</p>
                        <div className="flex items-center gap-2">
                            {getChangeIcon()}
                            <p className={`text-2xl font-bold ${result.impact > 0 ? 'text-green-600' : result.impact < 0 ? 'text-red-600' : 'text-academic-400'}`}>
                                {result.impact > 0 ? '+' : ''}{result.impact}%
                            </p>
                        </div>
                        <p className="text-sm text-academic-500 mt-1">
                            {result.impact > 0 ? 'Boost' : result.impact < 0 ? 'Drop' : 'No change'}
                        </p>
                    </div>
                </div>

                {/* Scenarios */}
                <div className="mt-4 pt-4 border-t border-sage-200">
                    <p className="text-xs font-medium text-academic-700 mb-2">Quick Scenarios:</p>
                    <div className="grid grid-cols-3 gap-2">
                        {[100, 85, 70].map(grade => {
                            const scenarioImpact = ((grade / 100) * (selectedTask?.weightage || 10)).toFixed(1);
                            return (
                                <button
                                    key={grade}
                                    onClick={() => setSimulatedGrade(grade)}
                                    className="p-2 bg-white rounded border border-academic-200 hover:border-sage-400 transition-colors text-center"
                                >
                                    <p className="text-xs text-academic-600">If {grade}%</p>
                                    <p className="text-sm font-bold text-sage-700">+{scenarioImpact}%</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <p className="text-xs text-academic-500 mt-4 italic">
                Note: This is a simplified calculation. Actual grades may vary based on your course grading policy.
            </p>
        </div>
    );
};

export default GradeSimulator;
