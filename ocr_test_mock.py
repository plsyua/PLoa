#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
OCR 테스트용 목업 스크립트
실제 OCR 라이브러리 없이 테스트 데이터 반환
"""

import sys
import json
import time

def main():
    if len(sys.argv) < 2:
        result = {
            "success": False,
            "error": "이미지 파일 경로가 필요합니다."
        }
        print(json.dumps(result, ensure_ascii=False))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    try:
        # 목업 처리 시뮬레이션 (2초 대기)
        print(f"OCR 목업 처리 시작: {image_path}", file=sys.stderr)
        time.sleep(2)
        
        # 테스트용 닉네임 데이터
        mock_nicknames = [
            "테스트유저1",
            "TestPlayer",
            "로아마스터",
            "PvpKing",
            "골드헌터",
            "RedDragon"
        ]
        
        result = {
            "success": True,
            "nicknames": mock_nicknames,
            "total_found": len(mock_nicknames)
        }
        
        print(f"목업 닉네임 반환: {mock_nicknames}", file=sys.stderr)
        print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        result = {
            "success": False,
            "error": f"OCR 처리 중 오류 발생: {str(e)}"
        }
        print(json.dumps(result, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    main()