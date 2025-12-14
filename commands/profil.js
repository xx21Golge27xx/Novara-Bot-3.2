const { Client, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const db = require("croxydb");
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = {
  name: "profil",
  description: "Kullanıcının profil bilgilerini gösterir.",
  type: 1,
  options: [
    {
      name: "kullanıcı",
      description: "Profilini görmek istediğiniz kullanıcıyı seçin.",
      type: 6, // USER type
      required: false
    }
  ],

  run: async (client, interaction) => {
    const user = interaction.options.getUser("kullanıcı") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    // Kullanıcının repütasyon puanını al
    const reputation = db.get(`reputation_${user.id}`) || 0;

    // Canvas oluştur
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // Gradient arka plan
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#23272a');
    gradient.addColorStop(1, '#2c2f33');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Arka plan deseni (küçük daireler)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 3;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Kullanıcı avatarını yükle ve çiz
    try {
      const avatar = await loadImage(user.displayAvatarURL({ extension: 'png', size: 256 }));
      // Avatar için yuvarlak mask
      ctx.beginPath();
      ctx.arc(150, 200, 100, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.save();
      ctx.clip();
      ctx.drawImage(avatar, 50, 100, 200, 200);
      ctx.restore();
      
      // Avatar kenarlığı
      ctx.strokeStyle = '#7289da';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(150, 200, 100, 0, Math.PI * 2, true);
      ctx.stroke();
    } catch (error) {
      console.error('Avatar yüklenirken hata oluştu:', error);
    }

    // Metin stilleri
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'left';

    // Kullanıcı adı
    ctx.fillText(`👤 ${user.username}#${user.discriminator}`, 300, 120);

    // Hesap oluşturulma tarihi
    const createdDate = new Date(user.createdTimestamp).toLocaleDateString();
    ctx.font = '24px Arial';
    ctx.fillText(`📅 Hesap Oluşturulma: ${createdDate}`, 300, 170);

    // Sunucuya katılma tarihi
    const joinedDate = new Date(member.joinedTimestamp).toLocaleDateString();
    ctx.fillText(`🏠 Sunucuya Katılma: ${joinedDate}`, 300, 220);

    // Repütasyon
    ctx.fillText(`⭐ Saygı Puanı: ${reputation}`, 300, 270);

    // Alt çizgi
    ctx.strokeStyle = '#7289da';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 130);
    ctx.lineTo(700, 130);
    ctx.stroke();

    // Canvas'ı buffer'a çevir
    const buffer = canvas.toBuffer('image/png');
    const attachment = new AttachmentBuilder(buffer, { name: 'profil.png' });

    // Mesajı gönder
    interaction.reply({ files: [attachment] });
  }
};