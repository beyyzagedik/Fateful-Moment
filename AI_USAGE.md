# AI Kullanım Raporu

Bu projede geliştirme sürecinin büyük kısmı **Claude Code** (Anthropic) ile yürütüldü. Aşağıda aracı hangi aşamada nasıl kullandığım, nerede yanıldığı ve kontrolü nasıl sağladığım anlatılıyor.

## 1. Kullanılan araçlar

| Araç                              | Kullanım                                                                                     |
| --------------------------------- | -------------------------------------------------------------------------------------------- |
| Claude Code | Figma analizi, planlama, kod yazımı, hata ayıklama, dokümantasyon                            |
| Claude'un yerleşik tarayıcısı     | Figma dosyasını prototip modunda gezme, videoları inceleme, web build'i test etme            |
| Expo dokümantasyonu (SDK 57)      | AI'ın ezberden değil, güncel API'den kod yazması için her kritik modülde okutuldu            |
| Figma MCP (Claude Code eklentisi) | Figma ekranlarının ölçü, renk ve bileşen bilgisini doğrudan okuyup uygulamayla karşılaştırma |
| Android emülatörü + `adb`         | AI'a emülatörü dokunma, ekran görüntüsü ve ekran kaydıyla sürdürerek test ettirme            |

## 2. Süreç

### a) Tasarım analizi

- AI'a Figma bağlantısını verip ekranları gezdirdim. Tuval görünümü küçük pencerede okunamadığı için **prototip moduna** geçip klavye olaylarıyla tüm çerçeveleri tek tek dolaştırdım ve node ID'lerini topladım.
- Senaryo videosunun süresini (97 sn, kartta yazan "1:37 min" ile aynı) ve sahnelerini video öğesini farklı saniyelere sararak inceledim.
- Katman panelinden **12 DNA kişilik tipinin** adlarını ("Soğukkanlı Stratejist" … "Uyumcu") ve "Flow v01" akışındaki ekran adlarını çıkardım.

### b) Kapsamı netleştirme

Case metni kısa olduğu için AI ile birlikte **Figma'da görünenler** ile **benim çıkarımlarım** ayrıldı. Çıkarımlar README'de "Varsayımlar" başlığında belgelendi (puanlama, süre dolması, akış bağlantıları).

### c) Geliştirme

Sıra: tema token'ları → veri modeli ve dummy veri → DNA algoritması → ortak bileşenler → auth ekranları → yatay uygulama iskeleti → senaryo oynatıcı → DNA ekranı → yardımcı ekranlar.
Her aşamadan sonra `tsc --noEmit` ve `expo lint` çalıştırıldı.

### d) Test

Web build'inde uçtan uca akış denendi: kayıt formu hataları, yanlış şifre, giriş sonrası yönlendirme, senaryo oynatma, zaman aşımı, DNA hesaplaması.

### e) Emülatör testi ve teslim kontrolü

Web testi yetmediği için uygulamayı Android emülatöründe (Expo Go) test ettirdim. AI, `adb` ile ekrana dokunup ekran görüntüsü alarak tüm akışı gezdi: kayıt, giriş, senaryo, zaman aşımı, DNA, geçmiş, ayarlar ve çıkış. Aynı turda teslim şartlarını da madde madde kontrol ettirdim: repo herkese açık mı, README'de kurulum ve AI bölümü var mı, APK ve ekran kaydı için neler eksik.

Emülatör çok yavaştı (bilgisayarda boş RAM azdı). Bazı ekranlar kendiliğinden atlanıyormuş gibi göründü. Bunu hemen hata sayıp kodu değiştirmek yerine ekran kaydı aldırıp kareleri tek tek inceledim. Akış doğru çalışıyordu; sorun gecikmeli işlenen dokunuşlardı.

### f) Figma ile karşılaştırma

Figma MCP ile Playground sayfasındaki ekranları uygulamayla yan yana koydurdum. Auth ekranları uyumluydu, ama oyun akışında belirgin farklar çıktı. Farkları önce bir tabloda listelettim, sonra hangilerinin uygulanacağına ben karar verdim. Figma'nın ücretsiz planındaki MCP limiti dolunca, daha önce indirilen görüntülerden **piksel rengi ölçerek** karşılaştırmaya devam ettik (örneğin arka planın gerçekte `#020618` olduğu böyle bulundu).

## 3. Örnek promptlar

Aşağıdaki promptlar süreçte gerçekten verdiğim isteklerdir; okunabilirlik için yazımı toparlanmıştır, istek ve kapsam aynıdır. Her birinin altında neden o şekilde sorduğum yazıyor.

**1. Analiz ve yol haritası**

> "Bu Figma dosyasını incele. Ekranları, ekranlar arası akışı ve tekrar eden bileşenleri çıkar. Yapılması gerekenleri ayrıntılı özetle ve geliştirme sırasını gösteren bir yol haritası ver."

