const express = require('express')
const app= express()
const server= require('./server/db')
const Person = require('./models/person')

app.post('/', (req,res) =>{
    const newPerson = new Person({
        name: 'Said',
        age: 29,
        favoriteFoods: ['viande']
    })
    newPerson.save(function(err,data){
        if (err) console.error
        res.json(data)
    })
})

app.post('/many', (req,res) =>{
    const arrayOfPeople= 
    [{
        name: 'Mina',
        age: 13,
        favoriteFoods: ['chocolat','riz','banane']
    },
    {
        name: 'Cohen',
        age: 22,
        favoriteFoods: ['pastilla','tajine','couscous']
    },
    {
        name: 'julien',
        age: 44,
        favoriteFoods: ['saumon','steak']
    }]
    
    Person.create(arrayOfPeople, (err, data)=>{
        if (err) console.error
        res.json(data)
    })
})

app.get('/Name/:name', (req,res)=>{
    Person.find({name: req.params.name}, (err,data)=>{
        if (err) console.error
        res.json(data)
    })
})

app.get('/Food/:food', (req,res)=>{
    Person.findOne({favoriteFoods: {$all: [req.params.food]}}, (err,data)=>{
        if (err) console.error;
        res.json(data)
    })
})

app.get('/Id/:id', (req,res)=>{
    const personId = req.params.id
    Person.findById({_id: personId}, (err,data)=>{
        if (err) console.error; 
        res.json(data)
    })
})

app.put('/:id', (req,res)=>{
    const personId = req.params.id
    Person.findById({_id: personId}, (err,data)=>{
        if (err) console.error; 
        data.favoriteFoods.push("hamburger")
        data.save()
        res.json(data)
    })
})

app.put('/Name/:name', (req,res)=>{
    Person.findOneAndUpdate({name: req.params.name}, {$set: {age: 20}}, {new: true}, (err,data) =>{
        if (err) console.error;
        res.json(data)
    })
})

app.delete('/:id', (req,res)=>{
    const personId = req.params.id
    Person.findByIdAndRemove({_id: personId}, (err,data)=>{
        if (err) console.error;
        res.json(data)
    })
})

app.delete('/many/:name', (req,res)=>{
    const personName = req.params.name
    Person.remove({name: personName},(err,data)=>{
        if (err) console.error;
        res.json(data)
    })
})

app.get('/search', (req,res)=>{
    Person.find({favoriteFoods: {$all: ['burritos']}})
    .sort({name: 1})
    .limit(2)
    .select({age: false})
    .exec()
    .then(data=>res.json(data))
    .catch(err=>console.error) 
})

app.listen(3000, ()=>{
    console.log('Connected to http://localhost:3000')
})