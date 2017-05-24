// If I am to create a Venue class I think it should be here

var ViewModel = function() {
  'use strict';
  /**
   * Holds the value of filterbox
   * @type {KnockoutObservable<T>}
   */
  this.filter = ko.observable('');
  /**
   * Status of the drawer UI component
   * @type {KnockoutObservable<T>}
   */
  this.drawerActive = ko.observable(false);
  /**
   * Current venue
   * @type {KnockoutObservable<T>}
   */
  this.currentVenue = ko.observable();
  /**
   * Status of the list UI component
   * @type {KnockoutObservable<T>}
   */
  this.listActive = ko.observable(true);
  /**
   * Is triggered when a venue in the list is clicked
   * @param {Object} clickedVenue The clicked venue
   */
  this.venueClick = clickedVenue => {
    this.toggleListAndDrawer();
    this.setCurrentVenue(clickedVenue);
  };
  /**
   * Toggle venues list and venue details drawer
   * to active/non-active.
   * Only 1 should be shown at a time
   */
  this.toggleListAndDrawer = () => {
    this.drawerActive(!this.drawerActive());
    this.listActive(!this.listActive());
  };
  /**
   * Set currentVenue to venue
   * @param {Object} venue Venue object
   * @see http://knockoutjs.com/documentation/click-binding.html
   */
  this.setCurrentVenue = venue => {
    'use strict';
    this.currentVenue(venue);
  };
  /**
   * Initialize the array
   * @type {KnockoutObservableArray<T>}
   */
  this.venues = ko.observableArray([]);
  /**
   * Contains all venue markers
   * @type {Array} Markers
   */
  this.markers = [];
  /**
   * Filtering function
   * @type {KnockoutComputed<T>}
   */
  this.venuesToShow = ko.pureComputed(function() {
    var filter = this.filter();
    if (filter === '') {
      return this.venues();
    }
    /**
     * Filter through array and return only matching results
     * @see http://knockoutjs.com/examples/animatedTransitions.html
     */
    return ko.utils.arrayFilter(this.venues(), function(venue) {
      // TODO: Make filtering UX MUCH better
      return venue.category.tag === filter ||
        venue.category.name === filter ||
        venue.name === filter;
    });
  }, this);
  // Make the API request
  dataModel.foursquare.then(data => {
    // Populate observable array
    this.venues(data);
    // Populate markers array
    data.forEach(venue => {
      this.markers.push(new google.maps.Marker({
        position: venue.location,
        title: venue.name,
        animation: google.maps.Animation.DROP,
        icon: venue.icon
      }));
    });
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
