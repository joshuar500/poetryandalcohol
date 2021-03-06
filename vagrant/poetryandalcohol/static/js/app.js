$(document).ready(function() {
    
   $('#my-modal').bind('hide', function () {
        clear_poem_forms();
    });
    
  var current_userid = 0;
  /*GET CURRENT LOGGED IN USER*/
  /* Dont forget to check server side too! */
  var get_current_user = function(e) {        
                    
    $.getJSON($SCRIPT_ROOT + '/get_current_user', {
        test : 'test'
    }, function(data){
        current_userid = data.user_id;
        console.log("current_userid: " + current_userid);
        return true;
    });
    return false;
  };        

  /*GET LIST OF POEMS BY AUTHOR THEN UPDATE THE PAGE*/
  var get_poems = function(e) {
      
    author_name = $.trim($(this).parent().text());    
    console.log(author_name);
      
    var id = $(this).attr('id');    
    update_poem_place(id, author_name);    

    $.getJSON($SCRIPT_ROOT + '/get_author_poems', {
      author_id: $(this).attr('id')
    }, update_poem_list);
    return false;
  };


  var update_poem_list = function(data) {
    clear_poem();
    clear_poem_list();        
    var i = 0;
    if(data !== null) {
      $.each(data, function() {
        $.each(this, function(key, value){
            /* only need to append author_id once so as not to cause any confusion */
            if (i === 0) {
              $('#poem-list').append('<span style="display:none;">' + value.author_id + '</span>');
              i += 1;
            }
            $('#poem-list').append('<a class="poem-link" id="'+ value.id +'" href="#">' + value.name + '</a><br />');
        });
      });
    if(current_userid !== 0){         
        $('#poem-list').append('<hr /><a href="#add-poem" data-toggle="modal" data-target="#addPoem"><button type="button" class="btn btn-default btn-xs">Add Poem</button></a><br />');
    }
    initMagPopup();
    initClickBinds.update_poem_clicks();
    } else {
      return false;
    }
  };


  /*GET A SINGLE POEM THEN UPDATE THE PAGE*/
  var get_one_poem = function(e) {    
    $.getJSON($SCRIPT_ROOT + '/get_poem', {
      poem_id: $(this).attr('id')      
    }, display_poem);
    return false;
  };


  var display_poem = function(data) {
    //clear_poem_forms();
    clear_poem();           
    if(data !== null) {
        /* init slimscroll for poem */
        $.each(data, function(key, value) {
            
            $('#update-poem-form #name').attr('value', value.name);
            $('#update-poem-form #the_poem').val(value.the_poem);
            $('#update-poem-form #id').val(value.id);
            
            $('#poem').append('<h2>' + value.name + '</h2><span class="fix-lines">' + value.the_poem + '</span><br />');                                    
            /* check is current user is owner of this poem */
            if(current_userid === value.user_id){
                console.log("YES"); 
                $('#poem').append('<hr /><a href="#update-poem" data-toggle="modal" data-target="#updatePoem"><button type="button" class="btn btn-default btn-xs">Update Poem</button></a>'+
                        '<i class="fa fa-pencil-square-o" style="display:none">' + value.id + '</i>' +                        
                     '&nbsp;<a href="#delete-poem" class="update-poem-link" data-toggle="modal" data-target="#deletePoem"><button type="button" class="btn btn-default btn-xs">Delete Poem</button></a><br />');
            };
        });        
        initMagPopup();
        remove_classie_stuff();
        initClickBinds.update_poem_clicks();        
    } else {
      return false;
    }
  };


  /*UPDATE THE AUTHORS NAME/ID FOR FORM*/
  /*FORM DOES ACTUAL LOGIC*/
  var update_author_place = function() {
      clear_author_forms();
      /*now update everything*/      
      author_id = $(this).parent().attr('id');      
      $('#update-author-form #id').attr('value', author_id);
      $('#delete-author-form #id').attr('value', author_id);      
  };


  /*UPDATE THE POEM'S NAME/ID FOR FORM*/
  /*FORM DOES ACTUAL LOGIC*/
  var update_poem_place = function(author_id, author_name) {
      clear_poem_forms();
      /*now update everything*/
      poem_id = $('#poem').find('i').text();
      console.log("author: " + author_name);      
      console.log("poem_id: " + poem_id);
      console.log("author_id: " + author_id);
      $('#add-poem-form #author_id').attr('value', author_id);      
      $('#add-poem-form #author_name').attr('value', author_name);      
      $('#author_name').prop('disabled', false);
      $('#update-poem-form #id').attr('value', poem_id);
      $('#update-poem-form #author_name').attr('value', author_name);
      $('#delete-poem-form #id').attr('value', poem_id);
  };


  /*CLEAR POEM LIST*/
  var clear_poem_list = function() {
    $('#poem-list').empty();
    $('#update-poem-form #name').attr('value', '');
    $('#update-poem-form #the_poem').empty();
  };

  var clear_poem = function() {
    $('#poem').empty();
  };


  var clear_author_forms = function() {
    $('#update-author-form #name').attr('value', '');
    $('#update-author-form #id').attr('value', '');

    $('#delete-author-form #name').attr('value', '');
    $('#delete-author-form #id').attr('value', '');
  };

  var clear_poem_forms = function() {
    $('#add-poem-form #id').attr('value', '');
    $('#add-poem-form #author_name').attr('value', '');

    $('#update-poem-form #name').attr('value', '');        
    $('#update-poem-form #id').attr('value', '');

    $('#delete-poem-form #name').attr('value', '');
    $('#delete-poem-form #id').attr('value', '');
  };


  var initClickBinds = function() {

    /* author links when clicked will call get_poems function */
    $('a.author-link').bind('click', get_poems);

    $('a.author-link').bind('keydown', function(e) {
      if (e.keyCode == 13) {
        get_poems(e);
      }
    });


    $('a.update-author-link').bind('click', update_author_place);     
    
  };


  initClickBinds.update_poem_clicks = function() {
    
    
    
    $('#poem').slimScroll({
        height: 'auto',
        width: '350px',
        size: '5px',
        railOpacity: 0.1
    });
    
    $('a.update-poem-link').bind('click', update_poem_place);

    $('a.poem-link').bind('click', get_one_poem);

    $('a.poem-link').bind('keydown', function(e) {
      if (e.keyCode == 13) {
        get_one_poem(e);
      }
    });
            
  };

  var initMagPopup = function() {
    $('.popup-with-form').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#name',

        // When elemened is focused, some mobile browsers in some cases zoom in
        // It looks not nice, so we disable it:
        callbacks: {
          beforeOpen: function() {
            if($(window).width() < 700) {
              this.st.focus = false;
            } else {
              this.st.focus = '#name';
            }
          }
        }
      });
  };

  /* class helper functions from bonzo
   * https://github.com/ded/bonzo
   */
  function classReg( className ) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
  }

  // classList support for class management
  // altho to be fair, the api sucks because it won't accept multiple classes at once
  var hasClass, addClass, removeClass;

  if ( 'classList' in $(document.documentElement) ) {
    hasClass = function( elem, c ) {
      return elem.classList.contains( c );
    };
    addClass = function( elem, c ) {
      elem.classList.add( c );
    };
    removeClass = function( elem, c ) {
      elem.classList.remove( c );
    };
  }
  else {
    hasClass = function( elem, c ) {
      return classReg( c ).test( elem.className );
    };
    addClass = function( elem, c ) {
      if ( !hasClass( elem, c ) ) {
        elem.className = elem.className + ' ' + c;
      }
    };
    removeClass = function( elem, c ) {
      elem.className = elem.className.replace( classReg( c ), ' ' );
    };
  }

  function toggleClass( elem, c ) {
    var fn = hasClass( elem, c ) ? removeClass : addClass;
    fn( elem, c );
  }

  var classie = {
    // full names
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    // short names
    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass
  };

  /*
   * The nav stuff
   */
  var body = document.body,
    mask = document.createElement("div"),
    mask_again = document.createElement("div"),
    activeNav
  ;

  /* first mask is for poem list,
   * second mask is for individual poem
   */
  mask.className = "mask";
  mask_again.className = "mask-again";

  var remove_classie_stuff = function() {
    activeNav = "";
    classie.add( body, "pmr-open-again" );
    document.body.appendChild(mask_again);
    activeNav = "pmr-open-again";
  };

  /*INITIALIZE EVERYTHING*/
  initMagPopup();
  initClickBinds();
  get_current_user();

  /* TODO: animation for menu changes */

});
