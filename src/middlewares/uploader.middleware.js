const multer = require('multer');
const { randomString } = require('../utilities/helpers');
const supabase = require('../config/supabase.config'); // Import your Supabase client

// Use multer memoryStorage to keep files in memory as Buffers
const memoryStorage = multer.memoryStorage();

const uploader = multer({
    storage: memoryStorage,
    fileFilter: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        const allowed = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'];

        if (allowed.includes(ext.toLowerCase())) {
            cb(null, true);
        } else {
            cb({ status: 400, message: 'File format not supported' }, false);
        }
    },
    limits: {
        fileSize: 3000000, // 3MB limit
    },
});

const setPath = (path) => {
    return (req, res, next) => {
        req.uploadPath = path;
        next();
    };
};

const uploadToSupabase = async (req, res, next) => {
    if (!req.file) return next();

    const { originalname, buffer } = req.file;

    if (!buffer) {
        return res.status(400).json({ error: 'File buffer is empty.' });
    }

    const ext = originalname.split('.').pop();
    const filename = randomString(35) + '.' + ext;

    try {
        // Upload the file to Supabase storage with the full path
        const { data, error } = await supabase.storage
            .from('serrena_clone')
            .upload(`${req.uploadPath}/${filename}`, buffer, {
                contentType: req.file.mimetype,
                cacheControl: '3600',
                upsert: false,
            });

        if (error) throw error;

        if (!data) {
            return res.status(500).json({ error: 'Upload failed, no data returned from Supabase.' });
        }

        // Store only the filename in MongoDB
        req.body.image = filename;  // Save just the filename, not the full path
        req.fileUrl = `${req.uploadPath}/${filename}`; // Full path for use in other places

        next();
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Failed to upload file to Supabase.' });
    }
};

module.exports = { uploader, setPath, uploadToSupabase };
