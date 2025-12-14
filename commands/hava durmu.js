// hava-durumu.js
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const API_KEY = 'a3ae6c67d50b9da4935f9a0fa108a2ab'; // API anahtarınızı doğrudan ekledik

module.exports = {
  name: 'hava-durumu',
  description: 'Belirtilen şehirdeki hava durumunu gösterir.',
  options: [
    {
      name: 'şehir',
      description: 'Hava durumu alınacak şehir',
      type: 3, // STRING type
      required: true
    }
  ],

  run: async (client, interaction) => {
    const city = interaction.options.getString('şehir');
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=tr`;

    try {
      const response = await axios.get(url);
      const { weather, main, wind, visibility, name, timezone, sys } = response.data;

      // Rüzgar yönünü hesapla
      const windDirection = wind.deg >= 337.5 || wind.deg < 22.5 ? '🧭 Kuzey' :
                            wind.deg >= 22.5 && wind.deg < 67.5 ? '🧭 Kuzeydoğu' :
                            wind.deg >= 67.5 && wind.deg < 112.5 ? '🧭 Doğu' :
                            wind.deg >= 112.5 && wind.deg < 157.5 ? '🧭 Güneydoğu' :
                            wind.deg >= 157.5 && wind.deg < 202.5 ? '🧭 Güney' :
                            wind.deg >= 202.5 && wind.deg < 247.5 ? '🧭 Güneybatı' :
                            wind.deg >= 247.5 && wind.deg < 292.5 ? '🧭 Batı' :
                            wind.deg >= 292.5 && wind.deg < 337.5 ? '🧭 Kuzeybatı' : 'Bilinmiyor';

      // Yerel saat hesaplama
      const utcTime = new Date(); // Şu anki UTC zaman
      const localTime = new Date(utcTime.getTime() + (timezone * 1000)); // Yerel zaman

      // Formatted time
      const formattedTime = localTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

      // Gün doğumu ve gün batımı saatlerini al
      const sunrise = new Date((sys.sunrise + timezone) * 1000);
      const sunset = new Date((sys.sunset + timezone) * 1000);

      // Şu anki saat
      const currentTime = localTime;

      // Günün saatine göre emoji seçimi
      let zamanEmojisi = '🌤️'; // Varsayılan gün emojisi
      if (currentTime >= sunset || currentTime < sunrise) {
        zamanEmojisi = '🌙'; // Akşam/Gece emojisi
      } else {
        zamanEmojisi = '🌞'; // Gündüz emojisi
      }

      const embed = new EmbedBuilder()
        .setTitle(`${zamanEmojisi} ${name} için Hava Durumu ${zamanEmojisi}`)
        .setDescription(`
          **🌡️ Sıcaklık:** ${main.temp}°C
          **🥵 Hissedilen:** ${main.feels_like}°C
          **💧 Nem:** ${main.humidity}%
          **💨 Rüzgar:** ${wind.speed} km/s (${windDirection})
          **👁️ Görüş Mesafesi:** ${(visibility / 1000).toFixed(1)} km
          **🕒 Yerel Saat:** ${formattedTime}
        `)
        .setColor('#3498db')
        .setThumbnail(`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`) // Hava durumu ikonu
        .setImage(`https://source.unsplash.com/1024x768/?${city},weather`) // Şehir ile ilgili bir görsel
        .setFooter({ text: '🌍 Güncel Hava Durumu', iconURL: 'https://example.com/footer-icon.png' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error); // Hatanın detaylarını konsola yazdır
      await interaction.reply('❌ Şehir bulunamadı, lütfen geçerli bir şehir adı girin.');
    }
  }
};
