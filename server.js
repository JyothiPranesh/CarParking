//var express=require('express');
/*var mongojs=require('mongojs');


var bodyParser= require('body-parser');*/
var express= require('express');
var mongojs= require('mongojs');
var bodyParser=require('body-parser');
var db1 = mongojs("finalCarDb", ['finalCarDbCollection']);

var app=express();
app.use(express.static(__dirname+"/public/html"));
app.use(bodyParser.json());
app.listen(5115);
console.log("server started at port 5115");


app.get('/carParking', function (req, res) {
    db1.finalCarDbCollection.find(function (err, docs) {
        res.json(docs);
    });
});

app.post('/emptyDB', function(req,res){
    db1.finalCarDbCollection.drop(function(req,res){
        return "done dropping db"
    });
    
})


app.delete('/carParking',function(req,res){
    db1.finalCarDbCollection.drop();
})
 

app.post('/carParking', function (req, res) {
    console.log(req.body);

    //db1.finalCarDbCollection.drop();
       
   
    db1.finalCarDbCollection.insert(req.body, function (err, doc) {
        res.json(doc);
    });
});



app.delete('/carParking/:id', function(req,res){
    var id=req.params.id;
    db1.finalCarDbCollection.remove({_id:mongojs.ObjectId(id)},function(err,doc){
        res.json(doc);
    });
});




