---
layout: post
title: "Modern CSS ile Responsive Tasarım"
date: 2024-12-20 14:30:00 +0300
categories: [web-development, css]
tags: [css, responsive, flexbox, grid]
lang: tr
author: "ByCh4n Group"
excerpt: "CSS Grid, Flexbox ve modern CSS özelliklerini kullanarak responsive ve erişilebilir web tasarımları oluşturmayı öğrenin."
---

Modern web geliştirmede responsive tasarım artık bir zorunluluk haline geldi. Bu yazıda CSS Grid, Flexbox ve diğer modern CSS özelliklerini kullanarak etkili responsive tasarımlar oluşturmayı ele alacağız.

## CSS Grid vs Flexbox

### CSS Grid - İki Boyutlu Layout

CSS Grid, hem satır hem sütun bazında düzenleme yapmaya olanak tanır:

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.item {
  grid-column: span 2; /* 2 sütun kapla */
}
```

### Flexbox - Tek Boyutlu Layout

Flexbox, tek bir eksende (yatay veya dikey) düzenleme için idealdir:

```css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.flex-item {
  flex: 1 1 300px; /* grow shrink basis */
}
```

## Modern CSS Özellikleri

### CSS Custom Properties (Variables)

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --border-radius: 0.5rem;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.button {
  background: var(--primary-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}
```

### Container Queries

```css
@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
```

### Clamp() Fonksiyonu

```css
.title {
  font-size: clamp(1.5rem, 4vw, 3rem);
  /* min: 1.5rem, ideal: 4vw, max: 3rem */
}
```

## Responsive Breakpoints

```css
/* Mobile First Approach */
.container {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 3rem;
  }
}
```

## Performance İpuçları

1. **CSS Minimize**: Gereksiz kodları temizleyin
2. **Critical CSS**: Above-the-fold içerik için inline CSS
3. **CSS Containment**: `contain` özelliğini kullanın
4. **GPU Acceleration**: `transform` ve `opacity` kullanın

```css
.animated-element {
  will-change: transform;
  transform: translateZ(0); /* GPU layer'ına taşı */
}
```

Modern CSS ile sınırları zorlayan tasarımlar oluşturmaya başlayın!
