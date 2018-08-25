function get_recipe(recipe_id){
                
    $.ajax("http://localhost:8080/view/"+recipe_id, {
        type: "get",
        dataType: "json",
        success: function(data){
            console.log(data);
            var recipe_name = data[0][0].recipe_name;
            var recipe_meta = data[1][0];
            var recipe_source = recipe_meta.recipe_source;
            var recipe_yield = recipe_meta.recipe_yield;
            var recipe_time = recipe_meta.recipe_time;
            var ingredient_count = recipe_meta.ingredient_count;
            var ingredient_array = data[3];
            var steps_count = recipe_meta.steps_count;
            var steps_array = data[2];
            var halfed = Math.round(ingredient_count/2);
            
            $("#recipe_name").html(recipe_name);
            $("#recipe_yield").html(recipe_yield);
            $("#recipe_time").html(recipe_time);
            $("#recipe_source").html(recipe_source);
            
            for(var i = 0; i < ingredient_count; i++){
                if(i < halfed){
                    $("#firstPart").append("<li>"+ingredient_array[i].quantity+" "+ingredient_array[i].ingredient+"</li><br>");
                }
                else{
                    $("#secondPart").append("<li>"+ingredient_array[i].quantity+" "+ingredient_array[i].ingredient+"</li><br>");
                }
            }
            for(var i = 0; i < steps_count; i++){
                $("#stepbox").append('<p><strong>Step '+steps_array[i].step_count+': </strong><span>'+steps_array[i].step_value+'</span></p>');
            }
        },
        cache: false
    });
                
}

$(document).ready(function(){
    var url = window.location.href;
    var url_queries = url.substr(url.indexOf("?") + 1);
    var recipe_id = url_queries.substr(url_queries.indexOf("id=") + 3);
    get_recipe(recipe_id);
});