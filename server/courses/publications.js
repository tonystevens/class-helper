import { Meteor } from 'meteor/meteor';

import { Courses } from '../../lib/courses.js';

Meteor.publish('courses.private', function coursesPrivate() {
  if (!this.userId) {
    return this.ready();
  }
  return Courses.find({
    userId: this.userId,
  }, {
    fields: Courses.publicFields,
  });
});
