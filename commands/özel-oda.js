const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('site-sorgu')
    .setDescription('Bir web sitesini sorgular ve bilgilerini gösterir.')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Sorgulanacak site URL\'si (örnek: https://example.com)')
        .setRequired(true)
    ),
  
  async run(interaction) {
    const url = interaction.options.getString('url');

    await interaction.deferReply();

    // Basit kontrol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return interaction.editReply('Lütfen geçerli bir URL girin. (http:// veya https:// ile başlamalı)');
    }

    try {
      const fetch = require('node-fetch');
      const response = await fetch(url);
      const status = response.status;
      const statusText = response.statusText;

      const embed = new EmbedBuilder()
        .setTitle('🌐 Site Sorgu Sonucu')
        .addFields(
          { name: 'URL', value: url, inline: false },
          { name: 'Durum', value: `${status} ${statusText}`, inline: false }
        )
        .setColor(status === 200 ? 0x00ff00 : 0xff0000)
        .setTimestamp();

      interaction.editReply({ embeds: [embed] });
    } catch (err) {
      interaction.editReply('❌ Siteye erişilirken bir hata oluştu.');
    }
  }
};
