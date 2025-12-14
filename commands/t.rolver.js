const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "toplurolver",
    description: "Sunucudaki tüm üyelere toplu rol verir.",
    type: 1,
    options: [
        {
            name: "rol",
            description: "Verilecek rolü seçin.",
            type: 8, // Role type
            required: true
        }
    ],
    run: async (client, interaction) => {
        // Gerekli izinleri kontrol edin
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({
                content: "❌ | Bu komutu kullanmak için `Rolleri Yönet` iznine sahip olmalısınız!",
                ephemeral: true
            });
        }

        const role = interaction.options.getRole("rol");

        // Rol geçerli mi?
        if (!role) {
            return interaction.reply({
                content: "❌ | Geçerli bir rol seçmelisiniz.",
                ephemeral: true
            });
        }

        try {
            await interaction.guild.members.fetch(); // Tüm üyeleri fetch'leyin

            const members = interaction.guild.members.cache.filter(member => !member.user.bot && !member.roles.cache.has(role.id));
            const totalMembers = members.size;

            if (totalMembers === 0) {
                return interaction.reply({
                    content: "❌ | Verilecek rolü almayan hiçbir üye yok.",
                    ephemeral: true
                });
            }

            let givenRoles = 0;
            let startTime = Date.now();

            interaction.reply({ content: `⏳ | Rol verilmeye başlandı. Toplam üye: ${totalMembers}`, ephemeral: true });

            for (const member of members.values()) {
                await member.roles.add(role).catch(error => console.error(`Couldn't add role to ${member.user.tag}:`, error));
                givenRoles++;

                // Verilen rol ve kalan kullanıcıları güncelleyen embed
                const elapsed = Math.floor((Date.now() - startTime) / 1000); // Geçen süre saniye olarak
                const remainingMembers = totalMembers - givenRoles;
                const percentageComplete = ((givenRoles / totalMembers) * 100).toFixed(2);

                const embed = new EmbedBuilder()
                    .setTitle("Toplu Rol Verme İşlemi")
                    .setDescription(`
Yetkili: ${interaction.user.tag}
Verilen Rol: ${role.name}
Toplam Üye: ${totalMembers}
Verilen Sayı: ${givenRoles}
Kalan Sayı: ${remainingMembers}
Kalan Yüzde: %${percentageComplete}
Geçen Süre: ${formatTime(elapsed)}
Tahmini Kalan Süre: ${formatTime((elapsed / givenRoles) * remainingMembers)}
`)
                    .setFooter({ text: `Tarih: ${new Date().toLocaleString()}` })
                    .setColor("#00FF00");

                // Sunucu logosu varsa kullan, yoksa botun avatarını kullan
                const guildIcon = interaction.guild.iconURL();
                const botAvatar = client.user.displayAvatarURL();

                if (guildIcon) {
                    embed.setThumbnail(guildIcon); // Sunucu logosu varsa ekle
                } else {
                    embed.setThumbnail(botAvatar); // Sunucu logosu yoksa botun logosunu ekle
                }

                if (givenRoles % 50 === 0 || givenRoles === totalMembers) {
                    interaction.channel.send({ embeds: [embed] });
                }
            }

            interaction.channel.send({ content: `✅ | Rol verme işlemi başarıyla tamamlandı. Toplam: ${givenRoles}` });

        } catch (error) {
            console.error("Error fetching members:", error);
            return interaction.reply({
                content: "❌ | Üyeler getirilirken bir hata oluştu. Lütfen tekrar deneyin.",
                ephemeral: true
            });
        }
    }
};

// Süreyi biçimlendiren yardımcı fonksiyon
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
