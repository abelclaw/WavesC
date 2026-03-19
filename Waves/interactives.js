// =========================================================================
// LECTURE 1 INTERACTIVE SCENES
// =========================================================================

function initSceneInteractives() {
  // Find all canvases that need initialization
  initSHMSpring();
  initSHMOscillator();
  initDampedOscillator();
  initDampingRegimes();
}

// Color palette matching WavesC theme
const WCOLORS = {
  bg: '#faf5ec',
  axis: '#1f2a2e',
  grid: 'rgba(31,42,46,0.08)',
  teal: '#0f766e',
  amber: '#d97706',
  orange: '#b45309',
  text: '#1f2a2e',
  textDim: '#596166',
  red: '#dc2626',
  blue: '#2563eb',
};

function wSetupCanvas(canvas) {
  if (!canvas) return null;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = rect.width || canvas.width || 600;
  const h = rect.height || canvas.height || 280;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, W: w, H: h };
}

function wClear(ctx, W, H) {
  ctx.fillStyle = WCOLORS.bg;
  ctx.fillRect(0, 0, W, H);
}

// =========================================================================
// 1. SHM SPRING LAB
// =========================================================================
function initSHMSpring() {
  const canvas = document.getElementById('scene-shm-spring');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const kSlider = document.getElementById('shm-k');
  const mSlider = document.getElementById('shm-m');

  // Physics state
  let x = 0.4; // displacement (normalized, -1 to 1)
  let v = 0;   // velocity
  let t = 0;
  let trail = []; // x(t) history for plot
  const maxTrail = 300;
  let dragging = false;

  // Spring drawing region (left side)
  const springX = 70, springW = 100;
  const springTop = 30, springBot = H - 50;
  const eqY = (springTop + springBot) / 2;
  const maxDisp = (springBot - springTop) / 2 - 30; // max pixel displacement

  // Plot region (right side)
  const plotL = 210, plotR = W - 20, plotT = 30, plotB = H - 50;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const plotMidY = (plotT + plotB) / 2;

  // Mouse interaction
  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    // Check if clicking near the mass block
    const massY = eqY + x * maxDisp;
    if (mx > springX - 40 && mx < springX + 40 && Math.abs(my - massY) < 30) {
      dragging = true;
      v = 0;
      trail = [];
      t = 0;
    }
  });
  canvas.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    const my = e.clientY - rect.top;
    x = Math.max(-1, Math.min(1, (my - eqY) / maxDisp));
  });
  canvas.addEventListener('mouseup', () => { dragging = false; });
  canvas.addEventListener('mouseleave', () => { dragging = false; });

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const mx = touch.clientX - rect.left;
    const my = touch.clientY - rect.top;
    const massY = eqY + x * maxDisp;
    if (mx > springX - 50 && mx < springX + 50 && Math.abs(my - massY) < 40) {
      dragging = true; v = 0; trail = []; t = 0;
    }
  }, { passive: false });
  canvas.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const my = e.touches[0].clientY - rect.top;
    x = Math.max(-1, Math.min(1, (my - eqY) / maxDisp));
  }, { passive: false });
  canvas.addEventListener('touchend', () => { dragging = false; });

  function tick() {
    const k = parseFloat(kSlider?.value || 4);
    const m = parseFloat(mSlider?.value || 1);
    const omega0 = Math.sqrt(k / m);
    const dt = 0.02;

    // Update readouts
    document.getElementById('shm-k-val')?.replaceChildren(document.createTextNode(k.toFixed(1)));
    document.getElementById('shm-m-val')?.replaceChildren(document.createTextNode(m.toFixed(1)));
    document.getElementById('shm-omega-val')?.replaceChildren(
      document.createTextNode('\u03C9\u2080 = ' + omega0.toFixed(2) + '    T = ' + (2 * Math.PI / omega0).toFixed(2))
    );

    if (!dragging) {
      // Verlet-ish integration: a = -omega0^2 * x
      const a = -omega0 * omega0 * x;
      v += a * dt;
      x += v * dt;
      t += dt;
    }

    // Record trail
    trail.push({ t: t, x: x });
    if (trail.length > maxTrail) trail.shift();

    draw(k, m, omega0);
    requestAnimationFrame(tick);
  }

  function drawSpring(ctx, x1, y1, x2, y2, coils) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len, uy = dy / len;
    const nx = -uy, ny = ux;
    const coilW = 12;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const segLen = len / (coils * 2 + 2);
    let cx = x1 + ux * segLen, cy = y1 + uy * segLen;
    ctx.lineTo(cx, cy);
    for (let i = 0; i < coils; i++) {
      const midX = cx + ux * segLen, midY = cy + uy * segLen;
      ctx.lineTo(midX + nx * coilW * ((i % 2 === 0) ? 1 : -1), midY + ny * coilW * ((i % 2 === 0) ? 1 : -1));
      cx = midX + ux * segLen; cy = midY + uy * segLen;
      ctx.lineTo(cx, cy);
    }
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function draw(k, m, omega0) {
    wClear(ctx, W, H);

    const massY = eqY + x * maxDisp;

    // --- Spring + mass (left side) ---
    // Ceiling
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(springX - 35, springTop - 8, 70, 6);
    // Hatching on ceiling
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
      const lx = springX - 30 + i * 10;
      ctx.beginPath(); ctx.moveTo(lx, springTop - 8); ctx.lineTo(lx - 5, springTop - 14); ctx.stroke();
    }

    // Spring coils
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    drawSpring(ctx, springX, springTop, springX, massY - 15, 8);

    // Mass block
    const blockW = 44, blockH = 30;
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath();
    ctx.roundRect(springX - blockW / 2, massY - blockH / 2, blockW, blockH, 4);
    ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('m', springX, massY + 5);

    // Equilibrium line
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(springX - 40, eqY); ctx.lineTo(springX + 40, eqY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('x = 0', springX + 28, eqY - 4);

    // Displacement arrow
    if (Math.abs(x) > 0.05) {
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(springX + 30, eqY); ctx.lineTo(springX + 30, massY); ctx.stroke();
      // Arrowhead
      const dir = x > 0 ? 1 : -1;
      ctx.fillStyle = WCOLORS.amber;
      ctx.beginPath();
      ctx.moveTo(springX + 30, massY);
      ctx.lineTo(springX + 25, massY - dir * 8);
      ctx.lineTo(springX + 35, massY - dir * 8);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = WCOLORS.amber; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('x', springX + 38, (eqY + massY) / 2 + 4);
    }

    // Force arrow
    if (Math.abs(x) > 0.05) {
      const forceDir = -Math.sign(x);
      const forceLen = Math.min(Math.abs(x) * 40, 35);
      ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(springX - 30, massY);
      ctx.lineTo(springX - 30, massY + forceDir * forceLen);
      ctx.stroke();
      ctx.fillStyle = WCOLORS.red;
      ctx.beginPath();
      ctx.moveTo(springX - 30, massY + forceDir * forceLen);
      ctx.lineTo(springX - 25, massY + forceDir * (forceLen - 8));
      ctx.lineTo(springX - 35, massY + forceDir * (forceLen - 8));
      ctx.closePath(); ctx.fill();
      ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'right';
      ctx.fillText('F = \u2212kx', springX - 38, massY + forceDir * forceLen / 2 + 4);
    }

    // Drag hint
    if (trail.length < 5) {
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Drag the mass \u2195', springX, springBot + 14);
    }

    // --- x(t) plot (right side) ---
    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotMidY); ctx.lineTo(plotR, plotMidY); ctx.stroke();

    // Axis labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('x(t)', plotL - 14, plotT - 4);
    ctx.fillText('t', plotR + 8, plotMidY + 4);

    // Zero line label
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('0', plotL - 4, plotMidY + 3);

    // Grid lines
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 0.5;
    for (let gy = -1; gy <= 1; gy += 0.5) {
      if (gy === 0) continue;
      const py = plotMidY - gy * (plotH / 2) * 0.85;
      ctx.beginPath(); ctx.moveTo(plotL, py); ctx.lineTo(plotR, py); ctx.stroke();
    }

    // Trail
    if (trail.length > 1) {
      const tRange = Math.max(trail[trail.length - 1].t - trail[0].t, 5);
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const px = plotL + ((trail[i].t - trail[0].t) / tRange) * plotW;
        const py = plotMidY - trail[i].x * (plotH / 2) * 0.85;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current point
      const lastPt = trail[trail.length - 1];
      const lx = plotL + ((lastPt.t - trail[0].t) / tRange) * plotW;
      const ly = plotMidY - lastPt.x * (plotH / 2) * 0.85;
      ctx.fillStyle = WCOLORS.amber;
      ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI * 2); ctx.fill();
    }

    // Info display
    ctx.fillStyle = WCOLORS.teal; ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('\u03C9\u2080 = \u221A(k/m) = ' + omega0.toFixed(2) + ' rad/s', plotL + 10, plotB + 16);
    ctx.fillText('T = ' + (2 * Math.PI / omega0).toFixed(2) + ' s', plotL + plotW * 0.6, plotB + 16);
  }

  kSlider?.addEventListener('input', () => { trail = []; t = 0; });
  mSlider?.addEventListener('input', () => { trail = []; t = 0; });
  tick();
}

