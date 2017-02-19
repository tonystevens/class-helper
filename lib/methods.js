import { Meteor } from 'meteor/meteor';

import { Courses } from './courses.js';

export const insertCourse = (courseAttributes) => {
  const user = Meteor.user();
  const { courseName, courseDescription } = courseAttributes;
  const course = {
    name: courseName,
    description: courseDescription,
    userId: user._id,
    createAt: new Date(),
    students: [],
  };
  const courseId = Courses.insert(course);
  return { _id: courseId };
}

export const updateCourse = (courseId, courseAttributes) => {
  Courses.update({_id: courseId},
    {$set: {name: courseAttributes.name, description: courseAttributes.description}});
}

export const deleteCourse = (courseId) => {
  Courses.remove(courseId);
}
