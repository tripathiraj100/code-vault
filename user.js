const express = require("express");
const router = express.Router();
//index - users
router.get("/",(req,res) =>{
    res.send("Post for user");
});
///show - 
router.get("/:id", (req,res) =>{
    res.send("Get for show user id");
});
//post - users
router.post("/",(req,res) =>{
    res.send("Post for user");
});
// delete - 
router.delete("/:id",(req,res) =>{
    res.send("delete  for user id");
});
module.exports = router;