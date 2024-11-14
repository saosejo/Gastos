// src/app/login/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // For Next.js 13+ app directory routing
import styles from './Login.module.css';

const LoginPage = () => {
  const router = useRouter();
  
  // States for form data and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle login logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);  // Adjust based on actual response key for token

        router.push("/"); // Redirect to home page on successful login
      } else {
        setErrorMessage("Invalid login credentials");
        console.log("Invalid login credentials");
      }
    } catch(error) {
      setErrorMessage("Something went wrong. Please try again.");
      console.log("Catch error:", error);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img className="w-8 h-8 mr-2" src=""  />
                Expenses    
            </a>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <form className="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="flex items-center justify-between">
                            
                            <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                        </div>
                        <button type="submit" className="w-full text-white bg-blue-800 rounded py-2 ">Sign in</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
        </section>
    // <div className={styles.container}>
    //   <form className={styles.loginForm} onSubmit={handleLogin}>
    //     <h2 className={styles.title}>Login</h2>

    //     {/* Email input */}
    //     <input
    //       type="email"
    //       name="email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       placeholder="Email"
    //       className={styles.input}
    //     />

    //     {/* Password input */}
    //     <input
    //       type="password"
    //       name="password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       placeholder="Password"
    //       className={styles.input}
    //     />

    //     {/* Display error message if exists */}
    //     <p className={styles.error}>{errorMessage}</p>

    //     <button type="submit" className={styles.submitButton}>
    //       Login
    //     </button>
    //   </form>
    // </div>
  );
};

export default LoginPage;
