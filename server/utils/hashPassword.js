import bcrypt from 'bcrypt';
import { createLogger } from './logger.js';

const logger = createLogger('HASH-UTIL');

export const hashPassword = async (password) => {
  try {
    logger.info('Hashing password');
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    logger.debug('Password hashed successfully');
    return hash;
  } catch (error) {
    logger.error(`Error hashing password: ${error.message}`);
    throw error;
  }
}

export const verifyPassword = async (password, hashedPassword) => {
  try {
    logger.info('Verifying password');
    const result = await bcrypt.compare(password, hashedPassword);
    logger.debug(`Password verification result: ${result}`);
    return result;
  } catch (error) {
    logger.error(`Error verifying password: ${error.message}`);
    throw error;
  }
}