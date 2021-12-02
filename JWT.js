const { sign , verify }  = require('jsonwebtoken');

const createToken = (user) => {
    const token = sign({
        userDepartman: user.departman,
        userName: user.adi,
        userSurname: user.soyadi,
        userID: user.id,
        userMail: user.mail
    }, "changethisonproduction" );

    return token;
}

module.exports = { createToken };