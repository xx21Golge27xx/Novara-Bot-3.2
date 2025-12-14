const { Client, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const moment = require('moment');
require('moment/locale/tr'); // For Turkish date formatting

module.exports = {
  name: 'bot-bilgi',
  description: 'Bot hakkında bilgi gösterir.',
  type: 1,

  run: async (client, interaction) => {
    try {
      // Create canvas
      const canvas = Canvas.createCanvas(800, 600);
      const context = canvas.getContext('2d');
      
      // Set background color
      context.fillStyle = '#2c2f33';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add header
      context.fillStyle = '#7289da';
      context.fillRect(0, 0, canvas.width, 80);
      
      // Add bot name
      context.font = 'bold 36px Arial';
      context.fillStyle = '#ffffff';
      context.textAlign = 'center';
      context.fillText(`${client.user.username} Bilgi Paneli`, canvas.width / 2, 55);
      
      // Add boxes
      const boxWidth = 700;
      const boxHeight = 80;
      const boxX = (canvas.width - boxWidth) / 2;
      
      // Box styles
      const boxStyles = {
        fill: '#36393f',
        stroke: '#7289da',
        text: '#ffffff',
        subtext: '#b9bbbe'
      };
      
      // Draw boxes with information
      const drawBox = (y, title, value, subvalue = '') => {
        // Box background
        context.fillStyle = boxStyles.fill;
        context.fillRect(boxX, y, boxWidth, boxHeight);
        
        // Box border
        context.strokeStyle = boxStyles.stroke;
        context.lineWidth = 3;
        context.strokeRect(boxX, y, boxWidth, boxHeight);
        
        // Title
        context.font = 'bold 20px Arial';
        context.fillStyle = boxStyles.text;
        context.textAlign = 'left';
        context.fillText(title, boxX + 20, y + 30);
        
        // Value
        context.font = '18px Arial';
        context.fillStyle = boxStyles.text;
        context.textAlign = 'right';
        context.fillText(value, boxX + boxWidth - 20, y + 30);
        
        // Subvalue (if exists)
        if (subvalue) {
          context.font = '14px Arial';
          context.fillStyle = boxStyles.subtext;
          context.textAlign = 'right';
          context.fillText(subvalue, boxX + boxWidth - 20, y + 55);
        }
      };
      
      // Bot owner (replace 'YOUR_USER_ID' with your actual Discord ID)
      const ownerId = '1173968740677853316'; // Replace with your ID
      const owner = await client.users.fetch(ownerId);
      drawBox(100, 'Bot Sahibi', owner.tag, `ID: ${owner.id}`);
      
      // Bot developers (replace with actual developer IDs)
      const developers = ['1173968740677853316']; // Add developer IDs here
      const developerTags = await Promise.all(developers.map(id => client.users.fetch(id).then(u => u.tag)));
      drawBox(200, 'Bot Developerları', developerTags.join(', '));
      
      // Bot admins (replace with actual admin IDs)
      const admins = ['1173968740677853316']; // Add admin IDs here
      const adminTags = await Promise.all(admins.map(id => client.users.fetch(id).then(u => u.tag)));
      drawBox(300, 'Bot Adminleri', adminTags.join(', '));
      
      // Bot name
      drawBox(400, 'Bot İsmi', client.user.username, `ID: ${client.user.id}`);
      
      // Command count
      const commandCount = client.commands.size;
      drawBox(500, 'Bot Komut Sayısı', commandCount.toString());
      
      // Creation date
      const creationDate = moment(client.user.createdAt).locale('tr').format('LL LTS');
      drawBox(500, 'Bot Kuruluş Tarihi', creationDate);
      
      // Convert canvas to buffer and send as attachment
      const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'bot-bilgi.png' });
      
      interaction.reply({ files: [attachment] });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.', ephemeral: true });
    }
  }
};