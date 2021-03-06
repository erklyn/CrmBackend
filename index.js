const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { createRefreshToken , validateToken, validateAdmin } = require('./controllers/auth');
const jwt = require('jsonwebtoken')
const morgan = require('morgan');
require('dotenv').config();

//SERVER CONFİG
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_ROOT_PASSWORD,
    database: process.env.DB_NAME,
});
const promisePool = db.promise();
// API'IN KULLANDIĞI MODULLER

app.use(cors({
  origin:['http://192.168.135.126','http://localhost:3000'],
  preflightContinue: true,
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser({
  proxy : true 
}));
app.use(morgan('dev'))



// ------------------------------------------ DATA OKUMA -------------------------------------- \\





// TEK MÜŞTERİ QUERY


app.get('/api/musteri/:id' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE id= "'+req.params.id+'";'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
  });
});


// TEKLİF QUERY 

app.get('/api/teklif/main' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM teklif ORDER BY teklifTarih DESC LIMIT 20 ;'
  
  db.query(sqlSelect , (err , result) => {
    res.send(result)
  });
});


//TEKLİF QUERY WİTH MUSTERİ ID 
app.get('/api/teklif/belong/:id' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM teklif WHERE musteriID= "'+req.params.id+'";'
  
  db.query(sqlSelect , (err , result) => {
    res.send(result)
  });
});
//TAMAMLANMAMIŞ VEYA RED TEKLİFLER 
app.get('/api/teklif/red' ,validateToken, (req, res) => {
  
  const sqlSelect = 'SELECT * FROM teklif WHERE durum IN ("Beklemede" , "Red") ORDER BY teklifTarih DESC LIMIT 20'
  
  db.query(sqlSelect , (err , result) => {
    
    res.send(result)
  });
});
//TEKLİF QUERY WİTH ID
app.get('/api/teklif/:id' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM teklif WHERE id = "'+req.params.id+'";'
  
  db.query(sqlSelect , (err , result) => {
    res.send(result)
  });
});


// TÜM MÜŞTERİLERİ ÇEKME

app.get('/api/musteri' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri ORDER BY firmaAdi ASC'
  db.query(sqlSelect , (err , result) => {
    
    res.send(result)
  })
})





//MÜŞTERİ ADINA GÖRE
app.get('/api/musteri/name/:isim' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE firmaAdi = "'+req.params.isim+'"'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    

  })
})



// TEMSİLCİ ÇEKME 
app.get('/api/temsilci/:id' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM temsilci WHERE id = "'+req.params.id+'"'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    

  })
})

// GÖRÜŞMELERİ ÇEKME
app.get('/api/gorusme/belong/:id' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM gorusme WHERE musteriID = "'+req.params.id+'"'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    
  })
})
// TEK MÜŞTERİ ÇEKME
app.get('/api/gorusme/:id' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM gorusme WHERE id = "'+req.params.id+'"'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    
  })
})

// GÖRÜŞMELERİ TARİHE GÖRE ÇEKME

app.get('/api/homepage/main' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM gorusme ORDER BY id DESC LIMIT 20 ;'
  
  db.query(sqlSelect , (err , result) => {
    res.send(result)
  });
});





// ------------------------------------------- DATA YAZMA ----------------------------------------- \\


// YENİ MÜŞTERİ EKLEME
app.post('/api/musteri' ,validateToken, (req , res ) =>{
  
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

app.post('/api/teklif' ,validateToken, (req , res ) => {
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
    console.log(err)
  });
})





app.post('/api/gorusme' ,validateToken,(req , res) => {
  const sqlInsertGorusme = "INSERT INTO gorusme (tarih , konusu , ozet ,musteriID , temsilciID ,temsilciAdi ,aracTipi) VALUES (?,?,?,?,?,?,?);"

  const tarih = req.body.values.gorusmeTarihi
  const konusu = req.body.values.gorusmeKonusu
  const ozet = req.body.values.gorusmeOzeti
  const musteriID = req.body.values.musteriID
  const temsilciID = req.body.values.temsilciID
  const temsilciAdi = req.body.values.temsilciAdi
  const aracTipi = req.body.values.aractipi


  db.query(sqlInsertGorusme , [tarih , konusu , ozet ,musteriID,temsilciID,temsilciAdi,aracTipi],(err, result)=>{
    console.log(err)
  });

})

app.put('/api/musteri/:id' ,validateToken,(req , res) => {
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
    console.log(err)
  });

})




// SERVER PORT
app.listen(process.env.PORT || 3001 , () => {
    console.log("Working on port 3001");
})


//----------------------- AUTH RELATED --------------------\\



app.post('/api/auth/register' ,validateAdmin, (req , res ) => {


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

app.post('/api/auth/currentUser' , async(req,res) => {

      const refreshToken = req.cookies["refresh-token"];
      
      if(refreshToken){
          const decodedToken = await jwt.verify(refreshToken , process.env.JWT_SECRET)

          res.send(decodedToken)
      }else{
        res.send(null)
      }

});

app.post('/api/auth/login' , async (req,res) => {
  const { username , password } = req.body.values;
  const sqlSelect = 'SELECT * FROM temsilci WHERE username ="'+username+'";'
  let [user , fields] = await promisePool.query(sqlSelect);

  const activeUser = user[0];  

   if (!activeUser){
    res.status(400).json({error: 'Böyle bir kullanıcı yok!'})
   }

    const dbPassword = user[0].password
      bcrypt.compare(password ,dbPassword).then((match)=> {
        if(match) {
          const refreshToken = createRefreshToken(activeUser);
          res.cookie("refresh-token", refreshToken, {
            maxAge: 60 * 60 * 24 * 30 * 1000,
            httpOnly: true,
          });
          res.status(200).json({
            username: activeUser.username,
            id: activeUser.id,
            departman: activeUser.departman,
            isAdmin: activeUser.isAdmin
          })


          
        }else {
          res.status(400)
          .json({
            error: 'Hatalı şifre!'
          })
          
        }
      });
      
    });


app.get("/api/auth/logout", validateToken, (req, res) => {
  res.cookie("refresh-token", '', {maxAge: 0});

      res.status(200).json("You logged out successfully.");
});