// The endpoints for the login page.
const express = require('express');
const router = express.Router();
const mongo = require('mongo');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const models = require("../models/users.js");

//mongoose connection
 mongoose.Promise = require("bluebird");
 mongoose.connect("mongodb://localhost:27017/codesnippet");


router.get("/api/login", function(req, res){
  res.render("login");
});

router.post("/api/login", function(req, res){
//enter validation here

module.exports = router;
