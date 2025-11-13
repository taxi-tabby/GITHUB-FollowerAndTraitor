/**
 * GitHub Follower Traitor - Instant Run
 * 
 * 1번과 2번 기능을 자동으로 실행하고 종료하는 스크립트입니다.
 * - TIMEOVER_MS 시간 내에 완료하지 못하면 진행 상태를 저장하고 종료
 * - 다음 실행 시 저장된 지점부터 재개
 */

import { GitHubAPI } from './githubApi';
import { SaveDataManager, SaveData } from './saveDataManager';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

// GitHub API 클래스 초기화
const githubToken = process.env.GITHUB_TOKEN || '';
const username = process.env.GITHUB_USERNAME || '';
const rateLimitWaitMs = parseInt(process.env.RATELIMIT_WAIT_MS || '1000', 10);
const timeoverMs = parseInt(process.env.TIMEOVER_MS || '3000000', 10);

// SaveDataManager 초기화
const saveDataManager = new SaveDataManager('savedata.json');

// 시작 시간 추적
let startTime: number;

/**
 * 시간 초과 여부를 확인
 */
function isTimeover(): boolean {
	const elapsed = Date.now() - startTime;
	return elapsed >= timeoverMs;
}

/**
 * 남은 시간을 표시 (분 단위)
 */
function showRemainingTime(): void {
	const elapsed = Date.now() - startTime;
	const remaining = timeoverMs - elapsed;
	const remainingMinutes = Math.floor(remaining / 60000);
	if (remainingMinutes > 0) {
		console.log(`⏱️  남은 시간: 약 ${remainingMinutes}분`);
	} else {
		console.log(`⏱️  남은 시간: 1분 미만`);
	}
}

/**
 * 언팔로우 처리 함수
 */
async function processUnfollow(
	githubApi: GitHubAPI,
	usersToUnfollow: string[],
	startIndex: number
): Promise<{ completed: boolean; lastIndex: number; successCount: number }> {
	console.log(`\n🔄 1단계: 언팔로우 처리 (${startIndex}/${usersToUnfollow.length}부터 시작)`);
	
	let successCount = 0;
	let i = startIndex;

	for (; i < usersToUnfollow.length; i++) {
		// 시간 초과 체크
		if (isTimeover()) {
			console.log(`\n⏰ 시간 초과! 언팔로우 진행 상태를 저장합니다. (${i}/${usersToUnfollow.length})`);
			return { completed: false, lastIndex: i, successCount };
		}

		const username = usersToUnfollow[i];
		const success = await githubApi.unfollowUser(username);
		if (success) {
			successCount++;
		}

		// 진행 상황 표시 (10명마다)
		if ((i + 1) % 10 === 0 || i === usersToUnfollow.length - 1) {
			console.log(`   진행: ${i + 1}/${usersToUnfollow.length} (${successCount}명 성공)`);
			showRemainingTime();
		}
	}

	console.log(`✅ 1단계 완료: 총 ${successCount}명의 사용자를 언팔로우했습니다.`);
	return { completed: true, lastIndex: i, successCount };
}

/**
 * 팔로우 처리 함수
 */
async function processFollow(
	githubApi: GitHubAPI,
	usersToFollow: string[],
	startIndex: number
): Promise<{ completed: boolean; lastIndex: number; successCount: number }> {
	console.log(`\n🔄 2단계: 팔로우 처리 (${startIndex}/${usersToFollow.length}부터 시작)`);
	
	let successCount = 0;
	let i = startIndex;

	for (; i < usersToFollow.length; i++) {
		// 시간 초과 체크
		if (isTimeover()) {
			console.log(`\n⏰ 시간 초과! 팔로우 진행 상태를 저장합니다. (${i}/${usersToFollow.length})`);
			return { completed: false, lastIndex: i, successCount };
		}

		const username = usersToFollow[i];
		const success = await githubApi.followUser(username);
		if (success) {
			successCount++;
		}

		// 진행 상황 표시 (10명마다)
		if ((i + 1) % 10 === 0 || i === usersToFollow.length - 1) {
			console.log(`   진행: ${i + 1}/${usersToFollow.length} (${successCount}명 성공)`);
			showRemainingTime();
		}
	}

	console.log(`✅ 2단계 완료: 총 ${successCount}명의 사용자를 팔로우했습니다.`);
	return { completed: true, lastIndex: i, successCount };
}

/**
 * 즉시 동기화 실행 함수
 */