_Neden:_ Kod yazdırmadan önce AI'ın tasarımı nasıl anladığını görmek istedim. Yanlış sayfaya (eski "eX" sayfası) dayandığını bu aşamada fark edip düzelttim; kod yazıldıktan sonra fark etseydim çok daha pahalı olurdu.

**2. Tasarımda tanımlı olmayan kısımlar**

> "Figma'da tanımlı olmayan kısımlar var: ekranlar arası bağlantılar, puanlama mantığı, süre dolunca ne olacağı. Bunlar için makul varsayımlarla ilerleyelim ve her varsayımı README'de belgeleyelim."

_Neden:_ AI boşlukları sessizce doldurmaya yatkın. Varsayımları açıkça istemek, "tasarımda olan" ile "benim kararım olan" ayrımını görünür tuttu.

**3. Emülatör testi ve teslim kontrolü**

> "Uygulamayı Android emülatöründe uçtan uca test et. Modülleri (auth, senaryo oynatıcı, DNA, geçmiş, ayarlar) tek tek doğrula, Figma tasarımına uygunluğunu kontrol et ve teslim şartlarını madde madde karşılaştır: iOS ve Android ekran kaydı, APK, erişilebilir repo, README."

_Neden:_ Teslim şartlarını prompt'a olduğu gibi koydum; böylece AI "test ettim" demek yerine her şartı ayrı ayrı raporlamak zorunda kaldı. Eksik olanlar (APK, iOS kaydı) bu sayede açıkça listelendi.

**4. Önce karşılaştırma, sonra düzeltme**

> "Önce Figma ile uygulamayı ekran ekran karşılaştır ve eksikleri listele. Koyu tema düzeltmesine ondan sonra geç."

_Neden:_ İşleri sıraya koydum ve karşılaştırmayı düzeltmeden ayırdım. Farkları önce tablo halinde görünce hangilerinin uygulanacağına ben karar verebildim; AI'ın kendi seçtiği farkları düzeltmesini istemedim.

**5. Hedefli hata bildirimi**

> "Giriş formundaki metin kutularına dokununca odak gelmiyor, klavye açılmıyor."

_Neden:_ Çözüm önermek yerine gözlemlediğim belirtiyi tarif ettim. AI kök nedeni kendisi buldu: yazı alanı, 48px'lik kutunun yalnızca metin satırı kadar kısmını kaplıyordu.

**6. Son kontrol ve demo**

> "Teslimden önce tüm ekranlarda frontend açısından son UI kontrolünü yaptım."

> "Uygulamanın tüm işlevlerini gösteren bir Android ekran kaydı hazırladım dakikayı geçmesin; ekranlar arası geçişler de görünsün, akıcı olsun."

_Neden:_ İlk kayıt 3 dakika 52 saniye çıktı ve iki ekran geçişi eksikti. "Daha kısa olsun" demek yerine ölçülebilir bir sınır (2 dakika) ve kalite ölçütü (geçişler, akıcılık) verdim; sonuç 1 dakika 48 saniye oldu.

**Promptlarda dikkat ettiklerim:** tek seferde tek hedef vermek, işi adımlara bölüp sırasını belirtmek, "bitti" sayılmasının ölçütünü yazmak ve AI'dan önce rapor, sonra değişiklik istemek.

## 4. AI'ın hataları ve düzeltmeler

Bu kısım süreci nasıl kontrol ettiğimi en iyi gösteren bölüm:

