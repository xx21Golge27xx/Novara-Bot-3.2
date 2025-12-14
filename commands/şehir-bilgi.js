const { AttachmentBuilder } = require('discord.js');
const { createCanvas } = require('canvas');

// TÜM 81 ŞEHİR DETAYLI BİLGİ
const cityData = {
  'adana': { 
    plaka: 1, 
    name: 'ADANA',
    region: 'AKDENİZ',
    population: '2.263.373',
    area: '14.030 km²',
    districts: ['SEYHAN', 'YÜREĞİR', 'ÇUKUROVA', 'SARICAM', 'CEYHAN', 'KOZAN', 'İMAMOĞLU', 'KARATAŞ', 'KARAİSALI', 'POZANTI', 'FEKE', 'TUFANBEYLİ', 'SAİMBEYLİ', 'ALADAĞ'],
    landmarks: ['TAŞKÖPRÜ', 'SABANCI MERKEZ CAMİİ', 'ADANA ARKEOLOJİ MÜZESİ', 'BÜYÜK SAAT'],
    interestingFact: 'Türkiye\'nin tarım başkenti ve en büyük 5. şehridir.'
  },
  'adiyaman': {
    plaka: 2,
    name: 'ADIYAMAN',
    region: 'GÜNEYDOĞU ANADOLU',
    population: '632.459',
    area: '7.337 km²',
    districts: ['MERKEZ', 'BESNİ', 'ÇELİKHAN', 'GERGER', 'GÖLBAŞI', 'KAHTA', 'SAMSAT', 'SİNCİK', 'TUT'],
    landmarks: ['NEMRUT DAĞI', 'ADIYAMAN MÜZESİ', 'CENDERE KÖPRÜSÜ', 'PERRE ANTİK KENTİ'],
    interestingFact: 'Nemrut Dağı, UNESCO Dünya Mirası Listesi\'ndedir.'
  },
  'afyonkarahisar': {
    plaka: 3,
    name: 'AFYONKARAHİSAR',
    region: 'EGE',
    population: '736.912',
    area: '14.230 km²',
    districts: ['MERKEZ', 'BAŞMAKÇI', 'BAYAT', 'BOLVADİN', 'ÇAY', 'ÇOBANLAR', 'DAZKIRI', 'DİNAR', 'EMİRDAĞ', 'EVCİLER', 'HOCALAR', 'İHSANİYE', 'İSCEHİSAR', 'KIZILÖREN', 'SANDIKLI', 'SİNANPAŞA', 'SULTANDAĞI', 'ŞUHUT'],
    landmarks: ['AFYON KALESİ', 'İSCEHİSAR PERİ BACALARI', 'AFYON ARKEOLOJİ MÜZESİ'],
    interestingFact: 'Türkiye\'nin termal turizm başkentidir.'
  },
  'agri': {
    plaka: 4,
    name: 'AĞRI',
    region: 'DOĞU ANADOLU',
    population: '536.199',
    area: '11.376 km²',
    districts: ['MERKEZ', 'DİYADİN', 'DOĞUBAYAZIT', 'ELEŞKİRT', 'HAMUR', 'PATNOS', 'TAŞLIÇAY', 'TUTAK'],
    landmarks: ['AĞRI DAĞI', 'İSHAK PAŞA SARAYI', 'DOĞUBAYAZIT KALESİ'],
    interestingFact: 'Türkiye\'nin en yüksek dağı Ağrı Dağı buradadır.'
  },
  'amasya': {
    plaka: 5,
    name: 'AMASYA',
    region: 'KARADENİZ',
    population: '335.494',
    area: '5.628 km²',
    districts: ['MERKEZ', 'GÖYNÜCEK', 'GÜMÜŞHACIKÖY', 'HAMAMÖZÜ', 'MERZİFON', 'SULUOVA', 'TAŞOVA'],
    landmarks: ['AMASYA KALESİ', 'KRAL KAYA MEZARLARI', 'AMASYA EVLERİ'],
    interestingFact: 'Şehzadeler şehri olarak bilinir.'
  },
  'ankara': {
    plaka: 6,
    name: 'ANKARA',
    region: 'İÇ ANADOLU',
    population: '5.663.322',
    area: '25.632 km²',
    districts: ['ALTINDAĞ', 'ÇANKAYA', 'ETİMESGUT', 'KEÇİÖREN', 'MAMAK', 'PURSAKLAR', 'SİNCAN', 'YENİMAHALLE', 'AKYURT', 'AYAŞ', 'BALA', 'BEYPAZARI', 'ÇAMLIDERE', 'ÇUBUK', 'ELMADAĞ', 'GÖLBAŞI', 'GÜDÜL', 'HAYMANA', 'KALECİK', 'KAZAN', 'KIZILCAHAMAM', 'NALLIHAN', 'POLATLI', 'ŞEREFLİKOÇHİSAR'],
    landmarks: ['ANITKABİR', 'ANKARA KALESİ', 'KOCATEPE CAMİİ'],
    interestingFact: 'Türkiye Cumhuriyeti\'nin başkentidir.'
  },
  'antalya': {
    plaka: 7,
    name: 'ANTALYA',
    region: 'AKDENİZ',
    population: '2.548.308',
    area: '20.723 km²',
    districts: ['AKSU', 'DÖŞEMEALTI', 'KEPEZ', 'KONYAALTI', 'MURATPAŞA', 'ALANYA', 'ELMALI', 'FİNİKE', 'GAZİPAŞA', 'GÜNDOĞMUŞ', 'İBRADI', 'KAŞ', 'KEMER', 'KORKUTELİ', 'KUMLUCA', 'MANAVGAT', 'SERİK'],
    landmarks: ['DÜDEN ŞELALESİ', 'HADRIAN KAPISI', 'ANTALYA MÜZESİ'],
    interestingFact: 'Türkiye\'nin turizm başkentidir.'
  },
  'ardahan': {
    plaka: 75,
    name: 'ARDAHAN',
    region: 'DOĞU ANADOLU',
    population: '97.319',
    area: '4.934 km²',
    districts: ['MERKEZ', 'ÇILDIR', 'DAMAL', 'GÖLE', 'HANAK', 'POSOF'],
    landmarks: ['ARDAHAN KALESİ', 'ÇILDIR GÖLÜ', 'POSOF KALESİ'],
    interestingFact: 'Türkiye\'nin en doğusundaki illerden biridir.'
  },
  'artvin': {
    plaka: 8,
    name: 'ARTVİN',
    region: 'KARADENİZ',
    population: '169.501',
    area: '7.436 km²',
    districts: ['MERKEZ', 'ARDANUÇ', 'ARHAVİ', 'BORÇKA', 'HOPA', 'KEMALPAŞA', 'MURGUL', 'ŞAVŞAT', 'YUSUFELİ'],
    landmarks: ['KAÇKAR DAĞLARI', 'ŞAVŞAT KARAGÖL', 'ARTVİN EVLERİ'],
    interestingFact: 'Türkiye\'nin en yeşil illerinden biridir.'
  },
  'aydin': {
    plaka: 9,
    name: 'AYDIN',
    region: 'EGE',
    population: '1.134.031',
    area: '8.116 km²',
    districts: ['EFELER', 'BOZDOĞAN', 'BUHARKENT', 'ÇİNE', 'DİDİM', 'GERMENCİK', 'İNCİRLİOVA', 'KARACASU', 'KARPUZLU', 'KOÇARLI', 'KÖŞK', 'KUŞADASI', 'KUYUCAK', 'NAZİLLİ', 'SÖKE', 'SULTANHİSAR', 'YENİPAZAR'],
    landmarks: ['EFES ANTİK KENTİ', 'DİDİM APOLLON TAPINAĞI', 'KUŞADASI'],
    interestingFact: 'Efes Antik Kenti burada bulunur.'
  },
  'balikesir': {
    plaka: 10,
    name: 'BALIKESİR',
    region: 'EGE',
    population: '1.250.610',
    area: '14.583 km²',
    districts: ['ALTIEYLÜL', 'KARESİ', 'AYVALIK', 'BALYA', 'BANDIRMA', 'BİGADİÇ', 'BURHANİYE', 'DURSUNBEY', 'EDREMİT', 'ERDEK', 'GÖMEÇ', 'GÖNEN', 'HAVRAN', 'İVRİNDİ', 'KEPSUT', 'MANYAS', 'MARMARA', 'SAVAŞTEPE', 'SINDIRGI', 'SUSURLUK'],
    landmarks: ['CUNDA ADASI', 'KAPIDAĞ YARIMADASI', 'KUŞ CENNETİ'],
    interestingFact: 'Hem Ege hem de Marmara Denizi\'ne kıyısı vardır.'
  },
  'bilecik': {
    plaka: 11,
    name: 'BİLECİK',
    region: 'MARMARA',
    population: '228.334',
    area: '4.307 km²',
    districts: ['MERKEZ', 'BOZÜYÜK', 'GÖLPAZARI', 'İNHİSAR', 'OSMANELİ', 'PAZARYERİ', 'SÖĞÜT', 'YENİPAZAR'],
    landmarks: ['SÖĞÜT TÜRBESİ', 'BİLECİK SAAT KULESİ', 'OSMANELİ KÖPRÜSÜ'],
    interestingFact: 'Osmanlı İmparatorluğu\'nun kurulduğu yerdir.'
  },
  'bingol': {
    plaka: 12,
    name: 'BİNGÖL',
    region: 'DOĞU ANADOLU',
    population: '281.768',
    area: '8.253 km²',
    districts: ['MERKEZ', 'ADAKLI', 'GENÇ', 'KARLIOVA', 'KİĞI', 'SOLHAN', 'YAYLADERE', 'YEDİSU'],
    landmarks: ['BİNGÖL DAĞLARI', 'YÜZEN ADA', 'KALETEKİ KALESİ'],
    interestingFact: 'Doğal güzellikleriyle ünlüdür.'
  },
  'bitlis': {
    plaka: 13,
    name: 'BİTLİS',
    region: 'DOĞU ANADOLU',
    population: '350.994',
    area: '8.294 km²',
    districts: ['MERKEZ', 'ADİLCEVAZ', 'AHLAT', 'GÜROYMAK', 'HİZAN', 'MUTKİ', 'TATVAN'],
    landmarks: ['AHLAT SELÇUKLU MEZARLIĞI', 'NEMRUT KRATER GÖLÜ', 'VAN GÖLÜ'],
    interestingFact: 'Tarihi yapılarıyla ünlüdür.'
  },
  'bolu': {
    plaka: 14,
    name: 'BOLU',
    region: 'KARADENİZ',
    population: '320.014',
    area: '8.313 km²',
    districts: ['MERKEZ', 'DÖRTDİVAN', 'GEREDE', 'GÖYNÜK', 'KIBRISCIK', 'MENGEN', 'MUDURNU', 'SEBEN', 'YENİÇAĞA'],
    landmarks: ['ABANT GÖLÜ', 'YEDİGÖLLER', 'KARTALKAYA KAYAK MERKEZİ'],
    interestingFact: 'Doğal güzellikleriyle ünlüdür.'
  },
  'burdur': {
    plaka: 15,
    name: 'BURDUR',
    region: 'AKDENİZ',
    population: '267.092',
    area: '7.175 km²',
    districts: ['MERKEZ', 'AĞLASUN', 'ALTINYAYLA', 'BUCAK', 'ÇAVDIR', 'ÇELTİKÇİ', 'GÖLHİSAR', 'KARAMANLI', 'KEMER', 'TEFENNİ', 'YEŞİLOVA'],
    landmarks: ['SALDA GÖLÜ', 'BURDUR GÖLÜ', 'SAGALASSOS ANTİK KENTİ'],
    interestingFact: 'Salda Gölü, Mars\'ın yüzeyine benzerliğiyle ünlüdür.'
  },
  'bursa': {
    plaka: 16,
    name: 'BURSA',
    region: 'MARMARA',
    population: '3.147.818',
    area: '10.813 km²',
    districts: ['OSMANGAZİ', 'YILDIRIM', 'NİLÜFER', 'GÜRSU', 'KESTEL', 'GEMLİK', 'İZNİK', 'MUDANYA', 'KARACABEY', 'ORHANELİ', 'ORHANGAZİ', 'BÜYÜKORHAN', 'HARMANCIK', 'YENİŞEHİR', 'İNEGÖL'],
    landmarks: ['ULU CAMİİ', 'BURSA KALESİ', 'ULUDAĞ KAYAK MERKEZİ'],
    interestingFact: 'Osmanlı İmparatorluğu\'nun ilk başkentidir.'
  },
  'canakkale': {
    plaka: 17,
    name: 'ÇANAKKALE',
    region: 'MARMARA',
    population: '557.276',
    area: '9.950 km²',
    districts: ['MERKEZ', 'AYVACIK', 'BAYRAMİÇ', 'BİGA', 'BOZCAADA', 'ÇAN', 'ECEABAT', 'EZİNE', 'GELİBOLU', 'GÖKÇEADA', 'LAPSEKİ', 'YENİCE'],
    landmarks: ['ÇANAKKALE ŞEHİTLERİ ANITI', 'TRUVA ATI', 'ASSAOS ANTİK KENTİ'],
    interestingFact: 'Çanakkale Savaşları\'nın yaşandığı yerdir.'
  },
  'cankiri': {
    plaka: 18,
    name: 'ÇANKIRI',
    region: 'İÇ ANADOLU',
    population: '192.428',
    area: '7.388 km²',
    districts: ['MERKEZ', 'ATKARACALAR', 'BAYRAMÖREN', 'ÇERKEŞ', 'ELDİVAN', 'ILGAZ', 'KIZILIRMAK', 'KORGUN', 'KURŞUNLU', 'ORTA', 'ŞABANÖZÜ', 'YAPRAKLI'],
    landmarks: ['ÇANKIRI KALESİ', 'ILGAZ DAĞI', 'TAŞ MESCİT'],
    interestingFact: 'Tarihi ve doğal güzellikleriyle ünlüdür.'
  },
  'corum': {
    plaka: 19,
    name: 'ÇORUM',
    region: 'KARADENİZ',
    population: '530.864',
    area: '12.820 km²',
    districts: ['MERKEZ', 'ALACA', 'BAYAT', 'BOĞAZKALE', 'DODURGA', 'İSKİLİP', 'KARGI', 'LAÇİN', 'MECİTÖZÜ', 'OĞUZLAR', 'ORTAKÖY', 'OSMANCIK', 'SUNGURLU', 'UĞURLUDAĞ'],
    landmarks: ['HATTUŞAŞ', 'ÇORUM SAAT KULESİ', 'ALACAHÖYÜK'],
    interestingFact: 'Hitit İmparatorluğu\'nun başkenti Hattuşaş buradadır.'
  },
  'denizli': {
    plaka: 20,
    name: 'DENİZLİ',
    region: 'EGE',
    population: '1.051.056',
    area: '12.134 km²',
    districts: ['MERKEZ', 'ACIPAYAM', 'BABADAĞ', 'BAKLAN', 'BEKİLLİ', 'BEYAĞAÇ', 'BOZKURT', 'BULDAN', 'ÇAL', 'ÇAMELİ', 'ÇARDAK', 'ÇİVRİL', 'GÜNEY', 'HONAZ', 'KALE', 'SARAYKÖY', 'SERİNHİSAR', 'TAVAS'],
    landmarks: ['PAMUKKALE', 'LAODİKEİA', 'KAKLIK MAĞARASI'],
    interestingFact: 'Pamukkale travertenleriyle ünlüdür.'
  },
  'diyarbakir': {
    plaka: 21,
    name: 'DİYARBAKIR',
    region: 'GÜNEYDOĞU ANADOLU',
    population: '1.783.431',
    area: '15.168 km²',
    districts: ['BAĞLAR', 'KAYAPINAR', 'SUR', 'YENİŞEHİR', 'BİSMİL', 'ÇERMİK', 'ÇINAR', 'ÇÜNGÜŞ', 'DİCLE', 'ERGANİ', 'HANİ', 'HAZRO', 'KOCAKÖY', 'KULP', 'LİCE', 'SİLVAN'],
    landmarks: ['DİYARBAKIR KALESİ', 'MALABADİ KÖPRÜSÜ', 'ULU CAMİİ'],
    interestingFact: 'Tarihi surlarıyla ünlüdür.'
  },
  'edirne': {
    plaka: 22,
    name: 'EDİRNE',
    region: 'MARMARA',
    population: '412.115',
    area: '6.145 km²',
    districts: ['MERKEZ', 'ENEZ', 'HAVSA', 'İPSALA', 'KEŞAN', 'LALAPAŞA', 'MERİÇ', 'SÜLOĞLU', 'UZUNKÖPRÜ'],
    landmarks: ['SELİMİYE CAMİİ', 'EDİRNE SARAYI', 'MERİÇ KÖPRÜSÜ'],
    interestingFact: 'Osmanlı İmparatorluğu\'nun ikinci başkentidir.'
  },
  'elazig': {
    plaka: 23,
    name: 'ELAZIĞ',
    region: 'DOĞU ANADOLU',
    population: '595.638',
    area: '9.383 km²',
    districts: ['MERKEZ', 'AĞIN', 'ALACAKAYA', 'ARICAK', 'BASKİL', 'KARAKOÇAN', 'KEBAN', 'KOVANCILAR', 'MADEN', 'PALU', 'SİVRİCE'],
    landmarks: ['HAZAR GÖLÜ', 'HARPUT KALESİ', 'ELAZIĞ MÜZESİ'],
    interestingFact: 'Keban Barajı buradadır.'
  },
  'erzincan': {
    plaka: 24,
    name: 'ERZİNCAN',
    region: 'DOĞU ANADOLU',
    population: '234.747',
    area: '11.815 km²',
    districts: ['MERKEZ', 'ÇAYIRLI', 'İLİÇ', 'KEMAH', 'KEMALİYE', 'OTLUKBELİ', 'REFAHİYE', 'TERCAN', 'ÜZÜMLÜ'],
    landmarks: ['ERZİNCAN KALESİ', 'GİRLEVİK ŞELALESİ', 'KEMALİYE EVLERİ'],
    interestingFact: 'Doğal güzellikleriyle ünlüdür.'
  },
  'erzurum': {
    plaka: 25,
    name: 'ERZURUM',
    region: 'DOĞU ANADOLU',
    population: '767.848',
    area: '25.330 km²',
    districts: ['PALANDÖKEN', 'YAKUTİYE', 'AZİZİYE', 'AŞKALE', 'ÇAT', 'HINIS', 'HORASAN', 'İSPİR', 'KARAÇOBAN', 'KARAYAZI', 'KÖPRÜKÖY', 'NARMAN', 'OLTU', 'OLUR', 'PASİNLER', 'PAZARYOLU', 'ŞENKAYA', 'TEKMAN', 'TORTUM', 'UZUNDERE'],
    landmarks: ['ÇİFTE MİNARELİ MEDRESE', 'PALANDÖKEN KAYAK MERKEZİ', 'TORTUM ŞELALESİ'],
    interestingFact: 'Türkiye\'nin en soğuk illerinden biridir.'
  },
  'eskisehir': {
    plaka: 26,
    name: 'ESKİŞEHİR',
    region: 'İÇ ANADOLU',
    population: '898.369',
    area: '13.960 km²',
    districts: ['ODUNPAZARI', 'TEPEBAŞI', 'ALPU', 'BEYLİKOVA', 'ÇİFTELER', 'GÜNYÜZÜ', 'HAN', 'İNÖNÜ', 'MAHMUDİYE', 'MİHALGAZİ', 'MİHALIÇÇIK', 'SARICAKAYA', 'SEYİTGAZİ', 'SİVRİHİSAR'],
    landmarks: ['ODUNPAZARI EVLERİ', 'ESKİŞEHİR BİLİM SANAT MERKEZİ', 'SİVRİHİSAR'],
    interestingFact: 'Öğrenci şehri olarak bilinir.'
  },
  'gaziantep': {
    plaka: 27,
    name: 'GAZİANTEP',
    region: 'GÜNEYDOĞU ANADOLU',
    population: '2.130.432',
    area: '6.819 km²',
    districts: ['ŞAHİNBEY', 'ŞEHİTKAMİL', 'ARABAN', 'İSLAHİYE', 'KARKAMIŞ', 'NİZİP', 'NURDAĞI', 'OĞUZELİ', 'YAVUZELİ'],
    landmarks: ['GAZİANTEP KALESİ', 'ZEUGMA MOZAİK MÜZESİ', 'BAKIRCILAR ÇARŞISI'],
    interestingFact: 'Baklava ve fıstığıyla ünlüdür.'
  },
  'giresun': {
    plaka: 28,
    name: 'GİRESUN',
    region: 'KARADENİZ',
    population: '453.912',
    area: '6.934 km²',
    districts: ['MERKEZ', 'ALUCRA', 'BULANCAK', 'ÇAMOLUK', 'ÇANAKÇI', 'DERELİ', 'DOĞANKENT', 'ESPİYE', 'EYNESİL', 'GÖRELE', 'GÜCE', 'KEŞAP', 'PİRAZİZ', 'ŞEBİNKARAHİSAR', 'TİREBOLU', 'YAĞLIDERE'],
    landmarks: ['GİRESUN ADASI', 'KULAKKAYA YAYLASI', 'GİRESUN KALESİ'],
    interestingFact: 'Fındık üretiminde Türkiye\'de önde gelen illerdendir.'
  },
  'gumushane': {
    plaka: 29,
    name: 'GÜMÜŞHANE',
    region: 'KARADENİZ',
    population: '162.748',
    area: '6.668 km²',
    districts: ['MERKEZ', 'KELKİT', 'KÖSE', 'KÜRTÜN', 'ŞİRAN', 'TORUL'],
    landmarks: ['KARACA MAĞARASI', 'TOMARA ŞELALESİ', 'GÜMÜŞHANE EVLERİ'],
    interestingFact: 'Tarihi İpek Yolu üzerinde yer alır.'
  },
  'hakkari': {
    plaka: 30,
    name: 'HAKKARİ',
    region: 'DOĞU ANADOLU',
    population: '280.514',
    area: '7.095 km²',
    districts: ['MERKEZ', 'ÇUKURCA', 'ŞEMDİNLİ', 'YÜKSEKOVA'],
    landmarks: ['CİLO BUZUL DAĞLARI', 'HAKKARİ KAYALARINDAKİ KABARTMALAR', 'ZAP VADİSİ'],
    interestingFact: 'Türkiye\'nin en doğusundaki illerden biridir.'
  },
  'hatay': {
    plaka: 31,
    name: 'HATAY',
    region: 'AKDENİZ',
    population: '1.670.712',
    area: '5.524 km²',
    districts: ['ANTAKYA', 'DEFNE', 'ALTINÖZÜ', 'ARSUZ', 'BELEN', 'DÖRTYOL', 'ERZİN', 'HASSA', 'İSKENDERUN', 'KIRIKHAN', 'KUMLU', 'PAYAS', 'REYHANLI', 'SAMANDAĞ', 'YAYLADAĞI'],
    landmarks: ['HABİB-İ NECCAR CAMİİ', 'ST. PİERRE KİLİSESİ', 'TİTUS TÜNELİ'],
    interestingFact: 'Dünyanın en eski yerleşim yerlerinden biridir.'
  },
  'isparta': {
    plaka: 32,
    name: 'ISPARTA',
    region: 'AKDENİZ',
    population: '445.678',
    area: '8.946 km²',
    districts: ['MERKEZ', 'AKSU', 'ATABEY', 'EĞİRDİR', 'GELENDOST', 'GÖNEN', 'KEÇİBORLU', 'ŞARKİKARAAĞAÇ', 'SENİRKENT', 'SÜTÇÜLER', 'ULUBORLU', 'YALVAÇ', 'YENİŞARBADEMLİ'],
    landmarks: ['EĞİRDİR GÖLÜ', 'KOVADA GÖLÜ', 'ISPARTA GÜL BAHÇELERİ'],
    interestingFact: 'Gül üretiminde Türkiye\'de birinci sıradadır.'
  },
  'mersin': {
    plaka: 33,
    name: 'MERSİN',
    region: 'AKDENİZ',
    population: '1.891.145',
    area: '15.853 km²',
    districts: ['AKDENİZ', 'MEZİTLİ', 'TOROSLAR', 'YENİŞEHİR', 'ANAMUR', 'AYDINCIK', 'BOZYAZI', 'ÇAMLIYAYLA', 'ERDEMLİ', 'GÜLNAR', 'MUT', 'SİLİFKE', 'TARSUS'],
    landmarks: ['KIZ KALESİ', 'CENNET-CEHENNEM MAĞARALARI', 'TARSUS ULU CAMİİ'],
    interestingFact: 'Türkiye\'nin en büyük limanlarından birine sahiptir.'
  },
  'istanbul': {
    plaka: 34,
    name: 'İSTANBUL',
    region: 'MARMARA',
    population: '15.840.900',
    area: '5.343 km²',
    districts: ['ADALAR', 'ARNAVUTKÖY', 'ATAŞEHİR', 'AVCILAR', 'BAĞCILAR', 'BAHÇELİEVLER', 'BAKIRKÖY', 'BAŞAKŞEHİR', 'BAYRAMPAŞA', 'BEŞİKTAŞ', 'BEYKOZ', 'BEYLİKDÜZÜ', 'BEYOĞLU', 'BÜYÜKÇEKMECE', 'ÇATALCA', 'ÇEKMEKÖY', 'ESENLER', 'ESENYURT', 'EYÜPSULTAN', 'FATİH', 'GAZİOSMANPAŞA', 'GÜNGÖREN', 'KADIKÖY', 'KAĞITHANE', 'KARTAL', 'KÜÇÜKÇEKMECE', 'MALTEPE', 'PENDİK', 'SANCAKTEPE', 'SARIYER', 'SİLİVRİ', 'SULTANBEYLİ', 'SULTANGAZİ', 'ŞİLE', 'ŞİŞLİ', 'TUZLA', 'ÜMRANİYE', 'ÜSKÜDAR', 'ZEYTİNBURNU'],
    landmarks: ['AYASOFYA', 'TOPKAPI SARAYI', 'KIZ KULESİ'],
    interestingFact: 'Dünyada iki kıta üzerinde kurulu tek şehirdir.'
  },
  'izmir': {
    plaka: 35,
    name: 'İZMİR',
    region: 'EGE',
    population: '4.425.789',
    area: '12.007 km²',
    districts: ['ALİAĞA', 'BALÇOVA', 'BAYINDIR', 'BAYRAKLI', 'BERGAMA', 'BEYDAĞ', 'BORNOVA', 'BUCA', 'ÇEŞME', 'ÇİĞLİ', 'DİKİLİ', 'FOÇA', 'GAZİEMİR', 'GÜZELBAHÇE', 'KARABAĞLAR', 'KARŞIYAKA', 'KEMALPAŞA', 'KINIK', 'KİRAZ', 'KONAK', 'MENDERES', 'MENEMEN', 'NARLIDERE', 'ÖDEMİŞ', 'SEFERİHİSAR', 'SELÇUK', 'TİRE', 'TORBALI', 'URLA'],
    landmarks: ['SAAT KULESİ', 'EFES ANTİK KENTİ', 'KORDON BOYU'],
    interestingFact: 'Türkiye\'nin en büyük üçüncü şehridir.'
  },
  'kars': {
    plaka: 36,
    name: 'KARS',
    region: 'DOĞU ANADOLU',
    population: '284.923',
    area: '10.193 km²',
    districts: ['MERKEZ', 'AKYAKA', 'ARPAÇAY', 'DİGOR', 'KAĞIZMAN', 'SARIKAMIŞ', 'SELİM', 'SUSUZ'],
    landmarks: ['ANİ HARABELERİ', 'KARS KALESİ', 'ÇILDIR GÖLÜ'],
    interestingFact: 'Tarihi İpek Yolu üzerinde yer alır.'
  },
  'kastamonu': {
    plaka: 37,
    name: 'KASTAMONU',
    region: 'KARADENİZ',
    population: '376.945',
    area: '13.064 km²',
    districts: ['MERKEZ', 'ABANA', 'AĞLI', 'ARAÇ', 'AZDAVAY', 'BOZKURT', 'CİDE', 'ÇATALZEYTİN', 'DADAY', 'DEVREKANİ', 'DOĞANYURT', 'HANÖNÜ', 'İHSANGAZİ', 'İNEBOLU', 'KÜRE', 'PINARBAŞI', 'SEYDİLER', 'ŞENPAZAR', 'TAŞKÖPRÜ', 'TOSYA'],
    landmarks: ['KASTAMONU KALESİ', 'ILGAZ DAĞI', 'KÜRE DAĞLARI MİLLİ PARKI'],
    interestingFact: 'Tarihi konaklarıyla ünlüdür.'
  },
  'kayseri': {
    plaka: 38,
    name: 'KAYSERİ',
    region: 'İÇ ANADOLU',
    population: '1.434.357',
    area: '16.970 km²',
    districts: ['KOCASİNAN', 'MELİKGAZİ', 'TALAS', 'AKKIŞLA', 'BÜNYAN', 'DEVELİ', 'FELAHİYE', 'HACILAR', 'İNCESU', 'ÖZVATAN', 'PINARBAŞI', 'SARIOĞLAN', 'SARIZ', 'YAHYALI', 'YEŞİLHİSAR'],
    landmarks: ['ERCIYES DAĞI', 'KAYSERİ KALESİ', 'SULTAN SAZLIĞI'],
    interestingFact: 'Pastırması ve mantısıyla ünlüdür.'
  },
  'kirklareli': {
    plaka: 39,
    name: 'KIRKLARELİ',
    region: 'MARMARA',
    population: '366.363',
    area: '6.459 km²',
    districts: ['MERKEZ', 'BABAESKİ', 'DEMİRKÖY', 'KOFÇAZ', 'LÜLEBURGAZ', 'PEHLİVANKÖY', 'PINARHİSAR', 'VİZE'],
    landmarks: ['DUPNİSA MAĞARASI', 'KIRKLARELİ MÜZESİ', 'LONGOZ ORMANLARI'],
    interestingFact: 'Trakya bölgesinin en büyük ilidir.'
  },
  'kirsehir': {
    plaka: 40,
    name: 'KIRŞEHİR',
    region: 'İÇ ANADOLU',
    population: '242.938',
    area: '6.584 km²',
    districts: ['MERKEZ', 'AKÇAKENT', 'AKPINAR', 'BOZTEPE', 'ÇİÇEKDAĞI', 'KAMAN', 'MUCUR'],
    landmarks: ['CACABEY MEDRESESİ', 'AŞIK PAŞA TÜRBESİ', 'KIRŞEHİR MÜZESİ'],
    interestingFact: 'Ahilik teşkilatının merkezidir.'
  },
  'kocaeli': {
    plaka: 41,
    name: 'KOCAELİ',
    region: 'MARMARA',
    population: '2.079.072',
    area: '3.626 km²',
    districts: ['BAŞİSKELE', 'ÇAYIROVA', 'DARICA', 'DERİNCE', 'DİLOVASI', 'GEBZE', 'GÖLCÜK', 'İZMİT', 'KANDIRA', 'KARAMÜRSEL', 'KARTEPE', 'KÖRFEZ'],
    landmarks: ['KOCAELİ BİLİM MERKEZİ', 'MAŞUKİYE', 'BALLIKAYALAR'],
    interestingFact: 'Sanayi şehri olarak bilinir.'
  },
  'konya': {
    plaka: 42,
    name: 'KONYA',
    region: 'İÇ ANADOLU',
    population: '2.277.017',
    area: '40.838 km²',
    districts: ['MERAM', 'SELÇUKLU', 'KARATAY', 'AKÖREN', 'AKŞEHİR', 'ALTINEKİN', 'BEYŞEHİR', 'BOZKIR', 'CİHANBEYLİ', 'ÇELTİK', 'ÇUMRA', 'DERBENT', 'DEREBUCAK', 'DOĞANHİSAR', 'EMİRGAZİ', 'EREĞLİ', 'GÜNEYSINIR', 'HADİM', 'HALKAPINAR', 'HÜYÜK', 'ILGIN', 'KADINHANI', 'KARAPINAR', 'KARATAY', 'KULU', 'SARAYÖNÜ', 'SEYDİŞEHİR', 'TAŞKENT', 'TUZLUKÇU', 'YALIHÜYÜK', 'YUNAK'],
    landmarks: ['MEVLANA MÜZESİ', 'ÇATALHÖYÜK', 'ALAADDİN TEPESİ'],
    interestingFact: 'Türkiye\'nin yüzölçümü olarak en büyük ilidir.'
  },
  'kutahya': {
    plaka: 43,
    name: 'KÜTAHYA',
    region: 'EGE',
    population: '579.257',
    area: '11.977 km²',
    districts: ['MERKEZ', 'ALTINTAŞ', 'ASLANAPA', 'ÇAVDARHİSAR', 'DOMANİÇ', 'DUMLUPINAR', 'EMET', 'GEDİZ', 'HİSARCIK', 'PAZARLAR', 'SİMAV', 'ŞAPHANE', 'TAVŞANLI'],
    landmarks: ['KÜTAHYA KALESİ', 'AİZANOİ ANTİK KENTİ', 'FRİG VADİSİ'],
    interestingFact: 'Çinisiyle ünlüdür.'
  },
  'malatya': {
    plaka: 44,
    name: 'MALATYA',
    region: 'DOĞU ANADOLU',
    population: '806.156',
    area: '12.259 km²',
    districts: ['BATTALGAZİ', 'YEŞİLYURT', 'AKÇADAĞ', 'ARAPGİR', 'ARGUVAN', 'DARENDE', 'DOĞANŞEHİR', 'DOĞANYOL', 'HEKİMHAN', 'KALE', 'KULUNCAK', 'PÜTÜRGE', 'YAZIHAN'],
    landmarks: ['BATTALGAZİ ULU CAMİİ', 'NEMRUT DAĞI', 'MALATYA KAYSISI BAHÇELERİ'],
    interestingFact: 'Kayısısıyla ünlüdür.'
  },
  'manisa': {
    plaka: 45,
    name: 'MANİSA',
    region: 'EGE',
    population: '1.456.626',
    area: '13.339 km²',
    districts: ['YUNUSEMRE', 'ŞEHZADELER', 'AHMETLİ', 'AKHİSAR', 'ALAŞEHİR', 'DEMİRCİ', 'GÖLMARMARA', 'GÖRDES', 'KIRKAĞAÇ', 'KÖPRÜBAŞI', 'KULA', 'SALİHLİ', 'SARIGÖL', 'SARUHANLI', 'SELENDİ', 'SOMA', 'TURGUTLU'],
    landmarks: ['MANİSA MESİR MACUNU FESTİVALİ', 'SARDES ANTİK KENTİ', 'SPİL DAĞI'],
    interestingFact: 'Mesir macunu festivaliyle ünlüdür.'
  },
  'kahramanmaras': {
    plaka: 46,
    name: 'KAHRAMANMARAŞ',
    region: 'AKDENİZ',
    population: '1.171.298',
    area: '14.346 km²',
    districts: ['DULKADİROĞLU', 'ONİKİŞUBAT', 'AFŞİN', 'ANDIRIN', 'ÇAĞLAYANCERİT', 'EKİNÖZÜ', 'ELBİSTAN', 'GÖKSUN', 'NURHAK', 'PAZARCIK', 'TÜRKOĞLU'],
    landmarks: ['KAHRAMANMARAŞ KALESİ', 'DÖNGELE MEYDANI', 'YEDİGÜZELER ŞELALESİ'],
    interestingFact: 'Dondurmasıyla ünlüdür.'
  },
  'mardin': {
    plaka: 47,
    name: 'MARDİN',
    region: 'GÜNEYDOĞU ANADOLU',
    population: '862.757',
    area: '8.780 km²',
    districts: ['ARTUKLU', 'DARGEÇİT', 'DERİK', 'KIZILTEPE', 'MAZIDAĞI', 'MİDYAT', 'NUSAYBİN', 'ÖMERLİ', 'SAVUR', 'YEŞİLLİ'],
    landmarks: ['MARDİN EVLERİ', 'DARA ANTİK KENTİ', 'ZİNCİRİYE MEDRESESİ'],
    interestingFact: 'Tarihi taş evleriyle ünlüdür.'
  },
  'mugla': {
    plaka: 48,
    name: 'MUĞLA',
    region: 'EGE',
    population: '1.021.141',
    area: '12.654 km²',
    districts: ['BODRUM', 'DALAMAN', 'DATÇA', 'FETHİYE', 'KAVAKLIDERE', 'KÖYCEĞİZ', 'MARMARİS', 'MENTEŞE', 'MİLAS', 'ORTACA', 'SEYDİKEMER', 'ULA', 'YATAĞAN'],
    landmarks: ['BODRUM KALESİ', 'ÖLÜDENİZ', 'PAMUKKALE'],
    interestingFact: 'Turizm açısından Türkiye\'nin önde gelen illerindendir.'
  },
  'mus': {
    plaka: 49,
    name: 'MUŞ',
    region: 'DOĞU ANADOLU',
    population: '406.501',
    area: '8.650 km²',
    districts: ['MERKEZ', 'BULANIK', 'HASKÖY', 'KORKUT', 'MALAZGİRT', 'VARTO'],
    landmarks: ['MURADİYE ŞELALESİ', 'MALAZGİRT KALESİ', 'HAÇLI KÖPRÜSÜ'],
    interestingFact: 'Malazgirt Savaşı\'nın yapıldığı yerdir.'
  },
  'nevsehir': {
    plaka: 50,
    name: 'NEVŞEHİR',
    region: 'İÇ ANADOLU',
    population: '303.010',
    area: '5.485 km²',
    districts: ['MERKEZ', 'ACIGÖL', 'AVANOS', 'DERİNKUYU', 'GÜLŞEHİR', 'HACIBEKTAŞ', 'KOZAKLI', 'ÜRGÜP'],
    landmarks: ['PERİ BACALARI', 'GÖREME AÇIK HAVA MÜZESİ', 'UÇHİSAR KALESİ'],
    interestingFact: 'Kapadokya bölgesinin merkezidir.'
  },
  'nigde': {
    plaka: 51,
    name: 'NİĞDE',
    region: 'İÇ ANADOLU',
    population: '362.861',
    area: '7.234 km²',
    districts: ['MERKEZ', 'ALTUNHİSAR', 'BOR', 'ÇAMARDI', 'ÇİFTLİK', 'ULUKIŞLA'],
    landmarks: ['ALADAĞLAR', 'GÜMÜŞLER MANASTIRI', 'TYANA ANTİK KENTİ'],
    interestingFact: 'Aladağlar Milli Parkı buradadır.'
  },
  'ordu': {
    plaka: 52,
    name: 'ORDU',
    region: 'KARADENİZ',
    population: '760.872',
    area: '5.861 km²',
    districts: ['ALTINORDU', 'AKKUŞ', 'AYBASTI', 'ÇAMAŞ', 'ÇATALPINAR', 'ÇAYBAŞI', 'FATSA', 'GÖLKÖY', 'GÜLYALI', 'GÜRGENTEPE', 'İKİZCE', 'KABADÜZ', 'KABATAŞ', 'KORGAN', 'KUMRU', 'MESUDİYE', 'PERŞEMBE', 'ULUBEY', 'ÜNYE'],
    landmarks: ['BOZTEPE', 'YASON BURNU', 'ULUGÖL'],
    interestingFact: 'Fındık üretiminde Türkiye\'de önde gelen illerdendir.'
  },
  'rize': {
    plaka: 53,
    name: 'RİZE',
    region: 'KARADENİZ',
    population: '345.662',
    area: '3.835 km²',
    districts: ['MERKEZ', 'ARDEŞEN', 'ÇAMLIHEMŞİN', 'ÇAYELİ', 'DEREPAZARI', 'FINDIKLI', 'GÜNEYSU', 'HEMŞİN', 'İKİZDERE', 'İYİDERE', 'KALKANDERE', 'PAZAR'],
    landmarks: ['AYDER YAYLASI', 'ZİRKALE', 'RİZE KALESİ'],
    interestingFact: 'Çay üretiminde Türkiye\'de birinci sıradadır.'
  },
  'sakarya': {
    plaka: 54,
    name: 'SAKARYA',
    region: 'MARMARA',
    population: '1.060.876',
    area: '4.824 km²',
    districts: ['ADAPAZARI', 'AKYAZI', 'ARİFİYE', 'ERENLER', 'FERİZLİ', 'GEYVE', 'HENDEK', 'KARAPÜRÇEK', 'KARASU', 'KAYNARCA', 'KOCAALİ', 'PAMUKOVA', 'SAPANCA', 'SERDİVAN', 'SÖĞÜTLÜ', 'TARAKLI'],
    landmarks: ['SAPANCA GÖLÜ', 'Sakarya Şehitler Anıtı', 'Justinianus Köprüsü'],
    interestingFact: 'Marmara Bölgesi\'nin önemli sanayi şehirlerindendir.'
  },
  'samsun': {
    plaka: 55,
    name: 'SAMSUN',
    region: 'KARADENİZ',
    population: '1.356.079',
    area: '9.725 km²',
    districts: ['ATAKUM', 'CANİK', 'İLKADIM', 'TEKKEKÖY', 'ALAÇAM', 'ASARCIK', 'AYVACIK', 'BAFRA', 'ÇARŞAMBA', 'HAVZA', 'KAVAK', 'LADİK', 'SALIPAZARI', 'TERME', 'VEZİRKÖPRÜ', 'YAKAKENT'],
    landmarks: ['BANDIRMA VAPURU', 'AMİSOS TEPESİ', 'KABOTAJ ANITI'],
    interestingFact: 'Atatürk\'ün 19 Mayıs 1919\'da Kurtuluş Savaşı\'nı başlattığı şehirdir.'
  },
  'siirt': {
    plaka: 56,
    name: 'SİİRT',
    region: 'GÜNEYDOĞU ANADOLU',
    population: '331.980',
    area: '5.717 km²',
    districts: ['MERKEZ', 'BAYKAN', 'ERUH', 'KURTALAN', 'PERVARİ', 'ŞİRVAN', 'TİLLO'],
    landmarks: ['Ulu Camii', 'Derzin Kalesi', 'İncekaya Kanyonu'],
    interestingFact: 'Bıttım sabunu ve perde pilavıyla ünlüdür.'
  },
  'sinop': {
    plaka: 57,
    name: 'SİNOP',
    region: 'KARADENİZ',
    population: '220.799',
    area: '5.717 km²',
    districts: ['MERKEZ', 'AYANCIK', 'BOYABAT', 'DİKMEN', 'DURAĞAN', 'ERFELEK', 'GERZE', 'SARAYDÜZÜ', 'TÜRKELİ'],
    landmarks: ['SİNOP KALESİ', 'ERFELEK ŞELALELERİ', 'HAMSİLİSİ'],
    interestingFact: 'Türkiye\'nin en kuzey noktasıdır.'
  },
  'sivas': {
    plaka: 58,
    name: 'SİVAS',
    region: 'İÇ ANADOLU',
    population: '635.889',
    area: '28.567 km²',
    districts: ['MERKEZ', 'AKINCILAR', 'ALTINYAYLA', 'DİVRİĞİ', 'DOĞANŞAR', 'GEMEREK', 'GÖLOVA', 'GÜRÜN', 'HAFİK', 'İMRANLI', 'KANGAL', 'KOYULHİSAR', 'SUŞEHRİ', 'ŞARKIŞLA', 'ULAŞ', 'YILDIZELİ', 'ZARA'],
    landmarks: ['SİVAS KONGRESİ BİNASI', 'DİVRİĞİ ULU CAMİİ', 'KANGAL BALIKLI KAPLICA'],
    interestingFact: 'Kongreler şehri olarak bilinir.'
  },
  'tekirdag': {
    plaka: 59,
    name: 'TEKİRDAĞ',
    region: 'MARMARA',
    population: '1.113.400',
    area: '6.190 km²',
    districts: ['ÇERKEZKÖY', 'ÇORLU', 'ERGENE', 'HAYRABOLU', 'KAPAKLI', 'MALKARA', 'MARMARAEREĞLİSİ', 'MURATLI', 'SARAY', 'SÜLEYMANPAŞA', 'ŞARKÖY'],
    landmarks: ['Rakoczi Müzesi', 'Tekirdağ Arkeoloji Müzesi', 'Hora Feneri'],
    interestingFact: 'Tekirdağ köftesiyle ünlüdür.'
  },
  'tokat': {
    plaka: 60,
    name: 'TOKAT',
    region: 'KARADENİZ',
    population: '597.861',
    area: '10.042 km²',
    districts: ['MERKEZ', 'ALMUS', 'ARTOVA', 'BAŞÇİFTLİK', 'ERBAA', 'NİKSAR', 'PAZAR', 'REŞADİYE', 'SULUSARAY', 'TURHAL', 'YEŞİLYURT', 'ZİLE'],
    landmarks: ['TOKAT KALESİ', 'BALLICA MAĞARASI', 'TAŞHAN'],
    interestingFact: 'Tokat kebabı ve yaprağıyla ünlüdür.'
  },
  'trabzon': {
    plaka: 61,
    name: 'TRABZON',
    region: 'KARADENİZ',
    population: '811.901',
    area: '4.664 km²',
    districts: ['AKÇAABAT', 'ARAKLI', 'ARSİN', 'BEŞİKDÜZÜ', 'ÇARŞIBAŞI', 'ÇAYKARA', 'DERNEKPAZARI', 'DÜZKÖY', 'HAYRAT', 'KÖPRÜBAŞI', 'MAÇKA', 'OF', 'ORTAHİSAR', 'SÜRMENE', 'ŞALPAZARI', 'TONYA', 'VAKFIKEBİR', 'YOMRA'],
    landmarks: ['SÜMELA MANASTIRI', 'UZUNGÖL', 'ATATÜRK KÖŞKÜ'],
    interestingFact: 'Hamsi ve laz böreğiyle ünlüdür.'
  },
  'tunceli': {
    plaka: 62,
    name: 'TUNCELİ',
    region: 'DOĞU ANADOLU',
    population: '83.645',
    area: '7.582 km²',
    districts: ['MERKEZ', 'ÇEMİŞGEZEK', 'HOZAT', 'MAZGİRT', 'NAZIMİYE', 'OVACIK', 'PERTEK', 'PÜLÜMÜR'],
    landmarks: ['MUNZUR VADİSİ', 'MUNZUR GÖLLERİ', 'TUNCELİ KALESİ'],
    interestingFact: 'Doğal güzellikleriyle ünlüdür.'
  },
  'sanliurfa': {
    plaka: 63,
    name: 'ŞANLIURFA',
    region: 'GÜNEYDOĞU ANADOLU',
    population: '2.115.256',
    area: '18.584 km²',
    districts: ['HALİLİYE', 'EYYÜBİYE', 'KARAKÖPRÜ', 'AKÇAKALE', 'BİRECİK', 'BOZOVA', 'CEYLANPINAR', 'HALFETİ', 'HARRAN', 'HİLVAN', 'SİVEREK', 'SURUÇ', 'VİRANŞEHİR'],
    landmarks: ['BALIKLIGÖL', 'GÖBEKLİTEPE', 'HARRAN EVLERİ'],
    interestingFact: 'Peygamberler şehri olarak bilinir.'
  },
  'usak': {
    plaka: 64,
    name: 'UŞAK',
    region: 'EGE',
    population: '369.433',
    area: '5.341 km²',
    districts: ['MERKEZ', 'BANAZ', 'EŞME', 'KARAHALLI', 'SİVASLI', 'ULUBEY'],
    landmarks: ['ULUBEY KANYONU', 'UŞAK ARKEOLOJİ MÜZESİ', 'CIMCIM ÇEŞMESİ'],
    interestingFact: 'Türkiye\'nin ilk şeker fabrikası burada kurulmuştur.'
  },
  'van': {
    plaka: 65,
    name: 'VAN',
    region: 'DOĞU ANADOLU',
    population: '1.141.015',
    area: '19.069 km²',
    districts: ['İPEKYOLU', 'TUŞBA', 'EDREMİT', 'BAŞKALE', 'BAHÇESARAY', 'ÇALDIRAN', 'ÇATAK', 'ERCİŞ', 'GEVAŞ', 'GÜRPINAR', 'MURADİYE', 'ÖZALP', 'SARAY'],
    landmarks: ['VAN GÖLÜ', 'VAN KALESİ', 'AKDAMAR KİLİSESİ'],
    interestingFact: 'Van kedisi ve kahvaltısıyla ünlüdür.'
  },
  'yozgat': {
    plaka: 66,
    name: 'YOZGAT',
    region: 'İÇ ANADOLU',
    population: '419.440',
    area: '14.123 km²',
    districts: ['MERKEZ', 'AKDAĞMADENİ', 'AYDINCIK', 'BOĞAZLIYAN', 'ÇANDIR', 'ÇAYIRALAN', 'ÇEKEREK', 'KADIŞEHRİ', 'SARAYKENT', 'SARIKAYA', 'SORGUN', 'ŞEFAATLİ', 'YENİFAKILI', 'YERKÖY'],
    landmarks: ['Yozgat Saat Kulesi', 'Çamlık Milli Parkı', 'Kerkenez Harabeleri'],
    interestingFact: 'Türkiye\'nin ilk milli parkı Çamlık buradadır.'
  },
  'zonguldak': {
    plaka: 67,
    name: 'ZONGULDAK',
    region: 'KARADENİZ',
    population: '591.204',
    area: '3.310 km²',
    districts: ['MERKEZ', 'ALAPLI', 'ÇAYCUMA', 'DEVREK', 'EREĞLİ', 'GÖKÇEBEY'],
    landmarks: ['GÖKGÖL MAĞARASI', 'EREĞLİ MÜZESİ', 'CEHENNEMAĞZI MAĞARALARI'],
    interestingFact: 'Türkiye\'nin kömür havzasıdır.'
  },
  'aksaray': {
    plaka: 68,
    name: 'AKSARAY',
    region: 'İÇ ANADOLU',
    population: '423.011',
    area: '7.659 km²',
    districts: ['MERKEZ', 'AĞAÇÖREN', 'ESKİL', 'GÜLAĞAÇ', 'GÜZELYURT', 'ORTAKÖY', 'SARIYAHŞİ', 'SULTANHANI'],
    landmarks: ['IHLARA VADİSİ', 'SELİME KATEDRALİ', 'AĞZI KARANLIK MAĞARASI'],
    interestingFact: 'Kapadokya bölgesinin giriş kapısıdır.'
  },
  'bayburt': {
    plaka: 69,
    name: 'BAYBURT',
    region: 'KARADENİZ',
    population: '82.274',
    area: '3.746 km²',
    districts: ['MERKEZ', 'AYDINTEPE', 'DEMİRÖZÜ'],
    landmarks: ['BAYBURT KALESİ', 'SIRA KAYALAR', 'BALKI ŞELALESİ'],
    interestingFact: 'Türkiye\'nin en küçük illerinden biridir.'
  },
  'karaman': {
    plaka: 70,
    name: 'KARAMAN',
    region: 'İÇ ANADOLU',
    population: '258.838',
    area: '8.678 km²',
    districts: ['MERKEZ', 'AYRANCI', 'BAŞYAYLA', 'ERMENEK', 'KAZIMKARABEKİR', 'SARIVELİLER'],
    landmarks: ['KARAMAN KALESİ', 'BİN BİR KİLİSE', 'TAŞKALE'],
    interestingFact: 'Türk dilinin başkenti olarak bilinir.'
  },
  'kirikkale': {
    plaka: 71,
    name: 'KIRIKKALE',
    region: 'İÇ ANADOLU',
    population: '278.749',
    area: '4.365 km²',
    districts: ['MERKEZ', 'BAHŞILI', 'BALIŞEYH', 'ÇELEBİ', 'DELİCE', 'KARAKEÇİLİ', 'KESKİN', 'SULAKYURT', 'YAHŞİHAN'],
    landmarks: ['SİLAH SANAYİ MÜZESİ', 'KIRIKKALE ÜNİVERSİTESİ', 'KIZILIRMAK KÖPRÜSÜ'],
    interestingFact: 'Silah sanayisiyle ünlüdür.'
  },
  'batman': {
    plaka: 72,
    name: 'BATMAN',
    region: 'GÜNEYDOĞU ANADOLU',
    population: '620.278',
    area: '4.659 km²',
    districts: ['MERKEZ', 'BEŞİRİ', 'GERCÜŞ', 'HASANKEYF', 'KOZLUK', 'SASON'],
    landmarks: ['HASANKEYF', 'MALABADİ KÖPRÜSÜ', 'BATMAN ÇAYI'],
    interestingFact: 'Petrol üretimiyle ünlüdür.'
  },
  'sirnak': {
    plaka: 73,
    name: 'ŞIRNAK',
    region: 'GÜNEYDOĞU ANADOLU',
    population: '546.589',
    area: '7.078 km²',
    districts: ['MERKEZ', 'BEYTÜŞŞEBAP', 'CİZRE', 'GÜÇLÜKONAK', 'İDİL', 'SİLOPİ', 'ULUDERE'],
    landmarks: ['CUDİ DAĞI', 'KASRIK BOĞAZI', 'FINDIK KALESİ'],
    interestingFact: 'Cudi Dağı, Nuh\'un Gemisi\'nin indiği yer olarak bilinir.'
  },
  'bartin': {
    plaka: 74,
    name: 'BARTIN',
    region: 'KARADENİZ',
    population: '201.711',
    area: '2.080 km²',
    districts: ['MERKEZ', 'AMASRA', 'KURUCAŞİLE', 'ULUS'],
    landmarks: ['AMASRA KALESİ', 'GÜZELCEHİSAR KÖYÜ', 'BARTIN ÇAYI'],
    interestingFact: 'Amasra, doğal güzellikleriyle ünlüdür.'
  },
  'ardahan': {
    plaka: 75,
    name: 'ARDAHAN',
    region: 'DOĞU ANADOLU',
    population: '97.319',
    area: '4.934 km²',
    districts: ['MERKEZ', 'ÇILDIR', 'DAMAL', 'GÖLE', 'HANAK', 'POSOF'],
    landmarks: ['ARDAHAN KALESİ', 'ÇILDIR GÖLÜ', 'POSOF KALESİ'],
    interestingFact: 'Türkiye\'nin en doğusundaki illerden biridir.'
  },
  'igdir': {
    plaka: 76,
    name: 'IĞDIR',
    region: 'DOĞU ANADOLU',
    population: '203.159',
    area: '3.588 km²',
    districts: ['MERKEZ', 'ARALIK', 'KARAKOYUNLU', 'TUZLUCA'],
    landmarks: ['AĞRI DAĞI', 'IĞDIR OVASI', 'KARAKALE HARABELERİ'],
    interestingFact: 'Türkiye\'nin en doğusundaki ilidir.'
  },
  'yalova': {
    plaka: 77,
    name: 'YALOVA',
    region: 'MARMARA',
    population: '296.333',
    area: '847 km²',
    districts: ['MERKEZ', 'ALTINOVA', 'ARMUTLU', 'ÇINARCIK', 'ÇİFTLİKKÖY', 'TERMAL'],
    landmarks: ['YÜRÜYEN KÖŞK', 'TERMAL KAPLICALARI', 'SUDÜŞEN ŞELALESİ'],
    interestingFact: 'Termal kaplıcalarıyla ünlüdür.'
  },
  'karabuk': {
    plaka: 78,
    name: 'KARABÜK',
    region: 'KARADENİZ',
    population: '248.458',
    area: '4.142 km²',
    districts: ['MERKEZ', 'EFLANİ', 'ESKİPAZAR', 'OVACIK', 'SAFRANBOLU', 'YENİCE'],
    landmarks: ['SAFRANBOLU EVLERİ', 'BULAK MAĞARASI', 'TOKATLI KANYONU'],
    interestingFact: 'Safranbolu, UNESCO Dünya Mirası Listesi\'ndedir.'
  },
  'kilis': {
    plaka: 79,
    name: 'KİLİS',
    region: 'GÜNEYDOĞU ANADOLU',
    population: '142.792',
    area: '1.412 km²',
    districts: ['MERKEZ', 'ELBEYLİ', 'MUSABEYLİ', 'POLATELİ'],
    landmarks: ['KİLİS KALESİ', 'RAVANDA KALESİ', 'NEVRUZ ORMANI'],
    interestingFact: 'Künefesiyle ünlüdür.'
  },
  'osmaniye': {
    plaka: 80,
    name: 'OSMANİYE',
    region: 'AKDENİZ',
    population: '548.556',
    area: '3.320 km²',
    districts: ['MERKEZ', 'BAHÇE', 'DÜZİÇİ', 'HASANBEYLİ', 'KADİRLİ', 'SUMBAS', 'TOPRAKKALE'],
    landmarks: ['KARATEPE ASLANTAŞ AÇIK HAVA MÜZESİ', 'HARUNİYE KAPLICALARI', 'ZORKUN YAYLASI'],
    interestingFact: 'Yer fıstığı üretimiyle ünlüdür.'
  },
  'duzce': {
    plaka: 81,
    name: 'DÜZCE',
    region: 'KARADENİZ',
    population: '400.976',
    area: '2.492 km²',
    districts: ['MERKEZ', 'AKÇAKOCA', 'CUMAYERİ', 'ÇİLİMLİ', 'GÖLYAKA', 'GÜMÜŞOVA', 'KAYNAŞLI', 'YIĞILCA'],
    landmarks: ['AKÇAKOCA PLAJI', 'SAMANDERE ŞELALESİ', 'FAKILLI MAĞARASI'],
    interestingFact: '1999 depreminden sonra il statüsü kazanmıştır.'
  }
};

