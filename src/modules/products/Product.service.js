require('dotenv').config()
const ProductModel = require('./Product.model');

class ProductService{
	transformProductCreate = async (request) =>{
		const data = request.body;

		const singleUpload = request.file;  // for single file upload
		const multipleUpload = request.files;  // for multiple file uploads (array)

		if(request.file){
			data.image = request.file.filename
		}
		
		data.Slug = slugify(data.Name,{
			lower: true
		})

		data.createdBy = request.authUser._id;

		return { data, singleUpload, multipleUpload };
		}
		
	storeProduct = async (data) => {
		try {
			const Product = new ProductModel(data); // Creates a new user instance with the provided data.
			return await Product.save(); // Saves the user to the database and returns the saved user object.
			
		} catch (exception) {
			// TODO: Implement cleanup logic if necessary.
			throw exception; // Throws the exception if an error occurs during the save operation.
		}
	};

	getSingleProductByFilter = async (filter) =>{
		try {
			const data = await ProductModel.findOne(filter)
				.populate('createdBy',['_id','name','email','role'])
			return data;

		} catch (exception) {
			console.log(" Product services | getSingleProductByFilter | exception ");
			throw exception
		}
	}

	listALlProductData = async ({limit=10,skip=0,sort={_id:"desc"},filter={}}) =>{
		try {
			const data = await ProductModel.find(filter)
				.populate('createdBy',['_id','name','email','role'])
				.sort(sort)
				.skip(skip)
				.limit(limit)

			const count = await ProductModel.countDocuments(filter)

			return {data,count};

		} catch (exception) {
			console.log(" Product services | listALlProductData | exception ");
			throw exception
		}
	}

	updateByID = async (id,data)=>{
		try {
			const responce = await ProductModel.findByIdAndUpdate(id,{$set:data})
			return responce;
		} catch (exception) {
			console.log(" Product services | updateByID | exception ");
			throw exception
		}
	}

	deleteByID = async (id)=>{
		try {
			const responce = await ProductModel.findByIdAndDelete(id)
			if(!responce){
				throw {status:404,meassage : "Product not found"}
			}
			
			return responce;

		} catch (exception) {
			console.log(" Product services | updateByID | exception ");
			throw exception
		}
	}
}

module.exports = new ProductService()