const validator = require('validator');


const validateSignUp = (req) => {
    const { first_name, email, password } = req.body;
    if (!first_name || first_name.length < 3 || first_name.length > 30) {
        throw new Error('First name must be between 3 and 30 characters');
    }
    if (!email || !validator.isEmail(email)) {
        throw new Error('Email is required');
    }
}
module.exports = { validateSignUp }
