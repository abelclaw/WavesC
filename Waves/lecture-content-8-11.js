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
<p style="text-align:center;"><em>f(x) = &sum;<sub>n=&minus;&infin;</sub><sup>&infin;</sup> c<sub>n</sub> e<sup>i2&pi;nx/L</sup></em></p>
<p>where the coefficients are:</p>
<p style="text-align:center;"><em>c<sub>n</sub> = (1/L) &int;<sub>&minus;L/2</sub><sup>L/2</sup> f(x) e<sup>&minus;i2&pi;nx/L</sup> dx</em></p>
<details><summary><strong>Verification of the Fourier series inversion</strong></summary>
<p>To check, plug the series for <em>f(x)</em> into the integral for <em>c<sub>n</sub></em>:</p>
<p style="text-align:center;"><em>c<sub>n</sub> = (1/L) &sum;<sub>m</sub> c<sub>m</sub> &int;<sub>&minus;L/2</sub><sup>L/2</sup> e<sup>i2&pi;(m&minus;n)x/L</sup> dx</em></p>
<p>Using the orthogonality identity &int;<sub>&minus;L/2</sub><sup>L/2</sup> e<sup>i(m&minus;n)2&pi;x/L</sup> dx = L&delta;<sub>mn</sub>, we get c<sub>n</sub> = (1/L) &sum;<sub>m</sub> c<sub>m</sub> L&delta;<sub>nm</sub> = c<sub>n</sub>, as desired.</p>
</details>
<p>To derive the Fourier transform, we write <em>k<sub>n</sub> = 2&pi;n/L</em> where <em>n</em> is still an integer going from &minus;&infin; to +&infin;. For arbitrary <em>L</em>, <em>k<sub>n</sub></em> can get arbitrarily big in the positive or negative direction. However, at fixed <em>L</em>, the lowest non-zero <em>k<sub>n</sub></em> cannot be arbitrarily small: |k<sub>n</sub>| &gt; 2&pi;/L. Then we define:</p>
<p style="text-align:center;"><em>f&#x0303;(k<sub>n</sub>) = Lc<sub>n</sub>/(2&pi;) = (1/2&pi;) &int;<sub>&minus;L/2</sub><sup>L/2</sup> f(x) e<sup>&minus;ik<sub>n</sub>x</sup> dx</em></p>
<p>The factor of 2&pi; in this equation is just a convention. Now we can take L &rarr; &infin; so that <em>k<sub>n</sub></em> can get arbitrarily close to zero. This gives:</p>
<p style="text-align:center;"><strong>f&#x0303;(k) = (1/2&pi;) &int;<sub>&minus;&infin;</sub><sup>&infin;</sup> f(x) e<sup>&minus;ikx</sup> dx</strong></p>
<p>where now <em>k</em> can be any real number. This is the <strong>Fourier transform</strong>. It is a continuum generalization of the <em>c<sub>n</sub></em>'s of the Fourier series.</p>
<details><summary><strong>Derivation of the inverse Fourier transform</strong></summary>
<p>The inverse comes from writing the Fourier series as an integral. From k<sub>n</sub> = 2&pi;n/L, we find dk<sub>n</sub> = (2&pi;/L)&Delta;n. This leads to:</p>
<p style="text-align:center;"><em>f(x) = &sum; c<sub>n</sub> e<sup>ikx</sup> &Delta;n = &sum; c<sub>n</sub> e<sup>ikx</sup> (L/2&pi;) dk<sub>n</sub> = &int;<sub>&minus;&infin;</sub><sup>&infin;</sup> f&#x0303;(k) e<sup>ikx</sup> dk</em></p>
<p>where we have used the definition of f&#x0303;(k) and taken L &rarr; &infin; in the last step.</p>
</details>
<p>So we have the <strong>Fourier transform pair</strong>:</p>
<p style="text-align:center;"><em>f&#x0303;(k) = (1/2&pi;) &int;<sub>&minus;&infin;</sub><sup>&infin;</sup> f(x) e<sup>&minus;ikx</sup> dx &nbsp;&nbsp;&hArr;&nbsp;&nbsp; f(x) = &int;<sub>&minus;&infin;</sub><sup>&infin;</sup> f&#x0303;(k) e<sup>ikx</sup> dk</em></p>
<p>We say that <em>f&#x0303;(k)</em> is the Fourier transform of <em>f(x)</em>. The factor of 2&pi; is just a convention. We could also have defined <em>f(x)</em> with the 2&pi; in it. The sign on the phase is also a convention. Keep in mind that <strong>different conventions are used in different places and by different people</strong>. There is no universal convention for the 2&pi; factors. All conventions lead to the same physics.</p>
<p>The Fourier transform of a function of <em>x</em> gives a function of <em>k</em>, where <em>k</em> is the wavenumber. The Fourier transform of a function of <em>t</em> gives a function of <em>&omega;</em> where <em>&omega;</em> is the angular frequency:</p>
<p style="text-align:center;"><em>f&#x0303;(&omega;) = (1/2&pi;) &int;<sub>&minus;&infin;</sub><sup>&infin;</sup> f(t) e<sup>&minus;i&omega;t</sup> dt</em></p>
<span class='inline-math-link' data-math='fourier-transform-math'>Fourier Transform Conventions &rarr;</span>`,
      interactive: "fourier-transform-derivation",
      interactiveCaption: "Transition from discrete Fourier series to the continuous Fourier transform as L approaches infinity",
      mathLinks: ["fourier-transform-math"]
    },
    {
      heading: "Example: Underdamped Oscillator",
      body: `<p>As an example, let us compute the Fourier transform of the position of an <strong>underdamped oscillator</strong>:</p>
<p style="text-align:center;"><em>f(t) = e<sup>&minus;&gamma;t</sup> cos(&omega;<sub>0</sub>t) &theta;(t)</em></p>
<p>where the <strong>unit-step function</strong> (Heaviside function) is defined by &theta;(t) = 1 for t &gt; 0 and &theta;(t) = 0 for t &le; 0. This function ensures that our oscillator starts at time t = 0. If we didn't include it, the amplitude would blow up as t &rarr; &minus;&infin;.</p>
<details><summary><strong>Full derivation of the Fourier transform</strong></summary>
<p>We first write cos(&omega;<sub>0</sub>t) = &frac12;(e<sup>i&omega;<sub>0</sub>t</sup> + e<sup>&minus;i&omega;<sub>0</sub>t</sup>), so:</p>
<p style="text-align:center;"><em>f(t) = &frac12; e<sup>&minus;&gamma;t</sup> e<sup>i&omega;<sub>0</sub>t</sup> &theta;(t) + &frac12; e<sup>&minus;&gamma;t</sup> e<sup>&minus;i&omega;<sub>0</sub>t</sup> &theta;(t)</em></p>
<p>Starting with the first term:</p>
<p style="text-align:center;"><em>f&#x0303;<sub>+&omega;<sub>0</sub></sub>(&omega;) = (1/4&pi;) &int;<sub>0</sub><sup>&infin;</sup> e<sup>(&minus;&gamma; &minus; i&omega; + i&omega;<sub>0</sub>)t</sup> dt = (1/4&pi;) &middot; 1/(&gamma; + i(&omega; &minus; &omega;<sub>0</sub>))</em></p>
<p>In the last step we used that the t = &infin; endpoint vanishes due to the e<sup>&minus;&gamma;t</sup> factor, and at t = 0 the exponential is 1. The second term is the first with &omega;<sub>0</sub> &rarr; &minus;&omega;<sub>0</sub>. Thus the full Fourier transform is:</p>
<p style="text-align:center;"><em>f&#x0303;(&omega;) = (1/4&pi;)[1/(&gamma; + i(&omega; &minus; &omega;<sub>0</sub>)) + 1/(&gamma; + i(&omega; + &omega;<sub>0</sub>))] = (1/2&pi;i) &middot; (&omega; &minus; i&gamma;) / ((&omega; &minus; i&gamma;)<sup>2</sup> &minus; &omega;<sub>0</sub><sup>2</sup>)</em></p>
</details>
<p>The result is:</p>
<p style="text-align:center;"><em>f&#x0303;(&omega;) = (1/2&pi;i) &middot; (&omega; &minus; i&gamma;) / ((&omega; &minus; i&gamma;)<sup>2</sup> &minus; &omega;<sub>0</sub><sup>2</sup>)</em></p>
<p>The spectrum plotted for an audio signal is usually |f&#x0303;(&omega;)|<sup>2</sup>. Taking &omega;<sub>0</sub> = 10 and &gamma; = 2, the modulus squared of the Fourier transform shows peaks centered at &plusmn;&omega;<sub>0</sub> with widths determined by &gamma;.</p>
<p>We can now also understand what the shapes of the peaks are in the violin spectrum. The <strong>widths of the peaks give how much each harmonic damps with time</strong>. The width at half maximum gives the damping factor &gamma;.</p>`,
      interactive: "underdamped-fourier-transform",
      interactiveCaption: "An underdamped oscillator (left) and its power spectrum |f&#x0303;(&omega;)|² (right) for &gamma; = 2 and &omega;₀ = 10",
      mathLinks: ["fourier-transform-math", "underdamped-oscillator-math"]
    },
    {
      heading: "Fourier Transform is Complex",
      body: `<p>For a real function <em>f(t)</em>, the Fourier transform will usually <strong>not be real</strong>. Indeed, the imaginary part of the Fourier transform of a real function is:</p>
