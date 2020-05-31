var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./model/user');

var app = express();
// var uri = "mongodb://localhost/";
var uri = "mongodb+srv://mantra:Mantra@101@mantra-cbvx0.gcp.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Main code

// To get the data of individual user
app.get('/user/:sent_uid', function (request, response) {
    User.find({
        "uid": request.params.sent_uid
    }, 'uid gibberish contaminated infected', function (error, user) {
        if (error) {
            response.status(500).send({
                error: "conuldn't load Data!!!"
            });
        } else {
            response.status(200).send(user);
        }
    });
});

// To post the data of individual user
app.post('/user', function (request, response) {
    sent_uid = request.body.uid;
    sent_gibberish = request.body.gibberish;

    User.findOne({
        "uid": sent_uid
    }, 'uid gibberish contaminated infected', function (err, user) {
        if (user) {
            buffer_gib = user.gibberish;
            sent_gibberish.forEach(function (val) {
                buffer_gib.push(val);
            });
            user.gibberish = buffer_gib;
            user.save(function (err, savedData) {
                if (err) {
                    response.status(500).send({
                        error: "conuldn't save Data!!!"
                    });
                } else {
                    response.status(200).send(savedData);
                }
            });
        } else {
            new_user = new User();
            new_user.uid = sent_uid;
            buffer_gib = new_user.gibberish;
            sent_gibberish.forEach(function (val) {
                buffer_gib.push(val);
            });
            new_user.gibberish = buffer_gib;
            new_user.save(function (err, savedData) {
                if (err) {
                    response.status(500).send({
                        error: "conuldn't save Data!!!"
                    });
                } else {
                    response.status(200).send(savedData);
                }
            });
        }
    });
});

// To report infection
app.post('/report', function (request, response) {
    sent_uid = request.body.uid;
    sent_infected = request.body.infected;

    User.findOne({
        "uid": sent_uid
    }, function (err, infected_user) {
        infected_user.infected = sent_infected;
        infected_user.save(function (err, savedData) {
            if (err) {
                response.status.send({
                    error: "Couldnt Update Data!!!"
                });
            } else {
                //To update Infection in all the users
                User.find({}, function (err, users) {
                    if (err) {
                        response.status(500).send("Error!!!!");
                        return;
                    } else {
                        users.forEach(function (user) {
                            user.gibberish.forEach(function (gib) {
                                if (gib == infected_user.uid) {
                                    user.contaminated = true;
                                    user.save(function (err, savedUsers) {
                                        if (err) {
                                            response.status(500).send({
                                                error: "conuldn't save Data!!!"
                                            });
                                        } else {
                                            response.status(200).send(savedUsers);
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
                //response.status(200).send(savedData);
            }
        });
    });
});

var PORT = process.env.PORT || 3005;
app.listen(PORT, function () {
    console.log("cuddler Server running on port: 3005!!!\n");
});