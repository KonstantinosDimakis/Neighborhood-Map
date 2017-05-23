// If I am to create a Venue class I think it should be here

var ViewModel = function() {
  'use strict';
  this.filter = ko.observable('');
  this.drawerActive = ko.observable(false);
  this.currentVenue = ko.observable();
  this.listActive = ko.observable(true);
  this.venueClick = clickedVenue => {
    this.toggleListAndDrawer();
    this.setCurrentVenue(clickedVenue);
  };
  this.toggleListAndDrawer = () => {
    this.drawerActive(!this.drawerActive());
    this.listActive(!this.listActive());
  };
  this.setCurrentVenue = venue => {
    'use strict';
    this.currentVenue(venue);
  };
  this.venues = ko.observableArray([]);
  this.venuesToShow = ko.pureComputed(function() {
    var filter = this.filter();
    if (filter === '') {
      return this.venues();
    }
    return ko.utils.arrayFilter(this.venues(), function(venue) {
      // TODO: Make filtering UX MUCH better
      return venue.category.tag === filter ||
        venue.category.name === filter ||
        venue.name === filter;
    });
  }, this);
  // Make the API request
  dataModel.foursquare.then(data => {
    this.venues(data);
  }, function(error) {
    console.error('Failed:', error);
    document.body.classList.add(
      'error',
      'mdl-color--grey-300',
      'mdl-color-text--grey-700'
    );
    document.body.innerHTML = '<h1 class="error__text">Oops, something went wrong</h1>';
  });
};

ko.applyBindings(new ViewModel());
