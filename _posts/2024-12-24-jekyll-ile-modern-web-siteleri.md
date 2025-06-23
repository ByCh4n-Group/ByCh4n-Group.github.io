---
layout: post
title: "Jekyll ile Modern Web Siteleri Oluşturma"
date: 2024-12-24 10:00:00 +0300
categories: [web-development, jekyll]
tags: [jekyll, github-pages, static-site]
lang: tr
author: "ByCh4n Group"
excerpt: "Jekyll kullanarak modern, hızlı ve SEO dostu web siteleri nasıl oluşturulur? Bu yazıda Jekyll'ın temellerinden başlayarak GitHub Pages'te deployment'a kadar her şeyi öğreneceksiniz."
---

Jekyll, statik site oluşturmak için kullanılan güçlü bir araçtır. GitHub Pages tarafından desteklenen Jekyll ile hızlı, güvenli ve SEO dostu web siteleri oluşturabilirsiniz.

## Jekyll Nedir?

Jekyll, Ruby programlama dili ile yazılmış bir statik site oluşturucusudur. Markdown dosyalarını HTML'e dönüştürerek modern web siteleri oluşturmanıza olanak tanır.

### Jekyll'ın Avantajları

- **Hız**: Statik dosyalar çok hızlı yüklenir
- **Güvenlik**: Veritabanı olmadığı için güvenlik açıkları minimal
- **SEO Dostu**: Temiz HTML çıktısı ve meta tag desteği
- **GitHub Pages**: Ücretsiz hosting
- **Markdown Desteği**: Kolay içerik yönetimi

## Kurulum

Jekyll'ı kurmak için önce Ruby'nin sisteminizde yüklü olması gerekir:

```bash
# Ruby kurulumu (Ubuntu/Debian)
sudo apt-get install ruby-full build-essential zlib1g-dev

# Jekyll kurulumu
gem install jekyll bundler

# Yeni site oluşturma
jekyll new my-site
cd my-site

# Siteyi çalıştırma
bundle exec jekyll serve
```

## Temel Yapı

Jekyll sitelerinin temel yapısı şu şekildedir:

```
my-site/
├── _config.yml      # Site konfigürasyonu
├── _layouts/        # Sayfa şablonları
├── _includes/       # Parçacık dosyalar
├── _posts/          # Blog yazıları
├── _sass/           # SASS dosyaları
├── assets/          # CSS, JS, resim dosyaları
└── index.html       # Ana sayfa
```

## Front Matter

Jekyll'da her dosya Front Matter ile başlar:

```yaml
---
layout: post
title: "Yazı Başlığı"
date: 2024-12-24
categories: [kategori1, kategori2]
tags: [tag1, tag2]
---
```

## Liquid Template Engine

Jekyll, Liquid template engine kullanır:

```liquid
<!-- Değişken kullanımı -->
{{ site.title }}
{{ page.title }}

<!-- Koşullu ifadeler -->
{% if page.image %}
  <img src="{{ page.image }}" alt="{{ page.title }}">
{% endif %}

<!-- Döngüler -->
{% for post in site.posts %}
  <h2>{{ post.title }}</h2>
{% endfor %}
```

## GitHub Pages ile Deployment

GitHub Pages Jekyll'ı otomatik olarak destekler:

1. GitHub'da repository oluşturun
2. Jekyll dosyalarınızı push edin
3. Repository ayarlarından Pages'i etkinleştirin
4. Siteniz `username.github.io/repository-name` adresinde yayınlanır

## İpuçları

- `_config.yml` dosyasını her değiştirdiğinizde sunucuyu yeniden başlatın
- Performans için `jekyll-paginate` plugin'ini kullanın
- SEO için `jekyll-seo-tag` plugin'ini ekleyin
- Syntax highlighting için `rouge` kullanın

Jekyll ile web geliştirme serüveninize başlamaya hazır mısınız? Sorularınızı yorumlarda paylaşabilirsiniz!
