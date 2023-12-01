const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const User = require('../models/User')

const saltRounds = 10;

passport.use('register',
new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
async (req, email, password, done) => {
    console.log('Entra');
    try {
    const previousUser =  await User.findOne({email: email});
    //si existe el usuario lanza un error
    if(previousUser) {
        const error = new Error('El usuario está registrado');
        return done(error);
    }
    //si no existe,vamos a encriptar la contraseña antes de guardarla
    const pwdHash = await bcrypt.hash(password, saltRounds)
    const newUser = new User({
        email: email,
        password: pwdHash
    })
    // console.log(newUser);
    const savedUser = await newUser.save();
    // console.log(savedUser);
    done(null, savedUser);
    } catch(err) {
        return done(err);
    }
}
));


passport.use('login', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        try {
            const currentUser = await User.findOne({email: email});
            //si no existe el usuario, error
            if(!currentUser) {
                const error = new Error ('El usuario no existe')
                return done(error)
            }
            //si existe el usuario, vamos a comparar las contraseñas
            const isValidPassword = await bcrypt.compare(
                password,
                currentUser.password
            );
            if(!isValidPassword) {
                const error = new Error ('La contraseña no es válida')
                return done(error)
            } else {
                currentUser.password = null; //no devolver la contraseña, solo el mail
                return done(null, currentUser);
            }
        } catch(error) {
            return done(error)
        }
    }
));

//guarda en la sesion el id del usuario
passport.serializeUser((user, done) => {
    return done(null, user._id)
})

//Buscar el ususario por id en la base de datos y populará el usuario si existe
passport.deserializeUser(async (userId, done) => {
    try {
        const existingUser = await User.findById(userId);
        return done(null, existingUser);
    } catch(err) {
        return done(err);
    }
})