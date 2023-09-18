import { typeS3 } from "@/constants/type.constant";
import { S3GCPStorage, S3MinioStorage } from "@/services/file-storage/s3";
import { S3Factory } from "@/services/file-storage/s3-factory";

export const getURL = async (
	storage: string,
	key: string
): Promise<string | null> => {
	switch (storage) {
		case typeS3.GOOGLE_CLOUD:
			try {
				return (
					(
						await (
							S3Factory.getS3(typeS3.GOOGLE_CLOUD) as S3GCPStorage
						).getSignedUrl(key)
					)?.at(0) ?? null
				);
			} catch {
				return null;
			}
		case typeS3.MINIO:
			try {
				return (
					(await (
						S3Factory.getS3(typeS3.MINIO) as S3MinioStorage
					).getFileUrl(key)) ?? null
				);
			} catch {
				return null;
			}
		default:
			return key;
	}
};
