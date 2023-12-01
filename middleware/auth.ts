import { NextFunction, Request,Response } from "express"
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const Invalidtoken=require("../models/Invailedtoken");



interface CustomRequest extends Request{
    id: string | JwtPayload;
    role: string | JwtPayload;
}

//authenthicate user;
exports. authencateToken = async(req: Request, res: Response, next: NextFunction) => {
    try {
      //normal;
    const authHeader = req.header("Authorization");
    
    const token = authHeader && authHeader.split(" ")[1];

    //cookie jwt token;
    // const token = req.cookies.token;

    if (token == null){
        return res.status(401).json("You don't have right to access it!");
    }
        
    
    const key: Secret = (process.env.ACCESS_TOKEN_SECRET as Secret);
    //some how i have to handle invalid singnature request : done using try and catch;
    try {

        //checking if this token is present in the invalitoken collectiion or not;
        const tokenExists = await Invalidtoken.exists({ token });
        if (tokenExists) {
          return res.status(401).json({ message: "Token Expired or Invalid" });
        }
        const decoded = jwt.verify(token, key);
       
        req.body.user_id = (decoded as CustomRequest).id;
        req.body.role = (decoded as CustomRequest).role;
        
        next();
    } catch (err: unknown) {
        console.log("token is not good enough for the call...")
        return res.status(401).send(err);
    };
    } catch (err: unknown) {
        return res.status(401).send("token is missing!");
    }
    
}



