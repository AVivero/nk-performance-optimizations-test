function Pager(tableName,itemsPerPage) {
this.tableName=tableName;
this.itemsPerPage = itemsPerPage;
this.currentPage=1;
this.pages=0;
this.inited=false;

this.showRecords=function(from,to){
var rows = document.getElementById(tableName).rows;
// i starts from 1 to skip table header row
for (var i=1; i < rows.length; i++) {
if (i < from || i > to)
rows[i].style.display='none';
else
rows[i].style.display='';
}
}

this.showPage = function (pageNumber) {
    if (!this.inited) {
        alert("not inited");
        return;
    }
    this.currentPage = pageNumber;
    var perviouslink = document.getElementById("prev");
    var perviouslinksaprator = document.getElementById("sapratorprev");
    if (this.currentPage == 1) {
        perviouslink.setAttribute("class", "disalbed");
        perviouslinksaprator.setAttribute("class", "disalbed");
    }
    else {
        perviouslink.removeAttribute("class");
        perviouslinksaprator.removeAttribute("class");
    }
    var nextlink = document.getElementById("next");
    var nextlinksaprator = document.getElementById("sapratornext");
    if (this.currentPage == this.pages) {
        nextlink.setAttribute("class", "disalbed");
        if (nextlinksaprator != null) {
            nextlinksaprator.setAttribute("class", "disalbed");
        }
    }
    else {
        nextlink.removeAttribute("class");
        if (nextlinksaprator != null) {
            nextlinksaprator.removeAttribute("class");
        } 
    }



    if (document.getElementById('pg' + this.currentPage) != null) {

        for (i = 1; i < document.getElementById(tableName).rows.length; i++) {

            var oldPageAnchor = document.getElementById('pg' + i);
            if (oldPageAnchor != null) {
                oldPageAnchor.removeAttribute("class");

                if (i == this.currentPage) {
                    oldPageAnchor.setAttribute("class", "pg-selected");
                }
                else {
                    oldPageAnchor.setAttribute("class", "pg-normal");
                }
            }
        }

    }
    var from = (pageNumber - 1) * itemsPerPage + 1;
    var to = from + itemsPerPage - 1;
    this.showRecords(from, to);
}

this.prev =function() {
if (this.currentPage > 1)
this.showPage(this.currentPage - 1);
}

this.next= function() {
if (this.currentPage < this.pages) {
this.showPage(this.currentPage + 1);
}
}

this.init=function() {
var rows=document.getElementById(tableName).rows;
var records=(rows.length-1);
this.pages=Math.ceil(records / itemsPerPage);
this.inited=true;
}

this.showPageNav = function (pagerName, positionId) {
    if (!this.inited) {
        alert("not inited");
        return;
    }

    var element = document.getElementById(positionId);

    var pagerHtml = '<span id="prev" onclick= "' + pagerName + '.prev();" class="pg-normal"> &#171;Prev </span> <span id="sapratorprev">|</span> ';


    for (var page = 1; page <= this.pages; page++)


        if (page == this.pages)
     {
         pagerHtml += '<span id="pg' + page + '" class="pg-normal" onclick="' + pagerName + '.showPage(' + page + ');">' + page + '</span> <span id="sapratornext">|</span>';
     }
    else {
        pagerHtml += '<span id="pg' + page + '" class="pg-normal" onclick="' + pagerName + '.showPage(' + page + ');">' + page + '</span> <span>|</span>';
    }
    pagerHtml += '<span id="next" onclick="' + pagerName + '.next();" class="pg-normal">Next&#187;</span>';

    element.innerHTML = pagerHtml;
}
}

function PagerByClassName(className, itemsPerPage) {
    this.className = className;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.pages = 0;
    this.inited = false;

    this.showRecords = function (from, to) {
        var rows = document.getElementsByClassName(className);
        // i starts from 0 in this version because now we are working with divs not TRs labels
        for (var i = 0; i < rows.length; i++) {
            if (i < from || i > to-1)
                rows[i].style.display = 'none';
            else
                rows[i].style.display = '';
        }
    }

    this.showPage = function (pageNumber) {
        if (!this.inited) {
            alert("not inited");
            return;
        }
        this.currentPage = pageNumber;
        var perviouslink = document.getElementById("prev");
        var perviouslinksaprator = document.getElementById("sapratorprev");
        if (this.currentPage == 1) {
            perviouslink.setAttribute("class", "disalbed");
            perviouslinksaprator.setAttribute("class", "disalbed");
        }
        else {
            perviouslink.removeAttribute("class");
            perviouslinksaprator.removeAttribute("class");
        }
        var nextlink = document.getElementById("next");
        var nextlinksaprator = document.getElementById("sapratornext");
        if (this.currentPage == this.pages) {
            nextlink.setAttribute("class", "disalbed");
            if (nextlinksaprator != null) {
                nextlinksaprator.setAttribute("class", "disalbed");
            }
        }
        else {
            nextlink.removeAttribute("class");
            if (nextlinksaprator != null) {
                nextlinksaprator.removeAttribute("class");
            }
        }



        if (document.getElementById('pg' + this.currentPage) != null) {

            for (i = 1; i < document.getElementsByClassName(className).length; i++) {

                var oldPageAnchor = document.getElementById('pg' + i);
                if (oldPageAnchor != null) {
                    oldPageAnchor.removeAttribute("class");

                    if (i == this.currentPage) {
                        oldPageAnchor.setAttribute("class", "pg-selected");
                    }
                    else {
                        oldPageAnchor.setAttribute("class", "pg-normal");
                    }
                }
            }

        }
        var from = (pageNumber - 1) * itemsPerPage;
        var to = from + itemsPerPage;
        this.showRecords(from, to);
    }

    this.prev = function () {
        if (this.currentPage > 1)
            this.showPage(this.currentPage - 1);
    }

    this.next = function () {
        if (this.currentPage < this.pages) {
            this.showPage(this.currentPage + 1);
        }
    }

    this.init = function () {
        var rows = document.getElementsByClassName(className).length;
        var records = (rows - 1);
        this.pages = Math.ceil(records / itemsPerPage);
        this.inited = true;
    }

    this.showPageNav = function (pagerName, positionId) {
        if (!this.inited) {
            alert("not inited");
            return;
        }

        var element = document.getElementById(positionId);

        var pagerHtml = '<span id="prev" onclick= "' + pagerName + '.prev();" class="pg-normal"> &#171;Prev </span> <span id="sapratorprev">|</span> ';


        for (var page = 1; page <= this.pages; page++)


            if (page == this.pages) {
                pagerHtml += '<span id="pg' + page + '" class="pg-normal" onclick="' + pagerName + '.showPage(' + page + ');">' + page + '</span> <span id="sapratornext">|</span>';
            }
            else {
                pagerHtml += '<span id="pg' + page + '" class="pg-normal" onclick="' + pagerName + '.showPage(' + page + ');">' + page + '</span> <span>|</span>';
            }
        pagerHtml += '<span id="next" onclick="' + pagerName + '.next();" class="pg-normal">Next&#187;</span>';

        element.innerHTML = pagerHtml;
    }
}