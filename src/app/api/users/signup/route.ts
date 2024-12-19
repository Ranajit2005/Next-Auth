import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest,NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from '@/helpers/mailer'

connect()  //this the connect function which we create in dbConfig

export async function POST(request: NextRequest){ //In next js, if we give POST function, means it acts as POST method

    //Now it may give error, so we create a try catch block
    try{

        const reqBody = await request.json()  //JSON data comes from the body
        const {username, email,password} = reqBody  //Here we extract those data
        console.log(reqBody);  

        const user = await User.findOne({email})    //Now we check that this email priveously exist or not

        if(user){   //If this email exits, then we return the msg and exits
            return NextResponse.json({error:"User already exists"},{status: 400})
        }

        //Now in user's password, we add salt for privacy maintain. Afater adding salt we cannot see user's password.
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt)   //After adding salt we store the hased password as a new user

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()  //Here we saved this new user
        console.log(savedUser);

        //Now verify the email
        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id })   //We bring this function from helper/mailer

        //If email verify successfully then we send a json responce and saved the user
        return NextResponse.json({
            message: "User registered successfully",
            success: true,
            savedUser
        })

    }catch(error:any){

        return NextResponse.json({error: error.massage},{status: 500})
        
    }

}