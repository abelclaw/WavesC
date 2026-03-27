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
          question: "Drag the mass to a small displacement, then to a large one. Read the period T from the readout each time. Does T change?",
          tryThis: "Pull the mass just a little and note the period. Now pull it far and compare. Try three different amplitudes.",
          answer: "T stays the same regardless of amplitude. This is the signature of simple harmonic motion: the restoring force is proportional to displacement, so doubling the pull doubles the force, and the mass covers the extra distance in exactly the same time."
        },
        {
          question: "Set m = 1 and double k from 4 to 8. Does the frequency ω₀ in the readout double?",
          tryThis: "Read the ω₀ value at k = 4 and at k = 8. Compute the ratio.",
          answer: "No — ω₀ increases by a factor of √2 ≈ 1.41, not 2. Since ω₀ = √(k/m), you'd need to quadruple k to double ω₀. This square-root relationship is why piano strings are much stiffer for high notes, but not proportionally so."
        },
        {
          question: "With k = 8, increase m from 1 to 4. By what factor does ω₀ change?",
          tryThis: "Read ω₀ at m = 1, then at m = 4.",
          answer: "ω₀ drops by a factor of 2 (since √(1/4) = 1/2). Heavier masses have more inertia, so the same spring force accelerates them less, and the oscillation slows down."
        }
      ]
    },
    {
      lab: "Damped Oscillator",
      interactive: "damped-oscillator",
      questions: [
        {
          question: "Set γ = 0.3 and watch the x(t) plot. Is each successive peak a fixed amount smaller than the last, or a fixed fraction of the last?",
          tryThis: "Compare the drop from peak 1 to peak 2 versus from peak 3 to peak 4. Are those drops equal, or is the ratio peak₂/peak₁ ≈ peak₄/peak₃?",
          answer: "Each peak is a fixed fraction of the previous one — the decay is exponential (e^(−γt/2)), not linear. The ratio between consecutive peaks is constant, which is how you measure damping experimentally."
        },
        {
          question: "Look at the root diagram (s-plane) as you increase γ. At what value of γ do the two poles meet on the real axis?",
          tryThis: "Slowly increase γ and watch the pole locations. The poles start as a complex conjugate pair and merge when the system goes critical.",
          answer: "The poles merge at γ = 2ω₀ — this is critical damping. Below this the poles are complex (oscillation), above they're both real (no oscillation). The Q factor readout hits Q = 0.5 at this point."
        }
      ]
    },
    {
      lab: "Damping Regimes",
      interactive: "damping-regimes",
      questions: [
        {
          question: "Hit Go and watch the x(t) traces for all three regimes. Which colored trace crosses x = 0 first?",
          tryThis: "Follow the critically damped trace (amber). Compare when it first reaches zero to when the underdamped (teal) and overdamped (orange) traces get there.",
          answer: "The critically damped trace (amber) reaches zero fastest without overshooting. The underdamped trace crosses zero sooner but overshoots past it and keeps oscillating. The overdamped trace approaches zero sluggishly from one side. Critical damping is the sweet spot for fast settling — it's why car suspensions are tuned near this regime."
        },
        {
          question: "Count how many times the underdamped trace crosses zero. Does the overdamped trace ever cross zero?",
          tryThis: "Watch the teal (underdamped) and orange (overdamped) traces carefully.",
          answer: "The underdamped trace crosses zero multiple times — it oscillates while decaying. The overdamped trace never crosses zero; it decays monotonically from one side. The critically damped trace just barely touches zero without crossing. These are three qualitatively different behaviors from the same equation, controlled by a single parameter γ/ω₀."
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
          question: "Set ω₀ = 5 and γ = 0.3. Slowly sweep ω_d from 1 to 9 using the slider. At what ω_d value does the amplitude curve on the right panel peak?",
          tryThis: "Watch the dot move along the amplitude-vs-frequency curve as you change ω_d. Where is the peak?",
          answer: "The amplitude peaks very near ω_d = ω₀ = 5. This is resonance — the drive is synchronized with the natural frequency, so every push adds energy constructively. With low damping the peak is tall and narrow."
        },
        {
          question: "Stay at resonance (ω_d = ω₀). Now increase γ from 0.3 to 1 to 3. What happens to the peak height on the amplitude curve?",
          tryThis: "Read the amplitude at resonance for each γ value. Does the peak height scale as 1/γ?",
          answer: "The peak amplitude drops as 1/γ and the peak widens. The quality factor Q = ω₀/γ quantifies this: high Q means a tall, narrow resonance (like a tuning fork, Q ≈ 1000). Low Q means a short, broad hump (like a wet sponge, Q ≈ 1)."
        },
        {
          question: "Set ω₀ = 5 and ω_d = 3. Watch the x(t) plot — does the response oscillate at frequency 3 or at frequency 5?",
          tryThis: "Count the oscillation peaks per unit time on the x(t) plot and compare to the driving frequency.",
          answer: "The steady-state response oscillates at the driving frequency ω_d = 3, not at ω₀ = 5. The natural frequency determines how strongly the system responds (the amplitude curve peaks at ω₀), but the rhythm is always set by the driver."
        },
        {
          question: "Check the phase lag panel. At ω_d ≪ ω₀, the response is roughly in phase with the force. What is the phase lag at ω_d = ω₀? At ω_d ≫ ω₀?",
          tryThis: "Sweep ω_d slowly and watch the phase curve. Read the phase at resonance.",
          answer: "At resonance (ω_d = ω₀), the phase lag is exactly 90° — the response lags the force by a quarter cycle. Far above resonance, the lag approaches 180° — the response is completely out of phase. This phase behavior is how resonance is detected in many real experiments."
        }
      ]
    },
    {
      lab: "Transient Decay",
      interactive: "transient-decay",
      questions: [
        {
          question: "Hit Restart and watch the x(t) plot. Three curves are drawn: the total (bold teal), the steady-state (amber), and the transient (red). Which one dies away?",
          tryThis: "Watch the amplitudes of all three curves. After enough time, the total should match one of the other two.",
          answer: "The transient (red) decays exponentially, and after enough time the total (teal) converges onto the steady-state (amber). The early messy motion is the interference between the transient at ω₀ and the steady-state at ω_d."
        },
        {
          question: "Increase γ and restart. Does the transient die away faster or slower?",
          tryThis: "Compare the time for the transient to become negligible at γ = 0.3 versus γ = 2.",
          answer: "Higher γ kills the transient faster — its amplitude decays as e^(−γt/2). With heavy damping, the system reaches steady state almost immediately. With light damping, the beating between transient and steady-state persists for many cycles."
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
          question: "Drag mass 1 to the right and release, with mass 2 at rest. Watch the x(t) plot. Does mass 2 ever reach the same amplitude that mass 1 started with?",
          tryThis: "Follow the blue trace (mass 2). Compare its maximum amplitude to the initial displacement you gave mass 1.",
          answer: "Yes — mass 2 reaches the same amplitude, and at that moment mass 1 is nearly still. All the energy has transferred through the coupling spring. Then the cycle reverses. Energy bounces back and forth without loss."
        },
        {
          question: "Increase κ/k (coupling strength) using the slider. Does the energy transfer between masses get faster or slower?",
          tryThis: "Watch the beat envelope at low coupling, then at high coupling. Compare how many cycles it takes for mass 1 to stop moving.",
          answer: "Stronger coupling transfers energy faster — the beat envelope oscillates more rapidly. The beat frequency equals (ω₂ − ω₁)/2, and the gap between mode frequencies widens with coupling strength."
        }
      ]
    },
    {
      lab: "Normal Modes",
      interactive: "normal-modes",
      questions: [
        {
          question: "Click the symmetric mode button. Do both masses oscillate at the same frequency? Does any energy transfer between them?",
          tryThis: "Watch for several cycles. Check whether mass 1's amplitude ever decreases while mass 2's increases.",
          answer: "In the symmetric mode, both masses oscillate in phase at the same frequency, and the amplitudes never change — no energy transfers. The coupling spring stays at its natural length because both masses move together. This is what makes it a normal mode: the entire system oscillates as one, at a single frequency."
        },
        {
          question: "Now click the antisymmetric mode. Is its frequency higher or lower than the symmetric mode?",
          tryThis: "Compare the oscillation speed (count oscillations per second) in each mode. Check the ω readouts.",
          answer: "The antisymmetric mode has a higher frequency. The masses move in opposite directions, maximally stretching the coupling spring, which adds extra restoring force on top of the wall springs. More restoring force means higher ω."
        }
      ]
    },
    {
      lab: "Beats",
      interactive: "beats",
      questions: [
        {
          question: "The bottom trace x₁(t) is the sum of the top two waveforms. Move ν_a closer to ν_s. What happens to the red beat envelope — does it speed up or slow down?",
          tryThis: "Set ν_s and ν_a far apart, then bring them close together. Watch the beat frequency readout.",
          answer: "The beat envelope slows down as the frequencies approach each other. The beat frequency is |ν_a − ν_s|, so when the two modes are nearly equal, the energy transfer between masses is very slow — they're almost independent oscillators."
        },
        {
          question: "At the moment when the beat envelope reaches zero (the red dashed lines touch), what does x₁(t) look like? Where is all the energy?",
          tryThis: "Watch for the points where the bottom trace's amplitude drops to near zero.",
          answer: "When x₁(t) has zero amplitude, all the energy is in mass 2. The two normal modes have gone exactly out of phase for mass 1 (canceling its motion) and exactly in phase for mass 2 (doubling its motion). Half a beat period later, the reverse happens."
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
          question: "How many normal modes does a 2-mass system have? Click through the mode buttons and count.",
          tryThis: "In mode 1, notice the shape (both masses displaced same direction). In mode 2, they go opposite. Is there a mode 3?",
          answer: "Exactly 2 modes for 2 masses. N masses always give N normal modes. Mode 1 has no internal node (a half-arch shape). Mode 2 has one node in the middle where the displacement is zero. These are the only two independent patterns."
        },
        {
          question: "Read the ω values for each mode. Which mode has the higher frequency, and why?",
          tryThis: "Compare ω_s and ω_a in the readouts.",
          answer: "Mode 2 (antisymmetric) has the higher frequency because the coupling spring is maximally stretched, adding extra restoring force. Mode 1 (symmetric) doesn't stretch the coupling spring at all, so its frequency equals that of a single mass on its wall spring alone."
        }
      ]
    },
    {
      lab: "N-Mass Chain",
      interactive: "n-mass-chain",
      questions: [
        {
          question: "Set N = 3 and select mode 1. Now increase N to 10, then 20, keeping mode 1 selected. Does the mode shape become smoother or more jagged?",
          tryThis: "Watch the mode-shape plot below the chain. Compare the shapes at N = 3, 10, 20.",
          answer: "The mode shape becomes a smooth sine half-wave. With few masses the shape is jagged (you can see the discrete masses). With many masses, it approaches the continuous sine curve of a vibrating string. This is the continuum limit — where coupled oscillators become a wave."
        },
        {
          question: "With N = 10, sweep the mode slider from mode 1 to mode 10. What does the highest mode (mode N) look like?",
          tryThis: "In the highest mode, watch how adjacent masses move relative to each other.",
          answer: "In the highest mode, every adjacent pair moves in opposite directions — one up, the next down. This zig-zag is the shortest possible wavelength on the discrete chain (λ = 2d where d is the spacing). It also has the highest frequency. No pattern with a shorter wavelength can exist on this lattice."
        }
      ]
    },
    {
      lab: "Dispersion Relation",
      interactive: "dispersion-relation-discrete",
      questions: [
        {
          question: "Look at the ω vs mode number curve. Does it keep rising linearly, or does it flatten out at high mode numbers?",
          tryThis: "Compare the curve's shape to a straight line. Focus on what happens near mode N.",
          answer: "It flattens out — there's a maximum frequency ω_max = 2√(k/m). The discrete chain can't support oscillations faster than this because adjacent masses can't respond fast enough. A continuous string (no discrete masses) has no such ceiling. This frequency ceiling is why crystals have a maximum phonon frequency (the Debye cutoff)."
        }
      ]
    },
    {
      lab: "Traveling vs Standing",
      interactive: "traveling-vs-standing",
      questions: [
        {
          question: "In the standing wave view, find the red dots marking nodes. Do these points ever have nonzero displacement?",
          tryThis: "Watch the nodes through several full cycles. Compare them to the antinodes (maximum displacement points).",
          answer: "The nodes never move — displacement is permanently zero there. Meanwhile the antinodes swing to maximum amplitude twice per cycle. This fixed pattern of zeros is the defining feature of a standing wave, and it's what makes standing waves so useful for defining resonances."
        },
        {
          question: "Switch to the traveling wave view. Can you find any point that stays at zero displacement permanently?",
          tryThis: "Watch several dots on the traveling wave through a few cycles. Does any single point stay fixed?",
          answer: "No — every point oscillates. The wave is a moving pattern, not a fixed one. A standing wave is actually two traveling waves going in opposite directions: their superposition creates the fixed nodes through destructive interference."
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
          question: "Select Square wave and set terms = 1. Now increase terms to 3, 5, 11, 21. Does the sum (bold teal) ever perfectly match the dashed target?",
          tryThis: "Look carefully at the edges of the square wave. Do the overshoot spikes near the discontinuities get smaller as you add terms?",
          answer: "The sum gets closer but never matches perfectly. The overshoot spikes near the edges (Gibbs phenomenon) stay at about 9% of the jump height no matter how many terms you add. You can't build a sharp discontinuity from smooth sines without this unavoidable ringing."
        },
        {
          question: "With the Square wave selected, look at which harmonics appear (the colored component curves). Are all harmonic numbers present, or only certain ones?",
          tryThis: "Count the component frequencies visible in the plot. Are harmonics 2, 4, 6 there?",
          answer: "Only odd harmonics (1, 3, 5, 7...) appear — all even harmonics are exactly zero. This is forced by the square wave's symmetry: it's identical when flipped about its midpoint, which kills every even harmonic. Switch to Sawtooth and you'll see all harmonics appear, because the sawtooth lacks that symmetry."
        },
        {
          question: "Switch to Triangle wave and compare convergence at terms = 5 versus the Square wave at terms = 5. Which fits its target better?",
          tryThis: "Look at how closely the bold sum matches the dashed target for each waveform at the same number of terms.",
          answer: "The triangle wave converges much faster because it has no discontinuities — it's continuous, just with corners. The Fourier coefficients of a triangle wave fall off as 1/n², compared to 1/n for a square wave. Smoother functions need fewer harmonics to approximate well."
        }
      ]
    },
    {
      lab: "Plucked String",
      interactive: "plucked-string",
      questions: [
        {
          question: "Pluck the string exactly at its center. Look at the harmonic bar chart below. Are the even harmonics (2, 4, 6) present or absent?",
          tryThis: "Click at the midpoint of the string and watch which bars appear in the spectrum display.",
          answer: "The even harmonics are absent (or nearly zero). The center of the string is a node for modes 2, 4, 6..., so plucking there can't excite them. The string vibrates with only odd harmonics, giving a hollow, clarinet-like tone."
        },
        {
          question: "Now pluck near one end (around 1/5 of the way). Compare the harmonic bar chart to the center pluck. Are more or fewer harmonics excited?",
          tryThis: "Compare the number of nonzero bars in the spectrum for each pluck position.",
          answer: "Many more harmonics are excited — the spectrum is richer and brighter. Plucking near the end creates a sharp initial shape that requires many high-frequency components to represent. Plucking at the center creates a broad, smooth shape needing few. This is why guitarists pluck near the bridge for a bright sound and over the sound hole for a mellow tone."
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
          question: "Watch the teal dots on the string as the pulse passes. Do they move horizontally (along the string) or only vertically (perpendicular to it)?",
          tryThis: "Send a pulse and track a single dot's trajectory. Does it end up displaced from where it started after the pulse passes?",
          answer: "The dots move only vertically — perpendicular to the wave's travel direction. After the pulse passes, each dot returns to its original position. The wave transports energy along the string, but the string itself doesn't travel. This is a transverse wave."
        },
        {
          question: "Increase the tension T while keeping μ fixed. Read the wave speed v from the readout. How does v depend on T — linearly, or as a square root?",
          tryThis: "Note v at T = 2, then at T = 8 (4× the tension). Did v double or quadruple?",
          answer: "v increases as √T — quadrupling the tension doubles the speed. The formula is v = √(T/μ). Higher tension means a stronger restoring force pulling displaced sections back, so the wave propagates faster."
        }
      ]
    },
    {
      lab: "Sound Wave",
      interactive: "sound-wave-longitudinal",
      questions: [
        {
          question: "Watch the dots representing air molecules. Do they move perpendicular to the wave direction (like the string wave) or parallel to it?",
          tryThis: "Compare the dot motion here to what you saw in the string wave demo. Which direction do these dots oscillate?",
          answer: "The dots oscillate parallel to the wave direction — back and forth, not up and down. Where dots bunch up you see a compression (brighter region); where they spread apart you see a rarefaction (dimmer region). This is a longitudinal wave. Despite looking completely different from the string wave, the same wave equation governs both."
        },
        {
          question: "Watch the wavefront circles expanding from the speaker. Does the brightness (density of dots) decrease with distance from the source?",
          tryThis: "Compare the brightness of compressions near the speaker versus far away.",
          answer: "Yes — the amplitude decreases with distance. In 2D the amplitude falls as 1/√r (in 3D it would be 1/r). The same energy is spread over a larger wavefront as it expands, so intensity drops."
        }
      ]
    },
    {
      lab: "Boundary Conditions",
      interactive: "boundary-conditions-demo",
      questions: [
        {
          question: "Select Both Fixed and mode n = 1. Count the nodes (red dots). Now select mode n = 3. How many nodes are there now?",
          tryThis: "For Fixed-Fixed, check modes 1 through 4 and count nodes each time (including the fixed endpoints).",
          answer: "Mode n has n + 1 nodes (counting both fixed endpoints). Mode 1 has nodes only at the walls. Mode 3 has 4 nodes — the two walls plus 2 internal nodes. Each higher mode squeezes one more half-wavelength into the same length."
        },
        {
          question: "Switch to Fixed-Free. Look at mode n = 1. Is the right end (free end) a node or an antinode?",
          tryThis: "Watch the right end of the string. Does it stay still or swing with maximum amplitude?",
          answer: "The free end is an antinode — it swings with maximum amplitude. A free boundary must have zero slope (no transverse force), which means maximum displacement. Compare to the fixed end, which must have zero displacement (a node). This asymmetry means only odd quarter-wavelengths fit: f_n = (2n−1)f₁/2."
        }
      ]
    },
    {
      lab: "Standing Wave Modes",
      interactive: "standing-wave-modes",
      questions: [
        {
          question: "Compare the frequency ratios across the three boundary conditions. For Both Fixed, the modes are f₁, 2f₁, 3f₁, 4f₁. What are they for Fixed-Free?",
          tryThis: "Read the frequency labels below each mode in all three rows.",
          answer: "Fixed-Free gives only odd multiples: f₁, 3f₁, 5f₁, 7f₁. The even harmonics are missing because you can't fit an even number of quarter-wavelengths with one node and one antinode at the boundaries. This is why a clarinet (closed at one end) sounds different from a flute (open at both) — the clarinet is missing its even harmonics."
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
          question: "Set the frequency ratio to 1.5 (a perfect fifth). Look at the harmonic bar chart — how many harmonics are green (aligned) versus red (clashing)?",
          tryThis: "Now move the ratio slightly off 1.5, say to 1.48. Do the green bars turn red? Hit Listen for both.",
          answer: "At ratio 1.5 (= 3/2), every third harmonic of the lower note aligns with every second harmonic of the upper note — lots of green bars, and the combined waveform is smooth. At 1.48 the harmonics don't align, producing red bars and audible beating. Consonance is literally harmonic alignment; dissonance is the beats from near-misses."
        },
        {
          question: "Find the tritone (ratio ≈ 1.414). Listen to it and compare the combined waveform to the perfect fifth. What's different about the wave shape?",
          tryThis: "Watch the combined waveform at the bottom. Is it periodic and clean, or does it show irregular beating?",
          answer: "The tritone's waveform is irregular with visible beats — it never settles into a repeating pattern because √2 is irrational, so the two frequencies never come back into sync. The perfect fifth repeats cleanly every 2 cycles of the lower note. Your ear perceives this non-repeating pattern as roughness."
        }
      ]
    },
    {
      lab: "Instrument Spectra",
      interactive: "violin-spectrum",
      questions: [
        {
          question: "Compare two instruments playing the same note. Do they share the same fundamental frequency? Where do they differ?",
          tryThis: "Look at the spectrum bars. The first bar (fundamental) should match. Compare the heights of harmonics 2, 3, 4, etc.",
          answer: "Same fundamental, different harmonic recipe. This recipe — which harmonics are present and how strong they are — is called timbre. A clarinet emphasizes odd harmonics (it behaves like a closed pipe). A violin has a rich, full spectrum. A flute is nearly pure fundamental. Your ear uses these overtone fingerprints to identify instruments."
        }
      ]
    },
    {
      lab: "Circle of Fifths",
      interactive: "circle-of-fifths",
      questions: [
        {
          question: "In Pythagorean tuning, click around the circle through all 12 fifths back to the starting note. Does the circle close perfectly, or is there a gap?",
          tryThis: "Look for the red arc showing the Pythagorean comma. Switch to Equal Tempered and check if the gap disappears.",
          answer: "In Pythagorean tuning the circle doesn't close — there's a small gap (the Pythagorean comma, about 23 cents). Twelve perfect fifths (×3/2 each) overshoots seven octaves by a ratio of 3¹²/2¹⁹ ≈ 1.0136. Equal temperament fixes this by making each fifth slightly flat (700 cents instead of 702), so the circle closes exactly — at the cost of every interval being slightly impure."
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
          question: "Start with a long-duration oscillation. How many distinct peaks do you see in the frequency spectrum? Now shorten the duration — does the peak get wider or narrower?",
          tryThis: "Compare the spectrum width at long duration versus short duration. Watch the Δt and Δω readouts.",
          answer: "A long tone produces one narrow peak — it's essentially a single frequency. A short pulse produces a broad hump spanning many frequencies. The product Δt · Δω stays constant (≥ 1/2). This is the wave uncertainty principle: you can't know both when a signal happened and what frequency it was at arbitrary precision."
        }
      ]
    },
    {
      lab: "Damped Oscillation Spectrum",
      interactive: "underdamped-fourier-transform",
      questions: [
        {
          question: "Set light damping so the oscillation rings for many cycles. Is the spectral peak narrow or broad? Now increase damping — what happens to the peak width?",
          tryThis: "Compare the peak shape at γ = 0.2 versus γ = 2. The peak shape is a Lorentzian.",
          answer: "Light damping (long ring-down) gives a narrow spectral peak. Heavy damping (quick decay) gives a broad peak. The spectral width is proportional to γ. This is why atomic spectral lines have natural linewidths: the excited state decays with a lifetime τ, and the line width Δω ≈ 1/τ."
        }
      ]
    },
    {
      lab: "Fourier Filtering",
      interactive: "fourier-filtering",
      questions: [
        {
          question: "Look at the noisy signal. Apply the low-pass filter. Which features of the original signal survive, and which get removed?",
          tryThis: "Compare the filtered signal to the original. Are the slow, broad oscillations preserved? Are the fast, jittery fluctuations gone?",
          answer: "The low-pass filter keeps slow variations and removes high-frequency noise. The smooth underlying signal survives because it lives at low frequencies, while the noise is mostly high-frequency. This is exactly how noise-canceling headphones and radio receivers work — multiply the spectrum by zero in the unwanted region, then transform back."
        },
        {
          question: "Now try the band-pass filter. What's different about what survives compared to the low-pass?",
          tryThis: "The band-pass keeps only a chosen frequency range. Compare which parts of the signal survive.",
          answer: "The band-pass discards both very low and very high frequencies, keeping only a window around a chosen center frequency. This lets you extract a specific oscillation from a noisy signal — the principle behind tuning a radio to a specific station."
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
          question: "Send a pulse from the light string into the heavy string. Watch carefully at the junction — do you see both a reflected pulse and a transmitted pulse? Is the reflected pulse right-side up or inverted?",
          tryThis: "Watch for two pulses after the junction: one bouncing back, one continuing forward. Compare their orientations to the original.",
          answer: "You see both. Going from light to heavy (low Z to high Z), the reflected pulse is inverted and smaller than the original, while the transmitted pulse is upright but shorter. The heavy string acts somewhat like a fixed wall — it's hard to move, so it partially reflects the wave with a sign flip."
        },
        {
          question: "Now adjust the impedance ratio until Z₂ = Z₁ (matched impedance). Send another pulse. What happens to the reflection?",
          tryThis: "Slide the impedance ratio to exactly 1 and watch carefully for any reflected pulse.",
          answer: "The reflection disappears — 100% of the energy transmits. When Z₁ = Z₂, the reflection coefficient R = (Z₂ − Z₁)/(Z₂ + Z₁) = 0. The wave can't tell the media are different. This is impedance matching — the principle behind anti-reflection coatings on lenses and why audio cables have characteristic impedance ratings."
        }
      ]
    },
    {
      lab: "Impedance Explorer",
      interactive: "mass-collision-impedance",
      questions: [
        {
          question: "Send a wave into the high-impedance medium. Compare the transmitted wave amplitude to the incident amplitude. Is it bigger or smaller?",
          tryThis: "Watch the wave amplitude on each side of the boundary.",
          answer: "The transmitted wave has a smaller amplitude in the high-Z medium. Impedance Z = force/velocity, so a high-Z medium is harder to move — it takes more force to get the same displacement. Some energy reflects rather than transmitting, and what does transmit shows up as a lower amplitude."
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
          question: "Watch the energy indicators on the traveling wave. Is the energy concentrated at the wave crests, or is it spread uniformly along the string?",
          tryThis: "Compare the energy density at different points along the traveling wave. Now switch to a standing wave and check — is it still uniform?",
          answer: "In a traveling wave, the energy density is uniform (averaged over a cycle) — every section of the string carries the same energy. In a standing wave, energy sloshes back and forth: it's concentrated as kinetic energy at the nodes (where velocity is maximum) and as potential energy at the antinodes (where displacement is maximum), oscillating between the two twice per cycle."
        }
      ]
    },
    {
      lab: "Power at Boundaries",
      interactive: "power-reflection-transmission",
      questions: [
        {
          question: "Set Z₂/Z₁ = 1 (matched). What fraction of power is reflected? Now set Z₂/Z₁ = 3. Read the reflected and transmitted power fractions — do they add up to 1?",
          tryThis: "Check several impedance ratios. At each one, add the reflected and transmitted fractions.",
          answer: "At Z₂/Z₁ = 1, zero power reflects. At Z₂/Z₁ = 3, the reflected fraction is R² = ((3−1)/(3+1))² = 0.25, and the transmitted fraction is 0.75. They always add to 1 — energy conservation. At extreme mismatches (Z₂ ≫ Z₁ or Z₂ ≪ Z₁) nearly all power reflects."
        }
      ]
    },
    {
      lab: "Decibel Scale",
      interactive: "decibel-scale",
      questions: [
        {
          question: "How many times more powerful is 60 dB than 40 dB? How about 60 dB versus 30 dB?",
          tryThis: "Remember that each 10 dB step is ×10 in power. Count the number of 10 dB steps between the values.",
          answer: "60 dB is 100× more powerful than 40 dB (2 steps of ×10), and 1000× more powerful than 30 dB (3 steps). The log scale compresses a huge range: a whisper (~30 dB) to a rock concert (~110 dB) is a factor of 10⁸ in power, which would be unusable on a linear scale."
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
          question: "Look at the two panels: x-space (left) and k-space (right). Slide σ_x to make the x-space packet very narrow. What happens to the k-space peak? Read the Δx · Δk product.",
          tryThis: "Try σ_x = 0.5, then σ_x = 2. Compare the widths in both panels. Does the product Δx · Δk ever go below 1/2?",
          answer: "When the x-space packet narrows, the k-space peak widens, and vice versa. The product Δx · Δk stays at exactly 1/2 for a Gaussian (the minimum possible value). You cannot simultaneously localize a wave in both position and momentum. This is the uncertainty principle."
        },
        {
          question: "With a narrow wavepacket, watch the individual wave crests inside the envelope. Do they move at the same speed as the envelope itself?",
          tryThis: "Follow a single crest as the packet propagates and compare its speed to the envelope's overall motion.",
          answer: "They can differ. The crests move at the phase velocity v_p = ω/k, while the envelope moves at the group velocity v_g = dω/dk. In a dispersive medium these are different. The group velocity is what carries energy and information — it's the physically meaningful speed."
        }
      ]
    },
    {
      lab: "Wavepacket Dispersion",
      interactive: "wavepacket-dispersion",
      questions: [
        {
          question: "Enable dispersion and watch the wavepacket evolve over several seconds. Does the peak height increase, decrease, or stay the same? Does the width change?",
          tryThis: "Compare the packet shape at t = 0 versus after significant evolution. Then turn off dispersion and compare.",
          answer: "With dispersion on, the packet spreads out and its peak height drops (the area under the curve is conserved). Without dispersion, the shape is preserved indefinitely. Dispersion occurs because different frequency components travel at different speeds, stretching the packet apart — like a short lightning crack becoming a rolling rumble over distance."
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
          question: "Track a single particle through one complete wave cycle. Does it end up displaced from where it started, or back at the same position?",
          tryThis: "Pick one particle and watch its trajectory as the wave passes through it completely.",
          answer: "It returns to its original position. Waves transport energy without transporting matter. Each particle oscillates around its equilibrium and returns — the wave's pattern moves forward, but the medium does not. An ocean wave moves energy across the sea, but the water itself stays put."
        }
      ]
    },
    {
      lab: "Transverse vs Longitudinal",
      interactive: "transverse-longitudinal-demo",
      questions: [
        {
          question: "In the transverse wave, which direction do the particles move: parallel to the wave propagation, or perpendicular? What about the longitudinal wave?",
          tryThis: "Look at the arrows or particle motions in each. Compare the motion direction to the wave's travel direction (left to right).",
          answer: "Transverse: particles move perpendicular (up-down while the wave goes left-right). Longitudinal: particles move parallel (left-right, creating compressions and rarefactions). Fluids can only support longitudinal waves because they can't sustain shear stress. Solids support both. This is how seismologists proved Earth's outer core is liquid — shear waves (transverse) don't make it through."
        }
      ]
    },
    {
      lab: "Sound Refraction",
      interactive: "sound-refraction-atmosphere",
      questions: [
        {
          question: "On a cold night with warm air above (temperature inversion), which direction do the wavefronts bend — upward away from the ground, or back downward?",
          tryThis: "Watch the wavefronts in the temperature gradient. The top of each wavefront is in warmer air where sound travels faster.",
          answer: "They bend downward. Sound travels faster in warm air, so the top of each wavefront outpaces the bottom, tilting the wave back toward the ground. This is why you can hear conversations across a lake on a cold, still night — sound that would normally escape upward gets refracted back to you."
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
          question: "Watch the blue (E) and amber (B) field arrows. When E is at its maximum, is B also at its maximum, or at zero?",
          tryThis: "Follow the arrows through one cycle. Check whether E and B peak at the same position along the wave.",
          answer: "E and B peak at the same position — they're in phase. They're also perpendicular to each other and both perpendicular to the propagation direction k. Their magnitudes are locked in the ratio |E|/|B| = c. Neither can exist without the other: a changing E creates B, and a changing B creates E."
        },
        {
          question: "Change the frequency slider. Does the wave speed change, or just the wavelength?",
          tryThis: "Watch how the spacing between the field peaks changes as you adjust frequency.",
          answer: "The speed stays at c — only the wavelength changes. Higher frequency means shorter wavelength (λ = c/f). All electromagnetic waves travel at the same speed in vacuum regardless of frequency. This is one of the key differences from waves in material media, where speed often depends on frequency (dispersion)."
        }
      ]
    },
    {
      lab: "EM Spectrum",
      interactive: "em-spectrum",
      questions: [
        {
          question: "Drag the marker across the full spectrum. What is the wavelength range of visible light? How does this compare to the full span of the spectrum?",
          tryThis: "Find the visible band (the rainbow strip) and read the wavelengths at its edges. Then look at the total range from radio to gamma.",
          answer: "Visible light spans roughly 400–700 nm — less than one octave of the electromagnetic spectrum, which covers over 20 orders of magnitude in wavelength. Radio, microwave, IR, visible, UV, X-ray, and gamma are all the same phenomenon (oscillating E and B fields) at different frequencies. Evolution tuned our eyes to the narrow window where the Sun emits most intensely."
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
          question: "Switch between Linear and Right-Circular polarization. In the end-on view (looking down the k-axis), what path does the E-field tip trace out in each case?",
          tryThis: "Watch the end-on view in the lower right. For linear: is it a line or a circle? For circular: same question.",
          answer: "Linear polarization traces a straight line (the E-field oscillates back and forth in one fixed direction). Circular polarization traces a circle (the E-field vector rotates as the wave propagates). Circular polarization carries angular momentum — each photon carries ±ℏ of spin."
        },
        {
          question: "In Linear mode, adjust the polarization angle slider. Does the 3D wave shape change, or just rotate?",
          tryThis: "Try 0°, 45°, 90°. Watch the 3D view.",
          answer: "The wave just rotates — the shape (sinusoidal oscillation) stays the same, but the plane of oscillation tilts. Any linear polarization is a valid state; the angle just tells you which direction E oscillates. Unpolarized light (like sunlight) rapidly and randomly switches between all these angles."
        }
      ]
    },
    {
      lab: "Malus's Law",
      interactive: "malus-law",
      questions: [
        {
          question: "Rotate the analyzer (polarizer 2) and read the transmitted intensity I. At what angle does I drop to zero? At what angle is I = I₀/2?",
          tryThis: "Drag the analyzer disc through 0° to 90°. Watch the intensity bar and the formula I = I₀ cos²θ.",
          answer: "I = 0 at θ = 90° (crossed polarizers — no light gets through). I = I₀/2 at θ = 45°. The transmission follows Malus's law: I = I₀ cos²θ. This is because the component of E along the analyzer's axis is E₀ cosθ, and intensity goes as E²."
        },
        {
          question: "With the analyzer at 90° (no light through), imagine inserting a third polarizer at 45° between them. Would light get through? The formula I = I₀ cos²θ applies at each polarizer.",
          tryThis: "Calculate: after polarizer 1 (0°), intensity is I₀. A 45° polarizer passes cos²(45°) = 1/2. Then the 90° polarizer passes cos²(45°) of that.",
          answer: "Yes — 25% of the light gets through! The 45° polarizer rotates the polarization direction, so it's no longer perpendicular to the final polarizer. Adding an obstacle increases transmission. With N evenly-spaced polarizers between crossed polarizers, the transmission approaches 100% as N → ∞."
        }
      ]
    },
    {
      lab: "3D Movie Glasses",
      interactive: "3d-movie-glasses",
      questions: [
        {
          question: "With linear polarization, tilt your head 45°. Does the left-eye/right-eye separation still work? Now try circular polarization and tilt. Which system is tilt-tolerant?",
          tryThis: "Watch what happens to image crosstalk (leakage between eyes) as you tilt with each system.",
          answer: "Linear polarization fails when tilted — the rotated polarization axis lets the wrong image leak through. Circular polarization works at any tilt because handedness (clockwise vs counterclockwise rotation) doesn't change when you rotate the viewing angle. This is why all modern 3D cinemas use circular polarization."
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
          question: "Set n₂/n₁ = 1.5 (like air to glass). Increase θ₁ from 0° to 60°. Does θ₂ increase faster or slower than θ₁? Check the readouts.",
          tryThis: "Read θ₁ and θ₂ at several angles. Verify that n₁ sin(θ₁) = n₂ sin(θ₂) using the displayed values.",
          answer: "θ₂ increases slower than θ₁ when entering a denser medium (n₂ > n₁). At θ₁ = 30°, θ₂ ≈ 19.5°. The beam bends toward the normal because light slows down inside the glass, and the wavelength shrinks while the frequency stays the same."
        },
        {
          question: "Now set n₂/n₁ = 0.67 (glass to air). Increase θ₁ slowly. At what angle does the refracted ray disappear?",
          tryThis: "Watch the refracted ray (amber) as θ₁ increases. At some angle it bends to 90° — parallel to the surface. Beyond that, it vanishes.",
          answer: "The refracted ray vanishes at the critical angle θ_c = arcsin(n₂/n₁) = arcsin(0.67) ≈ 42°. Beyond this angle, total internal reflection occurs — all light bounces back, none escapes. This is how fiber optics work: light bounces along inside the fiber, trapped by TIR."
        }
      ]
    },
    {
      lab: "Total Internal Reflection",
      interactive: "total-internal-reflection",
      questions: [
        {
          question: "Increase the angle past the critical angle. Does the reflected ray get brighter? Is any light transmitted at all?",
          tryThis: "Watch the reflected ray brightness below versus above the critical angle.",
          answer: "Below the critical angle, some light transmits and the reflection is partial. At and beyond the critical angle, 100% of the light reflects — the reflected ray is at full brightness and no transmitted ray exists. Diamonds exploit this: their high index (n = 2.42) gives a critical angle of only 24.4°, trapping light inside for many internal reflections before it escapes, creating sparkle."
        }
      ]
    },
    {
      lab: "Thin Film Interference",
      interactive: "thin-film-interference",
      questions: [
        {
          question: "Slowly increase the film thickness from 100 nm to 600 nm. Watch the reflected color swatch. Does it cycle through the spectrum or stay one color?",
          tryThis: "Note the color at 100 nm, 200 nm, 300 nm, 400 nm, 500 nm. Watch the reflectance curve R(λ) to see which wavelengths are constructively enhanced.",
          answer: "The color cycles through the spectrum as thickness increases. At each thickness, a different wavelength satisfies the constructive interference condition (round-trip path = integer × wavelength). This is why a soap bubble shows different colors at different heights — gravity thins the film, and each thickness selects a different color."
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
          question: "Watch white light enter the prism. Which color exits at the largest angle from the original beam direction — red or violet?",
          tryThis: "Compare the exit angles of the red and violet rays.",
          answer: "Violet bends the most — glass has a higher refractive index for shorter wavelengths (normal dispersion). The difference in bending angle fans the colors out into a spectrum. This same dispersion gives diamonds their 'fire' — strong variation of n with λ creates vivid color separation."
        }
      ]
    },
    {
      lab: "Rayleigh Scattering",
      interactive: "rayleigh-scattering",
      questions: [
        {
          question: "Compare the scattering intensity for blue light versus red light. By roughly what factor is blue scattered more strongly?",
          tryThis: "The scattering intensity goes as 1/λ⁴. Blue light has λ ≈ 450 nm, red has λ ≈ 650 nm. Compute (650/450)⁴.",
          answer: "Blue scatters about (650/450)⁴ ≈ 4.4 times more than red (roughly 5-10× depending on exact wavelengths). This is why the sky is blue when you look away from the Sun (you see scattered light, biased toward blue) and why sunsets are red (after a long atmospheric path, most blue has been scattered away, leaving red)."
        }
      ]
    },
    {
      lab: "Microscopic Index",
      interactive: "microscopic-index",
      questions: [
        {
          question: "Watch the electrons in each atom respond to the incoming light. Do they oscillate at the same frequency as the light, or at a different frequency?",
          tryThis: "Compare the oscillation rate of the electrons to the incoming wave's frequency.",
          answer: "They oscillate at the same frequency as the incoming light — they're driven oscillators. Each electron absorbs and re-emits the wave with a slight phase delay. The superposition of the original wave and all the re-emitted wavelets creates a wave that appears to travel slower. This apparent slowing is the refractive index."
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
          question: "Create two physically different light spectra (different slider positions) that produce identical-looking color patches. Are the actual spectra the same?",
          tryThis: "Adjust the sliders until both color patches match. Then compare the spectral profiles — are they identical curves or different curves that happen to look the same?",
          answer: "The spectra are different — they're metamers. Your eye has only 3 cone types (L, M, S), so it projects the entire spectrum down to just 3 numbers. Many different spectra can produce the same 3 cone responses. This is why RGB screens work: they don't reproduce actual spectra, they just trigger the same cone responses."
        }
      ]
    },
    {
      lab: "Cone Sensitivity",
      interactive: "cie-tristimulus-curves",
      questions: [
        {
          question: "Look at the three cone sensitivity curves. At what wavelengths do the L, M, and S cones peak? Is there significant overlap between the L and M curves?",
          tryThis: "Read the peak wavelengths from the curves. Check how much the L and M curves overlap in the green region.",
          answer: "S cones peak near 420 nm (blue), M near 534 nm (green), L near 564 nm (yellowish-green — not red, despite being called the 'red' cone). L and M overlap substantially, which is why red-green color blindness is so common: mutations that shift one curve toward the other make them nearly indistinguishable."
        }
      ]
    },
    {
      lab: "Additive vs Subtractive",
      interactive: "additive-subtractive-mixing",
      questions: [
        {
          question: "Mix red + green in the additive (light) mode. What color do you get? Now mix red + green in the subtractive (paint) mode. Same or different result?",
          tryThis: "Compare the results of the same combination in both modes.",
          answer: "Additive: red + green light makes yellow (L and M cones are equally stimulated). Subtractive: red + green paint makes dark brown (each pigment absorbs the other's reflected wavelengths, leaving almost nothing). Light mixing adds wavelengths; paint mixing subtracts them. Completely different physics, completely different results."
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
          question: "Look at the radiation pattern. In which direction is the radiation strongest — broadside (perpendicular to the antenna) or along the antenna axis? Where does it go to zero?",
          tryThis: "Find the maximum and minimum of the radiation pattern. The pattern follows sin²θ.",
          answer: "Strongest broadside (perpendicular), zero along the antenna axis. The charges accelerate up and down along the antenna. An observer broadside sees the full transverse acceleration and receives maximum radiation. An observer along the axis sees acceleration pointing straight at them — no transverse component, so no radiation."
        }
      ]
    },
    {
      lab: "Two-Source Interference",
      interactive: "two-source-interference",
      questions: [
        {
          question: "Set two sources half a wavelength apart with 0° phase difference. Where is the radiation strongest? Now flip to 180° phase difference — does the pattern rotate?",
          tryThis: "Watch the combined radiation pattern as you toggle the phase between 0° and 180°.",
          answer: "At 0° phase: strongest broadside (perpendicular to the line connecting the sources). At 180° phase: the broadside direction cancels and the radiation peaks endfire (along the line connecting them). The phase difference lets you steer the beam direction without moving the antennas."
        }
      ]
    },
    {
      lab: "Phased Array",
      interactive: "phased-array-radiation",
      questions: [
        {
          question: "Sweep the progressive phase shift between elements. Does the main beam direction change? By how much can you steer it?",
          tryThis: "Start at zero phase shift (beam broadside). Increase the shift and watch the beam sweep.",
          answer: "The beam sweeps continuously as you change the phase gradient. The beam points to the angle where d·sinθ equals the phase shift × λ/(2π). This is electronic beam steering — no moving parts. Radar, 5G, and Starlink all use this principle."
        },
        {
          question: "Increase the number of antenna elements from 4 to 16. What happens to the main beam width? Do you see any smaller side lobes appear?",
          tryThis: "Compare the beam width (angular width of the main peak) at 4 vs 8 vs 16 elements.",
          answer: "More elements = narrower main beam, following Δθ ≈ λ/(Nd). Doubling the number of elements halves the beam width. Side lobes also appear — these are unavoidable secondary peaks from the periodic array structure. Tapering the element amplitudes (apodization) can suppress side lobes at the cost of a slightly wider main beam."
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
          question: "Set the slit width much wider than λ. Does the wave spread out much after passing through? Now make the slit comparable to λ. What changes?",
          tryThis: "Compare the wave pattern after the slit at slit ≫ λ versus slit ≈ λ. Look at how far the wave fans out.",
          answer: "With a wide slit the wave passes nearly straight through with sharp shadows. When the slit narrows to λ or smaller, the wave fans out dramatically — nearly semicircular wavefronts emerge, as if the slit were a point source. This is diffraction: it's only significant when the aperture is comparable to the wavelength."
        }
      ]
    },
    {
      lab: "Single Slit Diffraction",
      interactive: "single-slit-diffraction",
      questions: [
        {
          question: "Look at the intensity graph on the screen. How wide is the central bright maximum compared to the side maxima? Now narrow the slit — does the central maximum get wider or narrower?",
          tryThis: "Compare the central peak width at different slit widths. The central peak is always wider than the side peaks.",
          answer: "The central maximum is always twice as wide as the side maxima. Narrowing the slit makes the entire pattern wider (more diffraction). This is the key paradox: a smaller aperture produces a larger pattern. The first dark fringe occurs at sinθ = λ/a, so smaller a means larger θ."
        }
      ]
    },
    {
      lab: "Diffraction Grating",
      interactive: "diffraction-grating-pattern",
      questions: [
        {
          question: "Start with 2 slits (Young's experiment). Now increase to 5, then 20 slits. Do the bright peak positions change, or just their sharpness?",
          tryThis: "Watch whether the peaks move as you add slits, or just get narrower. Count the small secondary maxima between main peaks.",
          answer: "The main peak positions don't change — they're set by d·sinθ = mλ, which depends on slit spacing d, not the number of slits. But the peaks get much sharper with more slits. Between each pair of main peaks, there are N−2 secondary maxima. A 1000-slit grating can resolve wavelength differences of 0.1%, making it essential for spectroscopy."
        }
      ]
    },
    {
      lab: "Fourier Optics",
      interactive: "fourier-optics-demo",
      questions: [
        {
          question: "Compare a wide single slit to a narrow single slit. The wide slit is broad in space — is its diffraction pattern broad or narrow in angle? What about the narrow slit?",
          tryThis: "Note the inverse relationship: wide aperture → narrow pattern, narrow aperture → wide pattern.",
          answer: "Wide in space → narrow in angle, and vice versa. The far-field diffraction pattern is the Fourier transform of the aperture. This is the same Δx · Δk ≥ 1/2 uncertainty relation appearing in optics: you can't simultaneously have a compact source and a compact beam."
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
          question: "Set the frequency below the threshold and turn the intensity to maximum. Are any electrons ejected? Now raise the frequency just above threshold at minimum intensity. What happens?",
          tryThis: "Try every combination: high intensity + low frequency, then low intensity + high frequency. Which combination ejects electrons?",
          answer: "Below threshold: no electrons regardless of intensity. Above threshold: electrons are ejected even at minimum intensity. This proves light comes in discrete packets (photons) with energy E = hf. Each photon must individually carry enough energy to free an electron. A million weak photons can't substitute for one strong one."
        },
        {
          question: "Above threshold, increase the frequency further. Does the kinetic energy of the ejected electrons increase, decrease, or stay the same?",
          tryThis: "Watch the electron speed or kinetic energy readout as you raise the frequency above threshold.",
          answer: "The kinetic energy increases linearly with frequency: KE = hf − W, where W is the work function (the minimum energy to free an electron). Higher-frequency photons carry more energy, and the excess beyond W goes into kinetic energy. This linear relationship is how Planck's constant h was first measured precisely."
        }
      ]
    },
    {
      lab: "Double Slit Photons",
      interactive: "double-slit-photon-buildup",
      questions: [
        {
          question: "Watch photons arrive one at a time. After 10 photons, is there a visible pattern? After 1000? At what point does the interference pattern become recognizable?",
          tryThis: "Be patient. The first few dozen dots look random. Keep watching as hundreds accumulate.",
          answer: "Early on, the dots appear random — no visible pattern. After hundreds to thousands of detections, the double-slit interference pattern emerges clearly: bright bands where photons accumulate, dark bands where they almost never land. Each individual photon interferes with itself (going through both slits as a wave), but is detected at a single point (as a particle)."
        }
      ]
    },
    {
      lab: "Hydrogen Energy Levels",
      interactive: "hydrogen-energy-levels",
      questions: [
        {
          question: "Look at the energy level spacing. Are the levels evenly spaced, or do they get closer together at higher n?",
          tryThis: "Compare the gap between n=1 and n=2 to the gap between n=3 and n=4.",
          answer: "The levels get closer together at higher n. The energies go as E_n = −13.6/n² eV, so the spacing shrinks as 1/n³. The n=1→2 gap is 10.2 eV, while the n=3→4 gap is only 0.66 eV. As n→∞ the levels merge into a continuum — this is the ionization threshold where the electron is free."
        },
        {
          question: "When the electron drops from n=2 to n=1, a photon is emitted. Is this photon in the visible, UV, or infrared part of the spectrum?",
          tryThis: "Check the energy of the transition (10.2 eV) or the wavelength. Visible light is roughly 1.8–3.1 eV.",
          answer: "It's deep ultraviolet (Lyman-alpha, 121.6 nm). The n=2→1 transition has too much energy for visible light. Visible hydrogen lines come from transitions to n=2 (the Balmer series): n=3→2 is red (656 nm), n=4→2 is blue-green (486 nm). The discrete spectrum directly reveals the discrete energy levels."
        }
      ]
    },
    {
      lab: "Quantum Wavepacket",
      interactive: "quantum-wavepacket-dispersion",
      questions: [
        {
          question: "Watch the quantum wavepacket evolve over time. Does it maintain its width, or does it spread out? Does the peak amplitude stay constant?",
          tryThis: "Compare the wavepacket shape at t=0 versus after significant evolution.",
          answer: "It spreads out and the peak drops — the wavepacket delocalizes. The quantum dispersion relation E = p²/(2m) is nonlinear (ω = ℏk²/2m), so different momentum components travel at different speeds. A particle that starts well-localized inevitably becomes less localized over time. This is the uncertainty principle in action: precise position at t=0 requires a spread of momenta, which spreads the position later."
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
          question: "Watch the wavefront circles. In front of the moving source, are the circles closer together or farther apart compared to behind the source?",
          tryThis: "Compare the wavefront spacing (which corresponds to wavelength) ahead versus behind the source.",
          answer: "Closer together in front (compressed = shorter wavelength = higher frequency), farther apart behind (stretched = longer wavelength = lower frequency). The source chases its own forward-going waves, bunching them up, while running away from the backward-going waves, stretching them. An observer hears a pitch drop as the source passes."
        },
        {
          question: "Increase the source speed. Does the wavefront compression in front get more or less extreme?",
          tryThis: "Compare the wavefront spacing ahead of the source at low speed versus high speed (but still subsonic).",
          answer: "More extreme — the wavefronts pile up more tightly. At higher source speed, the source nearly catches up to its own waves. The received frequency is f' = f·v/(v − v_s), which diverges as v_s → v (the speed of sound). This pileup is what leads to the sonic boom at Mach 1."
        }
      ]
    },
    {
      lab: "Sonic Boom",
      interactive: "sonic-boom-mach-cone",
      questions: [
        {
          question: "Set the source speed to exactly the wave speed (Mach 1). What happens to the wavefronts directly ahead — do they pile up into a single surface?",
          tryThis: "Watch the wavefront pattern at Mach 1. Then increase to Mach 2. Does a cone form? What's the cone half-angle?",
          answer: "At Mach 1, all wavefronts pile up at the source's nose into a flat shock front. Above Mach 1, they form a cone with half-angle sinθ = 1/M (so Mach 2 gives θ = 30°). The shock front carries a sudden, intense pressure jump — the sonic boom. The faster the source, the narrower the cone."
        }
      ]
    },
    {
      lab: "Relativistic Doppler",
      interactive: "relativistic-doppler-redshift",
      questions: [
        {
          question: "A receding source redshifts — its spectral lines move to longer wavelengths. Look at the shift for a source moving at 0.5c. Is the observed wavelength 1.5× the emitted wavelength, or something different?",
          tryThis: "Check the relativistic formula f' = f√((1−β)/(1+β)). At β = 0.5, compute the ratio.",
          answer: "The relativistic formula gives f'/f = √((1−0.5)/(1+0.5)) = √(1/3) ≈ 0.577, so the wavelength increases by a factor of 1/0.577 ≈ 1.73, not 1.5. The relativistic result differs from the classical one because of time dilation — the moving source's clock runs slow, which adds extra redshift on top of the classical Doppler effect."
        }
      ]
    },
    {
      lab: "Exoplanet Detection",
      interactive: "doppler-spectroscopy-exoplanet",
      questions: [
        {
          question: "Watch the star's spectral lines oscillate back and forth. Can you read the orbital period of the planet from the period of this oscillation?",
          tryThis: "Time how long it takes the spectral shift to complete one full cycle (maximum redshift → blueshift → back to redshift).",
          answer: "Yes — the spectral oscillation period equals the planet's orbital period exactly. The planet pulls the star in a small reflex orbit with the same period. The amplitude of the velocity shift tells you the planet's minimum mass: a heavier planet produces a larger stellar wobble. This method has found hundreds of exoplanets by measuring velocity shifts as small as 1 m/s."
        }
      ]
    }
  ]
};
