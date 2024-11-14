import { NextResponse } from "next/server";
import { Post } from "../../../services/apiService"
import axios from "axios";

export async function createList(list: string[]) {
  try {
    const response = Post("list/lists", list, true);
    return  response;
  } catch (error: any) {
    return error;
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Make an API call to your backend's login endpoint
    const response = await axios.post('http://localhost:5000/api/list/lists', {
      email,
      password,
    });

    // Extract the token from the response data
    const { token } = response.data;

    // If login is successful, return the token
    return NextResponse.json({ success: true, token });
  } catch (error: any) {
    // Handle errors and return a response with the appropriate status
    console.error('Error during login:', error);

    // Check if error is due to invalid credentials or something else
    if (error.response && error.response.status === 401) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // If other errors, return a general server error
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}