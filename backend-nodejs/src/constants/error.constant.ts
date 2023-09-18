export enum databaseError {
	CONNECTION_ERROR = "CONNECTION_ERROR",
	DISCONNECTION_ERROR = "DISCONNECTION_ERROR",
	MODEL_NOT_FOUND = "MODEL_NOT_FOUND",
	INTERNAL_ERROR = "INTERNAL_ERROR",
	DATABASE_NOT_FOUND = "DATABASE_NOT_FOUND",
	INIT_DATABASE_ERROR = "INIT_DATABASE_ERROR",
	RETRIEVE_ERROR = "RETRIEVE_ERROR",
	INSERT_ERROR = "INSERT_ERROR",
	UPDATE_ERROR = "UPDATE_ERROR",
	DELETE_ERROR = "DELETE_ERROR",
}

export enum appError {
	SERVICE_NOT_FOUND = "SERVICE_NOT_FOUND",
	INTERNAL_ERROR = "INTERNAL_ERROR",
	BAD_REQUEST = "BAD_REQUEST",
	CONFLICT = "CONFLICT",
	NOT_FOUND = "NOT_FOUND",
	UNAUTHORIZED = "UNAUTHORIZED",
	AUTHORIZATION_FAILED = "AUTHORIZATION_FAILED",
	INVALID_FILE = "INVALID_FILE",
	SOCKET_ERROR = "SOCKET_ERROR",
}