import { fixLanguage, removeGlobal, removeSponsorship } from "./src/plugins/Dspace";

removeGlobal().then(d => console.log(d)).catch(e => console.dir(e));

removeSponsorship().then(d => console.log(d)).catch(e => console.dir(e));