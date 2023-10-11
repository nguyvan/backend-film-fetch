import { appError } from "@/constants/error.constant";
import { StatusCodes } from "http-status-codes";

interface ErrorProperty {
	name: appError;
	message: string;
	statusCode: StatusCodes;
	details: string | string[];
	origin: string;
}

export class AppError extends Error {
	public details: string | string[];
	public origin: string;
	public name: string;
	public statusCode: StatusCodes;

	constructor({ name, message, details, origin, statusCode }: ErrorProperty) {
		super(message);
		this.name = name;
		this.statusCode = statusCode;
		this.details = details;
		this.origin = origin;
	}
}
