const { Client, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { createCanvas, loadImage } = require('canvas');
const config = require("../config.json");

module.exports = {
  name: "davet",
  description: "Botun davet linkini atar.",
  type: 1,
  options: [],

  run: async(client, interaction) => {
    await interaction.deferReply();
    
    try {
      // Butonlar
      const dvt = new ButtonBuilder()
        .setLabel('Beni Davet Et')
        .setStyle('Link')
        .setEmoji('🤖')
        .setURL(config["bot-davet"]);

      const destek = new ButtonBuilder()
        .setLabel('Destek Sunucusu')
        .setStyle('Link')
        .setEmoji('💬')
        .setURL(config["desteksunucusu"]);

      const row = new ActionRowBuilder().addComponents(dvt, destek);

      // Canvas oluşturma
      const canvas = createCanvas(1200, 600);
      const ctx = canvas.getContext('2d');

      // Arka plan gradient (mavi tonları)
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#00b4d8');
      gradient.addColorStop(1, '#0077b6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bot avatarını yükle
      try {
        const avatar = await loadImage(
          client.user.displayAvatarURL({ extension: 'png', size: 512 })
        );
        
        // Yuvarlak avatar
        ctx.save();
        ctx.beginPath();
        ctx.arc(300, 300, 180, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 120, 120, 360, 360);
        ctx.restore();
        
        // Yuvarlak border
        ctx.beginPath();
        ctx.arc(300, 300, 180, 0, Math.PI * 2);
        ctx.lineWidth = 8;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.stroke();
      } catch (e) {
        console.error('Avatar yüklenemedi:', e);
      }

      // Özel kullanıcı kontrolü
      const kurucuId = '1173968740677853316';
      const kullaniciAdi = interaction.user.id === kurucuId 
        ? 'Sayın Kurucum' 
        : interaction.user.username;

      // Bot istatistiklerini al
      const botAdi = client.user.username;
      const sunucuSayisi = client.guilds.cache.size.toLocaleString();
      let uyeSayisi = 0;
      client.guilds.cache.forEach(guild => {
        uyeSayisi += guild.memberCount;
      });
      uyeSayisi = uyeSayisi.toLocaleString();

      // Metin stilleri
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Başlık
      ctx.font = 'bold 70px "Arial"';
      ctx.fillText('Merhaba!', 600, 140);
      
      // Kullanıcı adı
      ctx.font = 'bold 50px "Arial"';
      ctx.fillStyle = '#caf0f8';
      ctx.fillText(kullaniciAdi, 600, 200);
      
      // Bilgi kutusu arkaplanı
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.roundRect(600, 250, 500, 250, 20);
      ctx.fill();
      
      // Bot bilgileri
      const lineHeight = 70;
      const startY = 300;
      
      // Bot Adı
      ctx.font = '38px "Arial"';
      ctx.fillStyle = '#caf0f8';
      ctx.fillText('Bot Adı:', 630, startY);
      ctx.font = 'bold 38px "Arial"';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(botAdi, 780, startY);
      
      // Sunucu Sayısı
      ctx.font = '38px "Arial"';
      ctx.fillStyle = '#caf0f8';
      ctx.fillText('Sunucu Sayısı:', 630, startY + lineHeight);
      ctx.font = 'bold 38px "Arial"';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(sunucuSayisi, 880, startY + lineHeight);
      
      // Toplam Üye
      ctx.font = '38px "Arial"';
      ctx.fillStyle = '#caf0f8';
      ctx.fillText('Toplam Üye:', 630, startY + (lineHeight * 2));
      ctx.font = 'bold 38px "Arial"';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(uyeSayisi, 850, startY + (lineHeight * 2));
      
      // Footer
      ctx.font = 'italic 24px "Arial"';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = 0;
      ctx.fillText(`${interaction.user.username} tarafından istendi`, 700, 550);

      // Resmi buffer'a çevir
      const buffer = canvas.toBuffer('image/png');

      // Embed oluştur
      const embed = new EmbedBuilder()
        .setColor('#0096c7')
        .setImage('attachment://premium_davet.png');

      // Yanıtı düzenle
      await interaction.editReply({
        embeds: [embed],
        components: [row],
        files: [{
          attachment: buffer,
          name: 'premium_davet.png'
        }]
      });

    } catch (error) {
      console.error('Hata:', error);
      await interaction.editReply({
        content: 'Davet kartı oluşturulurken hata oluştu!',
        ephemeral: true
      });
    }
  }  
};