const { Client, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "şaka",
    description: "Rastgele bir şaka yapar.",
    type: 1,
    options: [],

    run: async (client, interaction) => {
        // Şaka listesi
        const jokes = [
            "Bir gün matematik kitabı intihar etmek istemiş. Diğer kitaplar sormuş: 'Neden?' O da demiş ki: 'Çok problemim var!'",
            "Doktor hastasına: 'Yağsız beslenmelisin!' demiş. Hasta da: 'Ama ben yağsız ekmek yiyorum!' demiş.",
            "Kedinin yaptığı en büyük hata ne? Yüksek sesle 'Miyav' demek!",
            "Bir gün tavuk yolda geçerken, karşısına bir kapı çıkmış. Tavuk: 'Kapıdan geçmek zorundayım!' demiş.",
            "Simit neden bilgisayara çok benziyor? Çünkü her ikisi de 'kıvrım' yapabilir!",
            "Gece yıldızlar neden gülüyor? Çünkü ay ışığında şakalar yapılıyor!",
            "İki cep telefonu parkta yürüyüş yapıyormuş. Biri diğerine: 'Neden buradayız?' demiş. Diğeri cevap vermiş: 'Güç tasarrufu yapıyoruz!'",
            "Bir gün kedi bir kütüphaneye gitmiş. Kitapları görünce: 'Bunlar çok eski, benim için internet daha iyidir!' demiş.",
            "Tavuk neden gülmez? Çünkü sürekli 'sadece gıdıklanıyorum!' diye düşünüyor.",
            "Dondurma neden soğuk durur? Çünkü sürekli 'Beni dondurun!' der!",
            "Bir adam, ormanda kaybolmuş. Ormanın derinliklerinde bir ağaç görmüş ve ağaç ona: 'Burada ne arıyorsun?' demiş. Adam: 'Bir yol arıyorum!' demiş. Ağaç: 'Burada yollar var, ama hepsi ağaçlara çıkıyor!'",
            "Bir gün bir ayı ve bir tavşan yürüyüşe çıkmış. Ayı tavşana: 'Yavaş ol, ben seni yakalarım!' demiş. Tavşan: 'Ama ben koşuyorum!' demiş.",
            "İki inek merada otluyormuş. Biri diğerine sormuş: 'Neden buraya geldik?' Diğeri cevap vermiş: 'Süt sağımına gitmeden önce biraz otlayalım!'",
            "Kediler bilgisayar kullanır mı? Hayır, çünkü her zaman 'fare' ile uğraşmak zorundalar!",
            "Bir adam doktorun ofisine girmiş ve demiş ki: 'Doktor, bir problemim var, benim bir arı var!' Doktor sormuş: 'Neden?' Adam: 'Çünkü sürekli 'ar' diyor!'",
            "Bir gün tavuk uçmaya karar vermiş. Ama ne kadar denese de bir türlü uçamamış. Sonunda demiş ki: 'Ben sadece yumurtlayabilirim!'",
            "Kedi neden bilgisayar kullanmaz? Çünkü 'fare' ile oynamak istemiyor!",
            "Bir gün dondurma ve pasta yarışmaya karar vermiş. Dondurma demiş ki: 'Ben daha tatlıyım!' Pasta ise: 'Ama ben daha katmanlıyım!'",
            "Doktor hastasına: 'Şekerli yemekten vazgeçmelisin!' demiş. Hasta: 'Ama ben tatlıyım!' demiş.",
            "Bir kaplumbağa ve bir tavşan yarışmaya çıkmış. Kaplumbağa: 'Yavaş ama temkinli gideceğim!' demiş. Tavşan: 'Ben hemen geçeceğim!' demiş.",
            "Kediler neden iyi bilgisayar mühendisi olur? Çünkü sürekli 'program' yaparlar!",
            "Bir adam alışverişte domates almak istemiş. Ama markette domates kalmamış. Adam: 'Tamam, patlıcan alırım!' demiş.",
            "Bir gün bir zürafa ağaçta oturuyormuş. Arkadaşları sormuş: 'Neden buradasın?' Zürafa: 'Çünkü yukarıda hava daha güzel!' demiş.",
            "Havuz neden dalgalanır? Çünkü her zaman 'dalga' geçiyor!",
            "Bir gün bir köpek, bir kediye sormuş: 'Neden sürekli tırmanıyorsun?' Kedi cevap vermiş: 'Çünkü yükseklik korkum yok!'",
            "Bir gün bir elma ağaçta oturuyormuş. Arkadaşları ona: 'Düştün mü?' diye sormuş. Elma: 'Hayır, sadece rüzgar beni salladı!' demiş.",
            "Kediler neden bilgisayar kullanamaz? Çünkü her zaman 'fare' ile oynamak zorundalar!",
            "Bir gün bir çiçek ve bir böcek karşılaşmış. Çiçek: 'Sen neden bu kadar uçuyorsun?' demiş. Böcek: 'Çünkü seninle konuşmak istemiyorum!' demiş.",
            "Küçük bir kaplumbağa yavaş yavaş yürüyormuş. Arkadaşları: 'Neden bu kadar yavaşsın?' demiş. Kaplumbağa: 'Çünkü her zaman sabırlıyım!' demiş.",
            "Bir gün bir çorap bir ayakkabıya sormuş: 'Neden bu kadar sıkısın?' Ayakkabı cevap vermiş: 'Çünkü seni korumak istiyorum!'",
            "Bir gün bir maymun ormanda yürüyormuş. Diğer maymun: 'Neden ağaçtan inmiyorsun?' demiş. Maymun: 'Çünkü bu benim evim!' demiş.",
            "İki ördek gölette yüzerken biri diğerine: 'Neden bu kadar yüzüyorsun?' demiş. Diğeri: 'Sadece yüzmek için!' demiş.",
            "Bir gün bir denizkızı okyanusta yüzüyormuş. Arkadaşları ona: 'Neden bu kadar uzun kalıyorsun?' demiş. Denizkızı: 'Çünkü suyun tadını çıkarıyorum!' demiş.",
            "Bir gün bir balık ve bir kurbağa buluşmuş. Balık: 'Suda yüzmek çok eğlenceli!' demiş. Kurbağa: 'Ama ben zıplamayı seviyorum!' demiş.",
            "Bir gün bir ayı ve bir sincap ormanda yürüyüşe çıkmış. Ayı: 'Neden sürekli zıplıyorsun?' demiş. Sincap: 'Çünkü bu benim tarzım!' demiş.",
            "Bir gün bir kedi ve bir köpek parkta yürüyüşe çıkmış. Kedi: 'Neden benimle gelmek istemiyorsun?' demiş. Köpek: 'Çünkü sen her zaman uyumak istiyorsun!' demiş.",
            "Bir gün bir kedi masanın üstünde oturuyormuş. Arkadaşı ona: 'Neden orada oturuyorsun?' demiş. Kedi: 'Çünkü burası en yüksek yer!' demiş.",
            "Bir gün bir kaplumbağa yavaşça yürüyormuş. Diğer hayvanlar ona: 'Hadi biraz hızlan!' demiş. Kaplumbağa: 'Yavaş ama emin adımlarla gidiyorum!' demiş.",
            "Bir gün bir sinek bir adamın kafasında uçuyormuş. Adam: 'Git başımdan!' demiş. Sinek: 'Ama senin başın çok güzel!' demiş.",
            "Bir gün bir tavşan bir domatese sormuş: 'Neden bu kadar kızardın?' Domates: 'Çünkü güneş çok parlaktı!' demiş.",
            "İki kedi bir çiçeğin etrafında dans ediyormuş. Biri diğerine: 'Neden bu kadar neşelisin?' demiş. Diğeri: 'Çünkü çiçek çok güzel!' demiş.",
            "Bir gün bir çiçek rüzgarla dans ediyormuş. Rüzgar: 'Sen çok güzelsin!' demiş. Çiçek: 'Teşekkür ederim, sen de!' demiş.",
            "Bir gün bir kurbağa gölette oturuyormuş. Diğer kurbağa ona: 'Neden bu kadar sessizsin?' demiş. Kurbağa: 'Çünkü düşünüyordum!' demiş.",
            "Bir gün bir kuş bir ağacın üstünde oturuyormuş. Ağaç ona: 'Neden burada oturuyorsun?' demiş. Kuş: 'Çünkü burası benim evim!' demiş.",
            "Bir gün bir köpek ve bir kedi parkta yürüyüş yapıyormuş. Köpek: 'Neden beni seviyorsun?' demiş. Kedi: 'Çünkü sen çok neşelisin!' demiş.",
            "Bir gün bir çiçek diğer çiçeğe: 'Neden bu kadar güzelsin?' demiş. Diğer çiçek: 'Çünkü güneş beni seviyor!' demiş.",
            "Bir gün bir tavşan bir havuç almış. Havucu görünce: 'Bu ne kadar güzel!' demiş.",
            "Bir gün bir ağaç kuşları görünce: 'Neden bu kadar neşelisiniz?' demiş. Kuşlar: 'Çünkü özgürüz!' demiş.",
            "Bir gün bir sincap bir çiçeğe: 'Sen ne kadar güzelsin!' demiş. Çiçek: 'Teşekkür ederim, ama sen de çok sevimlisin!' demiş.",
            "Bir gün bir su kaplumbağası göletin kenarında oturuyormuş. Arkadaşları ona: 'Neden bu kadar sakin duruyorsun?' demiş. Kaplumbağa: 'Çünkü her şey yolunda!' demiş.",
            "Bir gün bir kaplumbağa ve bir tavşan yarış yapmaya karar vermiş. Kaplumbağa: 'Yavaş ama emin adımlarla gideceğim!' demiş. Tavşan: 'Ben hemen geçeceğim!' demiş.",
            "Bir gün bir kedinin karnı acıkmış. Dışarıda bir köpek: 'Kediler neden bu kadar tembel?' demiş. Kedi: 'Çünkü sürekli uyuyorum!' demiş.",
            "Bir gün bir ayı ormanda yürüyüş yaparken, bir sincapla karşılaşmış. Ayı: 'Neden bu kadar hızlı koşuyorsun?' demiş. Sincap: 'Çünkü ağaçların tepesine tırmanmak istiyorum!' demiş.",
            "Bir gün bir kedi ve bir tavşan parkta oynuyormuş. Kedi: 'Neden buraya geldin?' demiş. Tavşan: 'Çünkü burası eğlenceli!' demiş.",
            "Bir gün bir ördek gölette yüzerken, diğer ördek ona: 'Neden bu kadar rahat yüzüyorsun?' demiş. Diğer ördek: 'Çünkü suyu seviyorum!' demiş.",
            "Bir gün bir çiçek güneş ışığında parlıyormuş. Rüzgar ona: 'Sen ne kadar güzelsin!' demiş. Çiçek: 'Teşekkür ederim!' demiş.",
            "Bir gün bir sinek bir elmanın üstünde uçuyormuş. Elma: 'Neden burada uçuyorsun?' demiş. Sinek: 'Çünkü seninle sohbet etmek istiyorum!' demiş.",
            "Bir gün bir tavşan ormanda dolaşırken, diğer tavşana: 'Neden bu kadar hızlısın?' demiş. Diğer tavşan: 'Çünkü beni yakalamak istiyorsun!' demiş.",
            "Bir gün bir kaplumbağa, bir kuşla karşılaşmış. Kuş: 'Neden yavaş gidiyorsun?' demiş. Kaplumbağa: 'Çünkü yavaş ama emin adımlarla gideceğim!' demiş.",
            "Bir gün bir kedi parkta oturuyormuş. Arkadaşları ona: 'Neden burada oturuyorsun?' demiş. Kedi: 'Çünkü güneşin tadını çıkarıyorum!' demiş.",
            "Bir gün bir köpek ve bir kedi, bir elma ağacının altında oturmuş. Kedi: 'Neden buradasın?' demiş. Köpek: 'Çünkü burası gölgeli!' demiş.",
            "Bir gün bir çiçek bir arıya: 'Neden sürekli uçuyorsun?' demiş. Arı: 'Çünkü bal yapıyorum!' demiş.",
            "Bir gün bir balık gölette yüzerken, diğer balık ona: 'Neden bu kadar neşelisin?' demiş. Diğer balık: 'Çünkü suyun tadını çıkarıyorum!' demiş.",
            "Bir gün bir kedi ve bir kuş ormanda yürüyüş yapıyormuş. Kedi: 'Neden bu kadar yükseğe zıplıyorsun?' demiş. Kuş: 'Çünkü uçmayı seviyorum!' demiş.",
            "Bir gün bir çiçek rüzgarla dans ediyormuş. Rüzgar: 'Sen çok güzelsin!' demiş. Çiçek: 'Teşekkür ederim!' demiş.",
            "Bir gün bir tavşan gölette su içiyormuş. Arkadaşları ona: 'Neden bu kadar neşelisin?' demiş. Tavşan: 'Çünkü suyu seviyorum!' demiş.",
            "Bir gün bir kurbağa gölette oturuyormuş. Diğer kurbağa: 'Neden bu kadar sessizsin?' demiş. Kurbağa: 'Çünkü düşünüyordum!' demiş.",
            "Bir gün bir kuş bir ağacın üstünde oturuyormuş. Ağaç ona: 'Neden burada oturuyorsun?' demiş. Kuş: 'Çünkü burası benim evim!' demiş.",
            "Bir gün bir köpek ve bir kedi parkta yürüyüş yapıyormuş. Köpek: 'Neden beni seviyorsun?' demiş. Kedi: 'Çünkü sen çok neşelisin!' demiş.",
            "Bir gün bir çiçek diğer çiçeğe: 'Neden bu kadar güzelsin?' demiş. Diğer çiçek: 'Çünkü güneş beni seviyor!' demiş.",
            "Bir gün bir tavşan bir havuç almış. Havucu görünce: 'Bu ne kadar güzel!' demiş.",
            "Bir gün bir ağaç kuşları görünce: 'Neden bu kadar neşelisiniz?' demiş. Kuşlar: 'Çünkü özgürüz!' demiş.",
            "Bir gün bir sincap bir çiçeğe: 'Sen ne kadar güzelsin!' demiş. Çiçek: 'Teşekkür ederim, ama sen de çok sevimlisin!' demiş.",
            "Bir gün bir su kaplumbağası göletin kenarında oturuyormuş. Arkadaşları ona: 'Neden bu kadar sakin duruyorsun?' demiş. Kaplumbağa: 'Çünkü her şey yolunda!' demiş."
        ];

        // Rastgele şaka seçimi
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

        // Şakayı embed olarak gönderme
        const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setDescription(randomJoke);

        interaction.reply({ embeds: [embed] });
    }
};
