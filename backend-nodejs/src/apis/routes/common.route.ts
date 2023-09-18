import express, { Router } from "express";
import { getService } from "../middlewares/get-service.middleware";
import { CommonController } from "../controllers/common.controller";

export class CommonRoute {
	static router: Router = express.Router();
	static apply(app: Router) {
		app.use("/", this.router);
		this.router.get("/movies", CommonController.getMovies);
		this.router.get("/episodes", CommonController.getEpisodes);
		this.router.get("/episode", CommonController.getEpisode);
		this.router.get("/session", CommonController.getSession);
		this.router.post("/session", CommonController.createOrUpdateSession);
	}
}
