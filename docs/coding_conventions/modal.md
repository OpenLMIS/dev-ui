# Modal
A modal object isn't a 'native Angular object' — it is a service or factory that displays a modal window. This is done for convience and because it allows modal windows to not be declared in html files — and be used more easily by controllers (or even services, if appropriate).

*Use Javascript class*

## Conventions
When making a custom modal, only pass values back to the previous state/scope
when the modal is closed. You should use promises for this.

## Unit Tests
When creating a unit test for a modal service, the unit tests should focus on event driven logic and avoid testing functionality that is tied to the DOM. Since we are using Bootbox to manage the creation of modal elements, we can mock Bootbox and trust the Bootbox will successfully interact with the DOM.

```
// Imagine testing a modal that will show an alert, and when closed will resolve a promise.
describe('SampleModal', function(){

	// Instead of doing a beforeEach (recommended), this example directly injects dependencies
	it('when closed will resolve promise', function($rootScope, SampleModal, bootbox){

		// Pull out the callback that will be passed to bootbox when the window closes
		var closeCallback;
		spyOn(bootbox, 'alert').andCallFake(function(argumentObject){
			closeCallback = argumentObject.callback;

			// Bootbox is supposed to return a jQuery element, which we will mock with an object
			return {};
		});

		// make a spy to track if the promise works
		var promiseSpy = createSpy();

		// Make the modal, and save the promise...
		var promise = SampleModal().then(promiseSpy);

		// If we check the promiseSpy immedately, it shouldn't have been
		// called because the closeCallback wasn't called...
		expect(promiseSpy).not.toHaveBeenCalled();

		// Call closeCallback, which is out mocked version of clicking the
		// "ok" button on the alert modal
		closeCallback();
		expect(promiseSpy).toHaveBeenCalled();
	});
});

```  
