const path= require("path");
const multer= require("multer");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './users/avatars')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()  + path.extname(file.originalname))
    }
});

const usersUpload= multer({storage: storage}).single("avatar");

module.exports= usersUpload;