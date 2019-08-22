import { AddOn } from "./src/plugins/Dspace/addOn/AddOn";
import { addOns } from "./src/plugins";
import * as config from "../config/index.json";
import { reindex } from "./src/reindex";

var Que = new AddOn();
    setTimeout(() => {
        Que.clean().then(d => {
            var activeAddOns = config.AddOns.filter(d => d.active == true)
            activeAddOns.forEach((addOn) => {
                console.dir(addOn);
                var addOnObj = new addOns[addOn.name]();
                setTimeout(() => {
                    addOnObj.process();
                }, 10000);
               
                setTimeout(() => {
                    addOn.param ? addOnObj.init(addOn.param) : addOnObj.init();
                }, 20000);
            })
            let timeout: any = null;
            Que.queue.on('global:drained', () => {
                if (timeout) {
                    clearTimeout(timeout);
                    console.log("time cleared")
                }
                timeout = setTimeout(() => {
                    console.log("global:drained AddOn");
                    reindex()
                }, 60000);
            });

            if (!activeAddOns.length)
                reindex()
        })
    }, 1000);