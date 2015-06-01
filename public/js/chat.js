var socket = io();
$(function() {

    $(".request_item").each(function(e) {
        var id = $(this).data("uid");
        var $item = $(this);
        $.getJSON("/user/id/"+id, function(user) {
            $item.find(".sender_name").text(user.name.first + " " +user.name.last);
        });
    });

    $("#friendsRequestsShow").popover({
        html: true,
        content: function() {
            return $("#friendsRequests").html();
        }
    });

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

    $("textarea.textMsg").keypress(function(event) {
        if (event.keyCode  == 13) {
            event.preventDefault();
            $(this).parents("form").submit();
        }
    });
    $("form.formMsg").submit(function(event) {
        event.preventDefault();
        var $input =  $(this).find("textarea");
        var text = $input.val();
        if(sendMsg(text, $input.data("fid"))) {
            $input.val("");
            $(this).parents(".tab-pane").find(".msgsBox .panel-body").append('<div class="alert alert-success"><strong>'+user_name_first+'</strong><p>'+text+'</p></div>');
        } else {
            $input.focus();
        }
    });

});

function confirm_request(id) {
    $.getJSON('/user/confirm', { id: id }, function(data) {
        if(data.status) {
            alert(data.text);
            $(".request_item[data-id='"+id+"']").remove();
        }
    });
}

function decline_request(id) {
    $.getJSON('/user/decline', { id: id }, function(data) {
        if(data.status) {
            alert(data.text);
            $(".request_item[data-id='"+id+"']").remove();
        }
    });
}

function sendMsg(text, fid) {
    text = text.trim();
    if(text == "") { return false; }

    socket.emit('chat message', { text: text, friendship_id: fid });
    return true;
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