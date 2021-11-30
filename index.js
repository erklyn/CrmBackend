const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
//SERVER CONFİG
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "crmDb",
});
// API'IN KULLANDIĞI MODULLER
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))


// ------------------------------------------ DATA OKUMA -------------------------------------- \\

// TEK MÜŞTERİ QUERY


app.get('/api/musteriler/:id' , (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE id= "'+req.params.id+'";'
  
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
  const sqlInsertGorusme = "INSERT INTO gorusme (tarih , konusu , ozet ,musteriID , temsilciID) VALUES (?,?,?,?,?);"
  const sqlInsertTemsilci = "INSERT INTO temsilci (adi , soyadi ,departman , mail) VALUES (?,?,?,?);"
  const sqlInsert = "INSERT INTO musteri (firmaAdi, firmaIlgilisi , firmaAdresi , firmaMail , firmaSehir , firmaUlke,firmaTelefon,firmaAractipi , temsilciID) VALUES (?,?,?,?,?,?,?,?,?);"

  const firmaAdi = req.body.values.firmaAdi
  const firmaIlgilisi = req.body.values.firmaIlgilisi
  const firmaAdresi = req.body.values.firmaAdresi
  const firmaMail = req.body.values.firmaMail
  const firmaSehir = req.body.values.firmaSehir
  const firmaUlke = req.body.values.firmaUlke
  const firmaAracTipi = req.body.values.firmaAractipi
  const firmaTelefon = req.body.values.firmaTelefon
  const adi = req.body.values.adi
  const soyadi = req.body.values.soyadi
  const mail = 'test@test12.com'
  const departman = req.body.values.departman
  const konusu = req.body.values.konusu
  const ozet = req.body.values.ozet
  const tarih = req.body.values.tarih
  const musteriID = req.body.values.musteriID
  const temsilciID = req.body.values.temsilciID
 
  db.query(sqlInsert , [firmaAdi,firmaIlgilisi,firmaAdresi,firmaMail,firmaSehir,firmaUlke,firmaTelefon,firmaAracTipi,temsilciID],(err, result)=>{
    console.log(err)
  });
  db.query(sqlInsertGorusme , [tarih , konusu , ozet, musteriID,temsilciID],(err, result)=>{
    console.log(err)
  });
  db.query(sqlInsertTemsilci , [adi , soyadi, departman ,mail],(err, result)=>{
    console.log(err)
  });
})
//app.post('/api/insert/isteklifi' , (req , res ) => {
 // GELİŞTİRME SÜRECİNDE

//})
app.post('/api/insert/temsilci' , (req , res ) => {
  const sqlInsertMusteri = "INSERT INTO temsilci (adi , soyadi ,departman , mail) VALUES (?,?,?,?);"

  const adi = req.body.values.temsilciAdi
  const soyadi = req.body.values.temsilciSoyadi
  const departman = req.body.values.temsilciDepartman
  const mail = req.body.values.temsilciMail
  

  db.query(sqlInsertTemsilci , [adi , soyadi, departman ,mail],(err, result)=>{
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
