import fs from 'fs';
import path from 'path';

/**
 * 저장된 진행 상태를 관리하는 인터페이스
 */
export interface SaveData {
	/** 마지막으로 처리한 단계 ('unfollow' | 'follow' | 'completed') */
	lastStep: 'unfollow' | 'follow' | 'completed';
	/** 언팔로우 단계에서 처리한 사용자 인덱스 */
	unfollowIndex: number;
	/** 팔로우 단계에서 처리한 사용자 인덱스 */
	followIndex: number;
	/** 언팔로우할 사용자 목록 */
	usersToUnfollow: string[];
	/** 팔로우할 사용자 목록 */
	usersToFollow: string[];
	/** 저장 시간 */
	savedAt: string;
}

/**
 * SaveData 파일을 관리하는 클래스
 */
export class SaveDataManager {
	private saveFilePath: string;

	constructor(saveFilePath: string = 'savedata.json') {
		// 절대 경로로 변환
		this.saveFilePath = path.isAbsolute(saveFilePath) 
			? saveFilePath 
			: path.join(process.cwd(), saveFilePath);
	}

	/**
	 * savedata.json 파일이 존재하는지 확인
	 */
	hasSaveData(): boolean {
		return fs.existsSync(this.saveFilePath);
	}

	/**
	 * savedata.json 파일을 읽어옴
	 */
	loadSaveData(): SaveData | null {
		try {
			if (!this.hasSaveData()) {
				return null;
			}

			const data = fs.readFileSync(this.saveFilePath, 'utf-8');
			const saveData: SaveData = JSON.parse(data);
			
			console.log('📂 저장된 진행 상태를 발견했습니다.');
			console.log(`   저장 시간: ${saveData.savedAt}`);
			console.log(`   마지막 단계: ${saveData.lastStep}`);
			console.log(`   언팔로우 진행: ${saveData.unfollowIndex}/${saveData.usersToUnfollow.length}`);
			console.log(`   팔로우 진행: ${saveData.followIndex}/${saveData.usersToFollow.length}`);
			
			return saveData;
		} catch (error) {
			console.error('❌ savedata.json 파일을 읽는 중 오류가 발생했습니다:', error);
			return null;
		}
	}

	/**
	 * 진행 상태를 savedata.json에 저장
	 */
	saveSaveData(saveData: SaveData): void {
		try {
			saveData.savedAt = new Date().toISOString();
			const jsonData = JSON.stringify(saveData, null, 2);
			fs.writeFileSync(this.saveFilePath, jsonData, 'utf-8');
			console.log('💾 진행 상태를 저장했습니다.');
		} catch (error) {
			console.error('❌ savedata.json 파일을 저장하는 중 오류가 발생했습니다:', error);
		}
	}

	/**
	 * savedata.json 파일을 삭제
	 */
	deleteSaveData(): void {
		try {
			if (this.hasSaveData()) {
				fs.unlinkSync(this.saveFilePath);
				console.log('🗑️  savedata.json 파일을 삭제했습니다.');
			}
		} catch (error) {
			console.error('❌ savedata.json 파일을 삭제하는 중 오류가 발생했습니다:', error);
		}
	}

	/**
	 * 새로운 SaveData 객체를 생성
	 */
	createNewSaveData(usersToUnfollow: string[], usersToFollow: string[]): SaveData {
		return {
			lastStep: 'unfollow',
			unfollowIndex: 0,
			followIndex: 0,
			usersToUnfollow,
			usersToFollow,
			savedAt: new Date().toISOString()
		};
	}
}
