import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Courses } from './courses.js';
import { Messages } from './messages.js';
import { Channels } from './channels.js';
import { Materials } from './materials.js';
import { Files } from './files.js';

// Users
export const findUserById = (userId) => {
  return Meteor.users.findOne({_id: userId});
};

export const findStudentsNotInCourse = (course) => {
  return Meteor.users.find({ $and: [ {'profile.role':'student'}, {_id: { $nin: course.students} } ]});
};

export const findOtherUsers = () => {
  return Meteor.users.find({ $and: [ {'profile.role': { $in: ['student', 'teacher']} }, {_id: { $ne: Meteor.userId} } ]}, { sort: {'profile.lastName': 1}});
};

// Courses
export const insertCourse = (attributes) => {
  const user = Meteor.user();
  const { name, description, startAt, endAt } = attributes;
  const course = {
    name: name,
    description: description,
    userId: user._id,
    createAt: new Date(),
    startAt: startAt,
    endAt: endAt,
    students: [],
    code: Random.id(6),
	  materials: [],
  };
  const courseId = Courses.insert(course);
  return { _id: courseId };
};

export const updateCourse = (courseId, attributes) => {
  const { name, description, startAt, endAt } = attributes;
  const updateAttributes = {
    name: name,
    description: description,
    startAt: startAt,
    endAt: endAt,
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

export const addSingleStudentToCourse = (courseId, userId) => {
  return addMultipleStudentsToCourse(courseId, [userId]);
};

export const addMultipleStudentsToCourse = (courseId, userIds) => {
  return Courses.update({_id: courseId}, {$push: {students: { $each: userIds}}});
};

export const addSingleMaterialToCourse = (courseId, materialId) => {
	return addMultipleMaterialsToCourse(courseId, [materialId]);
};

export const addMultipleMaterialsToCourse = (courseId, materialIds) => {
	return Courses.update({_id: courseId}, {$push: {materials: { $each: materialIds}}});
};

export const removeStudentFromCourse = (courseId, userId) => {
  return Courses.update({_id: courseId}, {$pop: {students: userId}});
};

// Channels
export const insertChannel = (attributes) => {
  const { name, recipient_id, subject, category } = attributes;
  const channel = {
    name: name,
    subject: subject,
    category: category,
    owner_id: Meteor.user()._id,
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

export const findChannelById = (channelId) => {
  return Channels.findOne({_id: channelId});
};

export const findChannelsByOwner = (userId) => {
  return Channels.find({owner_id: userId}, {sort: {lastEditAt: -1}});
};

export const findChannelsByRecipient = (userId) => {
  return Channels.find({recipient_id: userId}, {sort: {lastEditAt: -1}});
};

export const findChannelsByRecipientAndSubject = (userId, subject) => {
  return Channels.findOne({owner_id: Meteor.userId(), recipient_id: userId, subject: subject}, {sort: {lastEditAt: -1}});
};

export const findChannelsByOwneAndSubject = (userId, subject) => {
  return Channels.findOne({owner_id: userId, recipient_id: Meteor.userId(), subject: subject}, {sort: {lastEditAt: -1}});
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
  return Messages.find({channel_id: channelId}, {sort: {createdAt: 1}}).fetch();
};

export const removeMessage = (messageId) => {
  Messages.remove(messageId);
};

// Materials
export const insertMaterial = (attributes) => {
  const { name, description, fileIds, fileTypes, isPrivate, category } = attributes;
  const material = {
    fileIds: fileIds,
    name: name,
    description: description,
    fileTypes: fileTypes,
    ownerId: Meteor.user()._id,
    createAt: new Date(),
    isPrivate: isPrivate,
    category: category,
  };
  const materialId = Materials.insert(material);
  return { _id: materialId };
};

export const findMaterialByIds = (materialIds) => {
  return Materials.find({
    ownerId: Meteor.user()._id,
    _id: { $in: materialIds},
  }, { sort: {createdAt: -1}} ).fetch();
};

// Files
export const findFilesByIds = (fileIds) => {
  return Files.find({
    userId: Meteor.user()._id,
    _id: { $in: fileIds },
  });
};
