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

$("#node").append(converter.makeHtml(getText('pages/1.md')))
