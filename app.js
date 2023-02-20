const express = require("express");
const session = require('express-session');
const ejs = require("ejs");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'catawabb',
  resave: false,
  saveUninitialized: true
}));

mongoose.connect('mongodb+srv://suradis:6352300324@cluster0.hngilp7.mongodb.net/CatAWabb?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error(err);
});

const User = require('./models/user')
const HotelQueue = require('./models/hotelqueue');

// Get
app.get('/', (req, res) => {
  if (req.session.user) {
    User.findOne({ username: req.session.user.username }, (err, user) => {
      if (err) throw err;
      res.render('profile', { user });
    });
  } else {
    res.redirect("/login")
  }
});

app.get("/login", (req, res) => {
  res.render("login")
})

app.get("/register", (req, res) => {
  res.render("register")
})

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect('/login');
  });
});

app.get('/catawabb', (req, res) => {
  if (req.session.user) {
    User.findOne({ username: req.session.user.username }, (err, user) => {
      if (err) throw err;
      res.render('home', { user });
    });
  }
  else {
    res.redirect("/login")
  }
})

app.get('/hotelqueue', (req, res) => {
  if (req.session.user) {
    User.findOne({ username: req.session.user.username }, (err, user) => {
      if (err) console.log(err);;
      res.render('hotelqueue', { user });
    });
  }
  else {
    res.redirect("/login")
  }
})

app.get("/history", (req, res) => {
  if (req.session.user) {
    User.findOne({ username: req.session.user.username }, (err, user) => {
      if (err) console.log(err);
      // res.render('history', { user })
      if (req.session.user.username == "admin") {
        HotelQueue.find({}, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`Member_Data : ${data}`);
            res.render('history', { user, hotelqueue: data });
          }
        });
      }
      else {
        HotelQueue.find({ username: req.session.user.username }, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`Member_Data : ${data}`);
            res.render('history', { user, hotelqueue: data });
          }
        });
      }
    });
  }
  else {
    res.redirect("/login")
  }
});

app.get("/member", (req, res) => {
  if (req.session.user) {
    User.findOne({ username: req.session.user.username }, (err, user) => {
      if (err) console.log(err);;
      res.render('member', { user });
    });
  }
  else {
    res.redirect("/login")
  }
});

// Post
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.render('login', { error: 'Invalid username or password' });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result === true) {
          req.session.user = { username };
          console.log(user.username);
          res.redirect("/catawabb");
        } else {
          res.render('login', { error: 'Invalid username or password' });
        }
      });
    }
  });
});

app.post('/register', (req, res) => {
  const { email, username, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    const user = new User({ email, username, password: hash });
    user.save((err) => {
      if (err) throw err;
      req.session.user = { username };
      res.redirect('/login');
    });
  });
});

app.post("/hotelqueue", (req, res) => {
  const hotelQueueData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    room_type: req.body.roomtype,
    checkin_date: req.body.checkin_date,
    checkout_date: req.body.checkout_date,
    total_days: req.body.total_days,
    price: req.body.price,
    username: req.session.user.username
  }
  const hotelQueue = new HotelQueue(hotelQueueData);
  hotelQueue.save()
    .then(result => {
      res.redirect("/hotelqueue")
      console.log('Hotel queue data saved:', result);
    })
    .catch(error => {
      console.error('Error saving hotel queue data:', error);
    });
});

// Delete
app.post('/history/:id', (req, res) => {
  const id = req.params.id;
  HotelQueue.remove({ _id: id }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Delelte Success");
      res.redirect('/history');
    }
  });
});


// listen port 3000
app.listen(3000, () => {
  console.log('Server started on port 3000');
});