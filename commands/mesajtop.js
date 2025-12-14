const { Client, EmbedBuilder } = require('discord.js');
const db = require('croxydb'); // Veritabanı işlemleri için

module.exports = {
  name: 'mesajtop',
  description: 'Sunucudaki en fazla mesaj yazan 10 kişiyi sıralar.',
  type: 1, // Bu komut Slash komutu olacak
  run: async (client, interaction) => {
    // Sunucudaki tüm üyeleri alın
    const members = await interaction.guild.members.fetch();

    // Üyelerin mesaj sayısını veritabanından alalım
    const messageCounts = [];
    members.forEach(member => {
      const messageCount = db.fetch(`mesajSayisi_${member.id}_${interaction.guild.id}`) || 0;
      messageCounts.push({ user: member.user, count: messageCount });
    });

    // Mesaj sayısına göre sıralama
    messageCounts.sort((a, b) => b.count - a.count);

    // İlk 10 kişiyi alalım
    const top10 = messageCounts.slice(0, 10);

    // Embed oluşturma
    const embed = new EmbedBuilder()
      .setTitle('Top 10 Mesaj Gönderen Kişiler')
      .setColor('#00FF00')
      .setDescription(top10.map((entry, index) => `${index + 1}. ${entry.user.username} - **${entry.count}** mesaj`).join('\n'));

    interaction.reply({ embeds: [embed] });
  },
};

// Mesaj olayını dinleyerek mesaj sayısını güncelleme
client.on('messageCreate', (message) => {
  if (message.author.bot || !message.guild) return;

  // Mesaj sayısını veritabanında güncelleme
  let mesajSayisi = db.fetch(`mesajSayisi_${message.author.id}_${message.guild.id}`) || 0;
  db.set(`mesajSayisi_${message.author.id}_${message.guild.id}`, mesajSayisi + 1);
});
