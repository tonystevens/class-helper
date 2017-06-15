import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';


const backslashPlaceholder = '@backslash@';

const retrieveProblemsets = (method, params) => new Promise((resolve, reject) => {
	Meteor.call(method, params, (error, result) => {
			if(error) reject(error);
      resolve(result);
      console.log(result);
		}
	);
});

Template.problemAutogen.onCreated(function onTemplateCreated() {
  this.singleCourse = new ReactiveVar({_id: FlowRouter.getParam('_id'), name: FlowRouter.getQueryParam('name')});
  this.problemTemplate = new ReactiveVar(FlowRouter.getQueryParam('problemTemplate'));
	this.problemsets = new ReactiveVar(undefined);
	this.problemsetsRetrieveDep = new Deps.Dependency();
	retrieveProblemsets('findRandomProblemsets', this.problemTemplate.get().configs).then((val) => {
		this.problemsets.set(val);
		this.problemsetsRetrieveDep.changed();
	});
	MeteorMathJax.defaultConfig = {
		skipStartupTypeset: false,
		showProcessingMessages: false,
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
  	const problemsets = Template.instance().problemsets.get();
  	let newsets = undefined;
  	if (problemsets) {
  		let idx = 1;
		  newsets = problemsets.map((set) => {
				let content = set.content.replace(/@backslash@/g, "\\", '\\');
				return {
					index: idx++,
					content: content,
				}
			});
	  }
	  return newsets;
	}
});