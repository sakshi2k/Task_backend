const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MONGO DB CONNECTION
mongoose.connect('mongodb://localhost:27017/schoolDB', {useNewUrlParser: true, useUnifiedTopology: true},
     (err) => {
        if(!err) console.log("Connected to DB"); 
     });

// Mongoose schema for school.
const schoolSchema = mongoose.Schema({
    schoolParEnt : String ,
    name : String,
    year : Number,
    noOfStudents : Number,
    address : String,
    city : String,
    state : String,
    district : String,
    postcode : Number
});

// Mongoose Model
const School = mongoose.model("School", schoolSchema);

// REST implementation at home route.
app.route("/")

    .get((req,res) => {
        res.render("form", {sucessMessage : ""});
    })

    .post((req, res) => {
        const {schoolParEnt, name, year, noOfStudents, address,
        city, state, district, postcode} = req.body;
        
        const newSchool = new School({
            schoolParEnt : schoolParEnt ,
            name : name,
            year : year,
            noOfStudents : noOfStudents,
            address : address,
            city : city,
            state : state,
            district : district,
            postcode : postcode
        });

        try{
            School.findOne({name : name}, (err, foundSchool) => { 
                if(!err){
                    if(foundSchool){
                        res.send("School already registered, Try another ?");
                    } else {
                        newSchool.save();    
                        res.send("Successfully registered");
                    }
                }
            })
        } catch(err){
            res.send(err);
        }
    });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});



