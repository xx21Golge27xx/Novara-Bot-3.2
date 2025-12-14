const Discord = require("discord.js");
const db = require("croxydb");
const config = require("../config.json"); 

module.exports = {
    name: "guildMemberRemove",
    run: async (client, member) => {
        try {
            // Hoş Geldin / Güle Güle (HG/BB) sistemi
            const hgbb1 = db.fetch(`hgbb1_${member.guild.id}`);
            const sayacmessage = db.fetch(`sayacmessage_${member.guild.id}`);
            
            if (hgbb1) {
                const kanal = member.guild.channels.cache.find(c => c.id === hgbb1.channel);
                
                if (kanal) {
                    if (sayacmessage) {
                        // Özel ayrılma mesajı
                        const cikismesaj = sayacmessage.leaveMsg
                            .replace("{guild.memberCount}", `${member.guild.memberCount}`)
                            .replace("{guild.name}", `${member.guild.name}`)
                            .replace("{owner.name}", `<@${member.guild.ownerId}>`)
                            .replace("{member}", `<@${member.user.id}>`);
                        
                        const cikismesajs = new Discord.EmbedBuilder()
                            .setDescription(cikismesaj)
                            .setColor("#FF0000")
                            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                            .setTimestamp();
                        
                        try {
                            kanal.send({ embeds: [cikismesajs] });
                        } catch (err) {
                            console.error("Özel ayrılma mesajı gönderilirken bir hata oluştu:", err);
                        }
                    } else {
                        // Varsayılan ayrılma mesajı
                        const normalmesaj = new Discord.EmbedBuilder()
                            .setColor("#0099ff")
                            .setTitle("Görüşürüz")
                            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                            .setURL(`${config["website"]}`)
                            .setDescription(`📤 | ${member} sunucudan ayrıldı.\nSunucumuz **${member.guild.memberCount}** kişi kaldı!`)
                            .setTimestamp();
                        
                        try {
                            kanal.send({ embeds: [normalmesaj] });
                        } catch (err) {
                            console.error("Varsayılan ayrılma mesajı gönderilirken bir hata oluştu:", err);
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Bir hata oluştu:", err);
        }
    }
};
