import type { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import db from '../../models/Revis';
import { User } from '../../context/interfaces';

const bcrypt = require('bcryptjs');

const userLogin = async (req: NextApiRequest, res: NextApiResponse) => {
  const SALT_WORK_FACTOR: number = 10;
  const parsedBody = JSON.parse(req.body);
  const { username, password }: User = parsedBody;

  res.setHeader('Content-Type', 'application/json');
  try {
    const cookies: Cookies = new Cookies(req, res);
    const SQLquery: string = `SELECT * FROM "${process.env.PG_TABLE_USERS}" where username = '${username}';`;
    const { rows } = await db.query(SQLquery);
    const userData: User = rows[0];
    const hashedPassword: string = userData.password;
    const compare: boolean = bcrypt.compareSync(password, hashedPassword);
    if (!compare)
      throw Error('Incorrect username or password. Please try again.');

    const sessionID = bcrypt.hashSync(`${Date.now()}`, SALT_WORK_FACTOR);
    console.log(`User: ${username} logged in`);
    const ONE_HOUR = 1000 * 60 * 60;
    // const SQLquerySession: string = `UPDATE "${process.env.PG_TABLE_USERS}"
    // SET session = '${sessionID}' WHERE username = '${username}';`;
    // await db.query(SQLquerySession);

    cookies.set('session', sessionID, { httpOnly: true, maxAge: ONE_HOUR });
    cookies.set('ssid', `${userData.user_id}`, { httpOnly: true });
    cookies.set('username', `${username}`, { httpOnly: true });
    return res.status(200).json(username);
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      error: 'Incorrect username or password. Please try again.',
    });
  }
};
export default userLogin;
