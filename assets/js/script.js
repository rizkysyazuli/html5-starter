/**
 * [Project Name] Master Script
 *
 * @author      Your Name <your@email.com>
 * @version     x.x
 * @see         http://www.theurl.com/
 * @copyright   Copyright (c) 2010, Your Company
 *
 **/

var doc_title = document.title;
var App = {
  common: {
    init: function() {
      // application-wide functions



      // prevent outgoing links from being AJAX-ified :)
      UTIL.exec('common', 'external');
    },
    events: function() {
      // catch all link events, replace with AJAX request
      $(document).bind('click.ajax', function(e) {
        var target = e.target;

        // except outgoing and anchor link
        if (target.tagName==='A' && target.className!=='external' && (target.href.indexOf('#')==-1)) {
          // get link href without the site address
          // example: "http://mysite.com/news/important" makes "news/important"
          
          // TODO: still doesn't work if site in sub-folder
          var url = location.protocol + '//' + location.host + location.pathname;
          var path = target.href.substring(url.length);

          // change address hash values
          // note: the UTIL.init method listens to this event
          $.address.value(path);

          // block link click event
          e.preventDefault();
        }
      });
    },
    external: function() {
      // add 'external' class to all outgoing links
      return $('a[href^="http://"]').addClass('external');
    }
  },
  page: {
    init: function() {
      // global ajax page load handler

      // check page address & configurations
      var pathNames = $.address.pathNames(), config = App.page.config;

      // load page via AJAX
      if (!pathNames.length || pathNames[0]==='home') {
        // home page might have unique requirements.
        // but implementation might differ. so i just leave this here.
        $.ajax(config);
      } else {
        // other pages
        $.ajax(config);
      }
    },
    config: {
      // default AJAX page request settings.
      // see: http://api.jquery.com/jQuery.ajax/
      url: false,
      data: { },
      dataType: 'json',
      complete: function() { }
    },
    
    title: function(path) {
      // method to update document.title from URL hash
      
      // reformat path names
      var names = this.format(path);
      // combine with document.title
      var page_title = [doc_title].concat(names).reverse().join(' - ');
      // return the new title
      return page_title;
    },
    format: function(path) {
      // placeholder for the reformatted path names.
      // we don't want to break the original event.pathNames data
      var names = [];
      // loop each path names and capitalize them
      for (var i=0; i<path.length; i++) {
        names.push(this.capitalize(path[i]));
        // third level is *usually* a url slug,
        // example: news/detail/the-news-title
        
        // let's make it prettier
        if (i==2) {
          // remove 2nd level path name
          names.splice(1,1);

          var slug = names[1].split('-'), title = [];

          for (var j=0; j<slug.length; j++) {
            title.push(this.capitalize(slug[j]));
          }

          title = title.join(' ');
          names.pop(); // remove original slug from names
          names.push(title); // add the newly formatted title
        }
      }
      return names;
    },
    capitalize: function(txt) {
      // make first letter uppercase
      return txt.substr(0, 1).toUpperCase() + txt.substr(1);
    }
  },
  error: function() {
    console.log('404: Page not found!');
  }
};

var UTIL = {
  exec: function(controller, action) {
    var action = (action === undefined) ? 'init' : action;

    if (controller !== '' && App[controller] && typeof App[controller][action] == 'function') {
      App[controller][action]();
    } else {
      App['error']();
    }
  },

  init: function() {
    // enable Google crawlable URL hash values.
    // $.address.crawlable(true);

    // this is where the magic happens.
    // trigger method execution on address.change event.
    $.address.change(function(e) {
      var address = e.value, pathNames = e.pathNames;

      // execute application-wide codes.
      UTIL.exec('common');

      // execute page-specific controller & actions.
      if (pathNames.length && pathNames.length > 1) {
        UTIL.exec(pathNames[0], pathNames[1]);
      } else {
        UTIL.exec(pathNames[0] || 'home');
      }
      
      // update page title
      if (pathNames.length) {
        $.address.title(App.page.title(pathNames));
      } else {
        $.address.title(doc_title);
      }
    });

    /**
     * Based on our example, the order of execution could be like this:
     *
     * App.common.init();
     * App.news.init();
     * 
     * or:
     * 
     * App.common.init();
     * App.news.detail();
     *
     * see original article for details: http://bit.ly/aEwAny
     */
  }
};

$(document).ready(UTIL.init);
$(document).ready(App.common.events);