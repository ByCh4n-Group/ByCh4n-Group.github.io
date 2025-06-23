---
layout: doc
title: "GitHub Kullanım Rehberi"
description: "ByCh4n Group projelerinde GitHub kullanımı"
category: "Araçlar"
icon: "fab fa-github"
lang: tr
order: 2
---

# GitHub Kullanım Rehberi

Bu rehber, ByCh4n Group projelerinde GitHub'ı etkili bir şekilde kullanmanız için hazırlanmıştır.

## GitHub Nedir?

GitHub, Git tabanlı versiyon kontrol sistemi sunan bir platformdur. Kodlarınızı paylaşabilir, işbirliği yapabilir ve projeleri yönetebilirsiniz.

## Temel Kavramlar

### Repository (Repo)
Projenizin kodlarının saklandığı dizin.

### Branch
Projenin farklı versiyonlarını geliştirdiğiniz dallar.

### Commit
Kodunuzdaki değişiklikleri kaydetme işlemi.

### Pull Request (PR)
Değişikliklerinizi ana branch'e birleştirme talebi.

### Issue
Hata raporları, özellik istekleri veya tartışmalar.

## Git Kurulumu

### Windows
1. [Git for Windows](https://gitforwindows.org/) indirin
2. İndirilen dosyayı çalıştırın
3. Varsayılan ayarlarla kurulumu tamamlayın

### macOS
```bash
# Homebrew ile
brew install git

# Xcode Command Line Tools ile
xcode-select --install
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install git
```

## Git Konfigürasyonu

```bash
# Kullanıcı adını ayarla
git config --global user.name "Your Name"

# E-posta adresini ayarla
git config --global user.email "your.email@example.com"

# Konfigürasyonu kontrol et
git config --list
```

## Temel Git Komutları

### Repository Clone Etme
```bash
git clone https://github.com/ByCh4n-Group/repository-name.git
cd repository-name
```

### Branch İşlemleri
```bash
# Yeni branch oluştur
git checkout -b feature/new-feature

# Branch'ler arası geçiş
git checkout main
git checkout feature/new-feature

# Branch listesi
git branch
```

### Değişiklikleri Kaydetme
```bash
# Değişiklikleri staging area'ya ekle
git add .
git add specific-file.txt

# Commit oluştur
git commit -m "Add new feature description"

# Değişiklikleri push et
git push origin feature/new-feature
```

### Güncel Kalma
```bash
# Uzak repository'den değişiklikleri çek
git pull origin main

# Değişiklikleri merge et
git merge origin/main
```

## ByCh4n Group Workflow

### 1. Repository Fork Etme
1. GitHub'da projeyi fork edin
2. Fork ettiğiniz repo'yu clone edin
3. Upstream remote ekleyin

```bash
git remote add upstream https://github.com/ByCh4n-Group/original-repo.git
```

### 2. Feature Branch Oluşturma
```bash
git checkout -b feature/your-feature-name
```

### 3. Geliştirme Yapma
- Kodunuzu yazın
- Test edin
- Commit'leyin

### 4. Pull Request Açma
1. GitHub'da "New Pull Request" butonuna tıklayın
2. Değişikliklerinizi açıklayın
3. İnceleme bekleyin

## Branch Naming Conventions

```
feature/feature-name    # Yeni özellik
bugfix/bug-description  # Hata düzeltme
hotfix/urgent-fix      # Acil düzeltme
docs/documentation     # Döküman güncellemesi
```

## Commit Message Kuralları

```
type(scope): description

# Örnekler
feat: add user authentication
fix: resolve login error
docs: update API documentation
style: format code with prettier
refactor: restructure user service
```

## Issue ve PR Templates

### Issue Template
```markdown
## Problem Açıklaması
[Problemi detaylı açıklayın]

## Beklenen Davranış
[Ne olmasını bekliyorsunuz?]

## Mevcut Davranış
[Şu anda ne oluyor?]

## Adımlar
1. [İlk adım]
2. [İkinci adım]
3. [Üçüncü adım]

## Ekran Görüntüleri
[Varsa ekran görüntüsü ekleyin]
```

### PR Template
```markdown
## Değişiklik Açıklaması
[Yaptığınız değişiklikleri açıklayın]

## Değişiklik Türü
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Test Edildi Mi?
- [ ] Evet
- [ ] Hayır

## Checklist
- [ ] Kod review yapıldı
- [ ] Testler yazıldı
- [ ] Döküman güncellendi
```

## Faydalı Git Tools

### Git GUI Clients
- **GitHub Desktop**: Başlangıç için ideal
- **SourceTree**: Gelişmiş özellikler
- **GitKraken**: Görsel interface

### VS Code Extensions
- **GitLens**: Git history ve blame
- **Git Graph**: Branch görselleştirme
- **GitHub Pull Requests**: PR yönetimi

## Best Practices

1. **Küçük ve sık commit'ler yapın**
2. **Açıklayıcı commit mesajları yazın**
3. **Feature branch'lerde çalışın**
4. **Code review sürecine katılın**
5. **Conflict'leri çözmek için rebase kullanın**

## Troubleshooting

### Merge Conflict Çözme
```bash
# Conflict'li dosyaları düzenle
# Conflict marker'ları (<<<<, ====, >>>>) temizle
git add .
git commit -m "Resolve merge conflict"
```

### Son Commit'i Geri Alma
```bash
# Soft reset (değişiklikler korunur)
git reset --soft HEAD~1

# Hard reset (değişiklikler silinir)
git reset --hard HEAD~1
```

GitHub kullanımında sorun yaşarsanız, Discord kanalımızdan yardım isteyebilirsiniz!
