const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Blog = require('./models/blog');

const dbURI =
  'mongodb+srv://flaboy:flaboy123@acadera.hqkcv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, console.log(`server is listening on ${PORT}`));
    console.log('Db connected as well');
  });

// to register th vew engine you use the app.set method
app.set('view engine', 'ejs');

// middleware that comes with express (static)
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

// express routes
app.get('/', (req, res) => {
  res.redirect('./blogs');
});

app.get('/blogs', (req, res) => {
  Blog.find().then((result) => {
    res.render('index', { title: 'Blogs', blogs: result });
  });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.post('/blogs', (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => {
      res.redirect('/blogs');
    })
    .catch((err) => console.log(err));
});

app.delete('blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id).then((result) => {});
});

app.get('/blog/create', (req, res) => {
  res.render('create', { title: 'Create Blog' });
});

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render('details', { title: 'Blog details', blog: result });
    })
    .catch((err) => console.log(err));
});

app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