| #   | Hata                                                                                                                                  | Nasıl fark edildi                                                      | Düzeltme                                                                                                                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | İlk analiz, Figma'da **"☠️eX"** (eski/iptal) sayfasına dayanıyordu                                                                    | İkinci Figma bağlantısı Playground'a götürünce sayfa listesi incelendi | Plan Playground'daki güncel akışa (seçenek sonrası video, 12 kişilik tipi) göre güncellendi                                                                      |
| 2   | Kod, React Native 0.86'da kaldırılan `StyleSheet.absoluteFillObject`'i kullandı                                                       | TypeScript hatası                                                      | `StyleSheet.absoluteFill` ile değiştirildi                                                                                                                       |
| 3   | `useRef(new Animated.Value()).current` ve render sırasında ref güncelleme (React Compiler kurallarına aykırı)                         | `expo lint`, 44 hata                                                   | `useState(() => new Animated.Value())` ve React 19.2'deki `useEffectEvent` kullanıldı                                                                            |
| 4   | Girişten sonra uygulama `/scenario/undefined`'a gidiyordu                                                                             | Uçtan uca test                                                         | Sebep: korumalı rota yığındaki ilk ekrana gidiyordu, ilk ekran da senaryoydu. `unstable_settings.anchor = 'index'` ile çözüldü                                   |
| 5   | Hata ayıklarken sunucu `CI=1` ile açıktı; dosya izleme kapalı olduğu için düzeltmeler tarayıcıya ulaşmıyordu                          | Aynı hata her düzeltmeden sonra sürünce test ortamı sorgulandı         | Sunucu normal modda yeniden başlatıldı; gereksiz geçici değişiklikler geri alındı                                                                                |
| 6   | Geri sayım ve sahne geçişi animasyon bitişine bağlıydı; sekme görünmezken takılıyordu                                                 | Zaman aşımı testi ilerlemedi                                           | Süreler `setTimeout` ile yönetildi, animasyon sadece görsel                                                                                                      |
| 7   | Kullanılmayan `react-native-reanimated` ve `gesture-handler` eksik bağımlılık uyarısı verdi                                           | `expo-doctor`                                                          | Eksik paketi eklemek yerine kullanılmayan paketler kaldırıldı (21/21 kontrol geçti)                                                                              |
| 8   | Metin kutusuna dokununca çoğu zaman odak gelmiyordu                                                                                   | Emülatör testi                                                         | Yazı alanı 48px kutunun sadece metin satırını kaplıyordu. Alan kutuyu dolduracak şekilde genişletildi, kutunun tamamı dokunulabilir yapıldı                      |
| 9   | DNA radar grafiğinde "Courage" ve "Empathy" etiketleri kesiliyordu                                                                    | Emülatör ekran görüntüsü                                               | Etiketler eksen uçlarına ortalandı                                                                                                                               |
| 10  | Aynı anda iki seçeneğe basılırsa bir karar iki kez kaydedilebiliyordu                                                                 | Kod incelemesi                                                         | Karar kilitlenince ikinci dokunuş yok sayılıyor                                                                                                                  |
| 11  | Android `userInterfaceStyle: "dark"` ayarını uygulamıyordu; çıkış diyaloğu açık renkte çıkıyordu                                      | APK derlemesindeki (prebuild) uyarı ve emülatör                        | `expo-system-ui` eklendi                                                                                                                                         |
| 12  | **AI'ın kendi hatası:** prebuild'in `package.json`'a yaptığı değişikliği geri alırken yeni eklenen `expo-system-ui` satırını da sildi | Değişiklik sonrası `git diff` kontrolü                                 | Satır geri eklendi, `expo install --check` ile doğrulandı                                                                                                        |
| 13  | Kayıt ekranında klavye şifre kurallarını ve "Sign up" butonunu kapatıyor, form kaymıyordu                                             | Emülatörde son UI kontrolü                                             | Android edge-to-edge çalıştığı için `KeyboardAvoidingView` iki platformda da `padding` yapıldı                                                                   |
| 14  | Oyun akışı Figma'dan farklıydı: kategori katmanı, ikon şeridi, kendiliğinden geçen başlık kartı, tek sütun seçenekler                 | Figma MCP karşılaştırması                                              | Home V2, yan menü, "Start Simulation" brifing kartı, 2 sütunlu seçenekler, "Your Choice" rozeti, ortaya doğru daralan süre çubuğu ve kırmızı arka plan uygulandı |
| 15  | Auth ekranlarında Figma'da olmayan mor degrade vardı; bazı butonlar yanlış stildeydi                                                  | Figma görüntüsünden piksel rengi ölçümü                                | Arka plan düz `#020618` yapıldı, butonlar Figma'daki koyu camgöbeği stile çevrildi                                                                               |

Figma'dan **bilerek** ayrıldığım iki yer var: karar ekranında soru metnini bıraktım (videosu olmayan senaryolarda soru metni olmadan ne sorulduğu anlaşılmıyor), ve tasarımda karşılığı olmayan History / Archetypes ekranlarını menüye aynı stilde ekledim.

## 5. Değerlendirme

- **AI'ın hızlandırdığı yerler:** Figma'dan ekran ve içerik çıkarma, proje iskeleti, bileşenlerin ilk halleri, DNA algoritması, dokümantasyon.
- **AI'ın test tarafında hızlandırdığı yerler:** Emülatörde tekrarlayan dokunma/ekran görüntüsü işleri, ekran kaydını kareye bölüp inceleme, Figma ile uygulamayı ekran ekran karşılaştırma.
- **Kontrolün bende kaldığı yerler:** Kapsam kararları (hangi varsayım, hangi sıra), test senaryoları, AI'ın bulduğu kök nedenleri doğrulama, tasarım uyumunun gözle kontrolü, Figma farklarından hangilerinin uygulanacağı ve hangilerinden bilerek ayrılınacağı.
- **Öğrendiğim:** AI'ın ürettiği kod "çalışıyor gibi" görünse bile sürüme özgü API değişiklikleri (RN 0.86, React Compiler) ve test ortamındaki yan etkiler (CI modu, görünmeyen sekme) ancak düzenli tip kontrolü, lint ve gerçek akış testiyle yakalanabiliyor. Emülatör testi ayrıca şunu gösterdi: web'de sorunsuz görünen şeyler (dokunma alanı, klavye, Android koyu tema) ancak gerçek cihaz ortamında ortaya çıkıyor. Yavaş bir test ortamında da her tuhaflığı hemen hata sayıp koda dokunmak yerine önce kanıt (ekran kaydı) toplamak gerekiyor.
