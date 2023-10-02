import { S3_CONFIG } from "@/configs/s3.config";
import {
	Storage,
	Bucket,
	File,
	GetSignedUrlConfig,
} from "@google-cloud/storage";

import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import stream from "stream";
import fs from "fs";
import axios from "axios";
import { AppError } from "@/errors/app.error";
import { appError } from "@/constants/error.constant";
import { StatusCodes } from "http-status-codes";
import { typeURL } from "@/constants/type.constant";
import path from "path";
import { promisify } from "util";

export class S3GCPStorage {
	private readonly storage: Storage;
	private readonly bucket: Bucket;

	constructor() {
		this.storage = new Storage({
			projectId: S3_CONFIG.GOOGLE_PROJECT_ID,
			credentials: {
				client_email: S3_CONFIG.GOOGLE_CLIENT_EMAIL,
				private_key: S3_CONFIG.GOOGLE_PRIVATE_KEY,
			},
		});
		this.bucket = this.storage.bucket(S3_CONFIG.GOOGLE_BUCKET);
	}

	async getFiles() {
		return (await this.bucket.getFiles()).at(0) as File[];
	}

	async getSignedUrl(filename: string) {
		try {
			const options: GetSignedUrlConfig = {
				version: "v4",
				action: "read",
				expires: Date.now() + 60 * 60 * 24 * 1000,
			};
			return await this.bucket.file(filename).getSignedUrl(options);
		} catch {
			return null;
		}
	}

	uploadFile(dest: string, filename: string) {
		const file = this.bucket.file(dest);
		const passthroughStream = new stream.PassThrough();
		const readstream = fs.readFileSync(filename);
		passthroughStream.write(readstream);
		passthroughStream.end();
		passthroughStream.pipe(file.createWriteStream());
	}
}

export class S3MinioStorage {
	private readonly storage: S3;

	constructor() {
		this.storage = new S3({
			credentials: {
				accessKeyId: S3_CONFIG.MINIO_ACCESS_KEY,
				secretAccessKey: S3_CONFIG.MINIO_SECRET_KEY,
			},
			endpoint: S3_CONFIG.MINIO_ENDPOINT,
			region: S3_CONFIG.MINIO_REGION,
			forcePathStyle: true,
		});
	}

	async uploadFile(
		key: string,
		filename: string,
		type: typeURL = typeURL.URL
	): Promise<void> {
		try {
			if (type === typeURL.LOCAL) {
				await this.storage.putObject({
					ACL: "private",
					Key: key,
					Bucket: S3_CONFIG.MINIO_BUCKET,
					Body: fs.createReadStream(filename),
				});
			} else if (type === typeURL.URL) {
				const finished = promisify(stream.finished);
				const urlLocalFile = path.resolve(
					__dirname,
					"../../scripts/files",
					`film.${key.split(".")[1]}`
				);
				const writer = fs.createWriteStream(urlLocalFile, {
					flags: "w",
				});
				await axios
					.get(key, {
						responseType: "stream",
					})
					.then(async (response) => {
						response.data.pipe(writer);
						await finished(writer);
						await this.storage.putObject({
							ACL: "private",
							Key: key,
							Bucket: S3_CONFIG.MINIO_BUCKET,
							Body: fs.createReadStream(urlLocalFile),
						});
						fs.unlinkSync(urlLocalFile);
					});
			}
		} catch (err) {
			console.log(err);
			throw new AppError({
				name: appError.INTERNAL_ERROR,
				details: `cannot upload file`,
				message: `cannot upload file`,
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				origin: this.uploadFile.name,
			});
		}
	}

	async getFileUrl(key?: string): Promise<string | undefined> {
		try {
			if (key) {
				const command = new GetObjectCommand({
					Bucket: S3_CONFIG.MINIO_BUCKET,
					Key: key,
				});
				const url = await getSignedUrl(this.storage, command, {
					expiresIn: 60 * 60 * 24 * 3,
				});
				return url.replace("s3:9000", "192.168.1.72/s3");
			}
			return;
		} catch {
			throw new AppError({
				name: appError.INTERNAL_ERROR,
				details: `cannot get file url`,
				message: `cannot get file url`,
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				origin: this.getFileUrl.name,
			});
		}
	}

	async getS3() {
		return this.storage;
	}
}
