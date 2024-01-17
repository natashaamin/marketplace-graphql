import jwt from 'jsonwebtoken';
import { IMarketItems } from '../services/marktetService';

const generateDummyItems = () => {
    const times: IMarketItems[] = [];
    const pricePerMWhBase = 50;
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 5) { 
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const pricePerMWh = pricePerMWhBase + Math.random() * 10;

            times.push({ time: timeString, pricePerMWh: pricePerMWh });
        }
    }
    return times;
};

const generateToken = (user: any) => {
    const payload = {
        userId: user.id, 
        username: user.username
    };

    return jwt.sign(payload, 'yourSecretKey', { expiresIn: '1h' });
};

const waitTimePromise = async(time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, time)
    })
}

const verifySignature = (walletAddress: any) => {
    return true;
}

export {
    generateDummyItems,
    generateToken,
    waitTimePromise,
    verifySignature
}