import dotenv from "dotenv";

dotenv.config();

export const S3_CONFIG = {
	GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID as string,
	GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL as string,
	GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY as string,
	GOOGLE_BUCKET: process.env.GOOGLE_BUCKET as string,

	MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY as string,
	MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY as string,
	MINIO_ENDPOINT: process.env.MINIO_ENDPOINT as string,
	MINIO_BUCKET: process.env.MINIO_BUCKET as string,
	MINIO_REGION: process.env.MINIO_REGION as string,
};
