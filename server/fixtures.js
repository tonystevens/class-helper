import { Meteor } from 'meteor/meteor';

import { Courses } from '../lib/courses.js';

Meteor.startup(() => {
    if ( Courses.find().count() === 0 ) {
      // const data = [{
      //   name: 'Mathematics',
      //   description: 'Fundamental Algebra from 1 to 100',
      //   userId: 'bSeo4XEXh6TvHtjC6',
      //   students: [
      //     'QYEEce7LNB3rArzZt'
      //   ],
      //
      // }, {
      //   name: 'Music',
      //   description: 'Hip hop fasion vs classic style',
      //   userId: 'bSeo4XEXh6TvHtjC6',
      //   students: [
      //     'QYEEce7LNB3rArzZt'
      //   ],
      // }, {
      //   name: 'English',
      //   description: 'Advanced English with 1 on 1 oral practice',
      //   userId: 'QYEEce7LNB3rArzZt',
      //   students: [
      //     'bSeo4XEXh6TvHtjC6', 'Nv5FTAneqNbmJLxh7'
      //   ],
      // }, {
      //   name: 'Computer Science',
      //   description: 'Introduction to Algorithm',
      //   userId: 'Nv5FTAneqNbmJLxh7',
      //   students: [
      //     'bSeo4XEXh6TvHtjC6', 'QYEEce7LNB3rArzZt'
      //   ],
      // }];
      // let timestamp = (new Date()).getTime();
      //
      // data.forEach((course) => {
      //   Courses.insert({
      //     name: course.name,
      //     description: course.description,
      //     userId: course.userId,
      //     createAt: new Date(timestamp),
      //     students: course.students
      //   });
      //   timestamp += 1;
      // });
    }
  }
);
