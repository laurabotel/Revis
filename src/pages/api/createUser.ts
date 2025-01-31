import type { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import db from '../../models/Revis';
import { User } from '../../context/interfaces';

const bcrypt = require('bcryptjs');

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  let hashedPassword: string;

  const parsedBody: User = JSON.parse(req.body);
  const { username } = parsedBody;
  const { password } = parsedBody;
  const { email } = parsedBody;

  const SALT_WORK_FACTOR: number = 10;
  try {
    const cookies: Cookies = new Cookies(req, res);
    hashedPassword = await bcrypt.hash(password, SALT_WORK_FACTOR);
    const SQLquery: string = `INSERT INTO "${process.env.PG_TABLE_USERS}" (username,password,email)
         VALUES ('${username}','${hashedPassword}','${email}')
         RETURNING user_id;`;
    const { rows } = await db.query(SQLquery);
    const userID: number = rows[0].user_id;

    cookies.set('ssid', `${userID}`, { httpOnly: true });
    cookies.set('username', `${username}`, { httpOnly: true });
    return res.status(200).json({ success: true });
  } catch (err: any) {
    const { constraint }: { constraint: string } = err;
    switch (constraint) {
      case 'users_username_key':
        return res.status(400).json({
          success: false,
          error:
            'This username is already taken. Please provide a unique username.',
        });

      case 'users_email_key':
        return res.status(400).json({
          success: false,
          error: 'This email is already taken. Please provide a unique email.',
        });

      default:
        return false;
    }
  }
};
export default createUser;
