// =========================================================================
// LECTURE 1 INTERACTIVE SCENES
// =========================================================================

function initSceneInteractives() {
  // Lecture 1
  initSHMSpring();
  initSHMOscillator();
  initDampedOscillator();
  initDampingRegimes();
  initEulerCircle();
  // Lecture 2
  initDrivenOscillator();
  initTransientDecay();
  initPhaseLag();
  initPowerAbsorption();
  initResonanceCurve();
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

// =========================================================================
// LECTURE 2 INTERACTIVE SCENES
// =========================================================================

// =========================================================================
// 1. DRIVEN OSCILLATOR — live simulation + amplitude/phase curves
// =========================================================================
function initDrivenOscillator() {
  const canvas = document.getElementById('scene-driven-oscillator');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const wdSlider = document.getElementById('driven-wd');
  const w0Slider = document.getElementById('driven-w0');
  const gammaSlider = document.getElementById('driven-gamma');

  let t = 0;
  let trail = [];
  const maxTrail = 300;

  // Layout: left = spring-mass, center = x(t) plot, right = amplitude/phase curves
  const springX = 50, massEqY = H / 2, maxDisp = 60;
  const plotL = 130, plotR = W * 0.48, plotT = 25, plotB = H - 25;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const ampL = W * 0.54, ampR = W - 15, ampT = 25, ampB = H * 0.48;
  const phL = ampL, phR = ampR, phT = H * 0.55, phB = H - 15;

  // Steady-state solution: x(t) = (F0/m) * [A cos(wd t) + B sin(wd t)]
  function getAB(w0, wd, gamma) {
    const denom = (w0 * w0 - wd * wd) * (w0 * w0 - wd * wd) + (gamma * wd) * (gamma * wd);
    const A = (w0 * w0 - wd * wd) / denom;
    const B = (gamma * wd) / denom;
    return { A, B, amp: Math.sqrt(A * A + B * B), phase: -Math.atan2(B, A) };
  }

  function tick() {
    const wd = parseFloat(wdSlider?.value || 3);
    const w0 = parseFloat(w0Slider?.value || 5);
    const gamma = parseFloat(gammaSlider?.value || 0.8);
    const dt = 0.025;
    t += dt;

    document.getElementById('driven-wd-val')?.replaceChildren(document.createTextNode(wd.toFixed(2)));
    document.getElementById('driven-w0-val')?.replaceChildren(document.createTextNode(w0.toFixed(1)));
    document.getElementById('driven-gamma-val')?.replaceChildren(document.createTextNode(gamma.toFixed(1)));

    const { A, B } = getAB(w0, wd, gamma);
    const x = A * Math.cos(wd * t) + B * Math.sin(wd * t);
    const force = Math.cos(wd * t);

    trail.push({ t, x, force });
    if (trail.length > maxTrail) trail.shift();

    draw(wd, w0, gamma, x, force);
    requestAnimationFrame(tick);
  }

  function draw(wd, w0, gamma, x, force) {
    wClear(ctx, W, H);

    // --- Spring-mass with driving force (left) ---
    const massY = massEqY + x * maxDisp * 8;
    const forceY = massEqY + force * maxDisp * 0.4;

    // Wall
    ctx.fillStyle = WCOLORS.axis;
    ctx.fillRect(springX - 25, 15, 55, 4);
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.moveTo(springX - 20 + i * 11, 15); ctx.lineTo(springX - 25 + i * 11, 10); ctx.stroke();
    }

    // Spring
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    const sTop = 19;
    const sLen = Math.max(massY - 14 - sTop, 15);
    ctx.beginPath(); ctx.moveTo(springX, sTop);
    const seg = sLen / 14;
    let cy = sTop + seg;
    ctx.lineTo(springX, cy);
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(springX + ((i % 2 === 0) ? 10 : -10), cy + seg);
      cy += 2 * seg;
      ctx.lineTo(springX, cy);
    }
    ctx.lineTo(springX, massY - 14);
    ctx.stroke();

    // Mass
    const bW = 36, bH = 24;
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.roundRect(springX - bW / 2, massY - bH / 2, bW, bH, 4); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('m', springX, massY + 4);

    // Driving force arrow
    const fLen = force * 25;
    if (Math.abs(fLen) > 2) {
      ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(springX, massY + bH / 2 + 5);
      ctx.lineTo(springX, massY + bH / 2 + 5 + fLen); ctx.stroke();
      ctx.fillStyle = WCOLORS.amber;
      const dir = Math.sign(fLen);
      ctx.beginPath();
      ctx.moveTo(springX, massY + bH / 2 + 5 + fLen);
      ctx.lineTo(springX - 4, massY + bH / 2 + 5 + fLen - dir * 6);
      ctx.lineTo(springX + 4, massY + bH / 2 + 5 + fLen - dir * 6);
      ctx.closePath(); ctx.fill();
      ctx.font = '9px system-ui'; ctx.textAlign = 'left';
      ctx.fillText('F', springX + 8, massY + bH / 2 + 5 + fLen / 2 + 3);
    }

    // --- x(t) plot (center) ---
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    const midY = (plotT + plotB) / 2;
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('x(t)', plotL - 12, plotT - 2);
    ctx.fillText('t', plotR + 8, midY + 3);

    if (trail.length > 1) {
      const tRange = Math.max(trail[trail.length - 1].t - trail[0].t, 3);
      // Force trace (faded)
      ctx.strokeStyle = WCOLORS.amber + '40'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const px = plotL + ((trail[i].t - trail[0].t) / tRange) * plotW;
        const py = midY - trail[i].force * plotH * 0.15;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Response trace
      ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const px = plotL + ((trail[i].t - trail[0].t) / tRange) * plotW;
        const py = midY - trail[i].x * plotH * 0.4 * 8;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    ctx.fillStyle = WCOLORS.amber; ctx.font = '9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('F(t)', plotL + 3, plotT + 10);
    ctx.fillStyle = WCOLORS.teal;
    ctx.fillText('x(t)', plotL + 3, plotT + 22);

    // --- Amplitude vs wd curve (upper right) ---
    const ampW = ampR - ampL, ampH = ampB - ampT;
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ampL, ampT); ctx.lineTo(ampL, ampB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ampL, ampB); ctx.lineTo(ampR, ampB); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('|x|', ampL - 10, ampT + 3);
    ctx.fillText('\u03C9_d', ampR, ampB + 12);

    // Sweep amplitude curve
    const wMax = 10;
    let maxAmp = 0;
    for (let i = 0; i <= 200; i++) {
      const w = (i / 200) * wMax;
      const a = getAB(w0, w, gamma).amp;
      if (a > maxAmp) maxAmp = a;
    }
    if (maxAmp < 0.001) maxAmp = 1;

    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const w = (i / 200) * wMax;
      const a = getAB(w0, w, gamma).amp;
      const px = ampL + (w / wMax) * ampW;
      const py = ampB - (a / maxAmp) * ampH * 0.9;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current wd marker
    const curAmp = getAB(w0, wd, gamma).amp;
    const dotX = ampL + (wd / wMax) * ampW;
    const dotY = ampB - (curAmp / maxAmp) * ampH * 0.9;
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(dotX, dotY, 5, 0, Math.PI * 2); ctx.fill();

    // w0 line
    const w0px = ampL + (w0 / wMax) * ampW;
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(w0px, ampT); ctx.lineTo(w0px, ampB); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u03C9\u2080', w0px, ampB + 12);

    // --- Phase vs wd curve (lower right) ---
    const phW = phR - phL, phH = phB - phT;
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(phL, phT); ctx.lineTo(phL, phB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(phL, phB); ctx.lineTo(phR, phB); ctx.stroke();
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Phase', phL - 14, phT + 3);
    ctx.fillText('\u03C9_d', phR, phB + 12);

    // Phase labels
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '8px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('0\u00B0', phL - 3, phT + 4);
    ctx.fillText('\u221290\u00B0', phL - 3, (phT + phB) / 2 + 3);
    ctx.fillText('\u2212180\u00B0', phL - 3, phB + 3);

    // Guideline at -90
    ctx.strokeStyle = WCOLORS.grid; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(phL, (phT + phB) / 2); ctx.lineTo(phR, (phT + phB) / 2); ctx.stroke();
    ctx.setLineDash([]);

    // Phase curve
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const w = (i / 200) * wMax;
      const ph = getAB(w0, Math.max(w, 0.01), gamma).phase;
      const px = phL + (w / wMax) * phW;
      const py = phT + (-ph / Math.PI) * phH;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current phase marker
    const curPh = getAB(w0, wd, gamma).phase;
    const phDotX = phL + (wd / wMax) * phW;
    const phDotY = phT + (-curPh / Math.PI) * phH;
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(phDotX, phDotY, 5, 0, Math.PI * 2); ctx.fill();

    // w0 line on phase plot
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(w0px, phT); ctx.lineTo(w0px, phB); ctx.stroke();
    ctx.setLineDash([]);
  }

  wdSlider?.addEventListener('input', () => { trail = []; t = 0; });
  w0Slider?.addEventListener('input', () => { trail = []; t = 0; });
  gammaSlider?.addEventListener('input', () => { trail = []; t = 0; });
  tick();
}

