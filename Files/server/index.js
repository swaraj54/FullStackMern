const  express =  require("express");
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const routerforproduct = require('./routes/product.routes');

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://swaraj1920:swaraj1920@cluster0.6yd9l.mongodb.net/ProductStore?retryWrites=true&w=majority")

app.post("/api/register", async (req,res)=> {
    try{
        const newPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({
            name : req.body.name,
            email : req.body.email,
            password : newPassword
        })
        res.json({status:'ok'})
    } catch (error){
        res.json({status:'error', error:"Duplicate email"})
    }
})  

app.post("/api/login", async (req,res)=> {
    const user =  await User.findOne({
        email : req.body.email,
    })
    if(!user){
        return {status:'error', error:'User not found'}
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if(isPasswordValid){
        const token = jwt.sign({
            name:user.name,
            email:user.email
        }, 'secret123') 
        return res.json({status:'ok', user:token})
    } else {
        return res.json({status:'error', user:false})
    }
})  

app.get("/api/quote", async (req,res)=> {
    const token = req.headers['x-access-token'];
    try{
        const decoded = jwt.verify(token,'secret123')
        const email = decoded.email;
        const user = await User.findOne({email:email});
        return res.json({ status:'ok', quote : user.quote})
    } catch(error){
        console.log(error);
        res.json({status:'error',error:"Invalid Token"})
    }
}) 

app.post("/api/quote", async (req,res)=> {
    const token = req.headers['x-access-token'];
    try{
        const decoded = jwt.verify(token,'secret123')
        const email = decoded.email;
        await User.updateOne({email:email}, { $set: {quote : req.body.quote}});
        return res.json({ status:'ok'})
    } catch(error){
        console.log(error);
        res.json({status:'error',error:"Invalid Token"})
    }
}) 

app.post("/selfproducts", async (req,res)=> {
    const token = req.headers['x-access-token'];
    try{
        const decoded = jwt.verify(token,'secret123')
        const email = decoded.email;
        await User.updateOne({email:email}, { $push: { products : { "name":req.body.name, "author":req.body.author,"description":req.body.description,"price":req.body.price,"image":req.body.image} }});
        return res.json({ status:'ok'})
    } catch(error){
        console.log(error);
        res.json({status:'error',error:"Invalid Token"})
    }
}) 

app.get("/selfproducts", async (req,res)=> {
    const token = req.headers['x-access-token'];    
    try{
        const decoded = jwt.verify(token,'secret123')
        const email = decoded.email;
        const userdata = await User.findOne({email:email});
        return res.json({ status:'ok', userdata: userdata })
    } catch(error){
        console.log(error);
        res.json({status:'error',error:"Invalid Token"})
    }
}) 

app.put("/products/:id", async (req,res)=> {
    const id = req.params.id;
    const {name,author,description,price,available, image} = req.body;
    const token = req.headers['x-access-token'];
    let user;
    try {
        const decoded = jwt.verify(token,'secret123');
        const email = decoded.email;
        user = await User.findByIdAndUpdate({email:email},{$pull:{products:{_id:id}}});
    } catch(error){
        console.log(error);
    }
    if(!user){
        return res.status(404).json({message: "Cant delete Product"});
     }
     return res.status(200).json({message: "Prodcut Successfully Deleted"})
}) 

app.delete('/products/:id',async (req,res)=>{
    const id = req.params.id;
    const token = req.headers['x-access-token'];
    let user;
    try {
        const decoded = jwt.verify(token,'secret123');
        const email = decoded.email;
        user = await User.updateOne({email:email},{$pull:{products:{_id:id}}});
    } catch(error){
        console.log(error);
    }
    if(!user){
        return res.status(404).json({message: "Cant delete Product"});
     }
     return res.status(200).json({message: "Prodcut Successfully Deleted"})
})



app.listen(1337,()=>{
    console.log("Server started on 1337")
})

app.use('/product',routerforproduct);