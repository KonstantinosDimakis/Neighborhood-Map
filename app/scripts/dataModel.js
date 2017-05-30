var dataModel = {};
/**
 * Make a Foursquare API request on a given location.
 * @param {String} location A string in the form of '38.464525,23.60507'.
 * @return {Promise} Return a promise where on resolve it will return an
 * array with all the venues and on reject will return a string with the error
 */
dataModel.foursquare = function(location) {
  return new Promise(function(resolve, reject) {
    const FOURSQUARE_CLIENT_ID =
      'DZLWV3OVTRDIJ4A3HYBWIHZLHNPPWSPULWU0MOIUPV4UGD0B';
    const FOURSQUARE_CLIENT_SECRET =
      'MFMOIF4BD4H0K3ULA41LF2WD5SK0KRJAQLTUZT4VV3XVGC0O';
    const LL = location;
    const V = '20170425';
    const VENUE_PHOTOS = '1';
    const BASE_URL = 'https://api.foursquare.com/v2/venues/explore?';
    const LIMIT = 50;

    var url = BASE_URL +
      'client_id=' + FOURSQUARE_CLIENT_ID +
      '&client_secret=' + FOURSQUARE_CLIENT_SECRET +
      '&ll=' + LL +
      '&v=' + V +
      '&venuePhotos=' + VENUE_PHOTOS +
      '&limit=' + LIMIT;

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
            foursquare: 'https://foursquare.com/v/' +
              item.venue.id +
              '?ref=' +
              FOURSQUARE_CLIENT_ID,
            location: {
              lat: item.venue.location.lat,
              lng: item.venue.location.lng
            },
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
            icon: item.venue.categories[0].icon.prefix +
              'bg_32' +
              item.venue.categories[0].icon.suffix,
            category: {
              name: item.venue.categories[0].name,
              tag: item.venue.categories[0].shortName
            },
            photo: item.venue.featuredPhotos.items[0].prefix +
              'original' +
              item.venue.featuredPhotos.items[0].suffix
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
          venue.phone = item.venue.contact.phone ?
            item.venue.contact.phone : null;
          venue.facebook = item.venue.contact.facebook ? 'https://www.facebook.com/' + item.venue.contact.facebook : null;
          venue.price = item.venue.price ? item.venue.price.message : null;
          // Even if Foursquare has hours on a venue,
          // when a venue is closed sometimes the status
          // message is omitted and only the flag
          // isOpen: false exists. That's the logic
          // the following statement represents
          venue.status = item.venue.hours ?
            item.venue.hours.status || 'Closed' : null;
          venue.url = item.venue.url ? item.venue.url : null;
          venues.push(venue);
        }
        resolve(venues);
      } else {
        // If it fails, reject the promise with an error message
        let status = request.status;
        let statusText = request.statusText;
        reject(Error('There was a problem:', '(', status, ')', statusText));
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
};
