const express = require('express');
const { createContact, getAllContacts, getContactById, deleteContactById } = require('./contractUs.controller');

const router = express.Router();

router.post('/create-contract', createContact);
router.get('/get-all', getAllContacts);
router.get('/single-contract/:id', getContactById);
router.delete('/delete-contract/:id', deleteContactById);

module.exports = router;

