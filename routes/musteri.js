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



// Read One
router.get('/:id' ,validateToken, (req, res) => {
    const sqlSelect = 'SELECT * FROM musteri WHERE id= "'+req.params.id+'";'
    db.query(sqlSelect , (err , result) => {
      res.send(result)
    });
  });
  
  
  //Read
router.get('/' ,validateToken, (req, res) => {
    const sqlSelect = 'SELECT * FROM musteri ORDER BY firmaAdi ASC'
    db.query(sqlSelect , (err , result) => {
      
      res.send(result)
    })
  })
  
  
  //Get many with Name
router.get('/name/:isim' ,validateToken, (req, res) => {
    const sqlSelect = 'SELECT * FROM musteri WHERE firmaAdi = "'+req.params.isim+'"'
    db.query(sqlSelect , (err , result) => {
      res.send(result)
      
  
    })
  })
  
  //Get many with vehicle Type
router.get('/vehicle/:arac' ,validateToken, (req, res) => {
    const sqlSelect = 'SELECT * FROM musteri WHERE firmaAractipi = "'+req.params.arac+'"'
    db.query(sqlSelect , (err , result) => {
      res.send(result)
      
  
    })
  })
  

//Create
router.post('/' ,validateToken, (req , res ) =>{
  
    const sqlInsert = "INSERT INTO musteri (firmaAdi, firmaIlgilisi , firmaAdresi , firmaMail , firmaSehir , firmaUlke,firmaTelefon,firmaAractipi , temsilciID, temsilciAdi,musteriRisk) VALUES (?,?,?,?,?,?,?,?,?,?,?);"
  
    const firmaAdi = req.body.values.firmaAdi
    const firmaIlgilisi = req.body.values.firmaIlgilisi
    const firmaAdresi = req.body.values.firmaAdresi
    const firmaMail = req.body.values.firmaMail
    const firmaSehir = req.body.values.firmaSehir
    const firmaUlke = req.body.values.firmaUlke
    const firmaAracTipi = req.body.values.firmaAractipi
    const firmaTelefon = req.body.values.firmaTelefon
    const temsilciID = req.body.values.temsilciID
    const temsilciAdi = req.body.values.temsilciAdi
    const musteriRisk = req.body.values.musteriRisk
  
   
    db.query(sqlInsert , [firmaAdi,firmaIlgilisi,firmaAdresi,firmaMail,firmaSehir,firmaUlke,firmaTelefon,firmaAracTipi,temsilciID, temsilciAdi,musteriRisk],(err, result)=>{
      console.log(err)
    });
  })
  
//Update
router.put('/:id' ,validateToken,(req , res) => {
    const sqlInsert = "UPDATE musteri SET firmaAdi = ?, firmaIlgilisi = ?, firmaAdresi = ?, firmaMail = ?, firmaSehir = ?, firmaUlke = ?,firmaTelefon = ?, firmaAractipi = ?, temsilciID = ?, temsilciAdi = ?, musteriRisk = ? WHERE id ="+req.params.id+";"
  
    const firmaAdi = req.body.values.firmaAdi
    const firmaIlgilisi = req.body.values.firmaIlgilisi
    const firmaAdresi = req.body.values.firmaAdresi
    const firmaMail = req.body.values.firmaMail
    const firmaSehir = req.body.values.firmaSehir
    const firmaUlke = req.body.values.firmaUlke
    const firmaAracTipi = req.body.values.firmaAractipi
    const firmaTelefon = req.body.values.firmaTelefon
    const temsilciID = req.body.values.temsilciID
    const temsilciAdi = req.body.values.temsilciAdi
    const musteriRisk = req.body.values.musteriRisk
  
   
    db.query(sqlInsert , [firmaAdi,firmaIlgilisi,firmaAdresi,firmaMail,firmaSehir,firmaUlke,firmaTelefon,firmaAracTipi,temsilciID, temsilciAdi,musteriRisk],(err, result)=>{
        if (err) {
            console.error(err) 
            res.status(500).end()
      }
        res.status(200).send('Başarıyla güncellendi.')
      });
    });


module.exports = router;