'use strict';

// eslint-disable-next-line import/no-unresolved
const express = require('express');
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
var multer  = require('multer');
var upload = multer();
const { v4: uuidv4 } = require('uuid');

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
  res.send(db_res.Item);
})

app.post('/create_activity', upload.none(), async(req, res) => {
  let act_id = uuidv4();

  let alphabet = "";
  if (req.body.Alphabet == 'Choose') {
    alphabet = req.body.Choose_t.replace(/ /g,'');
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
