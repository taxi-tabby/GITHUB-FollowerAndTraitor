import axios from 'axios';

/**
 * GitHub API와 상호작용하기 위한 클래스
 */
export class GitHubAPI {
	private token: string;
	private baseUrl: string = 'https://api.github.com';

	/**
	 * GitHubAPI 클래스의 생성자
	 * @param token GitHub API 토큰
	 */
	constructor(token: string) {
		this.token = token;
	}
	/**
	 * 사용자의 팔로워 목록을 가져옵니다. (페이지네이션 처리)
	 * @param username GitHub 사용자명
	 * @returns 팔로워 사용자 목록
	 */
	async getFollowers(username: string): Promise<any[]> {
		try {
			let allFollowers: any[] = [];
			let page = 1;
			const perPage = 100; // 한 페이지당 최대 100개

			while (true) {
				const response = await axios.get(`${this.baseUrl}/users/${username}/followers`, {
					headers: {
						'Authorization': `token ${this.token}`,
						'Accept': 'application/vnd.github.v3+json'
					},
					params: {
						page: page,
						per_page: perPage
					}
				});

				const followers = response.data;
				if (followers.length === 0) {
					break; // 더 이상 데이터가 없으면 종료
				}

				allFollowers = allFollowers.concat(followers);
				
				// 받은 데이터가 perPage보다 적으면 마지막 페이지
				if (followers.length < perPage) {
					break;
				}

				page++;
			}

			return allFollowers;
		} catch (error) {
			console.error('팔로워 목록을 가져오는 중 오류가 발생했습니다:', error);
			return [];
		}
	}
	/**
	 * 사용자가 팔로우하는 사람들의 목록을 가져옵니다. (페이지네이션 처리)
	 * @param username GitHub 사용자명
	 * @returns 팔로잉 사용자 목록
	 */
	async getFollowing(username: string): Promise<any[]> {
		try {
			let allFollowing: any[] = [];
			let page = 1;
			const perPage = 100; // 한 페이지당 최대 100개

			while (true) {
				const response = await axios.get(`${this.baseUrl}/users/${username}/following`, {
					headers: {
						'Authorization': `token ${this.token}`,
						'Accept': 'application/vnd.github.v3+json'
					},
					params: {
						page: page,
						per_page: perPage
					}
				});

				const following = response.data;
				if (following.length === 0) {
					break; // 더 이상 데이터가 없으면 종료
				}

				allFollowing = allFollowing.concat(following);
				
				// 받은 데이터가 perPage보다 적으면 마지막 페이지
				if (following.length < perPage) {
					break;
				}

				page++;
			}

			return allFollowing;
		} catch (error) {
			console.error('팔로잉 목록을 가져오는 중 오류가 발생했습니다:', error);
			return [];
		}
	}

	/**
	 * 특정 사용자를 팔로우합니다.
	 * @param username 팔로우할 사용자 이름
	 * @returns 성공 여부
	 */
	async followUser(username: string): Promise<boolean> {
		try {
			const response = await axios.put(`${this.baseUrl}/user/following/${username}`, {}, {
				headers: {
					'Authorization': `token ${this.token}`,
					'Accept': 'application/vnd.github.v3+json'
				}
			});
			
			// 성공적인 응답은 204 No Content입니다
			const isSuccess = response.status === 204;
			if (isSuccess) {
				console.log(`🔔 ${username} 사용자를 성공적으로 팔로우했습니다.`);
			}
			return isSuccess;
		} catch (error) {
			console.error(`❌ ${username} 사용자를 팔로우하는 중 오류가 발생했습니다:`, error);
			return false;
		}
	}

	/**
	 * 특정 사용자를 언팔로우합니다.
	 * @param username 언팔로우할 사용자 이름
	 * @returns 성공 여부
	 */
	async unfollowUser(username: string): Promise<boolean> {
		try {
			const response = await axios.delete(`${this.baseUrl}/user/following/${username}`, {
				headers: {
					'Authorization': `token ${this.token}`,
					'Accept': 'application/vnd.github.v3+json'
				}
			});
			
			// 성공적인 응답은 204 No Content입니다
			const isSuccess = response.status === 204;
			if (isSuccess) {
				console.log(`🔔 ${username} 사용자를 성공적으로 언팔로우했습니다.`);
			}
			return isSuccess;
		} catch (error) {
			console.error(`❌ ${username} 사용자를 언팔로우하는 중 오류가 발생했습니다:`, error);
			return false;
		}
	}

	/**
	 * 팔로워 중에 당신이 팔로우하지 않는 사람들을 찾습니다.
	 * @param username GitHub 사용자명
	 * @returns 당신이 팔로우하지 않는 팔로워 목록
	 */
	async findNonFollowingBack(username: string): Promise<any[]> {
		const followers = await this.getFollowers(username);
		const following = await this.getFollowing(username);

		// 팔로잉 사용자의 로그인 이름으로 Set 생성
		const followingSet = new Set(following.map((user: any) => user.login));

		// 팔로워 중 팔로잉하지 않는 사용자 필터링
		return followers.filter((follower: any) => !followingSet.has(follower.login));
	}

	/**
	 * 당신이 팔로우하는 사람 중 당신을 팔로우하지 않는 사람들을 찾습니다.
	 * @param username GitHub 사용자명
	 * @returns 당신을 팔로우하지 않는 팔로잉 목록
	 */
	async findNotFollowingYou(username: string): Promise<any[]> {
		const followers = await this.getFollowers(username);
		const following = await this.getFollowing(username);

		// 팔로워 사용자의 로그인 이름으로 Set 생성
		const followerSet = new Set(followers.map((user: any) => user.login));

		// 팔로잉 중 팔로워가 아닌 사용자 필터링
		return following.filter((user: any) => !followerSet.has(user.login));
	}

	/**
	 * 팔로워 중 팔로우하지 않는 모든 사용자를 팔로우합니다.
	 * @param username GitHub 사용자명
	 * @returns 성공적으로 팔로우한 사용자 목록
	 */
	async followAllNonFollowingBack(username: string): Promise<any[]> {
		const nonFollowingBack = await this.findNonFollowingBack(username);
		const successfulFollows: any[] = [];
		
		console.log(`🔄 팔로우하지 않은 ${nonFollowingBack.length}명의 팔로워를 팔로우합니다...`);
		
		for (const user of nonFollowingBack) {
			const success = await this.followUser(user.login);
			if (success) {
				successfulFollows.push(user);
			}
			// API 속도 제한을 피하기 위한 짧은 대기
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
		
		return successfulFollows;
	}

	/**
	 * 팔로우하지만 나를 팔로우하지 않는 모든 사용자를 언팔로우합니다.
	 * @param username GitHub 사용자명
	 * @returns 성공적으로 언팔로우한 사용자 목록
	 */
	async unfollowAllNotFollowingYou(username: string): Promise<any[]> {
		const notFollowingYou = await this.findNotFollowingYou(username);
		const successfulUnfollows: any[] = [];
		
		console.log(`🔄 나를 팔로우하지 않는 ${notFollowingYou.length}명의 사용자를 언팔로우합니다...`);
		
		for (const user of notFollowingYou) {
			const success = await this.unfollowUser(user.login);
			if (success) {
				successfulUnfollows.push(user);
			}
			// API 속도 제한을 피하기 위한 짧은 대기
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
		
		return successfulUnfollows;
	}
}