module.exports = {
  name: 'şehir-bilgi',
  description: 'Türkiye\'nin 81 şehri hakkında detaylı bilgi',
  options: [{
    name: 'şehir',
    description: 'Bilgi almak istediğiniz şehir',
    type: 3,
    required: true,
    autocomplete: true
  }],

  autocomplete: async (interaction) => {
    const searchTerm = interaction.options.getFocused().toLowerCase();
    const matches = Object.entries(cityData)
      .filter(([key, city]) => 
        city.name.toLowerCase().includes(searchTerm) || 
        key.includes(searchTerm))
      .slice(0, 25)
      .map(([key, city]) => ({
        name: `${city.plaka} - ${city.name}`,
        value: key
      }));
    await interaction.respond(matches);
  },

  run: async (client, interaction) => {
    const cityKey = interaction.options.getString('şehir');
    const city = cityData[cityKey];

    if (!city) {
      return interaction.reply({ 
        content: '⚠️ Geçersiz şehir seçimi! Lütfen `/şehir-bilgi` yazıp listeden bir şehir seçin.', 
        ephemeral: true 
      });
    }

    try {
      // CANVAS OLUŞTURMA
      const canvas = createCanvas(1200, 900);
      const ctx = canvas.getContext('2d');
      
      // ARKA PLAN
      const gradient = ctx.createLinearGradient(0, 0, 1200, 900);
      gradient.addColorStop(0, '#1a2980');
      gradient.addColorStop(1, '#26d0ce');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // BAŞLIK
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 72px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(city.name, canvas.width/2, 100);
      
      // ALT BAŞLIK
      ctx.font = '36px Arial';
      ctx.fillText(`📌 ${city.plaka} Plaka | ${city.region} Bölgesi`, canvas.width/2, 160);

      // ANA BİLGİ KUTUSU
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.roundRect(100, 200, 1000, 650, 20);
      ctx.fill();

      // SOL SÜTUN (TEMEL BİLGİLER)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('📊 TEMEL BİLGİLER', 130, 250);
      
      ctx.font = '24px Arial';
      ctx.fillText(`👥 Nüfus: ${city.population}`, 130, 300);
      ctx.fillText(`🗺️ Yüzölçümü: ${city.area}`, 130, 350);
      ctx.fillText(`🏘️ İlçe Sayısı: ${city.districts.length}`, 130, 400);
      
      // İLÇELER
      ctx.font = 'bold 28px Arial';
      ctx.fillText('📍 İLÇELER', 130, 470);
      
      ctx.font = '20px Arial';
      const districtsPerColumn = 10;
      const columnWidth = 400;
      const startX = 130;
      
      // İlçeleri sütunlara bölerek yazdırma
      for (let i = 0; i < city.districts.length; i++) {
        const column = Math.floor(i / districtsPerColumn);
        const row = i % districtsPerColumn;
        ctx.fillText(`• ${city.districts[i]}`, startX + (column * columnWidth), 520 + (row * 30));
      }

      // SAĞ SÜTUN (ÖNEMLİ YERLER VE İLGİNÇ BİLGİ)
      ctx.font = 'bold 28px Arial';
      ctx.fillText('🏛️ ÖNEMLİ YERLER', 650, 250);
      
      ctx.font = '20px Arial';
      city.landmarks.forEach((landmark, i) => {
        ctx.fillText(`★ ${landmark}`, 650, 300 + (i * 30));
      });

      // İLGİNÇ BİLGİ
      ctx.font = 'bold 28px Arial';
      ctx.fillText('💡 İLGİNÇ BİLGİ', 650, 550);
      
      ctx.font = 'italic 20px Arial';
      const lines = wrapText(ctx, city.interestingFact, 400);
      lines.forEach((line, i) => {
        ctx.fillText(line, 650, 600 + (i * 30));
      });

      // FOOTER
      ctx.font = '18px Arial';
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('TÜRKİYE CUMHURİYETİ | 81 ŞEHİR', 1150, 880);

      // DOSYA OLUŞTUR
      const attachment = new AttachmentBuilder(canvas.toBuffer(), { 
        name: `${city.name}-bilgi.png` 
      });

      await interaction.reply({ 
        content: `**${city.name}** şehri hakkında detaylı bilgiler:`,
        files: [attachment] 
      });
    } catch (error) {
      console.error('Hata:', error);
      await interaction.reply({ 
        content: '❌ Şehir bilgisi gösterilirken bir hata oluştu.', 
        ephemeral: true 
      });
    }
  }
};

// Uzun metinleri kaydırma fonksiyonu
function wrapText(context, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = context.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}