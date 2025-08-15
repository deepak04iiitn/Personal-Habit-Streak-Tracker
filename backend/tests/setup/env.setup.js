import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

if(!process.env.JWT_SECRET) 
{
  process.env.JWT_SECRET = 'test-secret-key-for-testing';
}