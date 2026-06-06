---
title: "colima — Containers on macOS and Linux"
description: "Run container runtimes on macOS and Linux with Colima (lightweight alternative to Docker Desktop)."
category: containers
tags: [colima, docker, containers]
featured: false
installCommand: "brew install colima"
officialUrl: "https://github.com/abiosoft/colima"
related: [docker, k8s]
pubDate: 2024-06-01
author: "CLI Tools Guide"
lastUpdated: 2024-06-01
---

# colima — Containers on macOS and Linux

Colima provides a lightweight VM and container runtime for macOS and Linux. It's often used as a Docker Desktop replacement for local development.

## Installation

```bash
# macOS
brew install colima
colima start

# Linux (Homebrew on Linux or package manager)
```

## Basic Usage

```bash
# Start Colima with Docker runtime
colima start --cpu 4 --memory 4

# Use docker as usual
docker run --rm hello-world

# Stop Colima
colima stop
```

## Practical Example: Local Kubernetes with Colima + k3s

Colima can start k3s for simple local Kubernetes clusters suitable for testing:

```bash
colima start --k3s
kubectl get nodes

# Deploy a sample app
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
kubectl get pods -o wide
```

這個本地叢集對於快速驗證 Helm charts、CI 前的 smoke tests 非常方便，且啟動速度通常比虛擬化更快。

## Related Resources

- 📦 [Colima GitHub](https://github.com/abiosoft/colima)
