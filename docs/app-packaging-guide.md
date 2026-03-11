# App Packaging & Deployment Guide (Capacitor)

이 문서는 웹 프로젝트(`Off_sol`)를 모바일 앱(Android/iOS)으로 패키징하고 배포 준비하는 과정을 설명합니다.

## 1. 사전 준비 (Prerequisites)

터미널에서 아래 명령어로 Capacitor를 설치하고 초기화해야 합니다.

```bash
# 1. 설치
pnpm add @capacitor/core
pnpm add -D @capacitor/cli

# 2. 초기화 (앱 이름과 고유 ID 설정)
# 예: npx cap init "어플이름" "com.company.appname"
npx cap init "Off The Screen" com.offthescreen.app
```

## 2. 플랫폼 추가 (Android / iOS)

```bash
# 안드로이드
pnpm add @capacitor/android
npx cap add android

# iOS (맥에서만 가능)
pnpm add @capacitor/ios
npx cap add ios
```

## 3. 아이콘 및 스플래시 화면 생성 (자동화)

앱 아이콘을 `assets/icon.png` (1024x1024) 에 두고 아래 명령어를 실행하면 해상도별 이미지가 자동 생성됩니다.

```bash
pnpm add -D @capacitor/assets
npx capacitor-assets generate
```

## 4. 빌드 및 동기화 (패키징 핵심)

코드를 수정할 때마다 이 과정을 반복해야 앱 프로젝트에 반영됩니다.

```bash
# 1. 웹 소스 빌드 (React -> HTML/JS 변환)
pnpm build

# 2. Capacitor 동기화 (dist 폴더 내용을 native 폴더로 복사)
npx cap sync
```

## 5. 최종 앱 파일 생성 (Native Build)

### 🤖 Android (APK/AAB)
1.  안드로이드 스튜디오 실행: `npx cap open android`
2.  메뉴: **Build > Generate Signed Bundle / APK**
3.  키스토어(KeyStore) 비밀번호 입력 후 `Release` 빌드
4.  결과물: `app-release.aab` (구글 플레이 업로드용)

### 🍎 iOS (IPA)
1.  Xcode 실행: `npx cap open ios`
2.  Signing 설정: 개발자 계정 로그인 및 Team 선택
3.  메뉴: **Product > Archive**
4.  **Distribute App** 버튼을 눌러 App Store Connect로 업로드

## 6. 젠키스(Jenkins) / CI 자동화 시

젠키스 파이프라인(`Jenkinsfile`)에 추가해야 할 스크립트 예시입니다.

```groovy
stage('Build App') {
    steps {
        // 웹 빌드
        sh 'pnpm install'
        sh 'pnpm build'
        
        // 네이티브 동기화
        sh 'npx cap sync'
        
        // Fastlane으로 배포 (Android 예시)
        dir('android') {
            sh 'fastlane android deploy'
        }
    }
}
```
