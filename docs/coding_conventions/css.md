# SASS & CSS Formatting Guidelines

General SASS and CSS conventions:
* Only enter color values in a variables file
* Only enter pixel or point values in a variables file
* Variable names should be lowercase and use dashes instead of spaces (ie: _$sample-variable_)
* Avoid class names in favor of child element selectors where ever possible
* Files should be less than 200 lines long
* CSS class names should be lowercase and use dashes instead of spaces

## SMACSS
The CSS styles should reflect the SMACSS CSS methodology, which has 3 main sections — base, layout, and module. SMACSS has other sections and tennants, which are useful, but are not reflected in the OpenLMIS-UI coding conventions.

### Base
CSS styles applied directly to elements to create styles that are the same throughout the application.

### Layout
CSS styles that are related primarly to layout in a page — think position and margin, not color and padding — these styles should never be mixed with base styles (responsive CSS should only be implemented in layout).

### Module
This is a css class that will modify base and layout styles for an element and it's sub-elements.

## SASS File-Types
Since SASS pre-processes CSS, there are 3 SCSS file types to be aware of which are processed in a specific order to make sure the build process works correctly.

### Variables
A variable file is either named 'variables.scss' or matches '*.variables.scss'

Varriables files are the first loaded file type and include any variables that will be used through out the application — *There should be as few of these files as possible*.

The contents of a varriables file should only include SASS variables, and output no CSS at anypoint.

There is no assumed order in which varriables files will be included, which means:
* Varriable files shouldn't have overlapping varriables
* Implement [SASS's variable default (!default)](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#variable_defaults_)

## Mixins
A mixin file matches the following pattern *.mixin.scss

Mixins in SASS are reusable functions, which are loaded second in our build process so they can use global variables and be used in any other SCSS file.

There should only be one mixin per file, and the file name should match the function's name, ie: 'simple-function.mixin.scss'

## All Other SCSS and CSS Files
All files that match '*.scss' or '*.css' are loaded at the same time in the build process. This means that no single file can easily overwrite another files CSS styles unless the style is more specific or uses `!imporant` — This creates the following conventions:
* Keep CSS selectors as general as possible (to allow others to be more specific)
* Avoid using !important

To keep file sizes small, consider breaking up files according to SMACSS guidelines by adding the type of classes in the file before .scss or .css (ie: `navigation.layout.scss`)