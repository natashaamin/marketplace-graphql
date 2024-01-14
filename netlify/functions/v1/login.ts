// netlify/functions/login.ts

import { Handler } from '@netlify/functions';
import passport from 'passport';
import * as authController from '../../../server/controllers/authController';

const handler: Handler = async (event, context) => {
  try {
    const authResult = await authController.login(event);

    return {
      statusCode: 200, 
      body: JSON.stringify(authResult),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

export { handler };
