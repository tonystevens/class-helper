import { Template } from 'meteor/templating';

import { insertCourse } from '../../../../lib/methods';

import './course-modal.html';

Template.courseModal.events({
  'submit form': function(e) {
    e.preventDefault();

    const course = createCourse.call(e.target);

    insertCourse(course);

    swal("Good job!", "You added a new course!", "success");
    $('#new_course_modal').removeClass('active');
  }
});

function createCourse() {
  const courseName = $(this).find('[name=new_course_name]').val();
  const courseDescription = $(this).find('[name=new_course_description]').val();
  return { courseName, courseDescription };
}
