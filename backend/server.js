import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import expenseRoutes from "./src/routes/expenseRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/api", expenseRoutes);


app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
