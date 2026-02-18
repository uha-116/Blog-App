// create mini express application
const exp=require('express')
authorapp=exp.Router()

//handles asynchronous errors and sends t the error handler middleware
const expasyncerr=require('express-async-handler')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const verifyToken = require('../middlewares/verifyToken')
require('dotenv').config()

let Author_Detailsobj;
let Article_Detailsobj;
authorapp.use((req,res,next)=>{
    Author_Detailsobj=req.app.get('Author_Details')
    Article_Detailsobj=req.app.get('Article_Details')
    next()
})

authorapp.get('/',async(req,res)=>{
    let found=await Author_Detailsobj.find().toArray()
    res.send({mssg:"Author details",data:found})
})


authorapp.post('/newuser',expasyncerr(async(req,res)=>{
    let info=req.body
    let found=await Author_Detailsobj.findOne({username:info.username})
    console.log(found)
    if (found===null){
      const hashp=await bcrypt.hash(info.password,5)
      info.password=hashp
      await Author_Detailsobj.insertOne(info)
      res.send({mssg:"author loginned",details:info})
    }
    else{
        res.send({mssg:"Authorname Exists! Please Login"})
    }
}))

authorapp.post('/login',expasyncerr(async(req,res)=>{
    let ex=req.body

    let found=await Author_Detailsobj.findOne({username:ex.username})
    if (found===null){
        res.send({mssg:"author not Found"})
    }
    else{
        // this compares the orginal password and the hashed password 
        if (await bcrypt.compare(ex.password,found.password))
           {
            const token = jwt.sign(
                { username: found.username, usertype: found.usertype },
                process.env.SECRET_KEY,
                { expiresIn: '1d' }
            );
            res.send({
                mssg: "Login successful",
                token,
                user: {
                    username: found.username,
                    usertype: found.usertype
                }
            })
           }
        else
        res.send({mssg:"Invalid password Try again"})
    }
}))

authorapp.post('/articles', verifyToken, expasyncerr(async (req, res) => {
    try {
        const ex = req.body;
        const inserted = await Article_Detailsobj.insertOne(ex);
        
        console.log("Inserted Data:", inserted);
        res.send({ mssg: "Article created Successfully", new: ex });
    } catch (err) {
        console.error("Insert Error:", err);
    }
}));


authorapp.put('/articles/update', verifyToken, expasyncerr(async (req, res) => {
    let { article_id, title, category, img, content } = req.body;
    console.log({ article_id, title, category, img, content })
    await Article_Detailsobj.updateOne(
        { article_id },
        {
            $set: {
                title,
                category,
                img,
                content,
                date_modification: new Date().toISOString()
            }
        }
    );

    res.send({ mssg: "Updated article successfully" ,details:[{ article_id, title, category, img, content }]});
}));

authorapp.put('/articles/:article_id', verifyToken, expasyncerr(async (req, res) => {
    const { article_id } = req.params;
    console.log("Received article_id:", article_id); // Debugging log

    // Update only the 'status' field
    const updateResult = await Article_Detailsobj.updateOne(
        { article_id },
        { $set: { status: false } }
    );

    // Ensure the update was successful
    if (updateResult.modifiedCount === 0) {
        return res.status(400).json({ error: "Article status was not updated" });
    }

    res.json({ message: "Article deleted successfully" });
}));


authorapp.get('/articles/:username', verifyToken, expasyncerr(async(req,res)=>{
    console.log(req.params.username)
    let author_articles=await Article_Detailsobj.find({username:req.params.username ,status:true}).toArray()
    console.log(author_articles)
    if (author_articles.length==0)
    {
      res.send({mssg:"No articles found by that author"})
    }
    else
    {
     res.send({mssg:"Articles found by prakash",data:author_articles})
    }
 
 }))
authorapp.get('/articles/id/:article_id',expasyncerr(async(req,res)=>{
    let articlesbyid=await Article_Detailsobj.find({article_id:(req.params.article_id) ,status:true}).toArray()
   console.log(articlesbyid)
   if (articlesbyid.length==0)
   {
     res.send({mssg:"No articles found"})
   }
   else
   {
    res.send({mssg:"Articles found",data:articlesbyid})
   }
 }))

module.exports=authorapp;
