const vendorController = require("../Controllers/vendorController");
const express = require("express");
const router = express.Router();

router.post('/register',vendorController.vendorRegistor);
router.post('/login',vendorController.vendorLogin);
router.get('/vendors',vendorController.getAllVendors);
router.get('/:id',vendorController.getVendorById);


module.exports = router;