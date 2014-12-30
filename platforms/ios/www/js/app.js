// begin view functions

$(function(){
    
    $(window).on("load", function(){
        
        var user_id = window.localStorage.getItem("user_id");
        
        $("#main-view").load("view/splash.html", function(data){
                    if(!user_id)
                    {

                        var directory = "static";

                    }
                    else
                    {

                        var directory = "dynamic";

                    }
                     $("#splash-main").load("view/"+directory+"/splash-main.htmL");
                     $("#splash-menu").load("view/"+directory+"/splash-menu.html");
       });
    }); 
});

$(function(){
    $("body").on("click", ".load-view", function(){
        $("#main-view").html("<h2><i class='fa fa-spinner spin'></i> Loading...</h2>")
        var view = $(this).attr("href");
        if($('.navbar-toggle').css('display') !='none'){
            $(".navbar-toggle").trigger( "click" );
        }
        $("#main-view").load("view/"+view);
        var data =  {"action":"get", "request":view}
        processAction(data);
        return false;
    });
});

$(function(){
    $("body").on("click", ".ui-element", function(){
       var data = $(this).data();
       processAction(data);
       return false;
    });
});


// end view functions
//
// begin controller functions

function processAction(data)
{
    switch(data.action)
    {
        case("post") :
            var form = data.form;
            var formData = $("#" + form).serialize();
            alert(formData);
            break;
        
        case("get") :
            var request = data.request;
            break;
        
        case("modify") :
            var data = data.formdata;
            break;
    }
    
}

// end controller functions