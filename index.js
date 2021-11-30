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
//TEST 
app.get('/api/:parametre/:ref' , (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE '+req.params.parametre+' = "'+req.params.ref+'"';
  db.query(sqlSelect , (err , result) => {
    res.send(result)
   
  })
})
//MÜŞTERİ ŞEHRİNE GÖRE
app.get('/api/musteriSehir/:sehir' , (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE musteriSehir = "'+req.params.sehir+'"';
  db.query(sqlSelect , (err , result) => {
    res.send(result)
   
  })
})
//MÜŞTERİ ADINA GÖRE
app.get('/api/musteriUnvani/:isim' , (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE musteriUnvani = "'+req.params.isim+'"'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    

  })
})
//MÜŞTERİ ARAÇ TİPİNE GÖRE
app.get('/api/musteriAracTipi/:arac' , (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE musteriAracTipi = "'+req.params.arac+'"'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    

  })
})
//TEMSİLCİMİZ ADI İLE
app.get('/api/firstName/:isim' , (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE firstName >= "'+req.params.isim+'"'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    
  })
})
// İÇ SATIŞ Query

app.get('/api/departman/:departman' , (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE departman= "'+req.params.departman+'";'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
  })
})

// YENİ MÜŞTERİ EKLEME
app.post('/api/insert' , (req , res ) =>{
  

  const sqlInsert = "INSERT INTO musteri (firstName,lastName,departman,musteriUnvani,musteriAdresi,musteriMail,musteriSehir,musteriUlke,musteriAracTipi,musteriIlgili,musteriTelefon,gorusmeKonusu,gorusmeOzet, gorusmeTarih) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);"

  const firstName = req.body.values.firstName
  const lastName = req.body.values.lastName
  const departman = req.body.values.departman
  const musteriUnvani = req.body.values.musteriUnvani
  const musteriAdresi = req.body.values.musteriAdresi
  const musteriMail = req.body.values.musteriMail
  const musteriSehir = req.body.values.musteriSehir
  const musteriUlke = req.body.values.musteriUlke
  const musteriAracTipi = req.body.values.musteriAracTipi
  const musteriIlgili = req.body.values.musteriIlgili
  const musteriTelefon = req.body.values.musteriTelefon
  const gorusmeKonusu = req.body.values.gorusmeKonusu
  const gorusmeOzet = req.body.values.gorusmeOzet
  const gorusmeTarih = req.body.values.gorusmeTarih

  db.query(sqlInsert , [firstName,lastName,departman,musteriUnvani,musteriAdresi,musteriMail,musteriSehir,musteriUlke,musteriAracTipi,musteriIlgili,musteriTelefon,gorusmeKonusu,gorusmeOzet,gorusmeTarih],(err, result)=>{
    console.log(err)
  });
})




// SERVER PORT
app.listen(3001 , () => {
    console.log("Working on port 3001");
})
