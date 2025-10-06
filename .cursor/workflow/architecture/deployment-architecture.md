# Deployment Architecture

## Overview
This document describes the deployment architecture for the Diet Planner Game application, covering development, staging, and production environments with containerization and CI/CD pipelines.

## Deployment Strategy

### 1. Multi-Environment Approach
```
Development → Staging → Production
     ↓           ↓         ↓
   Local      Testing   Live Users
```

### 2. Infrastructure as Code
- Docker containerization
- Kubernetes orchestration
- Terraform for infrastructure
- Helm charts for application deployment

## Container Architecture

### 1. Docker Configuration
```dockerfile
# Multi-stage build for production optimization
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

# Copy service worker and manifest
COPY public/sw.js /usr/share/nginx/html/
COPY public/manifest.json /usr/share/nginx/html/

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Docker Compose for Development
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=development
      - FIREBASE_API_KEY=${FIREBASE_API_KEY}
      - FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
      - FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
    volumes:
      - ./src:/app/src:ro
      - ./public:/app/public:ro
    depends_on:
      - firebase-emulator
    networks:
      - app-network

  firebase-emulator:
    image: gcr.io/google.com/cloudsdktool/cloud-sdk:emulators
    ports:
      - "4000:4000"  # Firebase Auth
      - "8080:8080"  # Firestore
    command: >
      gcloud beta emulators firestore start
      --host-port=0.0.0.0:8080
      --project=diet-planner-demo
    environment:
      - FIRESTORE_EMULATOR_HOST=0.0.0.0:8080
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  app-data:
    driver: local
```

## Kubernetes Deployment

### 1. Namespace Configuration
```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: diet-planner-game
  labels:
    name: diet-planner-game
    environment: production
```

### 2. ConfigMap for Environment Variables
```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: diet-planner-config
  namespace: diet-planner-game
data:
  NODE_ENV: "production"
  FIREBASE_API_KEY: "your-firebase-api-key"
  FIREBASE_AUTH_DOMAIN: "your-project.firebaseapp.com"
  FIREBASE_PROJECT_ID: "your-project-id"
  FIREBASE_STORAGE_BUCKET: "your-project.appspot.com"
  FIREBASE_MESSAGING_SENDER_ID: "123456789"
  FIREBASE_APP_ID: "your-app-id"
  API_BASE_URL: "https://api.diet-planner-game.com"
  SENTRY_DSN: "your-sentry-dsn"
```

### 3. Deployment Configuration
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: diet-planner-app
  namespace: diet-planner-game
  labels:
    app: diet-planner-app
    version: v1.0.0
spec:
  replicas: 3
  selector:
    matchLabels:
      app: diet-planner-app
  template:
    metadata:
      labels:
        app: diet-planner-app
        version: v1.0.0
    spec:
      containers:
      - name: diet-planner-app
        image: diet-planner-game:latest
        ports:
        - containerPort: 80
        envFrom:
        - configMapRef:
            name: diet-planner-config
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: app-data
          mountPath: /usr/share/nginx/html/data
      volumes:
      - name: app-data
        persistentVolumeClaim:
          claimName: diet-planner-pvc
```

### 4. Service Configuration
```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: diet-planner-service
  namespace: diet-planner-game
  labels:
    app: diet-planner-app
spec:
  selector:
    app: diet-planner-app
  ports:
  - name: http
    port: 80
    targetPort: 80
    protocol: TCP
  type: ClusterIP
```

### 5. Ingress Configuration
```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: diet-planner-ingress
  namespace: diet-planner-game
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - diet-planner-game.com
    - www.diet-planner-game.com
    secretName: diet-planner-tls
  rules:
  - host: diet-planner-game.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: diet-planner-service
            port:
              number: 80
  - host: www.diet-planner-game.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: diet-planner-service
            port:
              number: 80
```

## CI/CD Pipeline

### 1. GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy Diet Planner Game

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run tests
      run: npm run test
    
    - name: Run build
      run: npm run build

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy-staging:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
    - name: Deploy to Staging
      uses: azure/k8s-deploy@v1
      with:
        manifests: |
          k8s/staging/namespace.yaml
          k8s/staging/configmap.yaml
          k8s/staging/deployment.yaml
          k8s/staging/service.yaml
          k8s/staging/ingress.yaml
        images: |
          ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
        kubeconfig: ${{ secrets.KUBE_CONFIG_STAGING }}

  deploy-production:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Deploy to Production
      uses: azure/k8s-deploy@v1
      with:
        manifests: |
          k8s/production/namespace.yaml
          k8s/production/configmap.yaml
          k8s/production/deployment.yaml
          k8s/production/service.yaml
          k8s/production/ingress.yaml
        images: |
          ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
        kubeconfig: ${{ secrets.KUBE_CONFIG_PRODUCTION }}
```

### 2. Helm Chart Structure
```
helm/
├── Chart.yaml
├── values.yaml
├── values-staging.yaml
├── values-production.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    ├── configmap.yaml
    ├── secret.yaml
    └── hpa.yaml
```

