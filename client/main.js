Meteor.startup(function(){
  if(Meteor.isClient){
    TAPi18n.setLanguage(getUserLanguage())
      .done(function () {
        console.log('i18n finished loading');
      })
      .fail(function (error_message) {
        console.log(error_message);
      });

  }
});

getUserLanguage = () => "zh";

