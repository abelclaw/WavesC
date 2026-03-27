// test-problems.js — Test tab problems for Waves course chapters
// Each chapter slug maps to { readingQuiz, shortAnswer, longProblems }

window.WAVES_TEST_PROBLEMS = {

"oscillators-linearity": {
  readingQuiz: [
    { q: "Why can nearly any potential energy minimum be approximated by a quadratic (Hooke's law) potential?", a: "Because the Taylor expansion of any smooth potential about a stable equilibrium has zero first derivative, making the quadratic term the leading non-vanishing contribution." },
    { q: "What are the three independent parameters needed to fully specify the motion of a simple harmonic oscillator?", a: "Amplitude $A$, angular frequency $\\omega_0$, and phase constant $\\phi$." },
    { q: "What is the relationship between the natural frequency $\\omega_0$ and the spring constant $k$ and mass $m$ of a simple harmonic oscillator?", a: "$\\omega_0 = \\sqrt{k/m}$." },
    { q: "In a damped oscillator described by $\\ddot{x} + \\gamma \\dot{x} + \\omega_0^2 x = 0$, what physical quantity does $\\gamma$ represent?", a: "The damping coefficient (damping rate), which characterizes the strength of the velocity-dependent resistive force per unit mass." },
    { q: "What distinguishes underdamped motion from overdamped motion?", a: "Underdamped motion ($\\gamma < 2\\omega_0$) oscillates with a decaying envelope, while overdamped motion ($\\gamma > 2\\omega_0$) returns to equilibrium exponentially without oscillating." },
    { q: "What is critical damping and why is it special?", a: "Critical damping occurs when $\\gamma = 2\\omega_0$; it is the boundary between oscillatory and non-oscillatory decay and provides the fastest return to equilibrium without overshoot." },
    { q: "What does it mean for a differential equation to be linear?", a: "If $x_1(t)$ and $x_2(t)$ are both solutions, then any linear combination $c_1 x_1(t) + c_2 x_2(t)$ is also a solution." },
    { q: "How does the total mechanical energy of an undamped SHO vary with time?", a: "It remains constant; kinetic and potential energy exchange back and forth, but their sum $E = \\frac{1}{2}m\\dot{x}^2 + \\frac{1}{2}kx^2$ is conserved." },
    { q: "Why does the period of a simple harmonic oscillator not depend on amplitude?", a: "Because the restoring force is exactly linear in displacement, so the equation of motion has solutions with frequency determined solely by $\\omega_0 = \\sqrt{k/m}$, independent of amplitude." },
    { q: "What is the general solution for an underdamped oscillator?", a: "$x(t) = A e^{-\\gamma t/2}\\cos(\\omega_1 t + \\phi)$ where $\\omega_1 = \\sqrt{\\omega_0^2 - \\gamma^2/4}$." }
  ],
  shortAnswer: [
    { q: "A particle moves in the potential $V(x) = V_0\\left(\\frac{x}{a}\\right)^2\\left(\\frac{x}{a} - 1\\right)^2$. Find the equilibrium positions and the frequency of small oscillations about each stable equilibrium.", a: "Setting $V'(x) = 0$ gives equilibria at $x = 0$, $x = a$, and $x = a/2$. The second derivative is $V''(x) = \\frac{2V_0}{a^2}$ at $x = 0$ and $x = a$ (both stable minima), and $V''(a/2) = -\\frac{V_0}{2a^2}$ (unstable). For each stable equilibrium, $\\omega_0 = \\sqrt{V''(x_{\\rm eq})/m} = \\sqrt{2V_0/(ma^2)}$." },
    { q: "Show that for an underdamped oscillator with $\\gamma \\ll \\omega_0$, the fractional energy lost per cycle is $\\Delta E / E \\approx 2\\pi\\gamma/\\omega_0$.", a: "The energy is $E(t) \\propto A^2 e^{-\\gamma t}$, so $dE/dt = -\\gamma E$. Over one period $T = 2\\pi/\\omega_1 \\approx 2\\pi/\\omega_0$, the fractional loss is $\\Delta E/E = 1 - e^{-\\gamma T} \\approx \\gamma T = 2\\pi\\gamma/\\omega_0$." },
    { q: "A 0.5 kg mass on a spring ($k = 200$ N/m) is released from rest at $x = 0.1$ m. Write the complete solution $x(t)$ and find the maximum speed.", a: "Here $\\omega_0 = \\sqrt{200/0.5} = 20$ rad/s. Initial conditions $x(0) = 0.1$ m, $\\dot{x}(0) = 0$ give $x(t) = 0.1\\cos(20t)$ m. The maximum speed is $v_{\\max} = A\\omega_0 = 0.1 \\times 20 = 2.0$ m/s." },
    { q: "An overdamped system has $\\omega_0 = 3$ rad/s and $\\gamma = 10$ s$^{-1}$. If $x(0) = 1$ m and $\\dot{x}(0) = 0$, find $x(t)$.", a: "The exponents are $r_{\\pm} = -\\gamma/2 \\pm \\sqrt{\\gamma^2/4 - \\omega_0^2} = -5 \\pm 4$, giving $r_+ = -1$, $r_- = -9$. From initial conditions: $x(t) = c_1 e^{-t} + c_2 e^{-9t}$ with $c_1 + c_2 = 1$ and $-c_1 - 9c_2 = 0$, so $c_1 = 9/8$, $c_2 = -1/8$. Thus $x(t) = \\frac{9}{8}e^{-t} - \\frac{1}{8}e^{-9t}$." },
    { q: "Prove that the time-averaged kinetic energy equals the time-averaged potential energy for an undamped SHO.", a: "With $x = A\\cos(\\omega_0 t + \\phi)$: $\\langle KE \\rangle = \\frac{1}{2}m\\omega_0^2 A^2 \\langle \\sin^2(\\omega_0 t + \\phi)\\rangle = \\frac{1}{4}m\\omega_0^2 A^2$. Similarly $\\langle PE \\rangle = \\frac{1}{2}k A^2 \\langle \\cos^2(\\omega_0 t + \\phi)\\rangle = \\frac{1}{4}kA^2 = \\frac{1}{4}m\\omega_0^2 A^2$. So $\\langle KE\\rangle = \\langle PE \\rangle$." },
    { q: "A damped oscillator loses 5% of its energy each cycle. Estimate the quality factor $Q$.", a: "The fractional energy loss per cycle is $\\Delta E/E = 2\\pi/Q$, so $Q = 2\\pi/(\\Delta E/E) = 2\\pi/0.05 \\approx 126$." }
  ],
  longProblems: [
    {
      title: "Seismometer as a Damped Harmonic Oscillator",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Kinemetrics_seismograph.jpg/640px-Kinemetrics_seismograph.jpg",
      imageAlt: "A USGS broadband seismometer instrument used to detect ground motion",
      context: "A seismometer works by suspending a mass on a spring inside a housing attached to the ground. When an earthquake shakes the ground, the housing moves but the mass tends to stay still due to inertia. The relative displacement between mass and housing is recorded. A typical broadband seismometer has a 1.0 kg proof mass, a restoring spring constant of $k = 40$ N/m, and a damping coefficient chosen to optimize transient response.",
      parts: [
        { label: "(a)", q: "Find the natural frequency $\\omega_0$ and natural period $T_0$ of this seismometer.", a: "$\\omega_0 = \\sqrt{k/m} = \\sqrt{40/1.0} = 6.32$ rad/s. The period is $T_0 = 2\\pi/\\omega_0 = 2\\pi/6.32 \\approx 0.99$ s." },
        { label: "(b)", q: "Engineers want the seismometer to be critically damped so it returns to equilibrium quickly after a transient pulse without ringing. What damping constant $b$ (in the force $F = -b\\dot{x}$) is required?", a: "Critical damping requires $\\gamma = 2\\omega_0$, where $\\gamma = b/m$. So $b = 2m\\omega_0 = 2(1.0)(6.32) = 12.6$ kg/s." },
        { label: "(c)", q: "In practice, seismometers are slightly underdamped with $b = 11.0$ kg/s. Find the damped oscillation frequency $\\omega_1$ and the $1/e$ decay time of the amplitude.", a: "$\\gamma = b/m = 11.0$ s$^{-1}$. $\\omega_1 = \\sqrt{\\omega_0^2 - \\gamma^2/4} = \\sqrt{40 - 30.25} = \\sqrt{9.75} = 3.12$ rad/s. The amplitude decays as $e^{-\\gamma t/2}$, so the $1/e$ time is $\\tau = 2/\\gamma = 2/11.0 = 0.182$ s." },
        { label: "(d)", q: "If the seismometer mass is displaced 2.0 mm and released from rest, write the complete solution $x(t)$ using the damping from part (c). How many oscillations occur before the amplitude drops below 0.1 mm?", a: "With $x(0) = 2.0$ mm and $\\dot{x}(0) = 0$: $x(t) = 2.0\\,e^{-5.5t}\\left(\\cos(3.12t) + 1.76\\sin(3.12t)\\right)$ mm. The amplitude envelope decays as $\\sim 2.0\\,e^{-5.5t}$ mm. Setting $2.0\\,e^{-5.5t} = 0.1$: $t = \\ln(20)/5.5 = 0.54$ s. Number of cycles $= 0.54 \\times 3.12/(2\\pi) \\approx 0.27$. The system is so heavily damped that it settles in less than one full oscillation." }
      ]
    },
    {
      title: "Atomic Force Microscope Cantilever",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Aatomj%C3%B5umikroskoobi_otsik.jpg/640px-Aatomj%C3%B5umikroskoobi_otsik.jpg",
      imageAlt: "Electron microscope image of an AFM cantilever tip used for nanoscale surface imaging",
      context: "An atomic force microscope (AFM) uses a tiny silicon cantilever with a sharp tip to scan surfaces at the nanometer scale. The cantilever acts as a spring-mass system. A typical AFM cantilever has an effective mass of $m = 10^{-11}$ kg and spring constant $k = 1.0$ N/m.",
      parts: [
        { label: "(a)", q: "Calculate the resonant frequency of this cantilever in Hz. Why is such a high frequency advantageous for scanning?", a: "$\\omega_0 = \\sqrt{k/m} = \\sqrt{1.0/10^{-11}} \\approx 3.16 \\times 10^5$ rad/s. $f_0 \\approx 50.3$ kHz. A high resonant frequency means the cantilever responds to force changes much faster than the scanning speed, allowing rapid imaging." },
        { label: "(b)", q: "The cantilever oscillates with an amplitude of 10 nm. What is its maximum speed and maximum acceleration? Compare the acceleration to $g$.", a: "$v_{\\max} = A\\omega_0 = (10^{-8})(3.16 \\times 10^5) = 3.16 \\times 10^{-3}$ m/s. $a_{\\max} = A\\omega_0^2 = (10^{-8})(10^{11}) = 10^3$ m/s$^2 \\approx 100g$." },
        { label: "(c)", q: "In liquid environments, the cantilever has quality factor $Q = 5$. Find the damping coefficient $\\gamma$ and the damped frequency $\\omega_1$.", a: "$\\gamma = \\omega_0/Q = 3.16 \\times 10^5/5 = 6.32 \\times 10^4$ s$^{-1}$. $\\omega_1 = \\omega_0\\sqrt{1 - 1/(4Q^2)} \\approx 0.995\\omega_0 \\approx 3.14 \\times 10^5$ rad/s." },
        { label: "(d)", q: "The thermal energy $\\frac{1}{2}k_B T$ drives random oscillations at room temperature ($T = 300$ K). Estimate the RMS thermal amplitude using $\\frac{1}{2}k\\langle x^2\\rangle = \\frac{1}{2}k_B T$.", a: "$x_{\\rm rms} = \\sqrt{k_B T/k} = \\sqrt{(1.38 \\times 10^{-23})(300)/1.0} = 6.4 \\times 10^{-11}$ m $= 0.064$ nm. This is smaller than typical atomic diameters ($\\sim 0.2$ nm), so thermal noise is small but not negligible for atomic-resolution imaging." }
      ]
    },
    {
      title: "Vehicle Suspension System",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/38/The_spring_and_shock_absorber_hook-up_on_the_rear_wheel_of_the_1938_Buick_chassis.jpg",
      imageAlt: "Automobile coil spring and shock absorber suspension assembly",
      context: "A car's suspension must absorb road bumps while keeping the ride comfortable. Each wheel assembly can be modeled as a mass on a spring with a dashpot. For one corner of a 1600 kg sedan, the sprung mass is 400 kg and the suspension spring constant is $k = 20{,}000$ N/m.",
      parts: [
        { label: "(a)", q: "Find the natural oscillation frequency and period.", a: "$\\omega_0 = \\sqrt{20000/400} = 7.07$ rad/s. $f_0 = 1.13$ Hz, $T_0 = 0.89$ s. This matches the roughly 1 Hz bounce you feel when pushing down on a car fender." },
        { label: "(b)", q: "Calculate the required shock absorber damping constant $b$ for damping ratio $\\zeta = 0.3$.", a: "$b = 2m\\omega_0\\zeta = 2(400)(7.07)(0.3) = 1700$ kg/s. Since $\\zeta < 1$, the system is underdamped." },
        { label: "(c)", q: "The car hits a bump giving an initial velocity of $\\dot{x}(0) = 0.5$ m/s with $x(0) = 0$. Find the maximum compression.", a: "With $\\omega_1 = 6.74$ rad/s and $\\gamma/2 = 2.12$ s$^{-1}$: $x(t) = 0.0742\\,e^{-2.12t}\\sin(6.74t)$ m. Maximum at $t = 0.188$ s: $x_{\\max} \\approx 4.8$ cm." },
        { label: "(d)", q: "How many oscillation cycles for the bounce amplitude to decay to 10% of its initial value?", a: "$e^{-\\zeta\\omega_0 t} = 0.1$ gives $t = 1.086$ s. Number of cycles $= t \\cdot f_1 = 1.086 \\times 1.073 = 1.16$. The amplitude drops to 10% in just over one oscillation." }
      ]
    }
  ]
},

"driven-oscillators": {
  readingQuiz: [
    { q: "What is the difference between the transient and steady-state response of a driven oscillator?", a: "The transient response decays exponentially due to damping, while the steady-state response oscillates at the driving frequency and persists indefinitely." },
    { q: "At what driving frequency does the amplitude reach its maximum?", a: "For a lightly damped system, amplitude resonance occurs at $\\omega_r = \\sqrt{\\omega_0^2 - \\gamma^2/2}$, close to $\\omega_0$ when damping is small." },
    { q: "What is the phase lag between the driving force and displacement at resonance ($\\omega = \\omega_0$)?", a: "The phase lag is $\\pi/2$ (90 degrees); the displacement lags the driving force by a quarter cycle." },
    { q: "What happens to the phase lag as the driving frequency sweeps from below to above $\\omega_0$?", a: "It increases from approximately $0$ through $\\pi/2$ at resonance to approximately $\\pi$ well above resonance." },
    { q: "What does the quality factor $Q$ represent for a driven oscillator?", a: "$Q = \\omega_0/\\gamma$ characterizes the sharpness of the resonance peak; higher $Q$ means a narrower, taller resonance." },
    { q: "At what frequency is the power absorbed from the driving force maximized?", a: "Power absorption is maximized exactly at $\\omega = \\omega_0$, regardless of damping level." },
    { q: "What is mechanical impedance?", a: "The ratio of driving force amplitude to velocity amplitude, $Z = F_0/v_0$, analogous to electrical impedance." },
    { q: "What is the FWHM of the power resonance curve in terms of $Q$?", a: "The FWHM is $\\Delta\\omega = \\omega_0/Q = \\gamma$." },
    { q: "In steady state, where does all the energy input from the driving force go?", a: "All energy is dissipated by damping; the time-averaged stored energy remains constant." }
  ],
  shortAnswer: [
    { q: "Derive the steady-state amplitude $A(\\omega)$ for $\\ddot{x} + \\gamma\\dot{x} + \\omega_0^2 x = (F_0/m)\\cos(\\omega t)$.", a: "$A(\\omega) = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + \\gamma^2\\omega^2}}$." },
    { q: "Show that the time-averaged power absorbed is $\\langle P \\rangle = \\frac{F_0^2 \\gamma \\omega^2}{2m\\left[(\\omega_0^2-\\omega^2)^2 + \\gamma^2\\omega^2\\right]}$.", a: "$\\langle P\\rangle = \\frac{1}{2}F_0 A\\omega\\sin\\delta$. Using $\\sin\\delta = \\gamma\\omega/\\sqrt{(\\omega_0^2-\\omega^2)^2+\\gamma^2\\omega^2}$ and the expression for $A$ gives the stated result." },
    { q: "A tuning fork ($f_0 = 440$ Hz, $Q = 2000$) is driven at 441 Hz. What is the steady-state amplitude relative to the resonance amplitude?", a: "With $\\gamma = \\omega_0/Q = 1.382$ s$^{-1}$ and $|\\omega_0^2-\\omega^2| \\approx 2\\omega_0(2\\pi) = 5529$ rad$^2$/s$^2$: $A/A_{\\rm res} \\approx 3821/6721 \\approx 0.57$." },
    { q: "Derive the phase angle $\\delta(\\omega)$ of the steady-state response.", a: "$\\delta = \\arctan\\!\\left(\\frac{\\gamma\\omega}{\\omega_0^2 - \\omega^2}\\right)$. For $\\omega < \\omega_0$, $\\delta < \\pi/2$; at $\\omega = \\omega_0$, $\\delta = \\pi/2$; for $\\omega > \\omega_0$, $\\delta > \\pi/2$." },
    { q: "An oscillator with $Q = 50$ and $\\omega_0 = 100$ rad/s is driven from rest. Estimate how long the transient takes to become negligible.", a: "The decay time constant is $\\tau = 2/\\gamma = 2Q/\\omega_0 = 1$ s. After about $5\\tau = 5$ s, the transient is reduced by $e^{-5} \\approx 0.007$." },
    { q: "What is the mechanical impedance of a damped harmonic oscillator? At what frequency is it purely real?", a: "$Z(\\omega) = b + i(m\\omega - k/\\omega)$. It is purely real at $\\omega = \\omega_0$, where $Z = b = m\\gamma$." }
  ],
  longProblems: [
    {
      title: "Taipei 101 Tuned Mass Damper",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Taipei_101_Tuned_Mass_Damper_2010.jpg/640px-Taipei_101_Tuned_Mass_Damper_2010.jpg",
      imageAlt: "The 730-tonne tuned mass damper sphere suspended inside Taipei 101 skyscraper",
      context: "Taipei 101 contains a 730-tonne steel sphere suspended from cables near the top. This tuned mass damper swings out of phase with wind- or earthquake-induced building oscillations, reducing sway by up to 40%. The building's fundamental sway period is about 7 seconds.",
      parts: [
        { label: "(a)", q: "Model the building as a driven oscillator with $M = 2 \\times 10^8$ kg, $K = 1.6 \\times 10^8$ N/m, $Q = 15$. Find $\\omega_0$, $\\gamma$, and the resonance sway amplitude for typhoon force $F_0 = 5 \\times 10^7$ N.", a: "$\\omega_0 = \\sqrt{0.8} = 0.894$ rad/s ($T = 7.03$ s). $\\gamma = 0.0596$ s$^{-1}$. $A_{\\rm res} = F_0/(M\\gamma\\omega_0) = 4.69$ m." },
        { label: "(b)", q: "The TMD raises the effective damping to $Q \\approx 8$. Find the new resonance amplitude and percentage reduction.", a: "New $A_{\\rm res} = 2.50$ m. Reduction: $(4.69 - 2.50)/4.69 = 46.7\\%$." },
        { label: "(c)", q: "During Typhoon Soudelor the TMD swung 1.0 m. What was the peak velocity and kinetic energy of the 730-tonne sphere?", a: "$v_{\\max} = 1.0 \\times 0.894 = 0.894$ m/s. $KE_{\\max} = \\frac{1}{2}(730{,}000)(0.894)^2 \\approx 290$ kJ." },
        { label: "(d)", q: "Why must the TMD be tuned to the building's sway frequency? What if it were 20% too high?", a: "The TMD works by absorbing energy at the building's resonance frequency, with 90° phase lag providing effective damping. If 20% off-tune, the phase relationship shifts, reducing effective damping from ~40% sway reduction to perhaps 5-10%." }
      ]
    },
    {
      title: "Quartz Crystal Oscillator in a Watch",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Crystal_oscillator_internals.JPG",
      imageAlt: "Inside view of a quartz crystal resonator showing the tuning-fork shaped quartz element",
      context: "A quartz wristwatch uses a tuning-fork-shaped crystal vibrating at exactly 32,768 Hz. The crystal's extremely high $Q \\approx 10^5$ gives remarkable frequency selectivity, accurate to within seconds per month.",
      parts: [
        { label: "(a)", q: "Calculate $\\gamma$ and the FWHM bandwidth $\\Delta f$.", a: "$\\gamma = \\omega_0/Q = 2.059$ rad/s. $\\Delta f = f_0/Q = 0.328$ Hz." },
        { label: "(b)", q: "How long does the transient last after power-on? How many cycles during the transient?", a: "$\\tau = 2/\\gamma = 0.971$ s. About $3\\tau \\approx 2.9$ s, during which $N \\approx 95{,}000$ cycles occur." },
        { label: "(c)", q: "The frequency shifts with temperature: $\\Delta f/f_0 \\approx -0.04 \\times 10^{-6}(T - 25)^2$ per $°$C$^2$. How many seconds per day does it lose at $0°$C?", a: "$\\Delta f/f_0 = -25 \\times 10^{-6}$ (25 ppm slow). Loss: $25 \\times 10^{-6} \\times 86400 \\approx 2.2$ s/day." },
        { label: "(d)", q: "If the drive frequency drifts to $\\omega = \\omega_0 + \\gamma/2$, by what factor does amplitude drop and what is the phase lag?", a: "Amplitude drops by $1/\\sqrt{2}$ (half-power point). Phase lag is $3\\pi/4$ (135°)." }
      ]
    },
    {
      title: "MRI Radiofrequency Excitation of Proton Spins",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/MRI_head_side.jpg/480px-MRI_head_side.jpg",
      imageAlt: "MRI scan showing a sagittal cross-section of a human head",
      context: "In MRI, hydrogen protons precess around the magnetic field $B_0$ at the Larmor frequency $f_L = \\gamma_p B_0/(2\\pi)$, where $\\gamma_p = 2.675 \\times 10^8$ rad/(s·T). An oscillating RF field drives these spins at resonance. A clinical scanner uses $B_0 = 3.0$ T.",
      parts: [
        { label: "(a)", q: "Calculate the Larmor frequency at 3.0 T. What part of the EM spectrum is this?", a: "$f_L = 127.7$ MHz, in the VHF radio band (similar to FM radio)." },
        { label: "(b)", q: "Brain white matter has $T_2 = 80$ ms. Find the effective $Q$ and linewidth $\\Delta f$.", a: "$Q = 2\\pi f_L T_2 = 6.42 \\times 10^7$. $\\Delta f = 1/(\\pi T_2) = 3.98$ Hz." },
        { label: "(c)", q: "If the field varies by 1 ppm across a voxel, what additional linewidth broadening occurs?", a: "$\\Delta f_{\\rm inhom} = f_L \\times 10^{-6} = 127.7$ Hz, about 30 times the natural linewidth." },
        { label: "(d)", q: "With a gradient $G_x = 10$ mT/m, how far apart must two points be for their frequencies to differ by the natural linewidth?", a: "$\\Delta x = 2\\pi\\Delta f/(\\gamma_p G_x) = 9.4\\;\\mu$m, far finer than the typical 1 mm clinical resolution." }
      ]
    }
  ]
},

"coupled-oscillators": {
  readingQuiz: [
    { q: "What is a normal mode of a coupled oscillator system?", a: "A pattern of motion in which all parts oscillate at the same frequency with fixed phase relationships." },
    { q: "How many normal modes does a system of $N$ coupled oscillators have?", a: "Exactly $N$ normal modes." },
    { q: "For two identical coupled masses, describe the symmetric and antisymmetric modes.", a: "Symmetric: both masses move in the same direction. Antisymmetric: they move in opposite directions." },
    { q: "Which mode has higher frequency: symmetric or antisymmetric?", a: "Antisymmetric, because the coupling spring adds restoring force." },
    { q: "What phenomenon occurs when one mass is displaced and released in a two-mass coupled system?", a: "Beats: energy transfers back and forth at $\\omega_{\\rm beat} = |\\omega_2 - \\omega_1|$." },
    { q: "How is finding normal modes related to an eigenvalue problem?", a: "The equations of motion become $\\mathbf{K}\\vec{x} = \\omega^2 \\mathbf{M}\\vec{x}$; normal mode frequencies are eigenvalues and mode shapes are eigenvectors." },
    { q: "Can any motion be expressed in terms of normal modes?", a: "Yes, any motion is a linear superposition of normal modes since they form a complete set." },
    { q: "What happens to normal mode frequencies if the coupling spring is stiffened?", a: "The antisymmetric mode frequency increases; the symmetric mode frequency is unchanged." }
  ],
  shortAnswer: [
    { q: "Two identical masses connected by three identical springs (both ends fixed). Find the normal mode frequencies.", a: "$\\omega_1 = \\sqrt{k/m}$ (symmetric) and $\\omega_2 = \\sqrt{3k/m}$ (antisymmetric)." },
    { q: "Normal mode frequencies $\\omega_1 = 10$, $\\omega_2 = 12$ rad/s. One mass displaced and released. Find the beat frequency and period.", a: "$\\omega_{\\rm beat} = 2$ rad/s, $T_{\\rm beat} = \\pi$ s. Energy transfers completely every $T_{\\rm beat}/2 = 1.57$ s." },
    { q: "Write the general solution for two identical coupled oscillators in terms of normal coordinates.", a: "$q_1 = (x_1+x_2)/2$ with $\\omega_1 = \\sqrt{k/m}$; $q_2 = (x_1-x_2)/2$ with $\\omega_2 = \\sqrt{(k+2k_c)/m}$. Then $x_{1,2}(t) = A_1\\cos(\\omega_1 t+\\phi_1) \\pm A_2\\cos(\\omega_2 t+\\phi_2)$." },
    { q: "Why do three masses on a ring have a zero-frequency mode?", a: "All masses can translate together without stretching any springs; no restoring force means $\\omega = 0$." },
    { q: "Find normal mode frequencies for two pendulums of length $L$ coupled by a spring $k_c$ at their bobs.", a: "$\\omega_1 = \\sqrt{g/L}$ (symmetric); $\\omega_2 = \\sqrt{g/L + 2k_c/m}$ (antisymmetric)." }
  ],
  longProblems: [
    {
      title: "CO$_2$ Molecular Vibrations",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Carbon_dioxide_3D_ball.png/640px-Carbon_dioxide_3D_ball.png",
      imageAlt: "Ball-and-stick 3D model of carbon dioxide molecule",
      context: "CO$_2$ is a linear triatomic molecule: O=C=O, with $m_C = 12$ u, $m_O = 16$ u, and C=O bond spring constant $k \\approx 1600$ N/m. Its vibrational modes cause infrared absorption, making it a greenhouse gas.",
      parts: [
        { label: "(a)", q: "Set up the equations of motion for longitudinal vibrations of the three atoms.", a: "$M\\ddot{x}_1 = -k(x_1-x_2)$, $m\\ddot{x}_2 = k(x_1-2x_2+x_3)$, $M\\ddot{x}_3 = -k(x_3-x_2)$." },
        { label: "(b)", q: "Find the three normal mode frequencies and describe each mode.", a: "Translation: $\\omega = 0$ (all atoms move together). Symmetric stretch ($\\omega_s = \\sqrt{k/M}$): oxygens move apart, carbon stationary. Antisymmetric stretch ($\\omega_a = \\sqrt{k(m+2M)/(mM)}$): one bond stretches while the other compresses. Ratio $\\omega_a/\\omega_s = \\sqrt{(m+2M)/m} = \\sqrt{11/3} = 1.91$." },
        { label: "(c)", q: "Measured frequencies: symmetric $\\bar{\\nu} = 1388$ cm$^{-1}$, antisymmetric $\\bar{\\nu} = 2349$ cm$^{-1}$. Compare the ratio with theory.", a: "Measured ratio $= 7.05/4.16 = 1.69$ vs theory $1.91$. The discrepancy arises from anharmonicity in real bonds." },
        { label: "(d)", q: "Why is the symmetric stretch IR-inactive while the antisymmetric stretch is IR-active?", a: "In the symmetric stretch, the two bond dipoles change symmetrically and cancel, so the net dipole moment stays zero. In the antisymmetric stretch, one bond lengthens while the other shortens, creating an oscillating dipole that couples to IR radiation." }
      ]
    },
    {
      title: "Wilberforce Pendulum: Coupled Translation and Rotation",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Wilberforce_Pendulum.jpg/640px-The_Wilberforce_Pendulum.jpg",
      imageAlt: "Diagram of a Wilberforce pendulum showing coupled vertical and torsional motion",
      context: "A Wilberforce pendulum has a mass on a helical spring exhibiting coupling between vertical bouncing and twisting. When tuned so both frequencies match, energy transfers dramatically between modes.",
      parts: [
        { label: "(a)", q: "Write the coupled equations $m\\ddot{z} = -k_z z - \\epsilon\\theta$, $I\\ddot{\\theta} = -k_\\theta\\theta - \\epsilon z$ as a matrix eigenvalue problem.", a: "$\\omega^2\\begin{pmatrix}m & 0\\\\0 & I\\end{pmatrix}\\begin{pmatrix}Z\\\\\\Theta\\end{pmatrix} = \\begin{pmatrix}k_z & \\epsilon\\\\\\epsilon & k_\\theta\\end{pmatrix}\\begin{pmatrix}Z\\\\\\Theta\\end{pmatrix}$." },
        { label: "(b)", q: "For the tuned case $k_z/m = k_\\theta/I = \\omega_0^2 = 100$ with $\\epsilon = 5 \\times 10^{-3}$ N/rad, $m = 0.5$ kg, $I = 10^{-4}$ kg·m$^2$, find the normal mode frequencies.", a: "$\\omega_{\\pm}^2 = 100 \\mp \\epsilon/\\sqrt{mI} = 100 \\mp 0.707$. $\\omega_+ = 9.965$ rad/s, $\\omega_- = 10.035$ rad/s." },
        { label: "(c)", q: "Starting with pure vertical displacement, find the beat period.", a: "$\\Delta\\omega = 0.070$ rad/s. $T_{\\rm beat} = 2\\pi/0.070 = 89.8$ s. Energy transfers from vertical to torsional every ~45 s." },
        { label: "(d)", q: "If slightly detuned ($k_z/m = 100$, $k_\\theta/I = 102$), does complete energy transfer still occur?", a: "No. With detuning, only about $\\epsilon^2/(mI\\delta^2+\\epsilon^2) = 1/3$ of the energy transfers. The beats are faster ($T_{\\rm beat} = 51.5$ s) but incomplete." }
      ]
    },
    {
      title: "Coupled Piano Strings and the Two-Stage Decay",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Steinway_grand_piano_interior.JPG/640px-Steinway_grand_piano_interior.JPG",
      imageAlt: "Interior of a Steinway grand piano showing strings and hammers",
      context: "Most piano notes have two or three strings tuned to the same pitch, coupled through the bridge. This coupling produces the piano's characteristic two-stage decay: a loud initial sound that fades quickly, followed by a quieter sustained tone.",
      parts: [
        { label: "(a)", q: "Two strings at 440 Hz are coupled with normal mode frequencies $f_1 = 439.5$ Hz and $f_2 = 440.5$ Hz. What is the beat frequency and how does it relate to the two-stage decay?", a: "$f_{\\rm beat} = 1.0$ Hz. The antisymmetric mode radiates quickly through the bridge (loud, fast decay). The symmetric mode radiates weakly (quiet, slow decay)." },
        { label: "(b)", q: "Calculate the coupling constant $k_c$ if each string has effective mass $m = 3 \\times 10^{-3}$ kg.", a: "$k_c = m(\\omega_2^2-\\omega_1^2)/4 = (3 \\times 10^{-3})(34{,}719)/4 = 26.0$ N/m, about 0.1% of the string spring constant." },
        { label: "(c)", q: "When strings are tuned to unison, what are the actual sounding frequencies with coupling?", a: "The average frequency is still 440 Hz (to excellent approximation). The 1 Hz splitting is below the ~3 Hz perception threshold for separate pitches." },
        { label: "(d)", q: "With the sustain pedal down (all dampers lifted), why does the sound become richer?", a: "Strings whose natural frequencies match harmonics of the played note vibrate sympathetically. This network of coupled oscillators adds extra partials, enriching the timbre." }
      ]
    }
  ]
},

"oscillators-to-waves": {
  readingQuiz: [
    { q: "What is a dispersion relation?", a: "$\\omega(k)$ gives angular frequency as a function of wavenumber, describing how different wavelengths propagate." },
    { q: "What is the dispersion relation for a monatomic chain?", a: "$\\omega = 2\\sqrt{k/m}\\,|\\sin(ka/2)|$." },
    { q: "What is the maximum frequency on a discrete chain, and what wavelength does it correspond to?", a: "$\\omega_{\\max} = 2\\sqrt{k/m}$, at $\\lambda_{\\min} = 2a$ where adjacent masses move oppositely." },
    { q: "How does phase velocity behave in the long-wavelength limit?", a: "$v_p \\to a\\sqrt{k/m}$, a constant, so there is no dispersion." },
    { q: "What is the continuum limit and when is it valid?", a: "Replacing the discrete chain with a continuous medium, valid when $\\lambda \\gg a$." },
    { q: "Write the 1D wave equation and identify the wave speed.", a: "$\\partial^2 y/\\partial t^2 = v^2 \\partial^2 y/\\partial x^2$, with $v = a\\sqrt{k/m}$ or $v = \\sqrt{T/\\mu}$ for a string." },
    { q: "What is the difference between phase velocity and group velocity?", a: "$v_p = \\omega/k$ is the speed of crests; $v_g = d\\omega/dk$ is the speed of the wave packet and energy." },
    { q: "Is the discrete chain dispersive?", a: "Yes, $\\omega$ is not proportional to $k$ (except at long wavelengths), so different wavelengths travel at different speeds." },
    { q: "What boundary condition leads to quantized wavenumbers?", a: "Fixed ends require $\\sin(kL) = 0$, giving $k_n = n\\pi/L$." }
  ],
  shortAnswer: [
    { q: "Derive the dispersion relation by substituting $x_n = Ae^{i(kna-\\omega t)}$ into the equation of motion.", a: "$-m\\omega^2 = k(2\\cos(ka)-2)$, giving $\\omega^2 = \\frac{4k}{m}\\sin^2(ka/2)$." },
    { q: "Show that the continuum limit yields the wave equation.", a: "Taylor expanding $x_{n\\pm 1}$: $x_{n+1}-2x_n+x_{n-1} = a^2\\partial^2 u/\\partial x^2$. The equation becomes $\\partial^2 u/\\partial t^2 = (ka^2/m)\\partial^2 u/\\partial x^2$." },
    { q: "For a chain with $a = 3\\AA$, $m = 4 \\times 10^{-26}$ kg, $k = 20$ N/m: find $\\omega_{\\max}$, speed of sound, and $\\lambda_{\\min}$.", a: "$\\omega_{\\max} = 4.47 \\times 10^{13}$ rad/s. $v = 6710$ m/s. $\\lambda_{\\min} = 6\\AA$." },
    { q: "Calculate time-averaged KE and PE per unit length for a traveling wave on a string.", a: "$\\langle KE\\rangle = \\langle PE\\rangle = \\frac{1}{4}\\mu\\omega^2 A^2$ per unit length (equipartition)." },
    { q: "Find $v_g$ for the monatomic chain and show $v_g \\leq v_p$.", a: "$v_g = a\\sqrt{k/m}\\cos(ka/2)$. Since $\\tan\\theta \\geq \\theta$, we get $v_g/v_p = (ka/2)/\\tan(ka/2) \\leq 1$." }
  ],
  longProblems: [
    {
      title: "Seismic Waves Through Earth's Interior",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Earth_poster.svg/480px-Earth_poster.svg.png",
      imageAlt: "Cross-section of Earth showing crust, mantle, outer core, and inner core",
      context: "Seismic waves reveal Earth's layered structure. P-waves (longitudinal) travel through solids and liquids; S-waves (transverse) travel only through solids. In crustal rock: $v_P = 6.0$ km/s, $\\rho = 2700$ kg/m$^3$.",
      parts: [
        { label: "(a)", q: "Given $v_P = 6.0$ km/s and $v_S = 3.5$ km/s, find the bulk modulus $K$ and shear modulus $G$.", a: "$G = \\rho v_S^2 = 33.1$ GPa. $K = \\rho v_P^2 - 4G/3 = 53.1$ GPa." },
        { label: "(b)", q: "Model the crust as blocks of size $a = 1$ km. At what frequency does the model deviate from continuum?", a: "When $\\lambda < 10a = 10$ km, i.e., $f > v/(10a) = 0.6$ Hz." },
        { label: "(c)", q: "An earthquake is 1000 km away. How much sooner does the P-wave arrive?", a: "$\\Delta t = d(1/v_S - 1/v_P) = 119$ s $\\approx 2$ minutes. This is the basis of seismological distance measurement." },
        { label: "(d)", q: "At the core-mantle boundary, $v_P$ drops from 13.7 to 8.1 km/s and $v_S$ drops to zero. What does $v_S = 0$ tell us? Find the P-wave refraction angle for 30° incidence.", a: "$v_S = 0$ means the outer core is liquid ($G = 0$). Snell's law: $\\sin\\theta_t = 8.1\\sin 30°/13.7 = 0.296$, giving $\\theta_t = 17.2°$." }
      ]
    },
    {
      title: "Diatomic Chain and Optical Phonons in Salt Crystals",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Sodium_chloride_crystal.jpg/640px-Sodium_chloride_crystal.jpg",
      imageAlt: "A clear cubic sodium chloride crystal",
      context: "In NaCl, alternating Na$^+$ ($m = 23$ u) and Cl$^-$ ($M = 35$ u) create a diatomic chain with acoustic and optical branches. The optical branch couples to infrared light, explaining why NaCl absorbs IR radiation.",
      parts: [
        { label: "(a)", q: "Derive the dispersion relation for the diatomic chain.", a: "Substituting traveling waves into the coupled equations gives $(2k-m\\omega^2)(2k-M\\omega^2) = 4k^2\\cos^2(ka/2)$, yielding two branches." },
        { label: "(b)", q: "Find frequencies at $k = 0$ and $k = \\pi/a$ using $k = 20$ N/m.", a: "At $k=0$: acoustic $\\omega_A = 0$, optical $\\omega_O = \\sqrt{2k/\\mu} = 4.17 \\times 10^{13}$ rad/s. At $k = \\pi/a$: $\\omega_A = \\sqrt{2k/M}$, $\\omega_O = \\sqrt{2k/m}$. There is a frequency gap between branches." },
        { label: "(c)", q: "Describe the optical mode at $k = 0$. Why is it IR-active?", a: "Adjacent Na$^+$ and Cl$^-$ ions move in opposite directions, creating an oscillating electric dipole that couples to EM radiation. The absorption occurs at $\\lambda \\approx 45\\;\\mu$m (far IR)." },
        { label: "(d)", q: "Why is NaCl transparent to visible light but opaque in the far IR?", a: "Visible light ($f \\sim 5 \\times 10^{14}$ Hz) is far above phonon frequencies and doesn't couple. IR near the optical phonon frequency resonantly excites phonons and is absorbed." }
      ]
    },
    {
      title: "Gravity-Capillary Waves on Water",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/2006-01-14_Surface_waves.jpg/640px-2006-01-14_Surface_waves.jpg",
      imageAlt: "Capillary ripple waves on a water surface",
      context: "Deep water waves have dispersion relation $\\omega^2 = gk + (\\sigma/\\rho)k^3$, combining gravity ($g = 9.8$ m/s$^2$) and surface tension ($\\sigma = 0.073$ N/m, $\\rho = 1000$ kg/m$^3$).",
      parts: [
        { label: "(a)", q: "Find the crossover wavelength where gravity and capillary terms are equal.", a: "$\\lambda_c = 2\\pi/k_c = 1.72$ cm. Phase velocity at crossover: $v_p = 0.231$ m/s (the minimum)." },
        { label: "(b)", q: "Find phase and group velocities for $\\lambda = 100$ m (ocean swell) and $\\lambda = 3$ mm (ripples).", a: "Ocean swell: $v_p = 12.5$ m/s, $v_g = v_p/2 = 6.25$ m/s. Ripples: $v_p = 0.397$ m/s, $v_g = 3v_p/2 = 0.596$ m/s." },
        { label: "(c)", q: "When a stone is thrown into a pond, why are long waves on the outside and capillary ripples on the inside?", a: "For gravity waves, $v_g$ increases with $\\lambda$, so long waves lead. For capillary waves, $v_g$ increases with $k$, so short waves also travel fast. The minimum group velocity at $\\lambda_c$ creates a trailing edge." },
        { label: "(d)", q: "A tsunami ($\\lambda = 200$ km, ocean depth $h = 4$ km) obeys $v = \\sqrt{gh}$. Find its speed and explain why wave height grows near shore.", a: "$v = \\sqrt{9.8 \\times 4000} = 198$ m/s = 713 km/h. As $h$ decreases near shore, $v$ drops and energy conservation requires amplitude to grow: $A \\propto h^{-1/4}$." }
      ]
    }
  ]
},

"fourier-series": {
  readingQuiz: [
    { q: "What does it mean for $\\sin(n\\pi x/L)$ and $\\sin(m\\pi x/L)$ to be orthogonal on $[0,L]$?", a: "Their inner product $\\int_0^L \\sin(n\\pi x/L)\\sin(m\\pi x/L)\\,dx = 0$ when $n \\neq m$." },
    { q: "Write the formulas for Fourier coefficients $a_n$ and $b_n$.", a: "$a_n = \\frac{1}{L}\\int_{-L}^{L}f(x)\\cos(n\\pi x/L)\\,dx$, $b_n = \\frac{1}{L}\\int_{-L}^{L}f(x)\\sin(n\\pi x/L)\\,dx$." },
    { q: "Why does the square wave Fourier series have only odd harmonics?", a: "A square wave has half-wave symmetry ($f(x+L) = -f(x)$), which zeroes all even harmonics." },
    { q: "What is the Gibbs phenomenon?", a: "The persistent ~9% overshoot near discontinuities in Fourier partial sums, which narrows but never disappears as more terms are added." },
    { q: "Does adding more terms eliminate the Gibbs overshoot?", a: "No, the overshoot narrows but its peak stays at about 9% of the jump." },
    { q: "If $f(x)$ is even, which coefficients vanish?", a: "All $b_n$ vanish; only cosine terms remain." },
    { q: "If $f(x)$ is odd, which coefficients vanish?", a: "All $a_n$ vanish; only sine terms remain." },
    { q: "What does Parseval's theorem state?", a: "The average of $|f(x)|^2$ over one period equals the sum of the squares of the Fourier coefficients." },
    { q: "How do the $b_n$ of a square wave depend on $n$?", a: "$b_n = 4/(n\\pi)$ for odd $n$, zero for even $n$." }
  ],
  shortAnswer: [
    { q: "Find the Fourier series of $f(x) = x$ for $-L < x < L$ (period $2L$).", a: "Odd function: $a_n = 0$. $b_n = \\frac{2L}{n\\pi}(-1)^{n+1}$. $f(x) = \\frac{2L}{\\pi}\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n}\\sin(n\\pi x/L)$." },
    { q: "Compute the Fourier series for the triangle wave $f(x) = 1 - |x|/L$.", a: "Even function: $a_0 = 1/2$. $a_n = 4/(n^2\\pi^2)$ for odd $n$, zero for even $n$. Only odd cosine harmonics, falling as $1/n^2$." },
    { q: "Use Parseval's theorem on the square wave to derive $1 + 1/9 + 1/25 + \\cdots = \\pi^2/8$.", a: "Parseval gives $1 = \\sum_{n\\,\\rm odd}\\frac{8}{n^2\\pi^2}$, so $\\sum_{n\\,\\rm odd}1/n^2 = \\pi^2/8$." },
    { q: "A function has $f(x) = \\sum 1/n^3 \\sin(nx)$. Is it continuous? Differentiable?", a: "Yes to both. $\\sum 1/n^3$ converges, giving uniform convergence and continuity. The derivative series $\\sum \\cos(nx)/n^2$ also converges uniformly, so $f$ is differentiable." },
    { q: "Why do square wave coefficients decay as $1/n$ but triangle wave as $1/n^2$?", a: "Smoothness determines decay rate. Jump discontinuities give $1/n$; derivative discontinuities give $1/n^2$. Each additional degree of smoothness adds one power of $1/n$." },
    { q: "Find the Fourier series for $f(x) = x^2$ on $[-\\pi,\\pi]$ and evaluate $\\sum 1/n^2$.", a: "$x^2 = \\pi^2/3 + 4\\sum (-1)^n \\cos(nx)/n^2$. Setting $x = \\pi$: $\\sum 1/n^2 = \\pi^2/6$ (the Basel problem)." }
  ],
  longProblems: [
    {
      title: "Fourier Analysis of Musical Timbres",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Guitar_May_2009-1.jpg/640px-Guitar_May_2009-1.jpg",
      imageAlt: "A classical acoustic guitar",
      context: "Different instruments playing the same note sound distinct due to different harmonic content. When a guitar string is plucked at point $d$ from one end, the triangular initial shape determines which harmonics are excited.",
      parts: [
        { label: "(a)", q: "A string of length $L = 0.65$ m is plucked at $d = L/5$, height $h = 3$ mm. Write the initial displacement.", a: "$y(x,0) = (5h/L)x$ for $0 \\leq x \\leq L/5$; $y(x,0) = (5h/4L)(L-x)$ for $L/5 \\leq x \\leq L$." },
        { label: "(b)", q: "Find the Fourier sine coefficients $B_n$. Which harmonics are missing?", a: "$B_n \\propto \\sin(n\\pi/5)/n^2$. Harmonics $n = 5, 10, 15, \\ldots$ vanish (they have nodes at the pluck point)." },
        { label: "(c)", q: "Calculate relative amplitudes $B_n/B_1$ for $n = 1$ through $7$.", a: "$B_1 = 1$, $B_2 = 0.405$, $B_3 = 0.180$, $B_4 = 0.063$, $B_5 = 0$, $B_6 = -0.028$, $B_7 = -0.033$. Both even and odd harmonics present (unlike clarinet), with $1/n^2$ falloff." },
        { label: "(d)", q: "If plucked at center ($d = L/2$), which harmonics survive?", a: "Only odd harmonics ($n = 1, 3, 5, \\ldots$). The sound is more hollow/woody, similar to clarinet tone." }
      ]
    },
    {
      title: "Square Waves in Digital Electronics",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Square_wave.svg/640px-Square_wave.svg.png",
      imageAlt: "An ideal square wave signal",
      context: "Digital circuits use square wave clocks. Real circuits have finite bandwidth, so understanding the Fourier content determines how much bandwidth is needed to preserve signal shape.",
      parts: [
        { label: "(a)", q: "A 1 GHz clock alternates 0-1 V. List the first five nonzero harmonic frequencies and amplitudes.", a: "Harmonics at $n$ GHz (odd $n$): 1 GHz (0.637 V), 3 GHz (0.212 V), 5 GHz (0.127 V), 7 GHz (0.091 V), 9 GHz (0.071 V)." },
        { label: "(b)", q: "A trace has 5 GHz bandwidth. What does the received signal look like?", a: "Harmonics at 1 and 3 GHz pass fully; 5 GHz is at the 3 dB point. The signal has rounded transitions (~100 ps rise time) but recognizable shape." },
        { label: "(c)", q: "What is the Gibbs overshoot voltage for $N = 101$ terms?", a: "About 9% of the 1 V jump = 0.09 V above the 1 V level, in a spike about 10 ps wide." },
        { label: "(d)", q: "For a 50 ps rise time, what bandwidth is needed? How many harmonics?", a: "$BW = 0.35/t_r = 7.0$ GHz. Need harmonics through $n = 7$ (four nonzero terms)." }
      ]
    },
    {
      title: "Fourier Series and Heat Conduction",
      image: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Wortley_Top_Forge_-_wrought_iron_forging_-_geograph.org.uk_-_6444359.jpg",
      imageAlt: "A metal iron bar for heat conduction",
      context: "Fourier developed his series to solve the heat equation $\\partial T/\\partial t = \\alpha\\partial^2 T/\\partial x^2$. For a copper rod ($L = 1$ m, $\\alpha = 1.11 \\times 10^{-4}$ m$^2$/s) with ends at $0°$C, the solution is a Fourier sine series with exponentially decaying coefficients.",
      parts: [
        { label: "(a)", q: "Show the heat equation has solutions $T_n = B_n\\sin(n\\pi x/L)e^{-\\alpha n^2\\pi^2 t/L^2}$ and find the time constant $\\tau_n$.", a: "Separation of variables gives $\\tau_n = L^2/(\\alpha n^2\\pi^2)$. For copper: $\\tau_1 = 913$ s $\\approx 15$ min." },
        { label: "(b)", q: "Rod initially at $100°$C, ends cooled to $0°$C. Find the Fourier coefficients.", a: "$B_n = 4T_0/(n\\pi)$ for odd $n$, zero for even $n$." },
        { label: "(c)", q: "How long for the center to cool from $100°$C to $50°$C?", a: "Keeping only $n = 1$: $50 = (400/\\pi)e^{-t/\\tau_1}$, giving $t \\approx 854$ s $\\approx 14$ min." },
        { label: "(d)", q: "After what time has the $n = 3$ mode decreased to 1% of its initial amplitude?", a: "$e^{-9t/\\tau_1} = 0.01$ gives $t \\approx 467$ s. At that time, $n = 1$ is still at 60%. Higher modes die out much faster, justifying single-term approximation." }
      ]
    }
  ]
},

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
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Guitar_May_2009-1.jpg/640px-Guitar_May_2009-1.jpg",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Kinemetrics_seismograph.jpg/640px-Kinemetrics_seismograph.jpg",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/US_Navy_040730-N-1234E-002_PCU_Virginia_%28SSN_774%29_returns_to_the_General_Dynamics_Electric_Boat_shipyard.jpg/640px-US_Navy_040730-N-1234E-002_PCU_Virginia_%28SSN_774%29_returns_to_the_General_Dynamics_Electric_Boat_shipyard.jpg",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Pipe_organ_in_Wolvendaal_Church_%28Colombo%29.jpg/640px-Pipe_organ_in_Wolvendaal_Church_%28Colombo%29.jpg",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Didgeridoo_street_player-2.jpg/640px-Didgeridoo_street_player-2.jpg",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Ultrasound_Scan_ND_060.jpg",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/5/56/Seismic_Reflection_Principal.png",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Reflective_and_anti-reflective_lens.jpg/640px-Reflective_and_anti-reflective_lens.jpg",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Wall_of_Sound_%28QuadFest%29.jpg/640px-Wall_of_Sound_%28QuadFest%29.jpg",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Waves_at_La_Corniche.jpg/640px-Waves_at_La_Corniche.jpg",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Tsunami_with_Boussinesq_and_Shallow_water_equations.gif",
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
},

