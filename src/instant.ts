/**
 * GitHub Follower Traitor - Instant Run
 * 
 * 1번과 2번 기능을 자동으로 실행하고 종료하는 스크립트입니다.
 */

import { GitHubAPI } from './githubApi';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

// GitHub API 클래스 초기화
const githubToken = process.env.GITHUB_TOKEN || '';
const username = process.env.GITHUB_USERNAME || '';

/**
 * 즉시 동기화 실행 함수
 */
async function runInstantSync(): Promise<void> {
	console.log('🚀 GitHub Follower Traitor - Instant Sync');
	console.log(`현재 시간: ${new Date().toLocaleString()}`);
	console.log(`사용자: ${username}`);
	console.log('=====================================\n');

	if (!githubToken) {
		console.error('❌ GitHub 토큰이 설정되지 않았습니다. .env 파일에 GITHUB_TOKEN을 설정해주세요.');
		process.exit(1);
	}

	if (!username) {
		console.error('❌ GitHub 사용자 이름이 설정되지 않았습니다. .env 파일에 GITHUB_USERNAME을 설정해주세요.');
		process.exit(1);
	}

	try {
		const githubApi = new GitHubAPI(githubToken);

		// 현재 상태 확인
		console.log('📊 현재 상태를 확인하는 중...');
		const followers = await githubApi.getFollowers(username);
		const following = await githubApi.getFollowing(username);
		
		console.log(`팔로워 수: ${followers.length}`);
		console.log(`팔로잉 수: ${following.length}\n`);

		// 동기화할 대상 확인
		const notFollowingYou = await githubApi.findNotFollowingYou(username);
		const nonFollowingBack = await githubApi.findNonFollowingBack(username);
		
		console.log(`언팔로우할 사용자 수: ${notFollowingYou.length}`);
		console.log(`팔로우할 사용자 수: ${nonFollowingBack.length}\n`);

		if (notFollowingYou.length === 0 && nonFollowingBack.length === 0) {
			console.log('✅ 이미 완벽하게 동기화되어 있습니다!');
			console.log('실행할 작업이 없습니다.');
			return;
		}

		// 1단계: 나를 팔로우하지 않는 사람들 언팔로우
		if (notFollowingYou.length > 0) {
			console.log('🔄 1단계: 나를 팔로우하지 않는 사용자들을 언팔로우합니다...');
			const unfollowedUsers = await githubApi.unfollowAllNotFollowingYou(username);
			console.log(`✅ ${unfollowedUsers.length}명의 사용자를 언팔로우했습니다.\n`);
		}

		// 2단계: 나를 팔로우하는데 내가 팔로우하지 않는 사람들 팔로우
		if (nonFollowingBack.length > 0) {
			console.log('🔄 2단계: 나를 팔로우하는 사용자들을 팔로우합니다...');
			const followedUsers = await githubApi.followAllNonFollowingBack(username);
			console.log(`✅ ${followedUsers.length}명의 사용자를 팔로우했습니다.\n`);
		}

		// 최종 상태 확인
		console.log('📊 최종 상태 확인 중...');
		const finalFollowers = await githubApi.getFollowers(username);
		const finalFollowing = await githubApi.getFollowing(username);
		
		console.log(`최종 팔로워 수: ${finalFollowers.length}`);
		console.log(`최종 팔로잉 수: ${finalFollowing.length}`);
		
		console.log('\n🎉 즉시 동기화가 완료되었습니다!');
		console.log('프로그램을 종료합니다.');

	} catch (error) {
		console.error('❌ 즉시 동기화 중 오류가 발생했습니다:', error);
		process.exit(1);
	}
}

// 즉시 실행
runInstantSync().catch(error => {
	console.error('애플리케이션 실행 중 오류:', error);
	process.exit(1);
});
