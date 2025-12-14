const { AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  name: "level",
  description: "Bir kullanıcının seviyesini görüntüleyin.",
  type: 1,
  options: [
    {
      name: "kullanıcı",
      description: "Seviyesini görüntülemek istediğiniz kullanıcıyı etiketleyin.",
      type: 6,
      required: false,
    },
  ],

  run: async (client, interaction, db) => {
    const { user, guild } = interaction;
    const targetUser = interaction.options.getUser("kullanıcı") || user;

    const level = db.get(`levelPos_${targetUser.id}${guild.id}`) || 0;
    const xp = db.get(`xpPos_${targetUser.id}${guild.id}`) || 0;

    // Canvas oluştur
    const canvas = createCanvas(800, 300);
    const ctx = canvas.getContext("2d");

    // Arka plan
    ctx.fillStyle = "#2C2F33";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Avatar (sola yerleştirildi)
    try {
      const avatar = await loadImage(
        targetUser.displayAvatarURL({ extension: "jpg", size: 256 })
      );
      ctx.save(); // clipping öncesi kaydet
      ctx.beginPath();
      ctx.arc(125, 150, 75, 0, Math.PI * 2, true); // x:125, radius:75
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 50, 75, 150, 150); // Sola hizalı
      ctx.restore(); // clipping sonrası geri yükle
    } catch (error) {
      console.error("Error loading avatar:", error);
    }

    // Bilgi kutusu (avatarın sağına)
    const infoBoxX = 250;
    const infoBoxY = 50;
    const infoBoxWidth = 500;
    const infoBoxHeight = 200;

    ctx.fillStyle = "#23272A";
    ctx.roundRect(infoBoxX, infoBoxY, infoBoxWidth, infoBoxHeight, 15).fill();

    ctx.strokeStyle = "#7289DA";
    ctx.lineWidth = 3;
    ctx.roundRect(infoBoxX, infoBoxY, infoBoxWidth, infoBoxHeight, 15).stroke();

    // Başlık (Kullanıcı adı)
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`${targetUser.username} kullanıcısının Seviyesi`, infoBoxX + 20, infoBoxY + 50);

    // Seviye bilgisi
    ctx.font = "24px Arial";
    ctx.fillText(`Seviye: ${level}`, infoBoxX + 20, infoBoxY + 100);
    ctx.fillText(`XP: ${xp}`, infoBoxX + 20, infoBoxY + 150);

    // İlerleme çubuğu arka plan
    ctx.fillStyle = "#4A4E54";
    ctx.roundRect(infoBoxX + 20, infoBoxY + 170, infoBoxWidth - 40, 20, 10).fill();

    // Dolgu kısmı
    const progressWidth = (xp % 1000) / 1000 * (infoBoxWidth - 40);
    ctx.fillStyle = "#7289DA";
    ctx.roundRect(infoBoxX + 20, infoBoxY + 170, progressWidth, 20, 10).fill();

    // Border
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Gönderim
    const buffer = canvas.toBuffer("image/png");
    const attachment = new AttachmentBuilder(buffer, { name: "level-card.png" });
    interaction.reply({ files: [attachment] });
  },
};

// roundRect fonksiyonu
const { CanvasRenderingContext2D } = require("canvas");
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};
