const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { taskValidation, subjectValidation, stressLogValidation } = require('../middleware/validationMiddleware');

router.get('/dashboard', protect, getDashboard);
router.get('/progress', protect, getProgress);
router.get('/workload', protect, getWorkload);
router.get('/messages', protect, getMessages);
router.post('/chat', protect, chatWithAI);
router.post('/log', protect, stressLogValidation, reportDailyLog);

// Goblin Tools Features
router.post('/task/breakdown', protect, breakdownTaskEndpoint);
router.post('/perspective', protect, getPerspective);

// Task CRUD
router.post('/task', protect, taskValidation, addTask);
router.put('/task/:id', protect, updateTask);
router.put('/task/:id/complete', protect, completeTask);
router.delete('/task/:id', protect, deleteTask);

// Subject CRUD
router.post('/subject', protect, subjectValidation, addSubject);
router.put('/subject/:id', protect, updateSubject);
router.delete('/subject/:id', protect, deleteSubject);

module.exports = router;
