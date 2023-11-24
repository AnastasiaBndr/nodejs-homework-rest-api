const express = require('express')
const Joi = require('joi')

const contacts = require('../../models/contacts.js')
const router = express.Router()

router.get('/', async (req, res, next) => {
  res.status(200).json(await contacts.listContacts())

})

router.get('/:contactId', async (req, res, next) => {
    const contact=await contacts.getContactById(req.params.contactId);
  if(contact)
    res.status(200).json(contact)
  else{
    res.status(404).json({ message: 'Not Found!' })

}})

router.post('/', async (req, res, next) => {
  try{
    const {error}=addSchema.validate(req.body);
    if(error){
      res.status(400).json(error.message)
    }
      else{
        const result=await contacts.addContact(req.body);
      res.status(201).json(result);
    }
    
  }catch(err){
    next(err)
  }
})

router.delete('/:contactId', async (req, res, next) => {

    const contact=await contacts.removeContact(req.params.contactId);
  if(contact)
    res.status(200).json({message: "contact deleted!"})
  else{
    res.status(404).json({ message: 'Not Found!' })
  }

})

const addSchema=Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
})

router.put('/:contactId', async (req, res, next) => {
  try{

    const {error}=addSchema.validate(req.body);
    if(error){
      res.status(400).json(error.message)
    }
      else{
        const result=await contacts.updateContact(req.params.contactId,req.body);
        if(Object.keys(result).length!==0)
          res.status(200).json(result);
        else res.status(404).json({message: "Not found!"})
    }
    
  }catch(err){
    next(err)
  }
})

module.exports = router
