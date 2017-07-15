// The endpoints for the login page.
const express = require('express');
const router = express.Router();
const mongo = require('mongo');
const mongoose = require("mongoose");
const mustacheExpress = require('mustache-express');

const Schema = mongoose.Schema;


const models = require("../models/snippets.js");

//mongoose connection
 mongoose.Promise = require("bluebird");
 mongoose.connect("mongodb://localhost:27017/codesnippet");

//********REGISTRATION************************************************
router.get("/api/registration", function(req, res){

});

router.post("/api/registration", function(req, res){

});




//******************LOGIN***********************************************
router.get("/api/login", function(req, res){
  res.render("login");
});

router.post("/api/login", function(req, res){
//check for a valid user; if valid redirect to codesnippet page
});


//***********MAIN*********************************************************
//get list of all code snipppets

router.get('api/snippets', function(req, res){
  res.render("snippets");
});

router.post('api/snippets', function(req, res){
  let snippet = ({
    id:req.body.id,
    title:req.body.title,
    body:req.body.code,
    optNotes:req.body.optNotes,
    lang:req.body.lang,
    snippetTag:req.body.tag
  });
  models.snippets.create(snippet).then(function(newSnippet){
    if (newSnippet){
      res.setHeader('Content-Type','application/json');
      res.status(201).json(newSnippet);
    }else{
      res.status(403).send("No snippet found, sorry");
    }
  }).catch(function(err){
    res.status(400).send("Bad request. Please try again.")
  })
});

router.get('api/snippets/:lang', function(req, res){
  models.snippets.findOne({lang:req.params.lang}).then(function(newSnippet){
    if (newSnippet){
      res.setHeader('Content-Type','application/json');
      res.status(201).json(newSnippet);
    }else{
      res.status(403).send("No activity found, sorry");
    }
  }).catch(function(err){
    res.status(400).send("Bad request. Please try again.")
  })
  res.render("snippets");
});

router.get('api/snippets/:snippetTag', function(req, res){
  models.snippets.findOne({lang:req.params.snippetTag}).then(function(newSnippet){
    if (newSnippet){
      res.setHeader('Content-Type','application/json');
      res.status(201).json(newSnippet);
    }else{
      res.status(403).send("No activity found, sorry");
    }
  }).catch(function(err){
    res.status(400).send("Bad request. Please try again.")
  })
  res.render("snippets");
});

router.get('api/snippets/:id', function(req, res){
  models.snippets.findOne({lang:req.params.snippetTag}).then(function(newSnippet){
    if (newSnippet){
      res.setHeader('Content-Type','application/json');
      res.status(201).json(newSnippet);
    }else{
      res.status(403).send("No activity found, sorry");
    }
  }).catch(function(err){
    res.status(400).send("Bad request. Please try again.")
  })
  res.render("snippets");
});




module.exports = router;