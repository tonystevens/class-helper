import { Template } from 'meteor/templating';

import './courses-show.html';

Template.Courses_show.onCreated(function courseShowOnCreated() {
  // this.autorun(() => {
  //   new SimpleSchema({
  //     course: {type: Function},
  //     courseReady: {type: Boolean},
  //   }).validate(Template.currentData());
  // });
});