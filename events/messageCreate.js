const db = require("croxydb");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "messageCreate",
    once: false,
    run: async (client, message) => {
        try {
            if (message.author.bot || !message.guild) return;

            // Seviye ve XP Sistemi
            const xp = db.fetch(`xpPos_${message.author.id}${message.guild.id}`) || 0;
            const levellog = db.fetch(`level_log_${message.guild.id}`);
            const level = db.fetch(`levelPos_${message.author.id}${message.guild.id}`) || 0;
            const acikmi = db.fetch(`acikmiLevel_${message.guild.id}`) ? true : false;

            if (acikmi) {
                const xpForLevel = 100; // Her seviyeye geçmek için gereken XP miktarı
                if (xp >= xpForLevel) {
                    db.subtract(`xpPos_${message.author.id}${message.guild.id}`, xp);
                    db.add(`levelPos_${message.author.id}${message.guild.id}`, 1);

                    const yeniSeviye = level + 1;

                    // Bar oranını seviye ile eşleştiriyoruz
                    const maxBar = 10;
                    const doluBar = Math.min(yeniSeviye, maxBar); // Barın dolduğu yer
                    const bosBar = maxBar - doluBar; // Barın boş kalan kısmı
                    const progressBar = "█".repeat(doluBar) + "░".repeat(bosBar); // İlerleme barı

                    const embed = new EmbedBuilder()
                        .setColor("#FFD700")
                        .setTitle("📈 Seviye Atladın!")
                        .setDescription(`${message.author}, GG! Yeni seviyene ulaştın!`)
                        .addFields(
                            { name: "📊 Yeni Seviyen", value: `**${yeniSeviye}**`, inline: true },
                            { name: "🔹 İlerleme", value: `\`${progressBar}\``, inline: false }
                        )
                        .setImage("https://media.discordapp.net/attachments/1340767365545328803/1355533043229659177/standard_4.gif");

                    client.channels.cache.get(levellog)?.send({ embeds: [embed] });
                } else {
                    db.add(`xpPos_${message.author.id}${message.guild.id}`, 1);
                }
            }

            // Her 100 mesajda bir tebrik mesajı gönderme
            const mesajSayisi = db.fetch(`mesajSayisi_${message.author.id}${message.guild.id}`) || 0;
            if (mesajSayisi > 0 && mesajSayisi % 100 === 0) {
                const embed = new EmbedBuilder()
                    .setColor("#FFD700")
                    .setTitle("✨ Tebrikler!")
                    .setDescription(`${message.author}, toplamda **${mesajSayisi} mesaja** ulaştın. 🎉`)
                    .setThumbnail(message.author.displayAvatarURL())
                    .addFields(
                        { name: "🎁 Kutuyu Aç!", value: "Kutunu açmak için `d!kutuaç` yazabilirsin. İyi şanslar!" }
                    );

                // Kullanıcıya DM olarak mesaj gönder
                message.author.send({ embeds: [embed] }).catch(() => {
                    // DM'ler kapalıysa, kanal üzerinden mesaj at
                    message.channel.send({ embeds: [embed] });
                });
            }

            // Mesaj sayısını güncelle
            db.add(`mesajSayisi_${message.author.id}${message.guild.id}`, 1);

            // AFK Sistemi
            if (await db.get(`afk_${message.author.id}`)) {
                const afkDate = db.fetch(`afkDate_${message.author.id}`);
                const sebep = db.fetch(`afk_${message.author.id}`);

                if (afkDate && sebep) {
                    const date = `${message.author} Hoş geldin! **${sebep}** sebebiyle <t:${parseInt(afkDate.date / 1000)}:R> afk'ydın`;
                    db.delete(`afk_${message.author.id}`);
                    db.delete(`afkDate_${message.author.id}`);
                    message.reply(date);
                }
            }

            const kullanıcı = message.mentions.users.first();
            if (kullanıcı) {
                const afkDate = db.fetch(`afkDate_${kullanıcı.id}`);
                const sebep = await db.get(`afk_${kullanıcı.id}`);

                if (sebep) {
                    const sebeps = `❔ | Etiketlediğin kullanıcı **${sebep}** sebebiyle afk modunda!`;
                    message.reply(sebeps);
                }
            }

            // Küfür Filtresi
            const kufur = db.fetch(`kufurengel_${message.guild.id}`);
            if (kufur) {
                const kufurler = ["sikik", "sikeyim", "piç", "yarrak", "oç", "göt", "orospu", "sikim", "sikeyim", "oruspu çocugu", "ailen oç"];
                if (kufurler.some(word => message.content.toLowerCase().includes(word))) {
                    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                        message.delete();
                        const embed = new EmbedBuilder()
                            .setTitle(`❗ **UYARI!**`)
                            .setDescription(`✋ | ${message.author}, Küfür etmeye devam edersen banlanacaksın!`)
                            .setColor("RED");
                        message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 5000));
                    }
                }
            }

            // Reklam Engelleme
            const reklamlar = db.fetch(`reklamengel_${message.guild.id}`);
            if (reklamlar) {
                const linkler = [".com.tr", ".net", ".org", ".tk", ".cf", ".gf", "https://", ".gq", "http://", ".com", ".gg"];
                if (linkler.some(alo => message.content.toLowerCase().includes(alo))) {
                    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                        message.delete();
                        const embed = new EmbedBuilder()
                            .setTitle(`❗ **UYARI!**`)
                            .setDescription(`✋ | ${message.author}, Reklam atmaya devam edersen banlanacaksın!`)
                            .setColor("RED");
                        message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 5000));
                    }
                }
            }

            // Yasaklı Kelime Engelleme
            const data = db.fetch(`yasaklı_kelime_${message.guild.id}`);
            if (data) {
                if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    const mesajIcerigi = message.content.toLowerCase();
                    const yasakliKelimeler = data.map(kelime => kelime.toLowerCase());
                    for (const kelime of yasakliKelimeler) {
                        if (mesajIcerigi.includes(kelime)) {
                            message.delete();
                            const embed = new EmbedBuilder()
                                .setTitle(`❗ **UYARI!**`)
                                .setDescription(`✋ | ${message.author}, Yasaklı Kelime Kullanmayınız!`)
                                .setColor("RED");
                            message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 5000));
                            break;
                        }
                    }
                }
            }

        } catch (err) {
            console.error('Bir hata oluştu:', err);
        }
    }
};
