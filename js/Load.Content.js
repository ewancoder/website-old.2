var converter = new Markdown.Converter();

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

var count = 1;
while (checkFile(count) == true){
    count++;
}
count--;

for (i = count; i > 0; i--){
    $("<section id='node" + (count - i + 1) + "'>" + converter.makeHtml(getText('https://dl.dropboxusercontent.com/u/70091792/Pages/' + i + '.md')) + "<hr /></section>").insertAfter("#node" + (count - i));
}
