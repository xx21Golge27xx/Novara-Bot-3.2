const { Client, PermissionsBitField, ActivityType } = require("discord.js");

// Bot sahibinin kullanıcı ID'sini burada belirtin
const BOT_OWNER_ID = '1173968740677853316';

module.exports = {
    name: "restart",
    description: "Botu yeniden başlatır.",
    type: 1,
    run: async (client, interaction) => {
        // Komutu kullanan kişinin bot sahibi olup olmadığını kontrol et
        if (interaction.user.id !== BOT_OWNER_ID) {
            return interaction.reply({ content: "Bu komut sadece bot sahibine özel", ephemeral: true });
        }

        // Kullanıcıya botun yeniden başlatılmakta olduğunu bildir
        await interaction.reply({ content: "Bot yeniden başlatılıyor...", ephemeral: true });

        // Bot durumu yeniden başlatıldığını belirten şekilde güncelleniyor
        await client.user.setPresence({
            activities: [{ name: "Yeniden başlatılıyorum...", type: ActivityType.Playing }],
            status: 'dnd',  // 'Do not disturb' statüsü
        });

        // 10 dakika sonra botun durumunu boşta yap ve komutları tekrar etkinleştir
        setTimeout(async () => {
            await client.user.setPresence({
                activities: [],
                status: 'idle',  // Durum 'Boşta' yapılır
            });

            console.log("Bot yeniden başlatıldı ve durumu boşta olarak güncellendi.");
        }, 10 * 60 * 1000);  // 10 dakika = 600.000 ms

        // Botu kapat ve yeniden başlat
        process.exit(); 
    }
};
