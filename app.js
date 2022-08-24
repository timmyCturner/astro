const express = require('express')
const app = express()


// // app.options('*', cors());
//app.use(express.static(__dirname + '/public'))
// const express = require("express");
//  //const debug = require("debug")("server");
//   const app = express();
//    //const port = process.env.SERVER_PORT || 3001;
//    app.use(express.static(__dirname + '/public'))
//     app.use(cors())
//    app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });
//
// //

app.use(express.static(__dirname + '/'))
app.listen(3000, () =>
  console.log('Visit http://127.0.0.1:3000')
);
////////////////////////////////////////////////
//express = require 'express'
