# HTML Markup Guidelines

Less markup is better markup, and semantic markup is the best.

This means we want to avoid creating layout specific markup that defines elements such as columns or icons. Non-semantic markup can be replicated by using CSS to create columns or icons. In some cases a layout might not be possible without CSS styles that are not supported across all of our supported browsers, which is perfectly acceptiable.

Here is a common pattern for HTML that you will see used in frameworks like Twitter's Bootstrap (which we also use)
```
<li class="row">
	<div class="col-md-9">
		Item Name
	</div>
	<div class="col-md-3">
		<a href="#" class="btn btn-primary btn-block">
			<i class="icon icon-trash"></i>
			Delete
		</a>
	</div>
</li>
<div class="clearfix"></div>
```

The above markup should be simplified to:
```
<li>
	Item Name
	<button class="trash">Delete</button>
</li>
```
This gives us simpler markup, that could be restyled and reused depending on the context that the HTML section is inserted into. We can recreate the styles applied to the markup with CSS such as:
* A ::before pseudo class to display an icon in the button
* Using float and width properties to correctly display the button
* A ::after pseudo class can replace any 'clearfix' element (which shouldn't exist in our code)

See the UI-Styleguide for examples of how specific elements and components should should be constructed and used.

## HTML Views
Angular allows HTML files to have variables and simple logic evaluated within the markup.

*A controller that has the same name will be the reference to vm, if the controller is different, don't call it vm*

*General Conventions*
* If there is logic that is more complicated than a single if statement, move that logic to a controller
* Use filters to format variable output — don't format variables in a controller

## HTML Form Markup
A goal for the OpenLMIS-UI is to keep busniess logic separated from styling, which allows for a more testable and extenable platform. Creating data entry forms is generally where logic and styling get tangled together because of the need to show error responses and validation in meaningful ways. [AngularJS has built-in features](https://docs.angularjs.org/guide/forms) to help foster this type of separation, and OpenLMIS-UI extends AngularJS's features to a basic set of error and validation featrues.

The goal here is to attempt to keep developers and other implementers from creating their own form submission and validation - which is too easy in Javascript frameworks like AngularJS.

An ideal form in the OpenLMIS-UI would look like this:
```HTML
<form name="exampleForm" ng-submit="doTheThing()">
	<label for="exampleInput">Example</label>
	<input id="exampleInput" name="exampleInput" ng-model="example" required />
	<input type="submit" value="Do Thing" />
</form>
```
This is a good form because:
* There is a name attribute on the form element, which exposes the FormController
* The input has a name attribute, which allow for validation passed to the FormController to be passed back to the correct input
* ng-submit is used rather than ng-click on a button