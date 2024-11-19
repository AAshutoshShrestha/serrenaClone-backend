const mongoose = require('mongoose');
const { GeneralStatus } = require('../../config/constants');

const MenuSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        min: 2
    },
    urlPath: {
        type: String, 
        required: true
    },
    status: {
        type: String, 
        enum: [...Object.values(GeneralStatus)],
        default: GeneralStatus.INACTIVE
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    }
}, {
    timestamps: true, 
    autoCreate: true, 
    autoIndex: true
})

const MenuModel = mongoose.model("Menu", MenuSchema)
module.exports = MenuModel;