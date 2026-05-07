import React, { useState } from 'react';

import {
  useNavigate,
  Link,
} from 'react-router-dom';

import { Helmet } from 'react-helmet';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useTeamMembers } from '@/hooks/useTeamMembers';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { toast } from 'sonner';

import { ArrowLeft } from 'lucide-react';

const CreateTaskPage = () => {
  const navigate = useNavigate();

  const { createTask } = useTasks();

  const { projects } = useProjects();

  const { teamMembers } =
    useTeamMembers();

  const [formData, setFormData] =
    useState({
      title: '',
      description: '',
      project: '',
      assignedTo: '',
      status: 'Todo',
      priority: 'Medium',
      dueDate: '',
    });

  const [submitting, setSubmitting] =
    useState(false);

  // HANDLE CHANGE
  const handleChange = (
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.project
    ) {
      toast.error(
        'Title and project are required'
      );

      return;
    }

    setSubmitting(true);

    try {
      const taskData = {
        title: formData.title,
        description:
          formData.description,
        project: formData.project,
        assignedTo:
          formData.assignedTo,
        status: formData.status,
        priority:
          formData.priority,
        dueDate: formData.dueDate,
      };

      await createTask(taskData);

      toast.success(
        'Task created successfully'
      );

      navigate('/');
    } catch (err) {
      console.log(err);

      toast.error(
        'Failed to create task'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Create task - TaskFlow
        </title>

        <meta
          name="description"
          content="Create a new task and assign it to your team members."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

            {/* BACK */}
            <Link
              to="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />

              Back to dashboard
            </Link>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h1
                className="text-3xl font-bold text-foreground mb-6"
                style={{
                  letterSpacing:
                    '-0.02em',
                }}
              >
                Create new task
              </h1>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* TITLE */}
                <div>
                  <Label
                    htmlFor="title"
                    className="form-label"
                  >
                    Task title
                  </Label>

                  <Input
                    id="title"
                    value={
                      formData.title
                    }
                    onChange={(e) =>
                      handleChange(
                        'title',
                        e.target.value
                      )
                    }
                    placeholder="Update homepage design"
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
                    onChange={(e) =>
                      handleChange(
                        'description',
                        e.target.value
                      )
                    }
                    placeholder="Provide details about the task"
                    className="form-input min-h-[120px]"
                    rows={5}
                  />
                </div>

                {/* PROJECT + ASSIGNEE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* PROJECT */}
                  <div>
                    <Label className="form-label">
                      Project
                    </Label>

                    <Select
                      value={
                        formData.project
                      }
                      onValueChange={(
                        value
                      ) =>
                        handleChange(
                          'project',
                          value
                        )
                      }
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>

                      <SelectContent>
                        {projects.map(
                          (
                            project
                          ) => (
                            <SelectItem
                              key={
                                project._id
                              }
                              value={
                                project._id
                              }
                            >
                              {
                                project.title
                              }
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ASSIGNEE */}
                  <div>
                    <Label className="form-label">
                      Assignee
                    </Label>

                    <Select
                      value={
                        formData.assignedTo
                      }
                      onValueChange={(
                        value
                      ) =>
                        handleChange(
                          'assignedTo',
                          value
                        )
                      }
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>

                      <SelectContent>
                        {teamMembers.map(
                          (
                            member
                          ) => (
                            <SelectItem
                              key={
                                member._id
                              }
                              value={
                                member._id
                              }
                            >
                              {
                                member.name
                              }
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* STATUS PRIORITY DATE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* STATUS */}
                  <div>
                    <Label className="form-label">
                      Status
                    </Label>

                    <Select
                      value={
                        formData.status
                      }
                      onValueChange={(
                        value
                      ) =>
                        handleChange(
                          'status',
                          value
                        )
                      }
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Todo">
                          Todo
                        </SelectItem>

                        <SelectItem value="In Progress">
                          In Progress
                        </SelectItem>

                        <SelectItem value="Completed">
                          Completed
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* PRIORITY */}
                  <div>
                    <Label className="form-label">
                      Priority
                    </Label>

                    <Select
                      value={
                        formData.priority
                      }
                      onValueChange={(
                        value
                      ) =>
                        handleChange(
                          'priority',
                          value
                        )
                      }
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Low">
                          Low
                        </SelectItem>

                        <SelectItem value="Medium">
                          Medium
                        </SelectItem>

                        <SelectItem value="High">
                          High
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* DATE */}
                  <div>
                    <Label className="form-label">
                      Due date
                    </Label>

                    <Input
                      type="date"
                      value={
                        formData.dueDate
                      }
                      onChange={(e) =>
                        handleChange(
                          'dueDate',
                          e.target.value
                        )
                      }
                      className="form-input"
                    />
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 justify-end pt-4">

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      navigate('/')
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
                      : 'Create task'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CreateTaskPage;
