import { Template } from 'meteor/templating';

import { insertCourse } from '../../../../lib/methods';

import './new-course-modal.html';

Template.newCourseModal.events({
  'submit form': function(e) {
    e.preventDefault();

    const course = createCourse.call(e.target);

    insertCourse(course);

    swal("Good job!", "You added a new course!", "success");
  }
});

function createCourse() {
  const courseName = $(this).find('[name=new_course_name]').val();
  const courseDescription = $(this).find('[name=new_course_description]').val();
  return { courseName, courseDescription };
}
