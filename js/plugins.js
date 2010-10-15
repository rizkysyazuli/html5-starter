/**
 * [Project Name] Plugins
 *
 * @author      Your Name <your@email.com>
 * @version     x.x
 * @see         http://www.theurl.com/
 * @copyright   Copyright (c) 2010, Your Company
 *
 **/

// remap jQuery to $
(function($){

  /* Combining media queries and JavaScript:
     www.quirksmode.org/blog/archives/2010/08/combining_media.html */
  if (screen.width >= 480) {
    // do stuff for non-mobile browser
  }




})(this.jQuery);



// usage: log('inside coolFunc',this,arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};



// catch all document.write() calls
(function(doc){
  var write = doc.write;
  doc.write = function(q){ 
    log('document.write(): ',arguments); 
    if (/docwriteregexwhitelist/.test(q)) write.apply(doc,arguments);  
  };
})(document);


