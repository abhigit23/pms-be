import http from "node:http";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import "express-async-errors";
import morgan from "morgan";
import associations from "./db/associations";
import connectDB from "./db/sequelize";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import preContractRouter from "./router/preContract";
import workInProgressRouter from "./router/workInProgress";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use("/api", preContractRouter, workInProgressRouter);

app.use(errorHandlerMiddleware);

const server = http.createServer(app);

const start = async () => {
	try {
		server.listen(8080, () => {
			console.log("Server running on http://localhost:8080");
		});
		await connectDB.authenticate();
		console.log("MySQL connected successfully");
		associations();
		connectDB.sync({ force: true });
	} catch (error) {
		console.log(error);
	}
};

start();
