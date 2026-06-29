const multer = require("multer");
const { CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "meet_up_profile",
        allowed_formats:["jpg","jpeg","png","webp"],
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 // 1 MB size is only allowed
    },
    fileFilter: (req, file, cb) => {

        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed."));
        }

    }
});

module.exports = upload;