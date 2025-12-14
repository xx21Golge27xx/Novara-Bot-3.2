const { Client } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require("os");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

module.exports = {
  name: "istatistik",
  description: "Premium bot istatistikleri",
  type: 1,
  options: [],

  run: async (client, interaction) => {
    await interaction.deferReply();

    try {
      // Veriler
      const uptime = moment.duration(client.uptime).format("D [gün], H [saat], m [dakika], s [saniye]");
      const totalUsers = client.guilds.cache.reduce((a,g) => a + (g.memberCount || 0), 0);
      const commandCount = fs.readdirSync(path.join(__dirname, "..", "commands")).filter(f => f.endsWith(".js")).length;
      const cpuModel = os.cpus()[0].model.split(" ").slice(0,4).join(" ");

      // Canvas
      const canvas = createCanvas(1200, 900); // Yükseklik arttırıldı
      const ctx = canvas.getContext("2d");

      // Arkaplan
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, "#0f0c29");
      bgGradient.addColorStop(1, "#24243e");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Başlık
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 52px Arial";
      ctx.fillText("BOT PERFORMANS PANELİ", 80, 100);

      // Avatar
      try {
        const avatar = await loadImage(client.user.displayAvatarURL({ extension: "png", size: 256 }));
        ctx.save();
        ctx.beginPath();
        ctx.arc(1040, 90, 60, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, 980, 30, 120, 120);
        ctx.restore();
      } catch (e) {
        console.error("Avatar hatası:", e);
      }

      // Ana Paneller
      const mainPanels = [
        { 
          title: "PERFORMANCE", 
          color: "#5865F2",
          items: [
            { icon: "⏱️", name: "Uptime", value: uptime },
            { icon: "💾", name: "Memory", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` },
            { icon: "📶", name: "Ping", value: `${client.ws.ping} ms` }
          ],
          pos: { x: 80, y: 200 }
        },
        {
          title: "NETWORK", 
          color: "#3ba55c",
          items: [
            { icon: "👥", name: "Users", value: totalUsers.toLocaleString() },
            { icon: "🛡️", name: "Guilds", value: client.guilds.cache.size },
            { icon: "📁", name: "Channels", value: client.channels.cache.size }
          ],
          pos: { x: 430, y: 200 }
        },
        {
          title: "SYSTEM", 
          color: "#faa61a",
          items: [
            { icon: "⚙️", name: "CPU", value: cpuModel },
            { icon: "📦", name: "Discord.js", value: `v${require("discord.js").version}` },
            { icon: "🟢", name: "Node.js", value: process.version }
          ],
          pos: { x: 780, y: 200 }
        }
      ];

      // Panel çizimi
      mainPanels.forEach(panel => {
        // Panel gölgesi
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 10;
        
        // Panel arkaplan
        ctx.fillStyle = "rgba(30, 31, 34, 0.7)";
        roundRect(ctx, panel.pos.x, panel.pos.y, 320, 300, 20, true, false);
        
        // Başlık çubuğu
        ctx.fillStyle = panel.color;
        roundRect(ctx, panel.pos.x, panel.pos.y, 320, 50, [20,20,0,0], true, false);
        
        // Başlık
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px Arial";
        ctx.fillText(panel.title, panel.pos.x + 20, panel.pos.y + 30);
        
        // İçerik
        let yOffset = panel.pos.y + 80;
        panel.items.forEach(item => {
          ctx.fillStyle = panel.color;
          ctx.font = "28px Arial";
          ctx.fillText(item.icon, panel.pos.x + 20, yOffset);
          
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.font = "16px Arial";
          ctx.fillText(item.name, panel.pos.x + 60, yOffset - 5);
          
          ctx.fillStyle = "#ffffff";
          ctx.font = "18px Arial";
          ctx.fillText(item.value, panel.pos.x + 60, yOffset + 20);
          
          yOffset += 80;
        });
        
        ctx.shadowColor = "transparent";
      });

      // YENİ: BOT BİLGİ PANELİ (PERFORMANCE altına)
      const botInfoPanel = {
        title: "BOT BİLGİ",
        color: "#9c84ef", // Mor renk
        items: [
          { icon: "📜", name: "Komut Sayısı", value: commandCount },
          { icon: "📅", name: "Kuruluş Tarihi", value: "04.09.2024" },
          { icon: "🤖", name: "Bot Sürüm", value: "v2.4.1" }
        ],
        pos: { x: 80, y: 530 } // PERFORMANCE panelinin altına
      };

      // Bot Bilgi Panelini Çiz
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 10;
      
      ctx.fillStyle = "rgba(30, 31, 34, 0.7)";
      roundRect(ctx, botInfoPanel.pos.x, botInfoPanel.pos.y, 320, 300, 20, true, false);
      
      ctx.fillStyle = botInfoPanel.color;
      roundRect(ctx, botInfoPanel.pos.x, botInfoPanel.pos.y, 320, 50, [20,20,0,0], true, false);
      
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px Arial";
      ctx.fillText(botInfoPanel.title, botInfoPanel.pos.x + 20, botInfoPanel.pos.y + 30);
      
      let yOffset = botInfoPanel.pos.y + 80;
      botInfoPanel.items.forEach(item => {
        ctx.fillStyle = botInfoPanel.color;
        ctx.font = "28px Arial";
        ctx.fillText(item.icon, botInfoPanel.pos.x + 20, yOffset);
        
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "16px Arial";
        ctx.fillText(item.name, botInfoPanel.pos.x + 60, yOffset - 5);
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "18px Arial";
        ctx.fillText(item.value, botInfoPanel.pos.x + 60, yOffset + 20);
        
        yOffset += 80;
      });
      
      ctx.shadowColor = "transparent";

      // Alt bilgi
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "italic 14px Arial";
      ctx.fillText(`novara 💸 • ${moment().format("DD.MM.YYYY HH:mm")}`, 80, 870);

      // Görseli gönder
      const buffer = canvas.toBuffer("image/png");
      await interaction.editReply({
        files: [{
          attachment: buffer,
          name: "bot-stats.png"
        }]
      });

    } catch (error) {
      console.error("Hata:", error);
      await interaction.editReply("❌ İstatistikler oluşturulamadı!");
    }
  }
};