<p style="text-align:center;"><em>Im[f&#x0303;(k)] = (1/2&pi;) &int;<sub>&minus;&infin;</sub><sup>&infin;</sup> f(x) sin(kx) dx &equiv; f&#x0303;<sub>s</sub>(k)</em></p>
<p>This is a <strong>Fourier sine transform</strong>. The imaginary part vanishes only if the function has no sine components, which happens if and only if the function is <strong>even</strong>. For an odd function, the Fourier transform is purely imaginary. For a general real function, the Fourier transform will have both real and imaginary parts. We can write:</p>
<p style="text-align:center;"><em>f&#x0303;(k) = f&#x0303;<sub>c</sub>(k) + i f&#x0303;<sub>s</sub>(k)</em></p>
<p>where f&#x0303;<sub>s</sub>(k) is the Fourier sine transform and f&#x0303;<sub>c</sub>(k) the Fourier cosine transform. One hardly ever uses Fourier sine and cosine transforms individually. We practically always talk about the complex Fourier transform.</p>
<p>Rather than separating f&#x0303;(k) into real and imaginary parts (Cartesian coordinates), it is often helpful to write it as <strong>magnitude and phase</strong> (polar coordinates):</p>
<p style="text-align:center;"><em>f&#x0303;(k) = A(k) e<sup>i&phi;(k)</sup></em></p>
<p>with A(k) = |f&#x0303;(k)| the magnitude and &phi;(k) the phase.</p>
<p>The energy in a frequency mode only depends on the amplitude: <em>I = A(&omega;)<sup>2</sup></em>. When one plots the spectrum as in Audacity, what is being shown is A(&omega;)<sup>2</sup>. This corresponds to the <strong>intensity or power</strong> in a particular mode, as we will see in Lecture 10. Power is useful in doing a frequency analysis of sound since it tells us how loud that frequency is. But looking at the amplitude is not the only thing one can do with a Fourier transform. Often one is also interested in the <strong>phase</strong>.</p>
<p>For a visual example, we can take the Fourier transform of an image. Suppose we have a grayscale image that is 640 &times; 480 pixels. Each pixel is a number from 0 to 255. We can then Fourier transform this function to f&#x0303;(k<sub>x</sub>, k<sub>y</sub>). The 2D Fourier transform is really no more complicated than the 1D transform — we just do two integrals instead of one.</p>
<p>The magnitude of a panda image is concentrated near k<sub>x</sub> &sim; k<sub>y</sub> &sim; 0 (corresponding to large-wavelength variations), while the phase looks random. The same is true for a cat image.</p>
<p>Now here's the remarkable thing: if we combine the <strong>magnitude from the panda with the phase from the cat</strong>, and inverse-transform, the resulting image looks like a cat! And vice versa. <strong>The phase is more important than the magnitude for reconstructing the original image.</strong> The importance of phase is critical for many engineering applications, such as signal analysis and image compression technologies.</p>`,
      interactive: "fourier-magnitude-phase",
      interactiveCaption: "Swapping magnitude and phase of Fourier transforms of two images reveals that phase carries most of the structural information",
      mathLinks: ["complex-fourier-math"]
    },
    {
      heading: "Filtering",
      body: `<p>One thing we can do with the Fourier transform of an image (or any signal) is remove some components. If we remove low frequencies (below some cutoff &omega;<sub>f</sub>), we call it a <strong>high-pass filter</strong>. A lot of background noise is at low frequencies, so a high-pass filter can clean up a signal.</p>
<p>If we throw out the high frequencies, it is called a <strong>low-pass filter</strong>. A low-pass filter can be used to smooth data (such as a digital photo) since it throws out high-frequency noise. A filter that cuts out both high and low frequencies is called a <strong>band-pass filter</strong>.</p>
<p>Here is a striking example. Take a photo of Einstein and apply a high-pass filter: you see the sharp features — edges, wrinkles, the structure of the face. Take a photo of Marilyn Monroe and apply a low-pass filter: you see the soft, blurry shape — the smooth variations in brightness.</p>
<p>Now combine the two: high-pass Einstein + low-pass Marilyn. Look at the combined image from up close and you see Einstein (your eyes resolve the high-frequency detail). Look at it from far away and you see Marilyn (your eyes can only pick up the low-frequency content at a distance). This is a beautiful demonstration of how our visual system performs its own frequency filtering based on distance.</p>`,
      interactive: "fourier-filtering",
      interactiveCaption: "High-pass and low-pass filtering of images: up close you see the high-frequency image, from far away you see the low-frequency one",
      mathLinks: ["filtering-math"]
    },
    {
      heading: "Dirac &delta; Function",
      body: `<p>Another extremely important example is the Fourier transform of a constant:</p>
<p style="text-align:center;"><em>&delta;(&omega;) &equiv; (1/2&pi;) &int;<sub>&minus;&infin;</sub><sup>&infin;</sup> e<sup>&minus;i&omega;t</sup> dt</em></p>
<p>Its Fourier inverse is then:</p>
<p style="text-align:center;"><em>1 = &int;<sub>&minus;&infin;</sub><sup>&infin;</sup> &delta;(&omega;) e<sup>i&omega;t</sup> d&omega;</em></p>
<p>This object &delta;(&omega;) is called the <strong>Dirac &delta; function</strong>. It is enormously useful in a great variety of physics problems, especially in quantum mechanics, but also in waves.</p>
<p>To figure out what &delta;(&omega;) looks like, we use the fact that the Fourier transform of the inverse Fourier transform gives a function back. For any smooth function <em>f(x)</em>:</p>
<p style="text-align:center;"><em>f(x) = &int; dk e<sup>ikx</sup> f&#x0303;(k) = &int; dy &delta;(y &minus; x) f(y)</em></p>
<p>Setting x = 0, we see that the &delta;-function satisfies the <strong>sifting property</strong>:</p>
<p style="text-align:center;"><strong>&int;<sub>&minus;&infin;</sub><sup>&infin;</sup> &delta;(x) f(x) dx = f(0)</strong></p>
<p>for any smooth function <em>f(x)</em>. The &delta;-function also has the property that &delta;(x) = 0 for x &ne; 0, so the integral &int;<sub>&minus;x<sub>0</sub></sub><sup>x<sub>0</sub></sup> &delta;(x) f(x) dx = f(0) for any x<sub>0</sub> &gt; 0.</p>
<p>These properties uniquely define the &delta;-function. Indeed, the &delta;-function is no ordinary function. It is instead a member of a class of mathematical objects called <strong>distributions</strong>. While functions take numbers and give numbers (like f(x) = x<sup>2</sup>), distributions only give numbers after being integrated.</p>
<p>You should think of &delta;(x) as <strong>zero everywhere except at x = 0 where it is infinite</strong>. However, the infinity is integrable: &int;<sub>&minus;x<sub>0</sub></sub><sup>x<sub>0</sub></sup> &delta;(x) dx = 1 for any x<sub>0</sub> &gt; 0.</p>
<p>From the physics point of view, we showed that if we have an amplitude which is constant in time f(t) = 1, then the only frequency mode supported has 0 frequency. This makes sense — a constant has an infinite wavelength and never repeats. Conversely, if f&#x0303;(&omega;) = 1 it says that all frequencies are excited. This corresponds to <strong>white noise</strong>. The Fourier transform of f&#x0303;(&omega;) = 1 gives a function f(t) = &delta;(t) which corresponds to an infinitely sharp pulse. A pulse has no characteristic time associated with it, so no frequency can be picked out. That's why white noise has all frequencies equally.</p>
<details><summary><strong>Some mathematics of &delta;(&omega;) (optional)</strong></summary>
<p>For &omega; &ne; 0, one can evaluate &delta;(&omega;) using contour integration in the complex &omega; plane. The integral along a semicircular contour in the lower half-plane vanishes for the curved part (since t has a negative imaginary part there, making e<sup>&minus;i&omega;t</sup> &rarr; 0). Since e<sup>&minus;i&omega;t</sup> has no poles, the residue theorem gives &delta;(&omega;) = 0 for &omega; &ne; 0. On the other hand, for &omega; = 0, &delta;(0) = (1/2&pi;) &int;<sub>&minus;&infin;</sub><sup>&infin;</sup> dt = &infin;.</p>
<p>A practical way to define &delta;(x) is as a limit. There are many ways:</p>
<ul>
<li>&delta;(x) = lim<sub>&epsilon;&rarr;0</sub> (1/&pi;) &middot; &epsilon;/(x<sup>2</sup> + &epsilon;<sup>2</sup>) &nbsp;(Lorentzian)</li>
<li>&delta;(x) = lim<sub>&epsilon;&rarr;0</sub> (1/&radic;(4&pi;&epsilon;)) e<sup>&minus;x<sup>2</sup>/(4&epsilon;)</sup> &nbsp;(Gaussian)</li>
</ul>
<p>To check these, integrate any of them against a test function g(x) and verify the sifting property.</p>
</details>
<span class='inline-math-link' data-math='dirac-delta-math'>Dirac Delta Function &rarr;</span>`,
      interactive: "dirac-delta-visualization",
      interactiveCaption: "The Dirac delta function as a limit of increasingly narrow, tall Gaussians or Lorentzians, always with unit area",
      mathLinks: ["dirac-delta-math", "distribution-math"]
    },
    {
      heading: "Problems",
      body: `<p><strong>Problem 8.1:</strong> Compute the Fourier transform of the rectangular pulse f(x) = 1 for |x| &lt; a and f(x) = 0 otherwise. Plot |f&#x0303;(k)|<sup>2</sup> and discuss the relationship between the width of the pulse and the width of its Fourier transform.</p>
<p><strong>Problem 8.2:</strong> Verify the Fourier transform pair for the underdamped oscillator by substituting the result f&#x0303;(&omega;) = (1/2&pi;i)(&omega; &minus; i&gamma;)/((&omega; &minus; i&gamma;)<sup>2</sup> &minus; &omega;<sub>0</sub><sup>2</sup>) back into the inverse transform and recovering f(t) = e<sup>&minus;&gamma;t</sup>cos(&omega;<sub>0</sub>t)&theta;(t).</p>
<p><strong>Problem 8.3:</strong> Show that the Fourier transform of a real, even function f(x) is purely real, and that the Fourier transform of a real, odd function is purely imaginary.</p>
<p><strong>Problem 8.4:</strong> A function f(t) has Fourier transform f&#x0303;(&omega;). Express the Fourier transform of f(t &minus; t<sub>0</sub>) in terms of f&#x0303;(&omega;). What happens to the magnitude and phase?</p>
<p><strong>Problem 8.5:</strong> Using the representation &delta;(x) = lim<sub>&epsilon;&rarr;0</sub> (1/&pi;) &epsilon;/(x<sup>2</sup> + &epsilon;<sup>2</sup>), show that &int;<sub>&minus;&infin;</sub><sup>&infin;</sup> &delta;(x) dx = 1 for all &epsilon; &gt; 0. Then verify the sifting property by computing &int; &delta;(x) f(x) dx for a smooth test function f(x) in the limit &epsilon; &rarr; 0.</p>
<p><strong>Problem 8.6:</strong> Consider a signal that is a sum of two cosines at frequencies &omega;<sub>1</sub> and &omega;<sub>2</sub>. Compute its Fourier transform and sketch |f&#x0303;(&omega;)|<sup>2</sup>. How does the spectrum change if you add a third frequency &omega;<sub>3</sub> = (&omega;<sub>1</sub> + &omega;<sub>2</sub>)/2?</p>
<p><strong>Problem 8.7:</strong> Explain physically why a high-pass filter applied to an image emphasizes edges and fine detail, while a low-pass filter blurs the image. What would a band-pass filter show?</p>
<p><strong>Problem 8.8:</strong> The convolution theorem states that the Fourier transform of the product f(x)g(x) is the convolution of their Fourier transforms: FT[fg] = f&#x0303; * g&#x0303;. Use this to explain why multiplying a signal by a Gaussian envelope in the time domain broadens its spectrum.</p>`,
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
<p>We write the amplitude of the wave as &psi;<sub>L</sub>(x, t) to the left of the knot and &psi;<sub>R</sub>(x, t) to the right:</p>
<p style="text-align:center;"><em>&psi;(x, t) = &psi;<sub>L</sub>(x, t) for x &lt; 0, &nbsp;&nbsp; &psi;<sub>R</sub>(x, t) for x &ge; 0</em></p>
<p>To the left, the wave satisfies the wave equation with speed v<sub>1</sub> = &radic;(T<sub>1</sub>/&mu;<sub>1</sub>), and to the right with speed v<sub>2</sub> = &radic;(T<sub>2</sub>/&mu;<sub>2</sub>).</p>
<p><strong>First boundary condition — continuity:</strong> Obviously &psi;(x, t) should be continuous, so:</p>
<p style="text-align:center;"><em>&psi;<sub>L</sub>(0, t) = &psi;<sub>R</sub>(0, t)</em></p>
<details><summary><strong>Derivation of the second boundary condition</strong></summary>
<p>Recall from Lecture 6 that a point on the string of mass <em>m</em> gets a force from the parts of the string to the left and right. The force from the left is T &part;&psi;/&part;x (this makes sense: if the string has no slope, there is no force). From the right, the force is &minus;T &part;&psi;/&part;x. The sign must be opposite so that if there is no difference in slope there is no net force.</p>
<p>If there are different tensions to the right and left, as at x = 0:</p>
<p style="text-align:center;"><em>m &part;<sup>2</sup>&psi;(0,t)/&part;t<sup>2</sup> = T<sub>1</sub> &part;&psi;<sub>L</sub>(0,t)/&part;x &minus; T<sub>2</sub> &part;&psi;<sub>R</sub>(0,t)/&part;x</em></p>
<p>Now <em>m</em> is the mass of an infinitesimal point of string at x = 0. But T<sub>1</sub>, T<sub>2</sub>, and the slopes are macroscopic quantities. If the right-hand side doesn't vanish, &part;<sup>2</sup>&psi;/&part;t<sup>2</sup> &rarr; &infin; as m &rarr; 0. Writing m = &mu;&Delta;x and taking &Delta;x &rarr; 0 gives the condition.</p>
</details>
<p><strong>Second boundary condition — force balance:</strong></p>
<p style="text-align:center;"><em>T<sub>1</sub> &part;&psi;<sub>L</sub>(0,t)/&part;x = T<sub>2</sub> &part;&psi;<sub>R</sub>(0,t)/&part;x</em></p>
<p>So the slope must be <strong>discontinuous</strong> at the boundary to account for the different tensions. Now we have the boundary conditions. What is the solution?</p>`,
      interactive: "string-junction",
      interactiveCaption: "Two strings of different mass density or tension knotted together at x = 0, showing boundary conditions",
      mathLinks: ["boundary-conditions-math"]
    },
    {
      heading: "Reflection and Transmission",
      body: `<p>Suppose we have some incoming traveling wave. Before it hits the junction it has the form of a right-moving traveling wave &psi;<sub>L</sub>(x, t) = &psi;<sub>i</sub>(t &minus; x/v<sub>1</sub>) for t &lt; 0. The subscript <em>i</em> refers to the <strong>incident</strong> wave.</p>
<p>After t = 0, &psi;<sub>L</sub> can have both left- and right-moving components, so we write more generally:</p>
<p style="text-align:center;"><em>&psi;<sub>L</sub>(x, t) = &psi;<sub>i</sub>(t &minus; x/v<sub>1</sub>) + &psi;<sub>r</sub>(t + x/v<sub>1</sub>)</em></p>
<p>where &psi;<sub>r</sub> is the <strong>reflected</strong> wave. For x &gt; 0, there will also be a <strong>transmitted</strong> wave:</p>
<p style="text-align:center;"><em>&psi;<sub>R</sub>(x, t) = &psi;<sub>t</sub>(t &minus; x/v<sub>2</sub>)</em></p>
<p>Note that we are <strong>not assuming</strong> the incident, transmitted, and reflected waves have the same shape. The transmitted wave has speed v<sub>2</sub> since it travels in the right-hand string.</p>
<details><summary><strong>Solving the boundary conditions for R and T</strong></summary>
<p>Continuity at x = 0 implies: &psi;<sub>i</sub>(t) + &psi;<sub>r</sub>(t) = &psi;<sub>t</sub>(t).</p>
<p>For the force-balance condition, we compute the derivatives:</p>
<p style="text-align:center;"><em>T<sub>1</sub> &part;&psi;<sub>L</sub>/&part;x|<sub>x=0</sub> = (T<sub>1</sub>/v<sub>1</sub>)[&minus;&psi;<sub>i</sub>&prime;(t) + &psi;<sub>r</sub>&prime;(t)]</em></p>
<p style="text-align:center;"><em>T<sub>2</sub> &part;&psi;<sub>R</sub>/&part;x|<sub>x=0</sub> = &minus;(T<sub>2</sub>/v<sub>2</sub>) &psi;<sub>t</sub>&prime;(t)</em></p>
<p>Setting them equal: (T<sub>1</sub>/v<sub>1</sub>)[&minus;&psi;<sub>i</sub>&prime; + &psi;<sub>r</sub>&prime;] = &minus;(T<sub>2</sub>/v<sub>2</sub>)&psi;<sub>t</sub>&prime;. Integrating (and setting the integration constant to zero since a nonzero constant would just mean a constant net displacement):</p>
<p style="text-align:center;"><em>(T<sub>1</sub>/v<sub>1</sub>)[&minus;&psi;<sub>i</sub> + &psi;<sub>r</sub>] = &minus;(T<sub>2</sub>/v<sub>2</sub>)&psi;<sub>t</sub></em></p>
<p>Substituting &psi;<sub>t</sub> = &psi;<sub>i</sub> + &psi;<sub>r</sub> and solving:</p>
<p style="text-align:center;"><em>(T<sub>1</sub>/v<sub>1</sub> + T<sub>2</sub>/v<sub>2</sub>)&psi;<sub>r</sub> = (T<sub>1</sub>/v<sub>1</sub> &minus; T<sub>2</sub>/v<sub>2</sub>)&psi;<sub>i</sub></em></p>
</details>
<p>Defining the <strong>impedance</strong> Z<sub>1</sub> = T<sub>1</sub>/v<sub>1</sub> and Z<sub>2</sub> = T<sub>2</sub>/v<sub>2</sub>, we find the key results:</p>
<p style="text-align:center;"><strong>&psi;<sub>r</sub> = R &psi;<sub>i</sub>, &nbsp;&nbsp; &psi;<sub>t</sub> = T &psi;<sub>i</sub></strong></p>
<p>where the <strong>reflection coefficient</strong> and <strong>transmission coefficient</strong> are:</p>
<p style="text-align:center;"><strong>R = (Z<sub>1</sub> &minus; Z<sub>2</sub>) / (Z<sub>1</sub> + Z<sub>2</sub>), &nbsp;&nbsp; T = 2Z<sub>1</sub> / (Z<sub>1</sub> + Z<sub>2</sub>)</strong></p>
<p>We have found that the <strong>reflected wave has exactly the same shape</strong> as the incident wave, but with a different overall magnitude. The transmitted wave also has the same shape.</p>
<p><em>Z</em> is known as an <strong>impedance</strong>. More generally, impedance is <strong>force divided by velocity</strong>. It tells you how much force is required to impart a certain velocity. Impedance is a property of a medium. Using v = &radic;(T/&mu;) we can write Z = T/v = &radic;(T&mu;).</p>
<p>Note that when Z<sub>1</sub> = Z<sub>2</sub> there is no reflection and complete transmission. If we want no reflection, we need to <strong>match impedances</strong>. For example, if we want to impedance-match across two strings with different mass densities &mu;<sub>1</sub> and &mu;<sub>2</sub>, we can choose T<sub>2</sub> = (&mu;<sub>1</sub>/&mu;<sub>2</sub>)T<sub>1</sub> so that Z<sub>2</sub> = Z<sub>1</sub>.</p>
<p>Note also that the transmission coefficient is greater than 1 if Z<sub>1</sub> &gt; Z<sub>2</sub>. That means the <strong>amplitude increases</strong> when a wave travels from a medium of higher impedance to one of lower impedance. This is an important fact with real consequences.</p>
<span class='inline-math-link' data-math='reflection-transmission-math'>Reflection & Transmission Derivation &rarr;</span>`,
      interactive: "reflection-transmission-pulse",
      interactiveCaption: "Incident, reflected, and transmitted waves at a junction between two strings with different impedances",
      mathLinks: ["reflection-transmission-math", "impedance-math"]
    },
    {
      heading: "Phase Flipping",
      body: `<p>What happens when a wave hits a medium of <strong>higher impedance</strong>, such as when the tension or mass density of the second string is very large? Then Z<sub>2</sub> &gt; Z<sub>1</sub> and so R = (Z<sub>1</sub> &minus; Z<sub>2</sub>)/(Z<sub>1</sub> + Z<sub>2</sub>) &lt; 0. Thus, if &psi;<sub>i</sub> &gt; 0 then &psi;<sub>r</sub> &lt; 0. The wave <strong>flips its sign</strong>. This happens in particular if the wave hits a wall, which is like &mu; = &infin;.</p>
<p>On the other hand, if a wave passes to a <strong>less dense string</strong> then Z<sub>2</sub> &lt; Z<sub>1</sub> and there is <strong>no sign flip</strong>. This can happen if Z<sub>2</sub> = 0, for example if the second string is massless or tensionless — as in an open boundary condition.</p>
<p>This phase flipping has important consequences due to <strong>interference</strong> between the reflected pulse and other incoming pulses. There will be constructive interference if the phases are the same, but destructive interference if they are opposite. We will return to interference after discussing light.</p>`,
      interactive: "phase-flip-demo",
      interactiveCaption: "Top: pulse going from lower to higher impedance (phase flip on reflection). Bottom: pulse going from higher to lower impedance (no phase flip).",
      mathLinks: []
    },
    {
      heading: "Impedance for Masses",
      body: `<p>To get intuition for impedance, it is helpful to go back to a more familiar system: <strong>masses</strong>. Suppose we collide a block of mass <em>m</em> with a larger block of mass <em>M</em>. Say <em>m</em> has velocity v<sub>i</sub> and <em>M</em> is initially at rest.</p>
<details><summary><strong>Derivation using conservation laws</strong></summary>
<p>Initial momentum: p<sub>i</sub> = mv<sub>i</sub>. Initial energy: E<sub>i</sub> = &frac12;mv<sub>i</sub><sup>2</sup>.</p>
<p>After the collision, <em>m</em> bounces off with "reflected velocity" v<sub>r</sub> and <em>M</em> moves off with "transmitted velocity" v<sub>t</sub>.</p>
<p>Conservation of momentum: v<sub>t</sub> = (m/M)(v<sub>i</sub> + v<sub>r</sub>).</p>
<p>Substituting into conservation of energy: &frac12;mv<sub>i</sub><sup>2</sup> = &frac12;mv<sub>r</sub><sup>2</sup> + &frac12;M[(m/M)(v<sub>i</sub> + v<sub>r</sub>)]<sup>2</sup>.</p>
<p>After algebra:</p>
<p style="text-align:center;"><em>v<sub>r</sub> = (M &minus; m)/(M + m) v<sub>i</sub>, &nbsp;&nbsp; v<sub>t</sub> = 2m/(m + M) v<sub>i</sub></em></p>
</details>
<p>The result is:</p>
<p style="text-align:center;"><em>v<sub>r</sub> = (M &minus; m)/(M + m) v<sub>i</sub>, &nbsp;&nbsp; v<sub>t</sub> = 2m/(m + M) v<sub>i</sub></em></p>
<p>These equations have <strong>exactly the same form</strong> as the reflection and transmission coefficients, with Z<sub>1</sub> = m and Z<sub>2</sub> = M. Thus for masses, <strong>impedance is mass</strong>. This makes sense — the bigger the mass, the less velocity you can impart with a given force.</p>
<p>Let's take a concrete example of <strong>impedance matching</strong>. Suppose m = 1, M = 3, and the incoming velocity is v. Then M gets velocity v<sub>t</sub> = 2(1)/(1+3) v = v/2. Now put a mass m<sub>2</sub> = 2 in between them. When m hits m<sub>2</sub>, it gives it velocity v<sub>2</sub> = 2(1)/(1+2) v = 2v/3. Then m<sub>2</sub> hits M and gives it velocity v<sub>t</sub> = 2(2)/(2+3) &middot; 2v/3 = 8v/15 = 0.533v. Thus M goes faster! <strong>Inserting an intermediate mass helps impedance-match.</strong> Similarly, inserting lots of masses can make the impedance matching very efficient.</p>`,
      interactive: "mass-collision-impedance",
      interactiveCaption: "Elastic collisions between masses showing the analogy with wave reflection and transmission, and how an intermediate mass improves impedance matching",
      mathLinks: ["impedance-matching-math"]
    },
    {
      heading: "Complex Impedance",
      body: `<p>It is sometimes useful to generalize impedance to <strong>complex numbers</strong>. Suppose we have a driven oscillator satisfying m&ddot;x + kx = F<sub>0</sub>e<sup>i&omega;t</sup>.</p>
<p>First consider the case where k &asymp; 0. Then m&ddot;x = F<sub>0</sub>e<sup>i&omega;t</sup>. Integrating gives &dot;x = F<sub>0</sub>e<sup>i&omega;t</sup>/(i&omega;m). Thus:</p>
<p style="text-align:center;"><em>Z<sub>m</sub> = force/velocity = i&omega;m</em></p>
<p>In the other case, when m &asymp; 0, kx = F<sub>0</sub>e<sup>i&omega;t</sup> and &dot;x = i&omega;F<sub>0</sub>e<sup>i&omega;t</sup>/k. Thus:</p>
<p style="text-align:center;"><em>Z<sub>k</sub> = force/velocity = &minus;ik/&omega;</em></p>
<p>The impedance of the whole system is the sum:</p>
<p style="text-align:center;"><em>Z<sub>total</sub> = Z<sub>m</sub> + Z<sub>k</sub> = i(&omega;m &minus; k/&omega;)</em></p>
<p>At high frequencies, the mass term dominates — this is called <strong>mass-dominated impedance</strong>. Physically, when the driver is going very fast, the mass has no time to react. At low frequencies, the <em>k</em> term dominates — this is called <strong>stiffness-dominated impedance</strong>.</p>
<p>Note that Z<sub>total</sub> = 0 when &omega; = &radic;(k/m) — that is, at resonance. At the resonant frequency, <strong>nothing impedes the motion</strong>: a small force gives a huge velocity.</p>
<p>Adding a damping term &gamma;&dot;x contributes Z<sub>&gamma;</sub> = &gamma;. This makes perfect sense: <strong>damping impedes the transfer of energy</strong> from the driver to the oscillator. With all three terms:</p>
<p style="text-align:center;"><em>Z<sub>total</sub> = &gamma; + i(&omega;m &minus; k/&omega;)</em></p>
<p>Now the impedance is always nonzero, for any frequency.</p>`,
      interactive: "complex-impedance",
      interactiveCaption: "Complex impedance of a driven oscillator: mass-dominated at high frequencies, stiffness-dominated at low frequencies, and vanishing at resonance (without damping)",
      mathLinks: ["complex-impedance-math"]
    },
    {
      heading: "Circuits (optional)",
      body: `<p>An important use of complex impedances is in <strong>circuits</strong>. Recall that the equation of motion for an LRC circuit is just like a damped harmonic oscillator. The total voltage for a circuit with an inductor, resistor, and capacitor is:</p>
<p style="text-align:center;"><em>V<sub>tot</sub> = L&Ddot;Q + Q/C + &dot;Q R</em></p>
<p>This is the direct analog of F = m&ddot;x + kx + &gamma;&dot;x. Instead of driving with an external force, we drive with an external voltage V = V<sub>0</sub>e<sup>i&omega;t</sup>. The correspondence is:</p>
<table style="margin:0 auto; border-collapse:collapse; text-align:center;">
<tr><td style="padding:4px 12px;"><strong>Mass/spring</strong></td><td style="padding:4px 12px;"><strong>Circuit</strong></td></tr>
<tr><td>F</td><td>V</td></tr>
<tr><td>x</td><td>Q</td></tr>
<tr><td>&dot;x</td><td>I = &dot;Q</td></tr>
<tr><td>&gamma;</td><td>R</td></tr>
<tr><td>k</td><td>1/C</td></tr>
<tr><td>m</td><td>L</td></tr>
<tr><td>Z = F/&dot;x</td><td>Z = V/I</td></tr>
</table>
<p>Thus impedance for a circuit is Z = V/I. A resistor has Z<sub>R</sub> = R. A capacitor has Z<sub>C</sub> = 1/(i&omega;C). An inductor has Z<sub>L</sub> = i&omega;L. Impedance of an AC circuit plays the role that resistance does for a DC circuit. We can add impedances in series or in parallel just like we do for resistance.</p>
<p><strong>Impedance matching is critical in electrical engineering.</strong> Say one wishes to drive a WiFi antenna on your router. The maximum power we can couple into the antenna occurs when the impedances of the power supply and antenna are equal in magnitude. This is important in high-power applications where waves reflected from the antenna can come back and destroy amplifying equipment. All modern radios have impedance matching circuits because antennas are resonant devices, and tuning away from resonance causes impedance mismatch.</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: ["circuit-impedance-math"]
    },
    {
      heading: "Impedance for Other Stuff",
      body: `<p>For <strong>air</strong>, we recall v = &radic;(B/&rho;) with B = &gamma;p = &rho;v<sup>2</sup> the bulk modulus and v the speed of sound. Then:</p>
<p style="text-align:center;"><em>Z<sub>0</sub> = B/v = &rho;v</em></p>
<p>Z<sub>0</sub> = &rho;v is called the <strong>specific impedance</strong>. It is a property of the medium. For example:</p>
<ul>
<li>Air: &rho; = 1.2 kg/m<sup>3</sup>, v = 343 m/s &rArr; Z<sub>air</sub> = 420 Pa&middot;s/m</li>
<li>Water: &rho; = 1000 kg/m<sup>3</sup>, v = 1480 m/s &rArr; Z<sub>water</sub> = 1.48 &times; 10<sup>6</sup> Pa&middot;s/m</li>
</ul>
<p>Thus if you try to yell at someone under water, the amount reflected is R = (Z<sub>air</sub> &minus; Z<sub>water</sub>)/(Z<sub>air</sub> + Z<sub>water</sub>) = &minus;0.9994. So <strong>almost all of the sound is reflected</strong> (and there is a phase flip).</p>
<p>If the wavelength of the sound waves is smaller than the size of the cavity holding the waves (for example, in a pipe), then one must account for finite size in the impedance. For air in a finite-size cavity, the relevant quantity is the <strong>impedance per area</strong>:</p>
<p style="text-align:center;"><em>Z = &rho;v/A &nbsp;&nbsp;(when &lambda; &gt; &radic;A)</em></p>
<p>For air of the same density, the impedance is effectively 1/area. Thus the reflection coefficient going between pipes of different radii is:</p>
<p style="text-align:center;"><em>R = (A<sub>2</sub> &minus; A<sub>1</sub>)/(A<sub>1</sub> + A<sub>2</sub>)</em></p>
<p>An abrupt change in pipe diameter will have bad impedance matching. But a <strong>megaphone</strong> is designed to impedance-match much better — its gradually flaring shape provides a smooth transition from the small area near your mouth to the large area of open air. <strong>Now you know why megaphones are shaped this way!</strong></p>
<p><strong>Solids:</strong> For liquids or solids, impedance is also Z = &rho;v. Some representative values:</p>
<ul>
<li>Steel: &rho; = 7900 kg/m<sup>3</sup>, v = 6100 m/s, Z = 48 MPa&middot;s/m</li>
<li>Diamond: &rho; = 3500 kg/m<sup>3</sup>, v = 12000 m/s, Z = 42 MPa&middot;s/m</li>
<li>Rock: &rho; = 2600 kg/m<sup>3</sup>, v = 6000 m/s, Z = 16 MPa&middot;s/m</li>
<li>Rubber: &rho; = 1100 kg/m<sup>3</sup>, v = 100 m/s, Z = 0.11 MPa&middot;s/m</li>
<li>Dirt: &rho; = 1500 kg/m<sup>3</sup>, v = 100 m/s, Z = 0.15 MPa&middot;s/m</li>
</ul>
<p>Sound goes very fast in diamond because diamond is very hard and rigid — the atoms move back to equilibrium very quickly (high spring constant). Rubber and dirt are soft, so waves propagate slowly. Soft stuff generally has small &rho; and small v, so it has <strong>much lower impedance</strong>.</p>
<p>As an application, recall that when impedance goes down, T &gt; 1 and the amplitude increases. Consider an <strong>earthquake</strong> traveling from rock (Z<sub>1</sub> = 16 MPa&middot;s/m) into dirt or landfill (Z<sub>2</sub> = 0.15 MPa&middot;s/m). Then T = 2Z<sub>1</sub>/(Z<sub>1</sub> + Z<sub>2</sub>) &asymp; 1.98. So the amplitude of the shaking will <strong>nearly double</strong>! That's why you shouldn't build houses on landfill in an earthquake zone.</p>`,
      interactive: "impedance-materials",
      interactiveCaption: "Impedance values for various materials, and how a megaphone's shape provides gradual impedance matching from mouth to open air",
      mathLinks: ["specific-impedance-math"]
    },
    {
      heading: "Problems",
      body: `<p><strong>Problem 9.1:</strong> A string with linear mass density &mu;<sub>1</sub> = 0.01 kg/m and tension T<sub>1</sub> = 100 N is connected at x = 0 to a string with &mu;<sub>2</sub> = 0.04 kg/m and the same tension T<sub>2</sub> = T<sub>1</sub>. A pulse &psi;<sub>i</sub>(t &minus; x/v<sub>1</sub>) is incident from the left. Find the reflection and transmission coefficients. Is the reflected pulse inverted?</p>
<p><strong>Problem 9.2:</strong> Show that R + T = 1 (where R and T are the reflection and transmission coefficients for amplitude). Does this mean energy is conserved? Why or why not? (Hint: power depends on impedance as well as amplitude.)</p>
<p><strong>Problem 9.3:</strong> A right-moving pulse on a string hits a rigid wall (Z<sub>2</sub> = &infin;). Find R and T and describe what happens physically. Now consider a free end (Z<sub>2</sub> = 0). Find R and T and describe the physics.</p>
<p><strong>Problem 9.4:</strong> Consider two blocks of mass m<sub>1</sub> = 2 kg and m<sub>3</sub> = 8 kg. What mass m<sub>2</sub> should you place between them to maximize the velocity transferred to m<sub>3</sub>? Solve for the optimal m<sub>2</sub> and compare the result to what happens without the intermediate mass.</p>
<p><strong>Problem 9.5:</strong> Compute the fraction of sound energy reflected when you yell from air into water. Use Z<sub>air</sub> = 420 Pa&middot;s/m and Z<sub>water</sub> = 1.48 &times; 10<sup>6</sup> Pa&middot;s/m. Why is it so hard to communicate across the air-water interface?</p>
<p><strong>Problem 9.6:</strong> An earthquake wave travels from bedrock (Z = 16 MPa&middot;s/m) into soft soil (Z = 0.15 MPa&middot;s/m). Compute the amplitude transmission coefficient. If the earthquake has an amplitude of 1 cm in the bedrock, what is the amplitude in the soft soil?</p>
<p><strong>Problem 9.7:</strong> For the driven oscillator with complex impedance Z = &gamma; + i(&omega;m &minus; k/&omega;), find the frequency at which |Z| is minimized. Show that the velocity amplitude is maximized at this frequency.</p>
<p><strong>Problem 9.8:</strong> Two pipes of cross-sectional areas A<sub>1</sub> and A<sub>2</sub> are joined together. If A<sub>2</sub> = 4A<sub>1</sub>, what fraction of the sound power is transmitted? What fraction is reflected?</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: []
    }
  ],

  "10": [
    {
      heading: "Energy in a String",
      body: `<p>The kinetic energy of a mass <em>m</em> with velocity <em>v</em> is &frac12;mv<sup>2</sup>. Thus if we have an oscillating wave in a string, the kinetic energy of each individual bit of string is:</p>
<p style="text-align:center;"><em>KE = &frac12;(&mu;&Delta;x)(&part;A/&part;t)<sup>2</sup></em></p>
<p>and the <strong>kinetic energy per unit length</strong> is:</p>
<p style="text-align:center;"><em>KE/length = &frac12;&mu;(&part;A/&part;t)<sup>2</sup></em></p>
<p>The potential energy depends on how stretched the string is. Of course, a string under tension <em>T</em> already has some potential energy, even with no waves. We are interested in the <strong>additional potential energy</strong> due to the extra stretching from transverse waves.</p>
<details><summary><strong>Derivation of potential energy per unit length</strong></summary>
<p>If the string is in equilibrium (&part;A/&part;x = 0), then the potential energy is zero. The amount the string is stretched at point x is the difference between the hypotenuse and the base of the triangle formed by the displaced string:</p>
<p style="text-align:center;"><em>&Delta;L = &radic;((&Delta;x)<sup>2</sup> + (&Delta;A)<sup>2</sup>) &minus; &Delta;x = &Delta;x&radic;(1 + (&part;A/&part;x)<sup>2</sup>) &minus; &Delta;x</em></p>
<p>Since the string is close to equilibrium, &part;A/&part;x &Lt; 1, so we Taylor expand the square root:</p>
<p style="text-align:center;"><em>&Delta;L = &Delta;x[1 + &frac12;(&part;A/&part;x)<sup>2</sup> &minus; ...] &minus; &Delta;x = &frac12;&Delta;x(&part;A/&part;x)<sup>2</sup></em></p>
<p>Thus PE = force &times; distance = &frac12;T&Delta;x(&part;A/&part;x)<sup>2</sup>.</p>
</details>
<p>The <strong>potential energy per unit length</strong> is:</p>
<p style="text-align:center;"><em>PE/length = &frac12;T(&part;A/&part;x)<sup>2</sup></em></p>
<p>Note this is proportional to the <strong>first derivative squared, not the second derivative</strong>. Even if there were no net force on the test mass at position x (so that &part;<sup>2</sup>A/&part;x<sup>2</sup> = 0), there would still be potential energy stored in the stretched string. Even though the wave is transverse, the energy comes from stretching the string both longitudinally and transversely.</p>
<p>The <strong>total energy per unit length</strong> is:</p>
<p style="text-align:center;"><em>E<sub>tot</sub>/length = &frac12;&mu;(&part;A/&part;t)<sup>2</sup> + &frac12;T(&part;A/&part;x)<sup>2</sup></em></p>
<details><summary><strong>Simplification for a traveling wave</strong></summary>
<p>For a traveling wave A(x, t) = f(x &plusmn; vt), we have &part;A/&part;t = &plusmn;v &part;A/&part;x. Thus (&part;A/&part;x)<sup>2</sup> = (1/v<sup>2</sup>)(&part;A/&part;t)<sup>2</sup> = (&mu;/T)(&part;A/&part;t)<sup>2</sup>. The KE and PE contributions are equal, and:</p>
<p style="text-align:center;"><em>E<sub>tot</sub>/length = &mu;(&part;A/&part;t)<sup>2</sup></em></p>
</details>
<p>For a traveling wave, the total energy per unit length simplifies beautifully:</p>
<p style="text-align:center;"><em>E<sub>tot</sub>/length = &mu;(&part;A/&part;t)<sup>2</sup> = (Z/v)(&part;A/&part;t)<sup>2</sup></em></p>
<p>where Z = T/v = &radic;(T&mu;) = v&mu; is the impedance.</p>
<span class='inline-math-link' data-math='wave-energy-math'>Wave Energy Derivation &rarr;</span>`,
      interactive: "wave-energy-string",
      interactiveCaption: "Kinetic and potential energy density along a traveling wave on a string, showing that they are equal at every point",
      mathLinks: ["wave-energy-math"]
    },
    {
      heading: "Power",
      body: `<p>An extremely important quantity related to waves is <strong>power</strong>. We want to use waves to do things, such as transmit sound or light, or energy in a wire. Thus we want to know the rate at which work can be done using a wave. For example, if you have an incoming sound wave, how much power can be transmitted by the wave to a microphone?</p>
<p>For an incoming traveling wave, we want to know how much power is transmitted from one test mass to the next. Now, power = force &times; velocity. But we don't want the net force, only the <strong>force from the left</strong> to compute power transmitted. The force from the left is T &part;A/&part;x. For &part;A/&part;x &gt; 0, this pulls downward. To see the power transmitted, we need the force which moves the string away from equilibrium (the upward force): F = &minus;T &part;A/&part;x. Then:</p>
<p style="text-align:center;"><em>P = F &middot; v = &minus;T (&part;A/&part;x)(&part;A/&part;t)</em></p>
<p>For a traveling wave A(x, t) = f(x &plusmn; vt), using &part;A/&part;t = &plusmn;v &part;A/&part;x:</p>
<p style="text-align:center;"><strong>P = &mp; Z (&part;A/&part;t)<sup>2</sup></strong></p>
<p>The sign is + for a right-moving wave (power goes to the right) and &minus; for a left-moving wave.</p>
<p>Now recall that for a wave going from impedance Z<sub>1</sub> into Z<sub>2</sub>, the amplitudes are related by A<sub>T</sub> = (2Z<sub>1</sub>/(Z<sub>1</sub> + Z<sub>2</sub>))A<sub>I</sub> and A<sub>R</sub> = ((Z<sub>1</sub> &minus; Z<sub>2</sub>)/(Z<sub>1</sub> + Z<sub>2</sub>))A<sub>I</sub>.</p>
<details><summary><strong>Derivation of power reflection and transmission</strong></summary>
<p>The power in the incoming wave is P<sub>I</sub> = Z<sub>1</sub>(&part;A<sub>I</sub>/&part;t)<sup>2</sup>.</p>
<p>The reflected power is P<sub>R</sub> = Z<sub>1</sub>[(Z<sub>1</sub> &minus; Z<sub>2</sub>)/(Z<sub>1</sub> + Z<sub>2</sub>)]<sup>2</sup>(&part;A<sub>I</sub>/&part;t)<sup>2</sup> = [(Z<sub>1</sub> &minus; Z<sub>2</sub>)/(Z<sub>1</sub> + Z<sub>2</sub>)]<sup>2</sup> P<sub>I</sub>.</p>
<p>The transmitted power is P<sub>T</sub> = Z<sub>2</sub>[2Z<sub>1</sub>/(Z<sub>1</sub> + Z<sub>2</sub>)]<sup>2</sup>(&part;A<sub>I</sub>/&part;t)<sup>2</sup> = (Z<sub>2</sub>/Z<sub>1</sub>)[2Z<sub>1</sub>/(Z<sub>1</sub> + Z<sub>2</sub>)]<sup>2</sup> P<sub>I</sub> = 4Z<sub>1</sub>Z<sub>2</sub>/(Z<sub>1</sub> + Z<sub>2</sub>)<sup>2</sup> P<sub>I</sub>.</p>
</details>
<p>The fraction of power reflected and transmitted:</p>
<p style="text-align:center;"><em>P<sub>R</sub>/P<sub>I</sub> = [(Z<sub>1</sub> &minus; Z<sub>2</sub>)/(Z<sub>1</sub> + Z<sub>2</sub>)]<sup>2</sup></em></p>
<p style="text-align:center;"><em>P<sub>T</sub>/P<sub>I</sub> = 4Z<sub>1</sub>Z<sub>2</sub>/(Z<sub>1</sub> + Z<sub>2</sub>)<sup>2</sup></em></p>
<p>Note that <strong>(P<sub>T</sub> + P<sub>R</sub>)/P<sub>I</sub> = 1</strong>, so overall power is conserved. Even though the amplitude transmission coefficient can exceed 1, the <strong>power</strong> transmission never exceeds the incoming power.</p>`,
      interactive: "power-reflection-transmission",
      interactiveCaption: "Power reflection and transmission at a junction: adjusting impedance ratio shows conservation of total power",
      mathLinks: ["wave-power-math", "reflection-transmission-math"]
    },
    {
      heading: "Sound Intensity (Decibels)",
      body: `<p>Intensity is defined as <strong>power per unit area</strong>: I = P/A. Sound intensity is measured in <strong>decibels</strong>. A logarithmic scale is used because <strong>human hearing is logarithmic</strong>. For example, if something has an intensity 1000 times larger, you will perceive it as being only about 3 times as loud.</p>
<p>The decibel scale is normalized so that 0 dB corresponds to the threshold of human hearing:</p>
<p style="text-align:center;"><em>0 dB &equiv; 10<sup>&minus;12</sup> W/m<sup>2</sup> = I<sub>0</sub></em></p>
<p>The loudness in decibels is:</p>
<p style="text-align:center;"><strong>L = 10 log<sub>10</sub>(I/I<sub>0</sub>)</strong></p>
<p>Some reference intensities: threshold of hearing (0 dB), breathing at 3 meters (10 dB), rustling leaves (20 dB), music at 1 meter (70 dB), vacuum cleaner (80 dB), rock concert (120 dB), threshold of pain (130 dB), jet engine at 30 meters (150 dB).</p>
<p><strong>Example:</strong> Suppose you are 3 meters from a 50 Watt speaker. At 3 meters, the power is distributed across a sphere of area A = 4&pi;r<sup>2</sup>. If all the power went into sound: I = 50/(4&pi;(3)<sup>2</sup>) = 0.44 W/m<sup>2</sup>, giving L = 10 log<sub>10</sub>(0.44/10<sup>&minus;12</sup>) = 116 dB — rock concert levels!</p>
<p>But this is not actually how loud a speaker is. In reality, <strong>speakers are extremely inefficient</strong>. The efficiency is around 10<sup>&minus;5</sup> for a typical speaker. So L = 10 log<sub>10</sub>(10<sup>&minus;5</sup> &middot; 0.44/10<sup>&minus;12</sup>) = 66 dB. The efficiency is so low because the <strong>speaker and the air have very different impedances</strong>.</p>
<p>A violin takes about 150 mW of bowing power and produces about 6 mW of sound: an efficiency of &epsilon; = 4%. This is much greater than a speaker, but still most of the energy used in bowing goes to mechanical heating rather than sound.</p>
<details><summary><strong>How loudness changes with distance</strong></summary>
<p>Since I = P/(4&pi;r<sup>2</sup>), we have L = 10 log<sub>10</sub>(P/(4&pi;I<sub>0</sub>)) &minus; 20 log<sub>10</sub>(r). Thus loudness only drops logarithmically with distance.</p>
<p>If you measure loudness L<sub>0</sub> at distance r<sub>0</sub>, then at distance 2r<sub>0</sub>:</p>
<p style="text-align:center;"><em>L = L<sub>0</sub> &minus; 20 log<sub>10</sub>(2) = L<sub>0</sub> &minus; 6.02 dB</em></p>
<p>Doubling the distance costs 6 dB. To drop by 10 dB, you need to go 3.16 times farther away.</p>
</details>`,
      interactive: "decibel-scale",
      interactiveCaption: "The decibel scale showing common sounds, and how loudness drops with distance from a source",
      mathLinks: ["decibel-math"]
    },
    {
      heading: "Plane Waves",
      body: `<p>Waves propagate in 3 dimensions, so we need the <strong>3-dimensional wave equation</strong>:</p>
<p style="text-align:center;"><em>(&part;<sup>2</sup>/&part;t<sup>2</sup> &minus; v<sup>2</sup>(&part;<sup>2</sup>/&part;x<sup>2</sup> + &part;<sup>2</sup>/&part;y<sup>2</sup> + &part;<sup>2</sup>/&part;z<sup>2</sup>)) A(x, y, z, t) = 0</em></p>
<p>This is the obvious generalization of the 1D wave equation. It is invariant under rotations of x, y, and z (in fact, under a larger group — Lorentz transformations — which mix space and time).</p>
<p>Important solutions are <strong>plane waves</strong>:</p>
<p style="text-align:center;"><em>A(x, y, z, t) = A<sub>0</sub> cos(k&#x20D7; &middot; x&#x20D7; &minus; &omega;t + &phi;)</em></p>
<p>for some amplitude A<sub>0</sub>, frequency &omega;, and fixed <strong>wavevector</strong> k&#x20D7;. For a plane wave to satisfy the wave equation, its frequency and wavevector must be related by &omega; = v|k&#x20D7;|. The direction k&#x20D7; points is the direction the plane wave is traveling.</p>
<p><strong>Plane waves form a basis of all possible solutions to the wave equation.</strong> They are the normal modes of the 3D wave equation. For each frequency &omega;, there are plane waves in any direction with |k&#x20D7;| = &omega;/v and any possible phase.</p>
<p>Another important feature: if you are <strong>far enough away from sources</strong>, everything reduces to a plane wave. Even from messy sources in a cavity, at large enough distances the solution looks like a plane wave.</p>
<p>How much power is in a plane wave? At position y and time t, the power oscillates:</p>
<p style="text-align:center;"><em>P(t, y) = Z A<sub>0</sub><sup>2</sup>&omega;<sup>2</sup> sin<sup>2</sup>(ky &minus; &omega;t + &phi;)</em></p>
<p>A more useful quantity is the <strong>average power</strong>, obtained by averaging over one wavelength:</p>
<p style="text-align:center;"><strong>&langle;P&rangle; = &frac12; Z &omega;<sup>2</sup> A<sub>0</sub><sup>2</sup></strong></p>
<p>where Z = &rho;v is the impedance for air. For a plane wave, the average power is time-independent.</p>`,
      interactive: "plane-wave-3d",
      interactiveCaption: "A 3D plane wave propagating in the direction of the wavevector, showing constant-phase surfaces",
      mathLinks: ["plane-wave-math"]
    },
    {
      heading: "Interference",
      body: `<p>Now we are ready to discuss one of the most important concepts in waves (and perhaps all of physics): <strong>constructive and destructive interference</strong>.</p>
<p>Suppose we have a speaker emitting sound at frequency &omega;. At large enough distances, it appears as a plane wave A<sub>1</sub> = A<sub>0</sub>cos(&omega;t &minus; ky + &phi;<sub>1</sub>). Now say we have another speaker directly behind the first, producing the same sound at the same volume: A<sub>2</sub> = A<sub>0</sub>cos(&omega;t &minus; ky + &phi;<sub>2</sub>). The total wave is:</p>
<p style="text-align:center;"><em>A<sub>tot</sub> = 2A<sub>0</sub> cos(&omega;t &minus; ky + (&phi;<sub>1</sub>+&phi;<sub>2</sub>)/2) cos(&Delta;&phi;/2)</em></p>
<p>where &Delta;&phi; = &phi;<sub>1</sub> &minus; &phi;<sub>2</sub> is the phase difference. The average power is:</p>
<p style="text-align:center;"><em>&langle;P<sub>2</sub>&rangle; = 4&langle;P<sub>1</sub>&rangle; cos<sup>2</sup>(&Delta;&phi;/2)</em></p>
<p>In a generic situation with uncorrelated speakers, the phases have nothing to do with each other. Averaging cos<sup>2</sup>(&Delta;&phi;/2) &rarr; &frac12; gives &langle;P<sub>2</sub>&rangle; = 2&langle;P<sub>1</sub>&rangle;. Two speakers produce twice the power of one — perfectly sensible.</p>
<p>But if the two speakers are <strong>exactly out of phase</strong> (&Delta;&phi; = &pi;), then &langle;P<sub>2</sub>&rangle; = 0. This is <strong>destructive interference</strong>. Conversely, if &Delta;&phi; = 0, then &langle;P<sub>2</sub>&rangle; = 4&langle;P<sub>1</sub>&rangle;. This is <strong>constructive interference</strong>. Two coherent speakers can produce <strong>four times</strong> the power of a single speaker!</p>
<p>Where is the extra power coming from? One speaker is pushing down on the other, forcing it to work harder. This is called <strong>source loading</strong>. In principle, more power is being used by the speakers. However, since speakers are very inefficient (only 0.01% of the power goes to sound), the source loading actually makes the speaker more efficient — more sound comes out with the same electrical power.</p>
<p><strong>Speaker near a wall — proximity resonance:</strong> A wall has infinite impedance (Z<sub>2</sub> = &infin;), so sound reflects completely with R = &minus;1. By the <strong>method of images</strong>, the reflection acts like a second source at distance <em>d</em> on the other side of the wall. The phase difference is &Delta;&phi; = 2kd = 4&pi;d/&lambda;.</p>
<p>For d &Lt; &lambda; (speaker close to the wall), &Delta;&phi; &asymp; 0 and we get complete constructive interference. By putting a speaker near a wall, we get four times the power. This is called a <strong>proximity resonance</strong> or <strong>self-amplification</strong>.</p>
<p>You might have expected twice the power (since the sound goes into half the space). Indeed, if the source and image were incoherent, there would be twice the power. But we get another factor of 2 from source loading — so in fact the power goes up by 4.</p>
<p>It is natural to try to add more proximity resonances. With four walls (a corner), the enhancement is a factor of <strong>16</strong>. For a 30-degree wedge, source loading gives a factor of <strong>144</strong> enhancement. For a 30-degree wedge in 3D, the enhancement is around a factor of <strong>200</strong>. Try standing near a corner and you can hear this yourself.</p>
<p>The amount of enhancement depends on the frequencies involved. When d &sim; &lambda;, there is as much destructive interference as constructive interference, so there is no source loading or proximity resonance for high frequencies.</p>`,
      interactive: "interference-demo",
      interactiveCaption: "Constructive and destructive interference from two speakers, and the proximity resonance effect of placing a speaker near a wall",
      mathLinks: ["interference-math", "method-of-images-math"]
    },
    {
      heading: "Problems",
      body: `<p><strong>Problem 10.1:</strong> Show that for a traveling wave on a string, the kinetic and potential energy densities are equal at every point. Why is this not generally true for a standing wave?</p>
<p><strong>Problem 10.2:</strong> A wave with amplitude 3 mm travels along a string with &mu; = 0.01 kg/m and T = 100 N at frequency f = 200 Hz. Compute the average power carried by the wave.</p>
<p><strong>Problem 10.3:</strong> A 100 W light bulb radiates equally in all directions. What is the intensity at 2 meters? What is the intensity in decibels above the reference intensity I<sub>0</sub> = 10<sup>&minus;12</sup> W/m<sup>2</sup>?</p>
<p><strong>Problem 10.4:</strong> Two identical speakers face the same direction, separated by a distance d. For what values of d (in terms of &lambda;) is there constructive interference directly ahead? For what values is there destructive interference?</p>
<p><strong>Problem 10.5:</strong> A speaker is placed a distance d = 0.5 m from a wall. For what frequencies (take v = 343 m/s) does it get maximum enhancement from the proximity resonance? For what frequencies does it get maximum cancellation?</p>
<p><strong>Problem 10.6:</strong> Show that P<sub>R</sub>/P<sub>I</sub> + P<sub>T</sub>/P<sub>I</sub> = 1 algebraically, confirming power conservation at a junction. Why doesn't the fact that T &gt; 1 (for Z<sub>1</sub> &gt; Z<sub>2</sub>) violate energy conservation?</p>
<p><strong>Problem 10.7:</strong> A violin string vibrates with a fundamental frequency of 440 Hz and amplitude 0.5 mm. The string has &mu; = 0.001 kg/m and is 0.33 m long. Estimate the power in the fundamental mode. Compare this to the 6 mW total sound power output of a violin and comment.</p>
<p><strong>Problem 10.8:</strong> Consider a corner reflector (two walls meeting at 90 degrees). Using the method of images, show that a source in the corner has 4 image sources. Assuming d &Lt; &lambda;, what is the power enhancement factor? Explain why this factor is 16 rather than 4.</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: []
    }
  ],

  "11": [
    {
      heading: "Wave Packets",
      body: `<p>The function</p>
<p style="text-align:center;"><em>g(x) = e<sup>&minus;(x/&sigma;<sub>x</sub>)<sup>2</sup>/2</sup></em></p>
<p>is called a <strong>Gaussian</strong>. When x = &plusmn;&sigma;<sub>x</sub>, the Gaussian has decreased to about 0.6 of its peak value (1/&radic;e &asymp; 0.6). Alternatively, the Gaussian is at half its maximal value at x = &plusmn;1.1&sigma;<sub>x</sub>. Either way, <strong>&sigma;<sub>x</sub> indicates the width</strong> of the Gaussian.</p>
<p>(You may recall that the power of a driven oscillator is given by a Lorentzian function l(x) = &gamma;/(x<sup>2</sup> + &gamma;<sup>2</sup>), which has a roughly similar shape and decays to half its value at x = &plusmn;&gamma;. Try not to get the functions confused.)</p>
<p>The <strong>Fourier transform of the Gaussian</strong> is:</p>
<p style="text-align:center;"><em>g&#x0303;(k) = (&sigma;<sub>x</sub>/&radic;(2&pi;)) e<sup>&minus;&sigma;<sub>x</sub><sup>2</sup>k<sup>2</sup>/2</sup> = (1/&radic;(2&pi;)&sigma;<sub>k</sub>) e<sup>&minus;(k/&sigma;<sub>k</sub>)<sup>2</sup>/2</sup></em></p>
<p>where <strong>&sigma;<sub>k</sub> = 1/&sigma;<sub>x</sub></strong>. This is also a Gaussian, but with width &sigma;<sub>k</sub> = 1/&sigma;<sub>x</sub>. Thus, the <strong>narrower</strong> the Gaussian is in position space (&sigma;<sub>x</sub> &rarr; 0), the <strong>broader</strong> its Fourier transform is (&sigma;<sub>k</sub> &rarr; &infin;), and vice versa.</p>
<p>When &sigma; = &infin;, the Gaussian is infinitely wide: it takes the same value at all x. Then g&#x0303;(k) becomes a &delta;-function at k = 0. That is, to construct a constant, one only needs the infinite wavelength mode (recall &lambda; = 2&pi;/k). To construct something narrower, one needs more and more wavenumbers. To construct a very sharp Gaussian (&sigma;<sub>x</sub> &rarr; 0), the Fourier transform flattens out: one needs an <strong>infinite number of wavenumbers</strong> to get infinitely sharp features.</p>
<p>If we shift the Gaussian and multiply by a carrier wave, we get the general <strong>wavepacket</strong>:</p>
<p style="text-align:center;"><em>f(x) = e<sup>&minus;(x&minus;x<sub>0</sub>)<sup>2</sup>/(2&sigma;<sub>x</sub><sup>2</sup>)</sup> e<sup>ik<sub>c</sub>x</sup></em></p>
<p>with Fourier transform:</p>
<p style="text-align:center;"><em>f&#x0303;(k) = (&sigma;<sub>x</sub>/&radic;(2&pi;)) e<sup>&minus;&sigma;<sub>x</sub><sup>2</sup>(k&minus;k<sub>c</sub>)<sup>2</sup>/2</sup> e<sup>&minus;ix<sub>0</sub>(k&minus;k<sub>c</sub>)</sup></em></p>
<p>The Gaussian is called a <strong>wavepacket</strong> because of its Fourier transform: it is a packet of waves with frequencies/wavenumbers clustered around a single value k<sub>c</sub> (the subscript "c" is for "carrier").</p>
<span class='inline-math-link' data-math='gaussian-fourier-math'>Gaussian Fourier Transform &rarr;</span>`,
      interactive: "gaussian-wavepacket",
      interactiveCaption: "A Gaussian wavepacket in position space and its Fourier transform, showing the reciprocal relationship between widths",
      mathLinks: ["gaussian-fourier-math"]
    },
    {
      heading: "Amplitude Modulation",
      body: `<p>One of the most important applications of wavepackets is in <strong>communication</strong>. How do we encode information in waves?</p>
<p>The simplest way is to play a single note — a pure sine wave sin(2&pi;&nu;<sub>c</sub>t). But if this is all that ever happens, <strong>no information is actually being transferred</strong>. To transmit a signal, we can start and stop the note periodically. For example, modulate the note by turning it on and off once a second:</p>
<p style="text-align:center;"><em>A(t) = f(t) sin(2&pi;&nu;<sub>c</sub>t)</em></p>
<p>where f(t) has a frequency of &nu;<sub>m</sub> &sim; 1 Hz. Since &nu;<sub>m</sub> &Lt; &nu;<sub>c</sub>, the curves look like what we had for beats — really the sum of Fourier modes with &nu; = &nu;<sub>c</sub> &plusmn; &nu;<sub>m</sub>.</p>
<p>By combining a few more frequencies close to the carrier, we can encode more interesting information. Rather than combining particular frequencies, it's somewhat easier to think about writing A(t) = F(t) sin(2&pi;&nu;<sub>m</sub>t) sin(2&pi;&nu;<sub>c</sub>t) where F(t) is a slowly varying function that changes its value after each node of the modulated signal. This is an <strong>amplitude-modulated signal</strong>.</p>
<p>We can separate pulses cleanly if we construct them with <strong>wavepackets</strong>, as long as the width of the packets is smaller than the distance between them. For example, we can add Gaussians with different widths and amplitudes:</p>
<p style="text-align:center;"><em>S(t) = 2f(t) + 3f(t&minus;100s) + f(t&minus;150s) + 5f(t&minus;200s)</em></p>
<p>The high-frequency carrier changes each packet from f(t) to:</p>
<p style="text-align:center;"><em>f<sub>c</sub>(t) = e<sup>&minus;(t/&sigma;<sub>t</sub>)<sup>2</sup>/2</sup> cos(2&pi;&nu;<sub>c</sub>t) = Re[e<sup>&minus;(t/&sigma;<sub>t</sub>)<sup>2</sup>/2</sup> e<sup>2&pi;i&nu;<sub>c</sub>t</sup>]</em></p>
<p>As long as the carrier frequency is larger than the width of the wavepacket, &nu;<sub>c</sub> &gtrsim; 1/&sigma;<sub>t</sub>, the wiggles in the carrier will be imperceptible and the packet will be faithfully reconstructed.</p>
<p>This is how <strong>AM (Amplitude Modulated) radio</strong> works. The information is conveyed at the information rate &nu;<sub>m</sub> &sim; Hz on a carrier frequency &nu;<sub>c</sub> typically in the 100 MHz range. For cell phones and wireless, GHz frequencies are used as carrier frequencies.</p>
<p>In terms of time and frequency, the key relationship is:</p>
<p style="text-align:center;"><em>f(t) = e<sup>&minus;(t&minus;t<sub>0</sub>)<sup>2</sup>/(2&sigma;<sub>t</sub><sup>2</sup>)</sup> e<sup>i&omega;<sub>c</sub>t</sup> &nbsp;&hArr;&nbsp; f&#x0303;(&omega;) = (&sigma;<sub>t</sub>/&radic;(2&pi;)) e<sup>&minus;&sigma;<sub>t</sub><sup>2</sup>(&omega;&minus;&omega;<sub>c</sub>)<sup>2</sup>/2</sup> e<sup>&minus;it<sub>0</sub>(&omega;&minus;&omega;<sub>c</sub>)</sup></em></p>
<p>To construct a signal f(t) with width &sigma;<sub>t</sub>, we need frequencies within a range <strong>&sigma;<sub>&omega;</sub> = 1/&sigma;<sub>t</sub></strong> centered around any &omega;<sub>c</sub>. The central (carrier) frequency can be anything. The key is that enough frequencies around &omega;<sub>c</sub> be included. More precisely, we need a <strong>band of width &sigma;<sub>&omega;</sub> = 1/&sigma;<sub>t</sub></strong> to construct pulses of width &sigma;<sub>t</sub>. The pulses should be separated by, at minimum, &sigma;<sub>t</sub>. Thus the feature which limits how much information can be transmitted is the <strong>bandwidth</strong>. To send more information (smaller distance between pulses), a larger bandwidth is needed.</p>`,
      interactive: "amplitude-modulation",
      interactiveCaption: "Amplitude modulation: a slowly varying envelope shapes a high-frequency carrier to encode information. Wider bandwidth allows narrower (faster) pulses.",
      mathLinks: ["am-radio-math", "bandwidth-math"]
    },
    {
      heading: "Dispersion Relations",
      body: `<p>An extremely important concept in the study of waves is <strong>dispersion</strong>. Recall the <strong>dispersion relation</strong> is defined as the relationship between the frequency and the wavenumber: &omega;(k). For non-dispersive systems, like most of what we've covered so far, &omega;(k) = vk is a linear relation. An example of a dispersive system is a set of <strong>pendula coupled by springs</strong>, where the wave equation is modified to:</p>
<p style="text-align:center;"><em>&part;<sup>2</sup>A/&part;t<sup>2</sup> &minus; (E/&mu;)&part;<sup>2</sup>A/&part;x<sup>2</sup> + (g/L)A = 0</em></p>
<p>The dispersion relation is derived by plugging in A = A<sub>0</sub>e<sup>i(kx+&omega;t)</sup>, leading to &omega; = &radic;((E/&mu;)k<sup>2</sup> + g/L).</p>
<p>Here is a summary of some physical systems and their dispersion relations:</p>
<ul>
<li><strong>Deep water waves:</strong> &omega; = &radic;(gk). Longer wavelengths move faster. Phase velocity v<sub>p</sub> = &radic;(g&lambda;/(2&pi;)), group velocity v<sub>g</sub> = &frac12;v<sub>p</sub>. Applies when &lambda; &Gt; d (depth of water).</li>
<li><strong>Shallow water waves:</strong> &omega; = &radic;(gd) &middot; k. Dispersionless, with v<sub>p</sub> = v<sub>g</sub> = &radic;(gd).</li>
<li><strong>Surface waves (capillary waves):</strong> &omega;<sup>2</sup> = k<sup>3</sup>&sigma;/&rho;. Shorter wavelengths move faster. v<sub>g</sub> = (3/2)v<sub>p</sub>.</li>
<li><strong>Light in a plasma:</strong> &omega; = &radic;(&omega;<sub>p</sub><sup>2</sup> + c<sup>2</sup>k<sup>2</sup>). Same form as pendula/spring system.</li>
<li><strong>Light in glass:</strong> &omega; = (c/n)k. The index of refraction <em>n</em> can depend weakly on wavenumber. In most glass, n<sup>2</sup> = 1 + a/(k<sub>0</sub><sup>2</sup> &minus; k<sup>2</sup>).</li>
</ul>`,
      interactive: "dispersion-relations",
      interactiveCaption: "Various dispersion relations plotted: linear (non-dispersive), deep water, shallow water, capillary waves, and plasma",
      mathLinks: ["dispersion-relation-math"]
    },
    {
      heading: "Time Evolution of Modes: Phase Velocity",
      body: `<p>Now we will understand the importance of dispersion relations (and their name) by studying the <strong>time-evolution of propagating wavepackets</strong>.</p>
<p>How do we solve the wave equation in a dispersive system with initial condition A(x, 0) = f(x)? For a non-dispersive wave with &omega;(k) = vk, the solution is simply A(x, t) = f(x &plusmn; vt). But for a dispersive system, like the pendula/spring equation, a fixed-k solution works only if one k is present.</p>
<p>For a dispersion relation &omega;(k), the amplitude A<sub>0</sub> exp[ik(x &minus; &omega;(k)t/k)] is always a solution. We call the speed of this particular solution the <strong>phase velocity</strong>:</p>
<p style="text-align:center;"><strong>v<sub>p</sub>(k) = &omega;(k)/k</strong></p>
<p>So what happens when A(x, 0) is not a pure plane wave? The easiest way to solve is through <strong>Fourier analysis</strong>. We write:</p>
<p style="text-align:center;"><em>A(x, 0) = f(x) = &int; dk e<sup>ikx</sup> f&#x0303;(k)</em></p>
<p>This writes the initial condition as a sum of plane wave modes. Since each mode evolves by replacing x &rarr; x &minus; v<sub>p</sub>(k)t, we have the <strong>exact solution</strong>:</p>
<p style="text-align:center;"><strong>A(x, t) = &int; dk e<sup>i(kx &minus; &omega;(k)t)</sup> f&#x0303;(k)</strong></p>
<details><summary><strong>Verification for the pendula/spring wave equation</strong></summary>
<p>Plugging in with &omega;(k) = &radic;((E/&mu;)k<sup>2</sup> + g/L):</p>
<p style="text-align:center;"><em>(&part;<sup>2</sup>/&part;t<sup>2</sup> &minus; (E/&mu;)&part;<sup>2</sup>/&part;x<sup>2</sup> + g/L) A(x,t) = &int; dk [&minus;&omega;<sup>2</sup> + (E/&mu;)k<sup>2</sup> + g/L] e<sup>i(kx&minus;&omega;t)</sup> f&#x0303;(k) = 0</em></p>
<p>since &omega;<sup>2</sup> = (E/&mu;)k<sup>2</sup> + g/L by the dispersion relation. The boundary condition A(x,0) = f(x) is also satisfied.</p>
<p>For a non-dispersive medium &omega;(k) = vk, we recover: A(x,t) = &int; e<sup>ik(x&minus;vt)</sup> f&#x0303;(k) dk = f(x &minus; vt), as expected.</p>
</details>`,
      interactive: "phase-velocity-demo",
      interactiveCaption: "Phase velocity: each Fourier mode travels at its own speed v_p(k) = &omega;(k)/k in a dispersive medium",
      mathLinks: ["phase-velocity-math"]
    },
    {
      heading: "Time Evolution of Signals: Group Velocity",
      body: `<p>Now take &omega;(k) to be arbitrary and take the initial signal shape to be our Gaussian wavepacket with carrier wavenumber k<sub>c</sub>:</p>
<p style="text-align:center;"><em>f(x) = e<sup>&minus;(x&minus;x<sub>0</sub>)<sup>2</sup>/(2&sigma;<sub>x</sub><sup>2</sup>)</sup> e<sup>ik<sub>c</sub>x</sup></em></p>
<p>The Fourier transform f&#x0303;(k) is exponentially suppressed away from k = k<sub>c</sub>, so we can Taylor expand the dispersion relation:</p>
<p style="text-align:center;"><em>&omega;(k) = &omega;(k<sub>c</sub>) + (k &minus; k<sub>c</sub>)&omega;&prime;(k<sub>c</sub>) + &hellip; = k<sub>c</sub>v<sub>p</sub> + (k &minus; k<sub>c</sub>)v<sub>g</sub> + &hellip;</em></p>
<p>where v<sub>p</sub> = v<sub>p</sub>(k<sub>c</sub>) is the phase velocity at k<sub>c</sub> and v<sub>g</sub> is the <strong>group velocity</strong>:</p>
<p style="text-align:center;"><strong>v<sub>g</sub>(k) = d&omega;(k)/dk</strong></p>
<details><summary><strong>Derivation: the wavepacket moves at v<sub>g</sub></strong></summary>
<p>Truncating the Taylor expansion to first order:</p>
<p style="text-align:center;"><em>A(x,t) = &int; dk e<sup>i(kx &minus; k<sub>c</sub>v<sub>p</sub>t &minus; (k&minus;k<sub>c</sub>)v<sub>g</sub>t)</sup> f&#x0303;(k)</em></p>
<p style="text-align:center;"><em>= e<sup>&minus;ik<sub>c</sub>t(v<sub>g</sub>&minus;v<sub>p</sub>)</sup> &int; dk e<sup>ik(x&minus;v<sub>g</sub>t)</sup> f&#x0303;(k)</em></p>
<p style="text-align:center;"><em>= e<sup>&minus;ik<sub>c</sub>t(v<sub>g</sub>&minus;v<sub>p</sub>)</sup> f(x &minus; v<sub>g</sub>t)</em></p>
<p>Thus the wavepacket moves at velocity v<sub>g</sub>. For a non-dispersive wave v<sub>p</sub> = v<sub>g</sub> and we recover the original solution. Note that in deriving this, we didn't need the exact form of the wavepacket — just that it is exponentially localized around k<sub>c</sub>.</p>
</details>
<p>Stating the results in terms of time dependence and frequency:</p>
<ul>
<li>A pulse can be constructed with a group of wavenumbers in a band k<sub>c</sub> &minus; &sigma;<sub>k</sub> &lt; k &lt; k<sub>c</sub> + &sigma;<sub>k</sub>, or equivalently with frequencies in a band &nu;<sub>c</sub> &minus; &sigma;<sub>&nu;</sub> &lt; &nu; &lt; &nu;<sub>c</sub> + &sigma;<sub>&nu;</sub>.</li>
<li>To send a pulse lasting &sigma;<sub>t</sub> seconds using carrier frequency &nu;<sub>c</sub>, one needs frequencies within &sigma;<sub>&nu;</sub> = 1/&sigma;<sub>t</sub> of &nu;<sub>c</sub>.</li>
<li>The <strong>pulse travels with the group velocity</strong> v<sub>g</sub> = d&omega;/dk evaluated at the carrier wavenumber.</li>
</ul>
<p>Note that because &sigma;<sub>k</sub> &Lt; k<sub>c</sub>, the group velocity is roughly constant for all relevant wavenumbers, but may be very different from the phase velocity. For example, if &omega;(k) = 5k<sup>4</sup>, then at k<sub>c</sub> = 100, v<sub>p</sub> = 5 &times; 10<sup>8</sup> while v<sub>g</sub> = 20k<sup>3</sup> = 2 &times; 10<sup>7</sup>.</p>
<span class='inline-math-link' data-math='group-velocity-math'>Group Velocity Derivation &rarr;</span>`,
      interactive: "group-velocity-demo",
      interactiveCaption: "A wavepacket propagating in a dispersive medium: the envelope moves at v_g while the carrier crests move at v_p",
      mathLinks: ["group-velocity-math", "phase-velocity-math"]
    },
    {
      heading: "Dispersion",
      body: `<p>Now we come to where dispersion relations got their name. We just saw that to first approximation, a wavepacket moves with velocity v<sub>g</sub>. But in the first-order approximation, the dispersion relation might as well be linear (non-dispersive). So let's add the <strong>second term</strong> to see the dispersion:</p>
<p style="text-align:center;"><em>&omega;(k) = k<sub>c</sub>v<sub>p</sub> + (k &minus; k<sub>c</sub>)v<sub>g</sub> + &frac12;(k &minus; k<sub>c</sub>)<sup>2</sup>&Gamma; + &hellip;</em></p>
<p>where <strong>&Gamma; = &omega;&Prime;(k<sub>c</sub>)</strong> is a new parameter. For a non-dispersive wave, &Gamma; = 0.</p>
<details><summary><strong>Exact solution with quadratic dispersion</strong></summary>
<p>Starting with our Gaussian wavepacket A(x, 0) = e<sup>&minus;(x&minus;x<sub>0</sub>)<sup>2</sup>/(2&sigma;<sup>2</sup>)</sup> e<sup>ik<sub>c</sub>x</sup>, the time-evolved solution is:</p>
<p style="text-align:center;"><em>A(x,t) = (&sigma;/&radic;(2&pi;)) &int; e<sup>i(kx &minus; [k<sub>c</sub>v<sub>p</sub> + (k&minus;k<sub>c</sub>)v<sub>g</sub> + &frac12;(k&minus;k<sub>c</sub>)<sup>2</sup>&Gamma;]t)</sup> e<sup>&minus;&sigma;<sub>x</sub><sup>2</sup>(k&minus;k<sub>c</sub>)<sup>2</sup>/2</sup> e<sup>ix<sub>0</sub>(k&minus;k<sub>c</sub>)</sup> dk</em></p>
<p>The exponent is still quadratic in k — still a Gaussian — so the integral can be done exactly. The result is:</p>
<p style="text-align:center;"><em>A(x,t) = exp[&minus;(x &minus; (x<sub>0</sub> + v<sub>g</sub>t))<sup>2</sup> / (2&sigma;(t)<sup>2</sup>)] &middot; e<sup>i&phi;(x,t)</sup></em></p>
<p>where the time-dependent width is:</p>
<p style="text-align:center;"><em>&sigma;(t) = &sigma;<sub>x</sub>&radic;(1 + &Gamma;<sup>2</sup>t<sup>2</sup>/&sigma;<sub>x</sub><sup>4</sup>)</em></p>
</details>
<p>The key result is the <strong>time-dependent width</strong>:</p>
<p style="text-align:center;"><strong>&sigma;(t) = &sigma;<sub>x</sub>&radic;(1 + &Gamma;<sup>2</sup>t<sup>2</sup>/&sigma;<sub>x</sub><sup>4</sup>)</strong></p>
<p>The width is <strong>increasing with time</strong>. The wavepacket is <strong>broadening</strong>. This is why we call it a dispersion relation — in dispersive media, <strong>wavepackets disperse</strong>. For a non-dispersive wave, &Gamma; = 0, and wavepackets maintain their shape.</p>
<p>Here's a comparison: take a non-dispersive pulse with v = 1 and a dispersive one with &omega;(k) = &radic;(k<sup>2</sup> + 50<sup>2</sup>), both starting with &sigma;<sub>x</sub> = 0.5 and k<sub>c</sub> = 30. The dispersive pulse has v<sub>p</sub> = 1.94 and v<sub>g</sub> = 0.51. After 5 seconds, the dispersive packet has gone half as far as the non-dispersive one, consistent with its slower group velocity. At longer times, the dispersive pulse flattens out dramatically while the non-dispersive pulse retains its shape.</p>
<p><strong>Dispersion in optical media is critical to modern optics and telecommunications.</strong> High-speed internet and long-distance telephone communication use fiber optic cables. Information is transmitted via optical wavepackets in glass. Due to dispersion, pulses too close together begin to overlap, destroying the information. This sets a <strong>fundamental limit to internet communication speed</strong>. Luckily, silica-based glass has very low dispersion (and absorption) in the near IR region (1.3–1.5 microns). This frequency band, now known as the <strong>telecomm band</strong>, has seen extensive technological development due to its use for fiber optic communication.</p>
<p>In <strong>quantum mechanics</strong>, an electron is often treated as a wavepacket. The non-relativistic dispersion relation is &omega;(k) = &hbar;k<sup>2</sup>/(2m). So v<sub>g</sub> = 2v<sub>p</sub> = &hbar;k/m = p/m with p = &hbar;k the momentum and &Gamma; = &hbar;/m. The width becomes &sigma;(t) = &sigma;<sub>x</sub>&radic;(1 + (&lambda;<sub>c</sub>ct/(2&pi;&sigma;<sub>x</sub><sup>2</sup>))<sup>2</sup>) with &lambda;<sub>c</sub> = h/(mc) = 2.42 &times; 10<sup>&minus;12</sup> m the Compton wavelength. The center moves with velocity p/m, as expected. The width grows very rapidly: at the speed of light for an electron localized to within its Compton wavelength. <strong>The more you try to pin down an electron, the faster the wavepacket grows!</strong></p>`,
      interactive: "wavepacket-dispersion",
      interactiveCaption: "Comparison of a non-dispersive pulse (maintains shape) with a dispersive pulse (broadens over time while traveling at the group velocity)",
      mathLinks: ["dispersion-math", "fiber-optics-math"]
    },
    {
      heading: "Problems",
      body: `<p><strong>Problem 11.1:</strong> Show that the Fourier transform of a Gaussian e<sup>&minus;x<sup>2</sup>/(2&sigma;<sup>2</sup>)</sup> is proportional to e<sup>&minus;&sigma;<sup>2</sup>k<sup>2</sup>/2</sup>. Verify the width relationship &sigma;<sub>k</sub> = 1/&sigma;<sub>x</sub>.</p>
<p><strong>Problem 11.2:</strong> An AM radio station broadcasts at a carrier frequency of &nu;<sub>c</sub> = 1 MHz and needs to transmit audio signals up to 5 kHz. What bandwidth is required? What range of frequencies must the receiver accept?</p>
<p><strong>Problem 11.3:</strong> For deep water waves (&omega; = &radic;(gk)), compute the phase velocity and group velocity. Show that v<sub>g</sub> = &frac12;v<sub>p</sub>. What does this imply about wave crests moving through a group of deep water waves?</p>
<p><strong>Problem 11.4:</strong> A Gaussian wavepacket has initial width &sigma;<sub>x</sub> = 1 cm and is sent through a medium with &Gamma; = &omega;&Prime;(k<sub>c</sub>) = 0.5 m<sup>2</sup>/s. How long does it take for the packet to double in width? How does the answer change if &sigma;<sub>x</sub> = 1 mm?</p>
<p><strong>Problem 11.5:</strong> For the dispersion relation &omega;(k) = &radic;(&omega;<sub>p</sub><sup>2</sup> + c<sup>2</sup>k<sup>2</sup>) (light in a plasma), compute v<sub>p</sub> and v<sub>g</sub>. Show that v<sub>p</sub> &middot; v<sub>g</sub> = c<sup>2</sup>. What does this imply about whether v<sub>p</sub> or v<sub>g</sub> can exceed c?</p>
<p><strong>Problem 11.6:</strong> An electron is localized to a region of width &sigma;<sub>x</sub> = 1 nm. Using the non-relativistic dispersion relation &omega; = &hbar;k<sup>2</sup>/(2m), estimate how long it takes for the wavepacket to double in width. (Use m<sub>e</sub> = 9.11 &times; 10<sup>&minus;31</sup> kg, &hbar; = 1.055 &times; 10<sup>&minus;34</sup> J&middot;s.)</p>
<p><strong>Problem 11.7:</strong> In a non-dispersive medium, a wavepacket travels without changing shape. Show this explicitly by plugging &omega;(k) = vk into the general solution A(x,t) = &int; dk e<sup>i(kx &minus; &omega;(k)t)</sup> f&#x0303;(k) and recovering f(x &minus; vt).</p>
<p><strong>Problem 11.8:</strong> A fiber optic cable transmits light at &lambda; = 1.5 &mu;m. The dispersion parameter is D = 17 ps/(nm&middot;km). If pulses of width 100 ps are used, estimate the maximum distance before adjacent pulses (separated by 200 ps) begin to overlap. This limits the data rate — what is the approximate maximum bit rate for this distance?</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: []
    }
  ]

};
