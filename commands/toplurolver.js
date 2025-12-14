const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

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

        // Etkileşimli mesaj oluştur
        const embed = new EmbedBuilder()
            .setTitle("Toplu Rol Verme Onayı")
            .setDescription(`${interaction.user.toString()} herkese rol vermek istiyor musunuz?`)
            .addFields(
                { name: "Verilecek Rol:", value: `${role.toString()}`, inline: true },
                { name: "Verilecek Süre:", value: "00:09", inline: true }
            )
            .setFooter({ text: `Tarih: ${new Date().toLocaleString()}` })
            .setColor("#00FF00");

        // Butonlar oluştur
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("onayla")
                    .setLabel("Evet")
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("✅"),
                new ButtonBuilder()
                    .setCustomId("iptal")
                    .setLabel("Hayır")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("❌")
            );

        // Mesajı gönder
        const response = await interaction.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true
        });

        // Buton etkileşimlerini dinle
        const collector = response.createMessageComponentCollector({
            time: 90000 // 90 saniye
        });

        collector.on("collect", async i => {
            if (i.customId === "onayla") {
                // Onaylandıysa rol verme işlemini başlat
                try {
                    await i.deferUpdate();
                    await interaction.guild.members.fetch();

                    const members = interaction.guild.members.cache.filter(member => !member.user.bot && !member.roles.cache.has(role.id));
                    const totalMembers = members.size;

                    if (totalMembers === 0) {
                        await interaction.editReply({
                            content: "❌ | Verilecek rolü almayan hiçbir üye yok.",
                            embeds: [],
                            components: []
                        });
                        return;
                    }

                    let givenRoles = 0;
                    let startTime = Date.now();

                    await interaction.editReply({
                        content: `⏳ | Rol verilmeye başlandı. Toplam üye: ${totalMembers}`,
                        embeds: [],
                        components: []
                    });

                    for (const member of members.values()) {
                        await member.roles.add(role).catch(error => console.error(`Couldn't add role to ${member.user.tag}:`, error));
                        givenRoles++;

                        // İlerlemeyi göster
                        if (givenRoles % 10 === 0 || givenRoles === totalMembers) {
                            const elapsed = Math.floor((Date.now() - startTime) / 1000);
                            const remainingMembers = totalMembers - givenRoles;
                            const percentageComplete = ((givenRoles / totalMembers) * 100).toFixed(2);

                            const progressEmbed = new EmbedBuilder()
                                .setTitle("Toplu Rol Verme İşlemi")
                                .setDescription(`
Yetkili: ${interaction.user.tag}
Verilen Rol: ${role.name}
Toplam Üye: ${totalMembers}
Verilen Sayı: ${givenRoles}
Kalan Sayı: ${remainingMembers}
İlerleme: %${percentageComplete}
Geçen Süre: ${formatTime(elapsed)}
Tahmini Kalan Süre: ${formatTime((elapsed / givenRoles) * remainingMembers)}
`)
                                .setFooter({ text: `Tarih: ${new Date().toLocaleString()}` })
                                .setColor("#00FF00");

                            await interaction.channel.send({ embeds: [progressEmbed] });
                        }
                    }

                    await interaction.channel.send({ content: `✅ | Rol verme işlemi başarıyla tamamlandı. Toplam: ${givenRoles}` });

                } catch (error) {
                    console.error("Error:", error);
                    await interaction.editReply({
                        content: "❌ | Rol verme işlemi sırasında bir hata oluştu.",
                        embeds: [],
                        components: []
                    });
                }
            } else if (i.customId === "iptal") {
                // İptal edildiyse mesajı güncelle
                await i.update({
                    content: "❌ | Rol verme işlemi iptal edildi.",
                    embeds: [],
                    components: []
                });
            }
        });

        collector.on("end", collected => {
            if (collected.size === 0) {
                interaction.editReply({
                    content: "⏲️ | Rol verme işlemi zaman aşımına uğradı.",
                    embeds: [],
                    components: []
                });
            }
        });
    }
};

// Süreyi biçimlendiren yardımcı fonksiyon
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}