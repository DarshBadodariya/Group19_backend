const express = require('express');

//const isretailer = require('../controllers/auth');

const products = require('../models/product');

//import {isretailer} from '../controllers/auth';



const router = express.Router();

router.get("/search", async (req, res) => {
    try {
        let result = await movies.aggregate([
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
        ]).toArray();
        res.json(result);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});


router.get('/:id', async (req,res) => {

    try{
        const product = await products.findOne({ _id: req.params.id});
        res.json(product);
    }catch(err){
        res.json({ msg: 'Product not found' });
    }

});

router.get('/', async (req,res) => {
    try{
        const product = await products.find();
        res.json(product);
    }catch(err){
        res.json({ msg: err})
    }
});

router.put('/:id', /*, issignedin, isretailer,*/ async (req,res) =>{

    const product = await products.findById(req.params.id);



    if(product){

        const updproduct = req.body;
        
        //products.forEach(product => {
            
            //if(product._id === parseInt(req.params.id)){
                product.productid = updproduct.productid ? updproduct.productid : product.productid;
                product.title = updproduct.title ? updproduct.title : product.title ;
                product.des = updproduct.des ? updproduct.des : product.des ;
                product.cat = updproduct.cat ? updproduct.cat : product.cat ;
                product.brandname = updproduct.brandname ? updproduct.brandname : product.brandname ;
                product.size = updproduct.size ? updproduct.size : product.size ;
                product.quantity = updproduct.quantity ? updproduct.quantity : product.quantity ;
                product.price = updproduct.price ? updproduct.price : product.price ;
                product.dispercent = updproduct.dispercent ? updproduct.dispercent : product.dispercent ;
                product.tags = updproduct.tags ? updproduct.tags : product.tags ;

                product.save();

                res.json({ msg: 'Product was updated', product});
            //}

        //});

    }
    else{
       
        res.json({ msg: `Product not found with id of ${req.params.id}`});
    
    }
});


router.delete('/:id', /*, issignedin, isretailer,*/ async (req,res) =>{
    
    const delproduct = await products.findById(req.params.id);

    if(delproduct){
        await delproduct.remove();
        res.send({ message: 'product deleted'});
    }
    else{
        res.send('Product not found, error in deletion');
    }
});


router.post('/', /*, issignedin, isretailer,*/ (req,res) => {

    const product = new products({
        productid: req.body.productid,
        title: req.body.title,
        des: req.body.des,
        cat: req.body.cat,
        brandname: req.body.brandname,
        size: req.body.size,
        quantity: req.body.quantity,
        price: req.body.price,
        dispercent: req.body.dispercent,
        tags: req.body.tags
    });
    
    try{
        product.save();
        res.send({message: 'product added', data: product});
    }catch(err) {
        if(err.name === "MongoError" && "keyValue" in err && "username" in err.keyValue) {
           return res.status(409).send({message: "User already exists"})
        }
        else {
          return res.status(500).send(err)
        }
    }

});



module.exports = router;