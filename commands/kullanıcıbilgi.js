const { AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const { format } = require("date-fns");
const { tr } = require("date-fns/locale");
const path = require("path");

module.exports = {
    name: "kullanıcı-bilgi",
    description: "Kullanıcı bilgisi görseli gönderir",
    type: 1,
    options: [
        {
            name: "kullanıcı",
            description: "Bilgilerini görmek istediğiniz kullanıcı",
            type: 6,
            required: true,
        },
    ],
    run: async (client, interaction) => {
        const member = interaction.options.getMember("kullanıcı");
        const now = new Date();

        // Hesaplamalar
        const accountAge = Math.floor((now - member.user.createdAt) / (1000 * 60 * 60 * 24));
        const joinAge = Math.floor((now - member.joinedAt) / (1000 * 60 * 60 * 24));
        
        // Tarih formatları
        const createdAt = format(member.user.createdAt, "d MMMM yyyy HH:mm", { locale: tr });
        const joinedAt = format(member.joinedAt, "d MMMM yyyy HH:mm", { locale: tr });
        const currentDate = format(now, "d MMMM yyyy", { locale: tr });
        const currentTime = format(now, "HH:mm:ss", { locale: tr });

        // Canvas oluşturma
        const canvas = createCanvas(1000, 600); // Daha geniş bir canvas
        const ctx = canvas.getContext("2d");

        // Arkaplan gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#1a1a2e");
        gradient.addColorStop(1, "#16213e");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Sol taraf - Profil bölümü
        try {
            // Profil kartı arkaplan
            ctx.fillStyle = "#0f3460";
            ctx.beginPath();
            ctx.roundRect(30, 30, 340, 540, 15);
            ctx.fill();
            
            // Durum şeridi
            const status = member.presence?.status || "offline";
            ctx.fillStyle = getStatusColor(status);
            ctx.beginPath();
            ctx.roundRect(30, 30, 340, 15, { topLeft: 15, topRight: 15, bottomLeft: 0, bottomRight: 0 });
            ctx.fill();
            
            // Avatar yuvarlak çerçeve
            const avatar = await loadImage(member.user.displayAvatarURL({ 
                extension: "png", 
                size: 256,
                forceStatic: false
            }));
            
            // Avatar arkaplan efekti
            ctx.fillStyle = getStatusBackground(status);
            ctx.beginPath();
            ctx.arc(200, 180, 95, 0, Math.PI * 2, true);
            ctx.fill();
            
            // Avatar
            ctx.beginPath();
            ctx.arc(200, 180, 85, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.save();
            ctx.clip();
            ctx.drawImage(avatar, 115, 95, 170, 170);
            ctx.restore();
            
            // Avatar çerçevesi
            ctx.strokeStyle = getStatusColor(status);
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(200, 180, 88, 0, Math.PI * 2, true);
            ctx.stroke();
            
            // Kullanıcı adı ve etiket
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 26px 'Arial'";
            ctx.textAlign = "center";
            ctx.fillText(member.user.username, 200, 290);
            
            ctx.font = "20px 'Arial'";
            ctx.fillStyle = "#b8b8b8";
            ctx.fillText(`#${member.user.discriminator}`, 200, 320);
            
            // Durum göstergesi
            ctx.fillStyle = getStatusColor(status);
            ctx.beginPath();
            ctx.arc(200, 350, 8, 0, Math.PI * 2, true);
            ctx.fill();
            
            ctx.font = "bold 18px 'Arial'";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(getStatusText(status).toUpperCase(), 200, 370);
            
            // Ayırıcı çizgi
            ctx.strokeStyle = "#2a3a5e";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(50, 400);
            ctx.lineTo(350, 400);
            ctx.stroke();
            
            // Ek bilgiler
            ctx.font = "18px 'Arial'";
            ctx.textAlign = "left";
            ctx.fillStyle = "#e94560";
            ctx.fillText("Hesap Bilgileri", 50, 430);
            
            ctx.font = "16px 'Arial'";
            ctx.fillStyle = "#b8b8b8";
            ctx.fillText(`Oluşturulma: ${createdAt}`, 50, 460);
            ctx.fillText(`Katılma: ${joinedAt}`, 50, 490);
            ctx.fillText(`ID: ${member.id}`, 50, 520);
            
        } catch (error) {
            console.error("Avatar yüklenemedi:", error);
        }

        // Sağ taraf - Detaylı bilgiler
        ctx.fillStyle = "#0f3460";
        ctx.beginPath();
        ctx.roundRect(400, 30, 570, 540, 15);
        ctx.fill();
        
        // Başlık
        ctx.fillStyle = "#e94560";
        ctx.font = "bold 30px 'Arial'";
        ctx.textAlign = "left";
        ctx.fillText("KULLANICI İSTATİSTİKLERİ", 420, 70);

        // Bilgi kutuları
        let yPosition = 110;
        const boxHeight = 80;
        const boxSpacing = 20;
        
        const drawInfoBox = (title, value, icon = null) => {
            // Kutu arkaplan
            ctx.fillStyle = "#1a1a2e";
            ctx.beginPath();
            ctx.roundRect(420, yPosition, 530, boxHeight, 10);
            ctx.fill();
            
            // Kutu çerçeve
            ctx.strokeStyle = "#2a3a5e";
            ctx.lineWidth = 2;
            ctx.strokeRect(420, yPosition, 530, boxHeight);
            
            // Başlık
            ctx.fillStyle = "#e94560";
            ctx.font = "bold 16px 'Arial'";
            ctx.fillText(title, 440, yPosition + 25);
            
            // Değer
            ctx.fillStyle = "#ffffff";
            ctx.font = "22px 'Arial'";
            ctx.fillText(value, 440, yPosition + 55);
            
            yPosition += boxHeight + boxSpacing;
        };

        // Rol bilgisi (özel kutu)
        const roles = member.roles.cache
            .filter(role => role.id !== interaction.guild.id)
            .map(role => role.name)
            .join(", ") || "Rol yok";
        
        // Rol bilgisi için özel kutu
        ctx.fillStyle = "#1a1a2e";
        ctx.beginPath();
        ctx.roundRect(420, yPosition, 530, 120, 10);
        ctx.fill();
        ctx.strokeStyle = "#2a3a5e";
        ctx.lineWidth = 2;
        ctx.strokeRect(420, yPosition, 530, 120);
        
        ctx.fillStyle = "#e94560";
        ctx.font = "bold 16px 'Arial'";
        ctx.fillText("ROLLER", 440, yPosition + 25);
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "18px 'Arial'";
        wrapText(ctx, roles, 440, yPosition + 55, 520, 25);
        
        yPosition += 140;

        // Bilgi kutularını çiz
        drawInfoBox("HESAP YAŞI", `${accountAge} gün (${Math.floor(accountAge/365)} yıl)`);
        drawInfoBox("SUNUCUDA SÜRE", `${joinAge} gün (${Math.floor(joinAge/365)} yıl)`);
        drawInfoBox("TAKMA AD", member.nickname || "Yok");
        drawInfoBox("ROL SAYISI", (member.roles.cache.size - 1).toString());
        drawInfoBox("NİTRO BOOST", member.premiumSince ? "✅ Aktif" : "❌ Yok");

        // Alt bilgi
        ctx.fillStyle = "#3ba55c";
        ctx.font = "14px 'Arial'";
        ctx.textAlign = "right";
        ctx.fillText(`Sorgulama Tarihi: ${currentDate} ${currentTime}`, 930, 580);

        // Dosyayı gönder
        const buffer = canvas.toBuffer("image/png");
        const attachment = new AttachmentBuilder(buffer, { name: `kullanici-bilgi-${member.user.username}.png` });
        
        await interaction.reply({ files: [attachment] });
    },
};

// Metni belirli bir genişliğe sığacak şekilde kaydırma
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    let lineCount = 0;
    const maxLines = 3;

    for(let n = 0; n < words.length; n++) {
        if (lineCount >= maxLines) {
            testLine = line + '...';
            context.fillText(testLine, x, y);
            return;
        }
        
        testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
            lineCount++;
        } else {
            line = testLine;
        }
    }
    
    context.fillText(line, x, y);
}

// Durum yardımcı fonksiyonları
function getStatusText(status) {
    return {
        online: "Çevrimiçi",
        idle: "Boşta",
        dnd: "Rahatsız Etmeyin",
        offline: "Çevrimdışı"
    }[status] || "Bilinmiyor";
}

function getStatusColor(status) {
    return {
        online: "#3BA55C", // Yeşil
        idle: "#FAA61A",   // Sarı
        dnd: "#ED4245",    // Kırmızı
        offline: "#747F8D" // Gri
    }[status] || "#FFFFFF";
}

function getStatusBackground(status) {
    return {
        online: "#3BA55C20", // %20 opacity
        idle: "#FAA61A20",
        dnd: "#ED424520",
        offline: "#747F8D20"
    }[status] || "#36393F";
}