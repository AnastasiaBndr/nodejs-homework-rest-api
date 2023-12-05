const { Contact } = require("../schema/contact");

const listContacts = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await Contact.find();
    return result;
  } catch (error) {
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await Contact.findById(contactId);
    return data;
  } catch (error) {
    return null;
  }
};

const removeContact = async (contactId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const deleted = await Contact.findByIdAndDelete(contactId);
    return deleted;
  } catch (err) {
    return null;
  }
};

const addContact = async (body) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await Contact.create(body);
    return data;
  } catch (err) {
    return err;
  }
};

const updateContact = async (contactId, body) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await Contact.findByIdAndUpdate(contactId, body);
    return data;
  } catch (error) {
    throw error;
  }
};

const updateStatusContact = async (contactId, body) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  updateStatusContact,
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
