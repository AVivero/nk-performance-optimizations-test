var listWithoutUs=chunk1.concat(chunk2,chunk3,chunk4);var removeBykey=function(e,t,n){var i=e.length;while(i--){if(e[i]&&e[i].hasOwnProperty(t)&&(arguments.length>2&&e[i][t]===n)){e.splice(i,1)}}return e};removeBykey(listWithoutUs,"geo_id","6252001");removeBykey(listWithoutUs,"country_code","US");removeBykey(listWithoutUs,"geo_id","4796775");removeBykey(listWithoutUs,"country_code","VI");var fullList=chunk1.concat(chunk2,chunk3,chunk4);function difference(e,t){return e.filter(function(e){return t.indexOf(e)==-1})}var listUsOnly=difference(fullList,listWithoutUs);var completeNewList=listUsOnly.concat(listWithoutUs);var html=completeNewList.map(function(e){if(prelaunch_phase){return'<li class="'+e.class+'"><a>'+e.name+"</a></li>"}else{return'<li class="'+e.class+'"><a href="'+e.url+'">'+e.name+"</a></li>"}}).join("");document.getElementById("destinationPanel").innerHTML=html;
window.onload=function(){if($("#accordion").html().length>0){$("#accordion").accordion({collapsible:true,heightStyle:"content"});$("#accordion .ui-accordion-header").attr("tabindex","0");$("#accordion").on("accordionactivate",function(a,e){$("#accordion .ui-accordion-header").attr("tabindex","0")});$("#accordion").on("keydown",".ui-accordion-header",function(a){if(a.keyCode===37||a.keyCode===38||a.keyCode===39||a.keyCode===40){var e=$(":focus");e.trigger("click")}});$("a[data-parent]").each(function(){$(this).click(function(){$targetDiv=$(this).attr("data-href");if($(this).hasClass("collapsed")){$($targetDiv).attr("aria-expanded",true).addClass("in").attr("style","");$(this).removeClass("collapsed")}else{$($targetDiv).attr("aria-expanded",false).removeClass("in").css("height","31px");$(this).addClass("collapsed")}})})}};