# Fateful Moment

Tarihin kritik anlarında kullanıcıyı karar veren kişinin yerine koyan ve verdiği kararlardan **karar DNA'sını** çıkaran bir React Native (Expo) uygulaması. Figma tasarımına göre geliştirildi. Backend yok; tüm veriler uygulamanın içindeki dummy dosyalardan gelir.

> *"If you were in that situation, what would you do?"*

## Akış

```
Welcome → Sign up / Sign in / Reset password → Check email      (dikey)
        ↓
Scenarios (senaryo kartları) → Start                             (yatay)
        ↓
Brifing (Start Simulation) → Giriş sahneleri / video → Karar (geri sayım) → Sonuç → (2. karar) → DNA
```

| Ekran | Öne çıkanlar |
|---|---|
| Welcome | Email / Apple / Google ile devam. Apple ve Google demo hesabıyla giriş yapar |
| Create Account | Ad, e-posta ve şifre alanları. Şifre kuralları canlı güncellenir (8+ karakter, büyük harf, küçük harf, rakam). Alan hataları ve "e-posta kayıtlı" hatası |
| Sign In | Yanlış e-posta ve yanlış şifre hataları, şifre göster/gizle |
| Reset Password → Check Email | E-posta formatı ve kayıtlı hesap kontrolü |
| Scenarios | Figma "Home V2": tüm senaryo kartları (süre, açıklama, Start). Seçilmeyen kartlar soluklaşır, oynananlarda "Played" rozeti var |
| Senaryo | "Scenario Briefing" kartı ve Start Simulation, sinematik giriş (atlanabilir), 2 sütunlu seçenek kartları, ortaya doğru daralan ve sarıdan kırmızıya dönen süre çubuğu, son saniyelerde kırmızı arka plan, seçimde "Your Choice" rozeti ve titreşim, sonuç metni |
| DNA | 12 kişilik tipinden en yakın olanı, 6 eksenli radar grafik, eksen puanları, Pattern Detection, Blind Spot, istatistikler |
| History / Archetypes / Settings | Karar geçmişi, 12 kişilik tipi galerisi, çıkış ve DNA sıfırlama |

## Kurulum ve çalıştırma

Gereksinim: Node 20+.

```bash
npm install
npx expo start
```

- **Android emülatörü:** Android Studio'da bir sanal cihaz başlatın, ardından terminalde `a` tuşuna basın (veya `npm run android`).
- **Fiziksel cihaz:** Expo Go uygulamasıyla QR kodu okutun.
- **iOS:** macOS'ta simülatör için `i`, ya da iPhone'da Expo Go.
- **Web (hızlı önizleme):** `npm run web`

