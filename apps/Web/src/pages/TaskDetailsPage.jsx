import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import TaskStatusUpdate from '@/components/TaskStatusUpdate';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, User, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, loading, updateTask, deleteTask } = useTasks();
  const [deleting, setDeleting] = useState(false);

  const task = tasks.find(t => (t._id || t.id)?.toString()===id);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTask(task._id || task.id, { status: newStatus });
      toast.success('Task status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setDeleting(true);
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete task');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading task - TaskFlow</title>
        </Helmet>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
              <Skeleton className="h-10 w-64 mb-8" />
              <Skeleton className="h-64 w-full" />
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!task) {
    return (
      <>
        <Helmet>
          <title>Task not found - TaskFlow</title>
        </Helmet>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-foreground mb-4">Task not found</h2>
                <Link to="/">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${task.title} - TaskFlow`}</title>
        <meta name="description" content={task.description || 'View task details'} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors duration-200">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to dashboard
            </Link>

            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-3" style={{letterSpacing: '-0.02em'}}>
                    {task.title}
                  </h1>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {task.description && (
                <div className="mb-8">
                  <h2 className="text-sm font-medium text-muted-foreground mb-2">Description</h2>
                  <p className="text-foreground leading-relaxed">{task.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {task.dueDate && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Due date
                    </h3>
                    <p className="text-foreground font-medium">
                      {format(new Date(task.dueDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                )}

                {task.assigneeId && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Assignee
                    </h3>
                    <p className="text-foreground font-medium">{task.assigneeId}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-medium text-foreground mb-3">Update status</h3>
                <TaskStatusUpdate
                  currentStatus={task.status}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TaskDetailsPage;
