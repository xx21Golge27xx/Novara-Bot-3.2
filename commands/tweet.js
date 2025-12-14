const { Client, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const sharp = require('sharp');
const axios = require('axios');

module.exports = {
  name: 'tweet',
  description: 'Özel mentionlar içeren sahte tweet oluşturur (RT olmadan)',
  type: 1,
  options: [
    {
      name: 'kullanıcı',
      description: 'Tweet atacak kişi',
      type: 6,
      required: true,
    },
    {
      name: 'mesaj',
      description: 'Tweet mesajı (devlet-bahceli gibi mentionlar ekleyebilirsiniz)',
      type: 3,
      required: true,
    },
    {
      name: 'begeni',
      description: 'Beğeni sayısı (isteğe bağlı)',
      type: 4,
      required: false,
    }
  ],

  run: async (client, interaction) => {
    const user = interaction.options.getUser('kullanıcı');
    let message = interaction.options.getString('mesaj');
    const likeCount = interaction.options.getInteger('begeni') || 0;

    // Add mentions (like @devlet-bahceli)
    message = message.replace(/devlet-bahceli/gi, '@devlet-bahceli');

    if (message.length > 280) {
      return interaction.reply({
        content: 'Tweet mesajı 280 karakteri geçemez!',
        ephemeral: true
      });
    }

    const avatarURL = user.displayAvatarURL({ extension: 'png', size: 256 });

    try {
      await interaction.deferReply();

      // Load avatar
      const response = await axios.get(avatarURL, { responseType: 'arraybuffer' });
      const avatarBuffer = Buffer.from(response.data, 'binary');
      const avatarPngBuffer = await sharp(avatarBuffer).resize(400, 400).png().toBuffer();

      // Create canvas
      const canvas = Canvas.createCanvas(1200, 600);
      const ctx = canvas.getContext('2d');

      // Twitter dark mode style
      ctx.fillStyle = '#15202B'; // Dark background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw avatar (circle mask)
      const avatar = await Canvas.loadImage(avatarPngBuffer);
      ctx.save();
      ctx.beginPath();
      ctx.arc(80, 100, 40, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 40, 60, 80, 80);
      ctx.restore();

      // Draw user info
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(user.username, 150, 90);

      ctx.font = '28px Arial';
      ctx.fillStyle = '#8899A6';
      ctx.fillText(`@${user.username.toLowerCase()}`, 150, 130);

      // Draw tweet content
      ctx.font = '36px Arial';
      ctx.fillStyle = '#FFFFFF';
      wrapText(ctx, message, 80, 180, canvas.width - 160, 45);

      // Draw Twitter stats (without RT)
      ctx.font = '28px Arial';
      ctx.fillStyle = '#8899A6';
      ctx.fillText(`❤️ ${likeCount}   💬 0   📤`, 80, 500);

      // Create attachment
      const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'tweet.png' });

      interaction.editReply({ 
        content: `${user} tarafından tweet atıldı!`,
        files: [attachment] 
      });
    } catch (error) {
      console.error('Error generating tweet:', error);
      interaction.editReply({ content: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.', ephemeral: true });
    }
  }
};

// Helper function to wrap text
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}
