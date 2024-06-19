const Firm = require("../models/Firm");
const multer = require("multer")
const path = require("path")
const Vendor = require("../models/Vendor");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Uploads directory
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now() + path.extname(file.originalname)) // File name
    }
  })
  
const upload =  multer({storage:storage});

const addFirm = async(req,res) => {

    try{
        const {firmName,area,category,region,offer} = req.body;
        const image = req.file? req.file.filename : undefined;

        const vendor = await Vendor.findById(req.vendorId);
        if(!vendor){
            res.status(404).json({message:"Vendor not Found"})
        }

        if(vendor.firm.length>0){
          return res.status(400).json({message : "vendor Can have only One firm"})
        }

        const firm = new Firm({
            firmName,area,category,region,offer,image,vendor:vendor._id
        })
        const savedFirm = await firm.save();

        const firmId = savedFirm._id
        vendor.firm.push(savedFirm);
        await vendor.save()

        
        
        return res.status(200).json({message : "Firm Added Successfully",firmId})
    }
    catch(error){
        console.log(error)
        res.status(500).json("Internal Server Error")
    }
    
}

const deleteFirmById = async(req,res) => {
  try{
    const firmId = req.params.firmId;
    const deleteProduct = await Firm.findByIdAndDelete(firmId);

    if(!deleteProduct){
      return res.status(400).json({error:"No Product Found"})
    }

    res.status(400).json({message:"Deleted Successfully"})
  }
  catch(error){
    console.log("Error:" +error);
    res.status(500).json({message:"Internal Server error"})
  }
}
module.exports = {addFirm:[upload.single('image'),addFirm],deleteFirmById}