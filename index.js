/*
* Main API files
*
*/


// dependancies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
//const { type } = require('os');
const config  = require('./config');
const fs = require('fs');


//instantiating the  https server
const httpServer = http.createServer(function(req,res) {
  unifiedServer(req,res);
})

//start to the server

httpServer.listen(config.httpPort, function(){
    console.log('Listening on  port '+config.httpPort+'in '+config.envName+' mode');
})

//https server options
const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.perm')
}

//create https server
const httpsServer = https.createServer(httpsServerOptions, function(req,res) {
    unifiedServer(req,res);
  })
  
  
  //start to the server
  httpsServer.listen(config.httpsPort, function(){
      console.log('Listening on  port '+config.httpsPort+'in '+config.envName+' mode');
  })
  

//All the server logic for http and https
const unifiedServer = function (req, res) {

     //get the url and parse it
     const parsedUrl = url.parse(req.url, true);

     //get the path
     const path = parsedUrl.pathname;
     const trimmedPath = path.replace(/^\/+|\/+$/g,'');
 
     //Get the query string as an object e.g. ?fizz=buzz
     const queryStringObject = parsedUrl.query;
 
     //get the http method when request is made
     const method = req.method.toLowerCase();
 
     //get the headers as an object
     const headers = req.headers;
 
 
     //get the payload, if any
 const decoder = new StringDecoder('utf-8');
     let buffer = '';
     req.on('data', function(data){
         buffer += decoder.write(data);
 });
 req.on('end', function(){
     buffer += decoder.end();
 
 
     //choose the handler the request should go to
 
 const chosenHandler = typeof(router[trimmedPath]) != 'undefined' ? router[trimmedPath] : handlers.notFound;
 
 //construct the data object to send to the handler
 
 const data = {
     'trimmedPath' : trimmedPath,
     'queryStringObject': queryStringObject,
     'method' : method,
     'headers' : headers,
     'payload' :buffer
 
 }
 
 //Route the request to the handler specified in the router
 chosenHandler(data, function(statusCode, payload) {
 //use the status code called back by the handlers, or default
 
 statusCode = typeof(statusCode) =='number' ? statusCode:200;
 
 //use the payload called back by the handlers,default
 payload = typeof(payload) == 'object' ? payload : {};
 
 //convert the payload to a string
 const payloadString = JSON.stringify(payload);
 
 //Return the response
 res.setHeader('Content-Type', 'application/json');
 res.writeHead(statusCode);
 res.end(payloadString);
 console.log('Returning this response: ', statusCode, payloadString );
 })
 
 
  
 
  //Log the request path
 // console.log('Request received on path: ' + trimmedPath + 'method used is ' + method + ' and the query string is ', queryStringObject);
  //console.log('Request received with these headers', headers);
 // console.log('Request received with this payload: ', buffer);
 
 }) 
}



//defining a handler

const handlers = {}


//sample handler
 handlers.sample = function(data, callback) {
    //callback a status code and payload object
    callback(406, {'name' : 'Antony'} )
};

handlers.ping = function(data, callback) {
    callback(200);
}

//not found handler
handlers.notFound = function(data, callback) {
    callback(404)

}

//define a router
const router = {
    'sample' : handlers.sample,
    'ping' : handlers.ping
}




