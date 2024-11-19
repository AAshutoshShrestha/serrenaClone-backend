require('dotenv').config()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require("../users/user.model");
const userService = require("../users/user.service");
const { randomStr } = require('../../utilities/helpers');
const { GeneralStatus } = require('../../config/constants');
const authService = require("./auth.service");

class AuthController{
	activateuser = async (req,res,next) =>{
		try {
			const token = req.params.token;
			const user = await authService.validateActivationToken(token)

			const tokenCreatedAt = user.activeFor.getTime()
			const today = Date.now()

			if(tokenCreatedAt < today){
				throw {status: 400, detail:{token:"expired"}, message:"Token expired"}
			}

			// to activate
			user.activationToken = null;
			user.activeFor = null;
			user.status = GeneralStatus.ACTIVE; 

			await user.save()
			// notify email
			await authService.sendPostActiveNotification({to:user.email, name:user.name})

		}catch (exception) {
			console.log(" auth controller | activateuser | Error ");
			next(exception)
		}
	}

	resendActivationToken = async(req,res,next) =>{
		try {
			const token = req.params.token;
			const user = await authService.validateActivationToken(token)
			user.activationToken = randomStr(100)
			user.activeFor = new Date(Date.now() + (3*60*60*1000))

			await user.save()

			await userService.sendActivationEmail({
				to : user.email,
				name: user.name,
				token : user.activationToken,
				sub : "Re-activate your account"})
			
			res.json({
				result:null,
				message:"a new activation link has been forwarded to your mail for action process, Please process Further"
			})

		} catch (exception) {
			console.log(" auth controller | resendActivationToken | Error ");
			console.log(exception);
			next(exception)
		}
	}

	LoginUser = async (req,res,next)=>{
		try {
			const {email,password} = req.body
			const userExists = await userService.getSingleUserByFilter({
				email:email
				})

			if(!userExists){
				throw {status:400, message:"Invalid credentials provided"}
			}
			
			if(userExists && userExists.status === GeneralStatus.ACTIVE){
				if(bcrypt.compareSync(password, userExists.password)){
					// user access granted
					// jwt token generation
					const token = jwt.sign({
						sub: userExists._id,
						type:"access", 
					}, process.env.JWT_SECRETE,{
						expiresIn: '1h'
					})

					const refreshToken = jwt.sign({
						sub: userExists._id,
						type:"refresh",
					}, process.env.JWT_SECRETE,{
						expiresIn: '1day'
					})

					// pat table populate
					await authService.PopulatePat(userExists._id,{token,refreshToken})

					res.json({
						result: {
							userDetail:{
								_id: userExists._id,
								name: userExists.name,
								email: userExists.email,
								role: userExists.role,
								image: userExists.image
							},
							token:{
								accessToken: token,
								refreshToken: refreshToken,
							}
						},
						message:"You have been succesfully loggedIn"
					})
				}else{
					throw {status:400, message:"Credentials Doesnot Match"}

				}
				
			}else{
				throw {status:400, message:"User is not Activated yet. Please Check your mail to activate and continue"}
			}

		} catch (exception) {
			console.log(" auth controller | LoginUser | Error ");
			console.log(exception);
			next(exception)
		}
	}

	getLoggedInUser = async (req,res,next) => {
		try {
			res.json({
				result: req.authUser,
				meta:null,
				message: "Your profile"
			})
		} catch (exception) {
			console.log(" auth controller | getLoggedInUser | Error ");
			console.log(exception);
			next(exception)
		}
	}

	logout = async (req,res,next) => {
		try {
			const authUser = req.authUser;
			const currentPat = req.currentSesson;

			const query = req.query.logout || null

			if(query === 'all'){
				await authService.deletePAT({
					userId: authUser._id
				})
			}else{
				await authService.deletePAT({
					_id:currentPat._id
				})
			}

			res.json({
				result: null,
				meta:null,
				message: "Logout Successfully"
			})
		} catch (exception) {
			console.log(" auth controller | LoginOut | Error ");
			console.log(exception);
			next(exception)
		}
	}
}

module.exports = new AuthController() 