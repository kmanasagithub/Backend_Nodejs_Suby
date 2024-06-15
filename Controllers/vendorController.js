const Vendor = require("../models/Vendor");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require("dotenv");

dotEnv.config();

const secretKey = process.env.WhatIsYourName

const vendorRegistor =async(req,res) => {
    const {Username,email,password} = req.body;
    try{
        const vendorEmail = await Vendor.findOne({email});

        if(vendorEmail){
            return res.status(400).join("Email already taken");
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const newVendor = new Vendor({
            Username,
            email,
            password : hashedPassword
        });

        await newVendor.save();

        res.status(201).json({message : "Vendor registered Successfully"});
        console.log('registered');

    }
    catch(err){
        console.error(err);
        res.status(500).json({err : "Internal server error"});
    }
}

const vendorLogin = async(req,res) => {
    const {email,password} = req.body;
    try{
        const vendor = await Vendor.findOne({email});
        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({error : "invalid username or password"})
        }
        const token = jwt.sign({vendorId : vendor._id},secretKey , {expiresIn : "1h" })
        res.status(200).json({success:"Login Successful"})
        console.log(email,"this is token",token);
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server Server"});
    }
}

const getAllVendors = async(req,res) => {
    try{
        const vendors= await Vendor.find().populate('firm');
        res.json({vendors})
    }
    catch(error){
        console.log(error);
        res.status(500).json({error : "Internal server error"});
    }
}

const getVendorById = async(req,res) => {
   
    try{
        const vendorId = req.params.id;
        const vendor = await Vendor.findById(vendorId).populate('firm');

        if(!vendor){
            return res.status(400).json({error: "Vendor not Found"});
        }
        res.status(200).json({vendor})
    }
    catch(error){
        console.log(error);
        res.status(500).json({error : "Internal server error"});
    }
    
}
module.exports = {vendorRegistor,vendorLogin,getAllVendors,getVendorById}