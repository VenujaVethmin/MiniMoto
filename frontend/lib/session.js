"use client";
import useSWR from "swr";
import axiosInstance from "./axiosInstance";
const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

function useSession() {
  const {
    data: user,
    error,
    isLoading,
  } = useSWR(`/protected`, fetcher);
  return {  
    user,
    isLoading,
    error,
  };
}

export default useSession;
