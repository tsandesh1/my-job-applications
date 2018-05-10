$(document).ready(function () {
  $('#results').show();
  $('#job_inputs').hide();
  $('#add_new').click(function () {
    $('#job_inputs').show();
    $('#results').hide();
  })

  $('#home').click(function () {
    $('#job_inputs').hide();
    $('#results').show();
  })
});
