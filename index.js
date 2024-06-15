const express = require("express")
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes")
const bodyParser = require('body-parser')
const firmRoutes = require("./routes/firmRoutes")
const productRoutes = require("./routes/productRoutes")
const path = require('path');

const app = express()
const port= process.env.PORT || 8000;

dotEnv.config()

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connection Successful"))
.catch(err => console.log(err));

app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));

app.get("/",(req,res) => {
    res.send('<h1>Welcome to Suby</h1>')
})
app.listen(port,() => {
    console.log(`Server is listening at port ${port}`)
})