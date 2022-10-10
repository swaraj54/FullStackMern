const Product = require("../models/product.model");

const getAllProducts = async (req,res,next)=>{
    let products;
    try{
        products = await Product.find(); 
    } catch(err){
        console.log(err);
    }
    if(!products){
        return res.status(404).json({message: "Book not found"});
    }
     return res.status(200).json({products});
}

const getById = async (req,res,next)=>{
    console.log(req)
    const id = req.params.id;
    let product;
    try{
        product = await Product.findById(id);
    } catch(err){
        console.log(err);
    } 
    if(!product){
        res.status(404).json({message: "Product not found"});
    }
    res.status(200).json({product});
}

const addProduct = async (req,res,next)=> {
    const{name, author, description, price, available, image} = req.body;
    let product;
    try {
        product = new Product({
            name,
             author,
              description,
               price,
                available, image
        });
        await product.save();
    } catch(err){
        console.log(err);
    }
    if(!product){
       return res.status(500).json({message: "Cant Add product"});
    }
    return res.status(201).json({product})
}

const updateProduct = async (req,res,next) => {
    console.log("Hii")
    const id = req.params.id;
    const {name,author,description,price,available, image} = req.body;
    let product;
    try{
        product = await Product.findByIdAndUpdate(id, {
            name,author, description, price, available, image
        })
         await product.save();
    } catch(err){
        console.log(err)
    }
    if(!product){
        return res.status(404).json({message: "Cant update product"});
     }
     return res.status(200).json({product})
};

const deleteProduct = async (req,res,next)=> {
    console.log("Inside delete func")
    const id = req.params.id;
    console.log(id)
    let product ;
    try{
        product = await Product.findByIdAndDelete(id);
    } catch(err){
        console.log(err)
    }
    if(!product){
        console.log("Not deleted")
        return res.status(404).json({message: "Cant delete product"});
     }
     return res.status(200).json({message: "Product Successfully Deleted"})
}



exports.getAllProducts = getAllProducts;
exports.getById = getById;
exports.addProduct = addProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;