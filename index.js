const Discord = require("discord.js");
const { EmbedBuilder, REST } = require("discord.js");
const fs = require("fs");
const db = require("croxydb");
const config = require("./config.json");
const { Routes } = require("discord-api-types/v10");

const client = new Discord.Client({
  intents: 3276543,
  partials: Object.values(Discord.Partials),
  allowedMentions: { parse: ["users", "roles", "everyone"] },
  retryLimit: 3
});

global.client = client;
client.commands = [];

/* =======================
   SLASH KOMUT YÜKLEME
======================= */

console.log(`[-] ${fs.readdirSync("./commands").length} komut algılandı.`);

for (const file of fs.readdirSync("./commands")) {
  if (!file.endsWith(".js")) continue;

  const command = require(`./commands/${file}`);

  if (!command.name || !command.description) {
    console.log(`[!] ${file} -> name veya description eksik`);
    continue;
  }

  const name = command.name.toLowerCase();

  // DUPLICATE KONTROLÜ
  if (client.commands.find(cmd => cmd.name === name)) {
    console.log(`❌ Aynı isimli slash komut bulundu: ${name}`);
    continue;
  }

  client.commands.push({
    name,
    description: command.description,
    options: command.options || [],
    dm_permission: false,
    type: 1
  });

  console.log(`[+] ${name} yüklendi`);
}

/* =======================
   MESSAGE COMMANDS
======================= */

client.on("messageCreate", async msg => {
  if (msg.author.bot) return;

  if (msg.content === `<@${config["bot-id"]}>`) {
    msg.reply("Birisi beni çağırdı sanırım 😄 `/yardım` yazabilirsin");
  }

  const replies = {
    sa: "Aleykümselam, hoş geldin!",
    sea: "Aleykümselam, hoş geldin!",
    selam: "Aleykümselam, hoş geldin!",
    "selamun aleyküm": "Aleykümselam, hoş geldin!"
  };

  if (replies[msg.content.toLowerCase()]) {
    msg.reply(replies[msg.content.toLowerCase()]);
  }

  // !sahte
  if (msg.content.startsWith("!sahte")) {
    const user = msg.mentions.users.first();
    if (!user) return msg.reply("Bir kullanıcı etiketle.");

    const text = msg.content.split(" ").slice(2).join(" ");
    await msg.delete().catch(() => {});

    const webhooks = await msg.channel.fetchWebhooks();
    let webhook = webhooks.find(w => w.name === "Taklitçi Bot");

    if (!webhook) {
      webhook = await msg.channel.createWebhook({
        name: "Taklitçi Bot",
        avatar: client.user.displayAvatarURL()
      });
    }

    await webhook.send({
      content: text || "Mesaj yok",
      username: user.username,
      avatarURL: user.displayAvatarURL({ dynamic: true })
    });
  }
});

/* =======================
   EVENTS
======================= */

for (const file of fs.readdirSync("./events")) {
  if (!file.endsWith(".js")) continue;
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.run(client, ...args));
}

/* =======================
   READY
======================= */

client.once("ready", async () => {
  const rest = new REST({ version: "10" }).setToken(config.token);

  try {
    // ❗ ESKİ KOMUTLARI TEMİZLE
    await rest.put(Routes.applicationCommands(client.user.id), { body: [] });

    // ✅ YENİ KOMUTLARI YÜKLE
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: client.commands }
    );

    console.log(`✅ ${client.user.tag} hazır!`);
    db.set("botAcilis_", Date.now());

  } catch (err) {
    console.error("Slash komut yükleme hatası:", err);
  }
});

client.login(config.token);
