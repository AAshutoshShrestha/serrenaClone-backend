// singleton pattern
require('dotenv').config()
const userService = require("./user.service");

// plugin for validation: joi, youp, zod, ajv, class-validator
// backend: joi 	frontend: yup

class userController{
	userCreate = async (request, responce,next)=>{
		try {
			// mapping
			const { data, singleUpload, multipleUpload } = await userService.transformUserCreate(request);
			
			// data storing to DB
			const user = await userService.storeUser(data);
			
			// Notification : SMS, Email, Push notification
			await userService.sendActivationEmail({to : user.email, name: user.name,token : user.activationToken})
			

			responce.json(
				{
					result : {
						data:{
							_id : user._id,
							name : user.name,
							email : user.email,
							address : user.address,
							activationToken : user.activationToken,
							activeFor : user.activeFor,
							phone : user.phone,

						},
						file : singleUpload,
						files : multipleUpload
					},
					message : "New user Created",
					meta: null
		
				}
			)
		} catch (exception) {
			next(exception)
		}
		
	}

	getallUsers = (request, responce)=>{
		
		const data = request.body;

		responce.status(200).json({
			result : data,
			message : "All users from DB",
			meta: {}	//num,array,object

		})
	}

	userbyID = (request,responce)=>{
		const params = request.params;
		const query = request.query;

		responce.status(200).json({
			result : {
				params:params,
				query:query
			},
			message : "user data by id",
			meta: {}	//num,array,object

		})

	}

	updateUserById =(request,responce)=>{
		const params = request.params;
		const query = request.query;

		responce.status(200).json({
			result : {
				params:params,
				query:query
			},
			message : "Updated user by id "+params.id,
			meta: {}	//num,array,object

		})

	}

	deleteUserById =(request,responce) =>{
		const params = request.params;
		const query = request.query;

		responce.status(200).json({
			result : {
				params:params,
				query:query
			},
			message : "User deleted with id "+params.id,
			meta: null	//num,array,object
		})
	}
}

const userCTRL = new userController()

module.exports = userCTRL;