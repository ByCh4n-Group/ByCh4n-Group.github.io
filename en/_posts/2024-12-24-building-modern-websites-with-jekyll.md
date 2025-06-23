---
layout: post
title: "Building Modern Websites with Jekyll"
date: 2024-12-24 10:00:00 +0300
categories: [web-development, jekyll]
tags: [jekyll, github-pages, static-site]
lang: en
author: "ByCh4n Group"
excerpt: "Learn how to create modern, fast, and SEO-friendly websites using Jekyll. From Jekyll basics to deployment on GitHub Pages, we'll cover everything you need to know."
---

Jekyll is a powerful tool for creating static websites. With Jekyll, supported by GitHub Pages, you can build fast, secure, and SEO-friendly websites.

## What is Jekyll?

Jekyll is a static site generator written in the Ruby programming language. It converts Markdown files to HTML, allowing you to create modern websites.

### Advantages of Jekyll

- **Speed**: Static files load very quickly
- **Security**: Minimal security vulnerabilities due to no database
- **SEO Friendly**: Clean HTML output and meta tag support
- **GitHub Pages**: Free hosting
- **Markdown Support**: Easy content management

## Installation

To install Jekyll, you first need Ruby installed on your system:

```bash
# Ruby installation (Ubuntu/Debian)
sudo apt-get install ruby-full build-essential zlib1g-dev

# Jekyll installation
gem install jekyll bundler

# Create new site
jekyll new my-site
cd my-site

# Run the site
bundle exec jekyll serve
```

## Basic Structure

The basic structure of Jekyll sites is as follows:

```
my-site/
├── _config.yml      # Site configuration
├── _layouts/        # Page templates
├── _includes/       # Partial files
├── _posts/          # Blog posts
├── _sass/           # SASS files
├── assets/          # CSS, JS, image files
└── index.html       # Homepage
```

## Front Matter

Every file in Jekyll starts with Front Matter:

```yaml
---
layout: post
title: "Post Title"
date: 2024-12-24
categories: [category1, category2]
tags: [tag1, tag2]
---
```

## Liquid Template Engine

Jekyll uses the Liquid template engine:

```liquid
<!-- Variable usage -->
{{ site.title }}
{{ page.title }}

<!-- Conditional statements -->
{% if page.image %}
  <img src="{{ page.image }}" alt="{{ page.title }}">
{% endif %}

<!-- Loops -->
{% for post in site.posts %}
  <h2>{{ post.title }}</h2>
{% endfor %}
```

## Deployment with GitHub Pages

GitHub Pages automatically supports Jekyll:

1. Create a repository on GitHub
2. Push your Jekyll files
3. Enable Pages from repository settings
4. Your site will be published at `username.github.io/repository-name`

## Tips

- Restart the server every time you change `_config.yml`
- Use `jekyll-paginate` plugin for performance
- Add `jekyll-seo-tag` plugin for SEO
- Use `rouge` for syntax highlighting

Ready to start your web development journey with Jekyll? Feel free to share your questions in the comments!
