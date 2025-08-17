const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

// CORS 미들웨어
app.use(cors());

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

app.listen(PORT, () => {
  console.log(`🚀 이미지 프록시 서버가 포트 ${PORT}에서 실행 중입니다`);
});