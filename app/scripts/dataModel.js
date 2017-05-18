var dataModel = {};
(function() {
  'use strict';
  dataModel.foursquare = new Promise(function(resolve, reject) {
    const FOURSQUARE_CLIENT_ID = 'DZLWV3OVTRDIJ4A3HYBWIHZLHNPPWSPULWU0MOIUPV4UGD0B';
    const FOURSQUARE_CLIENT_SECRET = 'MFMOIF4BD4H0K3ULA41LF2WD5SK0KRJAQLTUZT4VV3XVGC0O';
    // here I can replace this static address for navigator.geolocation
    const LL = '38.464576,23.600043';
    const V = '20170425';
    const VENUE_PHOTOS = '1';
    const BASE_URL = 'https://api.foursquare.com/v2/venues/explore?';

    var url = BASE_URL +
      'client_id=' + FOURSQUARE_CLIENT_ID +
      '&client_secret=' + FOURSQUARE_CLIENT_SECRET +
      '&ll=' + LL +
      '&v=' + V +
      '&venuePhotos=' + VENUE_PHOTOS;

    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';

    request.onload = function() {
      if (request.status === 200) {
        // If successful, resolve the promise by passing back the venues array
        var venues = [];
        for (let item of request.response.response.groups[0].items) {
          let venue = {
            name: item.venue.name,
            foursquare: 'https://foursquare.com/v/' + item.venue.id + '?ref=' + FOURSQUARE_CLIENT_ID,
            location: {lat: item.venue.location.lat, lng: item.venue.location.lng},
            distance: item.venue.location.distance,
            address: item.venue.location.address,
            rating: {
              number: Math.round(item.venue.rating) / 2,
              stars: [
                'images/star_border_yellow_18px.svg',
                'images/star_border_yellow_18px.svg',
                'images/star_border_yellow_18px.svg',
                'images/star_border_yellow_18px.svg',
                'images/star_border_yellow_18px.svg'
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
            venue.rating.stars[i] = 'images/star_yellow_18px.svg';
          }
          if (venue.rating.number % 1 !== 0) {
            venue.rating.stars[i] = 'images/star_half_yellow_18px.svg';
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
        resolve(venues);
      } else {
        // If it fails, reject the promise with an error message
        reject(Error('There was a problem:', '(', request.status, ')', request.statusText));
      }
    };
    // Also deal with the case when the entire request fails to begin with
    // This is probably a network error, so reject the promise with an appropriate message
    request.onerror = function() {
      reject(Error('Network Error'));
    };
    // Execute request
    request.send();
  });
})();
