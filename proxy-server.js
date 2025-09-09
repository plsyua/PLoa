const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// 로스트아크 API 설정
const LOSTARK_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwMTU5NTYifQ.fOc6qiM5XMOEb-PdpWHv-c-Z1-s0T5EqFHHOsffnBhQODGBDKyYcgvn4ehblVViQRz6cpHaO8AwjhSKOTFkX3BAAJrPdkMYSgupvYMbAS1DERAmX6Hm_5gScTndrwac08FlKkujonFHQ__3V1TyGKrzI74Xkl209oEc1Xit7drgpHzMFGbMD5EzJ9e6pb3EBhcfyldCT5tPEmxsg-m4Sw33hWxaETYRLnTgzSmy6_5Qw6rqLLETgEsYruRY1V_HLD3yOwYjOxThR2DLpU671n5Ktovy-6roHkuMWJCBob9U8oxMRchgAa7lSVm4WvPT7xoLk_yN-KQtQTLH5gUeGxg';
const LOSTARK_API_URL = 'https://developer-lostark.game.onstove.com';

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

// OCR 닉네임 인식 엔드포인트
app.post('/api/ocr-nicknames', upload.single('image'), async (req, res) => {
  let tempFilePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: '이미지 파일이 업로드되지 않았습니다.' 
      });
    }

    tempFilePath = req.file.path;
    console.log('📷 OCR 처리 시작:', tempFilePath);

    // Python OCR 스크립트 실행 (실제 버전)
    const pythonProcess = spawn('./ocr_env/bin/python', ['ocr_script.py', tempFilePath], {
      cwd: __dirname
    });

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      // 임시 파일 정리
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
        } catch (cleanupError) {
          console.warn('임시 파일 삭제 실패:', cleanupError.message);
        }
      }

      if (code !== 0) {
        console.error('❌ OCR 처리 실패:', error);
        return res.status(500).json({
          success: false,
          error: 'OCR 처리 중 오류가 발생했습니다.',
          details: error
        });
      }

      try {
        // Python 스크립트 결과 파싱
        const ocrResult = JSON.parse(result.trim());
        
        if (ocrResult.success && ocrResult.nicknames && ocrResult.nicknames.length > 0) {
          console.log('✅ OCR 처리 성공:', ocrResult.nicknames);
          res.json({
            success: true,
            nicknames: ocrResult.nicknames,
            processedImage: ocrResult.processedImage || null
          });
        } else {
          console.log('⚠️ 닉네임 인식 실패');
          res.json({
            success: false,
            error: '닉네임을 인식할 수 없습니다. 이미지가 선명한지 확인해주세요.'
          });
        }
      } catch (parseError) {
        console.error('❌ OCR 결과 파싱 실패:', parseError.message);
        res.status(500).json({
          success: false,
          error: 'OCR 결과 처리 중 오류가 발생했습니다.',
          details: parseError.message
        });
      }
    });

  } catch (error) {
    // 임시 파일 정리
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.warn('임시 파일 삭제 실패:', cleanupError.message);
      }
    }

    console.error('❌ OCR 엔드포인트 오류:', error.message);
    res.status(500).json({
      success: false,
      error: 'OCR 처리 중 서버 오류가 발생했습니다.',
      details: error.message
    });
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