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
  this.isDrawerVisible = ko.observable(false);
  /**
   * Status of the map UI component
   * @type {KnockoutObservable<T>}
   */
  this.isMapVisible = ko.observable(true);
  /**
   * Status of the filterbox UI component
   * @type {KnockoutObservable<T>}
   */
  this.isFilterboxVisible = ko.observable(true);
  /**
   * Status of the list UI component
   * @type {KnockoutObservable<T>}
   */
  this.isListVisible = ko.observable(true);
  /**
   * Current venue
   * @type {KnockoutObservable<T>}
   */
  this.currentVenue = ko.observable();
  /**
   * Is triggered when a venue in the list is clicked
   * @param {Object} venue The clicked venue
   */
  this.markerClick = venue => {
    this.toggleListDrawerAndMap();
    this.setCurrentVenue(venue);
  };
  this.venueClick = venue => {
    map.panTo(venue.location);
    map.setZoom(17);
    venue.marker.setAnimation(google.maps.Animation.BOUNCE);
    // stop bounce animation after 4 seconds
    setTimeout(function() {
      venue.marker.setAnimation(null);
    }, 4000);
  };
  /**
   * Toggle venues list, venue details drawer and map
   * to visble/non-visible.
   * Venue details should be the only thing that is shown
   */
  this.toggleListDrawerAndMap = () => {
    this.isDrawerVisible(!this.isDrawerVisible());
    this.isListVisible(!this.isListVisible());
    this.isMapVisible(!this.isMapVisible());
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
   * Unset markers on a given markers array
   * @param {Array} markers Google Maps Markers Array
   */
  this.unsetMarkers = markers => {
    for (var marker of markers) {
      marker.setMap(null);
    }
  };
  /**
   * Filtering function
   * @type {KnockoutComputed<T>}
   */
  this.venuesToShow = ko.pureComputed(function() {
    var filter = this.filter();
    if (filter === '') {
      for (var marker of this.markers) {
        marker.setMap(map);
      }
      return this.venues();
    }
    /**
     * Filter through array and return only matching results
     * @see http://knockoutjs.com/examples/animatedTransitions.html
     */
    var filteredVenues = ko.utils.arrayFilter(this.venues(), function(venue) {
      return venue.category.tag === filter ||
        venue.category.name === filter ||
        venue.name === filter;
    });
    // unset all markers
    this.unsetMarkers(this.markers);
    // and reset those from the search results
    for (var venue of filteredVenues) {
      venue.marker.setMap(map);
    }
    // finally return the filtered venue results
    return filteredVenues;
  }, this);
  // Populate arrays and initialize listeners
  // attach markers to venues
  // when response is ready
  dataModel.foursquare('38.464525,23.60507').then(data => {
    // Populate observable array
    this.venues(data);
    // For every venue
    for (let venue of this.venues()) {
      // Create new marker
      let marker = new google.maps.Marker({
        position: venue.location,
        title: venue.name,
        animation: google.maps.Animation.DROP,
        icon: venue.icon
      });
      // attach marker to its venue
      venue.marker = marker;
      // save the marker to markers array
      this.markers.push(marker);
      // Add listener to open correct venue details
      // when the marker is clicked
      marker.addListener('click', () => {
        this.markerClick(venue);
      });
      // and finally set the marker
      marker.setMap(map);
    }
  }, function(error) {
    console.error('Failed:', error);
    document.body.classList.add(
      'error',
      'mdl-color--grey-300',
      'mdl-color-text--grey-700'
    );
    document.body.innerHTML = '<div class="error__text">' +
      '<h1>Oops, something went wrong</h1>' +
      '<h2>' +
      error +
      '</h2>' +
      '</div>';
  });
};

ko.applyBindings(new ViewModel());
