# OpenLMIS-UI Dockerized Development Image

Image that contains tooling and core packages for OpenLMIS-UI generation. The OpenLMIS-UI is a single page application that is built with NPM processes.

Based off of debain-jesse.

## Exposed Docker Items

### Volumes
- `/dev-ui` is where the build tool source code is exposed. Explicitly add this volume if you are working on the build tools from this repository. See the section about developing the dev-ui to understand how to best develop this image.
- `/app` is where NPM expects the primary config.json file to be located. *This should be the directory you are building your application in.* All downloaded files, build processes, and other artifacts will be exposed here.

### Ports

- `9000` HTTP port where development server runs
- `9876` Karma test runner debugging port

## Developing the Dev-UI
To run a version of the dev-ui image that updated from your file system, use the following 
```
// From your local version of this repository
// Build a local docker image (optional)
> docker build -t openlmis/dev-ui .

// <dev-ui> location of dev-ui files, use $(pwd)
// <app-dir> location of example application files (optional)
// NOTE: This command doesn't include port mapping
> docker run -it --rm -v <dev-ui>:/dev-ui -v <app-dir>:/app openlmis/dev-ui

// If you are working with an application, you will want to install the dev-ui package into the application directory
$ cd /app
$ npm install

// Run grunt commands to build and test the UI, outlined below
```
When developing and testing changes to the build process, you will want to see changes without running `npm install` repetatively. To do this, use [npm's link command](https://docs.npmjs.com/cli/link)

Starting from a running dev-ui image
```
$ cd /app

// Since the node_modules packages get screwed up often, remove it and start over
$ rm -rf node_modules
$ npm install

// Use npm link to create an alais to see changes as you make them
$ npm link /dev-ui

// Edit the grunt tasks, and when they are run you will see live changes
```

## Developing an Application with the Dev-UI
*Most interactions should occur through docker-compose, which will be documented in other repositories, this explains the raw usage.*

```shell
> docker run -it --rm -v $(pwd):/app openlmis/dev-ui
```

Typical development day:
```shell
> docker run -it --rm -p 9000:9000 -v $(pwd):/app openlmis/dev-ui
$ cd /app
$ npm install
$ grunt build --serve
``` 

## Building & Testing
The OpenLMIS-UI designed to be built from multiple repositories, enforcing a modular and extensible code base. To enable this, we use docker-compose to pull together different modules, and the dev-ui build process stitches these repositories together and configures tooling for development or production.

### Directory Structure
Since the OpenLMIS-UI is built from different pieces, we use a configuration variable in config.json to set the order that directories should be loaded into the UI. This means that later directories will overwrite the assets of earlier modules. *All paths should be absolute,* but this isn't checked at run time so if something breaks, this is worth looking into.

```
// Example config.json
"orderedBuildDirectories": [
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
Here is a short list of all the commands you might need to know. These commands are built from smaller commands defined in `dev-ui/tasks` which you can reuse, overwrite, or repackage in your own build process (which you can modify by defining your own Gruntfile).

- `grunt` will call the follow commands `bower` `build` and `karma:unit`
- `grunt build` will build the OpenLMIS-UI
- `grunt watch` will start a process that waits for changes to files, and then rebuilds the UI
- `grunt serve` will run the development server, which serves the `./build/` directory
- `grunt clean` empties the build and temporary directories
- `grunt bower` will loop through all application build directories and install the bower packages defined in each directory’s `bower.json` file
- `grunt karma:unit` to run Jasmine unit tests.
- `grunt karma:tdd` run Jasmine unit tests in test driven development mode, where test will automatically rerun when openlmis.js is rebuilt or any test file is updated.

### Flags
Passing flags in with the grunt command will overwrite base options set within.

- `--production` makes the OpenLMIS-UI uglify files for production
- `--noDocs` disables the generation of the JS documentation when running `grunt build`
- `--noStyleguide` disables the generation of the KSS styleguide when running `grunt build`
- `--serve` will run the development server along with any other command (and will keep the process alive). When this command is used, any URL configurations that start with `http` will be replaced with a proxy URL which will add CORS headers to the actual requested URL.
- `--syncTransifex` will extend the `grunt messages` command, and attempt to sync each the compiled messages_en.json file for each application to Transifex. The sync will only occur if:
-- The application directory has a `transifexProjectName` defined in the `config.json`
-- A transifex username and password are supplied either as environment variables (`TRANSIFEX_USER`, `TRANSIFEX_PASSWORD`) or command line flags (`--transifexUser=`, `--transifexPassword=`)

### Proxy URLs
Working with OpenLMIS servers or services will require CORS Headers to get data across domains. To ease development the OpenLMIS-UI dev server will create a local proxy URL and replace the variable with a foreign URL.

### Dynamic Configuration Variables
Within the OpenLMIS-UI, there are strings that are prefixed with '@@' which are automatically replaced by a matching configuration option. The variables in a file are written in CONSTANT_CASE, but configuration options are written in camelCase.

*Example*
You can set the url back to the OpenLMIS server, which is located here by:
```
// Adding the following to your config.json
{
    "openlmisServerUrl": "http://somewhere.over.the/rainbow/"
}

//or passing the following flag to your build command
> grunt build --openlmisServerUrl=http://somewhere.over.the/rainbow
```


## Tech

- Node 6.2
- NPM
- Bower
- AngularJS 1.6.x
