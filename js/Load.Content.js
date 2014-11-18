function getText(myUrl){
    var result = null;
    $.ajax( { url: myUrl,
              type: 'get',
              dataType: 'html',
              async: false,
              success: function(data) { result = data;  }
            }
    );
    FileReady = true;
    return result;
}

function checkFile(num){ //for less ajax-queries, more speedy-output
    var http = new XMLHttpRequest();
    http.open('HEAD', 'https://dl.dropboxusercontent.com/u/70091792/Pages/' + num + '.md', false);
    http.send();
    return http.status!=404;
}

function loadMore(num){
    if (num <= 1) {
        $("#loading").html("There is nothing more to load.");
    }
    str = converter.makeHtml(getText('https://dl.dropboxusercontent.com/u/70091792/Pages/' + num + '.md'));
    full = str.split("<h4>#</h4>")[1];
    if (full == undefined){
        preface = str;
    } else {
        preface = str.split("<h4>")[0];
    }
    $("<section id='node" + (count - num + 1) + "' hidden><hr/>" + preface + "</section>").insertAfter("#node" + (count - num));
    $("#node" + (count - num + 1) + " h1").wrap("<a onclick='loadOne(" + (count - num + 1) + ")' href='javascript:void(0);'>");
    if (full != undefined){
        $("#node" + (count - num + 1)).append("<a class='readMoreButton' onclick='loadOne(" + (count - num + 1) + ")' href='javascript:void(0);'>Read more</a>");
        $("<section id='full" + (count - num + 1) + "' hidden>" + full + "</section>").insertAfter("#node" + (count - num + 1));
    }
}

function loadOne(num){
    backup = num; //backup variable to return to
    single = true
    $("header").slideUp('slow');
    $("section:not(#node" + num + "):not(#full" + num + ")").slideUp('slow');
    $("#node" + num).slideDown('slow');
    $("#full" + num).slideDown('slow');
    $("#back").fadeIn('slow');
    $("html, body").animate({scrollTop: 0}, 'medium');
}

function goBack(){
    $("header").slideDown('slow', function(){
        $("html, body").animate({scrollTop: $("#node" + backup).offset().top}, 'medium');
    });
    last = count - current;
    for (i = 1; i <= last; i++){
        $("#node" + i).slideDown('slow');
    }
    $("#loading").slideDown('slow');
    if (current > 0){
        $("#loading").html('Loading more...');
    }
    $("#back").fadeOut('slow');
    single = false;
}

var converter = new Markdown.Converter();
var count = 1;
var single = false; //If true, loads only ONE content
var INITIAL = 3; //Initial count of nodes

$(window).load(function(){
    while (checkFile(count) == true){
        count++;
    }
    count--;
    current = count;
    for (i = 1; i < INITIAL+1; i++){
        if (current == 0) {
            break
        }
        loadMore(current);
        current--;
    }

    for (i = 1; i < INITIAL+1; i++){
        $("#node" + i).slideDown('slow');
    }
});

$(window).scroll(function() {
    if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
        if (single == false){
            if (current > 0){
                loadMore(current);
                current--;
            } else {
                $("#loading").html("There is nothing more to load.");
            }
        }
    }
});
