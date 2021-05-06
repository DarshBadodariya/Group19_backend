require('dotenv').config()
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const User = require("./models/user");


const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userprof");
const productRoutes = require("./routes/product");
const userfav = require("./routes/userfav")

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
});

const port = process.env.PORT || 4001;
//Starting a server 
app.listen(port, () =>{
    //collection = DATABASE.db("sample_mflix").collection("movies");
    console.log(`app is running at ${port}`);
})
