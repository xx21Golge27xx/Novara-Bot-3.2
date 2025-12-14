const { AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

module.exports = {
  name: "aşk-ölçer",
  description: "İki kişi arasındaki aşk yüzdesini ölçer (resimli)",
  type: 1,
  options: [
    {
      name: "birinci",
      description: "Birinci kişiyi seçin",
      type: 6,
      required: true
    },
    {
      name: "ikinci",
      description: "İkinci kişiyi seçin",
      type: 6,
      required: true
    }
  ],
  run: async (client, interaction) => {
    await interaction.deferReply(); // İşlemin zaman alabileceğini belirt

    const user1 = interaction.options.getUser("birinci");
    const user2 = interaction.options.getUser("ikinci");

    // Aşk yüzdesini rastgele hesapla (0-100 arası)
    const lovePercent = Math.floor(Math.random() * 101);
    
    // Renk ve emoji belirle
    let color, emoji;
    if (lovePercent < 30) {
      color = "#FF0000"; emoji = "💔";
    } else if (lovePercent < 60) {
      color = "#FFA500"; emoji = "💖"; 
    } else if (lovePercent < 80) {
      color = "#FF69B4"; emoji = "💗";
    } else {
      color = "#FF00FF"; emoji = "💘";
    }

    try {
      const canvas = createCanvas(690, 460);
      const ctx = canvas.getContext('2d');
      
      // Varsayılan arkaplan (resim yüklenemezse diye)
      ctx.fillStyle = "#36393F";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      try {
        // Arkaplan resmini yükle
        const background = await loadImage('https://media.discordapp.net/attachments/1347921469757325342/1362371568755409046/arkaplan.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      } catch (bgError) {
        console.log("Arkaplan yüklenemedi, varsayılan arkaplan kullanılıyor");
      }
      
      // Şeffaf overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Başlık
      ctx.fillStyle = color;
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('AŞK ÖLÇER', canvas.width/2, 60);
      
      // Kullanıcı bilgileri
      ctx.fillStyle = "#FFFFFF";
      ctx.font = '30px Arial';
      ctx.fillText(`${user1.username} ❤️ ${user2.username}`, canvas.width/2, 120);
      
      // Yüzde çubuğu
      ctx.fillStyle = "#555555";
      ctx.fillRect(95, 150, 500, 30);
      ctx.fillStyle = color;
      ctx.fillRect(95, 150, 500 * (lovePercent/100), 30);
      
      // Yüzde yazısı
      ctx.font = 'bold 35px Arial';
      ctx.fillText(`${lovePercent}% ${emoji}`, canvas.width/2, 200);
      
      // Seviye bilgisi
      ctx.font = '25px Arial';
      let level;
      if (lovePercent < 30) level = "Arkadaş Gibi";
      else if (lovePercent < 60) level = "Flört Seviyesi"; 
      else if (lovePercent < 80) level = "Aşık";
      else level = "Soulmate!";
      ctx.fillText(`Seviye: ${level}`, canvas.width/2, 250);
      
      // Avatar çerçeveleri
      try {
        await drawAvatar(ctx, user1.displayAvatarURL({ extension: 'png', size: 256 }), 50, 280, 60, 3, color);
        await drawAvatar(ctx, user2.displayAvatarURL({ extension: 'png', size: 256 }), 580, 280, 60, 3, color);
      } catch (avatarError) {
        console.log("Avatar yüklenirken hata:", avatarError);
      }
      
      // Resmi gönder
      const buffer = canvas.toBuffer('image/png');
      const attachment = new AttachmentBuilder(buffer, { name: 'ask-olcer.png' });
      
      await interaction.editReply({
        files: [attachment],
        content: `**${user1.username}** ile **${user2.username}** arasındaki aşk yüzdesi:`
      });
      
    } catch (error) {
      console.error("Beklenmeyen hata:", error);
      await interaction.editReply("Bir hata oluştu, lütfen daha sonra tekrar deneyin.");
    }
  }
};

async function drawAvatar(ctx, avatarURL, x, y, size, borderWidth, borderColor) {
  try {
    const avatar = await loadImage(avatarURL);
    
    // Çerçeve
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = borderColor;
    ctx.fill();
    
    // Avatar
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2 - borderWidth, 0, Math.PI * 2);
    ctx.closePath();
    ctx.save();
    ctx.clip();
    ctx.drawImage(avatar, x + borderWidth, y + borderWidth, size - borderWidth*2, size - borderWidth*2);
    ctx.restore();
  } catch (err) {
    console.error("Avatar çizilirken hata:", err);
    throw err;
  }
}