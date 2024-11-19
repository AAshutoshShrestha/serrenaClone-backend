const mailsvc = require("../../service/mail.service")
const userService = require("../users/user.service")
const PatModel = require("./pat.model")

class AuthService{
	validateActivationToken = async (token) =>{
		try {
			if(!token){
				throw {status: 400, message:"token require for activation"}
			}

			const user = await userService.getSingleUserByFilter({
				activationToken:token
			})
			if(!user){
				throw {status: 400, message:"Token not found or broken or expired"}
			}
			return user
		} catch (error) {
			console.log("AuthService | validateActivationToken | Error ");
		}
	}


	sendPostActiveNotification = async ({to,name}) => {
		try {
			return await mailsvc.sendEmail({
				to : to,
				subject : "Account activated succesfully",
				message : 
				`
					<p>Dear ${name}</p>
					
					<p>your account has been activated </p>
					<p>------------------------------------</p>
					<p>regards</p>
					<p>System Admin</p>
					<p>${process.env.SMTP_FROM}</p>
					<p>
						<small>
							<en>Please donot reply to this mail</en>
						</small>
					</p>
				`
			})

		} catch (exception) {
			throw exception
		}
	}

	PopulatePat = async (userId,{token,refreshToken}) =>{
		try {
			const pat = new PatModel({
				userId: userId,
				accessToken: token,
				refreshToken: refreshToken,
			})
			return await pat.save()

		} catch (error) {
			throw error
		}
	}

	getPATDATA = async(filter) =>{
		try {
			const pat = await PatModel.findOne(filter)
			return pat
		} catch (error) {
			throw error
		}
	}

	deletePAT = async(filter) =>{
		try {
			return await PatModel.deleteMany(filter)
		} catch (exception) {
			throw exception;
		}
	}

}

module.exports = new AuthService()