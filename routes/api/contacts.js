const express = require('express')

const router = express.Router() 
const cntrl = require("../../controllers/contactControllers")
const { validate } = require("../../validate/validate")
const schema = require("../../schema")

router.get('/', cntrl.getAll);

router.get('/:id', cntrl.getContactById)

router.post('/',validate(schema.addShcema), cntrl.addContact)

router.delete('/:id', cntrl.removeContact)

router.put('/:id',validate(schema.addShcema), cntrl.updateContact)

module.exports = router