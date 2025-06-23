# ByCh4n Group - Official Website

> "We Learn Together" - Birlikte Öğreniyoruz

ByCh4n Group'un resmi web sitesi. Jekyll ile oluşturulmuş, modern ve responsive tasarımıyla GitHub Pages üzerinde barındırılmaktadır.

## 🌟 Özellikler

- **Çok Dilli Destek**: Türkçe ve İngilizce
- **Modern Tasarım**: Responsive ve mobile-first yaklaşım
- **Blog Sistemi**: Teknik yazılar ve öğreticiler
- **Döküman Sistemi**: API rehberleri ve teknik dökümanlar
- **Proje Vitrini**: Açık kaynak projelerimiz
- **SEO Optimizasyonu**: Arama motorları için optimize edilmiş
- **Hızlı Yükleme**: Statik site avantajları

## 🚀 Teknoloji Stack

- **Jekyll** - Static site generator
- **Liquid** - Template engine
- **SCSS** - CSS preprocessing
- **JavaScript** - Interactive features
- **GitHub Pages** - Hosting
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## 📁 Proje Yapısı

```
.
├── _config.yml              # Jekyll konfigürasyonu
├── _layouts/                # Sayfa şablonları
│   ├── default.html
│   ├── home.html
│   ├── post.html
│   └── doc.html
├── _posts/                  # Blog yazıları (Türkçe)
├── en/_posts/               # Blog yazıları (İngilizce)
├── _docs/                   # Dökümanlar (Türkçe)
├── en/_docs/                # Dökümanlar (İngilizce)
├── assets/                  # CSS, JS ve medya dosyaları
│   ├── css/
│   └── js/
├── blog/                    # Blog sayfaları
├── docs/                    # Döküman sayfaları
├── projects/                # Projeler sayfası
├── contact/                 # İletişim sayfası
└── en/                      # İngilizce sayfalar
```

## 🛠️ Yerel Geliştirme

### Gereksinimler

- Ruby (2.7+)
- Bundler
- Git

### Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/ByCh4n-Group/ByCh4n-Group.github.io.git
cd ByCh4n-Group.github.io

# Bağımlılıkları yükleyin
bundle install

# Geliştirme sunucusunu başlatın
bundle exec jekyll serve

# Tarayıcınızda http://localhost:4000 adresini açın
```

### Geliştirme Komutları

```bash
# Site oluştur
bundle exec jekyll build

# Taslak yazıları da dahil ederek serve et
bundle exec jekyll serve --drafts

# Production build
JEKYLL_ENV=production bundle exec jekyll build
```

## ✍️ İçerik Ekleme

### Blog Yazısı Ekleme

Türkçe yazı için `_posts/` klasörüne:

```markdown
---
layout: post
title: "Yazı Başlığı"
date: 2024-12-24 10:00:00 +0300
categories: [kategori]
tags: [tag1, tag2]
lang: tr
author: "Yazar Adı"
excerpt: "Yazı özeti"
---

Yazı içeriği...
```

İngilizce yazı için `en/_posts/` klasörüne:

```markdown
---
layout: post
title: "Article Title"
date: 2024-12-24 10:00:00 +0300
categories: [category]
tags: [tag1, tag2]
lang: en
author: "Author Name"
excerpt: "Article excerpt"
---

Article content...
```

### Döküman Ekleme

Türkçe döküman için `_docs/` klasörüne:

```markdown
---
layout: doc
title: "Döküman Başlığı"
description: "Döküman açıklaması"
category: "Kategori"
icon: "fas fa-icon"
lang: tr
order: 1
---

Döküman içeriği...
```

## 🎨 Tasarım Sistemi

### Renkler

```css
--primary-color: #667eea;
--secondary-color: #764ba2;
--accent-color: #f093fb;
--text-color: #2d3748;
--text-light: #718096;
```

### Tipografi

- **Ana Font**: Inter
- **Kod Font**: Fira Code (syntax highlighting için)

### Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🌐 Çeviri Sistemi

Site Türkçe ve İngilizce olmak üzere iki dili destekler:

- Türkçe içerik ana dizinde
- İngilizce içerik `en/` dizininde
- Navigation menüsü dil bazında konfigüre edilebilir
- Dil değiştirici navbar'da mevcut

## 📝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Commit Mesaj Kuralları

```
type(scope): description

# Örnekler:
feat: add new blog post layout
fix: resolve navigation mobile issue
docs: update installation guide
style: improve button design
```

## 📜 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👥 Takım

- **ByCh4n Group** - Web geliştirme ve topluluk yönetimi

## 📞 İletişim

- **Website**: [https://bych4n-group.github.io](https://bych4n-group.github.io)
- **Discord**: [Sunucumuza katılın](#)
- **GitHub**: [@ByCh4n-Group](https://github.com/ByCh4n-Group)

## 🙏 Teşekkürler

- Jekyll ve GitHub Pages ekibine
- Açık kaynak topluluğuna
- Tüm katkıda bulunan geliştiricilere

---

⭐ Bu repository'yi beğendiyseniz yıldız vermeyi unutmayın!
ByCh4n-Group web page