"wave-phenomena": {
  readingQuiz: [
    { q: "What is the Doppler effect?", a: "The change in observed frequency of a wave when the source and observer are in relative motion." },
    { q: "Does the Doppler shift depend on whether the source or observer is moving for sound?", a: "Yes — for sound the two cases give different formulas because the medium defines a preferred frame." },
    { q: "What is a Mach cone?", a: "The conical wavefront produced when a source moves faster than the wave speed in the medium." },
    { q: "How is the Mach cone half-angle related to the speeds?", a: "$\\sin\\theta = v/v_s$, where $v$ is wave speed and $v_s$ is source speed." },
    { q: "What is the Mach number?", a: "The ratio of source speed to wave speed: $M = v_s/v$." },
    { q: "What is Cherenkov radiation?", a: "EM radiation emitted when a charged particle travels through a medium faster than the phase velocity of light in that medium." },
    { q: "What does the superposition principle state?", a: "When waves overlap, the resultant displacement is the sum of the individual displacements." },
    { q: "What happens when many waves of slightly different frequencies are superposed?", a: "They form a wave packet whose envelope travels at the group velocity." },
    { q: "Can two waves of different frequencies produce a stable interference pattern?", a: "No — stable interference requires coherent waves with the same frequency and constant phase relationship." }
  ],
  shortAnswer: [
    { q: "An ambulance siren at $750$ Hz approaches at 30 m/s. What frequency do you hear? ($v = 343$ m/s)", a: "$f = 750 \\times 343/(343-30) = 750 \\times 343/313 \\approx 822$ Hz." },
    { q: "A jet flies at Mach 2.0. What is the Mach cone half-angle?", a: "$\\sin\\theta = 1/M = 1/2$, so $\\theta = 30°$." },
    { q: "Minimum speed for Cherenkov radiation in water ($n = 1.5$)?", a: "$v_{\\min} = c/n = 0.667c$." },
    { q: "Two speakers at 1000 Hz in phase; observer is 3.00 m and 3.34 m from them. Constructive or destructive?", a: "$\\lambda = 0.343$ m. Path difference $= 0.34$ m $\\approx \\lambda$. Approximately constructive." },
    { q: "Five identical waves with phase spacing $\\delta = 2\\pi/5$ are superposed. Resultant amplitude?", a: "The phasors form a closed pentagon (total phase $= 2\\pi$), so they sum to zero. Amplitude $= 0$." },
    { q: "Write the general Doppler formula for source receding at $v_s$ and observer approaching at $v_o$.", a: "$f = f_0(v + v_o)/(v + v_s)$." }
  ],
  longProblems: [
    {
      title: "Sonic Boom from a Supersonic Aircraft",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/FA-18_Hornet_breaking_sound_barrier_%287_July_1999%29_-_filtered.jpg/1280px-FA-18_Hornet_breaking_sound_barrier_%287_July_1999%29_-_filtered.jpg",
      imageAlt: "F/A-18 Hornet breaking the sound barrier with a visible vapor cone",
      context: "When a supersonic aircraft exceeds Mach 1, it generates a Mach cone whose intersection with the ground produces the sonic boom.",
      parts: [
        { label: "(a)", q: "An F/A-18 at Mach 1.4, altitude 5000 m. Find the Mach cone half-angle.", a: "$\\sin\\theta = 1/1.4 = 0.714$, so $\\theta \\approx 45.6°$." },
        { label: "(b)", q: "How far behind the aircraft does the cone hit the ground?", a: "$d = h/\\tan\\theta = 5000/\\tan(45.6°) \\approx 4890$ m." },
        { label: "(c)", q: "How long after the aircraft passes overhead does the observer hear the boom?", a: "$t = d/v_s = 4890/480 \\approx 10.2$ s." },
        { label: "(d)", q: "Compare with a Mach 3.0 aircraft at the same altitude.", a: "$\\theta \\approx 19.5°$, $d \\approx 14{,}100$ m, $t \\approx 13.7$ s. Narrower cone, boom arrives later." }
      ]
    },
    {
      title: "Cherenkov Radiation in a Nuclear Reactor",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Advanced_Test_Reactor.jpg/1024px-Advanced_Test_Reactor.jpg",
      imageAlt: "Blue Cherenkov glow in the Advanced Test Reactor",
      context: "The blue glow in water-cooled reactors is Cherenkov radiation from electrons traveling faster than light in water ($n \\approx 1.33$).",
      parts: [
        { label: "(a)", q: "What is the minimum electron speed for Cherenkov radiation in water?", a: "$v_{\\min} = c/n = 0.752c$." },
        { label: "(b)", q: "What is the minimum kinetic energy in MeV? ($m_e c^2 = 0.511$ MeV)", a: "$\\gamma = 1.516$ at $v = 0.752c$. $K = (\\gamma-1)m_ec^2 = 0.264$ MeV." },
        { label: "(c)", q: "For a 5.0 MeV electron, find the Cherenkov cone angle.", a: "$\\gamma = 10.78$, $\\beta = 0.9957$. $\\cos\\theta = 1/(n\\beta) = 0.7553$, $\\theta \\approx 40.9°$." },
        { label: "(d)", q: "Why does Cherenkov radiation appear blue?", a: "The Frank-Tamm formula gives power $\\propto \\omega$, so higher frequencies (blue/violet) are radiated more intensely." }
      ]
    },
    {
      title: "Doppler Ultrasound in Medical Imaging",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/CRL_Crown_rump_length_12_weeks_ecografia_Dr._Wolfgang_Moroder.jpg/640px-CRL_Crown_rump_length_12_weeks_ecografia_Dr._Wolfgang_Moroder.jpg",
      imageAlt: "Ultrasound image used in medical diagnostics",
      context: "Doppler ultrasound measures blood flow by bouncing sound off moving red blood cells. The frequency shift reveals blood speed. Speed of sound in tissue: $v = 1540$ m/s.",
      parts: [
        { label: "(a)", q: "A 5.0 MHz transducer; blood flows toward it at 0.30 m/s. What frequency does the blood 'see'?", a: "$f_1 = f_0(v+v_b)/v = 5{,}000{,}975$ Hz." },
        { label: "(b)", q: "The blood re-emits at $f_1$. What frequency reaches the transducer?", a: "$f_2 = f_1 v/(v-v_b) \\approx 5{,}001{,}950$ Hz." },
        { label: "(c)", q: "Show that $\\Delta f \\approx 2v_b f_0/v$ for $v_b \\ll v$.", a: "$\\Delta f = 2(0.30)(5 \\times 10^6)/1540 \\approx 1950$ Hz, in the audible range." },
        { label: "(d)", q: "With beam angle $\\phi = 60°$, how does $\\Delta f$ change?", a: "$\\Delta f = 2v_b\\cos\\phi \\cdot f_0/v \\approx 974$ Hz. Only the velocity component along the beam matters." }
      ]
    }
  ]
},

