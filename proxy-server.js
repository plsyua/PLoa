const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
require('dotenv').config();

const app = express();
const PORT = 3001;

// API 설정
const LOSTARK_API_KEY = process.env.LOSTARK_API_KEY;
const LOSTARK_API_URL = process.env.LOSTARK_API_URL;
const CLOVA_OCR_API_URL = process.env.CLOVA_OCR_API_URL;
const CLOVA_OCR_SECRET_KEY = process.env.CLOVA_OCR_SECRET_KEY;

// CORS 미들웨어
app.use(cors());

// JSON 파싱 미들웨어
app.use(express.json());

// 파일 업로드 설정
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // 이미지 파일만 허용
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
    }
  }
});

// uploads 폴더 생성
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// 닉네임 검증 유틸리티 함수들
function isValidNickname(text) {
  // 유효한 닉네임인지 검사
  // 로스트아크 닉네임 규칙: 2-12자 길이, 한글/영문/숫자 조합
  if (!text || text.length < 2 || text.length > 12) {
    return false;
  }

  // 한글, 영문, 숫자만 허용
  if (!/^[가-힣a-zA-Z0-9]+$/.test(text)) {
    return false;
  }

  // 숫자만으로 이루어진 경우 제외
  if (/^\d+$/.test(text)) {
    return false;
  }

  // 숫자+한글 조합 제외 (예: "1번", "2파티" 등)
  if (/^\d+[가-힣]+$/.test(text)) {
    return false;
  }

  // 너무 짧은 영문은 제외 (최소 3자)
  if (/^[a-zA-Z]+$/.test(text) && text.length < 3) {
    return false;
  }

  // 게임 UI 텍스트 제외
  const excludeWords = [
    '레벨', '길드', '서버', '클래스', '전투력', '아이템레벨', '아이템',
    'Level', 'Guild', 'Server', 'Class', 'Combat', 'Item', 'Lv',
    '로스트아크', 'LostArk', '대기실', '파티', 'Party', '방', 'Room',
    '모집', '참여', '신청', '수락', '거부', '나가기', '입장', '대기',
    '시작', '준비', '완료', '취소', '확인', '닫기', '열기',
    '채팅', '설정', '옵션', '도움말', '정보', '상세', '보기',
    '선택', '변경', '수정', '삭제', '추가', '저장', '불러오기',
    '검색', '돋보기', '아이콘', '카드', '캐릭터', '정보보기',
    '클릭', '터치', '선택됨', '활성', '비활성',
    '1번', '2번', '3번', '4번', '5번', '6번', '7번', '8번', '번째', '팀', '탭',
    // 파티 관련 UI 텍스트
    '1번 파티', '2번 파티', '3번 파티', '4번 파티',
    '파티 모집', '모집 설정', '상세 정보', '정보 보기', '참가자', '신청자'
  ];

  const lowerText = text.toLowerCase();
  for (const exclude of excludeWords) {
    if (lowerText.includes(exclude.toLowerCase())) {
      return false;
    }
  }

  // 정규식 패턴으로 UI 텍스트 제외
  // 숫자+번 패턴 (1번, 2번 등)
  if (/^\d+번$/.test(text)) {
    return false;
  }

  // 숫자+번+파티 패턴 (1번 파티, 2번 파티 등)
  if (/^\d+번\s*파티$/.test(text)) {
    return false;
  }

  // 단순 1-2자리 숫자만 (1, 2, 3, 4 등)
  if (/^\d+$/.test(text) && text.length <= 2) {
    return false;
  }

  // 대괄호로 감싸진 텍스트 ([노말], [하드] 등)
  if (/^\[.+\]$/.test(text)) {
    return false;
  }

  // 숫자-숫자 패턴 (1-1, 1-2, 2-1 등)
  if (/^\d+-\d+$/.test(text)) {
    return false;
  }

  // 반복 문자 제외 (같은 문자 3개 이상 연속)
  if (/(.)\1{2,}/.test(text)) {
    return false;
  }

  return true;
}

function cleanAndValidateText(text) {
  // 추출된 텍스트를 정리하고 유효한 닉네임만 추출
  if (!text) return [];

  // 기본 정리
  text = text.trim();

  // 특수문자 제거하고 한글/영문/숫자만 보존
  const cleanText = text.replace(/[^\w가-힣\s]/g, ' ').replace(/\s+/g, ' ').trim();

  if (!cleanText) return [];

  // 공백으로 분리하여 개별 단어 검사
  const words = cleanText.split(' ');
  const validNicknames = [];

  for (const word of words) {
    const trimmedWord = word.trim();
    if (isValidNickname(trimmedWord)) {
      validNicknames.push(trimmedWord);
    }
  }

  return validNicknames;
}

