'use strict';

// eslint-disable-next-line import/no-unresolved
const express = require('express');
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
var multer  = require('multer');
const fetch = require('node-fetch');
var upload = multer();
const { v4: uuidv4 } = require('uuid');
var mustache = require('mustache');

const lower_alphabet = "abcdefghijklmnopqrstuvwxyz";
const upper_alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const full_alphabet =  lower_alphabet + upper_alphabet;

const app = express();
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})
// Routes
app.get('/:id', async(req, res) => {
  const params = { TableName: process.env.tableName,
    Key: {activity: req.params.id}};
  let db_res = await dynamodb.get(params).promise();
  let alphabet = db_res.Item.alphabet;
  fetch("https://isaacwarren.github.io/Line_Orientation/activity_template.html")
        .then(template_res => template_res.text())
        .then(template => mustache.render(template, {"alphabet" : alphabet}))
        .then(html => res.send(html));
})

app.post('/create_activity', upload.none(), async(req, res) => {
  let act_id = uuidv4();

  let alphabet = "";
  if (req.body.Alphabet == 'Choose') {
    alphabet = req.body.Choose_t;
  } else if (req.body.Alphabet == 'Lower') {
    alphabet = lower_alphabet;
  } else if (req.body.Alphabet == 'Upper') {
    alphabet = upper_alphabet;
  } else {
    alphabet = full_alphabet;
  }

  const params = { TableName: process.env.tableName,
    Item: {activity:act_id, alphabet: alphabet}};
  await dynamodb.put(params).promise();
  
  res.send(act_id);
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Serverless Error');
});

module.exports = app;
