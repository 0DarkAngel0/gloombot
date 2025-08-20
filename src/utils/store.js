// Almacenamiento simple por servidor (puedes cambiar a Mongo/Postgres sin tocar comandos).
// Estructura guardada: { [guildId]: { language, ephemeral, theme: { color, footer } } }
import fs from 'node:fs';
import path from 'node:path';
const file = path.join(process.cwd(), 'src', 'data', 'guild-settings.json');

function ensure() {
  if (!fs.existsSync(path.dirname(file))) fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({}, null, 2));
}
export function getGuildSettings(guildId) {
  ensure();
  const all = JSON.parse(fs.readFileSync(file, 'utf8'));
  return all[guildId] || {};
}
export function setGuildSettings(guildId, partial) {
  ensure();
  const all = JSON.parse(fs.readFileSync(file, 'utf8'));
  all[guildId] = { ...(all[guildId] || {}), ...partial };
  fs.writeFileSync(file, JSON.stringify(all, null, 2));
  return all[guildId];
}
