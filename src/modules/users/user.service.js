require("dotenv").config();
const bcrypt = require("bcryptjs");
const mailsvc = require("../../service/mail.service");
const { randomStr } = require("../../utilities/helpers");
const UserModel = require("./user.model");

class userService {
	/**
	 * Transforms the user creation request by processing uploaded files,
	 * hashing the password, and setting initial user status and activation token.
	 *
	 * @async
	 * @function transformUserCreate
	 * @param {Object} request - The request object containing user data.
	 * @param {Object} request.body - The body of the request containing user details.
	 * @param {Object} request.file - The file object if a single file is uploaded.
	 * @param {Object[]} request.files - The array of file objects if multiple files are uploaded.
	 * @returns {Promise<Object>} - A promise that resolves to an object containing the transformed user data, single upload file, and multiple upload files.
	 */
	transformUserCreate = async (request) => {
		const data = request.body;

		const singleUpload = request.file; // for single file upload
		const multipleUpload = request.files; // for multiple file uploads (array)

		if (request.file) {
			data.image = request.file.filename; // set image filename if single file is uploaded
		}

		// Password hashing
		data.password = bcrypt.hashSync(data.password, 10);
		data.status = "inactive";
		data.activationToken = randomStr(100); // generate a random activation token
		data.activeFor = new Date(Date.now() + 3 * 60 * 60 * 1000); // set active period for 3 hours

		// Return the transformed data and upload information
		return { data, singleUpload, multipleUpload };
	};

	/**
	 * Sends an activation email to the specified recipient with a provided activation token.
	 *
	 * @async
	 * @function sendActivationEmail
	 * @param {Object} params - The parameters for sending the activation email.
	 * @param {string} params.to - The recipient's email address.
	 * @param {string} params.name - The recipient's name.
	 * @param {string} params.token - The activation token.
	 * @param {string} [params.sub="Activate your account"] - The subject of the email.
	 * @returns {Promise<void>} - A promise that resolves when the email is sent.
	 * @throws {Error} - Throws an exception if there is an error sending the email.
	 */
	sendActivationEmail = async ({
		to,
		name,
		token,
		sub = "Activate your account",
	}) => {
		try {
			return await mailsvc.sendEmail({
				to: to,
				subject: sub,
				message: `
					<p>Dear ${name}</p>
					
					<p>Your account has been registered succesfully</p>
					<p>Please click the link bellow or copy paste the url in the browser for further process</p>

					<a href="${process.env.FRONTEND_URL}/activate/${token}">${process.env.FRONTEND_URL}/activate/${token}</a>
					<p>------------------------------------</p>
					<p>regards</p>
					<p>System Admin</p>
					<p>${process.env.SMTP_FROM}</p>
					<p>
						<small>
							<en>Please donot reply to this mail</en>
						</small>
					</p>
				`,
			});
		} catch (exception) {
			throw exception;
		}
	};

	/**
	 * Stores a new user in the database.
	 *
	 * @async
	 * @function storeUser
	 * @param {Object} data - The user data to be stored.
	 * @returns {Promise<Object>} - A promise that resolves to the saved user object.
	 * @throws {Error} - Throws an exception if there is an error saving the user.
	 */

	storeUser = async (data) => {
		try {
			const user = new UserModel(data); // Creates a new user instance with the provided data.
			return await user.save(); // Saves the user to the database and returns the saved user object.
		} catch (exception) {
			// TODO: Implement cleanup logic if necessary.
			throw exception; // Throws the exception if an error occurs during the save operation.
		}
	};

	getSingleUserByFilter = async (filter) => {
		try {
			const user = await UserModel.findOne(filter);
			return user;
		} catch (exception) {
			throw exception;
		}
	};

	ListAllByFilter = async (filter) => {
		try {
			// const list = await UserModel.find(filter, {
			// 	password: 0,
			// 	__v: 0,
			// 	activationToken: 0,
			// 	activeFor: 0,
			// 	createdAt: 0,
			// 	updatedAt: 0,
			// });

			const list = await UserModel.aggregate([
				{
					$match: {
						...filter
					},
				},
				{
					$lookup: {
						from: "Chats",
						localField: "_id",
						foreignField: "sender",
						as: "message",
					},
				},
				{
					$project: {
						_id: "$_id",
						name: "$name",
						email: "$email",
						image: "$image",
						role: "$role",
						status: "$status",
						message: "$message",
					},
				},
			]);
			return list;
		} catch (exception) {
			throw exception;
		}
	};

	listAllUser = async ({
		limit = 10,
		skip = 0,
		sort = { _id: "desc" },
		filter = {},
	}) => {
		try {
			const data = await UserModel.find(filter)
				.populate("createdBy", ["_id", "name", "email", "role"])
				.sort(sort)
				.skip(skip)
				.limit(limit);

			const count = await UserModel.countDocuments(filter);

			return { data, count };
		} catch (exception) {
			console.log(" Brand services | listALlBrandData | exception ");
			throw exception;
		}
	};
}

module.exports = new userService();
