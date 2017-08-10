// The endpoints for the login page.
'use strict';

const express = require('express');
const router = express.Router();
const mongo = require('mongo');
const mongoose = require("mongoose");
const mustacheExpress = require('mustache-express');

var crypto = require('crypto');
var config = {
    salt: function(length){
    // 'Math.ceil(length * 3 / 4)' generates a base64 value.
    return crypto.randomBytes(Math.ceil(32 * 3 / 4)).toString('base64').slice(0, length);
    },
    iterations: 20, // Specify iteration count.
    keylen: 512, //  Specify algorithm byte length.
    digest: 'sha512' // Specify algorithm.
};

var newPassword;
var verifyUser;

// Generate hash
function hashPassword(password){
    // Add salt:
    var salt = config.salt(32); // Pass in salt length.
    // Add iterations:
    var iterations = config.iterations;
    // Hash password:
    var hash = crypto.pbkdf2Sync(password, salt, iterations, config.keylen, config.digest);
    // Encode hash:
    var hashedPassword = hash.toString('base64');
    // Dev log:
    //console.log('Hashed password: ', hashedPassword);
    //console.log('Salt: ', salt );
    // TODO: save salt, hash, and iterations to database for later retrieval.

    return {salt: salt, hash: hashedPassword, iterations: iterations};
}

var config2 = {
    keylen: 512,
    digest: 'sha512'
};

function isPasswordCorrect(passwordAttempt, user) {
    var savedHash = user.hash;
    var savedSalt = user.salt;
    var savedIterations = user.iterations
    var hash = crypto.pbkdf2Sync(passwordAttempt, savedSalt, savedIterations, config2.keylen, config2.digest);
    var hashedPassword = hash.toString('base64');
    return savedHash === hashedPassword;
  }

//mongoose connection
 mongoose.Promise = require("bluebird");
 mongoose.connect("mongodb://localhost:27017/codesnippet");
 const Schema = mongoose.Schema;
 const models = require("../models/snippets.js");

//********REGISTRATION************************************************
let registration_messages = [];

router.get("/api/registration", function(req, res){
 res.render("registration");
});

router.post("/api/registration", function(req, res){

   newPassword = hashPassword(req.body.password);
   console.log(newPassword);

  req.checkBody("username", "Please enter a username.").notEmpty();
  req.checkBody("password", "Please enter a password.").notEmpty();

  let errors = req.validationErrors();
   if (errors){
     errors.forEach(function(error){
       registration_messages.push(error.msg);
     });
     res.render("registration",{errors:registration_messages});
   }else{
     let user = ({
       username: req.body.username,
       salt: newPassword.salt,
       hash: newPassword.hash,
       iterations: newPassword.iterations
     });

     models.users.create(user).then(function(newUser){
       if (newUser){
         res.redirect("/api/login");
       }else{
         res.status(403).send("The system could not register you, sorry try to register again.");
       }
     }).catch(function(err){
       res.status(400).send("Bad request. Please try again.")
     })
   }
});
//******************LOGIN***********************************************
router.get("/api/login", function(req, res){
  res.render("login");
});

router.post("/api/login", function(req, res){
//check for a valid user by salting and hashing the login password;
//if valid redirect to codesnippet page;
//if invalid redirect them to registration page

models.users.findOne({"username":req.body.username}).then(function(user){
  return user;
});

var passwordAttempt = req.body.password;
//need to call is PasswordCorrect method here
    if (passwordAttempt){
      res.redirect("/api/createsnippets");
    } else{
      res.redirect("/api/registration");
      }
  });

//***********MAIN*********************************************************
//get list of all code snipppets

router.get('/api/snippets', function(req, res){
  models.snippets.find({}).then(function(allSnippets){
    res.render("viewsnippets",{snippets:allSnippets});
  });
});

router.get('/api/createsnippets', function(req, res){
  res.render("snippets");
});

router.post('/api/createsnippets', function(req, res){
  let snippet = ({
    id:req.body.snippetID,
    title:req.body.snippetIDTitle,
    body:req.body.snippetBody,
    optNotes:req.body.optNotes,
    lang:req.body.snippetLang,
    snippetTag:req.body.snippetTag
  });

  models.snippets.create(snippet).then(function(newSnippet){
    if (newSnippet){
      res.redirect("/api/snippets");
    }else{
      res.redirect("/api/snippets")
    }
  });
});

router.get('/api/snippets/:lang', function(req, res){
  models.snippets.find({lang:req.params.lang}).then(function(newSnippet){
    console.log(newSnippet);
    if (newSnippet){
      res.render("viewsnippets",{snippets:newSnippet});
    }else{
      res.status(403).send("No snippet found, sorry");
    }
  });
});

router.get('/api/snippets/:snippetTag', function(req, res){
  models.snippets.find({lang:req.params.snippetTag}).then(function(newSnippet){
    if (newSnippet){
      res.render("viewsnippets",{snippets:newSnippet});
    }else{
      res.status(403).send("No activity found, sorry");
    }
  });
});

router.get('/api/snippets/id/:id', function(req, res){
  models.snippets.findOne({id:req.params.id}).then(function(newSnippet){
    if (newSnippet){
      res.render("viewsnippets",{snippets:newSnippet});
    }else{
      res.status(403).send("No activity found, sorry");
    }
  });
});

module.exports = router;
