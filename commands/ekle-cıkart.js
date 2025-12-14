const { Client, EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('croxydb'); // Veritabanı işlemleri için

module.exports = {
  name: 'mesaj-top',
  description: 'Kullanıcının mesaj sayısını artırır veya azaltır.',
  type: 1, // Slash komutu
  options: [
    {
      name: 'işlem',
      description: 'Yapılacak işlem (ekle veya çıkart)',
      type: 3, // String türünde, "ekle" veya "çıkart"
      required: true,
      choices: [
        { name: 'ekle', value: 'ekle' },
        { name: 'çıkart', value: 'çıkart' },
      ],
    },
    {
      name: 'sayı',
      description: 'Eklemek ya da çıkartmak istediğiniz miktar.',
      type: 4, // Integer
      required: true,
    },
    {
      name: 'kullanıcı',
      description: 'İşlem yapılacak kullanıcı.',
      type: 6, // User
      required: true,
    },
  ],

  run: async (client, interaction) => {
    // Sunucu Yöneticisi İzin Kontrolü
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({
        content: 'Bu komutu kullanabilmek için yönetici yetkisine sahip olmanız gerekiyor!',
        ephemeral: true,
      });
    }

    // Seçilen işlem ve kullanıcıyı alalım
    const işlem = interaction.options.getString('işlem');
    const sayı = interaction.options.getInteger('sayı');
    const kullanıcı = interaction.options.getUser('kullanıcı');

    // Kullanıcının mevcut mesaj sayısını veritabanından alalım
    let mesajSayisi = db.fetch(`mesajSayisi_${kullanıcı.id}_${interaction.guild.id}`) || 0;

    // İşlem yapılacak
    if (işlem === 'ekle') {
      mesajSayisi += sayı; // Sayıyı ekleyelim
    } else if (işlem === 'çıkart') {
      mesajSayisi -= sayı; // Sayıyı çıkartalım
      if (mesajSayisi < 0) mesajSayisi = 0; // Negatif olmasın
    }

    // Mesaj sayısını güncelle
    db.set(`mesajSayisi_${kullanıcı.id}_${interaction.guild.id}`, mesajSayisi);

    // İşlem başarılı mesajı
    const embed = new EmbedBuilder()
      .setTitle('Mesaj Sayısı Güncellendi')
      .setDescription(`${kullanıcı.username} için mesaj sayısı ${işlem === 'ekle' ? 'arttırıldı' : 'azaltıldı'}!`)
      .addFields(
        { name: 'Yeni Mesaj Sayısı', value: `${mesajSayisi}`, inline: true },
        { name: 'İşlem', value: işlem, inline: true }
      )
      .setColor('#00FF00');

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
