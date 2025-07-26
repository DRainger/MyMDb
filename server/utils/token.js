import jwt from 'jsonwebtoken';
import {config} from '../config/index.js';
import { createLogger } from './logger.js';

const logger = createLogger('TOKEN-UTIL');

export const createToken = async (payload, expiresIn = '24h') => {
    try {
        logger.info('Creating new JWT token');
        const token = await jwt.sign(payload, config.jwtSecret, { expiresIn });
        logger.debug(`Token created successfully with expiry ${expiresIn}`);
        return token;
    } catch (error) {
        logger.error(`Error creating token: ${error.message}`);
        throw error;
    }
}

export const verifyToken = async(token) => {
    try {
        logger.info('Verifying JWT token');
        const decoded = await jwt.verify(token, config.jwtSecret);
        logger.debug('Token verified successfully');
        return decoded;
    } catch (error) {
        logger.error(`Error verifying token: ${error.message}`);
        throw error;
    }
}