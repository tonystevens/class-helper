import { Meteor } from 'meteor/meteor';

import { ProblemSets } from '../lib/problemsets.js';

Meteor.startup(() => {
  Meteor.methods({
    'findRandomProblemsets': (configs) => {
      let result = [];
      configs.forEach((config) => {
        const query = [];
        query.push({"knowledgepoint": { "$in": [
	        {"$oid": config.knowledgepoint._str}
        ]}});
        if(config.difficulty !== '99') query.push({ "difficulty": config.difficulty });
	      if(config.type !== '99') query.push({ "problemtype": config.type });

	      const tempResult = ProblemSets.aggregate(
		      [
			      {
				      $match: {
					      $and: query
				      }
			      },
			      {
				      $sample: { size: parseInt(config.number) }
			      }
		      ]
	      );
	      console.log(query);
	      console.log(config.knowledgepoint._str);
	      console.log('====================');
	      console.log(tempResult);
	      result = result.concat(tempResult);
      });

      return result;
    },
  });
});