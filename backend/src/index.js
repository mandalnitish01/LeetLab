import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookParser from "cookie-parser";


//imported all routes
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookParser());

// Auth routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

