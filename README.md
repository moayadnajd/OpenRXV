# Open Repository Explorer and Visualizer
The Open Repository Explorer and Visualizer (OpenRXV) is a dashboard-like tool that was created to help people find and understand content in open access repositories like [DSpace](https://duraspace.org/dspace). It began as a proof of concept developed by [the Monitoring, Evaluation and Learning (MEL)](https://mel.cgiar.org) team at the [International Center for Agricultural Research in the Dry Areas (ICARDA)](https://www.icarda.org) to enable exploring and reporting on content in two key institutional repositories. Later, in partnership with the [International Livestock Research Institute (ILRI)](https://www.ilri.org), the scope was expanded with the idea of supporting more repository types and larger amounts of items. In the future we hope to be able to support any repository that uses Dublin Core metadata and has an API for harvesting.

This project contains a backend indexer powered by [Node.js](https://nodejs.org/) and [Elasticsearch](https://www.elastic.co), and a dynamic frontend built with [Angular](https://angular.io), [Bootstrap](https://getbootstrap.com), and [React](https://reactjs.org). The application is wrapped up and deployed via [Docker](https://www.docker.com/).

You can see an example of the project working on our [Agricultural Research e-Seeker (AReS)](https://cgspace.cgiar.org/explorer/).

## Requirements

- Docker 18.09+
- docker-compose 1.24+
- [dspace-statistics-api](https://github.com/ilri/dspace-statistics-api) (optional, for item views and downloads)

## Build and Run
After you have satisfied the requirements you can clone this repository and build the project:

```console
$ docker-compose up -d
```

*Note: you will most likely need to increase the host system's memory map limits by setting `vm.max_map_count = 262144` in /etc/sysctl.conf*

## Todo

- Improve documentation
- Add reporting functionality

## License
This work is licensed under the [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html). The license allows you to use and modify the work for personal and commercial purposes, but if you distribute the work you must provide users with a means to access the source code for the version you are distributing. Read more about the [GPLv3 at TL;DR Legal](https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3)).

Read more about ILRI's commitment to openness click [here](https://www.ilri.org/open).
