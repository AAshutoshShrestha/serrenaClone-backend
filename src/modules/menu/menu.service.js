const MenuModel = require("./menu.model")

class MenuService {
    store = async (data) => {
        try {
            const menu = new MenuModel(data)
            return await menu.save()
        } catch(exception) {
            console.log("MenuService | store | Exception ", exception)
            throw exception;
        }
    }

    listAllData = async({limit=10, skip=0, sort={_id: "desc"}, filter={}}) => {
        try {
            const data = await MenuModel.find(filter)
                .populate("createdBy", ["_id", "name", "email", "role"])
                .sort(sort)
                .skip(skip)
                .limit(limit)
            const count = await MenuModel.countDocuments(filter);

            return {count, data}
        } catch(exception) {
            console.log("MenuService | listAllData | exception ", exception)
            throw exception;
        }
    }

    getSingleDataByFilter = async(filter) => {
        try {
            const data = await MenuModel.findOne(filter)
                .populate("createdBy", ["_id", "name", "email", "role"])
            return data;
        } catch(exception) {
            console.log("MenuService | getSingleDataByFilter | exception ", exception)
            throw exception;
        }
    }

    updateById = async(id, data) =>{
        try {
            const response = await MenuModel.findByIdAndUpdate(id, {$set: data})
            return response;
        } catch(exception) {
            console.log("MenuService | UpdateById | exception ", exception)
            throw exception;
        }
    }

    deleteById = async(id) => {
        try {
            const response = await MenuModel.findByIdAndDelete(id);
            if(!response) {
                throw {status: 404, message: "Menu does not exists"}
            }
            return response;
        } catch(exception) {
            console.log("MenuService | deleteById | exception ", exception)
            throw exception;
        }
    }
}

const menuSvc = new MenuService()
module.exports=  menuSvc