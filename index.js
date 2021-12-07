const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { createRefreshToken , validateToken, validateAdmin } = require('./controllers/auth');
const jwt = require('jsonwebtoken')
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
  origin:'127.0.0.1:3000',
  preflightContinue: true,
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());


// ------------------------------------------ DATA OKUMA -------------------------------------- \\





// TEK MÜŞTERİ QUERY


app.get('/api/musteriler/:id' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE id= "'+req.params.id+'";'
  
  db.query(sqlSelect , (err , result) => {
    res.send(result)
  });
});


// TEKLİF QUERY 

app.get('/api/get/teklifler/' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM teklif ORDER BY teklifTarih DESC LIMIT 20 ;'
  
  db.query(sqlSelect , (err , result) => {
    res.send(result)
  });
});


//TEKLİF QUERY WİTH MUSTERİ ID 
app.get('/api/get/teklif/:id' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM teklif WHERE musteriID= "'+req.params.id+'";'
  
  db.query(sqlSelect , (err , result) => {
    res.send(result)
  });
});
//TAMAMLANMAMIŞ VEYA RED TEKLİFLER 
app.get('/api/get/teklifRed' ,validateToken, (req, res) => {
  
  const sqlSelect = 'SELECT * FROM teklif WHERE durum IN ("Beklemede" , "Red") ORDER BY teklifTarih DESC LIMIT 20'
  
  db.query(sqlSelect , (err , result) => {
    
    res.send(result)
  });
});
//TEKLİF QUERY WİTH ID
app.get('/api/get/tekteklif/:id' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM teklif WHERE id = "'+req.params.id+'";'
  
  db.query(sqlSelect , (err , result) => {
    res.send(result)
  });
});


// TÜM MÜŞTERİLERİ ÇEKME

app.get('/api/get' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri ORDER BY firmaAdi ASC'
  db.query(sqlSelect , (err , result) => {
    
    res.send(result)
  })
})



//MÜŞTERİ ŞEHRİNE GÖRE
app.get('/api/get/firmaSehir/:sehir' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE firmaSehir = "'+req.params.sehir+'"';
  db.query(sqlSelect , (err , result) => {
    res.send(result)
   
  })
})

//MÜŞTERİ ADINA GÖRE
app.get('/api/get/firmaAdi/:isim' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE firmaAdi = "'+req.params.isim+'"'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    

  })
})

//MÜŞTERİ ARAÇ TİPİNE GÖRE
app.get('/api/get/firmaAractipi/:arac' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM musteri WHERE firmaAractipi = "'+req.params.arac+'"'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    

  })
})

// TEMSİLCİ ÇEKME 
app.get('/api/get/temsilci/:id' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM temsilci WHERE id = "'+req.params.id+'"'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    

  })
})

// GÖRÜŞMELERİ ÇEKME
app.get('/api/get/gorusme/:id' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM gorusme WHERE musteriID = "'+req.params.id+'"'
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    
  })
})

// GÖRÜŞMELERİ TARİHE GÖRE ÇEKME
app.get('/api/get/gorusmeler' ,validateToken, (req, res) => {
  const sqlSelect = 'SELECT * FROM gorusme ORDER BY tarih DESC LIMIT 20 '
  db.query(sqlSelect , (err , result) => {
    res.send(result)
    
  })
})






// ------------------------------------------- DATA YAZMA ----------------------------------------- \\


// YENİ MÜŞTERİ EKLEME
app.post('/api/insert/musteri' ,validateToken, (req , res ) =>{
  
  const sqlInsert = "INSERT INTO musteri (firmaAdi, firmaIlgilisi , firmaAdresi , firmaMail , firmaSehir , firmaUlke,firmaTelefon,firmaAractipi , temsilciID, temsilciAdi) VALUES (?,?,?,?,?,?,?,?,?,?);"

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

 
  db.query(sqlInsert , [firmaAdi,firmaIlgilisi,firmaAdresi,firmaMail,firmaSehir,firmaUlke,firmaTelefon,firmaAracTipi,temsilciID, temsilciAdi],(err, result)=>{
    console.log(err)
  });
})

app.post('/api/insert/teklif' ,validateToken, (req , res ) => {
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





app.post('/api/insert/gorusme' ,validateToken,(req , res) => {
  const sqlInsertGorusme = "INSERT INTO gorusme (tarih , konusu , ozet ,musteriID , temsilciID ,temsilciAdi) VALUES (?,?,?,?,?,?);"

  const tarih = req.body.values.gorusmeTarihi
  const konusu = req.body.values.gorusmeKonusu
  const ozet = req.body.values.gorusmeOzeti
  const musteriID = req.body.values.musteriID
  const temsilciID = req.body.values.temsilciID
  const temsilciAdi = req.body.values.temsilciAdi


  db.query(sqlInsertGorusme , [tarih , konusu , ozet ,musteriID,temsilciID,temsilciAdi],(err, result)=>{
    console.log(err)
  });

})




// SERVER PORT
app.listen(process.env.PORT || 3001 , () => {
    console.log("Working on port 3001");
})


//----------------------- AUTH RELATED --------------------\\



app.post('/auth/register' ,validateAdmin, (req , res ) => {


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

app.post('/auth/currentUser' , async(req,res) => {

      const refreshToken = req.cookies["refresh-token"];
      
      if(refreshToken){
          const decodedToken = await jwt.verify(refreshToken , process.env.JWT_SECRET)

          res.send(decodedToken)
      }else{
        res.send(null)
      }

});

app.post('/auth/login' , async (req,res) => {
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


app.get("/auth/logout", validateToken, (req, res) => {
  res.cookie("refresh-token", '', {maxAge: 0});

      res.status(200).json("You logged out successfully.");
});