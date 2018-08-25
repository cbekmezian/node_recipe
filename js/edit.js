$(document).ready(function(){
    //add ingredients buttons
    $("#tableBod").append('<tr id="buttons" style="display: none;"><td><span class="fixed"><input type="button" value="+" onclick="addIngredient()" class="add"></span></td><td><span class="fixed"><input type="button" id="delIngredient" value="-" class="del" onclick="delIngredient()"></span></td></tr>');
    
    //add steps buttons
    var stepButtons = "<table id='step_buttons'>"+
        
            "<tr>"+
            
                "<td>"+
                    
                    "<input type='button' value='+' style='border: none;' class='add' onclick='addStep()'>"+
                    
                "</td>"+
                
                "<td id='delStep'>"+
        
                     "<input type='button' style='border: none;'  value='-' class='del' onclick='delStep()'>"+
                    
                "</td>"+
            
            "</tr>"+
            
        "</table>";
    $("#stepbox").append(stepButtons);
    
    
    
    $("[contentEditable='false']").attr('contentEditable', true).addClass('edit');
});
 var $getIds = $.map($("tr"), function(n){
        return $(n).attr('id');
    });
    
    var last = $getIds.length;
    //var ingredient = parseInt($getIds[last-1]);
    var ingredient = last;
    var ingredient2 = parseInt($("#tableBod tr:nth-last-of-type(2)").attr("id"));
    var $getStepIds = $.map($("#stepbox > p"), function(n){
        return $(n).attr('id');
    });
    
    var lastStep = $getStepIds.length;
    var step = parseInt($getStepIds[lastStep-1].replace(/\D/g, ""));
    
    var makeEdit = function(){
        $(".edit").attr("contentEditable", true);
    }
    
    if(step > 1){
        $("#delStep").show();
    }else{
        $("#delStep").hide();
    }
    
    if(ingredient > 1){
        $("#delIngredient").show();
    }else{
        $("#delIngredient").hide();
    }
//add step

var addStep = function(){
        
    step = step + 1;
    var stepHtml = "<p id='step"+step+"'><strong>Step "+step+": </strong><span class='edit'></span></p>";
    $("#stepbox #step_buttons").before(stepHtml);
    if(step > 1){
        $("#delStep").show();
    }else{
        $("#delStep").hide();
    }
        makeEdit(); 
}

var delStep = function(){
    $("#step"+step).remove();
    step = step - 1;
    if(step > 1){
        $("#delStep").show();
    }else{
        $("#delStep").hide();
    }
}

//
//add ingredient
var addIngredient = function(){
        
    ingredient = ingredient + 1;
    var ingredientHtml = "<tr id='"+ingredient+"'>"+
                        "<td>"+
                            "<span class='edit'></span>"+
                        "</td>"+
                        "<td>"+
                            "<span class='edit'></span>"+
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

var update = function(){
    $("#buttons").remove();
    $("#step_buttons").remove();
    var arr = $.map($('.edit'), function(n) {
		return $(n);
	});
    
    for(var a = 0; a < arr.length; a++){
        $(arr[a]).attr('contentEditable', false).removeClass('edit');
    }
    
    $("#recipeHTML").val($("#recipe").html());
    $("#update").submit();
}

var showDelete = function(me){
    $(me).css({"min-width":"0px"});
    $(me).animate({width:"0px", padding: "0px"}, function(){$(me).css({"display": "none"});});
    $("#del").show(500);
}