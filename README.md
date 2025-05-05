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
```

## License

This project is licensed under the ISC License.

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

0. **종료하기**
   - 애플리케이션을 종료합니다

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
```

## 라이센스

이 프로젝트는 ISC 라이센스에 따라 라이센스가 부여됩니다.