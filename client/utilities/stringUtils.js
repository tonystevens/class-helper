Template.registerHelper('truncate', (string, length) => {
  const cleanString = _(string).stripTags();
  return _(cleanString).truncate(length);
});