// =========================================================================
// 2. TRANSIENT DECAY — homogeneous + inhomogeneous
// =========================================================================
function initTransientDecay() {
  const canvas = document.getElementById('scene-transient-decay');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let t = 0;
  const w0 = 5, wd = 4, gamma = 0.8, F0 = 1;
  const plotL = 50, plotR = W - 20, plotT = 25, plotB = H - 25;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const midY = (plotT + plotB) / 2;
  const tMax = 12;

  function getAB() {
    const denom = (w0 * w0 - wd * wd) ** 2 + (gamma * wd) ** 2;
    return { A: (w0 * w0 - wd * wd) / denom, B: (gamma * wd) / denom };
  }

  const { A, B } = getAB();
  const wu = Math.sqrt(w0 * w0 - (gamma / 2) ** 2);

  // Transient chosen so total x(0) = 0, x'(0) = 0
  const xSS0 = A; // steady-state at t=0
  const vSS0 = wd * B; // d/dt of steady-state at t=0
  // Transient: x_h = e^{-gamma/2 t} [C1 cos(wu t) + C2 sin(wu t)]
  const C1 = -xSS0;
  const C2 = -(vSS0 + (gamma / 2) * C1) / wu;

  function xTotal(tc) {
    const ss = A * Math.cos(wd * tc) + B * Math.sin(wd * tc);
    const tr = Math.exp(-gamma / 2 * tc) * (C1 * Math.cos(wu * tc) + C2 * Math.sin(wu * tc));
    return { total: ss + tr, ss, tr };
  }

  function tick() {
    t += 0.02;
    if (t > tMax) t = 0;
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    wClear(ctx, W, H);

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('x(t)', plotL - 14, plotT - 4);
    ctx.fillText('t', plotR + 10, midY + 3);

    const scale = plotH * 0.35;
    const nPts = 400;

    // Envelope of transient
    ctx.strokeStyle = WCOLORS.textDim + '30'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const tc = (i / nPts) * tMax;
      const env = Math.sqrt(C1 * C1 + C2 * C2) * Math.exp(-gamma / 2 * tc);
      const px = plotL + (i / nPts) * plotW;
      const py = midY - env * scale;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const tc = (i / nPts) * tMax;
      const env = -Math.sqrt(C1 * C1 + C2 * C2) * Math.exp(-gamma / 2 * tc);
      const px = plotL + (i / nPts) * plotW;
      const py = midY - env * scale;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Full curves
    // Steady-state (faded)
    ctx.strokeStyle = WCOLORS.amber + '60'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const tc = (i / nPts) * tMax;
      const { ss } = xTotal(tc);
      const px = plotL + (i / nPts) * plotW;
      i === 0 ? ctx.moveTo(px, midY - ss * scale) : ctx.lineTo(px, midY - ss * scale);
    }
    ctx.stroke();

    // Transient (faded)
    ctx.strokeStyle = WCOLORS.red + '50'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= nPts; i++) {
      const tc = (i / nPts) * tMax;
      const { tr } = xTotal(tc);
      const px = plotL + (i / nPts) * plotW;
      i === 0 ? ctx.moveTo(px, midY - tr * scale) : ctx.lineTo(px, midY - tr * scale);
    }
    ctx.stroke();

    // Total up to current time (bold)
    const curIdx = Math.floor((t / tMax) * nPts);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= curIdx; i++) {
      const tc = (i / nPts) * tMax;
      const { total } = xTotal(tc);
      const px = plotL + (i / nPts) * plotW;
      i === 0 ? ctx.moveTo(px, midY - total * scale) : ctx.lineTo(px, midY - total * scale);
    }
    ctx.stroke();

    // Current dot
    const { total: curX } = xTotal(t);
    const dotPx = plotL + (t / tMax) * plotW;
    const dotPy = midY - curX * scale;
    ctx.fillStyle = WCOLORS.teal;
    ctx.beginPath(); ctx.arc(dotPx, dotPy, 5, 0, Math.PI * 2); ctx.fill();

    // Legend
    ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.teal; ctx.fillText('\u2014 Total x(t)', plotL + 10, plotB + 12);
    ctx.fillStyle = WCOLORS.amber; ctx.fillText('\u2014 Steady state', plotL + 100, plotB + 12);
    ctx.fillStyle = WCOLORS.red; ctx.fillText('\u2014 Transient', plotL + 210, plotB + 12);

    // Title
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Transient dies away \u2192 only steady state survives', plotL + plotW / 2, plotT - 6);
  }

  tick();
}

