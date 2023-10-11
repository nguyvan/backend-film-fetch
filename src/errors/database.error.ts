import { databaseError } from "@/constants/error.constant";

interface ErrorProperty {
	name: databaseError;
	message: string;
	details: string | string[];
	origin: string;
}

export class DatabaseError extends Error {
	public details: string | string[];
	public origin: string;
	public name: string;

	constructor({ name, message, details, origin }: ErrorProperty) {
		super(message);
		this.name = name;
		this.details = details;
		this.origin = origin;
	}
}
