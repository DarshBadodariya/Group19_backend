const express = require('express');
const users = require('../models/user');
const products = require('../models/product');


const router = express.Router();

// Getting the perticular user profile information using get request
router.get('/:id', async (req,res) => {

    try{
        const user = await users.findOne({ _id: req.params.id});
        res.json(user);
    }catch(err){
        res.json({ msg: 'usero not found' });
    }

});

//This put request will update the user profile information 
router.put('/:id', /*, issignedin, isretailer,*/ async (req,res) =>{

    const user = await users.findById(req.params.id);


    // if user exist then update the all changes in the databse
    if(user){

        const upduser = req.body;
        
        
                user.name = upduser.name ? upduser.name : user.name ;
                user.lastname = upduser.lastname ? upduser.lastname : user.lastname ;
                user.email = upduser.email ? upduser.email : user.email ;
                user.password = upduser.password ? upduser.password : user.password ;
                user.userinfo = upduser.userinfo ? upduser.userinfo : user.userinfo ;
                user.purchases = upduser.purchases ? upduser.purchases : user.purchases ;
                user.address = upduser.address ? upduser.address : user.address ;
                user.save();

                res.json({ msg: 'user was updated', user});
          

    }
    else{
       
        res.json({ msg: `user not found with id of ${req.params.id}`});
    
    }
});

//delete the user 
router.delete('/:id', /*, issignedin, isretailer,*/ async (req,res) =>{
    
    const deluser = await users.findById(req.params.id);

    if(deluser){
        await deluser.remove();
        res.send({ message: 'user deleted'});
    }
    else{
        res.send('user not found, error in deletion');
    }
});


// This post request wiol take the userid and productid 
// and add the selected item to the users cart

router.post('/addtocart/:id/:productId',  async(req, res) => {

    const userInfo = await users.findOne({ _id: req.params.id});
    const productInfo = await products.findOne({ _id: req.params.productId});
    
        let duplicate = false;
        //checking for duplicate item
        userInfo.cart.forEach((item) =>{
            if (item.id == req.params.productId) {
                duplicate = true;
            }
        })
        
       // if duplicate then increase the quantity by 1
       // else add the item to the cart with initial quntity 1
        if (duplicate) {
            users.findOneAndUpdate(
                { _id: req.params.id, "cart.id": req.params.productId },
                { $inc: { "cart.$.quan": 1 } },
                 { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
        }
        
        else {
            console.log("else part")
            users.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $push: {
                        cart: {
                            id: req.params.productId,
                            product:productInfo,
                            quan: 1,
                            date: Date.now()
                        }
                    }
                },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
            
        }
    
});


// THis rout will fetch the users cart information 
//if cart is emty then msg 
//else fetch all the product

router.get('/mycart/:id', async(req,res) => {

    const userInfo = await users.findOne({ _id: req.params.id});
    if(userInfo){
        const mycart = userInfo.cart;
        if(mycart!=null){
            return res.json(mycart);
            //console.log(mycart);
        }
        else{
            return res.json({ msg: 'cart is empty' });
            //console.log({msg: 'cart is empty'});
        }
    }
    else{
        return res.json({msg: 'user not found'});
        //console.log({msg: "cart is empty"});
    }
});

// Remove the perticular product from the cart
//return the cart info if succesfull 

router.post('/removefromCart/:id/:productId',  async(req, res) => {
    
    users.findOneAndUpdate(
        { _id: req.params.id },
        {
            "$pull":
                { "cart": { "id": req.params.productId } }
        },
        { new: true },
        (err, userInfo) => {
            if (err) return res.json({ success: false, err });
            res.status(200).json(userInfo.cart)
        }
     
    )
})

// This request will brings all the items into purchases and then 
//empty the users cart
router.get('/purchase/:id', async(req, res) => {

    const userInfo = await users.findOne({ _id: req.params.id});
        
     
            
            users.findOneAndUpdate(
                {_id:req.params.id},
                {

                    $push:
                    {
                        purchases:
                        {
                            "$each":userInfo.cart
                        }
                    },
                    $set: 
                    { 
                         cart: [] 
                    }
                    
                },
                {new:true},
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.purchases)
                }

            )
});


//This request will reset the all past orders
router.get('/resetpurchase/:id',  async(req, res) => {

        users.findOneAndUpdate(
                { _id: req.params.id },
                {
                    
                    $set: 
                    { 
                        purchases: [] 
                    }
                },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.purchases)
                }
            )
});



module.exports = router;