const fs=require('fs').promises,path=require('path');
const DATA_FILE=path.join(__dirname,'data.json');
let cache=null;
async function load(){ if(cache) return cache; const t=await fs.readFile(DATA_FILE,'utf8'); cache=JSON.parse(t); return cache; }
async function save(d){ cache=d; await fs.writeFile(DATA_FILE,JSON.stringify(d,null,2),'utf8'); }
module.exports={load,save,DATA_FILE};
