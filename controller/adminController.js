const User = require("../models/config");

const fromAdminLogin = (req, res, next) => {
    if(req.session.admin) {
        res.redirect("/adminHome");
    }
    else {
        res.render("login");
    }
    next();
}

const fromAdminHome = async (req, res, next) => {
    if(req.session.admin && req.session.admin.isAdmin === "1") {
        const usersList = await User.find({isAdmin: {$ne: "1"}});
        res.render("adminHome", {usersList});
    }
    else {
        res.redirect("/adminLogin");
    }
    next();
}

const addUser = async (req, res, next) => {

    try {
        const {name, age, place, phone, email, password, cPassword, isAdmin} = req.body;

        const existingUser = await User.findOne({email});

        //Email validation
        const isValidEmail = email => {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        if(!name || !age || !place || !phone || !email || !password || !cPassword) {
            const usersList = await User.find({isAdmin: {$ne: "1"}});
            res.render("adminHome", {signupMessage: "fill all the fields!", showModal: true, usersList});
        }

        else if(existingUser) {
            const usersList = await User.find({isAdmin: {$ne: "1"}});
            res.status(400);
            res.render("adminHome", {signupMessage: "User already exists", showModal: true, usersList});
        }

        else if(phone.length !== 10) {
            const usersList = await User.find({isAdmin: {$ne: "1"}});
            res.render("adminHome", {signupMessage: "phone number must be 10 digits!", showModal: true, usersList})
        }

        else if(!isValidEmail(email)) {
            const usersList = await User.find({isAdmin: {$ne: "1"}});
            res.render("adminHome", {signupMessage: "invalid email!", showModal: true, usersList});
        }

        else if(password !== cPassword) {
            const usersList = await User.find({isAdmin: {$ne: "1"}});
            res.status(400);
            res.render("adminHome", {signupMessage: "passwords do not match!", formData: {name, age, place, phone, email}, showModal: true});
        }

        else {
            const newUser = new User({name, age, place, phone, email, password, cPassword, isAdmin});
            await newUser.save();

            const usersList = await User.find({isAdmin: {$ne: "1"}});
            res.render("adminHome", {usersList});
        }
        
    }
    catch(err) {
        console.error("Error registering user", err);
        res.status(500).send("Error registering user");
    }
    next();
}

const editUser = async (req, res, next) => {
    try{
        const userId = req.params.id;
        const {name, age, place, phone, email} = req.body;

        await User.findByIdAndUpdate(userId, {name, age, place, phone, email});
        const usersList = await User.find({isAdmin: {$ne: "1"}});

        res.render("adminHome", {usersList});
    }
    catch(err) {
        console.log("Error updating user", err);
        res.status(500).send("Error updating user!");
    }
    next();

}

const deleteUser = async (req, res, next) => {
    try{
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        const usersList = await User.find({isAdmin: {$ne: "1"}});

        res.render("adminHome", {usersList});
    }
    catch(err) {
        console.log("Error deleting user!", err);
        res.status(500).send("Error deleting user!");
    }
    next();
}

const adminLogout = (req, res, next) => {
    if(req.session.admin) {
        delete req.session.admin;
    }
    res.redirect('/login');
    next();

}

module.exports = {
    fromAdminLogin,
    fromAdminHome,
    addUser,
    editUser,
    deleteUser,
    adminLogout
}