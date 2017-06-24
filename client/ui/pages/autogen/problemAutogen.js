import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

const retrieveProblemsets = (method, params) => new Promise((resolve, reject) => {
	Meteor.call(method, params, (error, result) => {
			if(error) reject(error);
      resolve(result);
		}
	);
});

Template.problemAutogen.onCreated(function onTemplateCreated() {
  this.singleCourse = new ReactiveVar({_id: FlowRouter.getParam('_id'), name: FlowRouter.getQueryParam('name')});
  this.problemTemplate = new ReactiveVar(FlowRouter.getQueryParam('problemTemplate'));
	this.problemsets = new ReactiveVar(undefined);
	this.problemsetsToDisplay = new ReactiveVar(undefined);
	this.problemsetsRetrieveDep = new Deps.Dependency();
	retrieveProblemsets('findRandomProblemsets', this.problemTemplate.get().configs).then((val) => {
		this.problemsets.set(val);
		this.problemsetsRetrieveDep.changed();
	});
  MeteorMathJax.sourceUrl = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
	MeteorMathJax.defaultConfig = {
		skipStartupTypeset: false,
		showProcessingMessages: true,
		tex2jax: {
			inlineMath: [['$','$'],['\\(','\\)']]
		}
	};
});

Template.problemAutogen.onRendered(function onTemplateRendered() {
});

Template.problemAutogen.helpers({
	course: () => Template.instance().singleCourse.get(),
	problems: () => {
		Template.instance().problemsetsRetrieveDep.depend();
    let results = [];
    if (Template.instance().problemsets) {
      const problemsets = Template.instance().problemsets.get();
      if (problemsets) {
        let idx = 1;
        results = problemsets.map((set) => {
          return {
            index: idx++,
            content: set.content.replace(/@backslash@/g, "\\", '\\').toString(),
          }
        });
      }
    }
    return results;
	},
});

