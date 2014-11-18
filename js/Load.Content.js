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
    $("<section x=-100 hidden id='node" + (count - num + 1) + "'>" + html + "<hr /></section>").insertAfter("#node" + (count - num)).slideDown('slow');
}

var converter = new Markdown.Converter();
var count = 1;

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
            if (current > 0){
                loadMore(current);
                current--;
            } else {
                $("#loading").html("There is nothing more to load.");
            }
        }
    });
});
