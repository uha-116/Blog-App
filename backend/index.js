// // create main express application 
// const exp=require('express')
// const cors=require('cors')// for frontend requests to backend if any errors
// const app=exp()
// require('dotenv').config()//process.env
// app.use(exp.json())//for body property
// const path=require('path')
// app.use(cors())

// //this statement use to connect the forntend and backend
// app.use(exp.static(path.join(__dirname,'../client/build')))

// //Databse Connectivity
// const mc=require('mongodb').MongoClient 
// mc.connect(process.env.DB_URL)
// .then(client=>{
//     const blogapp=client.db('blogapp')
//     const User_Details=blogapp.collection('User_Details')
//     const Article_Details=blogapp.collection('Article_Details')
//     const Author_Details=blogapp.collection('Author_Details')
//     app.set('User_Details',User_Details)
//     app.set('Article_Details',Article_Details)
//     app.set('Author_Details',Author_Details)
//     console.log("Database Connected")
// })
// .catch(err=>{
//     console.log("Fail to connect")
// })



// // import apis
// const userapp=require('../backend/Apis/userapi')
// const authorapp=require('../backend/Apis/authorapi')


// //navigating to the respective apis based on the path
// app.use('/userapi',userapp)
// app.use('/authorapi',authorapp)

// //for page refresh
// app.use((req,res,next)=>{
//     res.sendFile(path.join(__dirname,'../client/build/index.html'))
// })
// //error handler
// app.use((err, req, res, next) => {
//     res.status(500).json({ mssg: "Error Occurred", payload: err.message });
// });

// //creating http server
// const port=process.env.PORT || 2000;
// app.listen(port,()=>console.log(`server running on port ${port}`))

// create main express application 
const exp = require('express');
const cors = require('cors'); // for frontend requests to backend if any errors
const app = exp();
require('dotenv').config(); //process.env
app.use(exp.json()); //for body property
const path = require('path');
app.use(cors());

// this statement use to connect the forntend and backend
app.use(exp.static(path.join(__dirname, '../client/build')));

// Databse Connectivity
const mc = require('mongodb').MongoClient;

mc.connect(process.env.DB_URL)
    .then(client => {
        const blogapp = client.db('blogapp');
        const User_Details = blogapp.collection('User_Details');
        const Article_Details = blogapp.collection('Article_Details');
        const Author_Details = blogapp.collection('Author_Details');

        // Set the collections on the Express application
        app.set('User_Details', User_Details);
        app.set('Article_Details', Article_Details);
        app.set('Author_Details', Author_Details);

        console.log("Database Connected");

        // Import and use APIs ONLY after the database is connected
        const userapp = require('./Apis/userapi');
        const authorapp = require('./Apis/authorapi');

        // Navigating to the respective apis based on the path
        app.use('/userapi', userapp);
        app.use('/authorapi', authorapp);

        // for page refresh (must be the last route)
        app.use((req, res, next) => {
            res.sendFile(path.join(__dirname, '../client/build/index.html'));
        });

        // Error handler (must be the last middleware)
        app.use((err, req, res, next) => {
            console.error(err); // Log the error on the server
            res.status(500).json({ mssg: "Error Occurred", payload: err.message });
        });

        // Creating HTTP server
        const port = process.env.PORT || 2000;
        app.listen(port, () => console.log(`server running on port ${port}`));

    })
    .catch(err => {
        console.log("Fail to connect", err);
    });
