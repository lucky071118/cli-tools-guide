---
title: "nginx — High-Performance Web Server"
description: "nginx: static file serving, reverse proxy, load balancer, and HTTP caching. Useful as an edge server for static and dynamic apps."
category: web
tags: [nginx, web, server, reverse-proxy]
featured: false
installCommand: "sudo apt install nginx"
officialUrl: "https://nginx.org/"
related: [curl, docker]
pubDate: 2024-06-01
author: "CLI Tools Guide"
lastUpdated: 2024-06-01
---

# nginx — High-Performance Web Server

`nginx` is a versatile HTTP and reverse-proxy server used for serving static assets, reverse proxying to app servers, SSL termination, and caching.

## Basic Usage

```bash
# Start/stop
sudo systemctl start nginx
sudo systemctl enable nginx

# Test config
sudo nginx -t
```

## Practical Example: Set Up Reverse Proxying and Static Asset Caching

The following example shows a basic site configuration that proxies `/` to a backend application and enables long-term caching for `/assets/`:

```nginx
server {
  listen 80;
  server_name example.com;

  location /assets/ {
    root /var/www/html;
    expires 30d;
    add_header Cache-Control "public";
  }

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

Use `curl -I https://example.com/assets/app.js` to verify that the `Cache-Control` and `Expires` response headers are set as expected.

## Related Resources

- 📖 [nginx documentation](https://nginx.org/en/docs/)
