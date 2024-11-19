require('dotenv').config()
const BannerModel = require('./Banner.model');

class BannerService{
	transformBannerCreate = async (request) =>{
		const data = request.body;

		const singleUpload = request.file;  // for single file upload
		const multipleUpload = request.files;  // for multiple file uploads (array)

		if(request.file){
			data.image = request.file.filename
		}

		data.createdBy = request.authUser._id;

		return { data, singleUpload, multipleUpload };
		}
		
	storeBanner = async (data) => {
		try {
			const Banner = new BannerModel(data); // Creates a new user instance with the provided data.
			return await Banner.save(); // Saves the user to the database and returns the saved user object.
			
		} catch (exception) {
			// TODO: Implement cleanup logic if necessary.
			throw exception; // Throws the exception if an error occurs during the save operation.
		}
	};

	getSingleBannerByFilter = async (filter) =>{
		try {
			const data = await BannerModel.findOne(filter)
				.populate('createdBy',['_id','name','email','role'])
			return data;

		} catch (exception) {
			console.log(" Banner services | getSingleBannerByFilter | exception ");
			throw exception
		}
	}

	listALlBannerData = async({limit=10, skip=0, sort={_id: "desc"}, filter={}}) => {
		try {
			const data = await BannerModel.find(filter)
				.populate('createdBy',['_id','name','email','role'])
				.sort(sort)
				.skip(skip)
				.limit(limit)

			const count = await BannerModel.countDocuments(filter)

			return {data,count};

		} catch (exception) {
			console.log(" Banner services | listALlBannerData | exception ");
			throw exception
		}
	}

	updateByID = async (id,data)=>{
		try {
			const responce = await BannerModel.findByIdAndUpdate(id,{$set:data})
			return responce;
		} catch (exception) {
			console.log(" Banner services | updateByID | exception ");
			throw exception
		}
	}

	deleteByID = async (id)=>{
		try {
			const responce = await BannerModel.findByIdAndDelete(id)
			if(!responce){
				throw {status:404,meassage : "Banner not found"}
			}
			
			return responce;

		} catch (exception) {
			console.log(" Banner services | updateByID | exception ");
			throw exception
		}
	}
}

module.exports = new BannerService()