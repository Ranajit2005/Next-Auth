"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
// import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation"; // check this hooks comes from next/navigation
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();

  const getErrorMessage = (error: unknown):string => {
    let message : string
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    } else if (typeof error === "object" && error !== null && "message" in error) {
      message = JSON.stringify(error);

    }else {
      message = "An error occurred";
    }

    return message;
  }

  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  //We want that after giving the value of all field, the button should be enabled
  const [ButtonDisable, setButtonDisable] = useState(false);

  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user); //useing axios we send the data to the backend signup
      console.log("Signup successfully", response.data); //If signup successfully then we get the data
      router.push("/login"); //After signup we redirect to login page
    } catch (error: unknown) {
      console.log("SignUp failed");
      return {
        error : getErrorMessage(error),
      }
      // toast.error(error.message);
    }
  };

  useEffect(() => {
    if (  user.email.length > 0 &&  user.password.length > 0 &&  user.username.length > 0
    ) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing..." : "Sign Up"}</h1>
      <label htmlFor="username">username</label>   {/* htmlfor means for which field we are giving the label and we use it in input id */}
      <input
        type="text"
        id="username"
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        placeholder="username"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />



      <label htmlFor="email">email</label>
      <input
        type="text"
        id="email"
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        placeholder="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />



      <label htmlFor="password">password</label>
      <input
        type="text"
        id="password"
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        placeholder="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />

      <button
        onClick={onSignup}
        className ='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'
      > 
      {ButtonDisable ? "No Signup" : "Signup"}
      </button>

      <Link href="/login">Visit login page</Link>

    </div>
  );
}
