import { useEffect, useState } from "react";
import API from "@/services/api";

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await API.get(
        "/users",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setTeamMembers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    teamMembers,
    loading,
    refetch: fetchMembers,
  };
};
