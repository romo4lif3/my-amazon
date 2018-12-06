var sql = require("mysql");
var inq = require("inquirer");
require("console.table");



var connection = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("it work");
    myShtuff();

})

var myShtuff = function() {
    connection.query("SELECT * FROM stuff", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].prod_name + " || " + res[i].dep_name + " || " + res[i].price + " || " + res[i].stock + "\n")
        }
        custPrompt(res)
    })
}


var custPrompt = function(res) {
    inq.prompt([{
        type: "input",
        name: "choice",
        message: "What would you lke to purchase? [Quit with Q]"
    }]).then(function(answer) {
        var correct = false;
        for(var i = 0; i < res.length; i++) {

            if(res[i].prod_name == answer.choice) {

                correct = true;

                if(answer.choice.toUpperCase()=="Q"){

                    process.end()

                }

                var product = answer.choice

                var id = i;

                inq.prompt({
                    type: "input",
                    name: "quantity",
                    message: "How many would you like to purchase?",
                    validate: function(value){

                        if(isNaN(value)==false) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                }).then(function(answer){
                    if ((res[prod_name].stock - answer.quantity) > 0) {
                        connection.query("UPDATE stuff SET stock='" +
                        (res[prod_name].stock - answer.quantity)
                            + "' WHERE prod_name='" + product + "'",
                            function (err, res2) {
                                console.log("product bought!");
                                myShtuff();
                            })
                    } else{
                        console.log("Invalid selection")
                        custPrompt(res)
                    }
                })
            }
        }
        if(i == res.length && correct==false){
            console.log("Invalid selection")
            custPrompt(res)
        }   
    })
}

//purchased function working/finished