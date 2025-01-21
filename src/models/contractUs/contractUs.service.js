const Contact = require('./contractUs.model');

// Create a new contact
const createContactDB = async (contactData) => {
  const contact = new Contact(contactData);
  return await contact.save();
};

// Get all contacts (excluding deleted ones)
const getAllContactsDB = async () => {
  return await Contact.find({ isDeleted: false });
};

// Get a single contact by ID
const getContactByIdDB = async (id) => {
  return await Contact.findById(id);
};

// Soft delete a contact by ID
const deleteContactByIdDB = async (id) => {
  return await Contact.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

module.exports = {
  createContactDB,
  getAllContactsDB,
  getContactByIdDB,
  deleteContactByIdDB,
};
