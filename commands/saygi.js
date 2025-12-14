const { Client, EmbedBuilder } = require("discord.js");
const db = require("croxydb");
const axios = require("axios"); // Webhook için axios kullanacağız

module.exports = {
  name: "reputation", 
  description: "Bir kullanıcıya saygı puanı ver.",
  type: 1,
  options: [
    {
      name: "kullanıcı",
      description: "Saygı puanı vermek istediğin kullanıcıyı seç.",
      type: 6, // TYPE 6 is for USER
      required: true
    },
  ],

  run: async (client, interaction) => {
    const giver = interaction.user; // Saygı puanı veren kişi
    const receiver = interaction.options.getUser('kullanıcı'); // Saygı puanı alan kişi
    const guildId = interaction.guild.id; // Sunucu ID'si
    const guildName = interaction.guild.name; // Sunucu ismi

    if (giver.id === receiver.id) {
      return interaction.reply({ content: "Kendine saygı puanı veremezsin!", ephemeral: true });
    }

    // Veritabanından en son saygı puanı verdiği zamanı kontrol et (sunucu ve kullanıcı bazlı)
    let lastGiveTime = db.get(`lastReputation_${giver.id}_${guildId}`);
    let now = Date.now();
    let cooldown = 12 * 60 * 60 * 1000; // 12 saat (milisaniye cinsinden)

    if (lastGiveTime && now - lastGiveTime < cooldown) {
      let timeLeft = cooldown - (now - lastGiveTime);
      let hours = Math.floor(timeLeft / (1000 * 60 * 60));
      let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

      return interaction.reply({
        content: `:star2: **| Bir daha saygı puanı vermek için ${hours} saat ve ${minutes} dakika kadar beklemelisiniz.**`,
        ephemeral: true
      });
    }

    // Veritabanında saygı puanını artır (her kullanıcı için genel saygı puanı)
    let reputation = db.get(`reputation_${receiver.id}`) || 0;
    db.set(`reputation_${receiver.id}`, reputation + 1);

    // Sunucu ve kullanıcı bazlı olarak verilen saygı puanı zamanını kaydet
    db.set(`lastReputation_${giver.id}_${guildId}`, now);

    // Saygı puanı verme mesajı
    interaction.reply(`:star2: **| <@${giver.id}> adlı kullanıcı <@${receiver.id}> adlı kullanıcıya bir saygı puanı verdi!**`);

    // Webhook URL'si
    const webhookURL = "https://discord.com/api/webhooks/1295983070360371251/d6fu3YZ5Vp6FFlbyb4nZ6lYD4oUCoYKnz91FOKbTJf2vzdgRCaybhFZ8h2mu6p7qeVwD";

    // Webhook'a gönderilecek içerik
    const webhookData = {
      content: `:star2: **Verilen Sunucu:** ${guildName}\n**Veren Kişi:** ${giver.username}\n**Verilen Kişi:** ${receiver.username}`
    };

    // Webhook'a veri gönder
    try {
      await axios.post(webhookURL, webhookData);
      console.log("Webhook gönderildi.");
    } catch (error) {
      console.error("Webhook gönderilirken hata oluştu:", error);
    }
  }
};
