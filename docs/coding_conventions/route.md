# Routes
Routing logic is defined by [UI-Router,](https://ui-router.github.io/ng1/) where a URL path is typically paired with an HTML View and Controller.

*Use a factory where possible to keep resolve statements small and testable*

## General Conventions
* The [UI-Router resolve properties](https://github.com/angular-ui/ui-router/wiki#resolve) are used to ease loading on router
* [Routes should define their own views,](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#style-y271) if their layout is more complicated than a single section