// =========================================================================
// 3. PHASE LAG — force vs response comparison
// =========================================================================
function initPhaseLag() {
  const canvas = document.getElementById('scene-phase-lag');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let t = 0;
  const plotL = 50, plotR = W - 20, plotT = 30, plotB = H - 30;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const midY = (plotT + plotB) / 2;

  // Embed a slider if the canvas has a parent scene
  let wdSlider = document.getElementById('phase-lag-wd');
  if (!wdSlider) {
    // Create controls dynamically after the canvas
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML = '<label>\u03C9<sub>d</sub>: <input type="range" id="phase-lag-wd" min="0.5" max="10" step="0.1" value="3"><span class="scene-val" id="phase-lag-wd-val">3.0</span></label>';
      parent.appendChild(controls);
      wdSlider = document.getElementById('phase-lag-wd');
    }
  }

  const w0 = 5, gamma = 0.5;

  function getAB(wd) {
    const denom = (w0 * w0 - wd * wd) ** 2 + (gamma * wd) ** 2;
    return { A: (w0 * w0 - wd * wd) / denom, B: (gamma * wd) / denom };
  }

  function tick() {
    const wd = parseFloat(wdSlider?.value || 3);
    document.getElementById('phase-lag-wd-val')?.replaceChildren(document.createTextNode(wd.toFixed(1)));

    t += 0.025;
    const { A, B } = getAB(wd);
    const amp = Math.sqrt(A * A + B * B);
    const phase = -Math.atan2(B, A);

    draw(wd, A, B, amp, phase);
    requestAnimationFrame(tick);
  }

  function draw(wd, A, B, amp, phase) {
    wClear(ctx, W, H);

    // Axes
    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();

    const nCycles = 3;
    const tRange = nCycles * 2 * Math.PI / wd;
    const scale = plotH * 0.4;

    // Force (driving)
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= plotW; px++) {
      const tc = (px / plotW) * tRange + t;
      const f = Math.cos(wd * tc);
      const py = midY - f * scale * 0.5;
      px === 0 ? ctx.moveTo(plotL + px, py) : ctx.lineTo(plotL + px, py);
    }
    ctx.stroke();

    // Response
    const normAmp = Math.min(amp * 20, 1);
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px <= plotW; px++) {
      const tc = (px / plotW) * tRange + t;
      const x = (A * Math.cos(wd * tc) + B * Math.sin(wd * tc)) * 20;
      const py = midY - x * scale;
      px === 0 ? ctx.moveTo(plotL + px, py) : ctx.lineTo(plotL + px, py);
    }
    ctx.stroke();

    // Phase info
    const phaseDeg = (phase * 180 / Math.PI);
    const inPhase = wd < w0;
    ctx.fillStyle = WCOLORS.text; ctx.font = '13px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(inPhase ? 'In phase (\u03C9_d < \u03C9\u2080)' : 'Out of phase (\u03C9_d > \u03C9\u2080)', plotL + plotW / 2, plotT - 6);

    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Phase lag: ' + phaseDeg.toFixed(1) + '\u00B0', plotL + 10, plotB + 14);
    ctx.fillText('\u03C9_d = ' + wd.toFixed(1) + '   \u03C9\u2080 = ' + w0.toFixed(1), plotL + plotW * 0.5, plotB + 14);

    // Legend
    ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('F(t) (driving force)', plotR, plotT + 10);
    ctx.fillStyle = WCOLORS.teal;
    ctx.fillText('x(t) (response)', plotR, plotT + 24);
  }

  wdSlider?.addEventListener('input', () => { t = 0; });
  tick();
}

