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

## What is Colima?

Colima is a free, open-source, lightweight container runtime for macOS and Linux. It provides a minimal setup for running Docker and containerd workloads on Apple Silicon and Intel Macs — without the licensing requirements, resource overhead, or system tray presence of Docker Desktop.

Under the hood, Colima uses [Lima](https://lima-vm.io/) to create a Linux virtual machine, inside which it runs Docker Engine or containerd. From your perspective, it just works — `docker`, `docker-compose`, and Kubernetes tooling all behave exactly as they would on a native Linux machine.

For teams that need a lightweight, scriptable, and cost-free container runtime for local development, Colima has become the preferred alternative to Docker Desktop.

## Why Use Colima?

- **Free and open-source** — no licensing fees or subscription tiers.
- **Lightweight** — minimal resource usage compared to Docker Desktop.
- **Fast startup** — VM starts in seconds with a simple `colima start`.
- **Apple Silicon native** — full support for ARM64 (M1/M2/M3) Macs.
- **Multiple runtimes** — supports Docker, containerd, and incus.
- **Kubernetes built-in** — start a local k3s cluster with a single flag.
- **Resource control** — explicitly set CPU, RAM, and disk for the VM.
- **Works with existing tools** — `docker`, `docker-compose`, `kubectl`, `helm` all work unchanged.

## Installation

```bash
# macOS (Homebrew) — install Colima and the Docker CLI
brew install colima docker docker-compose

# Linux (Homebrew on Linux)
brew install colima

# Or download a binary release from GitHub
# https://github.com/abiosoft/colima/releases

# Verify
colima version
```

On Linux, you may also need to install Docker Engine separately if you want to use the Docker runtime.

## Starting and Stopping Colima

```bash
# Start with default settings (2 CPU, 2GB RAM, 60GB disk)
colima start

# Start with custom resources
colima start --cpu 4 --memory 8 --disk 80

# Start with a specific profile (for running multiple VMs)
colima start --profile dev

# Stop Colima
colima stop

# Delete the VM (frees disk space)
colima delete

# Check status
colima status

# List all profiles
colima list
```

## Using Docker with Colima

Once Colima is running, the standard `docker` CLI works without any changes:

```bash
# Verify Docker is available
docker info
docker version

# Pull and run a container
docker run --rm hello-world

# Run a web server
docker run -d -p 8080:80 --name web nginx

# Build an image
docker build -t my-app:latest .

# Docker Compose works too
docker compose up -d
docker compose logs -f
docker compose down
```

### Configuring docker-compose as a Plugin

On macOS with Homebrew, enable docker-compose as a Docker CLI plugin:

```bash
mkdir -p ~/.docker/cli-plugins
ln -sfn $(brew --prefix)/opt/docker-compose/bin/docker-compose ~/.docker/cli-plugins/docker-compose

# Verify
docker compose version
```

## Running Multiple Profiles

Colima supports named profiles, making it easy to run separate VMs for different projects or runtime configurations:

```bash
# Start a Docker runtime for project A
colima start --profile project-a --cpu 2 --memory 4

# Start a containerd runtime for project B
colima start --profile project-b --runtime containerd

# Switch Docker context between profiles
docker context use colima-project-a
docker context use colima-project-b

# List all contexts
docker context ls
```

## Local Kubernetes with Colima

Colima can launch a lightweight k3s Kubernetes cluster, ideal for local testing of Helm charts, manifests, and microservice architectures:

```bash
# Start Colima with k3s enabled
colima start --kubernetes

# With specific resources for Kubernetes workloads
colima start --kubernetes --cpu 4 --memory 8

# Verify the cluster is running
kubectl get nodes
kubectl get pods --all-namespaces

# Deploy a sample application
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
kubectl get pods -o wide
kubectl port-forward deployment/nginx-deployment 8080:80
curl http://localhost:8080

# Stop the cluster (without deleting it)
colima stop
```

Your `~/.kube/config` is automatically updated when Colima starts with Kubernetes enabled, so `kubectl`, `helm`, and `k9s` work immediately.

## 💡 Tips & Tricks

### Tip 1: Set Resource Limits to Avoid Slowdowns

By default Colima uses 2 CPU cores and 2 GB RAM. Increase this for heavier workloads:

```bash
colima start --cpu 6 --memory 12 --disk 100
```

### Tip 2: Use SSH to Access the VM

```bash
colima ssh
# or:
colima ssh --profile my-profile
```

This opens an SSH session into the Linux VM — useful for debugging or inspecting the filesystem.

### Tip 3: Mount Additional Directories

By default, your home directory is mounted inside the VM. You can add extra mounts:

```bash
colima start --mount /opt/data:w
```

### Tip 4: Use containerd Instead of Docker

If you prefer to use `nerdctl` or `containerd` directly:

```bash
colima start --runtime containerd
nerdctl run --rm hello-world
```

### Tip 5: Configure with a YAML File

For reproducible setups, use `~/.colima/default/colima.yaml`:

```yaml
cpu: 4
memory: 8
disk: 80
runtime: docker
kubernetes:
  enabled: false
  version: v1.28.0+k3s1
```

### Tip 6: Rosetta for x86 Emulation on Apple Silicon

On Apple Silicon Macs, enable Rosetta for better x86 container compatibility:

```bash
colima start --arch x86_64 --vm-type=vz --vz-rosetta
```

## Advanced Applications

### Full Development Environment Script

Start a complete containerized development environment with one script:

```bash
#!/bin/bash
# start-dev.sh

colima start --cpu 4 --memory 8 --disk 80

# Wait for Docker to be ready
until docker info >/dev/null 2>&1; do sleep 1; done

# Start development services
docker compose -f docker-compose.dev.yml up -d

echo "Dev environment ready!"
echo "Services:"
docker compose -f docker-compose.dev.yml ps
```

## Comparing Colima to Docker Desktop

| Feature | Colima | Docker Desktop |
|---------|--------|---------------|
| Cost | Free | Free (personal) / Paid (business) |
| License | MIT | Proprietary |
| Resource Usage | Low | High |
| GUI Dashboard | No | Yes |
| Kubernetes | k3s (built-in) | Kind (built-in) |
| Apple Silicon | Native | Native |
| Extensions | No | Yes |
| Config File | YAML | GUI |

## Related Resources

- 📦 [Colima GitHub Repository](https://github.com/abiosoft/colima)
- 🔧 [Lima VM (underlying technology)](https://lima-vm.io/)
- 📖 [k3s Documentation](https://docs.k3s.io/)

## Related Tools

- `docker` — the container CLI that Colima powers on macOS.
- `kubectl` — Kubernetes CLI, works out of the box with Colima's k3s.
- `helm` — Kubernetes package manager; deploys to Colima's k3s cluster.
- `nerdctl` — containerd-native Docker-compatible CLI.

## Real-world Use Cases

- **Replacing Docker Desktop** — developers on macOS switch to Colima to avoid Docker Desktop's commercial licensing for large teams.
- **Local Kubernetes testing** — spin up a k3s cluster in seconds to validate Helm charts and Kubernetes manifests before pushing to a staging cluster.
- **Multi-profile isolation** — run a Docker environment for one project and a containerd environment for another, switching with `docker context`.
- **CI-like local builds** — mirror the Linux build environment exactly by running builds inside the Colima VM.
- **Resource-constrained laptops** — configure Colima with a tight CPU/RAM budget to avoid slowing down the host machine.

## When Not To Use Colima

- **Linux hosts** — on Linux you can run Docker Engine natively without any VM layer; Colima is not needed.
- **Production environments** — Colima is a local development tool; use managed container services (ECS, GKE, AKS) in production.
- **Windows** — Colima does not support Windows; use Docker Desktop or WSL2 with Docker Engine instead.
- **GUI dashboard** — if you need a visual container management UI, Docker Desktop's dashboard is more convenient.

---

## Practical Examples: Run Containers Locally with Colima

```bash
# 1. Start Colima and run a full docker-compose stack
colima start --cpu 4 --memory 8
until docker info >/dev/null 2>&1; do sleep 1; done
docker compose up -d
docker compose ps

# 2. Local Kubernetes smoke test before deploying to staging
colima start --kubernetes --cpu 4 --memory 8
kubectl apply -f k8s/
kubectl wait --for=condition=available deployment/myapp --timeout=60s
kubectl port-forward svc/myapp 8080:80 &
curl -s http://localhost:8080/health | jq .

# 3. Switch between two project environments
colima start --profile frontend --cpu 2 --memory 4
docker context use colima-frontend
docker compose -f frontend/docker-compose.yml up -d

colima start --profile backend --cpu 4 --memory 8
docker context use colima-backend
docker compose -f backend/docker-compose.yml up -d
```
