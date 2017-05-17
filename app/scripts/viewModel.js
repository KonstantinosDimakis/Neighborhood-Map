var ViewModel = function() {
  'use strict';
  this.filter = ko.observable('');
};

ko.applyBindings(new ViewModel());
