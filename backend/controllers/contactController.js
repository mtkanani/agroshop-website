const fs = require('fs');
const path = require('path');

exports.submitContact = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  // Save to a file or database (example: save to a JSON file)
  const contactData = { name, email, message, date: new Date() };
  const filePath = path.join(__dirname, '../data/contacts.json');
  let contacts = [];
  if (fs.existsSync(filePath)) {
    contacts = JSON.parse(fs.readFileSync(filePath));
  }
  contacts.push(contactData);
  fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
  res.json({ message: 'Contact form submitted successfully' });
};