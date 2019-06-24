#  Open Repository Explorer and Visualizer

  

The Open Repository Explorer and Visualizer (OpenRXV) is a dashboard-like tool that was created to help people find and understand the content in open access repositories like [DSpace](https://duraspace.org/dspace). It began as a proof of concept developed by [the Monitoring, Evaluation and Learning (MEL)](https://mel.cgiar.org) team at the [International Center for Agricultural Research in the Dry Areas (ICARDA)](https://www.icarda.org) to enable exploring and reporting on content in two key institutional repositories. Later, in partnership with the [International Livestock Research Institute (ILRI)](https://www.ilri.org), the scope was expanded with the idea of supporting more repository types and larger amounts of items. In the future, we hope to be able to support any repository that uses Dublin Core metadata and has an API for harvesting.

  

This project contains a backend indexer powered by [Node.js](https://nodejs.org/) and [Elasticsearch](https://www.elastic.co), and a dynamic frontend built with [Angular](https://angular.io), [Bootstrap](https://getbootstrap.com), [Highcharts](https://www.highcharts.com/), [Angular Material](https://material.angular.io/), and [Ngrx](https://ngrx.io/). The application is wrapped up and deployed via [Docker](https://www.docker.com/).

  

You can see an example of the project working on our [Agricultural Research e-Seeker (AReS)](https://cgspace.cgiar.org/explorer/).

  

##  Requirements

  

-  Node.js v8+

-  npm 5.6.0+

-  Docker 17.12.0+

-  docker-compose 1.18.0+

-  [dspace-statistics-api](https://github.com/ilri/dspace-statistics-api) (optional, for item views and downloads)

  

##  Installation

  

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

  

##  Todo

  

-  Improve documentation (in progress...)

-  Add reporting functionality

  

##  Documentation

The application is divided into 3 sections

  

1 - The navbar ( yellow ) : which holds the logo on the left, and three buttons with icons on the right, 
    
- <img src="docs/images/icons/search.png" width="20" height="20" alt="Search icon"> opens the side filters. 
- <img src="docs/images/icons/loop.png" width="20" height="20" alt="Loop icons"> clears the query.
- <img src="docs/images/icons/support.png" width="20" height="20" alt="Support icon"> opens a tutorial ( which is a bunch of popups over the elements in the dashboard ).


2 - The components ( gray ): holds the charts and lists:

- counters ( <img  src="docs/images/icons/counters.png"  width="20"  height="20"  alt="counters icon"> ).
- pie ( <img  src="docs/images/icons/pie.png"  width="20"  height="20"  alt="Pie Chart icon"> ) , worldcould ( <img  src="docs/images/icons/worldcloud.png"  width="20"  height="20"  alt="worldcloud Chart icon"> ), and map ( <img  src="docs/images/icons/map.png"  width="20"  height="20"  alt="map icon">  ) charts.

-  top counties ( <img  src="docs/images/icons/list.png"  width="20"  height="20"  alt="List icon">  ), top contributors ( <img  src="docs/images/icons/list_alt.png"  width="20"  height="20"  alt="list_alt icon">  ), Top Affiliations ( <img  src="docs/images/icons/list_alt.png"  width="20"  height="20"  alt="list_alt icon">  ), CRPs and Platforms ( <img  src="docs/images/icons/star.png"  width="20"  height="20"  alt="star icon">  ), and Funders lists ( <img  src="docs/images/icons/star.png"  width="20"  height="20"  alt="Star icon">  ).

-  paginated list ( <img  src="docs/images/icons/view_list.png"  width="20"  height="20"  alt="view_list icon">  ).


3 - The side navigation buttons ( red color ): these buttons navigate the user to the corresponding components with the same icon(s).

  


![App structure image](docs/images/app-struct.png)
<hr />

Almost everything is configurable, colors, the position of charts, tooltips text, and the data being displayed in the charts.

And to change these attributes you need to modify some TypeScript and SCSS files, which you can find in

`/RES/src/configs`

-  `/counters.ts`  {  <img  src="docs/images/icons/counters.png"  width="20"  height="20"  alt="counters icon"> }

    -  Includes the configuration of the **upper section** that display the ‘*number of total items’*, ‘*number of open access documents’*, ‘*number of authors*’, etc.…

-  `/dashboard.ts`  { <img  src="docs/images/icons/pie.png"  width="20"  height="20"  alt="Pie Chart icon">, <img  src="docs/images/icons/worldcloud.png"  width="20"  height="20"  alt="worldcloud Chart icon">, <img  src="docs/images/icons/map.png"  width="20"  height="20"  alt="map icon">, <img  src="docs/images/icons/list.png"  width="20"  height="20"  alt="List icon">, <img  src="docs/images/icons/list_alt.png"  width="20"  height="20"  alt="list_alt icon">, <img  src="docs/images/icons/star.png"  width="20"  height="20"  alt="star icon">, <img  src="docs/images/icons/view_list.png"  width="20"  height="20"  alt="view_list icon"> }

    -  Includes the configuration of the **Charts & lists section**, here you can add more charts, rearrange, & delete any chart or list.

-  `/filters.ts`

    -  Includes the configuration of the **Side Filters**, which you can modify to remove the filter or change the values each filter displays to modify the query.

-  `/generalConfig.interface.ts`

    -  Just a simple file that **holds types** that will help your *IDE/text editor* or *you* to know the options that you can add in the configurations.

-  `/tooltips.ts`

    -  Currently, this file only holds the text for the tooltip that will be shown when the user hovers over the icon ( <img  src="docs/images/icons/tooltip.png"  width="20"  height="20"  alt="tooltip icon"> ) in the ‘or/and’ button inside the filters area.

-  `/chartColors.ts`

    -  Holds the **colors of the charts** in hexidecimal format.

    -  [Good website](https://color.adobe.com/explore) to choose nice colors.

-  `/colorsMap.scss`

    -  Includes a *sass* map that holds the **main colors of the whole app**.

-  `/customTheme.scss`

    -  In this file, we make sure that the main color gets applied to all third-party libraries and custom *css* classes

-  `/tour.ts`
    ![Tour Example](docs/images/tour_example_gif.gif)
    -  Currently, this file only holds the configuration of a single card that will be displayed as the first part of the **tutorial**, you can modify its text here.

    -  The rest of the tutorial will be built from the configuration of `counters.ts` & `dashboard.ts`.
        -  We will take the title and description from each object and use them in the popover on top of the element:

### Generic Configurations

- `counters.ts`, `dashbaord.ts`, & `filter.ts` all exports an array of objects ( *type hinted via `./generalConfig.interface.ts/GeneralConfigs`* ), and each object delegates an element in the web page through a set of properties you might configure.

The properties that you can add to each object :

-  show (*optional*): which determine if we should hide or show the element that this object delegate, this is useful when you write some code for testing and you do not want to remove it.

-  tour (*optional*): which if you set it to `true`, the app will take the `description` & `title` from this object and adds them to a popover that shows on top of the element that this object delegates. And if you set it to `false` or didn’t even put it, the element that this object delegate won’t be used the tutorial.

-  component (*optional* in `counter.ts` ): in the case of the counters you don’t need to add it since each object from this file will delegate a counter component by default, but in the `filters.ts` & `dashboard.ts` you need to add a string of the name of the component. 
Available components [`SelectComponent`, `LabelComponent`, `CounterComponent`, `SearchComponent`, `RangeComponent`,  `ListComponent`, `WelcomeComponent`, `PieComponent`, `WordcloudComponent`, `MapComponent`]

-  title (*optional*): The text you will add here will be shown as the header for the counters (this will only affect only the counter).

-  class (*optional*): bootstrap classes that you want the app to use for the current component. we usually use the grid system classes here to organize each component placement ( bootstrap gird wont effect the counters ), *if you added class in the style.scss and add its name here it will work*.

- scroll (*optional*): this property is responsible for the side navigation buttons (red), and should be added to the `dashboard.ts` & `counter.ts` objects, and there is a rule you need to keep in mind, in the `counters.ts` you only need to add this property to the first element in the array.
    -   icon (*optional*): the icon will be added to the side navigation buttons, [all icon names](https://material.io/tools/icons/).
    - linkedWith (*optional*): if the element has another one next to it(like the map & top countries), we need to add the id of that element here, to tell the app that these two are linked.
    - examples : 
         - Two elements next to each other, linked with one side navigation button.
         ![two element next to each other](docs/images/examples/scroll_linked_with.png)
         - Three elements next to each other, linked with one side navigation button.
        ![Three elements next to each other](docs/images/examples/scroll_linked_with_3_el.png)
        - One element, with single side navigation button.
        ![One element](docs/images/examples/scroll_linked_with_one_el.png)

- **componentConfigs (*required*)** : this property may be `ComponentDashboardConfigs`, `ComponentCounterConfigs`, `ComponentLabelConfigs`, `ComponentSearchConfigs`, or`ComponentFilterConfigs`
    - ComponentDashboardConfigs
         - id (*required*): any string you want, but this must be unique.
         - title (*required*): the title of the popover if this element is used in the tour.
         - description (*required*): the body of the popover, if this element is used in the tour.
         - source (*required*): string, the elasticsearch key that this component will get its data from, this might be an array of strings in the case of the chart bar.
         - content (*optional*): `PaginatedListConfigs` object which contains the following properties: 
            - TODO .... :(
    - ComponentCounterConfigs: 
         - id (*required*): any string you want, but this must be unique.
         - title (*required*): the title of the popover if this element is used in the tour.
         - description (*required*): the body of the popover, if this element is used in the tour.
         - source (*required*): string, the elasticsearch key that this component will get its data from, this might be an array of strings in the case of the chart bar.
         - percentageFromTotal (*optional*) : (boolean) should this counter displays a percentage from the total items.
         ![One element](docs/images/examples/percentage.jpg)
         - filter (*optional*): (string) the filter for `open access` or `limited access`.
    - ComponentLabelConfigs (this object is used in the side filters ( `filters.ts` ) and delegates a label that separate each section of a filters): 
        - text (*required*): what should be displayed
        - border (*optional*): (boolean) should the app put a bottom border under the text?
        - description (*optional*): if you added text here an icon ( <img  src="docs/images/icons/tooltip.png"  width="20"  height="20"  alt="tooltip icon"> ) will show next to the text, and when the user hover over it a popover will show and show the description.
        - example: 
            ![code that generates labels with popover](docs/images/examples/label_code_exam.jpg)
    - ComponentSearchConfigs (this object is used in the side filters ( `filters.ts` ) and delegates a search text box that is used to search in a specific key in elasticsearch))
        - placeholder (*required*) : the placeholder in the input.
        - type (*required*) : which is `searchOptions` and could be `titleSearch` or `allSearch`.
    - ComponentFilterConfigs (delegates a multiple select filter): 
        - source (*required*): string, the elasticsearch key that this filter will get its data from.
        - placeholder (*required*) : the placeholder in the input.
        - expandPosition (*optional*) : the position that the select options will expand to might be `top` or `bottom`, if you do not provide a position the app will expand the select based on the user view.
    - addInMainQuery (*optional*) : (boolean), the main query that gets called when you first load the page and when you change any filter values takes the `source` property from the configs and build the main query, but there are some `sources` that only needed for the filters. So if this was set to true this source will be used in the main query else it won't. this makes the app faster, hence it dose not load data, unless it needs it.

##  License

This work is licensed under the [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html). The license allows you to use and modify the work for personal and commercial purposes, but if you distribute the work you must provide users with a means to access the source code for the version you are distributing. Read more about the [GPLv3 at TL;DR Legal](<https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3)>).

Read more about ILRI's commitment to openness click [here](https://www.ilri.org/open).