# Constants
Constants are Javascript variables that won't change but need to be resued between multiple objects within an Angular module. Using constants is important because it becomes possible to track an objects dependencies, rather than use variables set on the global scope.

It's also [useful to wrap 3rd party objects and libraries](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#vendor-globals) (like jQuery or bootbox) as an Angular constant. This is useful because the dependency is declared on the object. Another useful feature is that if the library or object isn't included, Angualr will throw a single verbose error message.

*Add rule about when its ok to add a group of constants -- if a grouping of values, use a plural name*

*Conventions:*
* All constant variable names should be upper case and use underscores instead of spaces (ie VARIABLE_NAME)
* If a constant is only relivant to a single Angular object, set it as a variable inside the scope, not as an Angular constant
* If the constant value needs to change depending on build variables, format the value like @@VARIABLE_VALUE, and which should be replaced by the grunt build process if there is a matching value
* Wrap 3rd party services as constants, if are not already registered with Angular

### Replaced Values
@@ should set own default values