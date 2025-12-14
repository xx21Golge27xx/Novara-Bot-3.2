const { Client, PermissionsBitField } = require("discord.js");
const { createCanvas } = require('canvas');
const path = require('path');

module.exports = {
    name: "sil",
    description: 'Belirtilen miktarda mesajı siler ve premium resimli bilgi gönderir',
    type: 1,
    options: [
        {
            name: "miktar",
            description: "Silinecek mesaj sayısı (1-100)",
            type: 4,
            required: true,
            min_value: 1,
            max_value: 100
        },
    ],
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            const errorImg = await generatePremiumErrorImage("YETKİ YOK", "Mesajları yönetme yetkiniz bulunmuyor");
            return interaction.reply({ 
                files: [{
                    attachment: errorImg,
                    name: 'error.png'
                }],
                ephemeral: true 
            });
        }

        const miktar = interaction.options.getInteger('miktar');

        try {
            const fetchedMessages = await interaction.channel.messages.fetch({ limit: miktar });
            const oldMessages = fetchedMessages.filter(msg => (Date.now() - msg.createdTimestamp) > 14 * 24 * 60 * 60 * 1000);

            if (oldMessages.size > 0) {
                const errorImg = await generatePremiumErrorImage(
                    "14 GÜNDEN ESKİ MESAJLAR",
                    `${oldMessages.size} mesaj 14 günden eski olduğu için silinemez`
                );
                return interaction.reply({ 
                    files: [{
                        attachment: errorImg,
                        name: 'error.png'
                    }],
                    ephemeral: true 
                });
            }

            const deletedMessages = await interaction.channel.bulkDelete(miktar, true);
            const successImg = await generatePremiumSuccessImage(deletedMessages.size, interaction.user.username);

            await interaction.reply({ 
                files: [{
                    attachment: successImg,
                    name: 'silinen-mesajlar.png'
                }]
            });

        } catch (error) {
            console.error(error);
            const errorImg = await generatePremiumErrorImage("HATA OLUŞTU", "Mesajları silerken bir hata oluştu");
            interaction.reply({ 
                files: [{
                    attachment: errorImg,
                    name: 'error.png'
                }],
                ephemeral: true 
            });
        }
    },
};

// Yuvarlak dikdörtgen fonksiyonu (Canvas 2D Context prototype'ına ekler)
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Premium Başarı Resmi
async function generatePremiumSuccessImage(messageCount, moderatorName) {
    const canvasWidth = 800;
    const canvasHeight = 400;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Arka plan
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, '#3a7bd5');
    gradient.addColorStop(1, '#00d2ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Şeffaf overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Çerçeve
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    roundRect(ctx, 20, 20, canvasWidth - 40, canvasHeight - 40, 20);
    ctx.stroke();

    // Başlık
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText('MESAJ TEMİZLEME BAŞARILI', canvasWidth / 2, 80);

    // Onay ikonu
    ctx.beginPath();
    ctx.arc(canvasWidth / 2, 180, 60, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(46, 213, 115, 0.8)';
    ctx.shadowColor = 'rgba(46, 213, 115, 0.5)';
    ctx.shadowBlur = 20;
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    ctx.shadowBlur = 0;
    ctx.fillText('✓', canvasWidth / 2 - 2, 200);

    // Bilgi kartı
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    roundRect(ctx, canvasWidth / 2 - 180, 260, 360, 100, 15);
    ctx.fill();
    
    // Bilgiler
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    
    // Silinen mesaj sayısı
    ctx.fillText(`SİLİNEN MESAJ: ${messageCount}`, canvasWidth / 2, 300);
    
    // Yetkili bilgisi
    ctx.font = '22px Arial';
    ctx.fillText(`Yetkili: ${moderatorName}`, canvasWidth / 2, 340);

    return canvas.toBuffer();
}

// Premium Hata Resmi
async function generatePremiumErrorImage(title, subtitle) {
    const canvasWidth = 800;
    const canvasHeight = 400;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Arka plan
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, '#ff416c');
    gradient.addColorStop(1, '#ff4b2b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Şeffaf overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Çerçeve
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    roundRect(ctx, 20, 20, canvasWidth - 40, canvasHeight - 40, 20);
    ctx.stroke();

    // Başlık
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText(title, canvasWidth / 2, 100);

    // Hata ikonu
    ctx.beginPath();
    ctx.arc(canvasWidth / 2, 200, 60, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 71, 87, 0.8)';
    ctx.shadowColor = 'rgba(255, 71, 87, 0.5)';
    ctx.shadowBlur = 20;
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    ctx.shadowBlur = 0;
    ctx.fillText('✗', canvasWidth / 2 - 2, 220);

    // Hata mesajı
    ctx.font = '28px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(subtitle, canvasWidth / 2, 300);

    return canvas.toBuffer();
}