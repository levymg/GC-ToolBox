// begin view functions

var api = "http://www.generalcarbide.com/api/index.php/";

$(function(){
    
    $(window).on("load", function(){
        
        
        $("#main-view").load("view/splash.html", function(data){
            
            var user_id = localStorage.getItem("user_id");
            
                    if(!user_id)
                    {

                        var directory = "static";

                    }
                    else
                    {

                        var directory = "dynamic";

                    }
                    
                    if(directory === "static")
                    {
                        
                        $("#splash-main").load("view/"+directory+"/splash-main.html", user_id);
                          
                    }
                    
                    else
                    {
                          
                          
                          $("#splash-main").load("view/"+directory+"/splash-main.html", function(){
                             
                              var data = {action:"get", request:"user", formData:user_id};
                          
                              processAction(data);
                              
                          });
                    }
                     
       });
    }); 
});

$(function(){
   
    $("body").on("click", ".animated", function(){
        
         $(this).find(".animated-element").addClass("fa-spin").delay(200).removeClass('fa-spin', 100);
        
    });
    
});

$(function(){
    
    $("body").on("click", ".load-view", function(){
        
        $("#main-view").html("<div class='col-xs-12 text-center'><p class='white'><i class='fa fa-spinner fa-spin'></i><br /> Loading...</p></div>");
        
        var view = $(this).attr("href");
        
        if($('.navbar-collapse').css('display') !== 'none'){
            
            $(".navbar-toggle").trigger( "click" );
            
        }
        
        $("#main-view").load("view/"+view);
        
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

$(function () {
    
    $("body").on('click', '[data-toggle="tooltip"]', function(){

        $(this).tooltip('toggle');

        return false;

    });
  
});


// end view functions
//
// begin controller functions

function processAction(data, callback)
{
    
    switch(data.action)
    {
        
        //REST Actions
        
        case("post") :
            
            var form = data.form;
            
            var formData = $("#" + form).serialize() + "&action=" + form;
            
            postData(formData, data.form);
            
            break;
        
        case("get") :
            
            var request = data.request;
            
            var id = data.formData;
            
            getData(request, id, callback);
            
            break;
        
        case("put") :
            
            var form = data.form;
            
            var formData = $("#" + form).serialize() + "&action=" + form;
            
            putData(formData, data.form);
            
            break;
        
        case("delete") :
            
            var request = data.request;
            
            
            break;
            
        //
        //UI Actions
        //
            
         case("modify") :
          
           $("#notification").load("view/static/"+ data.form +".html", function(){
               
                $("#notification").modal("show");
               
           });
            
            break;
            
        case("logout") :
            
            logout();
            
            break;
    }
    
}

function postData(formData, form)
{
    
    switch(form)
    {
        
        case "register-form" :
            
            var request = "gcusers/user/format/json";
            
            createUser(request, formData);
            
            break;
            
        case "login-form" :
            
            var request = "gcusers/user/format/json";
            
            authenticateUser(request, formData);
            
            break;
    }
}

function getData(request, formData, callback)
{
    
    switch(request)
    {
        case("user") :
            
            var resource = "gcusers/";
            
            var resource_id = "user_id";
            
            var callback = request;
            
            var uri =  api + resource + request;
            
            break;
    }
    
    $.get( uri, {"resource_id" : formData, "format": "json", "callback" : "displayData" } )
        
            .done(function( data ) {
                
                callback(data);
        
            })
            
            .fail(function( data) {
                
                alert("There was an error logging into your account.  Please contact General Carbide.");
        
                localStorage.deleteItem("user_id");
                
                location.reload();
        
            });
    
}

function putData(formData)
{
    
    var user_id = localStorage.getItem("user_id");
    
    var request = "gcusers/user/id/"+user_id+"/format/json";
    
    $.ajax({
        
            url: api + request,
            
            data: {"first_name" : "Greg", "last_name" : "", "company": "Levy MG", "phone" : "phone"},
            
            type: 'PUT',
            
            complete: function(data) {
                
                alert(JSON.stringify(data));
                
            }
            
    }); 
    
}
    
function createUser(request, formData)
{
    $.post(api + request + "/",  formData )
    
        .done(function(data, textStatus, xhr) {
            
            if(xhr.status === 200)
            {
                
                $("#main-view").load("view/splash.html", function() {
                    
                    $("#splash-main").load(data.callback, function(){
                        
                        $('html,body').animate({
                            
                            scrollTop: $(data.focus).offset().top
                            
                         });
                            
                        $(this).find(".error-messages").html("<p>" + data.message + "</p>");
                            
                    });
                    
                });

            }
                    
        })
        
        .fail(function(jqXHR, textStatus, xhr ) {
            
            var data = JSON.parse(jqXHR.responseText);
    
            var error = data.message;
            
            $(".error-messages").html(error);
            
        });
}
    
        


function authenticateUser(request, formData)
{
    
     $.post(api + request + "/",  formData )
    
        .done(function(data, textStatus, xhr) {
            
            localStorage.setItem("user_id", data.user_id);
    
            location.reload();
                    
        })
        
        .fail(function(jqXHR, textStatus, xhr ) {
            
            var data = JSON.parse(jqXHR.responseText);
    
            var error = data.message;
            
            $(".error-messages").html(error);
            
            if(jqXHR.status === 400)
            {
                
               localStorage.expires = data.expires;
               
            }
            
        });
}

function logout()
{
    
    localStorage.removeItem("user_id");
    
    location.reload();
    
}

function displayData(data)
{
    
   $.each(data, function(i, val) {
       
      if(!val)
      {
          
          val = "(None)";
          
      }
       
        $("." + i).html(val);
    
  });
    
}

    

// end controller functions

