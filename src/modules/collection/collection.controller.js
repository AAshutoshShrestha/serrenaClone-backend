const collectionSvc = require("./collection.service");
const { deleteFile } = require("../../utilities/helpers");
const supabase = require("../../config/supabase.config");

class CollectionController {
	#id;
	#collection;
	
	#validateId = async (req) => {
		try {
			this.#id = req.params.id;
			this.#collection = await collectionSvc.getSingleDataByFilter({
				_id: this.#id,
			});
			if (!this.#collection) {
				throw { status: 404, message: "Collection not found" };
			}
		} catch (exception) {
			throw exception;
		}
	};

	create = async (req, res, next) => {
		try {
			const data = req.body;

			// The file URL is already in req.body.image (set by uploadToSupabase middleware)

			// data.createdBy = req.authUser._id; // Assuming you want to add the user ID

			const collection = await collectionSvc.store(data);
			res.json({
				result: collection,
				message: "Collection created successfully",
				meta: null,
			});
		} catch (exception) {
			console.log("CollectionController | create | exception", exception);
			next(exception);
		}
	};

	index = async (req, res, next) => {
		try {
			// Construct filter object if there is a search query
			let filter = {};
			if (req.query.search) {
				filter = {
					$or: [
						{ name: new RegExp(req.query.search, "i") }, // Assuming `name` is a field in your database
					],
				};
			}
            
			// Retrieve data from service or directly from database
			const { data, count } = await collectionSvc.AllData({ filter });
			// Respond with the retrieved data
			res.json({
                result: data,
				message: "Collection List",
				meta: {
                    total: count,
				},
			});

		} catch (exception) {
			next(exception); // Pass error to error handling middleware
		}
	};

	show = async (req, res, next) => {
		try {
			await this.#validateId(req);
			res.json({
				result: this.#collection,
				message: "Collection Detail",
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

			// If there is an uploaded image, replace the existing one
			if (req.file) {
				// Delete the old image if it exists
				if (this.#collection.image) {
					deleteFile(`./public/uploads/collection/${this.#collection.image}`);
				}
				data.image = req.file.filename; // Update with the new filename
			}

			const updatedCollection = await collectionSvc.updateById(this.#id, data);
			res.json({
				result: updatedCollection,
				message: "Collection updated successfully",
				meta: null,
			});
		} catch (exception) {
			next(exception);
		}
	};

	delete = async (req, res, next) => {
		try {
			await this.#validateId(req);

			// Define the bucket name
			const bucketName =
				process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "Bijay_Thapa";

			// Delete the image file from Supabase and the local server
			if (this.#collection.image) {
				await deleteFile(bucketName, `collection/${this.#collection.image}`);
			}

			// Delete the collection item from the database
			await collectionSvc.deleteById(this.#id);
			res.json({
				result: null,
				message: "Collection deleted successfully.",
				meta: null,
			});
		} catch (exception) {
			next(exception);
		}
	};

	
}

module.exports = new CollectionController();
