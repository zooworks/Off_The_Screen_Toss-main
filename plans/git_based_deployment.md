# Git Hook & SFTP 기반 배포 자동화 플랜 (Real-World Specs)

이 문서는 Jenkins/Docker 없이, **제공해주신 실제 서버 정보**를 바탕으로 작성된 정밀 배포 계획입니다.

**서버 구성 정보**:
1.  **📦 애플리케이션 서버 (App Server)**: `ssh eekky@211.207.190.93 -p 10003` (RAM 2GB)
    *   역할: 코드 저장, 빌드, PM2 구동 (Node.js)
2.  **🌐 웹 서버 (Nginx VM)**: `ssh eekky@211.207.190.93 -p 10020` (RAM 1GB)
    *   역할: 도메인 연결, SSL 처리, 리버스 프록시

---

## 1. 🛠️ 사전 준비 (App Server: 포트 10003)

개발된 코드는 **App Server(10003)**로 전송되어야 합니다.

### ⚠️ 중요: App Server의 Nginx 정리
이 서버는 오직 **PM2(Node.js)**만 실행하면 됩니다.
기존에 설치된 Nginx가 있다면 **중지하거나 삭제**해 주세요.
```bash
# Nginx 중지 및 자동실행 해제
sudo systemctl stop nginx
sudo systemctl disable nginx
# (혹은 삭제: sudo apt remove nginx)
```

### 1-1. 서버 측 Git 저장소 설정 (App Server 접속 후)
```bash
# 1. ssh 접속
ssh eekky@211.207.190.93 -p 10003

# 2. 우체통 만들기 (Frontend-Toss)
mkdir -p ~/repos/front-toss.git && cd ~/repos/front-toss.git && git init --bare

# 3. 우체통 만들기 (Integrated Repo: Front+Back)
mkdir -p ~/repos/main.git && cd ~/repos/main.git && git init --bare
```



### 1-2. 로컬 Git Remote 연결 (내 컴퓨터)
내 컴퓨터의 프로젝트를 App Server의 우체통과 연결합니다. (포트 10003 필수)

```bash
# [Off_The_Screen_Toss 폴더]
git remote add production ssh://eekky@211.207.190.93:10003/home/eekky/repos/front-toss.git

# [Off_The_Screen2 폴더 ("통합 리포지토리"이므로 여기서 한 번만 명령)]
git remote add production ssh://eekky@211.207.190.93:10003/home/eekky/repos/main.git
```

### 1-3. 🔑 환경 변수 설정 (.env) - **(중요)**
Jenkins가 없으므로, **서버에 직접 .env 파일을 만들어주어야 합니다.**
Git으로 배포할 때 `.env`는 보안상 제외되므로, 아래 경로에 미리 파일을 생성해 주세요.

```bash
# (App Server 접속 상태)

# 1. Toss 프론트엔드 환경 변수
nano ~/next/Off_The_Screen_Toss/Off_sol/.env
# (내용 붙여넣기: VITE_API_URL=https://off-toss.eekky.com/api 등)

# 2. App Store(Google/Apple) 프론트엔드 환경 변수
nano ~/next/Off_The_Screen2/Off_sol/.env
# (내용 붙여넣기)

# 3. 공용 백엔드 (Shared Backend) 환경 변수
nano ~/next/Off_The_Screen2/off-service/.env
# (내용 붙여넣기: DATABASE_URL, JAVA_HOME 등)
```

---

## 2. 📜 배포 스크립트 로직 (App Server)

**중요**: `DEPLOY_DIR` 경로를 고객님이 **이미 git clone 받아둔 실제 폴더 경로(next 폴더)**로 적어주시면 됩니다.

### A. Toss 프론트엔드 (`~/repos/front-toss.git/hooks/post-receive`)
이 저장소는 `Off_The_Screen_Toss` 폴더와 연결됩니다.

```bash
#!/bin/bash
TARGET="$HOME/next/Off_The_Screen_Toss" # <-- next 폴더 포함
GIT_DIR="$HOME/repos/front-toss.git"

echo "Deploying to $TARGET..."
git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f main

cd $TARGET/Off_sol
pnpm install
pnpm build

# PM2 재시작
pm2 restart front-toss
echo "Toss Frontend Deployed!"
```
*(실행 권한 부여: `chmod +x ~/repos/front-toss.git/hooks/post-receive`)*

