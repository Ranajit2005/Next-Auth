import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'

//This function will take the request object as an argument and will return the data from the token
export const getDataFromToken = (request: NextRequest) =>{

    try{

        const token = request.cookies.get("token")?.value || ""; //getting the token from the cookies. We use ? to avoid the error if there is no token in the cookies. If there is no token, then we set it as an empty string

        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!); //verifying the token with the secret key

        return decodedToken.id;    //returning the user id from the token

    }catch(error: any){
        throw new Error(error.message)
    }

}