"light": {
  readingQuiz: [
    { q: "Which Maxwell equation implies a changing $\\mathbf{B}$ produces $\\mathbf{E}$?", a: "Faraday's law: $\\nabla \\times \\mathbf{E} = -\\partial\\mathbf{B}/\\partial t$." },
    { q: "What did Maxwell add to Ampère's law?", a: "The displacement current $\\mu_0\\epsilon_0\\partial\\mathbf{E}/\\partial t$." },
    { q: "How is $c$ related to $\\mu_0$ and $\\epsilon_0$?", a: "$c = 1/\\sqrt{\\mu_0\\epsilon_0}$." },
    { q: "What is the relationship between $E$ and $B$ in an EM wave?", a: "They are perpendicular to each other and to propagation, with $E = cB$." },
    { q: "What is the Poynting vector?", a: "$\\mathbf{S} = \\frac{1}{\\mu_0}\\mathbf{E}\\times\\mathbf{B}$, giving energy flux direction and magnitude." },
    { q: "What is radiation pressure on a perfectly absorbing surface?", a: "$P = I/c$." },
    { q: "What is radiation pressure on a perfectly reflecting surface?", a: "$P = 2I/c$." },
    { q: "What wavelength range is visible light?", a: "About 380 nm (violet) to 750 nm (red)." },
    { q: "In which direction does an EM wave propagate relative to $\\mathbf{E}$ and $\\mathbf{B}$?", a: "In the direction of $\\mathbf{E}\\times\\mathbf{B}$." }
  ],
  shortAnswer: [
    { q: "Derive the wave equation for $\\mathbf{E}$ from Maxwell's equations in free space.", a: "Take curl of Faraday's law, use $\\nabla\\cdot\\mathbf{E} = 0$ and Ampère-Maxwell: $\\nabla^2\\mathbf{E} = \\mu_0\\epsilon_0\\partial^2\\mathbf{E}/\\partial t^2$, wave speed $c = 1/\\sqrt{\\mu_0\\epsilon_0}$." },
    { q: "A laser has intensity $I = 10^{12}$ W/m$^2$. Find $E_0$ and $B_0$.", a: "$E_0 = \\sqrt{2I/(c\\epsilon_0)} \\approx 2.74 \\times 10^7$ V/m. $B_0 = E_0/c \\approx 0.091$ T." },
    { q: "Sunlight intensity is 1400 W/m$^2$. What radiation pressure on a perfect mirror?", a: "$P = 2I/c = 9.3 \\times 10^{-6}$ Pa, about $10^{-10}$ atmospheres." },
    { q: "If $E_x = E_0\\sin(kz-\\omega t)$, what is $\\mathbf{B}$?", a: "$B_y = (E_0/c)\\sin(kz-\\omega t)$, so that $\\mathbf{E}\\times\\mathbf{B} \\propto \\hat{z}$." },
    { q: "Energy in a 1 m$^3$ cube with $I = 500$ W/m$^2$ passing through?", a: "$u = I/c \\approx 1.67 \\times 10^{-6}$ J/m$^3$. Total $\\approx 1.7\\;\\mu$J." }
  ],
  longProblems: [
    {
      title: "Solar Sail Propulsion",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/IKAROS_solar_sail.jpg/1024px-IKAROS_solar_sail.jpg",
      imageAlt: "JAXA's IKAROS solar sail deployed in space",
      context: "IKAROS (2010) demonstrated solar sail propulsion using radiation pressure from sunlight. The sail area was $200$ m$^2$, spacecraft mass $315$ kg.",
      parts: [
        { label: "(a)", q: "At 1 AU ($I = 1361$ W/m$^2$), what is the radiation force on a perfectly reflecting 200 m$^2$ sail?", a: "$F = 2IA/c = 1.81$ mN." },
        { label: "(b)", q: "What is the acceleration? Compare to solar gravity at 1 AU ($a_g = 5.93 \\times 10^{-3}$ m/s$^2$).", a: "$a = 5.75 \\times 10^{-6}$ m/s$^2 \\approx 0.1\\%$ of $a_g$. Small but continuous and fuel-free." },
        { label: "(c)", q: "Find $E_0$ and $B_0$ in sunlight at 1 AU.", a: "$E_0 \\approx 1013$ V/m, $B_0 \\approx 3.38\\;\\mu$T." },
        { label: "(d)", q: "How does the force change at Mercury's orbit (0.39 AU)?", a: "$F' = F/(0.39)^2 \\approx 11.9$ mN, about 6.6 times larger." }
      ]
    },
    {
      title: "Radio Transmitter EM Waves",
      image: "https://upload.wikimedia.org/wikipedia/commons/e/e5/WLW-AM_RadioTower.PNG",
      imageAlt: "Diamond-shaped radio transmission tower",
      context: "An AM station broadcasts at 1000 kHz with 50 kW total radiated power, isotropically.",
      parts: [
        { label: "(a)", q: "What is the wavelength?", a: "$\\lambda = c/f = 300$ m." },
        { label: "(b)", q: "Intensity at 10 km?", a: "$I = P/(4\\pi r^2) \\approx 3.98 \\times 10^{-5}$ W/m$^2$." },
        { label: "(c)", q: "Find $E_0$ and $B_0$ at 10 km.", a: "$E_0 \\approx 0.173$ V/m, $B_0 \\approx 5.77 \\times 10^{-10}$ T." },
        { label: "(d)", q: "Energy in a spherical shell of radius 10 km and thickness one wavelength?", a: "$U = (I/c) \\times 4\\pi r^2 \\Delta r \\approx 0.050$ J, consistent with $P \\times T$." }
      ]
    },
    {
      title: "Microwave Oven EM Fields",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Microwave_oven_%28interior%29.jpg/1024px-Microwave_oven_%28interior%29.jpg",
      imageAlt: "Interior of a microwave oven",
      context: "A microwave oven operates at $f = 2.45$ GHz delivering $P = 1000$ W to the cavity.",
      parts: [
        { label: "(a)", q: "What is $\\lambda$? Why are there hot and cold spots?", a: "$\\lambda = 12.2$ cm. Standing waves form with nodes/antinodes spaced by $\\sim 6$ cm, hence hot/cold spots and turntables." },
        { label: "(b)", q: "Estimate $E_0$ inside the oven (cavity side $L = 0.30$ m).", a: "$I \\approx P/L^2 \\approx 1.11 \\times 10^4$ W/m$^2$. $E_0 \\approx 2890$ V/m." },
        { label: "(c)", q: "Compare radiation pressure on food to atmospheric pressure.", a: "$P_{\\rm rad} = I/c \\approx 3.7 \\times 10^{-5}$ Pa, about $10^{-10}$ atm. Utterly negligible; microwaves heat via molecular oscillations." }
      ]
    }
  ]
},

