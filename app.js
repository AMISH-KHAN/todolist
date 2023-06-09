const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash")
const dotenv = require("dotenv").config()
const app = express();

// making database
let pass = process.env.KEY
// console.log(typeof(pass))
mongoose.connect(`mongodb+srv://Admin-amish:${pass}@cluster0.px2n2sy.mongodb.net/items`);

//making db schema
const itemSchema = mongoose.Schema({
  Name: String,
});

const listSchema = mongoose.Schema({
  Name: String,
  listItem:[itemSchema]
})
//definig new models
const Item = mongoose.model("item", itemSchema);
const List = mongoose.model("list", listSchema);
//defining constant documents


const newitem1 = new Item({
  Name: "this is a to do list",
});
const newitem2 = new Item({
  Name: "press + to add items",
});
const defaulItems=[newitem1,newitem2]

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));


var today = "today";

app.get("/", (req, res) => {
  Item.find().then((result) => {
    if (result.length ===0 ) {
        Item.insertMany(defaulItems);
        res.redirect("/")
    }
    else {
        
        res.render("temp", { listtitle: today, addeditem: result });
    }
  });
});

app.get("/:topic", (req, res) => {
  const requestedTitle = _.capitalize(req.params.topic);
  List.findOne({ Name: requestedTitle }).then((result) => {
    
    if (!result) {
      
      const listitems = new List({
        Name: requestedTitle,
        listItem: defaulItems
      })
      listitems.save();
      res.redirect("/"+requestedTitle)
    }
    else {
     res.render("temp",{ listtitle: result.Name, addeditem:result.listItem })
      
    }
    })
    
    
   
})

//post request
app.post("/delete", (req, res) => {
  var idvalue = req.body.checker;
  const itemname = req.body.itemname;
  // console.log(itemname)
  if (itemname === "today") {
    
    
        
        Item.findByIdAndDelete(idvalue).then((result) => {
            // console.log(result)
        })
      
      res.redirect("/")
  }
  else {
    List.findOneAndUpdate({ Name: itemname }, { $pull: { listItem: { _id: idvalue } } }).then((result) => {
      console.log(result);
      res.redirect("/"+itemname)
    })
  }
    
})

app.post("/", (req, res) => {
  var item = req.body.item;
  const submit = req.body.submit;
  var newitem = new Item({
    Name: item,
  });
  if (submit === "today") {
    
    newitem.save();
   
    res.redirect("/");
  }
  else {
    List.findOne({ Name: submit }).then((result) => {
      // console.log(result)
      result.listItem.push(newitem)
      result.save();
      res.redirect("/"+submit)
    })
  }
  
});



app.get("/about", (req, res) => {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port== "") {
  port = 3000;
}
app.listen(port, () => {
  // console.log("lisniting on http://localhost:3000");
});
