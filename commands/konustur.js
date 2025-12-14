const { Client, EmbedBuilder } = require('discord.js');
const googleTTS = require('google-tts-api');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  name: "konuş",
  description: "Metni sesli kanalda söyler.",
  options: [
    {
      name: 'metin',
      description: 'Seslendirmek istediğiniz metin',
      type: 3, // String tipi
      required: true
    }
  ],

  run: async (client, interaction) => {
    const metin = interaction.options.getString('metin');
    const member = interaction.member;
    const voiceChannel = member.voice.channel; // Kullanıcının bulunduğu ses kanalı

    if (!voiceChannel) {
      return interaction.reply({ content: "Sesli bir kanalda olmanız gerekiyor!", ephemeral: true });
    }

    // Tam metin oluşturma (kullanıcı ismi kaldırıldı)
    const fullText = metin; 

    // Türkçe seslendirme URL'si oluşturma
    const url = googleTTS.getAudioUrl(fullText, {
      lang: 'tr', // Türkçe dil kodu
      slow: false, // Normal hızda seslendirme
      host: 'https://translate.google.com',
    });

    // Botun sesli kanala katılması
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    // Ses oynatıcıyı oluşturma ve ses kaynağını oluşturma
    const player = createAudioPlayer();
    const resource = createAudioResource(url);

    // Ses oynatıcıyı çalıştırma
    player.play(resource);
    connection.subscribe(player);

    // Oynatma tamamlandığında kontrol et ve gerekirse sesli kanaldan çık
    player.on('idle', () => {
      const channel = getVoiceConnection(interaction.guild.id);
      
      if (channel) {
        const subscribers = channel.state.subscription; // Abonelik bilgileri
        
        if (subscribers && subscribers.players && subscribers.players.size === 0) {
          connection.destroy(); // Sesli kanaldan çık
        }
      }
    });

    // Bilgilendirici mesaj gönderme
    await interaction.reply({ content: "Metin sesli kanalda söyleniyor!" });
  }
};
