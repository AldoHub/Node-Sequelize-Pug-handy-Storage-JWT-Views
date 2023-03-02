const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const tokenHandlerMiddleware = require("../middleware/tokenHandler");

router.get("/", postController.getAllPosts);
router.get("/post/:id", postController.getSinglePost);
router.post("/post/edit/:id" ,postController.updatePost);
router.get("/create", tokenHandlerMiddleware(), postController.showCreate);
router.post("/create", tokenHandlerMiddleware(), postController.createPost);
router.get("/delete/:id", postController.deletePost);

module.exports = router;
