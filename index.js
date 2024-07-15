const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const session = require("express-session");
const path = require("path");
const {v4:uuidv4} = require("uuid");
const mongoose = require("mongoose");
const router = require("./routes/routes");
const nocache = require("./Middlewares/customnocache");

const port = process.env.PORT || 3001;

app.set('view engine', 'ejs');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false
}))

app.use(nocache);

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', router);

//Connection to mongoDB
mongoose.connect("mongodb://localhost:27017/userDatabase")
.then(() => {
    console.log("Successfully connected to MongoDB");
}).catch((err) => {
    console.Error("Error connecting to MongoDB");
});

//Starting server
app.listen(port, (err) => {
    if(err) {
        console.log("Error loading server");
    }
    else {
        console.log("Server started listening on: http://localhost:3001")
    }
});