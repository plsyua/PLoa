#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
로스트아크 대기실 OCR 닉네임 인식 스크립트
Tesseract + OpenCV + Hanspell 사용
"""

import sys
import json
import cv2
import numpy as np
import pytesseract
import re
import os
from PIL import Image
try:
    from hanspell import spell_checker
    HANSPELL_AVAILABLE = True
except ImportError:
    HANSPELL_AVAILABLE = False
    print("Warning: hanspell not available. Skipping spell check.", file=sys.stderr)

def preprocess_image(image_path):
    """
    이미지 전처리 파이프라인
    1. 이미지 로드
    2. 크기 조정 (확대)
    3. Grayscale 변환
    4. Binary threshold
    5. 형태학적 연산 (노이즈 제거)
    """
    try:
        # 이미지 로드
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"이미지를 로드할 수 없습니다: {image_path}")
        
        # 이미지 크기 확인
        height, width = image.shape[:2]
        print(f"Original image size: {width}x{height}", file=sys.stderr)
        
        # ROI 영역 설정 (우측 3분의 1 영역 - 플레이어 리스트 영역)
        roi_x = int(width * 0.65)  # 우측 35% 영역
        roi_y = int(height * 0.1)  # 상단 10% 제외
        roi_width = width - roi_x
        roi_height = int(height * 0.8)  # 하단 10% 제외
        
        roi = image[roi_y:roi_y + roi_height, roi_x:roi_x + roi_width]
        print(f"ROI size: {roi_width}x{roi_height}", file=sys.stderr)
        
        # 이미지 확대 (2.5배)
        scale_factor = 2.5
        new_width = int(roi_width * scale_factor)
        new_height = int(roi_height * scale_factor)
        scaled = cv2.resize(roi, (new_width, new_height), interpolation=cv2.INTER_CUBIC)
        
        # Grayscale 변환
        gray = cv2.cvtColor(scaled, cv2.COLOR_BGR2GRAY)
        
        # 대비 향상 (CLAHE - Contrast Limited Adaptive Histogram Equalization)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
        enhanced = clahe.apply(gray)
        
        # 가우시안 블러 적용 (노이즈 감소)
        blurred = cv2.GaussianBlur(enhanced, (1, 1), 0)
        
        # Binary threshold (Otsu 방법)
        _, binary = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # 형태학적 연산 (opening - 노이즈 제거, closing - 글자 연결)
        kernel = np.ones((2, 2), np.uint8)
        morphed = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
        morphed = cv2.morphologyEx(morphed, cv2.MORPH_OPEN, kernel)
        
        return morphed
        
    except Exception as e:
        print(f"이미지 전처리 실패: {str(e)}", file=sys.stderr)
        return None

def extract_nicknames_with_tesseract(processed_image):
    """
    Tesseract를 사용하여 텍스트 추출 및 닉네임 필터링
    """
    try:
        # Tesseract 설정
        custom_config = r'--oem 3 --psm 6 -l kor+eng'
        
        # PIL Image로 변환
        pil_image = Image.fromarray(processed_image)
        
        # OCR 수행
        extracted_text = pytesseract.image_to_string(pil_image, config=custom_config)
        print(f"Raw OCR result:\n{extracted_text}", file=sys.stderr)
        
        # 텍스트를 줄 단위로 분리하고 정리
        lines = extracted_text.strip().split('\n')
        potential_nicknames = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # 기본적인 정리
            # 특수문자 및 숫자 혼재된 텍스트는 제외하고 한글/영문 닉네임만 추출
            clean_line = re.sub(r'[^\w가-힣\s]', '', line)
            clean_line = clean_line.strip()
            
            if not clean_line:
                continue
                
            # 공백으로 분리하여 개별 단어 처리
            words = clean_line.split()
            for word in words:
                word = word.strip()
                
                # 닉네임 조건 검사
                if is_valid_nickname(word):
                    potential_nicknames.append(word)
        
        return list(set(potential_nicknames))  # 중복 제거
        
    except Exception as e:
        print(f"OCR 처리 실패: {str(e)}", file=sys.stderr)
        return []

def is_valid_nickname(text):
    """
    유효한 닉네임인지 검사
    로스트아크 닉네임 규칙:
    - 2-12자 길이
    - 한글, 영문, 숫자 조합
    - 특수문자는 기본적으로 제외
    """
    if not text or len(text) < 2 or len(text) > 12:
        return False
    
    # 한글, 영문, 숫자만 허용
    if not re.match(r'^[가-힣a-zA-Z0-9]+$', text):
        return False
    
    # 숫자만으로 이루어진 경우 제외
    if text.isdigit():
        return False
    
    # 너무 짧은 영문은 제외 (최소 3자)
    if re.match(r'^[a-zA-Z]+$', text) and len(text) < 3:
        return False
    
    # 일반적인 게임 UI 텍스트 제외
    exclude_words = [
        '레벨', '길드', '서버', '클래스', '전투력', '아이템레벨',
        'Level', 'Guild', 'Server', 'Class', 'Combat', 'Item',
        '로스트아크', 'LostArk', '대기실', '파티', 'Party',
        '모집', '참여', '신청', '수락', '거부', '나가기'
    ]
    
    for exclude in exclude_words:
        if exclude.lower() in text.lower():
            return False
    
    return True

def spell_check_nicknames(nicknames):
    """
    Hanspell을 사용한 맞춤법 검사 (선택적)
    """
    if not HANSPELL_AVAILABLE:
        return nicknames
    
    corrected_nicknames = []
    for nickname in nicknames:
        try:
            # 한글이 포함된 경우에만 맞춤법 검사
            if re.search(r'[가-힣]', nickname):
                result = spell_checker.check(nickname)
                corrected = result.checked
                
                # 변경사항이 있고 유효한 닉네임인 경우만 적용
                if corrected != nickname and is_valid_nickname(corrected):
                    print(f"맞춤법 교정: {nickname} -> {corrected}", file=sys.stderr)
                    corrected_nicknames.append(corrected)
                else:
                    corrected_nicknames.append(nickname)
            else:
                corrected_nicknames.append(nickname)
        except Exception as e:
            print(f"맞춤법 검사 실패 ({nickname}): {str(e)}", file=sys.stderr)
            corrected_nicknames.append(nickname)
    
    return corrected_nicknames

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
        # 파일 존재 확인
        if not os.path.exists(image_path):
            result = {
                "success": False,
                "error": f"이미지 파일을 찾을 수 없습니다: {image_path}"
            }
            print(json.dumps(result, ensure_ascii=False))
            sys.exit(1)
        
        print(f"OCR 처리 시작: {image_path}", file=sys.stderr)
        
        # 1. 이미지 전처리
        processed_image = preprocess_image(image_path)
        if processed_image is None:
            result = {
                "success": False,
                "error": "이미지 전처리에 실패했습니다."
            }
            print(json.dumps(result, ensure_ascii=False))
            sys.exit(1)
        
        # 2. OCR 수행
        nicknames = extract_nicknames_with_tesseract(processed_image)
        print(f"추출된 닉네임 후보: {nicknames}", file=sys.stderr)
        
        # 3. 맞춤법 검사 (선택적)
        corrected_nicknames = spell_check_nicknames(nicknames)
        
        # 4. 최종 결과 반환
        if corrected_nicknames:
            result = {
                "success": True,
                "nicknames": corrected_nicknames[:10],  # 최대 10개로 제한
                "total_found": len(corrected_nicknames)
            }
            print(f"최종 닉네임: {corrected_nicknames[:10]}", file=sys.stderr)
        else:
            result = {
                "success": False,
                "error": "닉네임을 찾을 수 없습니다. 이미지가 선명한지 확인해주세요."
            }
        
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