### 3. Helm Chart Values
```yaml
# values.yaml
replicaCount: 3

image:
  repository: ghcr.io/your-org/diet-planner-game
  pullPolicy: IfNotPresent
  tag: "latest"

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
  hosts:
    - host: diet-planner-game.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: diet-planner-tls
      hosts:
        - diet-planner-game.com

resources:
  limits:
    cpu: 200m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

nodeSelector: {}

tolerations: []

affinity: {}
```

## Environment Configuration

### 1. Development Environment
```bash
# .env.development
NODE_ENV=development
VITE_FIREBASE_API_KEY=demo-api-key
VITE_FIREBASE_AUTH_DOMAIN=demo-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=demo-project
VITE_FIREBASE_STORAGE_BUCKET=demo-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=demo-app-id
VITE_API_BASE_URL=http://localhost:3001
VITE_SENTRY_DSN=your-sentry-dsn
```

### 2. Staging Environment
```bash
# .env.staging
NODE_ENV=staging
VITE_FIREBASE_API_KEY=staging-api-key
VITE_FIREBASE_AUTH_DOMAIN=staging-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=staging-project
VITE_FIREBASE_STORAGE_BUCKET=staging-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=staging-app-id
VITE_API_BASE_URL=https://staging-api.diet-planner-game.com
VITE_SENTRY_DSN=your-staging-sentry-dsn
```

### 3. Production Environment
```bash
# .env.production
NODE_ENV=production
VITE_FIREBASE_API_KEY=production-api-key
VITE_FIREBASE_AUTH_DOMAIN=production-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=production-project
VITE_FIREBASE_STORAGE_BUCKET=production-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=production-app-id
VITE_API_BASE_URL=https://api.diet-planner-game.com
VITE_SENTRY_DSN=your-production-sentry-dsn
```

## Monitoring & Observability

### 1. Application Monitoring
```yaml
# monitoring.yaml
apiVersion: v1
kind: ServiceMonitor
metadata:
  name: diet-planner-monitor
  namespace: diet-planner-game
spec:
  selector:
    matchLabels:
      app: diet-planner-app
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
```

### 2. Logging Configuration
```yaml
# fluentd-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
  namespace: diet-planner-game
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/diet-planner-*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      format json
      time_key time
      time_format %Y-%m-%dT%H:%M:%S.%NZ
    </source>
    
    <match kubernetes.**>
      @type elasticsearch
      host elasticsearch.logging.svc.cluster.local
      port 9200
      index_name diet-planner-logs
      type_name _doc
    </match>
```

### 3. Health Checks
```typescript
// health-check.ts
import express from 'express';

const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version
  });
});

// Readiness check endpoint
app.get('/ready', async (req, res) => {
  try {
    // Check database connectivity
    await checkDatabaseConnection();
    
    // Check external services
    await checkExternalServices();
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

async function checkDatabaseConnection() {
  // Check Firebase connection
  // Implementation depends on your Firebase setup
}

async function checkExternalServices() {
  // Check AI API connectivity
  // Check other external dependencies
}

export default app;
```

## Backup & Disaster Recovery

### 1. Data Backup Strategy
```yaml
# backup-cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: firestore-backup
  namespace: diet-planner-game
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: gcr.io/google.com/cloudsdktool/cloud-sdk:alpine
            command:
            - /bin/sh
            - -c
            - |
              gcloud firestore export gs://diet-planner-backups/$(date +%Y%m%d) \
                --project=diet-planner-game
            env:
            - name: GOOGLE_APPLICATION_CREDENTIALS
              value: /etc/credentials/service-account.json
            volumeMounts:
            - name: credentials
              mountPath: /etc/credentials
              readOnly: true
          volumes:
          - name: credentials
            secret:
              secretName: firebase-service-account
          restartPolicy: OnFailure
```

### 2. Disaster Recovery Plan
```yaml
# disaster-recovery.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: disaster-recovery-plan
  namespace: diet-planner-game
data:
  plan.md: |
    # Disaster Recovery Plan
    
    ## RTO (Recovery Time Objective): 4 hours
    ## RPO (Recovery Point Objective): 1 hour
    
    ## Recovery Steps:
    1. Assess the scope of the disaster
    2. Activate backup infrastructure
    3. Restore data from latest backup
    4. Deploy application to backup cluster
    5. Update DNS to point to backup
    6. Verify application functionality
    7. Monitor system stability
    
    ## Contact Information:
    - On-call Engineer: +1-xxx-xxx-xxxx
    - DevOps Team: devops@company.com
    - Management: management@company.com
```

## Security in Deployment

### 1. Network Policies
```yaml
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: diet-planner-network-policy
  namespace: diet-planner-game
spec:
  podSelector:
    matchLabels:
      app: diet-planner-app
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 80
  egress:
  - to: []
    ports:
    - protocol: TCP
      port: 443  # HTTPS
    - protocol: TCP
      port: 80   # HTTP
```

### 2. Pod Security Policy
```yaml
# pod-security-policy.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: diet-planner-psp
  namespace: diet-planner-game
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
```

This deployment architecture provides a robust, scalable, and secure foundation for deploying the Diet Planner Game application across different environments while maintaining high availability and performance.
