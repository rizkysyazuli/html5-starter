/**
 * [Project Name] Master Script
 *
 * @author      Your Name <your@email.com>
 * @version     x.x
 * @see         http://www.theurl.com/
 * @copyright   Copyright (c) 2010, Your Company
 *
 **/

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
    }
  },

  /* example methods */
  hello: {
    init: function() {
      // configure page-specific config & callbacks
      var config = App.page.config;

      config.href = 'hello.html';
      config.complete = function() {
        // the callback. do stuff when AJAX request complete.

      };

      // make the AJAX page request.
      UTIL.exec('page');
    }
  },
  world: {
    init: function() {
      // configure page-specific config & callbacks
      var config = App.page.config;

      config.href = 'world.html';
      config.complete = function() {
        // the callback. do stuff when AJAX request complete.

      };

      // make the AJAX page request.
      UTIL.exec('page');
    }
  }
};

var UTIL = {
  exec: function(controller, action) {
    var action = (action === undefined) ? 'init' : action;

    if (controller !== '' && App[controller] && typeof App[controller][action] == 'function') {
      App[controller][action]();
    }
  },

  init: function() {
    // enable Google crawlable URL hash values.
    $.address.crawlable(true);

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