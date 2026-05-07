import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TaskCard from '@/components/TaskCard';
import StatusBadge from '@/components/StatusBadge';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Plus, Users, CheckSquare } from 'lucide-react';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { projects, loading: projectLoading } = useProjects();
  const { tasks, loading: tasksLoading } = useTasks({ projectId: id });
  const { teamMembers } = useTeamMembers(id);

  const project = projects.find(p => p.id === id);

  if (projectLoading) {
    return (
      <>
        <Helmet>
          <title>Loading project - TaskFlow</title>
        </Helmet>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Skeleton className="h-10 w-64 mb-8" />
              <Skeleton className="h-32 w-full mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Helmet>
          <title>Project not found - TaskFlow</title>
        </Helmet>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-foreground mb-4">Project not found</h2>
                <Link to="/projects">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to projects
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
        <title>{`${project.name} - TaskFlow`}</title>
        <meta name="description" content={project.description || 'View project details and tasks'} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors duration-200">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to projects
            </Link>

            <div className="bg-card border border-border rounded-2xl p-8 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-3" style={{letterSpacing: '-0.02em'}}>
                    {project.name}
                  </h1>
                  {project.description && (
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
                      {project.description}
                    </p>
                  )}
                </div>
                <StatusBadge status={project.status} />
              </div>

              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckSquare className="w-5 h-5" />
                  <span className="text-sm font-medium">{tasks.length} tasks</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium">{teamMembers.length} team members</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Tasks</h2>
              <Link to="/tasks/create">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New task
                </Button>
              </Link>
            </div>

            {tasksLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-2xl">
                <CheckSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No tasks yet</h3>
                <p className="text-muted-foreground mb-6">Create your first task for this project</p>
                <Link to="/tasks/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create task
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProjectDetailsPage;
