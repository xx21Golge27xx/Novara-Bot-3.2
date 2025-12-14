const Discord = require("discord.js");
const { EmbedBuilder, REST } = require("discord.js");
const fs = require("fs");
const db = require('croxydb');
const config = require('./config.json'); // config.json dosyasını içe aktar
const { Routes } = require('discord-api-types/v10');

const client = new Discord.Client({
  intents: 3276543,
  partials: Object.values(Discord.Partials),
  allowedMentions: {
    parse: ["users", "roles", "everyone"]
  },
  retryLimit: 3
});

global.client = client;
client.commands = (global.commands = []);

// Komutları yükleme
console.log(`[-] ${fs.readdirSync("./commands").length} komut algılandı.`);
for (let commandName of fs.readdirSync("./commands")) {
  if (!commandName.endsWith(".js")) continue;

  const command = require(`./commands/${commandName}`);
  
  // command.name kontrolü eklendi
  if (command.name) {
    client.commands.push({
      name: command.name.toLowerCase(),
      description: command.description.toLowerCase(),
      options: command.options,
      dm_permission: false,
      type: 1
    });
    console.log(`[+] ${commandName} komutu başarıyla yüklendi.`);
  } else {
    console.error(`[!] ${commandName} komutunda 'name' özelliği eksik!`);
  }
}

// Mesaj dinleyici
client.on('messageCreate', async (msg) => {
  // Bot çağrıldığında yanıt ver
  if (msg.content === `<@${config["bot-id"]}>`) {
    msg.reply('Birisi Beni Çağırdı Sanırım Komutlarıma `/yardım` ile bakabilirsin 💕');
  }

  // Selamlaşma yanıtları
  const content = msg.content.toLowerCase();
  const replies = {
    'sa': 'Aleykümselam, **hoş geldin!**',
    'naber': 'İyi, senden naber? 😃',
    'sea': 'Aleykümselam, **hoş geldin!**',
    'selam': 'Aleykümselam, **hoş geldin!**',
    'selamun aleyküm': 'Aleykümselam, **hoş geldin!**',
    'selamunaleyküm': 'Aleykümselam, **hoş geldin!**',
    'selamunaleykum': 'Aleykümselam, **hoş geldin!**'
  };
  if (replies[content]) {
    msg.reply(replies[content]);
  }

  // Sahte mesaj komutu
  if (msg.content.startsWith('!sahte')) {
    const args = msg.content.split(' ').slice(2); // Mesajı al
    const sahteMesaj = args.join(' ') || 'Sahte mesaj yazılmadı.';
    const etiketlenenKullanici = msg.mentions.users.first(); // Etiketlenen kullanıcıyı al

    if (!etiketlenenKullanici) {
      return msg.reply('Lütfen geçerli bir kullanıcı etiketleyin.');
    }

    // Mesajı sil
    await msg.delete().catch(err => console.error('Mesaj silinemedi:', err));

    // "UYG" rozeti gibi ekleri kaldırmak için kullanıcı adını temizleme
    let temizKullaniciAdi = etiketlenenKullanici.username.replace(/UYG/g, "").trim();

    // Sahte mesajı etiketlenen kullanıcının profil resmi ve adıyla gönder
    const webhooks = await msg.channel.fetchWebhooks();
    let webhook = webhooks.find(wh => wh.name === 'Taklitçi Bot');

    if (!webhook) {
      webhook = await msg.channel.createWebhook({
        name: 'Taklitçi Bot',
        avatar: client.user.displayAvatarURL() // Botun profil fotoğrafı
      });
    }

    // Etiketi kaldırmak için sadece temizlenmiş kullanıcı adını kullanıyoruz
    await webhook.send({
      content: sahteMesaj,
      username: temizKullaniciAdi, // Temizlenmiş kullanıcı adı
      avatarURL: etiketlenenKullanici.displayAvatarURL({ format: "png", dynamic: true }) // Profil fotoğrafı
    });

    console.log(`[+] Sahte mesaj ${temizKullaniciAdi} adıyla gönderildi.`);
  }

  // Taklit mesaj komutu
  if (msg.content.startsWith('/taklit')) {
    const args = msg.content.split(' ').slice(2);
    const taklitMesaj = args.join(' ') || 'Bir mesaj yazılmadı.';
    const etiketlenenKullanici = msg.mentions.users.first();

    if (!etiketlenenKullanici) {
      return msg.reply('Lütfen geçerli bir kullanıcı etiketleyin.');
    }

    // Webhook oluştur ve etiketlenen kullanıcının bilgileriyle mesaj gönder
    const webhooks = await msg.channel.fetchWebhooks();
    let webhook = webhooks.find(wh => wh.name === 'Taklitçi Bot');

    if (!webhook) {
      webhook = await msg.channel.createWebhook({
        name: 'Taklitçi Bot',
        avatar: client.user.displayAvatarURL() // Botun profil fotoğrafı
      });
    }

    await webhook.send({
      username: etiketlenenKullanici.username, // Kullanıcı adı
      avatarURL: etiketlenenKullanici.displayAvatarURL({ format: "png", dynamic: true }), // Profil resmi
      embeds: [
        new EmbedBuilder()
          .setDescription(taklitMesaj)
          .setColor('#00FF00')
          .setFooter({ text: 'Bu bir taklit mesajıdır.' })
      ]
    });

    console.log(`[+] Taklit mesaj ${etiketlenenKullanici.username} adıyla gönderildi.`);
  }
});

// Olayları yükleme
console.log(`[-] ${fs.readdirSync("./events").length} olay algılandı.`);
for (let eventName of fs.readdirSync("./events")) {
  if (!eventName.endsWith(".js")) continue;

  const event = require(`./events/${eventName}`);
  const event_name = eventName.split(".")[0];

  client.on(event.name, (...args) => {
    event.run(client, ...args);
  });

  console.log(`[+] ${eventName} olayı başarıyla yüklendi.`);
}

// Bot hazır olduğunda çalışacak kodlar
client.once("ready", async () => {
  const rest = new REST({ version: '10' }).setToken(config.token);

  try {
    // Komutları Discord API'ye yükleme
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands,
    });


    console.log(`${client.user.tag} | Hazırım! ⚡🚀`);
    db.set("botAcilis_", Date.now());

    // Sunucudan çıkış işlemi
    client.guilds.cache.forEach(guild => {
    });

    const guild = client.guilds.cache.get("973119341757333504");
    if (guild) {
      guild.leave()
        .then(() => console.log(`Başarıyla ${guild.name} sunucusundan çıkıldı.`))
        .catch(err => console.error('Sunucudan çıkarken bir hata oluştu:', err));
    } else {
      console.log('Belirtilen sunucu bulunamadı.');
    }
  } catch (error) {
    console.error("Bot hazır olurken bir hata oluştu:", error);
  }
});

client.login(config.token).then(() => {
  console.log(`[-] Discord API'ye istek gönderiliyor.`);
}).catch(() => {
  console.log(`[x] Discord API'ye istek gönderimi başarısız(token girmeyi unutmuşsun).`);
});
