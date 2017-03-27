import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { findChannelsByReceipientAndSubject, insertChannel } from '../../../lib/methods.js';

import './newChannelPage.html';

const recipients = new ReactiveVar(undefined);
const channelCreated = new WeakMap();

Template.newChannelPage.onRendered(() => {
  // $('#new-channel-message').prop('disabled', true);
  channelCreated.set(this, false);
});

Template.newChannelPage.helpers({
  settings: () => {
    return {
      position: "bottom",
      limit: 5,
      rules: [
        {
          collection: Meteor.users,
          field: 'profile.firstName',
          template: Template.messageRecipientPill,
          noMatchTemplate: Template.serverNoMatch,
          filter: { _id: { $ne: Meteor.userId()} },
          matchAll: true,
          selector: (match) =>{
            regex = new RegExp(match, 'i');
            return {$or: [{'profile.firstName': regex}, {'profile.lastName': regex}]}
          }
        },
      ]
    }
  },
});

Template.newChannelPage.events({
  'autocompleteselect input': (event, template, rep) => {
    recipients.set(rep);
  },
  'click #new-channel-message-send': () => {
    const subject = $('#channel-subject').val().trim();
    const recipient = recipients.get();

    if (subject !== '' && recipient !== undefined) {
      if (channelCreated.get(this)) {
        console.log('channel exist: cached');
      } else if (isChannelExist(subject, recipient._id)){
        console.log('channel exist: looked up');
      } else {
        console.log('create new channel');
        createNewChannel(subject, recipients.get());
        channelCreated.set(this, true);
        disableSubjectAndRecipientFields();
        emptyNewChannelMessageText();
      }
    }
  }
});

function isChannelExist(subject, recipientId) {
  return findChannelsByReceipientAndSubject(recipientId, subject) !== undefined;
}

function createNewChannel(subject, recipient) {
  const channelAttributes = {
    name: `${Meteor.userId()}_${recipient._id}_${subject}`,
    recipient_id: recipient._id,
    subject: subject,
    category: 'other',
  };
  insertChannel(channelAttributes);
}

function disableSubjectAndRecipientFields() {
  $('#channel-subject').prop('disabled', true);
  $('#autocomplete-input').prop('disabled', true);
}

function emptyNewChannelMessageText() {
  $('#new-channel-message-text').val('');
}