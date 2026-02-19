# GitHub Actions CI/CD Setup Guide
## Automated Deployment untuk Website Masjid Nurul Jannah

> **Target:** Push ke GitHub → Otomatis deploy ke server
> **Setup Time:** ~1 jam
> **Benefit:** No more manual SSH, no more deploy.sh errors!

---

## 📋 PREREQUISITES

Sebelum mulai, pastikan kamu punya:
- [x] Repository GitHub yang sudah connected
- [x] Akses SSH ke server
- [x] Server sudah running (PM2, Nginx, database)
- [x] SSH key pair (public & private key)

---

## 🔧 PART 1: PREPARE SERVER

### Step 1.1: Setup SSH Key untuk GitHub Actions

```bash
# Di LOCAL (Mac kamu)
# Generate SSH key baru khusus untuk GitHub Actions
ssh-keygen -t ed25519 -C "github-actions@nuruljannah" -f ~/.ssh/nuruljannah_deploy

# Output:
# ~/.ssh/nuruljannah_deploy (private key)
# ~/.ssh/nuruljannah_deploy.pub (public key)
```

### Step 1.2: Copy Public Key ke Server

```bash
# Di LOCAL
# Copy public key
cat ~/.ssh/nuruljannah_deploy.pub

# Copy output-nya (mulai dari ssh-ed25519 sampai akhir)
```

```bash
# SSH ke SERVER
ssh user@your-server-ip

# Tambahkan public key ke authorized_keys
nano ~/.ssh/authorized_keys

# Paste public key di baris baru
# Save: Ctrl+O, Enter, Ctrl+X

# Set permission yang benar
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Step 1.3: Test SSH Connection

```bash
# Di LOCAL
# Test koneksi dengan private key
ssh -i ~/.ssh/nuruljannah_deploy user@your-server-ip

# Kalau bisa masuk tanpa password = SUCCESS ✅
# Logout: exit
```

### Step 1.4: Get Private Key Content

```bash
# Di LOCAL
# Copy private key content (ini yang akan disimpan di GitHub Secrets)
cat ~/.ssh/nuruljannah_deploy

# Copy SEMUA output (dari -----BEGIN sampai -----END-----)
```

---

## 🔧 PART 2: PREPARE PROJECT

### Step 2.1: Create Ecosystem Config untuk PM2

```bash
# Di LOCAL, di root project
nano ecosystem.config.js
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'nuruljannah',
    script: 'server-wrapper.js',
    cwd: '/home/YOUR_USERNAME/path/to/website/.next/standalone',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/YOUR_USERNAME/path/to/website/logs/error.log',
    out_file: '/home/YOUR_USERNAME/path/to/website/logs/out.log',
    log_file: '/home/YOUR_USERNAME/path/to/website/logs/combined.log',
    time: true
  }]
};
```

**PENTING:** Ganti `/home/YOUR_USERNAME/path/to/website` dengan path real kamu!

### Step 2.2: Create Deploy Script

```bash
# Di LOCAL
nano scripts/deploy.sh
```

```bash
#!/bin/bash
# scripts/deploy.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting deployment...${NC}"

# Get project directory (where the script is run from)
PROJECT_DIR="$(pwd)"
echo -e "${YELLOW}📁 Project directory: ${PROJECT_DIR}${NC}"

# 1. Pull latest code
echo -e "${YELLOW}📥 Pulling latest code...${NC}"
git pull origin main

# 2. Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci --production=false

# 3. Generate Prisma client
echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
npx prisma generate

# 4. Run migrations (with error handling)
echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
if npx prisma migrate deploy; then
    echo -e "${GREEN}✅ Migrations completed${NC}"
else
    echo -e "${RED}⚠️  Migration failed, continuing anyway...${NC}"
fi

# 5. Build Next.js
echo -e "${YELLOW}🏗️  Building Next.js...${NC}"
npm run build

