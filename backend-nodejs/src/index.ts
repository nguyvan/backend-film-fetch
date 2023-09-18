import http from "node:http";
import "reflect-metadata";
import { configurationApp } from "@/apis";
import { SocketService } from "@/services/socket/socket";

const PORT: number = 5000;

const start = async () => {
	const server = http.createServer(configurationApp());
	const socketService = new SocketService(server);
	socketService.init();
	server
		.listen(PORT, () => {
			console.log(`Server listening on ${PORT}`);
		})
		.on("error", (error) => {
			console.log(error);
			process.exit();
		});
};

start();
