const { Client, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: "dubai", // Komut adı
  description: "Kullanıcıya Dubai çikolatası hediye et!", // Komut açıklaması
  type: 1, // Komut türü (1: Slash komutu)
  options: [
    {
      name: "kullanıcı", // Seçenek adı
      description: "Hediye edeceğin kullanıcıyı etiketle!", // Seçenek açıklaması
      type: 6, // Seçenek tipi (6: Kullanıcı)
      required: true // Gereklilik durumu (true: zorunlu)
    },
  ],

  run: async (client, interaction) => {
    const kullanici = interaction.options.getUser('kullanıcı'); // Etiketlenen kullanıcıyı al
    const mesaj = `${interaction.user}, ${kullanici} Dubai çikolatası hediye etti!`; // Kullanıcıdan gelen mesaj

    // Embed mesajı oluştur
    const embed = new EmbedBuilder()
      .setColor("#FFD700") // Renk ayarı (altın sarısı, hexadecimal)
      .setDescription(mesaj) // Mesaj içeriği
      .setImage("https://imagedelivery.net/Zcjn5gwAVfrAzXjwv_K0uw/0da47bca-13a4-4478-07c9-6ae7b35f3400/public") // İlk resim URL'si
      .setImage("https://imagedelivery.net/Zcjn5gwAVfrAzXjwv_K0uw/0da47bca-13a4-4478-07c9-6ae7b35f3400/public"); // İkinci resim URL'si

    interaction.reply({ embeds: [embed] }); // Yanıtı gönder
  }
};
