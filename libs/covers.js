const path = require("path");
const multer = require("multer");

let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./covers/");
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
});

const coversUpload = multer({storage: storage}).single("cover");

module.exports = coversUpload;