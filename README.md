# GitHub Follower Traitor

<div align="center">
  <h3>🕵️ Track who doesn't follow you back on GitHub</h3>
</div>

<div align="center">

[English](#overview) | [한국어](#개요)

</div>

---

## Overview

GitHub Follower Traitor is a command-line tool that helps you analyze and manage your GitHub followers and following relationships. It identifies users who don't follow you back ("traitors") and those you don't follow back, allowing you to easily manage your GitHub connections.

### Features

- 📊 View statistics of your GitHub followers and following
- 🔍 Identify users who don't follow you back (traitors)
- 👀 Find followers you don't follow back
- ✅ Bulk follow/unfollow options
- 🎯 Individual user follow/unfollow capabilities
- 🌐 Detailed view of all followers and followings

## Installation

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (comes with Node.js)
- GitHub Personal Access Token

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/github-follower-traitor.git
   cd github-follower-traitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   Create a `.env` file in the root directory with the following content:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_USERNAME=your_github_username
   
   # API Rate Limit Settings (milliseconds)
   # GitHub allows 5,000 API requests per hour for authenticated users
   # Wait time between each request (default: 1000ms = 1 second)
   RATELIMIT_WAIT_MS=1000
   
   # Timeout Settings (milliseconds)
   # If the task is not completed within this time, progress is saved and the process exits
   # The next execution will resume from the saved point
   # Examples: 50 minutes = 3000000ms, 9 minutes = 540000ms
   TIMEOVER_MS=3000000
   ```
   > Note: To create a personal access token, go to GitHub Settings > Developer settings > Personal access tokens. Make sure to select the "user:follow" scope.

4. **Build the application**
   ```bash
   npm run build
   ```

## Usage

### Running the Application

```bash
npm start
```

### Available Commands

Once you run the application, you'll see a menu with the following options:

1. **Follow all users who follow me but I don't follow back**
   - Automatically follow all users who follow you but you don't follow back

2. **Unfollow all users who don't follow me back**
   - Automatically unfollow all users who don't follow you (traitors)

3. **Follow a specific user**
   - Follow a specific GitHub user by username

4. **Unfollow a specific user**
   - Unfollow a specific GitHub user by username

5. **View detailed status**
   - Access a sub-menu with detailed listing options:
     - View all followers
     - View all followings
     - See all traitors (who don't follow you back)
     - View all unfollowed followers (followers you don't follow)

0. **Exit**
   - Close the application

## Development

```bash
# Run the application in development mode
npm run dev

# Watch mode (auto-compile on file changes)
npm run watch

# Lint the code
npm run lint

# Clean the build directory
npm run clean

# Rebuild (clean + build)
npm run rebuild

# 🚀 NEW: Instant Sync (Auto follow/unfollow)
npm run instant-run
```

### Menu Options

When you run the application, you'll see the following menu:

1. **Follow all users who follow me but I don't follow back** - Automatically follow all users who follow you but you don't follow back
2. **Unfollow all users who don't follow me back** - Automatically unfollow all users who don't follow you back
3. **Follow a specific user** - Follow a specific GitHub user
4. **Unfollow a specific user** - Unfollow a specific GitHub user
5. **View detailed status** - View detailed lists of followers, following, traitors, and unfollowed followers
6. **🚀 Instant Sync (1 + 2)** - Automatically perform both options 1 and 2 in sequence for perfect synchronization
0. **Exit** - Exit the application

### Instant Sync Feature

The new **Instant Sync** feature (`npm run instant-run`) is perfect for quickly synchronizing your followers and following:

- Automatically unfollows users who don't follow you back
- Automatically follows users who follow you but you don't follow back
- Runs completely automatically without user interaction
- Displays detailed progress and final statistics
- Exits automatically when complete
- **Smart timeout handling**: If the process takes too long (based on `TIMEOVER_MS` setting), it saves progress to `savedata.json` and resumes from that point on the next run
- **Rate limit protection**: Respects GitHub API rate limits with configurable delays between requests (`RATELIMIT_WAIT_MS`)

This is ideal for:
- Daily maintenance of your GitHub following list
- Keeping follower/following counts balanced
- Automated scripts and scheduled tasks (cron jobs, etc.)
- Large follower/following lists that may exceed time limits

**How it works with cron jobs:**
If you schedule this script to run every hour or every 10 minutes, and it doesn't complete within the `TIMEOVER_MS` limit:
1. The script saves its progress to `savedata.json`
2. On the next scheduled run, it automatically resumes from where it left off
3. When all tasks are completed, `savedata.json` is automatically deleted

## License

This project is get no license.

---

# GitHub Follower Traitor

<div align="center">
  <h3>🕵️ GitHub에서 맞팔로우하지 않는 사용자 추적하기</h3>
</div>

## 개요

GitHub Follower Traitor는 GitHub 팔로워와 팔로잉 관계를 분석하고 관리하는 커맨드라인 도구입니다. 맞팔로우하지 않는 사용자("배신자")와 당신이 팔로우하지 않는 팔로워를 식별하여 GitHub 연결을 쉽게 관리할 수 있게 도와줍니다.

### 기능

- 📊 GitHub 팔로워 및 팔로잉 통계 확인
- 🔍 맞팔로우하지 않는 사용자(배신자) 식별
- 👀 당신이 팔로우하지 않는 팔로워 찾기
- ✅ 일괄 팔로우/언팔로우 옵션
- 🎯 개별 사용자 팔로우/언팔로우 기능
- 🌐 모든 팔로워 및 팔로잉 상세 보기

## 설치

### 필수 조건

- Node.js (v16 이상 권장)
- npm (Node.js와 함께 제공)
- GitHub 개인 액세스 토큰

### 설정

1. **저장소 복제**
   ```bash
   git clone https://github.com/yourusername/github-follower-traitor.git
   cd github-follower-traitor
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **.env 파일 생성**
   루트 디렉토리에 다음 내용으로 `.env` 파일을 생성하세요:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_USERNAME=your_github_username
   
   # API Rate Limit 설정 (밀리초)
   # GitHub는 인증된 사용자에게 시간당 5,000건의 API 요청을 허용
   # 각 요청 사이의 대기 시간 (기본값: 1000ms = 1초)
   RATELIMIT_WAIT_MS=1000
   
   # Timeout 설정 (밀리초)
   # 이 시간 내에 작업이 완료되지 않으면 진행 상태를 저장하고 종료
   # 다음 실행 시 저장된 지점부터 재개됨
   # 예: 50분 = 3000000ms, 9분 = 540000ms
   TIMEOVER_MS=3000000
   ```
   > 참고: 개인 액세스 토큰을 생성하려면 GitHub 설정 > 개발자 설정 > 개인 액세스 토큰으로 이동하세요. "user:follow" 범위를 선택해야 합니다.

4. **애플리케이션 빌드**
   ```bash
   npm run build
   ```

## 사용법

### 애플리케이션 실행

```bash
npm start
```

### 사용 가능한 명령

애플리케이션을 실행하면 다음 옵션이 포함된 메뉴가 표시됩니다:

1. **나를 팔로우하는데 내가 팔로우하지 않는 모든 사람을 팔로우하기**
   - 당신을 팔로우하지만 당신이 팔로우하지 않는 모든 사용자를 자동으로 팔로우합니다

2. **나를 팔로우하지 않는데 내가 팔로우하고 있는 모든 사람 언팔로우하기**
   - 당신을 팔로우하지 않는 모든 사용자(배신자)를 자동으로 언팔로우합니다

3. **특정 사용자 팔로우하기**
   - 사용자 이름으로 특정 GitHub 사용자를 팔로우합니다

4. **특정 사용자 언팔로우하기**
   - 사용자 이름으로 특정 GitHub 사용자를 언팔로우합니다

5. **세부 상태보기**
   - 상세 목록 옵션이 있는 하위 메뉴에 접근합니다:
     - 모든 팔로워 목록 보기
     - 모든 팔로잉 목록 보기
     - 모든 배신자 목록 보기 (나를 팔로우하지 않는 사람)
     - 모든 미팔로우 팔로워 목록 보기 (내가 팔로우하지 않는 팔로워)

6. **🚀 즉시 동기화 (1 + 2)**
   - 1번과 2번 옵션을 순차적으로 자동 실행하여 완벽한 동기화를 수행합니다

0. **종료하기**
   - 애플리케이션을 종료합니다

### 즉시 동기화 기능

새로운 **즉시 동기화** 기능 (`npm run instant-run`)은 팔로워와 팔로잉을 빠르게 동기화하는 데 완벽합니다:

- 나를 팔로우하지 않는 사용자들을 자동으로 언팔로우
- 나를 팔로우하지만 내가 팔로우하지 않는 사용자들을 자동으로 팔로우
- 사용자 상호작용 없이 완전히 자동으로 실행
- 상세한 진행 상황과 최종 통계 표시
- 완료 시 자동으로 종료
- **스마트 타임아웃 처리**: 작업이 너무 오래 걸리는 경우(`TIMEOVER_MS` 설정 기준), `savedata.json`에 진행 상황을 저장하고 다음 실행 시 해당 지점부터 재개
- **Rate Limit 보호**: 요청 사이의 지연 시간을 설정(`RATELIMIT_WAIT_MS`)하여 GitHub API ratelimit 에 안걸리게 하기 위한 최소한의 조치

다음과 같은 경우에 이상적입니다:
- GitHub 팔로잉 목록의 일일 관리
- 팔로워/팔로잉 수의 균형 유지
- 자동화된 스크립트 및 예약된 작업 (cron 작업 등)
- 시간 제한을 초과할 수 있는 대규모 팔로워/팔로잉 목록

**Cron 작업과 함께 작동하는 방법:**
1시간마다 또는 10분마다 이 스크립트를 실행하도록 예약했는데 `TIMEOVER_MS` 제한 내에 완료되지 않는 경우:
1. 스크립트가 진행 상황을 `savedata.json`에 저장
2. 다음 예약된 실행 시 자동으로 중단된 지점부터 재개
3. 모든 작업이 완료되면 `savedata.json`이 자동으로 삭제됨

## 개발

```bash
# 개발 모드로 애플리케이션 실행
npm run dev

# 감시 모드 (파일 변경 시 자동 컴파일)
npm run watch

# 코드 린트
npm run lint

# 빌드 디렉토리 정리
npm run clean

# 재빌드 (clean + build)
npm run rebuild

# 🚀 새로운 기능: 즉시 동기화 (자동 팔로우/언팔로우)
npm run instant-run
```

## 라이센스
이 프로젝트는 라이선스가 없습니다.




----
> 메인 화면
```bash
(base) PS R:\project\github-follower-traitor> npm run start

> github-follower-traitor@1.0.0 start
> node dist/index.js

GitHub Follower and Traitor 애플리케이션이 시작되었습니다!
현재 시간: 2025. 5. 5. 오후 11:19:10

"taxi-tabby" 사용자의 팔로워와 팔로잉 정보를 가져오는 중...
followers (팔로워 수): 27
following (팔로잉 수): 27

내가 팔로우하지만 나를 팔로우하지 않는 사용자 수: 0
배신자 목록:

나를 팔로우하지만 내가 팔로우하지 않는 사용자 수: 0
팔로우하지 않는 팔로워:


📊 GitHub Follow control menu:
1: Follow all users who follow me but I don't follow back - 나를 팔로우하는데 내가 팔로우하지 않는 모든 사람을 팔로우하기
2: Unfollow all users who don't follow me back - 나를 팔로우하지 않는데 내가 팔로우하고 있는 모든 사람 언팔로우하기
3: Follow a specific user - 특정 사용자 팔로우하기
4: Unfollow a specific user - 특정 사용자 언팔로우하기
5: View detailed status - 세부 상태보기 (Sub Menu)
0: Exit - 종료하기
```