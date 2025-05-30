/**
 * GitHub Follower Traitor
 * 
 * 애플리케이션 진입점입니다.
 */

import { GitHubAPI } from './githubApi';
import dotenv from 'dotenv';
import readline from 'readline';

// 환경 변수 로드
dotenv.config();

// GitHub API 클래스 초기화
const githubToken = process.env.GITHUB_TOKEN || '';
const username = process.env.GITHUB_USERNAME || '';

// 사용자 입력을 받기 위한 readline 인터페이스 생성
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

/**
 * 사용자의 입력을 비동기로 받습니다.
 * @param question 사용자에게 표시할 질문
 * @returns 사용자의 입력값
 */
function askQuestion(question: string): Promise<string> {
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			resolve(answer);
		});
	});
}

/**
 * GitHub API 상태를 표시하는 함수
 * @param githubApi GitHubAPI 인스턴스
 */
async function showStatus(githubApi: GitHubAPI): Promise<void> {
	console.log(`\n"${username}" 사용자의 팔로워와 팔로잉 정보를 가져오는 중...`);

	// 팔로워 및 팔로잉 수 가져오기
	const followers = await githubApi.getFollowers(username);
	const following = await githubApi.getFollowing(username);

	console.log(`followers (팔로워 수): ${followers.length}`);
	console.log(`following (팔로잉 수): ${following.length}`);

	// 나를 팔로우하지 않는 사용자 찾기
	const notFollowingYou = await githubApi.findNotFollowingYou(username);
	console.log(`\n내가 팔로우하지만 나를 팔로우하지 않는 사용자 수: ${notFollowingYou.length}`);

	// 만약 배신자 수가 10명 이하면 목록 표시, 그렇지 않으면 수만 표시
	if (notFollowingYou.length <= 10) {
		console.log('배신자 목록:');
		notFollowingYou.forEach(user => console.log(` - ${user.login}`));
	} else {
		console.log(`(${notFollowingYou.length}명의 배신자가 있습니다. 전체 목록은 표시하지 않습니다.)`);
	}

	// 내가 팔로우하지 않는 팔로워 찾기
	const nonFollowingBack = await githubApi.findNonFollowingBack(username);
	console.log(`\n나를 팔로우하지만 내가 팔로우하지 않는 사용자 수: ${nonFollowingBack.length}`);

	// 만약 팔로우하지 않는 팔로워가 10명 이하면 목록 표시, 그렇지 않으면 수만 표시
	if (nonFollowingBack.length <= 10) {
		console.log('팔로우하지 않는 팔로워:');
		nonFollowingBack.forEach(follower => console.log(` - ${follower.login}`));
	} else {
		console.log(`(${nonFollowingBack.length}명의 미팔로우 팔로워가 있습니다. 전체 목록은 표시하지 않습니다.)`);
	}
}

/**
 * 메인 메뉴를 표시하는 함수
 */
async function showMenu(githubApi: GitHubAPI): Promise<void> {
	console.log('\n\n📊 GitHub Follow control menu:');
	console.log('1: Follow all users who follow me but I don\'t follow back - 나를 팔로우하는데 내가 팔로우하지 않는 모든 사람을 팔로우하기');
	console.log('2: Unfollow all users who don\'t follow me back - 나를 팔로우하지 않는데 내가 팔로우하고 있는 모든 사람 언팔로우하기');
	console.log('3: Follow a specific user - 특정 사용자 팔로우하기');
	console.log('4: Unfollow a specific user - 특정 사용자 언팔로우하기');
	console.log('5: View detailed status - 세부 상태보기 (Sub Menu)');
	console.log('🚀 6: Instant Sync (1 + 2) - 즉시 동기화 (1번과 2번을 동시에 실행)');
	console.log('0: Exit - 종료하기');


	const choice = await askQuestion('\n원하는 작업의 번호를 입력하세요: ');
	await processChoice(choice, githubApi);
}

/**
 * 사용자 선택을 처리하는 함수
 * @param choice 사용자 선택
 * @param githubApi GitHubAPI 인스턴스
 */
async function processChoice(choice: string, githubApi: GitHubAPI): Promise<void> {
	switch (choice) {
		case '1':
			console.log('\n나를 팔로우하는데 내가 팔로우하지 않는 모든 사람을 팔로우합니다...');
			const followedUsers = await githubApi.followAllNonFollowingBack(username);
			console.log(`✅ 성공적으로 ${followedUsers.length}명의 사용자를 팔로우했습니다.`);
			// 다시 메뉴 표시
			await showMenu(githubApi);
			break;
		case '2':
			console.log('\n나를 팔로우하지 않는데 내가 팔로우하고 있는 모든 사람을 언팔로우합니다...');
			const unfollowedUsers = await githubApi.unfollowAllNotFollowingYou(username);
			console.log(`✅ 성공적으로 ${unfollowedUsers.length}명의 사용자를 언팔로우했습니다.`);
			// 다시 메뉴 표시
			await showMenu(githubApi);
			break;
		case '6':
			await instantSync(githubApi);
			console.log('\n프로그램을 종료합니다.');
			rl.close();
			break;

		case '3': {
			const targetUser = await askQuestion('\n팔로우할 사용자의 GitHub 이름을 입력하세요: ');
			if (targetUser) {
				const success = await githubApi.followUser(targetUser);
				if (success) {
					console.log(`✅ ${targetUser} 사용자를 성공적으로 팔로우했습니다.`);
				}
			}
			// 다시 메뉴 표시
			await showMenu(githubApi);
			break;
		}

		case '4': {
			const targetUser = await askQuestion('\n언팔로우할 사용자의 GitHub 이름을 입력하세요: ');
			if (targetUser) {
				const success = await githubApi.unfollowUser(targetUser);
				if (success) {
					console.log(`✅ ${targetUser} 사용자를 성공적으로 언팔로우했습니다.`);
				}
			}
			// 다시 메뉴 표시
			await showMenu(githubApi);
			break;
		}

		case '5': {
			// 세부 상태 보기 옵션
			await showDetailedStatus(githubApi);
			// 다시 메뉴 표시
			await showMenu(githubApi);
			break;
		}

		case '0':
			console.log('프로그램을 종료합니다.');
			rl.close();
			break;

		default:
			console.log('잘못된 선택입니다. 다시 선택해주세요.');
			// 다시 메뉴 표시
			await showMenu(githubApi);
			break;
	}
}

