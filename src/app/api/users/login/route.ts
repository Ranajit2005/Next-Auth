import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connect();      //connecting to the database

export async function POST(request: NextRequest) {
    try{

        //getting the token from the request body
        const reqBody = await request.json();
        const { email, password } = reqBody; //destructuring the token from the request body
        console.log(reqBody);

        const user = await User.findOne({email})    //find the user on the basis of email

        if(!user){  //if user is not found
            return NextResponse.json({error: "User does not exists"}, {status: 400})
        }
        console.log("User found");


        const validPassword = await bcryptjs.compare(password, user.password) //We bcript the user's password from database and then we comparing it with the password

        if(!validPassword){      //if the password is not valid
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }

        
        const tokenData = { 
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"}) //creating a token with the user data
        
        const response = NextResponse.json({message: "Login successful",success :true }) 

        //When user login, we set some cookies in his browser
        response.cookies.set("token", token, {
            httpOnly: true,
        })  //cookies set as key value pair. Here key is "token" and value is token. httpOnly is true so that the token is not accessible by the client side javascript

        return response


    }catch(error: any){

        return NextResponse.json({error: error.message}, {status: 500})

    }
}