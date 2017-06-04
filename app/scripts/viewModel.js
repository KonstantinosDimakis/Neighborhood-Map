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
    // Each bounce is about 700ms as of google maps version js?v=3.13
    const MARKER_JUMP = 700;
    setTimeout(function() {
      venue.marker.setAnimation(null);
    }, 3 * MARKER_JUMP);
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
   * Hide markers on a given markers array
   * @param {Array} markers Google Maps Markers Array
   */
  this.hideMarkers = markers => {
    for (var marker of markers) {
      marker.setVisible(false);
    }
  };
  /**
   * Error binding for displaying an error screen
   * To display an error simply set an error message
   * @type {KnockoutObservable<String>} String that contains the error message
   */
  this.error = ko.observable(null);
  /**
   * Boolean value. True on error free, false on otherwise.
   * Depends on whether this.error is set.
   * @type {KnockoutComputed<Boolean>} Self explained boolean
   */
  this.errorFree = ko.pureComputed(function() {
    return !Boolean(this.error());
  }, this);
  /**
   * Filtering function
   * @type {KnockoutComputed<T>}
   */
  this.venuesToShow = ko.pureComputed(function() {
    var filter = this.filter();
    if (filter === '') {
      for (var marker of this.markers) {
        marker.setVisible(true);
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
    // hide all markers
    this.hideMarkers(this.markers);
    // and show those from the search results
    for (var venue of filteredVenues) {
      venue.marker.setVisible(true);
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
  }, error => {
    console.error('Failed:', error);
    this.error(error);
  });
  // handle google maps on error
  // TODO: Maybe put it somewhere not in here? Maybe main.js
  window.googleMapsOnError = () => {
    const errorMessage = 'Google Maps did not load correctly';
    this.error(errorMessage);
  };
};

ko.applyBindings(new ViewModel());
