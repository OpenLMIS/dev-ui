# OpenLMIS-UI Dockerized Development Image

Image that contains tooling and core packages for OpenLMIS-UI generation. The OpenLMIS-UI is a single page application that is built with NPM processes.

Based off of debain-jesse.

## Volumes

- `/app` is where NPM expects the primary config.json file to be located.
- `/build` is the volume where NPM will create build artifacts, including the finalized single page application.

## Ports

- 9000 - HTTP port where development server runs
- 9876 - Karma test runner debugging port

## Examples

```shell
> docker run -it --rm -v $(pwd):/app openlmis/dev-ui
```

Typical development day:
```shell
> docker run -it --rm -p 8080:8080 -v buildcache:/build -v $(pwd):/app openlmis/dev-ui
$ npm build run --watch
```
Most interactions should occur through docker-compose.

## Tech

- Node 6.2
- NPM
- Bower
- AngularJS 1.6.x
