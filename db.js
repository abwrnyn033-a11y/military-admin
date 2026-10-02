const fs = require('fs').promises;
const path = require('path');
const DATA_FILE = path.join(__dirname, 'data.json');
let cache = null;

async function load() {
  if (cache) return cache;
  try {
    const t = await fs.readFile(DATA_FILE, 'utf8');
    cache = JSON.parse(t);
    return cache;
  } catch (e) {
    // لو الملف مش موجود، أنشئ بيانات افتراضية
    cache = {
      users: [
        { id: '1', username: 'admin', password: 'admin123', role: 'admin', platoon: null },
        { id: '2', username: 'commander', password: '123456', role: 'commander', platoon: null }
      ],
      soldiers: [],
      finance: [],
      attendance: [],
      notifications: []
    };
    await save(cache);
    return cache;
  }
}

async function save(d) {
  cache = d;
  await fs.writeFile(DATA_FILE, JSON.stringify(d, null, 2), 'utf8');
}

async function getUserByUsername(username) {
  const data = await load();
  return (data.users || []).find(u => u.username === username);
}

async function getUserByUser(username) {
  return getUserByUsername(username);
}

module.exports = { load, save, DATA_FILE, getUserByUsername, getUserByUser, getUserById: async (id) => { const data = await load(); return (data.users||[]).find(u=>u.id===id); } };
