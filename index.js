const Discord = require("discord.js");
const { EmbedBuilder, MessageEmbed } = require("discord.js")
const fs = require("fs");
const db = require('croxydb')
const config = require("./config.json");
const functions = require('./function/functions');
const Rest = require("@discordjs/rest");
const DiscordApi = require("discord-api-types/v10");

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
const loadedCommandNames = new Set(); // Yüklenen komut isimlerini takip etmek için

console.log(`[-] ${fs.readdirSync("./commands").length} komut dosyası algılandı.`)

// Komutları yükleme
for (let commandName of fs.readdirSync("./commands")) {
    if (!commandName.endsWith(".js")) continue;

    try {
        const command = require(`./commands/${commandName}`);
        
        // Gerekli alanların tanımlı olduğunu kontrol et
        if (!command.name || !command.description) {
            console.log(`[x] ${commandName} komutunda name veya description eksik!`);
            continue;
        }

        const commandNameLower = command.name.toLowerCase();
        
        // Komut isminin zaten yüklenip yüklenmediğini kontrol et
        if (loadedCommandNames.has(commandNameLower)) {
            console.log(`[!] "${command.name}" isimli komut zaten yüklenmiş! ${commandName} atlandı.`);
            continue;
        }

        // Komutu kaydet
        loadedCommandNames.add(commandNameLower);
        client.commands.push({
            name: commandNameLower,
            description: command.description,
            options: command.options || [],
            dm_permission: command.dm_permission || false,
            type: command.type || 1
        });

        console.log(`[+] ${commandName} komutu başarıyla yüklendi. (${command.name})`)
    } catch (error) {
        console.log(`[x] ${commandName} komutu yüklenirken hata oluştu:`, error.message);
    }
}

// Mesaj olayları
client.on('messageCreate', msg => {
    if (msg.content === `<@${config["bot-id"]}>`) {
        msg.reply('Birisi Beni Çağırdı Sanırım Komutlarıma `/yardım` ile bakabilirsin  💕');
    }
});

client.on('messageCreate', msg => {
    const content = msg.content.toLowerCase();

    const replies = {
        'sa': 'aleykümselam',
        'naber': 'iyi senden naber',
        'sea': 'aleykümselam',
        'selam': 'aleykümselam',
        'selamun aleyküm': 'aleykümselam',
        'selamunaleyküm': 'aleykümselam',
        'selamunaleykum': 'aleykümselam'
    };

    if (replies[content]) {
        msg.reply(replies[content]);
    }
});

// Event'leri yükleme
console.log(`[-] ${fs.readdirSync("./events").length} olay algılandı.`)

for (let eventName of fs.readdirSync("./events")) {
    if (!eventName.endsWith(".js")) continue;

    try {
        const event = require(`./events/${eventName}`);
        const event_name = eventName.split(".")[0];

        // Event'in run fonksiyonu olduğunu kontrol et
        if (!event.name || !event.run) {
            console.log(`[x] ${eventName} event'inde name veya run fonksiyonu eksik!`);
            continue;
        }

        client.on(event.name, (...args) => {
            event.run(client, ...args)
        });

        console.log(`[+] ${eventName} olayı başarıyla yüklendi.`)
    } catch (error) {
        console.log(`[x] ${eventName} event'i yüklenirken hata oluştu:`, error.message);
    }
}

client.once("ready", async () => {
    const rest = new Rest.REST({ version: "10" }).setToken(config.token);
    try {
        // Komutları Discord API'ye göndermeden önce kontrol et
        console.log(`[-] Discord API'ye ${client.commands.length} komut gönderiliyor...`);
        
        // Benzersiz komutları kontrol et (güvenlik için ikinci bir kontrol)
        const uniqueCommands = [];
        const seenNames = new Set();
        
        for (const cmd of client.commands) {
            if (seenNames.has(cmd.name)) {
                console.log(`[!] API gönderimi öncesi çift komut tespit edildi: ${cmd.name}`);
                continue;
            }
            seenNames.add(cmd.name);
            uniqueCommands.push(cmd);
        }
        
        // Eğer çift komut varsa uyar
        if (client.commands.length !== uniqueCommands.length) {
            console.log(`[!] ${client.commands.length - uniqueCommands.length} çift komut temizlendi.`);
        }
        
        await rest.put(DiscordApi.Routes.applicationCommands(client.user.id), {
            body: uniqueCommands,
        });

        console.log(`${client.user.tag} Aktif! 💕`);
        console.log(`[+] ${uniqueCommands.length} komut başarıyla Discord API'ye gönderildi.`);
        db.set("botAcilis_", Date.now());

    } catch (error) {
        console.error("[x] Komutlar Discord API'ye gönderilirken hata oluştu:", error);
        
        // Hata detaylarını göster
        if (error.rawError && error.rawError.errors) {
            console.log("[!] Hata detayları:", JSON.stringify(error.rawError.errors, null, 2));
        }
    }
});

client.login(config.token).then(() => {
    console.log(`[-] Discord API'ye istek gönderiliyor.`);
    eval("console.clear()")
}).catch((error) => {
    console.log(`[x] Discord API'ye istek gönderimi başarısız:`, error.message);
});

// Komut isimlerini kontrol etmek için yardımcı fonksiyon
client.getDuplicateCommands = function() {
    const commandNames = client.commands.map(cmd => cmd.name);
    const duplicates = commandNames.filter((item, index) => commandNames.indexOf(item) !== index);
    return [...new Set(duplicates)];
}
