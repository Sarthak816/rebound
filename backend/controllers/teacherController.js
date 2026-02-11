const User = require('../models/User');
const Task = require('../models/Task');
const DailyLog = require('../models/DailyLog');
const Message = require('../models/Message');
const { assessRisk } = require('../utils/recoveryEngine');
const { differenceInCalendarDays } = require('date-fns');

// @desc    Get Assigned Students with Risks
// @route   GET /api/teacher/students
// @access  Private (Teacher)
const getStudents = async (req, res) => {
    try {
        const teacherId = req.user._id;

        // For demo/hackathon: show all students
        // In production, you'd filter by: { assignedTeacher: teacherId }
        const students = await User.find({ role: 'student' }).select('-password');
        console.log(`👨‍🏫 Teacher Dashboard: Found ${students.length} students in DB.`);

        const studentData = [];

        for (const student of students) {
            try {
                // Get recent logs (7 days) for stress history
                const logs = await DailyLog.find({
                    student: student._id
                }).sort({ date: 1 }).limit(7);

                // Get tasks statistics
                const tasks = await Task.find({ student: student._id }) || [];
                const missedTasksCount = tasks.filter(t => t.status === 'Missed' || (t.status === 'Pending' && new Date(t.dueDate) < new Date())).length;
                const overdueTasksCount = tasks.filter(t => t.status === 'Pending' && new Date(t.dueDate) < new Date()).length;

                // Calculate backlog depth (tasks due in future vs total)
                const pendingTasks = tasks.filter(t => t.status === 'Pending' && new Date(t.dueDate) >= new Date());

                // Prepare data for risk assessment
                const stressHistory = logs ? logs.map(l => l.stressLevel) : [];

                const riskLevel = assessRisk({
                    stressHistory,
                    missedTasksCount,
                    overdueTasksCount,
                    backlogDepthDays: pendingTasks.length
                });

                studentData.push({
                    ...student.toObject(),
                    riskLevel,
                    latestStress: stressHistory.length > 0 ? stressHistory[stressHistory.length - 1] : 0,
                    missedTasks: missedTasksCount
                });
            } catch (innerError) {
                console.error(`❌ Error processing student ${student.name}:`, innerError.message);
                // Push with default data so they still show up
                studentData.push({
                    ...student.toObject(),
                    riskLevel: 'Low',
                    latestStress: 'N/A',
                    missedTasks: 0,
                    error: 'Failed to load stats'
                });
            }
        }

        res.json(studentData);
    } catch (error) {
        console.error('❌ Teacher Dashboard Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send Message to Student
// @route   POST /api/teacher/message
// @access  Private (Teacher)
const sendMessage = async (req, res) => {
    try {
        const { studentId, subject, message, type } = req.body;

        const newMessage = await Message.create({
            from: req.user._id,
            to: studentId,
            subject,
            message,
            type: type || 'message'
        });

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Messages for a Student
// @route   GET /api/teacher/messages/:studentId
// @access  Private (Teacher)
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { from: req.user._id, to: req.params.studentId },
                { from: req.params.studentId, to: req.user._id }
            ]
        }).sort({ createdAt: -1 }).populate('from to', 'name email');

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStudents, sendMessage, getMessages };
