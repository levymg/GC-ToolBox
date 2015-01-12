// globals
// will eventually truncate index.php with htaccess, but for now just leave the index file for easier routing
var api = "http://www.generalcarbide.com/api/index.php/";

// hacks

$(function(){
   
    // iOS, toggle static and fixed navbar on focus field scrolling
    // not really a hack it doesn't seem to be working right on the simulator, will have to test on live device (1.9.15)
    
    $("input").on('focus', function(){
        
        $(".navbar-nav").css({position:'absolute!important'});
        
        $(window).scrollTop(0);
        
    });
    
    $("input").on('blur', function(){
        
        $(".navbar-nav").css({position:'fixed!important'});
        
    });

});

//
// dom functions
//

$(function(){
    
    $(window).on("load", function(){
        
        $("#main-view").load("view/splash.html", function(data){
            // grab the user id for now
            var user_id = localStorage.getItem("user_id");
            // clear any hanging session variables from REST calls for a clean slate
            sessionStorage.clear();
            
                    if(!user_id)
                    {
                        // only for homepage and build of q&a for now
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
                             // grab the user id if the user is logged in
                             // if they don't authenticate, they'll get logged out
                              var data = {action:"get", request:"user", formData:user_id};
                              
                              // our not so dry proessAction() function accepts and parses 
                              // the data variables associated with the click handler's element
                              
                              processAction(data);
                              
                          });
                    }
               //netbeans misformats everything      
       });
    }); 
});

$(function(){
   
    $("body").on("click", ".animated", function(){
         // gotta implement with all REST calls
         // just on a few elements for now
         $(this).find(".animated-element").addClass("fa-spin").delay(200).removeClass('fa-spin', 100);
        
    });
    
});


$(function(){
    
    $("body").on("click", ".load-view", function(){
        // this dreaded pasta bowl loads up any view with an attr .html inside of the views directory
        // for timesake i had to quickly implement a dirty clientside routing system, easily breakable
        // does the trick for what it's worth, and functions cross-device
        // angularJS is a much better alternative
        $("#main-view").html("<div class='col-xs-12 text-center'><p class='white'><i class='fa fa-spinner fa-spin'></i><br /> Loading...</p></div>");
        
        var view = $(this).attr("href");
        // if this is a navbar element, we're gonna close the navbar since it'll be open
        if($('.navbar-collapse').css('display') !== 'none'){
            
            $(".navbar-toggle").trigger( "click" );
            
        }
        
        $("#main-view").load("view/"+view, function() {
               
              
                if(view === "gradeselector.html")
                {
                   // grab our data for the gradeselector
                   displayData(view);
                     
                }
              
        });
        
        
        return false;
        
    });
});

$(function(){
    
    $('body').on('click', '.toggle-canvas', function () {
        
        if($('.row-offcanvas').hasClass("active"))
        {
            // clear our tables and options
            $("div.option").removeClass("show").addClass("hide");
            
            $("table").html("");
            
        }
        
        $('.row-offcanvas').toggleClass('active');
        
        
        return false;
        
  });
    
});

$(function(){
    
    $("body").on("click", ".toggle-select", function(){
        //simple select on/off
        $(this).find("i").toggleClass("fa-toggle-off fa-toggle-on");
        
        return false;
        
    });
})

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

$(function() {
   
    $('#notification').on('hidden.bs.modal', function () {
        
        $("#notification").html("");
        
         var request = sessionStorage.getItem("request");
       
        if(request)
        {
            
            var action = sessionStorage.getItem("action");
            
            var formData = sessionStorage.getItem("formData");
            
            var callback = sessionStorage.getItem("callback");
           
            var frontend = sessionStorage.getItem("frontend");
            
            var callbackData = {action:"get", request: "user", formData: formData};
            
            processAction(callbackData);
            
        }
                
    });
    
});

$(function(){
   
    
    $('#notification').on('show.bs.modal', function (data) {
            
            var data = null;
            
            $(this).find("form").each(function() {
                
               var data = this.name;
               
               if(data)
               {
                   
                   switch(data)
                   {
                       
                        case "edit-profile" :
                            
                            var action = "get";
                            
                            var request = "user";
                            
                            var formData = localStorage.getItem("user_id");
                            
                            var data = {action : action, request : request, formData : formData };
                            
                            processAction(data);
                            
                            break;
                            
                         case "gcgs-form" :
                             
                             if(localStorage.getItem("user_id"))
                             {
                                 
                                    var action = "get";
                            
                                    var request = "user";

                                    var formData = localStorage.getItem("user_id");

                                    var data = {action : action, request : request, formData : formData };
                                 
                             }
                            
                            processAction(data);
                            
                            break;
                       
                   }
                   
               }
               
            });
            
    });
    
});

