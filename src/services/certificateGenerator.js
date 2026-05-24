/**
 * Certificate Generator
 * Renders a premium certificate to canvas then exports as PDF
 */
import { jsPDF } from 'jspdf';

/**
 * Draw certificate on an offscreen canvas and export to PDF
 * @param {Object} opts
 * @param {string} opts.name - Recipient name
 * @param {string} opts.course - e.g. "Technical Interview Mastery"
 * @param {string} opts.company - e.g. "Google"
 * @param {number} opts.score - Overall score %
 * @param {string} opts.date - e.g. "14 May 2025"
 * @param {string} opts.certId - Unique certificate ID
 */
export async function generateCertificate({ name, course, company, score, date, certId }) {
  const W = 1200, H = 850;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  /* ── Background ── */
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#080d1a');
  bg.addColorStop(0.5, '#0f1729');
  bg.addColorStop(1, '#080d1a');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  /* ── Decorative border ── */
  ctx.strokeStyle = 'rgba(91,104,243,0.6)'; ctx.lineWidth = 3;
  roundRect(ctx, 30, 30, W - 60, H - 60, 24); ctx.stroke();
  ctx.strokeStyle = 'rgba(91,104,243,0.2)'; ctx.lineWidth = 1;
  roundRect(ctx, 40, 40, W - 80, H - 80, 20); ctx.stroke();

  /* ── Corner ornaments ── */
  const corners = [[50,50],[W-50,50],[50,H-50],[W-50,H-50]];
  corners.forEach(([x, y]) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, 40);
    g.addColorStop(0, 'rgba(91,104,243,0.4)'); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 40, 0, Math.PI*2); ctx.fill();
  });

  /* ── Top glow ── */
  const topGlow = ctx.createRadialGradient(W/2, 0, 0, W/2, 0, 400);
  topGlow.addColorStop(0, 'rgba(91,104,243,0.12)'); topGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = topGlow; ctx.fillRect(0, 0, W, H);

  /* ── Logo badge ── */
  ctx.save();
  const bx = W/2, by = 120;
  const lg = ctx.createLinearGradient(bx-30, by-30, bx+30, by+30);
  lg.addColorStop(0, '#5b68f3'); lg.addColorStop(1, '#8b5cf6');
  ctx.fillStyle = lg;
  roundRect(ctx, bx-40, by-40, 80, 80, 18); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('AI', bx, by);
  ctx.restore();

  /* ── Platform name ── */
  ctx.fillStyle = 'rgba(91,104,243,0.9)'; ctx.font = '500 16px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('INTERVIEWAI PLATFORM', W/2, 200);

  /* ── "Certificate of Achievement" ── */
  ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.font = '300 20px sans-serif';
  ctx.fillText('CERTIFICATE  OF  ACHIEVEMENT', W/2, 240);

  /* ── Divider ── */
  drawGradientLine(ctx, W/2 - 200, 260, W/2 + 200, 260, '#5b68f3');

  /* ── "This certifies that" ── */
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '300 18px sans-serif';
  ctx.fillText('This certifies that', W/2, 310);

  /* ── Recipient name ── */
  ctx.fillStyle = '#fff'; ctx.font = 'bold 52px Georgia, serif';
  ctx.fillText(name, W/2, 390);

  /* ── "has successfully completed" ── */
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '300 18px sans-serif';
  ctx.fillText('has successfully completed', W/2, 430);

  /* ── Course name ── */
  const cg = ctx.createLinearGradient(W/2-200, 0, W/2+200, 0);
  cg.addColorStop(0, '#5b68f3'); cg.addColorStop(0.5, '#a78bfa'); cg.addColorStop(1, '#38bdf8');
  ctx.fillStyle = cg; ctx.font = 'bold 32px sans-serif';
  ctx.fillText(course, W/2, 480);

  /* ── Score badge ── */
  const scoreX = W/2, scoreY = 545;
  ctx.fillStyle = 'rgba(91,104,243,0.15)';
  roundRect(ctx, scoreX-120, scoreY-30, 240, 50, 25); ctx.fill();
  ctx.strokeStyle = 'rgba(91,104,243,0.4)'; ctx.lineWidth = 1;
  roundRect(ctx, scoreX-120, scoreY-30, 240, 50, 25); ctx.stroke();
  ctx.fillStyle = '#5b68f3'; ctx.font = 'bold 20px sans-serif';
  ctx.fillText(`Score: ${score}%  ·  Target: ${company}`, scoreX, scoreY);

  /* ── Divider ── */
  drawGradientLine(ctx, W/2-200, 590, W/2+200, 590, '#5b68f3');

  /* ── Footer info ── */
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '14px sans-serif';
  ctx.fillText(`Issued: ${date}`, W/2 - 180, 630);
  ctx.fillText(`Certificate ID: ${certId}`, W/2 + 180, 630);

  /* ── Signature line ── */
  drawGradientLine(ctx, W/2-120, 700, W/2+120, 700, 'rgba(255,255,255,0.2)');
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '13px sans-serif';
  ctx.fillText('InterviewAI · Founder & CEO', W/2, 720);

  /* ── Watermark dots ── */
  ctx.fillStyle = 'rgba(91,104,243,0.06)';
  for (let i = 0; i < W; i += 40) for (let j = 0; j < H; j += 40) {
    ctx.beginPath(); ctx.arc(i, j, 1, 0, Math.PI*2); ctx.fill();
  }

  /* ── Export to PDF (landscape A4) ── */
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [W, H] });
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, W, H);
  pdf.save(`InterviewAI-Certificate-${name.replace(/\s+/g,'-')}.pdf`);
}

/* ── Helpers ── */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

function drawGradientLine(ctx, x1, y1, x2, y2, color) {
  const g = ctx.createLinearGradient(x1, y1, x2, y2);
  g.addColorStop(0, 'transparent'); g.addColorStop(0.5, color); g.addColorStop(1, 'transparent');
  ctx.strokeStyle = g; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}
