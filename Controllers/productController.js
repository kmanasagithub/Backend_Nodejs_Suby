const Firm = require("../models/Firm");
const Product = require("../models/Product");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Uploads directory
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // File name
    }
  })
  
const upload =  multer({storage:storage});

const addProduct = async(req,res) => {
    try{
        let {productName,price,category,bestSeller,description}  = req.body;
        const image = req.file? req.file.filename : undefined;

        const firmId = req.params.firmId;
        const firm  = await Firm.findById(firmId);

        if(!firm){
            return res.status(400).json({error:"No Firm Found"});
        }

        const product = new Product({
            productName,price,category,image,bestSeller,description,firm:firm._id
        })

        const savedProduct = await product.save();
        firm.products.push(savedProduct);
        await firm.save();

        res.status(200).json(savedProduct);
    }
    catch(error){
      console.log("Error:" +error);
      res.status(500).json({message:"Internal Server error"})
    }
}

const getProductByFirm = async(req,res) => {
  try{
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if(!firm){
      return res.status(400).json({error:"No Firm Found"})
    }

    const restaurantName = firm.firmName
    const products = await Product.find({firm:firmId})
    res.status(200).json({restaurantName,products});

  }
  catch(error){
    console.log("Error:" +error);
    res.status(500).json({message:"Internal Server error"})
  }
}

const deleteProductById = async(req,res) => {
  try{
    const productId = req.params.productId;
    const deleteProduct = await Product.findByIdAndDelete(productId);

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

module.exports = {addProduct: [upload.single('image'),addProduct],getProductByFirm,deleteProductById};