// =========================================================================
// 2. SHM OSCILLATOR - PHASOR + WAVE
// =========================================================================
function initSHMOscillator() {
  const canvas = document.getElementById('scene-shm-oscillator');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const ampSlider = document.getElementById('osc-amp');
  const omegaSlider = document.getElementById('osc-omega');
  const phiSlider = document.getElementById('osc-phi');

  let t = 0;

  // Phasor circle (left)
  const pcx = 100, pcy = H / 2, pR = 65;
  // Wave plot (right)
  const waveL = 210, waveR = W - 15, waveT = 30, waveB = H - 30;
  const waveMidY = (waveT + waveB) / 2;
  const waveW = waveR - waveL, waveH = waveB - waveT;

  function tick() {
    const A = parseFloat(ampSlider?.value || 1);
    const omega = parseFloat(omegaSlider?.value || 2);
    const phi = parseFloat(phiSlider?.value || 0);
    const dt = 0.025;
    t += dt;

    document.getElementById('osc-amp-val')?.replaceChildren(document.createTextNode(A.toFixed(2)));
    document.getElementById('osc-omega-val')?.replaceChildren(document.createTextNode(omega.toFixed(1)));
    document.getElementById('osc-phi-val')?.replaceChildren(document.createTextNode(phi.toFixed(2)));

    draw(A, omega, phi);
    requestAnimationFrame(tick);
  }

  function draw(A, omega, phi) {
    wClear(ctx, W, H);
    const angle = omega * t + phi;
    const xPhasor = A * Math.cos(angle);
    const yPhasor = -A * Math.sin(angle); // screen coords (y down)

    // --- Phasor circle ---
    // Circle
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(pcx, pcy, pR * A, 0, Math.PI * 2); ctx.stroke();
    // Axes
    ctx.strokeStyle = 'rgba(31,42,46,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pcx - pR - 10, pcy); ctx.lineTo(pcx + pR + 10, pcy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pcx, pcy - pR - 10); ctx.lineTo(pcx, pcy + pR + 10); ctx.stroke();

    // Phasor arrow
    const tipX = pcx + xPhasor * pR;
    const tipY = pcy + yPhasor * pR;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(pcx, pcy); ctx.lineTo(tipX, tipY); ctx.stroke();
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.arc(tipX, tipY, 5, 0, Math.PI * 2); ctx.fill();

    // Angle arc
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(pcx, pcy, 20, 0, -angle, angle > 0);
    ctx.stroke();
    // Angle label
    const labelAngle = -angle / 2;
    ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('\u03C9t+\u03C6', pcx + 30 * Math.cos(labelAngle), pcy + 30 * Math.sin(labelAngle) + 3);

    // Projection line (horizontal from phasor tip to wave)
    const projY = tipY;
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.lineTo(waveL, projY); ctx.stroke();
    ctx.setLineDash([]);

    // Projection dot on wave axis
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(waveL, projY, 4, 0, Math.PI * 2); ctx.fill();

    // Labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Phasor', pcx, pcy + pR + 24);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('Re', pcx + pR + 16, pcy + 3);
    ctx.fillText('Im', pcx + 3, pcy - pR - 8);

    // --- Wave plot ---
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(waveL, waveT); ctx.lineTo(waveL, waveB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(waveL, waveMidY); ctx.lineTo(waveR, waveMidY); ctx.stroke();

    // Draw sine wave (show a few periods)
    const nPeriods = 3;
    const totalPhase = nPeriods * 2 * Math.PI;
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= waveW; px++) {
      const phase = (px / waveW) * totalPhase;
      const val = A * Math.sin(phase + phi);
      const py = waveMidY - val * (waveH / 2) * 0.85;
      px === 0 ? ctx.moveTo(waveL + px, py) : ctx.lineTo(waveL + px, py);
    }
    ctx.stroke();

    // Current time marker on wave
    const tPhase = (omega * t) % totalPhase;
    const tPx = waveL + (tPhase / totalPhase) * waveW;
    const tVal = A * Math.sin(omega * t + phi);
    const tPy = waveMidY - tVal * (waveH / 2) * 0.85;
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(tPx, tPy, 5, 0, Math.PI * 2); ctx.fill();

    // Amplitude markers
    ctx.strokeStyle = 'rgba(31,42,46,0.12)'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
    const ampPy = waveMidY - A * (waveH / 2) * 0.85;
    ctx.beginPath(); ctx.moveTo(waveL, ampPy); ctx.lineTo(waveR, ampPy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(waveL, 2 * waveMidY - ampPy); ctx.lineTo(waveR, 2 * waveMidY - ampPy); ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('A', waveL - 6, ampPy + 3);
    ctx.fillText('\u2212A', waveL - 6, 2 * waveMidY - ampPy + 3);

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('x(t) = A sin(\u03C9t + \u03C6)', waveL + waveW / 2, waveT - 6);
    ctx.fillText('t', waveR + 10, waveMidY + 4);
  }

  tick();
}

// =========================================================================
// 3. DAMPED OSCILLATOR EXPLORER
// =========================================================================
function initDampedOscillator() {
  const canvas = document.getElementById('scene-damped-oscillator');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const gammaSlider = document.getElementById('damp-gamma');
  const omega0 = 5;
  const tMax = 6;
  const x0 = 1;
  let t = 0;

  // Layout
  const massX = 55, massEqY = H / 2, massMaxDisp = 70;
  const plotL = 140, plotR = W * 0.62, plotT = 30, plotB = H - 30;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const midY = (plotT + plotB) / 2;
  const rootCx = W * 0.82, rootCy = H / 2, rootR = 55;

  function xt(gamma, tc) {
    const ratio = gamma / (2 * omega0);
    if (ratio < 1) {
      const wu = Math.sqrt(omega0 * omega0 - (gamma / 2) * (gamma / 2));
      return x0 * Math.exp(-gamma * tc / 2) * (Math.cos(wu * tc) + (gamma / (2 * wu)) * Math.sin(wu * tc));
    } else if (ratio > 1) {
      const r1 = -gamma / 2 + Math.sqrt((gamma / 2) * (gamma / 2) - omega0 * omega0);
      const r2 = -gamma / 2 - Math.sqrt((gamma / 2) * (gamma / 2) - omega0 * omega0);
      const A = x0 * r2 / (r2 - r1);
      const B = -x0 * r1 / (r2 - r1);
      return A * Math.exp(r1 * tc) + B * Math.exp(r2 * tc);
    } else {
      return x0 * (1 + gamma * tc / 2) * Math.exp(-gamma * tc / 2);
    }
  }

  function tick() {
    const gamma = parseFloat(gammaSlider?.value || 2);
    t += 0.025;
    if (t > tMax) t = 0;

    document.getElementById('damp-gamma-val')?.replaceChildren(document.createTextNode(gamma.toFixed(1)));
    draw(gamma);
    requestAnimationFrame(tick);
  }

  function draw(gamma) {
    wClear(ctx, W, H);
    const Q = omega0 / gamma;
    const ratio = gamma / (2 * omega0);
    const curX = xt(gamma, t);

    let regime, regimeColor;
    if (ratio < 0.99) { regime = 'Underdamped'; regimeColor = WCOLORS.teal; }
    else if (ratio < 1.01) { regime = 'Critically damped'; regimeColor = WCOLORS.amber; }
    else { regime = 'Overdamped'; regimeColor = WCOLORS.orange; }

    // --- Animated mass on left ---
    const massY = massEqY + curX * massMaxDisp;

    // Wall + spring
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(massX - 25, 18, 50, 5);
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(massX - 20 + i * 10, 18); ctx.lineTo(massX - 25 + i * 10, 12); ctx.stroke();
    }

    // Spring coils
    ctx.strokeStyle = regimeColor; ctx.lineWidth = 2;
    const springTop = 23, nCoils = 7;
    const springLen = massY - 14 - springTop;
    ctx.beginPath();
    ctx.moveTo(massX, springTop);
    const segH = springLen / (nCoils * 2 + 2);
    let cy = springTop + segH;
    ctx.lineTo(massX, cy);
    for (let i = 0; i < nCoils; i++) {
      const dir = (i % 2 === 0) ? 1 : -1;
      ctx.lineTo(massX + dir * 12, cy + segH);
      cy += 2 * segH;
      ctx.lineTo(massX, cy);
    }
    ctx.lineTo(massX, massY - 14);
    ctx.stroke();

    // Mass block
    const bW = 36, bH = 28;
    ctx.fillStyle = regimeColor;
    ctx.beginPath(); ctx.roundRect(massX - bW / 2, massY - bH / 2, bW, bH, 4); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('m', massX, massY + 4);

    // Equilibrium line
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(massX - 25, massEqY); ctx.lineTo(massX + 25, massEqY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('eq', massX + 20, massEqY - 3);

    // Damper symbol (dashpot)
    const dpX = massX + 28, dpW = 8;
    ctx.strokeStyle = 'rgba(31,42,46,0.3)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(dpX, springTop); ctx.lineTo(dpX, massEqY - 15); ctx.stroke();
    ctx.strokeRect(dpX - dpW / 2, massEqY - 15, dpW, 20);
    ctx.beginPath(); ctx.moveTo(dpX, massEqY + 5); ctx.lineTo(dpX, massY); ctx.stroke();

    // --- x(t) plot ---
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('x(t)', plotL - 14, plotT - 4);
    ctx.fillText('t', plotR + 8, midY + 4);

    const nPts = 400;

    // Envelope (underdamped)
    if (ratio < 1) {
      ctx.strokeStyle = 'rgba(217,119,6,0.35)'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
      for (let sign = 1; sign >= -1; sign -= 2) {
        ctx.beginPath();
        for (let i = 0; i <= nPts; i++) {
          const tc = (i / nPts) * tMax;
          const env = sign * x0 * Math.exp(-gamma * tc / 2);
          const py = midY - env * (plotH / 2) * 0.85;
          i === 0 ? ctx.moveTo(plotL + (i / nPts) * plotW, py) : ctx.lineTo(plotL + (i / nPts) * plotW, py);
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('\u00B1e^(\u2212\u03B3t/2)', plotR - 70, plotT + 12);
    }

    // Full x(t) curve (faded ahead of cursor)
    ctx.strokeStyle = regimeColor + '30'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const tc = (i / nPts) * tMax;
      const val = xt(gamma, tc);
      const py = midY - val * (plotH / 2) * 0.85;
      i === 0 ? ctx.moveTo(plotL + (i / nPts) * plotW, py) : ctx.lineTo(plotL + (i / nPts) * plotW, py);
    }
    ctx.stroke();

    // Traced portion up to current time
    const curIdx = Math.floor((t / tMax) * nPts);
    ctx.strokeStyle = regimeColor; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= curIdx; i++) {
      const tc = (i / nPts) * tMax;
      const val = xt(gamma, tc);
      const py = midY - val * (plotH / 2) * 0.85;
      i === 0 ? ctx.moveTo(plotL + (i / nPts) * plotW, py) : ctx.lineTo(plotL + (i / nPts) * plotW, py);
    }
    ctx.stroke();

    // Current point on curve
    const curPx = plotL + (t / tMax) * plotW;
    const curPy = midY - curX * (plotH / 2) * 0.85;
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(curPx, curPy, 5, 0, Math.PI * 2); ctx.fill();

    // Connecting line from mass to plot dot
    ctx.strokeStyle = 'rgba(217,119,6,0.25)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(massX + bW / 2 + 2, massY); ctx.lineTo(curPx, curPy); ctx.stroke();
    ctx.setLineDash([]);

    // Regime label and Q
    ctx.fillStyle = regimeColor; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(regime, plotL + 5, plotB + 16);
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('Q = \u03C9\u2080/\u03B3 = ' + Q.toFixed(1), plotL + plotW * 0.45, plotB + 16);

    // --- Root diagram ---
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(rootCx - rootR - 15, rootCy); ctx.lineTo(rootCx + rootR + 15, rootCy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rootCx, rootCy - rootR - 15); ctx.lineTo(rootCx, rootCy + rootR + 15); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Re', rootCx + rootR + 12, rootCy - 6);
    ctx.fillText('Im', rootCx + 8, rootCy - rootR - 8);

    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(rootCx, rootCy, rootR * omega0 / (omega0 + 2), 0, Math.PI * 2); ctx.stroke();

    const scale = rootR / (omega0 + 2);
    if (ratio < 1) {
      const re = -gamma / 2;
      const im = Math.sqrt(omega0 * omega0 - (gamma / 2) * (gamma / 2));
      ctx.fillStyle = WCOLORS.teal;
      ctx.beginPath(); ctx.arc(rootCx + re * scale, rootCy - im * scale, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(rootCx + re * scale, rootCy + im * scale, 6, 0, Math.PI * 2); ctx.fill();
    } else if (ratio > 1) {
      const r1 = -gamma / 2 + Math.sqrt((gamma / 2) * (gamma / 2) - omega0 * omega0);
      const r2 = -gamma / 2 - Math.sqrt((gamma / 2) * (gamma / 2) - omega0 * omega0);
      ctx.fillStyle = WCOLORS.orange;
      ctx.beginPath(); ctx.arc(rootCx + r1 * scale, rootCy, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(rootCx + r2 * scale, rootCy, 6, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = WCOLORS.amber;
      ctx.beginPath(); ctx.arc(rootCx + (-gamma / 2) * scale, rootCy, 7, 0, Math.PI * 2); ctx.fill();
    }

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Roots of \u03B1\u00B2 + \u03B3\u03B1 + \u03C9\u2080\u00B2 = 0', rootCx, rootCy + rootR + 28);
  }

  gammaSlider?.addEventListener('input', () => { t = 0; });
  tick();
}

// =========================================================================
// 4. DAMPING REGIMES - RACE TO EQUILIBRIUM
// =========================================================================
function initDampingRegimes() {
  const canvas = document.getElementById('scene-damping-regimes');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const omega0Slider = document.getElementById('regime-omega0');

  function draw() {
    wClear(ctx, W, H);
    const omega0 = parseFloat(omega0Slider?.value || 5);

    document.getElementById('regime-omega0-val')?.replaceChildren(document.createTextNode(omega0.toFixed(1)));

    const gammaUD = omega0 * 0.5;  // underdamped: gamma/2omega0 = 0.25
    const gammaC = 2 * omega0;     // critical: gamma = 2*omega0
    const gammaOD = omega0 * 5;    // overdamped: gamma/2omega0 = 2.5

    const plotL = 50, plotR = W - 30, plotT = 40, plotB = H - 40;
    const plotW = plotR - plotL, plotH = plotB - plotT;
    const midY = (plotT + plotB) / 2;
    const tMax = 5;
    const nPts = 500;
    const x0 = 1;

    function xt(gamma, t) {
      const r = gamma / (2 * omega0);
      if (r < 1) {
        const wu = Math.sqrt(omega0 * omega0 - (gamma / 2) * (gamma / 2));
        return x0 * Math.exp(-gamma * t / 2) * (Math.cos(wu * t) + (gamma / (2 * wu)) * Math.sin(wu * t));
      } else if (r > 1) {
        const r1 = -gamma / 2 + Math.sqrt((gamma / 2) * (gamma / 2) - omega0 * omega0);
        const r2 = -gamma / 2 - Math.sqrt((gamma / 2) * (gamma / 2) - omega0 * omega0);
        const A = x0 * r2 / (r2 - r1);
        const B = -x0 * r1 / (r2 - r1);
        return A * Math.exp(r1 * t) + B * Math.exp(r2 * t);
      } else {
        return x0 * (1 + gamma * t / 2) * Math.exp(-gamma * t / 2);
      }
    }

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT - 5); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('x(t)', plotL - 16, plotT - 6);
    ctx.fillText('t', plotR + 10, midY + 4);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('x\u2080', plotL - 5, plotT + 5);

    // Draw three curves
    const curves = [
      { gamma: gammaUD, color: WCOLORS.teal, label: 'Underdamped (\u03B3 = ' + gammaUD.toFixed(1) + ')', lw: 2.5 },
      { gamma: gammaC, color: WCOLORS.amber, label: 'Critical (\u03B3 = ' + gammaC.toFixed(1) + ')', lw: 2.5 },
      { gamma: gammaOD, color: WCOLORS.orange, label: 'Overdamped (\u03B3 = ' + gammaOD.toFixed(1) + ')', lw: 2.5 },
    ];

    for (const curve of curves) {
      ctx.strokeStyle = curve.color; ctx.lineWidth = curve.lw;
      ctx.beginPath();
      for (let i = 0; i <= nPts; i++) {
        const t = (i / nPts) * tMax;
        const val = xt(curve.gamma, t);
        const py = midY - val * (plotH / 2) * 0.85;
        const px = plotL + (i / nPts) * plotW;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Legend
    let ly = plotT + 5;
    for (const curve of curves) {
      ctx.fillStyle = curve.color; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'left';
      // Color swatch
      ctx.fillRect(plotL + plotW * 0.55, ly - 8, 14, 3);
      ctx.fillText(curve.label, plotL + plotW * 0.55 + 20, ly);
      ly += 18;
    }

    // Annotation: critical is fastest
    ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Fastest return without oscillation \u2192', plotL + plotW * 0.35, plotB + 14);

    // omega0 display
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('\u03C9\u2080 = ' + omega0.toFixed(1) + ' rad/s', plotL + 5, plotT - 12);
  }

  omega0Slider?.addEventListener('input', draw);
  draw();
}
