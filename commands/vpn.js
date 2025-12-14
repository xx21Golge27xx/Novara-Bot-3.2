const { Client, EmbedBuilder } = require("discord.js");
const axios = require("axios"); // Axios kütüphanesini içe aktarma

module.exports = {
  name: "vpn-tespit",
  description: "Belirtilen kullanıcının VPN kullanıp kullanmadığını tespit eder.",
  type: 1,
  options: [
    {
      name: "kullanici",
      description: "VPN testini yapmak istediğin kullanıcıyı etiketle!",
      type: 6, // User türünde bir giriş
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const kullanici = interaction.options.getUser("kullanici");

    // Örnek VPN kontrolü (Bu örnek, gerçek bir VPN tespiti değildir)
    // Rastgele VPN kullanımı kontrolü
    let vpnKullanimi;
    if (kullanici.id === "1280933771495080029") { // Örnek kullanıcı ID
      vpnKullanimi = false; // Bu kullanıcı VPN kullanmıyor
    } else {
      vpnKullanimi = Math.random() < 0.5; // Diğer kullanıcılar için %50 ihtimal
    }

    // Mesaj içerikleri
    let embed = new EmbedBuilder();

    if (vpnKullanimi) {
      embed.setColor("#FF0000") // Kırmızı renk
           .setTitle("🚨 VPN Tespiti Uyarısı!")
           .setDescription(`**${kullanici.tag}**, VPN kullanıyor! 🕵️‍♂️`)
           .addFields(
             { name: "Sonuç:", value: "VPN kullanıyor.", inline: true },
             { name: "Dikkat!", value: "Lütfen dikkat et ve güvenli bir bağlantı kullan." }
           );

      // Webhook'a mesaj gönderme
      await axios.post("https://discord.com/api/webhooks/1295753906889953281/h5V3CchKNsS-DfFiztF4Adh1XFX9utKGQsPPzJckJ7C1k9BEhQblsFixyXU5cnHo4Jt5", {
        embeds: [{
          title: "🚨 VPN Tespiti Uyarısı!",
          description: `**Kullanıcı:** ${kullanici.tag} (${kullanici.id})\n**Sonuç:** VPN kullanıyor. 🕵️‍♂️`,
          color: 0xFF0000
        }]
      });
    } else {
      embed.setColor("#00FF00") // Yeşil renk
           .setTitle("✅ VPN Tespiti Başarılı")
           .setDescription(`**${kullanici.tag}**, VPN kullanmıyor! 🎉`)
           .addFields(
             { name: "Sonuç:", value: "VPN kullanmıyor.", inline: true },
             { name: "Her Şey Yolunda!", value: "Güvenli bir bağlantı kullanıyorsun." }
           );

      // Webhook'a mesaj gönderme
      await axios.post("https://discord.com/api/webhooks/1295753906889953281/h5V3CchKNsS-DfFiztF4Adh1XFX9utKGQsPPzJckJ7C1k9BEhQblsFixyXU5cnHo4Jt5", {
        embeds: [{
          title: "✅ VPN Tespiti Başarılı",
          description: `**Kullanıcı:** ${kullanici.tag} (${kullanici.id})\n**Sonuç:** VPN kullanmıyor. ✅`,
          color: 0x00FF00
        }]
      });
    }

    try {
      // Kullanıcıya DM gönderme
      await kullanici.send({ embeds: [embed] });
      
      // Kullanıcıya bilgi ver
      interaction.reply(`✅ | VPN tespit testi yapıldı! Sonuç hem size hem de bot sahibine DM olarak gönderildi.`);
    } catch (error) {
      console.error("Mesaj gönderme hatası:", error);

      // Eğer DM gönderilemediyse, komutun kullanıldığı kanala mesaj gönder
      try {
        await interaction.channel.send(`❌ | DM gönderilemedi. Sonuç: ${embed.data.description}`);
      } catch (channelError) {
        console.error("Kanal mesaj gönderme hatası:", channelError);
      }

      return interaction.reply("❌ | Mesaj gönderilirken bir hata oluştu, sonuç kanala gönderildi."); // Hata mesajı
    }
  },
};
