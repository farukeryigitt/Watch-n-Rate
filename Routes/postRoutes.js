const express = require("express");
const postController = require("../Controllers/postController.js");
const identifier = require("../Middlewares/identify.js")
const router = express.Router();

router.get("/get-all-posts" , postController.getallpost);
router.get("/get-post:_id" , postController.getonepost);
router.put("/update-post:_id" , identifier.identifier ,postController.updatepost);
router.post("/create-post" , identifier.identifier , postController.createpost);
router.delete("/delete-post:_id" , identifier.identifier, postController.deletepost );


module.exports = router ;