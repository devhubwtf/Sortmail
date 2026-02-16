import React from 'react';
import { TaskDTOv1, PriorityLevel } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, CheckCircle2, Circle, ArrowRightCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TaskKanbanProps {
    tasks: TaskDTOv1[];
    onTaskClick: (taskId: string) => void;
}

const PRIORITY_STYLES: Record<PriorityLevel, string> = {
    do_now: 'bg-red-100 text-red-700 border-red-200',
    do_today: 'bg-orange-100 text-orange-700 border-orange-200',
    can_wait: 'bg-green-100 text-green-700 border-green-200',
};

function KanbanColumn({ title, tasks, icon: Icon, onTaskClick }: { title: string; tasks: TaskDTOv1[]; icon: React.ElementType; onTaskClick: (id: string) => void }) {
    return (
        <div className="flex-1 min-w-[300px] bg-paper-mid/50 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-display text-lg text-ink">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <h3>{title}</h3>
                </div>
                <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                    {tasks.length}
                </Badge>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-220px)] pr-2 scrollbar-thin">
                {tasks.map((task) => (
                    <Card
                        key={task.task_id}
                        className="cursor-pointer hover:shadow-md transition-all duration-200 border-l-4"
                        style={{ borderLeftColor: task.priority === 'do_now' ? 'var(--danger)' : 'transparent' }}
                        onClick={() => onTaskClick(task.task_id)}
                    >
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start gap-2">
                                <Badge variant="outline" className={PRIORITY_STYLES[task.priority as PriorityLevel] || 'bg-gray-100'}>
                                    {task.priority.replace('_', ' ').toUpperCase()}
                                </Badge>
                                {task.effort === 'deep_work' && (
                                    <span className="text-[10px] uppercase font-mono text-muted-foreground bg-paper-mid px-1.5 py-0.5 rounded">
                                        Deep Work
                                    </span>
                                )}
                            </div>

                            <div>
                                <h4 className="font-medium text-sm text-ink leading-snug line-clamp-2">
                                    {task.title}
                                </h4>
                                <p className="text-xs text-ink-light mt-1 line-clamp-2">
                                    {task.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border-light">
                                <div className="flex items-center gap-1">
                                    {task.deadline ? (
                                        <>
                                            <Clock className="h-3 w-3" />
                                            <span>{new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                        </>
                                    ) : (
                                        <span>No deadline</span>
                                    )}
                                </div>
                                {task.deadline && new Date(task.deadline) < new Date() && (
                                    <span className="text-danger font-medium flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        Overdue
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {tasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm italic border-2 border-dashed border-border-light rounded-lg">
                        Box empty
                    </div>
                )}
            </div>
        </div>
    );
}

export function TaskKanban({ tasks, onTaskClick }: TaskKanbanProps) {
    const todoTasks = tasks.filter(t => t.status === 'pending');
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
    const doneTasks = tasks.filter(t => t.status === 'completed');

    return (
        <div className="flex gap-6 overflow-x-auto pb-6 h-full">
            <KanbanColumn
                title="To Do"
                tasks={todoTasks}
                icon={Circle}
                onTaskClick={onTaskClick}
            />
            <KanbanColumn
                title="In Progress"
                tasks={inProgressTasks}
                icon={ArrowRightCircle}
                onTaskClick={onTaskClick}
            />
            <KanbanColumn
                title="Done"
                tasks={doneTasks}
                icon={CheckCircle2}
                onTaskClick={onTaskClick}
            />
        </div>
    );
}