$(function(){
   
    $("body").on("click", ".dismiss", function(){
        
        var parent =  $(this).closest('div').attr('id');
        
        $(this).parents("li").remove();
        
        hideParent(parent);
        
        var resource_id = $(this).data('resource_id');
        
        var formData = { resource_id : resource_id };
        
         $.ajax({
        
            url: api + "/gcnotifications/notifications/",
            type: "POST",
            data: formData,
            dataType: "json"
        
        });
        
        return false;
        
    });
    
});

function hideParent(parent)
{
    
   var size = $("#" + parent).find("ul").children().length;
  
   if(!size)
   {
       
       $("#" + parent).removeClass("show").addClass("hide");
       
   }
   
   
}

// end dom functions
//
// begin controller functions

function processAction(data)
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
            
            getData(request, id);
            
            break;
        //
        //UI Actions
        //
            
         case("modify") :
             
            if(data.form == "gcgs")
            {
                
                var ln = $("table.gradesheet").find("i.fa-toggle-on").length;
                
                if(ln === 0)
                {
                    alert("Please select a gradesheet to download.");
                    
                    return false;
                    
                }
                
                else
                {
                           
                   var gradesheets = $.map($('table.gradesheet').find("i.fa-toggle-on"), function(el) {
                       
                                            return {"gradesheet": $(el).data('formdata')};
                                            
                                        });
                    
                    sessionStorage.setItem("gradesheets", gradesheets);
                    
                }

            }
          
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
    
    var user_id = localStorage.getItem("user_id");
    
    var token = localStorage.getItem("token");
    
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
            
        case "edit-profile" :
            
            var request = "gcusers/user/user_id/" + user_id + "/format/json";
            
            formData = append(formData, token);
            
            updateUser(request, formData);
            
            break;
            
        case "change-password" :
            
            var request = "gcusers/user/user_id/" + user_id + "/format/json";
            
            append(formData, token);
            
            updateUser(request, formData);
            
            break;
            
        case "forgot-form" :
            
            var request = "gcusers/user/format/json";
            
            createUser(request, formData);
            
    }
}

function getData(request, formData)
{
    
    switch(request)
    {
        case("user") :
            
            var resource = "gcusers/";
            
            var callback = request;
            
            var uri =  api + resource + request;
            
            break;
            
        case("industry") :
            
            var resource = "gcgs/industry/";
            
             var callback = request;
            
            var uri = api + resource;
            
            break;
            
    }
    
    
    $.get( uri, {"resource_id" : formData, "format": "json", "callback" : "displayData" } )
            
            
            .fail(function(data, responseText, xhr) {
                
                alert("There was an error retrieving the data you requested.");
        
                localStorage.clear();
                
                location.reload();
        
            });
    
}
    
function createUser(request, formData)
{
    
    $.ajax({
        
        url: api + request + "/",
        type: "POST",
        data: formData,
        dataType: "json"
        
    })
    
        .done(function(data, textStatus, xhr) {
            
            if(xhr.status === 200)
            {
                
                $("#main-view").load("view/splash.html", function() {
                    
                    $("#splash-main").load(data.callback, function(){
                        
                        $('html,body').animate({
                            
                            scrollTop: $(data.focus).offset().topscroll
                            
                         });
                            
                        $(this).find(".error-messages").html("<p>" + data.message + "</p>");
                            
                    });
                    
                });

            }
            else {
                
                alert(xhr.status);
                
            }
                    
        })
        
        .fail(function(jqXHR, textStatus, xhr ) {
            
            var data = JSON.parse(jqXHR.responseText);
    
            var error = data.message;
            
            $(".error-messages").html(error);
            
        });
       
}

function updateUser(request, formData)
{
    
    $.ajax({
        
        url: api + request + "/",
        type: "POST",
        data: formData,
        dataType: "json"
        
    })
    
        .done(function(data, textStatus, xhr) {
            
            sessionStorage.setItem("action", "get");
    
            sessionStorage.setItem("request", "user");
            
            sessionStorage.setItem("formData", data.user_id);
            
            sessionStorage.setItem("callback", data.callback);
            
            sessionStorage.setItem("frontend", data.frontend);
            
            $("#notification").modal("hide");
                
        })
        
        .fail(function(jqXHR, textStatus, xhr ) {
            
            var data = JSON.parse(jqXHR.responseText);
    
            var error = data.message;
            
            $(".error-messages").html(error);
            
        });
        
}
    
