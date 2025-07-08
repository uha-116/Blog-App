// create mini express application
const exp = require('express');
userapp = exp.Router();

// importing bcryptjs
const bcrypt = require('bcryptjs');

// handles asynchronous errors and sends to the error handler middleware
const expasyncerr = require('express-async-handler');

// for retrieving the User_Details
// this is middleware used 
let User_Detailsobj;
let Article_Detailsobj;
userapp.use((req, res, next) => {
    User_Detailsobj = req.app.get('User_Details');
    Article_Detailsobj = req.app.get('Article_Details');
    next();
});

// get users
userapp.get('/', async (req, res) => {
    let found = await User_Detailsobj.find().toArray();
    res.send({ mssg: "User details", data: found });
});

userapp.get('/articles', expasyncerr(async (req, res) => {
    
    let article = await Article_Detailsobj.find({ status: true }).toArray();
    if (article.length == 0) {
        res.send({ mssg: "No articles found " });
    } else {
        res.send({ mssg: "User Article details", data: article });
    }
}));

// for creating new user
userapp.post('/newuser', expasyncerr(async (req, res) => {
    let info = req.body;
    let found = await User_Detailsobj.findOne({ username: info.username });
    if (found === null) {
        const hashp = await bcrypt.hash(info.password, 5);
        info.password = hashp;
        await User_Detailsobj.insertOne(info);
        res.send({ mssg: "User loginned", details: info });
    } else {
        res.send({ mssg: "User exists! Please login" });
    }
}));

// user login
userapp.post('/login', expasyncerr(async (req, res) => {
    let ex = req.body;

    let found = await User_Detailsobj.findOne({ username: ex.username });
    if (found === null) {
        res.send({ mssg: "User not found" });
    } else {
        // this compares the original password and the hashed password 
        if (await bcrypt.compare(ex.password, found.password)) {
            res.send({ mssg: 'User loginned', details: found });
        } else {
            res.send({ mssg: "Invalid password. Try again" });
        }
    }
}));

// add comment without authentication
userapp.post('/comments', expasyncerr(async (req, res) => {
    const { id,comment_id, username, comments, date } = req.body; 

    let response=await Article_Detailsobj.updateOne(
        { article_id: id }, // Find the article by ID
        { $push: { comments: { username, comment_id,comments, date } } } // Add comment as object
    );
       console.log(response)
    res.send({ mssg: "Comment added successfully" });
}));

userapp.get('/comments/:article_id', expasyncerr(async (req, res) => {
    let article = await Article_Detailsobj.find({ article_id:req.params.article_id }).toArray();
    console.log("article:",article )
    res.send({showcomment:article[0].comments})
}));

userapp.delete('/comments/:articleId/:commentId', expasyncerr(async (req, res) => {
    const { articleId, commentId } = req.params;
  
    const response = await Article_Detailsobj.updateOne(
      { article_id: articleId },
      { $pull: { comments: { comment_id: commentId } } }
    );
  
    console.log(response);
    res.send({ mssg: "Comment deleted successfully" });
  }));
  


module.exports = userapp;
