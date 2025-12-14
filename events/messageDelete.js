const { EmbedBuilder } = require("discord.js");

const disabledUsers = new Set();

module.exports = {
    name: "messageDelete", 
    once: false,
    run: async (client, message) => {
        try {
            if (message.author.bot) return;
            if (!message.guild) return;

            const mentionedUser = message.mentions.users.first();
            if (mentionedUser) {
                const isDisabled = disabledUsers.has(mentionedUser.id);
                if (isDisabled) return;

                const deletedMessageContent = message.content;
                const createdTime = message.createdTimestamp;
                const deleteTime = Date.now();
                const diff = deleteTime - createdTime;

                const seconds = Math.floor((diff / 1000) % 60);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));

                let timeAgo = "";
                if (days > 0) {
                    timeAgo += `${days} **gün** `;
                    if (minutes > 0) timeAgo += `${minutes} **dakika** `;
                    if (seconds > 0) timeAgo += `${seconds} **saniye**`;
                } else {
                    if (hours > 0) timeAgo += `${hours} **saat** `;
                    if (minutes > 0) timeAgo += `${minutes} **dakika** `;
                    if (seconds > 0) timeAgo += `${seconds} **saniye**`;
                }

                const dmEmbed = new EmbedBuilder()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() || client.user.displayAvatarURL() })
                    .setDescription(`**${message.author} (${message.author.tag}) tarafından etiketlendiniz ancak mesaj silindi.**`)
                    .addFields(
                        { name: "📋 **Silinen Mesaj İçeriği:**", value: deletedMessageContent ? deletedMessageContent : "*Boş bir mesajdı.*" },
                        { name: "**<:Information:1351467741114011698> Mesaj Bilgileri:**", value: `🕒 **Mesaj Yazılış:** <t:${parseInt(createdTime / 1000)}:F>\n🗑️ **Mesaj Sİlinme:** ${timeAgo}` },
                        { 
                            name: "📍 **Mesaj Konumu:**", 
                            value: `${message.channel.url}\n[Silindiği Yere Git](https://discord.com/channels/${message.guild.id}/${message.channel.id}?message=${message.id})` // Mesajın silindiği yere gidecek
                        }
                    )
                    .setColor('#FF0000')
                    .setTimestamp()
                    .setThumbnail(message.guild.iconURL())
                    .setFooter({ text: `🔹 **Mesajı Silen:** ${message.author.username} `, iconURL: message.author.displayAvatarURL() });

                await mentionedUser.send({ embeds: [dmEmbed] }).catch(() => null);
                console.log(`[+] Etiketlenen kullanıcı ${mentionedUser.tag} için silinen mesaj bilgisi DM olarak gönderildi.`);
            }
        } catch (err) {
            console.error('Bir hata oluştu:', err);
        }
    }
};