import { useState, useCallback } from 'react';
import axios from 'axios';
import React from 'react';

export interface PostApiHook<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const usePostData = <T>(endpoint: string, requestData: unknown, auth: boolean = false) => {
  const [data, setResponse] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  React.useEffect(() => {
    if (!requestData) return; 
    const submitData = async () => {
      console.log(requestData);
      setLoading(true);
      const token = auth ? localStorage.getItem("token") || "" : "";
      try {
        const result = await axios.post<T>(`http://localhost:5000/api/${endpoint}`, requestData, {
          headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzJhZGYwZWU5ZDI3ZTg5NmQ0MmQ1ZjYiLCJpYXQiOjE3MzEzNzcwMDAsImV4cCI6MTczMTQxMzAwMH0.fxZ3AGqBopEm2nbXTTjbuFRu78h-TFkJF2tuFsRAQLw",
            "Content-Type": "application/json",
          },
        });
        setResponse(result.data); // Update response with the result data
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    submitData();
  }, [endpoint, requestData, auth]);

  return { data, loading, error };  
};

export const useGetData = <T>(endpoint: string, auth: boolean = false) => {
  const [data, setResponse] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  React.useEffect(() => {
    const submitData = async () => {
      setLoading(true);
      const token = auth ? localStorage.getItem("token") || "" : "";
      try {
        const result = await axios.get<T>(`http://localhost:5000/api/${endpoint}`, {
          headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzJhZGYwZWU5ZDI3ZTg5NmQ0MmQ1ZjYiLCJpYXQiOjE3MzEzNzcwMDAsImV4cCI6MTczMTQxMzAwMH0.fxZ3AGqBopEm2nbXTTjbuFRu78h-TFkJF2tuFsRAQLw",
            "Content-Type": "application/json",
          },
        });
        console.log(result);
        setResponse(result.data); // Update response with the result data
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    submitData();
  }, [endpoint, auth]);

  return { data, loading, error };  
};