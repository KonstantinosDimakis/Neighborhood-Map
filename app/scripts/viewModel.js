var ViewModel = function() {
  'use strict';
  this.filter = ko.observable('');
  this.venues = ko.observableArray([]);
  dataModel.foursquare.then(data => {
    this.venues(data);
  }, function(error) {
    console.error('Failed:', error);
    document.body.innerHTML = '<h1>Oops, something went wrong</h1>';
  });
};

ko.applyBindings(new ViewModel());
