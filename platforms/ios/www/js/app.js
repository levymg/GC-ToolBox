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
    
    $("body").on("click", ".filter-toggle", function(){
        
        if($(".filter").hasClass("hide")){
            
                $(".filter").removeClass("hide").addClass("show");
            
                $(".filter-icon").removeClass("fa-plus-circle").addClass("fa-minus-circle");
                
                sessionStorage.setItem("filters", true);
            
            
        }
        else
        {
            
                $(".filter").removeClass("show").addClass("hide");

                $(".filter-icon").removeClass("fa-minus-circle").addClass("fa-plus-circle");
                
                sessionStorage.removeItem("filters");
            
        }
        
        return false;
        
    });
    
});

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
                        // load dat home screen yo
                        $("#splash-main").load("view/"+directory+"/splash-main.html", user_id);
                          
                    }
                    
                    else
                    {
                          
                          
                          $("#splash-main").load("view/"+directory+"/splash-main.html", function(){
                             // grab the user id if the user is logged in
                             // if they don't authenticate, they'll get logged out
                              var data = {action:"get", request:"user", formData:user_id};
                              
                              // our not so dry proessAction() function accepts and parses 
                              // the data variables associated with the click handler's data element
                              
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
               
                // Ugly hack to load up the gcgs
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
    // UI elements should have data attributes
    // to define what action that processData will take into account
    // Pass a data-form to serialize form data
    // Pass data-action to call a specific function from the API
    $("body").on("click", ".ui-element", function(){
        
        var data = $(this).data();
        
        processAction(data);

        return false;
        
    });
    
});

$(function () {
    
    $("body").on('click', '[data-toggle="tooltip"]', function(){
        //easy tooltip toggle
        $(this).tooltip('toggle');

        return false;

    });
  
});

$(function() {
   
    $('#notification').on('hidden.bs.modal', function () {
        // session data is primarily for the user
        // profile diting, but ended up using it on the
        // grade selector submission form as well
        // ...
        // this function is for calling back the user profile
        // after they have edited it
        $("#notification").html("");
        
         var request = sessionStorage.getItem("request");
       
            if(request)
            {

                var action = sessionStorage.getItem("action");

                var formData = sessionStorage.getItem("formData");

                var callback = sessionStorage.getItem("callback");

                var frontend = sessionStorage.getItem("frontend");

                var callbackData = {action:"get", request: "user", formData: formData};

                sessionStorage.clear();

                processAction(callbackData);

            }
        
        sessionStorage.clear();
                
    });
    
});

$(function(){
   
    
    $('#notification').on('show.bs.modal',function (data) {
          //build our modal based on the request
          //submitted
          //either a user profile, a password change form, or the GCGS submission form
          //handlers for each instance exist within this function
          //TODO:  question form
            var data = null;
            
            $(this).find("form").each(function() {
                
               var data = this.name;
               
               if(data)
               {
                   
                   switch(data)
                   {
                       // lets fill out the user's information first
                       // append these each to form fields
                        case "edit-profile" :
                            
                            var action = "get";
                            
                            var request = "user";
                            // formdata is simply the user's id in this instance
                            var formData = localStorage.getItem("user_id");
                            // build our request
                            var data = {action : action, request : request, formData : formData };
                            // fire processAction off
                            processAction(data);
                            
                            break;
                            
                        case "wire" :
                            
                            if(sessionStorage.key("resource_id") !== null)
                            {

                                    var resource_id = sessionStorage.getItem("resource_id");
                                    
                                    if($("form#wire .resource_id").length > 0) {
                                        
                                        $("form#wire").remove(".resource_id");
                                        
                                    }
                                    
                                    $("form#wire").append("<input type='hidden' class='resource_id' val='" + resource_id + "' />");
                                    // remove this real quick as to not append it to the table
                                    // since it has a numerical value like the other nan's
                                    // grab a get request for the industry name
                                    $.ajax({
                                            url: api + "gcgs/industry/",
                                            data: {resource_id : resource_id},
                                            dataType: 'json',
                                            type: 'GET'
                                    })

                                    .done(function(jqXHR, responseText, xhr){
                                          // prepend this to the top
                                          $("table.selections").prepend("<tr><td class='alt' data-key='ind' data-value='" + resource_id + "'><strong>" + jqXHR.industry_name + "</strong></td></tr>");

                                    })
                                    .fail(function(jqXHR, responseText, xhr){
                                         // print an error
                                         $("table.selections").append("<tr><td class='red'>Something went wrong determining your industry.</td></tr>");

                                    });

                            }
                                    
                            break;
                        // lets grab the gradesheets our user has selected
                        // and display them in a table
                         case "gcgs-form" :
                             
                             if(sessionStorage.length > 0)
                             {
                                 // ugly session handling for gradesheet selection
                                 // we pass a session variable telling us that the user
                                 // is using the gs filters
                                 // if they're using them, we append the data
                                 // to the form and the form data for database entry
                                 // yuck, but whatever at this point i've been given
                                 // only 25 days to complete a mobile app with no wireframe, use case or even a mockup
                                 // so i think some exceptions can be made
                                if(sessionStorage.key("resource_id") !== null)
                                {
                                                    
                                        var resource_id = sessionStorage.getItem("resource_id");
                                        // remove this real quick as to not append it to the table
                                        // since it has a numerical value like the other nan's
                                        sessionStorage.removeItem("resource_id");
                                        // grab a get request for the industry name
                                        $.ajax({
                                                url: api + "gcgs/industry/",
                                                data: {resource_id : resource_id},
                                                dataType: 'json',
                                                type: 'GET'
                                        })

                                        .done(function(jqXHR, responseText, xhr){
                                              // prepend this to the top
                                              if($(".resource_id").length)
                                              {
                                                  
                                                  $(".resource_id").val(jqXHR.resource_id);
                                                  
                                              }
                                              $("table.selections").prepend("<tr><td class='alt' data-key='ind' data-value='" + resource_id + "'><strong>" + jqXHR.industry_name + "</strong></td></tr>");

                                        })
                                        .fail(function(jqXHR, responseText, xhr){
                                             // print an error
                                             $("table.selections").append("<tr><td class='red'>Something went wrong determining your industry.</td></tr>");

                                        });
                                                    
                                }
                                // iterate the remaining session storage to display the gradesheets, selections and industry id

                                    for (var i = 0; i < sessionStorage.length; i++)
                                    {
                                        // lets grab our text variables first
                                        // should be the ir,cir,gr,resource_id
                                        // vars
                                        if(isNaN(sessionStorage.key(i)))
                                        {
                                                
                                            switch(sessionStorage.key(i)){
                                                // get impact resisance and set the key
                                                case "ir"  :
                                                    
                                                    var key = "Impact Resistance";
                                                    
                                                    var rest = "ir";
                                                    
                                                    break;
                                                // get corrosion resistance and set the key   
                                                case "cr" :
                                                    
                                                    var key = "Corrosion Resistance";
                                                    
                                                    var rest = "cr";
                                                    
                                                    break;
                                                // get gall/adhesive resistance and sent the key
                                                case "gr" :
                                                    
                                                    var key = "Gall/Adheisve Resistance";
                                                    
                                                    var rest = "gr";
                                                    
                                                    break;
                                                    
                                            }
                                            
                                            switch(sessionStorage.getItem(sessionStorage.key(i))){
                                                
                                                case "1" :
                                                    // value for "not important" (1)
                                                    var value = "<span class='pull-right red'><i class='fa fa-star-half'></i></span><span class='pull-left'>Not Important</span><span class='clearfix'></span>";
                                                    
                                                    var int = 1;
                                                    
                                                    break;
                                                
                                                case "2" :
                                                    // value for "somewhat important" (2)
                                                    var value = "<span class='pull-right red'><i class='fa fa-star'></i><i class='fa fa-star-half'></i></span><span class='pull-left'>Somewhat Important</span><span class='clearfix'></span>";
                                                    
                                                    var int = 2;
                                                    break;
                                                
                                                case "3":
                                                    // value for "very important" (3)
                                                    var value = "<span class='pull-right red'><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i></span><span class='pull-left'>Very Important</span><span class='clearfix'></span>";
                                                    
                                                    var int = 3;
                                                   
                                                    break;
                                            
                                            }
                                            // let's append to our display tables
                                            // ANGUALRJS AND DATABINDING PLZ
                                            $("table.selections").append("<tr><th class='text-left'><i class='fa fa-list'></i> " + key + "</tr><tr><td class='text-left' data-value='" + int + "'>" + value + "</td></tr>");
                                            
                                        }
                                        else
                                        {
                                            // and the gradesheets
                                            $("table.gradesheets").append("<tr><td class='text-left'><span class='red dl-gradesheet' data-gs='"+ sessionStorage.getItem(sessionStorage.key(i)) +"'><i class='fa fa-check'></i> " + sessionStorage.getItem(sessionStorage.key(i)) + "</td></tr>")
                                        
                                        }
                                    
                                    }
                                                
                                }   
                             
                             // is the user set?
                             // if so, help them out by filling out their form
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
        // notification dismissal
        // this is kinda buggy but it works
        // on simulator and device
        var parent =  $(this).closest('div').attr('id');
        // first we need to remove the notification
        $(this).parents("li").remove();
        // hide the parent li of the notification
        hideParent(parent);
        // get the id of the notification
        var resource_id = $(this).data('resource_id');
        // expire the notification
        // marking the resource_id as read
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
   //basic hide parent dry function for ul's
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
            // grab the form name
            var form = data.form;
            // serialize the form name
            var formData = $("#" + form).serialize() + "&action=" + form;
            // pass the form name for an action
            // and the form data for our response
            postData(formData, data.form);
            
            break;
        
        case("get") :
            // get the request
            var request = data.request;
            // get the resource id, which we pass
            // as formData in a get call
            var id = data.formData;
            //fire the request
            getData(request, id);
            
            break;
            
        //
        //UI Actions
        //
            
         case("modify") :
              // modify a profile or modify a form
              // entry
              // in this case, we're hitting the
              // grade selection entry form with the gradeselections in a table
                if(data.form == "gcgs")
                {
                    sessionStorage.clear();
                    
                    if($(".filters").hasClass("show"))
                    {
                        
                        sessionStorage.setItem("ir", $(".ir").val());

                        sessionStorage.setItem("cr", $(".cr").val());
                        
                        if($('.selection-3').hasClass("show"))
                        {

                            sessionStorage.setItem("gr", $(".gr").val());

                        }
                    
                    } 
                    
                    sessionStorage.setItem("resource_id", $(".resource_name").data("resource-id"));
                    
                    // find what iradesheets the user has chosen
                    var ln = $("table.gradesheet").find("i.fa-toggle-on").length;

                    if(ln === 0)
                    {
                        // if none, throw this error message
                        alert("Please select a gradesheet to download.");

                        return false;

                    }

                    else
                    {
                        
                        // we're going to store each of the gradesheets
                        // in a session storage variable and pass these
                        // to the form modal
                        $(".fa-toggle-on").each(function(index) {
                            
                            // iterate through selections and set each as it's own independent
                            // entry
                           sessionStorage.setItem(index, $(this).data("formdata"));
                           
                        });
                            
                    }

                }
                // load up our modal
                $("#notification").load("view/static/"+ data.form +".html", function(){

                     $("#notification").modal("show");

                 });
            
            break;
            
        case("logout") :
            // hit the logout function
            // all data should be in localStorage
            logout();
            
            break;
            
    }
    
}

function postData(formData, form)
{
    // posting data?
    // to edit a profile we'll need the user id and token
    // to authenticate that it's actually the user
    // making this request from the app
    // this will reference a users hashed token, as well as their active session ID
    var user_id = localStorage.getItem("user_id");
    
    var token = localStorage.getItem("token");
    
    switch(form)
    {
        
        case "register-form" :
            // register form action requires
            // email and two passwords of equal value
            var request = "gcusers/user/format/json";
            
            createUser(request, formData);
            
            break;
            
        case "login-form" :
            // login form action requires
            // email and password values
            var request = "gcusers/user/format/json";
            
            authenticateUser(request, formData);
            
            break;
            
        case "edit-profile" :
            // edit profile requires first name
            // last name, company and phone
            // values
            var request = "gcusers/user/user_id/" + user_id + "/format/json";
            
            formData = append(formData, token);
            
            updateUser(request, formData);
            
            break;
            
        case "change-password" :
            // change password requres the old password
            // and two passwords of equal values
            var request = "gcusers/user/user_id/" + user_id + "/format/json";
            
            append(formData, token);
            // pass to the update function since it's the same
            // functionality just different POST vars
            updateUser(request, formData);
            
            break;
            
        case "forgot-form" :
            // forgot just requires a valid e-mail address
            var request = "gcusers/user/format/json";
            
            createUser(request, formData);
            
            break;
            
        case "gcgs-form" :
            // gcgs requires first, last names
            // company and a valid email address
            if(user_id !== null)
            {
                // is this a user submitted gradesheet?
                // if so, alter the request to include the user id
                var request = "gcgs/submission/user_id/"+user_id+"/format/json";
                // append data
                append(formData, token);
                
            }
            else
            {
                // otherwise, create a new submission entry
                // without a user id and we will register
                // this person's information
                var request = "gcgs/submission/format/json";
                
            }
            // Fire the function
            submitGcgs(request, formData);
            
            break;
            
        case "gcgs-filter" :
            // Our request for grade filtering
            var request = "gcgs/gradesheets/format/json";
            // Fire the function
            filterGrades(request, formData);

            break;
        
        case "wire" :
            
            var resource_id = $(".resource_id").val();
    
            var request = "gcgs/industry/resource_id/" + resource_id + "/format/json";
            
            wireEdm(request, formData);
            
            break;
                
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
            
            sessionStorage.setItem("resource_id", formData);
            
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

function filterGrades(request, formData)
{
    
    $("table.gradesheet").html("<tr><td><span class='red'><i class='fa fa-2x fa-spinner fa-spin'></i> Fetching gradesheets...</td></tr></span>");
    
    $.ajax({

            url: api + request,
            type: "POST",
            data: formData,
            dataType: "json"

        })
    
        .done(function(jqXHR, textStatus, xhr){
            
            $("table.gradesheet").html("");
    
            $("table.gradesheet").append("<tr><th>Gradesheet</th><th><span class='pull-right'>Select</span><span class='clearfix'></span></th></tr>");
              
               $.each(jqXHR, function(grade, gs) {
                   
                   $("table.gradesheet").append("<tr><td><strong>" + gs.gradesheet + "</strong></td><td><a class='red toggle-select' href='#'><i class='pull-right fa fa-2x fa-toggle-off' data-formData='" + gs.gradesheet + "'></i></a><span class='clearfix'></td></tr>");
               
               });
               
               $("table.gradesheet").append("<tr><td class='text-center' colspan='2'><button class='ui-element btn btn-primary btn-expand' data-action='modify' data-form='gcgs'>Download Gradesheets</button>");
                    
               $("#selection-options").html("");
               
               
        })

        .fail(function(jqXHR, textStatus, xhr){

                    alert(JSON.stringify(jqXHR));
            
        });
    
    
}

function submitGcgs(request, formData)
{
    
    var gradesheets = "&gradesheets=";
    
    var total = $('.dl-gradesheet').length;
    
    $(".dl-gradesheet").each(function(index) {
        
            if (index === total - 1) {

                gradesheets +=  $(this).data("gs");

            }
            else {

                gradesheets +=  $(this).data("gs") + ",";

            }

      });
      
      var selections = "&selections=";
      
      var total = $(".selections td").length;
      
      $(".selections td").each(function(index) {
          
           if (index === total - 1) {

                 selections += $(this).data("value");

            }
            else {

                 selections += $(this).data("value") + ",";

            }
          
      });

      formData = formData + gradesheets + selections;
      
        $.ajax({

            url: api + request,
            type: "POST",
            data: formData,
            dataType: "json"

        })
    
        .done(function(jqXHR, textStatus, xhr){

                    alert(JSON.stringify(jqXHR));

        })

        .fail(function(jqXHR, textStatus, xhr){

                 
                    
                    alert(JSON.stringify(jqXHR.responseText));
                    
                    //$(".error-messages").html(error);
        });
    
}

function wireEdm(request, formData)
{
    // lets grab the wire/edm data
    // from the database
    // this is only used if the gatekeeper
    // is set to 1 (true)
    alert(formData);
    
    $.ajax({
        
         url: api + request,
         type: "POST",
         data: formData,
         dataType: 'json'
    })
    
            .done(function(jqXHR, textResponse, xhr){
                // set a request for the industries page
                // display the new data available
                
                $("#notification").modal("hide");
                
                displayData(jqXHR);
        
            })
            
            .fail(function(jqXHR, textResponse, xhr){
              
                alert(JSON.stringify(jqXHR));
        
            });
    
}

function displayData(data)
{
    // o god this is a mess
    // ok so, this large bowl of ravioli
    // is a callback for every single get request
    // where the get requests returns specific data
    // we iterate through our data values
   
   // in this instance, data is not an array, therefore
   // we are using the get request
   // on an actual view
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
    // otherwise, we know that the data is being returned
    // as an array, and as such can route it to the proper
    // displays
    else
    {
        
   
   $.each(data, function(i, val) {
       // this is for the wire/EDM choice on the GCGS
       // if the gatekeeper is present at a value of 1
       // we'll load up a modal and have the user identify
       // whether or not wire/edm will be a factor in their
       // selection
       
       // first lets see if our data returned a flag
       // to disable the filters
       if(i == "resource_id")
        {
            // append a resource id to the data value
            $(".resource_name").data("resource-id", val);

        }
      
       if(i === "show_filter")
       {
           
          if(val === 0)
          {
              
              $(".filters").removeClass("show").addClass("hide");
              
          }
          else
          {
              
              $(".filters").removeClass("hide").addClass("show");
              
          }
               
       }
       
       if(i === "gatekeeper")
       {
           
           switch(val)
           {
               
               case "1":
                   
                    $("#notification").load("view/static/wire.html", function(){

                        $("#notification").modal("show");

                    });
                    
                   break;
           }
           
       }
       // get the selections a user has made
       if(i == "selections")
       {
           
            // will return to each selection in the key pair value
            val.forEach(function(selection) {
                // append to 1, 2 or 3
                $("div.selection-" + selection).removeClass("hide").addClass("show");

            });
         
       }
       
      if(i == "gradesheets")
      {
              //clear the table first for any hanging data
              // add our gradesheets to the table
              $("table.gradesheet").find("tr").remove();
              
              $("table.gradesheet").append("<tr><th>Gradesheet</th><th><span class='pull-right'>Select</span><span class='clearfix'></span></th></tr>");
              // build our table up
               $.each(val, function(grade, gs) {
                   
                   $("table.gradesheet").append("<tr><td><strong>" + gs + "</strong></td><td><a class='red toggle-select' href='#'><i class='pull-right fa fa-2x fa-toggle-off' data-formData='" + gs + "'></i></a><span class='clearfix'></td></tr>");
               
               });
               // append the submission button
               $("table.gradesheet").append("<tr><td class='text-center' colspan='2'><button class='ui-element btn btn-primary btn-expand' data-action='modify' data-form='gcgs'>Download Gradesheets</button>")
         
      }
      
        if(i == "user_id")
        {
            // lets grab the user data based on the user id
            // specified
            // factors for the profile page
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