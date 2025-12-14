const { EmbedBuilder } = require('discord.js');
const figlet = require('figlet');

module.exports = {
  name: "ascii",
  description: "Yazıyı ASCII sanata dönüştürür (metin olarak)",
  type: 1,
  options: [
    {
      name: "metin",
      description: "ASCII yapılacak metin",
      type: 3,
      required: true
    },
  ],

  run: async (client, interaction) => {
    const metin = interaction.options.getString("metin");

    if (metin.length > 20) {
      return interaction.reply({
        content: "⚠️ Lütfen 20 karakterden kısa bir metin giriniz.",
        ephemeral: true
      });
    }

    figlet.text(metin, { font: 'Standard' }, (err, ascii) => {
      if (err || !ascii) {
        return interaction.reply({
          content: "❌ ASCII yazı oluşturulurken bir hata oluştu.",
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('ASCII Yazısı')
        .setDescription(`\`\`\`\n${ascii}\n\`\`\``)
        .setFooter({ text: 'ASCII yazısı başarıyla oluşturuldu!' })
        .setColor('Blurple');

      interaction.reply({
        embeds: [embed]
      });
    });
  }
};
