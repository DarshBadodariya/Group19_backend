require('dotenv').config()
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require('express-fileupload')
const path=require('path')

const User = require("./models/user");

app.use(fileUpload({
    useTempFiles : true,
    //tempFileDir : '/tmp/'
}));
/*
app.use((req, res, next) => {
    console.log("user :  " + req.user + " ===== files : " + req.files);
    next();
})
*/

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userprof");
const productRoutes = require("./routes/product");
const uploadRoutes=require("./routes/upload");

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

app.use("/api",uploadRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/products", productRoutes);

<<<<<<< Updated upstream
var collection = mongoose.DATABASE("sample_mflix").collection("movies");

app.get("api/products/search", async (req, res) => {
    try {
        let result = await collection.aggregate([
            {
                "$search": {
                    "text": {
                        "query": `${req.body.search}`,
                        "path": "plot",
                        "fuzzy": {
                            "maxEdits": 2
                        }
                    },
                    "highlight": {
                        "path": "plot"
                    }
                }
            },
            //{
            //    "$addFields": {
            //        "highlights": {
            //            "$meta": "searchHighlights"
            //        }
            //    }
            //}
        ]).toArray();
        res.json(result);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
=======
app.get('/',(req,res)=>{
    res.send("HEllo welcome to the server");
>>>>>>> Stashed changes
});

const port = process.env.PORT || 4001;
//Starting a server 
app.listen(port, () =>{
    //collection = DATABASE.db("sample_mflix").collection("movies");
    console.log(`app is running at ${port}`);
})
