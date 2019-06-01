$(document).ready(function() {
    console.log("jquery ready");
    $(".modal").modal();
});

let postId;

// NOTES MODAL CLICK
$(document).on("click", ".modal-trigger", function() {
    $("#note-card").empty();
    // clear all input fields
    $("#title_text").val("");
    $("#body_text").val("");
    postId = $(this).attr("data-id");
    console.log(postId);

    // get the job info from api
    $.ajax({
        method: "GET",
        url: "/jobs/" + postId
    }).then(function(data) {
        $("#jobTitle").text(data.title);
        $("#jobCompany").text(data.company);
        // if there is a note left on job display that card section
        if (data.note) {
            console.log("Note exists", data.note);
            const newCard = $(
                "<div class='card-panel yellow accent-1 dark-text'></div>"
            );
            newCard.append(
                `<h5>${data.note.title}</h5>`,
                `<h5>${data.note.body}</h5>`
            );
            $("#note-card").append(newCard);
        }
    });
});

// SAVE NOTE BUTTON CLICK
$(document).on("click", "#add-note", function() {
    // prevent from submitting form
    event.preventDefault();

    $.ajax({
        method: "POST",
        url: "/jobs/" + postId,
        data: {
            title: $("#title_text").val(),
            body: $("#body_text").val()
        }
    }).then(function(data) {
        console.log(data);
    });
});

$(window).load(function(){
$('.preloader-wrapper').toggleClass('hide');
});