"polarization": {
  readingQuiz: [
    { q: "What is linearly polarized light?", a: "The $\\mathbf{E}$ vector oscillates along a single fixed direction." },
    { q: "How is circular polarization different?", a: "The $\\mathbf{E}$ vector rotates in a circle at the wave frequency, with constant magnitude." },
    { q: "State Malus's law.", a: "Through a polarizer at angle $\\theta$: $I = I_0\\cos^2\\theta$." },
    { q: "What fraction of unpolarized light passes through an ideal polarizer?", a: "One half." },
    { q: "What is a Jones vector?", a: "A two-component complex vector describing the amplitude and phase of the two $\\mathbf{E}$ components." },
    { q: "What does a quarter-wave plate do to 45° linearly polarized light?", a: "Converts it to circularly polarized light." },
    { q: "What does a half-wave plate do?", a: "Rotates the polarization plane by $2\\alpha$, where $\\alpha$ is the angle to the fast axis." },
    { q: "What is Brewster's angle?", a: "The incidence angle where reflected light is fully polarized: $\\tan\\theta_B = n_2/n_1$." },
    { q: "What is optical activity?", a: "Rotation of polarization plane by materials with different indices for left and right circular polarization." }
  ],
  shortAnswer: [
    { q: "Unpolarized light through three polarizers: vertical, 30°, horizontal. Final intensity?", a: "$I_0/2 \\times \\cos^2 30° \\times \\cos^2 60° = I_0/2 \\times 3/4 \\times 1/4 = 3I_0/32$." },
    { q: "Write Jones vectors for (i) $x$-polarized, (ii) 45° polarized, (iii) right-circular.", a: "(i) $(1,0)^T$, (ii) $(1,1)^T/\\sqrt{2}$, (iii) $(1,-i)^T/\\sqrt{2}$." },
    { q: "Find Brewster's angle for glass ($n = 1.50$) in air.", a: "$\\theta_B = \\arctan(1.50) = 56.3°$. Refraction angle: $33.7°$." },
    { q: "A half-wave plate's fast axis is at 20° from horizontal. Input: horizontal polarization. Output angle?", a: "Rotation by $2\\alpha = 40°$ from horizontal." },
    { q: "Circularly polarized light through a linear polarizer. Transmitted fraction?", a: "$I_0/2$, linearly polarized along the transmission axis." },
    { q: "A 1.0 mm quartz plate rotates polarization by 21.7°/mm. Add a 2.0 mm plate. Total rotation?", a: "$21.7° + 43.4° = 65.1°$ (optical rotation is additive)." }
  ],
  longProblems: [
    {
      title: "Polarization in 3D Cinema",
      image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/RealD_glasses.jpg",
      imageAlt: "RealD 3D cinema glasses",
      context: "3D cinemas project two images with opposite circular polarizations. Passive glasses with circular polarizer filters transmit only one handedness per eye. This is preferred over linear polarization because head tilting doesn't cause cross-talk.",
      parts: [
        { label: "(a)", q: "Explain how a linear polarizer + QWP blocks one circular polarization handedness.", a: "The QWP converts one handedness (say RCP) to linear polarization aligned with the polarizer (passes), and the other (LCP) to the perpendicular direction (blocked)." },
        { label: "(b)", q: "Show the Jones calculus for LCP through a QWP (fast axis along $x$) + 45° polarizer.", a: "LCP $= (1,i)^T/\\sqrt{2}$. After QWP: $(1,1)^T/\\sqrt{2}$ (45° linear). The 45° polarizer transmits fully." },
        { label: "(c)", q: "Show the same for RCP.", a: "RCP $= (1,-i)^T/\\sqrt{2}$. After QWP: $(1,-1)^T/\\sqrt{2}$ ($-45°$ linear). The 45° polarizer gives zero output." },
        { label: "(d)", q: "What happens with a 30° head tilt? Compare with linear polarization.", a: "Circular polarization: no effect (QWP+polarizer still works). Linear: 25% cross-talk ($\\sin^2 30°$), severely degrading the 3D effect." }
      ]
    },
    {
      title: "LCD Display Polarization",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/LCD_layers.svg/800px-LCD_layers.svg.png",
      imageAlt: "Layers of a liquid crystal display",
      context: "An LCD pixel has a backlight, rear polarizer, liquid crystal layer (rotates polarization), and front polarizer (crossed). No voltage: LC rotates by 90° (bright). Voltage applied: no rotation (dark).",
      parts: [
        { label: "(a)", q: "Explain why the pixel is bright in the OFF state.", a: "Vertically polarized light from rear polarizer is rotated 90° by LC to horizontal, then passes through horizontal front polarizer." },
        { label: "(b)", q: "Why is it dark in the ON state?", a: "No rotation; vertical light hits horizontal polarizer. $I = I_0\\cos^2 90° = 0$." },
        { label: "(c)", q: "For partial voltage (rotation $\\alpha < 90°$), find transmitted intensity.", a: "$I = (I_0/2)\\sin^2\\alpha$. At $\\alpha = 45°$: half brightness." },
        { label: "(d)", q: "Why do LCDs look dark through polarized sunglasses at certain orientations?", a: "When the LCD's output polarization is perpendicular to the sunglasses' axis, Malus's law gives $\\cos^2 90° = 0$. Rotating 90° restores the image." }
      ]
    },
    {
      title: "Brewster Windows in Lasers",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Laser_h%C3%A9lium-n%C3%A9on.png/640px-Laser_h%C3%A9lium-n%C3%A9on.png",
      imageAlt: "Diagram of a helium-neon laser with Brewster windows",
      context: "HeNe laser tubes are sealed with Brewster-angle windows. The p-polarized component has zero reflection, while s-polarized light is partially reflected. After many round trips, the output is highly linearly polarized.",
      parts: [
        { label: "(a)", q: "Calculate Brewster's angle for glass ($n = 1.52$).", a: "$\\theta_B = \\arctan(1.52) = 56.7°$. Refraction angle: $33.3°$." },
        { label: "(b)", q: "Calculate $R_s$ at Brewster's angle using the Fresnel equation.", a: "$r_s = (0.549-1.271)/(0.549+1.271) = -0.397$. $R_s = 0.158$ (15.8% reflected)." },
        { label: "(c)", q: "After 4 surfaces per round trip, what fraction of s-polarized light survives?", a: "$(1-0.158)^4 = (0.842)^4 = 0.503$. Only 50% per round trip." },
        { label: "(d)", q: "After 50 round trips, what is the s-to-p intensity ratio?", a: "$(0.503)^{50} \\approx 10^{-15}$. The output is essentially perfectly p-polarized." }
      ]
    }
  ]
},

