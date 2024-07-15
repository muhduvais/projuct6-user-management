const User = require("../models/config");

const toLogin = (req, res, next) => {
    res.redirect("/login");
}

const fromUserLogin = (req, res, next) => {
    if(req.session.user) {
        res.redirect("/userHome");
    }
    else if(req.session.admin) {
        res.redirect("/adminHome");
    }
    else {
        const logoutMessage = req.query.logout;
        res.render("login", {successMessage: logoutMessage});
    }
}

const checkLogin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});

        //Email validation
        const isValidEmail = email => {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        if(!email || !password) {
            res.render("login", {errMessage: "Please fill the fields"});
        }

        else if(!isValidEmail(email)) {
            res.render("login", {errMessage: "Invalid email!"})
        }
        else if(!user || (user.email !== email) || (user.password !== password)) {
            res.render("login", {errMessage: "Invalid username or password!"});
        }
        else if(user.isAdmin === "1") {
            req.session.admin = user;
            res.redirect("/adminHome");
        }
        else {
            req.session.user = user;
            res.redirect("/userHome");
            return;
        }
    }
    catch(err) {
        console.error("Error logging in", err);
        res.status(500).send("Internal server error");
    }
}

const fromUserHome = (req, res, next) => {
    if(req.session.user) {
        const {name, age, place, phone, email} = req.session.user;
        res.render("userHome", {name, age, place, phone, email});
    }
    else {
        res.redirect("/");
    }
    next();
}

const onUserLogout = (req, res, next) => {
    if(req.session.user) {
        delete req.session.user;
    }
        res.redirect("/login?logout=Logout Successfully...");
        next();
}

const toUserSignup = (req, res, next) => {
    res.render("signup", {formData: null});
}

const checkUserSignup = async (req, res, next) => {

    try {
        const {name, age, place, phone, email, password, cPassword, isAdmin} = req.body;

        const existingUser = await User.findOne({email});

        //Email validation
        const isValidEmail = email => {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        const isValidName = fname => {
            var regex = /^[a-zA-Z ]{2,30}$/;
            return regex.test(fname);
        }

        if(!name || !age || !place || !phone || !email || !password || !cPassword) {
            res.render("signup", {signupMessage: "fill all the fields!", formData: {name, age, place, phone, email}});
        }

        else if(!isValidName(name)) {
            res.render("signup", {nameMsg: "Enter a valid name!", formData: {name, age, place, phone, email}});
        }

        else if(existingUser) {
            res.status(400);
            res.render("signup", {signupMessage: "User already exists"});
        }
        else if(age.length > 100) {
            res.render("signup", {ageMsg: "Enter your correct age!", formData: {name, age, place, phone, email}})
        }

        else if(phone.length !== 10) {
            res.render("signup", {phoneMsg: "phone number must be 10 digits!", formData: {name, age, place, phone, email}})
        }

        else if(!isValidEmail(email)) {
            res.render("signup", {emailMsg: "invalid email!", formData: {name, age, place, phone, email}});
        }

        else if(password !== cPassword) {
            res.status(400);
            res.render("signup", {signupMessage: "passwords do not match!", formData: {name, age, place, phone, email}});
        }

        else {
            const newUser = new User({name, age, place, phone, email, password, cPassword, isAdmin});
            await newUser.save();
            res.render("login", {successMessage: "Registered successfully!"});
        }
        
    }
    catch(err) {
        console.error("Error registering user", err);
        res.status(500).send("Error registering user");
    }
}

module.exports = {
    toLogin,
    fromUserLogin,
    checkLogin,
    fromUserHome,
    onUserLogout,
    toUserSignup,
    checkUserSignup
}