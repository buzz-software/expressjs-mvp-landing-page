


exports.development = {
	"redis":  {
		"host": "localhost",
		"port": 6379,
		"username": null,
		"password": null
	}
}

exports.production = {
	"redis":  {
		"host" : process.env.REDIS_HOST,
		"port" : process.env.REDIS_PORT,
		"username": null,
		"password": null
	}
}