// =========================================================================
// 4. POWER ABSORPTION — elastic vs absorptive
// =========================================================================
function initPowerAbsorption() {
  const canvas = document.getElementById('scene-power-absorption');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  let t = 0;
  const plotL = 50, plotR = W - 20, plotT = 30, plotB = H - 30;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const midY = (plotT + plotB) / 2;

  // Create controls
  let wdSlider = document.getElementById('power-wd');
  if (!wdSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML = '<label>\u03C9<sub>d</sub>: <input type="range" id="power-wd" min="0.5" max="10" step="0.1" value="5"><span class="scene-val" id="power-wd-val">5.0</span></label>' +
        '<label>\u03B3: <input type="range" id="power-gamma" min="0.1" max="4" step="0.1" value="1"><span class="scene-val" id="power-gamma-val">1.0</span></label>';
      parent.appendChild(controls);
      wdSlider = document.getElementById('power-wd');
    }
  }
  const gammaSlider = document.getElementById('power-gamma');
  const w0 = 5;

  function tick() {
    const wd = parseFloat(wdSlider?.value || 5);
    const gamma = parseFloat(gammaSlider?.value || 1);
    document.getElementById('power-wd-val')?.replaceChildren(document.createTextNode(wd.toFixed(1)));
    document.getElementById('power-gamma-val')?.replaceChildren(document.createTextNode(gamma.toFixed(1)));

    t += 0.02;

    const denom = (w0 * w0 - wd * wd) ** 2 + (gamma * wd) ** 2;
    const A = (w0 * w0 - wd * wd) / denom;
    const B = (gamma * wd) / denom;

    draw(wd, gamma, A, B);
    requestAnimationFrame(tick);
  }

  function draw(wd, gamma, A, B) {
    wClear(ctx, W, H);

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, midY); ctx.lineTo(plotR, midY); ctx.stroke();

    const tRange = 3 * 2 * Math.PI / wd;
    const pScale = plotH * 0.3;

    // Power = F * dx/dt = F0 cos(wd t) * wd [-A sin(wd t) + B cos(wd t)]
    // P_elastic = -F0^2 wd A sin(wd t) cos(wd t) = -(F0^2 wd A / 2) sin(2 wd t)
    // P_absorptive = F0^2 wd B cos^2(wd t)
    for (let px = 0; px <= plotW; px++) {
      const tc = (px / plotW) * tRange + t;

      const pElastic = -wd * A * Math.sin(wd * tc) * Math.cos(wd * tc);
      const pAbsorptive = wd * B * Math.cos(wd * tc) * Math.cos(wd * tc);
      const pTotal = pElastic + pAbsorptive;

      const pxCoord = plotL + px;

      // Elastic (fills alternating)
      if (px % 2 === 0) {
        ctx.fillStyle = pElastic > 0 ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.08)';
        const barH = pElastic * pScale * 10;
        ctx.fillRect(pxCoord, midY - Math.max(barH, 0), 2, Math.abs(barH));
      }
    }

    // Elastic curve
    ctx.strokeStyle = WCOLORS.blue; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let px = 0; px <= plotW; px++) {
      const tc = (px / plotW) * tRange + t;
      const pEl = -wd * A * Math.sin(wd * tc) * Math.cos(wd * tc);
      const py = midY - pEl * pScale * 10;
      px === 0 ? ctx.moveTo(plotL + px, py) : ctx.lineTo(plotL + px, py);
    }
    ctx.stroke();

    // Absorptive curve
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= plotW; px++) {
      const tc = (px / plotW) * tRange + t;
      const pAb = wd * B * Math.cos(wd * tc) ** 2;
      const py = midY - pAb * pScale * 10;
      px === 0 ? ctx.moveTo(plotL + px, py) : ctx.lineTo(plotL + px, py);
    }
    ctx.stroke();

    // Average power line
    const avgP = wd * B * 0.5;
    const avgPy = midY - avgP * pScale * 10;
    ctx.strokeStyle = WCOLORS.red; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(plotL, avgPy); ctx.lineTo(plotR, avgPy); ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Power P(t) = F \u00B7 dx/dt', plotL + plotW / 2, plotT - 6);

    ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = WCOLORS.blue; ctx.fillText('\u2014 Elastic (averages to 0)', plotL + 5, plotB + 14);
    ctx.fillStyle = WCOLORS.red; ctx.fillText('\u2014 Absorptive (always \u2265 0)', plotL + plotW * 0.45, plotB + 14);
    ctx.fillStyle = WCOLORS.textDim; ctx.textAlign = 'right';
    ctx.fillText('\u27E8P\u27E9 = ' + (avgP * 10).toFixed(2), plotR, avgPy - 5);
  }

  wdSlider?.addEventListener('input', () => { t = 0; });
  gammaSlider?.addEventListener('input', () => { t = 0; });
  tick();
}

