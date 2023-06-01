const jwt = require("jsonwebtoken");

const generarJWT = (id_usuario) => {
    return new Promise((resolve, reject) => {
        const payload = { id_usuario };

        jwt.sign(
            payload,
            process.env.SECRET_KEY,
            { expiresIn: '2h' },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se pudo generar el token');

                } else {
                    resolve(token);
                }
            }
        )
    });
};

module.exports = {
    generarJWT
}