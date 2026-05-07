import React, { useState } from 'react';

import { Helmet } from 'react-helmet';

import { Link } from 'react-router-dom';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import TaskCard from '@/components/TaskCard';

import { useTasks } from '@/hooks/useTasks';

import { Button } from '@/components/ui/button';

import { Progress } from '@/components/ui/progress';

import { Skeleton } from '@/components/ui/skeleton';

import {
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

const HomePage = () => {
  const { tasks, loading } =
    useTasks();

  const [activeFilter, setActiveFilter] =
    useState('All');

  // FILTER TASKS
  const filteredTasks =
    activeFilter === 'All'
      ? tasks
      : tasks.filter(
          (task) =>
            task.status ===
            activeFilter
        );

  // STATS
  const stats = {
    total: tasks.length,

    completed: tasks.filter(
      (t) =>
        t.status === 'Completed'
    ).length,

    inProgress: tasks.filter(
      (t) =>
        t.status === 'In Progress'
    ).length,

    todo: tasks.filter(
      (t) => t.status === 'Todo'
    ).length,
  };

  const completionRate =
    stats.total > 0
      ? (stats.completed /
          stats.total) *
        100
      : 0;

  return (
    <>
      <Helmet>
        <title>
          Dashboard - TaskFlow
        </title>

        <meta
          name="description"
          content="Manage your tasks and projects efficiently with TaskFlow dashboard."
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
                  Dashboard
                </h1>

                <p className="text-muted-foreground">
                  Track your tasks and
                  monitor progress
                </p>
              </div>

              <Link to="/tasks/create">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />

                  New task
                </Button>
              </Link>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

              {/* TOTAL */}
              <div className="stat-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total tasks
                  </span>

                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>

                <p className="text-3xl font-bold text-foreground">
                  {stats.total}
                </p>
              </div>

              {/* COMPLETED */}
              <div className="stat-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Completed
                  </span>

                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>

                <p className="text-3xl font-bold text-foreground">
                  {stats.completed}
                </p>

                <Progress
                  value={
                    completionRate
                  }
                  className="mt-3 h-2"
                />
              </div>

              {/* IN PROGRESS */}
              <div className="stat-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    In Progress
                  </span>

                  <Clock className="w-5 h-5 text-blue-600" />
                </div>

                <p className="text-3xl font-bold text-foreground">
                  {
                    stats.inProgress
                  }
                </p>
              </div>
            </div>

            {/* FILTER */}
            <div className="mb-6">
              <select
                value={activeFilter}
                onChange={(e) =>
                  setActiveFilter(
                    e.target.value
                  )
                }
                className="border border-border rounded-lg px-4 py-2 bg-background text-foreground"
              >
                <option value="All">
                  All Tasks
                </option>

                <option value="Todo">
                  Todo
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(
                  (i) => (
                    <div
                      key={i}
                      className="bg-card border border-border rounded-xl p-4"
                    >
                      <Skeleton className="h-6 w-3/4 mb-3" />

                      <Skeleton className="h-4 w-full mb-2" />

                      <Skeleton className="h-4 w-2/3 mb-4" />
                    </div>
                  )
                )}
              </div>
            ) : filteredTasks.length ===
              0 ? (

              /* EMPTY */
              <div className="text-center py-16 bg-card border border-border rounded-2xl">
                <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />

                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No tasks found
                </h3>

                <p className="text-muted-foreground mb-6">
                  No tasks available for
                  selected filter
                </p>

                <Link to="/tasks/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />

                    Create task
                  </Button>
                </Link>
              </div>
            ) : (

              /* TASKS */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map(
                  (task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                    />
                  )
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

export default HomePage;
