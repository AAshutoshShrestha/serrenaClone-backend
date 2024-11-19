require('dotenv').config()
const jwt = require("jsonwebtoken")
const userService = require('../modules/users/user.service')
const authService = require('../modules/auth/auth.service')

const checklogin = async(req, res, next) => {
    try{
        let token = req.headers['authorization'] || null
        if(!token) {
            throw {status: 401, message: "Token expected"}
        }
        // "Bearer token" => ["bearer", "token"]
        token = token.split(" ").pop();
        
        // PAT store 
        const pat = await authService.getPATDATA({accessToken: token});

        if(pat) {
            const data = jwt.verify(token, process.env.JWT_SECRET)

            // {sub: "useId", iat: timestamp, exp: timestamp}
            const userExists = await userService.getSingleUserByFilter({
                _id: data.sub
            })
    
            if(!userExists) {
                throw {status: 401, message:"User does not exists anymore"}
            } else {
                req.authUser = {
                    _id: userExists._id,
                    name: userExists.name,
                    email: userExists.email,
                    role: userExists.role,
                    image: userExists.image,
                    phone: userExists.phone, 
                    address: userExists.address, 
                    userProvier: userExists.userProvider,
                    userProviderId: userExists.userProviderId
                }
                req.currentSession = pat;
    
                next();
            }
        } else {
            // 
            throw {status: 401, message: "Token does not exists or broken"}
        }


    } catch(exception) {
        // TODO: Cleanup

        next({status: exception.status || 401, message: exception.message})
    }
}

module.exports = checklogin;