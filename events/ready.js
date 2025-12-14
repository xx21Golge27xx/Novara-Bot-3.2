const { ActivityType } = require('discord.js');
const db = require('croxydb');

module.exports = {
  name: 'ready',
  once: true,

  run: async (client) => {

    client.user.setPresence({
      activities: [{ name: "/Yardım", type: ActivityType.Custom }],
      status: 'online',
    });

    try {
      const botStartTime = Date.now();
      db.set('botAcilis_', botStartTime);

      const activities = [
        { name: "Destek sistemi ile sunucuna destek sistemi kur!", type: ActivityType.Playing },
        { name: "Captcha sistemi ile sunucunu güvene al!", type: ActivityType.Playing },
        { name: "Botlist sistemi ile sunucunu kolaylaştır!", type: ActivityType.Playing },
        { name: "Moderasyon komutları ile sunucunu çok daha pratik yap!", type: ActivityType.Playing },
        { name: "SPONSOR hostingverim.com", type: ActivityType.Playing },
        { name: "Sorun varsa geri bildir yap", type: ActivityType.Playing },
        { name: "Twitch", type: ActivityType.Streaming, url: "https://www.twitch.tv/blewys_" },
        { name: "/Yardım", type: ActivityType.Custom }
      ];

      const setRandomActivity = () => {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setPresence({ activities: [activity], status: 'online' });
      };

      const updateActivityWithCounts = () => {
        const guildCount = client.guilds.cache.size;
        const memberCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        const currentActivity = { name: `Sunucu: ${guildCount} | Üye: ${memberCount}`, type: ActivityType.Watching };
        client.user.setPresence({ activities: [currentActivity], status: 'online' });
      };

      setRandomActivity();
      setInterval(() => {
        Math.random() < 0.5 ? setRandomActivity() : updateActivityWithCounts();
      }, 15000);

      const channelId = '1360654958319636580'; // Kanal ID'sini buraya yazın
      const channel = await client.channels.fetch(channelId);

      if (!channel) {
        console.error("Kanal bulunamadı.");
        return;
      }

      // Kanalın izinlerini kontrol et
      const permissions = channel.permissionsFor(client.user);
      if (!permissions.has('SendMessages') || !permissions.has('ViewChannel')) {
        console.error("Botun kanalında mesaj gönderme yetkisi yok.");
        return;
      }

      let currentStartTime = db.get('botStartTime') || 10;
      currentStartTime += 2;

      if (currentStartTime > 50) currentStartTime = 10; // 50'ye ulaştığında başa al

      db.set('botStartTime', currentStartTime);

      const minutes = currentStartTime;
      const seconds = Math.floor(Math.random() * 60);

      setTimeout(async () => {
        // Rastgele bir mesaj seçme ve sadece birini gönderme
        const randomMessage = Math.random() < 0.5 
          ? `<a:online:1347309854590763058> Bıktım elinizden ama gıyamadım, geldim! Başlama sürem: ${minutes} dakika ${seconds} saniye`
          : `<a:online:1347309854590763058> Kendimi Atayığımda kurtulayım, bırakın peşimi! Başlama sürem: ${minutes} dakika ${seconds} saniye`;

        await channel.send(randomMessage);
        console.log("Başlama süresi mesajı gönderildi.");
      }, 10000);

      // Sunucular hakkında bilgi alma ve yazdırma
      console.log("\nSunucularım:");
      client.guilds.cache.forEach((guild) => {
        const owner = guild.owner ? guild.owner.user.tag : 'Sahip Bilgisi Yok'; // Sahip kontrolü
        const memberCount = guild.memberCount;
        console.log(`
        -------------------------------
        Sunucu İsmi: ${guild.name}
        Sunucu ID: ${guild.id}
        Sunucu Sahibi: ${owner}
        Üye Sayısı: ${memberCount}
        -------------------------------
        `);
      });

      // Konsolda sunucular bilgisi yazdırıldıktan sonra burayı yazdırıyoruz
      console.log(`
_   _                           
| \\ | | _____   ____ _ _ __ __ _ 
|  \\| |/ _ \\ \\ / / _\\ | '__/ _\\ | 
| |\\  | (_) \\ V / (_| | | | (_| | 
| |_\\_\\___/ \\_/ \\__,_|_|  \\__,_|
      `);

      // Bot açılış süresi bilgisini buraya ekledim
      console.log(`Bot açılış süresi: ${minutes} dakika ${seconds} saniye`);

      // Konsola atılacak mesaj
      console.log("Bot hazır ve aktif!");

    } catch (error) {
      console.error("Bot hazır olurken bir hata oluştu:", error);

      const errorChannelId = '1276899166701752320';
      const errorChannel = await client.channels.fetch(errorChannelId);

      if (errorChannel) {
        await errorChannel.send(`❌ Hata: Bot başlama mesajı gönderilirken bir hata oluştu: ${error.message}`);
      }
    }
  },

  guildCreate: async (guild) => {
    console.log(`Yeni sunucuya katıldım: ${guild.name}`);
  }
};
