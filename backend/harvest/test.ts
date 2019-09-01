import { fixLanguage, removeGlobal, removeSponsorship } from "./src/plugins/Dspace";

fixLanguage().then(d => console.log(d)).catch(e => console.dir(e));

removeGlobal().then(d => console.log(d)).catch(e => console.dir(e));

removeSponsorship().then(d => console.log(d)).catch(e => console.dir(e));