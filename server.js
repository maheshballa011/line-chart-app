var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var port = 3001;

mongoose.connect('mongodb://localhost:27017/linechart', function (error, db) {
    if(error){
        console.log(error);
    }

    console.log(db);
});

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log(res);
    res.status(200);
    next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: 'text/plain'}));
app.use(methodOverride());



//defining model
var FileData = mongoose.model('FileData', {
    graphData: Array
});

app.post('/api/filecontent', function (req, res) {
    console.log(req.body);
    FileData.create({
    graphData: req.body.graphData,
       done: false
   }, function (error, filecontent) {
       if(error){
           res.send(error);
       }

       res.json(filecontent);
   });
   
});

app.get('*', function (req, res) {
   res.send('welcome to node');
});



app.listen(port);
console.log('app listening on port number '+port);