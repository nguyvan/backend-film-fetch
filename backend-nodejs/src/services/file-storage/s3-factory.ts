import { typeS3 } from "@/constants/type.constant";
import { S3GCPStorage, S3MinioStorage } from "./s3";

type S3Storage = S3GCPStorage | S3MinioStorage;

export class S3Factory {
	private static readonly instance: Map<typeS3, S3Storage> = new Map<
		typeS3,
		S3Storage
	>();

	static getS3(type: typeS3) {
		return this.instance.get(type);
	}

	static setS3(type: typeS3) {
		switch (type) {
			case typeS3.GOOGLE_CLOUD:
				const s3GCPStorage = new S3GCPStorage();
				this.instance.set(type, s3GCPStorage);
				break;
			case typeS3.MINIO:
				const s3MinioStorage = new S3MinioStorage();
				this.instance.set(type, s3MinioStorage);
				break;
			default:
				return;
		}
	}
}
