# OpenLMIS-UI Dockerized Development Image

Image that contains tooling and core packages for OpenLMIS-UI generation. The OpenLMIS-UI is a single page application that is built with NPM processes.

Based off of debain-jesse.

## Volumes

- `/app` is where NPM expects the primary config.json file to be located. *This should be the directory you are building your application in.* All downloaded files, build processes, and other artifacts will be exposed here.
- `/dev-ui` is where the dev tools live. Mount this volume if you are working on this image and it's tooling. Check out `npm link` to make you development process more streamlined.

## Ports

- 9000 - HTTP port where development server runs
- 9876 - Karma test runner debugging port

## Examples

```shell
> docker run -it --rm -v $(pwd):/app openlmis/dev-ui
```

Typical development day:
```shell
> docker run -it --rm -p 9000:9000 -v $(pwd):/app openlmis/dev-ui
$ grunt build --serve
```

Most interactions should occur through docker-compose.

## Building & Testing
The OpenLMIS-UI designed to be built from multiple repositories, enforcing a modular and extensible code base. To enable this, we use docker-compose to pull together different modules, and the dev-ui build process stitches these repositories together and configures tooling for development or production.

### Directory Structure
Since the OpenLMIS-UI is built from different pieces, we use a configuration variable in config.json to set the order that directories should be loaded into the UI. This means that later directories will overwrite the assets of earlier modules. *All paths should be absolute,* but this isn't checked at run time so if something breaks, this is worth looking into.

```
// Example config.json
"applicationBuildDirectories": [
    "/openlmis-ui-base",
    "/openlmis-ui-styles",
    "/openlmis-requisition-ui",
    "/openlmis-orders-ui",
    "/openlmis-reference-ui"
]
```

*Notes:*
- The `/dev-ui` directory is always included first (unless otherwise specified in the config.json).
- The current directory (most likely `/app`) is always included last (unless already specified in the config.json).
 
### Commands
Here is a short list of all the commands you might need to know, these commands are built from smaller commands defined in `dev-ui/tasks` which you can reuse, overwrite, or repackage in your own build process (which you can modify by defining your own Gruntfile.

- `grunt` will call the follow commands `bower` `build` and `karma:unit`
- `grunt build` will build the OpenLMIS-UI
- `grunt watch` will start a process that waits for changes to files, and then rebuilds the UI
- `grunt serve` will run the development server, which serves the `./build/` directory
- `grunt clean` empties the build and temporary directories
- `grunt bower` will loop through all application build directories and install the bower packages defined in each directories `bower.json` file
- `grunt karma:unit` to run Jasmine unit tests.
- `grunt karma:tdd` run Jasmine unit tests in test driven development mode, where test will automatically rerun when openlmis.js is rebuilt or any test file is updated.

### Flags
Passing flags in with the grunt command will overwrite base options set within.

- `--production` makes the OpenLMIS-UI uglify files for production
- `--noDocs` disables the generation of the JS documentation when running `grunt build`
- `--noStyleguide` disables the generation of the KSS styleguide when running `grunt build`
- `--serve` will run the development server along with any other command (and will keep the process alive). When this command is used, any URL configurations that start with `http` will be replaced with a proxy URL which will add CORS headers to the actual requested URL.

### Proxy URLs
Working with OpenLMIS servers or services will require CORS Headers to get data across domains, to ease development the OpenLMIS-UI dev server will create a local proxy URL and replace the variable with a foreign URL.

### Dynamic Configuration Variables
Within the OpenLMIS-UI, there are strings that are prefixed with '@@' which are automatically replaced by a matching configuration option. The variables in a file are written in CONSTANT_CASE, but configuration options are written in camelCase.

*Example*
You can set the url back to the OpenLMIS sever, which is located here by:
```
// Adding the following to your config.json
openlmisServerUrl: "http://somewhere.over.the/rainbow/"

//or passing the following flag to your build command
grunt build --openlmisServerUrl=http://somewhere.over.the/rainbow
```


## Tech

- Node 6.2
- NPM
- Bower
- AngularJS 1.6.x
