const router = require('express').Router();
const blogController = require('../controllers/blog');

const apiUrl = process.env.API;

// To add new blog 
router.post("/AddBlog",blogController.uploadImage.single('img'),blogController.resizeImages,blogController.addBlog);

// To get all blogs
router.get("/getAllBlogs",blogController.getBlogs);

// To remove the blog
router.post("/delete",blogController.remove);

// To remove all the blogs
router.get("/deleteAll",blogController.removeAll);


// manage blogs page
router.get("/manage",(req,res)=>{
    res.render('index',{api:apiUrl});
})

module.exports = router;