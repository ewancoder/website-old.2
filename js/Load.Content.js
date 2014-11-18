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
    html = converter.makeHtml(getText('https://dl.dropboxusercontent.com/u/70091792/Pages/' + num + '.md'));
    $("<section id='node" + (count - num + 1) + "' hidden>" + html + "<hr /></section>").insertAfter("#node" + (count - num)).slideDown('slow');
    $("#node" + (count - num + 1) + " h1").wrap("<a onclick='loadOne(" + (count - num + 1) + ")' href='javascript:void(0);'>");
}

function loadOne(num){
    $("section:not(#node" + num + ")").slideUp('slow');
    $("#back").fadeIn('slow');
    single = true
}

function goBack(){
    $("section:not(#node1):not(#loading)").slideUp('slow');
    $("#node1").slideDown('slow');
    $("#loading").slideDown('slow');
    $("html, body").animate({scrollTop: $("main").offset().top}, 'medium');
    current = count - 1;
    if (current > 0){
        $("#loading").html('Loading more...');
    }
    single = false;
}

var converter = new Markdown.Converter();
var count = 1;
var single = false; //If true, loads only ONE content

$(window).load(function(){
    while (checkFile(count) == true){
        count++;
    }
    count--;
    current = count;
    loadMore(current);
    current--;

    $(window).scroll(function() {
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
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
});
