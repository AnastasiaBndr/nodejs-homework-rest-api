const { Contact } = require("../schema/contact");

const listContacts = async (user) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { _id: owner } = user;
    const result = await Contact.find({ owner });
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

const addContact = async (body, user) => {
  const { _id: owner } = user;
  const contact = await Contact.create({ ...body, owner });
  if (contact) {
    contact.set(body);
    await contact.validate();
    const data = await contact.save();
    return data;
  }
};

const updateContact = async (contactId, body) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
      runValidators: true,
    });
    return data;
  } catch (error) {
    return null;
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
