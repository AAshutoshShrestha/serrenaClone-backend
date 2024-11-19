const express = require("express");
const cors = require("cors");

// load db config
require("./db.config");

const router = require("../router/router.config");

const app = express();

// Configure CORS
const corsOptions = {
	// Allow requests from your domain
	origin: [
		"http://localhost:3000",
		"https://bijaythapa.shresthaaashutosh.com.np"
	], 			
	methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
	allowedHeaders: ["Content-Type", "Authorization", "cache-control"], // Add 'cache-control' here
};

app.use(cors(corsOptions));
app.options("*", cors()); // Enable preflight requests for all routes

app.use("/assets", express.static("./public/uploads"));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router mount
app.use(router);

app.use((req, res, next) => {
	// 404
	next({ status: 404, message: "Resource not found." });
});

// Error handler middleware
app.use((error, req, res, next) => {
	console.log(error);

	let status = error.status || 500;
	let message = error.message || "Server error....";
	let result = error.detail || null;

	if (error.code && +error.code === 11000) {
		status = 422;
		message = "Validation Failed";
		let msg = {};
		Object.keys(error.keyPattern).map((field) => {
			msg[field] = `${field} should be unique`;
		});

		result = msg;
	}

	res.status(status).json({
		result: result,
		meta: null,
		message: message,
	});
});

module.exports = app;
