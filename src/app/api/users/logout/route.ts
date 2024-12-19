import { connect } from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';

connect();      //connecting to the database

export async function GET(request: NextRequest){

    try{

        const response = NextResponse.json({
            message : "Logout successfully",
            success: true
        })

        //while log out, we delete all cookies
        response.cookies.set("token","",{   //here "token" value set as empty ->""
            httpOnly: true,
            expires: new Date(0)
        })

        return response

    }catch(error: any){

        return NextResponse.json({error: error.message}, {status: 500})

    }

}