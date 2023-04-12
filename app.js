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
  email: String,
  password:String,
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
  res.render("register",{message:""})
})
app.get("/login", (req, res) => {
  res.render("login",{message:""})
})
app.get("/today", (req, res) => {
  Item.find().then((result) => {
    if (result.length ===0 ) {
        Item.insertMany(defaulItems);
        res.redirect("/today")
    }
    else {
        
        res.render("temp", { listtitle: today, addeditem: result });
    }
  });
});
app.get("/login/:topic", (req, res) => {
  const requestedTitle = req.params.topic;
  List.findOne({ _id: requestedTitle }).then((result) => {
    // console.log(result.Name)
    res.render("temp", {
      listtitle:result.Name,
      addeditem: result.listItem,
      _id:requestedTitle
    })
  })
  // res.render("temp")
})
app.post("/login/:topic", (req, res) => {
  const requestedTitle = req.params.topic;
  var item = req.body.item;
  
  console.log(item)
  List.findOne({ _id: requestedTitle }).then((result) => {
    // console.log(result.Name)
    if (result.listItem.length>=0) {
      
      result.listItem.push(newitem1)
      result.listItem.push(item)
      result.save()
    }
    else {
      console.log("eewww")
      
    }
  })
  
  res.redirect("/login/"+requestedTitle)
    
   
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
// post request for registration
app.post("/", (req, res) => {
  let Name=req.body.name;
  let email=req.body.email;
  let password = req.body.password;
  const entry = new List({
      Name: Name,
      email: email,
    password: password,
      listItem:defaulItems
      
  })

  List.findOne({ email: email }).then((result) => {
      // console.log(result)
      if (!result) {
          entry.save()
          res.redirect("/login")
      }
      else {
          // res.redirect("register")
          res.render("register",{message:"user exits"})
      }
  })
  
})
// post request for login
app.post("/login", (req, res) => {
  const loginemail = req.body.email;
  const loginPassword = req.body.password;
  // console.log(loginemail)
  List.findOne({ email: loginemail }).then((result) => {
      if (result.password == loginPassword) {
          // console.log("user found " + result.Name)
        // console.log(result)
        // res.render("temp", {
        //   _id: result._id,
        //   addeditem:res.listItem,
        // listtitle:result.Name
        // })
          res.redirect("/login/"+result._id)
      }
      else {
          console.log("wrong password")
          res.render("login",{message:"wrong password"})
      }
  }).catch((err) => {
      console.log("user not exist")
      res.render("login",{message:"user not exist"})
  })
})

app.post("/today", (req, res) => {
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
