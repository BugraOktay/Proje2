var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bugraoktayates@gmail.com',
    pass: 'jxik eeaj rbwj vcvo'
  }
});

var r = Math.floor(Math.random() * 9000) + 1000;
var sifre= String(r);

var mailOptions = {
  from: 'bugraoktayates@gmail.com',
  to: 'Hatavarlo@hotmail.com',
  subject: 'Yeni Şifre',
  text: sifre
};


app.use("/email", function (req, res) {
  res.render("email", { results });
});
app.use(express.urlencoded({ extended: true }));
app.post('/email', (req, res) => {
   
  const {eposta} = req.body;

  mailOptions.to=eposta;



  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });


  
});










