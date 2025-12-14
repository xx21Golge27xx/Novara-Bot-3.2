const { Client, Permissions, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "eklenecek-komutlar",
  description: "eklenecek komutları gösterir",
  type: 1,
  options: [],

  run: async (client, interaction) => {
    const owner = interaction.guild.members.cache.get(interaction.guild.ownerId);

    const embed = new EmbedBuilder()
      .setColor("#7289DA")
      .setTitle("ardatvv v1,13 sürümünde eklenmesi öngörülen bazı komutlar")
      .setDescription(`
       :arrow_right:・/kelime-oyunu 
        :arrow_right:・/sayı-sayma 
        :arrow_right:・/davetsistemi

        :koruma:・Bu komutlar "probot" bottan esinlenmiştir.・:koruma:
        `);

    interaction.reply({ embeds: [embed] });
  },
};