function authenticateUser(request, formData)
{
    
     $.ajax({
        
        url: api + request + "/",
        type: "POST",
        data: formData,
        dataType: "json"
        
    })
    
        .done(function(data, textStatus, xhr) {
            
            
            localStorage.setItem("user_id", data.user_id);
    
            localStorage.setItem("token", data.token);
    
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
    
    var token = localStorage.getItem('token');
    
    var user_id = localStorage.getItem('user_id');
    
    var request = "gcusers/user/user_id/" + user_id + "/format/json";
    
    var formData = {token : token, action : "logout"};
    
    $.ajax({
        
        url: api + request,
        type: "POST",
        data: formData,
        dataType: "json"
        
    })
    
        .done(function(data, textStatus, xhr) {
            
            localStorage.clear();
    
            location.reload();
                    
        })
        
        .fail(function(jqXHR, textStatus, xhr ) {
            
            alert(JSON.stringify(jqXHR));
            
        });
    
}

function displayData(data)
{
    
    if(data === "gradeselector.html")
    {
        
                     $.ajax({
                         type: "get",
                         url: api + "gcgs/industries/format/json",
                         format: 'json'
                     })
                     
                        .done(function(jqXHR, responseText, xhr){
                           
                                    $.each(jqXHR, function(i, val) {
                                        
                                        $("ul#industries").append("<li class='list-group-item'><a href='#' class='red ui-element toggle-canvas' data-action='get' data-request='industry'><i class='fa fa-chevron-right'></i> " + val.industry_name + "</a></li>");
                                        
                                    });
                                    
                                    var i = 1;
                                    
                                    $('ul#industries > li').each(function () {
                                        
                                            $(this).find('a').data('formData', i++);
                                            
                                    });
                                   
               
                        })
                        
                        .fail(function(jqXHR, responseText, xhr){
                           
                                    alert(xhr);
                            
                        });
    }
    
    else
    {
        
   
   $.each(data, function(i, val) {
       
       if(i == "selections")
       {
           
            val.forEach(function(selection) {
                
                $("div.selection-" + selection).removeClass("hide").addClass("show");
                
                $("select.selection-" + selection).attr("name", selection);
                
            });
         
       }
       
      if(i == "gradesheets")
      {
              
              $("table.gradesheet").append("<tr><th>Gradesheet</th><th><span class='pull-right'>Select</span><span class='clearfix'></span></th></tr>");
              
               $.each(val, function(grade, gs) {
                   
                   $("table.gradesheet").append("<tr><td><strong>" + gs + "</strong></td><td><a class='red toggle-select' href='#'><i class='pull-right fa fa-2x fa-toggle-off' data-formData='" + gs + "'></i></a><span class='clearfix'></td></tr>");
               
               });
               
               $("table.gradesheet").append("<tr><td class='text-center' colspan='2'><button class='ui-element btn btn-danger btn-expand' data-action='modify' data-form='gcgs'>Download Gradesheets</button>")
         
      } 
       
     
       if(i == "user_id")
       {
           $.ajax({
        
                url: api + "/gcnotifications/notifications/",
                type: "GET",
                data: { "user_id" : val, "format": "json" },
                dataType: "json"
        
            })
            
                .done(function(jqXHR, textResponse, xhr ) {
                    
                    $("#account-notifications").find("ul").html("");
            
                    $("#account-notifications").removeClass("hide").addClass("show");
                    
                    $.each(jqXHR.notifications, function(key, value) {
                        
                        $("#account-notifications").find("ul").append("<li class='list-group-item list-group-item-info'><small><strong>" + value.title + "</strong></small><span class='badge'><a href='#' class='dismiss' data-type='notification' data-resource_id='" + value.resource_id + "'><i class='fa fa-times'></i></a></span></li>");
                      
                        $('.level-up').tooltip('destroy');
                        
                        $(".level-up").data("tooltip-placement", "top");
                        
                        $(".level-up").attr("title", value.next);
                       
                    });
                    
                })
                
                
                .fail(function(jqXHR, textResponse, xhr) {
                    
                       var data = JSON.parse(jqXHR.responseText);
               
                       $("body").find(".level-up").removeAttr("title");
                       
                       $("body").find(".level-up").attr("title", data.next[0].next);
                       
                       
                });
           
       }
       
       if($("." + i).parent("span").hasClass("badge"))
       {
           
            if(!val)
            {

                val = "&mdash;";

            }
           
            $("." + i).parent("span").addClass("badge-"+data.usage_level);
            
            $("." + i).html(val);
           
       }
       
       if($("." + i).hasClass("form-control"))
       {
           
           if(val !== "&mdash;")
           {
           
                $("." + i).val(val);
            
           }
            
       }
       
       
       else
       {
           
            $("." + i).html(val);
           
       }
    
    });
    }
}

// end controller functions

// Private functions

function append(formData, token)
{
    
    return formData = formData + "&token=" + token;
    
}

//device functions