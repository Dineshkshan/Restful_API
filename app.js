const express=require('express');
const app=express();
const mysql=require('mysql');
var bodyParser = require('body-parser')

app.use(bodyParser.json())
//Create Database Connection
const mysqlConnection=mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'employeedb'
});

//Connect to DB
mysqlConnection.connect({multipleStatements: true},(err)=>
{
    if(!err)
    {
        return console.log("Database connected");
    }
    console.log(err);
});

app.get('/getdetails',(req,res)=>
{
   let query='SELECT * FROM EmployeeDetails';
   mysqlConnection.query(query,(err,results,fields)=>
   {
       if(err) return console.log(err);
       res.send(results);
   });
});
app.post('/insertdetails',(req,res)=>
{
    let query=req.body;
    mysqlConnection.query("INSERT INTO EmployeeDetails(EmployeeName,ProjectName,place) VALUES (?,?,?)",[query.EmployeeName,query.ProjectName,query.place],(err)=>
    {
       if(err)  return console.log(err);
       console.log("Database Inserted Sucessfully");
       res.send("Database Inserted Successfully");
    });
});
app.delete('/deletedetails/:id',(req,res)=>
{ 
   let id=req.params.id;
   mysqlConnection.query("DELETE FROM EmployeeDetails Where id=?",[id],(err)=>
   {
        if(err) return console.log(err);
        mysqlConnection.query('ALTER TABLE EmployeeDetails DROP id',(err)=>
        {
            if(err) return console.log(err);
            mysqlConnection.query('ALTER TABLE EmployeeDetails ADD id INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (id)',(err)=>
            {
               if(err) return console.log(err);
               console.log("Deleted Successfully");
               res.send("Deleted Successfully");
            });
        });
   });
});
app.put('/updatedetails/:id',(req,res)=>
{
    let id=req.params.id;
    let value=req.body;
    mysqlConnection.query("UPDATE EmployeeDetails SET EmployeeName=?,ProjectName=?,place=? WHERE id=?",[value.EmployeeName,value.ProjectName,value.place,id],(err)=>
    {
        if(err)  return console.log(err);
        res.send("Database Updated");
    });
});
const port=5000;
app.listen(port,(err)=>
{
  if(err) return console.log("Application is not working Properly");
  console.log("Application is working properly",port); 
});