import { Template } from 'meteor/templating';

Template.test.onCreated(() => {
  let myApp = new Framework7({
    router: false
  });
  let $$ = Dom7;
});

Template.test.onRendered(() => {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
    }
  });
});