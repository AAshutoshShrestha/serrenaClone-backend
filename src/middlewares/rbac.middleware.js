const allowUser = (allowUserRoles) => {
    return (req, res, next) => {
        try {
            const loggedInUser = req.authUser || null;
            if(!loggedInUser) {
                throw {status: 401, message: "Login required"}
            }
            //

            if(loggedInUser.role === 'admin') {
                next()
            } else {
                if(
                    (typeof allowUserRoles === 'string' && allowUserRoles === loggedInUser.role)
                    ||
                    (Array.isArray(allowUserRoles) && allowUserRoles.includes(loggedInUser.role))
                ) {
                    next()
                } else {
                    throw {status: 403, message: "Unauthorizaed access"}
                }
            }
        } catch(exception) {
            next(exception)
        }
    }
}
module.exports = allowUser;