// 로스트아크 대기실 영역 크롭핑 함수 (Sharp 안정화 버전)
async function cropWaitingRoomArea(imagePath) {
  try {
    console.log(`📂 이미지 파일 처리: ${imagePath}`);
    
    // 1단계: 이미지를 버퍼로 안전하게 로드
    const originalBuffer = await fs.promises.readFile(imagePath);
    const image = sharp(originalBuffer);
    const metadata = await image.metadata();
    const { width, height, format } = metadata;
    
    console.log(`📐 이미지 정보: ${width}x${height}px, 포맷: ${format}`);
    
    // 2단계: 최적화된 ROI 설정 (최적 밸런스로 정확한 대기실 플레이어 영역)
    const margin = 20; // 20px 안전 여백
    const baseRoi = {
      left: Math.floor(width * 0.65),   // 65% (닉네임 짤림 방지)
      top: Math.floor(height * 0.28),   // 28% (균형잡힌 상단 제거)
      width: Math.floor(width * 0.32),  // 32% (좌측 확장)
      height: Math.floor(height * 0.30) // 30% (집중된 플레이어 목록 영역)
    };
    
    // 3단계: 안전 여백을 포함한 최종 ROI
    const roi = {
      left: Math.max(0, baseRoi.left),
      top: Math.max(0, baseRoi.top),
      width: Math.min(baseRoi.width - margin, width - baseRoi.left - margin),
      height: Math.min(baseRoi.height - margin, height - baseRoi.top - margin)
    };
    
    // 4단계: 엄격한 유효성 검사
    if (roi.width <= 50 || roi.height <= 50) {
      throw new Error(`ROI too small: ${roi.width}x${roi.height}px. Minimum required: 50x50px`);
    }
    
    if (roi.left + roi.width >= width || roi.top + roi.height >= height) {
      throw new Error(`ROI exceeds boundaries: (${roi.left + roi.width}, ${roi.top + roi.height}) >= (${width}, ${height})`);
    }
    
    console.log(`✂️ 기본 ROI:`, baseRoi);
    console.log(`🛡️ 안전 ROI (여백 ${margin}px):`, roi);
    console.log(`✅ 경계 확인: ${roi.left + roi.width} < ${width}, ${roi.top + roi.height} < ${height}`);
    
    // 5단계: 타임스탬프 파일명 생성
    const timestamp = new Date().toISOString()
      .replace(/[-T:\.Z]/g, '')
      .substring(0, 14);
    const croppedFilename = `crop_${timestamp}.jpg`;
    const croppedPath = path.join(__dirname, 'cropped_images', croppedFilename);
    
    // 6단계: 새로운 Sharp 인스턴스로 크롭핑 (메모리 안전)
    const croppedImage = sharp(originalBuffer);
    
    // 저장용 크롭
    await croppedImage
      .clone()
      .extract(roi)
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(croppedPath);
    
    console.log(`💾 크롭된 이미지 저장: ${croppedPath}`);
    
    // CLOVA OCR 전송용 버퍼 (별도 인스턴스)
    const buffer = await sharp(originalBuffer)
      .extract(roi)
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();
    
    console.log(`📤 OCR 전송용 버퍼 생성: ${buffer.length} bytes`);
    
    return {
      buffer: buffer,
      savedPath: croppedPath,
      croppedSize: {
        width: roi.width,
        height: roi.height
      }
    };
    
  } catch (error) {
    console.error('❌ 이미지 크롭핑 상세 오류:', {
      message: error.message,
      stack: error.stack,
      imagePath: imagePath
    });
    throw new Error(`이미지 크롭핑 실패: ${error.message}`);
  }
}

