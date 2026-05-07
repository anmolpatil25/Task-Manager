import React, {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import API from '@/services/api';

import { Button } from '@/components/ui/button';

const EditTaskPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [task, setTask] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // FETCH TASK
  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const token =
        localStorage.getItem(
          'token'
        );

      const res = await API.get(
        '/tasks',
        {
          headers: {
            Authorization:
              token,
          },
        }
      );

      const foundTask =
        res.data.find(
          (t) => t._id === id
        );

      setTask(foundTask);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE TASK
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem(
          'token'
        );

      await API.put(
        `/tasks/${id}`,
        {
          title: task.title,
          description:
            task.description,
          status: task.status,
          priority:
            task.priority,
        },
        {
          headers: {
            Authorization:
              token,
          },
        }
      );

      alert(
        'Task updated successfully'
      );

      navigate('/');
    } catch (error) {
      console.log(error);

      alert(
        'Failed to update task'
      );
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-10">
        Task not found
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Edit Task
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* TITLE */}
        <input
          type="text"
          value={task.title}
          onChange={(e) =>
            setTask({
              ...task,
              title:
                e.target.value,
            })
          }
          className="w-full border p-3 rounded"
        />

        {/* DESCRIPTION */}
        <textarea
          value={task.description}
          onChange={(e) =>
            setTask({
              ...task,
              description:
                e.target.value,
            })
          }
          className="w-full border p-3 rounded"
          rows={5}
        />

        {/* STATUS */}
        <select
          value={task.status}
          onChange={(e) =>
            setTask({
              ...task,
              status:
                e.target.value,
            })
          }
          className="w-full border p-3 rounded"
        >
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

        {/* PRIORITY */}
        <select
          value={task.priority}
          onChange={(e) =>
            setTask({
              ...task,
              priority:
                e.target.value,
            })
          }
          className="w-full border p-3 rounded"
        >
          <option value="Low">
            Low
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="High">
            High
          </option>
        </select>

        <Button type="submit">
          Update Task
        </Button>
      </form>
    </div>
  );
};

export default EditTaskPage;
