/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_QROBOTQUESTIONS_ARN
	STORAGE_QROBOTQUESTIONS_NAME
	STORAGE_QROBOTSEQUENCES_ARN
	STORAGE_QROBOTSEQUENCES_NAME
Amplify Params - DO NOT EDIT *//*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const { ServiceQuotas } = require('aws-sdk');
const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "QrobotQuestions";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}
const SEQUENCES_TABLE = 'QrobotSequences'
  + (process.env.ENV && process.env.ENV !== "NONE" ? `-${process.env.ENV}` : '')

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "id";
const partitionKeyType = "N";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/questions";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
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

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path + hashKeyPath, function(req, res) {
  var condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [ convertUrlType(req.params[partitionKeyName], partitionKeyType) ];
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let queryParams = {
    TableName: tableName,
    KeyConditions: condition
  }

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Items);
    }
  });
});

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path, async function (req, res) {
  const queryParams = {
    TableName: tableName,
    KeyConditions: {},
  }

  req.query = req.query || {}
  try {
    if (req.query.reputation) {
      queryParams.IndexName = 'status-reputation-index'
      queryParams.KeyConditions.reputation = {
        ComparisonOperator: 'EQ',
        AttributeValueList: [parseInt(req.query.reputation)],
      }
    } else {
      queryParams.IndexName = 'type-index'
      queryParams.KeyConditions.type =  {
        ComparisonOperator: 'EQ',
        AttributeValueList: ['question'],
      }
      queryParams.ScanIndexForward = false
    }
    if (req.query.limit) {
      queryParams.Limit = parseInt(req.query.limit)
    }
  } catch(err) {
    res.statusCode = 500
    res.json({error: 'Wrong column type ' + err})
    return
  }

  try {
    const data = await dynamodb.query(queryParams).promise()
    res.json(data.Items)
  } catch (err) {
    // res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err, queryParams});
  }
})

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/
/*
app.get(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data) ;
      }
    }
  });
});
*/

/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, async function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  const  putItemParams = {
    TableName: tableName,
    Item: req.body
  }

  try {
    const data = await dynamodb.put(putItemParams).promise()
    res.json({success: 'put call succeed!', url: req.url, data: data})
  } catch (err) {
    // res.statusCode = 500
    res.json({error: err, url: req.url, body: req.body})
  }
})

/************************************
* HTTP post method for insert object *
*************************************/

async function getSequence() {
  const updateParams = {
    TableName: SEQUENCES_TABLE,
    Key: {
      name: tableName
    },
    ExpressionAttributeNames: {
      '#seq': 'seq',
    },
    ExpressionAttributeValues: {
      ':addValue': 1,
    },
    UpdateExpression: 'SET #seq = seq + :addValue',
    ReturnValues: 'UPDATED_NEW',
  }

  const result = await dynamodb.update(updateParams).promise()
  return result.Attributes.seq
}

app.post(path, async (req, res) => {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  const postItemParams = {
    TableName: tableName,
    Item: {...req.body},
  }

  try {
    postItemParams.Item.id = await getSequence()
    const data = await dynamodb.put(postItemParams).promise()
    res.json({success: 'post call succeed!', url: req.url, data: data})
  } catch (err) {
    // res.statusCode = 500
    res.json({error: err, url: req.url, body: req.body, postItemParams})
  }
})

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
     try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params
  }
  dynamodb.delete(removeItemParams, (err, data)=> {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url});
    } else {
      res.json({url: req.url, data: data});
    }
  });
});
app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
