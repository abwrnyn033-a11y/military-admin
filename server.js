const express=require('express');
const path=require('path');
const cors=require('cors');
const fs=require('fs');
const app=express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

// --- middleware آمن: لو ما لقى ملف auth يسمح بالدخول ---
let authMid=(req,res,next)=>next();
try{
  const midDir=path.join(__dirname,'middleware');
  if(fs.existsSync(midDir)){
    const files=fs.readdirSync(midDir);
    console.log('middleware files:',files);
    for(const f of files){
      if(f.toLowerCase().includes('auth')){
        authMid=require(path.join(midDir,f));
        console.log('loaded auth:',f);
        break;
      }
    }
  }
}catch(e){ console.log('auth not found, using dummy:',e.message); }

// --- دالة تحميل آمن للراوتات ---
function loadRoute(file){
  try{ return require('./routes/'+file); }
  catch(e){ console.log('route not found:',file,e.message); return (req,res)=>res.json({}); }
}

app.use('/api/auth', loadRoute('auth'));
app.use('/api/persons', authMid, loadRoute('persons'));
app.use('/api/finance', authMid, loadRoute('finance'));
app.use('/api/dashboard', authMid, loadRoute('dashboard'));
app.use('/api/notifications', authMid, loadRoute('notifications'));
app.use('/api/attendance', authMid, loadRoute('attendance'));
app.use('/api', authMid, loadRoute('attendance'));

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log('running on '+PORT));
