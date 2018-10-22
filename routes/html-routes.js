
var path = require("path");
var db = require("../models");

module.exports = function (app) {

    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });
    
    // GET route for getting a spefic room. If the :route doesn't exist in the table the user is sent a 404
    // else they are send the index file and the room transfer is handled on the client side
    app.get("/:route", function (req, res) {
        db.Blob.findOne({
            where: {
                routeName: req.params.route,
            },
        })
            .then(function (results) {
                console.log(results);
                if(results){
                    res.sendFile(path.join(__dirname, "../public/index.html"));
                }
                else{
                    res.sendStatus(404);
                }
            });
        });
    };

    