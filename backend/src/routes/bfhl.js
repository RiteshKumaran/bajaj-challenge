'use strict';

const express = require('express');
const { processData } = require('../services/processor');

const router = express.Router();

const USER_FULL_NAME_NORMALIZED = (process.env.USER_FULL_NAME)
  .toLowerCase()
  .replace(/\s+/g, '');

const USER_ID = `${USER_FULL_NAME_NORMALIZED}_${
  process.env.USER_DOB
}`;
const EMAIL_ID = process.env.USER_EMAIL;
const COLLEGE_ROLL_NUMBER = process.env.USER_ROLL_NUMBER;

router.get('/', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'BFHL API is running.' });
});
router.post('/', (req, res, next) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        error: 'Request body must contain a "data" array.',
      });
    }

    const result = processData(data);

    return res.status(200).json({
      user_id: USER_ID,
      email_id: EMAIL_ID,
      college_roll_number: COLLEGE_ROLL_NUMBER,
      ...result,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
