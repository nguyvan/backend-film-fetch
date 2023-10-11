import { appError } from "@/constants/error.constant";
import { DB, DatabaseFactory } from "@/services/databases/database-factory";
import { AppError } from "@/errors/app.error";
import { S3Factory } from "@/services/file-storage/s3-factory";
import { Request, Response, NextFunction } from "@/types/express";
import { StatusCodes } from "http-status-codes";
import { typeS3 } from "@/constants/type.constant";

export const getService = (req: Request, _: Response, next: NextFunction) => {
	try {
		const db = DatabaseFactory.getDatabase(DB.MONGODB);
		if (db) {
			req.db = db;
		} else {
			DatabaseFactory.setDatabase(DB.MONGODB);
			req.db = DatabaseFactory.getDatabase(DB.MONGODB);
		}

		const s3 = S3Factory.getS3(typeS3.GOOGLE_CLOUD);
		if (s3) {
			req.s3 = s3;
		} else {
			S3Factory.setS3(typeS3.GOOGLE_CLOUD);
			req.s3 = S3Factory.getS3(typeS3.GOOGLE_CLOUD);
		}
		next();
	} catch {
		throw new AppError({
			name: appError.SERVICE_NOT_FOUND,
			details: `cannot get service`,
			message: `cannot get service`,
			statusCode: StatusCodes.NOT_FOUND,
			origin: "middleware get service",
		});
	}
};
