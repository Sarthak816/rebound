import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/api';

const CalendarHeatmap = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/student/dashboard');
            const apiTasks = res.data.tasks || [];

            // If no tasks from API, use demo data for visualization
            if (apiTasks.length === 0) {
                setTasks(generateDemoTasks());
            } else {
                setTasks(apiTasks);
            }
        } catch (error) {
            console.error(error);
            // Fallback to demo data on error
            setTasks(generateDemoTasks());
        }
    };

    const generateDemoTasks = () => {
        const now = new Date();
        const demoTasks = [];

        // Generate tasks for the past 30 days
        for (let i = 0; i < 30; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Random number of tasks per day (0-3)
            const tasksPerDay = Math.floor(Math.random() * 4);

            for (let j = 0; j < tasksPerDay; j++) {
                demoTasks.push({
                    _id: `demo-${i}-${j}`,
                    title: `Task ${i}-${j}`,
                    dueDate: date.toISOString(),
                    estimatedTime: 60 + Math.floor(Math.random() * 120), // 1-3 hours
                    status: Math.random() > 0.3 ? 'Completed' : 'Pending'
                });
            }
        }

        return demoTasks;
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const getTasksForDate = (date) => {
        return tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate.toDateString() === date.toDateString();
        });
    };

    const getWorkloadForDate = (date) => {
        const dateTasks = getTasksForDate(date);
        const totalMinutes = dateTasks.reduce((sum, task) => sum + (task.estimatedTime || 60), 0);
        return totalMinutes / 60; // hours
    };

    const getHeatmapColor = (hours) => {
        if (hours === 0) return 'bg-academic-100 text-academic-400';
        if (hours <= 2) return 'bg-green-200 text-green-800 hover:bg-green-300';
        if (hours <= 4) return 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300';
        if (hours <= 6) return 'bg-orange-200 text-orange-800 hover:bg-orange-300';
        return 'bg-red-200 text-red-800 hover:bg-red-300';
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

    const previousMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-white rounded-lg border border-academic-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Calendar className="text-sage-600" size={20} />
                    <h3 className="text-lg font-serif font-bold text-academic-900">Workload Calendar</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={previousMonth} className="p-1 hover:bg-academic-100 rounded">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-medium text-academic-700 min-w-[150px] text-center">
                        {monthName}
                    </span>
                    <button onClick={nextMonth} className="p-1 hover:bg-academic-100 rounded">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 text-xs text-academic-600">
                <span>Workload:</span>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-academic-100 rounded"></div>
                    <span>None</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-200 rounded"></div>
                    <span>Light</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                    <span>Moderate</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-orange-200 rounded"></div>
                    <span>Heavy</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-red-200 rounded"></div>
                    <span>Extreme</span>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-academic-500 pb-2">
                        {day}
                    </div>
                ))}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="aspect-square"></div>
                ))}

                {/* Calendar days */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const day = idx + 1;
                    const date = new Date(year, month, day);
                    const hours = getWorkloadForDate(date);
                    const dateTasks = getTasksForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = selectedDate?.toDateString() === date.toDateString();

                    return (
                        <button
                            key={day}
                            onClick={() => setSelectedDate(date)}
                            className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all ${getHeatmapColor(hours)} ${isToday ? 'ring-2 ring-sage-600' : ''
                                } ${isSelected ? 'ring-2 ring-purple-600 scale-105' : ''}`}
                        >
                            <span>{day}</span>
                            {hours > 0 && (
                                <span className="text-xs font-normal">{hours.toFixed(1)}h</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Selected Date Details */}
            {selectedDate && (
                <div className="mt-6 p-4 bg-academic-50 rounded-lg border border-academic-200">
                    <h4 className="font-medium text-academic-900 mb-2">
                        {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h4>
                    {getTasksForDate(selectedDate).length > 0 ? (
                        <div className="space-y-2">
                            {getTasksForDate(selectedDate).map(task => (
                                <div key={task._id} className="flex items-center justify-between text-sm">
                                    <span className="text-academic-700">{task.title}</span>
                                    <span className="text-xs text-academic-500">{task.type}</span>
                                </div>
                            ))}
                            <p className="text-xs text-academic-500 mt-2">
                                Total: ~{getWorkloadForDate(selectedDate).toFixed(1)} hours
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-academic-500">No tasks due on this day</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CalendarHeatmap;
