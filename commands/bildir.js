const { MessageAttachment } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'bildir',
    description: 'Geri bildirim gönderir.',
    options: [
        { name: 'geri_bildirim', type: 3, description: 'Gönderilecek geri bildirim', required: true },
        { name: 'komut_bildirim', type: 3, description: 'Gönderilecek komut bildirim', required: true },
        { 
            name: 'bot_isim',  // Bot ismi olarak güncellendi
            type: 3, 
            description: 'Bot ismini seçin', 
            required: true,
            choices: [
                { name: 'NOVARA', value: 'NOVARA' },
                { name: 'NOVARA YAPAY ZEKA', value: 'NOVARA YAPAY ZEKA' },
                { name: 'NOVARA MUSİC', value: 'NOVARA MUSİC' }
            ]
        }
    ],
    run: async (client, interaction) => {
        const feedback = interaction.options.getString('geri_bildirim');
        const commandFeedback = interaction.options.getString('komut_bildirim');
        const botName = interaction.options.getString('bot_isim'); // Güncellenmiş isim

        const channelId = '1289946322312630384'; // Geri bildirim kanalının ID'sini buraya yazın.
        const feedbackTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const userName = interaction.user.username;

        const ownerId = interaction.guild.ownerId;
        const owner = await interaction.guild.members.fetch(ownerId);
        const ownerName = owner.user.username;

        // Yönetici bildirimleri doğrudan rollerle etiketlenecek şekilde güncellendi.
        const adminMentions = ` 
            <@&1286618303975919668> <@&1286618520209199114> 
            <@&1286619738335870988> <@&1286621041136898115>
        `;

        const channel = client.channels.cache.get(channelId);

        if (!channel) {
            console.error(`Geri bildirim kanalı ID "${channelId}" bulunamadı.`);
            return interaction.reply({ content: 'Geri bildirim kanalı bulunamadı.', ephemeral: true });
        }

        const message = `📩 Geri Bildirim: ${feedback}\n\n` +
                        `🕒 Tarih: ${feedbackTime}\n\n` +
                        `📝 Komut Bildirim: ${commandFeedback}\n\n` +
                        `🤖 Bot İsmi: ${botName}\n\n` + // Bot ismi buraya eklendi
                        `👤 Bildiren: ${userName}\n\n` +
                        `🛑 Sunucu sahibi: ${ownerName}\n\n` +
                        `🌐 Sunucu adı: ${interaction.guild.name}\n\n` +
                        `📞 Sunucu sahibi ile iletişime geçerek sunucu linki alabilirsiniz.\n\n` +
                        `⚠️ Yönetici Bildirimi: ${adminMentions}`; // Yönetici bildirimini burada kullanıyoruz.

        try {
            await channel.send(message);
            await interaction.reply({ content: '✅ Geri bildiriminiz gönderildi.', ephemeral: true }); // Sadece kullanıcıya özel olarak yanıt
        } catch (error) {
            console.error('Mesaj gönderilirken bir hata oluştu:', error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'Mesaj gönderilirken bir hata oluştu.', ephemeral: true });
            }
        }
    }
};

// Sunucuya ait davet bağlantısını oluşturma fonksiyonu
async function getServerInviteLink(guild) {
    const botMember = guild.members.me;

    if (!botMember.permissions.has('ADMINISTRATOR')) {
        console.error('Botun yönetici izni yok, davet bağlantısı oluşturulamıyor.');
        return null;
    }

    const channels = guild.channels.cache.filter(ch => ch.permissionsFor(botMember).has('CREATE_INSTANT_INVITE'));

    if (channels.size === 0) {
        console.error('Davet oluşturulabilecek kanal bulunamadı. Botun gerekli izinlere sahip olduğundan emin olun.');
        return null;
    }

    const channel = channels.first();
    try {
        const invite = await channel.createInvite({ maxAge: 0, maxUses: 1 });
        return invite.url;
    } catch (error) {
        console.error('Davet linki oluşturulurken bir hata oluştu:', error);
        return null;
    }
}
