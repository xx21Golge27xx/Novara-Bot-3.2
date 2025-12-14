const { Client, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: "partner",
  description: "Partner olursunuz!",
  type: 1,
  options: [
    {
      name: "sebep",
      description: "Partner olma sebebini gir!",
      type: 3,
      required: true
    },
    {
      name: "tür",
      description: "Partner türünü seçin!",
      type: 3,
      required: true,
      choices: [
        { name: "Minecraft", value: "minecraft" },
        { name: "Topluluk", value: "topluluk" },
        { name: "Bot Destek", value: "bot_destek" }
      ]
    },
    {
      name: "sunucu_link",
      description: "Sunucu davet linkini girin!",
      type: 3,
      required: true
    },
    {
      name: "sunucu_ismi",
      description: "Sunucu adını girin!",
      type: 3,
      required: true
    }
  ],

  run: async(client, interaction) => {
    const sebep = interaction.options.getString('sebep');
    const tür = interaction.options.getString('tür');
    const sunucuLink = interaction.options.getString('sunucu_link');
    const sunucuIsmi = interaction.options.getString('sunucu_ismi');

    // Veritabanına partnerlik bilgilerini kaydet
    db.set(`partner_${interaction.user.id}`, { sebep, tür, sunucuLink, sunucuIsmi });
    db.set(`partnerDate_${interaction.user.id}`, { date: Date.now() });

    // Komutun kullanıldığı kanala özel partner mesajı gönder
    if (tür === "minecraft") {
      interaction.channel.send({
        content: `🎉 [${sunucuIsmi}] Discord Sunucumuza Katılın! 🎉\n\n` +
                 `Minecraft maceranızı daha da eğlenceli hale getirmek için Discord sunucumuza katılın! Burada oyuncularla sohbet edebilir, sunucu etkinliklerinden haberdar olabilir ve destek alabilirsiniz. İşte bizi bekleyen harika şeyler:\n\n` +
                 `🌍 Minecraft Oyuncuları için Ayrıcalıklar\n\n` +
                 `Canlı Sunucu Duyuruları - Etkinlikler, güncellemeler ve önemli duyurulardan anında haberdar olun!\n` +
                 `Oyuncu Sohbeti - Minecraft’ta birlikte oyun oynayacak arkadaşlar bulabilir, stratejiler paylaşabilirsiniz!\n` +
                 `Destek - Sorun yaşarsanız, destek kanallarımızda hızlıca yardım alabilirsiniz.\n\n` +
                 `🎁 Özel Etkinlikler ve Çekilişler\n\n` +
                 `Discord'a özel ödüller ve etkinliklerle ekstra avantajlar elde edin!\n\n` +
                 `📜 Kurallarımız\n\n` +
                 `Saygılı ve Nazik Olun - Toplulukta herkesin iyi vakit geçirmesi için saygıyı elden bırakmayın.\n` +
                 `Spam ve Reklam Yapmak Yasak - Sohbet kanallarını temiz tutalım!\n` +
                 `Herkes İçin Güvenli Bir Ortam - Herkesin kendini güvende hissetmesi için kurallara uyun.\n\n` +
                 `🎮 Katılın ve Minecraft dünyamızda yeni dostluklar kurun!\n\n` +
                 `Davet Linki: ${sunucuLink}`
      });
    } else if (tür === "topluluk") {
      interaction.channel.send({
        content: `🎉 [${sunucuIsmi}] Discord Sunucumuza Katılın! 🎉\n\n` +
                 `Merhaba! [${sunucuIsmi}] Discord sunucusuna davetlisiniz. Burası ortak ilgi alanlarını paylaşan bireylerin buluşma noktası. Eğlenceli sohbetler, ilginç paylaşımlar ve harika etkinlikler ile topluluğumuz her geçen gün büyüyor!\n\n` +
                 `🌟 Sunucumuzda Sizi Bekleyenler\n\n` +
                 `💬 Aktif Sohbet Kanalları - İlgili olduğunuz konularda sohbetlere katılın, fikirlerinizi paylaşın, yeni arkadaşlar edinin!\n` +
                 `📣 Güncel Duyurular ve Etkinlikler - Özel duyurular, yarışmalar ve topluluk etkinliklerinden ilk siz haberdar olun!\n` +
                 `🤝 Topluluk Destek Kanalları - Sorularınız ve önerileriniz için destek kanallarımız her zaman açık.\n` +
                 `🎁 Özel Etkinlikler ve Çekilişler - Eğlenceli etkinliklere katılarak sürpriz ödüller kazanma şansını yakalayın!\n\n` +
                 `📜 Kurallarımız\n\n` +
                 `Saygılı Olun - Topluluğumuzun güvenli ve saygılı bir ortam olmasını sağlamak için herkesin katkısına ihtiyacımız var.\n` +
                 `Spam ve Reklam Yapmak Yasak - Sohbet kanallarını temiz ve keyifli tutmak hepimizin sorumluluğu!\n` +
                 `Uyumlu Bir Ortam - Herkesin kendini rahat hissedebileceği bir topluluk oluşturmaya özen gösteriyoruz.\n\n` +
                 `🌐 Hadi, aramıza katılın ve topluluğumuzun bir parçası olun!\n` +
                 `Davet Linki: ${sunucuLink}`
      });
    } else if (tür === "bot_destek") {
      interaction.channel.send({
        content: `🎉 [${sunucuIsmi}] Bot Destek Sunucusuna Hoş Geldiniz! 🎉\n\n` +
                 `Bot kullanıcıları ve geliştiricileri için oluşturduğumuz [${sunucuIsmi}] Discord sunucusuna katılarak botlarınızla ilgili her türlü konuda destek alın! Burada, botlarınızı geliştirmek, sorunlarınızı çözmek ve yeni arkadaşlar edinmek için harika bir ortam bulacaksınız.\n\n` +
                 `🔧 Sunucumuzda Sizi Bekleyen Fırsatlar:\n\n` +
                 `🤖 Bot Desteği: Herhangi bir sorununuz veya sorularınız varsa, yardım almak için buradayız!\n` +
                 `💬 Geliştirici Tartışmaları: Diğer geliştiricilerle fikir alışverişinde bulunun, deneyimlerinizi paylaşın.\n` +
                 `📜 Kaynak Paylaşımı: Bot geliştirme ile ilgili kaynaklar, kütüphaneler ve dokümanları keşfedin.\n` +
                 `🎉 Etkinlikler ve Yarışmalar: Bot geliştirme ve kullanıcı deneyimini artırmak için düzenlenen etkinliklere katılın!\n\n` +
                 `📜 Kurallarımız:\n\n` +
                 `Saygılı ve Nazik Olun: Tüm üyelerimize saygı gösterelim.\n` +
                 `Spam ve Reklam Yapmak Yasak: Sohbet kanallarını temiz tutalım.\n` +
                 `Yardımlaşma: Herkesin sorularına yanıt vererek, topluluğumuzu daha güçlü kılalım.\n\n` +
                 `🌟 Hemen katılın ve bot geliştirme topluluğumuzun bir parçası olun!\n` +
                 `Davet Linki: ${sunucuLink}`
      });
    }

    interaction.reply(`✅ | Başarıyla partner oldunuz! Tür: ${tür}`);
  }
};
