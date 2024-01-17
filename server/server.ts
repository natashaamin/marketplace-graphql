import express, { Application } from 'express';
import session from 'express-session';
import passport, { AuthenticateCallback } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as CustomStrategy } from 'passport-custom';
import bodyParser from 'body-parser';
import authRoute from './routes/authRoute';
import marketRoute from './routes/marketRoute';
import * as authService from './services/authService';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { generateToken, verifySignature } from './utils/util';

const app: Application = express();

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'yourSecretKey',
};

passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = authService.findUserByUsername(username);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect username or password' });
        }
        return done(null, user);
    }
));

passport.use(new JwtStrategy(jwtOptions, (jwtPayload: any, done: AuthenticateCallback) => {
    const user = authService.findUserByUsername(jwtPayload.username);
    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
    }
}));

passport.use('keplr', new CustomStrategy((req, done) => {
    const { walletAddress } = req.body;

    const isValid = walletAddress && verifySignature(walletAddress);

    if (isValid) {
        done(null, { walletAddress });
    } else {
        done(null, false);
    }
}));



passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => {
    if (user.username) {
        const getUser = authService.findUserByUsername(user.username);
        if (getUser) {
            done(null, user);
        } else {
            done(new Error('User not found'), null);
        }
    } else if (user.walletAddress) {
        done(null, user);
    }
});

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret', resave: false, saveUninitialized: false, cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoute);
app.use('/api/marketplace', marketRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));