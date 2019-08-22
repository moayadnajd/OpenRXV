import { AddOn } from "./src/plugins/Dspace/addOn/AddOn";
import { Altmetric, DownloadsAndViewsMEL, DownloadsAndViews } from "./src/plugins/Dspace";

var Que = new AddOn();
Que.clean().then(d => {

    var addOnObj10947 = new Altmetric();



    addOnObj10947.init("10947")
    addOnObj10947.process();


    var addOnObj10568 = new Altmetric();




    addOnObj10568.init("10568")
    addOnObj10568.process();

    var addOnObjMEL = new Altmetric();




    addOnObjMEL.init("20.500.11766")
    addOnObjMEL.process();

    var downjMEL = new DownloadsAndViewsMEL();

    downjMEL.init();
    downjMEL.process();
    var down = new DownloadsAndViews();

    down.init('https://cgspace.cgiar.org');

    down.process();

    let timeout: any = null;

    Que.queue.on('global:drained', () => {
        if (timeout) {
            clearTimeout(timeout);
            console.log("time cleared")
        }
        timeout = setTimeout(() => {
            console.log("global:drained AddOn");
        }, 60000);
    });



});