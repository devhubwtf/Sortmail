import React from 'react';
import { TaskDTOv1, PriorityLevel } from '@/types/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, ChevronRight, Mail } from 'lucide-react';

interface TaskListProps {
    tasks: TaskDTOv1[];
    onTaskClick: (taskId: string) => void;
}

const PRIORITY_STYLES: Record<PriorityLevel, string> = {
    do_now: 'bg-red-100 text-red-700 border-red-200',
    do_today: 'bg-orange-100 text-orange-700 border-orange-200',
    can_wait: 'bg-green-100 text-green-700 border-green-200',
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
    pending: { label: 'To Do', className: 'bg-slate-100 text-slate-700 border-slate-200' },
    in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    completed: { label: 'Done', className: 'bg-green-100 text-green-700 border-green-200' },
};

export function TaskList({ tasks, onTaskClick }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground bg-paper-mid/30 rounded-xl border border-dashed border-border-light">
                <p>No tasks found matching your filters.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {tasks.map((task) => (
                <Card
                    key={task.task_id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 group"
                    onClick={() => onTaskClick(task.task_id)}
                >
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="flex flex-col gap-2 shrink-0">
                                <Badge variant="outline" className={`w-fit ${PRIORITY_STYLES[task.priority as PriorityLevel] || 'bg-gray-100'}`}>
                                    {task.priority.replace('_', ' ').toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className={`w-fit text-[10px] ${STATUS_BADGES[task.status]?.className || ''}`}>
                                    {STATUS_BADGES[task.status]?.label || task.status}
                                </Badge>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-ink leading-snug group-hover:text-accent transition-colors">
                                    {task.title}
                                </h4>
                                <p className="text-sm text-ink-light truncate mt-0.5">
                                    {task.description}
                                </p>
                                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                                    {task.effort === 'deep_work' && (
                                        <span className="font-mono bg-paper-mid px-1.5 rounded">DEEP WORK</span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        Task via Email
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 shrink-0">
                            <div className="text-right">
                                {task.deadline ? (
                                    <>
                                        <div className={`text-sm font-medium flex items-center justify-end gap-1.5 ${new Date(task.deadline) < new Date() ? 'text-danger' : 'text-ink'}`}>
                                            {new Date(task.deadline) < new Date() && <AlertTriangle className="h-3.5 w-3.5" />}
                                            {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            Deadline
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-sm text-muted-foreground">—</span>
                                )}
                            </div>
                            <ChevronRight className="h-5 w-5 text-border-mid group-hover:text-ink-light transition-colors" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
