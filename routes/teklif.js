const mysql = require('mysql2');
const express = require('express')
const {validateToken } = require('../controllers/auth');

const router  = express.Router()

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_ROOT_PASSWORD,
    database: process.env.DB_NAME,
});


// Get Main Page
router.get('/main' ,validateToken, (req, res) => {
    const sqlSelect = 'SELECT * FROM teklif ORDER BY teklifTarih DESC LIMIT 20 ;'
    
    db.query(sqlSelect , (err , result) => {
      res.send(result)
    });
  });
  // Get By Created
  router.get('/createdBy/:id' ,validateToken, (req, res) => {
    const sqlSelect = 'SELECT * FROM teklif WHERE musteriID= "'+req.params.id+'";'
    
    db.query(sqlSelect , (err , result) => {
      res.send(result)
    });
  });
  
  // Get failed
  router.get('/red' ,validateToken, (req, res) => {
    
    const sqlSelect = 'SELECT * FROM teklif WHERE durum IN ("Beklemede" , "Red") ORDER BY teklifTarih DESC LIMIT 20'
    
    db.query(sqlSelect , (err , result) => {
      
      res.send(result)
    });
  });
  
  // Get One
  router.get('/:id' ,validateToken, (req, res) => {
    const sqlSelect = 'SELECT * FROM teklif WHERE id = "'+req.params.id+'";'
    
    db.query(sqlSelect , (err , result) => {
      res.send(result)
    });
  });
  
  
// Create
  router.post('/' ,validateToken, (req , res ) => {
    const sqlInsertTeklif = "INSERT INTO teklif (musteriID , temsilciID ,temsilciAdi,paraBirimi ,odemeSekli , pesinatMiktari, vadeSure, teslimTarihi, teslimYeri , durum, neden , teklifNotu , birimFiyati ,adet , aracTipi ,teklifTarih) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"
  
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
    const temsilciAdi = req.body.values.temsilciAdi
  
    
  
    db.query(sqlInsertTeklif , [musteriID , temsilciID,temsilciAdi, paraBirimi, odemeSekli, pesinatMiktari,vadeSure,teslimTarihi,teslimYeri, durum, neden, teklifNotu , birimFiyati , adet , aracTipi, teklifTarih],(err, result)=>{
      if (err) {
          console.error(err) 
          res.status(500).end()
    }
      res.status(201).send('Başarıyla Oluşturuldu.')
    });
  })

  module.exports = router;
