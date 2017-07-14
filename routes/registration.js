// The endpoints for the registration page.
const express = require('express');
const router = express.Router();
const mongo = require('mongo');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const models = require("../models/snippets.js");

//mongoose connection
 mongoose.Promise = require("bluebird");
 mongoose.connect("mongodb://localhost:27017/codesnippet");






module.exports = router;
