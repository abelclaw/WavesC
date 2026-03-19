// =========================================================================
// LECTURE 1 INTERACTIVE SCENES
// =========================================================================

function initSceneInteractives() {
  // Find all canvases that need initialization
  initSHMSpring();
  initSHMOscillator();
  initDampedOscillator();
  initDampingRegimes();
  initEulerCircle();
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
  const massSlider = document.getElementById('damp-mass');
  const k = 25; // fixed spring constant

  // Physics state (real simulation)
  let x = 0, v = 0; // displacement and velocity
  let trail = []; // {t, x} for plot
  let t = 0;
  const maxTrail = 400;
  let dragging = false;
  let released = false; // has the user released at least once?

  // Layout
  const massX = 55, massEqY = H / 2, massMaxDisp = 70;
  const plotL = 140, plotR = W * 0.62, plotT = 30, plotB = H - 30;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const midY = (plotT + plotB) / 2;
  const rootCx = W * 0.82, rootCy = H / 2, rootR = 55;
  const bW = 36, bH = 28;

  // Drag interaction
  function getMouseY(e) {
    const rect = canvas.getBoundingClientRect();
    return (e.clientY || e.touches[0].clientY) - rect.top;
  }
  function startDrag(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX || e.touches[0].clientX) - rect.left;
    const my = getMouseY(e);
    const massY = massEqY + x * massMaxDisp;
    if (mx > massX - 40 && mx < massX + 45 && Math.abs(my - massY) < 30) {
      dragging = true; v = 0; trail = []; t = 0;
    }
  }
  function moveDrag(e) {
    if (!dragging) return;
    const my = getMouseY(e);
    x = Math.max(-1, Math.min(1, (my - massEqY) / massMaxDisp));
  }
  function endDrag() {
    if (dragging) { dragging = false; released = true; trail = []; t = 0; }
  }

  canvas.addEventListener('mousedown', startDrag);
  canvas.addEventListener('mousemove', moveDrag);
  canvas.addEventListener('mouseup', endDrag);
  canvas.addEventListener('mouseleave', endDrag);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrag(e); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { if (dragging) { e.preventDefault(); moveDrag(e); } }, { passive: false });
  canvas.addEventListener('touchend', endDrag);

  function tick() {
    const gamma = parseFloat(gammaSlider?.value || 2);
    const m = parseFloat(massSlider?.value || 1);
    const omega0 = Math.sqrt(k / m);
    const dt = 0.018;

    document.getElementById('damp-gamma-val')?.replaceChildren(document.createTextNode(gamma.toFixed(1)));
    document.getElementById('damp-mass-val')?.replaceChildren(document.createTextNode(m.toFixed(1)));
    document.getElementById('damp-omega-val')?.replaceChildren(
      document.createTextNode('\u03C9\u2080 = \u221A(k/m) = ' + omega0.toFixed(2))
    );

    if (!dragging) {
      // Damped harmonic oscillator: a = -omega0^2 * x - gamma * v
      const a = -omega0 * omega0 * x - gamma * v;
      v += a * dt;
      x += v * dt;
      t += dt;

      // Record trail
      trail.push({ t, x });
      if (trail.length > maxTrail) trail.shift();
    }

    draw(gamma, m, omega0);
    requestAnimationFrame(tick);
  }

  function draw(gamma, m, omega0) {
    wClear(ctx, W, H);
    const Q = omega0 / Math.max(gamma, 0.01);
    const ratio = gamma / (2 * omega0);

    let regime, regimeColor;
    if (ratio < 0.99) { regime = 'Underdamped'; regimeColor = WCOLORS.teal; }
    else if (ratio < 1.01) { regime = 'Critically damped'; regimeColor = WCOLORS.amber; }
    else { regime = 'Overdamped'; regimeColor = WCOLORS.orange; }

    const massY = massEqY + x * massMaxDisp;

    // --- Spring-mass-dashpot ---
    // Ceiling
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(massX - 25, 18, 55, 5);
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.moveTo(massX - 20 + i * 11, 18); ctx.lineTo(massX - 25 + i * 11, 12); ctx.stroke();
    }

    // Spring
    ctx.strokeStyle = regimeColor; ctx.lineWidth = 2;
    const springTop = 23, nCoils = 7;
    const springLen = Math.max(massY - 14 - springTop, 20);
    ctx.beginPath(); ctx.moveTo(massX, springTop);
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

    // Dashpot
    const dpX = massX + 28, dpW = 8;
    ctx.strokeStyle = 'rgba(31,42,46,0.3)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(dpX, springTop); ctx.lineTo(dpX, massEqY - 15); ctx.stroke();
    ctx.strokeRect(dpX - dpW / 2, massEqY - 15, dpW, 20);
    ctx.beginPath(); ctx.moveTo(dpX, massEqY + 5); ctx.lineTo(dpX, massY); ctx.stroke();

    // Mass block
    ctx.fillStyle = dragging ? WCOLORS.amber : regimeColor;
    ctx.beginPath(); ctx.roundRect(massX - bW / 2, massY - bH / 2, bW, bH, 4); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('m', massX, massY + 4);

    // Equilibrium line
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(massX - 25, massEqY); ctx.lineTo(massX + 30, massEqY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('eq', massX + 22, massEqY - 3);

    // Drag hint
    if (!released && trail.length < 3) {
      ctx.fillStyle = WCOLORS.textDim; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Drag the mass \u2195', massX, H - 8);
    }

    // --- x(t) plot ---
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('x(t)', plotL - 14, plotT - 4);
    ctx.fillText('t', plotR + 8, midY + 4);

    // Trail
    if (trail.length > 1) {
      const tRange = Math.max(trail[trail.length - 1].t - trail[0].t, 4);
      ctx.strokeStyle = regimeColor; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const px = plotL + ((trail[i].t - trail[0].t) / tRange) * plotW;
        const py = midY - trail[i].x * (plotH / 2) * 0.85;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current dot
      const last = trail[trail.length - 1];
      const lx = plotL + ((last.t - trail[0].t) / tRange) * plotW;
      const ly = midY - last.x * (plotH / 2) * 0.85;
      ctx.fillStyle = WCOLORS.amber;
      ctx.beginPath(); ctx.arc(lx, ly, 5, 0, Math.PI * 2); ctx.fill();

      // Connecting line
      ctx.strokeStyle = 'rgba(217,119,6,0.25)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(massX + bW / 2 + 2, massY); ctx.lineTo(lx, ly); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Regime label and Q
    ctx.fillStyle = regimeColor; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(regime, plotL + 5, plotB + 16);
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('Q = ' + Q.toFixed(1), plotL + plotW * 0.5, plotB + 16);

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

  gammaSlider?.addEventListener('input', () => { v = 0; trail = []; t = 0; });
  massSlider?.addEventListener('input', () => { v = 0; trail = []; t = 0; });
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
  const goBtn = document.getElementById('regime-go');

  let t = 0;
  let running = false;
  let done = false;
  const tMax = 5;
  const nPts = 500;
  const x0 = 1;

  // Layout: three spring-mass systems on top, plot below
  const springZoneH = 130;
  const springY0 = 10; // top of spring zone
  const springSpacing = W / 3;
  const springEqY = springY0 + springZoneH * 0.45; // equilibrium line
  const springMaxDisp = 40;

  const plotL = 50, plotR = W - 25, plotT = springZoneH + 20, plotB = H - 30;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const midY = (plotT + plotB) / 2;

  function xt(omega0, gamma, tc) {
    const r = gamma / (2 * omega0);
    if (r < 1) {
      const wu = Math.sqrt(omega0 * omega0 - (gamma / 2) * (gamma / 2));
      return x0 * Math.exp(-gamma * tc / 2) * (Math.cos(wu * tc) + (gamma / (2 * wu)) * Math.sin(wu * tc));
    } else if (r > 1) {
      const r1 = -gamma / 2 + Math.sqrt((gamma / 2) * (gamma / 2) - omega0 * omega0);
      const r2 = -gamma / 2 - Math.sqrt((gamma / 2) * (gamma / 2) - omega0 * omega0);
      const A = x0 * r2 / (r2 - r1);
      const B = -x0 * r1 / (r2 - r1);
      return A * Math.exp(r1 * tc) + B * Math.exp(r2 * tc);
    } else {
      return x0 * (1 + gamma * tc / 2) * Math.exp(-gamma * tc / 2);
    }
  }

  function drawSpringMass(cx, eqY, disp, color, label, dampLabel) {
    const massY = eqY + disp * springMaxDisp;
    const ceilY = springY0 + 8;
    const bW = 32, bH = 24;

    // Ceiling
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(cx - 22, ceilY, 44, 4);
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(cx - 16 + i * 10, ceilY); ctx.lineTo(cx - 21 + i * 10, ceilY - 5); ctx.stroke();
    }

    // Spring
    ctx.strokeStyle = color; ctx.lineWidth = 1.8;
    const sTop = ceilY + 4;
    const sLen = Math.max(massY - bH / 2 - sTop, 15);
    const nCoils = 6;
    ctx.beginPath(); ctx.moveTo(cx, sTop);
    const seg = sLen / (nCoils * 2 + 2);
    let cy = sTop + seg;
    ctx.lineTo(cx, cy);
    for (let i = 0; i < nCoils; i++) {
      const dir = (i % 2 === 0) ? 1 : -1;
      ctx.lineTo(cx + dir * 10, cy + seg);
      cy += 2 * seg;
      ctx.lineTo(cx, cy);
    }
    ctx.lineTo(cx, massY - bH / 2);
    ctx.stroke();

    // Dashpot (small, beside spring)
    const dpX = cx + 18, dpW = 6;
    ctx.strokeStyle = color + '50'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(dpX, sTop); ctx.lineTo(dpX, eqY - 10); ctx.stroke();
    ctx.strokeRect(dpX - dpW / 2, eqY - 10, dpW, 14);
    ctx.beginPath(); ctx.moveTo(dpX, eqY + 4); ctx.lineTo(dpX, massY); ctx.stroke();

    // Mass block
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.roundRect(cx - bW / 2, massY - bH / 2, bW, bH, 3); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('m', cx, massY + 3);

    // Eq line
    ctx.strokeStyle = WCOLORS.textDim + '40'; ctx.lineWidth = 1; ctx.setLineDash([2, 2]);
    ctx.beginPath(); ctx.moveTo(cx - 22, eqY); ctx.lineTo(cx + 22, eqY); ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = color; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(label, cx, springY0 + springZoneH - 2);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui, sans-serif';
    ctx.fillText(dampLabel, cx, springY0 + springZoneH + 10);
  }

  function tick() {
    if (running) {
      t += 0.012;
      if (t >= tMax) {
        t = tMax;
        running = false;
        done = true;
        if (goBtn) goBtn.textContent = '\u25B6 Go';
      }
    }
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    wClear(ctx, W, H);
    const omega0 = parseFloat(omega0Slider?.value || 5);
    document.getElementById('regime-omega0-val')?.replaceChildren(document.createTextNode(omega0.toFixed(1)));

    const gammaUD = omega0 * 0.5;
    const gammaC = 2 * omega0;
    const gammaOD = omega0 * 5;

    const curves = [
      { gamma: gammaUD, color: WCOLORS.teal, label: 'Underdamped', dampLabel: '\u03B3 = ' + gammaUD.toFixed(1) },
      { gamma: gammaC, color: WCOLORS.amber, label: 'Critical', dampLabel: '\u03B3 = ' + gammaC.toFixed(1) },
      { gamma: gammaOD, color: WCOLORS.orange, label: 'Overdamped', dampLabel: '\u03B3 = ' + gammaOD.toFixed(1) },
    ];

    // --- Three spring-mass systems ---
    for (let i = 0; i < 3; i++) {
      const cx = springSpacing * (i + 0.5);
      const curVal = xt(omega0, curves[i].gamma, t);
      drawSpringMass(cx, springEqY, curVal, curves[i].color, curves[i].label, curves[i].dampLabel);
    }

    // Divider
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT - 8); ctx.lineTo(plotR, plotT - 8); ctx.stroke();

    // --- x(t) plot ---
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('x(t)', plotL - 16, plotT - 2);
    ctx.fillText('t', plotR + 10, midY + 4);

    // Full curves (faint)
    for (const curve of curves) {
      ctx.strokeStyle = curve.color + '25'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= nPts; i++) {
        const tc = (i / nPts) * tMax;
        const val = xt(omega0, curve.gamma, tc);
        const py = midY - val * (plotH / 2) * 0.85;
        const px = plotL + (i / nPts) * plotW;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Traced portions
    const curIdx = Math.floor((t / tMax) * nPts);
    for (const curve of curves) {
      ctx.strokeStyle = curve.color; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= curIdx; i++) {
        const tc = (i / nPts) * tMax;
        const val = xt(omega0, curve.gamma, tc);
        const py = midY - val * (plotH / 2) * 0.85;
        const px = plotL + (i / nPts) * plotW;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Dot
      const curVal = xt(omega0, curve.gamma, t);
      const dotPx = plotL + (t / tMax) * plotW;
      const dotPy = midY - curVal * (plotH / 2) * 0.85;
      ctx.fillStyle = curve.color;
      ctx.beginPath(); ctx.arc(dotPx, dotPy, 4, 0, Math.PI * 2); ctx.fill();
    }

    // omega0 label
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('\u03C9\u2080 = ' + omega0.toFixed(1), plotR, plotT - 2);
  }

  goBtn?.addEventListener('click', () => {
    t = 0; running = true; done = false;
    goBtn.textContent = '\u23F8 Stop';
  });
  omega0Slider?.addEventListener('input', () => { t = 0; running = false; done = false; if (goBtn) goBtn.textContent = '\u25B6 Go'; });
  draw();
  tick();
}