"refraction": {
  readingQuiz: [
    { q: "What is the index of refraction?", a: "$n = c/v$, the ratio of light speed in vacuum to in the material." },
    { q: "State Snell's law.", a: "$n_1\\sin\\theta_1 = n_2\\sin\\theta_2$." },
    { q: "How is Snell's law derived from waves?", a: "By requiring wavefront phase matching at the boundary." },
    { q: "What is total internal reflection?", a: "All light is reflected when going from higher to lower $n$ and exceeding the critical angle." },
    { q: "Critical angle formula?", a: "$\\sin\\theta_c = n_2/n_1$ (for $n_1 > n_2$)." },
    { q: "What is Fermat's principle?", a: "Light follows the path of least (stationary) time." },
    { q: "What is dispersion?", a: "Dependence of $n$ on wavelength, causing different colors to refract differently." },
    { q: "Why does a prism separate white light?", a: "$n$ is larger for shorter wavelengths (violet bends more than red)." },
    { q: "How do optical fibers guide light?", a: "Total internal reflection: core ($n_1$) > cladding ($n_2$)." }
  ],
  shortAnswer: [
    { q: "Light from water ($n = 1.33$) into glass ($n = 1.50$) at $40°$. Find refraction angle.", a: "$\\sin\\theta_2 = 1.33\\sin 40°/1.50 = 0.570$. $\\theta_2 = 34.7°$." },
    { q: "Critical angle for diamond-air ($n = 2.42$)?", a: "$\\theta_c = \\arcsin(1/2.42) = 24.4°$. Small angle explains diamond sparkle." },
    { q: "Derive Snell's law from Fermat's principle.", a: "Minimize optical path $L = n_1\\sqrt{h_1^2+x^2} + n_2\\sqrt{h_2^2+(d-x)^2}$. Setting $dL/dx = 0$ gives $n_1\\sin\\theta_1 = n_2\\sin\\theta_2$." },
    { q: "A prism ($n = 1.52$, apex $60°$) at minimum deviation. Find $\\delta_{\\min}$.", a: "$\\sin((60°+\\delta_{\\min})/2) = 1.52\\sin 30° = 0.76$. $\\delta_{\\min} = 39.0°$." },
    { q: "Fiber with $n_1 = 1.48$, $n_2 = 1.46$. Maximum acceptance angle?", a: "NA $= \\sqrt{n_1^2 - n_2^2} = 0.242$. $\\theta_{\\max} = 14.0°$." },
    { q: "Why does a pool appear shallower than it is?", a: "Apparent depth $= d/n \\approx 0.75d$. A 2 m pool looks 1.5 m deep." }
  ],
  longProblems: [
    {
      title: "Fiber Optic Communication",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Fibreoptic.jpg/1024px-Fibreoptic.jpg",
      imageAlt: "Illuminated optical fiber bundle",
      context: "Single-mode fiber: core $9\\;\\mu$m, $n_{\\rm core} = 1.4475$, $n_{\\rm clad} = 1.4440$, $\\lambda = 1550$ nm.",
      parts: [
        { label: "(a)", q: "Find critical angle and numerical aperture.", a: "$\\theta_c = 86.0°$. NA $= 0.1006$, acceptance angle $5.77°$." },
        { label: "(b)", q: "Signal takes $4.83\\;\\mu$s per km. What is the group index?", a: "$n_g = c/v = 1.449$." },
        { label: "(c)", q: "Attenuation 0.20 dB/km, launch 1.0 mW, detector $-30$ dBm. Max distance?", a: "Power budget 30 dB. Max distance $= 150$ km." },
        { label: "(d)", q: "Dispersion 17 ps/(nm·km), linewidth 0.1 nm. Pulse broadening over 100 km?", a: "$\\Delta t = 17 \\times 0.1 \\times 100 = 170$ ps. Limits 10 Gb/s systems." }
      ]
    },
    {
      title: "Mirages and Atmospheric Refraction",
      image: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Mirage_over_a_hot_road.jpg",
      imageAlt: "Inferior mirage on a hot road",
      context: "Hot air near the road has lower density and lower $n$, causing light rays to curve upward, producing mirages that look like water.",
      parts: [
        { label: "(a)", q: "Calculate $n$ at 288 K and 340 K (near hot road). Standard: $n_{\\rm cool} = 1.000293$.", a: "Scaling with $1/T$: $n_{\\rm hot} \\approx 1.000248$. $\\Delta n \\approx 4.5 \\times 10^{-5}$." },
        { label: "(b)", q: "Use Snell's law for stratified atmosphere to explain why rays curve upward near hot surface.", a: "$n(y)\\cos\\alpha(y) = $ const. As $n$ decreases downward, $\\cos\\alpha$ increases, $\\alpha$ decreases toward horizontal, then curves back up — like total internal reflection." },
        { label: "(c)", q: "Estimate the critical viewing angle for mirage formation.", a: "$\\cos\\alpha_{\\rm cool} = n_{\\rm hot}/n_{\\rm cool} = 0.999955$, giving $\\alpha \\approx 0.54°$. Only very shallow angles produce mirages." },
        { label: "(d)", q: "Why do mirages shimmer?", a: "Turbulent convection constantly shifts the temperature gradient, causing rapid fluctuations in light paths." }
      ]
    },
    {
      title: "Rainbow Formation by Raindrops",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Double-alaskan-rainbow.jpg/1024px-Double-alaskan-rainbow.jpg",
      imageAlt: "Double rainbow over Alaska",
      context: "Rainbows form by refraction, internal reflection, and dispersion in raindrops. Water: $n = 1.331$ (red) to $1.344$ (violet).",
      parts: [
        { label: "(a)", q: "Show the total deviation for the primary rainbow is $D = 2\\theta_i - 4\\theta_r + 180°$.", a: "Two refractions each deviate by $(\\theta_i-\\theta_r)$, one reflection deviates by $(180°-2\\theta_r)$. Sum: $2\\theta_i - 4\\theta_r + 180°$." },
        { label: "(b)", q: "Find the minimum deviation angle (rainbow angle) for red light ($n = 1.331$).", a: "Setting $dD/d\\theta_i = 0$: $\\sin^2\\theta_i = (4-n^2)/3 = 0.743$, $\\theta_i = 59.6°$. $D = 137.2°$. Rainbow angle: $42.8°$." },
        { label: "(c)", q: "Find rainbow angle for violet ($n = 1.344$). Angular width of rainbow?", a: "Violet: $D = 139.6°$, angle $40.4°$. Width: $42.8°-40.4° = 2.4°$. Red outside, violet inside." },
        { label: "(d)", q: "For the secondary rainbow ($D = 2\\theta_i - 6\\theta_r + 360°$), find the angle for red and explain reversed colors.", a: "Red: $\\theta_i = 71.9°$, $D = 230.8°$, viewing angle $50.8°$. Since $D > 180°$, colors are reversed: violet outside, red inside. Alexander's dark band lies between primary (42.8°) and secondary (50.8°)." }
      ]
    }
  ]
},

