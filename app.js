const express = require("express");
const app = express();
const ExpressError = require("./ExpressError");
// app.use((req,res,next) =>{
//     // let {query} = req.query;
//     // console.log(query);
//     console.log("Hi, I am middleware");
//     next();
// });
// // logger- morgan
// app.use((req,res,next) =>{
//     req.time = new Date(Date.now()).toString();
//     console.log(req.method,req.hostname,req.pathname,req.time);
//     next();
// });
const checkToken = (req,res,next)=>{
    let {token} = req.query;
    if(token === "givenaccess"){
        next();
    }
    throw new Error(404,"ACCESS DENIED");
};
app.get("/api",checkToken,(req,res) =>{
    res.send("data");
});
app.use("/random",(req,res,next) => {
    console.log("I am only for random");
    next();
});
// app.get("/api",(req,res) =>{
//     res.send("data");
// });
app.get("/", (req,res) => {
    res.send("I am root");
});

app.get("/random",(req,res) =>{
    res.send("this is random page")
});
app.get("/err",(req,res) =>{
    abcd = abcd;
});
app.get("/admin",(req,res)=>{
    throw new ExpressError(403,"Access to admin is forbidden");
}); 
app.use( (err,req,res,next) =>{
    let {status,message} = err;
    res.status(status).send(message);
});

// for 404 
// app.use((req,res) =>{
//     res.status(404).send("Page not found ")
// });
app.listen(8888,()=>{
    console.log("server listening to the port");
});