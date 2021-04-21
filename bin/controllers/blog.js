const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');
const multer = require('multer');
const sharp = require('sharp');
const Blog = require("../models/blog");
const CustomError = require('../custom/error'); // Importing Custome Error class
const customError = require("../custom/errors"); // Importing Developer Defined Custom Errors


const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('./uploads')); // save the initial images in uploads folder 
    },
    filename: function (req, file, cb) {
        cb(null, `${uniqid()}${file.originalname}`); // rename the image with a unique ID + file name 
    }
});

// check the file format before saving....
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

exports.uploadImage = multer({
    storage: imageStorage,
    fileFilter: multerFilter
});

//******* INITIALIZING SHARP FOR IMAGE COMPRESSION *******\\
exports.resizeImages = async (req, res, next) => {
    try {
        if (!req.file) return next();
        req.body.images = [];
        let newFilename = `${new Date().toISOString().slice(0, 22).replace(/-/g, '').replace(/:/g, '').replace('.', '').replace('T', '')}`
                req.body.images.push({ url: `${newFilename}.webp`});
                await sharp(path.join(req.file.path))
                    .webp({ quality: 90 })
                    .toFile(path.join(`./uploads/blog/${newFilename}.webp`))
                fs.unlinkSync(path.join(req.file.path));
        next();
    }
    catch (error) {
        req.body.images = [];
        next(error);
    }
};

// addBlog controller add the blog details to the database
exports.addBlog = async(req,res) =>{
    try {
        if(!req.body.title || !req.body.description || !req.body.author) throw customError.dataInvalid;
        let blog = await Blog.create({
            title:req.body.title,
            description:req.body.description,
            author:req.body.author,
            images:req.body.images
        });
        return res.status(200).json({
            error:false,
            details:{
                message:"Blog Added Successfully",
            }
        })
        
    } catch (error) {
        console.log(`***** ERROR : ${req.originalUrl} ${error}`);
    return res.status(error.code||500).json({
      error: true,
      details: error,
    });
    }
}

// get all blogs.
exports.getBlogs = async(req,res) =>{
    try {
        let blog = await Blog.findAll();
        return res.status(200).json({
            error:false,
            details:{
                message:"Blogs",
                data:blog
            }
        })
        
    } catch (error) {
        console.log(`***** ERROR : ${req.originalUrl} ${error}`);
    return res.status(error.code||500).json({
      error: true,
      details: error,
    });
    }
}


// remove blog and blog images

exports.remove = async(req,res) =>{
    try {
        if(!req.body.id) throw customError.dataInvalid;
        let blog = await Blog.findByPk(req.body.id);
    fs.unlinkSync(path.join(`uploads/blog/`+blog.images[0].url));
        await blog.destroy();
        return res.status(200).json({
            error:false,
            details:{
                message:"Blog Deleted successfully"
            }
        })
        
    } catch (error) {
        console.log(`***** ERROR : ${req.originalUrl} ${error}`);
    return res.status(error.code||500).json({
      error: true,
      details: error,
    });
    }

}



// remove all images and blogs 

exports.removeAll = async(req,res)=>{
    try {
        let blog = await Blog.findAll();
        blog.map(async(b)=>{
            await b.destroy();
            fs.unlinkSync(path.join(`uploads/blog/`+b.images[0].url));
        });


        
fs.readdir(directory='uploads/blog/', (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
        return res.status(200).json({
            error:false,
            details:{
                message:"All Blogs Deleted successfully"
            }
        })
        
    } catch (error) {
        console.log(`***** ERROR : ${req.originalUrl} ${error}`);
    return res.status(error.code||500).json({
      error: true,
      details: error,
    });
    }
}