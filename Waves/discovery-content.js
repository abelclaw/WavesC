// Guided Discovery labs for each chapter (keyed by chapter slug)
// Each chapter has an array of labs. Each lab: { lab, interactive, questions[] }
// Each question: { question, tryThis, answer }

var discoverySteps = {
  "oscillators-linearity": [
    {
      lab: "Spring",
      interactive: "shm-spring",
      questions: [
        {
          question: "Pull the mass to different starting heights and release. Does the period change?",
          tryThis: "Try a tiny displacement, then a big one. Watch the period readout or count the oscillations.",
          answer: "The period stays the same no matter how far you pull. This is the defining feature of simple harmonic motion: the restoring force scales with displacement, so bigger pulls produce proportionally bigger forces, and the mass covers the extra distance in the same time."
        },
        {
          question: "Increase the spring constant k while keeping m fixed. What happens to the oscillation speed?",
          tryThis: "Set m = 1 and slide k from 2 up to 16. Watch the frequency readout.",
          answer: "The oscillation gets faster, but doubling k does not double the frequency — it multiplies it by √2. The frequency is ω = √(k/m), so you need to quadruple the stiffness to double the frequency."
        },
        {
          question: "Keep k fixed and increase the mass m. What happens?",
          tryThis: "Set k = 5 and slowly increase m from 0.5 to 5. Compare the motion.",
          answer: "Heavier masses oscillate more slowly. The frequency ω = √(k/m) drops as m grows. A heavy mass has more inertia, so the same spring force accelerates it less."
        }
      ]
    },
    {
      lab: "Damped Oscillator",
      interactive: "damped-oscillator",
      questions: [
        {
          question: "Start with very low damping. What does the envelope of the oscillation look like?",
          tryThis: "Set γ ≈ 0.2. Watch the peaks of successive oscillations. Do they decrease linearly or do they curve?",
          answer: "The envelope is an exponential decay — each peak is a fixed fraction of the previous one, not a fixed amount less. The amplitude decays as e^(−γt/2)."
        },
        {
          question: "Crank up the damping. At what point does the mass stop oscillating entirely?",
          tryThis: "Increase γ gradually. Watch for the transition from oscillation to a slow ooze back to rest.",
          answer: "When γ reaches 2ω₀ (critical damping), the oscillation vanishes. Above that you're in the overdamped regime — the mass returns to rest exponentially without ever crossing zero."
        }
      ]
    },
    {
      lab: "Damping Regimes",
      interactive: "damping-regimes",
      questions: [
        {
          question: "Of the three regimes shown, which one returns to zero fastest?",
          tryThis: "Compare underdamped, critically damped, and overdamped side by side. Which trace reaches x ≈ 0 first?",
          answer: "Critical damping wins. Underdamped wastes time oscillating past zero. Overdamped is sluggish because friction dominates. Critical damping is the fastest return with no overshoot — that's why car suspensions and door closers are tuned near this point."
        },
        {
          question: "Does the underdamped oscillation cross zero? Does the overdamped?",
          tryThis: "Watch each trace carefully. Count zero crossings for each regime.",
          answer: "Underdamped crosses zero repeatedly (it oscillates). Critically damped approaches zero from one side without crossing. Overdamped also never crosses zero — it decays even more slowly from one side."
        }
      ]
    }
  ],

  "driven-oscillators": [
    {
      lab: "Driven Oscillator",
      interactive: "driven-oscillator",
      questions: [
        {
          question: "Sweep the driving frequency toward the natural frequency. What happens to the amplitude?",
          tryThis: "Set ω₀ = 5 and low damping (γ ≈ 0.2). Slowly move ω_d from 1 toward 5 and watch the amplitude panel.",
          answer: "The amplitude grows dramatically as ω_d approaches ω₀ — this is resonance. The drive is perfectly synchronized with the natural motion, so every push adds energy. Only damping prevents the amplitude from going to infinity."
        },
        {
          question: "At resonance, increase the damping. What happens to the peak amplitude?",
          tryThis: "Set ω_d = ω₀. Now increase γ from 0.2 to 1 to 3. Watch the amplitude drop.",
          answer: "More damping means a lower, broader resonance peak. The peak amplitude is proportional to 1/γ. The quality factor Q = ω₀/γ measures how sharp the resonance is — high Q means a tall narrow peak."
        },
        {
          question: "Drive the oscillator away from resonance. Does it oscillate at its own frequency or the driving frequency?",
          tryThis: "Set ω₀ = 5 but drive at ω_d = 3. Count the oscillations in the left panel.",
          answer: "In steady state, the oscillator always responds at the driving frequency ω_d, not its natural ω₀. The natural frequency determines how strongly it responds (amplitude peaks at ω₀), but the rhythm is dictated by the driver."
        }
      ]
    },
    {
      lab: "Transient Decay",
      interactive: "transient-decay",
      questions: [
        {
          question: "Hit restart and watch the first few seconds. Why does the motion look messy before settling down?",
          tryThis: "Restart several times with different ω_d values. Compare the initial messy phase to the eventual clean oscillation.",
          answer: "The early motion is two oscillations superimposed: the transient (at the natural frequency ω₀, decaying away) and the steady-state drive (at ω_d, constant). Their interference creates the messy beating. Once damping kills the transient, only the clean driven response remains."
        },
        {
          question: "How does damping affect how quickly the transient dies?",
          tryThis: "Try low damping — the messy beating lasts a long time. Then increase damping and restart.",
          answer: "Higher damping kills the transient faster. The transient amplitude decays as e^(−γt/2), so larger γ means quicker convergence to the steady state."
        }
      ]
    }
  ],

  "coupled-oscillators": [
    {
      lab: "Coupled Oscillators",
      interactive: "coupled-oscillators",
      questions: [
        {
          question: "Pull one mass to the side and release while the other sits at rest. What happens over time?",
          tryThis: "Displace only mass 1. Watch both masses for 20+ seconds.",
          answer: "Energy transfers from mass 1 to mass 2 through the coupling spring. Eventually mass 1 is nearly still while mass 2 swings at full amplitude. Then the cycle reverses. This back-and-forth is the beat phenomenon in coupled oscillators."
        },
        {
          question: "How does the coupling spring strength affect the speed of energy transfer?",
          tryThis: "Try weak coupling, then strong coupling. Watch how fast energy moves between the masses.",
          answer: "Stronger coupling transfers energy faster. The beat frequency is proportional to the difference between the two normal mode frequencies, and that difference grows with coupling strength."
        }
      ]
    },
    {
      lab: "Normal Modes",
      interactive: "normal-modes",
      questions: [
        {
          question: "Click each normal mode button. What's special about these motions compared to arbitrary initial conditions?",
          tryThis: "In mode 1, both masses move together. In mode 2, they move opposite. Watch whether energy ever transfers between the masses.",
          answer: "In a normal mode, every part of the system oscillates at the same frequency and no energy transfers between parts. Mode 1 (symmetric) leaves the coupling spring unstretched. Mode 2 (antisymmetric) stretches it maximally, giving a higher frequency. Any arbitrary motion is a combination of these two modes."
        }
      ]
    },
    {
      lab: "Beats",
      interactive: "beats",
      questions: [
        {
          question: "Watch the amplitude envelope of each mass. Can you relate the beat frequency to the two normal mode frequencies?",
          tryThis: "Note how fast the amplitude rises and falls. Compare this to the two mode frequencies shown.",
          answer: "The beat frequency is (ω₂ − ω₁)/2, half the difference between the two normal mode frequencies. When the modes are close in frequency, the beats are slow — energy transfers lazily. When far apart, the beats are fast."
        }
      ]
    }
  ],

  "oscillators-to-waves": [
    {
      lab: "2-Mass Modes",
      interactive: "two-mass-normal-modes",
      questions: [
        {
          question: "Click through the modes. How many normal modes does a 2-mass system have?",
          tryThis: "Toggle between modes. Notice the shape of each — one is a half-arch, the other has a node in the middle.",
          answer: "Exactly 2 modes for 2 masses. The first mode (n=1) has no internal nodes. The second (n=2) has one node where the displacement is zero. N masses always give N normal modes."
        }
      ]
    },
    {
      lab: "N-Mass Chain",
      interactive: "n-mass-chain",
      questions: [
        {
          question: "Increase the number of masses from 3 to 20. What happens to the mode shapes?",
          tryThis: "Start with 3 masses and look at the jagged mode shape. Go to 10, then 20. Toggle between low and high mode numbers.",
          answer: "As you add more masses, the mode shapes become smooth sine curves. This is the continuum limit — discrete coupled oscillators become a continuous wave. The jump from 'many oscillators' to 'a wave' is just more of the same normal modes."
        },
        {
          question: "Look at the highest mode number. What does that mode shape look like?",
          tryThis: "With N masses, select mode N. Watch how adjacent masses move relative to each other.",
          answer: "In the highest mode, adjacent masses oscillate exactly out of phase — every other mass is up while the rest are down. This is the shortest possible wavelength on a discrete chain, and it corresponds to the maximum frequency the system can support."
        }
      ]
    },
    {
      lab: "Dispersion Relation",
      interactive: "dispersion-relation-discrete",
      questions: [
        {
          question: "Is there a maximum frequency? Look at the curve as the mode number approaches N.",
          tryThis: "Compare the shape to a straight line. Does frequency keep growing linearly with mode number?",
          answer: "Yes — the discrete chain has a frequency ceiling at ω = 2√(k/m). The curve flattens out because adjacent masses can't oscillate faster than the springs between them can respond. A continuous string has no such cutoff. This discrete ceiling is why crystals have a maximum phonon frequency."
        }
      ]
    },
    {
      lab: "Traveling vs Standing",
      interactive: "traveling-vs-standing",
      questions: [
        {
          question: "In the standing wave, are there points that never move? In the traveling wave?",
          tryThis: "Toggle between the two views. Look for stationary points (nodes) in each.",
          answer: "The standing wave has fixed nodes where displacement is always zero. The traveling wave has no fixed nodes — every point oscillates. A standing wave is actually two traveling waves going in opposite directions, interfering constructively at antinodes and destructively at nodes."
        }
      ]
    }
  ],

  "fourier-series": [
    {
      lab: "Fourier Decomposition",
      interactive: "fourier-decomposition",
      questions: [
        {
          question: "Start with just the fundamental (N=1) and add harmonics one by one. How close can you get to a square wave?",
          tryThis: "Add the 3rd harmonic, then the 5th, 7th. Watch the sum change shape.",
          answer: "Each odd harmonic fills in the flat top and steepens the edges. You get closer but never perfect — the overshoot near the edges (Gibbs phenomenon) stubbornly stays at about 9% no matter how many harmonics you add."
        },
        {
          question: "Does the square wave use all harmonics or only certain ones?",
          tryThis: "Look at which harmonic numbers have nonzero coefficients.",
          answer: "Only odd harmonics (1, 3, 5, 7...) appear. This comes from the wave's symmetry — a square wave is odd-symmetric about its midpoint, which kills all even harmonics."
        }
      ]
    },
    {
      lab: "Plucked String",
      interactive: "plucked-string",
      questions: [
        {
          question: "Pluck the string at the center versus near one end. How does the sound change?",
          tryThis: "Pluck at the midpoint and look at the harmonic content below. Then pluck at 1/4 of the way along.",
          answer: "Plucking at the center suppresses even harmonics (because the center is a node of modes 2, 4, 6...), giving a mellow tone. Plucking near the end excites many high harmonics, producing a brighter, sharper sound. The pluck position acts as a spatial filter on the spectrum."
        }
      ]
    }
  ],

  "waves": [
    {
      lab: "String Wave",
      interactive: "string-transverse-wave",
      questions: [
        {
          question: "Watch the colored dots on the string as the wave passes. Do they travel with the wave?",
          tryThis: "Focus on a single dot. Does it move horizontally or vertically?",
          answer: "The dots move only up and down — they don't travel with the wave. The wave is a pattern of displacement that moves, not the medium itself. This is the distinction between the wave's phase velocity and the actual motion of the medium."
        }
      ]
    },
    {
      lab: "Sound Wave",
      interactive: "sound-wave-longitudinal",
      questions: [
        {
          question: "In this longitudinal wave, how do the dots move compared to the string wave?",
          tryThis: "Watch the dots bunch up and spread apart. Which direction is the wave traveling? Which direction do the dots move?",
          answer: "The dots move parallel to the wave direction (back and forth), not perpendicular. Where they bunch up is a compression; where they spread out is a rarefaction. Despite looking very different from the string wave, both obey the same wave equation."
        }
      ]
    },
    {
      lab: "Boundary Conditions",
      interactive: "boundary-conditions-demo",
      questions: [
        {
          question: "Send a pulse toward a fixed wall. Is the reflected pulse upright or inverted?",
          tryThis: "Watch the reflection at a fixed end, then switch to a free end. Compare.",
          answer: "At a fixed end, the reflected pulse comes back inverted. At a free end, it comes back upright. The fixed end must stay at zero displacement, so the reflection must cancel the incoming wave at that point — requiring opposite sign."
        }
      ]
    },
    {
      lab: "Standing Wave Modes",
      interactive: "standing-wave-modes",
      questions: [
        {
          question: "Sweep the frequency. At which frequencies does the amplitude suddenly jump?",
          tryThis: "Slowly increase the frequency. Most values give messy, small motion. Find the first three frequencies where the string lights up.",
          answer: "Standing waves form only when an integer number of half-wavelengths fit between the boundaries: L = nλ/2. At these resonant frequencies f_n = n·v/(2L), the reflected wave constructively interferes with the incoming wave. Everything in between is destructive interference."
        }
      ]
    }
  ],

  "music": [
    {
      lab: "Consonance & Dissonance",
      interactive: "consonance-dissonance",
      questions: [
        {
          question: "Play a perfect fifth (3:2 ratio) and then a tritone. What's different about the sound?",
          tryThis: "Listen for beating or roughness in the dissonant interval compared to the smooth consonant one.",
          answer: "Consonant intervals have simple frequency ratios (2:1, 3:2, 4:3) whose harmonics align and reinforce each other. Dissonant intervals have complex ratios, causing audible beats between their harmonics — that wobbling, clashing sensation."
        }
      ]
    },
    {
      lab: "Instrument Spectra",
      interactive: "violin-spectrum",
      questions: [
        {
          question: "Compare the spectra of different instruments playing the same note. What makes them sound different?",
          tryThis: "Look at which harmonics are present and how strong they are for each instrument.",
          answer: "Same fundamental frequency, but different harmonic recipes — the relative amplitudes of the overtones. A clarinet emphasizes odd harmonics (closed tube). A violin has a rich full spectrum. A flute is nearly pure fundamental. This recipe is called timbre."
        }
      ]
    },
    {
      lab: "Circle of Fifths",
      interactive: "circle-of-fifths",
      questions: [
        {
          question: "Starting from C, go up by perfect fifths (×3/2). After how many steps do you land close to where you started?",
          tryThis: "Follow the circle. Count the steps until you get close to C again.",
          answer: "After 12 perfect fifths you almost return to the start (but not exactly — off by about 1.4%). Twelve is the smallest number that nearly closes the circle. Equal temperament fudges each semitone to exactly 2^(1/12) so every key sounds equally good."
        }
      ]
    }
  ],

  "fourier-transforms": [
    {
      lab: "Time-Frequency Tradeoff",
      interactive: "fourier-transform-derivation",
      questions: [
        {
          question: "Start with a long-duration tone and look at its frequency spectrum. Now shorten it. What happens to the peak?",
          tryThis: "Compare a long oscillation (narrow frequency peak) to a short pulse (broad spectrum).",
          answer: "A long tone has a narrow, sharp frequency peak. A short pulse spreads across many frequencies. This is the uncertainty principle for waves: Δt · Δω ≥ 1/2. You cannot have both a short signal and a narrow spectrum — they are mathematically incompatible."
        }
      ]
    },
    {
      lab: "Damped Oscillation Spectrum",
      interactive: "underdamped-fourier-transform",
      questions: [
        {
          question: "Adjust the damping rate. How does the spectral peak change?",
          tryThis: "With light damping (long ring-down), the peak is narrow. Increase damping and watch it broaden.",
          answer: "A damped oscillation transforms to a Lorentzian peak centered at ω₀ with width γ. The spectral linewidth tells you the decay rate directly. This is why atomic spectral lines have natural linewidths — the excited state decays, and Δω ~ 1/lifetime."
        }
      ]
    },
    {
      lab: "Fourier Filtering",
      interactive: "fourier-filtering",
      questions: [
        {
          question: "Apply the low-pass filter to the noisy signal. What survives?",
          tryThis: "Compare the noisy signal to the filtered one. Then try the band-pass filter.",
          answer: "The low-pass filter removes high-frequency noise, keeping only slow variations. The band-pass keeps only a chosen frequency range. Fourier filtering works because noise typically lives at different frequencies than the signal you care about."
        }
      ]
    }
  ],

  "reflection-impedance": [
    {
      lab: "String Junction",
      interactive: "string-junction",
      questions: [
        {
          question: "Send a pulse from the light string into the heavy string. What happens at the junction?",
          tryThis: "Watch for both a reflected pulse and a transmitted pulse. Are they the same size as the original? Is the reflected pulse inverted?",
          answer: "Part reflects, part transmits. Going from light to heavy string (low Z to high Z), the reflected pulse is inverted and smaller, while the transmitted pulse is upright but shorter. The impedance mismatch determines how the energy splits."
        },
        {
          question: "Adjust the second string's impedance to match the first. What happens to the reflection?",
          tryThis: "Slide the impedance ratio toward Z₂/Z₁ = 1 and send a pulse.",
          answer: "When Z₁ = Z₂, the reflection vanishes — all energy transmits. The reflection coefficient R = (Z₂ − Z₁)/(Z₂ + Z₁) goes to zero. This is impedance matching, the principle behind anti-reflection coatings and audio cable design."
        }
      ]
    },
    {
      lab: "Impedance Explorer",
      interactive: "mass-collision-impedance",
      questions: [
        {
          question: "Compare wave behavior in a heavy string versus a light string. Which one is harder to shake?",
          tryThis: "Send waves through media with different impedance values. Watch the wave amplitude and speed in each.",
          answer: "The high-impedance medium is harder to get moving — it takes more force for the same velocity. Impedance Z = force/velocity for a given wave amplitude. When a wave hits a mismatch, the medium can't smoothly hand off the energy, so some bounces back."
        }
      ]
    }
  ],

  "power": [
    {
      lab: "Wave Energy",
      interactive: "wave-energy-string",
      questions: [
        {
          question: "Watch the energy indicators on the traveling wave. Is the energy concentrated at the crests or spread evenly?",
          tryThis: "Compare the energy distribution in a traveling wave to a standing wave.",
          answer: "In a traveling wave, energy density is uniform (averaged over a cycle). In a standing wave, energy sloshes between kinetic energy (at displacement nodes, where velocity is maximal) and potential energy (at antinodes, where displacement is maximal)."
        }
      ]
    },
    {
      lab: "Power at Boundaries",
      interactive: "power-reflection-transmission",
      questions: [
        {
          question: "Adjust the impedance ratio Z₂/Z₁. At what ratio is the reflected power zero?",
          tryThis: "Slide from Z₂/Z₁ = 0.5 to 1 to 3. Watch the power fractions change.",
          answer: "Reflected power is zero when Z₂/Z₁ = 1 (matched impedances). At extreme mismatches, almost all power reflects. The reflected power fraction is R² = ((Z₂−Z₁)/(Z₂+Z₁))², and the transmitted fraction is always 1 − R²."
        }
      ]
    },
    {
      lab: "Decibel Scale",
      interactive: "decibel-scale",
      questions: [
        {
          question: "How many times more powerful is 60 dB compared to 20 dB?",
          tryThis: "Compare 20 dB, 40 dB, and 60 dB. Each 10 dB step is a factor of how much in power?",
          answer: "60 dB is 10,000× more powerful than 20 dB. Each 10 dB is ×10 in power, so 40 dB difference = 10⁴. We use a log scale because human hearing spans 12 orders of magnitude. Every 3 dB doubles the power."
        }
      ]
    }
  ],

  "wavepackets": [
    {
      lab: "Gaussian Wavepacket",
      interactive: "gaussian-wavepacket",
      questions: [
        {
          question: "Make the wavepacket narrower in space. What happens to its frequency spectrum?",
          tryThis: "Adjust the packet width and watch the frequency-space representation change.",
          answer: "A narrow packet in space has a wide spread of frequencies, and vice versa. This is the position-momentum uncertainty relation: Δx · Δk ≥ 1/2. You can't localize a wave in both space and frequency simultaneously."
        },
        {
          question: "Watch the envelope versus the individual wave crests. Do they move at the same speed?",
          tryThis: "Follow a single crest and compare its speed to how fast the overall envelope moves.",
          answer: "The crests move at the phase velocity v_p = ω/k, but the envelope moves at the group velocity v_g = dω/dk. In a dispersive medium these are different. The group velocity carries the energy and information."
        }
      ]
    },
    {
      lab: "Wavepacket Dispersion",
      interactive: "wavepacket-dispersion",
      questions: [
        {
          question: "Enable dispersion and watch the wavepacket evolve. Does it maintain its shape?",
          tryThis: "Compare dispersive versus non-dispersive evolution. How does the packet change over time?",
          answer: "In a dispersive medium, different frequency components travel at different speeds, stretching the packet out over time. The wavepacket spreads and eventually loses its shape. In a non-dispersive medium, all frequencies travel at the same speed and the shape is preserved."
        }
      ]
    }
  ],

  "wave-phenomena": [
    {
      lab: "Energy Transport",
      interactive: "wave-transport-energy",
      questions: [
        {
          question: "Watch each particle as the wave passes. Does any particle end up in a different place?",
          tryThis: "Track individual particles through one full wave cycle.",
          answer: "Waves transport energy without transporting matter. Each particle oscillates around its equilibrium position and returns. The energy moves forward, but the medium stays put."
        }
      ]
    },
    {
      lab: "Transverse vs Longitudinal",
      interactive: "transverse-longitudinal-demo",
      questions: [
        {
          question: "In which wave do particles move perpendicular to the wave direction? In which do they move parallel?",
          tryThis: "Compare the two types side by side. Watch the particle motion relative to the wave's travel direction.",
          answer: "In transverse waves (strings, light), particles move perpendicular. In longitudinal waves (sound), particles move parallel, creating compressions and rarefactions. Fluids can only support longitudinal waves — they can't sustain shear. This is how seismologists proved Earth's outer core is liquid."
        }
      ]
    },
    {
      lab: "Sound Refraction",
      interactive: "sound-refraction-atmosphere",
      questions: [
        {
          question: "On a cold night with warm air above, which direction do the sound waves bend?",
          tryThis: "Watch the wavefronts in the temperature gradient. The upper part of each front is in warmer (faster) air.",
          answer: "Sound travels faster in warm air, so the upper part of the wavefront moves faster, bending the wave back down toward the ground. This is why you can hear conversations across a lake on a still night — sound that would normally escape upward gets refracted back to you."
        }
      ]
    }
  ],

  "light": [
    {
      lab: "EM Plane Wave",
      interactive: "em-plane-wave",
      questions: [
        {
          question: "Watch the E and B field arrows. Are they in phase or out of phase? Are they parallel?",
          tryThis: "When E is at its maximum, what is B doing? What angle are they at relative to each other?",
          answer: "E and B are perpendicular to each other, both perpendicular to the direction of travel, and they oscillate in phase — when E is maximum, B is maximum. Their magnitudes are locked: E = cB. This self-sustaining dance is what lets light travel through vacuum."
        }
      ]
    },
    {
      lab: "EM Spectrum",
      interactive: "em-spectrum",
      questions: [
        {
          question: "All electromagnetic waves travel at the same speed. What changes across the spectrum?",
          tryThis: "Explore from radio waves to gamma rays. Compare wavelengths and frequencies.",
          answer: "Only the frequency (and correspondingly the wavelength) changes. Radio, microwave, infrared, visible, UV, X-ray, gamma — they're all the same phenomenon with different frequencies. Visible light is just the tiny sliver (400–700 nm) that evolution tuned our eyes to detect."
        }
      ]
    }
  ],

  "polarization": [
    {
      lab: "Polarization States",
      interactive: "em-polarization",
      questions: [
        {
          question: "Switch between linear and circular polarization. How does the electric field vector behave differently?",
          tryThis: "In linear polarization, watch the E-field direction. In circular, watch it rotate.",
          answer: "In linear polarization, E vibrates in one fixed plane. In circular polarization, E rotates as the wave propagates, tracing a helix. Unpolarized light (like sunlight) has E pointing in random, rapidly changing directions."
        }
      ]
    },
    {
      lab: "Malus's Law",
      interactive: "malus-law",
      questions: [
        {
          question: "Cross two polarizers at 90°. No light gets through. Now insert a third at 45° between them. What happens?",
          tryThis: "Start with crossed polarizers (0° and 90°) — screen is dark. Insert a 45° polarizer between them.",
          answer: "Light gets through! The first polarizer passes the 0° component. The 45° polarizer projects onto its axis (50% passes). The 90° polarizer passes 50% of that. Result: 25% intensity gets through three polarizers, versus 0% with two. Adding an obstacle increases transmission."
        }
      ]
    },
    {
      lab: "3D Movie Glasses",
      interactive: "3d-movie-glasses",
      questions: [
        {
          question: "Compare linear vs circular polarization for 3D movies. What happens when you tilt your head?",
          tryThis: "Try tilting with each polarization type. Which one still separates the images?",
          answer: "Circular polarization works even when you tilt your head — handedness doesn't change with rotation. Linear polarization fails when tilted, mixing the left and right images. That's why modern 3D cinemas use circular polarization."
        }
      ]
    }
  ],

  "refraction": [
    {
      lab: "Snell's Law",
      interactive: "snells-law-demo",
      questions: [
        {
          question: "Send a ray from air into glass at an angle. Does the wavelength change? Does the frequency?",
          tryThis: "Watch the wavefronts before and after the boundary. Count the wavefronts on each side.",
          answer: "The wavelength shrinks inside the glass (light slows down), but the frequency stays the same — the wave must oscillate at the same rate on both sides. Since v = fλ and v decreases, λ must decrease. The change in wavelength at an angle is what causes the beam to bend."
        }
      ]
    },
    {
      lab: "Total Internal Reflection",
      interactive: "total-internal-reflection",
      questions: [
        {
          question: "Increase the angle of incidence inside the glass. At what angle does light stop escaping?",
          tryThis: "Watch the refracted ray as you increase the angle. Find the critical angle where it bends to 90°, then go beyond.",
          answer: "Beyond the critical angle θ_c = arcsin(n₂/n₁), total internal reflection occurs — no light escapes. This is how fiber optics work: light bounces along inside a glass fiber, permanently trapped. Diamonds sparkle because their high index (n=2.42) gives a small critical angle."
        }
      ]
    },
    {
      lab: "Thin Film Interference",
      interactive: "thin-film-interference",
      questions: [
        {
          question: "Adjust the film thickness. Why do certain colors appear in the reflection?",
          tryThis: "Change the thickness and watch the reflected color shift through the spectrum.",
          answer: "Light reflects from both top and bottom surfaces. These two reflections interfere — constructively for wavelengths where the round-trip path equals an integer number of wavelengths, destructively otherwise. As thickness varies, different colors are enhanced, creating the rainbow patterns on soap bubbles."
        }
      ]
    }
  ],

  "prisms": [
    {
      lab: "Prism Dispersion",
      interactive: "prism-dispersion",
      questions: [
        {
          question: "Watch white light enter the prism. Which color bends the most — red or violet?",
          tryThis: "Compare the exit angles of different colors.",
          answer: "Violet/blue bends the most because glass has a higher refractive index for shorter wavelengths (dispersion). The prism bends all colors, but by different amounts, fanning them into a spectrum."
        }
      ]
    },
    {
      lab: "Rayleigh Scattering",
      interactive: "rayleigh-scattering",
      questions: [
        {
          question: "Which end of the spectrum scatters more strongly from small particles?",
          tryThis: "Compare the scattering intensity for blue vs red light.",
          answer: "Blue scatters about 10× more than red — scattering intensity goes as 1/λ⁴. Looking at the sky away from the Sun, you see scattered (blue) light. At sunset, the long atmospheric path scatters away most blue, leaving red/orange."
        }
      ]
    },
    {
      lab: "Microscopic Index",
      interactive: "microscopic-index",
      questions: [
        {
          question: "Watch the atoms respond to the incoming light wave. How do the oscillating electrons slow the wave down?",
          tryThis: "Watch the electrons oscillate and re-radiate. How does the superposition of original and re-radiated waves create a slower wave?",
          answer: "Each atom's electrons are driven oscillators that absorb and re-emit the wave with a slight phase delay. The superposition of the original wave and all re-emitted wavelets creates a wave that appears to travel slower. Near an atomic resonance, the index changes rapidly."
        }
      ]
    }
  ],

  "color": [
    {
      lab: "Metamers",
      interactive: "color-matching-metamers",
      questions: [
        {
          question: "Can you find two physically different light spectra that look identical to your eye?",
          tryThis: "Adjust the sliders to make two different spectral combinations produce the same perceived color.",
          answer: "Yes — these are metamers. Your eye has only 3 cone types, reducing the infinite-dimensional spectrum to 3 numbers. Many different spectra can produce the same 3 cone responses. This is why RGB screens work — they don't reproduce actual spectra, just match your cone responses."
        }
      ]
    },
    {
      lab: "Cone Sensitivity",
      interactive: "cie-tristimulus-curves",
      questions: [
        {
          question: "Where do the L, M, and S cones peak? Why does RGB use those three colors?",
          tryThis: "Look at the three cone sensitivity curves and where they peak.",
          answer: "L cones peak near red (~564 nm), M near green (~534 nm), S near blue (~420 nm). RGB primaries are chosen to stimulate each cone type as independently as possible. By mixing R, G, B intensities, you reproduce the 3 cone signals for most visible colors."
        }
      ]
    },
    {
      lab: "Additive vs Subtractive",
      interactive: "additive-subtractive-mixing",
      questions: [
        {
          question: "Mix red + green light. Then mix red + green paint. Why are the results different?",
          tryThis: "Compare the two mixing systems. Note what each does to the spectrum.",
          answer: "Light mixing is additive — you add wavelengths. Red + green light stimulates L and M cones equally, which your brain sees as yellow. Paint mixing is subtractive — each pigment absorbs wavelengths. Red paint absorbs green/blue; green paint absorbs red/blue. Together they absorb almost everything, leaving muddy brown."
        }
      ]
    }
  ],

  "antennas": [
    {
      lab: "Monopole Pattern",
      interactive: "monopole-radiation-pattern",
      questions: [
        {
          question: "Where is the radiation strongest — sideways or along the antenna's axis?",
          tryThis: "Watch the radiation pattern. Find where intensity is maximum and where it goes to zero.",
          answer: "Strongest sideways, zero along the axis. A dipole has charges accelerating up and down. Looking sideways you see the full transverse acceleration (maximum radiation). Looking along the axis, the acceleration points right at you — no transverse component, no radiation. The pattern goes as sin²θ."
        }
      ]
    },
    {
      lab: "Two-Source Interference",
      interactive: "two-source-interference",
      questions: [
        {
          question: "Place two sources half a wavelength apart. Adjust the phase difference. How does the combined pattern change?",
          tryThis: "Start with 0° phase difference, then try 180°. Watch where the radiation is strongest.",
          answer: "At 0° phase, they reinforce broadside. At 180°, they cancel broadside and reinforce endfire. The spacing and phasing together control the interference pattern. This is the basic principle behind every antenna array."
        }
      ]
    },
    {
      lab: "Phased Array",
      interactive: "phased-array-radiation",
      questions: [
        {
          question: "Adjust the progressive phase shift between elements. Can you steer the beam without moving the antenna?",
          tryThis: "Sweep the phase shift and watch the main beam direction change.",
          answer: "Yes — a linear phase gradient steers the beam to the angle where d·sinθ matches the phase shift. No moving parts needed. This is how radar, 5G base stations, and Starlink antennas steer their beams electronically."
        },
        {
          question: "Increase the number of antenna elements. What happens to the beam width?",
          tryThis: "Go from 4 to 8 to 16 elements. Watch the main beam get narrower.",
          answer: "More elements = narrower beam, following Δθ ≈ λ/(Nd). This is the same math as diffraction — more elements sample more of the wavefront, giving finer angular resolution. Radio telescopes use continent-spanning arrays for milliarcsecond resolution."
        }
      ]
    }
  ],

  "diffraction": [
    {
      lab: "Huygens' Principle",
      interactive: "huygens-principle-demo",
      questions: [
        {
          question: "Adjust the slit width relative to the wavelength. When does the wave spread out most dramatically?",
          tryThis: "Try a slit much wider than λ, then comparable to λ, then much narrower.",
          answer: "When the slit is comparable to or smaller than the wavelength, the wave spreads into a wide fan — this is diffraction. A very narrow slit produces a nearly semicircular wavefront, as if it were a point source. Wide slits let the wave pass mostly straight through."
        }
      ]
    },
    {
      lab: "Single Slit Diffraction",
      interactive: "single-slit-diffraction",
      questions: [
        {
          question: "Look at the intensity pattern on the screen. Where are the dark fringes? How does narrowing the slit change the pattern?",
          tryThis: "Adjust the slit width and watch the central maximum and side fringes change.",
          answer: "Dark fringes appear where the path difference across the slit equals a whole wavelength — the contributions cancel in pairs. Narrower slit = wider pattern (more spreading). The envelope follows sinc²(πa·sinθ/λ)."
        }
      ]
    },
    {
      lab: "Diffraction Grating",
      interactive: "diffraction-grating-pattern",
      questions: [
        {
          question: "Increase the number of slits. What happens to the bright lines?",
          tryThis: "Go from 2 slits to 5 to 20. Watch the bright spots sharpen.",
          answer: "More slits produce sharper bright lines. Constructive interference requires d·sinθ = mλ, and with many slits this condition becomes very precise. A grating with 1000 slits can resolve wavelengths differing by 0.1%. This is why gratings are essential for spectroscopy."
        }
      ]
    },
    {
      lab: "Fourier Optics",
      interactive: "fourier-optics-demo",
      questions: [
        {
          question: "Compare the aperture shape to its diffraction pattern. What's the relationship?",
          tryThis: "A single slit gives a sinc pattern. A double slit gives cosine fringes. Notice how spatial width maps to angular spread.",
          answer: "The far-field diffraction pattern is the Fourier transform of the aperture. Wide aperture (broad in space) = narrow pattern (narrow in angle), and vice versa. This is the same Δx·Δk uncertainty relation showing up in optics."
        }
      ]
    }
  ],

  "quantum-mechanics": [
    {
      lab: "Photoelectric Effect",
      interactive: "photoelectric-effect-demo",
      questions: [
        {
          question: "Adjust the frequency of light. Below a certain threshold, do any electrons come out — even if the light is very bright?",
          tryThis: "Set the frequency below threshold and crank up the intensity. Then raise the frequency above threshold at low intensity.",
          answer: "Below the threshold frequency, no electrons are ejected no matter how bright the light. Above threshold, even dim light ejects electrons immediately. Light comes in discrete packets (photons) with energy E = hf. Each photon individually must carry enough energy to free an electron."
        }
      ]
    },
    {
      lab: "Double Slit Photons",
      interactive: "double-slit-photon-buildup",
      questions: [
        {
          question: "Watch photons arrive one at a time. Early on, the dots look random. Let many accumulate. What pattern emerges?",
          tryThis: "Be patient and watch hundreds of photons build up the pattern on the screen.",
          answer: "The interference pattern emerges! Each photon arrives at a seemingly random spot, but over thousands of detections, the double-slit pattern builds up. Each photon interferes with itself — it goes through both slits as a wave, then is detected as a particle at one spot."
        }
      ]
    },
    {
      lab: "Hydrogen Energy Levels",
      interactive: "hydrogen-energy-levels",
      questions: [
        {
          question: "Why can the electron only occupy specific energy levels and not anything in between?",
          tryThis: "Look at the allowed orbits. Transitions between levels emit photons at specific frequencies.",
          answer: "The electron is a standing wave — its wavefunction must fit an integer number of wavelengths around the atom. Only specific wavelengths fit, giving discrete energies E_n = −13.6/n² eV. This is exactly like standing wave modes on a string — only certain wavelengths satisfy the boundary conditions."
        }
      ]
    },
    {
      lab: "Quantum Wavepacket",
      interactive: "quantum-wavepacket-dispersion",
      questions: [
        {
          question: "Does the quantum wavepacket stay localized or spread out over time?",
          tryThis: "Watch the wavepacket evolve. Compare to the classical case.",
          answer: "It spreads, because the quantum dispersion relation E = p²/(2m) is nonlinear — different momentum components travel at different speeds. A localized particle inevitably delocalizes. If you know position well now, the spread of momenta ensures you'll know it less well later."
        }
      ]
    }
  ],

  "doppler-effect": [
    {
      lab: "Moving Source",
      interactive: "doppler-moving-source",
      questions: [
        {
          question: "Watch the wavefronts ahead of and behind the moving source. How does the spacing differ?",
          tryThis: "Compare the wavefront spacing (wavelength) in front vs behind the source.",
          answer: "Wavefronts ahead are compressed (shorter wavelength = higher frequency), behind are stretched (longer wavelength = lower frequency). The source catches up to its own forward-going waves, bunching them together. This is why a siren's pitch drops as an ambulance passes you."
        }
      ]
    },
    {
      lab: "Sonic Boom",
      interactive: "sonic-boom-mach-cone",
      questions: [
        {
          question: "Increase the source speed to equal the wave speed. What happens to the wavefronts ahead?",
          tryThis: "Watch the wavefronts pile up at Mach 1. Then go beyond — what shape forms?",
          answer: "At Mach 1, all wavefronts pile up into a single shock front — a sonic boom. Beyond Mach 1, the shock forms a cone with half-angle sinθ = 1/M. The Concorde, bullets, and cracking whips all produce this by exceeding the local wave speed."
        }
      ]
    },
    {
      lab: "Relativistic Doppler",
      interactive: "relativistic-doppler-redshift",
      questions: [
        {
          question: "A receding source redshifts — what happens to a source moving toward you?",
          tryThis: "Compare the spectra of approaching and receding sources.",
          answer: "Approaching sources are blueshifted (higher frequency, shorter wavelength). Hubble observed that distant galaxies are all redshifted, with the shift proportional to distance. Since more distant galaxies recede faster, space itself must be expanding."
        }
      ]
    },
    {
      lab: "Exoplanet Detection",
      interactive: "doppler-spectroscopy-exoplanet",
      questions: [
        {
          question: "Watch the star wobble as the planet orbits. Can you determine the orbital period from the Doppler signal?",
          tryThis: "Watch the spectral lines shift back and forth. Measure the period of the oscillation.",
          answer: "The planet's gravity tugs the star in a small orbit. The spectral lines oscillate with the orbital period. The amplitude of the shift gives the planet's minimum mass. This radial velocity method has discovered hundreds of exoplanets by detecting velocity shifts as small as ~1 m/s."
        }
      ]
    }
  ]
};
