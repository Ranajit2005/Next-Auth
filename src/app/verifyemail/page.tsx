"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function VerifyEmailPage() {
  // const router = useRouter();

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

  const [token, setToken] = useState(""); //We are taking the token from the user
  const [verified, setVerified] = useState(false); //We are taking the verified from the user
  const [error, setError] = useState(false); //We are taking the error from the user

  const VerifyUseremail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token }); //We are sending the token to the backend. We post method because in verifyemail of backend we use post method

      setVerified(true); //If the email is verified then we set the verified to true
      setError(false); //If the email is verified then we set the error to false
    } catch (error: unknown) {
      setError(true);
      console.log("Email not verified");
      return {
        error : getErrorMessage(error),
      }
    }
  };

  useEffect(() => {
    //useEffect is used to run the function when the component is mounted

    //Using simple javascript how we can take token
    const urlToken = window.location.search.split("=")[1]; //We are taking the token from the url and it return an array and the 1st index gives the token
    setToken(urlToken || ""); //We are setting the token to the state

    //Using next js how we can take token
    // const { query } = router; //We are taking the query from the router
    // const urlToken = query.token; //We are taking the token from the query
    // setToken(Array.isArray(urlToken) ? urlToken[0] : urlToken || "");
    
  }, []);

  useEffect(()=>{
    
    setError(false);  //If the email is verified then we set the error to false
    if(token.length > 0){
      VerifyUseremail();
    }

  },[token])  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black">
        {token ? `${token}` : "No Token"}
      </h2>

      {verified && (    //If the email is verified then we show the verified message
        <div>
          <h2 className="text-2xl text-green-500">Email Verified</h2>
          <Link href="/login"></Link>
            
        </div>
      )}

      {error && (   //If the email is not verified then we show the error message
        <div>
          <h2 className="text-2xl text-red-500">Email Not Verified</h2>
        </div>
      )}
        
    </div>
  );
}
