import jwt from "jsonwebtoken";
import { db } from "../libs/db.js"; // Adjust the import path as necessary
export const authMiddleware = async (req, res, next) => { 
   try {
     const token = req.cookies.jwt;
    console.log("Auth middleware token : ",token)
    if (!token) {
        return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded; // Attach user info to request object
        // next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    const user = await db.user.findUnique({
        where: { id: decoded.id },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            image: true,
        }
    });
    console.log("Authmiddleware user : ",user)

    if (!user) {
        return res.status(404).json({ error: "Unauthorized - User not found" });
    }
    req.user = user; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler
    
   } catch (error) {
    console.error("Error Authenticating user:", error);
    res.status(500).json({ error: "Error Authenticating user" });
    
   }
};