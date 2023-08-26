import mongoose from "mongoose";
import "dotenv/config";

const database = mongoose
	// @ts-ignore
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("😎Connected! to mongo DB");
		return "connected";
	})
	.catch((err) => {
		console.log("🐛error", err);
		return err;
	});

export default database;
