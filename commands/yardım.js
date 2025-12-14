const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    name: "yardım",
    description: "Botun yardım menüsünü görüntüle.",
    run: async (client, interaction) => {
        // Canvas oluştur
        const canvas = createCanvas(800, 1000);
        const ctx = canvas.getContext('2d');

        // Arka plan rengi (Discord'un koyu temasına uygun)
        ctx.fillStyle = '#313338';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Başlık
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('📖 Yardım Menüsü', canvas.width / 2, 80);

        // Bot avatarını ekle
        try {
            const botAvatar = await loadImage(client.user.displayAvatarURL({ extension: 'png' }));
            ctx.save();
            ctx.beginPath();
            ctx.arc(100, 80, 30, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(botAvatar, 70, 50, 60, 60);
            ctx.restore();
        } catch (err) {
            console.error('Avatar yüklenirken hata:', err);
        }

        // Metinler
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        
        const commandsText = `
KULLANICI KOMUTLARI
/avatar - Avatarına bakarsın!
/afk - Afk olursun!
/aşk-ölçer - Aşkınız ölçer!
/level - Levelinizi gösterir!
/banner - Bannerlara bakarsın!
/özel-oda-aç - Özel oda açar!
/istatistik - Bot istatistikleri!
/kurucu-kim - Sunucu kurucusunu gösterir!
/ping - Botun pingini gösterir!
/yardım - Yardım menüsü!
/davet - Botun davet linki!
/kullanıcı-bilgi - Kullanıcı bilgisi!
/random-anime - Random Anime atar.
/say - Sunucu üye sayısı.
/sunucupp - Sunucunun avatarı.
/sunucu-bilgi - Sunucu bilgileri.

LEVEL KOMUTLARI
/level-sistemi - Level sistemini açar.
/xp-ekle - XP ekler.
/xp-kaldır - XP kaldırır.
/level-ekle - Level ekler.
/level-kaldır - Level kaldırır.
/level-sıralaması - Level sıralaması.

DESTEK SİSTEMİ
/destek-sistemi - Destek sistemini açar.
/destek-sistemi-sıfırla - Sistemi sıfırlar.

KORUMA SİSTEMİ
/hesap-koruma - Hesap koruma sistemi.

KAYIT SİSTEMİ
/kayıt-sistemi - Kayıt sistemini açar.
/kayıt-sistemi-kapat - Sistemi kapatır.
/kayıt - Kullanıcıyı kaydeder.
        `;

        // Metni satır satır çiz
        const lines = commandsText.split('\n');
        let y = 140;
        const lineHeight = 30;
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            // Başlıkları farklı renk ve boyutta yap
            if (lines[i].toUpperCase() === lines[i] && lines[i].trim() !== '') {
                ctx.font = 'bold 24px Arial';
                ctx.fillStyle = '#5865F2'; // Discord mavisi
                y += lineHeight;
            } else {
                ctx.font = '20px Arial';
                ctx.fillStyle = '#dbdee1'; // Açık gri
            }
            
            ctx.fillText(lines[i], 50, y);
            y += lineHeight;
        }

        // Alt bilgi
        ctx.font = '16px Arial';
        ctx.fillStyle = '#b5bac1';
        ctx.textAlign = 'center';
        ctx.fillText(`${client.user.username} • ${new Date().getFullYear()}`, canvas.width / 2, 980);

        // Canvas'ı attachment'a çevir
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'yardim-menusu.png' });

        // Embed oluştur
        const embed = new EmbedBuilder()
            .setTitle('📖 Yardım Menüsü')
            .setColor('#5865F2')
            .setImage('attachment://yardim-menusu.png');

        await interaction.reply({ embeds: [embed], files: [attachment] });
    }
};