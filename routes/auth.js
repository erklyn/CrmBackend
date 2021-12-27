const { createRefreshToken , validateToken, validateAdmin } = require('../controllers/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const express = require('express')

const router  = express.Router()


const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_ROOT_PASSWORD,
    database: process.env.DB_NAME,
});
const promisePool = db.promise();


router.post('/api/auth/register' ,validateToken ,validateAdmin, (req , res ) => {


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
  
router.post('/api/auth/currentUser' , async(req,res) => {
  
        const refreshToken = req.cookies["refresh-token"];
        
        if(refreshToken){
            const decodedToken = await jwt.verify(refreshToken , process.env.JWT_SECRET)
  
            res.send(decodedToken)
        }else{
          res.send(null)
        }
  
  });
  
router.post('/api/auth/login' , async (req,res) => {
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
  
  
router.get("/api/auth/logout", validateToken, (req, res) => {
    res.cookie("refresh-token", '', {maxAge: 0});
  
        res.status(200).json("You logged out successfully.");
  });

module.exports = router