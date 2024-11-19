require('dotenv').config()
const { deleteFile } = require('../../utilities/helpers');
const ProductModel = require('./Product.model')
const ProductService = require('./Product.service')


class ProductController{
	#id;
	#Product;
	#validateID = async (req) =>{
		try {
			this.#id = request.params.id

			this.#Product = await ProductService.getSingleProductByFilter({
				_id : filter
			})
			if(!this.#Product){
				throw {status:404,meassage : "Product not found"}
			}
			
		} catch (error) {
			throw error
		}
	}

	createProduct = async (request,responce,next) => {
		try {
			const { data, singleUpload, multipleUpload } = await ProductService.transformProductCreate(request)

			const Product = await ProductService.storeProduct(data)
			
			responce.status(200).json(
				{
					result:{
						data: Product,
						file : singleUpload,
						files : multipleUpload
					},
					message : "New Product Created with name "+data.Name,
					meta: null
				}
			)
		} catch (exception) {
			console.log(" Product controller | createProduct | Error ");
			next(exception)
		}

	}

	index = async (request, responce,next)=>{
		try {
			// pagination / limits
			const page = +request.query.page || 1;
			const limit = +request.query.limit || 10;
			const skip = (page - 1) * limit;
			const sorting = {_id: "asc"}  //desc

			// search data
			let filter = {};
			if(request.query.search){
				filter = {
					$or:[
						{Name: new RegExp(request.query.search, 'i')},
						{Status: new RegExp(request.query.search, 'i')},
					]
				}
			}

			const {data,count} = await ProductService.listALlProductData({
				limit :limit,
				skip : skip,
				sort : sorting,
				filter : filter
			})

			
			responce.status(200).json({
				result : data,
				message : "List of all Product from DB",
				meta: {
					currentPage : page,
					total:count,
					limit:limit,
					totalPage: Math.ceil(count/limit)

				}	//num,array,object

			})
		} catch (exception) {
			console.log(exception)
			console.log(" Product controller | index | Error ");
			next(exception)
		}
		
	}

	show = async (request,responce,next)=>{
		try {
			await this.#validateID(request)

			responce.status(200).json({
				result : this.#Product,
				message : "Product detail",
				meta: {}	//num,array,object

			})
	
		} catch (exception) {
			next(exception)
		}
		

	}

	update = async (request,responce,next)=>{
		try {
			await this.#validateID(request)

			const data =request.body
			if(request.file){
				data.image = request.file.filename
			}

			const result = await ProductService.updateByID(this.#id,data)

			if(request.file){
				deleteFile("./public/uploads/Product" + result.logo)
			}
			

			responce.status(200).json({
				result : data,
				message : "Updated Product",
				meta: {}	//num,array,object

			})
		} catch (error) {
			next(error)
		}
		

	}

	// delete Product by ID
	delete =async (request,responce) =>{
		try {
			await this.#validateID(request)
			const responce = await ProductService.deleteByID(this.#id)

			if(responce.file){
				deleteFile("./public/uploads/Product" + responce.logo)
			}

			responce.json({
				result : null,
				message : "Product deleted succesfully",
				meta: null	//num,array,object
			})
		} catch (error) {
			next(error)
		}
		
	}

	getBySlug = async (request,responce,next) =>{
		try {
			const slug = request.params.Slug;
			const Product = await ProductService.getSingleProductByFilter({
				Slug : slug
			})

			if(Product){
				throw {status:404,meassage : "Product not found"}
			}
			// todo : fetch product list by Product

			responce.status(200).json({
				result : {
					detail: Product,
					product : null,
				},
				message : "Product detail with products",
				meta: {
					total:0,
					currentPage : 1,
					limit:10,
					totalPage: 0

				}	//num,array,object

			})

		} catch (exception) {
			next(exception)
		}
	}
}

const ProductCTRL = new ProductController
module.exports = ProductCTRL;