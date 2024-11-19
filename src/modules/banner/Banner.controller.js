require('dotenv').config()
const bannerService = require('./Banner.service');
const { deleteFile } = require('../../utilities/helpers');


class BannerController{
	#id;
	#banner;
	#validateID = async (request) =>{
		try {
			this.#id = request.params.id

			this.#banner = await bannerService.getSingleBannerByFilter({
				_id : this.#id
			})
			if(!this.#banner){
				throw {status:404,meassage : "Banner not found"}
			}
			
		} catch (error) {
			console.log(" Banner controller | #validateID | Error ");
			throw error
		}
	}

	createBanner = async (request,responce,next) => {
		try {
			const { data, singleUpload, multipleUpload } = await bannerService.transformBannerCreate(request)

			const Banner = await bannerService.storeBanner(data)
			
			responce.status(200).json(
				{
					result:{
						data: Banner,
						file : singleUpload,
						files : multipleUpload
					},
					message : "New Banner Created with name "+data.name,
					meta: null
				}
			)
		} catch (exception) {
			console.log(" Banner controller | createBanner | Error ");
			next(exception)
		}

	}

	index = async (req, res, next)=>{
		try{
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;
            
            const sorting = {_id: "desc"}

            let filter = {};
            
            if(req.query.search) {
                filter = {
                    $or: [
                        {name: new RegExp(req.query.search, 'i')},
                        {status: new RegExp(req.query.search, 'i')}
                    ]
                }
            }
            const {data, count} = await bannerService.listALlBannerData({
                limit: limit, 
                skip: skip, 
                sort: sorting, 
                filter: filter
            })

            res.json({
                result: data, 
                message: "Banner List",
                meta: {
                    currentPage: page,
                    total: count, 
                    limit: limit, 
                    totalPages: Math.ceil(count/limit)
                }
            })
        } catch(exception) {
            next(exception)
        }
		
	}

	show = async (request,responce,next)=>{
		try {
			await this.#validateID(request)

			responce.status(200).json({
				result : this.#banner,
				message : "Banner detail",
				meta: {}	//num,array,object

			})
	
		} catch (exception) {
			console.log(" Banner controller | Show | Error ");
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

			const result = await bannerService.updateByID(this.#id,data)

			if(request.file){
				deleteFile("./public/uploads/Banner"+result.logo)
			}
			

			responce.status(200).json({
				result : data,
				message : "Updated Banner",
				meta: {}	//num,array,object

			})
		} catch (error) {
			console.log(" Banner controller | update | Error ");
			next(error)
		}
		

	}

	// delete Banner by ID
	delete =async (request,responce, next) =>{
		try {
			await this.#validateID(request)
			const responce = await bannerService.deleteByID(this.#id)

			if(responce.file){
				deleteFile("./public/uploads/Banner" + responce.image)
			}

			responce.status(200).json({
				result : null,
				message : "deleted Banner",
				meta: null

			})
		} catch (error) {
			console.log(" Banner controller | delete | Error ");
			next(error)
		}
		
	}

	getBySlug = async (request,responce,next) =>{
		try {
			const slug = request.params.Slug;
			const Banner = await bannerService.getSingleBannerByFilter({
				Slug : slug
			})

			if(Banner){
				throw {status:404,meassage : "Banner not found"}
			}
			// todo : fetch product list by Banner

			responce.status(200).json({
				result : {
					detail: Banner,
					product : null,
				},
				message : "Banner detail with products",
				meta: {
					total:0,
					currentPage : 1,
					limit:10,
					totalPage: 0

				}	//num,array,object

			})

		} catch (exception) {
			console.log(" Banner controller | getBySlug | Error ", exception)
			next(exception)
		}
	}


	listForHome = async(req, res, next) => {
        try {
            const {data} = await bannerService.listALlBannerData({
                limit: 10,
                skip: 0,
                sort: {_id: "desc"},
                filter: {
                    status: "active"
                }
            })
            res.json({
                result: data,
                message: "Banner listed successfully.",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }
}

const BannerCTRL = new BannerController
module.exports = BannerCTRL;