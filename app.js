const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const { daydis, dayname } = require(__dirname + "/day.js");
// making database
mongoose.connect("mongodb://127.0.0.1/items");
const itemSchema = mongoose.Schema({
  Name: String,
});

const Item = mongoose.model("item", itemSchema);
const newitem1 = new Item({
  Name: "this is a to do list",
});
const newitem2 = new Item({
  Name: "press + to add items",
});
// if()

// var items = [];
let workitems = [];
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

var days = daydis();
var today = "today";
console.log();
app.get("/", (req, res) => {
  Item.find().then((result) => {
    if (result.length === 0) {
        Item.insertMany([newitem1, newitem2]);
        res.redirect("/")
    }
    else {
        
        res.render("temp", { listtitle: today, addeditem: result });
    }
  });
});

app.post("/", (req, res) => {
  var item = req.body.item;
  // console.log(req.body.submit)
  if (req.body.submit === today) {
    var newitem = new Item({
      Name: item,
    });
    newitem.save();
    items.push(newitem.Name);
    res.redirect("/");
    // mongoose.connection.close();
  } else {
    workitems.push(item);
    res.redirect("/work");
  }
});
app.get("/work", (req, res) => {
  res.render("temp", { listtitle: "work list", addeditem: workitems });
});
app.post("/work", (req, res) => {
  console.log(req.body);
  res.redirect("/work");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.listen(3000, () => {
  console.log("lisniting on http://localhost:3000");
});
var aa=323