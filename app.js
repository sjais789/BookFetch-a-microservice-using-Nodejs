var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var passport = require('passport');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({des:'./uploads'}));



app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var seneca = require('seneca');


var basicplugin = function(opt) {

    var seneca = this;

// all the book
    seneca.add({area: 'book', action: 'fetch'}, function (args, done) {
        var books = this.make('books');
        books.list$({}, done);    //use to retrieve all data from db
    });


// book by category
    seneca.add({area: 'book', action: 'fetch', criteria: 'byCategory'}, function (args, done) {
        var books = this.make('books');
        books.list$({category: args.category}, done);    //use to retrieve book by category from db
    });

// book by ID
    seneca.add({area: 'book', action: 'fetch', criteria: 'byId'}, function (args, done) {
        var books = this.make('books');
        books.load$( args.id, done);    //use to retrieve book by category from db
    });  //  In mongo db we have id in the form of hash and mysql we have integer

// add books data to the db
    seneca.add({area:'book',action:'add'},function(args,done)
    {
        var books = this.make('books');
        books.name =args.name;
        books.description= args.description;
        books.author= args.author;
        books.category= args.category;
        books.save$(function (err,book) {
            done(err,books.data$(false));
        });

    })
    // delete a  book by id


    seneca.add({area: 'book', action: 'remove'}, function (args, done) {

        var books = this.make('book');

        books.remove$(args.id,function(err)
        {
            done(err,null);
        })
    });
    }
);

module.exports = app;
