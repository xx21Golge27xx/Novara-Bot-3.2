const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "toplurolal",
    description: "Sunucudaki tüm üyelere toplu rol alır.",
    type: 1,
    options: [
        {
            name: "rol",
            description: "Alınacak rolü seçin.",
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

            const members = interaction.guild.members.cache.filter(member => !member.user.bot && member.roles.cache.has(role.id));
            const totalMembers = members.size;

            if (totalMembers === 0) {
                return interaction.reply({
                    content: "❌ | Alınacak rolü olan hiçbir üye yok.",
                    ephemeral: true
                });
            }

            let removedRoles = 0;
            let startTime = Date.now();

            interaction.reply({ content: `⏳ | Rol alım işlemi başlatıldı. Toplam üye: ${totalMembers}`, ephemeral: true });

            for (const member of members.values()) {
                await member.roles.remove(role).catch(error => console.error(`Couldn't remove role from ${member.user.tag}:`, error));
                removedRoles++;

                // Alınan rol ve kalan kullanıcıları güncelleyen embed
                const elapsed = Math.floor((Date.now() - startTime) / 1000); // Geçen süre saniye olarak
                const remainingMembers = totalMembers - removedRoles;
                const percentageComplete = ((removedRoles / totalMembers) * 100).toFixed(2);

                const embed = new EmbedBuilder()
                    .setTitle("Toplu Rol Alma İşlemi")
                    .setDescription(`
Yetkili: ${interaction.user.tag}
Alınan Rol: ${role.name}
Toplam Üye: ${totalMembers}
Alınan Sayı: ${removedRoles}
Kalan Sayı: ${remainingMembers}
Kalan Yüzde: %${percentageComplete}
Geçen Süre: ${formatTime(elapsed)}
Tahmini Kalan Süre: ${formatTime((elapsed / removedRoles) * remainingMembers)}
`)
                    .setFooter({ text: `Tarih: ${new Date().toLocaleString()}` })
                    .setColor("#FF0000");

                // Sunucu logosu varsa kullan, yoksa botun avatarını kullan
                const guildIcon = interaction.guild.iconURL();
                const botAvatar = client.user.displayAvatarURL();

                if (guildIcon) {
                    embed.setThumbnail(guildIcon); // Sunucu logosu varsa ekle
                } else {
                    embed.setThumbnail(botAvatar); // Sunucu logosu yoksa botun logosunu ekle
                }

                if (removedRoles % 50 === 0 || removedRoles === totalMembers) {
                    interaction.channel.send({ embeds: [embed] });
                }
            }

            interaction.channel.send({ content: `✅ | Rol alma işlemi başarıyla tamamlandı. Toplam: ${removedRoles}` });

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
