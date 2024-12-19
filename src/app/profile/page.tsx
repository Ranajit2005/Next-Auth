"use client"
import React, {useState} from 'react'
import axios from 'axios'
import Link from 'next/link'
import {toast} from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {

  const router = useRouter()
  const [data,setData] = useState("nothing")

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
  
  const getUserDetails = async () => {
    try {
      
      const response = await axios.post("/api/users/me")
      console.log("Profile data", response.data.data._id)
      setData(response.data.data._id)
    } catch (error: unknown) {

      console.log("Profile data failed")
      return {
        error : getErrorMessage(error),
      }
      // toast.error(error.message)
    }
  }

  const logout = async () => {
    try {
      await axios.get("/api/users/logout")
      toast.success("Logout successfully")
      router.push("/login")

    } catch (error: unknown) {
      console.log("Logout failed")
      return {
        error : getErrorMessage(error),
      }
      // toast.error(error.message)

    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">

      <h1>Profile page</h1>
      <hr/>

      <h2>{data === "nothing" ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}</h2>
      <hr/>   {/* This Link goes to an dunamic paga.So now we create dynamic router for this. */}
      
      <button 
      className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mt-4 font-bold"
      onClick={getUserDetails}>
      Get User Details
      </button>

      <button 
      className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-700 mt-4 font-bold"
      onClick={logout}>
      Log Out
      </button>

    </div>
  )
}