// =========================================================================
// EULER CIRCLE — unit circle phasor with real/imaginary projections
// =========================================================================
function initEulerCircle() {
  const canvas = document.getElementById('scene-euler-circle');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let omega = 1.5;   // angular frequency
  let t = 0;
  let dragging = false;
  let trail = [];
  const maxTrail = 200;

  // Layout
  const cx = W * 0.3;          // circle center x
  const cy = H * 0.5;          // circle center y
  const R = Math.min(W * 0.22, H * 0.38);  // circle radius

  // Real-part plot on the right
  const plotL = W * 0.58, plotR = W - 15;
  const plotT = 30, plotB = H - 30;
  const plotW = plotR - plotL;
  const plotH = plotB - plotT;
  const plotMidY = (plotT + plotB) / 2;

  // Mouse: drag angle
  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const dx = mx - cx, dy = my - cy;
    if (Math.sqrt(dx * dx + dy * dy) < R + 30) {
      dragging = true;
    }
  });
  canvas.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    t = Math.atan2(-(my - cy), mx - cx) / omega;
  });
  canvas.addEventListener('mouseup', () => { dragging = false; });
  canvas.addEventListener('mouseleave', () => { dragging = false; });

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const dx = touch.clientX - rect.left - cx;
    const dy = touch.clientY - rect.top - cy;
    if (Math.sqrt(dx * dx + dy * dy) < R + 40) dragging = true;
  }, { passive: false });
  canvas.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const my = e.touches[0].clientY - rect.top;
    const mx = e.touches[0].clientX - rect.left;
    t = Math.atan2(-(my - cy), mx - cx) / omega;
  }, { passive: false });
  canvas.addEventListener('touchend', () => { dragging = false; });

  function draw() {
    wClear(ctx, W, H);

    const theta = omega * t;
    const px = cx + R * Math.cos(theta);
    const py = cy - R * Math.sin(theta);  // canvas y is flipped

    // --- Unit circle ---
    // Axes
    ctx.strokeStyle = WCOLORS.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - R - 20, cy); ctx.lineTo(cx + R + 20, cy);
    ctx.moveTo(cx, cy - R - 20); ctx.lineTo(cx, cy + R + 20);
    ctx.stroke();

    // Circle
    ctx.strokeStyle = 'rgba(31,42,46,0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.stroke();

    // Axis labels
    ctx.font = '12px Georgia, serif';
    ctx.fillStyle = WCOLORS.textDim;
    ctx.textAlign = 'center';
    ctx.fillText('Re', cx + R + 16, cy + 14);
    ctx.fillText('Im', cx + 4, cy - R - 10);

    // Angle arc
    if (Math.abs(theta % (2 * Math.PI)) > 0.05) {
      ctx.strokeStyle = WCOLORS.amber;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const arcR = R * 0.25;
      // Draw arc from 0 to theta (canvas convention: angles go clockwise)
      if (theta >= 0) {
        ctx.arc(cx, cy, arcR, 0, -theta, true);
      } else {
        ctx.arc(cx, cy, arcR, 0, -theta, false);
      }
      ctx.stroke();
      // Theta label
      const labelAngle = -theta / 2;
      ctx.fillStyle = WCOLORS.amber;
      ctx.font = '13px Georgia, serif';
      ctx.fillText('\u03B8', cx + arcR * 1.4 * Math.cos(labelAngle), cy + arcR * 1.4 * Math.sin(labelAngle) + 4);
    }

    // Projection lines (dashed)
    ctx.setLineDash([4, 4]);
    // cos projection (horizontal)
    ctx.strokeStyle = WCOLORS.teal;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, py); ctx.lineTo(px, cy);
    ctx.stroke();
    // sin projection (vertical)
    ctx.strokeStyle = WCOLORS.red;
    ctx.beginPath();
    ctx.moveTo(px, py); ctx.lineTo(cx, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // cos component on real axis
    ctx.strokeStyle = WCOLORS.teal;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(px, cy);
    ctx.stroke();
    // Label
    ctx.fillStyle = WCOLORS.teal;
    ctx.font = '11px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('cos \u03B8', (cx + px) / 2, cy + 16);

    // sin component on imaginary axis
    ctx.strokeStyle = WCOLORS.red;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(cx, py);
    ctx.stroke();
    ctx.fillStyle = WCOLORS.red;
    ctx.fillText('sin \u03B8', cx - 26, (cy + py) / 2 + 4);

    // Phasor arrow
    ctx.strokeStyle = WCOLORS.axis;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(px, py);
    ctx.stroke();
    // Arrowhead
    const aLen = 8, aAngle = 0.35;
    const pAngle = Math.atan2(py - cy, px - cx);
    ctx.fillStyle = WCOLORS.axis;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px - aLen * Math.cos(pAngle - aAngle), py - aLen * Math.sin(pAngle - aAngle));
    ctx.lineTo(px - aLen * Math.cos(pAngle + aAngle), py - aLen * Math.sin(pAngle + aAngle));
    ctx.closePath();
    ctx.fill();

    // Dot at phasor tip
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, 2 * Math.PI);
    ctx.fill();

    // e^{i theta} label near dot
    ctx.fillStyle = WCOLORS.axis;
    ctx.font = '13px Georgia, serif';
    ctx.textAlign = 'left';
    const lx = px + 10, ly = py - 10;
    ctx.fillText('e', lx, ly);
    ctx.font = '10px Georgia, serif';
    ctx.fillText('i\u03B8', lx + 8, ly - 6);

    // --- Right plot: Re(e^{i omega t}) = cos(omega t) vs t ---
    // Record trail
    trail.push({ time: t, val: Math.cos(theta) });
    if (trail.length > maxTrail) trail.shift();

    // Plot axes
    ctx.strokeStyle = WCOLORS.axis;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(plotL, plotMidY); ctx.lineTo(plotR, plotMidY);
    ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB);
    ctx.stroke();

    // Labels
    ctx.fillStyle = WCOLORS.textDim;
    ctx.font = '11px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('t', plotR - 2, plotMidY + 16);
    ctx.textAlign = 'right';
    ctx.fillText('cos(\u03B8)', plotL - 4, plotT + 4);

    // Guide lines at +1 and -1
    ctx.strokeStyle = WCOLORS.grid;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(plotL, plotT + 10); ctx.lineTo(plotR, plotT + 10);
    ctx.moveTo(plotL, plotB - 10); ctx.lineTo(plotR, plotB - 10);
    ctx.stroke();
    ctx.setLineDash([]);

    // Plot the trail
    if (trail.length > 1) {
      const tMin = trail[0].time;
      const tMax = trail[trail.length - 1].time;
      const tRange = Math.max(tMax - tMin, 0.01);

      ctx.strokeStyle = WCOLORS.teal;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const sx = plotL + ((trail[i].time - tMin) / tRange) * plotW;
        const sy = plotMidY - trail[i].val * (plotH / 2 - 10);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Current point
      const lastPt = trail[trail.length - 1];
      const curX = plotR;
      const curY = plotMidY - lastPt.val * (plotH / 2 - 10);
      ctx.fillStyle = WCOLORS.teal;
      ctx.beginPath();
      ctx.arc(curX, curY, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Connecting line from circle to plot
      ctx.strokeStyle = 'rgba(15,118,110,0.2)';
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(px, cy); ctx.lineTo(curX, curY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Title
    ctx.fillStyle = WCOLORS.axis;
    ctx.font = '13px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Euler\'s formula: e\u2071\u1D48 = cos \u03B8 + i sin \u03B8', cx, 16);
  }

  function tick() {
    if (!dragging) {
      t += 0.02;
    }
    draw();
    requestAnimationFrame(tick);
  }

  tick();
}