# 6. Prepare standalone directory
echo -e "${YELLOW}📁 Preparing standalone files...${NC}"
STANDALONE_DIR="${PROJECT_DIR}/.next/standalone"

# Copy necessary files to standalone
if [ -f "server-wrapper.js" ]; then
    cp server-wrapper.js "${STANDALONE_DIR}/"
    echo -e "${GREEN}✅ Copied server-wrapper.js${NC}"
else
    echo -e "${RED}❌ server-wrapper.js not found!${NC}"
    exit 1
fi

# Copy static files
if [ -d ".next/static" ]; then
    cp -r .next/static "${STANDALONE_DIR}/.next/"
    echo -e "${GREEN}✅ Copied .next/static${NC}"
fi

# Copy public files
if [ -d "public" ]; then
    cp -r public "${STANDALONE_DIR}/"
    echo -e "${GREEN}✅ Copied public${NC}"
fi

# Copy environment file
if [ -f ".env.production" ]; then
    cp .env.production "${STANDALONE_DIR}/.env.production"
    echo -e "${GREEN}✅ Copied .env.production${NC}"
elif [ -f ".env.local" ]; then
    cp .env.local "${STANDALONE_DIR}/.env.production"
    echo -e "${GREEN}✅ Copied .env.local as .env.production${NC}"
else
    echo -e "${YELLOW}⚠️  No environment file found${NC}"
fi

# 7. Restart PM2
echo -e "${YELLOW}🔄 Restarting PM2...${NC}"
if pm2 describe nuruljannah > /dev/null 2>&1; then
    pm2 restart nuruljannah
    echo -e "${GREEN}✅ PM2 restarted${NC}"
else
    echo -e "${YELLOW}Starting PM2 with ecosystem file...${NC}"
    pm2 start ecosystem.config.js
    echo -e "${GREEN}✅ PM2 started${NC}"
fi

# 8. Save PM2 config
pm2 save

# 9. Show status
echo -e "${GREEN}📊 PM2 Status:${NC}"
pm2 list

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Website should be live at your domain${NC}"
```

```bash
# Make executable
chmod +x scripts/deploy.sh
```

### Step 2.3: Update package.json Scripts

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "deploy": "bash scripts/deploy.sh"
  }
}
```

### Step 2.4: Create .env.production Template

```bash
# Di LOCAL
nano .env.production.example
```

```bash
# .env.production.example
# Copy this file to .env.production and fill with real values

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
POSTGRES_PRISMA_URL="postgresql://user:password@localhost:5432/dbname"
POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost:5432/dbname"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="https://your-domain.com"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Optional
NODE_ENV="production"
```

### Step 2.5: Update .gitignore

```bash
# Di LOCAL
nano .gitignore
```

```
# Add these lines if not exists
.env.local
.env.production
.env
logs/
*.log
```

### Step 2.6: Commit Changes

```bash
# Di LOCAL
git add .
git commit -m "chore: add deployment automation scripts"
git push origin main
```

---

## 🔧 PART 3: SETUP GITHUB SECRETS

### Step 3.1: Get Private Key

```bash
# Di LOCAL
cat ~/.ssh/nuruljannah_deploy

# Copy SEMUA output (termasuk -----BEGIN dan -----END-----)
```

### Step 3.2: Add Secrets to GitHub

1. Buka repository di GitHub
2. Pergi ke: **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**

Tambahkan 3 secrets ini:

#### Secret 1: `SSH_PRIVATE_KEY`
```
Value: [paste private key yang di-copy tadi]
```

#### Secret 2: `SERVER_HOST`
```
Value: your-server-ip (contoh: 192.168.1.100 atau domain.com)
```

#### Secret 3: `SERVER_USER`
```
Value: username-ssh-kamu (contoh: ubuntu, root, atau user lain)
```

#### Secret 4: `SERVER_PATH`
```
Value: /home/YOUR_USERNAME/path/to/website
(path lengkap ke directory project di server)
```

### Step 3.3: Verify Secrets