"scattering": {
  readingQuiz: [
    { q: "What is Rayleigh scattering?", a: "Scattering by particles much smaller than $\\lambda$, with intensity $\\propto \\omega^4$ ($1/\\lambda^4$)." },
    { q: "Why is the sky blue?", a: "Shorter wavelengths are scattered much more strongly by the $\\omega^4$ dependence." },
    { q: "Why are sunsets red?", a: "Blue light is scattered away over the long atmospheric path, leaving red/orange." },
    { q: "What is Thomson scattering?", a: "Scattering by free charged particles in the classical limit." },
    { q: "What radiation does an accelerating charge emit?", a: "EM waves, with power $\\propto$ acceleration squared (Larmor formula)." },
    { q: "How does the radiation field fall off with distance?", a: "As $1/R$, so intensity falls as $1/R^2$." },
    { q: "What is a scattering cross section?", a: "Effective area $\\sigma$ where $P_{\\rm scat} = \\sigma I_{\\rm inc}$." },
    { q: "What is the Thomson cross section?", a: "$\\sigma_T = \\frac{8\\pi}{3}r_e^2 \\approx 6.65 \\times 10^{-29}$ m$^2$." },
    { q: "Why does $\\sigma_{\\rm Rayleigh} \\propto \\omega^4$?", a: "The radiated power from an oscillating dipole is $\\propto \\omega^4 p_0^2$." }
  ],
  shortAnswer: [
    { q: "Ratio of Rayleigh scattering for blue (450 nm) vs red (650 nm)?", a: "$(650/450)^4 = 4.35$. Blue scattered 4.4× more." },
    { q: "Find time-averaged radiated power for electron with $a(t) = a_0\\cos(\\omega t)$.", a: "$\\langle P\\rangle = e^2 a_0^2/(12\\pi\\epsilon_0 c^3)$." },
    { q: "Show no radiation is emitted along the acceleration direction.", a: "$E_{\\rm rad} \\propto \\sin\\theta$; at $\\theta = 0°$, $\\sin\\theta = 0$, so no radiation along the acceleration." },
    { q: "Why do clouds appear white?", a: "Droplets ($\\sim 10\\;\\mu$m) are much larger than $\\lambda$; Mie scattering is wavelength-independent, so all colors scatter equally." },
    { q: "Thomson cross section; beam $I = 10^{10}$ W/m$^2$ hits an electron. Scattered power?", a: "$P = \\sigma_T I = 6.65 \\times 10^{-19}$ W, about a few photons per second." }
  ],
  longProblems: [
    {
      title: "Why the Sky is Blue and Sunsets are Red",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Sunrise_over_the_sea.jpg/1280px-Sunrise_over_the_sea.jpg",
      imageAlt: "Vivid red and orange sunrise over the ocean",
      context: "Rayleigh scattering by N$_2$ and O$_2$ determines sky color. At 550 nm: $\\sigma \\approx 4.5 \\times 10^{-31}$ m$^2$, $N \\approx 2.55 \\times 10^{25}$ m$^{-3}$.",
      parts: [
        { label: "(a)", q: "Calculate the scattering mean free path $\\ell$ for green light.", a: "$\\ell = 1/(N\\sigma) \\approx 87$ km, about 10× the atmospheric scale height." },
        { label: "(b)", q: "At sunset (path $\\sim 323$ km), what fraction of green light is transmitted?", a: "$e^{-323/87} = e^{-3.71} \\approx 2.4\\%$." },
        { label: "(c)", q: "Calculate transmission for red (650 nm) and blue (450 nm) at sunset.", a: "Red: 15% transmitted. Blue: 0.025%. Red-to-blue ratio $\\approx 600$." },
        { label: "(d)", q: "Why is the lunar sky black even during daytime?", a: "No atmosphere means no scattering. Only direct light reaches the eye." }
      ]
    },
    {
      title: "Thomson Scattering in the Solar Corona",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Solar_eclipse_1999_4_NR.jpg/1024px-Solar_eclipse_1999_4_NR.jpg",
      imageAlt: "Solar corona during total eclipse",
      context: "The corona's faint glow is sunlight Thomson-scattered by free electrons in the $\\sim 10^6$ K plasma. $\\sigma_T = 6.65 \\times 10^{-29}$ m$^2$.",
      parts: [
        { label: "(a)", q: "At $2R_\\odot$, $n_e = 10^{12}$ m$^{-3}$. Optical depth through $L = R_\\odot$?", a: "$\\tau = n_e\\sigma_T L \\approx 4.6 \\times 10^{-8}$. Extremely optically thin ($\\sim 10^{-6}$ of disk brightness)." },
        { label: "(b)", q: "Why Thomson (not Rayleigh) scattering for coronal electrons?", a: "Electrons are free (corona is fully ionized), so the frequency-independent Thomson cross section applies." },
        { label: "(c)", q: "Compare proton vs electron scattering.", a: "$\\sigma \\propto 1/m^2$: proton scattering is $(m_e/m_p)^2 \\approx 3 \\times 10^{-7}$ weaker. Negligible." },
        { label: "(d)", q: "Why is scattered coronal light polarized at 90°?", a: "At 90°, only the $\\mathbf{E}$ component perpendicular to both incident and scattered directions radiates. The parallel component gives $\\sin 0° = 0$. Result: 100% polarized." }
      ]
    },
    {
      title: "Rayleigh Scattering in LED Phosphor Coatings",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/White_LED.jpg/1024px-White_LED.jpg",
      imageAlt: "White LED showing blue chip and yellow phosphor",
      context: "White LEDs combine a blue LED ($\\lambda = 460$ nm) with yellow phosphor. The phosphor particle size determines whether Rayleigh or Mie scattering dominates.",
      parts: [
        { label: "(a)", q: "Standard phosphor particles are $d \\approx 10\\;\\mu$m. Is Rayleigh scattering appropriate?", a: "$d/\\lambda \\approx 22$. Far outside Rayleigh regime ($d \\ll \\lambda$). Mie scattering applies; all colors scatter equally." },
        { label: "(b)", q: "If 50 nm nanoparticles were used instead, how much more would blue scatter than yellow?", a: "$(580/460)^4 = 2.53$. Blue scattered 2.5× more, causing non-uniform color." },
        { label: "(c)", q: "Calculate the Rayleigh cross section for a 25 nm radius YAG:Ce particle ($n_p = 1.84$) in silicone ($n_m = 1.41$) at 460 nm.", a: "$\\sigma \\approx 2.57 \\times 10^{-18}$ m$^2$." },
        { label: "(d)", q: "Compare to geometric cross section. What is the scattering efficiency $Q$?", a: "$Q = \\sigma/\\pi a^2 \\approx 1.3 \\times 10^{-3}$. Only 0.13% efficient — Rayleigh scatterers are very weak." }
      ]
    }
  ]
},

"color": {
  readingQuiz: [
    { q: "What are the three types of cone cells?", a: "S-cones (~420 nm, blue), M-cones (~530 nm, green), L-cones (~560 nm, red)." },
    { q: "What is a metamer?", a: "Two physically different spectra that produce the same perceived color by stimulating cones identically." },
    { q: "Why do three primaries suffice?", a: "Human vision is trichromatic — any color is determined by three cone responses, so three primaries can match them." },
    { q: "Additive vs subtractive color mixing?", a: "Additive combines light (RGB, screens); subtractive combines absorbers (CMY, printing)." },
    { q: "What do CIE chromaticity axes represent?", a: "$x = X/(X+Y+Z)$, $y = Y/(X+Y+Z)$, normalized tristimulus values." },
    { q: "State Grassmann's first law.", a: "Color matching is linear — if two colors match, they remain matched when the same color is added to both." },
    { q: "Why is the CIE boundary horseshoe-shaped?", a: "It traces monochromatic spectral colors; the smooth overlapping cone sensitivities create the curve." },
    { q: "What color is red + green light?", a: "Yellow." }
  ],
  shortAnswer: [
    { q: "Source 1 gives cone responses (0.8, 0.5, 0.1). Source 2 gives (0.8, 0.5, 0.2). Metamers?", a: "No — S-cone responses differ (0.1 vs 0.2). The second looks slightly more bluish." },
    { q: "Colors A $(0.2, 0.3)$ and B $(0.5, 0.4)$ mixed equally on CIE diagram. Result?", a: "Midpoint: $(0.35, 0.35)$, near the white point." },
    { q: "Why can't three real primaries reproduce all visible colors?", a: "The visible gamut is curved (horseshoe). A triangle inscribed in a curve can never cover it all." },
    { q: "White light through cyan filter then yellow filter. Result?", a: "Cyan passes G,B. Yellow passes R,G. Overlap: green." },
    { q: "Why does a yellow flower look black under pure blue light?", a: "The pigment absorbs blue (the only wavelength present), so nothing is reflected." },
    { q: "RGB display primaries at R=$(0.64,0.33)$, G=$(0.30,0.60)$, B=$(0.15,0.06)$. What is the gamut?", a: "The triangle with those vertices on the CIE diagram. Cannot reach saturated cyans or deep purples." }
  ],
  longProblems: [
    {
      title: "Color Rendering on an OLED Display",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Samsung_Transparent_OLED_Display_%2824182257080%29.jpg/640px-Samsung_Transparent_OLED_Display_%2824182257080%29.jpg",
      imageAlt: "OLED television display showing vibrant colors",
      context: "OLED TVs produce colors by combining RGB sub-pixels. The gamut is the triangle formed by the three primaries on the CIE diagram.",
      parts: [
        { label: "(a)", q: "Primaries R=$(0.68,0.32)$, G=$(0.27,0.69)$, B=$(0.14,0.05)$. Write equations for mixing fractions $r,g,b$ to produce target $(0.33,0.33)$.", a: "$0.33 = 0.68r + 0.27g + 0.14b$; $0.33 = 0.32r + 0.69g + 0.05b$; $r+g+b = 1$." },
        { label: "(b)", q: "Solve the system.", a: "$(r,g,b) \\approx (0.27, 0.32, 0.41)$." },
        { label: "(c)", q: "Can the display reproduce deep orange at $(0.55, 0.40)$?", a: "Solving: $(r,g,b) \\approx (0.70, 0.25, 0.05)$. All positive, so yes — inside the gamut." },
        { label: "(d)", q: "Why might two viewers perceive the same display differently?", a: "Observer metamerism: individual cone sensitivities vary due to genetics and age. Narrow-band OLED emitters amplify these differences." }
      ]
    },
    {
      title: "Atmospheric Color and Rayleigh Scattering",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Sunset_over_the_sea.jpg/640px-Sunset_over_the_sea.jpg",
      imageAlt: "Sunset showing transition from blue sky to red-orange",
      context: "Sky color results from Rayleigh scattering ($\\propto \\lambda^{-4}$). At sunset, the longer path removes blue, leaving red.",
      parts: [
        { label: "(a)", q: "Calculate scattering ratio for blue (450 nm) vs red (650 nm).", a: "$(650/450)^4 = 4.35$. Blue scattered about 4.4× more intensely." },
        { label: "(b)", q: "If blue optical depth at zenith is $\\tau_b = 0.25$, find blue and red transmission.", a: "Blue: $e^{-0.25} = 77.9\\%$. Red: $\\tau_r = 0.25 \\times (450/650)^4 = 0.057$, transmission $94.4\\%$." },
        { label: "(c)", q: "At sunset (12× more atmosphere), calculate transmissions.", a: "Blue: $e^{-3.0} = 5\\%$. Red: $e^{-0.69} = 50\\%$. Explains the red color." },
        { label: "(d)", q: "CIE values of zenith sky: $X=18, Y=22, Z=55$. Confirm it's blue.", a: "$(x,y) = (0.189, 0.232)$. Low $x$, moderate-low $y$, large $z = 0.579$: blue." }
      ]
    },
    {
      title: "Subtractive Color Mixing in Inkjet Printing",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Subtractive_color_mixing.jpg/640px-Subtractive_color_mixing.jpg",
      imageAlt: "Printer icon representing inkjet printing",
      context: "Inkjet printers use CMY(K) inks. Each ink absorbs certain wavelengths from white light; overlapping inks determine the reflected color.",
      parts: [
        { label: "(a)", q: "Cyan ink (passes G,B) over yellow ink (passes R,G). What color?", a: "Only green passes both. Result: green." },
        { label: "(b)", q: "Cyan at 60%, magenta at 40% with random halftone overlap. Find area fractions.", a: "Overlap (blue): 24%. Cyan only: 36%. Magenta only: 16%. White: 24%." },
        { label: "(c)", q: "Why add black (K) ink instead of mixing CMY for black?", a: "Real CMY gives muddy brown, not true black. K also saves ink, speeds drying, and gives sharper text." },
        { label: "(d)", q: "Printed patch: $X=22, Y=25, Z=8$. Find chromaticity and approximate hue.", a: "$(x,y) = (0.40, 0.455)$. Yellow-green region." }
      ]
    }
  ]
},

