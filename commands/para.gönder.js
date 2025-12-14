const { Client } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "paragonder",
    description: "Bir kullanıcıya para gönder.",
    type: 1,
    options: [
        {
            name: 'alıcı',
            type: 6, // User type
            description: 'Para göndermek istediğiniz kullanıcı.',
            required: true
        },
        {
            name: 'miktar',
            type: 4, // Integer type
            description: 'Göndermek istediğiniz miktar.',
            required: true
        }
    ],
    run: async (client, interaction) => {
        const gonderen = interaction.user;
        const alici = interaction.options.getUser('alıcı');
        const miktar = interaction.options.getInteger('miktar');

        // Gönderenin bakiyesini kontrol et
        let gonderenBalance = db.get(`balance_${gonderen.id}`) || 0;

        if (miktar <= 0) {
            return interaction.reply({ content: "❌ | Geçersiz miktar! Lütfen pozitif bir değer girin.", ephemeral: true });
        }

        if (gonderenBalance < miktar) {
            return interaction.reply({ content: "❌ | Yeterli bakiyeniz yok! Bu miktarda para gönderemezsiniz.", ephemeral: true });
        }

        // Alıcının bakiyesini güncelle
        let aliciBalance = db.get(`balance_${alici.id}`) || 0;

        db.subtract(`balance_${gonderen.id}`, miktar); // Gönderenin bakiyesinden çıkar
        db.add(`balance_${alici.id}`, miktar); // Alıcının bakiyesine ekle

        // Para gönderim mesajı
        const mesaj = `💳 | **<@${gonderen.id}>** sent **${miktar.toLocaleString()} cowoncy** to **<@${alici.id}>**!`;

        // Yanıtla ve gönderim mesajını göster
        await interaction.reply({ content: mesaj });
    }
};
