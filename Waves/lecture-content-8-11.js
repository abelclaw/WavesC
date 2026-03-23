window.LECTURE_CONTENT_8_11 = {

  "8": [
    {
      heading: "Strings",
      body: `<p>To understand sound, we need to know more than just which notes are played — we need the <strong>shape</strong> of the notes. If a string were a pure infinitely thin oscillator, with no damping, it would produce pure notes. In the real world, strings have finite width and radius, we pluck or bow them in funny ways, the vibrations are transmitted to sound waves in the air through the body of the instrument, etc. All this combines to a much more interesting picture than pure frequencies.</p>
<p>For example, the spectrum of a violin shows the intensity of each frequency produced (the vertical axis is in decibels, which is a logarithmic measure of sound intensity; we'll discuss this scale in Lecture 10). We know the basics of this spectrum: the fundamental and the harmonics are related to the <strong>Fourier series</strong> of the note played. Now we want to understand where the <strong>shape of the peaks</strong> comes from. The tool for studying these things is the <strong>Fourier transform</strong>.</p>`,
      interactive: "violin-spectrum",
      interactiveCaption: "Spectrum of a violin showing the fundamental and harmonics with characteristic peak shapes",
      mathLinks: ["fourier-series-review"]
    },
    {
      heading: "Fourier Transforms",
      body: `<p>In the violin spectrum, you can see that the violin produces sound waves with frequencies which are arbitrarily close. The way to describe these frequencies is with <strong>Fourier transforms</strong>.</p>
<p>Recall the Fourier exponential series:</p>
<p style="text-align:center;">$$f(x) = \\sum_{n=-\\infty}^{\\infty} c_n e^{i2\\pi nx/L}$$</p>
<p>where the coefficients are:</p>
<p style="text-align:center;">$$c_n = (1/L) \\int_{-L/2}^{L/2} f(x) e^{-i2\\pi nx/L} dx$$</p>
<details><summary><strong>Verification of the Fourier series inversion</strong></summary>
<p>To check, plug the series for <em>f(x)</em> into the integral for <em>$c_{n}$</em>:</p>
<p style="text-align:center;">$$c_n = (1/L) \\sum_m c_m \\int_{-L/2}^{L/2} e^{i2\\pi(m-n)x/L} dx$$</p>
<p>Using the orthogonality identity $\\int_{-L/2}^{L/2}$ e<sup>i(m-n)2$\\pi$x/L</sup> dx = L$\\delta_{mn}$, we get $c_{n}$ = (1/L) $\\sum_{m} c_{m}$ L$\\delta_{nm} = c_{n}$, as desired.</p>
</details>
<p>To derive the Fourier transform, we write $k_n = 2\\pi n/L$ where <em>n</em> is still an integer going from -$\\infty$ to +$\\infty$. For arbitrary <em>L</em>, <em>$k_{n}$</em> can get arbitrarily big in the positive or negative direction. However, at fixed <em>L</em>, the lowest non-zero <em>$k_{n}$</em> cannot be arbitrarily small: |$k_{n}$| &gt; 2$\\pi$/L. Then we define:</p>
<p style="text-align:center;">$$\\tilde{f}(k_n) = Lc_n/(2\\pi) = (1/2\\pi) \\int_{-L/2}^{L/2} f(x) e^{-ik_nx} dx$$</p>
<p>The factor of 2$\\pi$ in this equation is just a convention. Now we can take L $\\rightarrow \\infty$ so that <em>$k_{n}$</em> can get arbitrarily close to zero. This gives:</p>
<p style="text-align:center;">$$\\tilde{f}(k) = (1/2\\pi) \\int_{-\\infty}^{\\infty} f(x) e^{-ikx} dx$$</p>
<p>where now <em>k</em> can be any real number. This is the <strong>Fourier transform</strong>. It is a continuum generalization of the <em>$c_{n}$</em>'s of the Fourier series.</p>
<details><summary><strong>Derivation of the inverse Fourier transform</strong></summary>
<p>The inverse comes from writing the Fourier series as an integral. From $k_{n}$ = 2$\\pi$n/L, we find d$k_{n}$ = (2$\\pi$/L)$\\Delta$n. This leads to:</p>
<p style="text-align:center;">$$f(x) = \\sum c_n e^{ikx} \\Delta n = \\sum c_n e^{ikx} (L/2\\pi) dk_n = \\int_{-\\infty}^{\\infty} \\tilde{f}(k) e^{ikx} dk$$</p>
<p>where we have used the definition of $\\tilde{f}$(k) and taken L $\\rightarrow \\infty$ in the last step.</p>
</details>
<p>So we have the <strong>Fourier transform pair</strong>:</p>
<p style="text-align:center;">$$\\tilde{f}(k) = (1/2\\pi) \\int_{-\\infty}^{\\infty} f(x) e^{-ikx} dx  \\;  \\; \\Leftrightarrow \\;  \\;  f(x) = \\int_{-\\infty}^{\\infty} \\tilde{f}(k) e^{ikx} dk$$</p>
<p>We say that <em>$\\tilde{f}$(k)</em> is the Fourier transform of <em>f(x)</em>. The factor of 2$\\pi$ is just a convention. We could also have defined <em>f(x)</em> with the 2$\\pi$ in it. The sign on the phase is also a convention. Keep in mind that <strong>different conventions are used in different places and by different people</strong>. There is no universal convention for the 2$\\pi$ factors. All conventions lead to the same physics.</p>
<p>The Fourier transform of a function of <em>x</em> gives a function of <em>k</em>, where <em>k</em> is the wavenumber. The Fourier transform of a function of <em>t</em> gives a function of $\\omega$ where $\\omega$ is the angular frequency:</p>
<p style="text-align:center;">$$\\tilde{f}(\\omega) = (1/2\\pi) \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} dt$$</p>
<span class='inline-math-link' data-math='fourier-transform-math'>Fourier Transform Conventions $\\rightarrow$</span>`,
      interactive: "fourier-transform-derivation",
      interactiveCaption: "Transition from discrete Fourier series to the continuous Fourier transform as L approaches infinity",
      mathLinks: ["fourier-transform-math"]
    },
    {
      heading: "Example: Underdamped Oscillator",
      body: `<p>As an example, let us compute the Fourier transform of the position of an <strong>underdamped oscillator</strong>:</p>
<p style="text-align:center;">$$f(t) = e^{-\\gamma t} \\cos(\\omega_0t) \\theta(t)$$</p>
<p>where the <strong>unit-step function</strong> (Heaviside function) is defined by $\\theta$(t) = 1 for t &gt; 0 and $\\theta$(t) = 0 for t $\\leq$ 0. This function ensures that our oscillator starts at time t = 0. If we didn't include it, the amplitude would blow up as t $\\rightarrow -\\infty$.</p>
<details><summary><strong>Full derivation of the Fourier transform</strong></summary>
<p>We first write cos($\\omega_{0}$t) = $\\frac{1}{2}$(e<sup>i$\\omega_{0}$t</sup> + e<sup>-i$\\omega_{0}$t</sup>), so:</p>
<p style="text-align:center;">$$f(t) = \\frac{1}{2} e^{-\\gamma t} e^{i\\omega_0t} \\theta(t) + \\frac{1}{2} e^{-\\gamma t} e^{-i\\omega_0t} \\theta(t)$$</p>
<p>Starting with the first term:</p>
<p style="text-align:center;">$$\\tilde{f}_{+\\omega_0}(\\omega) = (1/4\\pi) \\int_0^{\\infty} e^{(-\\gamma - i\\omega + i\\omega_0)t} dt = (1/4\\pi) \\cdot 1/(\\gamma + i(\\omega - \\omega_0))$$</p>
<p>In the last step we used that the t = $\\infty$ endpoint vanishes due to the e<sup>-$\\gamma$t</sup> factor, and at t = 0 the exponential is 1. The second term is the first with $\\omega_{0} \\rightarrow -\\omega_{0}$. Thus the full Fourier transform is:</p>
<p style="text-align:center;">$$\\tilde{f}(\\omega) = (1/4\\pi)[1/(\\gamma + i(\\omega - \\omega_0)) + 1/(\\gamma + i(\\omega + \\omega_0))] = (1/2\\pi i) \\cdot (\\omega - i\\gamma) / ((\\omega - i\\gamma)^2 - \\omega_0^2)$$</p>
</details>
<p>The result is:</p>
<p style="text-align:center;">$$\\tilde{f}(\\omega) = (1/2\\pi i) \\cdot (\\omega - i\\gamma) / ((\\omega - i\\gamma)^2 - \\omega_0^2)$$</p>
<p>The spectrum plotted for an audio signal is usually |$\\tilde{f}(\\omega$)|<sup>2</sup>. Taking $\\omega_{0}$ = 10 and $\\gamma$ = 2, the modulus squared of the Fourier transform shows peaks centered at $\\pm \\omega_{0}$ with widths determined by $\\gamma$.</p>
<p>We can now also understand what the shapes of the peaks are in the violin spectrum. The <strong>widths of the peaks give how much each harmonic damps with time</strong>. The width at half maximum gives the damping factor $\\gamma$.</p>`,
      interactive: "underdamped-fourier-transform",
      interactiveCaption: "An underdamped oscillator (left) and its power spectrum |$\\tilde{f}(\\omega$)|² (right) for $\\gamma$ = 2 and $\\omega$₀ = 10",
      mathLinks: ["fourier-transform-math", "underdamped-oscillator-math"]
    },
    {
      heading: "Fourier Transform is Complex",
      body: `<p>For a real function <em>f(t)</em>, the Fourier transform will usually <strong>not be real</strong>. Indeed, the imaginary part of the Fourier transform of a real function is:</p>
<p style="text-align:center;">$$Im[\\tilde{f}(k)] = (1/2\\pi) \\int_{-\\infty}^{\\infty} f(x) \\sin(kx) dx \\equiv \\tilde{f}_s(k)$$</p>
<p>This is a <strong>Fourier sine transform</strong>. The imaginary part vanishes only if the function has no sine components, which happens if and only if the function is <strong>even</strong>. For an odd function, the Fourier transform is purely imaginary. For a general real function, the Fourier transform will have both real and imaginary parts. We can write:</p>
<p style="text-align:center;">$$\\tilde{f}(k) = \\tilde{f}_c(k) + i \\tilde{f}_s(k)$$</p>
<p>where $\\tilde{f}$<sub>s</sub>(k) is the Fourier sine transform and $\\tilde{f}$<sub>c</sub>(k) the Fourier cosine transform. One hardly ever uses Fourier sine and cosine transforms individually. We practically always talk about the complex Fourier transform.</p>
<p>Rather than separating $\\tilde{f}$(k) into real and imaginary parts (Cartesian coordinates), it is often helpful to write it as <strong>magnitude and phase</strong> (polar coordinates):</p>
<p style="text-align:center;">$$\\tilde{f}(k) = A(k) e^{i\\phi(k)}$$</p>
<p>with A(k) = |$\\tilde{f}$(k)| the magnitude and $\\phi$(k) the phase.</p>
<p>The energy in a frequency mode only depends on the amplitude: $I = A(\\omega)^2$. When one plots the spectrum as in Audacity, what is being shown is A($\\omega$)<sup>2</sup>. This corresponds to the <strong>intensity or power</strong> in a particular mode, as we will see in Lecture 10. Power is useful in doing a frequency analysis of sound since it tells us how loud that frequency is. But looking at the amplitude is not the only thing one can do with a Fourier transform. Often one is also interested in the <strong>phase</strong>.</p>
<p>For a visual example, we can take the Fourier transform of an image. Suppose we have a grayscale image that is 640 $\\times$ 480 pixels. Each pixel is a number from 0 to 255. We can then Fourier transform this function to $\\tilde{f}(k_{x}, k_{y}$). The 2D Fourier transform is really no more complicated than the 1D transform — we just do two integrals instead of one.</p>
<p>The magnitude of a panda image is concentrated near $k_{x} \\sim k_{y} \\sim$ 0 (corresponding to large-wavelength variations), while the phase looks random. The same is true for a cat image.</p>
<p>Now here's the remarkable thing: if we combine the <strong>magnitude from the panda with the phase from the cat</strong>, and inverse-transform, the resulting image looks like a cat! And vice versa. <strong>The phase is more important than the magnitude for reconstructing the original image.</strong> The importance of phase is critical for many engineering applications, such as signal analysis and image compression technologies.</p>`,
      interactive: "fourier-magnitude-phase",
      interactiveCaption: "Swapping magnitude and phase of Fourier transforms of two images reveals that phase carries most of the structural information",
      mathLinks: ["complex-fourier-math"]
    },
    {
      heading: "Filtering",
      body: `<p>One thing we can do with the Fourier transform of an image (or any signal) is remove some components. If we remove low frequencies (below some cutoff $\\omega_{f}$), we call it a <strong>high-pass filter</strong>. A lot of background noise is at low frequencies, so a high-pass filter can clean up a signal.</p>
<p>If we throw out the high frequencies, it is called a <strong>low-pass filter</strong>. A low-pass filter can be used to smooth data (such as a digital photo) since it throws out high-frequency noise. A filter that cuts out both high and low frequencies is called a <strong>band-pass filter</strong>.</p>
<p>Here is a striking example. Take a photo of Einstein and apply a high-pass filter: you see the sharp features — edges, wrinkles, the structure of the face. Take a photo of Marilyn Monroe and apply a low-pass filter: you see the soft, blurry shape — the smooth variations in brightness.</p>
<p>Now combine the two: high-pass Einstein + low-pass Marilyn. Look at the combined image from up close and you see Einstein (your eyes resolve the high-frequency detail). Look at it from far away and you see Marilyn (your eyes can only pick up the low-frequency content at a distance). This is a beautiful demonstration of how our visual system performs its own frequency filtering based on distance.</p>`,
      interactive: "fourier-filtering",
      interactiveCaption: "High-pass and low-pass filtering of images: up close you see the high-frequency image, from far away you see the low-frequency one",
      mathLinks: ["filtering-math"]
    },
    {
      heading: "Dirac $\\delta$ Function",
      body: `<p>What is the Fourier transform of a constant? If f(t) = 1, its transform is:</p>
<p style="text-align:center;">$$\\delta(\\omega) \\equiv \\frac{1}{2\\pi} \\int_{-\\infty}^{\\infty} e^{-i\\omega t}\\, dt$$</p>
<p>This object $\\delta(\\omega$) is the <strong>Dirac $\\delta$ function</strong>. It is zero everywhere except at the origin, where it is infinite, yet integrates to 1. Its key property is the <strong>sifting property</strong>: $\\int \\delta(x)\\,f(x)\\,dx = f(0)$ for any smooth function f.</p>
<p>Physically, a constant signal f(t) = 1 has only zero frequency — hence a delta function at $\\omega$ = 0. Conversely, an infinitely sharp pulse $\\delta$(t) contains all frequencies equally, corresponding to white noise. A pure frequency $e^{ik_{0}x}$ transforms to $\\delta(k - k_{0})$: a single spike in the spectrum.</p>
<p>The delta function is not an ordinary function but a <strong>distribution</strong> — an object that only makes sense under an integral sign. The full mathematical treatment, including limit representations and proofs, is in the math topic below.</p>
<span class='inline-math-link' data-math='dirac-delta-math'>Dirac Delta Function $\\rightarrow$</span>`,
      interactive: "dirac-delta-visualization",
      interactiveCaption: "The Dirac delta function as a limit of increasingly narrow, tall Gaussians or Lorentzians, always with unit area",
      mathLinks: ["dirac-delta-math", "distribution-math"]
    },
    {
      heading: "Problems",
      body: `<p><strong>Problem 8.1:</strong> Compute the Fourier transform of the rectangular pulse f(x) = 1 for |x| &lt; a and f(x) = 0 otherwise. Plot |$\\tilde{f}$(k)|<sup>2</sup> and discuss the relationship between the width of the pulse and the width of its Fourier transform.</p>
<p><strong>Problem 8.2:</strong> Verify the Fourier transform pair for the underdamped oscillator by substituting the result $\\tilde{f}(\\omega$) = (1/2$\\pi$i)($\\omega$ - i$\\gamma$)/(($\\omega$ - i$\\gamma$)<sup>2</sup> - $\\omega_{0}^{2}$) back into the inverse transform and recovering f(t) = e<sup>-$\\gamma$t</sup>cos($\\omega_{0}$t)$\\theta$(t).</p>
<p><strong>Problem 8.3:</strong> Show that the Fourier transform of a real, even function f(x) is purely real, and that the Fourier transform of a real, odd function is purely imaginary.</p>
<p><strong>Problem 8.4:</strong> A function f(t) has Fourier transform $\\tilde{f}(\\omega$). Express the Fourier transform of f(t - $t_{0}$) in terms of $\\tilde{f}(\\omega$). What happens to the magnitude and phase?</p>
<p><strong>Problem 8.5:</strong> Using the representation $\\delta$(x) = lim<sub>$\\epsilon \\rightarrow$0</sub> (1/$\\pi) \\epsilon$/($x^{2} + \\epsilon^{2}$), show that $\\int_{-\\infty}^{\\infty} \\delta$(x) dx = 1 for all $\\epsilon$ &gt; 0. Then verify the sifting property by computing $\\int \\delta$(x) f(x) dx for a smooth test function f(x) in the limit $\\epsilon \\rightarrow$ 0.</p>
<p><strong>Problem 8.6:</strong> Consider a signal that is a sum of two cosines at frequencies $\\omega_{1}$ and $\\omega_{2}$. Compute its Fourier transform and sketch |$\\tilde{f}(\\omega$)|<sup>2</sup>. How does the spectrum change if you add a third frequency $\\omega_{3}$ = ($\\omega_{1} + \\omega_{2}$)/2?</p>
<p><strong>Problem 8.7:</strong> Explain physically why a high-pass filter applied to an image emphasizes edges and fine detail, while a low-pass filter blurs the image. What would a band-pass filter show?</p>
<p><strong>Problem 8.8:</strong> The convolution theorem states that the Fourier transform of the product f(x)g(x) is the convolution of their Fourier transforms: FT[fg] = $\\tilde{f}$ * $\\tilde{g}$. Use this to explain why multiplying a signal by a Gaussian envelope in the time domain broadens its spectrum.</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: []
    }
  ],

  "9": [
    {
      heading: "Boundary Conditions at a Junction",
      body: `<p>Suppose we take two taut strings, one thick and one thin, and knot them together. What will happen to a wave as it passes through the knot? Or, instead of changing the mass density at the junction, we could change the tension (for example, by tying the string to a ring on a fixed rod which can absorb the longitudinal force from the change in tension). What happens to a sound wave when it passes from air to water? What happens to a light wave when it passes from air to glass? In this lecture, we will answer these questions.</p>
<p>Let's start with the string with varying tension. Say there is a knot at x = 0 and the tension changes abruptly between x &lt; 0 and x &gt; 0. To be concrete, imagine we have a right-moving traveling wave coming in at very early times, hitting the junction around t = 0. We would like to know what the wave looks like at late times.</p>
<p>We write the amplitude of the wave as $\\psi_{L}$(x, t) to the left of the knot and $\\psi_{R}$(x, t) to the right:</p>
<p style="text-align:center;">$$\\psi(x, t) = \\psi_L(x, t) for x &lt; 0,  \\;  \\;  \\psi_R(x, t) for x \\geq 0$$</p>
<p>To the left, the wave satisfies the wave equation with speed $v_{1} = \\sqrt{T_1/\\mu_1}$, and to the right with speed $v_{2} = \\sqrt{T_2/\\mu_2}$.</p>
<p><strong>First boundary condition — continuity:</strong> Obviously $\\psi$(x, t) should be continuous, so:</p>
<p style="text-align:center;">$$\\psi_L(0, t) = \\psi_R(0, t)$$</p>
<details><summary><strong>Derivation of the second boundary condition</strong></summary>
<p>Recall from Lecture 6 that a point on the string of mass <em>m</em> gets a force from the parts of the string to the left and right. The force from the left is T $\\partial \\psi/\\partial$x (this makes sense: if the string has no slope, there is no force). From the right, the force is -T $\\partial \\psi/\\partial$x. The sign must be opposite so that if there is no difference in slope there is no net force.</p>
<p>If there are different tensions to the right and left, as at x = 0:</p>
<p style="text-align:center;">$$m \\partial^2\\psi(0,t)/\\partial t^2 = T_1 \\partial\\psi_L(0,t)/\\partial x - T_2 \\partial\\psi_R(0,t)/\\partial x$$</p>
<p>Now <em>m</em> is the mass of an infinitesimal point of string at x = 0. But $T_{1}, T_{2}$, and the slopes are macroscopic quantities. If the right-hand side doesn't vanish, $\\partial$<sup>2</sup>$\\psi/\\partial t^{2} \\rightarrow \\infty$ as m $\\rightarrow$ 0. Writing m = $\\mu \\Delta$x and taking $\\Delta$x $\\rightarrow$ 0 gives the condition.</p>
</details>
<p><strong>Second boundary condition — force balance:</strong></p>
<p style="text-align:center;">$$T_1 \\partial\\psi_L(0,t)/\\partial x = T_2 \\partial\\psi_R(0,t)/\\partial x$$</p>
<p>So the slope must be <strong>discontinuous</strong> at the boundary to account for the different tensions. Now we have the boundary conditions. What is the solution?</p>`,
      interactive: "string-junction",
      interactiveCaption: "Two strings of different mass density or tension knotted together at x = 0, showing boundary conditions",
      mathLinks: ["boundary-conditions-math"]
    },
    {
      heading: "Reflection and Transmission",
      body: `<p>Suppose we have some incoming traveling wave. Before it hits the junction it has the form of a right-moving traveling wave $\\psi_{L}$(x, t) = $\\psi_{i}$(t - x/$v_{1}$) for t &lt; 0. The subscript <em>i</em> refers to the <strong>incident</strong> wave.</p>
<p>After t = 0, $\\psi_{L}$ can have both left- and right-moving components, so we write more generally:</p>
<p style="text-align:center;">$$\\psi_L(x, t) = \\psi_i(t - x/v_1) + \\psi_r(t + x/v_1)$$</p>
<p>where $\\psi_{r}$ is the <strong>reflected</strong> wave. For x &gt; 0, there will also be a <strong>transmitted</strong> wave:</p>
<p style="text-align:center;">$$\\psi_R(x, t) = \\psi_t(t - x/v_2)$$</p>
<p>Note that we are <strong>not assuming</strong> the incident, transmitted, and reflected waves have the same shape. The transmitted wave has speed $v_{2}$ since it travels in the right-hand string.</p>
<details><summary><strong>Solving the boundary conditions for R and T</strong></summary>
<p>Continuity at x = 0 implies: $\\psi_{i}$(t) + $\\psi_{r}$(t) = $\\psi_{t}$(t).</p>
<p>For the force-balance condition, we compute the derivatives:</p>
<p style="text-align:center;">$$T_1 \\partial\\psi_L/\\partial x|_{x=0} = (T_1/v_1)[-\\psi_i'(t) + \\psi_r'(t)]$$</p>
<p style="text-align:center;">$$T_2 \\partial\\psi_R/\\partial x|_{x=0} = -(T_2/v_2) \\psi_t'(t)$$</p>
<p>Setting them equal: ($T_{1}/v_{1}$)[-$\\psi_{i} ' + \\psi_{r} '$] = -($T_{2}/v_{2})\\psi_{t} '$. Integrating (and setting the integration constant to zero since a nonzero constant would just mean a constant net displacement):</p>
<p style="text-align:center;">$$(T_1/v_1)[-\\psi_i + \\psi_r] = -(T_2/v_2)\\psi_t$$</p>
<p>Substituting $\\psi_{t} = \\psi_{i} + \\psi_{r}$ and solving:</p>
<p style="text-align:center;">$$(T_1/v_1 + T_2/v_2)\\psi_r = (T_1/v_1 - T_2/v_2)\\psi_i$$</p>
</details>
<p>Defining the <strong>impedance</strong> $Z_{1} = T_{1}/v_{1}$ and $Z_{2} = T_{2}/v_{2}$, we find the key results:</p>
<p style="text-align:center;">$$\\psi_r = R \\psi_i,  \\;  \\;  \\psi_t = T \\psi_i$$</p>
<p>where the <strong>reflection coefficient</strong> and <strong>transmission coefficient</strong> are:</p>
<p style="text-align:center;">$$R = (Z_1 - Z_2) / (Z_1 + Z_2),  \\;  \\;  T = 2Z_1 / (Z_1 + Z_2)$$</p>
<p>We have found that the <strong>reflected wave has exactly the same shape</strong> as the incident wave, but with a different overall magnitude. The transmitted wave also has the same shape.</p>
<p><em>Z</em> is known as an <strong>impedance</strong>. More generally, impedance is <strong>force divided by velocity</strong>. It tells you how much force is required to impart a certain velocity. Impedance is a property of a medium. Using v = $\\sqrt{T/\\mu}$ we can write Z = T/v = $\\sqrt{T\\mu}$.</p>
<p>Note that when $Z_{1} = Z_{2}$ there is no reflection and complete transmission. If we want no reflection, we need to <strong>match impedances</strong>. For example, if we want to impedance-match across two strings with different mass densities $\\mu_{1}$ and $\\mu_{2}$, we can choose $T_{2}$ = ($\\mu_{1}/\\mu_{2})T_{1}$ so that $Z_{2} = Z_{1}$.</p>
<p>Note also that the transmission coefficient is greater than 1 if $Z_{1}$ &gt; $Z_{2}$. That means the <strong>amplitude increases</strong> when a wave travels from a medium of higher impedance to one of lower impedance. This is an important fact with real consequences.</p>
<span class='inline-math-link' data-math='reflection-transmission-math'>Reflection & Transmission Derivation $\\rightarrow$</span>`,
      interactive: null,
      mathLinks: ["reflection-transmission-math", "impedance-math"]
    },
    {
      heading: "Phase Flipping",
      body: `<p>What happens when a wave hits a medium of <strong>higher impedance</strong>, such as when the tension or mass density of the second string is very large? Then $Z_{2}$ &gt; $Z_{1}$ and so R = ($Z_{1} - Z_{2}$)/($Z_{1} + Z_{2}$) &lt; 0. Thus, if $\\psi_{i}$ &gt; 0 then $\\psi_{r}$ &lt; 0. The wave <strong>flips its sign</strong>. This happens in particular if the wave hits a wall, which is like $\\mu = \\infty$.</p>
<p>On the other hand, if a wave passes to a <strong>less dense string</strong> then $Z_{2}$ &lt; $Z_{1}$ and there is <strong>no sign flip</strong>. This can happen if $Z_{2}$ = 0, for example if the second string is massless or tensionless — as in an open boundary condition.</p>
<p>This phase flipping has important consequences due to <strong>interference</strong> between the reflected pulse and other incoming pulses. There will be constructive interference if the phases are the same, but destructive interference if they are opposite. We will return to interference after discussing light.</p>`,
      interactive: null,
      mathLinks: []
    },
    {
      heading: "Impedance for Masses",
      body: `<p>To get intuition for impedance, it is helpful to go back to a more familiar system: <strong>masses</strong>. Suppose we collide a block of mass <em>m</em> with a larger block of mass <em>M</em>. Say <em>m</em> has velocity $v_{i}$ and <em>M</em> is initially at rest.</p>
<details><summary><strong>Derivation using conservation laws</strong></summary>
<p>Initial momentum: $p_{i}$ = m$v_{i}$. Initial energy: $E_{i} = \\frac{1}{2}$m$v_{i}$<sup>2</sup>.</p>
<p>After the collision, <em>m</em> bounces off with "reflected velocity" $v_{r}$ and <em>M</em> moves off with "transmitted velocity" $v_{t}$.</p>
<p>Conservation of momentum: $v_{t}$ = (m/M)($v_{i} + v_{r}$).</p>
<p>Substituting into conservation of energy: $\\frac{1}{2}$m$v_{i}$<sup>2</sup> = $\\frac{1}{2}$m$v_{r}$<sup>2</sup> + $\\frac{1}{2}$M[(m/M)($v_{i} + v_{r}$)]<sup>2</sup>.</p>
<p>After algebra:</p>
<p style="text-align:center;">$$v_r = (M - m)/(M + m) v_i,  \\;  \\;  v_t = 2m/(m + M) v_i$$</p>
</details>
<p>The result is:</p>
<p style="text-align:center;">$$v_r = (M - m)/(M + m) v_i,  \\;  \\;  v_t = 2m/(m + M) v_i$$</p>
<p>These equations have <strong>exactly the same form</strong> as the reflection and transmission coefficients, with $Z_{1}$ = m and $Z_{2}$ = M. Thus for masses, <strong>impedance is mass</strong>. This makes sense — the bigger the mass, the less velocity you can impart with a given force.</p>
<p>Let's take a concrete example of <strong>impedance matching</strong>. Suppose m = 1, M = 3, and the incoming velocity is v. Then M gets velocity $v_{t}$ = 2(1)/(1+3) v = v/2. Now put a mass $m_{2}$ = 2 in between them. When m hits $m_{2}$, it gives it velocity $v_{2}$ = 2(1)/(1+2) v = 2v/3. Then $m_{2}$ hits M and gives it velocity $v_{t}$ = 2(2)/(2+3) $\\cdot$ 2v/3 = 8v/15 = 0.533v. Thus M goes faster! <strong>Inserting an intermediate mass helps impedance-match.</strong> Similarly, inserting lots of masses can make the impedance matching very efficient.</p>`,
      interactive: "mass-collision-impedance",
      interactiveCaption: "Elastic collisions between masses showing the analogy with wave reflection and transmission, and how an intermediate mass improves impedance matching",
      mathLinks: ["impedance-matching-math"]
    },
    {
      heading: "Complex Impedance",
      body: `<p>Let's revisit the driven oscillator from Chapter 2. Recall the equation of motion: m$\\ddot{x}$ + $\\gamma\\dot{x}$ + kx = $F_{0}$e<sup>i$\\omega$t</sup>. Back then we focused on finding the amplitude and phase of the response. Now we can reinterpret the same physics through <strong>impedance</strong>: the ratio Z = F/$\\dot{x}$, which measures how much a system resists being driven.</p>
<p>The resonance peak from Chapter 2 is really an <strong>impedance matching</strong> story. Far from resonance, the driver and oscillator are mismatched — the driver pushes but the oscillator barely responds. At resonance, there is no mismatch: the driver couples perfectly to the oscillator, and the response is limited only by damping.</p>
<p>Each part of the oscillator contributes its own impedance. The mass contributes $Z_m$ = i$\\omega$m. The spring contributes $Z_k$ = $-$ik/$\\omega$. The damper contributes $Z_\\gamma$ = $\\gamma$. The total impedance is:</p>
<p style="text-align:center;">$$Z_{total} = \\gamma + i(\\omega m - k/\\omega)$$</p>
<p>At low frequencies, the spring term $k/\\omega$ dominates (<strong>stiffness-dominated</strong>). At high frequencies, the mass term $\\omega m$ dominates (<strong>mass-dominated</strong>). At resonance ($\\omega = \\sqrt{k/m}$), the mass and spring impedances cancel exactly. The impedance mismatch vanishes, and the only thing left impeding the motion is damping.</p>
<p>Since impedance is complex, we can visualize it as a <strong>phasor</strong> in the complex plane. The animation below shows the physical system and its impedance decomposition side by side. Sweep $\\omega$ and watch the impedance bar and phasor change as the mismatch grows or shrinks.</p>`,
      interactive: "complex-impedance",
      interactiveCaption: "The driven oscillator from Chapter 2, now with its impedance decomposition. At resonance the mass and spring impedances cancel — no mismatch — and the driver couples perfectly to the oscillator.",
      mathLinks: ["complex-impedance-math"]
    },
    {
      heading: "Circuits (optional)",
      body: `<p>An important use of complex impedances is in <strong>circuits</strong>. Recall that the equation of motion for an LRC circuit is just like a damped harmonic oscillator. The total voltage for a circuit with an inductor, resistor, and capacitor is:</p>
<p style="text-align:center;">$$V_{tot} = L\\ddot{Q} + Q/C + \\dotQ R$$</p>
<p>This is the direct analog of F = m$\\ddot{x}$ + kx + $\\gamma \\dot{x}$. Instead of driving with an external force, we drive with an external voltage V = $V_{0}$e<sup>i$\\omega$t</sup>. The correspondence is:</p>
<table style="margin:0 auto; border-collapse:collapse; text-align:center;">
<tr><td style="padding:4px 12px;"><strong>Mass/spring</strong></td><td style="padding:4px 12px;"><strong>Circuit</strong></td></tr>
<tr><td>F</td><td>V</td></tr>
<tr><td>x</td><td>Q</td></tr>
<tr><td>$\\dot{x}$</td><td>I = $\\dot{Q}$</td></tr>
<tr><td>$\\gamma$</td><td>R</td></tr>
<tr><td>k</td><td>1/C</td></tr>
<tr><td>m</td><td>L</td></tr>
<tr><td>Z = F/$\\dot{x}$</td><td>Z = V/I</td></tr>
</table>
<p>Thus impedance for a circuit is Z = V/I. A resistor has $Z_{R}$ = R. A capacitor has $Z_{C}$ = 1/(i$\\omega$C). An inductor has $Z_{L}$ = i$\\omega$L. Impedance of an AC circuit plays the role that resistance does for a DC circuit. We can add impedances in series or in parallel just like we do for resistance.</p>
<p><strong>Impedance matching is critical in electrical engineering.</strong> Say one wishes to drive a WiFi antenna on your router. The maximum power we can couple into the antenna occurs when the impedances of the power supply and antenna are equal in magnitude. This is important in high-power applications where waves reflected from the antenna can come back and destroy amplifying equipment. All modern radios have impedance matching circuits because antennas are resonant devices, and tuning away from resonance causes impedance mismatch.</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: ["circuit-impedance-math"]
    },
    {
      heading: "Impedance for Other Stuff",
      body: `<p>For <strong>air</strong>, we recall v = $\\sqrt{B/\\rho}$ with B = $\\gamma$p = $\\rho v^{2}$ the bulk modulus and v the speed of sound. Then:</p>
<p style="text-align:center;">$$Z_0 = B/v = \\rho v$$</p>
<p>$Z_{0} = \\rho$v is called the <strong>specific impedance</strong>. It is a property of the medium. For example:</p>
<ul>
<li>Air: $\\rho$ = 1.2 kg/$m^{3}$, v = 343 m/s &rArr; $Z_{air}$ = 420 Pa$\\cdot$s/m</li>
<li>Water: $\\rho$ = 1000 kg/$m^{3}$, v = 1480 m/s &rArr; $Z_{water}$ = 1.48 $\\times 10^{6}$ Pa$\\cdot$s/m</li>
</ul>
<p>Thus if you try to yell at someone under water, the amount reflected is R = ($Z_{air} - Z_{water}$)/($Z_{air} + Z_{water}$) = -0.9994. So <strong>almost all of the sound is reflected</strong> (and there is a phase flip).</p>
<p>If the wavelength of the sound waves is smaller than the size of the cavity holding the waves (for example, in a pipe), then one must account for finite size in the impedance. For air in a finite-size cavity, the relevant quantity is the <strong>impedance per area</strong>:</p>
<p style="text-align:center;">$$Z = \\rho v/A  \\;  \\; (when \\lambda &gt; \\sqrt{A})$$</p>
<p>For air of the same density, the impedance is effectively 1/area. Thus the reflection coefficient going between pipes of different radii is:</p>
<p style="text-align:center;">$$R = (A_2 - A_1)/(A_1 + A_2)$$</p>
<p>An abrupt change in pipe diameter will have bad impedance matching. But a <strong>megaphone</strong> is designed to impedance-match much better — its gradually flaring shape provides a smooth transition from the small area near your mouth to the large area of open air. <strong>Now you know why megaphones are shaped this way!</strong></p>
<p><strong>Solids:</strong> For liquids or solids, impedance is also Z = $\\rho$v. Some representative values:</p>
<ul>
<li>Steel: $\\rho$ = 7900 kg/$m^{3}$, v = 6100 m/s, Z = 48 MPa$\\cdot$s/m</li>
<li>Diamond: $\\rho$ = 3500 kg/$m^{3}$, v = 12000 m/s, Z = 42 MPa$\\cdot$s/m</li>
<li>Rock: $\\rho$ = 2600 kg/$m^{3}$, v = 6000 m/s, Z = 16 MPa$\\cdot$s/m</li>
<li>Rubber: $\\rho$ = 1100 kg/$m^{3}$, v = 100 m/s, Z = 0.11 MPa$\\cdot$s/m</li>
<li>Dirt: $\\rho$ = 1500 kg/$m^{3}$, v = 100 m/s, Z = 0.15 MPa$\\cdot$s/m</li>
</ul>
<p>Sound goes very fast in diamond because diamond is very hard and rigid — the atoms move back to equilibrium very quickly (high spring constant). Rubber and dirt are soft, so waves propagate slowly. Soft stuff generally has small $\\rho$ and small v, so it has <strong>much lower impedance</strong>.</p>
<p>As an application, recall that when impedance goes down, T &gt; 1 and the amplitude increases. Consider an <strong>earthquake</strong> traveling from rock ($Z_{1}$ = 16 MPa$\\cdot$s/m) into dirt or landfill ($Z_{2}$ = 0.15 MPa$\\cdot$s/m). Then T = 2$Z_{1}$/($Z_{1} + Z_{2}) \\approx$ 1.98. So the amplitude of the shaking will <strong>nearly double</strong>! That's why you shouldn't build houses on landfill in an earthquake zone.</p>`,
      interactive: "impedance-materials",
      interactiveCaption: "Impedance values for various materials, and how a megaphone's shape provides gradual impedance matching from mouth to open air",
      mathLinks: ["specific-impedance-math"]
    },
    {
      heading: "Problems",
      body: `<p><strong>Problem 9.1:</strong> A string with linear mass density $\\mu_{1}$ = 0.01 kg/m and tension $T_{1}$ = 100 N is connected at x = 0 to a string with $\\mu_{2}$ = 0.04 kg/m and the same tension $T_{2} = T_{1}$. A pulse $\\psi_{i}$(t - x/$v_{1}$) is incident from the left. Find the reflection and transmission coefficients. Is the reflected pulse inverted?</p>
<p><strong>Problem 9.2:</strong> Show that R + T = 1 (where R and T are the reflection and transmission coefficients for amplitude). Does this mean energy is conserved? Why or why not? (Hint: power depends on impedance as well as amplitude.)</p>
<p><strong>Problem 9.3:</strong> A right-moving pulse on a string hits a rigid wall ($Z_{2} = \\infty$). Find R and T and describe what happens physically. Now consider a free end ($Z_{2}$ = 0). Find R and T and describe the physics.</p>
<p><strong>Problem 9.4:</strong> Consider two blocks of mass $m_{1}$ = 2 kg and $m_{3}$ = 8 kg. What mass $m_{2}$ should you place between them to maximize the velocity transferred to $m_{3}$? Solve for the optimal $m_{2}$ and compare the result to what happens without the intermediate mass.</p>
<p><strong>Problem 9.5:</strong> Compute the fraction of sound energy reflected when you yell from air into water. Use $Z_{air}$ = 420 Pa$\\cdot$s/m and $Z_{water}$ = 1.48 $\\times 10^{6}$ Pa$\\cdot$s/m. Why is it so hard to communicate across the air-water interface?</p>
<p><strong>Problem 9.6:</strong> An earthquake wave travels from bedrock (Z = 16 MPa$\\cdot$s/m) into soft soil (Z = 0.15 MPa$\\cdot$s/m). Compute the amplitude transmission coefficient. If the earthquake has an amplitude of 1 cm in the bedrock, what is the amplitude in the soft soil?</p>
<p><strong>Problem 9.7:</strong> For the driven oscillator with complex impedance Z = $\\gamma$ + i($\\omega$m - k/$\\omega$), find the frequency at which |Z| is minimized. Show that the velocity amplitude is maximized at this frequency.</p>
<p><strong>Problem 9.8:</strong> Two pipes of cross-sectional areas $A_{1}$ and $A_{2}$ are joined together. If $A_{2}$ = 4$A_{1}$, what fraction of the sound power is transmitted? What fraction is reflected?</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: []
    }
  ],

  "10": [
    {
      heading: "Energy in a String",
      body: `<p>The kinetic energy of a mass <em>m</em> with velocity <em>v</em> is $\\frac{1}{2}$m$v^{2}$. Thus if we have an oscillating wave in a string, the kinetic energy of each individual bit of string is:</p>
<p style="text-align:center;">$$KE = \\frac{1}{2}(\\mu\\Delta x)(\\partial A/\\partial t)^2$$</p>
<p>and the <strong>kinetic energy per unit length</strong> is:</p>
<p style="text-align:center;">$$KE/length = \\frac{1}{2}\\mu(\\partial A/\\partial t)^2$$</p>
<p>The potential energy depends on how stretched the string is. Of course, a string under tension <em>T</em> already has some potential energy, even with no waves. We are interested in the <strong>additional potential energy</strong> due to the extra stretching from transverse waves.</p>
<details><summary><strong>Derivation of potential energy per unit length</strong></summary>
<p>If the string is in equilibrium ($\\partial$A/$\\partial$x = 0), then the potential energy is zero. The amount the string is stretched at point x is the difference between the hypotenuse and the base of the triangle formed by the displaced string:</p>
<p style="text-align:center;">$$\\Delta L = \\sqrt{(\\Delta x}^2 + (\\Delta A)^2) - \\Delta x = \\Delta x\\sqrt{1 + (\\partial A/\\partial x}^2) - \\Delta x$$</p>
<p>Since the string is close to equilibrium, $\\partial$A/$\\partial$x $\\ll$ 1, so we Taylor expand the square root:</p>
<p style="text-align:center;">$$\\Delta L = \\Delta x[1 + \\frac{1}{2}(\\partial A/\\partial x)^2 - ...] - \\Delta x = \\frac{1}{2}\\Delta x(\\partial A/\\partial x)^2$$</p>
<p>Thus PE = force $\\times$ distance = $\\frac{1}{2}$T$\\Delta$x($\\partial$A/$\\partial$x)<sup>2</sup>.</p>
</details>
<p>The <strong>potential energy per unit length</strong> is:</p>
<p style="text-align:center;">$$PE/length = \\frac{1}{2}T(\\partial A/\\partial x)^2$$</p>
<p>Note this is proportional to the <strong>first derivative squared, not the second derivative</strong>. Even if there were no net force on the test mass at position x (so that $\\partial$<sup>2</sup>A/$\\partial x^{2}$ = 0), there would still be potential energy stored in the stretched string. Even though the wave is transverse, the energy comes from stretching the string both longitudinally and transversely.</p>
<p>The <strong>total energy per unit length</strong> is:</p>
<p style="text-align:center;">$$E_{tot}/length = \\frac{1}{2}\\mu(\\partial A/\\partial t)^2 + \\frac{1}{2}T(\\partial A/\\partial x)^2$$</p>
<details><summary><strong>Simplification for a traveling wave</strong></summary>
<p>For a traveling wave A(x, t) = f(x $\\pm$ vt), we have $\\partial$A/$\\partial$t = $\\pm$v $\\partial$A/$\\partial$x. Thus ($\\partial$A/$\\partial$x)<sup>2</sup> = (1/$v^{2}$)($\\partial$A/$\\partial$t)<sup>2</sup> = ($\\mu$/T)($\\partial$A/$\\partial$t)<sup>2</sup>. The KE and PE contributions are equal, and:</p>
<p style="text-align:center;">$$E_{tot}/length = \\mu(\\partial A/\\partial t)^2$$</p>
</details>
<p>For a traveling wave, the total energy per unit length simplifies beautifully:</p>
<p style="text-align:center;">$$E_{tot}/length = \\mu(\\partial A/\\partial t)^2 = (Z/v)(\\partial A/\\partial t)^2$$</p>
<p>where Z = T/v = $\\sqrt{T\\mu}$ = v$\\mu$ is the impedance.</p>
<span class='inline-math-link' data-math='wave-energy-math'>Wave Energy Derivation $\\rightarrow$</span>`,
      interactive: "wave-energy-string",
      interactiveCaption: "Kinetic and potential energy density along a traveling wave on a string, showing that they are equal at every point",
      mathLinks: ["wave-energy-math"]
    },
    {
      heading: "Power",
      body: `<p>An extremely important quantity related to waves is <strong>power</strong>. We want to use waves to do things, such as transmit sound or light, or energy in a wire. Thus we want to know the rate at which work can be done using a wave. For example, if you have an incoming sound wave, how much power can be transmitted by the wave to a microphone?</p>
<p>For an incoming traveling wave, we want to know how much power is transmitted from one test mass to the next. Now, power = force $\\times$ velocity. But we don't want the net force, only the <strong>force from the left</strong> to compute power transmitted. The force from the left is T $\\partial$A/$\\partial$x. For $\\partial$A/$\\partial$x &gt; 0, this pulls downward. To see the power transmitted, we need the force which moves the string away from equilibrium (the upward force): F = -T $\\partial$A/$\\partial$x. Then:</p>
<p style="text-align:center;">$$P = F \\cdot v = -T (\\partial A/\\partial x)(\\partial A/\\partial t)$$</p>
<p>For a traveling wave A(x, t) = f(x $\\pm$ vt), using $\\partial$A/$\\partial$t = $\\pm$v $\\partial$A/$\\partial$x:</p>
<p style="text-align:center;">$$P = \\mp Z (\\partial A/\\partial t)^2$$</p>
<p>The sign is + for a right-moving wave (power goes to the right) and - for a left-moving wave.</p>
<p>Now recall that for a wave going from impedance $Z_{1}$ into $Z_{2}$, the amplitudes are related by $A_{T}$ = (2$Z_{1}$/($Z_{1} + Z_{2}$))$A_{I}$ and $A_{R}$ = (($Z_{1} - Z_{2}$)/($Z_{1} + Z_{2}$))$A_{I}$.</p>
<details><summary><strong>Derivation of power reflection and transmission</strong></summary>
<p>The power in the incoming wave is $P_{I} = Z_{1}(\\partial A_{I}/\\partial$t)<sup>2</sup>.</p>
<p>The reflected power is $P_{R} = Z_{1}$[($Z_{1} - Z_{2}$)/($Z_{1} + Z_{2}$)]<sup>2</sup>($\\partial A_{I}/\\partial$t)<sup>2</sup> = [($Z_{1} - Z_{2}$)/($Z_{1} + Z_{2}$)]<sup>2</sup> $P_{I}$.</p>
<p>The transmitted power is $P_{T} = Z_{2}$[2$Z_{1}$/($Z_{1} + Z_{2}$)]<sup>2</sup>($\\partial A_{I}/\\partial$t)<sup>2</sup> = ($Z_{2}/Z_{1}$)[2$Z_{1}$/($Z_{1} + Z_{2}$)]<sup>2</sup> $P_{I}$ = 4$Z_{1} Z_{2}$/($Z_{1} + Z_{2}$)<sup>2</sup> $P_{I}$.</p>
</details>
<p>The fraction of power reflected and transmitted:</p>
<p style="text-align:center;">$$P_R/P_I = [(Z_1 - Z_2)/(Z_1 + Z_2)]^2$$</p>
<p style="text-align:center;">$$P_T/P_I = 4Z_1Z_2/(Z_1 + Z_2)^2$$</p>
<p>Note that <strong>($P_{T} + P_{R}$)/$P_{I}$ = 1</strong>, so overall power is conserved. Even though the amplitude transmission coefficient can exceed 1, the <strong>power</strong> transmission never exceeds the incoming power.</p>`,
      interactive: "power-reflection-transmission",
      interactiveCaption: "Power reflection and transmission at a junction: adjusting impedance ratio shows conservation of total power",
      mathLinks: ["wave-power-math", "reflection-transmission-math"]
    },
    {
      heading: "Sound Intensity (Decibels)",
      body: `<p>Intensity is defined as <strong>power per unit area</strong>: I = P/A. Sound intensity is measured in <strong>decibels</strong>. A logarithmic scale is used because <strong>human hearing is logarithmic</strong>. For example, if something has an intensity 1000 times larger, you will perceive it as being only about 3 times as loud.</p>
<p>The decibel scale is normalized so that 0 dB corresponds to the threshold of human hearing:</p>
<p style="text-align:center;">$$0 dB \\equiv 10^{-12} W/m^2 = I_0$$</p>
<p>The loudness in decibels is:</p>
<p style="text-align:center;">$$L = 10 \\log_{10}(I/I_0)$$</p>
<p>Some reference intensities: threshold of hearing (0 dB), breathing at 3 meters (10 dB), rustling leaves (20 dB), music at 1 meter (70 dB), vacuum cleaner (80 dB), rock concert (120 dB), threshold of pain (130 dB), jet engine at 30 meters (150 dB).</p>
<p><strong>Example:</strong> Suppose you are 3 meters from a 50 Watt speaker. At 3 meters, the power is distributed across a sphere of area A = 4$\\pi r^{2}$. If all the power went into sound: I = 50/(4$\\pi$(3)<sup>2</sup>) = 0.44 W/$m^{2}$, giving L = 10 $\\log_{10}$(0.44/$10^{-12}$) = 116 dB — rock concert levels!</p>
<p>But this is not actually how loud a speaker is. In reality, <strong>speakers are extremely inefficient</strong>. The efficiency is around $10^{-5}$ for a typical speaker. So L = 10 $\\log_{10}(10^{-5} \\cdot$ 0.44/$10^{-12}$) = 66 dB. The efficiency is so low because the <strong>speaker and the air have very different impedances</strong>.</p>
<p>A violin takes about 150 mW of bowing power and produces about 6 mW of sound: an efficiency of $\\epsilon$ = 4%. This is much greater than a speaker, but still most of the energy used in bowing goes to mechanical heating rather than sound.</p>
<details><summary><strong>How loudness changes with distance</strong></summary>
<p>Since I = P/(4$\\pi r^{2}$), we have L = 10 $\\log_{10}$(P/(4$\\pi I_{0}$)) - 20 $\\log_{10}$(r). Thus loudness only drops logarithmically with distance.</p>
<p>If you measure loudness $L_{0}$ at distance $r_{0}$, then at distance 2$r_{0}$:</p>
<p style="text-align:center;">$$L = L_0 - 20 \\log_{10}(2) = L_0 - 6.02 dB$$</p>
<p>Doubling the distance costs 6 dB. To drop by 10 dB, you need to go 3.16 times farther away.</p>
</details>`,
      interactive: "decibel-scale",
      interactiveCaption: "Select a sound source and drag the listener to explore how intensity drops with distance — each doubling costs 6 dB",
      mathLinks: ["decibel-math"]
    },
    {
      heading: "Plane Waves",
      body: `<p>Waves propagate in 3 dimensions, so we need the <strong>3-dimensional wave equation</strong>:</p>
<p style="text-align:center;">$$(\\partial^2/\\partial t^2 - v^2(\\partial^2/\\partial x^2 + \\partial^2/\\partial y^2 + \\partial^2/\\partial z^2)) A(x, y, z, t) = 0$$</p>
<p>This is the obvious generalization of the 1D wave equation. It is invariant under rotations of x, y, and z (in fact, under a larger group — Lorentz transformations — which mix space and time).</p>
<p>Important solutions are <strong>plane waves</strong>:</p>
<p style="text-align:center;">$$A(x, y, z, t) = A_0 \\cos(\\vec{k} \\cdot \\vec{x} - \\omega t + \\phi)$$</p>
<p>for some amplitude $A_{0}$, frequency $\\omega$, and fixed <strong>wavevector</strong> $\\vec{k}$. For a plane wave to satisfy the wave equation, its frequency and wavevector must be related by $\\omega$ = v|$\\vec{k}$|. The direction $\\vec{k}$ points is the direction the plane wave is traveling.</p>
<p><strong>Plane waves form a basis of all possible solutions to the wave equation.</strong> They are the normal modes of the 3D wave equation. For each frequency $\\omega$, there are plane waves in any direction with |$\\vec{k}$| = $\\omega$/v and any possible phase.</p>
<p>Another important feature: if you are <strong>far enough away from sources</strong>, everything reduces to a plane wave. Even from messy sources in a cavity, at large enough distances the solution looks like a plane wave.</p>
<p>How much power is in a plane wave? At position y and time t, the power oscillates:</p>
<p style="text-align:center;">$$P(t, y) = Z A_0^2\\omega^2 \\sin^2(ky - \\omega t + \\phi)$$</p>
<p>A more useful quantity is the <strong>average power</strong>, obtained by averaging over one wavelength:</p>
<p style="text-align:center;">$$\\langle P \\rangle = \\frac{1}{2} Z \\omega^2 A_0^2$$</p>
<p>where Z = $\\rho$v is the impedance for air. For a plane wave, the average power is time-independent.</p>`,
      interactive: "plane-wave-3d",
      interactiveCaption: "A 3D plane wave propagating in the direction of the wavevector, showing constant-phase surfaces",
      mathLinks: ["plane-wave-math"]
    },
    {
      heading: "Interference",
      body: `<p>Now we are ready to discuss one of the most important concepts in waves (and perhaps all of physics): <strong>constructive and destructive interference</strong>.</p>
<p>Suppose we have a speaker emitting sound at frequency $\\omega$. At large enough distances, it appears as a plane wave $A_{1} = A_{0}$cos($\\omega$t - ky + $\\phi_{1}$). Now say we have another speaker directly behind the first, producing the same sound at the same volume: $A_{2} = A_{0}$cos($\\omega$t - ky + $\\phi_{2}$). The total wave is:</p>
<p style="text-align:center;">$$A_{tot} = 2A_0 \\cos(\\omega t - ky + (\\phi_1+\\phi_2)/2) \\cos(\\Delta\\phi/2)$$</p>
<p>where $\\Delta \\phi = \\phi_{1} - \\phi_{2}$ is the phase difference. The average power is:</p>
<p style="text-align:center;">$$\\langle P_2 \\rangle = 4\\langle P_1 \\rangle \\cos^2(\\Delta\\phi/2)$$</p>
<p>In a generic situation with uncorrelated speakers, the phases have nothing to do with each other. Averaging $\\cos^{2}(\\Delta \\phi$/2) $\\rightarrow \\frac{1}{2}$ gives $\\langle$$P_{2}$$\\rangle$ = 2$\\langle$$P_{1}$$\\rangle$. Two speakers produce twice the power of one — perfectly sensible.</p>
<p>But if the two speakers are <strong>exactly out of phase</strong> ($\\Delta \\phi = \\pi$), then $\\langle$$P_{2}$$\\rangle$ = 0. This is <strong>destructive interference</strong>. Conversely, if $\\Delta \\phi$ = 0, then $\\langle$$P_{2}$$\\rangle$ = 4$\\langle$$P_{1}$$\\rangle$. This is <strong>constructive interference</strong>. Two coherent speakers can produce <strong>four times</strong> the power of a single speaker!</p>
<p>Where is the extra power coming from? One speaker is pushing down on the other, forcing it to work harder. This is called <strong>source loading</strong>. In principle, more power is being used by the speakers. However, since speakers are very inefficient (only 0.01% of the power goes to sound), the source loading actually makes the speaker more efficient — more sound comes out with the same electrical power.</p>
<p><strong>Speaker near a wall — proximity resonance:</strong> A wall has infinite impedance ($Z_{2} = \\infty$), so sound reflects completely with R = -1. By the <strong>method of images</strong>, the reflection acts like a second source at distance <em>d</em> on the other side of the wall. The phase difference is $\\Delta \\phi$ = 2kd = 4$\\pi$d/$\\lambda$.</p>
<p>For d $\\ll \\lambda$ (speaker close to the wall), $\\Delta \\phi \\approx$ 0 and we get complete constructive interference. By putting a speaker near a wall, we get four times the power. This is called a <strong>proximity resonance</strong> or <strong>self-amplification</strong>.</p>
<p>You might have expected twice the power (since the sound goes into half the space). Indeed, if the source and image were incoherent, there would be twice the power. But we get another factor of 2 from source loading — so in fact the power goes up by 4.</p>
<p>It is natural to try to add more proximity resonances. With four walls (a corner), the enhancement is a factor of <strong>16</strong>. For a 30-degree wedge, source loading gives a factor of <strong>144</strong> enhancement. For a 30-degree wedge in 3D, the enhancement is around a factor of <strong>200</strong>. Try standing near a corner and you can hear this yourself.</p>
<p>The amount of enhancement depends on the frequencies involved. When d $\\sim \\lambda$, there is as much destructive interference as constructive interference, so there is no source loading or proximity resonance for high frequencies.</p>`,
      interactive: "interference-demo",
      interactiveCaption: "Constructive and destructive interference from two speakers, and the proximity resonance effect of placing a speaker near a wall",
      mathLinks: ["interference-math", "method-of-images-math"]
    },
    {
      heading: "Problems",
      body: `<p><strong>Problem 10.1:</strong> Show that for a traveling wave on a string, the kinetic and potential energy densities are equal at every point. Why is this not generally true for a standing wave?</p>
<p><strong>Problem 10.2:</strong> A wave with amplitude 3 mm travels along a string with $\\mu$ = 0.01 kg/m and T = 100 N at frequency f = 200 Hz. Compute the average power carried by the wave.</p>
<p><strong>Problem 10.3:</strong> A 100 W light bulb radiates equally in all directions. What is the intensity at 2 meters? What is the intensity in decibels above the reference intensity $I_{0} = 10^{-12}$ W/$m^{2}$?</p>
<p><strong>Problem 10.4:</strong> Two identical speakers face the same direction, separated by a distance d. For what values of d (in terms of $\\lambda$) is there constructive interference directly ahead? For what values is there destructive interference?</p>
<p><strong>Problem 10.5:</strong> A speaker is placed a distance d = 0.5 m from a wall. For what frequencies (take v = 343 m/s) does it get maximum enhancement from the proximity resonance? For what frequencies does it get maximum cancellation?</p>
<p><strong>Problem 10.6:</strong> Show that $P_{R}/P_{I} + P_{T}/P_{I}$ = 1 algebraically, confirming power conservation at a junction. Why doesn't the fact that T &gt; 1 (for $Z_{1}$ &gt; $Z_{2}$) violate energy conservation?</p>
<p><strong>Problem 10.7:</strong> A violin string vibrates with a fundamental frequency of 440 Hz and amplitude 0.5 mm. The string has $\\mu$ = 0.001 kg/m and is 0.33 m long. Estimate the power in the fundamental mode. Compare this to the 6 mW total sound power output of a violin and comment.</p>
<p><strong>Problem 10.8:</strong> Consider a corner reflector (two walls meeting at 90 degrees). Using the method of images, show that a source in the corner has 4 image sources. Assuming d $\\ll \\lambda$, what is the power enhancement factor? Explain why this factor is 16 rather than 4.</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: []
    }
  ],

  "11": [
    {
      heading: "Wave Packets",
      body: `<p>The function</p>
<p style="text-align:center;">$$g(x) = e^{-(x/\\sigma_x)^2/2}$$</p>
<p>is called a <strong>Gaussian</strong>. When x = $\\pm \\sigma_{x}$, the Gaussian has decreased to about 0.6 of its peak value (1/$\\sqrt{e} \\approx$ 0.6). Alternatively, the Gaussian is at half its maximal value at x = $\\pm$1.1$\\sigma_{x}$. Either way, <strong>$\\sigma_{x}$ indicates the width</strong> of the Gaussian.</p>
<p>(You may recall that the power of a driven oscillator is given by a Lorentzian function l(x) = $\\gamma$/($x^{2} + \\gamma^{2}$), which has a roughly similar shape and decays to half its value at x = $\\pm \\gamma$. Try not to get the functions confused.)</p>
<p>The <strong>Fourier transform of the Gaussian</strong> is:</p>
<p style="text-align:center;">$$\\tilde{g}(k) = (\\sigma_x/\\sqrt{2\\pi}) e^{-\\sigma_x^2k^2/2} = (1/\\sqrt{2\\pi}\\sigma_k) e^{-(k/\\sigma_k)^2/2}$$</p>
<p>where <strong>$\\sigma_{k}$ = 1/$\\sigma_{x}$</strong>. This is also a Gaussian, but with width $\\sigma_{k}$ = 1/$\\sigma_{x}$. Thus, the <strong>narrower</strong> the Gaussian is in position space ($\\sigma_{x} \\rightarrow$ 0), the <strong>broader</strong> its Fourier transform is ($\\sigma_{k} \\rightarrow \\infty$), and vice versa.</p>
<p>When $\\sigma = \\infty$, the Gaussian is infinitely wide: it takes the same value at all x. Then $\\tilde{g}$(k) becomes a $\\delta$-function at k = 0. That is, to construct a constant, one only needs the infinite wavelength mode (recall $\\lambda$ = 2$\\pi$/k). To construct something narrower, one needs more and more wavenumbers. To construct a very sharp Gaussian ($\\sigma_{x} \\rightarrow$ 0), the Fourier transform flattens out: one needs an <strong>infinite number of wavenumbers</strong> to get infinitely sharp features.</p>
<p>If we shift the Gaussian and multiply by a carrier wave, we get the general <strong>wavepacket</strong>:</p>
<p style="text-align:center;">$$f(x) = e^{-(x-x_0)^2/(2\\sigma_x^2)} e^{ik_cx}$$</p>
<p>with Fourier transform:</p>
<p style="text-align:center;">$$\\tilde{f}(k) = (\\sigma_x/\\sqrt{2\\pi}) e^{-\\sigma_x^2(k-k_c)^2/2} e^{-ix_0(k-k_c)}$$</p>
<p>The Gaussian is called a <strong>wavepacket</strong> because of its Fourier transform: it is a packet of waves with frequencies/wavenumbers clustered around a single value $k_{c}$ (the subscript "c" is for "carrier").</p>
<span class='inline-math-link' data-math='gaussian-fourier-math'>Gaussian Fourier Transform $\\rightarrow$</span>`,
      interactive: "gaussian-wavepacket",
      interactiveCaption: "A Gaussian wavepacket in position space and its Fourier transform, showing the reciprocal relationship between widths",
      mathLinks: ["gaussian-fourier-math"]
    },
    {
      heading: "Amplitude Modulation",
      body: `<p>One of the most important applications of wavepackets is in <strong>communication</strong>. How do we encode information in waves?</p>
<p>The simplest way is to play a single note — a pure sine wave sin(2$\\pi \\nu_{c}$t). But if this is all that ever happens, <strong>no information is actually being transferred</strong>. To transmit a signal, we can start and stop the note periodically. For example, modulate the note by turning it on and off once a second:</p>
<p style="text-align:center;">$$A(t) = f(t) \\sin(2\\pi\\nu_ct)$$</p>
<p>where f(t) has a frequency of $\\nu_{m} \\sim$ 1 Hz. Since $\\nu_{m} \\ll \\nu_{c}$, the curves look like what we had for beats — really the sum of Fourier modes with $\\nu = \\nu_{c} \\pm \\nu_{m}$.</p>
<p>By combining a few more frequencies close to the carrier, we can encode more interesting information. Rather than combining particular frequencies, it's somewhat easier to think about writing A(t) = F(t) sin(2$\\pi \\nu_{m}$t) sin(2$\\pi \\nu_{c}$t) where F(t) is a slowly varying function that changes its value after each node of the modulated signal. This is an <strong>amplitude-modulated signal</strong>.</p>
<p>We can separate pulses cleanly if we construct them with <strong>wavepackets</strong>, as long as the width of the packets is smaller than the distance between them. For example, we can add Gaussians with different widths and amplitudes:</p>
<p style="text-align:center;">$$S(t) = 2f(t) + 3f(t-100s) + f(t-150s) + 5f(t-200s)$$</p>
<p>The high-frequency carrier changes each packet from f(t) to:</p>
<p style="text-align:center;">$$f_c(t) = e^{-(t/\\sigma_t)^2/2} \\cos(2\\pi\\nu_ct) = Re[e^{-(t/\\sigma_t)^2/2} e^{2\\pi i\\nu_ct}]$$</p>
<p>As long as the carrier frequency is larger than the width of the wavepacket, $\\nu_{c} \\gtrsim$ 1/$\\sigma_{t}$, the wiggles in the carrier will be imperceptible and the packet will be faithfully reconstructed.</p>
<p>This is how <strong>AM (Amplitude Modulated) radio</strong> works. The information is conveyed at the information rate $\\nu_{m} \\sim$ Hz on a carrier frequency $\\nu_{c}$ typically in the 100 MHz range. For cell phones and wireless, GHz frequencies are used as carrier frequencies.</p>
<p>In terms of time and frequency, the key relationship is:</p>
<p style="text-align:center;">$$f(t) = e^{-(t-t_0)^2/(2\\sigma_t^2)} e^{i\\omega_ct}  \\; \\Leftrightarrow \\;  \\tilde{f}(\\omega) = (\\sigma_t/\\sqrt{2\\pi}) e^{-\\sigma_t^2(\\omega-\\omega_c)^2/2} e^{-it_0(\\omega-\\omega_c)}$$</p>
<p>To construct a signal f(t) with width $\\sigma_{t}$, we need frequencies within a range <strong>$\\sigma_{\\omega}$ = 1/$\\sigma_{t}$</strong> centered around any $\\omega_{c}$. The central (carrier) frequency can be anything. The key is that enough frequencies around $\\omega_{c}$ be included. More precisely, we need a <strong>band of width $\\sigma_{\\omega}$ = 1/$\\sigma_{t}$</strong> to construct pulses of width $\\sigma_{t}$. The pulses should be separated by, at minimum, $\\sigma_{t}$. Thus the feature which limits how much information can be transmitted is the <strong>bandwidth</strong>. To send more information (smaller distance between pulses), a larger bandwidth is needed.</p>`,
      interactive: "amplitude-modulation",
      interactiveCaption: "Gaussian wavepackets encode information on a carrier. Drag \u03C3_t to see the bandwidth\u2013pulse width tradeoff: narrower pulses carry more data but need more bandwidth (\u0394f = 1/2\u03C0\u03C3_t). Make pulses too wide and they overlap, losing information.",
      mathLinks: ["am-radio-math", "bandwidth-math"]
    },
    {
      heading: "Dispersion Relations",
      body: `<p>An extremely important concept in the study of waves is <strong>dispersion</strong>. Recall the <strong>dispersion relation</strong> is defined as the relationship between the frequency and the wavenumber: $\\omega$(k). For non-dispersive systems, like most of what we've covered so far, $\\omega$(k) = vk is a linear relation. An example of a dispersive system is a set of <strong>pendula coupled by springs</strong>, where the wave equation is modified to:</p>
<p style="text-align:center;">$$\\partial^2A/\\partial t^2 - (E/\\mu)\\partial^2A/\\partial x^2 + (g/L)A = 0$$</p>
<p>The dispersion relation is derived by plugging in A = $A_{0}$e<sup>i(kx+$\\omega$t)</sup>, leading to $\\omega = \\sqrt{(E/\\mu} k^{2}$ + g/L).</p>
<p>Here is a summary of some physical systems and their dispersion relations:</p>
<ul>
<li><strong>Deep water waves:</strong> $\\omega = \\sqrt{gk}$. Longer wavelengths move faster. Phase velocity $v_{p} = \\sqrt{g\\lambda/(2\\pi}$), group velocity $v_{g} = \\frac{1}{2} v_{p}$. Applies when $\\lambda \\gg$ d (depth of water).</li>
<li><strong>Shallow water waves:</strong> $\\omega = \\sqrt{gd} \\cdot$ k. Dispersionless, with $v_{p} = v_{g} = \\sqrt{gd}$.</li>
<li><strong>Surface waves (capillary waves):</strong> $\\omega^{2} = k^{3} \\sigma/\\rho$. Shorter wavelengths move faster. $v_{g}$ = (3/2)$v_{p}$.</li>
<li><strong>Light in a plasma:</strong> $\\omega = \\sqrt{\\omega_p^2 + c^2k^2}$. Same form as pendula/spring system.</li>
<li><strong>Light in glass:</strong> $\\omega$ = (c/n)k. The index of refraction <em>n</em> can depend weakly on wavenumber. In most glass, $n^{2}$ = 1 + a/($k_{0}$<sup>2</sup> - $k^{2}$).</li>
</ul>`,
      interactive: "dispersion-relations",
      interactiveCaption: "Various dispersion relations plotted: linear (non-dispersive), deep water, shallow water, capillary waves, and plasma",
      mathLinks: ["dispersion-relation-math"]
    },
    {
      heading: "Time Evolution of Modes: Phase Velocity",
      body: `<p>Now we will understand the importance of dispersion relations (and their name) by studying the <strong>time-evolution of propagating wavepackets</strong>.</p>
<p>How do we solve the wave equation in a dispersive system with initial condition A(x, 0) = f(x)? For a non-dispersive wave with $\\omega$(k) = vk, the solution is simply A(x, t) = f(x $\\pm$ vt). But for a dispersive system, like the pendula/spring equation, a fixed-k solution works only if one k is present.</p>
<p>For a dispersion relation $\\omega$(k), the amplitude $A_{0}$ exp[ik(x - $\\omega$(k)t/k)] is always a solution. We call the speed of this particular solution the <strong>phase velocity</strong>:</p>
<p style="text-align:center;">$$v_p(k) = \\omega(k)/k$$</p>
<p>So what happens when A(x, 0) is not a pure plane wave? The easiest way to solve is through <strong>Fourier analysis</strong>. We write:</p>
<p style="text-align:center;">$$A(x, 0) = f(x) = \\int dk e^{ikx} \\tilde{f}(k)$$</p>
<p>This writes the initial condition as a sum of plane wave modes. Since each mode evolves by replacing x $\\rightarrow$ x - $v_{p}$(k)t, we have the <strong>exact solution</strong>:</p>
<p style="text-align:center;">$$A(x, t) = \\int dk e^{i(kx - \\omega(k)t)} \\tilde{f}(k)$$</p>
<details><summary><strong>Verification for the pendula/spring wave equation</strong></summary>
<p>Plugging in with $\\omega$(k) = $\\sqrt{(E/\\mu} k^{2}$ + g/L):</p>
<p style="text-align:center;">$$(\\partial^2/\\partial t^2 - (E/\\mu)\\partial^2/\\partial x^2 + g/L) A(x,t) = \\int dk [-\\omega^2 + (E/\\mu)k^2 + g/L] e^{i(kx-\\omega t)} \\tilde{f}(k) = 0$$</p>
<p>since $\\omega^{2}$ = (E/$\\mu)k^{2}$ + g/L by the dispersion relation. The boundary condition A(x,0) = f(x) is also satisfied.</p>
<p>For a non-dispersive medium $\\omega$(k) = vk, we recover: A(x,t) = $\\int e^{ik(x-vt)} \\tilde{f}$(k) dk = f(x - vt), as expected.</p>
</details>`,
      interactive: "phase-velocity-demo",
      interactiveCaption: "Phase velocity: each Fourier mode travels at its own speed v_p(k) = $\\omega$(k)/k in a dispersive medium",
      mathLinks: ["phase-velocity-math"]
    },
    {
      heading: "Time Evolution of Signals: Group Velocity",
      body: `<p>Now take $\\omega$(k) to be arbitrary and take the initial signal shape to be our Gaussian wavepacket with carrier wavenumber $k_{c}$:</p>
<p style="text-align:center;">$$f(x) = e^{-(x-x_0)^2/(2\\sigma_x^2)} e^{ik_cx}$$</p>
<p>The Fourier transform $\\tilde{f}$(k) is exponentially suppressed away from k = $k_{c}$, so we can Taylor expand the dispersion relation:</p>
<p style="text-align:center;">$$\\omega(k) = \\omega(k_c) + (k - k_c)\\omega'(k_c) + \\ldots = k_cv_p + (k - k_c)v_g + \\ldots$$</p>
<p>where $v_{p} = v_{p}(k_{c}$) is the phase velocity at $k_{c}$ and $v_{g}$ is the <strong>group velocity</strong>:</p>
<p style="text-align:center;">$$v_g(k) = d\\omega(k)/dk$$</p>
<details><summary><strong>Derivation: the wavepacket moves at $v_{g}$</strong></summary>
<p>Truncating the Taylor expansion to first order:</p>
<p style="text-align:center;">$$A(x,t) = \\int dk e^{i(kx - k_cv_pt - (k-k_c)v_gt)} \\tilde{f}(k)$$</p>
<p style="text-align:center;">$$= e^{-ik_ct(v_g-v_p)} \\int dk e^{ik(x-v_gt)} \\tilde{f}(k)$$</p>
<p style="text-align:center;">$$= e^{-ik_ct(v_g-v_p)} f(x - v_gt)$$</p>
<p>Thus the wavepacket moves at velocity $v_{g}$. For a non-dispersive wave $v_{p} = v_{g}$ and we recover the original solution. Note that in deriving this, we didn't need the exact form of the wavepacket — just that it is exponentially localized around $k_{c}$.</p>
</details>
<p>Stating the results in terms of time dependence and frequency:</p>
<ul>
<li>A pulse can be constructed with a group of wavenumbers in a band $k_{c} - \\sigma_{k}$ &lt; k &lt; $k_{c} + \\sigma_{k}$, or equivalently with frequencies in a band $\\nu_{c} - \\sigma_{\\nu}$ &lt; $\\nu$ &lt; $\\nu_{c} + \\sigma_{\\nu}$.</li>
<li>To send a pulse lasting $\\sigma_{t}$ seconds using carrier frequency $\\nu_{c}$, one needs frequencies within $\\sigma_{\\nu}$ = 1/$\\sigma_{t}$ of $\\nu_{c}$.</li>
<li>The <strong>pulse travels with the group velocity</strong> $v_{g}$ = d$\\omega$/dk evaluated at the carrier wavenumber.</li>
</ul>
<p>Note that because $\\sigma_{k} \\ll k_{c}$, the group velocity is roughly constant for all relevant wavenumbers, but may be very different from the phase velocity. For example, if $\\omega$(k) = 5$k^{4}$, then at $k_{c}$ = 100, $v_{p}$ = 5 $\\times 10^{8}$ while $v_{g}$ = 20$k^{3}$ = 2 $\\times 10^{7}$.</p>
<span class='inline-math-link' data-math='group-velocity-math'>Group Velocity Derivation $\\rightarrow$</span>`,
      interactive: "group-velocity-demo",
      interactiveCaption: "A wavepacket propagating in a dispersive medium: the envelope moves at v_g while the carrier crests move at v_p",
      mathLinks: ["group-velocity-math", "phase-velocity-math"]
    },
    {
      heading: "Dispersion",
      body: `<p>Now we come to where dispersion relations got their name. We just saw that to first approximation, a wavepacket moves with velocity $v_{g}$. But in the first-order approximation, the dispersion relation might as well be linear (non-dispersive). So let's add the <strong>second term</strong> to see the dispersion:</p>
<p style="text-align:center;">$$\\omega(k) = k_cv_p + (k - k_c)v_g + \\frac{1}{2}(k - k_c)^2\\Gamma + \\ldots$$</p>
<p>where <strong>$\\Gamma = \\omega$&Prime;($k_{c}$)</strong> is a new parameter. For a non-dispersive wave, $\\Gamma$ = 0.</p>
<details><summary><strong>Exact solution with quadratic dispersion</strong></summary>
<p>Starting with our Gaussian wavepacket A(x, 0) = e<sup>-(x-$x_{0}$)<sup>2</sup>/(2$\\sigma^{2}$)</sup> e<sup>i$k_{c}$x</sup>, the time-evolved solution is:</p>
<p style="text-align:center;">$$A(x,t) = (\\sigma/\\sqrt{2\\pi}) \\int e^{i(kx - [k_cv_p + (k-k_c)v_g + \\frac{1}{2}(k-k_c)^2\\Gamma]t)} e^{-\\sigma_x^2(k-k_c)^2/2} e^{ix_0(k-k_c)} dk$$</p>
<p>The exponent is still quadratic in k — still a Gaussian — so the integral can be done exactly. The result is:</p>
<p style="text-align:center;">$$A(x,t) = \\exp[-(x - (x_0 + v_gt))^2 / (2\\sigma(t)^2)] \\cdot e^{i\\phi(x,t)}$$</p>
<p>where the time-dependent width is:</p>
<p style="text-align:center;">$$\\sigma(t) = \\sigma_x\\sqrt{1 + \\Gamma^2t^2/\\sigma_x^4}$$</p>
</details>
<p>The key result is the <strong>time-dependent width</strong>:</p>
<p style="text-align:center;">$$\\sigma(t) = \\sigma_x\\sqrt{1 + \\Gamma^2t^2/\\sigma_x^4}$$</p>
<p>The width is <strong>increasing with time</strong>. The wavepacket is <strong>broadening</strong>. This is why we call it a dispersion relation — in dispersive media, <strong>wavepackets disperse</strong>. For a non-dispersive wave, $\\Gamma$ = 0, and wavepackets maintain their shape.</p>
<p>Here's a comparison: take a non-dispersive pulse with v = 1 and a dispersive one with $\\omega$(k) = $\\sqrt{k^2 + 50^2}$, both starting with $\\sigma_{x}$ = 0.5 and $k_{c}$ = 30. The dispersive pulse has $v_{p}$ = 1.94 and $v_{g}$ = 0.51. After 5 seconds, the dispersive packet has gone half as far as the non-dispersive one, consistent with its slower group velocity. At longer times, the dispersive pulse flattens out dramatically while the non-dispersive pulse retains its shape.</p>
<p><strong>Dispersion in optical media is critical to modern optics and telecommunications.</strong> High-speed internet and long-distance telephone communication use fiber optic cables. Information is transmitted via optical wavepackets in glass. Due to dispersion, pulses too close together begin to overlap, destroying the information. This sets a <strong>fundamental limit to internet communication speed</strong>. Luckily, silica-based glass has very low dispersion (and absorption) in the near IR region (1.3–1.5 microns). This frequency band, now known as the <strong>telecomm band</strong>, has seen extensive technological development due to its use for fiber optic communication.</p>
<p>In <strong>quantum mechanics</strong>, an electron is often treated as a wavepacket. The non-relativistic dispersion relation is $\\omega$(k) = $\\hbar k^{2}$/(2m). So $v_{g}$ = 2$v_{p} = \\hbar$k/m = p/m with p = $\\hbar$k the momentum and $\\Gamma = \\hbar$/m. The width becomes $\\sigma$(t) = $\\sigma_{x} \\sqrt{1 + (\\lambda_cct/(2\\pi\\sigma_x^2}$)<sup>2</sup>) with $\\lambda_{c}$ = h/(mc) = 2.42 $\\times 10^{-12}$ m the Compton wavelength. The center moves with velocity p/m, as expected. The width grows very rapidly: at the speed of light for an electron localized to within its Compton wavelength. <strong>The more you try to pin down an electron, the faster the wavepacket grows!</strong></p>`,
      interactive: "wavepacket-dispersion",
      interactiveCaption: "Comparison of a non-dispersive pulse (maintains shape) with a dispersive pulse (broadens over time while traveling at the group velocity)",
      mathLinks: ["dispersion-math", "fiber-optics-math"]
    },
    {
      heading: "Problems",
      body: `<p><strong>Problem 11.1:</strong> Show that the Fourier transform of a Gaussian e<sup>-$x^{2}$/(2$\\sigma^{2}$)</sup> is proportional to e<sup>-$\\sigma^{2} k^{2}$/2</sup>. Verify the width relationship $\\sigma_{k}$ = 1/$\\sigma_{x}$.</p>
<p><strong>Problem 11.2:</strong> An AM radio station broadcasts at a carrier frequency of $\\nu_{c}$ = 1 MHz and needs to transmit audio signals up to 5 kHz. What bandwidth is required? What range of frequencies must the receiver accept?</p>
<p><strong>Problem 11.3:</strong> For deep water waves ($\\omega = \\sqrt{gk}$), compute the phase velocity and group velocity. Show that $v_{g} = \\frac{1}{2} v_{p}$. What does this imply about wave crests moving through a group of deep water waves?</p>
<p><strong>Problem 11.4:</strong> A Gaussian wavepacket has initial width $\\sigma_{x}$ = 1 cm and is sent through a medium with $\\Gamma = \\omega$&Prime;($k_{c}$) = 0.5 $m^{2}$/s. How long does it take for the packet to double in width? How does the answer change if $\\sigma_{x}$ = 1 mm?</p>
<p><strong>Problem 11.5:</strong> For the dispersion relation $\\omega$(k) = $\\sqrt{\\omega_p^2 + c^2k^2}$ (light in a plasma), compute $v_{p}$ and $v_{g}$. Show that $v_{p} \\cdot v_{g} = c^{2}$. What does this imply about whether $v_{p}$ or $v_{g}$ can exceed c?</p>
<p><strong>Problem 11.6:</strong> An electron is localized to a region of width $\\sigma_{x}$ = 1 nm. Using the non-relativistic dispersion relation $\\omega = \\hbar k^{2}$/(2m), estimate how long it takes for the wavepacket to double in width. (Use $m_{e}$ = 9.11 $\\times 10^{-31}$ kg, $\\hbar$ = 1.055 $\\times 10^{-34}$ J$\\cdot$s.)</p>
<p><strong>Problem 11.7:</strong> In a non-dispersive medium, a wavepacket travels without changing shape. Show this explicitly by plugging $\\omega$(k) = vk into the general solution A(x,t) = $\\int$ dk e<sup>i(kx - $\\omega$(k)t)</sup> $\\tilde{f}$(k) and recovering f(x - vt).</p>
<p><strong>Problem 11.8:</strong> A fiber optic cable transmits light at $\\lambda$ = 1.5 $\\mu$m. The dispersion parameter is D = 17 ps/(nm$\\cdot$km). If pulses of width 100 ps are used, estimate the maximum distance before adjacent pulses (separated by 200 ps) begin to overlap. This limits the data rate — what is the approximate maximum bit rate for this distance?</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: []
    }
  ]

};
