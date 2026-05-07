import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';

import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useTeamMembers } from '@/hooks/useTeamMembers';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Skeleton } from '@/components/ui/skeleton';

import { toast } from 'sonner';

import {
  Plus,
  FolderOpen,
} from 'lucide-react';

const ProjectsPage = () => {
  const {
    projects,
    loading,
    createProject,
  } = useProjects();

  const { tasks } = useTasks();

  const { teamMembers } =
    useTeamMembers();

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [formData, setFormData] =
    useState({
      title: '',
      description: '',
    });

  const [submitting, setSubmitting] =
    useState(false);

  // PROJECT STATS
  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(
      (t) =>
        t.project?._id === projectId ||
        t.project === projectId
    );

    return {
      taskCount: projectTasks.length,
      memberCount: teamMembers.length,
    };
  };

  // CREATE PROJECT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error(
        'Project title is required'
      );

      return;
    }

    setSubmitting(true);

    try {
      await createProject(formData);

      toast.success(
        'Project created successfully'
      );

      setDialogOpen(false);

      setFormData({
        title: '',
        description: '',
      });
    } catch (err) {
      console.log(err);

      toast.error(
        'Failed to create project'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Projects - TaskFlow
        </title>

        <meta
          name="description"
          content="Manage all your projects in one place with TaskFlow."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1
                  className="text-3xl font-bold text-foreground mb-2"
                  style={{
                    letterSpacing:
                      '-0.02em',
                  }}
                >
                  Projects
                </h1>

                <p className="text-muted-foreground">
                  Organize your work into
                  projects
                </p>
              </div>

              {/* CREATE PROJECT */}
              <Dialog
                open={dialogOpen}
                onOpenChange={
                  setDialogOpen
                }
              >
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />

                    New project
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Create new project
                    </DialogTitle>
                  </DialogHeader>

                  <form
                    onSubmit={
                      handleSubmit
                    }
                    className="space-y-4 mt-4"
                  >
                    {/* TITLE */}
                    <div>
                      <Label
                        htmlFor="title"
                        className="form-label"
                      >
                        Project title
                      </Label>

                      <Input
                        id="title"
                        value={
                          formData.title
                        }
                        onChange={(
                          e
                        ) =>
                          setFormData(
                            (
                              prev
                            ) => ({
                              ...prev,
                              title:
                                e
                                  .target
                                  .value,
                            })
                          )
                        }
                        placeholder="Website redesign"
                        className="form-input"
                        required
                      />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                      <Label
                        htmlFor="description"
                        className="form-label"
                      >
                        Description
                      </Label>

                      <Textarea
                        id="description"
                        value={
                          formData.description
                        }
                        onChange={(
                          e
                        ) =>
                          setFormData(
                            (
                              prev
                            ) => ({
                              ...prev,
                              description:
                                e
                                  .target
                                  .value,
                            })
                          )
                        }
                        placeholder="Brief description of the project"
                        className="form-input min-h-[100px]"
                        rows={4}
                      />
                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-3 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setDialogOpen(
                            false
                          )
                        }
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        disabled={
                          submitting
                        }
                      >
                        {submitting
                          ? 'Creating...'
                          : 'Create project'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(
                  (i) => (
                    <div
                      key={i}
                      className="bg-card border border-border rounded-xl p-6"
                    >
                      <Skeleton className="h-6 w-3/4 mb-3" />

                      <Skeleton className="h-4 w-full mb-2" />

                      <Skeleton className="h-4 w-2/3 mb-4" />

                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-20" />

                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : projects.length === 0 ? (

              /* EMPTY */
              <div className="text-center py-16 bg-card border border-border rounded-2xl">
                <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />

                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No projects yet
                </h3>

                <p className="text-muted-foreground mb-6">
                  Create your first
                  project to organize your
                  tasks
                </p>

                <Button
                  onClick={() =>
                    setDialogOpen(true)
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />

                  Create project
                </Button>
              </div>
            ) : (

              /* PROJECTS */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(
                  (project) => {
                    const stats =
                      getProjectStats(
                        project._id
                      );

                    return (
                      <ProjectCard
                        key={
                          project._id
                        }
                        project={project}
                        taskCount={
                          stats.taskCount
                        }
                        memberCount={
                          stats.memberCount
                        }
                      />
                    );
                  }
                )}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProjectsPage;
