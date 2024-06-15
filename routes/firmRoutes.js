const express = require("express");
const firmController = require("../Controllers/FirmController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router()

router.post("/add-firm",verifyToken,firmController.addFirm);

router.get('/uploads/:imageName',(req,res) => {
    const imageName = req.params.imageName;
    res.headersSent('Cintent-Type','image/jpg');
    res.sendFile(path.join(__dirname,'..',uploads,imageName));
})

router.delete("/:firmId",firmController.deleteFirmById);

module.exports = router;

