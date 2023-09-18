import { DBI } from "@/services/databases/database-factory";
import { S3GCPStorage, S3MinioStorage } from "@/services/file-storage/s3";
import {
	Request as RequestI,
	Response as ResponseI,
	NextFunction as NextFunctionI,
} from "express";

export interface Request extends RequestI {
	db?: DBI;
	s3?: S3GCPStorage | S3MinioStorage;
}

export interface Response extends ResponseI {}

export interface NextFunction extends NextFunctionI {}
