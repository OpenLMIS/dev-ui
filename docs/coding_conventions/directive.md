# Directive
Directives are pieces of HTML markup that have been extended to do a certain function. *This is the only place where it is reasonable to manipulate the DOM*.

*Make disticntion between directive and component -- components use E tag and isolate scope, directive use C and never isolate scope*

## Conventions
* Restrict directives to only elements or attributes
* Don't use an isolated scope unless you absolutely have to
* If the directive needs extenal information, use a controller — don't manipulate data in a link function

## Unit Testing
The bit secrect when unit testing a directive is to make sure to use the $compile function to return an element that is extended with jQuery. Once you have this object you will be able to interact with the directive by clicking, hovering, or triggering other DOM events.

```
describe('SampleDirective', function(){
	it('gets compiled and shows the selected item name', function($compile, $rootScope){
		var scope = $rootScope.$new();
		scope['item'] = {
			name: "Sample Title"
		};
		var element = $compile("<sample-directive selected='item'></sample-directive>")(scope);

		expect(element.text()).toBe("Sample Title");
	});
	it('responds to being clicked', function($compile, $rootScope){
		var element = $compile("<sample-directive selected='item'></sample-directive>")($rootScope.$new());

		// check before the action
		expect(element.text()).toBe("No Title");

		element.click();
		// check to see the results of the action
		// this could also be looking at a spy to see what the values are
		expect(element.text()).toBe("I was clicked");
	});
});
```

## Documentation
Directive docs should have well described '@example' section. 

Directive docs should always have '@restrict' annotation that takes as a value one of: A, E, C, M or any combination of those.
In order to make directive docs appear in directives section there needs to be '.directive:' part in @name annotation.

```
/**
 * @ngdoc directive
 * @restrict A
 * @name module-name.directive:directiveName
 *
 * @description
 * Directive description.
 *
 * @example
 * Short description of how to use it.
 * ```
 *   <div directiveName></div>
 * ```
 * Now you can show how the markup will look like after applying directive code.
 * ```
 * <div directiveName>
 *     <div>something</div>
 * </div>
 * ```
 */
```

## Extending a Directive
You can extend a directive by using AngularJS's decorator pattern. Keep in mind that a directive might be applied to multiple places or have multiple directives applied to the same element name.

```Javascript
angular.module('my-module')
    .config(extendDirective);

extendDirective.$inject = ['$provide'];
function extendDirective($provide) {
  
  // NOTE: This method has you put 'Directive' at the end of a directive name
  $provide.decorator('OpenlmisInvalidDirective', directiveDecorator);
}

directiveDecorator.$inject = ['$delegate'];
function directiveDecorator($delegate) {
  var directive = $delegate[0], // directives are returned as an array
      originalLink = directive.link;

  directive.link = function(scope, element, attrs) {
    // do something
    originalLink.apply(directive, arguments); // do the original thing
    // do something after
  }

  return $delegate;
}

```
