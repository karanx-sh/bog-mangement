const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');
const multer = require('multer');
const sharp = require('sharp');
const Blog = require("../models/blog");
const CustomError = require('../custom/error');
const customError = require("../custom/errors");


const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('./uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, `${uniqid()}${file.originalname}`);
    }
});

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

