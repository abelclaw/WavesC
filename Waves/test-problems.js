// test-problems.js — Test tab problems for Waves course chapters
// Each chapter slug maps to { readingQuiz, shortAnswer, longProblems }

window.WAVES_TEST_PROBLEMS = {

"waves": {
  readingQuiz: [
    { q: "What is the standard form of the one-dimensional wave equation?", a: "$$\\frac{\\partial^2 y}{\\partial t^2} = v^2 \\frac{\\partial^2 y}{\\partial x^2}$$" },
    { q: "What determines the speed of a wave on a stretched string?", a: "The wave speed is $v = \\sqrt{T/\\mu}$, where $T$ is the tension and $\\mu$ is the linear mass density." },
    { q: "What is the difference between a traveling wave and a standing wave?", a: "A traveling wave transports energy in one direction, while a standing wave is a superposition of two counter-propagating waves that produces fixed nodes and antinodes." },
    { q: "What boundary condition applies at a fixed end of a string?", a: "The displacement must be zero at all times: $y = 0$." },
    { q: "What boundary condition applies at a free end of a string?", a: "The slope (and thus the transverse force) must be zero: $\\partial y/\\partial x = 0$." },
    { q: "How does a pulse reflect from a fixed end?", a: "It reflects inverted (with a phase change of $\\pi$)." },
    { q: "How does a pulse reflect from a free end?", a: "It reflects upright, with no phase change." },
    { q: "What are the allowed wavelengths for standing waves on a string of length $L$ fixed at both ends?", a: "The allowed wavelengths are $\\lambda_n = 2L/n$ for $n = 1, 2, 3, \\ldots$" },
    { q: "Why does increasing the tension on a guitar string raise the pitch?", a: "Higher tension increases the wave speed $v = \\sqrt{T/\\mu}$, which raises all the resonant frequencies $f_n = nv/(2L)$." },
    { q: "Can $f(x - vt)$ represent a wave traveling to the left?", a: "No. $f(x - vt)$ travels to the right; a left-traveling wave has the form $f(x + vt)$." }
  ],
  shortAnswer: [
    { q: "A string has linear mass density $\\mu = 0.005$ kg/m and is under tension $T = 80$ N. What is the wave speed? If the string is 0.65 m long and fixed at both ends, what is the fundamental frequency?", a: "Wave speed: $v = \\sqrt{T/\\mu} = \\sqrt{80/0.005} = 126.5$ m/s. Fundamental: $f_1 = v/(2L) = 126.5/(2 \\times 0.65) = 97.3$ Hz." },
    { q: "Show that $y(x,t) = A\\sin(kx)\\cos(\\omega t)$ satisfies the wave equation with $v = \\omega/k$.", a: "We compute $\\partial^2 y/\\partial t^2 = -A\\omega^2 \\sin(kx)\\cos(\\omega t)$ and $\\partial^2 y/\\partial x^2 = -Ak^2 \\sin(kx)\\cos(\\omega t)$. Then $\\partial^2 y/\\partial t^2 = (\\omega^2/k^2)\\partial^2 y/\\partial x^2 = v^2 \\partial^2 y/\\partial x^2$. \\checkmark" },
    { q: "A standing wave on a string fixed at both ends has 5 antinodes. If the string length is $L = 1.2$ m, what is the wavelength?", a: "Five antinodes means $n = 5$, so $\\lambda = 2L/n = 2(1.2)/5 = 0.48$ m." },
    { q: "Two identical pulses travel toward each other on a string. At the moment they completely overlap, the string appears flat (zero displacement everywhere). Is the energy zero at that instant? Explain.", a: "No. Although the displacement is zero, the string has maximum transverse velocity everywhere at that instant. All the energy is kinetic, not potential." },
    { q: "A string fixed at both ends vibrates in its third harmonic. Sketch the mode shape and state the positions of all nodes and antinodes for a string of length $L$.", a: "Nodes at $x = 0, L/3, 2L/3, L$. Antinodes at $x = L/6, L/2, 5L/6$. The shape is $\\sin(3\\pi x/L)$." },
    { q: "If you double both the tension and the linear mass density of a string, what happens to the wave speed?", a: "$v = \\sqrt{T/\\mu}$. Doubling both gives $v' = \\sqrt{2T/(2\\mu)} = \\sqrt{T/\\mu} = v$. The wave speed is unchanged." }
  ],
  longProblems: [
    {
      title: "Standing Waves on a Guitar String",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/GuitareClassique5.png/220px-GuitareClassique5.png",
      imageAlt: "Classical guitar showing the vibrating strings between the nut and the bridge",
      context: "A classical guitar's high E string has a vibrating length of $L = 0.650$ m between the nut and the saddle. The string has a linear mass density $\\mu = 0.43 \\times 10^{-3}$ kg/m and is tuned to a fundamental frequency of $f_1 = 329.6$ Hz (E4).",
      parts: [
        { label: "(a)", q: "What tension must the string be under to produce this fundamental frequency?", a: "From $f_1 = v/(2L)$ we get $v = 2Lf_1 = 2(0.650)(329.6) = 428.5$ m/s. Then $v = \\sqrt{T/\\mu}$ gives $T = \\mu v^2 = (0.43 \\times 10^{-3})(428.5)^2 = 78.9$ N, about 18 pounds of force." },
        { label: "(b)", q: "A guitarist presses the string against the 12th fret, which is located at the midpoint of the string. What is the new fundamental frequency?", a: "The new vibrating length is $L' = L/2 = 0.325$ m. The tension and $\\mu$ are unchanged, so $v$ is the same. $f_1' = v/(2L') = 428.5/(2 \\times 0.325) = 659.2$ Hz, exactly one octave above the open string." },
        { label: "(c)", q: "When the open string vibrates in its $n = 3$ mode, what is the frequency and where are the nodes?", a: "$f_3 = 3f_1 = 3(329.6) = 988.8$ Hz. Nodes are at $x = 0$, $L/3 = 0.217$ m, $2L/3 = 0.433$ m, and $L = 0.650$ m." },
        { label: "(d)", q: "A natural harmonic is played by lightly touching the string at its midpoint and plucking. Which harmonics are present in the resulting vibration and why?", a: "Touching at the midpoint enforces a node there. Only harmonics with a node at $L/2$ survive — these are the even harmonics $n = 2, 4, 6, \\ldots$ The odd harmonics ($n = 1, 3, 5, \\ldots$) have an antinode at the midpoint and are suppressed. The lowest sounding frequency is $f_2 = 659.2$ Hz." }
      ]
    },
    {
      title: "Seismic Waves Through the Earth",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Seismograph.jpg/300px-Seismograph.jpg",
      imageAlt: "A seismograph recording seismic waves from an earthquake",
      context: "During an earthquake, both P-waves (longitudinal, compressional) and S-waves (transverse, shear) propagate through the Earth's crust. Near the surface, typical P-wave speed is $v_P = 6.0$ km/s and S-wave speed is $v_S = 3.5$ km/s. A seismometer records both arrivals.",
      parts: [
        { label: "(a)", q: "If the P-wave arrives 45 seconds before the S-wave, how far away is the earthquake epicenter?", a: "Let $d$ be the distance. Travel times: $t_P = d/v_P$, $t_S = d/v_S$. The delay is $\\Delta t = t_S - t_P = d(1/v_S - 1/v_P)$. Solving: $d = \\Delta t / (1/v_S - 1/v_P) = 45 / (1/3.5 - 1/6.0) = 45 / (0.2857 - 0.1667) = 45 / 0.1190 = 378$ km." },
        { label: "(b)", q: "Both P-waves and S-waves satisfy the wave equation. For S-waves, $v_S = \\sqrt{G/\\rho}$ where $G$ is the shear modulus and $\\rho$ is density. If crustal rock has $\\rho = 2700$ kg/m$^3$, what is the shear modulus?", a: "$G = \\rho v_S^2 = 2700 \\times (3500)^2 = 3.31 \\times 10^{10}$ Pa $= 33.1$ GPa." },
        { label: "(c)", q: "S-waves cannot propagate through the Earth's liquid outer core. Explain why using the wave equation.", a: "S-waves are transverse/shear waves requiring a restoring force from the shear modulus $G$. A liquid has $G = 0$ (it cannot sustain shear stress), so $v_S = \\sqrt{G/\\rho} = 0$. With zero wave speed, the wave equation has no propagating solutions. This is why the S-wave shadow zone exists on the far side of the Earth from an earthquake." },
        { label: "(d)", q: "A seismic wave with frequency $f = 2.0$ Hz travels as a P-wave. What is its wavelength? Compare this to the wavelength of a 2.0 Hz sound wave in air ($v_{\\text{air}} = 343$ m/s).", a: "In rock: $\\lambda_P = v_P / f = 6000/2.0 = 3000$ m $= 3.0$ km. In air: $\\lambda_{\\text{air}} = 343/2.0 = 171.5$ m. The seismic wavelength is about 17.5 times larger because the wave speed in rock is much greater." }
      ]
    },
    {
      title: "Vibrations of a Submarine Hull",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/USS_Virginia_%28SSN-774%29.jpg/300px-USS_Virginia_%28SSN-774%29.jpg",
      imageAlt: "Virginia-class submarine surfacing, showing the cylindrical hull",
      context: "A submarine hull can be modeled as a long cylindrical shell. For structural analysis, engineers study transverse vibrations of steel plates that form the hull. Consider a rectangular steel plate (a section of the hull) of length $L = 4.0$ m, welded at both ends (fixed boundary conditions). The plate has thickness $h = 3.0$ cm and steel density $\\rho = 7800$ kg/m$^3$. The effective wave speed for bending waves at a particular frequency is $v = 520$ m/s.",
      parts: [
        { label: "(a)", q: "What are the first three resonant frequencies for transverse standing waves along this plate section?", a: "For a plate fixed at both ends, $f_n = nv/(2L)$. So $f_1 = 520/(2 \\times 4.0) = 65.0$ Hz, $f_2 = 130.0$ Hz, $f_3 = 195.0$ Hz." },
        { label: "(b)", q: "Active noise cancellation is used to suppress the fundamental mode. The system generates a wave $y_2(x,t) = -A\\sin(\\pi x/L)\\cos(\\omega_1 t)$. Show that the superposition $y_1 + y_2 = 0$ eliminates the fundamental.", a: "The fundamental mode is $y_1 = A\\sin(\\pi x/L)\\cos(\\omega_1 t)$. Adding the cancellation wave: $y_1 + y_2 = A\\sin(\\pi x/L)\\cos(\\omega_1 t) - A\\sin(\\pi x/L)\\cos(\\omega_1 t) = 0$. The waves destructively interfere everywhere at all times, completely eliminating the mode." },
        { label: "(c)", q: "An enemy sonar pings at 5.0 kHz. What is the wavelength of sound in seawater ($v_{\\text{water}} = 1500$ m/s)? Would this frequency excite any of the plate's low-order resonances?", a: "$\\lambda = v_{\\text{water}}/f = 1500/5000 = 0.30$ m. The sonar frequency of 5000 Hz is far above the plate's low resonances ($65, 130, 195$ Hz, etc.), so it would not directly excite them. The harmonic number that would match is $n = 2Lf/v = 2(4.0)(5000)/520 \\approx 77$, an extremely high-order mode that is heavily damped." },
        { label: "(d)", q: "If the tension driving the wave is increased by a factor of 4 (e.g., by pressurizing the hull), what happens to the wave speed and the fundamental frequency?", a: "Since $v \\propto \\sqrt{T}$, quadrupling the tension doubles the wave speed to $v' = 2 \\times 520 = 1040$ m/s. The fundamental becomes $f_1' = v'/(2L) = 1040/8.0 = 130$ Hz, also doubled." }
      ]
    }
  ]
},

"music": {
  readingQuiz: [
    { q: "What is the fundamental frequency of a string fixed at both ends in terms of $v$ and $L$?", a: "$f_1 = v/(2L)$." },
    { q: "What is the relationship between the $n$th harmonic frequency and the fundamental for a vibrating string?", a: "$f_n = nf_1$; the harmonics are integer multiples of the fundamental." },
    { q: "What is the frequency ratio for an octave?", a: "2:1." },
    { q: "What is the frequency ratio for a perfect fifth?", a: "3:2." },
    { q: "Why do a flute and a violin playing the same note sound different?", a: "They have different timbres — different relative amplitudes of the harmonics in their overtone series." },
    { q: "What are beats?", a: "Beats are periodic variations in loudness that occur when two tones of slightly different frequency are played together, with beat frequency $f_{\\text{beat}} = |f_1 - f_2|$." },
    { q: "How does a pipe open at both ends differ from a pipe closed at one end in its harmonic content?", a: "An open-open pipe supports all harmonics ($n = 1, 2, 3, \\ldots$), while an open-closed pipe supports only odd harmonics ($n = 1, 3, 5, \\ldots$)." },
    { q: "What physical property of a sound wave determines its pitch?", a: "Frequency." },
    { q: "What does consonance mean in terms of frequency ratios?", a: "Consonant intervals correspond to simple integer frequency ratios (like 2:1, 3:2, 4:3), which produce waveforms that repeat with short periods." }
  ],
  shortAnswer: [
    { q: "Concert A is 440 Hz. What is the frequency of the A one octave below? What about the E a perfect fifth above concert A?", a: "One octave below: $440/2 = 220$ Hz. A perfect fifth above: $440 \\times 3/2 = 660$ Hz." },
    { q: "A pipe open at both ends has a fundamental frequency of 262 Hz (middle C). How long is the pipe? (Use $v = 343$ m/s.)", a: "For an open-open pipe, $f_1 = v/(2L)$, so $L = v/(2f_1) = 343/(2 \\times 262) = 0.655$ m." },
    { q: "Two tuning forks produce a beat frequency of 3 Hz. One fork is known to be 440 Hz. What are the possible frequencies of the other fork?", a: "$f_2 = 440 \\pm 3$, so $f_2 = 437$ Hz or $f_2 = 443$ Hz." },
    { q: "A clarinet (open-closed pipe) and a flute (open-open pipe) have the same fundamental frequency. Which one has a second harmonic? What is the clarinet's lowest overtone?", a: "The flute has a second harmonic at $2f_1$. The clarinet, being an open-closed pipe, has only odd harmonics. Its lowest overtone is $3f_1$, a factor of 3 above the fundamental (an octave plus a fifth)." },
    { q: "In equal temperament, each semitone has a frequency ratio of $2^{1/12}$. What is the equal-tempered perfect fifth ratio, and how does it compare to the just fifth of 3/2?", a: "The equal-tempered fifth spans 7 semitones: $2^{7/12} = 1.4983$. The just fifth is $3/2 = 1.5000$. They differ by about 0.11%, or roughly 2 cents — nearly indistinguishable to most listeners." },
    { q: "A guitar string's third harmonic has a frequency of 990 Hz. What is the fundamental frequency? If the string is 0.65 m long, what is the wave speed?", a: "$f_1 = f_3/3 = 990/3 = 330$ Hz. $v = 2Lf_1 = 2(0.65)(330) = 429$ m/s." }
  ],
  longProblems: [
    {
      title: "Harmonics of an Organ Pipe",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Pipe_organ_Trinity_Church_NYC.jpg/220px-Pipe_organ_Trinity_Church_NYC.jpg",
      imageAlt: "Pipe organ at Trinity Church, New York City, showing ranks of open and closed pipes",
      context: "A pipe organ produces sound using standing waves in air columns. Open pipes (open at both ends) and stopped pipes (closed at one end) have different overtone structures. The speed of sound in the warm air inside the organ is $v = 350$ m/s.",
      parts: [
        { label: "(a)", q: "An open pipe has a fundamental frequency of 65.4 Hz (low C, C2). What is the length of this pipe?", a: "$f_1 = v/(2L)$ for an open pipe, so $L = v/(2f_1) = 350/(2 \\times 65.4) = 2.68$ m, about 8.8 feet — a sizable pipe." },
        { label: "(b)", q: "List the first five harmonic frequencies for this open pipe. Now list the first five harmonic frequencies for a stopped pipe of the same length.", a: "Open pipe: $f_n = nf_1 = 65.4, 130.8, 196.2, 261.6, 327.0$ Hz ($n = 1$–$5$). Stopped pipe: only odd harmonics, with $f_1' = v/(4L) = 350/(4 \\times 2.68) = 32.7$ Hz. So $f_n = 32.7, 98.1, 163.5, 228.9, 294.3$ Hz ($n = 1, 3, 5, 7, 9$)." },
        { label: "(c)", q: "Organ builders say a stopped pipe sounds 'darker' or 'hollower' than an open pipe. Explain this in terms of the harmonic content.", a: "The stopped pipe is missing all even harmonics. The second harmonic, which would be the octave, is absent. This gives a hollow quality because the overtone series has wider gaps, and the relative strength of odd harmonics (especially the third, at an octave + fifth) creates a distinctive 'covered' tone." },
        { label: "(d)", q: "Two pipes are supposed to sound a perfect fifth apart. One pipe plays C2 at 65.4 Hz. If the second pipe is an open pipe, what length should it be to play G2?", a: "G2 is a perfect fifth above C2: $f_G = 65.4 \\times 3/2 = 98.1$ Hz. For an open pipe, $L = v/(2f) = 350/(2 \\times 98.1) = 1.78$ m." },
        { label: "(e)", q: "On a cold day, the air in the organ cools to 10°C, reducing the speed of sound to 337 m/s. By what percentage do all the pipe frequencies drop? How would this affect the organ's tuning?", a: "All frequencies scale linearly with $v$: $\\Delta f/f = \\Delta v/v = (337 - 350)/350 = -3.7\\%$. This is about 65 cents flat — nearly a semitone. The entire organ goes flat by the same fraction, so intervals between pipes are preserved, but the organ would be noticeably out of tune with other instruments." }
      ]
    },
    {
      title: "Tuning a Piano: Beats and Temperament",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Bosendorfer_185.JPG/300px-Bosendorfer_185.JPG",
      imageAlt: "Interior of a Bosendorfer grand piano showing the strings and hammers",
      context: "Piano tuners use the phenomenon of beats to tune strings. When two notes are nearly in tune, beats are heard as a slow wavering in loudness. The tuner adjusts the string tension until the beats vanish (for unisons) or reach a specific rate (for tempered intervals). A piano tuner is working on a Bosendorfer grand.",
      parts: [
        { label: "(a)", q: "The tuner strikes A4 (440 Hz) and the A4 string on the piano simultaneously. She hears 4 beats per second. The piano string is flat. What is the piano string's frequency?", a: "Since the piano is flat (lower), $f_{\\text{piano}} = 440 - 4 = 436$ Hz." },
        { label: "(b)", q: "She tightens the string to bring it up to 440 Hz. If the string's vibrating length is $L = 0.50$ m and its linear mass density is $\\mu = 5.0 \\times 10^{-3}$ kg/m, what tension does 440 Hz correspond to?", a: "$f_1 = v/(2L) = \\sqrt{T/\\mu}/(2L)$, so $T = \\mu(2Lf_1)^2 = (5.0 \\times 10^{-3})(2 \\times 0.50 \\times 440)^2 = (5.0 \\times 10^{-3})(440)^2 = 968$ N $\\approx 218$ lb." },
        { label: "(c)", q: "In equal temperament, a major third (4 semitones) has ratio $2^{4/12} = 2^{1/3} \\approx 1.2599$. In just intonation it is $5/4 = 1.2500$. If the tuner plays A4 at 440 Hz with C$\\sharp$5, what is the equal-tempered frequency of C$\\sharp$5? How many beats per second are heard between the equal-tempered C$\\sharp$5 and the just-intonation C$\\sharp$5?", a: "Equal-tempered: $f = 440 \\times 2^{1/3} = 440 \\times 1.2599 = 554.4$ Hz. Just: $f = 440 \\times 5/4 = 550.0$ Hz. Beat frequency: $|554.4 - 550.0| = 4.4$ beats per second. This is clearly audible and is why equal temperament is a compromise." },
        { label: "(d)", q: "Three strings are tuned to the same note (a unison group). If string 1 is at 440.0 Hz, string 2 at 440.5 Hz, and string 3 at 439.5 Hz, how many distinct beat frequencies can be heard? What are they?", a: "There are three pairs: (1,2) gives $|440.0 - 440.5| = 0.5$ Hz, (1,3) gives $|440.0 - 439.5| = 0.5$ Hz, (2,3) gives $|440.5 - 439.5| = 1.0$ Hz. So two distinct beat frequencies: 0.5 Hz and 1.0 Hz." }
      ]
    },
    {
      title: "The Physics of a Didgeridoo",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Didgeridoo_%28Imagicity_1070%29.jpg/300px-Didgeridoo_%28Imagicity_1070%29.jpg",
      imageAlt: "An Australian didgeridoo, a long wooden pipe played with vibrating lips",
      context: "The didgeridoo is an Australian Aboriginal wind instrument made from a eucalyptus trunk hollowed by termites. It behaves approximately as a cylindrical pipe open at the far (bell) end and nearly closed at the mouthpiece end (sealed by the player's lips). A typical instrument is about 1.3 m long. Take $v = 343$ m/s.",
      parts: [
        { label: "(a)", q: "Model the didgeridoo as an open-closed pipe of length $L = 1.3$ m. What is the fundamental frequency? What note is this closest to?", a: "$f_1 = v/(4L) = 343/(4 \\times 1.3) = 66.0$ Hz. This is close to C2 (65.4 Hz), two octaves below middle C — a deep drone." },
        { label: "(b)", q: "What are the next three resonant frequencies? Express each as a musical interval above the fundamental.", a: "Only odd harmonics: $f_3 = 3f_1 = 198$ Hz (an octave + a fifth above the fundamental), $f_5 = 5f_1 = 330$ Hz (two octaves + a major third), $f_7 = 7f_1 = 462$ Hz (two octaves + a minor seventh). The absence of even harmonics gives the didgeridoo its characteristic hollow timbre." },
        { label: "(c)", q: "Skilled players use vocal tract resonances to selectively amplify individual harmonics (a technique called 'overtone singing'). If the player shapes their vocal tract to resonate near 198 Hz, which harmonic is amplified? Why doesn't the second harmonic ($2f_1 = 132$ Hz) appear?", a: "The 3rd harmonic ($3f_1 = 198$ Hz) is amplified. The second harmonic at $2f_1 = 132$ Hz does not appear because it would require a pressure node at the closed end and a pressure antinode at the open end — but for $n = 2$, the pipe length would be $\\lambda/2$, placing a pressure node at each end. This violates the closed-end boundary condition (which requires a pressure antinode), so even harmonics are forbidden." },
        { label: "(d)", q: "Some didgeridoos are slightly conical rather than cylindrical. Conical pipes (open-closed) support all harmonics, not just odd ones. If this instrument were conical with the same effective length and fundamental, what additional frequencies below 500 Hz would appear?", a: "A conical pipe supports all harmonics: $f_n = nf_1$. The additional (even) harmonics below 500 Hz are $f_2 = 2 \\times 66 = 132$ Hz, $f_4 = 4 \\times 66 = 264$ Hz, $f_6 = 6 \\times 66 = 396$ Hz. These fill in the gaps in the overtone series, giving a brighter, richer tone." }
      ]
    }
  ]
},

"fourier-transforms": {
  readingQuiz: [
    { q: "What does the Fourier transform of a function $f(t)$ represent?", a: "It decomposes $f(t)$ into its constituent sinusoidal frequencies, giving the amplitude and phase at each frequency $\\omega$." },
    { q: "What is the Fourier transform of a Dirac delta function $\\delta(t)$?", a: "A constant: $\\tilde{\\delta}(\\omega) = 1$ for all $\\omega$. The delta function contains all frequencies equally." },
    { q: "What is the uncertainty principle in the context of waves?", a: "A signal cannot be simultaneously localized in both time and frequency: $\\Delta t \\, \\Delta \\omega \\geq 1/2$ (or equivalently $\\Delta x \\, \\Delta k \\geq 1/2$)." },
    { q: "What happens to the Fourier transform of a signal when the signal is made narrower in time?", a: "It becomes broader in frequency — a consequence of the uncertainty principle." },
    { q: "What is convolution?", a: "The convolution of $f$ and $g$ is $(f * g)(t) = \\int_{-\\infty}^{\\infty} f(\\tau) g(t - \\tau) \\, d\\tau$, which blends one function with a shifted, reversed copy of another." },
    { q: "State the convolution theorem.", a: "The Fourier transform of a convolution is the product of the individual Fourier transforms: $\\mathcal{F}[f * g] = \\tilde{f} \\cdot \\tilde{g}$." },
    { q: "What is the Fourier transform of a Gaussian function?", a: "Another Gaussian. A Gaussian is the unique function that minimizes the uncertainty product $\\Delta t \\, \\Delta \\omega$." },
    { q: "How does a Fourier series differ from a Fourier transform?", a: "A Fourier series decomposes periodic functions into discrete harmonics (integer multiples of a fundamental frequency), while a Fourier transform decomposes general (non-periodic) functions into a continuous spectrum of frequencies." },
    { q: "What is bandwidth?", a: "Bandwidth is the range of frequencies $\\Delta \\omega$ (or $\\Delta f$) that a signal or system occupies in the frequency domain." }
  ],
  shortAnswer: [
    { q: "A rectangular pulse has duration $\\Delta t = 1$ ms. Estimate its bandwidth $\\Delta f$.", a: "From the uncertainty relation, $\\Delta f \\sim 1/\\Delta t = 1/(10^{-3}) = 1000$ Hz $= 1$ kHz. (More precisely, the Fourier transform of a rectangular pulse is a sinc function whose first zero is at $f = 1/\\Delta t$.)" },
    { q: "Show that if $f(t)$ is real and even, its Fourier transform $\\tilde{f}(\\omega)$ is also real and even.", a: "$\\tilde{f}(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} dt$. Since $f(t)$ is real and even, $f(-t) = f(t)$, and $\\tilde{f}(\\omega) = \\int f(t)\\cos(\\omega t)\\, dt$ (the sine part vanishes by odd symmetry). This integral is manifestly real and even in $\\omega$." },
    { q: "The Fourier transform of a single sine wave $\\sin(\\omega_0 t)$ (lasting forever) is a pair of delta functions. Where are they located?", a: "At $\\omega = \\pm \\omega_0$: $\\tilde{f}(\\omega) = \\frac{1}{2i}[\\delta(\\omega - \\omega_0) - \\delta(\\omega + \\omega_0)]$. A pure sine wave has zero bandwidth and infinite duration — an extreme case of the uncertainty principle." },
    { q: "A Gaussian wavepacket has $f(t) = e^{-t^2/(2\\sigma_t^2)}$. Its Fourier transform is $\\tilde{f}(\\omega) = \\sigma_t \\sqrt{2\\pi} \\, e^{-\\sigma_t^2 \\omega^2/2}$. Find $\\Delta t$ and $\\Delta \\omega$ (defined as the standard deviations) and verify the uncertainty relation.", a: "$\\Delta t = \\sigma_t / \\sqrt{2}$ and $\\Delta \\omega = 1/(\\sigma_t\\sqrt{2})$ (standard deviations of $|f|^2$ and $|\\tilde{f}|^2$). Then $\\Delta t \\cdot \\Delta \\omega = (\\sigma_t/\\sqrt{2}) \\cdot 1/(\\sigma_t \\sqrt{2}) = 1/2$. The Gaussian saturates the uncertainty bound." },
    { q: "Explain in one or two sentences why a musical note must last for a finite duration to have a well-defined pitch.", a: "By the uncertainty principle, $\\Delta f \\sim 1/\\Delta t$. To resolve the frequency (pitch) to within, say, 1 Hz, the note must last at least $\\sim 1$ second. A very short click has such broad frequency content that no definite pitch can be perceived." },
    { q: "The convolution of two rectangular pulses (each of width $a$) is a triangle function of width $2a$. Use the convolution theorem to find the Fourier transform of this triangle function.", a: "The FT of a rectangular pulse of width $a$ is $a\\,\\text{sinc}(\\omega a/2)$. By the convolution theorem, the FT of their convolution (the triangle) is the product: $a^2 \\, \\text{sinc}^2(\\omega a/2)$." }
  ],
  longProblems: [
    {
      title: "MRI and the Fourier Transform",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/MRI_head_side.jpg/220px-MRI_head_side.jpg",
      imageAlt: "Sagittal MRI scan of a human head showing brain structures",
      context: "Magnetic Resonance Imaging (MRI) reconstructs images by applying the Fourier transform to measured signals. In MRI, hydrogen nuclei precess at the Larmor frequency $\\omega = \\gamma B$, where $\\gamma = 2.68 \\times 10^8$ rad/s/T is the gyromagnetic ratio and $B$ is the magnetic field. A gradient field $B(x) = B_0 + Gx$ encodes spatial position as frequency.",
      parts: [
        { label: "(a)", q: "In a 3.0 T MRI scanner, what is the Larmor frequency of hydrogen? Express in MHz.", a: "$\\omega = \\gamma B = (2.68 \\times 10^8)(3.0) = 8.04 \\times 10^8$ rad/s. In Hz: $f = \\omega/(2\\pi) = 1.28 \\times 10^8$ Hz $= 128$ MHz. This is in the radio-frequency range." },
        { label: "(b)", q: "A gradient of $G = 10$ mT/m is applied. Two voxels are separated by $\\Delta x = 1.0$ mm. What is the difference in their precession frequencies?", a: "$\\Delta \\omega = \\gamma G \\Delta x = (2.68 \\times 10^8)(0.010)(0.001) = 2680$ rad/s, or $\\Delta f = 2680/(2\\pi) = 427$ Hz." },
        { label: "(c)", q: "To distinguish these two voxels, the MRI signal must be recorded long enough to resolve a frequency difference of 427 Hz. Using the uncertainty principle, what is the minimum acquisition time?", a: "$\\Delta t \\geq 1/\\Delta f = 1/427 = 2.34$ ms. In practice, acquisition times are longer (tens of ms) to improve spectral resolution and signal-to-noise ratio." },
        { label: "(d)", q: "The detected MRI signal is $s(t) = \\int \\rho(x) e^{i\\gamma(B_0 + Gx)t} dx$, where $\\rho(x)$ is the proton density. Show that after demodulating (removing the $e^{i\\gamma B_0 t}$ carrier), the remaining signal is the Fourier transform of $\\rho(x)$ with $k = \\gamma G t$.", a: "After demodulation: $s'(t) = s(t)e^{-i\\gamma B_0 t} = \\int \\rho(x) e^{i\\gamma G x t} dx$. Define $k = \\gamma G t$, then $s'(k/\\gamma G) = \\int \\rho(x) e^{ikx} dx = \\tilde{\\rho}(k)$. This is exactly the Fourier transform of the proton density. Inverse Fourier transforming the acquired signal recovers the image $\\rho(x)$." }
      ]
    },
    {
      title: "Bandwidth of a Fiber-Optic Communication Pulse",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Fibreoptic.jpg/300px-Fibreoptic.jpg",
      imageAlt: "Illuminated ends of fiber optic cables glowing with colored light",
      context: "In fiber-optic communication, data is transmitted as short light pulses. Each pulse is approximately Gaussian in time: $E(t) = E_0 e^{-t^2/(2\\sigma_t^2)}\\cos(\\omega_0 t)$, where $\\omega_0$ is the optical carrier frequency. The system operates at a wavelength of $\\lambda_0 = 1550$ nm and the pulse duration is $\\sigma_t = 25$ ps (picoseconds).",
      parts: [
        { label: "(a)", q: "What is the carrier frequency $\\omega_0$ (and $f_0$) corresponding to $\\lambda_0 = 1550$ nm?", a: "$f_0 = c/\\lambda_0 = (3 \\times 10^8)/(1550 \\times 10^{-9}) = 1.935 \\times 10^{14}$ Hz $= 193.5$ THz. $\\omega_0 = 2\\pi f_0 = 1.216 \\times 10^{15}$ rad/s." },
        { label: "(b)", q: "The Fourier transform of the pulse envelope $e^{-t^2/(2\\sigma_t^2)}$ is a Gaussian in frequency with width $\\sigma_\\omega = 1/\\sigma_t$. What is the spectral bandwidth $\\Delta f$ (FWHM) of the pulse?", a: "$\\sigma_\\omega = 1/\\sigma_t = 1/(25 \\times 10^{-12}) = 4.0 \\times 10^{10}$ rad/s. For a Gaussian, FWHM $= 2\\sqrt{2\\ln 2}\\,\\sigma_\\omega/(2\\pi) = 2.355 \\times 4.0 \\times 10^{10}/(2\\pi) = 1.50 \\times 10^{10}$ Hz $= 15.0$ GHz." },
        { label: "(c)", q: "The data rate is 40 Gbit/s, meaning one pulse every 25 ps. Using the uncertainty principle, can these pulses be resolved in both time and frequency? Is this system operating near the Fourier limit?", a: "The pulse spacing equals $\\sigma_t = 25$ ps, and the bandwidth is $\\sim 15$ GHz per pulse. The time-bandwidth product is $\\Delta t \\cdot \\Delta f = (25 \\times 10^{-12})(1.5 \\times 10^{10}) \\approx 0.38$, close to the Fourier limit of $0.44$ (for Gaussian FWHM definition). Yes, this system is nearly Fourier-limited — the pulses are as short as they can be for their bandwidth." },
        { label: "(d)", q: "If the pulse were instead a rectangular pulse of the same duration (25 ps), its Fourier transform would be a sinc function. Would the bandwidth be larger or smaller? Explain.", a: "Larger. A rectangular pulse has sharp edges (discontinuities), which require higher-frequency components to represent. Its bandwidth (to the first null of the sinc) is $1/\\Delta t = 40$ GHz, compared to 15 GHz for the Gaussian. The Gaussian is the most 'bandwidth-efficient' pulse shape — it minimizes the time-bandwidth product." }
      ]
    },
    {
      title: "Radio Astronomy and Signal Processing",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Parkes_Radio_Telescope_09.jpg/300px-Parkes_Radio_Telescope_09.jpg",
      imageAlt: "The Parkes radio telescope in Australia, a large dish antenna pointed at the sky",
      context: "Radio telescopes receive weak signals from astronomical sources. The detected signal is processed using Fourier transforms to extract spectral information. The Parkes 64-m radio telescope observes the 21-cm hydrogen line at a rest frequency of $f_0 = 1420.405$ MHz.",
      parts: [
        { label: "(a)", q: "A distant galaxy's hydrogen line is detected at $f = 1419.200$ MHz. Using the Doppler formula $\\Delta f/f_0 = -v/c$ for non-relativistic speeds, determine the galaxy's radial velocity relative to Earth.", a: "$\\Delta f = f - f_0 = 1419.200 - 1420.405 = -1.205$ MHz. $v = -c \\Delta f/f_0 = -(3 \\times 10^5 \\text{ km/s})(-1.205/1420.405) = +254.5$ km/s. The positive sign means the galaxy is receding (redshifted)." },
        { label: "(b)", q: "The telescope records a time series for $T = 10$ minutes. What is the frequency resolution $\\delta f$ of the Fourier transform of this data?", a: "$\\delta f = 1/T = 1/(600 \\text{ s}) = 1.67 \\times 10^{-3}$ Hz $= 1.67$ mHz. This extraordinary resolution allows detection of tiny Doppler shifts corresponding to velocity differences of $\\delta v = c \\,\\delta f/f_0 = (3 \\times 10^5)(1.67 \\times 10^{-3})/(1.42 \\times 10^9) = 3.5 \\times 10^{-7}$ km/s $= 0.35$ mm/s." },
        { label: "(c)", q: "The telescope's bandwidth is 256 MHz, sampled at the Nyquist rate. What is the sampling rate and how many data points are collected in the 10-minute observation?", a: "Nyquist rate: $f_s = 2 \\times 256 \\text{ MHz} = 512 \\times 10^6$ samples/s. In 600 s: $N = 512 \\times 10^6 \\times 600 = 3.07 \\times 10^{11}$ samples — about 307 billion data points, illustrating the computational demands of radio astronomy." },
        { label: "(d)", q: "The telescope beam is convolved with the actual source brightness distribution to give the observed image. If the beam has a Gaussian profile with angular width $\\theta_b = 14'$ (arcminutes), and the source is a point source (delta function), what does the observed image look like? What if the source has angular extent $\\theta_s = 10'$?", a: "For a point source ($\\delta$-function), the convolution $\\delta * B = B$: the observed image is just the beam profile, a Gaussian of width 14'. For an extended source of width $\\theta_s$, the convolution of two Gaussians gives a Gaussian of width $\\theta_{\\text{obs}} = \\sqrt{\\theta_b^2 + \\theta_s^2} = \\sqrt{14^2 + 10^2} = \\sqrt{296} = 17.2'$. The source appears broadened by the beam." }
      ]
    }
  ]
},

"reflection-impedance": {
  readingQuiz: [
    { q: "What is the definition of impedance for a wave on a string?", a: "$Z = \\mu v$, the product of linear mass density and wave speed. It can also be written as $Z = \\sqrt{\\mu T}$." },
    { q: "What happens when a wave encounters a boundary between two media with equal impedances?", a: "There is no reflection — the wave is fully transmitted." },
    { q: "What is the reflection coefficient $r$ at a junction between impedances $Z_1$ and $Z_2$?", a: "$r = (Z_1 - Z_2)/(Z_1 + Z_2)$." },
    { q: "What is the transmission coefficient $t$ at a junction?", a: "$t = 2Z_1/(Z_1 + Z_2)$." },
    { q: "What does a negative reflection coefficient mean physically?", a: "The reflected wave is inverted (phase shift of $\\pi$) relative to the incident wave." },
    { q: "What boundary condition applies at a junction between two strings?", a: "Continuity of displacement and continuity of the transverse force (slope times tension) at the junction point." },
    { q: "What is impedance matching?", a: "Designing a system so that the impedance of one medium equals or gradually transitions to that of another, minimizing reflections." },
    { q: "When does total reflection occur?", a: "When $Z_2 = 0$ (free end) or $Z_2 = \\infty$ (fixed end). In both cases $|r| = 1$." },
    { q: "Can the transmission coefficient $t$ be greater than 1?", a: "Yes. When $Z_2 < Z_1$, $t > 1$ because the transmitted wave has a larger amplitude. However, the transmitted power is still less than or equal to the incident power." }
  ],
  shortAnswer: [
    { q: "A rope with $\\mu_1 = 0.10$ kg/m under tension $T = 40$ N is joined to a rope with $\\mu_2 = 0.40$ kg/m. Find the impedances, reflection coefficient, and transmission coefficient.", a: "$Z_1 = \\sqrt{\\mu_1 T} = \\sqrt{0.10 \\times 40} = 2.0$ kg/s. $Z_2 = \\sqrt{0.40 \\times 40} = 4.0$ kg/s. $r = (Z_1 - Z_2)/(Z_1 + Z_2) = (2 - 4)/(2 + 4) = -1/3$. $t = 2Z_1/(Z_1 + Z_2) = 4/6 = 2/3$. The negative $r$ means the reflected pulse is inverted." },
    { q: "Verify that the boundary conditions (continuity of displacement and force) are satisfied by $1 + r = t$ at a junction.", a: "Continuity of displacement: $A_i + A_r = A_t$, i.e., $A_i(1 + r) = A_i t$, giving $1 + r = t$. Check: $1 + (-1/3) = 2/3$ \\checkmark. Continuity of force (slope $\\times$ tension) gives $Z_1(1 - r) = Z_2 t$: $2(1 + 1/3) = 4(2/3) \\Rightarrow 8/3 = 8/3$ \\checkmark." },
    { q: "A wave goes from medium 1 to medium 2 and then to medium 3. If $Z_1 = Z_3 = Z$ and $Z_2 = Z$ as well, show there is no net reflection.", a: "If all impedances are equal, $r_{12} = (Z - Z)/(Z + Z) = 0$ and $r_{23} = 0$. No reflections at either boundary. This is the trivial case of perfect impedance matching." },
    { q: "What impedance $Z_2$ of a quarter-wave matching layer is needed to eliminate reflections between media with $Z_1 = 2.0$ kg/s and $Z_3 = 8.0$ kg/s?", a: "The quarter-wave transformer requires $Z_2 = \\sqrt{Z_1 Z_3} = \\sqrt{2.0 \\times 8.0} = 4.0$ kg/s." },
    { q: "A fixed end corresponds to $Z_2 = \\infty$. Show that $r = -1$ and $t = 0$ in this limit.", a: "$r = (Z_1 - Z_2)/(Z_1 + Z_2)$. As $Z_2 \\to \\infty$: $r \\to -Z_2/Z_2 = -1$. $t = 2Z_1/(Z_1 + Z_2) \\to 0$. Total reflection with inversion, no transmission." },
    { q: "A free end corresponds to $Z_2 = 0$. Find $r$ and $t$.", a: "$r = (Z_1 - 0)/(Z_1 + 0) = 1$. $t = 2Z_1/(Z_1 + 0) = 2$. Total reflection without inversion, and $t = 2$ — but since there's no medium 2 to carry the wave away, no energy is transmitted." }
  ],
  longProblems: [
    {
      title: "Ultrasound Imaging of the Human Body",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Ultrasound_of_human_fetus%2C_danger_danger.jpg/300px-Ultrasound_of_human_fetus%2C_danger_danger.jpg",
      imageAlt: "Ultrasound image of a human fetus in the womb",
      context: "Medical ultrasound imaging relies on reflections at tissue boundaries. Sound waves are partially reflected wherever the acoustic impedance changes. Acoustic impedance is $Z = \\rho v$, where $\\rho$ is density and $v$ is the speed of sound. Typical values: soft tissue $Z_t = 1.63 \\times 10^6$ kg/(m$^2$s), bone $Z_b = 7.8 \\times 10^6$ kg/(m$^2$s), air $Z_a = 430$ kg/(m$^2$s).",
      parts: [
        { label: "(a)", q: "Calculate the reflection coefficient at a soft tissue-bone interface. What fraction of the incident amplitude is reflected?", a: "$r = (Z_t - Z_b)/(Z_t + Z_b) = (1.63 - 7.8)/(1.63 + 7.8) \\times 10^6/(\\times 10^6) = -6.17/9.43 = -0.654$. About 65.4% of the amplitude is reflected (with inversion). This strong reflection is why bone surfaces appear bright on ultrasound." },
        { label: "(b)", q: "Calculate the reflection coefficient at a skin-air interface (without gel). Why is coupling gel essential?", a: "$r = (Z_t - Z_a)/(Z_t + Z_a) = (1.63 \\times 10^6 - 430)/(1.63 \\times 10^6 + 430) \\approx 0.9995$. Virtually all the sound is reflected at the skin-air interface. Coupling gel ($Z \\approx 1.5 \\times 10^6$) has impedance close to tissue, so it eliminates this nearly total reflection and allows sound to enter the body." },
        { label: "(c)", q: "What impedance should an ideal coupling gel have to perfectly match between the transducer (piezoelectric ceramic, $Z_p = 30 \\times 10^6$ kg/(m$^2$s)) and soft tissue ($Z_t = 1.63 \\times 10^6$)? Use the quarter-wave matching condition.", a: "$Z_{\\text{gel}} = \\sqrt{Z_p Z_t} = \\sqrt{30 \\times 10^6 \\times 1.63 \\times 10^6} = \\sqrt{48.9 \\times 10^{12}} = 7.0 \\times 10^6$ kg/(m$^2$s). This is close to the impedance of bone — which is why some transducer designs use a bone-like matching layer." },
        { label: "(d)", q: "An ultrasound pulse at 5 MHz travels through soft tissue ($v = 1540$ m/s) and reflects off a structure 8 cm deep. How long after transmission does the echo return? What is the wavelength in tissue?", a: "Round-trip distance: $2d = 2 \\times 0.08 = 0.16$ m. Time: $t = 0.16/1540 = 1.04 \\times 10^{-4}$ s $= 104$ $\\mu$s. Wavelength: $\\lambda = v/f = 1540/(5 \\times 10^6) = 3.08 \\times 10^{-4}$ m $= 0.31$ mm, which sets the spatial resolution of the image." }
      ]
    },
    {
      title: "Seismic Reflection Surveying for Oil Exploration",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Seismic_Reflection_Schematic.png/350px-Seismic_Reflection_Schematic.png",
      imageAlt: "Diagram showing seismic reflection survey with a source, reflected waves, and geophones at the surface",
      context: "In seismic reflection surveying, controlled explosions or vibrator trucks generate seismic waves that reflect off underground rock layers. The reflected signals reveal subsurface geology and can locate oil-bearing formations. The acoustic impedance of rock is $Z = \\rho v$. Consider three horizontal layers: sandstone ($\\rho_1 = 2200$ kg/m$^3$, $v_1 = 3300$ m/s), shale ($\\rho_2 = 2500$ kg/m$^3$, $v_2 = 2800$ m/s), and limestone ($\\rho_3 = 2700$ kg/m$^3$, $v_3 = 5500$ m/s).",
      parts: [
        { label: "(a)", q: "Compute the acoustic impedance of each layer.", a: "$Z_1 = \\rho_1 v_1 = 2200 \\times 3300 = 7.26 \\times 10^6$ kg/(m$^2$s). $Z_2 = 2500 \\times 2800 = 7.00 \\times 10^6$. $Z_3 = 2700 \\times 5500 = 14.85 \\times 10^6$." },
        { label: "(b)", q: "Find the reflection coefficient at the sandstone-shale boundary and at the shale-limestone boundary. Which produces a stronger reflection?", a: "$r_{12} = (Z_1 - Z_2)/(Z_1 + Z_2) = (7.26 - 7.00)/(7.26 + 7.00) = 0.26/14.26 = 0.018$. $r_{23} = (Z_2 - Z_3)/(Z_2 + Z_3) = (7.00 - 14.85)/(7.00 + 14.85) = -7.85/21.85 = -0.359$. The shale-limestone boundary produces a much stronger reflection. The sandstone-shale reflection is very weak (only 1.8% of amplitude)." },
        { label: "(c)", q: "The sandstone layer is 500 m thick and the shale layer is 800 m thick. A seismic pulse is generated at the surface. At what times do reflections from the two boundaries arrive back at the surface?", a: "Reflection from sandstone-shale boundary: travels 500 m down and 500 m back through sandstone. $t_1 = 2(500)/3300 = 0.303$ s. Reflection from shale-limestone boundary: 500 m through sandstone + 800 m through shale, each way. $t_2 = 2(500/3300 + 800/2800) = 2(0.1515 + 0.2857) = 0.875$ s." },
        { label: "(d)", q: "Oil-saturated sandstone has a significantly lower velocity ($v = 2500$ m/s) than dry sandstone ($v = 3300$ m/s) at similar density. How would the presence of an oil reservoir in the sandstone layer change the reflection pattern?", a: "Oil-saturated sandstone: $Z_1' = 2200 \\times 2500 = 5.50 \\times 10^6$. Now $r_{12}' = (5.50 - 7.00)/(5.50 + 7.00) = -1.50/12.50 = -0.120$. The reflection coefficient jumps from 0.018 to $-0.120$ (magnitude 6.7 times larger, and the sign flips). This dramatic change — a 'bright spot' with inverted polarity — is a classic seismic indicator of hydrocarbons." }
      ]
    },
    {
      title: "Anti-Reflective Coatings on Camera Lenses",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Multicoated_lens.jpg/300px-Multicoated_lens.jpg",
      imageAlt: "A camera lens showing the characteristic purple/green tint of anti-reflective multi-coating",
      context: "Camera lenses use thin-film anti-reflective (AR) coatings to minimize reflections at glass surfaces. The principle is identical to impedance matching: a quarter-wave layer of intermediate impedance produces a reflected wave that destructively interferes with the initial reflection. For light, the 'impedance' is related to the refractive index: $Z \\propto 1/n$. The reflection coefficient at normal incidence is $r = (n_1 - n_2)/(n_1 + n_2)$.",
      parts: [
        { label: "(a)", q: "What fraction of light intensity is reflected at an uncoated air ($n_1 = 1.00$) to glass ($n_2 = 1.52$) interface?", a: "$r = (1.00 - 1.52)/(1.00 + 1.52) = -0.52/2.52 = -0.2063$. Intensity reflectance: $R = r^2 = 0.0426 = 4.26\\%$. This may seem small, but a camera lens has many surfaces (10-20 in a zoom lens), so without coatings, cumulative reflection losses and ghost images would be severe." },
        { label: "(b)", q: "For a single-layer AR coating, the ideal refractive index is $n_c = \\sqrt{n_1 n_2}$. What value is needed for air-glass? What common material has a refractive index close to this?", a: "$n_c = \\sqrt{1.00 \\times 1.52} = 1.233$. Magnesium fluoride (MgF$_2$, $n = 1.38$) is the most commonly used single-layer coating — not perfectly matched, but it's the best durable material available. It reduces $R$ from 4.26% to about 1.3%." },
        { label: "(c)", q: "The coating thickness must be $\\lambda/(4n_c)$ for destructive interference. For light of wavelength $\\lambda = 550$ nm (green, center of visible spectrum), how thick should an MgF$_2$ coating be?", a: "$d = \\lambda/(4n_c) = 550/(4 \\times 1.38) = 99.6$ nm $\\approx 100$ nm. This is about 200 atoms thick." },
        { label: "(d)", q: "This coating is optimized for 550 nm. At what wavelength does the coating thickness equal $\\lambda/2$ (so the two reflected waves constructively interfere instead)? What color would the residual reflection appear?", a: "The coating acts as a half-wave layer when $d = \\lambda'/(2n_c)$, giving $\\lambda' = 2n_c d = 2(1.38)(99.6) = 274.9$ nm. This is in the ultraviolet, outside the visible range. The coating is most reflective at the spectral extremes of visible light (violet $\\sim 400$ nm and red $\\sim 700$ nm), where the quarter-wave condition is not perfectly met. This is why AR-coated lenses have a characteristic purple/magenta tint — they reflect the blue and red ends while transmitting green most efficiently." }
      ]
    }
  ]
},

"power": {
  readingQuiz: [
    { q: "What is the power transmitted by a transverse wave on a string?", a: "Power equals the transverse force times the transverse velocity: $P = -T(\\partial y/\\partial x)(\\partial y/\\partial t)$." },
    { q: "For a sinusoidal wave $y = A\\sin(kx - \\omega t)$, what is the time-averaged power?", a: "$\\langle P \\rangle = \\frac{1}{2}\\mu \\omega^2 A^2 v = \\frac{1}{2}Z\\omega^2 A^2$." },
    { q: "What is the relationship between the power reflection and transmission coefficients?", a: "$R + T = 1$, which expresses conservation of energy at a boundary." },
    { q: "How is the power reflection coefficient $R$ related to the amplitude reflection coefficient $r$?", a: "$R = r^2 = \\left(\\frac{Z_1 - Z_2}{Z_1 + Z_2}\\right)^2$." },
    { q: "How is the power transmission coefficient $T$ expressed?", a: "$T = \\frac{Z_2}{Z_1}t^2 = \\frac{4Z_1 Z_2}{(Z_1 + Z_2)^2}$. Note the factor $Z_2/Z_1$ is needed because power depends on impedance." },
    { q: "Why can the amplitude transmission coefficient $t$ exceed 1 while the power transmission coefficient $T$ cannot?", a: "Because $t$ measures amplitude ratios, but power depends on both amplitude squared and impedance. When $t > 1$, the lower impedance of medium 2 ensures $T = (Z_2/Z_1)t^2 \\leq 1$." },
    { q: "What is wave intensity?", a: "Intensity is power per unit area: $I = P/A$, measured in W/m$^2$." },
    { q: "How does the intensity of a spherical wave vary with distance from the source?", a: "It falls off as $1/r^2$ (inverse square law) because the power spreads over a sphere of area $4\\pi r^2$." },
    { q: "Where in a sinusoidal standing wave is the energy concentrated?", a: "Energy sloshes back and forth between the antinodes. At the nodes, neither kinetic nor potential energy is present." }
  ],
  shortAnswer: [
    { q: "A sinusoidal wave on a string has amplitude $A = 3.0$ cm, frequency $f = 120$ Hz, and the string has $\\mu = 0.010$ kg/m and $T = 90$ N. Find the wave speed, impedance, and average power.", a: "$v = \\sqrt{T/\\mu} = \\sqrt{90/0.010} = 94.9$ m/s. $Z = \\mu v = 0.010 \\times 94.9 = 0.949$ kg/s. $\\omega = 2\\pi(120) = 754$ rad/s. $\\langle P \\rangle = \\frac{1}{2}Z\\omega^2 A^2 = \\frac{1}{2}(0.949)(754)^2(0.030)^2 = 24.3$ W." },
    { q: "At a boundary where $Z_1 = 3.0$ kg/s and $Z_2 = 1.0$ kg/s, find $r$, $R$, $T$, and verify energy conservation.", a: "$r = (3 - 1)/(3 + 1) = 0.50$. $R = r^2 = 0.25$. $t = 2(3)/(3 + 1) = 1.50$. $T = (Z_2/Z_1)t^2 = (1/3)(1.5)^2 = 0.75$. Check: $R + T = 0.25 + 0.75 = 1.00$ \\checkmark." },
    { q: "A wave source emits 100 W isotropically. What is the intensity at a distance of 5.0 m?", a: "$I = P/(4\\pi r^2) = 100/(4\\pi \\times 25) = 0.318$ W/m$^2$." },
    { q: "If you double the amplitude of a wave, by what factor does the power change?", a: "Power is proportional to $A^2$, so doubling the amplitude quadruples the power (factor of 4)." },
    { q: "Show that $R + T = 1$ starting from $r = (Z_1 - Z_2)/(Z_1 + Z_2)$ and $t = 2Z_1/(Z_1 + Z_2)$.", a: "$R = r^2 = \\frac{(Z_1 - Z_2)^2}{(Z_1 + Z_2)^2}$. $T = \\frac{Z_2}{Z_1}t^2 = \\frac{Z_2}{Z_1} \\cdot \\frac{4Z_1^2}{(Z_1+Z_2)^2} = \\frac{4Z_1 Z_2}{(Z_1+Z_2)^2}$. $R + T = \\frac{(Z_1-Z_2)^2 + 4Z_1Z_2}{(Z_1+Z_2)^2} = \\frac{Z_1^2 + Z_2^2 - 2Z_1Z_2 + 4Z_1Z_2}{(Z_1+Z_2)^2} = \\frac{(Z_1+Z_2)^2}{(Z_1+Z_2)^2} = 1$. \\checkmark" }
  ],
  longProblems: [
    {
      title: "Power Transmission in an Electrical Power Line",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Overhead_power_line.jpg/300px-Overhead_power_line.jpg",
      imageAlt: "High-voltage overhead power transmission lines stretching across a landscape",
      context: "Electrical transmission lines carry electromagnetic waves that obey wave equations analogous to those for mechanical waves. A transmission line has characteristic impedance $Z_0 = \\sqrt{L/C}$, where $L$ and $C$ are inductance and capacitance per unit length. A typical high-voltage line has $Z_0 = 300 \\;\\Omega$. When a transmission line is terminated by a load impedance $Z_L$, the reflection coefficient is $r = (Z_L - Z_0)/(Z_L + Z_0)$.",
      parts: [
        { label: "(a)", q: "A 300 $\\Omega$ transmission line is connected to a 75 $\\Omega$ load (e.g., a cable TV connection). What are the amplitude and power reflection coefficients?", a: "$r = (75 - 300)/(75 + 300) = -225/375 = -0.60$. $R = r^2 = 0.36$. So 36% of the power is reflected — a significant mismatch. $T = 1 - R = 0.64$; only 64% of the power reaches the load." },
        { label: "(b)", q: "What load impedance would perfectly match this line (zero reflection)?", a: "$Z_L = Z_0 = 300\\;\\Omega$. When the load impedance equals the line impedance, $r = 0$ and all power is delivered to the load." },
        { label: "(c)", q: "A quarter-wave matching transformer can be inserted between the line and the load. What impedance should this matching section have?", a: "$Z_m = \\sqrt{Z_0 Z_L} = \\sqrt{300 \\times 75} = \\sqrt{22500} = 150\\;\\Omega$. A 150 $\\Omega$ quarter-wave section perfectly matches the 300 $\\Omega$ line to the 75 $\\Omega$ load, delivering 100% of the power." },
        { label: "(d)", q: "If the line carries 500 MW of power and the mismatch in part (a) exists, how much power is reflected and how much is wasted (assuming the reflected power cannot be recovered)?", a: "Reflected power: $P_r = RP_i = 0.36 \\times 500 = 180$ MW. Delivered to load: $P_t = TP_i = 0.64 \\times 500 = 320$ MW. The 180 MW reflected represents an enormous waste — impedance matching is critical in power systems." }
      ]
    },
    {
      title: "Acoustic Power of a Concert Loudspeaker",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Loudspeaker_at_a_concert.jpg/300px-Loudspeaker_at_a_concert.jpg",
      imageAlt: "Large loudspeaker array at an outdoor concert venue",
      context: "A concert sound system produces acoustic waves that carry energy from the speakers to the audience. The threshold of hearing is $I_0 = 10^{-12}$ W/m$^2$ and the threshold of pain is about $1$ W/m$^2$. Sound intensity level in decibels is $\\beta = 10\\log_{10}(I/I_0)$. A large concert speaker system emits 1000 W of acoustic power.",
      parts: [
        { label: "(a)", q: "Assuming the speaker radiates sound uniformly into a hemisphere (forward half-space), what is the intensity at a distance of 30 m from the speaker?", a: "$I = P/(2\\pi r^2) = 1000/(2\\pi \\times 30^2) = 1000/5655 = 0.177$ W/m$^2$. In dB: $\\beta = 10\\log_{10}(0.177/10^{-12}) = 10 \\times 11.25 = 112.5$ dB. This is painfully loud — approaching the threshold of pain." },
        { label: "(b)", q: "At what distance does the intensity drop to 85 dB, which is the level above which prolonged exposure causes hearing damage?", a: "$85 = 10\\log_{10}(I/10^{-12})$, so $I = 10^{8.5} \\times 10^{-12} = 3.16 \\times 10^{-4}$ W/m$^2$. Then $r = \\sqrt{P/(2\\pi I)} = \\sqrt{1000/(2\\pi \\times 3.16 \\times 10^{-4})} = \\sqrt{5.03 \\times 10^5} = 709$ m. Almost three-quarters of a kilometer!" },
        { label: "(c)", q: "A sound wave in air ($Z_{\\text{air}} = 415$ kg/(m$^2$s)) hits a concrete wall ($Z_{\\text{wall}} = 8.0 \\times 10^6$ kg/(m$^2$s)). What fraction of the acoustic power is transmitted through the wall?", a: "$R = \\left(\\frac{Z_{\\text{air}} - Z_{\\text{wall}}}{Z_{\\text{air}} + Z_{\\text{wall}}}\\right)^2 \\approx 1$. More precisely, $T = \\frac{4Z_{\\text{air}}Z_{\\text{wall}}}{(Z_{\\text{air}} + Z_{\\text{wall}})^2} = \\frac{4(415)(8 \\times 10^6)}{(8 \\times 10^6)^2} \\approx 2.1 \\times 10^{-4}$. Only about 0.021% of the power gets through — concrete is an effective sound barrier." },
        { label: "(d)", q: "The speaker cone has area $A = 0.10$ m$^2$ and vibrates sinusoidally at $f = 200$ Hz with amplitude 1.0 mm. Using $P = \\frac{1}{2}Z_{\\text{air}} A \\omega^2 a^2$, estimate the acoustic power radiated.", a: "$\\omega = 2\\pi(200) = 1257$ rad/s. $P = \\frac{1}{2}(415)(0.10)(1257)^2(0.001)^2 = \\frac{1}{2}(415)(0.10)(1.581 \\times 10^6)(10^{-6}) = \\frac{1}{2}(415)(0.10)(1.581) = 32.8$ W. The actual acoustic output is lower than the 1000 W electrical input, consistent with typical speaker efficiencies of 1-10%." }
      ]
    },
    {
      title: "Energy Transport by Ocean Waves",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Waves_in_pacridge.jpg/300px-Waves_in_pacridge.jpg",
      imageAlt: "Large ocean waves approaching a shoreline, showing the power of the surf",
      context: "Ocean surface waves carry enormous energy across the sea. The power per unit length of wavefront for deep-water ocean waves is $P/L = \\frac{1}{32\\pi}\\rho g^2 A^2 T_{\\text{period}}$, where $\\rho = 1025$ kg/m$^3$ is seawater density, $g = 9.81$ m/s$^2$, $A$ is the wave amplitude (half the crest-to-trough height), and $T_{\\text{period}}$ is the wave period.",
      parts: [
        { label: "(a)", q: "A typical North Atlantic swell has a wave height of 3.0 m (amplitude $A = 1.5$ m) and a period of $T = 10$ s. What is the power per meter of wavefront?", a: "$P/L = \\frac{1}{32\\pi}(1025)(9.81)^2(1.5)^2(10) = \\frac{1}{100.5}(1025)(96.2)(2.25)(10) = \\frac{2.22 \\times 10^6}{100.5} = 22.1$ kW/m. Roughly 22 kilowatts per meter of wave crest." },
        { label: "(b)", q: "A wave energy converter (e.g., a buoy-type device) captures energy from a 50-m stretch of wavefront with 30% efficiency. What is its electrical power output?", a: "$P_{\\text{out}} = 0.30 \\times 22.1 \\times 50 = 332$ kW $\\approx 0.33$ MW. Enough to power about 250 homes." },
        { label: "(c)", q: "As these waves enter shallow water (depth $d = 2.0$ m), energy conservation requires that power per unit wavefront is conserved even as the wave slows. If the shallow-water wave speed is $v_s = \\sqrt{gd} = 4.43$ m/s (compared to $v_d = gT/(2\\pi) = 15.6$ m/s in deep water), by what factor does the wave amplitude increase?", a: "Power conservation: $P \\propto A^2 v$ (roughly). So $A_s^2 v_s = A_d^2 v_d$, giving $A_s = A_d\\sqrt{v_d/v_s} = 1.5\\sqrt{15.6/4.43} = 1.5\\sqrt{3.52} = 1.5 \\times 1.88 = 2.81$ m. The wave height nearly doubles as waves approach shore — this is why surf gets bigger near the beach." },
        { label: "(d)", q: "When the wave amplitude becomes comparable to the water depth, the wave 'breaks.' Using your answer from (c), does this wave break in 2.0 m of water? The breaking criterion is roughly $A \\gtrsim 0.4d$.", a: "The breaking criterion is $A > 0.4d = 0.4 \\times 2.0 = 0.8$ m. Our amplitude is $A_s = 2.81$ m, far exceeding 0.8 m. Yes, this wave breaks violently in 2 m of water. In reality, the wave would begin breaking in deeper water (around $d \\approx A_s/0.4 \\approx 7$ m) and much of its energy is dissipated in the surf zone." }
      ]
    }
  ]
},

"wavepackets": {
  readingQuiz: [
    { q: "What is the phase velocity of a wave?", a: "$v_p = \\omega/k$, the speed at which a single frequency component (crest) travels." },
    { q: "What is the group velocity?", a: "$v_g = d\\omega/dk$, the speed at which the envelope (and energy) of a wavepacket travels." },
    { q: "When is the group velocity equal to the phase velocity?", a: "In a non-dispersive medium, where $\\omega = vk$ is a linear function of $k$ (constant wave speed for all frequencies)." },
    { q: "What is dispersion?", a: "Dispersion occurs when the wave speed depends on frequency (or wavelength), causing different frequency components to travel at different speeds." },
    { q: "What happens to a wavepacket in a dispersive medium over time?", a: "It spreads out (broadens) because its constituent frequencies travel at different speeds." },
    { q: "What is the dispersion relation?", a: "The functional relationship $\\omega(k)$ between angular frequency and wavenumber, which contains all the information about how waves propagate in a given medium." },
    { q: "For deep-water gravity waves, $\\omega = \\sqrt{gk}$. Is the group velocity greater or less than the phase velocity?", a: "$v_p = \\omega/k = \\sqrt{g/k}$ and $v_g = d\\omega/dk = \\frac{1}{2}\\sqrt{g/k} = v_p/2$. The group velocity is half the phase velocity." },
    { q: "What determines the speed at which information or energy travels?", a: "The group velocity $v_g$, not the phase velocity, determines the speed of energy and information transport." },
    { q: "Can the phase velocity exceed the speed of light?", a: "Yes. The phase velocity can exceed $c$ without violating relativity, because phase velocity does not carry information. It is the group velocity that must satisfy $v_g \\leq c$." }
  ],
  shortAnswer: [
    { q: "For a medium with dispersion relation $\\omega = \\alpha k^2$ (where $\\alpha$ is a constant), find the phase velocity and group velocity as functions of $k$.", a: "$v_p = \\omega/k = \\alpha k$. $v_g = d\\omega/dk = 2\\alpha k$. The group velocity is twice the phase velocity. This is the dispersion relation for quantum-mechanical matter waves (with $\\alpha = \\hbar/(2m)$)." },
    { q: "Show that for a non-dispersive wave ($\\omega = vk$ with $v$ constant), a wavepacket does not spread.", a: "All Fourier components travel at the same speed $v_p = v_g = v$. The wavepacket moves at speed $v$ without changing shape, since every component maintains the same phase relationship." },
    { q: "A wavepacket in deep water has central wavelength $\\lambda_0 = 100$ m. Find the phase velocity and group velocity. ($\\omega = \\sqrt{gk}$, $g = 9.81$ m/s$^2$.)", a: "$k_0 = 2\\pi/\\lambda_0 = 2\\pi/100 = 0.0628$ rad/m. $v_p = \\sqrt{g/k_0} = \\sqrt{9.81/0.0628} = 12.5$ m/s. $v_g = v_p/2 = 6.25$ m/s." },
    { q: "A Gaussian wavepacket at $t = 0$ has spatial width $\\sigma_x$. After time $t$, its width in a dispersive medium with $\\omega = \\alpha k^2$ grows. Give a qualitative argument for why the spreading rate depends on $d^2\\omega/dk^2$.", a: "The group velocity is $v_g(k) = d\\omega/dk = 2\\alpha k$. Components with different $k$ travel at different group velocities. The spread in group velocity across the packet is $\\Delta v_g = (d^2\\omega/dk^2)\\Delta k = 2\\alpha \\Delta k$. After time $t$, the spatial spread grows by $\\Delta v_g \\cdot t$. So spreading is governed by $d^2\\omega/dk^2$ (the group velocity dispersion)." },
    { q: "In a plasma, the dispersion relation is $\\omega^2 = \\omega_p^2 + c^2 k^2$. Find $v_p$ and $v_g$ and show that $v_p v_g = c^2$.", a: "$v_p = \\omega/k = \\sqrt{\\omega_p^2/k^2 + c^2}$, which is $> c$. $v_g = d\\omega/dk = c^2 k/\\omega = c^2/v_p$. Hence $v_p v_g = c^2$. Since $v_p > c$, we get $v_g < c$, consistent with relativity." },
    { q: "Explain in physical terms why ocean swell from a distant storm arrives with long-period waves first and short-period waves later.", a: "Deep-water waves have $v_g = \\frac{1}{2}\\sqrt{g/k}$, which increases with wavelength. Longer-wavelength (longer-period) waves have larger group velocities, so they outrun the shorter waves and arrive at the coast first. The gradual arrival of progressively shorter-period waves is a direct observation of dispersion." }
  ],
  longProblems: [
    {
      title: "Dispersion of Tsunami Waves",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/US_Army_diagram_of_tsunami.jpg/300px-US_Army_diagram_of_tsunami.jpg",
      imageAlt: "Diagram showing the propagation of a tsunami wave across the ocean",
      context: "Tsunamis are ocean waves generated by undersea earthquakes. In the open ocean (depth $d \\approx 4000$ m), their wavelength ($\\lambda \\sim 200$ km) is much larger than the depth, so they behave as shallow-water waves with dispersion relation $\\omega = k\\sqrt{gd}$. Near shore, the depth decreases and more complex dispersion applies. The full deep/shallow water dispersion relation is $\\omega^2 = gk\\tanh(kd)$.",
      parts: [
        { label: "(a)", q: "Show that shallow-water waves ($kd \\ll 1$) are non-dispersive by finding $v_p$ and $v_g$ from $\\omega = k\\sqrt{gd}$.", a: "$v_p = \\omega/k = \\sqrt{gd}$. $v_g = d\\omega/dk = \\sqrt{gd}$. Both are independent of $k$ and equal to each other. Shallow-water waves are non-dispersive: all wavelengths travel at the same speed, so tsunami wavepackets maintain their shape in the open ocean." },
        { label: "(b)", q: "Calculate the speed of a tsunami in the open Pacific ($d = 4000$ m). How long would it take to cross the Pacific from Japan to California (distance $\\approx 8000$ km)?", a: "$v = \\sqrt{gd} = \\sqrt{9.81 \\times 4000} = 198$ m/s $= 713$ km/h — nearly the speed of a jet airliner! Travel time: $t = 8000/713 = 11.2$ hours." },
        { label: "(c)", q: "As the tsunami approaches shore and $d$ decreases, the wave slows. If the wave has amplitude $A_0 = 0.5$ m in the open ocean and the power per unit wavefront is conserved, find the amplitude when $d = 10$ m.", a: "Power $\\propto A^2 v \\propto A^2 \\sqrt{d}$. Conservation: $A_0^2\\sqrt{d_0} = A^2\\sqrt{d}$. $A = A_0(d_0/d)^{1/4} = 0.5(4000/10)^{1/4} = 0.5(400)^{1/4} = 0.5 \\times 4.47 = 2.24$ m. The wave amplifies dramatically as it reaches shallow water — and the wave crest steepens further due to nonlinear effects not captured here." },
        { label: "(d)", q: "In deep water ($kd \\gg 1$), $\\tanh(kd) \\to 1$, so $\\omega = \\sqrt{gk}$. A wind-generated wave with $\\lambda = 50$ m rides on top of the tsunami. Find its group velocity and compare to the tsunami's speed.", a: "$k = 2\\pi/50 = 0.126$ rad/m. $v_g = \\frac{1}{2}\\sqrt{g/k} = \\frac{1}{2}\\sqrt{9.81/0.126} = \\frac{1}{2}(8.83) = 4.41$ m/s. The tsunami travels at 198 m/s — about 45 times faster. The tsunami outruns ordinary wind waves because it 'feels' the full ocean depth (non-dispersive shallow-water regime), while short wind waves only feel the surface layer (dispersive deep-water regime)." }
      ]
    },
    {
      title: "Wavepacket Spreading of an Electron",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Double-slit_experiment_results_Tanamura_2.jpg/220px-Double-slit_experiment_results_Tanamura_2.jpg",
      imageAlt: "Build-up of an electron diffraction pattern from individual electron detections in a double-slit experiment",
      context: "In quantum mechanics, a free electron is described by a wavepacket. The de Broglie relation gives $p = \\hbar k$ and the energy-momentum relation $E = p^2/(2m)$ gives the dispersion relation $\\omega = \\hbar k^2/(2m)$. This quadratic dispersion causes wavepackets to spread over time. Consider an electron with central momentum corresponding to a kinetic energy of 100 eV.",
      parts: [
        { label: "(a)", q: "Find the de Broglie wavelength and central wavenumber $k_0$ for a 100 eV electron. ($m_e = 9.11 \\times 10^{-31}$ kg, $\\hbar = 1.055 \\times 10^{-34}$ J$\\cdot$s, $1$ eV $= 1.602 \\times 10^{-19}$ J.)", a: "$E = 100 \\times 1.602 \\times 10^{-19} = 1.602 \\times 10^{-17}$ J. $p = \\sqrt{2mE} = \\sqrt{2(9.11 \\times 10^{-31})(1.602 \\times 10^{-17})} = 5.40 \\times 10^{-24}$ kg$\\cdot$m/s. $k_0 = p/\\hbar = 5.40 \\times 10^{-24}/1.055 \\times 10^{-34} = 5.12 \\times 10^{10}$ rad/m. $\\lambda = 2\\pi/k_0 = 1.23 \\times 10^{-10}$ m $= 0.123$ nm — comparable to atomic spacings, enabling electron diffraction." },
        { label: "(b)", q: "Find the phase velocity $v_p$ and group velocity $v_g$ for this electron. How do they compare?", a: "$v_p = \\omega/k = \\hbar k/(2m) = (1.055 \\times 10^{-34})(5.12 \\times 10^{10})/(2 \\times 9.11 \\times 10^{-31}) = 2.96 \\times 10^6$ m/s. $v_g = d\\omega/dk = \\hbar k/m = 2v_p = 5.93 \\times 10^6$ m/s. The group velocity (classical particle velocity) is twice the phase velocity." },
        { label: "(c)", q: "An electron wavepacket starts with spatial width $\\sigma_0 = 1.0$ nm. The width at time $t$ is $\\sigma(t) = \\sigma_0\\sqrt{1 + (\\hbar t/(2m\\sigma_0^2))^2}$. How long does it take for the wavepacket to double in width?", a: "Set $\\sigma = 2\\sigma_0$: $4 = 1 + (\\hbar t/(2m\\sigma_0^2))^2$, so $\\hbar t/(2m\\sigma_0^2) = \\sqrt{3}$. $t = 2\\sqrt{3}m\\sigma_0^2/\\hbar = 2\\sqrt{3}(9.11 \\times 10^{-31})(10^{-9})^2/(1.055 \\times 10^{-34}) = 2(1.732)(9.11 \\times 10^{-31})(10^{-18})/(1.055 \\times 10^{-34}) = 2.99 \\times 10^{-14}$ s $\\approx 30$ femtoseconds. The wavepacket spreads incredibly quickly at atomic scales." },
        { label: "(d)", q: "Compare this to a macroscopic object: a 0.01 kg ball with $\\sigma_0 = 1.0$ mm. How long would it take for the ball's wavepacket to double in width?", a: "$t = 2\\sqrt{3}m\\sigma_0^2/\\hbar = 2\\sqrt{3}(0.01)(10^{-3})^2/(1.055 \\times 10^{-34}) = 3.46 \\times 10^{-8}/(1.055 \\times 10^{-34}) = 3.28 \\times 10^{26}$ s $\\approx 10^{19}$ years — about a billion times the age of the universe. Quantum spreading is utterly negligible for macroscopic objects." }
      ]
    },
    {
      title: "Dispersion in Optical Fibers and Data Transmission",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Optical-fibre-junction-box.jpg/300px-Optical-fibre-junction-box.jpg",
      imageAlt: "Inside of an optical fiber junction box showing bundled fiber optic cables",
      context: "In optical fibers, dispersion limits the data rate over long distances because light pulses broaden as they travel. The group velocity dispersion (GVD) parameter is $D = -(2\\pi c/\\lambda^2)(d^2 k/d\\omega^2)$, measured in ps/(nm$\\cdot$km). For standard single-mode fiber at $\\lambda = 1550$ nm, $D \\approx 17$ ps/(nm$\\cdot$km). A telecom laser emits pulses with spectral width $\\Delta\\lambda = 0.1$ nm.",
      parts: [
        { label: "(a)", q: "A pulse travels through 80 km of fiber. By how much does it broaden due to dispersion?", a: "Broadening: $\\Delta t = |D| \\cdot L \\cdot \\Delta\\lambda = 17 \\times 80 \\times 0.1 = 136$ ps. The pulse spreads by 136 picoseconds over 80 km." },
        { label: "(b)", q: "If the system transmits at 10 Gbit/s, the bit period is 100 ps. Will the 136 ps of broadening cause problems? What is the maximum fiber length for this data rate?", a: "Yes, 136 ps exceeds the 100 ps bit period, so adjacent pulses overlap (intersymbol interference), causing errors. Maximum length: $L_{\\max} = \\Delta t_{\\max}/(|D|\\Delta\\lambda) = 100/(17 \\times 0.1) = 58.8$ km. Beyond about 59 km, the data becomes unreadable without compensation." },
        { label: "(c)", q: "Dispersion-shifted fiber has $D \\approx 0$ at 1550 nm. Explain in terms of group velocity what $D = 0$ means, and why it eliminates pulse broadening.", a: "$D = 0$ means $d^2 k/d\\omega^2 = 0$, which implies the group velocity $v_g = d\\omega/dk$ is independent of frequency (to first order). All spectral components of the pulse travel at the same group velocity, so the pulse does not broaden. The dispersion relation is approximately linear near this wavelength." },
        { label: "(d)", q: "An alternative is dispersion compensation: after 80 km of standard fiber ($D = +17$), add a length $L_c$ of compensating fiber with $D_c = -100$ ps/(nm$\\cdot$km). What length of compensating fiber is needed?", a: "Total dispersion must be zero: $D \\cdot L + D_c \\cdot L_c = 0$. $L_c = -DL/D_c = -(17)(80)/(-100) = 13.6$ km. Adding 13.6 km of compensating fiber exactly cancels the accumulated dispersion, restoring the pulse to its original width." },
        { label: "(e)", q: "At 40 Gbit/s, the bit period is 25 ps. Now what is the maximum transmission distance without compensation in standard fiber?", a: "$L_{\\max} = 25/(17 \\times 0.1) = 14.7$ km. Quadrupling the data rate reduces the reach by a factor of 4. This is why high-speed long-haul telecom systems require sophisticated dispersion management." }
      ]
    }
  ]
}

};
