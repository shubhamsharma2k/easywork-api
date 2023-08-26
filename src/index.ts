import express from "express";
import database from "./config/db";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const db = database;

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send("hello");
});
app.use("/api/users", require("./routes/api/users"));
app.use("/api/student", require("./routes/api/student"));
app.use("/api/course", require("./routes/api/course"));
app.listen(PORT);
