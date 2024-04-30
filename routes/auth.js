import { Router } from 'express';
import jwt from 'jsonwebtoken';
import pkg from 'bcryptjs';
import { getDb, initDb } from '../db.js';

const router = Router();

const { hash, compare } = pkg;
const { sign } = jwt;

const createToken = () => {
  return sign({}, 'secret', { expiresIn: '1h' });
};

router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;

  getDb()
    .db()
    .collection('users')
    .findOne({ email })
    .then(userDoc => {
      return compare(pw, userDoc.password);
    })
    .then((result) => {
      if (!result) {
        throw Error();
      }
      const token = createToken();
      res.status(200).json({ message: 'Authentication succeeded!', token });

    })
    .catch(err => {
      res.status(401).json({ message: 'Authentication failed!' });
    })
    ;
  res
    .status(401)
    .json({ message: 'Authentication failed, invalid username or password.' });
});

router.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;

  hash(pw, 12)
    .then(hashedPW => {

      getDb()
        .db()
        .collection('users')
        .insertOne({
          email,
          password: hashedPW
        })
        .then(result => {
          console.log(result);
          const token = createToken();
          res
            .status(201)
            .json({ token, user: { email } });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: 'Creating a user failed!' });
        });

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Creating the user failed.' });
    });
});

export default router;
