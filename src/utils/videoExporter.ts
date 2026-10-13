// Client-side Video & Presentation Exporter for Krishi Bandhu
// Supports:
// 1. WebM video export via HTML5 Canvas + MediaRecorder API
// 2. Offline Standalone Interactive HTML5 Video Player bundle download
// 3. Formatted printable presentation deck download

export interface SlideExportData {
  id: number;
  timeRange: string;
  badge: string;
  title: string;
  subtitle: string;
  narration: string;
  highlights: {
    label: string;
    desc: string;
    stat?: string;
  }[];
  caseStudy?: {
    farmer: string;
    crop: string;
    oldWay: string;
    newWay: string;
    benefit: string;
  };
}

/**
 * Renders a slide onto an offscreen canvas at 1280x720 HD resolution
 */
function drawSlideFrame(
  ctx: CanvasRenderingContext2D,
  slide: SlideExportData,
  progress: number, // 0 to 1 for this slide
  overallElapsedSec: number,
  totalDurationSec: number,
  lang: string
) {
  const width = 1280;
  const height = 720;

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#062d1a'); // Dark forest green
  grad.addColorStop(0.5, '#0b3d26');
  grad.addColorStop(1, '#021e10');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Decorative grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Top Header Bar
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(0, 0, width, 70);

  // Logo & App Name
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#34d399'; // Emerald-400
  ctx.fillText('🌾 KRISHI BANDHU', 50, 44);

  ctx.font = 'normal 15px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#a7f3d0';
  ctx.fillText('Digital APMC & Logistics Platform for Indian Farmers', 285, 44);

  // Live Timer & Status Indicator
  const mins = Math.floor(overallElapsedSec / 60);
  const secs = Math.floor(overallElapsedSec % 60);
  const timeStr = `${mins}:${secs < 10 ? '0' : ''}${secs} / 2:00`;
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = '#fbbf24'; // Amber-400
  ctx.fillText(`⏱ REC ${timeStr}`, width - 200, 44);

  // Slide Badge
  ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(50, 95, 340, 32, 6);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#6ee7b7';
  ctx.fillText(slide.badge.toUpperCase(), 65, 116);

  // Slide Number
  ctx.font = 'bold 14px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`SLIDE ${slide.id} OF 6 (${slide.timeRange})`, width - 260, 116);

  // Main Slide Title
  ctx.font = 'bold 34px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(slide.title, 50, 175, width - 100);

  // Subtitle
  ctx.font = 'normal 18px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(slide.subtitle, 50, 215, width - 100);

  // 3 Highlight Feature Cards
  const cardY = 260;
  const cardHeight = 220;
  const cardWidth = 360;
  const gap = 30;

  slide.highlights.forEach((h, i) => {
    const cardX = 50 + i * (cardWidth + gap);

    // Card background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 14);
    ctx.fill();
    ctx.stroke();

    // Stat Badge in top-right of card if exists
    if (h.stat) {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
      ctx.beginPath();
      ctx.roundRect(cardX + cardWidth - 110, cardY + 16, 95, 28, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#fde68a';
      ctx.fillText(h.stat, cardX + cardWidth - 95, cardY + 35);
    }

    // Number indicator
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(cardX + 32, cardY + 30, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${i + 1}`, cardX + 27, cardY + 35);

    // Card Title
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(h.label, cardX + 20, cardY + 80, cardWidth - 40);

    // Card Description (Multi-line wrap)
    ctx.font = 'normal 14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    wrapText(ctx, h.desc, cardX + 20, cardY + 115, cardWidth - 40, 22);
  });

  // Bottom Banner: Narration Subtitles bar
  ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(50, 500, width - 100, 145, 12);
  ctx.fill();
  ctx.stroke();

  // Voice Narration tag
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText('🎙️ AUDIO COMMENTARY / VOICE NARRATION:', 70, 530);

  // Narration text
  ctx.font = 'normal 15px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#e2e8f0';
  wrapText(ctx, slide.narration, 70, 560, width - 140, 24);

  // Bottom Progress Timeline Bar (at the very bottom)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, height - 16, width, 16);

  // Progress bar fill
  const overallProgress = Math.min(1, Math.max(0, overallElapsedSec / totalDurationSec));
  const pGrad = ctx.createLinearGradient(0, 0, width * overallProgress, 0);
  pGrad.addColorStop(0, '#10b981');
  pGrad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = pGrad;
  ctx.fillRect(0, height - 16, width * overallProgress, 16);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
}

/**
 * Records and downloads a real .webm video file from the presentation slides
 */
export async function generateAndDownloadVideoWebM(
  slides: SlideExportData[],
  lang: string,
  onProgress: (percent: number, statusText: string) => void
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      // Check MediaRecorder support
      if (typeof window.MediaRecorder === 'undefined') {
        throw new Error('MediaRecorder is not supported in this browser environment');
      }

      // Set up AudioContext for background audio tones during slides
      let audioCtx: AudioContext | null = null;
      let oscNode: OscillatorNode | null = null;
      let gainNode: GainNode | null = null;
      let audioDest: MediaStreamAudioDestinationNode | null = null;

      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
          audioDest = audioCtx.createMediaStreamDestination();
          gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Gentle soft volume
          gainNode.connect(audioDest);
        }
      } catch (e) {
        console.warn('AudioContext initialisation warning:', e);
      }

      // Capture canvas stream at 30fps
      const canvasStream = canvas.captureStream(30);
      const combinedStream = new MediaStream();

      // Add video track
      canvasStream.getVideoTracks().forEach((track) => combinedStream.addTrack(track));

      // Add audio track if available
      if (audioDest && audioDest.stream.getAudioTracks().length > 0) {
        audioDest.stream.getAudioTracks().forEach((track) => combinedStream.addTrack(track));
      }

      // Determine supported mime type
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];
      let selectedMime = '';
      for (const m of mimeTypes) {
        if (MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      const recorder = new MediaRecorder(combinedStream, selectedMime ? { mimeType: selectedMime } : undefined);
      const recordedChunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        try {
          const blob = new Blob(recordedChunks, { type: selectedMime || 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `Krishi_Bandhu_Farmer_Benefits_2Min_Video.webm`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 1500);

          if (audioCtx && audioCtx.state !== 'closed') {
            audioCtx.close().catch(() => {});
          }

          onProgress(100, 'Video generated and downloaded successfully!');
          resolve(true);
        } catch (err) {
          reject(err);
        }
      };

      recorder.start();

      // Render the slides:
      // For fast HD encoding that finishes in a few seconds while capturing every slide and timeline,
      // we record high frame-rate slices across all 6 slides (each slide represented with smooth animated progress)
      const totalSlides = slides.length;
      const secondsPerSlide = 3; // Fast-forward video preview recording so user doesn't wait 2 full minutes for export
      const fps = 25;
      const framesPerSlide = secondsPerSlide * fps;
      const totalFrames = totalSlides * framesPerSlide;

      let currentFrame = 0;

      const renderInterval = setInterval(() => {
        if (currentFrame >= totalFrames) {
          clearInterval(renderInterval);
          if (oscNode as OscillatorNode | null) {
            try { (oscNode as unknown as OscillatorNode).stop(); } catch (_) {}
          }
          recorder.stop();
          return;
        }

        const slideIndex = Math.min(totalSlides - 1, Math.floor(currentFrame / framesPerSlide));
        const frameInSlide = currentFrame % framesPerSlide;
        const progressInSlide = frameInSlide / framesPerSlide;
        
        // Virtual presentation timestamp (0 to 120 seconds)
        const virtualTotalSec = (currentFrame / totalFrames) * 120;

        // Slide transition chime sound
        if (frameInSlide === 0 && audioCtx && gainNode) {
          try {
            const chimeOsc = audioCtx.createOscillator();
            chimeOsc.type = 'sine';
            chimeOsc.frequency.setValueAtTime(440 + slideIndex * 60, audioCtx.currentTime);
            chimeOsc.connect(gainNode);
            chimeOsc.start();
            chimeOsc.stop(audioCtx.currentTime + 0.15);
          } catch (_) {}
        }

        const slide = slides[slideIndex];
        drawSlideFrame(ctx, slide, progressInSlide, virtualTotalSec, 120, lang);

        currentFrame++;
        const percent = Math.floor((currentFrame / totalFrames) * 100);
        onProgress(percent, `Rendering Slide ${slideIndex + 1} of ${totalSlides}: ${slide.title.substring(0, 30)}... (${percent}%)`);
      }, 1000 / fps);

    } catch (error) {
      console.error('Error during video recording:', error);
      reject(error);
    }
  });
}

/**
 * Downloads a complete standalone offline HTML5 Video & Presentation player
 * Can be sent via WhatsApp, opened on any Android/iOS phone or PC offline!
 */
export function downloadOfflinePresentationHTML(
  slides: SlideExportData[],
  lang: string
) {
  const slidesJson = JSON.stringify(slides, null, 2);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Krishi Bandhu - Farmer Express Presentation & Video Guide</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #09120c;
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .player-container {
      width: 100%;
      max-width: 1000px;
      background: #0f2015;
      border: 1px solid #1f4228;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .header-bar {
      background: #08160e;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1a3721;
    }
    .logo-badge {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid rgba(16, 185, 129, 0.4);
    }
    .stage {
      padding: 32px;
      min-height: 440px;
      background: linear-gradient(180deg, #0f2417 0%, #08160e 100%);
    }
    .slide-badge {
      font-size: 12px;
      font-weight: 800;
      color: #34d399;
      letter-spacing: 1px;
      margin-bottom: 12px;
      text-transform: uppercase;
    }
    .slide-title {
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 10px;
      line-height: 1.3;
    }
    .slide-subtitle {
      font-size: 15px;
      color: #94a3b8;
      margin-bottom: 24px;
      line-height: 1.5;
    }
    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(52, 211, 153, 0.2);
      border-radius: 12px;
      padding: 18px;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .card-stat {
      background: rgba(245, 158, 11, 0.2);
      color: #fcd34d;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 6px;
    }
    .card-desc {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.4;
    }
    .narration-box {
      background: rgba(2, 6, 23, 0.85);
      border-left: 4px solid #f59e0b;
      padding: 16px;
      border-radius: 8px;
      font-size: 14px;
      color: #e2e8f0;
      line-height: 1.5;
    }
    .controls {
      background: #08160e;
      padding: 16px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      border-top: 1px solid #1a3721;
    }
    .btn {
      background: #059669;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s;
    }
    .btn:hover { background: #047857; }
    .btn-secondary {
      background: #1e293b;
      color: #cbd5e1;
    }
    .btn-secondary:hover { background: #334155; }
    .progress-bar-container {
      width: 100%;
      height: 6px;
      background: #1e293b;
      border-radius: 9999px;
      overflow: hidden;
      margin-bottom: 12px;
      cursor: pointer;
    }
    .progress-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #10b981, #f59e0b);
      transition: width 0.3s;
    }
    .dots {
      display: flex;
      gap: 8px;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 9999px;
      background: #334155;
      cursor: pointer;
      border: none;
    }
    .dot.active {
      background: #10b981;
      width: 24px;
    }
  </style>
</head>
<body>
  <div class="player-container">
    <div class="header-bar">
      <div class="logo-badge">
        <h2 style="font-size: 18px; font-weight: 800; color: #34d399;">🌾 Krishi Bandhu</h2>
        <span class="badge">2-MINUTE VIDEO SHOWCASE</span>
      </div>
      <div id="timecode" style="font-family: monospace; font-size: 14px; color: #fbbf24;">0:00 / 2:00</div>
    </div>

    <div class="stage">
      <div class="progress-bar-container" id="progressBar">
        <div class="progress-fill" id="progressFill"></div>
      </div>

      <div class="slide-badge" id="slideBadge">PART 1: THE PROBLEM & OPPORTUNITY</div>
      <h1 class="slide-title" id="slideTitle">Loading presentation...</h1>
      <p class="slide-subtitle" id="slideSubtitle"></p>

      <div class="highlights-grid" id="highlightsGrid"></div>

      <div class="narration-box" id="narrationBox">
        <strong style="color: #f59e0b;">Voice Narration: </strong>
        <span id="narrationText"></span>
      </div>
    </div>

    <div class="controls">
      <div style="display: flex; gap: 10px; align-items: center;">
        <button class="btn" id="playBtn">▶ Play Video</button>
        <button class="btn btn-secondary" id="prevBtn">⏮ Prev</button>
        <button class="btn btn-secondary" id="nextBtn">⏭ Next</button>
      </div>

      <div class="dots" id="dotsContainer"></div>

      <div style="display: flex; gap: 10px;">
        <button class="btn btn-secondary" id="voiceToggle">🔊 Voice: On</button>
        <button class="btn btn-secondary" onclick="window.print()">🖨 Print / PDF</button>
      </div>
    </div>
  </div>

  <script>
    const slides = ${slidesJson};
    let currentSlide = 0;
    let isPlaying = true;
    let voiceEnabled = true;
    let timer = null;
    let elapsedSeconds = 0;
    const totalDuration = 120; // 2 minutes

    function updateSlide() {
      const s = slides[currentSlide];
      document.getElementById('slideBadge').innerText = s.badge;
      document.getElementById('slideTitle').innerText = s.title;
      document.getElementById('slideSubtitle').innerText = s.subtitle;
      document.getElementById('narrationText').innerText = s.narration;

      // Highlights
      const grid = document.getElementById('highlightsGrid');
      grid.innerHTML = '';
      s.highlights.forEach((h, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = \`
          <div class="card-top">
            <span style="font-weight: 700; color: #10b981;">#\${idx + 1}</span>
            \${h.stat ? \`<span class="card-stat">\${h.stat}</span>\` : ''}
          </div>
          <div class="card-title">\${h.label}</div>
          <div class="card-desc">\${h.desc}</div>
        \`;
        grid.appendChild(card);
      });

      // Update dots
      const dots = document.getElementById('dotsContainer');
      dots.innerHTML = '';
      slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'dot' + (i === currentSlide ? ' active' : '');
        d.onclick = () => { currentSlide = i; elapsedSeconds = i * 20; updateSlide(); };
        dots.appendChild(d);
      });

      // Speak narration using browser Web Speech API
      if (voiceEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(s.narration);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }

    function tick() {
      if (!isPlaying) return;
      elapsedSeconds++;
      if (elapsedSeconds >= totalDuration) {
        elapsedSeconds = 0;
        currentSlide = 0;
      } else {
        const targetSlide = Math.floor(elapsedSeconds / 20);
        if (targetSlide !== currentSlide && targetSlide < slides.length) {
          currentSlide = targetSlide;
          updateSlide();
        }
      }

      // Update timecode
      const m = Math.floor(elapsedSeconds / 60);
      const s = elapsedSeconds % 60;
      document.getElementById('timecode').innerText = \`\${m}:\${s < 10 ? '0' : ''}\${s} / 2:00\`;
      document.getElementById('progressFill').style.width = \`\${(elapsedSeconds / totalDuration) * 100}%\`;
    }

    document.getElementById('playBtn').onclick = () => {
      isPlaying = !isPlaying;
      document.getElementById('playBtn').innerText = isPlaying ? '⏸ Pause' : '▶ Play Video';
      if (!isPlaying && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      else if (isPlaying) updateSlide();
    };

    document.getElementById('prevBtn').onclick = () => {
      if (currentSlide > 0) {
        currentSlide--;
        elapsedSeconds = currentSlide * 20;
        updateSlide();
      }
    };

    document.getElementById('nextBtn').onclick = () => {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        elapsedSeconds = currentSlide * 20;
        updateSlide();
      }
    };

    document.getElementById('voiceToggle').onclick = () => {
      voiceEnabled = !voiceEnabled;
      document.getElementById('voiceToggle').innerText = voiceEnabled ? '🔊 Voice: On' : '🔇 Voice: Off';
      if (!voiceEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      else if (voiceEnabled) updateSlide();
    };

    updateSlide();
    timer = setInterval(tick, 1000);
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `Krishi_Bandhu_Farmer_Video_Presentation_Offline.html`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}
