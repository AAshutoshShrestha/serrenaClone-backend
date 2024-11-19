const CollectionModel = require("./collection.model");

class CollectionService {
	store = async (data) => {
		try {
			const collection = new CollectionModel(data);
			return await collection.save();
		} catch (exception) {
			console.log("CollectionService | store | Exception", exception);
			throw exception;
		}
	};

    AllData = async ({ filter = {} }) => {
		try {
			// Fetch data with filtering, population, and sorting
			const data = await CollectionModel.find(filter)
				.populate("createdBy", ["_id", "image", "alt_text", "colSpan"]) // Ensure this matches your schema
				.sort({ _id: -1 }); // Sort in descending order
	
			// console.log('Data:', data); // Log the fetched data
			
			// Count total documents matching the filter
			const count = await CollectionModel.countDocuments(filter);
	
			return { count, data };
		} catch (exception) {
			console.error("CollectionService | AllData | exception:", exception); // Log the exception
			throw exception; // Rethrow the exception for handling in the controller
		}
	};

	getSingleDataByFilter = async (filter) => {
		try {
			const data = await CollectionModel.findOne(filter).populate("createdBy", [
				"_id",
				"image",
				"alt_text",
				"colSpan",
			]);
			return data;
		} catch (exception) {
			console.log(
				"CollectionService | getSingleDataByFilter | exception",
				exception
			);
			throw exception;
		}
	};

	updateById = async (id, data) => {
		try {
			const response = await CollectionModel.findByIdAndUpdate(
				id,
				{ $set: data },
				{ new: true }
			);
			return response;
		} catch (exception) {
			console.log("CollectionService | updateById | exception", exception);
			throw exception;
		}
	};

	deleteById = async (id) => {
		try {
			const response = await CollectionModel.findByIdAndDelete(id);
			if (!response) {
				throw { status: 404, message: "Collection does not exist" };
			}
			return response;
		} catch (exception) {
			console.log("CollectionService | deleteById | exception", exception);
			throw exception;
		}
	};
}

const collectionSvc = new CollectionService();
module.exports = collectionSvc;
