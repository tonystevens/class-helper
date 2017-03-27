import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Courses } from './courses.js';
import { Messages } from './messages.js';
import { Channels } from './channels.js';

// Users
export const findUserById = (userId) => {
  return Meteor.users.findOne({_id: userId});
};

// Courses
export const insertCourse = (attributes) => {
  const user = Meteor.user();
  const { courseName, courseDescription } = attributes;
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

export const updateCourse = (courseId, attributes) => {
  const { name, description } = attributes;
  const updateAttributes = {
    name: name,
    description: description,
  };
  Courses.update({_id: courseId}, {$set: updateAttributes});
};

export const deleteCourse = (courseId) => {
  Courses.remove(courseId);
};

export const findCourseByCourseCd = (courseCd) => {
  return Courses.findOne({code: courseCd});
};

export const findOwnedCourses = (userId) => {
  if (userId === Meteor.userId()) {
    return Courses.find({ userId: userId }, { sort: {createdAt: -1}})
  }
};

export const findJoinedCourses = (userId) => {
  if (userId === Meteor.userId()) {
    return Courses.find({ students: userId }, { sort: {createdAt: -1}});
  }
};

export const addStudentToCourse = (courseId, userId) => {
  return Courses.update({_id: courseId}, {$push: {students: userId}});
};

export const removeStudentFromCourse = (courseId, userId) => {
  return Courses.update({_id: courseId}, {$pop: {students: userId}});
};

// Channels
export const insertChannel = (attributes) => {
  const user = Meteor.user();
  const { name, recipient_id, subject, category } = attributes;
  const channel = {
    name: name,
    subject: subject,
    category: category,
    owner_id: user._id,
    recipient_id: recipient_id,
    lastEditAt: new Date(),
  };
  const channelId = Channels.insert(channel);
  return { _id: channelId };
};

export const updateChannel = (attributes) => {
  const { channelId, subject, category } = attributes;
  const updateAttributes = {
    subject: subject,
    category: category,
    lastEditAt: new Date(),
  };
  return Channels.update({_id: channelId}, {$set: updateAttributes});
};

export const findChannelsByOwner = (userId) => {
  return Channels.find({owner_id: userId}, {sort: {lastEditAt: -1}});
};

export const findChannelsByReceipient = (userId) => {
  return Channels.find({recipient_id: userId}, {sort: {lastEditAt: -1}});
};

export const findChannelsByReceipientAndSubject = (userId, subject) => {
  return Channels.findOne({recipient_id: userId, subject: subject}, {sort: {lastEditAt: -1}});
};

export const removeChannel = (channelId) => {
  findMessagesByChannel(channelId).forEach((message) => {
    removeMessage(message._id);
  });
  Channels.remove(channelId);
};

// Messages
export const insertMessage = (attributes) => {
  const { channel_id, sender_id, recipient_id, requireReply, isReplied, expireAt, content } = attributes;
  const message = {
    channel_id: channel_id,
    sender_id: sender_id,
    recipient_id: recipient_id,
    requireReply: requireReply,
    isReplied: isReplied,
    expireAt: expireAt,
    content: content,
    createdAt: new Date(),
  };
  const messageId = Messages.insert(message);
  return { _id: messageId };
};

export const updateMessage = (attributes) => {
  const { messageId, expireAt } = attributes;
  const updateAttributes = {
    expireAt: expireAt,
  };
  return Messages.update({_id: messageId}, {$set: updateAttributes});
};

export const findMessagesByChannel = (channelId) => {
  return Messages.find({channel_id: channelId}, {sort: {createdAt: -1}}).fetch();
};

export const removeMessage = (messageId) => {
  Messages.remove(messageId);
};
