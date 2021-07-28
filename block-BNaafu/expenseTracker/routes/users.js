var express = require('express');
var router = express.Router();
var User = require('../models/users');
var nodemailer = require('nodemailer');
var random = require('../randomText');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//render register form
router.get('/register', (req, res, next) => {
  res.render('register');
});

//process register request
router.post('/register', (req, res, next) => {
  req.body.isVerified = false;
  req.body.random = random();
  var email = req.body.email;
  User.create(req.body, (err, user) => {
    if(err) return next(err);
    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWD
        },
        secure: true
    })

    const mailData = {
      from: 'prethushak770@gmail.com',
      to: email,
      subject: 'Verification Email', 
      html: `<h2>${user.random}</h2>
              <h3>Click On the this http://localhost:3000/users/verifyEmail link to verify your email and login </h3>`,
     
    }

    transporter.sendMail(mailData, function(err, info)  {
        if(err) return next(err);
        res.redirect('/users/register');
    })
  })
});

//render login page
router.get('/login', (req, res, next) => {
  let error = req.flash('error')[0];
  res.render('login', {error});
});

//process login request
router.post('/login', (req, res, next) => {
  let {email, passwd} = req.body;
  if(!email || !passwd) {
    req.flash("error", "Password/Email Required");
    return res.redirect('/users/login');
  }
  User.findOne({email}, (err, user) => {
    if(err) return next(err);
    if(!user) {
      req.flash("error", "Email is not registerd");
       return res.redirect('/users/login');
    }
    if(!user.isVerified) {
      req.flash("error", "Your Email is not verified");
      return res.redirect('/users/login');
    }
    user.verifyPasswd(passwd, (err, result) => {
      if(err) return next(err);
      if(!passwd) {
        req.flash("error", "Password is incorrect");
        return res.redirect('/users/login');
      }
      console.log(user);
      req.session.userId = user.id;
      res.redirect('/home');
    })
  })
});

//logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


//rendering verify email page
router.get('/verifyEmail', (req, res, next) => {
    res.render('verifyEmail');
});

//process email varification
router.post('/verifyEmail', (req, res, next) => {
  let {passcode, email} = req.body;
  User.findOne({email}, (err, user) => {
    if(err) return next(err);
    if(passcode == user.random) {
      req.body = {isVerified: true};
      User.findByIdAndUpdate(user.id, req.body, (err, user) => {
        if(err) return next(err);
        return res.redirect('/users/login');
      })
      
    } else {
        req.flash('error', 'The Verification code entered is not correct. Enter the correct one.');
        res.redirect('/users/verifyEmail');
    }
  })
});

//render forgot password page
router.get('/login/forgotpassword', (req, res, next) => {
  res.render('forgotPassword');
});

//process forgot password
router.post('/login/forgotpassword', (req, res, next) => {
  let {email} = req.body;
  req.body.random = random();
  User.findOneAndUpdate({email}, req.body, (err, user) => {
    if(err) return next(err);
    if(!user) {
      req.flash('error', 'The Email entered is not Registered, Please entered the registered Email');
      return res.redirect('/users/login/forgotpassword');
    }
    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWD
      },
      secure: true
    });
    
    const mailData = {
      from: 'prethushak770@gmail.com',
      to: email,
      subject: 'Verification Email',
      html: `<h1>${user.random}</h1>
              <h2>Please Copy above 6 digit number and click this link http://localhost:3000/users/login/resetpassword/verify </h2>`

    };

    transporter.sendMail(mailData, (err, info) => {
      if(err) return next(err);
      req.flash("info", "A password rest code is send to your email");
      req.session.email = email;
      res.redirect('/users/login/forgotpassword');
    })
  })
});

//render reset password verification code page
router.get('/login/resetpassword/verify', (req, res, next) => {
  res.render('resetPasswordVerificationCode');
});


//process verification code
router.post('/login/resetpassword/verify', (req, res, next) => {
  let email = req.session.email;
  let {passcode} = req.body;
  User.findOne({email}, (err, user) => {
    if(err) return next(err);
    if(passcode == user.random) {
      return res.redirect('/users/login/resetpassword');
    } else {
      req.flash('error', "Enter the correct verification code");
      res.redirect('/users/login/resetpassword/verify');
    }
  })
});


//render reset password page
router.get('/login/resetpassword', (req, res, next) => {
  res.render('resetPassword');
});

//reset password
router.post('/login/resetpassword', (req, res, next) => {
  let {newPasswd1, newPasswd2} = req.body;
  let email = req.session.email;
  if(newPasswd1 === newPasswd2) {
    User.findOne({email}, (err, user) => {
      if(err) return next(user);
      bcrypt.hash(passwd1, 10, (err, hashed) => {
        if(err) return next(err);
        user.passwd = hashed;
        user.save((err, user) => {
          if(err) return next(err);
          res.redirect('/home');
        })
      })
    })
  }
})



module.exports = router;
