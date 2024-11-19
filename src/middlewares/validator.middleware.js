const { deleteFile } = require("../utilities/helpers");

const bodyValidator = (schema) => {
    return async (req, res, next) => {
        try{
            let data = req.body;

            if(req.file) {
                // for single upload 
                data[req.file.fieldname] = req.file.filename
            } 
            
            // for multiple upload 
            else if(req.files) {
                const files = req.files;
                let uploadedFiles = {};
                files.map((file) => {
                    if(uploadedFiles.hasOwnProperty(file.fieldname)) {
                        uploadedFiles[file.fieldname].push(file.filename);
                    } else {
                        uploadedFiles[file.fieldname] = [file.filename]
                    }
                })

                data = {
                    ...data, 
                    ...uploadedFiles
                }

            }

            await schema.validateAsync(data, {abortEarly: false});
            // succcess
            next()
        } catch(exception) {
            const detail = {};

            // fail
            // image upload 
            // dleete image 
            if(req.file) {
                deleteFile("./"+req.file.path)
            } else if(req.files) {
                req.files.map((file) => {
                    deleteFile("./"+file.path)
                })
            }
            // console.log(exception)
            // details 
            exception.details && exception.details.map((error) => {
                // console.log(error)
                detail[error.context.label] = error.message
            })
            next({status: 422, message: "Validation Failed", detail: detail})
        }
    }
}

module.exports = {
    bodyValidator
}