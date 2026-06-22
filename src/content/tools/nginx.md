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

## What is nginx?

`nginx` (pronounced "engine-x") is one of the world's most widely deployed web servers and reverse proxies. Originally developed to solve the C10K problem — handling 10,000 concurrent connections — nginx uses an event-driven, non-blocking architecture that delivers exceptional throughput with minimal memory usage.

Today, nginx powers a significant portion of the internet's busiest websites. It excels at serving static files, acting as a reverse proxy in front of application servers, terminating TLS, load balancing across backend nodes, and caching HTTP responses. It is a fundamental component of the modern web infrastructure stack.

## Why Use nginx?

- **High performance** — handles tens of thousands of concurrent connections efficiently.
- **Low memory footprint** — a single nginx worker process can handle thousands of connections.
- **Versatile** — web server, reverse proxy, load balancer, mail proxy, and HTTP cache in one binary.
- **Battle-tested** — used by Cloudflare, Netflix, GitHub, WordPress.com, and many more.
- **Easy configuration** — clean, readable configuration file format.
- **Active community** — extensive documentation, modules, and community support.
- **Docker-friendly** — the official `nginx` Docker image is one of the most pulled images on Docker Hub.

## Installation

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install nginx

# Fedora / RHEL / CentOS
sudo dnf install nginx

# Arch Linux
sudo pacman -S nginx

# macOS (Homebrew)
brew install nginx

# Alpine Linux (containers)
apk add nginx

# Start and enable on boot
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx

# Verify installation
nginx -v
```

## Basic Usage

```bash
# Start nginx
sudo systemctl start nginx

# Stop nginx
sudo systemctl stop nginx

# Reload configuration without downtime
sudo systemctl reload nginx
# or:
sudo nginx -s reload

# Test configuration syntax before applying
sudo nginx -t

# View the main configuration file
cat /etc/nginx/nginx.conf

# View available site configurations (Debian/Ubuntu)
ls /etc/nginx/sites-available/
ls /etc/nginx/sites-enabled/
```

## Configuration File Structure

nginx configuration is built from hierarchical blocks:

```nginx
# /etc/nginx/nginx.conf

user www-data;
worker_processes auto;  # one per CPU core
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    tcp_nopush      on;
    keepalive_timeout 65;

    gzip on;
    gzip_types text/plain application/json application/javascript text/css;

    include /etc/nginx/sites-enabled/*;
}
```

## Serving Static Files

The most basic nginx use case is serving static HTML, CSS, JavaScript, and image files:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Serve a custom 404 page
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
```

## Reverse Proxy Configuration

nginx shines as a reverse proxy in front of Node.js, Python (Gunicorn), Ruby (Puma), Go, or any other HTTP application server:

```nginx
upstream app_server {
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;  # second instance for load balancing
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://app_server;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## TLS / HTTPS with Let's Encrypt

Use Certbot to automatically obtain and configure TLS certificates:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain a certificate and configure nginx automatically
sudo certbot --nginx -d example.com -d www.example.com

# Certificates auto-renew via a cron job or systemd timer
sudo certbot renew --dry-run
```

Or configure TLS manually:

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=63072000" always;

    root /var/www/html;
    index index.html;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}
```

## Static Asset Caching

Long-lived caching for versioned assets dramatically improves page load performance:

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html;

    # Long-term cache for hashed/versioned assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|woff2|woff|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # No cache for HTML (always serve fresh)
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store";
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
```

## Load Balancing

nginx supports multiple load balancing strategies:

```nginx
upstream backend {
    # Default: round-robin
    server backend1.example.com weight=3;
    server backend2.example.com weight=1;
    server backend3.example.com backup;  # only used when others fail

    # Alternative: least connections
    # least_conn;

    # Alternative: IP hash (sticky sessions)
    # ip_hash;

    keepalive 32;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

## 💡 Tips & Tricks

### Tip 1: Always Test Before Reloading

```bash
sudo nginx -t && sudo nginx -s reload
```

### Tip 2: Rate Limiting to Prevent Abuse

```nginx
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    server {
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://localhost:8080;
        }
    }
}
```

### Tip 3: Enable gzip Compression

```nginx
http {
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        application/json
        application/javascript
        text/xml
        application/xml
        image/svg+xml;
}
```

### Tip 4: Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

### Tip 5: Check and Tail nginx Logs

```bash
# Error log
sudo tail -f /var/log/nginx/error.log

# Access log
sudo tail -f /var/log/nginx/access.log

# Filter for 5xx errors
sudo tail -f /var/log/nginx/access.log | grep '" 5'
```

### Tip 6: Use `include` for Cleaner Configuration

Split your config into reusable snippets:

```nginx
# /etc/nginx/snippets/proxy-params.conf
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

# In your server block:
location / {
    proxy_pass http://app;
    include /etc/nginx/snippets/proxy-params.conf;
}
```

## Advanced Applications

### Reverse Proxy with Static Assets and Caching

```nginx
server {
    listen 80;
    server_name example.com;

    location /assets/ {
        root /var/www/html;
        expires 30d;
        add_header Cache-Control "public";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Test the caching headers with `curl`:

```bash
curl -I https://example.com/assets/app.js
# Look for: Cache-Control: public, Expires: ...
```

## Related Resources

- 📖 [nginx Official Documentation](https://nginx.org/en/docs/)
- 🔧 [nginx Configuration Generator](https://www.digitalocean.com/community/tools/nginx)
- 📘 [nginx Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)

## Related Tools

- `curl` — test nginx endpoints and inspect response headers.
- `certbot` — automate TLS certificate provisioning with Let's Encrypt.
- `docker` — run nginx as a container for local development or production.

## Real-world Use Cases

- **Static site hosting** — serve HTML, CSS, JS, and images for Astro, Next.js, or Hugo sites directly from the filesystem.
- **API reverse proxy** — sit in front of Node.js, Python, or Go app servers, handling TLS, compression, and load balancing.
- **Microservice gateway** — route traffic to multiple backend services based on URL prefix (`/api/users`, `/api/orders`).
- **SSL termination** — decrypt HTTPS at the nginx level and forward plain HTTP to internal app servers on localhost.
- **CDN-like edge caching** — cache API and asset responses at the nginx level to reduce backend load.

## When Not To Use nginx

- **Development server** — use `npm run dev`, `vite`, or framework-native dev servers during development; nginx is for production.
- **Complex routing logic** — if routes need dynamic application logic, put that logic in the app layer and use nginx as a dumb proxy.
- **Very small projects** — for a single-process app on a small VPS, nginx adds complexity; consider Caddy for simpler automatic HTTPS.
- **Kubernetes ingress** — inside Kubernetes, use an Ingress controller (nginx Ingress, Traefik, or Istio) rather than managing nginx config files manually.

---

## Practical Examples: Configure nginx for Production Traffic

```bash
# 1. Quickly test a new nginx config before applying
sudo nginx -t && echo "Config OK" && sudo nginx -s reload

# 2. Tail access logs and filter for errors only
sudo tail -f /var/log/nginx/access.log | grep '" [45]'

# 3. Benchmark your nginx setup with ab (Apache Bench)
ab -n 1000 -c 50 https://example.com/

# 4. Generate a self-signed certificate for local development
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/nginx.key \
  -out /etc/nginx/ssl/nginx.crt \
  -subj "/CN=localhost"

# 5. Check which config file nginx is using
sudo nginx -T | head -20
```
