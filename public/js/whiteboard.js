$(document).ready(function () {
    //toggle sidebar

    //hide admin folder on load
        $("#admin").hide();
        $("#submitUpdate").hide();

    $('.side-panel-toggle').on('click', function () {
        $('.content').toggleClass('content-is-open');
    });
    
    $('#buttonClose').on('click', function () {
        // $(".sidebar").toggle();
        $('.content').toggleClass('content-is-open');
    });


    $('body').on('keypress', function (e) {
        if (e.keyCode == 109 && closed) {
            $('.content').toggleClass('content-is-open');
            }
        });
    
    //check whether an input field is in use and disable keypresses
        var closed = true;

        $("input").focus(function(){
            closed = false;
        });
        $("input").blur(function(){
            closed = true;
        });
        $("textarea").focus(function () {
            closed = false;
        });
        $("textarea").blur(function () {
            closed = true;
        });


    //   Toggles the form depending on button clicked.
    $("#buttonCreate").click(function () {
        $("#formCreate").toggle();
        $("#formEnter,#formSettings").hide();
    });

    $("#buttonEnter").click(function () {
        $("#formEnter").toggle();
        $("#formCreate,#formSettings").hide();
    });

    $("#buttonSettings").click(function () {
        $("#formSettings").toggle();
        $("#formCreate,#formEnter").hide();
    });

    //hide items with .hoverhide on mouseover
    $('.hoverhide').mouseover(function () {
        $('.hoverhide').fadeOut(750);
    });
    setTimeout(function () {
        $("#mainTitle").fadeTo("slow", 0);
        $('.hoverhide').fadeOut(750);
    }, 10000);


    function wordCheck(word) {
        var check = false;
        var wordSearch = ["", "Please search for a studio", "Studio not found",
         "Studio exists. Create new studio.", "Enter valid name.",
            "Please enter password", "Enter valid pssw","Wrong pssw", undefined];
        
        for (i = 0; i < wordSearch.length; i++) {
            if (word === wordSearch[i]) {
                check = true;
                break;
            };
        }
        return check;
    }

    
    var enterButton = $("#submitEnterStudio");
    
    // board search get request for dummy form
    enterButton.on("click", function (e) {
        e.preventDefault();
        var search;
        search = $("#studioName").val().trim();
        // console.log($("#studioName").val().trim());
        
        if (wordCheck(search)) {
            $('input[name="studioName"]').val("Please search for a studio");
        } else {

            search = search.replace(/\s+/g, '');
            // console.log("boardSearch: ", search);

            $.get("/api/" + search, function (data) {
                // log the data to our console
                // console.log(data);
                if(data){
                    // console.log(data.routeName);
                    window.location.href = "/" + data.routeName;
                    // console.log(data);
                }
                else{
                    $('input[name="studioName"]').val("Studio not found");
                }
                });
            }
    });

    var radios = $('input[name="first-switch"]');
    var isPublic;

    radios.on("click",function(){

        if(radios[0].checked){
            $("#newStudioName").val("");
        }
        else{
            $("#newStudioName").val(makeId());
        }
    });

    // post request for new form
    $("#submitNewStudio").on("click", function (e) {
        e.preventDefault();
        // console.log("test");

        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                isPublic = radios[i].value;
                // console.log(radios[i].value);
                break;
            }
        }

        var routeName = $("#newStudioName").val().trim();

        if(wordCheck(routeName)){
            $("#newStudioName").val("Enter valid name.");
        }
        else{

            if (wordCheck($("#newStudioPssw").val().trim())){
                $("#newStudioPssw").val("Please enter password");
            } else {

            routeName = routeName.replace(/\s+/g, '');

            $.get("/api/" + routeName, function (data) {
                // log the data to our console
                if (data) {
                    // console.log(data[0].routeName);
                    $("#newStudioName").val("Studio exists. Create new studio.");
                    // window.location.href = "/" + data.routeName;
                    // console.log(data);
                }
                else {
            
                var newBoard = {
                    name: $("#newStudioName").val().trim(),
                    routeName: routeName,
                    isPublic: isPublic,
                    description: $("#newStudioDesc").val().trim(),
                    pssw: $("#newStudioPssw").val().trim(),
                };

                $.post("/api/posts", newBoard, function(data){
                    // log the data we found
                    // console.log(data);
                    // console.log("new whiteboard");
                    window.location.href = "/" + data.routeName;
                });
                
                // console.log(newBoard);

                // empty each input box by replacing the value with an empty string
                $("#newStudioName").val("");
                $("#newStudioDesc").val("");
                $("#newStudioPssw").val("");

                }
            });
        }
    }
    });

    // current url and room transfer
    var currentUrl = $(location).attr('href');
    // console.log(currentUrl);
    var currentRoomName = currentUrl.replace("https://whiteboardstudio.herokuapp.com/", "");

    // // get room data on load
    // if (currentRoomName !== "") {
    
    //     $.get("/api/" + currentRoomName, function (data) {
    //         if (data) {
    //             // log the data to our console
    //             console.log(data);
    //             console.log(data.routeName);
    //             }
    //         });
    // };

    // global admin privelege
    var admin = false;

    // submit post button event
    $("#submitPssw").on("click", function (e) {
        e.preventDefault();
        var pssw = $("#adminPssw").val().trim();

        if(wordCheck(pssw)){
            $("#adminPssw").val("Enter valid pssw");
        } else {

        $.get("/api/" + currentRoomName, function (data) {
            if (data) {
                // log the data to our console
                // console.log(data);
                // console.log(data.pssw);
                if(pssw === data.pssw){
                    admin = true;

                    // update values to data values for room
                    $("#updateStudioName").val(data.name),
                    $("#updateStudioDesc").val(data.description),
                    $("#updateStudioPssw").val(data.pssw),
                    $("#admin").show();
                    $("#updatePsswForm").hide();
                    $("#adminPssw").val("");
                    $("#submitPssw").hide();
                    $("#submitUpdate").show();
                }
                else {
                    $('input[name="studioPassword"]').val("Wrong pssw");
                }
            }
        });
        }
    });

    // submit new update button
    $("#submitUpdate").on("click", function (e) {
        e.preventDefault();
        if(admin){

            let psswRadios = $('input[name="second-switch"]');
            let updateIsPublic;

            for (var i = 0; i < psswRadios.length; i++) {
                if (psswRadios[i].checked) {
                    updateIsPublic = radios[i].value;
                    // console.log(radios[i].value);
                    break;
                }
            }

            var data = {
                name: $("#updateStudioName").val().trim(),
                routeName: currentRoomName,
                isPublic: updateIsPublic,
                description: $("#updateStudioDesc").val().trim(),
                pssw: $("#updateStudioPssw").val().trim(),
            }
            updatePost(data);
        }
    });

    // update function
    function updatePost(data) {
        $.ajax({
            method: "PUT",
            url: "/api/posts",
            data: data
        })
            .then(function () {
                // console.log(data);
                window.location.reload();
                // window.location.href = window.location.href;
            });
    }


    // random string generator
    function makeId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 20; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        // console.log(text);
        return text;
    };
    
});