Setelah ditambahkan, kamu akan lihat 4 secrets:
- ✅ `SSH_PRIVATE_KEY`
- ✅ `SERVER_HOST`
- ✅ `SERVER_USER`
- ✅ `SERVER_PATH`

---

## 🔧 PART 4: CREATE GITHUB ACTIONS WORKFLOW

### Step 4.1: Create Workflow Directory

```bash
# Di LOCAL
mkdir -p .github/workflows
```

### Step 4.2: Create Workflow File

```bash
# Di LOCAL
nano .github/workflows/deploy.yml
```

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production Server

on:
  push:
    branches:
      - main
  workflow_dispatch: # Allow manual trigger

jobs:
  deploy:
    name: Deploy to Server
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
      
      - name: 🔑 Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H ${{ secrets.SERVER_HOST }} >> ~/.ssh/known_hosts
      
      - name: 🚀 Deploy to Server
        run: |
          ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }} << 'ENDSSH'
            # Navigate to project directory
            cd ${{ secrets.SERVER_PATH }}
            
            # Run deployment script
            bash scripts/deploy.sh
            
            # Show deployment status
            echo "✅ Deployment completed!"
            pm2 list
          ENDSSH
      
      - name: 🧹 Cleanup
        if: always()
        run: |
          rm -f ~/.ssh/deploy_key
```

### Step 4.3: Create Workflow untuk Development (Optional)

Buat workflow terpisah untuk branch `dev`:

```bash
nano .github/workflows/deploy-dev.yml
```

```yaml
# .github/workflows/deploy-dev.yml
name: Deploy to Development Server

on:
  push:
    branches:
      - dev
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy to Dev Server
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
      
      - name: 🔑 Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H ${{ secrets.SERVER_HOST }} >> ~/.ssh/known_hosts
      
      - name: 🚀 Deploy to Dev Server
        run: |
          ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }} << 'ENDSSH'
            cd ${{ secrets.SERVER_PATH }}
            git pull origin dev
            npm ci
            npx prisma generate
            npm run build
            pm2 restart nuruljannah-dev
          ENDSSH
      
      - name: 🧹 Cleanup
        if: always()
        run: |
          rm -f ~/.ssh/deploy_key
```

### Step 4.4: Commit Workflow

```bash
# Di LOCAL
git add .github/workflows/
git commit -m "ci: add GitHub Actions deployment workflow"
git push origin main
```

**🎉 FIRST DEPLOYMENT AKAN OTOMATIS JALAN!**

---

## 🔧 PART 5: PREPARE SERVER ENVIRONMENT

### Step 5.1: Ensure .env.production Exists

```bash
# SSH ke SERVER
ssh user@your-server-ip

# Navigate to project
cd /path/to/website

# Create .env.production (kalau belum ada)
nano .env.production
```

Paste environment variables:
```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://your-domain.com"
SUPABASE_URL="..."
SUPABASE_SERVICE_ROLE_KEY="..."
```

### Step 5.2: Create Logs Directory

```bash
# Di SERVER
cd /path/to/website
mkdir -p logs
```

### Step 5.3: Ensure PM2 Startup

```bash
# Di SERVER
# Setup PM2 to start on boot
pm2 startup

# Copy & paste command yang muncul (biasanya sudo ...)
# Contoh: sudo env PATH=...

# Save PM2 process list
pm2 save
```

### Step 5.4: Test Deploy Script Manually First

```bash
# Di SERVER (untuk test pertama kali)
cd /path/to/website
bash scripts/deploy.sh

# Kalau berhasil, berarti setup sudah benar! ✅
```

---

## 🎯 PART 6: TEST DEPLOYMENT

### Step 6.1: Make a Test Change

```bash
# Di LOCAL
# Edit file apapun, misalnya README.md
echo "# Testing CI/CD" >> README.md

