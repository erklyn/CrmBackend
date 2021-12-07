const { json } = require("body-parser");
const { sign, verify } = require("jsonwebtoken");
require('dotenv').config();

const createAccessToken = (user) => {
  const accessToken = sign(
    { adi: user.adi, id: user.id , departman: user.departman  },
    process.env.JWT_SECRET , {
        expiresIn : "5m"
    }
  );

  return accessToken;
};
const createRefreshToken = (user) => {
    const refreshToken = sign(
      { adi: user.adi, id: user.id , departman: user.departman  , isAdmin: user.isAdmin},
      process.env.JWT_SECRET 
    );
  
    return refreshToken;
  };
  

const validateToken = (req, res, next) => {
  
  const accessToken = req.cookies["refresh-token"];
  if(!accessToken) {
    res.status(404).json('No authoraization Key')
  }
  if (accessToken){
    try {
        const validToken = verify(accessToken, process.env.JWT_SECRET);
        if (validToken) {
          req.authenticated = true;
          return next();
        }
      } catch (err) {
        return res.status(400).json({ error: err });
      }
  }else {
    return res.status(400).json({ error: "User not Authenticated!" });
  }
};

const validateAdmin = (req,res,next) => {
  
  const accessToken = req.cookies["refresh-token"];
  if(!accessToken) {
    res.status(404).json('No authoraization Key')
  }
  if (accessToken){
    try {
        const validToken = verify(accessToken, process.env.JWT_SECRET);
        
        if (validToken.isAdmin) {
          req.authenticated = true;
          return next();
        }
      } catch (err) {
        return res.status(400).json({ error: err });
      }
  }else {
    return res.status(400).json({ error: "User not Authenticated!" });
  }
};




module.exports = { createAccessToken, validateToken , createRefreshToken ,validateAdmin};