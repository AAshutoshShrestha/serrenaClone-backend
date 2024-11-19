const menuSvc = require("./menu.service");

class MenuController {
	#id;
	#menu;

	/**
	 * This function is used to create the menu detail.
	 * Only Admin user can create a menu
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 * @param {import("express").NextFunction} next
	 */
	create = async (req, res, next) => {
		try {
			const data = req.body;
			data.createdBy = req.authUser._id;

			const menu = await menuSvc.store(data);
			res.json({
				result: menu,
				message: "Menu created successfully",
				meta: null,
			});
		} catch (exception) {
			console.log("MenuController | create | exception", exception);
			next(exception);
		}
	};

	index = async (req, res, next) => {
		try {
			const sorting = { _id: "asc" };

			// Default filter to get only active items
			let filter = {};

			if (req.query.search) {
				filter = {
					$or: [
						{ status: new RegExp(req.query.search, "i") }, // Optional search within status field
						{ name: new RegExp(req.query.search, "i") },
					],
				};
			}

			// Fetch data based on filter and sorting
			const { data, count } = await menuSvc.listAllData({
				sort: sorting,
				filter: filter,
			});

			// Respond with the filtered menu data
			res.json({
				result: data,
				message: "Active Menu List",
				meta: {
					total: count,
				},
			});
		} catch (exception) {
			next(exception);
		}
	};


	#validateId = async (req) => {
		try {
			this.#id = req.params.id;
			this.#menu = await menuSvc.getSingleDataByFilter({
				_id: this.#id,
			});
			if (!this.#menu) {
				throw { status: 404, message: "Menu not found" };
			}
		} catch (exception) {
			throw exception;
		}
	};

	show = async (req, res, next) => {
		try {
			await this.#validateId(req);
			res.json({
				result: this.#menu,
				message: "Menu Detail",
				meta: null,
			});
		} catch (exception) {
			next(exception);
		}
	};

	update = async (req, res, next) => {
		try {
			await this.#validateId(req);
			const data = req.body;
			// this.#id, this.#menu
			const response = await menuSvc.updateById(this.#id, data);
			//
			res.json({
				result: response,
				message: "Menu Updated successfully",
				meta: null,
			});
		} catch (exception) {
			next(exception);
		}
	};

	delete = async (req, res, next) => {
		try {
			await this.#validateId(req);
			//
			const response = await menuSvc.deleteById(this.#id);
			res.json({
				result: null,
				message: "Menu deleted successfully.",
				meta: null,
			});
		} catch (exception) {
			next(exception);
		}
	};
}

module.exports = new MenuController();
