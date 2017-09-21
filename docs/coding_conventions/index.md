# OpenLMIS-UI Coding Conventions
This document describes the desired formatting to be used withing the OpenLMIS-UI repositories, many of the conventions are adapted from [John Papa's Angular V1 styleguide,](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md) [SMACSS by Jonathan Snook,](https://smacss.com/) and [Jens Meiert's maintainability guide.](https://meiert.com/en/blog/maintainability-guide/)

## General
The following conventions should be applied to all sections of UI development:
* All intentation should be 4 spaces
* Legacy code should be refactored to meet coding conventions
* No thrid party libraries should be included in a OpenLMIS-UI repository

## File Structure
All file types should be organized together within the `src` directory according to functionality, not file type — the goal is to keep related files together.

Use the following conventions:
* File names are lowercase and dash-seperated
* Files in a directory should be as flat as possible (avoid sub-directories)
* If there are more than 12 files in a directory, try to divide files into subdirectories based on functional area

### Naming Convention
In general we follow the [John-Papa naming conventions,](https://github.com/johnpapa/angular-styleguide/tree/master/a1#naming) later sections go into specifics about how to name a specific file type, while this section focuses on general naming and file structure.

Generally, all file names should use the following format `specific-name.file-type.ext` where:
* `specific-name` is a dash-separated name for specific file-type
* `file-type` is the type of object that is being added (ie 'controller', 'service', or 'layout')
* `ext` is the extention of the file (ie '.js', '.scss')

Folder structure should aim to follow the [LIFT principal](https://github.com/johnpapa/angular-styleguide/tree/master/a1#application-structure-lift-principle) as closely as possible, with a couple extra notes:
* There should only be one *.module.js file per directory hiearchy
* Only consider creating a sub-directory if file names are long and repatitive, such that a sub-directory would improve meaning
*Each file type section below has specifics on their naming conventions*


## Javascript Guidelines
Almost everything in the OpenLMIS-UI is Javascript. These are general guidelines for how to write and test your code.

General conventions:
* All code should be within an [immedately invoked scope](https://github.com/johnpapa/angular-styleguide/tree/master/a1#iife)
* *ONLY ONE OBJECT PER FILE*
* Variable and function names should be written in camelCase
* All Angular object names should be written in CamelCase

### Documentation
To document the OpenLMIS-UI, we are using [ngDocs](https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation) built with [grunt-ngdocs.](https://www.npmjs.com/package/grunt-ngdocs) See individual object descriptions for specifics and examples of how to document that object type.

#### General rules
* any object's exposed methods or variables must be documented with ngDoc
* @ngdoc annotation specifies the type of thing being documented
* as 'Type' in documentation we should use:
 * Promise
 * Number
 * String
 * Boolean
 * Object
 * Event
 * Array
 * Scope
 * in some cases is allowed to use other types i.e. class names like Requisition
* all description blocks should be sentence based, all of sentences should start with uppercase letter and end with '.'
* before and after description block (if there is more content) there should be an empty line
* all docs should be right above the declaration of method/property/component
* when writing param/return section please keep all parts(type, parameter name, description) start at the same column as it is shown in method/property examples below
* please keep the order of all parameters as it is in examples below

#### General Object Documentation
Regardless of the actual component's type, it should have '@ngdoc service' annotation at the start, unless the specific object documentation says otherwise. There are three annotations that must be present:
* ngdoc definition
* component name
* and description
```
/**
 * @ngdoc service
 * @name module-name.componentName
 *
 * @description
 * Component description.
 */
```

#### Methods
Methods for all components should have parameters like in the following example:
```
/**
 * @ngdoc method
 * @methodOf module-name.componentName
 * @name methodName
 *
 * @description
 * Method description.
 *
 * @param  {Type} paramsName1 param1 description
 * @param  {Type} paramsName2 (optional) param2 description
 * @return {Type}             returned object description
 */
```

Parameters should only be present when method takes any. The same rule applies to return annotation.
If the parameter is not required by method, it should have "(optional)" prefix in the description.

#### Properties
Properties should be documented in components when they are exposed, i.e. controllers properties declared in 'vm'.
Properties should have parameters like in the following example:
```
/**
 * @ngdoc property
 * @propertyOf module-name.componentName
 * @name propertyName
 * @type {Type}
 *
 * @description
 * Property description.
 */
```

## Unit Testing Guidelines
A unit tests has 3 goals that it should accomplish to test a javascript object:
* Checks success, error, and edge cases
* Tests as few objects as possible
* Demonstrates how an object should be used

With those 3 goals in mind, its important to realize that the variety of AngularJS object types means that the same approact won't work for each and every object. Since the OpenLMIS-UI coding conventions layout patterns for different types of AngularJS objects, it's also possible to illustrate how to unit test objects that follow those conventions.

Check out [AngularJS's unit testing guide](https://docs.angularjs.org/guide/unit-testing), its well written and many of out tests follow their styles.

Here are some general rules to keep in mind while writing any unit tests:
* Keep beforeEach statements short and to the point, which will help other's read your statements
* Understand how to use [Spies in Jasmine,](https://jasmine.github.io/1.3/introduction.html#section-Spies) they can help isolate objects and provide test cases