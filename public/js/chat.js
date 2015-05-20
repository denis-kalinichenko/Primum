$(function() {
    //var socket = io();
    $("#usernameNewContact").keypress(function() {
        if($(this).val()!="") {
            $("#searchContact").prop("disabled", false);
        } else {
            $("#searchContact").prop("disabled", true);
        }
    });

    $("#searchContact").click(function () {
        $("#new_contact .modal-body .alert").remove();
        $("#NC_res_box").addClass("hidden");
        $.getJSON("/chat/search", { username: $("#usernameNewContact").val() }, function (data) {
            if(data.error) {
                $('<div class="alert alert-danger">'+data.error_msg+'</div>').insertBefore("#new_contact .modal-body .form-group");
            } else {
                $("#NC_res_box").removeClass("hidden").find("#NC_res_name").text(data.name.first +" "+ data.name.last);
                $("#NC_res_username").text("@"+data.username);

                $("#NC_res_button_add").unbind().click(function(){
                    sendRequestToUser(data.user_id);
                });
            }
        });
    });

    $("textarea#msg").keypress(function(event) {
        if (event.keyCode  == 13) {
            event.preventDefault();
            $("form.formMsg").submit();
        }
    });
    $("form.formMsg").submit(function(event) {
        event.preventDefault();
        sendMsg();
    });

});

function sendMsg() {
    var $input = $("textarea#msg");
    var text = $input.val();
    text = text.trim();
    if(text !="") {
        $input.val("");
        console.log(text);
    } else {
        $input.focus();
    }
}

function sendRequestToUser(id) {
    var request = $.ajax({
        url: "/user/add",
        method: "POST",
        data: { id: id }
        //dataType: "json"
    });

    request.done(function( msg ) {
        alert(msg);
    });

    request.fail(function( jqXHR, textStatus ) {
        console.error( "Request failed: " + textStatus );
    });
}