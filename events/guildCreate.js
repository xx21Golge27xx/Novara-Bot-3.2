const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");
const db = require("croxydb");

module.exports = {
    name: Discord.Events.GuildCreate,

    run: async (client, guild) => {
        try {
            // Sunucu sahibinin kara listede olup olmadığını kontrol et
            const karaListe = db.fetch(`karaliste_${guild.ownerId}`);
            if (karaListe) {
                const sebep = karaListe.sebep || "Sebep belirtilmemiş";
                
                // Sunucu sahibine DM mesajı gönder (TEK MESAJ)
                try {
                    const owner = await client.users.fetch(guild.ownerId);
                    await owner.send(`${sebep} sebebiyle Novara’nın kara listesindesin.\n**${guild.name}** sunucusundan çıkıyorum!`);
                } catch (error) {
                    console.error("DM gönderilirken hata oluştu:", error);
                }

                // Log kanalına bildirim gönder (TEK MESAJ)
                try {
                    const logKanal = config["log"];
                    const logChannel = client.channels.cache.get(logKanal);
                    if (logChannel) {
                        logChannel.send(`🛑 **Bot, kara listedeki bir kullanıcının sunucusuna eklendi!**\n\n📌 **Sunucu:** ${guild.name}\n🆔 **Sunucu ID:** ${guild.id}\n👑 **Kurucu:** <@${guild.ownerId}>\n🛑 **Sebep:** ${sebep}\n\n❌ Sunucudan ayrıldı.`);
                    }
                } catch (error) {
                    console.error("Log mesajı gönderilirken hata oluştu:", error);
                }

                // Sunucudan ayrıl
                await guild.leave()
                    .then(() => console.log(`Sunucu ${guild.name} (${guild.id}) kara listeden dolayı çıkarıldı.`))
                    .catch(error => console.error("Sunucudan ayrılırken hata oluştu:", error));

                return;
            }

            // Kara listede değilse log kanalına yeni sunucuya katılım mesajı gönder
            try {
                const kanalId = config["log"];
                const owner = await client.users.fetch(guild.ownerId);
                const channel = client.channels.cache.get(kanalId);
                if (channel) {
                    channel.send(`➕ **Yeni Bir Sunucuya Katıldım!**\n\n📌 **Sunucu:** ${guild.name}\n🆔 **Sunucu ID:** ${guild.id}\n👑 **Kurucu:** ${owner.tag}\n🆔 **Kurucu ID:** ${owner.id}\n👥 **Üye Sayısı:** ${guild.memberCount}\n🌍 **Toplam Sunucu Sayısı:** ${client.guilds.cache.size}`);
                }
            } catch (error) {
                console.error("Sunucu bilgileri çekilirken bir hata oluştu:", error);
            }
        } catch (error) {
            console.error("Bir hata oluştu:", error);
        }
    }
};
