import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/DataFromToken";

connect(); //connecting to the database

export async function POST(request: NextRequest){
    
    const userId = await getDataFromToken(request); //get user id from the token
    const user = await User.findOne({_id: userId}).select("-password"); //find the user on the basis of user id from database. We use select("-password") to avoid sending the password in the response

    //If user is not found
    if(!user){
        return NextResponse.json({
            message: "User not found",
        })
    }

    //If user is found
    return NextResponse.json({
        message: "User found",
        data: user
    })

}