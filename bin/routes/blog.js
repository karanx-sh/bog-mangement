const router = require('express').Router();
const blogController = require('../controllers/blog');

// To add new blog 
router.post("/AddBlog",blogController.uploadImage.single('img'),blogController.resizeImages,blogController.addBlog);

// To get all blogs
router.get("/getAllBlogs",blogController.getBlogs);

module.exports = router;