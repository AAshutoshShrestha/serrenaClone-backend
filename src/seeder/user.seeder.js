const bcrypt = require("bcryptjs");
require("../config/db.config")
const userService = require("../modules/users/user.service");
const UserModel = require("../modules/users/user.model");

const seeduser = async () => {
	try {
		const users = [
			{
				name: "SuperAdmin",
				role: "admin",
				email: "superadmin@serrena.com",
				password: bcrypt.hashSync("Serrena@123_", 10),
				status: "active"
			}
		]

		for(let user of users){
			const existing = await userService.getSingleUserByFilter({email:user.email});
			if(!existing){
				await userService.storeUser(user)
			}
		}

	}catch(exception) {
		console.log(exception);
	} finally {
		process.exit(1);
	}
}

seeduser()