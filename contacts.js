const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "db", "contacts.json");

/**
 * Pobiera całą listę kontaktów z pliku contacts.json.
 * @returns {Promise<Array>} Obietnica, która zwraca tablicę kontaktów.
 */
async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Błąd podczas odczytu kontaktów:", error);
  }
}

/**
 * Pobiera kontakt na podstawie jego ID.
 * @param {string} contactId - ID kontaktu do pobrania.
 * @returns {Promise<Object|null>} Obietnica, która zwraca obiekt kontaktu, jeśli znaleziony, w przeciwnym razie null.
 */
async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact || null;
  } catch (error) {
    console.error("Błąd podczas pobierania kontaktu po ID:", error);
  }
}

/**
 * Usuwa kontakt na podstawie jego ID.
 * @param {string} contactId - ID kontaktu do usunięcia.
 * @returns {Promise<Object|null>} Obietnica, która zwraca usunięty obiekt kontaktu, jeśli znaleziony i usunięty, w przeciwnym razie null.
 */
async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);

    if (index === -1) {
      return null;
    }

    const [removedContact] = contacts.splice(index, 1);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact;
  } catch (error) {
    console.error("Błąd podczas usuwania kontaktu:", error);
  }
}

/**
 * Dodaje nowy kontakt do pliku contacts.json.
 * @param {string} name - Imię nowego kontaktu.
 * @param {string} email - Adres e-mail nowego kontaktu.
 * @param {string} phone - Numer telefonu nowego kontaktu.
 * @returns {Promise<Object>} Obietnica, która zwraca obiekt dodanego kontaktu.
 */
async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();

    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      phone,
    };

    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    console.error("Błąd podczas dodawania kontaktu:", error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
