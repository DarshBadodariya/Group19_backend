require('dotenv').config()
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const User = require("./models/user");
const fileUpload=require('express-fileupload');

app.use(fileUpload({
    useTempFiles : true,
    //tempFileDir : '/tmp/'
}));


const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userprof");
const productRoutes = require("./routes/product");
const userfav = require("./routes/userfav")
const uploadRoutes=require('./routes/upload');


mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() =>{
    console.log("DB CONNECTED")
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


app.use("/api", authRoutes);
app.use("/api/userprof", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api",userfav)
app.use("/api",uploadRoutes);


const port = process.env.PORT || 4001;
//Starting a server 
app.listen(port, () =>{
    //collection = DATABASE.db("sample_mflix").collection("movies");
    console.log(`app is running at ${port}`);
})