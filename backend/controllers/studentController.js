const User = require('../models/User');
const Subject = require('../models/Subject');
const Task = require('../models/Task');
const DailyLog = require('../models/DailyLog');
const Progress = require('../models/Progress');
const Message = require('../models/Message');
const { calculateRPS, generateRecoveryPlan, assessRisk } = require('../utils/recoveryEngine');

// @desc    Get Student Dashboard Data (Plan, Stress, Tasks)
// @route   GET /api/student/dashboard
// @access  Private (Student)
const getDashboard = async (req, res) => {
    try {
        const studentId = req.user._id;

        // 1. Get Tasks
        const tasks = await Task.find({ student: studentId, status: { $ne: 'Completed' } });

        // 2. Get Today's Log
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        let todayLog = await DailyLog.findOne({
            student: studentId,
            date: { $gte: startOfDay }
        });

        // Default or create if not exists?
        // If no log today, we might return empty plan or ask for input.
        // For functionality, if missing, we use default stress 5, time 2h
        let recoveryPlan = null;

        if (todayLog) {
            recoveryPlan = generateRecoveryPlan(tasks, req.user, todayLog);
        }

        // Get missing subjects count?
        const subjects = await Subject.find({ student: studentId });

        res.json({
            student: req.user,
            subjects,
            tasks,
            todayLog,
            recoveryPlan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Report Stress & Available Time (Triggers Planning)
// @route   POST /api/student/log
// @access  Private (Student)
const reportDailyLog = async (req, res) => {
    const { stressLevel, availableTime, notes } = req.body;
    const studentId = req.user._id;

    // Check if log exists for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    let log = await DailyLog.findOne({
        student: studentId,
        date: { $gte: startOfDay }
    });

    if (log) {
        log.stressLevel = stressLevel;
        log.availableTime = availableTime;
        log.notes = notes;
        await log.save();
    } else {
        log = await DailyLog.create({
            student: studentId,
            stressLevel,
            availableTime,
            notes
        });
    }

    // Return the new plan immediately
    const tasks = await Task.find({ student: studentId, status: { $ne: 'Completed' } });
    const recoveryPlan = generateRecoveryPlan(tasks, req.user, log);

    res.json({ log, recoveryPlan });
};

// @desc    Add a Task
// @route   POST /api/student/task
// @access  Private
const addTask = async (req, res) => {
    const { subjectId, title, dueDate, type, weightage, subtasks, estimatedTime } = req.body;

    const task = await Task.create({
        student: req.user._id,
        subject: subjectId,
        title,
        dueDate,
        type,
        weightage,
        subtasks: subtasks || [],
        estimatedTime: estimatedTime || 60,
        status: 'Pending'
    });

    res.status(201).json(task);
};

// @desc    Add a Subject
// @route   POST /api/student/subject
// @access  Private
const addSubject = async (req, res) => {
    const { name } = req.body;

    const subject = await Subject.create({
        student: req.user._id,
        name
    });

    res.status(201).json(subject);
};

// @desc    Complete a Task
// @route   PUT /api/student/task/:id/complete
// @access  Private
const completeTask = async (req, res) => {
    const task = await Task.findById(req.params.id).populate('subject');

    if (task && task.student.toString() === req.user._id.toString()) {
        task.status = 'Completed';
        task.completedAt = Date.now();
        await task.save();

        // Track in Progress for analytics
        let progress = await Progress.findOne({ student: req.user._id });
        if (!progress) {
            progress = await Progress.create({ student: req.user._id, completedTasks: [], weeklyStats: [] });
        }

        progress.completedTasks.push({
            task: task._id,
            completedAt: task.completedAt,
            taskSnapshot: {
                title: task.title,
                subject: task.subject?.name || 'Unknown',
                weightage: task.weightage,
                type: task.type
            }
        });
        await progress.save();

        res.json(task);
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
};

// @desc    Update a Task
// @route   PUT /api/student/task/:id
// @access  Private
const updateTask = async (req, res) => {
    const { title, dueDate, type, weightage, subjectId, subtasks, estimatedTime } = req.body;
    const task = await Task.findById(req.params.id);

    if (task && task.student.toString() === req.user._id.toString()) {
        task.title = title || task.title;
        task.dueDate = dueDate || task.dueDate;
        task.type = type || task.type;
        task.weightage = weightage !== undefined ? weightage : task.weightage;
        task.subject = subjectId || task.subject;

        // Update subtasks if provided
        if (subtasks) task.subtasks = subtasks;
        if (estimatedTime) task.estimatedTime = estimatedTime;

        await task.save();
        res.json(task);
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
};

// @desc    Delete a Task
// @route   DELETE /api/student/task/:id
// @access  Private
const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task && task.student.toString() === req.user._id.toString()) {
        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
};

// @desc    Update a Subject
// @route   PUT /api/student/subject/:id
// @access  Private
const updateSubject = async (req, res) => {
    const { name } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (subject && subject.student.toString() === req.user._id.toString()) {
        subject.name = name || subject.name;
        await subject.save();
        res.json(subject);
    } else {
        res.status(404);
        throw new Error('Subject not found');
    }
};

// @desc    Delete a Subject
// @route   DELETE /api/student/subject/:id
// @access  Private
const deleteSubject = async (req, res) => {
    const subject = await Subject.findById(req.params.id);

    if (subject && subject.student.toString() === req.user._id.toString()) {
        // Also delete all tasks associated with this subject
        await Task.deleteMany({ subject: subject._id });
        await subject.deleteOne();
        res.json({ message: 'Subject and associated tasks removed' });
    } else {
        res.status(404);
        throw new Error('Subject not found');
    }
};

// @desc    Get Progress Analytics
// @route   GET /api/student/progress
// @access  Private
const getProgress = async (req, res) => {
    try {
        const studentId = req.user._id;

        // Get progress data
        let progress = await Progress.findOne({ student: studentId });
        if (!progress) {
            progress = await Progress.create({ student: req.user._id, completedTasks: [], weeklyStats: [] });
        }

        // Get stress logs for trend
        const logs = await DailyLog.find({ student: studentId })
            .sort({ date: -1 })
            .limit(30);

        // Calculate stats
        const last7Days = progress.completedTasks.filter(ct => {
            const daysDiff = (Date.now() - new Date(ct.completedAt)) / (1000 * 60 * 60 * 24);
            return daysDiff <= 7;
        });

        const last30Days = progress.completedTasks.filter(ct => {
            const daysDiff = (Date.now() - new Date(ct.completedAt)) / (1000 * 60 * 60 * 24);
            return daysDiff <= 30;
        });

        res.json({
            totalCompleted: progress.completedTasks.length,
            last7Days: last7Days.length,
            last30Days: last30Days.length,
            completedTasks: progress.completedTasks.slice(-20).reverse(), // Last 20
            stressTrend: logs.map(l => ({ date: l.date, stressLevel: l.stressLevel, availableTime: l.availableTime }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Break down a task into subtasks (Magic Todo)
// @route   POST /api/student/task/breakdown
// @access  Private
const breakdownTaskEndpoint = async (req, res) => {
    try {
        const { title, spiciness } = req.body;
        const { breakdownTask } = require('../utils/taskBreakdown');

        const breakdown = breakdownTask(title, spiciness || 2);
        res.json(breakdown);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get perspective on current workload (Judge)
// @route   POST /api/student/perspective
// @access  Private
const getPerspective = async (req, res) => {
    try {
        const { stressLevel, availableTime } = req.body;
        const { analyzePerspective } = require('../utils/perspectiveCheck');

        // Get student's pending tasks
        const tasks = await Task.find({
            student: req.user._id,
            status: { $ne: 'Completed' }
        });

        const perspective = analyzePerspective(stressLevel, tasks, availableTime);
        res.json(perspective);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get workload summary
// @route   GET /api/student/workload
// @access  Private
const getWorkload = async (req, res) => {
    try {
        const { calculateDailyWorkload } = require('../utils/timeEstimator');

        const tasks = await Task.find({
            student: req.user._id,
            status: { $ne: 'Completed' }
        });

        const workload = calculateDailyWorkload(tasks);
        res.json(workload);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Messages for Student
// @route   GET /api/student/messages
// @access  Private (Student)
const getMessages = async (req, res) => {
    try {
        const studentId = req.user._id;

        // Get all messages sent to this student
        const messages = await Message.find({ to: studentId })
            .populate('from', 'name email role')
            .sort({ createdAt: -1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Chat with AI Study Buddy
// @route   POST /api/student/chat
// @access  Private (Student)
const chatWithAI = async (req, res) => {
    try {
        const studentId = req.user._id;
        const { message } = req.body;

        // Get student context for personalized responses
        const tasks = await Task.find({ student: studentId });
        const subjects = await Subject.find({ student: studentId });
        const recentLog = await DailyLog.findOne({ student: studentId }).sort({ date: -1 });

        // Build context for AI
        const pendingTasks = tasks.filter(t => t.status === 'Pending');
        const overdueTasks = tasks.filter(t => t.status === 'Pending' && new Date(t.dueDate) < new Date());

        const context = `
You are an AI Study Buddy helping a student named ${req.user.name}.

Student Context:
- Total tasks: ${tasks.length}
- Pending tasks: ${pendingTasks.length}
- Overdue tasks: ${overdueTasks.length}
- Current stress level: ${recentLog?.stressLevel || 'Not reported'}
- Subjects: ${subjects.map(s => s.name).join(', ') || 'None yet'}

Provide helpful, encouraging, and actionable advice. Be concise and supportive.
`;

        // Simple AI response (you can integrate OpenAI API here)
        // For now, using rule-based responses for demo
        let response = generateSmartResponse(message, {
            name: req.user.name.split(' ')[0],
            pendingTasks: pendingTasks.length,
            overdueTasks: overdueTasks.length,
            stressLevel: recentLog?.stressLevel || 5,
            subjects: subjects.map(s => s.name)
        });

        res.json({ response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function for smart responses
const generateSmartResponse = (message, context) => {
    const msg = message.toLowerCase();

    // Stress-related queries
    if (msg.includes('stress') || msg.includes('anxious') || msg.includes('overwhelm')) {
        if (context.stressLevel > 7) {
            return `I can see you're experiencing high stress (level ${context.stressLevel}/10). Here's what can help:\n\n1. Take a 10-minute break right now\n2. Focus on just ONE task at a time\n3. Try the Pomodoro technique (25 min work, 5 min break)\n4. Consider talking to your teacher about ${context.overdueTasks} overdue tasks\n\nRemember: You've got this!`;
        }
        return `Managing stress is important! Try:\n\n1. Break large tasks into smaller steps\n2. Prioritize your ${context.pendingTasks} pending tasks\n3. Take regular breaks\n4. Practice deep breathing\n\nYou're doing great!`;
    }

    // Task prioritization
    if (msg.includes('priorit') || msg.includes('what should i do') || msg.includes('where to start')) {
        if (context.overdueTasks > 0) {
            return `You have ${context.overdueTasks} overdue tasks - let's tackle those first!\n\n1. Start with the task closest to its deadline\n2. Break it into 3-4 smaller steps\n3. Complete just the first step today\n4. Then move to the next task\n\nSmall progress is still progress!`;
        }
        return `Great question! Here's how to prioritize your ${context.pendingTasks} tasks:\n\n1. Check deadlines - do urgent tasks first\n2. Consider task weightage - high-value tasks matter more\n3. Match tasks to your energy level\n4. Start with something achievable to build momentum\n\nYou've got a solid plan!`;
    }

    // Study tips
    if (msg.includes('study') || msg.includes('learn') || msg.includes('exam') || msg.includes('test')) {
        return `Here are proven study strategies:\n\n1. **Active Recall**: Test yourself instead of re-reading\n2. **Spaced Repetition**: Review material over multiple days\n3. **Pomodoro Technique**: 25 min focused study, 5 min break\n4. **Teach Someone**: Explaining concepts solidifies learning\n\nFor ${context.subjects.length > 0 ? context.subjects.join(', ') : 'your subjects'}, try creating flashcards or practice problems!`;
    }

    // Time management
    if (msg.includes('time') || msg.includes('schedule') || msg.includes('plan')) {
        return `Let's optimize your time with ${context.pendingTasks} tasks:\n\n1. **Time Block**: Assign specific hours to each task\n2. **2-Minute Rule**: If it takes <2 min, do it now\n3. **Batch Similar Tasks**: Group readings, assignments, etc.\n4. **Buffer Time**: Add 25% extra time to estimates\n\nConsistency beats perfection!`;
    }

    // Motivation
    if (msg.includes('motivat') || msg.includes('give up') || msg.includes("can't do")) {
        return `I believe in you! Here's why you CAN do this:\n\n You're already taking action by asking for help\n Every expert was once a beginner\n Small steps lead to big achievements\n You've overcome challenges before\n\nTake it one task at a time. You're stronger than you think!`;
    }

    // --- NEW PATTERNS ---

    // Greeting / Start
    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
        return `Hi ${context.name}! I'm ready to help you bounce back.\n\nWe sort tasks by **Stress Level**, not just due dates. How are you feeling today?`;
    }

    // "How does this app work?"
    if (msg.includes('how') && (msg.includes('work') || msg.includes('app') || msg.includes('help'))) {
        return `REBOUND is different because we care about your mental health.\n\n1. **We breakdown tasks** so they aren't scary.\n2. **We track your stress** to prevent burnout.\n3. **We talk to teachers** if you're struggling.\n\nCheck your Dashboard for your "Recovery Plan"!`;
    }

    // "I am tired" / Burnout
    if (msg.includes('tired') || msg.includes('burnout') || msg.includes('sleep') || msg.includes('exhaust')) {
        return `It sounds like you need a **Recovery Break**.\n\nScience says pushing through burnout lowers grades. \n\n**Action Plan:**\n1. Close this tab.\n2. Sleep or walk for 20 mins.\n3. Come back and do ONE small task.\n\nI'll be here when you're ready.`;
    }

    // "My grades are bad"
    if (msg.includes('grade') || msg.includes('fail') || msg.includes('score') || msg.includes('bad')) {
        return `One bad grade doesn't define you.\n\nUse the **Grade Simulator** on your dashboard to see how to recover. \n\nEven a 1% improvement is progress. Let's focus on the next assignment, not the last one.`;
    }

    // "Thank you"
    if (msg.includes('thank') || msg.includes('thanks') || msg.includes('good bot')) {
        return `You're welcome!\n\nRemember, YOU are the one doing the hard work. I'm just the cheerleader. Keep going!`;
    }

    // Default helpful response
    return `I'm listening! I can help with:\n\n**Study Strategies** (Pomodoro, Active Recall)\n**Stress Management** (Breaks, Mindfulness)\n**Time Management** (Prioritization)\n\nTry asking: "I am stressed" or "How do I study for math?"`;
};

module.exports = {
    getDashboard,
    reportDailyLog,
    addTask,
    addSubject,
    completeTask,
    updateTask,
    deleteTask,
    updateSubject,
    deleteSubject,
    getProgress,
    breakdownTaskEndpoint,
    getPerspective,
    getWorkload,
    getMessages,
    chatWithAI
};
