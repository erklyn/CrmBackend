const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { createToken } = require('./JWT')
//SERVER CONFİG
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "crmDb",
    
});
const promisePool = db.promise();
// API'IN KULLANDIĞI MODULLER
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());


// ------------------------------------------ DATA OKUMA -------------------------------------- \\





// TEK MÜŞTERİ QUERY


app.get('/api/musteriler/:id' , (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE id= "'+req.params.id+'";'
  
  db.query(sqlSelect , (err , result) => {
    res.send(result)
  });
});


// TEKLİF QUERY 

app.get('/api/get/teklif/' , (req, res) => {
  const sqlSelect = 'SELECT * FROM teklif;'
  
  db.query(sqlSelect , (err , result) => {
    res.send(result)
  });
});


//TEKLİF QUERY WİTH MUSTERİ ID 
app.get('/api/get/teklif/:id' , (req, res) => {
  const sqlSelect = 'SELECT * FROM teklif WHERE musteriID= "'+req.params.id+'";'
  
  db.query(sqlSelect , (err , result) => {
    res.send(result)
  });
});
//TEKLİF QUERY WİTH ID
app.get('/api/get/tekteklif/:id' , (req, res) => {
  const sqlSelect = 'SELECT * FROM teklif WHERE id = "'+req.params.id+'";'
  
  db.query(sqlSelect , (err , result) => {
    res.send(result)
  });
});


// TÜM MÜŞTERİLERİ ÇEKME

app.get('/api/get' , (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri'
  db.query(sqlSelect , (err , result) => {
    
    res.send(result)
  })
})



//MÜŞTERİ ŞEHRİNE GÖRE
app.get('/api/get/firmaSehir/:sehir' , (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE firmaSehir = "'+req.params.sehir+'"';
  db.query(sqlSelect , (err , result) => {
    res.send(result)
   
  })
})

//MÜŞTERİ ADINA GÖRE
app.get('/api/get/firmaAdi/:isim' , (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE firmaAdi = "'+req.params.isim+'"'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    

  })
})

//MÜŞTERİ ARAÇ TİPİNE GÖRE
app.get('/api/get/firmaAractipi/:arac' , (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE firmaAractipi = "'+req.params.arac+'"'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    

  })
})

// TEMSİLCİ ÇEKME 
app.get('/api/get/temsilci/:id' , (req, res) => {
  const sqlSelect = 'SELECT * FROM temsilci WHERE id = "'+req.params.id+'"'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    

  })
})

// GÖRÜŞMELERİ ÇEKME
app.get('/api/get/gorusme/:id' , (req, res) => {
  const sqlSelect = 'SELECT * FROM gorusme WHERE musteriID = "'+req.params.id+'"'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    
  })
})





