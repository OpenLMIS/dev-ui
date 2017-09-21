# Factory
Factories should be the most used Angualr object type in any application. [John Papa insists that factories serve a single purpose,](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#factories) and should be extended by variabled they are called with.

This means that factories should generally return a function that will return an object or set of objects that can be manipulated. It is common for a factory to include methods for interacting with a server, but this isn't nessicarry.

_Should be used with UI-Router resolves, and get additional arguments_

## Naming Convention
_**specificName**Factory_

Factories should always be named lowercase camelCase. To avoid confussion between created objects and factories, all factories should have the word'Factory' appended to the end (this disagrees with John-Papa style).  

## Example

```
angular.module('openlmis-sample')
    .factory('sampleFactory', sample);

sample.$inject = [];
function sample(){
	var savedContext;

	return {
		method: method,
		otherMethod: otherMethod
	}
}
```

*Unit Testing Conventions*
Test a factory much like you would test a service, except be sure to:
* Declare a new factory at the start of every test
* Exercise the producted object, not just the callback function