### B. 통합 리포지토리 (`~/repos/main.git/hooks/post-receive`)
`Off_The_Screen2` 폴더는 **App Store 프론트와 공용 백엔드가 같이 있는 폴더**입니다. 한 번의 Push로 둘 다 배포합니다.
(로컬에서 `Off_The_Screen2` 전체를 clone 했다고 가정합니다.)

```bash
#!/bin/bash
TARGET="$HOME/next/Off_The_Screen2" # <-- next 폴더 포함
GIT_DIR="$HOME/repos/main.git"

echo "Deploying to $TARGET..."
git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f main

# 1. App Store(Google/Apple) 프론트엔드 빌드
echo "Building App Store Frontend..."
cd $TARGET/Off_sol
pnpm install
pnpm build
pm2 restart front-general

# 2. 백엔드 빌드
echo "Building Shared Backend..."
cd $TARGET/off-service
pnpm install

# 2-1. DB 마이그레이션 (자동 적용)
echo "Running DB Migrations..."
npx prisma migrate deploy

# 2-2. Prisma Client 생성 (필수)
echo "Generating Prisma Client..."
npx prisma generate

pnpm build
pm2 restart off-service

echo "Main Repo (Front+Back) Deployed!"
```
*(실행 권한 부여: `chmod +x ~/repos/main.git/hooks/post-receive`)*

---

## 3. 🚀 최초 배포 및 실행 (First Run)

모든 설정(Git, Hook, Env)이 완료되었다면, **내 컴퓨터**에서 코드를 밀어넣어 서버를 깨웁니다.

### 3-1. Git Push (내 컴퓨터)
```bash
# 1. Toss 프론트엔드 배포
cd ~/next/Off_The_Screen_Toss
git push production main

# 2. 통합 리포지토리 (App Store Front + Backend) 배포
cd ~/next/Off_The_Screen2
git push production main
```
(Push를 하면 서버에서 자동으로 Build가 진행됩니다. 첫 배포 시에는 PM2 restart 에러가 날 수 있으나, Build 성공 여부를 확인하세요.)

### 3-2. PM2 서비스 시작 (App Server)
**Build가 성공적으로 끝난 후**, 서버에서 서비스를 시작합니다. (최초 1회만 필요)

```bash
# PM2로 3개의 서비스를 실행합니다.
pm2 serve ~/next/Off_The_Screen_Toss/Off_sol/dist 3002 --name "front-toss" --spa
pm2 serve ~/next/Off_The_Screen2/Off_sol/dist 3003 --name "front-general" --spa
pm2 start ~/next/Off_The_Screen2/off-service/dist/main.js --name "off-service"
```

---

## 4. 🌐 Nginx 설정 (Nginx VM: 포트 10020)

(이전과 동일, 내부 IP 연결 설정 유지)
...

```nginx
# 1. App Store용 웹사이트 (Google/Apple 출시용: off.eekky.com)
server {
    listen 80;
    server_name off.eekky.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name off.eekky.com;

    # Cloudflare SSL 인증서 (사용자 제공 경로)
    ssl_certificate     /etc/ssl/cloudflare/eekky.com.pem;
    ssl_certificate_key /etc/ssl/cloudflare/eekky.com.key;

    location / {
        proxy_pass http://192.168.55.13:3003; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # API 요청은 백엔드로 (Prefix 유지)
    location /api {
        proxy_pass http://192.168.55.13:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 2. 토스 앱 전용 웹사이트 (off-toss.eekky.com)
server {
    listen 80;
    server_name off-toss.eekky.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name off-toss.eekky.com;

    # Cloudflare SSL 인증서
    ssl_certificate     /etc/ssl/cloudflare/eekky.com.pem;
    ssl_certificate_key /etc/ssl/cloudflare/eekky.com.key;

    location / {
        proxy_pass http://192.168.55.13:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://192.168.55.13:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 4. 🚀 요약

1.  **코드 전송**: 개발자는 `211.207.190.93:10003` (App Server)로 푸시합니다.
2.  **앱 실행**: App Server가 코드를 받아 빌드하고, 포트 3001~3003에서 대기합니다.
3.  **접속**: 사용자는 도메인(`off-toss.eekky.com` 등)을 통해 `211.207.190.93` (Nginx VM:10020)으로 들어옵니다.
4.  **연결**: Nginx가 내부망을 통해 App Server의 서비스를 보여줍니다.



