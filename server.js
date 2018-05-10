const express = require('express')
const app = express()
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://sharma:sharma@ds255308.mlab.com:55308/my-job-applications', (err, client) => {
  if (err) return console.log(err)
  db = client.db('my-job-applications')
  app.listen(3000, () => {
    console.log('listening on 3000')
  })

})


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(fileUpload())
// app.use(bodyParser({uploadDir:'./uploads'}))
app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json())

app.get('/', (req, res) => {
	// res.sendFile(__dirname + '/index.html')
	db.collection('jobs').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {jobs: result})
  })
})

app.post('/jobs', (req, res) => {

	console.log(req.body)
	if (req.files.resume_used){
		var timestamp = new Date().getTime().toString()
    var resume_used = req.files.resume_used
		var resume_arr = resume_used.name.split('.')
		var resume_extension = resume_arr.pop()
		var resume_name = resume_arr[resume_arr.length - 1]
		var resume_location = './uploads/' + resume_name +'_'+ timestamp +'.'+ resume_extension
		resume_used.mv(resume_location, (err) => {
			if(err){
				res.status(500).send(err)
			}
			req.body.resume_used = resume_location
			console.log(req.body)
		})
	}
  console.log(req.body)
	if (req.files.cover_letter_used){
		var timestamp = new Date().getTime().toString()
    var cover_letter_used = req.files.cover_letter_used
		var cover_letter_arr = cover_letter_used.name.split('.')
		var cover_letter_extension = cover_letter_arr.pop()
		var cover_letter_name = cover_letter_arr[cover_letter_arr.length - 1]
		var cover_letter_location = './uploads/' + cover_letter_name +'_'+ timestamp +'.'+ cover_letter_extension
		cover_letter_used.mv(cover_letter_location, (err) => {
			if(err){
				res.status(500).send(err)
			}
			req.body.cover_letter_used = cover_letter_location
			console.log(req.body)
		})
	}
	console.log(req.body)
	db.collection('jobs').save(req.body, (err, result) => {
		if (err) return console.log(err)

		console.log('saved to database')
		res.redirect('/')
	})
})

app.put('/jobs', (req, res) => {
  db.collection('jobs')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/jobs', (req, res) => {
  db.collection('jobs').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
})
