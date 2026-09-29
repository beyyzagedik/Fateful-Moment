# AI Kullanım Raporu

Bu projede geliştirme sürecinin büyük kısmı **Claude Code** (Anthropic) ile yürütüldü. Aşağıda aracı hangi aşamada nasıl kullandığım, nerede yanıldığı ve kontrolü nasıl sağladığım anlatılıyor.

## 1. Kullanılan araçlar

| Araç | Kullanım |
|---|---|
| Claude Code (masaüstü uygulaması) | Figma analizi, planlama, kod yazımı, hata ayıklama, dokümantasyon |
| Claude'un yerleşik tarayıcısı | Figma dosyasını prototip modunda gezme, videoları inceleme, web build'i test etme |
| Expo dokümantasyonu (SDK 57) | AI'ın ezberden değil, güncel API'den kod yazması için her kritik modülde okutuldu |

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

## 3. Örnek promptlar

> "Bu Figma bağlantısını incele, ne yapılmalı detaylı özet ve yol haritası ver."

> "Figma tasarımını ve maildeki gereklilikleri esas al" (ikinci bir node bağlantısıyla birlikte; bu bağlantı Playground sayfasındaki DNA portrelerine ve Flow v01 akışına götürdü)

> "B şeklinde nasıl yapılır" (tasarımda olmayan kısımları varsayımlarla kurup belgeleme yaklaşımı)

## 4. AI'ın hataları ve düzeltmeler

Bu kısım süreci nasıl kontrol ettiğimi en iyi gösteren bölüm:

| # | Hata | Nasıl fark edildi | Düzeltme |
|---|---|---|---|
| 1 | İlk analiz, Figma'da **"☠️eX"** (eski/iptal) sayfasına dayanıyordu | İkinci Figma bağlantısı Playground'a götürünce sayfa listesi incelendi | Plan Playground'daki güncel akışa (seçenek sonrası video, 12 kişilik tipi) göre güncellendi |
| 2 | Kod, React Native 0.86'da kaldırılan `StyleSheet.absoluteFillObject`'i kullandı | TypeScript hatası | `StyleSheet.absoluteFill` ile değiştirildi |
| 3 | `useRef(new Animated.Value()).current` ve render sırasında ref güncelleme (React Compiler kurallarına aykırı) | `expo lint`, 44 hata | `useState(() => new Animated.Value())` ve React 19.2'deki `useEffectEvent` kullanıldı |
| 4 | Girişten sonra uygulama `/scenario/undefined`'a gidiyordu | Uçtan uca test | Sebep: korumalı rota yığındaki ilk ekrana gidiyordu, ilk ekran da senaryoydu. `unstable_settings.anchor = 'index'` ile çözüldü |
| 5 | Hata ayıklarken sunucu `CI=1` ile açıktı; dosya izleme kapalı olduğu için düzeltmeler tarayıcıya ulaşmıyordu | Aynı hata her düzeltmeden sonra sürünce test ortamı sorgulandı | Sunucu normal modda yeniden başlatıldı; gereksiz geçici değişiklikler geri alındı |
| 6 | Geri sayım ve sahne geçişi animasyon bitişine bağlıydı; sekme görünmezken takılıyordu | Zaman aşımı testi ilerlemedi | Süreler `setTimeout` ile yönetildi, animasyon sadece görsel |
| 7 | Kullanılmayan `react-native-reanimated` ve `gesture-handler` eksik bağımlılık uyarısı verdi | `expo-doctor` | Eksik paketi eklemek yerine kullanılmayan paketler kaldırıldı (21/21 kontrol geçti) |

## 5. Değerlendirme

- **AI'ın hızlandırdığı yerler:** Figma'dan ekran ve içerik çıkarma, proje iskeleti, bileşenlerin ilk halleri, DNA algoritması, dokümantasyon.
- **Kontrolün bende kaldığı yerler:** Kapsam kararları (hangi varsayım, hangi sıra), test senaryoları, AI'ın bulduğu kök nedenleri doğrulama, tasarım uyumunun gözle kontrolü.
- **Öğrendiğim:** AI'ın ürettiği kod "çalışıyor gibi" görünse bile sürüme özgü API değişiklikleri (RN 0.86, React Compiler) ve test ortamındaki yan etkiler (CI modu, görünmeyen sekme) ancak düzenli tip kontrolü, lint ve gerçek akış testiyle yakalanabiliyor.

> _Not: Bu raporu teslimden önce kendi deneyimlerinle (kendi yazdığın promptlar, emülatörde bulduğun hatalar, harcadığın süre) güncelle._
