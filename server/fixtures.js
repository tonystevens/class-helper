import { Meteor } from 'meteor/meteor';

import { Courses } from '../lib/courses.js';

Meteor.startup(() => {
    if ( Courses.find().count() === 0 ) {
      const data = [{
        name: 'Mathematics',
        userId: 'SobRFPHTd84qKQm3b',
        students: [
          'QYEEce7LNB3rArzZt'
        ],
      }, {
        name: 'Music',
        userId: 'SobRFPHTd84qKQm3b',
        students: [
          'QYEEce7LNB3rArzZt'
        ],
      }, {
        name: 'English',
        userId: 'QYEEce7LNB3rArzZt',
        students: [
          'SobRFPHTd84qKQm3b', 'Nv5FTAneqNbmJLxh7'
        ],
      }, {
        name: 'Computer Science',
        userId: 'Nv5FTAneqNbmJLxh7',
        students: [
          'SobRFPHTd84qKQm3b', 'QYEEce7LNB3rArzZt'
        ],
      }];
      let timestamp = (new Date()).getTime();

      data.forEach((course) => {
        Courses.insert({
          name: course.name,
          incompleteCount: course.students.length,
          userId: course.userId,
          createAt: new Date(timestamp),
          students: course.students
        });
        timestamp += 1;
      });
    }
  }
);