// ------------------------------------------- DATA YAZMA ----------------------------------------- \\
// YENİ MÜŞTERİ EKLEME
app.post('/api/insert/musteri' , (req , res ) =>{
  
  const sqlInsert = "INSERT INTO musteri (firmaAdi, firmaIlgilisi , firmaAdresi , firmaMail , firmaSehir , firmaUlke,firmaTelefon,firmaAractipi , temsilciID) VALUES (?,?,?,?,?,?,?,?,?);"

  const firmaAdi = req.body.values.firmaAdi
  const firmaIlgilisi = req.body.values.firmaIlgilisi
  const firmaAdresi = req.body.values.firmaAdresi
  const firmaMail = req.body.values.firmaMail
  const firmaSehir = req.body.values.firmaSehir
  const firmaUlke = req.body.values.firmaUlke
  const firmaAracTipi = req.body.values.firmaAractipi
  const firmaTelefon = req.body.values.firmaTelefon
  const temsilciID = req.body.values.temsilciID
 
  db.query(sqlInsert , [firmaAdi,firmaIlgilisi,firmaAdresi,firmaMail,firmaSehir,firmaUlke,firmaTelefon,firmaAracTipi,temsilciID],(err, result)=>{
    console.log(err)
  });
})
app.post('/api/insert/teklif' , (req , res ) => {
  const sqlInsertTeklif = "INSERT INTO teklif (musteriID , temsilciID ,paraBirimi ,odemeSekli , pesinatMiktari, vadeSure, teslimTarihi, teslimYeri , durum, neden , teklifNotu , birimFiyati ,adet , aracTipi ,teklifTarih) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"

  const musteriID = req.body.values.musteriID
  const temsilciID = req.body.values.temsilciID
  const paraBirimi = req.body.values.paraBirimi
  const odemeSekli = req.body.values.odemeSekli
  const pesinatMiktari = req.body.values.pesinatMiktari
  const vadeSure = req.body.values.vadeSure
  const teslimTarihi = req.body.values.teslimTarihi
  const teslimYeri = req.body.values.teslimYeri
  const durum = req.body.values.durum
  const neden = req.body.values.neden
  const teklifNotu = req.body.values.not
  const birimFiyati = req.body.values.birimFiyati
  const adet = req.body.values.adet
  const aracTipi = req.body.values.aracTipi
  const teklifTarih = req.body.values.teklifTarih
  

  db.query(sqlInsertTeklif , [musteriID , temsilciID, paraBirimi, odemeSekli, pesinatMiktari,vadeSure,teslimTarihi,teslimYeri, durum, neden, teklifNotu , birimFiyati , adet , aracTipi, teklifTarih],(err, result)=>{
    console.log(err)
  });
})

app.post('/api/insert/gorusme' ,(req , res) => {
  const sqlInsertGorusme = "INSERT INTO gorusme (tarih , konusu , ozet ,musteriID , temsilciID) VALUES (?,?,?,?,?);"

  const tarih = req.body.values.gorusmeTarih
  const konusu = req.body.values.gorusmeKonusu
  const ozet = req.body.values.gorusmeOzet
  const musteriID = req.body.values.musteriID
  const temsilciID = req.body.values.temsilciID


  db.query(sqlInsertGorusme , [tarih , konusu , ozet, musteriID,temsilciID],(err, result)=>{
    console.log(err)
  });

})




// SERVER PORT
app.listen(3001 , () => {
    console.log("Working on port 3001");
})


//----------------------- AUTH RELATED --------------------\\

app.post('/register' , (req , res ) => {
  const sqlInsertTemsilci = "INSERT INTO temsilci (adi , soyadi ,departman , mail , username , password ) VALUES (?,?,?,?,?,?);"
  
  const adi = req.body.values.adi
  const soyadi = req.body.values.soyadi
  const departman = req.body.values.departman
  const mail = req.body.values.mail
  const username = req.body.values.username
  const password = req.body.values.password
  
  
  bcrypt.hash(password, 10).then((hash) => {
    db.query(sqlInsertTemsilci , [adi , soyadi, departman ,mail , username , hash],(err, result)=>{
      console.log(err)
      res.json('Temsilci Başarıyla Oluşturuldu.')
    });
  })

  

  

})

app.post('/login' , async (req,res) => {
  const { username , password } = req.body.values;
  const sqlSelect = 'SELECT * FROM temsilci WHERE username ="'+username+'";'
  let [user , fields] = await promisePool.query(sqlSelect);
    
    

   if (user.length === 0){
    res.status(400).json({error: 'Böyle bir kullanıcı yok!'})
   }

    const dbPassword = user[0].password
      bcrypt.compare(password ,dbPassword).then((match)=> {
        if(match) {
          const token = createToken(user[0]);
          res.cookie("jwtToken" , token , {
            maxAge: 60*60*12*1000
          });
          res.json('Logged in');
        }else {
          res.status(400)
          .json({
            error: 'Hatalı şifre!'
          })
          
        }
      });
      



});

app.post('/verifyAuth' , (req , res) => {
  
});