Demo hesabı: `jamessmith@mail.com` / `Fateful1`. Yeni hesap da oluşturabilirsiniz; hesaplar cihazda saklanır.

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint (expo config)
```

## Teknik yapı

| Konu | Seçim |
|---|---|
| Çatı | Expo SDK 57, React Native 0.86, TypeScript (strict) |
| Navigasyon | Expo Router (dosya tabanlı), `Stack.Protected` ile oturum koruması |
| Durum | Zustand ve AsyncStorage `persist` (oturum, hesaplar, karar geçmişi) |
| Görsel | `expo-linear-gradient`, `react-native-svg` (logo, radar), Inter fontu |
| Video | `expo-video` (senaryoya video eklenirse otomatik kullanılır) |
| Ekran yönü | `expo-screen-orientation`: auth dikey, oyun yatay |

```
src/
  app/            → ekranlar (Expo Router)
    (auth)/       → welcome, sign-up, sign-in, forgot-password, check-email
    (app)/        → index (Scenarios), scenario/[id], dna, history, archetypes, settings
  components/     → Button, TextField, PasswordRules, AppShell, MiniPlayer, play/*, dna/*
  data/           → dummy veri: users, categories, scenarios, archetypes
  lib/            → validation, dna (puanlama ve kişilik tipi eşleştirme)
  store/          → auth, progress, player (Zustand)
  theme/          → renk, font ve boşluk token'ları
```

### DNA nasıl hesaplanıyor?

1. Her seçeneğin 6 eksene gizli bir etkisi var (Vision, Courage, Risk, Control, Empathy, Ethics), yaklaşık −10 ile +10 arası.
2. Kullanıcının tüm kararları toplanır ve karar sayısına göre ortalanır: `puan = 50 + ortalama × 2.5`, sonuç 0–100 arasında tutulur.
3. Süre dolarsa bu da bir karar sayılır: `Control −8, Courage −6`.
4. Puan vektörü, 12 kişilik tipinin hedef profilleriyle karşılaştırılır. En yakın tip seçilir (Öklid mesafesi) ve benzerlik yüzdesi gösterilir.
5. En düşük eksen **Blind Spot** olur. Karar hızı, öne çıkan eksenler ve zaman aşımları **Pattern Detection** metinlerini oluşturur.

Aynı senaryo tekrar oynanırsa eski cevaplar silinir, yenileri yazılır. Yarıda bırakılan senaryo kaydedilmez.

## Varsayımlar ve tasarım kararları

Figma prototipinde ekranlar arası bağlantılar ve puanlama mantığı tanımlı değildi. Tasarımda olmayan kısımlar için şu kararları verdim:

1. **Akış:** Start → brifing (Start Simulation) → giriş → karar → sonuç metni → (varsa) sonraki karar → DNA ekranı.
2. **Süre:** Kararlar 12–15 saniye. Süre dolunca "karar verilmedi" kaydedilir ve puana yansır.
3. **Videolar:** Figma'dan alınan Irak Savaşı giriş videosu (`assets/videos/iraq-war-intro.mp4`, 26 sn) senaryonun girişinde oynar. Karar anında, Figma'daki "Unselected Options" ekranında olduğu gibi harita görseli seçeneklerin arkasına geçer. Tasarımda diğer senaryolar için video yok; onlarda **sinematik sahne gösterimi** var (renk geçişleri, yavaş yakınlaşma, anlatım metinleri). Yeni video eklemek için dosyayı `assets/videos/` klasörüne koyup senaryonun `video` alanına `require(...)` yazmak yeterli. Seçenek sonrası videolar (Figma: "Selected Option's Video – Karar 1/2") için `outcomeVideo` alanı hazır ama dosyaları yok.
4. **Görseller:** 12 DNA portresi Figma'dan alındı ve 512 px'e küçültüldü (orijinaller `design/portraits-original/`). Figma'daki kız/erkek varyantları `altPortraits` olarak duruyor; varsayılan olarak Figma'daki ekisiz katman kullanılıyor. Beyaz Saray görseli iki tarih senaryosunun kapağı oldu. Diğer senaryolarda görsel olmadığı için renk geçişi kullanılıyor.
   Logo, uygulama ikonu, Android adaptive ikonu ve açılış ekranı `app-logo.jpg`'den üretildi: `scripts/build-logo-assets.ps1`.
5. **İçerik:** 6 senaryo oynanabilir, 7'si "Coming soon". Seçenek metinleri tasarımdaki gibi İngilizce ve Türkçe karışık; kişilik tipi adları Figma'daki Türkçe isimlerle birlikte gösteriliyor.
6. **Mini oynatıcı:** Üst bardaki "STANDBY / THIS IS THE FATEFUL MOMENT" oynatıcısının sadece arayüzü var; ses dosyası yok.
7. **Menü:** Mini oynatıcının sağındaki liste ikonu Figma'daki yan menüyü açar (SCENARIOS / DNA / SETTINGS). Tasarımda olmayan History ve Archetypes aynı stilde menüye eklendi.
8. **Apple / Google girişi:** Gerçek OAuth yok; demo hesabıyla giriş yapar.
9. **Ekran yönü:** Figma'da auth ekranları dikey (375×812), oyun ekranları yatay çizilmiş; uygulama da buna göre yön değiştiriyor.
10. **Final UI sayfası:** Paylaşılan kopya dosyada bu sayfa boş. Tasarım "eX", "Playground" ve "Style Guide" sayfalarından alındı.

## Bilinen sınırlamalar

- Tasarımda yalnızca Irak senaryosunun giriş videosu var; diğer senaryolar sahne gösterimiyle oynar. Seçenek sonrası videolar ve Business / Crisis / Science kapakları da tasarımda bulunmadığı için eklenmedi.
- Portre–kişilik tipi eşleştirmesi görsellerden yapıldı. Kesin olmayanlar: "Uyumcu" (kulaklıklı, başparmak yukarı) ve "Empatik Lider" erkek varyantı (açık avuçlar).
- Tasarım token'ları ekran görüntülerinden örneklendi; Figma Dev Mode'dan alınan kesin değerlerle ince ayar yapılabilir.