git add README.md
git commit -m "test: trigger CI/CD deployment"
git push origin main
```

### Step 6.2: Watch GitHub Actions

1. Buka repository di GitHub
2. Pergi ke tab **Actions**
3. Kamu akan lihat workflow "Deploy to Production Server" running
4. Click workflow untuk lihat detail logs

### Step 6.3: Monitor Progress

Di GitHub Actions, kamu akan lihat:
```
✅ Checkout code
✅ Setup SSH
🔄 Deploy to Server
   📥 Pulling latest code...
   📦 Installing dependencies...
   🔧 Generating Prisma client...
   🗄️  Running database migrations...
   🏗️  Building Next.js...
   📁 Preparing standalone files...
   🔄 Restarting PM2...
   ✅ Deployment completed!
✅ Cleanup
```

### Step 6.4: Verify Website

```bash
# Check website
curl https://your-domain.com

# Atau buka di browser
```

---

## 🎉 USAGE WORKFLOW

Dari sekarang, workflow kamu jadi super simple:

### Development Workflow:
```bash
# 1. Develop locally
npm run dev

# 2. Test changes
# ...

# 3. Commit & push
git add .
git commit -m "feat: add new feature"
git push origin main

# 4. ☕ Tunggu 2-3 menit
# GitHub Actions otomatis deploy!

# 5. ✅ Done! Check website
```

### Emergency Rollback:
```bash
# Option 1: Revert commit
git revert HEAD
git push origin main
# GitHub Actions auto-deploy versi sebelumnya

# Option 2: Manual rollback di server
ssh user@server
cd /path/to/website
git reset --hard HEAD~1
bash scripts/deploy.sh
```

---

## 🔍 MONITORING & DEBUGGING

### View Deployment Logs (GitHub)

1. GitHub → Actions → Click on latest workflow
2. Click "Deploy to Server" job
3. Expand steps untuk lihat detail

### View Application Logs (Server)

```bash
# SSH ke server
ssh user@server

# PM2 logs
pm2 logs nuruljannah

# Atau lihat file logs
tail -f /path/to/website/logs/combined.log
tail -f /path/to/website/logs/error.log
```

### Check PM2 Status

```bash
# Di server
pm2 status
pm2 info nuruljannah
```

### Common Issues & Solutions

#### Issue 1: "Host key verification failed"
```bash
# Di LOCAL
ssh-keyscan -H your-server-ip >> ~/.ssh/known_hosts
git commit --allow-empty -m "fix: update ssh known hosts"
git push
```

#### Issue 2: "Permission denied (publickey)"
```bash
# Verify private key di GitHub Secrets sudah benar
# Test SSH connection:
ssh -i ~/.ssh/nuruljannah_deploy user@server
```

#### Issue 3: "npm command not found"
```bash
# SSH ke server
# Add npm to PATH di .bashrc atau .profile
echo 'export PATH="$HOME/.nvm/versions/node/v20.x.x/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

#### Issue 4: "PM2 restart failed"
```bash
# SSH ke server
pm2 delete nuruljannah
pm2 start ecosystem.config.js
pm2 save
```

---

## 📊 WORKFLOW COMPARISON

### Before (Manual):
```
1. Code locally ✍️
2. Test locally 🧪
3. Git commit & push 📤
4. SSH to server 🔐
5. cd to project 📁
6. Git pull 📥
7. npm install 📦
8. npx prisma generate 🔧
9. npx prisma migrate 🗄️
10. npm run build 🏗️
11. Copy files 📋
12. pm2 restart 🔄
13. Check if it works 🤞
14. Debug if fails 😓

⏱️ Total: 10-15 minutes + debugging time
```

### After (GitHub Actions):
```
1. Code locally ✍️
2. Test locally 🧪
3. Git commit & push 📤
4. ☕ Wait 2-3 minutes
5. ✅ Done!

⏱️ Total: 3 minutes + zero effort
```

---

## 🔒 SECURITY BEST PRACTICES