"antennas": {
  readingQuiz: [
    { q: "What is the radiation pattern of an oscillating dipole?", a: "$\\sin^2\\theta$ intensity: maximum perpendicular to the axis, zero along it." },
    { q: "What is the array factor?", a: "The factor in the total pattern due to the spatial arrangement and phasing of multiple elements." },
    { q: "When does the principal maximum occur for N equally spaced sources?", a: "When $d\\sin\\theta = m\\lambda$ (path difference = whole wavelength)." },
    { q: "What is a phased array?", a: "An array where element phases are electronically adjusted to steer the beam." },
    { q: "How does increasing N affect beamwidth?", a: "Beamwidth decreases as $\\sim 1/N$." },
    { q: "What spacing avoids grating lobes for broadside?", a: "$d < \\lambda$." },
    { q: "What determines broadside vs endfire radiation?", a: "Zero phase shift gives broadside; progressive shift $\\delta = -kd$ gives endfire." }
  ],
  shortAnswer: [
    { q: "Two elements, $d = \\lambda/2$, in phase. Find constructive and destructive angles.", a: "Constructive at $\\theta = 90°$ (broadside). Destructive at $\\theta = 0°, 180°$ (endfire)." },
    { q: "4-element array, $d = \\lambda/2$, phase shift $\\delta = \\pi/4$. Beam direction?", a: "$\\cos\\theta = -1/4$, so $\\theta \\approx 104.5°$ (14.5° past broadside)." },
    { q: "N = 8 elements. How many secondary maxima between principal maxima?", a: "$N-2 = 6$ secondary maxima." },
    { q: "Half-wave dipole (gain 1.64) as element in 10-element broadside array. Total gain?", a: "$G = 1.64 \\times 10 = 16.4$ ($12.15$ dBi)." },
    { q: "What happens if $d > \\lambda$?", a: "Grating lobes appear — extra principal maxima that waste power." }
  ],
  longProblems: [
    {
      title: "5G mmWave Phased Array",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Cellular_5G_Equipment_-_Cell_Tower_Antennas.jpg/640px-Cellular_5G_Equipment_-_Cell_Tower_Antennas.jpg",
      imageAlt: "5G New Radio logo",
      context: "5G at 28 GHz uses phased arrays to steer narrow beams. Small wavelength allows compact arrays.",
      parts: [
        { label: "(a)", q: "At 28 GHz, find $\\lambda$ and element spacing at $d = \\lambda/2$.", a: "$\\lambda = 10.71$ mm. $d = 5.36$ mm." },
        { label: "(b)", q: "N = 16 elements broadside. HPBW?", a: "$\\text{HPBW} \\approx 0.886\\lambda/(Nd) = 6.35°$." },
        { label: "(c)", q: "Phase shift to steer to $\\theta = 60°$ from array axis?", a: "$\\delta = -\\pi\\cos 60° = -\\pi/2 = -90°$." },
        { label: "(d)", q: "How does beamwidth change when steered 30° from broadside?", a: "Broadens by $1/\\cos 30° = 1.155$. New HPBW: $7.33°$." },
        { label: "(e)", q: "Max spacing to avoid grating lobes when steering to 60° from broadside?", a: "$d \\leq \\lambda/(1+\\sin 60°) = 0.536\\lambda = 5.74$ mm. The $\\lambda/2$ design satisfies this." }
      ]
    },
    {
      title: "VLA Radio Telescope Array",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/USA.NM.VeryLargeArray.02.jpg/640px-USA.NM.VeryLargeArray.02.jpg",
      imageAlt: "The Very Large Array radio telescope",
      context: "The VLA has 27 dishes with max baseline 36 km, operating 1-50 GHz.",
      parts: [
        { label: "(a)", q: "Resolution at 1.4 GHz ($\\lambda = 21$ cm)?", a: "$\\theta \\approx \\lambda/B = 0.214/36000 = 5.94\\;\\mu$rad $= 1.23''$." },
        { label: "(b)", q: "Min frequency to resolve 0.5 arcsecond sources?", a: "$f \\geq c/(0.5'' \\times B) \\approx 3.4$ GHz." },
        { label: "(c)", q: "Time for a source to drift through one fringe at 1.4 GHz, $B = 1$ km?", a: "Fringe spacing $= \\lambda/B$. Drift time $= (\\lambda/B)/\\omega_E \\approx 2.94$ s." },
        { label: "(d)", q: "How many unique baselines with 27 antennas? Why does this help?", a: "$\\binom{27}{2} = 351$ baselines. More baselines = better Fourier sampling = better images." }
      ]
    },
    {
      title: "Yagi-Uda Television Antenna",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Antenna_Shapes_%285971977677%29.jpg/640px-Antenna_Shapes_%285971977677%29.jpg",
      imageAlt: "Yagi-Uda TV antenna on a roof",
      context: "Uses parasitic elements (reflector + directors) with a driven element to create a directional beam.",
      parts: [
        { label: "(a)", q: "At $f = 175$ MHz, find $\\lambda$ and driven element length.", a: "$\\lambda = 1.714$ m. Half-wave dipole: $\\lambda/2 = 86$ cm." },
        { label: "(b)", q: "Reflector, director, and director spacing dimensions?", a: "Reflector: 90 cm. Director: 81 cm. Spacing: 51 cm." },
        { label: "(c)", q: "Why does the reflector reflect and directors guide forward?", a: "Longer reflector has inductive reactance (current lags), combining with $\\lambda/4$ spacing to reinforce forward. Shorter directors have capacitive reactance (current leads), channeling energy forward." },
        { label: "(d)", q: "Estimate gain of an 8-element Yagi.", a: "About 10 dBd (12 dBi), gain factor $\\approx 16$, beamwidth $\\sim 40°-50°$." }
      ]
    }
  ]
},

"diffraction": {
  readingQuiz: [
    { q: "Condition for first minimum in single-slit diffraction?", a: "$a\\sin\\theta = \\lambda$." },
    { q: "Fraunhofer vs Fresnel diffraction?", a: "Fraunhofer: far field (plane waves). Fresnel: near field (curved wavefronts)." },
    { q: "Resolving power of a grating with $N$ slits?", a: "$R = mN$." },
    { q: "What is the Rayleigh criterion?", a: "Two sources are just resolved when one's central max falls on the other's first min." },
    { q: "How does N-slit pattern differ from single slit?", a: "Sharp principal maxima modulated by single-slit envelope, with $N-2$ secondary maxima between." },
    { q: "What is an Airy disk?", a: "Central bright spot of circular aperture diffraction; angular radius $\\theta = 1.22\\lambda/D$." },
    { q: "How does central maximum width depend on slit width?", a: "Inversely: $\\Delta\\theta = 2\\lambda/a$. Narrower slit = wider pattern." },
    { q: "What determines principal maxima positions in a grating?", a: "$d\\sin\\theta = m\\lambda$." },
    { q: "Why is a grating much sharper than a double slit?", a: "More slits = narrower peaks (width $\\propto 1/N$)." }
  ],
  shortAnswer: [
    { q: "Single slit $a = 20\\;\\mu$m, $\\lambda = 550$ nm. First two minima and central width.", a: "$\\theta_1 = 1.58°$, $\\theta_2 = 3.15°$. Central width $2\\theta_1 = 3.15°$." },
    { q: "Grating with 500 lines/mm. First three orders for $\\lambda = 600$ nm. Max order?", a: "$d = 2\\;\\mu$m. $\\theta_1 = 17.5°$, $\\theta_2 = 36.9°$, $\\theta_3 = 64.2°$. Max order $= 3$." },
    { q: "Telescope $D = 10$ cm. Min angular resolution at 550 nm?", a: "$\\theta_{\\min} = 1.22\\lambda/D = 6.71\\;\\mu$rad $= 1.38''$." },
    { q: "Grating with 10,000 slits, 2nd order near 500 nm. Min $\\Delta\\lambda$?", a: "$R = 20{,}000$. $\\Delta\\lambda_{\\min} = 500/20000 = 0.025$ nm." },
    { q: "Derive single-slit intensity $I(\\theta) = I_0(\\sin\\beta/\\beta)^2$.", a: "Integrate amplitudes across slit with phase differences: $E \\propto a\\sin\\beta/\\beta$ where $\\beta = \\pi a\\sin\\theta/\\lambda$." },
    { q: "Central maximum is 4 cm wide on screen 2 m away, $\\lambda = 633$ nm. Slit width?", a: "$a = \\lambda/\\sin\\theta = 633 \\times 10^{-9}/0.01 = 63.3\\;\\mu$m." }
  ],
  longProblems: [
    {
      title: "X-ray Diffraction and Crystal Structure",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/X-ray_diffraction_pattern_3clpro.jpg/640px-X-ray_diffraction_pattern_3clpro.jpg",
      imageAlt: "X-ray diffraction pattern from a protein crystal",
      context: "X-ray crystallography uses diffraction from atomic planes to determine molecular structure. Crystal acts as a 3D grating with angstrom-scale spacing.",
      parts: [
        { label: "(a)", q: "NaCl ($d = 2.82$ Å) with Cu K$\\alpha$ ($\\lambda = 1.54$ Å). First-order Bragg angle?", a: "$\\sin\\theta = \\lambda/(2d) = 0.273$. $\\theta = 15.85°$." },
        { label: "(b)", q: "Maximum observable order?", a: "$m_{\\max} = \\lfloor 2d/\\lambda \\rfloor = 3$." },
        { label: "(c)", q: "With $N = 10^4$ planes, find resolving power and min $\\Delta d$.", a: "$R = mN = 10^4$. $\\Delta d = d/R = 2.82 \\times 10^{-4}$ Å." },
        { label: "(d)", q: "Why X-rays not visible light? Could electrons work? At what voltage?", a: "Visible $\\lambda \\gg$ atomic spacing. Electrons work: for $\\lambda = 1.54$ Å, $E = h^2/(2m_e\\lambda^2) \\approx 64$ eV." }
      ]
    },
    {
      title: "Resolving Binary Stars with Hubble",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Hubble_ultra_deep_field_high_rez_edit1.jpg/640px-Hubble_ultra_deep_field_high_rez_edit1.jpg",
      imageAlt: "Hubble Ultra Deep Field image",
      context: "HST has a 2.4 m primary mirror, diffraction-limited above the atmosphere.",
      parts: [
        { label: "(a)", q: "Diffraction-limited resolution at $\\lambda = 500$ nm.", a: "$\\theta_{\\min} = 1.22 \\times 500 \\times 10^{-9}/2.4 = 0.0524'' \\approx 0.05''$." },
        { label: "(b)", q: "Min separation for binary stars at 50 pc.", a: "$s = \\theta \\times D_{\\star} \\approx 2.62$ AU." },
        { label: "(c)", q: "Resolution at 1.6 $\\mu$m? Why observe IR anyway?", a: "$3.2\\times$ worse ($0.16''$). IR sees through dust and detects high-redshift objects." },
        { label: "(d)", q: "What fraction of light falls within the Airy disk?", a: "About 84% of total energy." }
      ]
    },
    {
      title: "Spectroscopy with a Diffraction Grating",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Fraunhofer_lines.svg/640px-Fraunhofer_lines.svg.png",
      imageAlt: "Solar Fraunhofer absorption lines",
      context: "Astronomical spectrographs use large gratings to reveal absorption lines, measuring stellar composition, temperature, and radial velocity.",
      parts: [
        { label: "(a)", q: "Grating: 600 lines/mm, 10 cm wide. Find $N$, $d$, and resolving power in 2nd order.", a: "$N = 60{,}000$. $d = 1.667\\;\\mu$m. $R = 120{,}000$. Resolves $\\Delta\\lambda = 0.0042$ nm at 500 nm." },
        { label: "(b)", q: "Can it resolve the Na D doublet (589.0, 589.6 nm) in first order?", a: "Need $R = 982$. First order gives $R = 60{,}000 \\gg 982$. Easily resolved." },
        { label: "(c)", q: "At what angle is Na D in 2nd order? Is 3rd order visible?", a: "$\\sin\\theta = 2(589)/(1667) = 0.707$, $\\theta = 45°$. 3rd order: $\\sin\\theta = 1.06 > 1$. Not visible." },
        { label: "(d)", q: "An iron line at 527.04 nm is measured at 527.09 nm. Star's radial velocity?", a: "$v = c \\times 0.05/527.04 = 28.5$ km/s, receding." }
      ]
    }
  ]
},

