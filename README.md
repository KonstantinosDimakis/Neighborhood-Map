# Neighborhood-Map

Neighborhood-Map ([Web Starter Kit](https://github.com/google/web-starter-kit) based project) was developed for showcasing all the skills I've been taught in part 5 of [Udacity](https://www.udacity.com/)'s [Front End Web Devloper Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001) such as using a Front End Framework, [Ajax Requests](https://developer.mozilla.org/en-US/docs/AJAX) and [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/).

## Overview

This web app has a map featuring 50 popular places (Burger Joints, Seafood Restaurants, Bars, Pedestrian Streets, Beaches etc) in my neighborhood Chalkis, Greece and is powered by [Foursquare](https://foursquare.com/) and [Google Maps](https://www.google.gr/maps/). You can see the list of features in detail below. 

## Features

| Feature                                | Summary                                                                                                                                                                                                                                                     |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Mobile First | This app is built with mobile web in mind and is powered by [Material Design Lite](http://getmdl.io).
| MVVM Pattern (KnockoutJS) | This app uses [KnockoutJS](http://knockoutjs.com/) ([Model View ViewModel Pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)), which offers simple UI updating and event handling.
| Google Maps | The map being featured is [Google Maps](https://www.google.gr/maps/). Using [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/), this app features custom icon markers & marker animations. |
| 50 Popular Places in the Neighborhood | Powered by [Foursquare](https://foursquare.com/) this app features 50 popular places and details about them in my neighborhood (Chalcis, Greece) |
| Filtering | Filtering the locations is done via a simple KnockoutJS utility function, thus the filtering powers of the app at this moment are limited to exact matches. |
| List View | In addition to the markers displayed on the Google Maps the app offers a complementary list view that mirrors the places displayed on Google Maps. Clicking a list item pans the map to the corresponding marker, animating it. |
| Place details | Further details on places are shown upon clicking the corresponding marker. Details are presented in a minimal UI. Details include Place _Photo_, _Title_, _Rating_, _Category_, _Address_, _Status_ (_open_/_close_), _Price_ (_eg_ _Expensive_), _Phone_, _Website_. This interface also offers actions on some of its information (eg Clicking on the address prompts Google Maps to navigate you to that location). |

## Use the app

* Visit:

or

* Get the code from this repository and build it. Since this project is based on Web Starter kit the same docs for installing and serving the website apply. Be sure to look over the [installation docs](docs/install.md) to verify your environment is prepared to run WSK. Once you have verified that your system can run WSK, check out the [commands](docs/commands.md) available to get started.

The gist of it is:
1. Get [npm](https://www.npmjs.com/).
2. Get [gulp](http://gulpjs.com/).
3. `cd` into the project file.
4. Install the project depedencies via `npm install`.
5. Use gulp to serve the project via `gulp serve:dist`.

## Links

* [Web Starter Kit](https://developers.google.com/web/tools/starter-kit/) - Web Starter Kit is an opinionated boilerplate for web development.
* [KnockoutJS](http://knockoutjs.com/) - Simplify dynamic JavaScript UIs with the Model-View-View Model (MVVM)
* [Material Design Lite](https://getmdl.io/) - Material Design Lite lets you add a Material Design look and feel to your websites.
* [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/) - Customize maps with your own content and imagery.
* [Foursquare Developers](https://developer.foursquare.com/) - The Foursquare API gives you access to our world-class places database and the ability to interact with Foursquare users and merchants.


## License

Apache 2.0  
Copyright 2015 Google Inc
Copyright 2017 Konstantinos Dimakis
