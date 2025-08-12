import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password, name ,image,role} = req.body;
console.log(req.body)
  try { 
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    //hash the password  10 round hashing
    const hashedPassword = await bcrypt.hash(password, 10);

//create a new user if the user does not exist
    const newUser = await db.user.create({
      data: {
        email,      
        password: hashedPassword,
        name,
        role: role || UserRole.USER, // Default role
        image: image || null, // Optional image field
      },
    });
console.log("Newly created user ",newUser);
    // Generate JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("Generated JWT token: ", token);
    // Set cookie with token

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });
    // Respond with user data
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email, 
        name: newUser.name,
        role: newUser.role,
        image: newUser.image
      },
    });
    //201 for created
    //200 for success ok

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with token
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // Respond with user data
    res.status(200).json({
      success: true,
      message: "User Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error logging in" });
  }
};
export const logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("jwt",{
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    });
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Error logging out" });
  }
};
export const check = async (req, res) => {
  // console.log("Ckeck user : ", req.user);
  // This middleware is used to check if the user is authenticated
  // and to return the user information if authenticated.
 try {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ success:false,message: "Unauthorized - No token found" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await db.User.findUnique({
    where:{
      id:decoded.id
    },
    select:{
      id: true,
      email: true,
      name: true,
      role: true,
      image: true
    },
  })
  if(!user){
    return res.status(401).json({ success:false,message: "Unauthorized - User not found" });
  }
  // req.user = user;
  res.status(200).json({
    success: true,
    user: req.user, // User info attached by authMiddleware
    user,
  });
  
 } catch (error) {
   console.error("Check error:", error);
   res.status(500).json({ error: "Error checking authentication" });
 }
};
