var makeEdit = function(){
    $(".edit").attr("contentEditable", true);
}

//add step
var steps = 1;
var addStep = function(){
        
    steps = steps + 1;
    var stepHtml = "<p id='step"+steps+"'><strong>Step "+steps+": </strong><span class='edit' name='"+steps+"'></span></p>";
    $("#stepbox #step_buttons").before(stepHtml);
    if(steps > 1){
        $("#delStep").show();
    }else{
        $("#delStep").hide();
    }
        makeEdit(); 
}

var delStep = function(){
    $("#step"+steps).remove();
    steps = steps - 1;
    if(steps > 1){
        $("#delStep").show();
    }else{
        $("#delStep").hide();
    }
}

//
//add ingredient
var ingredient = 1;
var addIngredient = function(){
        
    ingredient = ingredient + 1;
    var ingredientHtml = "<tr id='"+ingredient+"'>"+
                        "<td>"+
                            "<span class='edit' name='"+ingredient+"'></span>"+
                        "</td>"+
                        "<td>"+
                            "<span class='edit' name='"+ingredient+"'></span>"+
                        "</td>"+
                    "</tr>";
    $("#tableBod #buttons").before(ingredientHtml);
    if(ingredient > 1){
        $("#delIngredient").show();
    }else{
        $("#delIngredient").hide();
    }
     makeEdit();    
}

var delIngredient = function(){
    $("#"+ingredient).remove();
    ingredient = ingredient - 1;
    if(ingredient > 1){
        $("#delIngredient").show();
    }else{
        $("#delIngredient").hide();
    }
}
//upload
var upload = function(){
    $("#buttons").remove();
    $("#step_buttons").remove();
    var name = $("#name").val();
    var recipeYield = $("#yield").text();
    var source = $("#source").text();
    var time = $("#time").text();
    //get ingredient info
    var ingredientsArr = [];
    var counter = 1;
    var ingredientName = '';
    var ingredientQuantity = '';
    $("#tableBod tr .edit").each(function(){
        var ingredient_count = '';
        if(counter === 1){
            ingredientName = $(this).text();
        }
        if(counter === 2){
            ingredientQuantity = $(this).text();
            ingredient_count = $(this).attr('name');
            counter = 0;
            ingredientsArr.push({ingredient: ingredientName, quantity: ingredientQuantity, in_count: ingredient_count});
        }
        counter = counter + 1;
    });
    
    var arr = $.map($('.edit'), function(n) {
		return $(n);
	});
    
    //get steps info
    var stepsArr = [];
    var stepValue = '';
    $("#stepbox p .edit").each(function(){
        var stepCount = '';
        stepValue = $(this).text();
        stepCount = $(this).attr('name');
        stepsArr.push({step_value: stepValue, step_count: stepCount});
    });
    
    $("#recipeHTML").val($("#recipe").html());
    if(name === ""){
        alert("Enter recipe name");
    }else{
        var recipeArr = [{recipe_name: name, recipe_yield: recipeYield, recipe_time: time, recipe_source: source, ingredient_array: ingredientsArr, steps_array: stepsArr}];
        
        $.ajax("http://localhost:8080/upload", {
                    type: "post",
                    data: {recipe_arr: recipeArr},
                    dataType: "html",
                    statusCode: {
                        101: function() {
                          alert( "page not found" );
                        }
                    },
                    success: function(data){
                       console.log(data);
                    } 
        });
    }
}
$(document).ready(function(){
    //hide buttons on load
    if(steps > 1){
        $("#delStep").show();
    }else{
        $("#delStep").hide();
    }
    
    if(ingredient > 1){
        $("#delIngredient").show();
    }else{
        $("#delIngredient").hide();
    }
    //set contentEditable
    makeEdit();
    
});