var http = require('http');
var url = require('url');
var express = require('express');
var app = express();
var mysql = require('mysql');
var cors = require('cors');
var slashes = require('slashes');
var bodyParser = require('body-parser');
//const PORT = process.env.PORT || 4001;
//port
var PORT = 8080;
//body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//allow CORS
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }});
//mysql connection
var con = mysql.createConnection({
  host: "localhost",
  user: "chad",
  password: "ann5-flighty",
  database: "family_recipes"
});
//DB Functions
function dbconn() {
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      console.log(con.state); 
    });
}
function dbquery(q, res) {
    con.query(q,  function (err, result, fields) {
        if (err) {
            throw err;
        } else {
            res.json(result);
        }
        
    });
}
function dbview(sql, res) {
    var results = [];

    function conduct_q (s, i) {
        con.query(s,  function (err, result, fields) {
            if (err) {
                throw err;
            } else {
                results.push(result);
                if(i == 3){
                    res.json(results);
                    res.end();
                }
            }
        });
    }
    
    for(var i = 0; i <= 3; i++){
        conduct_q(sql[i], i);
    }
}
function dbinsert(sql, more, res) {

    con.query(sql,  function (err, result, fields) {
        if (err){
            console.log("The error is: " + err.message);
            if(err.message.indexOf("ER_DUP_ENTRY: Duplicate entry") > -1 ){
                res.send("Error: it looks like there is already a recipe with that name!");
            }
        }
        else if(more != null){
            upload_full_recipe(more, result.insertId, res);
        }
    });
}
//connect to DB
dbconn();
//get all request
app.get("/all", function(req, res, next) {
    
    var sql = "SELECT recipe_id, recipe_name FROM recipes ORDER BY recipe_name ASC";
    dbquery(sql, res);
    
});
//get search request
app.get("/search/:searchKey", function(req, res, next) {
    
    var query = slashes.add(req.params.searchKey);
    var sql = "SELECT recipe_id, recipe_name FROM recipes WHERE recipe_name LIKE '%"+query+"%' ORDER BY recipe_name ASC";
    if(query == 'null'){
        sql = "SELECT recipe_id, recipe_name FROM recipes ORDER BY recipe_name ASC";
    }
    dbquery(sql, res);
    
});
//get recipe to display
app.get("/view/:recipe_id", function(req, res, next) {
    
    var recipe_id = req.params.recipe_id;
    var sql_name = `SELECT recipe_name FROM recipes WHERE recipe_id = ${recipe_id};`;
    var recipe_meta = `SELECT recipe_source, recipe_yield, recipe_time, ingredient_count, steps_count FROM recipe_meta WHERE recipe_id = ${recipe_id};`;
    var steps_sql = `SELECT id, step_count, step_value FROM steps WHERE recipe_id = ${recipe_id} ORDER BY step_count ASC;`;
    var ingredients_sql = `SELECT id, ingredient, quantity FROM ingredients WHERE recipe_id=${recipe_id} ORDER BY id ASC;`;
    
    var sql = [sql_name, recipe_meta, steps_sql, ingredients_sql];
    dbview(sql, res);
    
});
//upload recipe name and get id function
function upload_recipe(recipe_info, res){

    /* get all the recipe values and assign them to variables */
    var recipe_name = slashes.add(recipe_info[0]['recipe_name']);
    // sql for inserting intial recipe into "recipes" and getting its insert id
    var create_sql = `INSERT INTO recipes (recipe_name) VALUES ('${recipe_name}')`;
    dbinsert(create_sql, recipe_info, res);

}
//upload the rest of the recipe
function upload_full_recipe(recipe_info, recipe_id, res){
    var completed_fors = 0;
    var recipe_yield = recipe_info[0]['recipe_yield'];
    var recipe_time = recipe_info[0]['recipe_time'];
    var recipe_source = recipe_info[0]['recipe_source'];
    // get array of ingredients and the array's length
    var ingredient_array = recipe_info[0]['ingredient_array'];
    var ingredient_count = ingredient_array.length;
    // get array of steps and the array's length
    var steps_array = recipe_info[0]['steps_array'];
    var steps_count = steps_array.length;
    
    // sql for inserting meta data in tabe "recipe_meta"
    var majority_sql = `INSERT INTO recipe_meta (recipe_id, recipe_yield, recipe_time, recipe_source, ingredient_count, steps_count) VALUES (${recipe_id}, "${recipe_yield}", "${recipe_time}", "${recipe_source}", ${ingredient_count}, ${steps_count});`;
    dbinsert(majority_sql);
    // sql for inserting ingredients in table "ingredients"
    var insert_ingredients = "INSERT INTO ingredients (recipe_id, ingredient, quantity) VALUES ";
    for(var i = 0; i <= ingredient_count-1; i++){
        insert_ingredients += `(${recipe_id}, "${ingredient_array[i]['ingredient']}", "${ingredient_array[i]['quantity']}")`;
        if(i < ingredient_count-1){
            insert_ingredients += ", ";
        }
        
        if(ingredient_count-1 === i){
           // majority_sql += " " + insert_ingredients + ";";
            completed_fors = completed_fors + 1;
                dbinsert(insert_ingredients);
        }
    }
    // sql for inserting steps in table "steps"
    var insert_steps = "INSERT INTO steps (recipe_id, step_count, step_value) VALUES";
    for(var i = 0; i <= steps_count-1; i++){
        insert_steps += `(${recipe_id}, ${steps_array[i]['step_count']}, "${steps_array[i]['step_value']}")`;
        if(i < steps_count-1){
            insert_steps += ", ";
        }
        if(steps_count-1 === i){
            //majority_sql += " " + insert_steps + ";";
            completed_fors = completed_fors + 1;
            //if(completed_fors === 2){
                dbinsert(insert_steps);
            //}
        }
    }
}
//post upload
app.post("/upload", function(req, res, next) {
    var responses = upload_recipe(req.body.recipe_arr, res);
    var recipe_info = req.body.recipe_arr;
    //res.end();
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});