/**
 * 상세 상태를 보여주는 함수
 */
async function showDetailedStatus(githubApi: GitHubAPI): Promise<void> {
	console.log('\n--- 상세 상태 ---');
	console.log('1: View All Followers - 모든 팔로워 목록 보기');
	console.log('2: View all followings - 모든 팔로잉 목록 보기');
	console.log('3: See all the traitor (who don\'t follow me) - 모든 배신자 목록 보기 (나를 팔로우하지 않는 사람)');
	console.log('4: View all unfollowed follower (followers I don\'t follow) - 모든 미팔로우 팔로워 목록 보기 (내가 팔로우하지 않는 팔로워)');
	console.log('0: Back - 뒤로 가기');

	const choice = await askQuestion('\n보고 싶은 목록을 선택하세요: ');

	switch (choice) {
		case '1': {
			console.log('\n모든 팔로워 목록:');
			const followers = await githubApi.getFollowers(username);
			followers.forEach((user, index) => console.log(`${index + 1}. ${user.login}`));
			await showDetailedStatus(githubApi);
			break;
		}
		case '2': {
			console.log('\n모든 팔로잉 목록:');
			const following = await githubApi.getFollowing(username);
			following.forEach((user, index) => console.log(`${index + 1}. ${user.login}`));
			await showDetailedStatus(githubApi);
			break;
		}
		case '3': {
			console.log('\n모든 배신자 목록 (나를 팔로우하지 않는 사람들):');
			const notFollowingYou = await githubApi.findNotFollowingYou(username);
			notFollowingYou.forEach((user, index) => console.log(`${index + 1}. ${user.login}`));
			await showDetailedStatus(githubApi);
			break;
		}
		case '4': {
			console.log('\n모든 미팔로우 팔로워 목록 (내가 팔로우하지 않는 팔로워들):');
			const nonFollowingBack = await githubApi.findNonFollowingBack(username);
			nonFollowingBack.forEach((user, index) => console.log(`${index + 1}. ${user.login}`));
			await showDetailedStatus(githubApi);
			break;
		}
		case '0':
		default:
			return; // 메인 메뉴로 돌아가기
	}
}

/**
 * 1번과 2번을 동시에 실행하는 함수 (즉시 동기화)
 * @param githubApi GitHubAPI 인스턴스
 */
async function instantSync(githubApi: GitHubAPI): Promise<void> {
	console.log('\n🚀 즉시 동기화를 시작합니다...');
	console.log('1️⃣ 나를 팔로우하지 않는 사람들을 언팔로우합니다...');
	console.log('2️⃣ 나를 팔로우하는데 내가 팔로우하지 않는 사람들을 팔로우합니다...');
	
	try {
		// 1단계: 나를 팔로우하지 않는 사람들 언팔로우
		const unfollowedUsers = await githubApi.unfollowAllNotFollowingYou(username);
		console.log(`✅ 1단계 완료: ${unfollowedUsers.length}명의 사용자를 언팔로우했습니다.`);
		
		// 2단계: 나를 팔로우하는데 내가 팔로우하지 않는 사람들 팔로우
		const followedUsers = await githubApi.followAllNonFollowingBack(username);
		console.log(`✅ 2단계 완료: ${followedUsers.length}명의 사용자를 팔로우했습니다.`);
		
		console.log('\n🎉 즉시 동기화가 완료되었습니다!');
		console.log(`📊 총 ${unfollowedUsers.length}명 언팔로우, ${followedUsers.length}명 팔로우`);
		
		// 최종 상태 표시
		console.log('\n--- 동기화 후 상태 ---');
		await showStatus(githubApi);
		
	} catch (error) {
		console.error('❌ 즉시 동기화 중 오류가 발생했습니다:', error);
	}
}

// 애플리케이션 시작 함수
async function main(): Promise<void> {
	console.log('GitHub Follower and Traitor 애플리케이션이 시작되었습니다!');
	console.log(`현재 시간: ${new Date().toLocaleString()}`);

	if (!githubToken) {
		console.error('GitHub 토큰이 설정되지 않았습니다. .env 파일에 GITHUB_TOKEN을 설정해주세요.');
		rl.close();
		return;
	}

	if (!username) {
		console.error('GitHub 사용자 이름이 설정되지 않았습니다. .env 파일에 GITHUB_USERNAME을 설정해주세요.');
		rl.close();
		return;
	}

	try {
		const githubApi = new GitHubAPI(githubToken);

		// 기본 상태 표시
		await showStatus(githubApi);

		// 메인 메뉴 표시
		await showMenu(githubApi);
	} catch (error) {
		console.error('GitHub API 오류:', error);
		rl.close();
	}
}

// 애플리케이션 실행
main().catch(error => console.error('애플리케이션 실행 중 오류:', error));