# TravelTrucks - Karavan Kiralama Platformu

Modern ve kullanıcı dostu bir karavan kiralama platformu. React, Redux Toolkit ve Vite ile geliştirilmiştir.

## 🚐 Proje Hakkında

TravelTrucks, kullanıcıların ihtiyaçlarına uygun karavanları kolayca bulabilecekleri, filtreleyebilecekleri ve rezervasyon yapabilecekleri bir web uygulamasıdır.

## ✨ Temel Özellikler

- 🔍 **Gelişmiş Filtreleme Sistemi**: Lokasyon, araç tipi, donanım ve transmisyon türüne göre filtreleme
- 💝 **Favori Sistemi**: Beğendiğiniz karavanları favorilere ekleme
- 📱 **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- 🎨 **Modern UI/UX**: Figma tasarımına sadık, kullanıcı dostu arayüz
- ⚡ **Hızlı Performans**: Vite ile optimize edilmiş build sistemi
- 🔄 **Redux State Management**: Merkezi ve öngörülebilir state yönetimi
- 📅 **Interaktif Takvim**: Rezervasyon tarihi seçimi için özel takvim
- ⭐ **Değerlendirme Sistemi**: Kullanıcı yorumları ve puanlama
- 🔔 **Toast Bildirimleri**: Kullanıcı aksiyonları için anında geri bildirim

## 🛠️ Kullanılan Teknolojiler

- **React 18** - UI geliştirme
- **Redux Toolkit** - State yönetimi
- **React Router DOM** - Sayfa yönlendirme
- **Axios** - HTTP istekleri
- **Vite** - Build tool
- **React Hot Toast** - Bildirimler
- **CSS Modules** - Styling

## 📦 Kurulum

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/kullaniciadi/travel-trucks.git
cd travel-trucks
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

4. **Tarayıcıda açın:**
```
http://localhost:5173
```

## 🚀 Production Build
```bash
npm run build
npm run preview
```

## 📁 Proje Yapısı
```
travel-trucks/
├── public/
│   └── hero-bg.jpg
├── src/
│   ├── api/
│   │   └── campers.js          # API istekleri
│   ├── app/
│   │   └── store.js             # Redux store
│   ├── assets/
│   │   ├── icons/
│   │   │   └── symbol-defs.svg  # SVG sprite
│   │   └── images/
│   ├── components/
│   │   ├── Header/
│   │   │   └── Header.jsx
│   │   └── Icon/
│   │       └── Icon.jsx
│   ├── features/
│   │   ├── campers/
│   │   │   └── campersSlice.js
│   │   ├── favorites/
│   │   │   └── favoritesSlice.js
│   │   └── filters/
│   │       └── filtersSlice.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CatalogPage.jsx
│   │   └── CamperDetailsPage.jsx
│   ├── App.jsx
│   └── main.jsx
├── vercel.json                  # Vercel yapılandırması
├── package.json
├── README.md                    # English documentation
└── README.tr.md                 # Türkçe dokümantasyon
```

## 🔧 Yapılandırma

**API Endpoint:**
```javascript
// src/api/campers.js
baseURL: "https://66b1f8e71ca8ad33d4f5f63e.mockapi.io"
```

## 💡 Kullanım

1. **Ana Sayfa**: Hero banner ile başlayın, "View Now" butonu ile kataloğa gidin
2. **Katalog**: Sol taraftaki filtrelerle karavanları arayın
3. **Detay Sayfası**: "Show more" ile karavan detaylarını görün
4. **Rezervasyon**: Sağdaki formu doldurun ve tarih seçin
5. **Favoriler**: Kalp ikonuna tıklayarak favorilere ekleyin

## 🎯 Özellik Detayları

### Filtreleme Sistemi
- **Lokasyon**: Şehir veya ülke bazlı arama
- **Araç Tipi**: Van, Fully Integrated, Alcove
- **Transmisyon**: Automatic
- **Donanım**: AC, Kitchen, TV, Bathroom vb.

### Loading Indicators
- API istekleri sırasında loading state
- Skeleton screen'ler
- Disabled butonlar yüklenme sırasında

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🐛 Bilinen Sorunlar

- ~~404 hatası (Vercel routing)~~ ✅ Çözüldü

## 🔜 Gelecek Özellikler

- [ ] Kullanıcı kimlik doğrulama
- [ ] Ödeme sistemi entegrasyonu
- [ ] Gelişmiş arama filtreleri
- [ ] Kullanıcı dashboard'u
- [ ] Email bildirimleri

## 📝 Lisans

MIT License - Bu projeyi özgürce kullanabilirsiniz.

## 👨‍💻 Geliştirici

**[Adın Soyadın]**
- GitHub: [@kullaniciadin]
- Email: email@example.com
- LinkedIn: [linkedin.com/in/kullaniciadin]

## 🙏 Teşekkürler

- [MockAPI.io](https://mockapi.io) - API servisi
- [Unsplash](https://unsplash.com) - Görseller
- [Figma Community](https://www.figma.com) - Tasarım

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

## 🌐 Dil / Language

- [English](./README.md)
- [Türkçe](./README.tr.md)