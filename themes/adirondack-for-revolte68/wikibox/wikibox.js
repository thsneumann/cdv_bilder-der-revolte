
/*
 * wikibox.js
 * 
 * @description Adds a on click Infobox for <a> elements that refer to a gnd identifier of the integrated authority file (Gemeinsame Normdatei (GND)) of German National Library.
 * @dependencies This is only FE logic, requires a gndProxy Instance (PHP) to fetch data from DNB, Culturegraph and Wikipedia/Wikidata, cf. http://github.com/jhercher/gndProxy.
 * @creator Johannes Hercher <hercher@ub.fu-berlin.de>
 * 
 * @copyright  
 * @license    http://unlicense.org/
 * 
 * @version 0.2
 */
 /*Configure*/
 var proxy = 'http://data.ub.fu-berlin.de/gndProxy/gnd.php?query='
 ,services = '&services=cult,dnb,wiki&lang='
 ,loc = '.entry-footer>.meta-item.tags, .entry-footer>.meta-item.persons'
 ,catUrl = 'https://primo.fu-berlin.de/search/any/'
 ; 
var initWikibox = function(){
var wikibox = {
 'proxy' : proxy,
 'services' : services,
 'loc' : loc, // place to let jquery search for wikibox-gndlinks  
 'catUrl' : catUrl, // link to your favourite library catalog
 //TODO these functions should go into the protoype...
 'makeInfoboxHeader' : function( obj, lang ){
                        var until = typeof obj.until !=='undefined' ? obj.until : ''
                           ,since = typeof obj.since !=='undefined' ? obj.since : '' 
                           ,sinceuntil = (since !== '')  ? '<small> ' + since+ ' - '+ until+'</small>' : ''
                           ,title = (typeof obj.wikipage !== "undefined") ? '<a target="_blank" href="'+ obj.wikipage +'" name="Link zu Wikipedia" title="Link zu Wikipedia">'+obj.name+'</a>' 
                                                                 : obj.name
                                                                 ;
                         return '<span class="wikibox-headline" id="wikibox-'+obj.gndId+'-headline">'+title+'</span><span class="wikibox-sinceuntil">'+sinceuntil+'</span>';
                     },
 'makeContent' : function( obj, baseSysUrl, lang ){ //semantics = semantic relations (broader...) //related = VB, Verwandte, vorherige bezeichner...
                         //var obj = obj;
                       var wikitext = (  typeof obj.description !== "undefined") ? '<p class="wikibox-text dbpDescription"> '+ obj.description +'<a target="_blank" href="'+obj.wikipage+'" name="Link zu Wikipedia" title="Link zu Wikipedia">weiterlesen in Wikipedia</a></p>' 
                                           : ''
                                           
                         , image = (     typeof obj.img !== "undefined") ? '<img class="float-left wikibox-img" src="'+obj.img+'">' 
                                           : ''
                       
                         , gndDescr = (  typeof obj.definition !== "undefined") ? '<span class="wikibox-HeadingShortInfo italic">'+obj.definition+'</span>' 
                                           : ''
                                           
                         , similar = (   typeof obj.related !== "undefined") ? '<p class="wikibox-Relations"><strong>Beziehung(en)</strong> <span>'+obj.related+'</span></p>' 
                                           : ''
                                           
                         , relations = ( typeof obj.semantics !== "undefined") ? '<p class="wikibox-Berufe"><strong>Beruf(e)</strong> <span> '+obj.semantics+'</span></p>' 
                                           : ''
                                           
                         , professions = ( typeof obj.professions !== "undefined") ? '<p class="wikibox-Berufe"><strong>Beruf(e)</strong> <span> '+obj.professions+'</span></p>' 
                                           : ''
                                           
//                            , wikilink = (  typeof obj.wikipage !== "undefined") ? '<a target="_blank" href="'+ obj.wikipage +'">weiterlesen</a>' 
//                                              : ''
//                                                           
//                            , othernames = ( typeof obj.synSearch !== "undefined") ? '<p class="WikiBoxSynonyms"><strong>Andere Namen</strong>'+ obj.altname.length > 30 ? obj.altname.substring(0, 30) : obj.altname +'<a class="synSearch" href="'+ baseSysUrl + encodeURIComponent( obj.synSearch )+'"> suche</a></p>' 
                         , othernames = ( typeof obj.altname !== "undefined") ? '<p class="WikiBoxSynonyms"><strong>Auch: </strong>'+obj.altname  +'</p>' 
                                                                 : ''
                                                                 ;
                         return '<div class="wikibox-content">'+ gndDescr + image + wikitext + professions +othernames + similar + relations+ '</div>';
                     },
     'makeExternalLinks' : function( obj, lang, expand ){
                             var l = '', link = wikibox.texts[lang].links;
                              for (var i in link ) {
                                if(link.hasOwnProperty(i)){ //Filter	
                                   l += '<li><a class="" target="_blank" title="'+link[i].desc+'" href="'+link[i].url+''+obj.name.replace(/<.*>/g,"")+'"><span class="thumb thumb-'+i+'"></span>'+link[i].text+'</a></li>';
                                 }
                               }
                              // console.dir(l);
                            if(expand){
                               return '<div id="FUBSorryFewInfo-gndId-' + obj.gndId + '" >' + wikibox.texts[lang].notEnough + '</div> <ul class="drop-links-list-expanded">'
                                + l +
                                '</ul>';
                            }else{
                                return '<ul class="drop-links pull-right"><li><button>Weitersuchen in… </button><ul>'
                                + l +
                                '</ul></li></ul>';
                            }
                    },
     'showErrorMessage' : function( obj, lang ){
                       
                        return  '<div id="FUBSorryFewInfo-gndId-' + obj.gndId + '" >' + wikibox.texts[lang].error + '</div>';
                         
                    },
     'makeFooter' : function( obj, lang ){
                       return '</div><div class="wikibox-footer">GND: <a target="_blank" href="http://d-nb.info/gnd/' + obj.gndId + '">' + obj.gndId + '</a>';
                    },
 'texts' :  {
     'en_EN': {
     beruf : "Job(s)",
     noService : "Sorry, this service is currently offline.",
     beziehungen : "Friends & Family",
     notEnough : "Only sparse information found - please inform us.",
     synSearch : "Search with these synonyms",
     error : "Sorry, supplied Identifier does not exist or service is not available."
 },
 
     'de_DE': {
     beruf : "Beruf(e)",
     beziehungen : "Freunde & Familie",
     noService : "Dieser Service steht z.Zt. nicht zur Verfügung. Bitte prüfen Sie die GND-Nummer nicht korrekt?.",
     notEnough : "Nur wenige Infos gefunden! Versuchen Sie eine Suche in:",
     synSearch : "mit diesen Synonymen weitersuchen",
     'links': {
         wikipedia: {
             url: "https://de.wikipedia.org/wiki/",
             text: "Wikipedia",
             desc: "Definitionen, Bilder und Links für (fast) alles",
             thumb: ""
         },
         europeana: {
             url: "http://www.europeana.eu/portal/search.html?query=",
             text: "Europeana (Primärquellen: Texte, Bilder, Videos)",
             desc: "Primärquellen: Texte, Bilder, Videos in europäischen Museen und Archiven",
             thumb: ""
         },
         worldcat: {
             url: "http://www.worldcat.org/search?qt=worldcat_org_all&q=",
             text: "Worldcat",
             desc: "Mehr als Milliarden Titel in ihren Bibliotheken (international)",
             thumb: ""
         },
         library: {
             url: catUrl,
             text: "Katalog der FU Berlin",
             desc: "> 3 mrd. akademische Fachliteratur und Bücher im Bibliotheksportal Primo der FU Berlin",
             thumb: ""
         },
         portal: {
             url: "https://portal.kobv.de/simpleSearch.do?query=",
             text: "KOBV Portal",
             desc: "Durchsuchen Sie Bibliotheken in Berlin und Brandenburg",
             thumb: ""
         }
         
     },
     error : "Fehler: Die angegebene Nummer ist falsch oder der Service ist zur Zeit nicht verfügbar."
 }
 }
};
 jQuery(wikibox.loc).on("click", '.wikibox-gndlink', function(e) {
      e.preventDefault();
     //console.log('[wikibox]: a.gndlink clicked! ');
     
     var target = jQuery(this)
         ,lang = "de_DE" //LANGUAGE; //.split("_")[0];
         ,id = target.attr('data-gnd');
     //display existing wikiboxes…
     if (jQuery('#wikibox-' + id).length >= 1) { jQuery('#wikibox-' + id).show();

     } else { // create new wikibox…

         var divContext = jQuery(this) 
           , infoFrame = '<div id="wikibox-' + id + '" class="wikibox loading"><button class="close"></button></div></div>'
         ;
         divContext.after(infoFrame);

         console.log('[wikibox] query dataservice: '+ proxy + id + services+ lang.split("_")[0]);
         jQuery.ajax(proxy + id + services+ lang.split("_")[0] + '&jsoncallback=?', {
             type: 'GET',
             dataType: 'json',
             success: function(resp) {
                 var len = 0;

                 for (var prop in resp){
                     if(resp[prop] !== "" || typeof resp[prop] === "undefined"){
                      resp[prop] = resp[prop].toString().replace(/</g,"(").replace(/>/g,")").replace(/\(\(\S*\)\)/g,"").trim(); //mask homonyms with brackets 
                     len++;

                     }
                      // console.log(" object size: "+len);
                 }
                 
                 var msgOpen = ' <div class="wikibox-content">'
                    ,header = wikibox.makeInfoboxHeader( resp, lang)
                    ,content = wikibox.makeContent( resp, wikibox.catUrl , lang)
                    ,few = (  typeof len !== 0 &&  len <= 6 ) ? wikibox.makeExternalLinks( resp, lang, true ) : ''
                    ,error =  ( len === 0 ) ? wikibox.showErrorMessage( resp, lang ) : ''
//                       ,fewInfo = ( error !== '' || few !== '' ) ? error +''+ few : ''
                    ,fewInfo = ( error !== '' || few !== '' ) ? error +''+ few : wikibox.makeExternalLinks( resp, lang, false )
                    ,footer = wikibox.makeFooter( resp, lang ) 
                    ,msgCls = '</div>'
                    ,msg = msgOpen+header+content+fewInfo+footer+msgCls
                 ;

                 divContext.parent().find('#wikibox-' + id).removeClass('loading').append(msg);//.append(oL).append(footer);
//
             }, 
             error: function(){}
         });
     }
 });
 console.log(jQuery.ajax.url);
 jQuery(wikibox.loc).on("click", '.close', function(e) {
     jQuery(this).parent().hide();
 });
//    }
};
jQuery(document).ready(function() {    
 var attachGndData = function() {
     var i = 0;
     jQuery('.meta-item.tags, .meta-item.persons').find('img').parent().each(function() {
         var a = jQuery(this);
         a.addClass('wikibox-gndlink');
         a.attr("data-gnd", a.attr('href').split('/').slice(-1)[0].trim());
         i++;
     });
 } () ;
 
 initWikibox();
});
