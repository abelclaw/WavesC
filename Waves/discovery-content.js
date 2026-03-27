// Guided Discovery steps for each chapter (keyed by chapter slug)
// Each step: { question, tryThis, reveal, interactive? (optional override) }

const discoverySteps = {
  "oscillators-linearity": [
    {
      question: "Does pulling the mass further from equilibrium change how fast it oscillates?",
      tryThis: "Drag the mass to different starting positions — small displacement, then large. Watch the period.",
      reveal: "The period stays the same regardless of amplitude. This is the hallmark of simple harmonic motion: the restoring force is proportional to displacement, so doubling the pull doubles the force, and the mass covers the extra distance in the same time.",
      interactive: "shm-spring"
    },
    {
      question: "If you double the spring constant, what happens to the frequency?",
      tryThis: "Set m = 1 and slowly increase k from 2 to 8. Watch the displayed frequency.",
      reveal: "The frequency goes up, but not by a factor of 2 — it goes up by √2. The frequency is ω = √(k/m), so stiffer springs give higher pitch, but only as the square root. This is why piano strings are much stiffer for high notes but not proportionally so.",
      interactive: "shm-spring"
    },
    {
      question: "What happens to an oscillator when you add friction?",
      tryThis: "Start with low damping (γ ≈ 0.2) and watch the motion. Then crank γ up to 2, then to 5. What changes?",
      reveal: "At low damping the mass oscillates with a slowly shrinking envelope. As γ increases, the envelope decays faster. Above γ = 2ω₀ (critical damping), the mass doesn't oscillate at all — it just oozes back to rest. This is the overdamped regime, and it's how a door closer works.",
      interactive: "damped-oscillator"
    },
    {
      question: "The three damping regimes — underdamped, critically damped, and overdamped — which returns to rest fastest?",
      tryThis: "Compare the three regimes side by side. Which one reaches x ≈ 0 first?",
      reveal: "Critical damping wins. Underdamped oscillates past zero (overshoots), wasting time. Overdamped is sluggish because there's so much friction. Critical damping is the sweet spot — fastest return to equilibrium with no overshoot. That's why car suspensions are tuned near critical damping.",
      interactive: "damping-regimes"
    }
  ],

  "driven-oscillators": [
    {
      question: "What happens when you push an oscillator at exactly its natural frequency?",
      tryThis: "Set ω₀ = 5 and γ = 0.2 (low damping). Now sweep ω_d slowly from 1 up to 5. Watch the amplitude on the right panel.",
      reveal: "The amplitude explodes as ω_d approaches ω₀ — this is resonance. The driving force is perfectly in sync with the natural motion, so every push adds energy. Only damping prevents infinite amplitude. This is how a singer can shatter a wine glass.",
      interactive: "driven-oscillator"
    },
    {
      question: "How does damping affect the resonance peak?",
      tryThis: "Keep ω₀ = 5 and ω_d = 5 (at resonance). Now increase γ from 0.2 to 1 to 3. Watch the peak height change.",
      reveal: "More damping means a shorter, wider resonance peak. The peak amplitude is proportional to 1/γ, and the width of the peak is proportional to γ. The quality factor Q = ω₀/γ tells you how sharp the resonance is. A tuning fork has Q ≈ 1000; a wet sponge has Q ≈ 1.",
      interactive: "driven-oscillator"
    },
    {
      question: "Does the oscillator respond at its own natural frequency, or at the driving frequency?",
      tryThis: "Set ω₀ = 5 but drive at ω_d = 3. Watch the motion in the left panel — count the oscillations and compare to the drive.",
      reveal: "In steady state, the oscillator responds at the driving frequency ω_d, not at ω₀. The natural frequency determines how strongly it responds (amplitude peaks at ω₀), but the rhythm is always set by the driver. This is a common exam trap.",
      interactive: "driven-oscillator"
    },
    {
      question: "What happens right after you start driving — before steady state?",
      tryThis: "Hit Restart and watch closely. The initial motion looks messy before settling into a clean oscillation. Try different ω_d values.",
      reveal: "The early motion is a superposition of the transient (at ω₀, decaying) and the steady-state (at ω_d, constant). The transient dies away at a rate set by γ, leaving only the driven response. The beating pattern you see is the interference between these two frequencies.",
      interactive: "transient-decay"
    }
  ],

  "coupled-oscillators": [
    {
      question: "If you pull one mass and release it, does the other mass eventually start moving?",
      tryThis: "Displace mass 1 to the right while mass 2 stays at rest. Watch what happens over 10–20 seconds.",
      reveal: "Energy flows from mass 1 to mass 2 and back. The coupling spring transfers momentum between them. At some point mass 1 is nearly still while mass 2 swings with full amplitude — then the cycle reverses. This is the beat phenomenon in coupled oscillators.",
      interactive: "coupled-oscillators"
    },
    {
      question: "Can both masses move in a pattern that never changes shape?",
      tryThis: "Click the normal mode buttons. In mode 1, both masses move together. In mode 2, they move in opposite directions. Notice: neither mode transfers energy between the masses.",
      reveal: "Normal modes are the special initial conditions where every part of the system oscillates at the same frequency. In mode 1 (symmetric), the coupling spring is never stretched, so the frequency equals a single mass on its wall springs. In mode 2 (antisymmetric), the coupling spring is maximally active, raising the frequency. Any motion is a sum of these two modes.",
      interactive: "normal-modes"
    },
    {
      question: "Where do beats come from in coupled oscillators?",
      tryThis: "Watch the beat pattern. The amplitude envelope of each mass rises and falls. Can you relate the beat frequency to the two normal mode frequencies?",
      reveal: "Beats arise because the two normal modes have slightly different frequencies ω₁ and ω₂. When you start with only one mass moving, both modes are equally excited. They go in and out of phase at the beat frequency (ω₂ − ω₁)/2. The closer the two normal mode frequencies, the slower the energy transfer.",
      interactive: "beats"
    }
  ],

  "oscillators-to-waves": [
    {
      question: "What do the normal modes of 2 masses on springs look like?",
      tryThis: "Click through the modes. With 2 masses, there are exactly 2 modes. Notice the shape of each mode — one is a half-arch, the other is a full arch with a node in the middle.",
      reveal: "N masses give N normal modes. Each mode has a sinusoidal shape with n half-wavelengths fitting between the walls. The first mode (n=1) has no internal nodes; the second (n=2) has one node. These discrete mode shapes are the seeds of standing waves.",
      interactive: "two-mass-normal-modes"
    },
    {
      question: "As you add more masses to the chain, what happens to the mode shapes?",
      tryThis: "Go from 3 masses to 8 to 20. Watch how the mode shapes become smoother. Toggle between different mode numbers.",
      reveal: "As N grows, the discrete masses begin to look like a continuous string. The mode shapes approach perfect sine curves. This is the continuum limit — discrete coupled oscillators become a wave. The jump from 'many oscillators' to 'a wave' is not a new idea; it's the same normal modes, just with more of them.",
      interactive: "n-mass-chain"
    },
    {
      question: "Is there a maximum frequency in a chain of masses?",
      tryThis: "Look at the dispersion relation. What happens to the frequency as the mode number approaches N? Compare this to a continuous string.",
      reveal: "Yes — the discrete chain has a frequency ceiling at ω = 2√(k/m). This happens because adjacent masses can't oscillate faster than the spring between them can respond. A continuous string has no such cutoff. This discrete cutoff is why crystals have a maximum phonon frequency (the Debye frequency).",
      interactive: "dispersion-relation-discrete"
    },
    {
      question: "What's the difference between a traveling wave and a standing wave?",
      tryThis: "Toggle between traveling and standing wave views. Watch where the nodes are in the standing wave. In the traveling wave, does any point stay permanently at rest?",
      reveal: "A standing wave has fixed nodes where the displacement is always zero. A traveling wave has no fixed nodes — every point oscillates. The key insight: a standing wave is two traveling waves going in opposite directions. They interfere constructively at antinodes and destructively at nodes.",
      interactive: "traveling-vs-standing"
    }
  ],

  "fourier-series": [
    {
      question: "Can you build a square wave out of sine waves?",
      tryThis: "Start with just the fundamental (N=1). Add harmonics one by one — 3rd, 5th, 7th. Watch how the sum gets closer to a square wave.",
      reveal: "A square wave is the sum of odd harmonics: sin(x) + sin(3x)/3 + sin(5x)/5 + ... Each harmonic fills in the flat top and steepens the edges. You never get a perfect square wave with finitely many terms — the overshoot near the edges (Gibbs phenomenon) persists at about 9% no matter how many harmonics you add.",
      interactive: "fourier-decomposition"
    },
    {
      question: "What does a sawtooth wave's Fourier series look like?",
      tryThis: "Watch how the sawtooth builds up from harmonics. Unlike the square wave, does it use all harmonics or only odd ones?",
      reveal: "The sawtooth uses all harmonics: sin(x) − sin(2x)/2 + sin(3x)/3 − ... The symmetry of the wave determines which harmonics appear. Symmetric waves (like square waves) have only odd harmonics. Asymmetric waves (like sawtooth) need all of them. This connection between symmetry and spectral content is fundamental.",
      interactive: "fourier-sawtooth"
    },
    {
      question: "When you pluck a guitar string at different points, why does the sound change?",
      tryThis: "Pluck the string at the center, then at 1/4 of the way along. Compare the harmonic content displayed below.",
      reveal: "Plucking at the center suppresses even harmonics (because the center is a node of mode 2, 4, 6...) giving a mellow tone. Plucking near the end excites many high harmonics, giving a brighter, sharper sound. The pluck position is a spatial filter on the Fourier spectrum. Classical guitarists use this instinctively.",
      interactive: "plucked-string"
    }
  ],

  "waves": [
    {
      question: "When a wave travels along a string, do the individual pieces of string travel with it?",
      tryThis: "Watch the colored dots on the string as the wave passes. Do they move horizontally (with the wave) or vertically (up and down)?",
      reveal: "The dots move only up and down — they don't travel with the wave. The wave is a pattern of displacement that moves, not the medium itself. This is the crucial distinction between the phase velocity (how fast the pattern moves) and the actual motion of the medium (transverse oscillation in place).",
      interactive: "string-transverse-wave"
    },
    {
      question: "How is a sound wave different from a wave on a string?",
      tryThis: "Compare the string wave (transverse) with the sound wave (longitudinal). In the sound wave, watch how the dots bunch up and spread apart.",
      reveal: "In a transverse wave, the medium moves perpendicular to the wave direction. In a longitudinal sound wave, the medium moves parallel — creating compressions (dots bunch up) and rarefactions (dots spread out). Despite looking different, both obey the same wave equation. The restoring force is tension for strings and pressure for sound.",
      interactive: "sound-wave-longitudinal"
    },
    {
      question: "What happens when a wave hits a fixed wall versus a free end?",
      tryThis: "Send a pulse toward a fixed boundary, then switch to a free boundary. Watch the reflected pulse carefully — is it flipped or not?",
      reveal: "At a fixed end, the reflected pulse comes back inverted (upside down). At a free end, it comes back upright. The fixed end must have zero displacement, so the reflected wave must cancel the incoming wave at that point — which requires opposite sign. The free end must have zero slope, so the reflected wave reinforces.",
      interactive: "boundary-conditions-demo"
    },
    {
      question: "Why do only certain frequencies produce standing waves on a string?",
      tryThis: "Sweep the frequency. Most frequencies produce messy, small-amplitude motion. At specific frequencies, the amplitude jumps dramatically. Find the first three resonant frequencies.",
      reveal: "Standing waves form only when an integer number of half-wavelengths fit between the boundaries: L = nλ/2. At these special frequencies, the reflected wave constructively interferes with the incoming wave, building up a large amplitude. These are the harmonics: f_n = n·v/(2L). Everything between is destructive interference.",
      interactive: "standing-wave-modes"
    }
  ],

  "music": [
    {
      question: "Why do some pairs of notes sound pleasant together and others grating?",
      tryThis: "Play a perfect fifth (frequency ratio 3:2) and listen. Then play a tritone (ratio 45:32). What's different about the sound?",
      reveal: "Consonant intervals have simple frequency ratios (2:1, 3:2, 4:3). Their harmonics align, reinforcing each other. Dissonant intervals have complex ratios, so their harmonics produce audible beats — that wobbling, clashing sensation. Consonance is literally harmonic alignment; dissonance is harmonic interference.",
      interactive: "consonance-dissonance"
    },
    {
      question: "What makes a piano sound different from a violin playing the same note?",
      tryThis: "Compare the spectra of different instruments playing the same pitch. Look at which harmonics are present and how strong they are.",
      reveal: "Same pitch means same fundamental frequency, but instruments differ in their harmonic recipe — the relative amplitudes of the overtones. A clarinet emphasizes odd harmonics (like a closed tube). A violin has a rich full spectrum. A flute is nearly pure fundamental. This recipe is called timbre, and it's what your ear uses to identify instruments.",
      interactive: "violin-spectrum"
    },
    {
      question: "Why are there 12 notes in an octave?",
      tryThis: "Explore the circle of fifths. Starting from C, go up by perfect fifths (×3/2) repeatedly. After how many steps do you land close to where you started?",
      reveal: "After 12 perfect fifths you almost return to the starting note (2^19/3^12 ≈ 1.014 — close but not exact). Twelve is the smallest number of fifths that nearly closes the circle. Equal temperament cheats slightly by making each semitone exactly 2^(1/12), so every key sounds equally good (and equally imperfect). The Pythagorean comma is the price of this compromise.",
      interactive: "circle-of-fifths"
    }
  ],

  "fourier-transforms": [
    {
      question: "What does a short pulse look like in frequency space? What about a long tone?",
      tryThis: "Start with a long-duration oscillation and look at its Fourier transform. Then shorten the duration. Watch what happens to the frequency peak.",
      reveal: "A long tone has a narrow, sharp peak in frequency space — it's almost a single frequency. A short pulse has a broad spectrum — it contains many frequencies. This is the uncertainty principle for waves: Δt · Δω ≥ 1/2. You can't have both a short signal and a narrow spectrum. This same principle shows up in quantum mechanics.",
      interactive: "fourier-transform-derivation"
    },
    {
      question: "What does the Fourier transform of a damped oscillation look like?",
      tryThis: "Adjust the damping rate. With very light damping (long ring-down), the frequency peak is narrow. With heavy damping (quick decay), the peak broadens.",
      reveal: "A damped oscillation e^(−γt/2)cos(ω₀t) transforms to a Lorentzian: a peak centered at ω₀ with width γ. The width of the spectral line tells you the decay rate. This is why atomic spectral lines have natural linewidths — the excited state decays, and Δω ~ 1/lifetime.",
      interactive: "underdamped-fourier-transform"
    },
    {
      question: "Can you filter out noise from a signal by removing certain frequencies?",
      tryThis: "Look at a noisy signal. Apply the low-pass filter and watch the high-frequency noise disappear. Try the band-pass filter — what survives?",
      reveal: "Fourier filtering works because noise often lives at different frequencies than the signal. Multiply the spectrum by zero in the noisy region and transform back. Low-pass keeps only slow variations; band-pass keeps only a chosen range. This is exactly how noise-canceling headphones and radio receivers work.",
      interactive: "fourier-filtering"
    }
  ],

  "reflection-impedance": [
    {
      question: "When a wave pulse hits a junction between a light string and a heavy string, what happens?",
      tryThis: "Send a pulse from the light string into the heavy string. Watch for a reflected pulse and a transmitted pulse. How do their amplitudes compare to the original?",
      reveal: "Part of the pulse reflects and part transmits. Going from light to heavy (low Z to high Z), the reflected pulse is inverted and smaller, while the transmitted pulse is upright but shorter. The impedance mismatch determines the split. If Z₁ = Z₂, there's no reflection at all — perfect transmission.",
      interactive: "string-junction"
    },
    {
      question: "What is impedance, physically?",
      tryThis: "Compare how the wave behaves in different media. A heavy string (high impedance) versus a light string (low impedance). Which one is harder to shake?",
      reveal: "Impedance Z = force/velocity for a given wave amplitude. A high-impedance medium is 'stiff' — it takes more force to get the same velocity. When a wave hits a boundary between mismatched impedances, the medium can't smoothly hand off the energy, so some bounces back. Impedance is the medium's personality from the wave's point of view.",
      interactive: "mass-collision-impedance"
    },
    {
      question: "Can you eliminate reflections by choosing the right properties for the second medium?",
      tryThis: "Adjust the impedance of medium 2 until it matches medium 1. What happens to the reflected wave?",
      reveal: "When Z₁ = Z₂, the reflection coefficient R = (Z₂ − Z₁)/(Z₂ + Z₁) = 0. All energy transmits, none reflects. This is impedance matching — the principle behind anti-reflection coatings on lenses, the design of audio speaker enclosures, and why electrical cables have characteristic impedance ratings.",
      interactive: "string-junction"
    }
  ],

  "power": [
    {
      question: "Where is the energy in a wave — at the crests, the nodes, or everywhere?",
      tryThis: "Watch the energy indicators on the traveling wave. Are they uniform or do they vary along the wave?",
      reveal: "In a traveling wave, energy density is uniform when averaged over a cycle — every part of the medium carries the same average energy. But in a standing wave, energy sloshes between kinetic (at nodes of displacement where velocity is maximum) and potential (at antinodes where displacement is maximum). The key formula: power = impedance × (velocity)².",
      interactive: "wave-energy-string"
    },
    {
      question: "How much power is reflected versus transmitted at a boundary?",
      tryThis: "Adjust the impedance ratio Z₂/Z₁ from 0.5 to 1 to 3. Watch how the reflected and transmitted power fractions change.",
      reveal: "The reflected power fraction is R² = ((Z₂−Z₁)/(Z₂+Z₁))². At Z₂/Z₁ = 1, nothing reflects. At extreme mismatches (Z₂ >> Z₁ or Z₂ << Z₁), almost everything reflects. The transmitted fraction is always 1 − R². Energy is conserved: what doesn't reflect must transmit.",
      interactive: "power-reflection-transmission"
    },
    {
      question: "Why do we measure sound in decibels instead of watts?",
      tryThis: "Explore the decibel scale. Compare 20 dB, 40 dB, and 60 dB. How many times more powerful is 60 dB than 20 dB?",
      reveal: "60 dB is 10,000× more powerful than 20 dB (each 10 dB is ×10 in power). We use a log scale because human hearing spans 12 orders of magnitude — from a pin drop (~10 dB) to a jet engine (~140 dB). A linear scale would be useless. Every 3 dB doubles the power; every 10 dB multiplies it by 10.",
      interactive: "decibel-scale"
    }
  ],

  "wavepackets": [
    {
      question: "How do you make a localized pulse out of infinite sine waves?",
      tryThis: "Watch the Gaussian wavepacket. It's localized in space but made of many frequencies. Adjust the width — what happens in frequency space?",
      reveal: "A wavepacket is a superposition of many frequencies with a Gaussian (bell-curve) envelope in frequency space. A narrow packet in space requires a wide spread of frequencies, and vice versa. This is the position-momentum uncertainty relation: Δx · Δk ≥ 1/2.",
      interactive: "gaussian-wavepacket"
    },
    {
      question: "Does the wavepacket's envelope move at the same speed as the individual wave crests?",
      tryThis: "Watch the wavepacket carefully. The individual ripples (carrier wave) move at one speed. The overall envelope moves at a different speed. Which is faster?",
      reveal: "The crests move at the phase velocity v_p = ω/k, but the envelope (carrying the information) moves at the group velocity v_g = dω/dk. In a dispersive medium these differ. The group velocity is what matters for signal transmission — it's the speed at which energy and information travel.",
      interactive: "gaussian-wavepacket"
    },
    {
      question: "Why does a wavepacket spread out as it travels in a dispersive medium?",
      tryThis: "Enable dispersion and watch the wavepacket evolve. Compare dispersive vs. non-dispersive. How does the packet's shape change over time?",
      reveal: "In a dispersive medium, different frequencies travel at different speeds. The high-frequency components in the packet outrun (or lag behind) the low-frequency ones, stretching the packet out. This is why a sharp lightning crack becomes a rolling rumble over long distances — the different frequency components arrive at different times.",
      interactive: "wavepacket-dispersion"
    }
  ],

  "wave-phenomena": [
    {
      question: "Does a wave transport matter, or just energy?",
      tryThis: "Watch the individual particles as the wave passes through. Do they end up in a different position after the wave passes?",
      reveal: "Waves transport energy without transporting matter. Each particle oscillates around its equilibrium position and returns. An ocean wave moves energy across the sea, but the water itself mostly stays put (ask any surfer who paddles out and doesn't end up on the other shore). The energy moves; the medium doesn't.",
      interactive: "wave-transport-energy"
    },
    {
      question: "Can you tell the difference between a transverse wave and a longitudinal wave?",
      tryThis: "Compare the two types side by side. Watch the particle motion in each. Which direction do the particles move relative to the wave's travel direction?",
      reveal: "In transverse waves (like string waves and light), particles move perpendicular to the wave direction. In longitudinal waves (like sound), particles move parallel, creating compressions and rarefactions. Some media support both (solids); others support only longitudinal (fluids, because they can't sustain shear). This is how seismologists know Earth's outer core is liquid.",
      interactive: "transverse-longitudinal-demo"
    },
    {
      question: "Why does sound bend upward on a cold night?",
      tryThis: "Observe how sound waves refract in the atmosphere. On a cold night, the ground is cold and the air above is warmer. Which way do the wavefronts bend?",
      reveal: "Sound travels faster in warm air. On a cold night with a temperature inversion (warm air above cold), the upper part of the wavefront moves faster, bending the wave back down toward the ground. This is why you can hear conversations across a lake on a still night — the sound that would normally escape upward gets refracted back to you.",
      interactive: "sound-refraction-atmosphere"
    }
  ],

  "light": [
    {
      question: "How do the electric and magnetic fields in a light wave relate to each other?",
      tryThis: "Watch the EM plane wave. Notice the E and B field arrows. Are they in phase? Are they parallel?",
      reveal: "E and B are perpendicular to each other and both perpendicular to the direction of travel. They oscillate in phase — when E is maximum, B is maximum. Their magnitudes are locked: E = cB. Neither field can exist without the other in a wave — a changing E creates B, and a changing B creates E. This self-sustaining dance is what lets light travel through vacuum.",
      interactive: "em-plane-wave"
    },
    {
      question: "What determines the speed of light?",
      tryThis: "Look at the relationship between the electric and magnetic fields. The speed c appears in how E and B regenerate each other.",
      reveal: "Maxwell showed that c = 1/√(μ₀ε₀), where μ₀ and ε₀ are the magnetic permeability and electric permittivity of free space. These are constants you measure with capacitors and inductors on a lab bench — no light involved. Yet when you plug them in, you get exactly the speed of light. This was the thunderclap: light is an electromagnetic wave.",
      interactive: "em-plane-wave"
    },
    {
      question: "How does the electromagnetic spectrum span from radio to gamma rays?",
      tryThis: "Explore the full EM spectrum. Notice that all electromagnetic waves travel at the same speed c. What changes is the frequency (and wavelength).",
      reveal: "Radio waves, microwaves, infrared, visible light, UV, X-rays, and gamma rays are all the same phenomenon — oscillating E and B fields. They differ only in frequency. Visible light occupies a tiny sliver (400–700 nm) that evolution tuned our eyes to detect because that's where the Sun's emission peaks.",
      interactive: "em-spectrum"
    }
  ],

  "polarization": [
    {
      question: "What does it mean for light to be polarized?",
      tryThis: "Switch between linear and circular polarization. Watch how the electric field vector behaves in each case.",
      reveal: "Polarization is the direction the E-field oscillates. In linear polarization, E vibrates in one fixed plane. In circular polarization, E rotates as the wave propagates, tracing out a helix. Unpolarized light has E pointing in random directions — sunlight is unpolarized, but reflected glare off water is partially polarized (which is why polarized sunglasses work).",
      interactive: "em-polarization"
    },
    {
      question: "If you stack two polarizers at 90°, no light gets through. Can you sneak light through by adding a third polarizer between them?",
      tryThis: "Start with crossed polarizers (0° and 90°). Now insert a polarizer at 45° between them. What happens to the transmitted intensity?",
      reveal: "Yes! With the 45° polarizer inserted, light gets through. The first polarizer passes the 0° component. The 45° polarizer projects this onto its axis, passing cos²(45°) = 50%. The final 90° polarizer then passes cos²(45°) = 50% of that. Result: 25% of the original intensity gets through three polarizers, compared to 0% with two. Adding an obstacle actually increases transmission — deeply counterintuitive.",
      interactive: "malus-law"
    },
    {
      question: "How do 3D movie glasses work?",
      tryThis: "Explore how circular polarization separates the left-eye and right-eye images. What happens if you tilt your head with linear vs. circular polarization?",
      reveal: "Modern 3D glasses use circular polarization. The left-eye image is projected with left-circular polarization and the right-eye image with right-circular. Each lens blocks one handedness. Unlike linear polarization, this works even if you tilt your head — the handedness doesn't change with rotation. Older 3D systems using linear polarization failed if you tilted your head.",
      interactive: "3d-movie-glasses"
    }
  ],

  "refraction": [
    {
      question: "Why does light bend when it enters glass?",
      tryThis: "Send a ray from air into glass at an angle. Watch how the wavefronts change at the boundary. Does the wavelength change? Does the frequency?",
      reveal: "Light slows down in glass, but the frequency can't change (the wave must oscillate at the same rate on both sides of the boundary). So the wavelength must shrink: λ = v/f. The wavefronts hitting the boundary at an angle means one side slows down before the other, pivoting the beam. Snell's law n₁sin θ₁ = n₂sin θ₂ is just geometry of matching wavefronts.",
      interactive: "snells-law-demo"
    },
    {
      question: "Is there an angle where light can't escape from glass into air?",
      tryThis: "Increase the angle of incidence inside the glass. At some critical angle, the refracted ray bends to 90° — parallel to the surface. Go beyond that angle.",
      reveal: "Beyond the critical angle θ_c = arcsin(n₂/n₁), total internal reflection occurs — all light bounces back, none escapes. This is how fiber optics work: light bounces along the inside of a glass fiber, trapped by total internal reflection. Diamonds sparkle because their high index (n=2.42) gives a small critical angle, trapping light inside for multiple reflections.",
      interactive: "total-internal-reflection"
    },
    {
      question: "How do the colorful patterns on a soap bubble form?",
      tryThis: "Adjust the film thickness. Watch the reflected color change. At certain thicknesses, specific wavelengths are strongly reflected.",
      reveal: "Light reflects from both the top and bottom surfaces of the thin film. These two reflections interfere — constructively for wavelengths where the round-trip path equals an integer number of wavelengths, destructively otherwise. As the film thickness varies (gravity thins it at the top), different colors are enhanced at different heights, creating the rainbow pattern.",
      interactive: "thin-film-interference"
    }
  ],

  "prisms": [
    {
      question: "Why does a prism separate white light into colors?",
      tryThis: "Watch white light enter the prism. Each color exits at a different angle. Which color bends the most?",
      reveal: "Glass has dispersion — its index of refraction varies with wavelength. Blue/violet light has a higher index than red, so it bends more. A prism bends all colors, but by different amounts, fanning them out into a spectrum. This is the same reason diamonds have 'fire' — strong dispersion creates vivid color separation.",
      interactive: "prism-dispersion"
    },
    {
      question: "Why is the sky blue and sunsets red?",
      tryThis: "Explore Rayleigh scattering. Watch how the scattering intensity depends on wavelength. Which end of the spectrum scatters more?",
      reveal: "Rayleigh scattering intensity goes as 1/λ⁴ — blue light (short wavelength) scatters about 10× more than red. Looking away from the Sun, you see scattered light, which is preferentially blue. At sunset, sunlight travels through much more atmosphere, scattering away most blue and leaving red/orange. The same physics explains why the ocean is blue when seen from space.",
      interactive: "rayleigh-scattering"
    },
    {
      question: "What is the refractive index at a microscopic level?",
      tryThis: "Watch how atoms in the medium respond to the incoming light wave. The electrons oscillate and re-radiate. How does this slow down the wave?",
      reveal: "Each atom's electrons act as driven oscillators, absorbing and re-emitting the wave with a slight phase delay. The superposition of the original wave and all the re-emitted waves creates a new wave that appears to travel slower — this apparent slowing is the refractive index. Near an atomic resonance, the index changes rapidly (anomalous dispersion).",
      interactive: "microscopic-index"
    }
  ],

  "color": [
    {
      question: "Can two physically different light spectra look identical to your eye?",
      tryThis: "Create a metameric match: find two different spectral combinations that produce the same perceived color. Adjust the sliders until the color patches look identical.",
      reveal: "Yes — these are called metamers. Your eye has only 3 cone types (L, M, S), so it reduces the infinite-dimensional space of spectra to just 3 numbers. Many different spectra can produce the same 3 cone responses. This is why RGB screens work: they don't reproduce the actual spectrum of, say, a sunset — they just stimulate your cones in the same ratio.",
      interactive: "color-matching-metamers"
    },
    {
      question: "Why do RGB screens use red, green, and blue?",
      tryThis: "Look at the cone sensitivity curves. Where do the L, M, and S cones peak? How do RGB primaries relate to these peaks?",
      reveal: "The three cone types peak near red (L cones, ~564 nm), green (M cones, ~534 nm), and blue (S cones, ~420 nm). RGB primaries are chosen to independently stimulate each cone type as much as possible. By mixing R, G, B intensities, you can reproduce the 3 cone signals for most visible colors. The gamut of reproducible colors forms a triangle in the CIE color space.",
      interactive: "cie-tristimulus-curves"
    },
    {
      question: "Why does mixing red and green light make yellow, but mixing red and green paint makes brown?",
      tryThis: "Compare additive mixing (light) and subtractive mixing (pigment/paint). Mix red + green in each system.",
      reveal: "Light mixing is additive — you're adding wavelengths together. Red + green light stimulates L and M cones about equally, which your brain interprets as yellow. Paint mixing is subtractive — each pigment absorbs certain wavelengths. Red paint absorbs green/blue; green paint absorbs red/blue. Together they absorb almost everything, leaving only dark brownish-yellow. The two mixing systems obey completely different rules.",
      interactive: "additive-subtractive-mixing"
    }
  ],

  "antennas": [
    {
      question: "Why does a single antenna radiate most strongly sideways, not along its length?",
      tryThis: "Observe the monopole radiation pattern. Where is the radiation strongest? Where is it zero?",
      reveal: "A dipole antenna has charges accelerating up and down. The radiation is proportional to the component of acceleration perpendicular to the line of sight. Looking sideways, you see full acceleration. Looking along the antenna axis, the acceleration points directly at you — no transverse component, no radiation. The pattern goes as sin²θ.",
      interactive: "monopole-radiation-pattern"
    },
    {
      question: "What happens when you put two antennas next to each other?",
      tryThis: "Place two sources half a wavelength apart. Adjust the phase difference between them. Watch the combined radiation pattern change.",
      reveal: "Two sources create an interference pattern in space. At 0° phase difference, they reinforce in the broadside direction. At 180° phase difference, they cancel broadside and reinforce endfire. The spacing and phasing together determine where constructive and destructive interference occur. This is the basic principle of every antenna array.",
      interactive: "two-source-interference"
    },
    {
      question: "Can you steer a beam electronically, without physically moving the antenna?",
      tryThis: "Use the phased array. Adjust the progressive phase shift between elements. Watch the main beam direction sweep across angles.",
      reveal: "By changing the phase delay between adjacent elements, you change where the signals add constructively. A linear phase gradient across the array steers the beam to an angle θ where d·sin θ = phase shift × λ/(2π). This is electronic beam steering — no moving parts. It's how radar, 5G base stations, and the SpaceX Starlink antennas work.",
      interactive: "phased-array-radiation"
    },
    {
      question: "How does adding more antennas improve the angular resolution?",
      tryThis: "Increase the number of antennas in the array. Watch the main beam get narrower. What happens to the sidelobes?",
      reveal: "More antennas = narrower beam, following Δθ ≈ λ/(Nd) where N is the number of elements and d is the spacing. This is the same math as diffraction through a wider slit. The array acts like a spatial Fourier transform — more elements sample more of the wavefront, giving finer angular resolution. Radio telescopes use arrays spanning continents to resolve objects smaller than a milliarcsecond.",
      interactive: "phased-array-radiation"
    }
  ],

  "diffraction": [
    {
      question: "What happens when a wave passes through an opening comparable to its wavelength?",
      tryThis: "Watch plane waves hit a slit. Adjust the slit width relative to the wavelength. What happens when the slit is much wider than λ? Much narrower?",
      reveal: "When the slit is much wider than λ, the wave passes straight through with sharp shadows. When the slit is comparable to λ, the wave spreads out in a fan — this is diffraction. In the extreme limit of a very narrow slit, the wave emerges as a semicircular wavefront, as if the slit were a point source. Huygens' principle explains why: each point in the slit acts as a new source.",
      interactive: "huygens-principle-demo"
    },
    {
      question: "Where does the single-slit diffraction pattern come from?",
      tryThis: "Look at the intensity pattern on the screen. There's a bright central maximum and darker fringes on either side. Adjust the slit width — how does the pattern change?",
      reveal: "Divide the slit into many tiny sources (Huygens' wavelets). At the center, all sources are in phase — maximum intensity. At angles where the path difference across the slit equals one wavelength, the contributions cancel in pairs, giving a dark fringe. Narrower slit = wider pattern (more diffraction). The envelope follows sinc²(πa·sinθ/λ).",
      interactive: "single-slit-diffraction"
    },
    {
      question: "How does a diffraction grating separate colors more sharply than a prism?",
      tryThis: "Look at the grating pattern. Many slits produce very sharp bright lines at specific angles. Increase the number of slits and watch the lines get sharper.",
      reveal: "A grating has N slits, and constructive interference occurs only at angles where d·sinθ = mλ (integer m). With many slits, the condition for constructive interference becomes very precise — the peaks are narrow. More slits = sharper lines. A grating with 1000 slits can resolve wavelengths differing by 0.1%. This makes gratings essential for spectroscopy.",
      interactive: "diffraction-grating-pattern"
    },
    {
      question: "What does Fourier analysis have to do with diffraction?",
      tryThis: "Compare the aperture shape to the diffraction pattern. A single slit gives a sinc pattern. A double slit gives a cosine modulation. The diffraction pattern is the Fourier transform of the aperture.",
      reveal: "The far-field diffraction pattern is literally the Fourier transform of the aperture shape. A wide slit (broad in space) gives a narrow diffraction pattern (narrow in angle-space) and vice versa. This is the same uncertainty relation: Δx · Δk ≥ 1/2. Understanding this connection means you can predict diffraction patterns just by thinking about Fourier transforms.",
      interactive: "fourier-optics-demo"
    }
  ],

  "quantum-mechanics": [
    {
      question: "Can light behave as a particle?",
      tryThis: "Adjust the frequency of light hitting the metal surface. Below a certain threshold, no electrons are ejected — no matter how bright the light. Above threshold, electrons come out immediately.",
      reveal: "The photoelectric effect proves light comes in discrete packets (photons) with energy E = hf. Below the threshold frequency, no single photon has enough energy to free an electron, so nothing happens regardless of intensity. Above threshold, even a dim light ejects electrons because each photon individually carries enough energy. This is what won Einstein the Nobel Prize.",
      interactive: "photoelectric-effect-demo"
    },
    {
      question: "Can a single photon go through both slits?",
      tryThis: "Watch photons arrive one at a time at the screen. Early on, the dots look random. Let many photons accumulate. What pattern emerges?",
      reveal: "Individual photons arrive at seemingly random positions, but over thousands of detections, the double-slit interference pattern builds up. Each photon interferes with itself — it goes through both slits simultaneously as a wave, then is detected as a particle at one spot. If you try to determine which slit it went through, the interference pattern disappears. This is the central mystery of quantum mechanics.",
      interactive: "double-slit-photon-buildup"
    },
    {
      question: "Why are atomic energy levels discrete?",
      tryThis: "Look at the hydrogen energy levels. The electron can only occupy specific orbits with specific energies. Transitions between levels emit photons at specific frequencies.",
      reveal: "An electron bound in an atom is a standing wave — the wavefunction must fit an integer number of wavelengths around the orbit (or equivalently, satisfy boundary conditions in the potential well). Only specific wavelengths fit, giving discrete energy levels E_n = −13.6/n² eV. This is exactly like the standing wave modes on a string, except the 'string' is the electron's wavefunction in the atomic potential.",
      interactive: "hydrogen-energy-levels"
    },
    {
      question: "Does a quantum wavepacket spread out like a classical one?",
      tryThis: "Watch the quantum wavepacket evolve. Compare it to the classical wavepacket dispersion you saw earlier. Does it spread? Does it stay localized?",
      reveal: "Yes, quantum wavepackets spread because of dispersion — the relation E = p²/(2m) means ω = ℏk²/(2m), which is nonlinear, so different momentum components travel at different speeds. A localized particle inevitably delocalizes over time. This is the quantum uncertainty principle in action: if you know position well now, the spread of momenta ensures you'll know it less well later.",
      interactive: "quantum-wavepacket-dispersion"
    }
  ],

  "doppler-effect": [
    {
      question: "Why does an ambulance siren change pitch as it passes you?",
      tryThis: "Watch the moving source emit wavefronts. Compare the spacing of wavefronts ahead of the source versus behind it.",
      reveal: "A moving source catches up to the waves it sends forward, compressing them (shorter wavelength = higher frequency). Behind the source, waves are stretched (longer wavelength = lower frequency). The observer hears f' = f·v/(v ∓ v_s). The pitch drops as the ambulance passes because you switch from receiving compressed to stretched wavefronts.",
      interactive: "doppler-moving-source"
    },
    {
      question: "What happens when the source moves as fast as the wave?",
      tryThis: "Increase the source speed toward the wave speed. Watch the wavefronts ahead pile up. At v = v_sound, what happens?",
      reveal: "At v = v_sound, all the wavefronts pile up at the source's nose into a single shock front — a sonic boom. The Mach number M = v/v_sound = 1 is the threshold. Above Mach 1 (supersonic), the shock front forms a cone with half-angle sin θ = 1/M. The Concorde, bullets, and cracking whips all produce sonic booms by exceeding the local sound speed.",
      interactive: "sonic-boom-mach-cone"
    },
    {
      question: "How do astronomers know the universe is expanding?",
      tryThis: "Look at the relativistic Doppler effect. A receding source redshifts — its light moves to longer wavelengths. What happens to a source moving toward you?",
      reveal: "Hubble observed that distant galaxies have redshifted spectral lines, with the redshift proportional to distance. The relativistic Doppler formula f' = f√((1−β)/(1+β)) describes this. The redshift z = Δλ/λ directly gives the recession velocity. Since more distant galaxies recede faster (Hubble's law), space itself must be expanding. This is the observational foundation of Big Bang cosmology.",
      interactive: "relativistic-doppler-redshift"
    },
    {
      question: "How can you find planets around other stars using the Doppler effect?",
      tryThis: "Watch the star wobble as an orbiting planet tugs it. The star's spectral lines shift back and forth. Can you determine the planet's orbital period from the Doppler signal?",
      reveal: "A planet pulls its star in a small orbit. The star's radial velocity oscillates, Doppler-shifting its spectral lines by tiny amounts (~m/s). The period of the shift gives the orbital period; the amplitude gives the planet's minimum mass. This radial velocity method has discovered hundreds of exoplanets. The precision needed is astounding — detecting shifts of ~1 part in 10⁸ in wavelength.",
      interactive: "doppler-spectroscopy-exoplanet"
    }
  ]
};
