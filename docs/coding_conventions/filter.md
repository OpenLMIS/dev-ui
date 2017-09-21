# Filters
Use an AngularJS filter if:
- You need to do complex formatting
- You need to render value in HTML, and it doesn't make sense to include in a
controller.

##### Documentation
Filter docs should follow the pattern from example below:
```
/**
 * @ngdoc filter
 * @name module-name.filter:filterName
 *
 * @description
 * Filter description.
 *
 * @param   {Type} input     input description
 * @param   {Type} parameter parameter description
 * @return  {Type}           returned value description
 *
 * @example
 * You could have short description of what example is about etc.
 * ```
 * <div>{{valueToBeFiltered | filterName:parameter}}</div>
 * ```
 */
```

It is a good practice to add example block at the end to make clear how to use it.
As for parameters the first one should be describing input of the filter.
Please remember of '.filter:' part. It will make sure that this one will appear in filters section.
