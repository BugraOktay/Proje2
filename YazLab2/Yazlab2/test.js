const express = require("express");
const app = express();
app.set("view engine", "ejs")
app.use(express.static('public'));
const db = require("./database");
var nodemailer = require('nodemailer');

const session = require('express-session');
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
    },
}));
function sifre_uret() {
    var r = Math.floor(Math.random() * 9000) + 1000;//4basamaklı sayı
    var sifre = String(r);
    return sifre;
}
function email_gonder() {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bugraoktayates@gmail.com',
            pass: 'jxik eeaj rbwj vcvo'
        }
    });



    var mailOptions = {
        from: 'bugraoktayates@gmail.com',
        to: 'Hatavarlo@hotmail.com',
        subject: 'Yeni Şifre',
        text: 'hatvar'
    };

    app.use(express.urlencoded({ extended: true }));
    app.post('/email', (req, res) => {
        var sifre = sifre_uret();
        const { eposta } = req.body;

        mailOptions.to = eposta;
        mailOptions.text = sifre;
        var sqlQuery = "UPDATE YazLab.ogrenci SET sifre = ? WHERE eposta = ?;"
        var sqlQuery1 = "UPDATE YazLab.hoca SET sifre = ? WHERE eposta = ?;"
        db.query(sqlQuery, [sifre, eposta], (error, results, fields) => {
            if (error) throw error;

        });
        db.query(sqlQuery1, [sifre, eposta], (error, results, fields) => {
            if (error) throw error;

        });

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.redirect("/giris");

    });
}
//////////////////////////////////////
db.query("SELECT * FROM YazLab.ogrenci", (error, results, fields) => {
    if (error) {
        throw (error);
    }

    ///////////////////////////////////////
    app.use("/giris", function (req, res) {
        res.render("giris", { results });
    });
    ///////////////////////////////////////
    app.use("/k-anasayfa", function (req, res) {
        const sqlQuery = 'SELECT * FROM YazLab.ogrenci WHERE eposta = ? UNION SELECT * FROM YazLab.hoca WHERE eposta = ?;'
        db.query(sqlQuery, [req.session.email, req.session.email], (error, results, fields) => {
            if (error) throw error;

            req.session.tur = results[0].tur;
            res.render("k-anasayfa", { results });

        });

    });
    ///////////////////////////////////////
    app.use("/k-antrenman", function (req, res) {

        if (req.session.tur == 'h') {
            
            const sqlQuery = "SELECT * FROM YazLab.atama WHERE hoca=?"

            db.query(sqlQuery, req.session.email, (error, results, fields) => {
                if (error) throw error;
                res.render("h-antrenman", { results });
            });
            
        }
        else if (req.session.tur == 'o') {
            const sqlQuery = "SELECT * FROM YazLab.hareket WHERE ogrenci=?"

            db.query(sqlQuery, req.session.email, (error, results, fields) => {
                if (error) throw error;
                if(results[0]!=null){
                const sqlQuery1 = "SELECT * FROM YazLab.spor WHERE hareket=?"
                db.query(sqlQuery1, results[0].hareket1, (error, results1, fields)=>{
                    if (error) throw error;
                    const sqlQuery2 = "SELECT * FROM YazLab.spor WHERE hareket=?"
                db.query(sqlQuery1, results[0].hareket2, (error, results2, fields)=>{
                    if (error) throw error;
                    const sqlQuery3 = "SELECT * FROM YazLab.spor WHERE hareket=?"
                db.query(sqlQuery1, results[0].hareket3, (error, results3, fields)=>{
                    if (error) throw error;
                    const sqlQuery4 = "SELECT * FROM YazLab.spor WHERE hareket=?"
                db.query(sqlQuery1, results[0].hareket4, (error, results4, fields)=>{
                    if (error) throw error;
                    res.render("k-antrenman", { results,results1,results2,results3,results4 });
                });
                });
                });  
                
                }); }

                else{
                    var results1;
                    var results2;
                    var results3;
                    var results4;
                    results=null;
                    results1=null;
                    results2=null;
                    results3=null;
                    results4=null;
                    res.render("k-antrenman", { results,results1,results2,results3,results4 });
                }
            
                
                
                
                
            });

        }
    });
    ///////////////////////////////////////
    app.use("/k-beslenme", function (req, res) {
        if (req.session.tur == 'h') {
            const sqlQuery = "SELECT * FROM YazLab.atama WHERE hoca=?"

            db.query(sqlQuery, req.session.email, (error, results, fields) => {
                if (error) throw error;
                res.render("h-beslenme", { results });
            });


        }
        else if (req.session.tur == 'o') {
            const sqlQuery = "SELECT * FROM YazLab.beslenme WHERE ogrenci=?"

            db.query(sqlQuery, req.session.email, (error, results, fields) => {
                if (error) throw error;
                res.render("k-beslenme", { results });
            });

        }

    });
    ///////////////////////////////////////
    app.use("/k-iletisim", function (req, res) {
        const sqlQuery = 'SELECT * FROM YazLab.mesaj WHERE alici = ?;'
        db.query(sqlQuery, [req.session.email], (error, results, fields) => {
            if (error) throw error;


            res.render("k-iletisim", { results });
        });

    });
    ///////////////////////////////////////
    app.use("/kayit", function (req, res) {

        res.render("kayit", { results });
    });
    ///////////////////////////////////////
    app.use("/sifreyenile", function (req, res) {

        res.render("sifreyenile", { results });
    });


});

