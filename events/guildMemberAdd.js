const Discord = require("discord.js");
const db = require("croxydb");
const config = require("../config.json");

module.exports = {
    name: "guildMemberAdd",

    run: async (client, member) => {
        const hgbb = db.fetch(`hgbb_${member.guild.id}`);
        const sayacmessage = db.fetch(`sayacmessage_${member.guild.id}`);
        const currentCount = member.guild.memberCount;
        const logChannelName = "davet-log";

        // Hoş geldin mesajı
        if (hgbb) {
            const channel = member.guild.channels.cache.find(c => c.id === hgbb.channel);
            if (channel) {
                const messageText = sayacmessage
                    ? sayacmessage.joinMsg
                          .replace("{guild.memberCount}", `${currentCount}`)
                          .replace("{guild.name}", `${member.guild.name}`)
                          .replace("{owner.name}", `<@${member.guild.ownerId}>`)
                          .replace("{member}", `<@${member.user.id}>`)
                    : `:inbox_tray: | ${member} Sunucumuza Katıldı!\nSunucumuz **${currentCount}** kişi oldu!`;

                const embed = new Discord.EmbedBuilder()
                    .setTitle("Hoşgeldin!")
                    .setDescription(messageText)
                    .setColor("#0099ff")
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                    .setTimestamp();

                try {
                    channel.send({ embeds: [embed] });
                } catch (err) {
                    console.error("Mesaj gönderilirken bir hata oluştu:", err);
                }
            }
        }

        // Davetçi Bilgisi
        try {
            const invites = await member.guild.invites.fetch();
            const invite = invites.find(i => i.uses > i.code.length);
            if (invite) {
                const inviter = await member.guild.members.fetch(invite.inviter.id);
                const davetciMesaj = new Discord.EmbedBuilder()
                    .setTitle("Davet Edildiniz")
                    .setDescription(`${member} sunucuya **${inviter}** tarafından davet edildi.`)
                    .setColor("#00ff00")
                    .setFooter({ text: "Davet Sistemi" });

                const logChannel = member.guild.channels.cache.find(ch => ch.name === logChannelName);
                if (logChannel) {
                    logChannel.send({ embeds: [davetciMesaj] });
                }
            }
        } catch (err) {
            console.error("Davet bilgisi alınırken bir hata oluştu:", err);
        }

        // Bot Onaylama
        const data = db.fetch(`ekleniyor_${member.user.id}${member.guild.id}`);
        if (member.user.bot && data) {
            try {
                let useravatar = await client.users.fetch(data.bot);
                let avatar = useravatar.avatar;
                let link = `https://cdn.discordapp.com/avatars/${data.bot}/${avatar}.png?size=1024`;
                const embed = new Discord.EmbedBuilder()
                    .setTitle("<:tik:1039607067729727519> | Bot Onaylandı!")
                    .setDescription(`<@${data.bot}> adlı botun başvurusu kabul edildi!`)
                    .setThumbnail(link)
                    .setColor("Green");

                const user = await member.guild.members.cache.get(data.user);
                const botrole = db.fetch(`botRol_${member.guild.id}`);
                const userrole = db.fetch(`devRol_${member.guild.id}`);

                member.roles.add(botrole);
                user.roles.add(userrole);

                const log = db.fetch(`log_${member.guild.id}`);
                const channel = await member.guild.channels.cache.get(log);

                try {
                    channel.send({ content: `${user}`, embeds: [embed] });
                } catch (err) {
                    console.error("Bot onaylama işlemi sırasında bir hata oluştu:", err);
                }
                db.delete(`botSira_${member.guild.id}`, 1);
            } catch (err) {
                console.error("Bot bilgilerini getirirken bir hata oluştu:", err);
            }
        }

        // Otomatik Tag
        const tag = db.get(`ototag_${member.guild.id}`);
        if (tag) {
            member.setNickname(`${tag} | ${member.displayName}`).catch(console.error);
        }

        // Otomatik Rol
        const acc = member.user.bot ? db.fetch(`botrol_${member.guild.id}`) : db.fetch(`otorol_${member.guild.id}`);
        if (acc) {
            member.roles.add(acc).catch(() => {});
        }

        // Hesap Koruma
        const hesapKoruma1 = db.fetch(`hesapkoruma1_${member.guild.id}`);
        const hesapkorumaSystem = db.fetch(`hesapkoruma_${member.guild.id}`);
        if (hesapKoruma1 && hesapkorumaSystem) {
            const logChannel = member.guild.channels.cache.get(hesapKoruma1.channel);

            const now = new Date().getTime() - client.users.cache.get(member.id).createdAt.getTime() < 1296000000;
            if (now) {
                try {
                    member.ban({ reason: "Yeni riskli hesap" });
                    logChannel.send({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setDescription(`⚠️ | **${member.user.tag}**, Hesabı yeni olduğu için sunucudan yasaklandı.`)
                                .setColor(`#FEE75C`)
                                .setFooter({ text: `${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                        ]
                    });
                } catch (err) {
                    console.error("Hesap koruma işlemi sırasında bir hata oluştu:", err);
                }
            }
        }
    }
};
