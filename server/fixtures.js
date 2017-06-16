import { Meteor } from 'meteor/meteor';

import { ProblemSets } from '../lib/problemsets.js';

Meteor.startup(() => {
  Meteor.methods({
    'findRandomProblemsets': (configs) => {
      let result = [];
      configs.forEach((config) => {
	      const query = [];
	      const knowledgepointId = new MongoInternals.NpmModule.ObjectID(config.knowledgepoint._str);
	      query.push({knowledgepoint: knowledgepointId});
	      if(config.difficulty !== '99') query.push({ difficulty: config.difficulty });
	      if(config.type !== '99') query.push({ problemtype: config.type });
      	const selector = [
		      {
			      $match: {
				      $and: query
			      }
		      },
		      {
			      $sample: { size: parseInt(config.number) }
		      }
	      ];
	      const tempResult = ProblemSets.aggregate(selector);
	      result = result.concat(tempResult);
      });

      return result;
    },
  });
});