import { fixLanguage, removeGlobal, removeSponsorship } from "./src/plugins/Dspace";

Promise.all([removeGlobal(), removeSponsorship()]).then(d => console.log(d)).catch(e => console.dir(e));