const router = require('express').Router();
const blogController = require('../controllers/blog');

router.post("/AddBlog",blogController.uploadImage.single('img'),blogController.resizeImages,blogController.addBlog);

router.get("/getAllBlogs",blogController.getBlogs);

module.exports = router;