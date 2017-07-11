# OpenLMIS-UI Application Structure
The OpenLMIS-UI is an Angular V1 application that communicates with OpenLMIS Services to create a human-centered user-interface to the OpenLMIS application. This UI application is meant to be extendable, and provide a framework for developers to create a consistent experience. 

This UI aims to support accessiblity, consistency, and i18n compliance.

This is a high-level overview of how the OpenLMIS-UI functions, for more details please see:
- UI build process documentation
- UI extention guide
- UI coding conventions

The OpenLMIS-UI is an AngularJS browser application that is built from multiple sources into a single app. The OpenLMIS-UI works with the OpenLMIS Services using RESTful HTTP requests.

**Core technologies:**
* Javascript and [AngularJS v1.6](https://angularjs.org/)
* [Docker](https://www.docker.com/) and NodeJS for compiling a single page application from multiple sources
* [Sass variables and mixins](http://sass-lang.com/) for easy style extention
* [UI-Router](https://github.com/angular-ui/ui-router) for page definition

## Page Load
The entire OpenLMIS-UI is a single page application that is loaded in a single HTML page. The page loads a single CSS and a single Javascript file that are generated from the build process. A loading icon is shown while the HTML page waits for javascript file to load and run. 

When the HTML page is loaded, an Angular applicaiton called 'openlmis' is started, which requires all other Javascript modules that make up the OpenLMIS-UI application. **No module should ever require 'openlmis' or add a module directly to it.** The 'openlmis' AngularJS module is dynamically built during the build process.

## Page Views
The OpenLMIS-UI is state driven, meaning the browser's URL determines what is displayed on the screen (with some exceptions). Once the application starts, the browser's current URL is parsed by [UI-Router](ui-router.github.io); this populates the application view and retrieves data from the OpenLMIS Services.

Not all page views are directly defined as a page route. Some modules will provide functionality that intercepts page views or data requests to the OpenLMIS services, and provide custom logic. Examples of this are authentication and offline modules.

## Authentication
Authentication with the OpenLMIS services is handled by the openlmis-auth-ui by intercepting UI-Router and $HTTP requests. The access tokens used by OpenLMIS are managed by interceptors, and are automatically appended to all requests to the OpenLMIS services. **No OpenLMIS-UI modules should need to include openlmis-auth because it's included by the OpenLMIS-UI application.**

## Offline and Low-Bandwidth
The OpenLMIS-UI supports users who are offline or have low-bandwidth connections by focusing on the browser's AppCache and localstorage technologies.
