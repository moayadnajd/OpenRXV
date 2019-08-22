
import * as config from '../../config/index.json'
import { plugins, addOns } from './plugins'
import cluster from 'cluster';
import { EventEmitter } from 'events';
import { reindex, makeIndexesIfNotExist } from './reindex';
import { AddOn } from './plugins/Dspace/addOn/AddOn';

if (cluster.isMaster) {
    makeIndexesIfNotExist().then(() => {
        let emmiter = new EventEmitter()
        let finishjobs: Array<any> = [];
        emmiter.on('drained', (data) => {
            finishjobs.push(data)
            console.log(finishjobs.length, "<====>", config.repositories.length)
            console.log("-----------------------------------");
            console.log(finishjobs);
            if (finishjobs.length == config.repositories.length) {
                finishjobs = [];
                console.log("All indexing finished");
                var Que = new AddOn();
    setTimeout(() => {
        Que.clean().then(d => {
            var activeAddOns = config.AddOns.filter(d => d.active == true)
            activeAddOns.forEach((addOn) => {
                console.dir(addOn);
                var addOnObj = new addOns[addOn.name]();
                addOnObj.process();
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
            }
        })
        config.repositories.forEach((repo) => {
            let job = new plugins[repo.type](repo)
            job.init();
            let timeout: any = null;
            job.fetchQueue.on('global:drained', () => {
                if (timeout){
                    clearTimeout(timeout);
                    console.log("time cleared")
                }
                timeout = setTimeout(() => {
                    console.log("global:drained");
                    emmiter.emit('drained', job.repo);
                }, 60000);
            });
        })
        const numCPUs = require('os').cpus().length;
        // Create a worker for each CPU
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        // Listen for dying workers
        cluster.on('exit', function () {
            cluster.fork();
        });
    }).catch(e => console.log(e))
} else {
    config.repositories.forEach((repo) => {
        new plugins[repo.type](repo).process();
    });
}
