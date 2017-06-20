Meteor.startup(function(){
  if(Meteor.isClient){
    var myApp = new Framework7();
    var $$ = Dom7;

    TAPi18n.setLanguage(getUserLanguage())
      .done(function () {
      })
      .fail(function (error_message) {
        console.log(error_message);
      });

  }
});

getUserLanguage = () => "en";
