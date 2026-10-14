const express = require("express");
const router = express.Router();
//Posts
//index 
router.get("/",(req,res) =>{
    res.send("Post for post");
});
///show 
router.get("/:id", (req,res) =>{
    res.send("Get for show post id");
});
//post 
router.post("/",(req,res) =>{
    res.send("Post for post");
});
// delete 
router.delete("/:id",(req,res) =>{
    res.send("delete  for post id");
});
module.exports = router;