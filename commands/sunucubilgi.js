const { AttachmentBuilder } = require("discord.js");
const moment = require('moment');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  name: "sunucu-bilgi",
  description: "Premium sunucu bilgi görseli",
  type: 1,
  options: [],

  run: async (client, interaction) => {
    await interaction.deferReply();
    const guild = interaction.guild;
    await guild.members.fetch();
    await guild.roles.fetch();

    // VERİ HAZIRLIK
    const data = {
      owner: await guild.fetchOwner().catch(() => ({ user: { tag: "Sahip Bilgisi Yok" } })),
      createdAt: moment(guild.createdAt).format('DD MMMM YYYY'),
      stats: {
        members: guild.memberCount,
        bots: guild.members.cache.filter(m => m.user.bot).size,
        channels: {
          text: guild.channels.cache.filter(c => c.type === 0).size,
          voice: guild.channels.cache.filter(c => c.type === 2).size,
          categories: guild.channels.cache.filter(c => c.type === 4).size,
          threads: guild.channels.cache.filter(c => c.isThread()).size
        },
        emojis: {
          static: guild.emojis.cache.filter(e => !e.animated).size,
          animated: guild.emojis.cache.filter(e => e.animated).size,
          total: guild.emojis.cache.size
        },
        roles: guild.roles.cache.size - 1,
        boosts: guild.premiumSubscriptionCount,
        stickers: guild.stickers.cache.size
      },
      features: guild.features.map(f => {
        const featureNames = {
          'ANIMATED_ICON': 'Animasyonlu Simge',
          'BANNER': 'Özel Banner',
          'COMMERCE': 'Ticaret',
          'COMMUNITY': 'Topluluk Sunucusu',
          'DISCOVERABLE': 'Keşifte Görünür',
          'FEATURABLE': 'Öne Çıkarılabilir',
          'INVITE_SPLASH': 'Özel Davet Arkaplanı',
          'MEMBER_VERIFICATION_GATE_ENABLED': 'Üye Doğrulama',
          'MONETIZATION_ENABLED': 'Monetizasyon',
          'MORE_STICKERS': 'Ekstra Çıkartmalar',
          'NEWS': 'Haber Kanalları',
          'PARTNERED': 'Discord Partner',
          'PREVIEW_ENABLED': 'Önizleme',
          'PRIVATE_THREADS': 'Özel Threadler',
          'ROLE_ICONS': 'Rol Simgeleri',
          'SEVEN_DAY_THREAD_ARCHIVE': '7 Günlük Thread Arşivi',
          'THREE_DAY_THREAD_ARCHIVE': '3 Günlük Thread Arşivi',
          'TICKETED_EVENTS_ENABLED': 'Biletli Etkinlikler',
          'VANITY_URL': 'Özel URL',
          'VERIFIED': 'Doğrulanmış Sunucu',
          'VIP_REGIONS': 'VIP Ses Bölgeleri',
          'WELCOME_SCREEN_ENABLED': 'Karşılama Ekranı'
        };
        return featureNames[f] || f;
      })
    };

    // CANVAS BOYUTLARINI AYARLA
    const canvas = createCanvas(1600, 2400); // Daha geniş bir tuval
    const ctx = canvas.getContext('2d');

    // ARKA PLAN
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, '#1a1b26');
    bgGradient.addColorStop(1, '#2a2b3d');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // BAŞLIK ALANI
    const headerGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    headerGradient.addColorStop(0, '#7289DA');
    headerGradient.addColorStop(1, '#5865F2');
    ctx.fillStyle = headerGradient;
    ctx.roundRect(50, 50, canvas.width - 100, 150, [20, 20, 20, 20]);
    ctx.fill();

    // SUNUCU ADI (Otomatik kısaltma)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 46px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    
    let displayName = guild.name;
    if (displayName.length > 20) {
      displayName = displayName.substring(0, 17) + '...';
    }
    ctx.fillText(displayName.toUpperCase(), canvas.width / 2, 130);

    // SUNUCU İKONU
    try {
      const iconURL = guild.iconURL({ extension: 'png', size: 256 });
      if (iconURL) {
        const icon = await loadImage(iconURL);
        ctx.save();
        ctx.beginPath();
        ctx.arc(120, 125, 60, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(icon, 60, 65, 120, 120);
        ctx.restore();
        
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(120, 125, 62, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        throw new Error('No icon');
      }
    } catch {
      ctx.fillStyle = '#7289DA';
      ctx.beginPath();
      ctx.arc(120, 125, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(guild.nameAcronym || '?', 120, 140);
    }

    // METİN KISALTMA FONKSİYONU
    const shortenText = (text, maxLength = 20) => {
      if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + '...';
      }
      return text;
    };

    // BİLGİ KARTLARI (Yeniden düzenlenmiş)
    const cards = [
      {
        title: '📊 GENEL',
        color: '#5865F2',
        icon: '⚙️',
        items: [
          `👑 Sahip: ${shortenText(data.owner.user.tag)}`,
          `🆔 ID: ${guild.id}`,
          `📅 Kuruluş: ${data.createdAt}`,
          `💎 Boost: ${'★'.repeat(guild.premiumTier)} (${data.stats.boosts})`
        ],
        pos: { x: 80, y: 250, width: 700, height: 350 }
      },
      {
        title: '👥 ÜYELER',
        color: '#57F287',
        icon: '👥',
        items: [
          `👤 Toplam: ${data.stats.members}`,
          `🤖 Bot: ${data.stats.bots}`,
          `🧑 Kullanıcı: ${data.stats.members - data.stats.bots}`,
          `📈 Aktif: ${guild.approximatePresenceCount || 'Yok'}`
        ],
        pos: { x: 820, y: 250, width: 700, height: 350 }
      },
      {
        title: '💬 KANALLAR',
        color: '#FEE75C',
        icon: '💬',
        items: [
          `📝 Yazı: ${data.stats.channels.text}`,
          `🎤 Ses: ${data.stats.channels.voice}`,
          `🧵 Thread: ${data.stats.channels.threads}`,
          `📂 Toplam: ${guild.channels.cache.size}`
        ],
        pos: { x: 80, y: 650, width: 700, height: 350 }
      },
      {
        title: '🎨 MEDYA',
        color: '#EB459E',
        icon: '🎨',
        items: [
          `🎭 Rol: ${data.stats.roles}`,
          `😀 Emoji: ${data.stats.emojis.total}`,
          `🖼️ Çıkartma: ${data.stats.stickers}`,
          `📊 Nitro: ${guild.premiumTier}.Seviye`
        ],
        pos: { x: 820, y: 650, width: 700, height: 350 }
      },
      {
        title: '🔧 ÖZELLİKLER',
        color: '#ED4245',
        icon: '🔧',
        items: data.features.length > 0 ? 
          data.features.slice(0, 4).map(f => shortenText(f, 25)) : 
          ['Özel özellik yok'],
        pos: { x: 80, y: 1050, width: 700, height: 400 }
      },
      {
        title: '⚙️ AYARLAR',
        color: '#9B59B6',
        icon: '⚙️',
        items: [
          `🛡️ Doğrulama: ${['Yok','Düşük','Orta','Yüksek','Çok Yüksek'][guild.verificationLevel]}`,
          `🌍 Bölge: ${guild.preferredLocale === 'tr' ? '🇹🇷 TR' : '🌍 Global'}`,
          `🔞 NSFW: ${guild.explicitContentFilter === 0 ? 'Kapalı' : 'Açık'}`,
          `📢 Bildirim: ${['Tümü','Bahsedilmeler'][guild.defaultMessageNotifications]}`
        ],
        pos: { x: 820, y: 1050, width: 700, height: 400 }
      }
    ];

    // METİN SATIRLARA BÖLME FONKSİYONU (Geliştirilmiş)
    const wrapText = (context, text, maxWidth) => {
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = context.measureText(testLine);
        
        if (metrics.width < maxWidth) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    // KARTLARI ÇİZ (Geliştirilmiş)
    cards.forEach(card => {
      // KART GÖVDESİ
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 5;
      ctx.fillStyle = '#2a2b3d';
      ctx.roundRect(card.pos.x, card.pos.y, card.pos.width, card.pos.height, 20);
      ctx.fill();
      
      // KART BAŞLIĞI
      ctx.shadowBlur = 0;
      ctx.fillStyle = card.color;
      ctx.font = 'bold 22px Arial';
      ctx.fillText(card.icon + ' ' + card.title, card.pos.x + 40, card.pos.y + 60);
      
      // AYRAÇ ÇİZGİSİ
      ctx.strokeStyle = card.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(card.pos.x + 40, card.pos.y + 80);
      ctx.lineTo(card.pos.x + 200, card.pos.y + 80);
      ctx.stroke();
      
      // KART İÇERİĞİ
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '18px Arial';
      
      let yOffset = card.pos.y + 120;
      card.items.forEach(item => {
        const lines = wrapText(ctx, item, card.pos.width - 80);
        lines.forEach(line => {
          ctx.fillText(line, card.pos.x + 40, yOffset);
          yOffset += 28; // Satır aralığı
        });
        yOffset += 10; // Madde aralığı
      });
    });

    // ALT BİLGİ
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(
      `Talep eden: ${shortenText(interaction.user.tag)} • ${moment().format('DD/MM/YYYY HH:mm')}`,
      canvas.width - 60,
      canvas.height - 40
    );

    // DOSYA OLUŞTUR
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'sunucu-bilgi.png' });
    await interaction.editReply({ 
      content: `**${guild.name}** sunucusunun detaylı bilgileri:`,
      files: [attachment] 
    });
  }
};