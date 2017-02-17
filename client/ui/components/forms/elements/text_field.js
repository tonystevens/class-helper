Template.textField.helpers({
  skipLabel: function () {
    return this.skipLabel || false;
  },
  disabled: function () {
    const instance = Template.instance();
    if (instance.loading && instance.loading.get())
      return "disabled";
  },
});
