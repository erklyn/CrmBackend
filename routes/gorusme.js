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


router.post('/' ,validateToken,(req , res) => {
    const sqlInsertGorusme = "INSERT INTO gorusme (tarih , konusu , ozet ,musteriID , temsilciID ,temsilciAdi ,aracTipi) VALUES (?,?,?,?,?,?,?);"
  
    const tarih = req.body.values.gorusmeTarihi
    const konusu = req.body.values.gorusmeKonusu
    const ozet = req.body.values.gorusmeOzeti
    const musteriID = req.body.values.musteriID
    const temsilciID = req.body.values.temsilciID
    const temsilciAdi = req.body.values.temsilciAdi
    const aracTipi = req.body.values.aractipi
  
  
    db.query(sqlInsertGorusme , [tarih , konusu , ozet ,musteriID,temsilciID,temsilciAdi,aracTipi],(err, result)=>{
        if (err) {
            console.error(err) 
            res.status(500).end()
      }
        res.status(201).send('Başarıyla Oluşturuldu.')
      });
    });

  

  // GÖRÜŞMELERİ ÇEKME
router.get('/createdBy/:id' ,validateToken, (req, res) => {
    const sqlSelect = 'SELECT * FROM gorusme WHERE musteriID = "'+req.params.id+'"'
    db.query(sqlSelect , (err , result) => {
      res.send(result)
      
    })
  })
  
  
  // TEK GORUSME ÇEKME
router.get('/:id' ,validateToken, (req, res) => {
    const sqlSelect = 'SELECT * FROM gorusme WHERE id = "'+req.params.id+'"'
    db.query(sqlSelect , (err , result) => {
      res.send(result)
      
    })
  })
  
  // Anasayfa Görüşme
router.get('/main' ,validateToken, (req, res) => {
    const sqlSelect = 'SELECT * FROM gorusme ORDER BY tarih DESC LIMIT 20 '
    db.query(sqlSelect , (err , result) => {
      res.send(result)
      
    })
  })

module.exports = router;
