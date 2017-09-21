# Controller
Controllers are all about connecting data and logic from Factories and Services to HTML Views. An ideal controller won't do much more than this, and will be as 'thin' as possible.

Controllers are typically specific in context, so as a rule controllers should never be reused. A controller can be linked to a HTML form, which might be reused in multiple contexts — but that controller most likely wouldn't be applicable in other places.

It is also worth noting that [John Papa insists that controllers don't directly manipulate properties](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#controllers) in $scope, but rather the [ControllerAs](https://docs.angularjs.org/api/ng/directive/ngController) syntax should be used which injects the controller into a HTML block's context. The main rationale is that it makes the $scope variables less cluttered, and makes the controller more testable as an object.

## Conventions
* Should be only object changing application $state
* Is used in a single context
* Don't use the $scope variable EVER
* Use ControllerAs syntax
* Don't $watch variables, use on-change or refactor to use a directive to watch values

## Unit Testing
* Set all items that would be required from a route when the Controller is instantiated
* Mock any services used by the controller

## Documentation
The only difference between controllers and other components is the
'.controller:' part in the @name annotation. It makes controller documentation
appear in controllers section. Be sure to document the methods and properties
that the controller exposes.

```
/**
 * @ngdoc service
 * @name module-name.controller:controllerName
 *
 * @description
 * Controller description.
 *
 */
```
