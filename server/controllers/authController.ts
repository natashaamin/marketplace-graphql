// authController.ts

import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../services/authService';
import { generateToken } from '../utils/util';

interface AuthEvent {
  body: string; // Assuming the event body is a JSON string
}

export const login = async (event: AuthEvent | any) => { // Use "any" as a fallback
  try {
    const requestBody = JSON.parse(event.body || '{}'); // Use an empty object as a default
    const user = findUserByUsername(requestBody.username);

    if (user) {
      const token = generateToken(user);
      return {
        statusCode: 200,
        body: JSON.stringify({ token }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          code: "ACCESS_DENIED",
          message: 'Authentication failed',
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
