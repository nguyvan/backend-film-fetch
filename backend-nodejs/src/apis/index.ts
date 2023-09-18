import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { getService } from "./middlewares/get-service.middleware";
import { CommonRoute } from "@/apis/routes/common.route";

export const configurationApp = () => {
	const app: Application = express();
	app.use(
		cors({
			credentials: true,
			methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
			exposedHeaders: ["set-cookie"],
		})
	);
	app.set("trust proxy", 1);
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use("/*", getService);
	app.disable("x-powered-by");
	CommonRoute.apply(app);
	return app;
};
