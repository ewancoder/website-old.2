function loadNode(num){
    //num - name of a file (e.g. 1 for 1.md) [downloaded from 1 to 15, should be backwards]
    //Get page from Dropbox
    query = $.ajax({
        url: 'https://dl.dropboxusercontent.com/u/70091792/Pages/' + num + '.md',
        type: 'get',
        dataType: 'html',
        async: true
    });
    query.fail(function(){
        if (count == 0){
            count = num - 1;
        } else {
            if (num - 1 < count){
                count = num - 1;
            }
        }
    });
    query.done(function(data){
        //Convert markdown to HTML
        str = converter.makeHtml(data);
        //Get part after "Read more"
        full = str.split("<h4>#</h4>")[1];
        if (full == undefined){
            //If there's NO "Read more" button, load ALL, else - load only before <h4>
            preface = str;
        } else {
            preface = str.split("<h4>")[0];
        }

        //Asynchronous: find out which ID already exists above current
        nodeExist = 0;
        for (i = 1; i < num; i++){
            if ($("#node" + i).length != 0){
                nodeExist = i;
            }
        }

        //Add node
        if (nodeExist != 0){
            $("<section id='node" + num + "' hidden><hr/>" + preface + "</section>").insertBefore("#node" + nodeExist);
        } else {
            $("main").append("<section id='node" + num + "' hidden><hr/>" + preface + "</section>");
        }

        //Wrap title in fancy link
        $("#node" + num + " h1").wrap("<a onclick='loadOne(" + num + ")' href='javascript:void(0);'>");
        if (full != undefined){
            //If there IS "Read more" button, make button + add #full content
            $("#node" + num).append("<a class='readMoreButton' onclick='loadOne(" + num + ")' href='javascript:void(0);'>Read more</a>");
            $("#node" + num).append("<section class='full' hidden>" + full + "</section>");
        }

        //Get date and caption for archive construction
        date = $("#node" + num + " h1 sup").text().replace('[', '').replace(']', '');
        caption = $("#node" + num + " h1").text().split(" [")[0];
        //Construct #archive above all the nodes
        if (nodeExist != 0){
            $("<a id='arch" + num + "' class='hint--bottom' data-hint='" + caption + "' onclick='loadOne(" + num + ")' href='javascript:void(0);'>" + date + "</a>").insertAfter("#arch" + nodeExist);
        } else {
            $("#archive").append("<a id='arch" + num + "' class='hint--bottom' data-hint='" + caption + "' onclick='loadOne(" + num + ")' href='javascript:void(0);'>" + date + "</a>");
        }

        //Increment total counter which informs when all data is loaded
        //When loaded == count -> last part executed (with slideDown)
        if ((count > 0 && loaded < count) || (count == 0)) {
            loaded += 1;
        }
        if (count > 0 && loaded >= count){
            //Hide .loader (status)
            $(".loader").fadeOut('slow');

            if (path != '' && path.charAt(1) != 'p'){
                //LoadOne from (url/1)
                loadOne(path.split('?')[1]);
            } else {
                //Show nodes and archive
                if (path != '') {
                    showed = path.split('p')[1];
                }
                for (i = count; i >= count - showed + 1; i--){
                    $("#node" + i).slideDown('slow');
                }
                $("#archive").slideDown('slow', function(){
                    if (path != ''){
                        //Scroll to selected (url/p1) anchor
                        $("html, body").animate({scrollTop: $("#node" + path.split('p')[1]).offset().top}, 'medium');
                    }
                });
                //Allow scrolling
                backup = 0;
            }
        }
    });
}

function loadOne(num){
    //Change URL so user can copy it
    window.history.replaceState("Node" + num, "Node " + num, "/?" + num);
    backup = num; //current location (for prev/next & goBack), goBack() sets it to 0
    //Hide header, all non-related sections, readMoreButton
    $("header").slideUp('slow');
    //Momentarily hide all sections except current and +-1
    $("section:not(#node" + num + "):not(#node" + num + " .full):not(#node" + (num-1) + "):not(#node" + (num+1) + ")").hide();
    //Smoothly hide +-1 sections
    $("#node" + (num-1)).slideUp('slow');
    $("#node" + (num+1)).slideUp('slow');
    $(".readMoreButton").fadeOut('slow');
    //Change #download button link to current node
    $("#download").attr("href", "https://dl.dropboxusercontent.com/u/70091792/Pages/" + (count - num + 1) + ".md");
    //Show related #node, #full, as well as #download and #back buttons
    $("#node" + num).slideDown('slow');
    $("#node" + num + " .full" + num).slideDown('slow');
    $("#back").fadeIn('slow');
    $("#download").fadeIn('slow');

    //Show/hide #next button
    if (backup > 1) {
        $("#next").fadeIn('slow');
    } else {
        $("#next").fadeOut('slow');
    }
    //Show/hide #previous button
    if (backup < count) {
        $("#previous").fadeIn('slow');
    } else {
        $("#previous").fadeOut("slow");
    }

    //Scroll to the top of page (current node)
    $("html, body").animate({scrollTop: 0}, 'medium');
}

function goBack(){
    //Store backup variable in local variable in case it gets emptied before use
    lbackup = backup
    //Change URL back to item place
    window.history.replaceState("Place" + lbackup, "Place " + lbackup, "/?p" + lbackup);
    //Show header, .readMoreButtons, #archive
    $(".readMoreButton").fadeIn('slow');
    $("header").slideDown('slow', function(){
        //Scroll to the top of node[backup] only after [header/.readMoreButton] were shown
        $("html, body").animate({scrollTop: $("#node" + lbackup).offset().top}, 'medium');
        //Zero backup variable (to allow scrolling)
        backup = 0;
    });
    $("#archive").slideDown('slow');
    //Show all the nodes that were showed before
    for (i = count; i <= count - showed + 1; i--){
        //Show only #node part
        $("#node" + i).slideDown('slow');
    }
    //Hide #full part, all the buttons [back,download,previous,next]
    $("#node" + lbackup + " .full").slideUp('slow');
    $("#back").fadeOut('slow');
    $("#download").fadeOut('slow');
    $("#previous").fadeOut('slow');
    $("#next").fadeOut('slow');
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
var backup = -1; //If 0, scrolling won't trigger anything [single is loaded]
//Set to "-1" to prevent scrolling while page not loaded
var loaded = 0; //All items that has been downloaded from Dropbox [counter for async]
var showed = 3; //Initial number of showed nodes
var count = 0; //while it's 0, nodes keep downloading

path = location.search;

$(window).load(function(){
    //Load count of nodes generated outside by server-side or manually
    $.ajax({
        url: 'https://dl.dropboxusercontent.com/u/70091792/Pages/count',
        type: 'get',
        dataType: 'html',
        async: true
    }).done(function(data){
        //count = data;
        //Load ALL nodes at once
        //for (i = count; i > 0; i--){
        for (i = 1; i < 20; i++){
            if (count > 0) {
                break
            } else {
                //Load only while count > 0 (which sets by .fail() method)
                loadNode(i); //i - name of node (1.md), should be placed backwards downloading order
            }
        }
    });
});

$(window).scroll(function() {
    //If scrolled all the way down
    if ($(window).scrollTop() >= $(document).height() - $(window).height() && backup == 0) {
        //If not all showed yet - show one more
        //Condition [if not all] was removed due to strange issue and grateful to no errors with such sentence
        $("#node" + (count - showed)).slideDown('slow');
        showed++;
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
