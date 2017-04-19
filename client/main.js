Meteor.startup(function(){
  if(Meteor.isClient){
    var myApp = new Framework7();
    var $$ = Dom7;
  }
});
