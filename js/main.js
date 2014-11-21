function loadNode(num){
    //num - name of a file (e.g. 15 for 15.md)
    //Get page from Dropbox
    $.ajax({
        url: 'https://dl.dropboxusercontent.com/u/70091792/Pages/' + num + '.md',
        type: 'get',
        dataType: 'html',
        async: true
    }).done(function(data){
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
        for (i = 1; i <= (count - num); i++){
            if ($("#node" + i).length != 0){
                nodeExist = i;
            }
        }

        //Add node
        if (nodeExist != 0){
            $("<section id='node" + (count - num + 1) + "' hidden><hr/>" + preface + "</section>").insertAfter("#node" + nodeExist);
        } else {
            $("<section id='node" + (count - num + 1) + "' hidden><hr/>" + preface + "</section>").insertAfter("#archive");
        }

        //Wrap title in fancy link
        $("#node" + (count - num + 1) + " h1").wrap("<a onclick='loadOne(" + (count - num + 1) + ")' href='javascript:void(0);'>");
        if (full != undefined){
            //If there IS "Read more" button, make button + add #full content
            $("#node" + (count - num + 1)).append("<a class='readMoreButton' onclick='loadOne(" + (count - num + 1) + ")' href='javascript:void(0);'>Read more</a>");
            $("#node" + (count - num + 1)).append("<section id='full' hidden>" + full + "</section>");
        }

        //Get date and caption for archive construction
        date = $("#node" + (count - num + 1) + " h1 sup").text().replace('[', '').replace(']', '');
        caption = $("#node" + (count - num + 1) + " h1").text().split(" [")[0];
        //Construct #archive above all the nodes
        if (nodeExist != 0){
            $("<a id='arch" + (count - num + 1) + "' class='hint--bottom' data-hint='" + caption + "' onclick='loadOne(" + (count - num + 1) + ")' href='javascript:void(0);'>" + date + "</a>").insertAfter("#arch" + nodeExist);
        } else {
            $("<a id='arch" + (count - num + 1) + "' class='hint--bottom' data-hint='" + caption + "' onclick='loadOne(" + (count - num + 1) + ")' href='javascript:void(0);'>" + date + "</a>").insertAfter("#arch0");
        }

        //Increment total counter which informs when all data is loaded
        if (loaded < count){
            loaded += 1;
        }
        if (loaded == count){
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
                if (showed < 3){
                    showed = 3;
                }
                for (i = 1; i <= showed; i++){
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
    $("section:not(#node" + num + "):not(#node" + num + " #full):not(#node" + (num-1) + "):not(#node" + (num+1) + ")").hide();
    //Smoothly hide +-1 sections
    $("#node" + (num-1)).slideUp('slow');
    $("#node" + (num+1)).slideUp('slow');
    $(".readMoreButton").fadeOut('slow');
    //Change #download button link to current node
    $("#download").attr("href", "https://dl.dropboxusercontent.com/u/70091792/Pages/" + (count - num + 1) + ".md");
    //Show #download and #back buttons
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

    //Show #node and #full, as well as scroll at the top
    $("#node" + num).slideDown('slow', function(){
        $("#node" + num + " #full").slideDown('slow', function(){
            $("html, body").animate({scrollTop: $("#node" + (num) + " #full").offset().top}, 'medium');
        });
    });
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
    for (i = 1; i <= showed; i++){
        //Show only #node part
        $("#node" + i).slideDown('slow');
    }
    //Hide #full part, all the buttons [back,download,previous,next]
    $("#node" + lbackup + " #full").slideUp('slow');
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

path = location.search;

$(window).load(function(){
    //Load count of nodes generated outside by server-side or manually
    $.ajax({
        url: 'https://dl.dropboxusercontent.com/u/70091792/Pages/count',
        type: 'get',
        dataType: 'html',
        async: true
    }).done(function(data){
        count = data;
        //Load ALL nodes at once
        for (i = count; i > 0; i--){
            loadNode(i); //i - name of file (15.md)
        }
    });
});

$(window).scroll(function() {
    //If scrolled all the way down
    if ($(window).scrollTop() >= $(document).height() - $(window).height() && backup == 0) {
        //If not all showed yet - show one more
        //Condition [if not all] was removed due to strange issue and grateful to no errors with such sentence
        $("#node" + (showed + 1)).slideDown('slow');
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
