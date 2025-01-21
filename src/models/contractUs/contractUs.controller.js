const sendResponse = require('../../utils/responseHelper');
const contactService = require('./contractUs.service');

// Create a new contact
const createContact = async (req, res) => {
  try {
    const contact = await contactService.createContactDB(req.body);
    sendResponse(res, 201, 'Contact created successfully', contact);
  } catch (error) {
    sendResponse(res, 400, error.message);
  }
};

// Get all contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactService.getAllContactsDB();
    sendResponse(res, 200, 'All contacts', contacts);
  } catch (error) {
   sendResponse(res, 400, error.message);
  }
};

// Get a single contact
const getContactById = async (req, res) => {
  try {
    const contact = await contactService.getContactByIdDB(req.params.id);
    if (!contact || contact.isDeleted) {
     return sendResponse(res, 404, 'Contact not found');
    }
    sendResponse(res, 200, 'Contact found', contact);
  } catch (error) {
   sendResponse(res, 400, error.message);
  }
};

// Soft delete a contact
const deleteContactById = async (req, res) => {
  try {
    const contact = await contactService.deleteContactByIdDB(req.params.id);
    if (!contact) {
     return sendResponse(res, 404, 'Contact not found');
    }
    sendResponse(res, 200, 'Contact deleted successfully', contact);
  } catch (error) {
   sendResponse(res, 400, error.message);
  }
};


module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  deleteContactById,
};
