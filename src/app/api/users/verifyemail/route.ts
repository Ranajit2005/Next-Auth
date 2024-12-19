import { connect } from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest,NextResponse } from 'next/server'

connect()   //connecting to the database

export async function POST(request: NextRequest){
    try{
        
        //getting the token from the request body
        const reqBody = await request.json()
        const { token } = reqBody   //destructuring the token from the request body
        console.log(token);

        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}}) //finding the user with the token and the expiry date greater than the current date

        if(!user){  //if the user is not found
            return NextResponse.json({error: "Token is invalid or has expired"},{status: 400})
        }
        console.log(user);

        //if the user is found then we update the user
        user.isVarified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined

        await user.save()   //saving the user

        //returning the response
        return NextResponse.json({message: "Email verified successfully",success: true},{status: 200})
        
    }catch(error: any){

        // if (error instanceof ApiError) {
        //     return NextResponse.json({ error: error.message }, { status: error.status });
        // }
        
        // // Handle unexpected errors
        // return NextResponse.json({ error: "Internal server error" }, { status: 500 });

        return NextResponse.json({error: error.message},{status: 500})

    }
}