var express = require('express')
var app = express()
var morgan = require('morgan');
port = process.env.PORT || 8080;
var mysql = require('mysql');

app.set('view engine', 'ejs');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'my_sql',
    database : 'gstdata'
});

connection.connect(function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("connected")
    }
});

//mongoose.connect('mongodb://localhost/GSTDemo');
app.use(morgan('dev'))

app.listen(port, function(){
    console.log('listening on port ' + port)
});

app.get('/', function (req, res) {
  connection.query("SELECT * FROM itemlist",function(err,rows,fields){
     if(err){
         console.log("query error")
     }
      else{
          res.render("index",{data:rows});
      }
  });
});

app.get('/itemlist', function (req, res) {
console.log(req.query.itemName);    
connection.query("INSERT INTO itemlist(itemName,price,gstSlab,timeStamp) VALUES('"+req.query.itemName+"',"+req.query.price+","+req.query.gstSlab+",CURRENT_TIME())",function(err,rows,fields){
   if(err){
         console.log("query error");
     }
      else{
          console.log("success");
      } 
});
   connection.query("SELECT * FROM itemlist",function(err,rows,fields){
     if(err){
         console.log("query error")
     }
      else{
          res.render("itemlist",{data:rows,product:req.query.itemName});
      }
  }); 
});

app.get('/viewTable', function (req, res) {
  connection.query("SELECT * FROM itemlist",function(err,rows,fields){
     if(err){
         console.log("query error")
     }
      else{
          res.render("viewTable",{data:rows});
      }
  });
});


app.use(function(req, res, next) {
  var err = new Error('Page not Found');
  res.status(404).send(err.message);  
});
