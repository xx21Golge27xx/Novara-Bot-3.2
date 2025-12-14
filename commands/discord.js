const { Client, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const moment = require('moment');
const axios = require('axios');

module.exports = {
  name: 'discord',
  description: 'Sahte Discord mesajları oluşturur.',
  type: 1,
  options: [
    {
      name: 'kullanıcı1',
      description: 'Mesaj atacak kullanıcı',
      type: 6,
      required: true,
    },
    {
      name: 'mesaj1',
      description: 'Gönderilecek mesaj içeriği',
      type: 3,
      required: true,
    },
    {
      name: 'kullanıcı2',
      description: 'İkinci mesajı atacak kullanıcı',
      type: 6,
      required: true,
    },
    {
      name: 'mesaj2',
      description: 'İkinci mesajın içeriği',
      type: 3,
      required: true,
    }
  ],

  run: async (client, interaction) => {
    const user1 = interaction.options.getUser('kullanıcı1');
    const message1 = interaction.options.getString('mesaj1');
    const user2 = interaction.options.getUser('kullanıcı2');
    const message2 = interaction.options.getString('mesaj2');

    try {
      await interaction.deferReply();

      // Load avatar images for both users
      const avatarURL1 = user1.displayAvatarURL({ extension: 'png', size: 256 });
      const avatarURL2 = user2.displayAvatarURL({ extension: 'png', size: 256 });
      const response1 = await axios.get(avatarURL1, { responseType: 'arraybuffer' });
      const avatarBuffer1 = Buffer.from(response1.data, 'binary');
      const response2 = await axios.get(avatarURL2, { responseType: 'arraybuffer' });
      const avatarBuffer2 = Buffer.from(response2.data, 'binary');

      // Create canvas
      const canvas = Canvas.createCanvas(800, 200);
      const ctx = canvas.getContext('2d');

      // Dark theme background
      ctx.fillStyle = '#36393f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the first user's avatar and message (slightly lower than the second user's)
      const avatar1 = await Canvas.loadImage(avatarBuffer1);
      ctx.save();
      ctx.beginPath();
      ctx.arc(40, 40, 20, 0, Math.PI * 2); // Create circular mask
      ctx.clip();
      ctx.drawImage(avatar1, 20, 20, 40, 40); // Draw avatar inside the circle
      ctx.restore();

      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(user1.username, 70, 25);
      ctx.font = '14px Arial';
      ctx.fillStyle = '#a3a6aa';
      ctx.fillStyle = '#72767d';
      ctx.fillText(moment().format('HH:mm'), 200, 25);
      ctx.font = '16px Arial';
      ctx.fillStyle = '#dcddde';
      wrapText(ctx, message1, 70, 57, canvas.width - 90, 25);

      // Draw the second user's avatar and message (normal position)
      const avatar2 = await Canvas.loadImage(avatarBuffer2);
      ctx.save();
      ctx.beginPath();
      ctx.arc(40, 120, 20, 0, Math.PI * 2); // Create circular mask
      ctx.clip();
      ctx.drawImage(avatar2, 20, 100, 40, 40); // Draw avatar inside the circle
      ctx.restore();

      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(user2.username, 70, 115);
      ctx.font = '14px Arial';
      ctx.fillStyle = '#a3a6aa';
      ctx.fillText(``, 70, 135);
      ctx.fillStyle = '#72767d';
      ctx.fillText(moment().format('HH:mm'), 200, 115);
      ctx.font = '16px Arial';
      ctx.fillStyle = '#dcddde';
      wrapText(ctx, message2, 70, 140, canvas.width - 90, 25);

      // Create attachment
      const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'discord-message.png' });

      // Send reply with the image
      interaction.editReply({ files: [attachment] });
    } catch (error) {
      console.error('Error generating Discord message:', error);
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
