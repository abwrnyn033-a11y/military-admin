const fs = require('fs').promises;
const path = require('path');
const DATA_FILE = path.join(__dirname, 'data.json');
let cache = null;

async function load() {
  if (cache) return cache;
  try {
    const t = await fs.readFile(DATA_FILE, 'utf8');
    cache = JSON.parse(t);
  } catch (e) {
    cache = { users: [], soldiers: [], finance: [], attendance: [], notifications: [] };
  }
  if (!cache.users) cache.users = [];
  if (!cache.users.find(u => u.username === 'admin')) {
    cache.users.push({ id: '1', username: 'admin', password: 'admin123', role: 'admin', platoon: null });
    await save(cache);
  }
  if (!cache.users.find(u => u.username === 'commander')) {
    cache.users.push({ id: '2', username: 'commander', password: '123456', role: 'commander', platoon: null });
    await save(cache);
  }
  return cache;
}

async function save(d) {
  cache = d;
  await fs.writeFile(DATA_FILE, JSON.stringify(d, null, 2), 'utf8');
}

async function getUserByUsername(username) {
  const data = await load();
  return (data.users || []).find(u => u.username === username);
}

module.exports = { load, save, DATA_FILE, getUserByUsername, getUserById: async (id) => { const data = await load(); return (data.users||[]).find(u=>u.id===id); } };
