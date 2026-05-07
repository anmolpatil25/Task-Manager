import { useEffect, useState } from "react";
import API from "@/services/api";

export const useProjects = () => {
  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await API.get(
        "/projects",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setProjects(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // CREATE PROJECT
  const createProject = async (
    projectData
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await API.post(
        "/projects",
        projectData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // refresh project list
      await fetchProjects();

      return res.data;
    } catch (error) {
      console.log(error);

      throw error;
    }
  };

  return {
    projects,
    loading,
    createProject,
    refetch: fetchProjects,
  };
};
