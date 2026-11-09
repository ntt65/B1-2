/**
 * @file permissions.js
 * @description 사용자 로그인 상태와 로컬 모드 여부를 조합하여 아이템 쓰기/수정/삭제 권한 보유 여부를 판별하는 유틸
 */

export function canWriteItems(user, localMode = false) {	// 유저 객체와 로컬모드 플래그 수신
  return Boolean(user) || localMode	// 로그인된 유저가 있거나, 로컬 학습 모드인 경우 쓰기 권한 부여
}
