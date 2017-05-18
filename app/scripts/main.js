/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
    window.initMap = function() {};
  }

  // Retrieve API data
  // https://developer.foursquare.com/docs/venues/explore
  // https://api.foursquare.com/v2/venues/explore?&venuePhotos=1&client_id=DZLWV3OVTRDIJ4A3HYBWIHZLHNPPWSPULWU0MOIUPV4UGD0B&client_secret=MFMOIF4BD4H0K3ULA41LF2WD5SK0KRJAQLTUZT4VV3XVGC0O&ll=38.464576%2C23.600043&v=20170425
  const FOURSQUARE_CLIENT_ID = 'DZLWV3OVTRDIJ4A3HYBWIHZLHNPPWSPULWU0MOIUPV4UGD0B';
  const FOURSQUARE_CLIENT_SECRET = 'MFMOIF4BD4H0K3ULA41LF2WD5SK0KRJAQLTUZT4VV3XVGC0O';
  var venues = [];
  $.getJSON('https://api.foursquare.com/v2/venues/explore?', {
    client_id: FOURSQUARE_CLIENT_ID,
    client_secret: FOURSQUARE_CLIENT_SECRET,
    ll: '38.464576,23.600043',
    v: '20170425',
    venuePhotos: '1'
  }, function(data) {
    for (let item of data.response.groups[0].items) {
      let venue = {
        name: item.venue.name,
        foursquare: 'https://foursquare.com/v/' + item.venue.id + '?ref=' + FOURSQUARE_CLIENT_ID,
        location: {lat: item.venue.location.lat, lng: item.venue.location.lng},
        distance: item.venue.location.distance,
        address: item.venue.location.address,
        rating: {
          number: Math.round(item.venue.rating) / 2,
          stars: [
            'images/star_border_black_18px.svg',
            'images/star_border_black_18px.svg',
            'images/star_border_black_18px.svg',
            'images/star_border_black_18px.svg',
            'images/star_border_black_18px.svg'
          ]
        },
        icon: item.venue.categories[0].icon.prefix + '64' + item.venue.categories[0].icon.suffix,
        category: {
          name: item.venue.categories[0].name,
          tag: item.venue.categories[0].shortName
        },
        photo: item.venue.featuredPhotos.items[0].prefix + 'original' + item.venue.featuredPhotos.items[0].suffix,
      };
      // fix rating.stars
      var i;
      for (i = 0; i < Math.floor(venue.rating.number); i++) {
        venue.rating.stars[i] = 'images/star_black_18px.svg';
      }
      if (venue.rating.number % 1 !== 0) {
        venue.rating.stars[i] = 'images/star_half_black_18px.svg';
      }
      // filter through non-standard information
      if (item.venue.contact.phone) {
        venue.phone = item.venue.contact.phone;
      }
      if (item.venue.contact.facebook) {
        venue.facebook = 'https://www.facebook.com/' + item.venue.contact.facebook;
      }
      if (item.venue.price) {
        venue.price = item.venue.price.tier;
      }
      if (item.venue.hours) {
        venue.isOpen = item.venue.hours.isOpen;
      }
      if (item.venue.url) {
        venue.url = item.venue.url;
      }
      venues.push(venue);
    }
    console.log(venues);
  }).fail(function() {
    // TODO: Add a proper fail message
  });

  // Initialize markers array from data
  window.markers = ko.observableArray([]);
  /**
   * Populates a given google Map with given markers array
   * @param {Array} markers Markers Array
   * @param {google.maps.Map} map Google Map
   */
  window.populateMarkersOnMap = function(markers, map) {
    for (var marker of markers) {
      marker.setMap(map);
    }
  };
  window.initMap = function() {
    window.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7413549, lng: -73.99802439999996},
      zoom: 13,
      // Style by: Sam Herbert, on: https://snazzymaps.com/style/44/mapbox
      styles: [
        {
          featureType: 'water',
          stylers: [
            {
              saturation: 43
            },
            {
              lightness: -11
            },
            {
              hue: '#0088ff'
            }
          ]
        },
        {
          featureType: 'road',
          elementType: 'geometry.fill',
          stylers: [
            {
              hue: '#ff0000'
            },
            {
              saturation: -100
            },
            {
              lightness: 99
            }
          ]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#808080'
            },
            {
              lightness: 54
            }
          ]
        },
        {
          featureType: 'landscape.man_made',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#ece2d9'
            }
          ]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#ccdca1'
            }
          ]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#767676'
            }
          ]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.stroke',
          stylers: [
            {
              color: '#ffffff'
            }
          ]
        },
        {
          featureType: 'poi',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'landscape.natural',
          elementType: 'geometry.fill',
          stylers: [
            {
              visibility: 'on'
            },
            {
              color: '#b8cb93'
            }
          ]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'poi.sports_complex',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'poi.medical',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'poi.business',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [{visibility: 'off'}]
        }
      ],
      /**
       * Allows the user to adjust the map to road, satellite, terrain etc
       */
      mapTypeControl: false
    });
    // TODO: Remove this temporary solution to the resize problem
    setTimeout(function() {
      google.maps.event.trigger(map, 'resize');
    }, 1500);
  };
})();
