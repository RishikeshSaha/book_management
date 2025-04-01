const jwt = require("jsonwebtoken");
const authKey = "BookManagementSys";

const verifyToken = (req, res, next) => {
    try {
        let token = req.headers["x-access-token"];

        console.log("TOken : ", token)

        if (!token || token == null || token.trim() == "") {
            return res.status(403).send({ status: 403, message: "Invalid token. Authentication failed", res });
        }

        jwt.verify(token, authKey, (err, decoded) => {

            if (err) {
                return res.status(401).send({ status: 401, message: "Unauthorised", res });
            }

            console.log("Decoded id: ", decoded.userId)
            req.userId = decoded.userId;
            next();
        });
    } catch (error) {
        console.log(error, 'error')
        return res.status(500).send({ status: 401, message: "Server error occurred", res });
    }
};

const authJwt = {
    verifyToken,
};
module.exports = authJwt;