// 이미지 프록시 엔드포인트
app.get('/proxy-image', async (req, res) => {
  try {
    const imageUrl = req.query.url;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'URL 파라미터가 필요합니다' });
    }

    console.log('🖼️ 프록시 이미지 요청:', imageUrl);

    // 로스트아크 이미지 서버에서 이미지 가져오기
    const response = await axios.get(imageUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Referer': 'https://lostark.game.onstove.com/',
        'Origin': 'https://lostark.game.onstove.com'
      },
      timeout: 10000
    });

    // 응답 헤더 설정
    res.set({
      'Content-Type': response.headers['content-type'] || 'image/png',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    });

    // 스트림으로 이미지 전달
    response.data.pipe(res);

  } catch (error) {
    console.error('❌ 프록시 이미지 요청 실패:', error.message);
    res.status(500).json({ error: '이미지 프록시 실패', details: error.message });
  }
});

// 사사게(사건사고게시판) 이력 검색 엔드포인트
app.get('/api/sasage-history/:characterName', async (req, res) => {
  try {
    const { characterName } = req.params;

    if (!characterName) {
      return res.status(400).json({
        success: false,
        error: '캐릭터명이 필요합니다.'
      });
    }

    console.log('🔍 사사게 이력 검색:', characterName);

    // 사사게 검색 API 호출
    const response = await axios.post('https://api.sasagefind.com/sasagefind', {
      character_name: characterName,
      search_type: 'title' // 제목에서 검색
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    console.log('✅ 사사게 API 응답:', {
      status: response.status,
      resultCount: response.data?.results?.length || 0
    });

    // 결과 개수 반환
    const count = response.data?.results?.length || 0;
    res.json({
      success: true,
      characterName,
      count,
      searchDate: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 사사게 검색 실패:', error.message);

    let errorMessage = '사사게 이력 검색 중 오류가 발생했습니다.';
    let statusCode = 500;

    if (error.response) {
      statusCode = error.response.status;
      errorMessage = `사사게 API 오류 (${error.response.status})`;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = '검색 시간이 초과되었습니다.';
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      characterName: req.params.characterName,
      count: 0
    });
  }
});

// NAVER CLOVA OCR 닉네임 인식 엔드포인트
app.post('/api/ocr-nicknames', upload.single('image'), async (req, res) => {
  let tempFilePath = null;
  
  try {
    // API 설정 검증
    if (!CLOVA_OCR_API_URL || !CLOVA_OCR_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        error: 'NAVER CLOVA OCR API 설정이 필요합니다.',
        details: 'CLOVA_OCR_API_URL 또는 CLOVA_OCR_SECRET_KEY가 설정되지 않았습니다.'
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: '이미지 파일이 업로드되지 않았습니다.' 
      });
    }

    tempFilePath = req.file.path;
    console.log('📷 NAVER CLOVA OCR 처리 시작:', tempFilePath);

    // 1. 대기실 영역 크롭핑
    console.log('✂️ 대기실 영역 크롭핑 시작...');
    const croppedResult = await cropWaitingRoomArea(tempFilePath);
    console.log(`✅ 크롭핑 완료: ${croppedResult.croppedSize.width}x${croppedResult.croppedSize.height}px`);

    // NAVER CLOVA OCR API 요청을 위한 FormData 구성
    const FormData = require('form-data');
    const formData = new FormData();

    // OCR 요청 메시지 구성
    const message = {
      version: "V2",
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
      images: [
        {
          format: path.extname(req.file.originalname).substring(1).toLowerCase() || 'jpg',
          name: 'lostark_screenshot'
        }
      ]
    };

    // FormData에 JSON 메시지와 크롭된 이미지 추가
    formData.append('message', JSON.stringify(message));
    formData.append('file', croppedResult.buffer, {
      filename: 'cropped_lostark_waiting_room.jpg',
      contentType: 'image/jpeg'
    });

    console.log('🔗 CLOVA OCR API 요청:', {
      url: CLOVA_OCR_API_URL,
      messageId: message.requestId,
      imageFormat: message.images[0].format
    });

    // NAVER CLOVA OCR API 호출
    const response = await axios.post(CLOVA_OCR_API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-OCR-SECRET': CLOVA_OCR_SECRET_KEY
      },
      timeout: 30000 // 30초 타임아웃
    });

    console.log('✅ CLOVA OCR API 응답:', {
      status: response.status,
      fieldsCount: response.data.images?.[0]?.fields?.length || 0
    });

    // CLOVA OCR API 응답을 JSON 파일로 저장
    try {
      const timestamp = new Date().toISOString()
        .replace(/[-T:\.Z]/g, '')
        .substring(0, 14);
      const jsonFilename = `ocr_response_${timestamp}.json`;
      const jsonPath = path.join(__dirname, 'ocr_responses', jsonFilename);
      
      // 전체 응답을 JSON 파일로 저장
      await fs.promises.writeFile(
        jsonPath, 
        JSON.stringify(response.data, null, 2), 
        'utf8'
      );
      
      console.log(`💾 CLOVA OCR 응답 JSON 저장: ${jsonPath}`);
    } catch (saveError) {
      console.warn('⚠️ JSON 응답 저장 실패:', saveError.message);
    }

    // 응답 데이터에서 텍스트 추출 및 닉네임 필터링
    const extractedNicknames = [];
    
    if (response.data && response.data.images && response.data.images.length > 0) {
      const imageData = response.data.images[0];
      
      if (imageData.fields && Array.isArray(imageData.fields)) {
        console.log(`📝 감지된 텍스트 필드 ${imageData.fields.length}개 처리 중...`);
        
        for (const field of imageData.fields) {
          if (field.inferText) {
            const text = field.inferText.trim();
            const confidence = field.inferConfidence || 0;
            
            console.log(`🔍 텍스트: "${text}" (신뢰도: ${confidence})`);
            
            // 신뢰도 임계값 적용 (0.3 이상)
            if (confidence >= 0.3) {
              const validNicknames = cleanAndValidateText(text);
              extractedNicknames.push(...validNicknames);
            }
          }
        }
      }
    }

    // 중복 제거 및 최대 10개로 제한
    const uniqueNicknames = [...new Set(extractedNicknames)].slice(0, 10);

    // 결과 반환
    if (uniqueNicknames.length > 0) {
      console.log('✅ OCR 처리 성공:', uniqueNicknames);
      res.json({
        success: true,
        nicknames: uniqueNicknames,
        totalFound: uniqueNicknames.length,
        engine: 'NAVER_CLOVA_OCR',
        croppedImage: croppedResult.savedPath,
        croppedSize: croppedResult.croppedSize
      });
    } else {
      console.log('⚠️ 유효한 닉네임을 찾지 못했습니다.');
      res.json({
        success: false,
        error: '닉네임을 인식할 수 없습니다. 이미지가 선명한지 확인해주세요.',
        engine: 'NAVER_CLOVA_OCR',
        croppedImage: croppedResult.savedPath,
        croppedSize: croppedResult.croppedSize
      });
    }

  } catch (error) {
    console.error('❌ NAVER CLOVA OCR 처리 실패:', error.message);
    
    let errorMessage = 'OCR 처리 중 오류가 발생했습니다.';
    let statusCode = 500;

    if (error.response) {
      // API 응답 오류
      statusCode = error.response.status;
      errorMessage = `CLOVA OCR API 오류 (${error.response.status})`;
      console.error('API 응답 오류:', error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      // 타임아웃 오류
      errorMessage = 'OCR 처리 시간이 초과되었습니다. 더 작은 이미지로 다시 시도해주세요.';
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      // 네트워크 오류
      errorMessage = '네트워크 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: error.message,
      engine: 'NAVER_CLOVA_OCR'
    });

  } finally {
    // 임시 파일 정리
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log('🗑️ 임시 파일 삭제:', tempFilePath);
      } catch (cleanupError) {
        console.warn('⚠️ 임시 파일 삭제 실패:', cleanupError.message);
      }
    }
  }
});

// 로스트아크 API 프록시 엔드포인트
app.get('/api/*', async (req, res) => {
  try {
    const apiPath = req.path.replace('/api', '');
    const fullUrl = `${LOSTARK_API_URL}${apiPath}`;
    
    console.log('🔗 로스트아크 API 프록시 요청:', fullUrl);

    const response = await axios.get(fullUrl, {
      headers: {
        'authorization': `bearer ${LOSTARK_API_KEY}`,
        'accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000,
      params: req.query,
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false
      })
    });

    // CORS 헤더 설정
    res.set({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });

    res.json(response.data);

  } catch (error) {
    console.error('❌ 로스트아크 API 프록시 요청 실패:', error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: '로스트아크 API 요청 실패',
        status: error.response.status,
        statusText: error.response.statusText,
        details: error.response.data
      });
    } else {
      res.status(500).json({
        error: '프록시 서버 오류',
        details: error.message
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 프록시 서버가 포트 ${PORT}에서 실행 중입니다`);
  console.log(`- 이미지 프록시: http://localhost:${PORT}/proxy-image`);
  console.log(`- API 프록시: http://localhost:${PORT}/api/*`);
});