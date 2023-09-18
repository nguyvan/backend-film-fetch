db.createUser({
	user: "fatcouple-anime",
	pwd: "fatcouple-anime121219*",
	roles: [
		{
			role: "readWrite",
			db: "fatcouple-db",
		},
	],
});