"quantum-mechanics": {
  readingQuiz: [
    { q: "What is the de Broglie wavelength?", a: "$\\lambda = h/p$." },
    { q: "What condition leads to energy quantization in a box?", a: "Boundary conditions (wavefunction = 0 at walls) restrict solutions to standing waves with discrete wavelengths." },
    { q: "Energy levels of a particle in a box?", a: "$E_n = n^2\\pi^2\\hbar^2/(2mL^2)$." },
    { q: "What is probability density?", a: "$|\\psi(x)|^2$, the probability per unit length of finding the particle at $x$." },
    { q: "State the uncertainty principle.", a: "$\\Delta x \\cdot \\Delta p \\geq \\hbar/2$." },
    { q: "What is quantum tunneling?", a: "Nonzero probability of passing through a barrier that would be classically forbidden." },
    { q: "Why is $n = 0$ not allowed?", a: "$\\psi = 0$ everywhere; the particle doesn't exist. Minimum is $n = 1$ (zero-point energy)." },
    { q: "How does energy level spacing change with $n$?", a: "Spacing grows linearly with $n$: $E_{n+1}-E_n = (2n+1)\\pi^2\\hbar^2/(2mL^2)$." },
    { q: "What is zero-point energy?", a: "Minimum energy $E_1 > 0$, required by the uncertainty principle for any confined particle." }
  ],
  shortAnswer: [
    { q: "De Broglie wavelength of (a) electron at $10^6$ m/s, (b) baseball (0.15 kg) at 40 m/s.", a: "(a) $0.727$ nm — comparable to atoms, diffraction observable. (b) $1.1 \\times 10^{-34}$ m — completely unobservable." },
    { q: "Electron in box $L = 0.5$ nm. Find $E_1$, $E_2$, $E_3$ in eV.", a: "$E_1 = 1.50$ eV, $E_2 = 6.02$ eV, $E_3 = 13.5$ eV." },
    { q: "Where are the nodes and probability maxima for $n = 2$?", a: "Nodes at $x = 0, L/2, L$. Probability maxima at $x = L/4$ and $3L/4$." },
    { q: "Use uncertainty principle to estimate min KE of electron in $\\Delta x = 1$ Å.", a: "$\\Delta p \\geq \\hbar/(2\\Delta x)$. $E \\sim (\\Delta p)^2/(2m_e) \\approx 0.95$ eV." },
    { q: "Tunneling through barrier $V_0 = 5$ eV, width 0.2 nm, particle energy 4 eV. Probability?", a: "$\\kappa = 5.12 \\times 10^9$ m$^{-1}$. $T \\approx e^{-2\\kappa w} = e^{-2.05} \\approx 13\\%$." }
  ],
  longProblems: [
    {
      title: "Quantum Dots for Display Technology",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/EFluor_Nanocrystal_Vials.jpg/640px-EFluor_Nanocrystal_Vials.jpg",
      imageAlt: "Quantum dot solutions glowing in different colors under UV light",
      context: "Quantum dots are semiconductor nanocrystals where electron confinement creates size-tunable energy levels. Smaller dots emit bluer light — enabling ultra-wide-gamut QLED displays.",
      parts: [
        { label: "(a)", q: "Cubic QD, $L = 6$ nm, $m^* = 0.1m_e$. Ground state energy?", a: "$E_{1,1,1} = 3\\pi^2\\hbar^2/(2m^*L^2) = 0.314$ eV." },
        { label: "(b)", q: "First excited state energy and degeneracy? Transition wavelength?", a: "$E_{2,1,1} = 0.628$ eV (3-fold degenerate). $\\Delta E = 0.314$ eV, $\\lambda = 3949$ nm (mid-IR)." },
        { label: "(c)", q: "With bulk bandgap $E_g = 1.75$ eV and hole mass $m_h^* = 0.4m_e$, find emission wavelength for $L = 6$ nm and $L = 4$ nm.", a: "6 nm: $E_{\\rm tot} = 2.14$ eV, $\\lambda = 579$ nm (yellow). 4 nm: $E_{\\rm tot} = 2.63$ eV, $\\lambda = 471$ nm (blue)." },
        { label: "(d)", q: "Use uncertainty principle to explain why smaller dots emit bluer.", a: "Smaller $L$ means larger $\\Delta p$, higher KE ($\\propto 1/L^2$), larger transition energy, shorter wavelength." }
      ]
    },
    {
      title: "Scanning Tunneling Microscope",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Atomic_resolution_Au100.JPG/640px-Atomic_resolution_Au100.JPG",
      imageAlt: "STM image of gold atoms on Au(100)",
      context: "The STM exploits tunneling current's exponential sensitivity to gap width ($I \\propto e^{-2\\kappa d}$) for atomic-resolution imaging.",
      parts: [
        { label: "(a)", q: "Gold work function $\\phi = 5.1$ eV. Calculate $\\kappa$.", a: "$\\kappa = \\sqrt{2m_e\\phi}/\\hbar = 11.57$ nm$^{-1}$." },
        { label: "(b)", q: "At $d = 0.8$ nm, find tunneling factor. How does current change for 0.1 nm gap increase?", a: "$e^{-18.51} \\approx 9 \\times 10^{-9}$. A 0.1 nm increase reduces current by factor $\\sim 10$." },
        { label: "(c)", q: "Atomic corrugations of 0.02 nm. Percentage change in current?", a: "$e^{0.463} = 1.59$. A 37% decrease — easily measurable." },
        { label: "(d)", q: "Why does STM only work on conductors?", a: "Tunneling current requires conducting sample. Insulators can't support electron flow. AFM was developed to image non-conductors using force instead of current." }
      ]
    },
    {
      title: "Alpha Decay as Quantum Tunneling",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Alpha_Decay.svg/640px-Alpha_Decay.svg.png",
      imageAlt: "Alpha particle tunneling through Coulomb barrier",
      context: "Alpha decay was among the first phenomena explained by tunneling. The alpha particle inside the nucleus lacks the energy to classically overcome the Coulomb barrier, but tunnels through with exponentially small probability.",
      parts: [
        { label: "(a)", q: "For $^{238}$U: alpha KE = 4.27 MeV, daughter $Z = 90$. Calculate Coulomb barrier height at nuclear surface ($R = 7.4$ fm).", a: "$V_0 = kZze^2/R \\approx 35$ MeV, far above the alpha energy." },
        { label: "(b)", q: "Find the classical turning point and barrier width.", a: "$r_2 = V_0 R/E = 60.7$ fm. Width $= r_2 - R = 53.3$ fm." },
        { label: "(c)", q: "Estimate the tunneling exponent $G$ and probability.", a: "With $V_{\\rm avg} \\approx V_0/3$: $G \\approx 127$. $T \\approx e^{-127} \\approx 10^{-55}$." },
        { label: "(d)", q: "Estimate collision rate and half-life. Compare to known $4.5 \\times 10^9$ yr.", a: "Collision rate $\\sim 10^{21}$ s$^{-1}$. Crude $t_{1/2} \\sim 10^{26}$ yr (too long — proper WKB gives $\\sim 10^9$ yr). Tiny changes in $G$ produce huge half-life changes (Geiger-Nuttall law)." }
      ]
    }
  ]
},

"doppler-effect": {
  readingQuiz: [
    { q: "What is the Doppler effect?", a: "The change in observed frequency when source and observer are in relative motion." },
    { q: "Source approaching at $v_s$. Observed frequency?", a: "$f' = fv/(v-v_s)$ (increases)." },
    { q: "Observer approaching at $v_o$. Observed frequency?", a: "$f' = f(v+v_o)/v$ (increases)." },
    { q: "Same shift for moving source vs moving observer?", a: "No for sound (medium defines preferred frame). Yes for light (only relative motion matters)." },
    { q: "Relativistic Doppler for source receding?", a: "$f' = f\\sqrt{(1-\\beta)/(1+\\beta)}$." },
    { q: "What is cosmological redshift?", a: "Wavelength stretching from universe expansion: $z = \\Delta\\lambda/\\lambda_0$." },
    { q: "How does Doppler radar work?", a: "Measures frequency shift of reflected signal to determine target speed." },
    { q: "What does Doppler ultrasound measure?", a: "Blood flow velocity from frequency shift of ultrasound reflected by red blood cells." }
  ],
  shortAnswer: [
    { q: "Fire truck siren at 750 Hz, speed 30 m/s. Frequency approaching and receding?", a: "Approaching: $750 \\times 343/313 = 822$ Hz. Receding: $750 \\times 343/373 = 690$ Hz." },
    { q: "Derive the general Doppler formula for both source and observer moving.", a: "$f' = f(v+v_o)/(v-v_s)$, with appropriate sign conventions." },
    { q: "Galaxy at $z = 0.1$. Recession velocity (non-relativistic and relativistic)?", a: "Non-rel: $v = 0.1c = 30{,}000$ km/s. Rel: $\\beta = 0.095$, $v = 28{,}500$ km/s. ~5% difference." },
    { q: "Police radar at 10.5 GHz, $\\Delta f = 1850$ Hz. Car speed?", a: "$v = c\\Delta f/(2f) = 26.4$ m/s $= 95$ km/h." },
    { q: "5 MHz ultrasound, blood at 0.5 m/s, beam angle 60°. Doppler shift?", a: "$\\Delta f = 2fv_b\\cos\\theta/v_{\\rm sound} = 1623$ Hz (audible)." },
    { q: "CMB emitted at ~3000 K, now at 2.725 K. Redshift?", a: "$z = T_{\\rm emit}/T_{\\rm obs} - 1 \\approx 1100$." }
  ],
  longProblems: [
    {
      title: "Exoplanet Detection via Radial Velocity",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Doppler_Shift_vs_Time.png/640px-Doppler_Shift_vs_Time.png",
      imageAlt: "Periodic Doppler velocity variations of a star indicating an orbiting exoplanet",
      context: "The radial velocity method detects exoplanets by measuring tiny Doppler shifts in stellar spectra. Modern spectrographs detect variations as small as 1 m/s.",
      parts: [
        { label: "(a)", q: "Sun-like star orbited by Jupiter ($M_p = 1.9 \\times 10^{27}$ kg) at 5.2 AU. Star's wobble velocity?", a: "$v_p = 13.1$ km/s. $v_\\star = M_p v_p/M_\\star = 12.4$ m/s." },
        { label: "(b)", q: "Max Doppler shift of Na D line (589 nm)?", a: "$\\Delta\\lambda = \\lambda v_\\star/c = 0.024$ pm. Requires resolving power $R \\sim 2.4 \\times 10^7$." },
        { label: "(c)", q: "Hot Jupiter at 0.05 AU instead. Wobble velocity and orbital period?", a: "$v_\\star = 127$ m/s. $P = 4.07$ days. Much easier to detect." },
        { label: "(d)", q: "51 Peg b: $K = 55.9$ m/s, $P = 4.23$ days. Minimum planet mass?", a: "$M_p\\sin i \\approx 0.45 M_J$ from Kepler's law and $K = v_\\star \\sin i$." }
      ]
    },
    {
      title: "Doppler Ultrasound in Cardiovascular Medicine",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/41/Doppler_mitral_valve.gif",
      imageAlt: "Doppler ultrasound of blood flow through the mitral valve",
      context: "Doppler ultrasound measures blood flow velocities non-invasively, essential for diagnosing cardiovascular conditions. $v_{\\rm sound} = 1540$ m/s in tissue.",
      parts: [
        { label: "(a)", q: "Cardiac probe at 3.5 MHz, aortic blood at 1.2 m/s, beam angle 45°. Find $\\Delta f$.", a: "$\\Delta f = 2 \\times 3.5 \\times 10^6 \\times 1.2 \\times \\cos 45°/1540 = 3856$ Hz (audible)." },
        { label: "(b)", q: "Aortic stenosis increases $\\Delta f$ to 12.8 kHz. Blood velocity?", a: "$v_b = 4.0$ m/s, more than tripled." },
        { label: "(c)", q: "Using modified Bernoulli ($\\Delta P = 4v^2$ mmHg), estimate pressure gradient.", a: "$\\Delta P = 63.4$ mmHg. Severe aortic stenosis (>40 mmHg threshold)." },
        { label: "(d)", q: "Why is beam angle critical? What happens near 90°?", a: "$\\cos 90° = 0$: no shift detected. Above 60°, small angle errors cause large velocity errors ($\\delta v/v = \\tan\\theta \\cdot \\delta\\theta$)." },
        { label: "(e)", q: "Pulsed Doppler Nyquist limit: $v_{\\max} = v \\cdot \\text{PRF}/(4f_0\\cos\\theta)$. For PRF = 8 kHz?", a: "$v_{\\max} = 1.24$ m/s. Stenotic flow (4 m/s) causes aliasing. Solutions: increase PRF, lower $f$, use continuous-wave Doppler." }
      ]
    },
    {
      title: "Measuring Universe Expansion with Supernovae",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Hubble_ultra_deep_field_high_rez_edit1.jpg/640px-Hubble_ultra_deep_field_high_rez_edit1.jpg",
      imageAlt: "Hubble Deep Field showing distant galaxies",
      context: "Cosmological redshift from Type Ia supernovae revealed the accelerating expansion of the universe (2011 Nobel Prize). Hubble's law: $v = H_0 d$.",
      parts: [
        { label: "(a)", q: "Galaxy with H$\\alpha$ at 696.3 nm instead of 656.3 nm. Find $z$ and velocity.", a: "$z = 0.061$. Non-rel: $v = 18{,}300$ km/s. Rel: $v = 17{,}700$ km/s." },
        { label: "(b)", q: "Distance using $H_0 = 70$ km/s/Mpc?", a: "$d = 261$ Mpc $\\approx 850$ million light-years." },
        { label: "(c)", q: "Supernova at $z = 0.5$. Wavelength ratio? Time dilation of 20-day light curve?", a: "All wavelengths stretched by $1.5$. Light curve appears to last $30$ days." },
        { label: "(d)", q: "Most distant galaxy at $z \\approx 13$. Scale factor? Age of universe when light was emitted?", a: "$a = 1/14 = 0.071$ (7.1% of current size). $t \\approx 13.8/(14)^{3/2} \\approx 263$ Myr after the Big Bang." }
      ]
    }
  ]
}

};