//////////////////////////KAYITLARI VERİTABANINA EKLEME//////////////////////////////////////
app.use(express.urlencoded({ extended: true }));//formu body içine kopyala
app.post('/veri-ekle', (req, res) => {

    const { oki, ad, dogumTarihi, cinsiyet, email, sifre, telefon, hedef } = req.body;
    var dizi = [ad, dogumTarihi, cinsiyet, email, sifre, telefon, hedef];


    var sqlQuery;
    if (oki == 'Danisan') {
        var hoca_mail;

        var sqlQuery2 = 'SELECT * FROM YazLab.hoca WHERE hedef=?;';
        db.query(sqlQuery2, hedef, (error, results, fields) => {
            if (error) throw error;
            hoca_mail = results[0].eposta;
            console.log(hoca_mail);
            
            var sqlQuery1 = 'INSERT INTO YazLab.atama (ogrenci,hoca) VALUES (?,?)';
            var dizi1 = [email, hoca_mail];
            db.query(sqlQuery1, dizi1, (error, results, fields) => {
                if (error) throw error;

            });
        });



        sqlQuery = 'INSERT INTO YazLab.ogrenci (adsoyad, dogum, cinsiyet, eposta, sifre, telefon,hedef) VALUES (?,?,?,?,?,?,?)';
    }
    else if (oki == 'Hoca') {
        sqlQuery = 'INSERT INTO YazLab.hoca (adsoyad, dogum, cinsiyet, eposta, sifre, telefon,hedef) VALUES (?,?,?,?,?,?,?)';
    }
    else {
        console.log("Hata var looo");
    }

    db.query(sqlQuery, dizi, (error, results, fields) => {
        if (error) throw error;
        console.log('Veritabanına eklendi.');
        res.redirect('/giris');
    });
});
//////////////////////////////////////////Giriş Yap//////////////////////////////////////////////
app.post('/giris-yap', (req, res) => {

    const { eposta, sifre } = req.body;


    var sqlQuery = 'SELECT sifre FROM YazLab.ogrenci WHERE eposta = ? UNION SELECT sifre FROM YazLab.hoca WHERE eposta = ?;';


    db.query(sqlQuery, [eposta, eposta], (error, results, fields) => {
        if (error) throw error;


        if (results[0].sifre == sifre) {

            req.session.email = eposta;
            res.redirect('/k-anasayfa');
            console.log('Giriş Yapıldı.');
        }
        else {

            res.redirect('/giris');
        }

    });
});
/////////////////////////////////////////////////////////////////////////////////////////
email_gonder();

////////////////////////////////////////Mesaj-gonder////////////////////////////////////////////
app.post('/mesaj_gonder', (req, res) => {

    const { alici, mesaj } = req.body;


    const sqlQuery = 'INSERT INTO YazLab.mesaj (gonderen,alici,mesaj) VALUES (?,?,?)';


    db.query(sqlQuery, [req.session.email, alici, mesaj], (error, results, fields) => {
        if (error) throw error;
        console.log('mesaj gönderildi.');
        res.redirect('/k-iletisim');
    });
});
////////////////////////////////////bilgiguncelle////////////////////////////////////////////////
app.post('/guncel', (req, res) => {

    const { adsoyad, cinsiyet, email, sifre, telefon, dogum } = req.body;
    var dizi = [adsoyad, cinsiyet, email, sifre, telefon, dogum, req.session.email];
    var sqlQuery = "UPDATE YazLab.ogrenci SET adsoyad=?,cinsiyet=?,eposta=?,sifre=?,telefon=?,dogum=? WHERE eposta = ?;"
    var sqlQuery1 = "UPDATE YazLab.hoca SET adsoyad=?,cinsiyet=?,eposta=?,sifre=?,telefon=?,dogum=? WHERE eposta = ?;"


    if (req.session.tur == 'o') {
        db.query(sqlQuery, dizi, (error, results, fields) => {
            if (error) throw error;
            console.log('ograncibilgisigüncell.');
            res.redirect('/k-anasayfa');
        });
    }
    else if (req.session.tur == 'h') {
        db.query(sqlQuery1, dizi, (error, results, fields) => {
            if (error) throw error;
            console.log('hocabilgisigüncell');
            res.redirect('/k-anasayfa');
        });

    }
    else {
        console.log("Hata 219");
    }

});
/////////////////////////////////////////beslenmee///////////////////////////////////////////
app.post('/beslenme', (req, res) => {

    const { alan, renk } = req.body;
    var dizi = [renk, alan];
    var sqlQuery = "INSERT INTO YazLab.beslenme (ogrenci,pazartesi) VALUES (?,?);"




    db.query(sqlQuery, dizi, (error, results, fields) => {
        if (error) {
            
            throw error; 
        }
        console.log('beslenme girdi.');
        res.redirect('/k-beslenme');
    });



});
////////////////////////////////////////////////////////////////////////////////////

app.post('/spor', (req, res) => {

    const {spor,hareket1,hareket2,hareket3,hareket4} = req.body;
    var dizi = [spor,hareket1,hareket2,hareket3,hareket4];
    var sqlQuery = "INSERT INTO YazLab.hareket (ogrenci,hareket1,hareket2,hareket3,hareket4) VALUES (?,?,?,?,?);"

    db.query(sqlQuery, dizi, (error, results, fields) => {
        if (error) throw error;
        
        res.redirect('/k-anasayfa');
    });



});

////////////////////////////////////////Profill////////////////////////////////////////////


app.listen(3000);


