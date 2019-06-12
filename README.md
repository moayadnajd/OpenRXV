# Open Repository Explorer and Visualizer

The Open Repository Explorer and Visualizer (OpenRXV) is a dashboard-like tool that was created to help people find and understand the content in open access repositories like [DSpace](https://duraspace.org/dspace). It began as a proof of concept developed by [the Monitoring, Evaluation and Learning (MEL)](https://mel.cgiar.org) team at the [International Center for Agricultural Research in the Dry Areas (ICARDA)](https://www.icarda.org) to enable exploring and reporting on content in two key institutional repositories. Later, in partnership with the [International Livestock Research Institute (ILRI)](https://www.ilri.org), the scope was expanded with the idea of supporting more repository types and larger amounts of items. In the future, we hope to be able to support any repository that uses Dublin Core metadata and has an API for harvesting.

This project contains a backend indexer powered by [Node.js](https://nodejs.org/) and [Elasticsearch](https://www.elastic.co), and a dynamic frontend built with [Angular](https://angular.io), [Bootstrap](https://getbootstrap.com), [Highcharts](https://www.highcharts.com/), and [Ngrx](https://ngrx.io/). The application is wrapped up and deployed via [Docker](https://www.docker.com/).

You can see an example of the project working on our [Agricultural Research e-Seeker (AReS)](https://cgspace.cgiar.org/explorer/).

## Requirements

- Node.js v8+
- npm 5.6.0+
- Docker 17.12.0+
- docker-compose 1.18.0+
- [dspace-statistics-api](https://github.com/ilri/dspace-statistics-api) (optional, for item views and downloads)

## Installation

After you have satisfied the requirements you can clone this repository and build the project:

```console
$ git clone https://github.com/ILRI/AReS.git
$ cd AReS/frontend
$ npm i
$ npm install -g @angular/cli
$ ng build --prod # for building the project in production mode
$ # or
$ ng serve --base-href=/explorer/ # for developing locally
$ cd AReS/app
$ npm i
$ cd AReS
$ sudo chmod 777 -R esConfig/
$ docker-compose up -d
```

## Todo

- Improve documentation (in progress...)
- Add reporting functionality

## Documentation
Almost everything is configurable, colors, the position of charts, tooltips text, and the data being displayed in the charts.
And to change these attributes you need to modify some TypeScript and SCSS files, which you can find in
`/RES/src/configs`
- `/counters.ts` 
	- Includes the configuration of the **upper section** that display the ‘*number of total items’*, ‘*number of open access documents’*, ‘*number of authors*’, etc.…
- `/dashboard.ts`
	- Includes the configuration of the **Charts & lists section**, here you can add more charts, rearrange, & delete any chart or list.
- `/filters.ts`
	- Includes the configuration of the **Side Filters**, which you can modify to remove the filter or change the values each filter displays to modify the query.
- `/generalConfig.interface.ts`
	- Just a simple file that **holds types** that will help your *IDE/text editor* or *you* to know the options that you can add in the configurations.
- `/tooltips.ts`
	- Currently, this file only holds the text for the tooltip that will be shown when the user hovers over the icon in the ‘or/and’ button inside the filters area.
- `/chartColors.ts`
	- Holds the **colors of the charts** in hexidecimal format.
	- click [here](https://color.adobe.com/explore) to choose nice colors.
- `/colorsMap.scss`
	- Includes a *sass* map that holds the **main colors of the whole app**.
- `/customTheme.scss`
	- In this file, we make sure that the main color gets applied to all third-party libraries and custom *css* classes
- `/tour.ts`
	- Currently, this file only holds the configuration of a single card that will be displayed as the first part of the **tutorial**, you can modify its text here.
	- The rest of the tutorial will be built from the configuration of `counters.ts` & `dashboard.ts`.


## License

This work is licensed under the [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html). The license allows you to use and modify the work for personal and commercial purposes, but if you distribute the work you must provide users with a means to access the source code for the version you are distributing. Read more about the [GPLv3 at TL;DR Legal](<https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3)>).

Read more about ILRI's commitment to openness click [here](https://www.ilri.org/open).
