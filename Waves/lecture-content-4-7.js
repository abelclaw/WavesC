window.LECTURE_CONTENT_4_7 = {

"4": [
  {
    heading: "Review: Two Coupled Masses",
    body: `<p>Last time we studied how two coupled masses on springs move. If we take the coupling spring constant equal to the wall spring constant ($\\kappa = k$) for simplicity, the two <strong>normal modes</strong> correspond to specific eigenvectors and frequencies. The <strong>symmetric (slow) mode</strong> has both masses moving together with frequency $\\omega_s = \\sqrt{k/m}$, while the <strong>antisymmetric (fast) mode</strong> has them moving in opposite directions with $\\omega_f = \\sqrt{3k/m}$.</p>
<p>One way to make sure we only excite a particular mode is to choose initial conditions that match the eigenvector. If we displace both masses equally ($x_1 = x_2$), we excite only the symmetric mode. If we displace them oppositely ($x_1 = -x_2$), we excite only the fast mode. The normal mode solutions are in <strong>one-to-one correspondence with initial conditions</strong>.</p>
<p>It is helpful to plot these initial conditions (the eigenvectors) as points: the x-axis is the mass index (1 or 2) and the y-axis is the displacement from equilibrium. The symmetric mode gives two dots at the same height; the antisymmetric mode gives two dots at opposite heights. Although the actual displacement is longitudinal (along the spring direction), we draw it vertically because it is easier to see -- especially when we go to many masses.</p>`,
    interactive: "two-mass-normal-modes",
    interactiveCaption: "The two normal modes of two coupled masses: symmetric (both move together) and antisymmetric (move in opposite directions)",
    mathLinks: ["eigenvalues-eigenvectors", "matrix-diagonalization"]
  },
  {
    heading: "Three Masses",
    body: `<p>Now consider 3 identical masses with all identical spring constants, connected in a line between two fixed walls. The equations of motion for each mass come from thinking about the forces: when mass $n$ is displaced, it feels a restoring force from the springs on either side. The key equation for the first mass is:</p>
<p style="text-align:center;">$$m \\frac{d^2 x_1}{dt^2} = -2kx_1 + kx_2$$</p>
<p>You should think of the first term $-2kx_1$ as the restoring force when mass 1 is moved: it always wants to go back to equilibrium. The second term $+kx_2$ is the force exerted on mass 1 when mass 2 is moved <em>holding everything else fixed</em>. It has a positive sign because if mass 2 moves away, mass 1 wants to follow. If we move mass 3 holding everything else fixed, no force is exerted on mass 1 (it is not directly connected).</p>
<p>Similarly, the middle mass feels forces from both neighbors: $m \\, d^2 x_2/dt^2 = -2kx_2 + kx_1 + kx_3$, and the third mass is like the first but on the other side: $m \\, d^2 x_3/dt^2 = -2kx_3 + kx_2$.</p>
<p>Writing $\\vec{x} = (x_1^0, x_2^0, x_3^0) e^{i\\omega t}$, the equations become the matrix eigenvalue problem: $-\\omega^2 \\vec{x} = \\omega_0^2 M \\vec{x}$, where $M$ is the tridiagonal matrix with $-2$ on the diagonal and $1$ on the off-diagonals, and $\\omega_0 = \\sqrt{k/m}$.</p>
<details class="derivation-card"><summary>Derive: Three-mass eigenvalues and eigenvectors</summary><div class="derivation-body">
<p>The $3 \\times 3$ matrix is: $[[-2, 1, 0], [1, -2, 1], [0, 1, -2]]$. Finding eigenvalues by solving $\\det(M - \\lambda I) = 0$:</p>
<p>The eigenvalues and corresponding eigenvectors are:</p>
<p>$\\omega_1 = \\omega_0 \\sqrt{2 - \\sqrt{2}}$, eigenvector $(1, \\sqrt{2}, 1)$ -- slowest mode</p>
<p>$\\omega_2 = \\omega_0 \\sqrt{2}$, eigenvector $(-1, 0, 1)$ -- middle mode</p>
<p>$\\omega_3 = \\omega_0 \\sqrt{2 + \\sqrt{2}}$, eigenvector $(1, -\\sqrt{2}, 1)$ -- fastest mode</p>
</div></details>
<p>When we plot these eigenvectors as we did for two masses, we see that the slowest mode has all masses displaced in the same direction (like half a sine wave), the middle mode has the center mass stationary, and the fastest mode has the outer masses moving opposite to the center. The higher modes have masses more stretched apart, so there is more force between them, causing faster oscillation.</p>`,
    interactive: "three-mass-normal-modes",
    interactiveCaption: "The three normal modes of three coupled masses, ordered from slowest to fastest frequency",
    mathLinks: ["eigenvalues-eigenvectors", "matrix-diagonalization"]
  },
  {
    heading: "Completeness of Eigenvectors",
    body: `<p>Before going on to $N$ modes, it is worth making one very important point. Recall from linear algebra that the set of eigenvectors of any matrix is <strong>complete</strong>, meaning that any vector can be written as a linear combination of eigenvectors. For oscillators, this means that <em>any</em> solution to the equations of motion can be written as a sum over normal modes:</p>
<p style="text-align:center;">$$\\vec{x}(t) = \\sum_j c_j \\vec{x}_j(t)$$</p>
<p>where the sum is over normal modes $j$. Each normal mode $\\vec{x}_j(t)$ oscillates at a single frequency $\\omega_j$: $\\vec{x}_j(t) = \\vec{x}_j^{\\,0} \\cos(\\omega_j t)$, where $\\vec{x}_j^{\\,0}$ is the eigenvector (a constant vector describing the shape of the mode).</p>
<p>In summary: <strong>normal modes oscillate with a single frequency. A general solution can always be written as a sum of normal modes.</strong> This is the key principle that connects oscillators to waves -- any complicated motion of a system of coupled oscillators is just a superposition of simple, single-frequency normal modes.</p>
<span class="inline-math-link" data-math="linear-algebra-review">Linear Algebra: Eigenvectors & Completeness &rarr;</span>`,
    interactive: null,
    interactiveCaption: null,
    mathLinks: ["linear-algebra-review", "eigenvalues-eigenvectors"]
  },
  {
    heading: "N Modes: Equations of Motion",
    body: `<p>Now we will solve the $N$ mass system. You should think of lots of springs put together as being simply one long spring where the masses are pieces of the spring itself. We will see the <strong>wave equation</strong> result from this system. Solutions to the wave equation describe not just normal modes, but also waves, such as pulses sent down the spring (like pulses sent down a slinky). These pulses are called <strong>traveling waves</strong>, which are actually linear combinations of normal modes.</p>
<p>You may find this section quite abstract. It is not critical that you follow all the details and be able to reproduce it all on your own. This is one of the most complicated derivations we will do in the course. Do your best. You should understand the result though, as summarized in Section 4.4.</p>
<p>Adding more masses to the right of mass 3 does not affect the equations of motion for masses 1 and 2. So their equations are the same as before. Mass 3 is now like mass 2 -- it has masses to the right and left of it. In fact, the general equation for any of the middle masses is:</p>
<p style="text-align:center;"><strong>$$m \\frac{d^2 x_n}{dt^2} = k x_{n-1} - 2k x_n + k x_{n+1}$$</strong></p>
<p>The first mass has no mass to its left (attached to a wall): $m \\, d^2 x_1/dt^2 = -2kx_1 + kx_2$. The last mass has no mass to its right: $m \\, d^2 x_N/dt^2 = k x_{N-1} - 2k x_N$. Putting all of these together with time dependence $e^{i\\omega t}$ leads to the $N \\times N$ matrix equation with a <strong>tridiagonal matrix</strong>: $-2$ on the diagonal, $1$ on the off-diagonals, and all other entries zero.</p>`,
    interactive: "n-mass-chain",
    interactiveCaption: "N masses connected by springs between two fixed walls, showing the tridiagonal coupling structure",
    mathLinks: ["matrix-diagonalization", "tridiagonal-matrices"]
  },
  {
    heading: "N Modes: Numerical Solutions",
    body: `<p>First, let us solve for the eigenvalues and eigenvectors of this system numerically using a computer. With 20 masses, the displacements associated with any given eigenvalue look a lot like a cosine curve.</p>
<p>For the 6 mass system, we can plot the displacements for all the normal modes at the same time. Already with six masses, we see that the normal modes look like sine and cosine curves. They are not complete periods though -- they stop abruptly. This is due to the equations of motion for masses 1 and $N$ being different from the equation that the middle masses satisfy. What is special about masses 1 and $N$ is that they are attached to rigid walls, while all the other masses are attached to springs only.</p>
<p>These rigid walls correspond to <strong>fixed boundary conditions</strong> at $n = 0$ and $n = N+1$. To be clear, there is really no mass at $n = 0$, but we are just pretending one is there (and it never moves). When we extend the interpolation curves to $n = 0$ and $n = N+1$, the solutions clearly look like:</p>
<p style="text-align:center;">$$x_n = B \\sin(pn) e^{i\\omega t}$$</p>
<p>for some value $p$. The boundary conditions imply that $p = \\frac{\\pi}{N+1} j$ for $j = 1, 2, 3, \\ldots$ These $p$ values are called <strong>wavenumbers</strong>. In the continuum limit, we will see that wavenumber $p = 2\\pi/\\lambda$ with $\\lambda$ the wavelength. In the discrete case, $p$ is dimensionless so it is harder to think of it as related to a wavelength. The fact that wavenumbers are <strong>quantized by the boundary conditions</strong> is extremely important, both classically and in quantum mechanics.</p>`,
    mathLinks: ["boundary-conditions"]
  },
  {
    heading: "N Modes: Exact Solution",
    body: `<p>With the numerical solution giving a hint of where to look, let us just solve the system. We want to find vectors $x_n$ that satisfy the equation of motion for the middle masses: $d^2 x_n/dt^2 = \\omega_0^2 [x_{n-1} - 2x_n + x_{n+1}]$.</p>
<details class="derivation-card"><summary>Derive: Dispersion relation for N coupled oscillators</summary><div class="derivation-body">
<p><strong>Step 1: Guess a solution.</strong> Since the time dependence is exponential (from linearity) and the numerical solution looks like sine functions, we guess: $x_n = B e^{ipn} e^{i\\omega t}$.</p>
<p><strong>Step 2: Plug in.</strong> Substituting into the equation of motion: $-\\omega^2 e^{ipn} = [e^{ip(n-1)} - 2e^{ipn} + e^{ip(n+1)}] \\omega_0^2$.</p>
<p><strong>Step 3: Simplify.</strong> Dividing both sides by $-e^{ipn}$: $\\omega^2 = [2 - e^{-ip} - e^{ip}] \\omega_0^2 = [2 - 2\\cos(p)] \\omega_0^2$.</p>
<p><strong>Result:</strong> $\\omega(p) = \\pm \\sqrt{2(1 - \\cos(p))} \\; \\omega_0$. This is the <strong>dispersion relation</strong>.</p>
</div></details>
<details class="derivation-card"><summary>Derive: Boundary conditions fix the wavenumbers</summary><div class="derivation-body">
<p>Both $p$ and $-p$ give the same $\\omega$, so we can combine solutions. Since the numerical solutions looked like sine curves, we guess $x_n = B \\sin(pn) e^{i\\omega t}$.</p>
<p><strong>Check mass 1:</strong> Plugging $x_n = B \\sin(pn)$ into the equation for mass 1 ($m \\, d^2 x_1/dt^2 = -2kx_1 + kx_2$), using $\\sin(2p) = 2 \\sin(p)\\cos(p)$, we find it works with the dispersion relation $\\omega^2 = [2 - 2\\cos(p)] \\omega_0^2$.</p>
<p><strong>Check mass N:</strong> The equation for mass $N$ gives: $-B \\omega^2 \\sin(Np) = B \\omega_0^2 [\\sin((N-1)p) - 2\\sin(Np)]$. After substituting the dispersion relation, canceling the $-2\\sin(Np)$ terms, and expanding $\\sin(Np - p)$ using the subtraction formula, we arrive at: $0 = \\sin((N+1)p)$.</p>
<p><strong>Quantization:</strong> This is only satisfied if $p = \\frac{\\pi}{N+1} j$, for $j = 1, 2, 3, \\ldots$</p>
<p>This confirms the rigid walls correspond to boundary conditions where masses $n = 0$ and $n = N+1$ are held fixed.</p>
</div></details>
<p>Thus the <strong>normal mode frequencies</strong> are: $\\omega^2 = 2\\left(1 - \\cos\\!\\left(\\frac{\\pi j}{N+1}\\right)\\right) \\omega_0^2$, for $j = 1, 2, 3, \\ldots, N$. You can verify this gives the correct answer for $N = 3$ by plugging in $j = 1, 2, 3$ and recovering the frequencies we found earlier.</p>
<p>For large $N$, the lowest frequencies have $j \\ll N$. Using the Taylor expansion $\\cos(x) \\approx 1 - x^2/2$ for small $x$, we find $\\omega^2 \\approx (\\pi j / (N+1))^2 \\omega_0^2$, so $\\omega = \\omega_0 \\cdot p$: the frequency is proportional to the wavenumber. The dispersion relation becomes <strong>linear</strong>. This linearity will be important when we discuss dispersion.</p>`,
    interactive: "dispersion-relation-discrete",
    interactiveCaption: "The dispersion relation $\\omega(p)$ for N coupled oscillators, showing the transition from curved to linear at small p",
    mathLinks: ["taylor-series", "trig-identities"]
  },
  {
    heading: "N Modes: Summary",
    body: `<p>Here is a summary of the key results for a large number $N$ of masses connected by springs. For each integer $j = 1, 2, 3, \\ldots$ there is a single normal mode solution. The position of mass $n$ during the oscillation of normal mode $j$ is:</p>
<p style="text-align:center;"><strong>$$x_n^{(j)}(t) = \\sin\\!\\left(\\frac{\\pi j n}{N+1}\\right) \\cos(\\omega_j t + \\phi_j)$$</strong></p>
<p>The frequencies are given by: <strong>$\\omega_j = \\omega_0 \\sqrt{2\\left(1 - \\cos\\!\\left(\\frac{\\pi j}{N+1}\\right)\\right)}$</strong>. For small $j$ (low modes), this simplifies to $\\omega_j \\approx \\frac{\\pi j}{N+1} \\omega_0$.</p>
<p>An arbitrary solution can be written as a sum over normal modes: $x_n(t) = \\sum_j a_j \\sin\\!\\left(\\frac{\\pi j n}{N+1}\\right) \\cos(\\omega_j t + \\phi_j)$, for some real constants $a_j$ and $\\phi_j$. These solutions all satisfy the boundary conditions $x_0(t) = x_{N+1}(t) = 0$ (both walls held fixed).</p>
<p>The critical insight: as we increase $N$, the normal mode shapes become smoother and smoother sine curves, and the discrete system starts to look like a continuous string. This motivates taking the <strong>continuum limit</strong>.</p>`,
    interactive: null,
    interactiveCaption: null,
    mathLinks: []
  },
  {
    heading: "Continuum Limit: From Oscillators to the Wave Equation",
    body: `<p>We will now take the limit $N \\to \\infty$. This will turn our discrete problem into a continuous problem, and our differences into derivatives.</p>
<p>With $N$ masses, we called the displacement of each mass from its equilibrium point $x_n$. Since all the springs have the same constant, at equilibrium all the masses are a distance $\\Delta x$ apart. Let us define a function $A(x, t)$ as the <em>amplitude</em> of the displacement from equilibrium at a point $x$. So $A(n \\Delta x, t) = x_n(t)$. To be clear, these displacements are still longitudinal (in the direction of the springs), but we are drawing $A(x, t)$ in the transverse direction for visualization.</p>
<details class="derivation-card"><summary>Derive: The wave equation from the continuum limit</summary><div class="derivation-body">
<p><strong>Step 1: Rewrite in terms of $A(x,t)$.</strong> The equation of motion $d^2 x_n / dt^2 = (k/m)[x_{n-1} - 2x_n + x_{n+1}]$ becomes:</p>
<p style="text-align:center;">$$\\frac{d^2 A(n \\Delta x, t)}{dt^2} = \\frac{k}{m}[A((n+1)\\Delta x, t) - 2A(n \\Delta x, t) + A((n-1)\\Delta x, t)]$$</p>
<p><strong>Step 2: Recognize the second difference.</strong> The right side can be written as $(k/m) \\Delta x$ times the quantity $[(A(x+\\Delta x,t) - A(x,t))/\\Delta x - (A(x,t) - A(x-\\Delta x,t))/\\Delta x]$. This is starting to look like calculus!</p>
<p><strong>Step 3: Take $\\Delta x \\to 0$.</strong> The differences become first derivatives: $d^2 A/dt^2 = (k/\\mu)[dA(x,t)/dx - dA(x-\\Delta x,t)/dx]$, where $\\mu = m/\\Delta x$ is the <strong>mass per unit length</strong> (mass density).</p>
<p><strong>Step 4: Define the elastic modulus.</strong> We define $E = k \\Delta x$ as the <strong>elastic modulus</strong>. Taking $\\Delta x \\to 0$ one more time turns the first derivatives into a second derivative.</p>
<p><strong>Step 5: Define wave speed.</strong> Writing $v = \\sqrt{E/\\mu}$, we arrive at the <strong>wave equation</strong>:</p>
<p style="text-align:center;">$$\\frac{\\partial^2 A}{\\partial t^2} = v^2 \\frac{\\partial^2 A}{\\partial x^2}$$</p>
</div></details>
<p>The wave equation is one of the most important equations in all of physics: <strong>$$\\frac{\\partial^2 A}{\\partial t^2} = v^2 \\frac{\\partial^2 A}{\\partial x^2}$$</strong>. The wave speed is $v = \\sqrt{E/\\mu}$, where $E$ is the elastic modulus (stiffness) and $\\mu$ is the mass density (inertia). More stiffness means faster waves; more mass means slower waves. This makes physical sense.</p>
<span class="inline-math-link" data-math="partial-derivatives">Partial Derivatives &rarr;</span>`,
    interactive: "continuum-limit",
    interactiveCaption: "Visualizing the continuum limit: as the number of masses increases, the discrete system approaches a continuous string satisfying the wave equation",
    mathLinks: ["partial-derivatives", "taylor-series"]
  },
  {
    heading: "Solving the Wave Equation",
    body: `<p>The wave equation is linear, so we can solve it with exponentials. Writing $A(x, t) = e^{i\\omega t} e^{ikx}$, we get the <strong>dispersion relation</strong>: $\\omega(k) = v|k|$. This is a linear dispersion relation. Since we have taken $N \\to \\infty$, all modes have $j \\ll N$, so the linearity is consistent with what we found for finite $N$.</p>
<p>Since the wave equation has only second derivatives, the general solution for a fixed frequency $\\omega$ is: $A_k(x,t) = a_k \\cos(kx) \\cos(\\omega t) + b_k \\sin(kx) \\cos(\\omega t) + c_k \\cos(kx) \\sin(\\omega t) + d_k \\sin(kx) \\sin(\\omega t)$. The only difference from the discrete case is that now $\\omega = vk$ instead of the more complicated dispersion relation we found before. Note that in the continuum case $k$ has dimensions of 1/length and is called the <strong>wavenumber</strong>, equal to $2\\pi/\\lambda$.</p>
<p>Which of the coefficients $a_k$, $b_k$, $c_k$, $d_k$ vanish depends on boundary conditions. Two particularly important cases emerge:</p>
<p><strong>Right-moving traveling wave:</strong> $A(x,t) = \\cos(kx - \\omega t) = \\cos((\\omega/v)(x - vt))$. This solution has the property that $A(x, t + \\Delta t) = A(x - v \\Delta t, t)$, meaning the amplitude at $x$ in the future is given by the amplitude at a position to the left at the current time. The curve is moving to the right. More generally, $A(x,t) = f(x - vt)$ is a right-moving traveling wave for <em>any</em> function $f$. Similarly, $A(x,t) = f(x + vt)$ is a <strong>left-moving traveling wave</strong>.</p>
<p><strong>Standing wave:</strong> $A(x,t) = \\cos(kx - \\omega t) + \\cos(kx + \\omega t) = 2\\cos(kx)\\cos(\\omega t)$. The ratio of amplitudes at any two points stays constant in time: $A(x_1,t)/A(x_2,t) = \\cos(kx_1)/\\cos(kx_2)$. The shape does not move -- it just oscillates in place.</p>
<p>The key observations: whether a traveling wave or a standing wave is produced <strong>depends on initial conditions</strong>. And standing waves are the sum of a left-moving and right-moving wave. Any traveling wave can be written as a sum over normal modes -- how this is done is the <strong>Fourier decomposition</strong>, which we study next.</p>`,
    interactive: "traveling-vs-standing",
    interactiveCaption: "Comparison of traveling waves ($f(x - vt)$ moving right) and standing waves ($2\\cos(kx)\\cos(\\omega t)$ oscillating in place)",
    mathLinks: ["complex-exponentials", "trig-identities"]
  },
  {
    heading: "Problems",
    body: `<p><strong>Problem 1:</strong> For the two-mass system with $\\kappa = k$, verify that the symmetric mode eigenvector $(1, 1)$ satisfies the matrix equation with eigenvalue $\\omega_s^2 = k/m$, and the antisymmetric mode eigenvector $(1, -1)$ satisfies it with $\\omega_f^2 = 3k/m$.</p>
<p><strong>Problem 2:</strong> For $N = 4$ masses, write down the $4 \\times 4$ tridiagonal matrix. Find the normal mode frequencies using the formula $\\omega^2 = 2(1 - \\cos(\\pi j / 5)) \\omega_0^2$ for $j = 1, 2, 3, 4$. Verify that the $j = 1$ and $j = 4$ modes give the slowest and fastest frequencies respectively.</p>
<p><strong>Problem 3:</strong> Show that for the $N$-mass system, the guess $x_n = B \\sin(pn) e^{i\\omega t}$ satisfies the equation of motion for mass 1 ($m \\, d^2 x_1/dt^2 = -2kx_1 + kx_2$) when $\\omega^2 = 2(1 - \\cos(p)) \\omega_0^2$. Hint: use $\\sin(2p) = 2\\sin(p)\\cos(p)$.</p>
<p><strong>Problem 4:</strong> In the continuum limit derivation, explain physically why the elastic modulus is defined as $E = k \\Delta x$ rather than just $k$. What happens to $E$ as we take $\\Delta x \\to 0$ with $k$ fixed? Why must $k$ scale as $1/\\Delta x$ for $E$ to remain finite?</p>
<p><strong>Problem 5:</strong> Verify that $A(x, t) = f(x - vt)$ satisfies the wave equation for any twice-differentiable function $f$. Compute $\\partial^2 f/\\partial t^2$ and $\\partial^2 f/\\partial x^2$ using the chain rule.</p>
<p><strong>Problem 6:</strong> Show that a standing wave $2\\cos(kx)\\cos(\\omega t)$ can be written as the sum of a left-moving and right-moving traveling wave. Use the identity $\\cos(A) + \\cos(B) = 2\\cos((A+B)/2)\\cos((A-B)/2)$.</p>
<p><strong>Problem 7:</strong> A slinky has 100 coils, each of mass 2g, with spring constant $k = 1$ N/m between adjacent coils. (a) Find $\\omega_0$. (b) Find the frequency of the lowest normal mode. (c) Find the frequency of the 10th normal mode. (d) For the 10th mode, compare the exact frequency with the approximate formula $\\omega \\approx \\frac{\\pi j}{N+1} \\omega_0$.</p>`,
    interactive: null,
    interactiveCaption: null,
    mathLinks: []
  }
],

"5": [
  {
    heading: "Fourier Series: Motivation from the Wave Equation",
    body: `<p>When $N$ oscillators are strung together in a series, the amplitude of that string can be described by a function $A(x, t)$ which satisfies the <strong>wave equation</strong>: $\\left[\\frac{\\partial^2}{\\partial t^2} - v^2 \\frac{\\partial^2}{\\partial x^2}\\right] A(x, t) = 0$. We saw that electromagnetic fields satisfy this same equation with $v = c$ the speed of light.</p>
<p>We found normal mode solutions of the form $A(x, t) = A_0 \\cos((\\omega/v)(x \\pm vt) + \\phi)$, which are <strong>traveling waves</strong>. Solutions of the form $A(x, t) = A_0 \\cos(kx) \\cos(\\omega t)$ with $\\omega^2 = v^2 k^2$ are called <strong>standing waves</strong>. Whether traveling waves or standing waves are relevant depends on the boundary conditions.</p>
<p>More generally, we found that traveling wave solutions could come from <em>any</em> function $f(x + vt)$: it automatically satisfies the wave equation. Now, since any vector can be written as a sum of eigenvectors, any solution can be written as a sum of normal modes. This is true both in the discrete case and in the continuum case. Thus we must be able to write any function $f(x + vt)$ as a sum over terms like $a_k \\cos(kx) \\cos(\\omega t) + b_k \\sin(kx) \\cos(\\omega t) + c_k \\cos(kx) \\sin(\\omega t) + d_k \\sin(kx) \\sin(\\omega t)$.</p>
<p>In particular, at $t = 0$ any function can be written as: <strong>$f(x) = \\sum_k [a_k \\cos(kx) + b_k \\sin(kx)]$</strong>. We have just proved <strong>Fourier's theorem</strong>!</p>
<p>(Ok, we have not really proven it -- we just assumed the result from linear algebra about a finite system applies also in the continuum limit. The actual proof requires certain properties about the smoothness of $f(x)$ to hold. But we are physicists not mathematicians, so let us just say we proved it.)</p>`,
    interactive: null,
    interactiveCaption: null,
    mathLinks: ["wave-equation-review", "trig-identities"]
  },
  {
    heading: "Fourier's Theorem",
    body: `<p><strong>Fourier's theorem</strong> states that any square-integrable function $f(x)$ which is periodic on the interval $0 < x \\leq L$ (meaning $f(x + L) = f(x)$) can be written as:</p>
<p style="text-align:center;"><strong>$$f(x) = a_0 + \\sum_{n=1}^{\\infty} a_n \\cos\\!\\left(\\frac{2\\pi n x}{L}\\right) + \\sum_{n=1}^{\\infty} b_n \\sin\\!\\left(\\frac{2\\pi n x}{L}\\right)$$</strong></p>
<p>with coefficients: <strong>$a_0 = \\frac{1}{L} \\int_0^L f(x) \\, dx$</strong>, <strong>$a_n = \\frac{2}{L} \\int_0^L f(x) \\cos\\!\\left(\\frac{2\\pi n x}{L}\\right) dx$</strong>, and <strong>$b_n = \\frac{2}{L} \\int_0^L f(x) \\sin\\!\\left(\\frac{2\\pi n x}{L}\\right) dx$</strong>.</p>
<p>This decomposition is known as a <strong>Fourier series</strong>. Fourier series are useful for periodic functions or functions on a fixed interval $L$ (like a string). One can do a similar analysis for non-periodic functions or functions on an infinite interval ($L \\to \\infty$) in which case the decomposition is known as a <strong>Fourier transform</strong>. We will study Fourier series first.</p>
<p>Some useful rules: use a <strong>Fourier cosine series</strong> for functions which are even on the interval ($f(x) = f(L - x)$), a <strong>Fourier sine series</strong> for functions which are odd ($f(x) = -f(L - x)$), and for functions that are neither even nor odd, you need both sines and cosines.</p>
<span class="inline-math-link" data-math="integration-techniques">Integration Techniques &rarr;</span>`,
    interactive: "fourier-decomposition",
    interactiveCaption: "Interactive Fourier series builder: choose a function and watch the series converge as you add terms",
    mathLinks: ["integration-techniques", "trig-identities"]
  },
  {
    heading: "Verifying the Fourier Coefficients: Orthogonality",
    body: `<p>It is easy to verify the formulas for $a_n$ and $b_n$. The key ingredient is the <strong>orthogonality</strong> of sines and cosines.</p>
<details class="derivation-card"><summary>Derive: Fourier coefficient formulas via orthogonality</summary><div class="derivation-body">
<p><strong>For $a_0$:</strong> We just integrate $f(x)$ over the interval. Since $\\cos(2\\pi n x / L)$ goes through $n$ complete cycles as $x$ goes from 0 to $L$, its integral vanishes: $\\int_0^L \\cos(2\\pi n x / L) \\, dx = 0$ for $n > 0$. Similarly for sine. Thus $\\int_0^L f(x) \\, dx = a_0 \\cdot L$, giving $a_0 = \\frac{1}{L} \\int_0^L f(x) \\, dx$.</p>
<p><strong>For $a_n$:</strong> Multiply $f(x)$ by $\\cos(2\\pi n x / L)$ and integrate. We need the cosine product integral. Using the sum formula: $\\cos(2\\pi m x / L) \\cos(2\\pi n x / L) = \\frac{1}{2} \\cos((n+m) 2\\pi x / L) + \\frac{1}{2} \\cos((n-m) 2\\pi x / L)$.</p>
<p>Both terms vanish when integrated over a complete period, <em>unless</em> $n - m = 0$. So: $\\int_0^L \\cos(2\\pi m x / L) \\cos(2\\pi n x / L) \\, dx = \\frac{L}{2} \\delta_{mn}$, where $\\delta_{mn}$ is the <strong>Kronecker delta</strong> (1 if $m = n$, 0 otherwise).</p>
<p>Similarly: $\\int_0^L \\cos(2\\pi m x / L) \\sin(2\\pi n x / L) \\, dx = 0$ (always), and $\\int_0^L \\sin(2\\pi m x / L) \\sin(2\\pi n x / L) \\, dx = \\frac{L}{2} \\delta_{mn}$.</p>
<p>So: $\\int_0^L f(x) \\cos(2\\pi n x / L) \\, dx = a_0 \\cdot 0 + \\sum_m a_m \\frac{L}{2} \\delta_{mn} + \\sum_m b_m \\cdot 0 = \\frac{L}{2} a_n$.</p>
<p>Solving gives $a_n = \\frac{2}{L} \\int_0^L f(x) \\cos(2\\pi n x / L) \\, dx$, exactly as claimed. The derivation for $b_n$ is identical with cosine replaced by sine.</p>
</div></details>
<p>The orthogonality relations are the heart of Fourier analysis. They are the continuous analog of the orthogonality of eigenvectors in linear algebra. We will see this connection made precise in the section on orthogonal functions.</p>`,
    interactive: null,
    interactiveCaption: null,
    mathLinks: ["trig-product-formulas", "integration-techniques"]
  },
  {
    heading: "Example: The Sawtooth Function",
    body: `<p>Let us find the Fourier series for the <strong>sawtooth function</strong>, which equals $f(x) = x$ on the interval $0 < x \\leq 1$ and repeats periodically. This function is clearly periodic with $L = 1$.</p>
<details class="derivation-card"><summary>Derive: Fourier series of the sawtooth function</summary><div class="derivation-body">
<p><strong>$a_0$:</strong> $a_0 = \\int_0^1 x \\, dx = 1/2$.</p>
<p><strong>$a_n$:</strong> $a_n = 2 \\int_0^1 x \\cos(2\\pi n x) \\, dx$. Integration by parts: $a_n = 2 \\left[\\frac{x}{2\\pi n} \\sin(2\\pi n x)\\right]_0^1 - 2 \\int_0^1 \\frac{\\sin(2\\pi n x)}{2\\pi n} \\, dx$. The boundary term vanishes because $\\sin(2\\pi n) = 0$, and the integral also gives zero. So <strong>$a_n = 0$</strong> for all $n$.</p>
<p><strong>$b_n$:</strong> $b_n = 2 \\int_0^1 x \\sin(2\\pi n x) \\, dx$. Integration by parts: $b_n = -2 \\left[\\frac{x}{2\\pi n} \\cos(2\\pi n x)\\right]_0^1 + 2 \\int_0^1 \\frac{\\cos(2\\pi n x)}{2\\pi n} \\, dx = -\\frac{1}{\\pi n} + 0 = $ <strong>$-\\frac{1}{\\pi n}$</strong>.</p>
</div></details>
<p>Thus the Fourier series of the sawtooth function is: <strong>$f(x) = \\frac{1}{2} + \\sum_{n=1}^{\\infty} \\left(-\\frac{1}{\\pi n}\\right) \\sin(2\\pi n x)$</strong>.</p>
<p>How well does this work? With just one term in the sum, we get $f \\approx 1/2$ (a constant -- not great). With 2 terms: $f \\approx 1/2 - (1/\\pi) \\sin(2\\pi x)$ -- starting to tilt. With 3 terms the shape is recognizable. Already at 10 modes we find excellent agreement with the sawtooth. By 100 modes the approximation is essentially perfect everywhere except at the discontinuity (where you see a small overshoot known as the <strong>Gibbs phenomenon</strong>).</p>`,
    interactive: "fourier-sawtooth",
    interactiveCaption: "Building the sawtooth function term by term: watch the Fourier series converge as you add more modes",
    mathLinks: ["integration-by-parts"]
  },
  {
    heading: "Plucking a String",
    body: `<p>Let us apply the Fourier decomposition to <strong>plucking a string</strong>. Suppose we pluck a string by pulling up one end (like a sawtooth shape). What happens to the string?</p>
<p>We write the full time-dependent solution as: $A(x, t) = \\sum_{n=0}^{\\infty} [a_n \\cos(2n\\pi x / L) \\cos(\\omega_n t) + b_n \\sin(2n\\pi x / L) \\cos(\\omega_n t)]$, where $\\omega_n = (2n\\pi / L) v$ is determined by the dispersion relation. Here $v$ is the speed of sound in the string. We could also have included $\\sin(\\omega_n t)$ terms, but since the string starts at rest ($dA/dt = 0$ at $t = 0$), those coefficients must all vanish.</p>
<p>At $t = 0$, the amplitude is just the Fourier decomposition of the pluck shape. If we approximate the pluck as the sawtooth function, then $a_n = 0$ and $b_n = -1/(\\pi n)$. So setting $L = 1$: <strong>$A(x, t) = \\sum_{n=1}^{\\infty} \\left(-\\frac{1}{\\pi n}\\right) \\sin(2\\pi n x) \\cos(2\\pi n v t)$</strong>. This gives the motion of the string for all time!</p>
<p>The relative amplitudes of each mode scale like $1/n$. The $n = 1$ mode is the largest. This is the <strong>fundamental frequency</strong> of the string, $\\omega_1 = (2\\pi / L) v$. The sound that comes out of the string will be mostly this frequency. The modes with $n > 1$ are the <strong>harmonics</strong>. Harmonics have frequencies which are <em>integer multiples</em> of the fundamental. The particular mix of harmonics determines the <strong>timbre</strong> -- what the plucked string sounds like.</p>`,
    interactive: "plucked-string",
    interactiveCaption: "A plucked string evolving in time: the initial sawtooth shape decomposes into harmonics that each oscillate at their own frequency",
    mathLinks: ["fourier-series-math"]
  },
  {
    heading: "Fourier Series with Exponentials",
    body: `<p>Fourier series decompositions are even easier with complex numbers. We can replace the sines and cosines by exponentials. The series becomes:</p>
<p style="text-align:center;"><strong>$$f(x) = \\sum_{n=-\\infty}^{\\infty} c_n e^{i n x 2\\pi / L}$$</strong></p>
<p>where <strong>$c_n = \\frac{1}{L} \\int_0^L f(x) e^{-i n x 2\\pi / L} \\, dx$</strong>.</p>
<details class="derivation-card"><summary>Derive: Verification of the exponential Fourier series</summary><div class="derivation-body">
<p>Substitute the series into the integral: $\\int_0^L f(x) e^{-inx 2\\pi/L} \\, dx = \\sum_m c_m \\int_0^L e^{i(m-n)x 2\\pi/L} \\, dx$.</p>
<p>If $n \\neq m$, then: $\\int_0^L e^{i(m-n)x 2\\pi/L} \\, dx = \\frac{L}{2\\pi} \\cdot \\frac{1}{m-n} \\cdot [e^{i 2\\pi(m-n)} - 1] = 0$, since $e^{i 2\\pi k} = 1$ for any integer $k$.</p>
<p>If $m = n$, the integral is just $\\int_0^L dx = L$.</p>
<p>Thus $\\int_0^L e^{i(m-n)x 2\\pi/L} \\, dx = L \\delta_{mn}$, giving $\\int_0^L f(x) e^{-inx 2\\pi/L} \\, dx = L c_n$, confirming the formula.</p>
</div></details>
<p>If $f(x)$ is real, then $c_n$ and $c_{-n}$ are complex conjugates, and we recover: $a_n = \\text{Re}(c_n + c_{-n})$ and $b_n = \\text{Im}(c_{-n} + c_n)$. The exponential series contains all the information in both the sine and cosine series in a single, efficient form. The exponential notation is almost always preferred in advanced physics.</p>
<span class="inline-math-link" data-math="complex-exponentials">Complex Exponentials &rarr;</span>`,
    interactive: null,
    interactiveCaption: null,
    mathLinks: ["complex-exponentials", "eulers-formula"]
  },
  {
    heading: "Orthogonal Functions",
    body: `<p>In verifying Fourier's theorem, we found integral equations like $\\frac{1}{L} \\int_0^L e^{i(m-n)x 2\\pi/L} \\, dx = \\delta_{mn}$. These are examples of <strong>orthogonal functions</strong>. The integral is a type of <strong>inner product</strong>, exactly analogous to the dot product among vectors.</p>
<p>We can define the inner product of two functions as: <strong>$\\langle f|g\\rangle = \\frac{1}{2\\pi} \\int_0^{2\\pi} f^*(x) g(x) \\, dx$</strong>, where $f^*(x)$ is the complex conjugate. For example, $\\langle e^{imx} | e^{inx}\\rangle = \\delta_{mn}$. This is the analog of $\\langle \\hat{x}_i | \\hat{x}_j\\rangle = \\delta_{ij}$ for unit vectors.</p>
<p>When a set of functions satisfy $\\langle f_i | f_j\\rangle = \\delta_{ij}$, we say they are <strong>orthonormal</strong>. The "ortho" part means orthogonal ($\\langle f_i | f_j\\rangle = 0$ for $i \\neq j$), and the "normal" part means normalized ($\\langle f_i | f_i\\rangle = 1$). If any function can be written as a linear combination of the $f_i$, we say the set is <strong>complete</strong>. Then $f(x) = \\sum_i a_i f_i(x)$, and we can extract coefficients via $a_i = \\langle f | f_i\\rangle$. This is exactly what we do with the Fourier decomposition, and it is also what we do with vectors: $\\vec{v} = \\sum_i c_i \\hat{x}_i$, and $c_i = \\vec{v} \\cdot \\hat{x}_i$.</p>
<p>Other important examples of orthonormal function bases include: <strong>Bessel functions</strong> $J_n(x)$, which come up in 2D problems; <strong>Legendre polynomials</strong> $P_n(x)$, which come up in spherical problems (and you will study to death in quantum mechanics); and <strong>Hermite polynomials</strong> $H_n(x)$, which play a critical role in the quantum harmonic oscillator. Each family has its own inner product and its own completeness relation.</p>`,
    interactive: null,
    interactiveCaption: null,
    mathLinks: ["inner-products", "linear-algebra-review"]
  },
  {
    heading: "Problems",
    body: `<p><strong>Problem 1:</strong> Compute the Fourier series for the square wave: $f(x) = 1$ for $0 < x < L/2$ and $f(x) = -1$ for $L/2 < x < L$. Show that only odd harmonics ($b_1, b_3, b_5, \\ldots$) are nonzero, and find their values.</p>
<p><strong>Problem 2:</strong> Verify the orthogonality relation $\\int_0^L \\sin(2\\pi m x / L) \\sin(2\\pi n x / L) \\, dx = \\frac{L}{2} \\delta_{mn}$ by direct computation. Hint: use the product-to-sum identity $\\sin(A)\\sin(B) = \\frac{1}{2}[\\cos(A-B) - \\cos(A+B)]$.</p>
<p><strong>Problem 3:</strong> A string of length $L = 1$ m is plucked in the middle, creating a triangular shape: $A(x, 0) = 2x$ for $0 < x < 1/2$ and $A(x, 0) = 2(1-x)$ for $1/2 < x < 1$. Find the Fourier sine series coefficients $b_n$. Show that the even harmonics vanish and explain why physically.</p>
<p><strong>Problem 4:</strong> For the exponential Fourier series, show that if $f(x)$ is real, then $c_{-n} = c_n^*$ (the complex conjugate of $c_n$). Use this to show that the exponential series reduces to the real sine/cosine series.</p>
<p><strong>Problem 5:</strong> Compute the first 5 Fourier coefficients ($a_0, a_1, a_2, b_1, b_2$) for $f(x) = x^2$ on the interval $[0, 1]$. Plot the partial sums and compare to the actual function.</p>
<p><strong>Problem 6:</strong> A string is plucked at a point 1/4 of the way from one end. The initial shape is a triangle with peak at $x = L/4$. (a) Find the Fourier sine series. (b) Which harmonics are strongest? (c) Compare to the case where the string is plucked in the middle. Why does plucking position affect the harmonic content?</p>
<p><strong>Problem 7:</strong> Show that the Bessel functions $J_0(x)$ and $J_1(x)$ are orthogonal with respect to the inner product $\\int_0^1 x J_m(x) J_n(x) \\, dx$. You may use the integral table result or verify numerically.</p>`,
    interactive: null,
    interactiveCaption: null,
    mathLinks: []
  }
],

"6": [
  {
    heading: "Introduction",
    body: `<p>In Lecture 4, we derived the wave equation for two systems. First, by stringing together masses and springs and taking the continuum limit, we found the wave equation $\\left[\\frac{\\partial^2}{\\partial t^2} - v^2 \\frac{\\partial^2}{\\partial x^2}\\right] A(x, t) = 0$, where $A(x, t)$ is the displacement from equilibrium of the mass at position $x$. These are <strong>longitudinal waves</strong>. The wave speed is $v = \\sqrt{E/\\mu}$, where $E$ is the elastic modulus and $\\mu$ is the density per unit length.</p>
<p>Now we consider two more important cases: <strong>transverse oscillations on a string</strong> and <strong>longitudinal motion of air molecules</strong> (sound waves). In both cases we will derive the wave equation from first principles, and identify what determines the wave speed.</p>`,
    interactive: null,
    interactiveCaption: null,
    mathLinks: ["partial-derivatives"]
  },
  {
    heading: "Transverse Oscillations on a String",
    body: `<p>Consider a string of tension $T$. We define the amplitude $A(x, t)$ as the transverse displacement of the string at position $x$ at time $t$. We treat the string as a bunch of massless test probes connected by elastic segments. What is the force acting on the test mass at position $x$?</p>
<details class="derivation-card"><summary>Derive: Wave equation for transverse oscillations</summary><div class="derivation-body">
<p><strong>Step 1: Force from the left.</strong> Consider the downward component of force pulling on the mass at $x$ from the mass to the left (at $x - \\Delta x$). Drawing a triangle, the force is $F_{\\text{down,left}} = T \\sin(\\theta) = T \\Delta A / \\sqrt{\\Delta A^2 + \\Delta x^2}$. If the system is close to equilibrium, the slope is small ($\\Delta A \\ll \\Delta x$), so we approximate $\\sqrt{\\Delta A^2 + \\Delta x^2} \\approx \\Delta x$, giving:</p>
<p style="text-align:center;">$$F_{\\text{down,left}} = T \\frac{A(x) - A(x - \\Delta x)}{\\Delta x} = T \\frac{dA}{dx}$$</p>
<p><strong>Step 2: Force from the right.</strong> Similarly: $F_{\\text{down,right}} = T \\frac{A(x) - A(x + \\Delta x)}{\\Delta x} = -T \\frac{dA(x + \\Delta x)}{dx}$.</p>
<p><strong>Step 3: Total force.</strong> $F_{\\text{total}} = -T \\left[\\frac{dA(x + \\Delta x)}{dx} - \\frac{dA(x)}{dx}\\right]$.</p>
<p><strong>Step 4: Apply $F = ma$.</strong> The downward acceleration is $a = -d^2 A/dt^2$, so $F_{\\text{total}} = -\\mu \\Delta x \\, d^2 A/dt^2$, where $\\mu = m/\\Delta x$ is the mass per unit length.</p>
<p><strong>Step 5: Combine.</strong> $\\frac{d^2 A}{dt^2} = \\frac{T}{\\mu} \\frac{dA(x+\\Delta x)/dx - dA(x)/dx}{\\Delta x} = \\frac{T}{\\mu} \\frac{d^2 A}{dx^2}$.</p>
</div></details>
<p>The result is the wave equation: <strong>$\\left[\\frac{\\partial^2}{\\partial t^2} - v^2 \\frac{\\partial^2}{\\partial x^2}\\right] A(x, t) = 0$</strong> with wave speed <strong>$v = \\sqrt{T/\\mu}$</strong>.</p>
<p>Note an important physical point: the acceleration is due to a <strong>difference of forces</strong>. The force pulling up from the right has to be different from the force pulling down from the left to get an acceleration. Each force is proportional to a first derivative of $A$ (the slope), so the acceleration is proportional to a <em>second</em> derivative of $A$ (the curvature). A straight string, no matter what its slope, feels no net force. Only a curved string accelerates.</p>
<span class="inline-math-link" data-math="small-angle-approximations">Small Angle Approximations &rarr;</span>`,
    interactive: "string-transverse-wave",
    interactiveCaption: "Forces on a small segment of string under tension: the net transverse force arises from the difference in slope at the two ends",
    mathLinks: ["small-angle-approximations", "partial-derivatives"]
  },
  {
    heading: "Sound Waves",
    body: `<p>Waves in air are just like waves in a solid: the air molecules are like little masses and the forces between them act like springs. Thus we have already derived the wave equation. What is left is to think about what is actually going on when a wave propagates through the air.</p>
<p><strong>Sound waves are longitudinal density waves.</strong> The amplitude $A(x, t)$ measures the displacement from equilibrium of the molecule whose equilibrium position is at $x$. In a sound wave, each individual molecule is just oscillating back and forth around an equilibrium position, and the wave appears as a collective phenomenon among these moving molecules.</p>
<p>In a snapshot of the wave, it is hard to see $A(x, t)$ directly. Instead, what we observe is the <strong>density</strong> of the gas $\\rho(x, t)$. The two are closely related: as with any oscillator, the molecules move fastest as they pass through equilibrium and stop when they are farthest from equilibrium. When molecules are moving fastest to the right, they pile up, creating the most dense region. When they move fastest to the left, the region is least dense. Therefore density agrees with velocity: $\\rho$ is proportional to $\\rho_0 + dA/dt$.</p>
<p>If the displacement is $A(x, t) = A_0 \\cos(kx - \\omega t)$, then the density is $\\rho(x, t) = \\rho_0 + (\\Delta \\rho) \\sin(kx - \\omega t)$. The density <strong>lags behind the amplitude by 90 degrees</strong> (a quarter wavelength).</p>`,
    interactive: "sound-wave-longitudinal",
    interactiveCaption: "Spherical wavefronts emanate from a point source: compression and rarefaction regions spread outward with amplitude falling off as 1/\u221Ar",
    mathLinks: []
  },
  {
    heading: "Speed of Sound in a Gas",
    body: `<p>For sound excited by a large membrane (like a drum or speaker), if we are interested in wavelengths much less than the membrane size and much larger than the distance between air molecules, then waves in air become exactly like waves in a solid or on a string. We simply divide by the unit area: $(\\mu/A) \\, d^2 A/dt^2 = (T/A) \\, d^2 A/dx^2$. Now $\\mu/A$ is the mass per unit volume (density $\\rho$) and $T/A$ is the force per unit area (pressure $p$), giving $\\rho \\, d^2 A/dt^2 = p \\, d^2 A/dx^2$.</p>
<p>Thus $v = \\sqrt{p/\\rho}$ for a gas. It turns out this is only correct at constant temperature. The correct velocity uses the derivative at <strong>constant entropy</strong>, since when a wave passes through air it leaves it in the same state:</p>
<p style="text-align:center;"><strong>$$v = \\sqrt{\\left(\\frac{dp}{d\\rho}\\right)_S}$$</strong></p>
<details class="derivation-card"><summary>Derive: Speed of sound using the adiabatic index</summary><div class="derivation-body">
<p>From thermodynamics, $(dp/d\\rho)_S = \\gamma \\cdot p/\\rho$, where $\\gamma = C_P / C_V$ is the ratio of specific heats. By the equipartition theorem, each degree of freedom contributes $\\frac{1}{2}k_B T$ to the energy, so $U = \\frac{f}{2} n R T$. Then $C_V = \\frac{f}{2} n R$ and $C_P = C_V + nR = \\frac{f+2}{2} n R$. Their ratio gives:</p>
<p style="text-align:center;"><strong>$$\\gamma = \\frac{C_P}{C_V} = \\frac{f + 2}{f}$$</strong></p>
<p>For a <strong>monatomic gas</strong> (like Argon), only translations matter: $f = 3$, so $\\gamma = 5/3 = 1.67$.</p>
<p>For a <strong>diatomic gas</strong> (like N$_2$ or O$_2$, which is mostly what air is), $f = 5$ (3 translations + 2 rotations). Thus $\\gamma = 7/5 = 1.4$.</p>
</div></details>
<p>We sometimes define a <strong>bulk modulus</strong> $B = \\gamma p$. Then the speed of sound in air is <strong>$c_s = \\sqrt{\\gamma p / \\rho} = \\sqrt{B / \\rho}$</strong>. Note that $B$ and $c_s$ are properties of the gas, not the wave. All waves have the same velocity in the same type of air.</p>
<p>Using the ideal gas law ($pV = nRT$), we can also write: <strong>$c_s = \\sqrt{\\gamma R T / m}$</strong>, where $T$ is temperature and $m$ is the molecular weight. This tells us that the speed of sound depends <em>only on temperature</em>, not on density or pressure separately. It also tells us the speed of sound differs in gases with different molecular masses at the same temperature.</p>
<p>You may recall from chemistry that the root-mean-square velocity of a gas is $v_{\\text{rms}} = \\sqrt{3RT/m}$. So $c_s = \\sqrt{\\gamma/3} \\, v_{\\text{rms}}$. The speed of sound is proportional to, but not greater than, the speed of the molecules in the gas. This makes sense -- how could sound travel faster than the molecules transmitting it?</p>`,
    interactive: null,
    interactiveCaption: null,
    mathLinks: ["ideal-gas-law", "thermodynamics-basics"]
  },
  {
    heading: "Standing Waves and Boundary Conditions",
    body: `<p>Now let us talk about <strong>standing wave</strong> solutions in more detail. We look for solutions of fixed frequency $\\omega$, which we can write in the general form:</p>
<p style="text-align:center;">$$A(x, t) = A_0 \\sin(kx + \\phi_1) \\sin(\\omega t + \\phi_2)$$</p>
<p>where $A_0$ is the amplitude, $k$ is the wavenumber, and $\\omega = vk$ from the dispersion relation. Instead of phases, we can equivalently write: $A(x, t) = A_0 \\sin(kx) \\sin(\\omega t) + A_1 \\sin(kx) \\cos(\\omega t) + A_2 \\cos(kx) \\cos(\\omega t) + A_3 \\cos(kx) \\sin(\\omega t)$.</p>
<p><strong>Fixed (Dirichlet) boundary condition:</strong> If one end is fixed at $x = 0$, then $A(0, t) = 0$ for all $t$. This forces $A_2 = A_3 = 0$ (no cosine terms in $x$), leaving $A(x, t) = A_0 \\sin(kx) \\sin(\\omega t + \\phi)$.</p>
<p><strong>Free (Neumann) boundary condition:</strong> If one end is free, what condition applies? Going back to the force analysis: if there is no string to the right, then $F_{\\text{right}} = 0$ and the only force on the end mass is from the left. Taking $\\Delta x \\to 0$, this requires <strong>$\\frac{\\partial A(L, t)}{\\partial x} = 0$</strong> at the free end.</p>`,
    interactive: "boundary-conditions-demo",
    interactiveCaption: "Comparing fixed (Dirichlet) and free (Neumann) boundary conditions: how the allowed modes differ",
    mathLinks: ["boundary-conditions"]
  },
  {
    heading: "Frequency Spectra for Different Boundary Conditions",
    body: `<p><strong>Both ends fixed:</strong> We need $\\sin(kL) = 0$, which means $k = n\\pi / L$ for $n = 1, 2, 3, \\ldots$ The allowed frequencies are:</p>
<p style="text-align:center;"><strong>$$\\omega_n = v \\frac{\\pi}{L} n, \\quad n = 1, 2, 3, \\ldots$$</strong> (both ends fixed)</p>
<p>This gives harmonics at $\\nu, 2\\nu, 3\\nu, 4\\nu, \\ldots$ All integer multiples are present.</p>
<p><strong>One end fixed, one end free:</strong> Using $A(x, t) = A_0 \\sin(kx) \\sin(\\omega t + \\phi)$ and the Neumann condition $\\partial A/\\partial x = 0$ at $x = L$, we need $\\cos(kL) = 0$. This means $kL = (n + 1/2)\\pi$, giving:</p>
<p style="text-align:center;"><strong>$$\\omega_n = v \\frac{(n + 1/2)\\pi}{L}, \\quad n = 0, 1, 2, 3, \\ldots$$</strong> (one fixed, one free)</p>
<p>The lowest frequency is $\\nu_0 = v/(4L)$. The next is $3\\nu_0$, then $5\\nu_0$, then $7\\nu_0$. <strong>The even harmonics are missing!</strong> This has dramatic consequences for instruments like the trumpet and the clarinet.</p>
<p><strong>Both ends free:</strong> We need $A(x, t) = A_0 \\cos(kx) \\sin(\\omega t + \\phi)$ and $\\sin(kL) = 0$, giving $\\omega_n = v n\\pi / L$ for $n = 0, 1, 2, 3, \\ldots$ The only difference from both-fixed is that $n = 0$ is allowed, but that mode is just a constant (not physically interesting).</p>
<p>Here is the summary table of harmonics for the fundamental frequency $\\nu$:</p>
<table><tr><th>Boundary</th><th>Lowest</th><th>Next</th><th>Second</th><th>Third</th></tr>
<tr><td>Both fixed</td><td>$\\nu$</td><td>$2\\nu$</td><td>$3\\nu$</td><td>$4\\nu$</td></tr>
<tr><td>One fixed, one free</td><td>$\\nu$</td><td>$3\\nu$</td><td>$5\\nu$</td><td>$7\\nu$</td></tr>
<tr><td>Both free</td><td>$\\nu$</td><td>$2\\nu$</td><td>$3\\nu$</td><td>$4\\nu$</td></tr></table>
<p>Different instruments correspond to different boundary conditions. <strong>String instruments</strong> have both ends fixed. <strong>Woodwinds and brass</strong> have one end open. A <strong>flute</strong> has both ends free. The absence of the even harmonics is one reason that clarinets tend to sound eerie. Many of the complications in brass instrument design help restore the even harmonics.</p>`,
    interactive: "standing-wave-modes",
    interactiveCaption: "Standing wave modes for different boundary conditions: both fixed, one fixed/one free, both free",
    mathLinks: []
  },
  {
    heading: "Helmholtz Resonators",
    body: `<p>An important object in the physics of sound is the <strong>Helmholtz resonator</strong> -- a hollow cavity with a small opening, like a bottle or a violin body. They work because the volume of air in the body cannot change, so pushing down on the air in the neck forces the air in the body to push back with essentially a linear restoring force, like a spring. The air in the neck acts like a mass and the air in the body acts like a spring.</p>
<figure style="text-align:center;margin:1.2em 0"><img src="images/helmholtz-resonator.jpg" alt="Brass Helmholtz resonator" style="max-width:250px;width:100%;border-radius:6px"><figcaption style="font-size:0.85em;color:#666">A brass Helmholtz resonator. Air in the neck oscillates as a mass; air in the cavity acts as a spring. (Wikimedia Commons, CC BY-SA 2.5)</figcaption></figure>
<details class="derivation-card"><summary>Derive: Resonant frequency of a Helmholtz resonator</summary><div class="derivation-body">
<p>We use $\\omega = \\sqrt{k_{\\text{spring}} / m}$. The spring constant comes from $F = -k \\Delta x$. For pressure, $F = A \\cdot dp$ where $A$ is the cross-sectional area of the neck.</p>
<p>Since $\\rho = m/V$, we get $d\\rho = -(m/V^2) dV = -\\rho (dV/V)$. Using $dp/d\\rho = \\gamma p/\\rho$ for sound waves: $dp = -\\gamma (p/V) dV$.</p>
<p>Since $dV = A \\Delta x$: $F = A \\cdot dp = -\\gamma A^2 (p/V) \\Delta x$. So $k_{\\text{spring}} = \\gamma A^2 p/V = A^2 c_s^2 \\rho / V$.</p>
<p>The mass is the air in the neck: $m = \\rho A L$. Therefore: $\\omega = \\sqrt{A^2 c_s^2 \\rho / (V \\rho A L)} = c_s \\sqrt{A / (VL)}$.</p>
</div></details>
<p>Helmholtz resonators resonate at a single frequency: <strong>$\\nu = \\frac{c_s}{2\\pi} \\sqrt{\\frac{A}{VL}}$</strong>, where $A$ is the area of the opening, $L$ is the length of the neck, and $V$ is the volume of the cavity. For example, a 10 cm wide jar with a 1 cm$^2$ opening and 1 cm long neck containing 1 liter of air gives $\\nu \\sim 172$ Hz, with a wavelength of about 2 m -- much larger than the resonator itself.</p>
<p>Since Helmholtz resonators have only one frequency, they have <strong>no harmonics</strong> (no overtones). However, they can have low $Q$ values -- if you blow on a bottle, the sound does not resonate for long. This is actually useful for instruments: on a violin, the body functions as a Helmholtz resonator, enhancing the low frequency response and giving the violin much of its richness of tone. The thin, long f-holes increase air friction, lowering the $Q$ and spreading the resonance over a broader frequency range, propping up the transduction of string vibrations into sound down to the frequency of the open D string (~300 Hz).</p>`,
    interactive: "helmholtz-resonator",
    interactiveCaption: "A Helmholtz resonator: the air in the neck oscillates as a mass on a spring formed by the air in the body",
    mathLinks: ["ideal-gas-law"]
  },
  {
    heading: "Problems",
    body: `<p><strong>Problem 1:</strong> A guitar string has mass density $\\mu = 0.003$ kg/m and length $L = 0.65$ m. If the fundamental frequency is 330 Hz (the note E4), what is the tension in the string?</p>
<p><strong>Problem 2:</strong> Derive the wave equation for transverse oscillations from scratch. Start with a string element of length $\\Delta x$ and tension $T$. Carefully identify the vertical components of tension at each end, apply Newton's second law, and take $\\Delta x \\to 0$.</p>
<p><strong>Problem 3:</strong> For a pipe open at one end and closed at the other (like a clarinet), the fundamental frequency is 147 Hz. (a) What is the length of the pipe? (Use $c_s = 343$ m/s.) (b) What is the frequency of the next harmonic? (c) Why are only odd harmonics present?</p>
<p><strong>Problem 4:</strong> Calculate the speed of sound in helium at room temperature ($T = 293$ K). Helium is monatomic with molecular weight $m = 4$ g/mol. Compare to the speed of sound in air ($m \\approx 29$ g/mol, $\\gamma = 1.4$).</p>
<p><strong>Problem 5:</strong> A bottle has a circular neck opening of diameter 2 cm and neck length 5 cm. The volume of the body is 500 mL. Find the Helmholtz resonance frequency. What note is this closest to?</p>
<p><strong>Problem 6:</strong> Show that for a standing wave $A(x, t) = \\sin(kx) \\cos(\\omega t)$ with both ends fixed, the energy oscillates between kinetic and potential, but the total energy is constant. Find expressions for the kinetic and potential energy densities.</p>
<p><strong>Problem 7:</strong> Explain physically why the speed of sound in a string is $v = \\sqrt{T/\\mu}$. What happens to the wave speed if you (a) double the tension? (b) use a thicker string of the same material and length? (c) shorten the string by half (keeping tension and density the same)?</p>
<p><strong>Problem 8:</strong> A flute (both ends open) and a clarinet (one end open, one closed) have the same length $L$. Compare their fundamental frequencies. For each instrument, list the first four harmonics. Which harmonics are present in the flute but absent in the clarinet?</p>`,
    interactive: null,
    interactiveCaption: null,
    mathLinks: []
  }
],

"7": [
  {
    heading: "Why Do Notes Sound Good?",
    body: `<p>In the previous lecture, we saw that if you pluck a string, it will excite various frequencies. The amplitude of each frequency is proportional to the coefficient in the Fourier decomposition. Now we will start to understand how different frequencies combine to produce music.</p>
<figure style="text-align:center;margin:1.2em 0"><img src="images/guitar-strings.png" alt="Classical guitar showing strings and sound hole" style="max-width:300px;width:100%;border-radius:6px"><figcaption style="font-size:0.85em;color:#666">A classical guitar. Each string vibrates at a fundamental frequency plus harmonics; the relative strengths of these harmonics determine the instrument's timbre. (Wikimedia Commons, CC BY-SA 2.0)</figcaption></figure>
<p>A pure sine wave at middle C (C4 = 261 Hz) sounds pleasant, but not particularly interesting. A <strong>square wave</strong> version of the same note sounds somewhat tinny and unpleasant. These are the same notes, but different sounds. Why do they sound different? The Fourier decomposition reveals the answer: the pure sine wave has only one frequency, while the square wave has lots of other modes (all the odd harmonics with significant amplitudes). The extra high-frequency modes make the note sound less pure. If <em>all</em> frequencies are present at once, we get <strong>white noise</strong> -- perhaps as unmusical as you can get.</p>
<p>Now consider playing two notes at once. Playing 250 Hz and 270 Hz together does not sound great. The problem is that you hear a rattling around 20 times a second. This 20 Hz rattling is the <strong>beat frequency</strong> between the two notes. Indeed, $\\cos(270 \\cdot 2\\pi t) + \\cos(250 \\cdot 2\\pi t) = 2 \\cos(10 \\cdot 2\\pi t) \\cos(260 \\cdot 2\\pi t)$. The 10 Hz oscillation (heard as a 20 Hz beat) is jarring -- your mind tries to process it consciously. Frequencies as high as 260 Hz do not have this effect.</p>
<p>Thus there are two reasons sounds appear unmusical: <strong>too many frequencies present at once</strong>, and <strong>beating at frequencies we can consciously process</strong> (roughly below 20-30 Hz). This is a physics class, not a biology class, so we will not try to explain <em>why</em> these facts hold. We merely observe that whenever either criterion is satisfied, sounds appear unmusical.</p>`,
    interactive: "beats-demo",
    interactiveCaption: "Superposition of two close frequencies showing beats: the slowly varying envelope creates an audible wobble",
    mathLinks: ["trig-sum-product"]
  },
  {
    heading: "Dissonant and Consonant Note Pairs",
    body: `<p>If we play a pure 300 Hz sine wave with a pure 580 Hz sine wave, it does not sound bad: $\\cos(300 \\cdot 2\\pi t) + \\cos(580 \\cdot 2\\pi t) = 2 \\cos(140 \\cdot 2\\pi t) \\cos(440 \\cdot 2\\pi t)$. The beat frequency $2 \\times 140$ Hz $= 280$ Hz is too high to be harsh -- it is just a note. But if we played 300 Hz and 580 Hz on an <em>actual instrument</em>, it would sound horrible.</p>
<p>Why? Because real instruments excite harmonics. For a string plucked near the end, the Fourier coefficients scale like $1/n$. The fundamental ($n = 1$) has only twice the amplitude of the first harmonic ($n = 2$). Playing 580 Hz alongside a plucked 300 Hz string gives: $f(t) = \\cos(580T) + \\cos(300T) + \\frac{1}{2}\\cos(600T) + \\cdots$ . The 580 Hz and 600 Hz terms combine to produce beating at $2 \\times 10 = 20$ Hz, which is audible and jarring. There is beating between the external 580 Hz note and the first harmonic of the plucked string.</p>
<p>Real instruments have significant amplitudes for many harmonics. The spectrum of a flute playing G4 (392 Hz) shows not just the fundamental but many higher harmonics with significant amplitudes. These harmonics determine the instrument's <strong>timbre</strong> -- what a note sounds like when played, as distinguished from its <strong>pitch</strong> (the fundamental frequency) and <strong>intensity</strong> (the power). All of this can be read off the Fourier spectrum.</p>
<p>The key points are: on a real instrument, there will be unmusical beating whenever an integer multiple of one harmonic is <strong>close but not equal</strong> to an integer multiple of another harmonic. Conversely, the most <strong>consonant</strong> notes will have some harmonics which <em>exactly</em> agree.</p>`,
    interactive: "consonance-dissonance",
    interactiveCaption: "Comparing consonant and dissonant intervals: how harmonics of two notes either align or create beats",
    mathLinks: ["fourier-series-math"]
  },
  {
    heading: "Building Consonant Intervals",
    body: `<p>Let us start with middle C (C4, frequency $\\nu_0 = 261$ Hz). Which notes sound good alongside C4? The 261 Hz note has harmonics at $\\nu_0, 2\\nu_0, 3\\nu_0, 4\\nu_0$, etc: 261 Hz, 522 Hz, 783 Hz, 1044 Hz, 1305 Hz, $\\ldots$ Playing any of those frequencies alongside C4 will sound harmonic because they exactly match an existing harmonic.</p>
<p>The note at $2\\nu_0$ is one <strong>octave</strong> up (the 1st harmonic) = C5. Are there more harmonious notes between? Yes. Consider the note at $\\nu_5 = 391$ Hz. Its second harmonic is $2 \\times 391 = 783$ Hz, which matches the 3rd harmonic of C4. We call $\\nu_5 = (3/2) \\nu_0$ the <strong>perfect fifth</strong> (G4).</p>
<p>Similarly, $\\nu_4 = 348$ Hz has its 3rd harmonic matching the 4th harmonic of C4. We call $\\nu_4 = (4/3) \\nu_0$ the <strong>perfect fourth</strong> (F4).</p>
<p>Any rational number ratio of frequencies will be consonant. Many of these ratios have standard names:</p>
<table>
<tr><th>Ratio $\\nu/\\nu_0$</th><th>1</th><th>2</th><th>3/2</th><th>4/3</th><th>5/4</th><th>6/5</th><th>5/3</th><th>8/5</th></tr>
<tr><th>Name</th><td>Fundamental</td><td>Octave</td><td>Perfect 5th</td><td>Perfect 4th</td><td>Major 3rd</td><td>Minor 3rd</td><td>Major 6th</td><td>Minor 6th</td></tr>
<tr><th>Example</th><td>C4</td><td>C5</td><td>G4</td><td>F4</td><td>E4</td><td>Eb</td><td>A5</td><td>Ab5</td></tr>
</table>
<p>There are infinitely many rational numbers, so where do we stop? The answer: the <strong>lower the numbers in the ratio</strong>, the more consonant the interval. For something like 11/17, you would need the 17th harmonic of one note to match the 11th of another. By such high harmonics, amplitudes are small and the spectrum is messy. Also, ratios like 11/17 are more likely to create harmonics that are close but not equal, producing dissonant beating <em>before</em> producing consonance. For numbers larger than about 5 in the ratio, notes are no longer appreciated as harmonic.</p>`,
    interactive: "harmonic-alignment",
    interactiveCaption: "Harmonic series of two notes aligned: when harmonics overlap exactly, the interval sounds consonant",
    mathLinks: []
  },
  {
    heading: "Scales: Just Intonation",
    body: `<p>If we have a given note, say C4, we can define all the other notes so that they will be harmonic with C4. The <strong>just intonation scale</strong> chooses notes to have the smallest integers in the frequency ratio:</p>
<table>
<tr><th>Note</th><td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>A</td><td>B</td><td>C</td></tr>
<tr><th>$\\nu/\\nu_0$</th><td>1</td><td>9/8</td><td>5/4</td><td>4/3</td><td>3/2</td><td>5/3</td><td>15/8</td><td>2</td></tr>
<tr><th>Decimal</th><td>1</td><td>1.125</td><td>1.25</td><td>1.333</td><td>1.5</td><td>1.666</td><td>1.875</td><td>2</td></tr>
</table>
<p>The just intonation scale is in a sense the most harmonic choice for the frequencies. It is the default tuning for some non-Western instruments, such as the Turkish Baglama.</p>
<p>But there is a fundamental problem: if we pick notes that sound harmonic with C4, the <em>same set of notes will generically not sound harmonic with another note</em>, like D4. This starting note is called the <strong>key</strong>. For example, in the key of C, the notes C, G, and F sound good. In the key of D, those same notes will generally not sound as good.</p>
<p>To see the problem concretely: the just intonation scale defines D as $(9/8) \\nu_0$. The perfect 5th of D should be at $(3/2) \\times (9/8) = 27/16 = 1.688$ times $\\nu_0$. This note falls between A and B -- it is not exactly any note in the key of C scale. To play any note in any key perfectly, you would need an enormous number of available notes.</p>
<p>On a violin (which has no frets), a skilled player can produce any frequency and play the just intonation scale in any key. On a piano or guitar, the notes are built in. You can sometimes tune to a different key, but there are a finite number of notes. <strong>It is impossible to have an instrument with a finite number of notes be capable of playing the most harmonic notes in every key.</strong></p>`,
    interactive: null,
    interactiveCaption: null,
    mathLinks: []
  },
  {
    heading: "The Pythagorean Scale",
    body: `<p>One way to approximate an all-key scale is by choosing the notes to be related by powers of 3/2 (perfect fifths) and octaves (factors of 2). Starting with C: $(3/2) \\nu_0$ is the fifth (G4). Then $(3/2)^2 \\nu_0$ is the fifth of the fifth (D5). Then $(3/2)^3 \\nu_0$ is the fifth of D5 (A6), and so on. We can bring any power of 3/2 back to the original octave by dividing by appropriate powers of 2. For example, D5 $= (9/4) \\nu_0$, so D4 $= (9/8) \\nu_0$.</p>
<table>
<tr><th>Note</th><td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>A</td><td>B</td><td>C</td></tr>
<tr><th>$\\nu/\\nu_0$</th><td>1</td><td>9/8</td><td>81/64</td><td>4/3</td><td>3/2</td><td>27/16</td><td>243/128</td><td>2</td></tr>
<tr><th>Decimal</th><td>1</td><td>1.125</td><td>1.266</td><td>1.333</td><td>1.5</td><td>1.688</td><td>1.898</td><td>2</td></tr>
</table>
<p>This is called <strong>Pythagorean tuning</strong>. Note that the octave, perfect fifth (G), and perfect fourth (F) agree exactly with the just intonation values. Some notes differ: E is $81/64 = 1.266$ in Pythagorean tuning versus $5/4 = 1.25$ in just intonation. Playing C and E will be close to consonant, but not exactly.</p>
<p>The advantage of Pythagorean tuning is that the perfect fifth and perfect fourth of <em>every</em> note is included in the scale (since all notes are related by fifths).</p>`,
    interactive: null,
    interactiveCaption: null,
    mathLinks: []
  },
  {
    heading: "The Equal-Tempered Scale",
    body: `<p>An interesting feature of the Pythagorean scale is that the 12th fifth is very close to 8 octaves: <strong>$(3/2)^{12} = 129.748 \\approx 128 = 2^7$</strong>. Thus we can make a compromise: declare that 12 steps around the <strong>circle of fifths</strong> gets you back to the note you started at. We simply relate all notes by powers of $2^{1/12}$. Each half-step gives another factor of $2^{1/12}$.</p>
<table>
<tr><th>Note</th><td>C</td><td>C#</td><td>D</td><td>D#</td><td>E</td><td>F</td><td>F#</td><td>G</td><td>G#</td><td>A</td><td>A#</td><td>B</td><td>C</td></tr>
<tr><th>$\\nu/\\nu_0$</th><td>1</td><td>$2^{1/12}$</td><td>$2^{2/12}$</td><td>$2^{3/12}$</td><td>$2^{4/12}$</td><td>$2^{5/12}$</td><td>$2^{6/12}$</td><td>$2^{7/12}$</td><td>$2^{8/12}$</td><td>$2^{9/12}$</td><td>$2^{10/12}$</td><td>$2^{11/12}$</td><td>2</td></tr>
<tr><th>Decimal</th><td>1</td><td>1.059</td><td>1.122</td><td>1.189</td><td>1.260</td><td>1.335</td><td>1.414</td><td>1.498</td><td>1.587</td><td>1.682</td><td>1.782</td><td>1.888</td><td>2</td></tr>
</table>
<p>This is the <strong>equal-tempered scale</strong>, the standard tuning for all of Western music. In this scale, the <strong>circle of fifths</strong> exactly closes: each note going clockwise is a fifth above the previous (C $\\to$ G $\\to$ D $\\to$ A $\\to$ E $\\to$ B $\\to$ F# $\\to$ Db $\\to$ Ab $\\to$ Eb $\\to$ Bb $\\to$ F $\\to$ C). Going counterclockwise, the intervals are fourths.</p>
<details class="derivation-card"><summary>Derive: The Pythagorean Comma</summary><div class="derivation-body">
<p>Going up 12 perfect fifths multiplies the frequency by $(3/2)^{12}$. Going up 7 octaves multiplies by $2^7 = 128$. If these were equal, the circle of fifths would close exactly. But:</p>
<p style="text-align:center;">$$\\left(\\frac{3}{2}\\right)^{12} = \\frac{3^{12}}{2^{12}} = \\frac{531441}{4096} = 129.746$$</p>
<p>Compare with $2^7 = 128$. The ratio is $129.746/128 = 1.0136$, meaning 12 fifths overshoots 7 octaves by about 1.4%. This discrepancy is the <strong>Pythagorean comma</strong>.</p>
</div></details>
<p>In the equal-tempered scale, the circle exactly closes, but none of the intervals are exactly perfect fifths ($2^{7/12} = 1.498$ instead of 1.5). The perfect 4th and perfect 5th are very close to their optimal values, while the 6th and 7th are not as close.</p>`,
    interactive: "circle-of-fifths",
    interactiveCaption: "The circle of fifths: each step clockwise is a perfect fifth. In equal temperament the circle exactly closes; in Pythagorean tuning it does not",
    mathLinks: []
  },
  {
    heading: "Comparison of Scales",
    body: `<p>Here is a side-by-side comparison of the three scales for the whole notes in the key of C:</p>
<table>
<tr><th>Note</th><td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>A</td><td>B</td><td>C</td></tr>
<tr><th>Just intonation</th><td>1</td><td>1.125</td><td>1.25</td><td>1.333</td><td>1.5</td><td>1.666</td><td>1.875</td><td>2</td></tr>
<tr><th>Pythagorean</th><td>1</td><td>1.125</td><td>1.266</td><td>1.333</td><td>1.5</td><td>1.688</td><td>1.898</td><td>2</td></tr>
<tr><th>Equal-tempered</th><td>1</td><td>1.122</td><td>1.260</td><td>1.335</td><td>1.498</td><td>1.682</td><td>1.888</td><td>2</td></tr>
</table>
<p>The <strong>just intonation</strong> scale is the most harmonic in a single key but cannot change keys. The <strong>Pythagorean</strong> scale preserves perfect fifths and fourths everywhere but other intervals deviate. The <strong>equal-tempered</strong> scale sacrifices exact consonance in any single key for <em>equal</em> consonance in <em>all</em> keys -- a democratic compromise.</p>
<p>The perfect 4th and 5th are very close to their just-intonation values in equal temperament (within about 0.1-0.2%), while the major 3rd is off by about 0.8%. For most listeners, these differences are imperceptible. But for trained musicians, especially string players and vocalists, the differences matter -- which is why a good string quartet will instinctively adjust their intonation to play purer intervals.</p>`,
    interactive: "scale-comparison",
    interactiveCaption: "Comparing the three scales: just intonation, Pythagorean, and equal-tempered. Hear the difference between pure and tempered intervals",
    mathLinks: []
  },
  {
    heading: "Problems",
    body: `<p><strong>Problem 1:</strong> Two notes at 440 Hz (A4) and 466 Hz (Bb4) are played simultaneously. (a) What is the beat frequency? (b) Would you expect this combination to sound consonant or dissonant? Explain using the beat frequency criterion.</p>
<p><strong>Problem 2:</strong> Show that the perfect fifth (3/2) and perfect fourth (4/3) multiply to give an octave: $(3/2)(4/3) = 2$. Explain musically why going up a fifth and then up a fourth should give an octave.</p>
<p><strong>Problem 3:</strong> In the just intonation scale, the major third of C is E at $(5/4) \\nu_0$ and the major third of E is G# at $(5/4)^2 \\nu_0$. Compare $(5/4)^3$ to 2. This shows that three major thirds do not make an octave in just intonation. By how many cents is the discrepancy? (A cent is 1/1200 of an octave, or a factor of $2^{1/1200}$.)</p>
<p><strong>Problem 4:</strong> A flute playing G4 (392 Hz) has harmonics at 392, 784, 1176, 1568, $\\ldots$ Hz. A flute playing C5 (523 Hz) has harmonics at 523, 1046, 1569, $\\ldots$ Hz. Identify which harmonics nearly coincide. What is the beat frequency between the closest pair? Does this explain why G and C sound consonant?</p>
<p><strong>Problem 5:</strong> In equal temperament, the "perfect fifth" is $2^{7/12} = 1.4983$. What is the beat frequency between the equal-tempered fifth of A4 (440 Hz) and a pure $3/2$ ratio fifth? Is this beat audible?</p>
<p><strong>Problem 6:</strong> Verify that $(3/2)^{12} = 129.746\\ldots$ and compare to $2^7 = 128$. Compute the Pythagorean comma as the ratio $(3/2)^{12} / 2^7$. Express this in cents.</p>
<p><strong>Problem 7:</strong> A piano is tuned in equal temperament with A4 = 440 Hz. Calculate the frequencies of all 12 notes from C4 to C5. Compare each to the just intonation value and express the difference as a percentage.</p>
<p><strong>Problem 8:</strong> Explain why a clarinet (one end closed) sounds different from a flute (both ends open) even when playing the same note at the same volume. Your answer should reference boundary conditions and which harmonics are present.</p>`,
    interactive: null,
    interactiveCaption: null,
    mathLinks: []
  }
]

};
