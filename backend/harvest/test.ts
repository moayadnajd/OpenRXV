import { AddOn } from "./src/plugins/Dspace/addOn/AddOn";
import { Altmetric, DownloadsAndViewsMEL, DownloadsAndViews } from "./src/plugins/Dspace";

var Que = new AddOn();
Que.clean().then(d => {

    var addOnObj10947 = new Altmetric();

    addOnObj10947.process();


    addOnObj10947.init("10947")

    var addOnObj10568 = new Altmetric();

    addOnObj10568.process();


    addOnObj10568.init("10568")

    var addOnObjMEL = new Altmetric();

    addOnObjMEL.process();


    addOnObjMEL.init("20.500.11766")

    var downjMEL = new DownloadsAndViewsMEL();
    downjMEL.process();
    downjMEL.init();

    var down = new DownloadsAndViews();
    down.process();
    down.init('https://cgspace.cgiar.org');



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