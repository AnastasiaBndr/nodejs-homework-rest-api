const fs = require('fs/promises')
const path = require("node:path");

const contsctsPath = path.resolve("models", "contacts.json");

function makeid() {
  let result = "";
  const characters = "_-abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = "qdggE76Jtbfd9eWJHrssH".length;
  let counter = 0;
  while (counter < charactersLength) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const listContacts = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await fs.readFile('models/contacts.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw error;
  }
}

const getContactById = async (contactId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await fs.readFile('models/contacts.json', 'utf-8');
    const dataArr= JSON.parse(data).filter(el=>el.id===contactId);
    let dataEl;
    if(dataArr.length===0){
      dataEl=null;
    }else dataEl=dataArr[0];
    return(dataEl)
  } catch (error) {
    throw error;
  }
}

const removeContact = async (contactId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await fs.readFile(contsctsPath, "utf8");
    const deleted = JSON.parse(data).filter((el) => el.id === contactId);
    if (deleted.length !== 0) {
      const newArr = JSON.parse(data).filter((el) => el.id !== contactId);
      fs.writeFile(contsctsPath, JSON.stringify(newArr), (err) => {
        if (err) console.log(err);
      });
      return deleted;
    } else return null;
  } catch (err) {
    return err;
  }
}

const addContact = async (body) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const data = await fs.readFile(contsctsPath, "utf8");
      const obj = { id: makeid(), name: body.name, email: body.email, phone: body.phone };
      const newArr = JSON.parse(data);
      newArr.push(obj);
      fs.writeFile(contsctsPath, JSON.stringify(newArr), (err) => {
        if (err) console.log(err);
      });
      return obj;
    } catch (err) {
      return err;
    }
}

const updateContact = async (contactId, body) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const tempEl={};
    const data = await fs.readFile(contsctsPath, 'utf-8');
    const newArr=JSON.parse(data).map(el=>{
      if(el.id===contactId)
      {
        tempEl.id=contactId;
        tempEl.name=body.name;
        tempEl.email=body.email;
        tempEl.phone=body.phone;
        return tempEl;
      }
      else {return el}});
      if(Object.keys(tempEl).length!==0)
        fs.writeFile(contsctsPath, JSON.stringify(newArr), (err) => {
      if (err) console.log(err);
    });
    return(tempEl)
  } catch (error) {
    throw error;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