async function runInstantSync(): Promise<void> {
	startTime = Date.now();
	
	console.log('🚀 GitHub Follower Traitor - Instant Sync');
	console.log(`현재 시간: ${new Date().toLocaleString()}`);
	console.log(`사용자: ${username}`);
	console.log(`Rate Limit 대기 시간: ${rateLimitWaitMs}ms`);
	console.log(`타임아웃: ${Math.floor(timeoverMs / 60000)}분`);
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
		const githubApi = new GitHubAPI(githubToken, rateLimitWaitMs);
		let saveData: SaveData | null = null;
		let usersToUnfollow: string[] = [];
		let usersToFollow: string[] = [];
		let unfollowStartIndex = 0;
		let followStartIndex = 0;
		let currentStep: 'unfollow' | 'follow' = 'unfollow';

		// 저장된 데이터가 있는지 확인
		if (saveDataManager.hasSaveData()) {
			console.log('📂 이전 실행에서 중단된 작업을 발견했습니다. 이어서 진행합니다.\n');
			saveData = saveDataManager.loadSaveData();
			
			if (saveData) {
				usersToUnfollow = saveData.usersToUnfollow;
				usersToFollow = saveData.usersToFollow;
				unfollowStartIndex = saveData.unfollowIndex;
				followStartIndex = saveData.followIndex;
				
				// 'completed'인 경우는 모든 작업이 완료된 것이므로 파일을 삭제하고 새로 시작
				if (saveData.lastStep === 'completed') {
					saveDataManager.deleteSaveData();
					console.log('⚠️  이전 작업이 완료되었습니다. 새로 시작합니다.\n');
					saveData = null;
				} else {
					currentStep = saveData.lastStep;
				}
			}
		}
		
		// saveData가 없으면 (새로운 동기화 또는 completed된 경우) 새로 시작
		if (!saveData) {
			// 새로운 동기화 시작
			console.log('📊 현재 상태를 확인하는 중...');
			const followers = await githubApi.getFollowers(username);
			const following = await githubApi.getFollowing(username);
			
			console.log(`팔로워 수: ${followers.length}`);
			console.log(`팔로잉 수: ${following.length}\n`);

			// 동기화할 대상 확인
			const notFollowingYou = await githubApi.findNotFollowingYou(username);
			const nonFollowingBack = await githubApi.findNonFollowingBack(username);
			
			usersToUnfollow = notFollowingYou.map(u => u.login);
			usersToFollow = nonFollowingBack.map(u => u.login);

			console.log(`언팔로우할 사용자 수: ${usersToUnfollow.length}`);
			console.log(`팔로우할 사용자 수: ${usersToFollow.length}\n`);

			if (usersToUnfollow.length === 0 && usersToFollow.length === 0) {
				console.log('✅ 이미 완벽하게 동기화되어 있습니다!');
				console.log('실행할 작업이 없습니다.');
				return;
			}

			// 초기 SaveData 생성
			saveData = saveDataManager.createNewSaveData(usersToUnfollow, usersToFollow);
		}

		// 1단계: 언팔로우 처리
		if (currentStep === 'unfollow' && unfollowStartIndex < usersToUnfollow.length) {
			const unfollowResult = await processUnfollow(githubApi, usersToUnfollow, unfollowStartIndex);
			
			if (!unfollowResult.completed) {
				// 시간 초과로 중단됨
				const updatedSaveData: SaveData = {
					lastStep: 'unfollow',
					unfollowIndex: unfollowResult.lastIndex,
					followIndex: followStartIndex,
					usersToUnfollow,
					usersToFollow,
					savedAt: new Date().toISOString()
				};
				saveDataManager.saveSaveData(updatedSaveData);
				console.log('\n⏰ 다음 실행 시 자동으로 이어서 진행됩니다.');
				process.exit(0);
			}
			
			// 언팔로우 완료, 팔로우 단계로 진행
			currentStep = 'follow';
		}

		// 2단계: 팔로우 처리
		if (currentStep === 'follow' && followStartIndex < usersToFollow.length) {
			const followResult = await processFollow(githubApi, usersToFollow, followStartIndex);
			
			if (!followResult.completed) {
				// 시간 초과로 중단됨
				const updatedSaveData: SaveData = {
					lastStep: 'follow',
					unfollowIndex: usersToUnfollow.length, // 언팔로우는 완료됨
					followIndex: followResult.lastIndex,
					usersToUnfollow,
					usersToFollow,
					savedAt: new Date().toISOString()
				};
				saveDataManager.saveSaveData(updatedSaveData);
				console.log('\n⏰ 다음 실행 시 자동으로 이어서 진행됩니다.');
				process.exit(0);
			}
		}

		// 모든 작업 완료
		console.log('\n🎉 즉시 동기화가 완료되었습니다!');
		console.log(`📊 언팔로우: ${usersToUnfollow.length}명, 팔로우: ${usersToFollow.length}명`);
		
		// 최종 상태 확인
		console.log('\n📊 최종 상태 확인 중...');
		const finalFollowers = await githubApi.getFollowers(username);
		const finalFollowing = await githubApi.getFollowing(username);
		
		console.log(`최종 팔로워 수: ${finalFollowers.length}`);
		console.log(`최종 팔로잉 수: ${finalFollowing.length}`);
		
		// 저장 파일 삭제
		saveDataManager.deleteSaveData();
		
		console.log('\n프로그램을 종료합니다.');

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
