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
// İÇ SATIŞ Query

app.get('/api/get/:departman' , (req, res) => {
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
