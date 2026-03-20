// source-data.js — Waves course chapter metadata
// Auto-generated structured data for search, navigation, and summaries.

window.WAVES_SOURCE_DATA = {

  "01-Oscillators-And-Linearity": {
    pageCount: 9,
    sections: [
      "Introduction to Oscillatory Motion",
      "Simple Harmonic Oscillator",
      "Complex Exponential Solutions",
      "Energy in the SHO",
      "Linearity and Superposition",
      "Damped Oscillations",
      "Quality Factor"
    ],
    sectionAnchors: [
      { title: "Introduction to Oscillatory Motion", anchor: "intro-oscillatory-motion" },
      { title: "Simple Harmonic Oscillator", anchor: "simple-harmonic-oscillator" },
      { title: "Complex Exponential Solutions", anchor: "complex-exponential-solutions" },
      { title: "Energy in the SHO", anchor: "energy-sho" },
      { title: "Linearity and Superposition", anchor: "linearity-superposition" },
      { title: "Damped Oscillations", anchor: "damped-oscillations" },
      { title: "Quality Factor", anchor: "quality-factor" }
    ],
    equations: [
      "SHO equation of motion: m d²x/dt² = -kx",
      "Angular frequency: ω₀ = √(k/m)",
      "General SHO solution: x(t) = A cos(ω₀t + φ)",
      "Complex exponential form: x(t) = Re[A e^{iω₀t}]",
      "Total energy: E = ½kA²",
      "Damped oscillator: m d²x/dt² + b dx/dt + kx = 0",
      "Quality factor: Q = ω₀m/b"
    ],
    searchIndex: [
      { kind: "section", title: "Simple Harmonic Oscillator", target: "01-Oscillators-And-Linearity", anchor: "simple-harmonic-oscillator", snippet: "Mass on a spring as the canonical oscillator, restoring force proportional to displacement." },
      { kind: "equation", title: "SHO Equation of Motion", target: "01-Oscillators-And-Linearity", anchor: "simple-harmonic-oscillator", snippet: "m d²x/dt² = -kx, yielding sinusoidal solutions at natural frequency ω₀." },
      { kind: "concept", title: "Linearity and Superposition", target: "01-Oscillators-And-Linearity", anchor: "linearity-superposition", snippet: "A linear system obeys superposition: if x₁ and x₂ are solutions, so is c₁x₁ + c₂x₂." },
      { kind: "concept", title: "Quality Factor", target: "01-Oscillators-And-Linearity", anchor: "quality-factor", snippet: "Q measures how many radians of oscillation occur before the amplitude decays significantly." },
      { kind: "equation", title: "Damped Oscillator Equation", target: "01-Oscillators-And-Linearity", anchor: "damped-oscillations", snippet: "Includes velocity-dependent damping term b dx/dt, leading to exponential decay of amplitude." }
    ],
    derivationHighlights: [
      "Derivation of the SHO general solution via complex exponentials",
      "Energy conservation in the simple harmonic oscillator",
      "Underdamped, overdamped, and critically damped regimes"
    ],
    summaryBlocks: [
      "The simple harmonic oscillator is the foundation of wave physics. Any system near a stable equilibrium can be approximated as an SHO for small displacements.",
      "Complex exponential notation simplifies the algebra of oscillatory systems and naturally encodes both amplitude and phase information.",
      "Damping introduces energy loss. The quality factor Q quantifies how underdamped a system is: high Q means many oscillations before significant decay."
    ]
  },

  "02-Driven-Oscillators": {
    pageCount: 10,
    sections: [
      "Driving Forces and Steady State",
      "Resonance",
      "Amplitude and Phase Response",
      "Where Does the Energy Go?",
      "Transient and Steady-State Solutions",
      "Impedance of a Mechanical Oscillator",
      "Electrical Analogs: RLC Circuits"
    ],
    sectionAnchors: [
      { title: "Driving Forces and Steady State", anchor: "driving-forces-steady-state" },
      { title: "Resonance", anchor: "resonance" },
      { title: "Amplitude and Phase Response", anchor: "amplitude-phase-response" },
      { title: "Where Does the Energy Go?", anchor: "power-absorption" },
      { title: "Transient and Steady-State Solutions", anchor: "transient-steady-state" },
      { title: "Impedance of a Mechanical Oscillator", anchor: "impedance-mechanical" },
      { title: "Electrical Analogs: RLC Circuits", anchor: "rlc-circuits" }
    ],
    equations: [
      "Driven oscillator: m d²x/dt² + b dx/dt + kx = F₀ cos(ωt)",
      "Steady-state amplitude: A(ω) = F₀ / √((k - mω²)² + (bω)²)",
      "Phase lag: tan φ = bω / (k - mω²)",
      "Resonance frequency: ω_res ≈ ω₀ for light damping",
      "Average power absorbed: ⟨P⟩ = ½ F₀² b ω² / ((k - mω²)² + (bω)²)",
      "FWHM of power curve: Δω ≈ b/m = ω₀/Q",
      "Mechanical impedance: Z = b + i(mω - k/ω)"
    ],
    searchIndex: [
      { kind: "section", title: "Resonance", target: "02-Driven-Oscillators", anchor: "resonance", snippet: "The amplitude of a driven oscillator peaks near ω₀, with the width of the peak controlled by damping." },
      { kind: "equation", title: "Steady-State Amplitude", target: "02-Driven-Oscillators", anchor: "amplitude-phase-response", snippet: "Lorentzian amplitude response showing peak at resonance and roll-off away from it." },
      { kind: "concept", title: "Transient vs Steady State", target: "02-Driven-Oscillators", anchor: "transient-steady-state", snippet: "The transient solution decays exponentially; after several time constants only the steady state remains." },
      { kind: "concept", title: "Mechanical Impedance", target: "02-Driven-Oscillators", anchor: "impedance-mechanical", snippet: "Impedance relates the applied force to the resulting velocity, generalizing resistance to include reactance." },
      { kind: "section", title: "RLC Circuit Analogy", target: "02-Driven-Oscillators", anchor: "rlc-circuits", snippet: "Mass↔inductance, damping↔resistance, spring↔1/capacitance: the math is identical." }
    ],
    derivationHighlights: [
      "Complex-exponential method for the driven oscillator steady-state solution",
      "Derivation of the Lorentzian power absorption curve",
      "Connection between mechanical and electrical impedance"
    ],
    summaryBlocks: [
      "A sinusoidally driven oscillator eventually settles into a steady-state response at the driving frequency, with amplitude and phase determined by the system parameters.",
      "Resonance occurs when the driving frequency matches the natural frequency. The response amplitude is limited only by damping, and the phase shifts through 90° at resonance.",
      "The power absorption curve is a Lorentzian with full-width at half-maximum equal to ω₀/Q, providing a direct experimental measure of the quality factor."
    ]
  },

  "03-Coupled-Oscillators": {
    pageCount: 11,
    sections: [
      "Two Coupled Pendulums",
      "Normal Modes",
      "Normal Coordinates",
      "Eigenvalue Problem",
      "Beats and Energy Transfer",
      "N Coupled Oscillators",
      "Dispersion Relation for a Lattice"
    ],
    sectionAnchors: [
      { title: "Two Coupled Pendulums", anchor: "two-coupled-pendulums" },
      { title: "Normal Modes", anchor: "normal-modes" },
      { title: "Normal Coordinates", anchor: "normal-coordinates" },
      { title: "Eigenvalue Problem", anchor: "eigenvalue-problem" },
      { title: "Beats and Energy Transfer", anchor: "beats-energy-transfer" },
      { title: "N Coupled Oscillators", anchor: "n-coupled-oscillators" },
      { title: "Dispersion Relation for a Lattice", anchor: "dispersion-lattice" }
    ],
    equations: [
      "Coupled equations: m ẍ₁ = -kx₁ - κ(x₁ - x₂)",
      "Normal mode frequencies: ω₊ = √(k/m), ω₋ = √((k + 2κ)/m)",
      "Normal coordinates: q₁ = x₁ + x₂, q₂ = x₁ - x₂",
      "Beat frequency: ω_beat = |ω₊ - ω₋|",
      "Dispersion relation (1D lattice): ω(k) = 2√(κ/m) |sin(ka/2)|",
      "Matrix eigenvalue form: M⁻¹K · A = ω² A"
    ],
    searchIndex: [
      { kind: "section", title: "Normal Modes", target: "03-Coupled-Oscillators", anchor: "normal-modes", snippet: "Independent patterns of motion where all parts oscillate at the same frequency and fixed phase relationships." },
      { kind: "equation", title: "Normal Mode Frequencies", target: "03-Coupled-Oscillators", anchor: "normal-modes", snippet: "The symmetric and antisymmetric modes of two coupled oscillators have distinct frequencies." },
      { kind: "concept", title: "Beats and Energy Transfer", target: "03-Coupled-Oscillators", anchor: "beats-energy-transfer", snippet: "When two normal modes are superposed, energy sloshes back and forth between the oscillators at the beat frequency." },
      { kind: "equation", title: "1D Lattice Dispersion", target: "03-Coupled-Oscillators", anchor: "dispersion-lattice", snippet: "ω(k) = 2√(κ/m)|sin(ka/2)| — the first Brillouin zone dispersion relation for a monatomic chain." },
      { kind: "concept", title: "Normal Coordinates", target: "03-Coupled-Oscillators", anchor: "normal-coordinates", snippet: "Linear combinations of original coordinates that decouple the equations of motion." }
    ],
    derivationHighlights: [
      "Finding normal modes by diagonalizing the coupled equations",
      "Derivation of the dispersion relation for N masses on springs",
      "Energy transfer between coupled oscillators via beating"
    ],
    summaryBlocks: [
      "Coupled oscillators are analyzed by finding their normal modes — independent oscillation patterns each with a well-defined frequency.",
      "Normal coordinates transform coupled differential equations into independent ones, reducing a complex problem to a set of simple harmonic oscillators.",
      "As the number of coupled oscillators grows, the discrete normal mode spectrum approaches a continuous dispersion relation, bridging the gap from oscillators to waves."
    ]
  },

  "04-Oscillators-to-Waves": {
    pageCount: 8,
    sections: [
      "Continuum Limit of Coupled Oscillators",
      "The Wave Equation",
      "Traveling Wave Solutions",
      "Phase Velocity",
      "Boundary Conditions and Standing Waves",
      "Waves on Strings"
    ],
    sectionAnchors: [
      { title: "Continuum Limit of Coupled Oscillators", anchor: "continuum-limit" },
      { title: "The Wave Equation", anchor: "wave-equation" },
      { title: "Traveling Wave Solutions", anchor: "traveling-wave-solutions" },
      { title: "Phase Velocity", anchor: "phase-velocity" },
      { title: "Boundary Conditions and Standing Waves", anchor: "boundary-standing-waves" },
      { title: "Waves on Strings", anchor: "waves-on-strings" }
    ],
    equations: [
      "Wave equation: ∂²y/∂t² = v² ∂²y/∂x²",
      "Phase velocity on a string: v = √(T/μ)",
      "General solution: y(x,t) = f(x - vt) + g(x + vt)",
      "Standing wave: y(x,t) = A sin(nπx/L) cos(ω_n t)",
      "Allowed frequencies (fixed ends): ω_n = nπv/L",
      "Continuum limit: a → 0, κa → T, m/a → μ"
    ],
    searchIndex: [
      { kind: "section", title: "The Wave Equation", target: "04-Oscillators-to-Waves", anchor: "wave-equation", snippet: "Second-order PDE governing wave propagation, derived from Newton's law applied to a continuous medium." },
      { kind: "equation", title: "d'Alembert Solution", target: "04-Oscillators-to-Waves", anchor: "traveling-wave-solutions", snippet: "y(x,t) = f(x - vt) + g(x + vt): any shape propagates unchanged at speed v." },
      { kind: "concept", title: "Phase Velocity", target: "04-Oscillators-to-Waves", anchor: "phase-velocity", snippet: "The speed at which a point of constant phase moves along the wave." },
      { kind: "section", title: "Standing Waves", target: "04-Oscillators-to-Waves", anchor: "boundary-standing-waves", snippet: "Boundary conditions quantize the allowed wavelengths, producing discrete normal mode frequencies." },
      { kind: "equation", title: "String Wave Speed", target: "04-Oscillators-to-Waves", anchor: "waves-on-strings", snippet: "v = √(T/μ) — wave speed depends on tension and linear mass density." }
    ],
    derivationHighlights: [
      "Taking the continuum limit of the coupled oscillator chain",
      "d'Alembert's general solution to the wave equation",
      "Normal modes of a string with fixed endpoints"
    ],
    summaryBlocks: [
      "The wave equation emerges naturally as the continuum limit of many coupled oscillators, connecting the discrete normal-mode picture to continuous wave phenomena.",
      "d'Alembert's solution shows that any initial disturbance splits into right- and left-traveling pulses that propagate without changing shape.",
      "Boundary conditions on a finite string select a discrete set of standing wave modes, each a sinusoidal pattern oscillating at a quantized frequency."
    ]
  },

  "05-Fourier-Series": {
    pageCount: 10,
    sections: [
      "Periodic Functions",
      "Fourier Coefficients",
      "Convergence and Gibbs Phenomenon",
      "Even and Odd Functions",
      "Parseval's Theorem",
      "Complex Form of Fourier Series",
      "Applications to Wave Problems"
    ],
    sectionAnchors: [
      { title: "Periodic Functions", anchor: "periodic-functions" },
      { title: "Fourier Coefficients", anchor: "fourier-coefficients" },
      { title: "Convergence and Gibbs Phenomenon", anchor: "convergence-gibbs" },
      { title: "Even and Odd Functions", anchor: "even-odd-functions" },
      { title: "Parseval's Theorem", anchor: "parsevals-theorem" },
      { title: "Complex Form of Fourier Series", anchor: "complex-fourier-series" },
      { title: "Applications to Wave Problems", anchor: "applications-wave-problems" }
    ],
    equations: [
      "Fourier series: f(x) = a₀/2 + Σ [aₙ cos(nπx/L) + bₙ sin(nπx/L)]",
      "Coefficients: aₙ = (1/L) ∫ f(x) cos(nπx/L) dx",
      "Coefficients: bₙ = (1/L) ∫ f(x) sin(nπx/L) dx",
      "Complex form: f(x) = Σ cₙ e^{inπx/L}",
      "Parseval's theorem: (1/2L) ∫|f(x)|² dx = |a₀/2|² + ½ Σ(aₙ² + bₙ²)",
      "Orthogonality: ∫ sin(nπx/L) sin(mπx/L) dx = L δₙₘ"
    ],
    searchIndex: [
      { kind: "section", title: "Fourier Coefficients", target: "05-Fourier-Series", anchor: "fourier-coefficients", snippet: "Projection of a periodic function onto sine and cosine basis functions via orthogonality integrals." },
      { kind: "concept", title: "Gibbs Phenomenon", target: "05-Fourier-Series", anchor: "convergence-gibbs", snippet: "Fourier series overshoot at discontinuities by approximately 9%, even as the number of terms → ∞." },
      { kind: "equation", title: "Parseval's Theorem", target: "05-Fourier-Series", anchor: "parsevals-theorem", snippet: "The total power in a signal equals the sum of the powers in each Fourier component." },
      { kind: "concept", title: "Complex Fourier Series", target: "05-Fourier-Series", anchor: "complex-fourier-series", snippet: "Using complex exponentials e^{inπx/L} as basis functions, with coefficients cₙ encoding amplitude and phase." },
      { kind: "section", title: "Even and Odd Symmetry", target: "05-Fourier-Series", anchor: "even-odd-functions", snippet: "Even functions have only cosine terms; odd functions have only sine terms." }
    ],
    derivationHighlights: [
      "Derivation of Fourier coefficients using orthogonality",
      "Fourier series of a square wave and sawtooth wave",
      "Proof of Parseval's theorem from orthogonality"
    ],
    summaryBlocks: [
      "Any periodic function can be decomposed into a sum of sines and cosines. The Fourier coefficients are found by exploiting orthogonality of the basis functions.",
      "The Gibbs phenomenon is a fundamental limitation: Fourier series always overshoot at jump discontinuities, but the integral of the error vanishes.",
      "Parseval's theorem connects the time/space domain to the frequency domain, stating that total energy is preserved under Fourier decomposition."
    ]
  },

  "06-Waves": {
    pageCount: 9,
    sections: [
      "Sinusoidal Traveling Waves",
      "Wavelength, Frequency, and Wave Number",
      "Transverse and Longitudinal Waves",
      "Energy Transport by Waves",
      "Wave Intensity",
      "Superposition of Waves",
      "Interference"
    ],
    sectionAnchors: [
      { title: "Sinusoidal Traveling Waves", anchor: "sinusoidal-traveling-waves" },
      { title: "Wavelength, Frequency, and Wave Number", anchor: "wavelength-frequency-wavenumber" },
      { title: "Transverse and Longitudinal Waves", anchor: "transverse-longitudinal" },
      { title: "Energy Transport by Waves", anchor: "energy-transport" },
      { title: "Wave Intensity", anchor: "wave-intensity" },
      { title: "Superposition of Waves", anchor: "superposition-waves" },
      { title: "Interference", anchor: "interference" }
    ],
    equations: [
      "Sinusoidal wave: y(x,t) = A sin(kx - ωt + φ)",
      "Dispersion relation: ω = vk",
      "Wave number: k = 2π/λ",
      "Period and frequency: T = 1/f = 2π/ω",
      "Energy density: u = ½ μ ω² A²",
      "Intensity: I = ½ μ v ω² A²",
      "Constructive interference condition: Δφ = 2nπ"
    ],
    searchIndex: [
      { kind: "section", title: "Sinusoidal Traveling Waves", target: "06-Waves", anchor: "sinusoidal-traveling-waves", snippet: "The fundamental building block: a wave of definite frequency, wavelength, and amplitude." },
      { kind: "equation", title: "Dispersion Relation", target: "06-Waves", anchor: "wavelength-frequency-wavenumber", snippet: "ω = vk for a nondispersive medium; the relationship between frequency and wave number." },
      { kind: "concept", title: "Transverse vs Longitudinal", target: "06-Waves", anchor: "transverse-longitudinal", snippet: "Transverse waves oscillate perpendicular to propagation; longitudinal waves oscillate parallel." },
      { kind: "equation", title: "Wave Intensity", target: "06-Waves", anchor: "wave-intensity", snippet: "Power per unit area, proportional to amplitude squared and frequency squared." },
      { kind: "concept", title: "Interference", target: "06-Waves", anchor: "interference", snippet: "Superposition of coherent waves produces constructive or destructive interference depending on phase difference." }
    ],
    derivationHighlights: [
      "Energy and power carried by a sinusoidal wave on a string",
      "Superposition of two waves with slightly different frequencies (beats)",
      "Conditions for constructive and destructive interference"
    ],
    summaryBlocks: [
      "Sinusoidal traveling waves are characterized by amplitude, wavelength, frequency, and phase. The dispersion relation ω(k) encodes the medium's properties.",
      "Waves transport energy without transporting matter. The intensity is proportional to the square of the amplitude.",
      "Interference arises from superposition: waves add constructively when in phase and destructively when out of phase."
    ]
  },

  "07-Music": {
    pageCount: 7,
    sections: [
      "Musical Tones and Harmonics",
      "Standing Waves in Instruments",
      "Open and Closed Pipes",
      "Timbre and Harmonic Content",
      "Consonance and Dissonance",
      "Equal Temperament and Just Intonation"
    ],
    sectionAnchors: [
      { title: "Musical Tones and Harmonics", anchor: "musical-tones-harmonics" },
      { title: "Standing Waves in Instruments", anchor: "standing-waves-instruments" },
      { title: "Open and Closed Pipes", anchor: "open-closed-pipes" },
      { title: "Timbre and Harmonic Content", anchor: "timbre-harmonic-content" },
      { title: "Consonance and Dissonance", anchor: "consonance-dissonance" },
      { title: "Equal Temperament and Just Intonation", anchor: "temperament-intonation" }
    ],
    equations: [
      "Harmonics of a string: fₙ = n v/(2L)",
      "Open pipe harmonics: fₙ = n v/(2L), n = 1, 2, 3, …",
      "Closed pipe harmonics: fₙ = n v/(4L), n = 1, 3, 5, …",
      "Frequency ratio for equal temperament: r = 2^(1/12)",
      "Perfect fifth ratio: 3/2 ≈ 2^(7/12)",
      "Beat frequency between mistuned notes: f_beat = |f₁ - f₂|"
    ],
    searchIndex: [
      { kind: "section", title: "Harmonics", target: "07-Music", anchor: "musical-tones-harmonics", snippet: "Musical pitch is determined by the fundamental frequency; the harmonic series gives overtones." },
      { kind: "concept", title: "Open vs Closed Pipes", target: "07-Music", anchor: "open-closed-pipes", snippet: "Open pipes support all harmonics; closed pipes support only odd harmonics." },
      { kind: "concept", title: "Timbre", target: "07-Music", anchor: "timbre-harmonic-content", snippet: "The characteristic sound quality determined by the relative amplitudes of harmonics." },
      { kind: "concept", title: "Equal Temperament", target: "07-Music", anchor: "temperament-intonation", snippet: "Dividing the octave into 12 equal semitones with frequency ratio 2^(1/12)." },
      { kind: "concept", title: "Consonance and Dissonance", target: "07-Music", anchor: "consonance-dissonance", snippet: "Simple frequency ratios (octave 2:1, fifth 3:2) sound consonant; complex ratios sound dissonant." }
    ],
    derivationHighlights: [
      "Normal modes of open and closed pipes",
      "Harmonic series and its connection to Fourier decomposition",
      "Why equal temperament is a compromise"
    ],
    summaryBlocks: [
      "Musical instruments produce standing waves whose harmonic frequencies are integer multiples of the fundamental, directly connecting wave physics to the structure of music.",
      "Timbre — the quality that distinguishes a violin from a flute playing the same note — is determined by the relative amplitudes and phases of the harmonics.",
      "Tuning systems balance mathematical purity (just intonation, with exact frequency ratios) against practical flexibility (equal temperament, enabling modulation between keys)."
    ]
  },

  "08-Fourier-Transforms": {
    pageCount: 10,
    sections: [
      "From Fourier Series to Fourier Transform",
      "The Fourier Transform",
      "Inverse Fourier Transform",
      "Properties of the Fourier Transform",
      "Convolution Theorem",
      "Dirac Delta Function",
      "Uncertainty Principle"
    ],
    sectionAnchors: [
      { title: "From Fourier Series to Fourier Transform", anchor: "series-to-transform" },
      { title: "The Fourier Transform", anchor: "fourier-transform" },
      { title: "Inverse Fourier Transform", anchor: "inverse-fourier-transform" },
      { title: "Properties of the Fourier Transform", anchor: "ft-properties" },
      { title: "Convolution Theorem", anchor: "convolution-theorem" },
      { title: "Dirac Delta Function", anchor: "dirac-delta" },
      { title: "Uncertainty Principle", anchor: "uncertainty-principle" }
    ],
    equations: [
      "Fourier transform: F(ω) = ∫ f(t) e^{-iωt} dt",
      "Inverse transform: f(t) = (1/2π) ∫ F(ω) e^{iωt} dω",
      "Convolution: (f * g)(t) = ∫ f(τ) g(t - τ) dτ",
      "Convolution theorem: FT[f * g] = F(ω) · G(ω)",
      "Dirac delta: ∫ δ(t - t₀) f(t) dt = f(t₀)",
      "FT of a Gaussian: FT[e^{-at²}] = √(π/a) e^{-ω²/(4a)}",
      "Uncertainty relation: Δt · Δω ≥ ½"
    ],
    searchIndex: [
      { kind: "section", title: "Fourier Transform", target: "08-Fourier-Transforms", anchor: "fourier-transform", snippet: "Generalization of Fourier series to non-periodic functions, decomposing into a continuous spectrum." },
      { kind: "equation", title: "Convolution Theorem", target: "08-Fourier-Transforms", anchor: "convolution-theorem", snippet: "Convolution in the time domain corresponds to multiplication in the frequency domain." },
      { kind: "concept", title: "Dirac Delta Function", target: "08-Fourier-Transforms", anchor: "dirac-delta", snippet: "A distribution that is zero everywhere except at one point, with unit integral — the identity for convolution." },
      { kind: "equation", title: "Uncertainty Principle", target: "08-Fourier-Transforms", anchor: "uncertainty-principle", snippet: "A function cannot be simultaneously narrow in both time and frequency; Δt · Δω ≥ ½." },
      { kind: "concept", title: "FT of a Gaussian", target: "08-Fourier-Transforms", anchor: "ft-properties", snippet: "A Gaussian transforms into another Gaussian — the unique function that minimizes the uncertainty product." }
    ],
    derivationHighlights: [
      "Taking the L → ∞ limit of the Fourier series to obtain the Fourier transform",
      "Proof of the convolution theorem",
      "Derivation of the uncertainty relation from Fourier analysis"
    ],
    summaryBlocks: [
      "The Fourier transform extends Fourier series to non-periodic functions, decomposing any reasonable function into a continuous superposition of complex exponentials.",
      "The convolution theorem is a powerful computational tool: it converts convolution integrals into simple multiplications in the frequency domain.",
      "The uncertainty principle is a mathematical theorem of Fourier analysis: narrowing a signal in time necessarily broadens its frequency content, and vice versa."
    ]
  },

  "09-Reflection-Transmission-Impedance": {
    pageCount: 9,
    sections: [
      "Waves at a Boundary",
      "Reflection and Transmission Coefficients",
      "Impedance Matching",
      "Characteristic Impedance",
      "Quarter-Wave Transformer",
      "Multiple Boundaries and Thin Films",
      "Total Internal Reflection"
    ],
    sectionAnchors: [
      { title: "Waves at a Boundary", anchor: "waves-at-boundary" },
      { title: "Reflection and Transmission Coefficients", anchor: "reflection-transmission-coefficients" },
      { title: "Impedance Matching", anchor: "impedance-matching" },
      { title: "Characteristic Impedance", anchor: "characteristic-impedance" },
      { title: "Quarter-Wave Transformer", anchor: "quarter-wave-transformer" },
      { title: "Multiple Boundaries and Thin Films", anchor: "multiple-boundaries" },
      { title: "Total Internal Reflection", anchor: "total-internal-reflection" }
    ],
    equations: [
      "Reflection coefficient: r = (Z₂ - Z₁)/(Z₂ + Z₁)",
      "Transmission coefficient: t = 2Z₂/(Z₂ + Z₁)",
      "Impedance of a string: Z = μv = √(Tμ)",
      "Energy reflection: R = r² = ((Z₂ - Z₁)/(Z₂ + Z₁))²",
      "Energy transmission: T = 1 - R",
      "Quarter-wave matching: Z_match = √(Z₁ Z₂)",
      "Boundary conditions: continuity of displacement and slope"
    ],
    searchIndex: [
      { kind: "section", title: "Reflection and Transmission", target: "09-Reflection-Transmission-Impedance", anchor: "reflection-transmission-coefficients", snippet: "When a wave encounters a boundary between media, part reflects and part transmits, governed by impedance mismatch." },
      { kind: "equation", title: "Reflection Coefficient", target: "09-Reflection-Transmission-Impedance", anchor: "reflection-transmission-coefficients", snippet: "r = (Z₂ - Z₁)/(Z₂ + Z₁) — the ratio of reflected to incident amplitude." },
      { kind: "concept", title: "Impedance Matching", target: "09-Reflection-Transmission-Impedance", anchor: "impedance-matching", snippet: "Maximum power transfer occurs when impedances are matched: Z₁ = Z₂, giving zero reflection." },
      { kind: "concept", title: "Quarter-Wave Transformer", target: "09-Reflection-Transmission-Impedance", anchor: "quarter-wave-transformer", snippet: "A layer of thickness λ/4 with impedance √(Z₁Z₂) eliminates reflection between two media." },
      { kind: "section", title: "Thin Film Interference", target: "09-Reflection-Transmission-Impedance", anchor: "multiple-boundaries", snippet: "Multiple reflections from thin films produce constructive or destructive interference depending on thickness." }
    ],
    derivationHighlights: [
      "Deriving reflection and transmission from boundary conditions",
      "Energy conservation at a boundary: R + T = 1",
      "Quarter-wave anti-reflection coating design"
    ],
    summaryBlocks: [
      "At a boundary between media, waves partially reflect and partially transmit. The reflection and transmission coefficients are determined by the impedance mismatch.",
      "Impedance is the key concept: it measures the medium's resistance to wave propagation. Matching impedances eliminates reflection and maximizes energy transfer.",
      "Quarter-wave layers exploit destructive interference of reflected waves to achieve perfect impedance matching at a specific frequency."
    ]
  },

  "10-Power": {
    pageCount: 7,
    sections: [
      "Energy in Waves",
      "Power Flow and Intensity",
      "Poynting Vector (Preview)",
      "Decibels and Sound Levels",
      "Inverse Square Law",
      "Absorption and Attenuation"
    ],
    sectionAnchors: [
      { title: "Energy in Waves", anchor: "energy-in-waves" },
      { title: "Power Flow and Intensity", anchor: "power-flow-intensity" },
      { title: "Poynting Vector (Preview)", anchor: "poynting-vector-preview" },
      { title: "Decibels and Sound Levels", anchor: "decibels-sound-levels" },
      { title: "Inverse Square Law", anchor: "inverse-square-law" },
      { title: "Absorption and Attenuation", anchor: "absorption-attenuation" }
    ],
    equations: [
      "Kinetic energy density: uₖ = ½ μ (∂y/∂t)²",
      "Potential energy density: uₚ = ½ T (∂y/∂x)²",
      "Average intensity: ⟨I⟩ = ½ μ v ω² A²",
      "Decibel scale: β = 10 log₁₀(I/I₀)",
      "Inverse square law: I = P/(4πr²)",
      "Attenuation: I(x) = I₀ e^{-αx}",
      "Power: P = ∫ I · dA"
    ],
    searchIndex: [
      { kind: "section", title: "Power Flow and Intensity", target: "10-Power", anchor: "power-flow-intensity", snippet: "Intensity is the power per unit area carried by a wave, proportional to amplitude squared." },
      { kind: "equation", title: "Decibel Scale", target: "10-Power", anchor: "decibels-sound-levels", snippet: "Logarithmic scale for comparing intensities: 10 dB corresponds to a factor of 10 in intensity." },
      { kind: "equation", title: "Inverse Square Law", target: "10-Power", anchor: "inverse-square-law", snippet: "For a point source radiating uniformly, intensity falls as 1/r² due to geometric spreading." },
      { kind: "concept", title: "Attenuation", target: "10-Power", anchor: "absorption-attenuation", snippet: "Real media absorb wave energy, leading to exponential decrease in intensity with distance." },
      { kind: "concept", title: "Poynting Vector", target: "10-Power", anchor: "poynting-vector-preview", snippet: "The electromagnetic analog: S = E × H gives the power flow per unit area for EM waves." }
    ],
    derivationHighlights: [
      "Derivation of intensity from energy density and wave speed",
      "Proof that kinetic and potential energy densities are equal on average",
      "Inverse square law from energy conservation"
    ],
    summaryBlocks: [
      "Waves carry energy. The intensity — power per unit area — is proportional to the square of the amplitude and depends on the medium's properties.",
      "The decibel scale provides a practical logarithmic measure of sound intensity, compressing the enormous range of audible intensities into a manageable scale.",
      "In three dimensions, geometric spreading causes intensity to fall as 1/r², while material absorption adds an exponential decay factor."
    ]
  },

  "11-Wavepackets": {
    pageCount: 8,
    sections: [
      "Superposition of Many Frequencies",
      "Group Velocity",
      "Phase Velocity vs Group Velocity",
      "Dispersion",
      "Gaussian Wave Packets",
      "Spreading of Wave Packets"
    ],
    sectionAnchors: [
      { title: "Superposition of Many Frequencies", anchor: "superposition-many-frequencies" },
      { title: "Group Velocity", anchor: "group-velocity" },
      { title: "Phase Velocity vs Group Velocity", anchor: "phase-vs-group" },
      { title: "Dispersion", anchor: "dispersion" },
      { title: "Gaussian Wave Packets", anchor: "gaussian-wave-packets" },
      { title: "Spreading of Wave Packets", anchor: "spreading-wave-packets" }
    ],
    equations: [
      "Group velocity: v_g = dω/dk",
      "Phase velocity: v_p = ω/k",
      "Gaussian packet: ψ(x,t) = ∫ A(k) e^{i(kx - ω(k)t)} dk",
      "Gaussian envelope: A(k) = e^{-(k-k₀)²/(2σ_k²)}",
      "Spreading time: τ = 2m σ₀² / ℏ (quantum)",
      "Relation: v_g = v_p + k dv_p/dk",
      "Dispersion relation expansion: ω(k) ≈ ω₀ + v_g(k - k₀) + ½ ω''(k - k₀)²"
    ],
    searchIndex: [
      { kind: "section", title: "Group Velocity", target: "11-Wavepackets", anchor: "group-velocity", snippet: "The velocity of the envelope of a wave packet: v_g = dω/dk, the speed at which energy and information travel." },
      { kind: "concept", title: "Phase vs Group Velocity", target: "11-Wavepackets", anchor: "phase-vs-group", snippet: "Phase velocity describes the motion of individual crests; group velocity describes the packet envelope." },
      { kind: "concept", title: "Dispersion", target: "11-Wavepackets", anchor: "dispersion", snippet: "When v_p depends on frequency, different Fourier components travel at different speeds, causing the packet to spread." },
      { kind: "equation", title: "Gaussian Wave Packet", target: "11-Wavepackets", anchor: "gaussian-wave-packets", snippet: "A Gaussian envelope in k-space produces a Gaussian envelope in x-space, with width governed by the uncertainty relation." },
      { kind: "concept", title: "Wave Packet Spreading", target: "11-Wavepackets", anchor: "spreading-wave-packets", snippet: "In a dispersive medium, wave packets broaden over time as different frequency components separate." }
    ],
    derivationHighlights: [
      "Taylor expansion of ω(k) to derive group velocity",
      "Gaussian wave packet propagation and spreading",
      "Relationship between phase and group velocity"
    ],
    summaryBlocks: [
      "A wave packet is a localized disturbance formed by superposing waves with a range of frequencies. It moves at the group velocity v_g = dω/dk.",
      "Phase velocity and group velocity differ in dispersive media. Energy and information travel at the group velocity.",
      "Dispersion causes wave packets to spread over time: the second derivative ω''(k) controls the rate of broadening."
    ]
  },

  "12-Waves-Muller": {
    pageCount: 6,
    sections: [
      "Review of Wave Phenomena",
      "Two- and Three-Dimensional Waves",
      "Plane Waves and Spherical Waves",
      "Huygens' Principle",
      "Wave Fronts and Rays"
    ],
    sectionAnchors: [
      { title: "Review of Wave Phenomena", anchor: "review-wave-phenomena" },
      { title: "Two- and Three-Dimensional Waves", anchor: "2d-3d-waves" },
      { title: "Plane Waves and Spherical Waves", anchor: "plane-spherical-waves" },
      { title: "Huygens' Principle", anchor: "huygens-principle" },
      { title: "Wave Fronts and Rays", anchor: "wavefronts-rays" }
    ],
    equations: [
      "3D wave equation: ∇²ψ = (1/v²) ∂²ψ/∂t²",
      "Plane wave: ψ = A e^{i(k·r - ωt)}",
      "Spherical wave: ψ = (A/r) e^{i(kr - ωt)}",
      "Wave vector magnitude: |k| = 2π/λ",
      "Laplacian in spherical coords: ∇² = (1/r²) ∂/∂r(r² ∂/∂r) + angular terms"
    ],
    searchIndex: [
      { kind: "section", title: "Plane Waves and Spherical Waves", target: "12-Waves-Muller", anchor: "plane-spherical-waves", snippet: "Plane waves have flat wavefronts extending to infinity; spherical waves radiate from a point source." },
      { kind: "concept", title: "Huygens' Principle", target: "12-Waves-Muller", anchor: "huygens-principle", snippet: "Every point on a wavefront acts as a source of secondary spherical wavelets; the new wavefront is their envelope." },
      { kind: "equation", title: "3D Wave Equation", target: "12-Waves-Muller", anchor: "2d-3d-waves", snippet: "∇²ψ = (1/v²) ∂²ψ/∂t² — the wave equation in three spatial dimensions." },
      { kind: "concept", title: "Wave Fronts and Rays", target: "12-Waves-Muller", anchor: "wavefronts-rays", snippet: "Wavefronts are surfaces of constant phase; rays are perpendicular to wavefronts and indicate propagation direction." }
    ],
    derivationHighlights: [
      "Solution of the wave equation in spherical coordinates",
      "Huygens' construction for refraction at an interface",
      "1/r amplitude dependence of spherical waves from energy conservation"
    ],
    summaryBlocks: [
      "In three dimensions, waves can take many forms: plane waves with flat wavefronts, spherical waves radiating from point sources, and more complex patterns.",
      "Huygens' principle provides a geometric construction for wave propagation: each point on a wavefront generates secondary wavelets whose envelope defines the next wavefront.",
      "The ray description of wave propagation is valid when the wavelength is much smaller than the scales of the medium's features."
    ]
  },

  "13-Light": {
    pageCount: 9,
    sections: [
      "Electromagnetic Waves",
      "Maxwell's Equations and the Wave Equation",
      "Speed of Light",
      "The Electromagnetic Spectrum",
      "Energy in EM Waves",
      "Radiation Pressure",
      "Polarization (Introduction)"
    ],
    sectionAnchors: [
      { title: "Electromagnetic Waves", anchor: "electromagnetic-waves" },
      { title: "Maxwell's Equations and the Wave Equation", anchor: "maxwell-wave-equation" },
      { title: "Speed of Light", anchor: "speed-of-light" },
      { title: "The Electromagnetic Spectrum", anchor: "em-spectrum" },
      { title: "Energy in EM Waves", anchor: "energy-em-waves" },
      { title: "Radiation Pressure", anchor: "radiation-pressure" },
      { title: "Polarization (Introduction)", anchor: "polarization-intro" }
    ],
    equations: [
      "EM wave equation: ∇²E = μ₀ε₀ ∂²E/∂t²",
      "Speed of light: c = 1/√(μ₀ε₀) ≈ 3 × 10⁸ m/s",
      "Poynting vector: S = (1/μ₀) E × B",
      "Average intensity: ⟨S⟩ = ½ c ε₀ E₀²",
      "Radiation pressure (absorbed): P_rad = I/c",
      "Radiation pressure (reflected): P_rad = 2I/c",
      "E/B ratio: E₀ = c B₀"
    ],
    searchIndex: [
      { kind: "section", title: "Electromagnetic Waves", target: "13-Light", anchor: "electromagnetic-waves", snippet: "Light is an electromagnetic wave: oscillating E and B fields propagating at speed c." },
      { kind: "equation", title: "Speed of Light from Maxwell", target: "13-Light", anchor: "speed-of-light", snippet: "c = 1/√(μ₀ε₀) — the speed of light emerges from the permittivity and permeability of free space." },
      { kind: "equation", title: "Poynting Vector", target: "13-Light", anchor: "energy-em-waves", snippet: "S = (1/μ₀) E × B gives the instantaneous power per unit area carried by an EM wave." },
      { kind: "concept", title: "EM Spectrum", target: "13-Light", anchor: "em-spectrum", snippet: "Radio, microwave, IR, visible, UV, X-ray, gamma — all are EM waves differing only in frequency." },
      { kind: "concept", title: "Radiation Pressure", target: "13-Light", anchor: "radiation-pressure", snippet: "EM waves carry momentum: absorbing a beam exerts pressure I/c; reflecting it exerts 2I/c." }
    ],
    derivationHighlights: [
      "Deriving the EM wave equation from Maxwell's equations",
      "Calculating the speed of light from ε₀ and μ₀",
      "Poynting vector and energy conservation for EM waves"
    ],
    summaryBlocks: [
      "Maxwell's equations predict electromagnetic waves: coupled oscillations of electric and magnetic fields that propagate at c = 1/√(μ₀ε₀).",
      "The Poynting vector S = (1/μ₀) E × B gives the direction and magnitude of energy flow in an electromagnetic wave.",
      "Light carries both energy and momentum. Radiation pressure, though small, has measurable effects and practical applications such as solar sails."
    ]
  },

  "14-Polarization": {
    pageCount: 8,
    sections: [
      "Linear Polarization",
      "Circular and Elliptical Polarization",
      "Polarizers and Malus's Law",
      "Jones Vectors and Jones Matrices",
      "Birefringence",
      "Wave Plates",
      "Optical Activity"
    ],
    sectionAnchors: [
      { title: "Linear Polarization", anchor: "linear-polarization" },
      { title: "Circular and Elliptical Polarization", anchor: "circular-elliptical" },
      { title: "Polarizers and Malus's Law", anchor: "polarizers-malus-law" },
      { title: "Jones Vectors and Jones Matrices", anchor: "jones-vectors-matrices" },
      { title: "Birefringence", anchor: "birefringence" },
      { title: "Wave Plates", anchor: "wave-plates" },
      { title: "Optical Activity", anchor: "optical-activity" }
    ],
    equations: [
      "Malus's law: I = I₀ cos²θ",
      "Jones vector (linear): E = E₀ (cos θ, sin θ)",
      "Jones vector (RCP): E = E₀/√2 (1, -i)",
      "Jones vector (LCP): E = E₀/√2 (1, i)",
      "Half-wave plate Jones matrix: [1, 0; 0, -1]",
      "Quarter-wave plate Jones matrix: [1, 0; 0, -i]",
      "Elliptical polarization: Eₓ = A cos(ωt), E_y = B cos(ωt + δ)"
    ],
    searchIndex: [
      { kind: "section", title: "Linear Polarization", target: "14-Polarization", anchor: "linear-polarization", snippet: "The E-field oscillates in a fixed plane; the polarization direction is determined by that plane." },
      { kind: "equation", title: "Malus's Law", target: "14-Polarization", anchor: "polarizers-malus-law", snippet: "Intensity through a polarizer: I = I₀ cos²θ, where θ is the angle between E and the polarizer axis." },
      { kind: "concept", title: "Circular Polarization", target: "14-Polarization", anchor: "circular-elliptical", snippet: "E-field vector rotates at angular frequency ω, tracing a circle: RCP or LCP depending on rotation sense." },
      { kind: "concept", title: "Jones Calculus", target: "14-Polarization", anchor: "jones-vectors-matrices", snippet: "2×2 matrix formalism for tracking polarization state through optical elements." },
      { kind: "concept", title: "Wave Plates", target: "14-Polarization", anchor: "wave-plates", snippet: "Birefringent plates that introduce a controlled phase shift between orthogonal polarization components." }
    ],
    derivationHighlights: [
      "Construction of circular polarization from two linear components",
      "Derivation of Malus's law from projection",
      "Jones matrix for a rotated polarizer"
    ],
    summaryBlocks: [
      "Polarization describes the direction of the electric field oscillation. Linear, circular, and elliptical polarizations are all possible.",
      "Malus's law governs transmission through a polarizer: only the component of E along the polarizer axis passes through.",
      "The Jones calculus provides a compact matrix formalism for tracking polarization through sequences of optical elements."
    ]
  },

  "15-Refraction": {
    pageCount: 8,
    sections: [
      "Index of Refraction",
      "Snell's Law",
      "Fresnel Equations",
      "Brewster's Angle",
      "Total Internal Reflection",
      "Evanescent Waves",
      "Dispersion in Materials"
    ],
    sectionAnchors: [
      { title: "Index of Refraction", anchor: "index-of-refraction" },
      { title: "Snell's Law", anchor: "snells-law" },
      { title: "Fresnel Equations", anchor: "fresnel-equations" },
      { title: "Brewster's Angle", anchor: "brewsters-angle" },
      { title: "Total Internal Reflection", anchor: "total-internal-reflection" },
      { title: "Evanescent Waves", anchor: "evanescent-waves" },
      { title: "Dispersion in Materials", anchor: "dispersion-materials" }
    ],
    equations: [
      "Snell's law: n₁ sin θ₁ = n₂ sin θ₂",
      "Index of refraction: n = c/v",
      "Brewster's angle: tan θ_B = n₂/n₁",
      "Critical angle: sin θ_c = n₂/n₁ (n₁ > n₂)",
      "Fresnel (s-pol): r_s = (n₁ cos θ₁ - n₂ cos θ₂)/(n₁ cos θ₁ + n₂ cos θ₂)",
      "Fresnel (p-pol): r_p = (n₂ cos θ₁ - n₁ cos θ₂)/(n₂ cos θ₁ + n₁ cos θ₂)",
      "Evanescent decay: E ∝ e^{-κz}"
    ],
    searchIndex: [
      { kind: "equation", title: "Snell's Law", target: "15-Refraction", anchor: "snells-law", snippet: "n₁ sin θ₁ = n₂ sin θ₂ — the law of refraction relating incident and refracted angles." },
      { kind: "equation", title: "Fresnel Equations", target: "15-Refraction", anchor: "fresnel-equations", snippet: "Give the reflection and transmission amplitudes for s- and p-polarized light at an interface." },
      { kind: "concept", title: "Brewster's Angle", target: "15-Refraction", anchor: "brewsters-angle", snippet: "At θ_B = arctan(n₂/n₁), p-polarized light has zero reflection — only s-polarization reflects." },
      { kind: "concept", title: "Total Internal Reflection", target: "15-Refraction", anchor: "total-internal-reflection", snippet: "When light hits an interface at an angle beyond θ_c, all light reflects; none transmits." },
      { kind: "concept", title: "Evanescent Waves", target: "15-Refraction", anchor: "evanescent-waves", snippet: "Beyond the critical angle, the transmitted field decays exponentially — it does not propagate." }
    ],
    derivationHighlights: [
      "Deriving Snell's law from boundary conditions on EM fields",
      "Derivation of the Fresnel equations",
      "Evanescent wave from imaginary transmission angle"
    ],
    summaryBlocks: [
      "Refraction occurs because light travels at different speeds in different media. Snell's law quantifies the bending of rays at interfaces.",
      "The Fresnel equations give the exact reflection and transmission amplitudes for each polarization, reducing to simpler formulas at normal incidence and at Brewster's angle.",
      "Total internal reflection occurs beyond the critical angle, producing evanescent waves that decay exponentially into the second medium."
    ]
  },

  "16-Prisms": {
    pageCount: 6,
    sections: [
      "Geometry of a Prism",
      "Minimum Deviation",
      "Dispersion by a Prism",
      "Resolving Power of a Prism",
      "Chromatic Aberration"
    ],
    sectionAnchors: [
      { title: "Geometry of a Prism", anchor: "geometry-prism" },
      { title: "Minimum Deviation", anchor: "minimum-deviation" },
      { title: "Dispersion by a Prism", anchor: "dispersion-prism" },
      { title: "Resolving Power of a Prism", anchor: "resolving-power-prism" },
      { title: "Chromatic Aberration", anchor: "chromatic-aberration" }
    ],
    equations: [
      "Deviation angle: δ = θ₁ + θ₂ - α",
      "Minimum deviation: n = sin((α + δ_min)/2) / sin(α/2)",
      "Angular dispersion: dδ/dλ = (dδ/dn)(dn/dλ)",
      "Resolving power: R = λ/Δλ = b(dn/dλ)",
      "Cauchy equation: n(λ) ≈ A + B/λ² + C/λ⁴"
    ],
    searchIndex: [
      { kind: "section", title: "Prism Geometry", target: "16-Prisms", anchor: "geometry-prism", snippet: "A prism refracts light twice — once at each face — causing angular deviation that depends on wavelength." },
      { kind: "equation", title: "Minimum Deviation", target: "16-Prisms", anchor: "minimum-deviation", snippet: "At minimum deviation, the ray passes symmetrically through the prism; this condition yields n from δ_min." },
      { kind: "concept", title: "Prism Dispersion", target: "16-Prisms", anchor: "dispersion-prism", snippet: "Because n depends on λ, different colors are deviated by different amounts, producing a spectrum." },
      { kind: "equation", title: "Resolving Power", target: "16-Prisms", anchor: "resolving-power-prism", snippet: "R = b(dn/dλ): the ability to distinguish closely spaced wavelengths depends on base length and material dispersion." },
      { kind: "concept", title: "Cauchy Equation", target: "16-Prisms", anchor: "dispersion-prism", snippet: "Empirical formula for the wavelength dependence of refractive index in transparent materials." }
    ],
    derivationHighlights: [
      "Geometric derivation of the deviation angle",
      "Finding the minimum deviation condition by symmetry",
      "Resolving power from the Rayleigh criterion"
    ],
    summaryBlocks: [
      "A prism separates white light into its spectrum because the index of refraction varies with wavelength — a phenomenon called dispersion.",
      "The minimum deviation condition provides a precise experimental method for measuring the refractive index of a prism material.",
      "The resolving power of a prism increases with the base length and the material's dispersive power dn/dλ."
    ]
  },

  "17-Color": {
    pageCount: 5,
    sections: [
      "The Visible Spectrum",
      "Color Perception and the Eye",
      "Additive and Subtractive Color Mixing",
      "Chromaticity Diagrams",
      "Spectral Colors vs Non-Spectral Colors"
    ],
    sectionAnchors: [
      { title: "The Visible Spectrum", anchor: "visible-spectrum" },
      { title: "Color Perception and the Eye", anchor: "color-perception-eye" },
      { title: "Additive and Subtractive Color Mixing", anchor: "additive-subtractive-mixing" },
      { title: "Chromaticity Diagrams", anchor: "chromaticity-diagrams" },
      { title: "Spectral Colors vs Non-Spectral Colors", anchor: "spectral-nonspectral" }
    ],
    equations: [
      "Visible range: λ ≈ 380–700 nm",
      "Photon energy: E = hf = hc/λ",
      "Tristimulus values: X = ∫ S(λ) x̄(λ) dλ",
      "Chromaticity coordinates: x = X/(X+Y+Z), y = Y/(X+Y+Z)",
      "Color matching functions: x̄(λ), ȳ(λ), z̄(λ)"
    ],
    searchIndex: [
      { kind: "section", title: "Visible Spectrum", target: "17-Color", anchor: "visible-spectrum", snippet: "Human vision spans approximately 380–700 nm, from violet to red." },
      { kind: "concept", title: "Trichromacy", target: "17-Color", anchor: "color-perception-eye", snippet: "Three types of cone cells (S, M, L) in the retina respond to short, medium, and long wavelengths." },
      { kind: "concept", title: "Additive Color Mixing", target: "17-Color", anchor: "additive-subtractive-mixing", snippet: "Red + green + blue light = white. Additive mixing combines spectral contributions." },
      { kind: "concept", title: "Chromaticity Diagram", target: "17-Color", anchor: "chromaticity-diagrams", snippet: "A 2D representation of color space; all visible colors lie within a horseshoe-shaped region." },
      { kind: "concept", title: "Non-Spectral Colors", target: "17-Color", anchor: "spectral-nonspectral", snippet: "Magenta and pink are not in the rainbow — they require mixing wavelengths from both ends of the spectrum." }
    ],
    derivationHighlights: [
      "Computing chromaticity coordinates from a spectrum",
      "Why RGB primaries can reproduce most but not all visible colors",
      "Color temperature and blackbody radiation curves"
    ],
    summaryBlocks: [
      "Color is not a property of light alone — it is a perceptual experience arising from the response of three cone types in the eye to the spectral power distribution of incoming light.",
      "Additive mixing (light) and subtractive mixing (pigments) obey different rules because one combines spectral contributions while the other removes them.",
      "The CIE chromaticity diagram maps all perceivable colors onto a 2D plane, revealing the gamut limitations of any set of physical primaries."
    ]
  },

  "18-Antennas": {
    pageCount: 7,
    sections: [
      "Radiation from Accelerating Charges",
      "Oscillating Electric Dipole",
      "Radiation Pattern of a Dipole",
      "Antenna Arrays",
      "Directivity and Gain",
      "Receiving Antennas"
    ],
    sectionAnchors: [
      { title: "Radiation from Accelerating Charges", anchor: "radiation-accelerating-charges" },
      { title: "Oscillating Electric Dipole", anchor: "oscillating-dipole" },
      { title: "Radiation Pattern of a Dipole", anchor: "dipole-radiation-pattern" },
      { title: "Antenna Arrays", anchor: "antenna-arrays" },
      { title: "Directivity and Gain", anchor: "directivity-gain" },
      { title: "Receiving Antennas", anchor: "receiving-antennas" }
    ],
    equations: [
      "Larmor formula: P = q²a²/(6πε₀c³)",
      "Dipole radiation field: E ∝ (ω²p₀ sin θ)/(4πε₀c²r)",
      "Dipole power pattern: dP/dΩ ∝ sin²θ",
      "Total radiated power: P = ω⁴p₀²/(12πε₀c³)",
      "Array factor: AF = Σ e^{i n (kd cos θ + δ)}",
      "Directivity: D = 4π (max intensity) / (total power)"
    ],
    searchIndex: [
      { kind: "section", title: "Oscillating Dipole Radiation", target: "18-Antennas", anchor: "oscillating-dipole", snippet: "An oscillating electric dipole is the simplest antenna, radiating electromagnetic waves with a sin²θ power pattern." },
      { kind: "equation", title: "Larmor Formula", target: "18-Antennas", anchor: "radiation-accelerating-charges", snippet: "Power radiated by an accelerating charge: P = q²a²/(6πε₀c³)." },
      { kind: "concept", title: "Antenna Arrays", target: "18-Antennas", anchor: "antenna-arrays", snippet: "Multiple antennas combined to create directional radiation patterns through constructive and destructive interference." },
      { kind: "concept", title: "Directivity and Gain", target: "18-Antennas", anchor: "directivity-gain", snippet: "Directivity measures how focused the radiation pattern is compared to an isotropic radiator." },
      { kind: "equation", title: "Array Factor", target: "18-Antennas", anchor: "antenna-arrays", snippet: "The array factor multiplies the single-element pattern to give the total radiation pattern." }
    ],
    derivationHighlights: [
      "Far-field radiation from an oscillating dipole",
      "Array factor derivation for equally spaced elements",
      "Connection between antenna radiation and reception (reciprocity)"
    ],
    summaryBlocks: [
      "Accelerating charges radiate electromagnetic waves. The oscillating electric dipole is the fundamental radiating element, with power proportional to ω⁴.",
      "Antenna arrays exploit interference between multiple radiating elements to create highly directional beams, with the array factor governing the overall pattern.",
      "The reciprocity theorem ensures that a good transmitting antenna is equally effective as a receiving antenna."
    ]
  },

  "19-Diffraction": {
    pageCount: 10,
    sections: [
      "Huygens-Fresnel Principle",
      "Single-Slit Diffraction",
      "Double-Slit Interference",
      "Multiple Slits and Diffraction Gratings",
      "Resolving Power of a Grating",
      "Circular Aperture Diffraction",
      "Rayleigh Criterion",
      "Fresnel vs Fraunhofer Diffraction"
    ],
    sectionAnchors: [
      { title: "Huygens-Fresnel Principle", anchor: "huygens-fresnel" },
      { title: "Single-Slit Diffraction", anchor: "single-slit" },
      { title: "Double-Slit Interference", anchor: "double-slit" },
      { title: "Multiple Slits and Diffraction Gratings", anchor: "diffraction-gratings" },
      { title: "Resolving Power of a Grating", anchor: "resolving-power-grating" },
      { title: "Circular Aperture Diffraction", anchor: "circular-aperture" },
      { title: "Rayleigh Criterion", anchor: "rayleigh-criterion" },
      { title: "Fresnel vs Fraunhofer Diffraction", anchor: "fresnel-fraunhofer" }
    ],
    equations: [
      "Single slit: I(θ) = I₀ [sin(β/2)/(β/2)]², β = ka sin θ",
      "Double slit: I(θ) = 4I₀ cos²(δ/2) [sin(β/2)/(β/2)]²",
      "Grating maxima: d sin θ = mλ",
      "Grating resolving power: R = λ/Δλ = mN",
      "Airy disk first minimum: sin θ = 1.22 λ/D",
      "Rayleigh criterion: θ_min = 1.22 λ/D",
      "Fresnel number: N_F = a²/(λL)"
    ],
    searchIndex: [
      { kind: "section", title: "Single-Slit Diffraction", target: "19-Diffraction", anchor: "single-slit", snippet: "A single slit produces a central maximum with side lobes whose positions depend on slit width and wavelength." },
      { kind: "equation", title: "Grating Equation", target: "19-Diffraction", anchor: "diffraction-gratings", snippet: "d sin θ = mλ — bright fringes at angles where path differences are integer multiples of the wavelength." },
      { kind: "equation", title: "Rayleigh Criterion", target: "19-Diffraction", anchor: "rayleigh-criterion", snippet: "Two point sources are just resolved when the central maximum of one falls on the first minimum of the other." },
      { kind: "concept", title: "Diffraction Gratings", target: "19-Diffraction", anchor: "diffraction-gratings", snippet: "N slits produce sharp principal maxima with resolving power R = mN, enabling precise wavelength measurements." },
      { kind: "concept", title: "Fresnel vs Fraunhofer", target: "19-Diffraction", anchor: "fresnel-fraunhofer", snippet: "Fraunhofer diffraction (far field) uses plane waves; Fresnel diffraction (near field) accounts for wavefront curvature." }
    ],
    derivationHighlights: [
      "Single-slit diffraction pattern from the Huygens-Fresnel integral",
      "Diffraction grating intensity pattern by summing phasors",
      "Airy pattern from circular aperture diffraction"
    ],
    summaryBlocks: [
      "Diffraction is the bending and spreading of waves as they pass through apertures or around obstacles. It is most prominent when the aperture size is comparable to the wavelength.",
      "Diffraction gratings with many slits produce extremely sharp spectral lines, with resolving power R = mN enabling the separation of closely spaced wavelengths.",
      "The Rayleigh criterion sets the fundamental diffraction-limited angular resolution: θ_min = 1.22 λ/D for a circular aperture of diameter D."
    ]
  },

  "20-Quantum-Mechanics": {
    pageCount: 11,
    sections: [
      "Wave-Particle Duality",
      "De Broglie Wavelength",
      "The Schrodinger Equation",
      "Probability Interpretation",
      "Particle in a Box",
      "Tunneling",
      "Heisenberg Uncertainty Principle",
      "Quantum Harmonic Oscillator"
    ],
    sectionAnchors: [
      { title: "Wave-Particle Duality", anchor: "wave-particle-duality" },
      { title: "De Broglie Wavelength", anchor: "de-broglie" },
      { title: "The Schrodinger Equation", anchor: "schrodinger-equation" },
      { title: "Probability Interpretation", anchor: "probability-interpretation" },
      { title: "Particle in a Box", anchor: "particle-in-box" },
      { title: "Tunneling", anchor: "tunneling" },
      { title: "Heisenberg Uncertainty Principle", anchor: "heisenberg-uncertainty" },
      { title: "Quantum Harmonic Oscillator", anchor: "quantum-harmonic-oscillator" }
    ],
    equations: [
      "De Broglie relation: λ = h/p",
      "Schrodinger equation: iℏ ∂ψ/∂t = -ℏ²/(2m) ∂²ψ/∂x² + V(x)ψ",
      "Time-independent: -ℏ²/(2m) d²ψ/dx² + V(x)ψ = Eψ",
      "Particle in a box energies: Eₙ = n²π²ℏ²/(2mL²)",
      "Uncertainty principle: Δx Δp ≥ ℏ/2",
      "QHO energies: Eₙ = (n + ½)ℏω",
      "Probability density: P(x) = |ψ(x)|²",
      "Tunneling coefficient: T ≈ e^{-2κL}, κ = √(2m(V₀-E))/ℏ"
    ],
    searchIndex: [
      { kind: "concept", title: "Wave-Particle Duality", target: "20-Quantum-Mechanics", anchor: "wave-particle-duality", snippet: "Matter exhibits both wave-like and particle-like behavior; the de Broglie wavelength connects momentum to wavelength." },
      { kind: "equation", title: "Schrodinger Equation", target: "20-Quantum-Mechanics", anchor: "schrodinger-equation", snippet: "The fundamental equation of quantum mechanics: the wave equation for matter waves." },
      { kind: "equation", title: "Particle in a Box", target: "20-Quantum-Mechanics", anchor: "particle-in-box", snippet: "Quantized energies Eₙ = n²π²ℏ²/(2mL²) arise from confining a particle to a finite region." },
      { kind: "concept", title: "Quantum Tunneling", target: "20-Quantum-Mechanics", anchor: "tunneling", snippet: "A quantum particle can penetrate a classically forbidden barrier with transmission probability that decays exponentially with barrier width." },
      { kind: "equation", title: "Heisenberg Uncertainty Principle", target: "20-Quantum-Mechanics", anchor: "heisenberg-uncertainty", snippet: "Δx Δp ≥ ℏ/2 — a fundamental limit on the simultaneous knowledge of position and momentum." },
      { kind: "equation", title: "QHO Energy Levels", target: "20-Quantum-Mechanics", anchor: "quantum-harmonic-oscillator", snippet: "Eₙ = (n + ½)ℏω — equally spaced energy levels with zero-point energy ½ℏω." }
    ],
    derivationHighlights: [
      "Solving the Schrodinger equation for a particle in a box",
      "Deriving the quantum harmonic oscillator energy spectrum",
      "WKB approximation for tunneling probability",
      "Heisenberg uncertainty from wave packet width"
    ],
    summaryBlocks: [
      "Quantum mechanics replaces classical trajectories with wavefunctions. The Schrodinger equation is the wave equation for matter, governing how quantum states evolve.",
      "Confinement leads to quantization: a particle in a box has discrete energy levels proportional to n², directly analogous to standing waves on a string.",
      "Tunneling is a purely quantum phenomenon with no classical analog — particles can penetrate barriers that would be impenetrable classically.",
      "The Heisenberg uncertainty principle is a direct consequence of wave mechanics: a particle with a well-defined position must have a broad momentum distribution, and vice versa."
    ]
  },

  "21-Doppler-Effect": {
    pageCount: 7,
    sections: [
      "Doppler Effect for Sound",
      "Moving Source",
      "Moving Observer",
      "Relativistic Doppler Effect",
      "Shock Waves and Mach Cones",
      "Applications of the Doppler Effect"
    ],
    sectionAnchors: [
      { title: "Doppler Effect for Sound", anchor: "doppler-sound" },
      { title: "Moving Source", anchor: "moving-source" },
      { title: "Moving Observer", anchor: "moving-observer" },
      { title: "Relativistic Doppler Effect", anchor: "relativistic-doppler" },
      { title: "Shock Waves and Mach Cones", anchor: "shock-waves-mach" },
      { title: "Applications of the Doppler Effect", anchor: "doppler-applications" }
    ],
    equations: [
      "Doppler (moving source): f' = f / (1 ∓ v_s/v)",
      "Doppler (moving observer): f' = f (1 ± v_o/v)",
      "General Doppler: f' = f (v ± v_o) / (v ∓ v_s)",
      "Relativistic Doppler: f' = f √((1 - β)/(1 + β))",
      "Mach number: M = v_s/v",
      "Mach cone half-angle: sin θ = 1/M = v/v_s",
      "Transverse Doppler: f' = f/γ (relativistic only)"
    ],
    searchIndex: [
      { kind: "section", title: "Doppler Effect for Sound", target: "21-Doppler-Effect", anchor: "doppler-sound", snippet: "Relative motion between source and observer shifts the observed frequency — higher when approaching, lower when receding." },
      { kind: "equation", title: "General Doppler Formula", target: "21-Doppler-Effect", anchor: "doppler-sound", snippet: "f' = f(v ± v_o)/(v ∓ v_s) — accounts for motion of both source and observer relative to the medium." },
      { kind: "equation", title: "Relativistic Doppler", target: "21-Doppler-Effect", anchor: "relativistic-doppler", snippet: "For light: f' = f√((1-β)/(1+β)), depending only on relative velocity, not on who is moving." },
      { kind: "concept", title: "Shock Waves", target: "21-Doppler-Effect", anchor: "shock-waves-mach", snippet: "When a source exceeds the wave speed, wavefronts pile up to form a conical shock wave (sonic boom)." },
      { kind: "concept", title: "Doppler Applications", target: "21-Doppler-Effect", anchor: "doppler-applications", snippet: "Radar speed guns, medical ultrasound, astronomical redshift, and weather radar all exploit the Doppler effect." }
    ],
    derivationHighlights: [
      "Derivation of the Doppler formula from wavefront spacing",
      "Relativistic Doppler from Lorentz transformation",
      "Geometry of the Mach cone"
    ],
    summaryBlocks: [
      "The Doppler effect shifts observed frequencies when source and observer are in relative motion. For sound, the formulas differ depending on whether the source or observer moves.",
      "For light, special relativity gives a single Doppler formula depending only on the relative velocity. The transverse Doppler effect (time dilation) has no classical analog.",
      "When a source moves faster than the wave speed, it outruns its own wavefronts, creating a conical shock wave characterized by the Mach number M = v_s/v."
    ]
  }

};
