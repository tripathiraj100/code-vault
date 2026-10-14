const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");

// app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"views"));

const sessionOptions = {
    secret : "mysupersecretstring",
    resave : false,
    saveUninitialized: true,
    
};

app.use(session(sessionOptions));
app.use(flash());

app.get("/register",(req,res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    req.flash("success","user gister is successfully");
    res.redirect("/hello");
});

app.get("/hello",(req,res) =>{
    res.render("page.ejs",{anme: express.session.name});
});
// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookies",(req,res) =>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("signed cookie");
// });

// app.get("/verify",(req,res) =>{
//     console.log(req.cookies);
//     res.send("cookies are verified");
// });

// app.get("/getcookies",(req,res) =>{
//     res.cookie("greet","hello");
//     res.send("sent your some cookies! ");
// });
// app.get("/",(req,res) =>{
//     console.dir(req.cookies);
//     res.send("Hi I am raj!");
// });


// app.use("/users",users);
// app.use("/posts",posts);

// app.get("/admin",(req,res) =>{
    
// })
// app.get("/reqcount",(req,res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });
// app.get("/test",(req,res) =>{
//     res.send("test successfull! ");
// });

app.listen(3000, () =>{
    console.log("server is listening to you");
});