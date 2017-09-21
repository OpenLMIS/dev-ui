#Interceptor
This section is about events and messages, and how to modify them.

HTTP Interceptors are technically factories that have been configured to 'intercept' certain types of requests in Angular and modify their behavior. This is recommended because other Angular objects can use consistent Angular objects, reducing the need to write code that is specialized for our own framework.

*Keep all objects in a single file - so its easier to understand the actions that are being taken*

The Angular guide to writting [HTTP Interceptors is here](https://docs.angularjs.org/api/ng/service/$http#interceptors)

## General Conventions
* Write interceptors so they only chanage a request on certain conditions, so other unit tests don't have to be modified for the interceptors conditions
* Don't include HTTP Interceptors in openlmis-core, as the interceptor might be injected into all other unit tests — which could break everything

## Unit Testing Conventions
The goal when unit testing an interceptor is to not only test input and output transformation functions, but to also make sure the interceptor is called at an appropriate time.