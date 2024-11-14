import { NextResponse } from "next/server";
import axios from "axios";
// Define the base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// Define a generic type for GET response data
export const fetchData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Define a generic type for POST response data
export const postData = async <T>(endpoint: string, data: unknown): Promise<T> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post("http://localhost:5000/api/" + endpoint, data,  {
        headers: {
          "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
          "Content-Type": "application/json",
        },
    });
    
    return await response.data;
  } catch (error:any) {
    console.error("Error creating list:", error);
    if (error.response && error.response.status === 401) {
      throw await { success: false, message: "Invalid credentials", status: 401 };
    }
    throw await { success: false, message: "Server error", status: 500 };
  }
};


export async function Post(url: string, data: any, auth: boolean) {
  try {
    const payload = { data };
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };

    if (auth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await axios.post("http://localhost:5000/api/" + url, payload, {
      headers,
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Error creating list:", error);
    if (error.response && error.response.status === 401) {
      return NextResponse.json({ success: false, message: "Invalid credentials", status: 401 });
    }
    return NextResponse.json({ success: false, message: "Server error", status: 500 });
  }
}