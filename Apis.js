const express = require('express');
const dbConnection = require('./connection');
const mongo = require('mongodb');
const app = express();


app.use(express.json());
app.use(express.static(__dirname));

// root page
app.get('/', (req, resp)=>{
    resp.sendFile(__dirname + '/index.html');
})

// get data api
app.get('/getData', async (req, resp)=>{

    const db = await dbConnection();
    const result = await db.find({}).toArray();

    resp.send(result);
})


// insert data api
app.post('/insert', async (req, resp)=>{

    const data = req.body;

    const db = await dbConnection();
    let result = await db.insertOne(data, (err, resu)=>{

        if(err) throw err;
    })

    resp.send(result.acknowledged ? 'Contact Inserted!' : 'Contac not Inserted!');
});


// get single user
app.post('/single', async (req, resp)=>{

    const data = req.body;
    console.log(data);

    const db = await dbConnection();
    const result = await db.find(data).toArray();

    resp.send(result);
})


// update Data api
app.put('/update', async (req, resp)=>{

    const data = req.body;
    
    const db = await dbConnection();
    const result = await db.updateOne({_id: new mongo.ObjectId(data.key)}, {$set: {
        name: data.name,
        email: data.email,
        gender: data.gender,
        status: data.status
    }});

    if(result.acknowledged) resp.send('Contact Updated Successful!')
})

app.delete('/delete', async (req, resp)=>{

    const data = req.body;
    const db = await dbConnection();
    const result = await db.deleteOne(data);

    if(result.acknowledged) resp.send('Contact Deleted Successful!')
})


app.listen(5000);