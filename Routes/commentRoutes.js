const express = require("express");
const commentController = require("../Controllers/commentController.js");
const identifier = require("../Middlewares/identify.js")
const router = express.Router();

router.post("/create-comment:post_id" , identifier.identifier , commentController.createcomment);
router.delete("/delete-comment:_id" , identifier.identifier, commentController.deletecomment) ;
router.get("/get-comments:post_id" , commentController.getpostcomments);
router.get("/get-comment:_id" , commentController.getonecomment);


module.exports = router ;