// =========================================================================
// 5. RESONANCE CURVE — Lorentzian power absorption
// =========================================================================
function initResonanceCurve() {
  const canvas = document.getElementById('scene-resonance-curve');
  if (!canvas) return;
  const setup = wSetupCanvas(canvas);
  if (!setup) return;
  const { ctx, W, H } = setup;

  const plotL = 60, plotR = W - 20, plotT = 30, plotB = H - 30;
  const plotW = plotR - plotL, plotH = plotB - plotT;

  // Create controls
  let gammaSlider = document.getElementById('res-gamma');
  if (!gammaSlider) {
    const parent = canvas.parentElement;
    if (parent) {
      const controls = document.createElement('div');
      controls.className = 'scene-controls';
      controls.innerHTML = '<label>\u03B3: <input type="range" id="res-gamma" min="0.1" max="4" step="0.1" value="0.5"><span class="scene-val" id="res-gamma-val">0.5</span></label>' +
        '<label>\u03C9<sub>0</sub>: <input type="range" id="res-w0" min="2" max="8" step="0.1" value="5"><span class="scene-val" id="res-w0-val">5.0</span></label>';
      parent.appendChild(controls);
      gammaSlider = document.getElementById('res-gamma');
    }
  }
  const w0Slider = document.getElementById('res-w0');

  function avgPower(w0, wd, gamma) {
    const denom = (w0 * w0 - wd * wd) ** 2 + (gamma * wd) ** 2;
    return (gamma * wd * wd) / denom;
  }

  function draw() {
    const gamma = parseFloat(gammaSlider?.value || 0.5);
    const w0 = parseFloat(w0Slider?.value || 5);
    document.getElementById('res-gamma-val')?.replaceChildren(document.createTextNode(gamma.toFixed(1)));
    document.getElementById('res-w0-val')?.replaceChildren(document.createTextNode(w0.toFixed(1)));

    wClear(ctx, W, H);

    ctx.strokeStyle = WCOLORS.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();

    const wMax = 10;
    let maxP = 0;
    for (let i = 0; i <= 300; i++) {
      const w = (i / 300) * wMax;
      const p = avgPower(w0, w, gamma);
      if (p > maxP) maxP = p;
    }
    if (maxP < 0.001) maxP = 1;

    // Main curve
    ctx.strokeStyle = WCOLORS.teal; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const w = (i / 300) * wMax;
      const p = avgPower(w0, w, gamma);
      const px = plotL + (w / wMax) * plotW;
      const py = plotB - (p / maxP) * plotH * 0.9;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Half-max line
    const halfMaxP = maxP / 2;
    const halfY = plotB - (halfMaxP / maxP) * plotH * 0.9;
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(plotL, halfY); ctx.lineTo(plotR, halfY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('\u00BD max', plotL - 4, halfY + 3);

    // FWHM bracket
    // Half-power frequencies: approximately w0 +/- gamma/2
    const wHalf1 = Math.max(0, w0 - gamma / 2);
    const wHalf2 = w0 + gamma / 2;
    const px1 = plotL + (wHalf1 / wMax) * plotW;
    const px2 = plotL + (wHalf2 / wMax) * plotW;
    ctx.strokeStyle = WCOLORS.amber; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(px1, halfY + 3); ctx.lineTo(px2, halfY + 3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px1, halfY); ctx.lineTo(px1, halfY + 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px2, halfY); ctx.lineTo(px2, halfY + 8); ctx.stroke();
    ctx.fillStyle = WCOLORS.amber; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u0394\u03C9 = \u03B3', (px1 + px2) / 2, halfY + 18);

    // Peak marker
    const peakPx = plotL + (w0 / wMax) * plotW;
    const peakPy = plotB - plotH * 0.9;
    ctx.fillStyle = WCOLORS.amber;
    ctx.beginPath(); ctx.arc(peakPx, peakPy, 5, 0, Math.PI * 2); ctx.fill();

    // w0 label
    ctx.strokeStyle = WCOLORS.textDim; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(peakPx, plotT); ctx.lineTo(peakPx, plotB); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u03C9\u2080', peakPx, plotB + 14);

    // Axis labels
    ctx.fillStyle = WCOLORS.text; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('\u27E8P\u27E9', plotL - 20, plotT - 4);
    ctx.fillText('\u03C9_d', plotR + 10, plotB + 4);

    // Q value and info
    const Q = w0 / gamma;
    ctx.fillStyle = WCOLORS.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Lorentzian resonance: Q = \u03C9\u2080/\u03B3 = ' + Q.toFixed(1), plotL + plotW / 2, plotT - 8);

    // Tick marks on x-axis
    ctx.fillStyle = WCOLORS.textDim; ctx.font = '9px system-ui';
    for (let w = 0; w <= wMax; w += 2) {
      const tx = plotL + (w / wMax) * plotW;
      ctx.beginPath(); ctx.moveTo(tx, plotB); ctx.lineTo(tx, plotB + 4); ctx.strokeStyle = WCOLORS.axis; ctx.stroke();
      ctx.fillText(w.toString(), tx, plotB + 14);
    }
  }

  gammaSlider?.addEventListener('input', draw);
  w0Slider?.addEventListener('input', draw);
  draw();
}
