// öneri.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'öneri',
  description: 'Önerinizi paylaşın, öneriniz size özel olarak iletilecektir.',
  options: [
    {
      name: 'öneri',
      description: 'Paylaşmak istediğiniz öneri',
      type: 3, // STRING type
      required: true
    }
  ],

  run: async (client, interaction) => {
    const öneri = interaction.options.getString('öneri');
    
    // Öneri gönderilecek kanalın ID'sini buraya yazın
    const öneriKanalID = '1248897519866482750'; // Değiştirin

    const öneriKanal = interaction.guild.channels.cache.get(öneriKanalID);

    // Kanal var mı kontrolü
    if (!öneriKanal) {
      console.log(`Kanal bulunamadı. Önerilen kanal ID: ${öneriKanalID}`);
      return interaction.reply('Öneri kanalı bulunamadı. Lütfen yöneticinize danışın.');
    }

    const embed = new EmbedBuilder()
      .setTitle('Yeni Öneri')
      .setDescription(öneri)
      .addFields(
        { name: 'Öneren Kullanıcı', value: `${interaction.user.username}`, inline: true },
        { name: 'Öneri Tarihi', value: new Date().toLocaleDateString('tr-TR'), inline: true }
      )
      .setColor('#3498db')
      .setTimestamp();

    // Öneriyi belirtilen kanala gönder
    const öneriMesaj = await öneriKanal.send({ embeds: [embed] });

    // Emoji tepkilerini ekle
    await öneriMesaj.react('✅'); // Kabul edildi emoji
    await öneriMesaj.react('❌'); // Kabul edilmedi emoji

    // Kullanıcıya onay mesajı gönder
    await interaction.reply('Öneriniz başarıyla gönderildi!');

    // Emoji tepkilerine tıklama olayını dinle
    const filter = (reaction, user) => {
      return ['✅', '❌'].includes(reaction.emoji.name) && 
             user.roles.cache.some(role => role.name === 'Yönetici'); // Yalnızca "Yönetici" rolüne sahip olan kullanıcıları dikkate al
    };

    const collector = öneriMesaj.createReactionCollector({ filter, dispose: true });

    collector.on('collect', async (reaction, user) => {
      // Tepkiye tıklayan kullanıcı yönetici mi?
      if (user.roles.cache.some(role => role.name === 'Yönetici')) {
        // Kullanıcının DM alıp almadığını kontrol et
        const dmChannel = await interaction.user.createDM();
        
        // DM mesajını gönder
        if (reaction.emoji.name === '✅') {
          await dmChannel.send('✅ Öneriniz kabul edildi!');
        } else if (reaction.emoji.name === '❌') {
          await dmChannel.send('❌ Öneriniz kabul edilmedi!');
        }
      }
    });
  }
};