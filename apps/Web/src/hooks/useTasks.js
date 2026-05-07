import { useEffect, useState } from "react";

import API from "@/services/api";

export const useTasks = () => {
  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await API.get(
        "/tasks",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setTasks(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // CREATE TASK
  const createTask = async (
    taskData
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await API.post(
        "/tasks",
        taskData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      await fetchTasks();

      return res.data;
    } catch (error) {
      console.log(error);

      throw error;
    }
  };

  const updateTask = async (id, updatedData) => {
  try {
    const token = localStorage.getItem("token");
 
    const res = await API.put(
      `/tasks/${id}`,
      updatedData,
      {
        headers: {
          Authorization: token,
        },
      }
    );
 
    await fetchTasks();
 
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
 
const deleteTask = async (id) => {
  try {
    const token = localStorage.getItem("token");
 
    const res = await API.delete(
      `/tasks/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
 
    await fetchTasks();
 
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
};
