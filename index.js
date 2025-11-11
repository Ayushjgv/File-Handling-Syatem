const express=require('express');
const app=express();
const path=require('path');
const fs=require('fs');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/static',express.static(path.join(__dirname,'public')));



app.get('/',(req,res)=>{
    const files=fs.readdir('./textfiles/',(err,files)=>{
        if (err) {
            console.error(err);
            files = [];
        }
        res.render('index', {files: files || []});
    });
});

app.get('/status',(req,res)=>{
    res.send({status:'API is running'});
    res.redirect('/');
});

app.post('/file-created',(req,res)=>{
    const {filename,content}=req.body;
    fs.writeFile(`./textfiles/${filename}.txt`, content, (err)=>{
        if (err) {
            console.error(err);
            return res.status(500).send('Error creating file');
        }
        res.redirect('/');
    });
});


app.post('/file-open',(req,res)=>{
    const {filename}=req.body;

    fs.readFile(`./textfiles/${filename}.txt`,'utf8', (err,data)=>{
        if (err) {
            console.error(err);
        }
        res.render('readfiles', {filename: filename, content: data || ''});
    });
})



app.post('/file-append',(req,res)=>{
    const {filename,content}=req.body;

    fs.appendFile(`./textfiles/${filename}.txt`,content,(err)=>{
        if(err){
            console.error(err);
        }
        // alert('File Updated Successfully');
        res.redirect('/');
    })
})



app.post('/file-delete',(req,res)=>{
    const {filename}=req.body;
    fs.unlink(`./textfiles/${filename}.txt`, (err)=>{
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
})


app.listen(3000);

