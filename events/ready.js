const { ActivityType } = require('discord.js');
const db = require('croxydb');
const config = require('../config.json');

module.exports = {
  name: 'ready',
  once: true,

  run: async (client) => {

    /* Varsayılan durum */
    client.user.setPresence({
      activities: [{
        name: config.presence.default.name,
        type: ActivityType[config.presence.default.type]
      }],
      status: config.presence.default.status
    });

    try {
      db.set('botAcilis_', Date.now());

      /* AKTİVİTELER CONFIG’TEN */
      const activities = config.presence.activities.map(act => ({
        name: act.name,
        type: ActivityType[act.type],
        url: act.url
      }));

      const setRandomActivity = () => {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setPresence({
          activities: [activity],
          status: 'online'
        });
      };

      const updateActivityWithCounts = () => {
        const guildCount = client.guilds.cache.size;
        const memberCount = client.guilds.cache.reduce(
          (acc, guild) => acc + guild.memberCount, 0
        );

        client.user.setPresence({
          activities: [{
            name: `Sunucu: ${guildCount} | Üye: ${memberCount}`,
            type: ActivityType.Watching
          }],
          status: 'online'
        });
      };

      setRandomActivity();

      setInterval(() => {
        Math.random() < 0.5
          ? setRandomActivity()
          : updateActivityWithCounts();
      }, config.presence.interval);

      /* BAŞLANGIÇ MESAJ KANALI (CONFIG) */
      const channel = await client.channels.fetch(config.kanallar.baslangicMesaj).catch(() => null);

      if (channel) {
        let minutes = (db.get('botStartTime') || 10) + 2;
        if (minutes > 50) minutes = 10;
        db.set('botStartTime', minutes);

        const seconds = Math.floor(Math.random() * 60);

        setTimeout(() => {
          channel.send(
             `<a:online:1347309854590763058> Bıktım elinizden ama gıyamadım, geldim! Başlama sürem: ${minutes} dakika ${seconds} saniye`
             `<a:online:1347309854590763058> Kendimi Atayığımda kurtulayım, bırakın peşimi! Başlama sürem: ${minutes} dakika ${seconds} saniye`
          );
        }, 10000);
      }

      console.log("Bot hazır ve aktif!");

    } catch (error) {
      console.error("Ready hatası:", error);

      const errorChannel = await client.channels.fetch(config.kanallar.hataLog).catch(() => null);
      if (errorChannel) {
        errorChannel.send(`❌ Ready hatası: ${error.message}`);
      }
    }
  }
};
