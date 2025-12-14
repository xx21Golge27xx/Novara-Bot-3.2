const dns = require('dns');
const net = require('net');
const { EmbedBuilder } = require('discord.js');

// fetch'i dinamik olarak import et
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

module.exports = {
  name: 'site-sorgu',
  description: 'Bir web sitesinin durumu ve IP bilgilerini kontrol eder.',
  type: 1,
  options: [
    {
      name: 'url',
      description: 'Sorgulamak istediğiniz sitenin URL adresi (örnek: https://example.com)',
      type: 3,
      required: true
    }
  ],
  async run(interaction) {
    const inputUrl = interaction.options.getString('url');

    let siteURL;
    try {
      siteURL = new URL(inputUrl.startsWith('http') ? inputUrl : 'http://' + inputUrl);
    } catch (error) {
      return interaction.reply({ content: '❌ Geçerli bir URL giriniz.', ephemeral: true });
    }

    const hostname = siteURL.hostname;
    const port = siteURL.port || (siteURL.protocol === 'https:' ? 443 : 80);

    // IP adresi çözümleme
    const ip = await new Promise((resolve) => {
      dns.lookup(hostname, (err, address) => {
        if (err) return resolve('Bulunamadı');
        resolve(address);
      });
    });

    // Port kontrolü
    const isOnline = await new Promise(resolve => {
      const socket = new net.Socket();
      socket.setTimeout(3000);
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      }).on('error', () => {
        resolve(false);
      }).on('timeout', () => {
        socket.destroy();
        resolve(false);
      }).connect(port, hostname);
    });

    // Site başlığı
    let siteTitle = 'Bilinmiyor';
    try {
      const response = await fetch(siteURL.href, { timeout: 5000 });
      const html = await response.text();
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      if (titleMatch) siteTitle = titleMatch[1];
    } catch (e) {
      siteTitle = 'Erişim sağlanamadı';
    }

    const embed = new EmbedBuilder()
      .setTitle('🔍 Site Sorgulama Sonucu')
      .addFields(
        { name: '🌐 URL', value: siteURL.href, inline: false },
        { name: '📌 IP Adresi', value: ip, inline: true },
        { name: '📶 Port', value: port.toString(), inline: true },
        { name: '🟢 Durum', value: isOnline ? 'Aktif (Erişilebilir)' : 'Kapalı (Erişilemez)', inline: false },
        { name: '📄 Site Başlığı', value: siteTitle, inline: false }
      )
      .setColor(isOnline ? 0x00ff00 : 0xff0000)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
 