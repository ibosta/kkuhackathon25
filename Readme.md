# 🐾 E-Vet Veteriner Yönetim Sistemi

E-Vet, veteriner klinikleri için geliştirilmiş modern, hızlı ve kullanıcı dostu bir yönetim platformudur. Kliniklerin hasta, muayene, reçete, aşı, stok ve formlarını kolayca yönetmesini sağlar.  
Bu proje **kkuhackathon25** kapsamında geliştirilmiş ve başarıyla tamamlanmıştır.

---

## 🚀 Özellikler

- **Dashboard:** Klinik için kritik bilgiler tek ekranda (hızlı erişim, yaklaşan aşılar, randevular, son hastalar, reçeteler)
- **Hasta Yönetimi:** Detaylı hasta kartları, geçmiş muayene ve aşı bilgileri, hızlı arama ve filtreleme
- **Reçete Yönetimi:** Teşhise göre otomatik ilaç önerileri, tetkik ekleme, reçete geçmişi ve yazdırma
- **Muayene & Tohumlama:** Tüm işlemler detaylı ve filtrelenebilir şekilde listelenir
- **Form Sihirbazı:** Otomatik doldurulan onay formları ve biyopsi raporları, PDF benzeri önizleme
- **Stok & İlaç Yönetimi:** İlaç stok takibi, kritik stok uyarıları
- **Kullanıcı Dostu Arayüz:** Modern, sade ve mobil uyumlu tasarım
- **Docker ile Hızlı Kurulum:** Her ortamda aynı hız ve güvenilirlikte çalışır

---

## ⚡️ Kullanım Kolaylığı

- Tüm işlemler birkaç tıklama ile tamamlanabilir
- Arama ve filtreleme ile istenen bilgiye saniyeler içinde ulaşılır
- Otomatik doldurma ve öneri sistemleriyle zamandan tasarruf
- Mock verilerle demo/test imkanı

---

## 🐳 Docker ile Kurulum

Projeyi hızlıca başlatmak için Docker kullanabilirsiniz:

```bash
git clone https://github.com/kullaniciadi/e-vet.git
cd e-vet
docker-compose up --build
