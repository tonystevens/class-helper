import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
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
    code: Random.id(6),
  };
  const courseId = Courses.insert(course);
  return { _id: courseId };
};

export const updateCourse = (courseId, courseAttributes) => {
  Courses.update({_id: courseId},
    {$set: {name: courseAttributes.name, description: courseAttributes.description}});
};

export const deleteCourse = (courseId) => {
  Courses.remove(courseId);
};

export const findCourseByCourseCd = (courseCd) => {
  return Courses.findOne({code: courseCd});
};

export const addStudentToCourse = (courseId, userId) => {
  return Courses.update({_id: courseId}, {$push: {students: userId}});
};

export const removeStudentFromCourse = (courseId, userId) => {
  return Courses.update({_id: courseId}, {$pop: {students: userId}});
};