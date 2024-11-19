const fs = require('fs');
const supabase = require('../config/supabase.config');


const deleteFileFromServer = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

const deleteFileFromSupabase = async (bucket, filePath) => {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) {
        throw new Error(`Error deleting file from Supabase: ${error.message}`);
    }
};

const deleteFile = async (bucket, filePath) => {
    try {
        // Delete file from Supabase
        await deleteFileFromSupabase(bucket, filePath);

        // Optionally, delete file from local server (if applicable)
        deleteFileFromServer(`./public/uploads/${filePath}`);
    } catch (error) {
        console.error('Error deleting file:', error.message);
        throw error;
    }
};


const randomString = (length) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const len = chars.length;
    let random = "";
    for(let i =0; i < length; i++) {
        const postn = Math.ceil(Math.random() * (len-1));
        random += chars[postn]
    }
    return random;
}


module.exports = {
    randomString,
    deleteFile
}
