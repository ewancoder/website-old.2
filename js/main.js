function getText(myUrl){
    var result = null;
    $.ajax( { url: myUrl,
              type: 'get',
              dataType: 'html',
              async: false,
              success: function(data) { result = data; }
            }
    );
    return result;
}

function loadNode(num){
    //Get page from Dropbox and convert it to HTML
    str = converter.makeHtml(getText('https://dl.dropboxusercontent.com/u/70091792/Pages/' + num + '.md'));
    //Get part after "Read more"
    full = str.split("<h4>#</h4>")[1];
    if (full == undefined){
        //If there's NO "Read more" button, load ALL, else - load only before <h4>
        preface = str;
    } else {
        preface = str.split("<h4>")[0];
    }
    if (count - num == 0){
        //If this is the first #node1, we need to place it after #archive
        //So the archive MUST be enclosed in <main> tag
        $("<section id='node" + (count - num + 1) + "' hidden><hr/>" + preface + "</section>").insertAfter("#archive");
    } else {
        $("<section id='node" + (count - num + 1) + "' hidden><hr/>" + preface + "</section>").insertAfter("#node" + (count - num));
    }
    //Wrap title in fancy link
    $("#node" + (count - num + 1) + " h1").wrap("<a onclick='loadOne(" + (count - num + 1) + ")' href='javascript:void(0);'>");
    if (full != undefined){
        //If there IS "Read more" button, make button + add #full content
        $("#node" + (count - num + 1)).append("<a class='readMoreButton' onclick='loadOne(" + (count - num + 1) + ")' href='javascript:void(0);'>Read more</a>");
        $("<section id='full" + (count - num + 1) + "' hidden>" + full + "</section>").insertAfter("#node" + (count - num + 1));
    }

    //Get date and caption for archive construction
    date = $("#node" + (count - num + 1) + " h1 sup").text().replace('[', '').replace(']', '');
    caption = $("#node" + (count - num + 1) + " h1").text().split(" [")[0];
    //Construct #archive above all the nodes
    $("#archive").append("<a class='hint--bottom' data-hint='" + caption + "' onclick='loadOne(" + (count - num + 1) + ")' href='javascript:void(0);'>" + date + "</a>");
}

function loadOne(num){
    /*
    backup = num; //backup variable to return to
    single = true
    $("header").slideUp('slow');
    $("section:not(#node" + num + "):not(#full" + num + ")").slideUp('slow');
    $(".readMoreButton").fadeOut('slow');
    $("#node" + num).slideDown('slow');
    $("#full" + num).slideDown('slow');
    $("#download").attr("href", "https://dl.dropboxusercontent.com/u/70091792/Pages/" + (count - num + 1) + ".md");
    $("#back").fadeIn('slow');
    $("#download").fadeIn('slow');

    if (backup > 1) {
        $("#next").fadeIn('slow');
    } else {
        $("#next").fadeOut('slow');
    }
    if (backup < count) {
        $("#previous").fadeIn('slow');
    } else {
        $("#previous").fadeOut("slow");
    }
    $("html, body").animate({scrollTop: 0}, 'medium');

    //Load NEXT if not loaded
    if (current == (count - num) && current > 0){
        loadNode(current);
        current--;
    } else {
        $("#loading").html("There is nothing more to load.");
    }
    */
}

function goBack(){
    /*
    $(".readMoreButton").fadeIn('slow');
    $("#archive").slideDown('slow');
    $("header").slideDown('slow', function(){
        $("html, body").animate({scrollTop: $("#node" + backup).offset().top}, 'medium');
    });
    last = count - current;
    for (i = 1; i <= last; i++){
        $("#node" + i).slideDown('slow');
        $("#full" + i).slideUp('slow');
    }
    $("#loading").slideDown('slow');
    if (current > 0){
        $("#loading").html('Loading more...');
    }
    $("#back").fadeOut('slow');
    $("#download").fadeOut('slow');
    $("#previous").fadeOut('slow');
    $("#next").fadeOut('slow');
    single = false;
    */
}

//Functions for browsing content in One-mode, without going to Home
function goNext(){
    //backup variable stores current One-mode index and changed upon loadOne() execution
    if (backup > 1){
        //node[1] is the lastest (newest) node
        loadOne(backup - 1);
    }
}
function goPrevious(){
    if (backup < count){
        //node[count] is the oldest node (e.g. node15)
        loadOne(backup + 1);
    }
}

var converter = new Markdown.Converter();
var single = false; //If true, scrolling won't trigger anything [single is loaded]
var showed = 3; //Initial number of showed nodes
//Load count of nodes generated outside by server-side or manually
count = getText('https://dl.dropboxusercontent.com/u/70091792/Pages/count');

$(window).load(function(){
    //Load ALL nodes at once
    for (i = count; i > 0; i--){
        loadNode(i); //i - name of file (15.md)
    }
    //Show nodes and archive
    for (i = 1; i <= showed; i++){
        $("#node" + i).slideDown('slow');
    }
    $("#archive").slideDown('slow');
});

$(window).scroll(function() {
    //Place hint accordingly to its position [need better place to do it, than scroll]
    if ($(".hint--top").offset().left != 0){
        if ($(".hint--top").offset().left > $(window).width() / 2){
            $("span").toggleClass("hint--top");
            $("span").toggleClass("hint--topLeft");
        } else {
            $("span").toggleClass("hint--topLeft");
            $("span").toggleClass("hint--top");
        }
    }
    //If scrolled all the way down
    if ($(window).scrollTop() >= $(document).height() - $(window).height() && single == false) {
        if (showed < count){
            //If not all showed yet - show one more
            $("#node" + (showed + 1)).slideDown('slow');
            showed++;
        } else {
            //Change loading caption
            $("#loading").html("There is nothing more to load.");
        }
    }
});

//Descripotion of previous/next nodes captions - showed on hover
$("#next").hover(function(){
    //html() - changes totally inner value of tag with id #description (or reads)
    $("#description").html($("#node" + (backup - 1) + " h1").html());
    $("#description").fadeIn('fast');
}, function(){
    $("#description").fadeOut('fast');
});
$("#previous").hover(function(){
    $("#description").html($("#node" + (backup + 1) + " h1").html());
    $("#description").fadeIn('fast');
}, function(){
    $("#description").fadeOut('fast');
});
