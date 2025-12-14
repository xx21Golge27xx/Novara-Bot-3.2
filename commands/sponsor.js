module.exports = {
    name: "sponsor",
    description: "Sponsor'u görmenizi sağlayan bir komuttur!",
    run: async (client, interaction) => {
        await interaction.reply({
            content: "Sponsoru görmek için [buraya tıklayınız.](https://discord.gg/znaKk7dx39)"
        });
    }
}