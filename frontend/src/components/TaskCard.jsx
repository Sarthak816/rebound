import { format } from 'date-fns';
import { CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { InfoTooltip } from './Tooltip';

const TaskCard = ({ task, onComplete, onEdit, onDelete, showScore }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const dueDate = new Date(task.dueDate);
    const isOverdue = dueDate < new Date() && task.status !== 'Completed';
    const daysUntilDue = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));

    const handleDeleteConfirm = () => {
        onDelete(task._id);
    };

    return (
        <>
            <div className={`bg-white border rounded-lg p-4 transition-shadow hover:shadow-md ${isOverdue ? 'border-red-300' : 'border-academic-200'}`}>
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-academic-900">{task.title}</h3>
                            <span className="text-xs px-2 py-0.5 bg-academic-100 text-academic-600 rounded">
                                {task.type}
                            </span>
                        </div>
                        <p className="text-sm text-academic-500">
                            {task.subject?.name || 'Unknown Subject'} • {task.weightage}% of grade
                        </p>
                        <p className={`text-xs mt-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-academic-400'}`}>
                            {isOverdue ? 'Overdue' : daysUntilDue === 0 ? 'Due Today' : `Due in ${daysUntilDue} days`} • {format(dueDate, 'MMM d, yyyy')}
                        </p>
                        {showScore && task.rps !== undefined && (
                            <div className="mt-2 text-xs text-sage-700 bg-sage-50 inline-flex items-center gap-1 px-2 py-1 rounded">
                                Priority Score: <strong>{Math.round(task.rps)}</strong>
                                <InfoTooltip text="AI-calculated priority based on deadline urgency, stress level, and grade weightage" position="top" />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 ml-4">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(task)}
                                className="p-1.5 text-academic-500 hover:text-sage-700 hover:bg-sage-50 rounded transition-all hover:scale-110"
                                title="Edit Task"
                            >
                                <Edit2 size={16} />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="p-1.5 text-academic-500 hover:text-red-600 hover:bg-red-50 rounded transition-all hover:scale-110"
                                title="Delete Task"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                        {onComplete && task.status !== 'Completed' && (
                            <button
                                onClick={() => onComplete(task._id)}
                                className="p-1.5 text-sage-600 hover:text-sage-700 hover:bg-sage-50 rounded transition-all hover:scale-110"
                                title="Mark Complete"
                            >
                                <CheckCircle2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Task?"
                message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
                confirmText="Delete"
                confirmColor="red"
            />
        </>
    );
};

export default TaskCard;

