'use strict';

// eslint-disable-next-line import/no-unresolved
const express = require('express');
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const cors = require('cors');
var multer  = require('multer');
var upload = multer();

const app = express();
app.use(cors());


// Routes
app.get('/', (req, res) => {
  const params = { TableName: process.env.tableName,
  Key: {activity: '1234'}};
  let response;
  dynamodb.get(params, function(err, data) {
    if (err) {
      res.status(500).send(err);
      return;
    } else {
      res.send(`1234: ${data.Item.stored}`);
    }
  });
  
});
app.get('/set', async(req, res) => {
  const params = { TableName: process.env.tableName,
  Item: {activity:'1234', stored: 'user'}};
  await dynamodb.put(params).promise();
  res.send('stored');
});

app.post('/create_activity', upload.none(), (req, res) => {
  console.log(req.body);
  res.send('test');
})

// Error handler
app.use((err, req, res) => {
  console.error(err);
  res.status(500).send('Internal Serverless Error');
});

module.exports = app;
