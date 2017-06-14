import { Meteor } from 'meteor/meteor';

import { ProblemSets } from '../lib/problemsets.js';

Meteor.startup(() => {
  Meteor.methods({
    'findRandomProblemsets': () => {
      return ProblemSets.aggregate(
        [
          {
            $match: {'difficulty': '0'}
          },
          {
            $sample: { size: 3 }
          }
        ]
      );
    },
  });
});