### 1. Protect Secrets
- ✅ Never commit private keys to repo
- ✅ Use GitHub Secrets for sensitive data
- ✅ Rotate SSH keys periodically (3-6 months)

### 2. Limit SSH Access
```bash
# Di server, edit sshd_config
sudo nano /etc/ssh/sshd_config

# Add these lines:
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes

# Restart SSH
sudo systemctl restart sshd
```

### 3. Use Firewall
```bash
# Di server
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 4. Monitor Deployment Logs
- Regularly check GitHub Actions logs
- Set up notifications for failed deployments

---

## 📈 ADVANCED: ADD MORE FEATURES

### Feature 1: Slack Notification

Tambah di `.github/workflows/deploy.yml`:

```yaml
      - name: 📢 Notify Slack on Success
        if: success()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "✅ Deployment to production successful!"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
      
      - name: 📢 Notify Slack on Failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "❌ Deployment to production failed!"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Feature 2: Health Check

Tambah step untuk verify deployment:

```yaml
      - name: 🏥 Health Check
        run: |
          echo "Waiting 10 seconds for app to start..."
          sleep 10
          
          response=$(curl -s -o /dev/null -w "%{http_code}" https://your-domain.com)
          
          if [ $response -eq 200 ]; then
            echo "✅ Health check passed!"
          else
            echo "❌ Health check failed! Status: $response"
            exit 1
          fi
```

### Feature 3: Automated Tests Before Deploy

```yaml
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
      
      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: 📦 Install dependencies
        run: npm ci
      
      - name: 🧪 Run tests
        run: npm test
      
      - name: 🔍 Run linter
        run: npm run lint

  deploy:
    name: Deploy to Server
    runs-on: ubuntu-latest
    needs: test  # Deploy only if tests pass
    # ... rest of deploy job
```

---

## ✅ FINAL CHECKLIST

Setup:
- [ ] SSH key pair created
- [ ] Public key added to server
- [ ] Private key added to GitHub Secrets
- [ ] SERVER_HOST, SERVER_USER, SERVER_PATH secrets added
- [ ] ecosystem.config.js created
- [ ] scripts/deploy.sh created and executable
- [ ] .github/workflows/deploy.yml created
- [ ] .env.production exists on server
- [ ] Tested deploy script manually once

First Deployment:
- [ ] Made test commit
- [ ] Pushed to main branch
- [ ] GitHub Actions workflow triggered
- [ ] Deployment succeeded
- [ ] Website accessible
- [ ] PM2 running correctly

Ongoing:
- [ ] Commit & push triggers auto-deploy
- [ ] Monitor GitHub Actions logs
- [ ] Check PM2 status periodically
- [ ] Review deployment logs weekly

---

## 🎓 WHAT'S NEXT?

Now that you have automated deployment:

1. **Start developing new structure**
   - Follow migration roadmap
   - Each push auto-deploys
   - Focus on coding, not deployment

2. **Add more automation**
   - Automated tests
   - Code quality checks
   - Database backups

3. **Set up staging environment** (optional)
   - Create `dev` branch
   - Separate workflow for staging
   - Test before production

---

## 📞 NEED HELP?

Common commands untuk troubleshooting:

```bash
# Check GitHub Actions logs
# Di browser: GitHub → Actions → Latest workflow

# Check server SSH
ssh -i ~/.ssh/nuruljannah_deploy user@server

# Check PM2
ssh user@server
pm2 status
pm2 logs nuruljannah

# Manual deploy
ssh user@server
cd /path/to/website
bash scripts/deploy.sh

# Restart PM2
pm2 restart nuruljannah

# Check Nginx
sudo systemctl status nginx
sudo nginx -t
```

---

**🎉 CONGRATULATIONS!**

Setup kamu sekarang:
- ✅ Automated deployment
- ✅ No more manual SSH
- ✅ No more deploy.sh errors
- ✅ Professional DevOps workflow
- ✅ Ready for new structure migration

**Next step:** Start implementing new structure with confidence! 🚀
