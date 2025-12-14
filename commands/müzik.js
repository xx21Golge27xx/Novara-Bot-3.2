const { Client, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const axios = require('axios');
const ytdl = require('@distube/ytdl-core');

const YOUTUBE_API_KEY = 'AIzaSyBYpdrSkT_g_W1IXZIvzPpnLsjz-BQ1as4'; // API anahtarınızı buraya ekleyin
const SEARCH_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

const queue = new Map();

async function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        if (serverQueue.connection) {
            serverQueue.connection.disconnect(); // Ses kanalından çık
        }
        queue.delete(guild.id);
        return;
    }

    try {
        const response = await axios.get(SEARCH_BASE_URL, {
            params: {
                part: 'snippet',
                q: song,
                type: 'video',
                key: YOUTUBE_API_KEY,
            },
        });

        const video = response.data.items[0];
        if (!video) {
            return serverQueue.textChannel.send("❌ | Şarkı bulunamadı.");
        }

        const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
        const videoTitle = video.snippet.title;
        const videoThumbnail = video.snippet.thumbnails.default.url;

        const resource = createAudioResource(ytdl(videoUrl, { filter: 'audioonly', highWaterMark: 1 << 25 }));
        serverQueue.player.play(resource);
        serverQueue.connection.subscribe(serverQueue.player);

        const songEmbed = new EmbedBuilder()
            .setTitle("🎵 Şarkı Çalınıyor")
            .setDescription(`**Şarkı:** [${videoTitle}](${videoUrl})\n**Çalan Kişi:** ${serverQueue.currentDJ}`)
            .setThumbnail(videoThumbnail)
            .setColor("Purple")
            .setTimestamp();

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('muzikkapat')
                    .setLabel('Müzik Kapat')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('sıradaki')
                    .setLabel('Atla')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('kuyruk')
                    .setLabel('Kuyruk')
                    .setStyle(ButtonStyle.Secondary)
            );

        await serverQueue.textChannel.send({ embeds: [songEmbed], components: [buttons] });

        serverQueue.player.on(AudioPlayerStatus.Idle, () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        });

        serverQueue.player.on('error', error => {
            console.error('Şarkı çalınırken hata oluştu:', error);
            serverQueue.textChannel.send("❌ | Şarkı çalınırken bir hata oluştu. Lütfen tekrar deneyin.");
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        });
    } catch (error) {
        console.error('Şarkı oynatılırken hata oluştu:', error);
        serverQueue.textChannel.send("❌ | Şarkı çalınırken bir hata oluştu. Lütfen tekrar deneyin.");
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    }
}

module.exports = {
    name: "muzikçal",
    description: "Bir şarkıyı çalar.",
    type: 1,
    options: [
        {
            name: 'şarkı',
            type: 3,
            description: 'Çalmak istediğiniz şarkının adı.',
            required: true
        }
    ],
    run: async (client, interaction) => {
        const song = interaction.options.getString('şarkı');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: "❌ | Bu komutu kullanmak için bir ses kanalında olmalısınız!", ephemeral: true });
        }

        const serverQueue = queue.get(interaction.guild.id);

        if (!serverQueue) {
            const queueConstruct = {
                textChannel: interaction.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                player: createAudioPlayer(),
                playing: false,
                currentDJ: interaction.user.username
            };

            queue.set(interaction.guild.id, queueConstruct);
            queueConstruct.songs.push(song);

            try {
                queueConstruct.connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });

                queueConstruct.connection.on(VoiceConnectionStatus.Disconnected, () => {
                    queue.delete(interaction.guild.id);
                });

                await play(interaction.guild, queueConstruct.songs[0]);

                await interaction.reply({ content: `✅ | "${song}" şarkısı kuyruğa eklendi ve çalınıyor.`, ephemeral: true });
            } catch (error) {
                console.error('Ses kanalına bağlanırken hata oluştu:', error);
                queue.delete(interaction.guild.id);
                await interaction.reply({ content: "❌ | Şarkı çalınırken bir hata oluştu. Ses kanalına bağlanırken sorun yaşandı.", ephemeral: true });
                if (queueConstruct.connection) queueConstruct.connection.destroy();
            }
        } else {
            serverQueue.songs.push(song);
            await interaction.reply({ content: `✅ | "${song}" şarkısı kuyruğa eklendi.`, ephemeral: true });
        }
    }
};

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const serverQueue = queue.get(interaction.guild.id);

    if (interaction.customId === 'muzikkapat') {
        if (serverQueue) {
            serverQueue.songs = [];
            serverQueue.player.stop();
            serverQueue.connection.disconnect(); // Ses kanalından çık
            queue.delete(interaction.guild.id);
            await interaction.reply({ content: "✅ | Müzik kapatıldı ve kuyruk temizlendi.", ephemeral: true });
        } else {
            await interaction.reply({ content: "❌ | Müzik çalmıyor.", ephemeral: true });
        }
    } else if (interaction.customId === 'sıradaki') {
        if (serverQueue && serverQueue.songs.length > 1) {
            const skippedSong = serverQueue.songs.shift(); // Şarkıyı kaydet
            await play(interaction.guild, serverQueue.songs[0]); // Sıradaki şarkıyı çal

            // Atla mesajını gönder
            const skipEmbed = new EmbedBuilder()
                .setTitle("🎵 Şarkı Atlandı")
                .setDescription(`**Atlanan Şarkı:** ${skippedSong}\n**Yeni Şarkı:** ${serverQueue.songs[0]}`)
                .setColor("Purple")
                .setTimestamp();

            await interaction.reply({ embeds: [skipEmbed], ephemeral: true });
        } else {
            await interaction.reply({ content: "❌ | Sıradaki şarkı yok.", ephemeral: true });
        }
    } else if (interaction.customId === 'kuyruk') {
        if (serverQueue && serverQueue.songs.length > 0) {
            const songsList = serverQueue.songs.map((song, index) => `${index + 1}. ${song}`).join('\n');
            const queueEmbed = new EmbedBuilder()
                .setTitle("🎵 Müzik Kuyruğu")
                .setDescription(songsList)
                .setColor("Purple")
                .setTimestamp();
            await interaction.reply({ embeds: [queueEmbed], ephemeral: true });
        } else {
            await interaction.reply({ content: "❌ | Çalan veya sırada bekleyen şarkı yok.", ephemeral: true });
        }
    }
});
