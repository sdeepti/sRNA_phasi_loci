// This is a compiler directive that defines the underscore passed to the outer function. 
/* global _ */

/**
 * This is our outermost function.
 * @param {window} the DOM (document object model) of the HTML page.
 * @param {$} JavaScript 'this'. Standard JavaScript.
 * @param {_} Underscore 'this'. Specific to the underscore.js library.
 * @param {undefined} This really is undefined.
 * Nothing will get passed to the {undefined} paramter so it really is undefined.
 * Use it in comparisons to other variables to test if they are undefined.
 **/
(function(window, $, _, undefined) {
    'use strict';
    console.log('This is the Araport science app for Arabidopsis thaliana small RNA - Phasing Analysis.');

    /** 
     * data-app-name is an attribute of a div in app.html 
     * app.html is included by a div in index.html 
     **/
    var appContext;
    appContext = $('[data-app-name="sRNA_phasing_app"]');

    /**
     * The underscore.js library supports templates for display tables.
     * Here we define the template object to include table layout.
     *
     * Question: We are using <pre> for DNA sequence. Is there a better CSS class?
     **/
    var templates = {
	// This feature invokes a dependency. Make sure to run 'bower install --save underscore'
	// Consider adding the <caption> tag to the <table>. 
        plTable: _.template('<table class="table table-striped table-bordered">' +
                        	'<thead><tr>'+
				'<th>chromosome</th>'+
				'<th>start</th>'+
				'<th>end</th>'+
				'<th>phase length</th>'+
				'<th>score</th>'+
				'<th>min pvalue</th>'+
				'<th>locus id</th>'+
				'<th>title</th>'+
				'</tr></thead><tbody>'+
				'<% _.each(result[0], function(r) { %>'+
				'<tr>'+
				'<td><%= r["chromosome"] %></td>' +
				'<td><%= r["start"] %></td>' +
				'<td><%= r["end"] %></td>' +
				'<td><%= r["phase_length"] %></td>' +
				'<td><%= r["max_phasing_score"] %></td>' +
				'<td><%= r["min_pvalue"] %></td>' +
				'<td><%= r["locus_id"] %></td>' +
				'<td><%= r["title"] %></td>' +
				'</tr>'+
				'<% }) %>'+
				'</tbody>'+
				'</table>'),
};

    var showSearchError = function(json) {
	// Later, display an error to the user. For now, display an error on the developer console.
        console.error('Search returned error! Status=' + json.obj.status + ' Message=' + json.obj.message);
	console.log(json);
    };

    var showSearchResult = function(json) {
	// JavaScript === and !== operators test value and type.
	if (json.obj.status !== 'success') {
	    console.log('Search result status is NOT good!');
	    return (false);
	}
	
	// These commands, in code or typed into the console, are useful for exploring the data.
	// console.log('JSON Object = ' + JSON.stringify(json));
	// console.log(json.obj.result[0].sequence);
	// console.log(templates.plTable(json.obj));
	
	// This would be be optional redundant with next step that does a REPLACE.
	// $('.main_results').empty();           

	// The next command displays the table with a loop and a template.
	$('.main_results', appContext).html(templates.plTable(json.obj));

	// The next command paginates the table.
	// This feature invokes a dependency. Make sure to run 'bower install --save datatables'
	$('.main_results table', appContext).dataTable( {'lengthMenu': [5, 10, 25, 50, 100]} );
	return (true);
    };
    
    /**
     * Create an anonymous function and register it to fire when AgaveAPI is ready. 
     * Our science app functionality belongs inside this function. 
     **/
  window.addEventListener('Agave::ready', function() {
      var Agave, info;
      var htmlString;

      /**
       * Use the jQuery .html() setter/getter function to REPLACE content. 
       * Alter the HTML title to show we are running. 
       * Add a div to hold the interactive application content. 
       * Add a div to hold the provenance information. 
       * Each div could have a unique id. 
       * Each div could have one or more classes for sytling. 
       **/
      htmlString = '<h2><em>Arabidopsis thaliana</em> small RNA - Phased Loci </h2>' +
	  '<div class="interactive"></div>' +
	  '<div class="main_results"></div>' +
	  '<hr><div class="provenance-info"></div><br>';
      appContext.html(htmlString);
      
      /**
       * Search the appContenxt div for elements with attribute provenance-info. 
       * Adjust the provenance info at the bottom of the screen 
       **/
      info = $('.provenance-info', appContext);

      // The bootstrap.css (in use at Araport) recognizes class "text-center" and centers it. 
      info.addClass('text-center');

      /**
       * For now, hard code some provenance info. 
       * Later, get provenance from a Meyers Lab web service. 
       **/
      info.append('<p>Visit <a href="http://www.meyerslab.org/data/">Meyers Lab Data</a> for more information!</p>');

      /** 
       * This is redundant because this function was called on Agave ready! 
       * However this is demonstrative of an Agave call. 
       * The getStatus() call takes three parameters: args, callback, error. 
       * We pass an empty opbject, an anonymous function, and omit error. 
       *
       * Agave = window.Agave;
       * Agave.api.adama.getStatus({}, function(resp) {
       *  if (resp.obj.status === 'success') {
       *      console.log('Agave status is good!');
       *  } else {  
       *      console.log('Agave status is NOT good!');
       *      return (false);
       *  }
       * }); // end of getStatus 
       **/ 

      /**
       * Execute a search.
       * Adama search parameters are: object, successCallback, failCallback.
       * Adama search object elements are: namespace, service, args.
       * We provide an anonymous function as the callback.
       **/
      Agave = window.Agave;
      Agave.api.adama.search(
          { 'namespace': 'meyerslab', 
	    'service': 'srna_phased_loci_v0.1', 
            'queryParams': {}
	  },
	  showSearchResult,
	  showSearchError
      );
  });        

})(window, jQuery, _);
