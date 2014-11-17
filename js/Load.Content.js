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

var markdown_source = getText('mytext')
var output = converter.makeHtml(markdown_source);
document.write(output);
