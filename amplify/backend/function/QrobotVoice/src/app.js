/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_S32509B5A2_BUCKETNAME
Amplify Params - DO NOT EDIT *//*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const AWS = require('aws-sdk')
const polly = new AWS.Polly()
const s3 = new AWS.S3()

const path = "/voice"

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

/**********************
 * Create voice data by Polly *
 **********************/

async function createVoice(text, params = {}) {
  const pollyParams = {
    TextType: params.TextType || 'text',
    OutputFormat: params.OutputFormat || 'mp3',
    VoiceId: params.VoiceId || 'Mizuki', // Mizuki / Takumi
    Text: text,
  }

  const data = await polly.synthesizeSpeech(pollyParams).promise()
  return data.AudioStream
}

/**********************
 * Put voice data on S3 *
 **********************/

async function putVoice(filePath, data, params = {}) {
  const level = params.level || 'public'
  const putParams = {
    Bucket: process.env.STORAGE_S32509B5A2_BUCKETNAME,
    Key: `${level}/${filePath}`,
    Body: data,
    ContentType: 'audio/mp3',
  }

  const result = await s3.putObject(putParams).promise()
  return {key: putParams.Key}
}

/**********************
 * Example get method *
 **********************/

app.get(`${path}/dummy`, function(req, res) {
  const text =`<speak>こんにちは</speak>`
  res.json({success: 'dummy call succeed!', url: req.url})
});

// app.get('/item/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'get call succeed!', url: req.url});
// });

/****************************
* Create voice *
****************************/

app.post(`${path}/create`, async (req, res) => {
  const text = req.body.text
  const params = req.body.params || {}

  try {
    const data = await createVoice(text, params.polly)
    const result = await putVoice(req.body.filePath, data, {level: params.level})

    res.json({success: 'post call succeed!', ...result})
  } catch (err) {
    // res.statusCode = 500
    res.json({error: err, url: req.url})
  }
})

/****************************
* Copy voice file *
****************************/

app.post(`${path}/copy`, async (req, res) => {
  let copyParams = null
  try {
    const level = req.body.level || 'public'
    copyParams = {
      Bucket: process.env.STORAGE_S32509B5A2_BUCKETNAME,
      CopySource: `/${process.env.STORAGE_S32509B5A2_BUCKETNAME}/${level}/${req.body.filePath}`,
      Key: `${level}/${req.body.newFilePath}`,
    }

    const result = await s3.copyObject(copyParams).promise()
    res.json({success: 'post call succeed!', ...result})
  } catch (err) {
    // res.statusCode = 500
    res.json({error: err, url: req.url, params: copyParams})
  }
})

/****************************
* Delete voice file *
****************************/

app.post(`${path}/delete`, async (req, res) => {
  try {
    const level = req.body.level || 'public'
    const deleteParams = {
      Bucket: process.env.STORAGE_S32509B5A2_BUCKETNAME,
      Key: `${level}/${req.body.filePath}`,
    }

    const result = await s3.deleteObject(deleteParams).promise()
    res.json({success: 'post call succeed!', ...result})
  } catch (err) {
    // res.statusCode = 500
    res.json({error: err, url: req.url})
  }
})

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
