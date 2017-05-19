var ViewModel = function() {
  'use strict';
  this.filter = ko.observable('');
  this.drawerActive = ko.observable(false);
  this.listActive = ko.observable(true);
  this.toggleListAndDrawer = () => {
    this.drawerActive(!this.drawerActive());
    this.listActive(!this.listActive());
  };
  this.venues = ko.observableArray([]);
  dataModel.foursquare.then(data => {
    this.venues(data);
  }, function(error) {
    console.error('Failed:', error);
    document.body.classList = 'error mdl-color--grey-400 mdl-color-text--grey-700';
    document.body.innerHTML = '<h1 class="error__text">Oops, something went wrong</h1>';
  });
};

ko.applyBindings(new ViewModel());
