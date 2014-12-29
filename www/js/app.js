// View Handler
$(function(){
   
    $(".load-view").click(function(){
        var view = $(this).attr("href");
        alert(view);
        $("#main-view").load("view/"+view);
        return false;
    });
    
});

// Data Handler
$(function(){
   
    $(".button").click(function(){
        
    });
});

