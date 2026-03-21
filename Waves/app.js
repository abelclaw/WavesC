const modes = [
  {
    id: "learn",
    label: "Learn",
    hero: "Follow the lecture from start to finish, with interactives along the way.",
    subtitle: "A linear walkthrough of Schwartz's notes with inline animations, derivation boxes, and math lesson links."
  },
  {
    id: "intuition",
    label: "Intuition",
    hero: "Everything oscillates. When oscillators talk, waves emerge.",
    subtitle: "Read for physical meaning first, then open the formal machinery only when you want it."
  },
  {
    id: "math",
    label: "Math",
    hero: "Derivations stay collapsed until you ask them to speak.",
    subtitle: "Move between compact statements and the algebra underneath without losing your place."
  },
  {
    id: "exam",
    label: "Exam",
    hero: "Turn the notes into checkpoints, prompts, and recoverable errors.",
    subtitle: "Use the chapter prompts and common pitfalls to rehearse reasoning instead of memorizing results."
  }
];

const mathLessons = [
  {
    id: "complex-numbers",
    title: "Complex Numbers & Euler's Formula",
    sections: [
      { heading: "Why complex numbers?", body: "Complex numbers are a wonderful invention. They make complicated equations look really simple. Being able to take the square root of anything is unbelievably helpful. To see how important they are, consider how sophisticated mathematics needs to be to solve some equations. The equation $3x - 4 = 0$ has a solution $x = 4/3$ which is a simple <strong>rational number</strong>. To solve $x^2 - 2 = 0$, we need <strong>irrational numbers</strong>: $x = \\sqrt{2}$. To solve $x^2 + 4 = 0$ we need <strong>complex numbers</strong>: $x = \\pm 2i$, with $i = \\sqrt{-1}$. Now the punch line: to solve $ax^3 + bx^2 + cx + d = 0$, we still need <em>only</em> complex numbers. Complex numbers are the end of the road. Any polynomial equation can be solved with complex numbers. This is the <strong>Fundamental Theorem of Algebra</strong>. Beyond algebra, many physical problems -- especially oscillations and waves -- naturally involve two coupled quantities (amplitude and phase, or position and velocity). Complex numbers let you package both into a single object $z = x + iy$, turning two-dimensional problems into one-dimensional algebra.", interactive: null },
      { heading: "Basic arithmetic", body: "Any complex number can be written as $z = a + bi$ with $a$ and $b$ real. Addition is component-wise: $(a+bi) + (c+di) = (a+c) + (b+d)i$. Multiplication uses $i^2 = -1$: $(a+bi)(c+di) = (ac-bd) + (ad+bc)i$. The <strong>complex conjugate</strong> is $\\bar{z} = a - bi$. A key identity is $z\\bar{z} = a^2 + b^2$, which is always real and gives $|z|^2 = z z^* = x^2 + y^2$, the squared distance from the origin in the complex plane. The trick to dividing complex numbers is to multiply top and bottom by the conjugate of the denominator: $1/z = \\bar{z}/(z\\bar{z}) = (a - bi)/(a^2 + b^2)$.", interactive: null },
      { heading: "Polar form and Euler's formula", body: "Any complex number can also be written in polar form as $z = r e^{i\\theta} = a + bi$, where $a = r\\cos\\theta$, $b = r\\sin\\theta$, and $r = |z| = \\sqrt{a^2 + b^2}$. Here $r$ is the <strong>modulus</strong> and $\\theta = \\arg(z)$ is the <strong>phase</strong> (the angle from the positive real axis). Euler's formula $$e^{i\\theta} = \\cos(\\theta) + i\\sin(\\theta)$$ is the bridge between exponentials and trigonometry. It makes oscillation problems vastly easier because differentiation just multiplies by $i\\omega$.", interactive: "euler-circle" },
      { heading: "Why physicists love $e^{i\\omega t}$", body: "Exponentials are for linear differential equations what complex numbers are for algebraic equations. Any linear differential equation can be solved by exponentials. If we had $a \\, (d^3/dt^3)x + b \\, (d^2/dt^2)x + c \\, (d/dt)x + dx = 0$, we can factor this into $(d/dt - r_1)(d/dt - r_2)(d/dt - r_3)x(t) = 0$. Each factor gives a solution of the form $x(t) = e^{ir_j t}$. So we're always going to have exponential solutions to linear equations. When you write $x(t) = \\text{Re}[A e^{i\\omega t}]$, differentiating becomes trivial: $dx/dt = \\text{Re}[i\\omega A e^{i\\omega t}]$. The complex exponential turns differential equations into algebraic equations. After solving for the complex amplitude, you take the real part at the end.", interactive: null }
    ],
    exercises: [
      { question: "Write $z = 3 + 4i$ in polar form. What are $r$ and $\\theta$?", answer: "$r = \\sqrt{9+16} = 5$, $\\theta = \\arctan(4/3) \\approx 53.1°$. So $z = 5 e^{i\\arctan(4/3)}$." },
      { question: "Compute $(1+i)^4$ using polar form.", answer: "$1+i = \\sqrt{2}\\, e^{i\\pi/4}$. Raising to the 4th power: $(\\sqrt{2})^4 e^{i \\cdot 4\\pi/4} = 4 e^{i\\pi} = -4$." },
      { question: "Show that $|e^{i\\theta}| = 1$ for any real $\\theta$.", answer: "$|e^{i\\theta}|^2 = e^{i\\theta} e^{-i\\theta} = e^0 = 1$, so $|e^{i\\theta}| = 1$. The complex exponential always lies on the unit circle." }
    ]
  },
  {
    id: "taylor-series",
    title: "Taylor Series & Approximations",
    sections: [
      { heading: "The idea of local approximation", body: "A Taylor series approximates a function near a point by matching its value and all its derivatives there. $$f(x) = f(a) + f'(a)(x-a) + \\frac{f''(a)}{2!}(x-a)^2 + \\cdots$$ The more terms you keep, the better the approximation over a wider range.", interactive: null },
      { heading: "Leading-order approximations", body: "In physics, we often only need the first nontrivial term. For small $x$: $\\sin(x) \\approx x$, $\\cos(x) \\approx 1 - x^2/2$, $e^x \\approx 1 + x$, $(1+x)^n \\approx 1 + nx$. These approximations are the workhorses of physics, valid when $x \\ll 1$.", interactive: null },
      { heading: "Taylor expansion of potentials", body: "Near a minimum of $V(x)$, $V'(x_0) = 0$, so $V(x) \\approx V(x_0) + \\frac{1}{2}V''(x_0)(x - x_0)^2$. This is why every potential near equilibrium looks like a harmonic oscillator -- the quadratic term always dominates for small displacements.", interactive: null },
      { heading: "When approximations break down", body: "Taylor approximations fail when the expansion parameter is not small. For the discrete dispersion relation $\\omega = 2\\omega_0 |\\sin(ka/2)|$, the approximation $\\omega \\approx \\omega_0 ka$ works only when $ka \\ll 1$, i.e., wavelengths much longer than the lattice spacing.", interactive: null }
    ],
    exercises: [
      { question: "Expand $\\cos(x)$ to fourth order about $x = 0$.", answer: "$\\cos(x) = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots = 1 - \\frac{x^2}{2} + \\frac{x^4}{24}$." },
      { question: "For a pendulum, the exact restoring torque involves $\\sin(\\theta)$. For small angles, why does the period not depend on amplitude?", answer: "For small $\\theta$, $\\sin(\\theta) \\approx \\theta$, making the equation of motion linear: $\\ddot{\\theta} = -(g/L)\\theta$. The frequency $\\omega = \\sqrt{g/L}$ is independent of amplitude because the equation is linear." },
      { question: "What is the leading correction to the approximation $\\sin(x) \\approx x$?", answer: "$\\sin(x) = x - x^3/6 + \\cdots$, so the leading correction is $-x^3/6$. The relative error is about $x^2/6$." }
    ]
  },
  {
    id: "solving-odes",
    title: "Solving Linear ODEs",
    sections: [
      { heading: "The exponential ansatz", body: "For a linear ODE with constant coefficients like $a\\ddot{x} + b\\dot{x} + cx = 0$, guess $x = e^{\\alpha t}$. Substituting gives $(a\\alpha^2 + b\\alpha + c)e^{\\alpha t} = 0$. Since $e^{\\alpha t}$ is never zero, the characteristic equation $a\\alpha^2 + b\\alpha + c = 0$ determines $\\alpha$.", interactive: null },
      { heading: "The characteristic equation", body: "The characteristic equation is a polynomial in $\\alpha$ whose roots give the time dependence of the solution. For a second-order equation, there are two roots. Real roots give exponential growth or decay. Complex roots $\\alpha = \\sigma \\pm i\\omega$ give oscillation: $e^{\\sigma t}(A\\cos(\\omega t) + B\\sin(\\omega t))$.", interactive: null },
      { heading: "Particular solutions for driven systems", body: "For $\\ddot{x} + \\gamma\\dot{x} + \\omega_0^2 x = F_0\\cos(\\omega_d t)$, try $x_p = \\text{Re}[z_0 e^{-i\\omega_d t}]$. Substitute to get $z_0 = F_0/(\\omega_0^2 - \\omega_d^2 - i\\gamma\\omega_d)$. The real part gives the steady-state amplitude and phase.", interactive: null },
      { heading: "General solution = homogeneous + particular", body: "The general solution is $x(t) = x_h(t) + x_p(t)$, where $x_h$ contains two arbitrary constants set by initial conditions and $x_p$ is the particular solution. For a damped system, $x_h$ dies away exponentially, leaving only $x_p$ at long times.", interactive: null }
    ],
    exercises: [
      { question: "Find the general solution of $\\ddot{x} + 4x = 0$.", answer: "Characteristic equation: $\\alpha^2 + 4 = 0$, so $\\alpha = \\pm 2i$. General solution: $x(t) = A\\cos(2t) + B\\sin(2t)$, or equivalently $x(t) = C\\cos(2t + \\phi)$." },
      { question: "Solve $\\ddot{x} + 2\\dot{x} + x = 0$ and classify the damping.", answer: "$\\alpha^2 + 2\\alpha + 1 = (\\alpha + 1)^2 = 0$, so $\\alpha = -1$ (repeated root). $x(t) = (A + Bt)e^{-t}$. This is critically damped." },
      { question: "For $\\ddot{x} + \\dot{x} + x = \\cos(2t)$, find the steady-state amplitude.", answer: "$z_0 = 1/(1 - 4 - 2i) = 1/(-3 - 2i) = (-3 + 2i)/13$. Amplitude $= |z_0| = \\sqrt{9+4}/13 = \\sqrt{13}/13 = 1/\\sqrt{13}$." }
    ]
  },
  {
    id: "eigenvalues",
    title: "Eigenvalues & Normal Modes",
    sections: [
      { heading: "The eigenvalue equation", body: "An eigenvalue problem asks: for what values of $\\lambda$ does $A\\vec{v} = \\lambda\\vec{v}$ have a nonzero solution $\\vec{v}$? This happens exactly when $\\det(A - \\lambda I) = 0$. The values of $\\lambda$ are eigenvalues; the corresponding vectors $\\vec{v}$ are eigenvectors.", interactive: null },
      { heading: "Physical meaning: normal modes", body: "For coupled oscillators, the equations of motion can be written as $M\\ddot{x} = -Kx$. Guessing $x = \\vec{v}\\,e^{i\\omega t}$ gives $K\\vec{v} = \\omega^2 M\\vec{v}$, an eigenvalue problem. Each eigenvalue $\\omega^2$ gives a normal mode frequency, and the eigenvector $\\vec{v}$ gives the pattern of motion in that mode.", interactive: null },
      { heading: "The determinant condition", body: "For a 2x2 matrix $\\begin{bmatrix}a & b\\\\c & d\\end{bmatrix}$, $\\det(A - \\lambda I) = (a-\\lambda)(d-\\lambda) - bc = 0$ gives $\\lambda^2 - (a+d)\\lambda + (ad-bc) = 0$. The sum of eigenvalues equals the trace, and the product equals the determinant.", interactive: null },
      { heading: "Diagonalization", body: "If a matrix has $n$ linearly independent eigenvectors, it can be diagonalized: $A = PDP^{-1}$, where $D$ is the diagonal matrix of eigenvalues and $P$ has eigenvectors as columns. In the eigenvector basis, the coupled system decouples into independent oscillators.", interactive: null }
    ],
    exercises: [
      { question: "Find the eigenvalues of the matrix $\\begin{bmatrix}3 & 1\\\\1 & 3\\end{bmatrix}$.", answer: "$\\det\\begin{bmatrix}3-\\lambda & 1\\\\1 & 3-\\lambda\\end{bmatrix} = (3-\\lambda)^2 - 1 = 0$, so $\\lambda = 3 \\pm 1 = 4$ or $2$. Eigenvectors: $(1,1)$ for $\\lambda=4$ and $(1,-1)$ for $\\lambda=2$." },
      { question: "Two identical masses $m$ connected by springs with $k$ and coupling $\\kappa$. What are the normal mode frequencies?", answer: "$\\omega_1^2 = k/m$ (symmetric mode, masses move together) and $\\omega_2^2 = (k + 2\\kappa)/m$ (antisymmetric mode, masses move oppositely)." },
      { question: "Why must the eigenvalues of a real symmetric matrix be real?", answer: "If $A\\vec{v} = \\lambda\\vec{v}$, take the conjugate transpose: $\\vec{v}^\\dagger A = \\lambda^* \\vec{v}^\\dagger$ (since $A = A^\\dagger$). Then $\\vec{v}^\\dagger A\\vec{v} = \\lambda|\\vec{v}|^2 = \\lambda^*|\\vec{v}|^2$, so $\\lambda = \\lambda^*$." }
    ]
  },
  {
    id: "matrix-methods",
    title: "Matrix Methods for Coupled Systems",
    sections: [
      { heading: "Matrix multiplication", body: "The element $(AB)_{ij} = \\sum_k A_{ik} B_{kj}$. Physically, if $A$ and $B$ each represent a transformation, $AB$ represents doing $B$ first, then $A$. Matrix multiplication is associative but not commutative in general.", interactive: null },
      { heading: "Coupled equations as matrix problems", body: "The system $\\ddot{x}_1 = -2\\omega_0^2 x_1 + \\omega_0^2 x_2$ and $\\ddot{x}_2 = \\omega_0^2 x_1 - 2\\omega_0^2 x_2$ can be written as $\\ddot{x} = -Mx$ with $M = \\omega_0^2\\begin{bmatrix}2 & -1\\\\-1 & 2\\end{bmatrix}$. Diagonalizing $M$ solves the coupled system.", interactive: null },
      { heading: "The Jones vector for polarization", body: "A polarization state is described by a 2-vector $(E_x, E_y)$. Optical elements like polarizers and wave plates act as 2x2 matrices. A linear polarizer along $x$ is $\\begin{bmatrix}1 & 0\\\\0 & 0\\end{bmatrix}$. A quarter-wave plate is $\\begin{bmatrix}1 & 0\\\\0 & i\\end{bmatrix}$. The output polarization is the matrix times the input Jones vector.", interactive: null }
    ],
    exercises: [
      { question: "Compute $\\begin{bmatrix}1 & 2\\\\3 & 4\\end{bmatrix}\\begin{bmatrix}5\\\\6\\end{bmatrix}$.", answer: "$\\begin{bmatrix}1\\cdot5+2\\cdot6\\\\3\\cdot5+4\\cdot6\\end{bmatrix} = \\begin{bmatrix}17\\\\39\\end{bmatrix}$." },
      { question: "What is the Jones vector for right circular polarization, and what happens when you pass it through a linear polarizer along $x$?", answer: "Right circular: $\\frac{1}{\\sqrt{2}}(1, -i)$. Through $x$-polarizer $\\begin{bmatrix}1 & 0\\\\0 & 0\\end{bmatrix}$: result is $\\frac{1}{\\sqrt{2}}(1, 0)$. The intensity is $1/2$ of the input." },
      { question: "If $A$ and $B$ are 2x2 matrices, is $AB = BA$ in general? Give a counterexample.", answer: "No. For $A = \\begin{bmatrix}1 & 1\\\\0 & 1\\end{bmatrix}$ and $B = \\begin{bmatrix}1 & 0\\\\1 & 1\\end{bmatrix}$: $AB = \\begin{bmatrix}2 & 1\\\\1 & 1\\end{bmatrix}$ but $BA = \\begin{bmatrix}1 & 1\\\\1 & 2\\end{bmatrix}$. They differ." }
    ]
  },
  {
    id: "orthogonality",
    title: "Orthogonality & Inner Products",
    sections: [
      { heading: "Inner products of functions", body: "The inner product of two functions on $[0, L]$ is $\\langle f, g\\rangle = \\int_0^L f(x)\\,g(x)\\,dx$. Two functions are orthogonal if $\\langle f, g\\rangle = 0$. This generalizes the dot product of vectors to infinite-dimensional function spaces.", interactive: null },
      { heading: "Orthogonality of sines and cosines", body: "On $[0, L]$, the functions $\\sin(n\\pi x/L)$ are mutually orthogonal: $\\int \\sin(n\\pi x/L)\\sin(m\\pi x/L)\\,dx = 0$ when $n \\neq m$, and $= L/2$ when $n = m$. Similarly for cosines. This orthogonality is what makes Fourier analysis work.", interactive: null },
      { heading: "Kronecker delta and completeness", body: "Orthonormality is expressed as $\\langle\\phi_n,\\phi_m\\rangle = \\delta_{nm}$, where the Kronecker delta is 1 if $n=m$ and 0 otherwise. A set is complete if any function in the space can be expanded as $f = \\sum c_n\\phi_n$, with $c_n = \\langle\\phi_n, f\\rangle$.", interactive: null },
      { heading: "Extracting coefficients", body: "If $f = \\sum c_n\\phi_n$ and the $\\phi_n$ are orthonormal, then $c_m = \\langle\\phi_m, f\\rangle = \\int \\phi_m(x)\\,f(x)\\,dx$. Each coefficient is computed independently thanks to orthogonality. This is the key step in Fourier analysis.", interactive: null }
    ],
    exercises: [
      { question: "Verify that $\\sin(\\pi x/L)$ and $\\sin(2\\pi x/L)$ are orthogonal on $[0, L]$.", answer: "$\\int_0^L \\sin(\\pi x/L)\\sin(2\\pi x/L)\\,dx = \\int_0^L \\frac{1}{2}[\\cos(\\pi x/L) - \\cos(3\\pi x/L)]\\,dx = 0$, since both cosines integrate to zero over a full number of half-periods." },
      { question: "For the expansion $f(x) = \\sum b_n\\sin(n\\pi x/L)$, derive the formula for $b_n$.", answer: "Multiply both sides by $\\sin(m\\pi x/L)$ and integrate: $\\int f(x)\\sin(m\\pi x/L)\\,dx = \\sum b_n(L/2)\\delta_{nm} = b_m L/2$. So $b_m = (2/L)\\int f(x)\\sin(m\\pi x/L)\\,dx$." }
    ]
  },
  {
    id: "integration-techniques",
    title: "Integration Techniques for Waves",
    sections: [
      { heading: "Integration by parts", body: "$\\int u\\,dv = uv - \\int v\\,du$. Choose $u$ to be the function that simplifies when differentiated, and $dv$ to be the function that is easy to integrate. Common in wave physics: integrating $\\int x\\sin(nx)\\,dx$, or computing Fourier coefficients of piecewise functions.", interactive: null },
      { heading: "Trig integrals", body: "$\\int \\sin^2(x)\\,dx = x/2 - \\sin(2x)/4$. $\\int \\sin(ax)\\cos(bx)\\,dx$ uses the product-to-sum identity. $\\int \\sin(ax)\\sin(bx)\\,dx$ over a full period gives zero unless $a = b$ (orthogonality). These show up constantly in energy and power calculations.", interactive: null },
      { heading: "Gaussian integrals", body: "$$\\int_{-\\infty}^{\\infty} e^{-ax^2}\\,dx = \\sqrt{\\pi/a}$$ With $x^2$ in front: $\\int x^2 e^{-ax^2}\\,dx = \\sqrt{\\pi}/(2a^{3/2})$. These appear in wavepacket calculations and quantum mechanics.", interactive: null }
    ],
    exercises: [
      { question: "Compute $\\int_0^\\pi x\\sin(x)\\,dx$ using integration by parts.", answer: "$u = x$, $dv = \\sin(x)\\,dx$. Then $du = dx$, $v = -\\cos(x)$. $\\int = [-x\\cos(x)]_0^\\pi + \\int \\cos(x)\\,dx = \\pi + [\\sin(x)]_0^\\pi = \\pi$." },
      { question: "Show that the time-averaged value of $\\sin^2(\\omega t)$ is $1/2$.", answer: "Average over one period $T = 2\\pi/\\omega$: $(1/T)\\int \\sin^2(\\omega t)\\,dt = (1/T)(T/2) = 1/2$. Alternatively, $\\sin^2 = (1 - \\cos(2\\omega t))/2$, and the cosine averages to zero." },
      { question: "Evaluate $\\int_{-\\infty}^{\\infty} e^{-x^2/2}\\,dx$.", answer: "This is a Gaussian with $a = 1/2$, so the result is $\\sqrt{\\pi/(1/2)} = \\sqrt{2\\pi}$." }
    ]
  },
  {
    id: "fourier-math",
    title: "Fourier Series Mathematics",
    sections: [
      { heading: "The Fourier coefficients formula", body: "For a function with period $L$: $$a_0 = \\frac{2}{L}\\int f(x)\\,dx, \\quad a_n = \\frac{2}{L}\\int f(x)\\cos\\!\\left(\\frac{2\\pi n x}{L}\\right)dx, \\quad b_n = \\frac{2}{L}\\int f(x)\\sin\\!\\left(\\frac{2\\pi n x}{L}\\right)dx$$ These formulas extract the $n$th harmonic from $f$ by exploiting orthogonality.", interactive: null },
      { heading: "Convergence of Fourier series", body: "For a piecewise smooth function, the Fourier series converges to $f(x)$ at points of continuity and to the average of left and right limits at jumps. The rate of convergence depends on smoothness: smoother functions have faster-decaying coefficients.", interactive: null },
      { heading: "Parseval's theorem", body: "The total energy (mean square value) of a signal equals the sum of the squared Fourier coefficients: $$\\frac{1}{L}\\int |f(x)|^2\\,dx = \\frac{|a_0|^2}{4} + \\frac{1}{2}\\sum\\left(|a_n|^2 + |b_n|^2\\right)$$ Energy is conserved between the time/space domain and the frequency domain.", interactive: null },
      { heading: "Exponential form", body: "Using $c_n = \\frac{1}{L}\\int f(x)\\,e^{-i2\\pi nx/L}\\,dx$, the Fourier series becomes $f(x) = \\sum c_n\\,e^{i2\\pi nx/L}$. The exponential form is more compact and is the stepping stone to the Fourier transform.", interactive: null }
    ],
    exercises: [
      { question: "Compute the Fourier sine coefficients $b_n$ for the sawtooth wave $f(x) = x$ on $[0, L]$.", answer: "$b_n = \\frac{2}{L}\\int_0^L x\\sin(2\\pi nx/L)\\,dx$. Integration by parts gives $b_n = -L/(n\\pi)$. The series is $f(x) = -\\frac{L}{\\pi}\\sum \\frac{1}{n}\\sin(2\\pi nx/L)$." },
      { question: "Why does the Fourier series of a square wave only contain odd harmonics?", answer: "A square wave is an odd function with half-wave symmetry: $f(x + L/2) = -f(x)$. This symmetry forces all even Fourier coefficients to vanish." },
      { question: "State Parseval's theorem in words and explain what it means physically.", answer: "The total power of a signal equals the sum of the powers of its harmonic components. Energy is neither created nor destroyed by the Fourier decomposition -- it is just redistributed among frequencies." }
    ]
  },
  {
    id: "fourier-transform-math",
    title: "Fourier Transform Mathematics",
    sections: [
      { heading: "The $L \\to \\infty$ limit", body: "As the period $L$ goes to infinity, the discrete frequencies $k_n = 2\\pi n/L$ become continuous, the spacing $\\Delta k = 2\\pi/L$ shrinks to $dk$, and the sum over $n$ becomes an integral over $k$. The Fourier series coefficients become the Fourier transform $\\tilde{f}(k)$.", interactive: null },
      { heading: "The delta function", body: "The Dirac delta function $\\delta(x)$ is zero everywhere except at $x = 0$, with $\\int \\delta(x)\\,dx = 1$. Its Fourier transform is 1 (constant), meaning a perfectly localized spike contains all frequencies equally. Conversely, a single frequency $e^{ikx}$ transforms to a delta function $\\delta(k - k_0)$.", interactive: null },
      { heading: "Convolution theorem", body: "The Fourier transform of a product is a convolution, and vice versa. If $h(x) = \\int f(x')\\,g(x - x')\\,dx'$, then $\\tilde{h}(k) = \\tilde{f}(k)\\,\\tilde{g}(k)$. This is immensely useful: multiplication in one domain corresponds to convolution in the other.", interactive: null },
      { heading: "Uncertainty principle", body: "A function cannot be simultaneously narrow in both $x$ and $k$. Quantitatively, $\\Delta x\\,\\Delta k \\geq 1/2$. For Gaussian wavepackets, equality holds. This is the mathematical backbone of the Heisenberg uncertainty principle in quantum mechanics.", interactive: null }
    ],
    exercises: [
      { question: "What is the Fourier transform of a Gaussian $f(x) = e^{-x^2/(2\\sigma^2)}$?", answer: "$\\tilde{f}(k) = \\sigma\\sqrt{2\\pi}\\,e^{-\\sigma^2 k^2/2}$. A Gaussian transforms to a Gaussian. The wider the original (large $\\sigma$), the narrower the transform." },
      { question: "Show that the Fourier transform of $f'(x)$ is $ik\\,\\tilde{f}(k)$.", answer: "$\\text{FT}[f'] = \\int f'(x)\\,e^{-ikx}\\,dx$. Integrate by parts: $[f\\,e^{-ikx}]$ (vanishes at infinity) $+ ik\\int f(x)\\,e^{-ikx}\\,dx = ik\\,\\tilde{f}(k)$." },
      { question: "If a wavepacket has spatial width $\\Delta x = 1$ nm, what is the minimum spread in wavenumber?", answer: "$\\Delta k \\geq 1/(2\\Delta x) = 0.5\\;\\text{nm}^{-1} = 5 \\times 10^8\\;\\text{m}^{-1}$. You cannot have a pulse narrower than 1 nm without this minimum spread in $k$." }
    ]
  },
  {
    id: "dirac-delta-math",
    title: "The Dirac Delta Function",
    sections: [
      { heading: "Definition via the Fourier transform", body: "The Dirac delta function arises naturally from the Fourier transform of a constant. Starting from $f(t) = 1$, its Fourier transform is $$\\delta(\\omega) \\equiv \\frac{1}{2\\pi} \\int_{-\\infty}^{\\infty} e^{-i\\omega t}\\,dt$$ and its inverse gives $$1 = \\int_{-\\infty}^{\\infty} \\delta(\\omega)\\,e^{i\\omega t}\\,d\\omega$$ The delta function is zero everywhere except at the origin, where it is infinite, yet its integral is exactly 1.", interactive: null },
      { heading: "The sifting property", body: "The defining property of $\\delta(x)$ is the sifting property: for any smooth function $f(x)$, $$\\int_{-\\infty}^{\\infty} \\delta(x)\\,f(x)\\,dx = f(0)$$ More generally, $\\int \\delta(x - a)\\,f(x)\\,dx = f(a)$. The delta function picks out the value of $f$ at a single point. This follows from the Fourier inversion theorem: writing $f(x) = \\int dk\\,e^{ikx}\\,\\tilde{f}(k) = \\int dy\\,\\delta(y - x)\\,f(y)$.", interactive: null },
      { heading: "Distributions vs. functions", body: "The delta function is not an ordinary function — it belongs to a class of objects called distributions. While functions map numbers to numbers (like $f(x) = x^2$), distributions only produce numbers after being integrated against a test function. The expression $\\delta(x) = 0$ for $x \\neq 0$ with $\\int \\delta(x)\\,dx = 1$ makes no sense for an ordinary function, but is perfectly well-defined for a distribution.", interactive: null },
      { heading: "Representations as limits", body: "A practical way to work with $\\delta(x)$ is as the limit of a sequence of ordinary functions that become increasingly narrow and tall while keeping unit area: $$\\delta(x) = \\lim_{\\epsilon \\to 0} \\frac{1}{\\pi}\\frac{\\epsilon}{x^2 + \\epsilon^2} \\quad\\text{(Lorentzian)}$$ $$\\delta(x) = \\lim_{\\epsilon \\to 0} \\frac{1}{\\sqrt{4\\pi\\epsilon}}\\,e^{-x^2/(4\\epsilon)} \\quad\\text{(Gaussian)}$$ To verify these, integrate against a smooth test function $g(x)$ and check the sifting property in the limit.", interactive: null },
      { heading: "Physical interpretation", body: "The Fourier transform of $\\delta(t)$ is a constant: an infinitely sharp pulse contains all frequencies equally (white noise). Conversely, the Fourier transform of a constant $f(t) = 1$ is $\\delta(\\omega)$: a signal that never varies has only zero frequency. A single frequency $e^{ik_0 x}$ transforms to $\\delta(k - k_0)$, confirming that a pure plane wave has a perfectly defined wavenumber. These Fourier pairs are fundamental to understanding spectral analysis.", interactive: null }
    ],
    exercises: [
      { question: "Using the Lorentzian representation $\\delta(x) = \\lim_{\\epsilon \\to 0} (1/\\pi)\\,\\epsilon/(x^2 + \\epsilon^2)$, show that $\\int_{-\\infty}^{\\infty} \\delta(x)\\,dx = 1$ for all $\\epsilon > 0$.", answer: "$\\int (1/\\pi)\\,\\epsilon/(x^2 + \\epsilon^2)\\,dx = (1/\\pi)[\\arctan(x/\\epsilon)]_{-\\infty}^{\\infty} = (1/\\pi)(\\pi/2 - (-\\pi/2)) = 1$." },
      { question: "Evaluate $\\int_{-\\infty}^{\\infty} \\delta(x - 3)\\,(x^2 + 1)\\,dx$.", answer: "By the sifting property, $\\int \\delta(x - 3)\\,f(x)\\,dx = f(3) = 3^2 + 1 = 10$." },
      { question: "What is the Fourier transform of $\\delta(t - t_0)$?", answer: "$\\tilde{f}(\\omega) = (1/2\\pi)\\int \\delta(t - t_0)\\,e^{-i\\omega t}\\,dt = (1/2\\pi)\\,e^{-i\\omega t_0}$. A shifted delta picks up a phase factor proportional to the shift." }
    ]
  },
  {
    id: "pde-basics",
    title: "Partial Differential Equations",
    sections: [
      { heading: "Partial derivatives", body: "A partial derivative $\\partial f/\\partial x$ treats all other variables as constants. For $f(x,t) = \\sin(kx - \\omega t)$, $\\partial f/\\partial x = k\\cos(kx - \\omega t)$ and $\\partial f/\\partial t = -\\omega\\cos(kx - \\omega t)$. The wave equation relates the second partial derivatives in space and time.", interactive: null },
      { heading: "Separation of variables", body: "To solve $\\frac{\\partial^2 u}{\\partial t^2} = v^2 \\frac{\\partial^2 u}{\\partial x^2}$, guess $u(x,t) = X(x)T(t)$. Then $T''/T = v^2 X''/X$. Since the left side depends only on $t$ and the right only on $x$, both must equal a constant. This splits one PDE into two ODEs.", interactive: null },
      { heading: "Boundary conditions", body: "A PDE needs boundary conditions to have a unique solution. Fixed ends: $u(0,t) = u(L,t) = 0$ select standing wave modes $\\sin(n\\pi x/L)$. Free ends give cosine modes. The boundary conditions determine which normal modes are allowed.", interactive: null },
      { heading: "The wave equation and its solutions", body: "$\\frac{\\partial^2 u}{\\partial t^2} = v^2 \\frac{\\partial^2 u}{\\partial x^2}$ has general solution $u = f(x - vt) + g(x + vt)$: any shape traveling right plus any shape traveling left. Standing waves $\\sin(kx)\\cos(\\omega t)$ are the special case where the right and left movers have equal amplitude.", interactive: null }
    ],
    exercises: [
      { question: "Verify that $u(x,t) = A\\sin(kx)\\cos(\\omega t)$ satisfies the wave equation if $\\omega = vk$.", answer: "$\\partial^2 u/\\partial t^2 = -\\omega^2 A\\sin(kx)\\cos(\\omega t)$. $v^2\\partial^2 u/\\partial x^2 = -v^2 k^2 A\\sin(kx)\\cos(\\omega t)$. These are equal when $\\omega^2 = v^2 k^2$, i.e. $\\omega = vk$." },
      { question: "For a string of length $L$ with fixed ends, what are the allowed wavelengths?", answer: "The mode shapes are $\\sin(n\\pi x/L)$, so $k_n = n\\pi/L$ and $\\lambda_n = 2L/n$. The longest wavelength is $\\lambda_1 = 2L$ (the fundamental)." },
      { question: "Why does separation of variables work? What is the key assumption?", answer: "It assumes the solution factors as $u(x,t) = X(x)T(t)$. When substituted into the PDE, the variables separate, and since a function of $t$ alone cannot equal a function of $x$ alone (unless both are constant), each side must equal the same constant." }
    ]
  },
  {
    id: "vector-calculus",
    title: "Vector Calculus for EM Waves",
    sections: [
      { heading: "Gradient", body: "The gradient $\\nabla f = (\\partial f/\\partial x,\\, \\partial f/\\partial y,\\, \\partial f/\\partial z)$ points in the direction of steepest increase. Its magnitude is the rate of change in that direction. For electromagnetic waves, the gradient of the scalar potential is related to the electric field.", interactive: null },
      { heading: "Divergence", body: "$\\nabla \\cdot \\vec{F} = \\partial F_x/\\partial x + \\partial F_y/\\partial y + \\partial F_z/\\partial z$ measures the net outward flux per unit volume. Gauss's law $\\nabla \\cdot \\vec{E} = \\rho/\\epsilon_0$ says charges are sources of electric field lines. In vacuum ($\\rho = 0$), $\\nabla \\cdot \\vec{E} = 0$.", interactive: null },
      { heading: "Curl", body: "$\\nabla \\times \\vec{F}$ measures the circulation per unit area. Faraday's law $\\nabla \\times \\vec{E} = -\\partial\\vec{B}/\\partial t$ says a changing magnetic field creates a circulating electric field. Ampere's law $\\nabla \\times \\vec{B} = \\mu_0\\epsilon_0\\,\\partial\\vec{E}/\\partial t$ says a changing electric field creates a circulating magnetic field. These two curls are the engine of electromagnetic waves.", interactive: null },
      { heading: "The vector identity for wave equations", body: "$\\nabla \\times (\\nabla \\times \\vec{F}) = \\nabla(\\nabla \\cdot \\vec{F}) - \\nabla^2\\vec{F}$. Since $\\nabla \\cdot \\vec{E} = 0$ in vacuum, $\\nabla \\times (\\nabla \\times \\vec{E}) = -\\nabla^2\\vec{E}$. Combined with $\\nabla \\times \\vec{E} = -\\partial\\vec{B}/\\partial t$ and $\\nabla \\times \\vec{B} = \\mu_0\\epsilon_0\\,\\partial\\vec{E}/\\partial t$, this gives the wave equation $\\nabla^2\\vec{E} = \\mu_0\\epsilon_0\\,\\partial^2\\vec{E}/\\partial t^2$.", interactive: null }
    ],
    exercises: [
      { question: "Compute the divergence of $\\vec{F} = (x^2,\\, xy,\\, z)$.", answer: "$\\nabla \\cdot \\vec{F} = 2x + x + 1 = 3x + 1$." },
      { question: "Why does $\\nabla \\cdot \\vec{B} = 0$ imply there are no magnetic monopoles?", answer: "$\\nabla \\cdot \\vec{B} = 0$ means the net magnetic flux out of any closed surface is zero. Every field line that enters a region must also leave it. There is no point source of magnetic field lines (no monopole)." },
      { question: "Starting from $\\nabla \\times \\vec{E} = -\\partial\\vec{B}/\\partial t$ and $\\nabla \\times \\vec{B} = \\mu_0\\epsilon_0\\,\\partial\\vec{E}/\\partial t$, derive the wave equation for $\\vec{E}$.", answer: "Take curl of the first: $\\nabla \\times (\\nabla \\times \\vec{E}) = -\\partial/\\partial t(\\nabla \\times \\vec{B}) = -\\mu_0\\epsilon_0\\,\\partial^2\\vec{E}/\\partial t^2$. Use $\\nabla \\times (\\nabla \\times \\vec{E}) = -\\nabla^2\\vec{E}$ (since $\\nabla \\cdot \\vec{E} = 0$) to get $\\nabla^2\\vec{E} = \\mu_0\\epsilon_0\\,\\partial^2\\vec{E}/\\partial t^2$." }
    ]
  },
  {
    id: "probability-waves",
    title: "Probability & Wavefunctions",
    sections: [
      { heading: "Probability density", body: "In quantum mechanics, the wavefunction $\\psi(x,t)$ is a complex-valued function whose squared magnitude $|\\psi(x,t)|^2$ gives the probability density. The probability of finding the particle between $x$ and $x+dx$ is $|\\psi|^2\\,dx$.", interactive: null },
      { heading: "Normalization", body: "The total probability must be 1: $\\int_{-\\infty}^{\\infty} |\\psi(x)|^2\\,dx = 1$. This fixes the overall amplitude of the wavefunction. Not all solutions of the Schrodinger equation are normalizable -- only the physically meaningful ones.", interactive: null },
      { heading: "Expectation values", body: "The expected value of position is $\\langle x\\rangle = \\int x\\,|\\psi|^2\\,dx$. For any observable $A$ with operator $\\hat{A}$, $\\langle A\\rangle = \\int \\psi^* \\hat{A}\\psi\\,dx$. The variance $(\\Delta x)^2 = \\langle x^2\\rangle - \\langle x\\rangle^2$ measures the spread of the probability distribution.", interactive: null },
      { heading: "Connection to waves", body: "A plane wave $\\psi = e^{i(kx - \\omega t)}$ has a definite momentum $p = \\hbar k$ but is completely delocalized. A wavepacket is localized but has a spread of momenta. The uncertainty principle $\\Delta x\\,\\Delta p \\geq \\hbar/2$ follows directly from the wave nature of quantum particles.", interactive: null }
    ],
    exercises: [
      { question: "Normalize $\\psi(x) = Ae^{-|x|/a}$ by finding $A$.", answer: "$\\int |A|^2 e^{-2|x|/a}\\,dx = 2|A|^2\\int_0^\\infty e^{-2x/a}\\,dx = 2|A|^2(a/2) = |A|^2 a = 1$. So $A = 1/\\sqrt{a}$." },
      { question: "For a particle in a box with $\\psi_n = \\sqrt{2/L}\\sin(n\\pi x/L)$, compute $\\langle x\\rangle$.", answer: "$\\langle x\\rangle = (2/L)\\int_0^L x\\sin^2(n\\pi x/L)\\,dx = L/2$. By symmetry, the expected position is always the center of the box." },
      { question: "Why can the wavefunction be complex even though probabilities must be real?", answer: "The wavefunction is an amplitude, not a probability. The probability $|\\psi|^2 = \\psi^*\\psi$ is always real and non-negative. The complex phase of $\\psi$ encodes information about momentum and time evolution." }
    ]
  },
  {
    id: "trig-identities",
    title: "Trigonometric Identities for Waves",
    sections: [
      { heading: "Sum and difference formulas", body: "$\\cos(A \\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B$. $\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B$. These are essential for decomposing wave sums and deriving beat frequencies.", interactive: null },
      { heading: "Product-to-sum formulas", body: "$\\sin A\\sin B = \\tfrac{1}{2}[\\cos(A-B) - \\cos(A+B)]$. $\\cos A\\cos B = \\tfrac{1}{2}[\\cos(A-B) + \\cos(A+B)]$. $\\sin A\\cos B = \\tfrac{1}{2}[\\sin(A+B) + \\sin(A-B)]$. These convert products of oscillations into sums of different frequencies.", interactive: null },
      { heading: "Beating", body: "$$\\cos(\\omega_1 t) + \\cos(\\omega_2 t) = 2\\cos\\!\\left(\\frac{\\omega_1-\\omega_2}{2}t\\right)\\cos\\!\\left(\\frac{\\omega_1+\\omega_2}{2}t\\right)$$ When $\\omega_1$ and $\\omega_2$ are close, this is a fast oscillation at the average frequency modulated by a slow envelope at half the difference frequency. The envelope is the beat.", interactive: null },
      { heading: "Phase shifts and phasors", body: "$A\\cos(\\omega t) + B\\sin(\\omega t) = C\\cos(\\omega t + \\phi)$, where $C = \\sqrt{A^2 + B^2}$ and $\\tan(\\phi) = -B/A$. This lets you combine two oscillations at the same frequency into a single cosine with a phase shift.", interactive: null }
    ],
    exercises: [
      { question: "Derive the beat formula: $\\cos(\\omega_1 t) + \\cos(\\omega_2 t) = 2\\cos(\\Delta\\omega\\, t/2)\\cos(\\bar{\\omega}\\, t)$, where $\\Delta\\omega = \\omega_1 - \\omega_2$ and $\\bar{\\omega} = (\\omega_1 + \\omega_2)/2$.", answer: "Write $\\omega_1 = \\bar{\\omega} + \\Delta\\omega/2$ and $\\omega_2 = \\bar{\\omega} - \\Delta\\omega/2$. Then use $\\cos A + \\cos B = 2\\cos\\!\\left(\\frac{A-B}{2}\\right)\\cos\\!\\left(\\frac{A+B}{2}\\right)$." },
      { question: "Use a trig identity to show that $\\sin^2(x) + \\cos^2(x) = 1$.", answer: "From $\\cos(A-B) = \\cos A\\cos B + \\sin A\\sin B$, set $A = B = x$: $\\cos(0) = \\cos^2(x) + \\sin^2(x)$, and $\\cos(0) = 1$." },
      { question: "Write $3\\cos(\\omega t) + 4\\sin(\\omega t)$ as $C\\cos(\\omega t + \\phi)$. Find $C$ and $\\phi$.", answer: "$C = \\sqrt{9 + 16} = 5$. $\\tan(\\phi) = -4/3$, so $\\phi = -\\arctan(4/3) \\approx -53.1°$. The combined oscillation is $5\\cos(\\omega t - 53.1°)$." }
    ]
  },
  {
    id: "dimensional-analysis",
    title: "Dimensional Analysis & Scaling",
    sections: [
      { heading: "Checking units", body: "Every equation in physics must be dimensionally consistent. If the left side has units of meters per second, the right side must too. This provides an instant check on any formula. The wave equation $\\partial^2 u/\\partial t^2 = v^2\\,\\partial^2 u/\\partial x^2$ works because $[1/t^2] = [v^2/x^2] = [1/t^2]$.", interactive: null },
      { heading: "Scaling arguments", body: "Dimensional analysis can predict how quantities scale. The speed of waves on a string must depend on tension $T$ (force, $[MLT^{-2}]$) and linear density $\\mu$ ($[ML^{-1}]$). The only combination with units of speed is $\\sqrt{T/\\mu}$. No detailed derivation needed!", interactive: null },
      { heading: "Natural units and dimensionless numbers", body: "The quality factor $Q = \\omega_0/\\gamma$ is dimensionless: it counts the number of oscillations in a decay time. The Mach number $M = v_{\\text{source}}/v_{\\text{wave}}$ is dimensionless and determines whether shock waves form ($M > 1$). Dimensionless ratios often identify the important physics.", interactive: null }
    ],
    exercises: [
      { question: "Use dimensional analysis to find the speed of sound in terms of bulk modulus $B$ ($[ML^{-1}T^{-2}]$) and density $\\rho$ ($[ML^{-3}]$).", answer: "$[v] = [LT^{-1}]$. $B/\\rho$ has units $[L^2T^{-2}]$, so $v = \\sqrt{B/\\rho}$. This is the correct answer." },
      { question: "The de Broglie wavelength $\\lambda = h/p$. Check the dimensions.", answer: "$[h] = [ML^2T^{-1}]$ (energy times time). $[p] = [MLT^{-1}]$. $[h/p] = [L]$. So $\\lambda$ has units of length, as required." },
      { question: "A pendulum of length $L$ swings under gravity $g$. Use dimensional analysis to find the period.", answer: "$[T] = [T^1]$. $L/g$ has units $[T^2]$, so $T$ must be proportional to $\\sqrt{L/g}$. Dimensional analysis gives $T = C\\sqrt{L/g}$ where $C$ is a dimensionless constant (which turns out to be $2\\pi$)." }
    ]
  },
  {
    id: "small-angle-approximations",
    title: "Small Angle Approximations",
    sections: [
      { heading: "Why small angles matter", body: "Many physical systems involve angles that remain small during their motion. Pendulums swing through small arcs, waves on a string have gentle slopes, and elastic beams deflect only slightly. In all these cases, the exact trigonometric functions can be replaced by much simpler polynomial approximations, turning nonlinear problems into linear ones that we can solve.", interactive: null },
      { heading: "The key approximations", body: "For $\\theta$ measured in radians with $|\\theta| \\ll 1$: $$\\sin\\theta \\approx \\theta, \\qquad \\cos\\theta \\approx 1 - \\tfrac{1}{2}\\theta^2, \\qquad \\tan\\theta \\approx \\theta$$ These follow from the Taylor series of each function expanded about $\\theta = 0$. The error is of order $\\theta^3$ for sine and tangent, and $\\theta^4$ for cosine.", interactive: null },
      { heading: "Application to the wave equation", body: "When deriving the wave equation for a string, the exact transverse component of tension is $T\\sin\\theta$ where $\\theta$ is the angle the string makes with the horizontal. The slope of the string is $\\partial A/\\partial x = \\tan\\theta$. For small displacements, $\\sin\\theta \\approx \\tan\\theta \\approx \\partial A/\\partial x$, and this linearization is what gives us the linear wave equation. Without this approximation, the equation of motion would be nonlinear and much harder to solve.", interactive: null },
      { heading: "How small is small enough?", body: "At $\\theta = 0.1$ rad ($5.7°$), $\\sin\\theta$ differs from $\\theta$ by only 0.17%. At $\\theta = 0.3$ rad ($17°$), the error is 1.5%. At $\\theta = 0.5$ rad ($29°$), it is 4.7%. For most wave problems the slopes are far smaller than 0.1 rad, so the approximation is excellent. When amplitudes become large enough that the approximation breaks down, nonlinear wave phenomena like solitons and shock waves appear.", interactive: null }
    ],
    exercises: [
      { question: "Compute $\\sin(0.1)$ exactly and compare with the small-angle approximation. What is the relative error?", answer: "$\\sin(0.1) = 0.09983...$. The approximation gives $0.1$. Relative error: $(0.1 - 0.09983)/0.09983 \\approx 0.17\\%$." },
      { question: "In the derivation of the string wave equation, why do we approximate $\\sin\\theta \\approx \\tan\\theta$ rather than keeping the exact expression?", answer: "The exact transverse force involves $T\\sin\\theta = T\\tan\\theta/\\sqrt{1+\\tan^2\\theta}$. For small $\\theta$, $\\tan^2\\theta \\ll 1$, so $\\sqrt{1 + \\tan^2\\theta} \\approx 1$ and $\\sin\\theta \\approx \\tan\\theta = \\partial A/\\partial x$. This makes the equation linear in $A$." },
      { question: "For a pendulum with amplitude $\\theta_0 = 15°$, estimate the fractional error in the period from using the small-angle approximation.", answer: "The exact period correction is $T/T_0 \\approx 1 + \\theta_0^2/16 + ...$. With $\\theta_0 = 15° = 0.262$ rad, $\\theta_0^2/16 \\approx 0.0043$, so the error in the period is about 0.4%." }
    ]
  },
  {
    id: "partial-derivatives",
    title: "Partial Derivatives",
    sections: [
      { heading: "Functions of several variables", body: "A wave on a string is described by $A(x, t)$, a function of both position and time. To understand how the wave changes, we need to differentiate with respect to one variable while holding the other fixed. This is a partial derivative.", interactive: null },
      { heading: "Definition and notation", body: "The partial derivative of $f(x, t)$ with respect to $x$ is $$\\frac{\\partial f}{\\partial x} = \\lim_{\\Delta x \\to 0} \\frac{f(x + \\Delta x,\\, t) - f(x,\\, t)}{\\Delta x}$$ The $\\partial$ symbol (as opposed to $d$) reminds us that other variables are held constant. For $f(x,t) = \\sin(kx - \\omega t)$, $\\partial f/\\partial x = k\\cos(kx - \\omega t)$ and $\\partial f/\\partial t = -\\omega\\cos(kx - \\omega t)$.", interactive: null },
      { heading: "Second partial derivatives", body: "The wave equation involves second derivatives: $\\partial^2 A/\\partial x^2$ is the curvature of the string at a fixed instant, and $\\partial^2 A/\\partial t^2$ is the acceleration of a point on the string. The wave equation $\\partial^2 A/\\partial t^2 = v^2\\,\\partial^2 A/\\partial x^2$ says that the acceleration of each point is proportional to the local curvature.", interactive: null },
      { heading: "The chain rule for partial derivatives", body: "For a traveling wave $f(kx - \\omega t)$, define $u = kx - \\omega t$. Then $\\partial f/\\partial x = f'(u) \\cdot k$ and $\\partial f/\\partial t = f'(u) \\cdot (-\\omega)$. This gives $\\partial f/\\partial t = -(\\omega/k)\\,\\partial f/\\partial x = -v\\,\\partial f/\\partial x$, confirming that time evolution is equivalent to spatial translation at speed $v$.", interactive: null }
    ],
    exercises: [
      { question: "For $f(x, t) = e^{-(x - vt)^2}$, compute $\\partial f/\\partial x$ and $\\partial f/\\partial t$ and verify that $\\partial f/\\partial t = -v\\,\\partial f/\\partial x$.", answer: "$\\partial f/\\partial x = -2(x - vt)\\,e^{-(x-vt)^2}$. $\\partial f/\\partial t = 2v(x - vt)\\,e^{-(x-vt)^2}$. Indeed $\\partial f/\\partial t = -v \\cdot [-2(x-vt)\\,e^{-(x-vt)^2}] = -v\\,\\partial f/\\partial x$." },
      { question: "Compute $\\partial^2/\\partial x^2$ of $\\sin(kx - \\omega t)$ and verify it satisfies the wave equation with $v = \\omega/k$.", answer: "$\\partial^2 f/\\partial x^2 = -k^2\\sin(kx - \\omega t)$. $\\partial^2 f/\\partial t^2 = -\\omega^2\\sin(kx - \\omega t)$. The wave equation requires $-\\omega^2 = v^2(-k^2)$, i.e. $v = \\omega/k$." },
      { question: "Why does the wave equation involve $\\partial^2 A/\\partial x^2$ (curvature) rather than $\\partial A/\\partial x$ (slope)?", answer: "A straight segment of string, no matter how tilted, has equal and opposite tension forces at its two ends. Only when the string is curved do the forces fail to cancel, producing a net transverse force. The net force is proportional to the difference of slopes, which is the second spatial derivative." }
    ]
  }
];

const chapters = [
  {
    number: 1,
    title: "Oscillators & Linearity",
    slug: "oscillators-linearity",
    pdf: "./lectures/01-Oscillators-And-Linearity.pdf",
    conceptTitle: "Everything near equilibrium oscillates",
    conceptCaption: "Displace any system slightly from rest and a restoring force pulls it back, producing the universal language of simple harmonic motion.",
    explanation: [
      "Statistical mechanics starts from counting; waves start from a single oscillating thing. Any system near a stable equilibrium feels a restoring force proportional to displacement, which is <term key='hookes-law'>Hooke's law</term>. That universality is why oscillators appear everywhere in physics.",
      "The equation of motion for a <term key='sho'>simple harmonic oscillator</term> is linear, so solutions can be added together. Damping adds an exponential decay envelope, but the oscillatory character remains. <term key='linearity'>Linearity</term> is the property that will later let us build complex waves from simple ones."
    ],
    goals: [
      "Derive Hooke's law from a Taylor expansion of any potential near equilibrium.",
      "Solve the simple harmonic oscillator equation and interpret amplitude, frequency, and phase.",
      "Include damping and classify underdamped, critically damped, and overdamped motion."
    ],
    pitfalls: [
      "Thinking Hooke's law is special to springs rather than universal near equilibrium.",
      "Confusing angular frequency $\\omega_0$ with ordinary frequency $f = \\omega_0/2\\pi$.",
      "Forgetting that the damped solution still oscillates (underdamped) unless $\\gamma \\geq 2\\omega_0$."
    ],
    terms: {
      "hookes-law": {
        short: "Restoring force proportional to displacement: $F = -kx$.",
        long: "Hooke's law is not limited to springs. Any system displaced a small amount from stable equilibrium experiences a restoring force proportional to displacement, because the first nonzero term in a Taylor expansion of the potential about a minimum is quadratic."
      },
      sho: {
        short: "A system whose motion is described by $x(t) = A\\cos(\\omega_0 t + \\phi)$.",
        long: "The simple harmonic oscillator is the foundation of the entire course. Its solution is sinusoidal with frequency $\\omega_0 = \\sqrt{k/m}$, amplitude $A$, and phase $\\phi$ set by initial conditions. Every later topic is built on this."
      },
      linearity: {
        short: "If $x_1$ and $x_2$ are solutions, so is any combination $ax_1 + bx_2$.",
        long: "Linearity means the equation of motion has no powers or products of the unknown. It guarantees superposition, which is the reason Fourier analysis works and why complex exponentials are so powerful for solving wave problems."
      },
      damping: {
        short: "Energy loss that causes oscillation amplitude to decay.",
        long: "Adding a velocity-dependent friction term $\\gamma\\,dx/dt$ introduces three regimes: underdamped (oscillates with decaying envelope), critically damped, and overdamped (exponential return with no oscillation)."
      }
    },
    derivations: [
      {
        title: "Hooke's law from Taylor expansion",
        teaser: "Expand any potential about its minimum and keep the leading term.",
        steps: [
          "Write the potential energy $V(x)$ and note that at equilibrium $x=0$, $V'(0) = 0$ by definition.",
          "Taylor expand: $V(x) = V(0) + \\frac{1}{2}V''(0)\\,x^2 + \\cdots$",
          "The force is $F = -dV/dx = -V''(0)\\,x$, which is Hooke's law with $k = V''(0)$."
        ],
        result: "Any potential near a stable minimum gives a linear restoring force, so oscillation is the universal response to small displacement."
      },
      {
        title: "Solving the damped oscillator",
        teaser: "Guess an exponential $x = Ae^{\\alpha t}$ and find the two roots.",
        steps: [
          "Substitute $x = Ae^{\\alpha t}$ into $\\ddot{x} + \\gamma\\dot{x} + \\omega_0^2 x = 0$.",
          "Get the characteristic equation $\\alpha^2 + \\gamma\\alpha + \\omega_0^2 = 0$.",
          "Solve: $\\alpha = -\\gamma/2 \\pm \\sqrt{\\gamma^2/4 - \\omega_0^2}$. For $\\gamma < 2\\omega_0$, the square root is imaginary, giving oscillation inside a decaying envelope."
        ],
        result: "$x(t) = Ae^{-\\gamma t/2}\\cos(\\omega_d t + \\phi)$ with $\\omega_d = \\sqrt{\\omega_0^2 - \\gamma^2/4}$, showing oscillation at a slightly lower frequency than the natural frequency."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "Think of any object resting at the bottom of a bowl. Push it slightly and it rolls back and forth. The curvature of the bowl sets the frequency. This is the universal oscillator hiding in every stable system."
      },
      {
        title: "AI tutor prompt",
        body: "Why does the complex exponential $e^{i\\omega t}$ make solving linear oscillator equations easier than working directly with sines and cosines?"
      }
    ],
    quickActions: {
      intuition: "Everything near equilibrium oscillates because every smooth potential looks like a parabola at the bottom. The frequency depends on the curvature of the potential and the inertia of the system.",
      formal: "The chapter derives $\\ddot{x} + \\gamma\\dot{x} + \\omega_0^2 x = F(t)$ from Taylor expansion, solves the homogeneous case with complex exponentials, and classifies damping regimes by the discriminant.",
      quiz: "Checkpoint: explain why a pendulum, a vibrating molecule, and a mass on a spring all satisfy the same equation of motion near equilibrium."
    },
    prompts: [
      "What physical quantity determines the oscillation frequency of a simple harmonic oscillator?",
      "How does the behavior change qualitatively as damping increases from zero to above critical?"
    ],
    mathPrereqs: ["taylor-series", "solving-odes", "complex-numbers"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "oscillator"
  },
  {
    number: 2,
    title: "Driven Oscillators",
    slug: "driven-oscillators",
    pdf: "./lectures/02-Driven-Oscillators.pdf",
    conceptTitle: "Push at the right frequency and amplitude explodes",
    conceptCaption: "A periodic driving force pumps energy into an oscillator most efficiently when the drive frequency matches the natural frequency.",
    explanation: [
      "When you apply a periodic force to a damped oscillator, a steady-state response emerges at the <term key='driving-frequency'>driving frequency</term>. The amplitude of this response peaks sharply when the driving frequency equals the natural frequency, a phenomenon called <term key='resonance'>resonance</term>.",
      "The transient solution from initial conditions dies away exponentially due to damping, leaving only the driven steady-state. The <term key='amplitude-response'>amplitude response</term> and phase lag are both frequency-dependent, forming a Lorentzian peak whose width is set by damping."
    ],
    goals: [
      "Solve the driven-damped oscillator using complex exponentials.",
      "Identify the resonance peak and interpret its width in terms of damping.",
      "Separate transient behavior from the steady-state response."
    ],
    pitfalls: [
      "Forgetting that the steady-state response oscillates at the driving frequency, not the natural frequency.",
      "Assuming resonance means infinite amplitude without accounting for damping.",
      "Neglecting the transient solution when initial conditions matter."
    ],
    terms: {
      "driving-frequency": {
        short: "The frequency $\\omega_d$ of the externally applied force.",
        long: "The driving frequency is set by whatever pushes the oscillator. In steady state, the oscillator responds at exactly this frequency, not at its natural frequency. The distinction is crucial."
      },
      resonance: {
        short: "Maximum response when driving frequency matches natural frequency.",
        long: "Resonance occurs near $\\omega_d = \\omega_0$. The amplitude peaks to a value inversely proportional to the damping rate $\\gamma$. Sharper resonances mean more selective frequency response."
      },
      "amplitude-response": {
        short: "How the steady-state amplitude depends on drive frequency.",
        long: "The amplitude $A(\\omega_d) = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega_d^2)^2 + (\\gamma\\omega_d)^2}}$ is a Lorentzian curve centered near $\\omega_0$ with width proportional to $\\gamma$."
      },
      quality_factor: {
        short: "$Q = \\omega_0/\\gamma$ measures resonance sharpness.",
        long: "The quality factor counts roughly how many oscillations occur before the energy decays by a factor of $e$. High $Q$ means narrow resonance peak and selective frequency response."
      }
    },
    derivations: [
      {
        title: "Steady-state solution for a driven oscillator",
        teaser: "Use a complex exponential ansatz to turn the ODE into algebra.",
        steps: [
          "Write the driving force as $\\text{Re}(\\frac{F_0}{m}e^{-i\\omega_d t})$ and guess $z(t) = z_0 e^{-i\\omega_d t}$.",
          "Substitute into $\\ddot{z} + \\gamma\\dot{z} + \\omega_0^2 z = \\frac{F_0}{m}e^{-i\\omega_d t}$ to get $z_0 = \\frac{F_0/m}{\\omega_0^2 - \\omega_d^2 - i\\gamma\\omega_d}$.",
          "Take $x(t) = \\text{Re}[z(t)]$ and extract the amplitude and phase shift as functions of $\\omega_d$."
        ],
        result: "The amplitude peaks near $\\omega_d = \\omega_0$ with height proportional to $1/\\gamma$, and the phase shifts through $\\pi/2$ at resonance."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "Pushing a child on a swing: if you push at the natural frequency, energy accumulates and the swing goes higher and higher. Push at the wrong frequency and you sometimes fight the motion."
      },
      {
        title: "AI tutor prompt",
        body: "What happens to the resonance curve as damping approaches zero? Why is zero damping unphysical for a real system?"
      }
    ],
    quickActions: {
      intuition: "Resonance is the oscillator's sweet spot: drive at the natural frequency and the system absorbs energy most efficiently. Damping is what keeps the amplitude finite.",
      formal: "The chapter solves $\\ddot{x} + \\gamma\\dot{x} + \\omega_0^2 x = (F_0/m)\\cos(\\omega_d t)$ using complex exponentials, finds the Lorentzian amplitude response, and separates transients from steady state.",
      quiz: "Checkpoint: why does the steady-state response oscillate at the driving frequency rather than the natural frequency?"
    },
    prompts: [
      "What determines the width of the resonance peak?",
      "How does the phase lag between driving force and response change as you sweep through resonance?"
    ],
    mathPrereqs: ["complex-numbers", "solving-odes", "trig-identities"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "driven-oscillator"
  },
  {
    number: 3,
    title: "Coupled Oscillators",
    slug: "coupled-oscillators",
    pdf: "./lectures/03-Coupled-Oscillators.pdf",
    conceptTitle: "Connected oscillators share energy and create beats",
    conceptCaption: "When two oscillators are coupled, energy flows back and forth between them. The resulting motion is a superposition of normal modes.",
    explanation: [
      "Coupling two oscillators creates <term key='normal-modes'>normal modes</term>: special patterns of motion where everything oscillates at a single frequency. A general motion is a superposition of these modes.",
      "When two normal-mode frequencies are close, energy transfers back and forth between the oscillators, producing <term key='beats'>beats</term>. This is the first glimpse of how interacting oscillators behave differently from isolated ones."
    ],
    goals: [
      "Set up and solve the equations of motion for two coupled masses on springs.",
      "Find normal modes by diagonalizing the system (finding eigenvectors).",
      "Understand beats as the interference of two close frequencies."
    ],
    pitfalls: [
      "Thinking each mass oscillates independently once the coupling is included.",
      "Confusing normal mode frequencies with the frequencies seen at individual masses.",
      "Forgetting that beats require the two normal-mode frequencies to be close."
    ],
    terms: {
      "normal-modes": {
        short: "Patterns where the entire system oscillates at one frequency.",
        long: "A normal mode is a collective motion pattern where all parts of the system oscillate sinusoidally at the same frequency and pass through equilibrium at the same time. Any general motion can be decomposed into normal modes."
      },
      beats: {
        short: "Slow amplitude modulation from two close frequencies.",
        long: "When two sinusoids of slightly different frequencies add, the sum oscillates at the average frequency with an amplitude that modulates at half the difference frequency. This produces audible beating in sound and energy exchange in coupled oscillators."
      },
      eigenvector: {
        short: "The displacement pattern associated with a normal mode.",
        long: "Each normal mode has an eigenvector describing the relative displacement of each mass. For two identical coupled masses, the symmetric mode has both masses moving together, and the antisymmetric mode has them moving oppositely."
      }
    },
    derivations: [
      {
        title: "Normal modes of two coupled masses",
        teaser: "Write coupled equations, guess oscillatory solutions, and find the eigenfrequencies.",
        steps: [
          "Write equations of motion: $m\\ddot{x}_1 = -(k + \\kappa)x_1 + \\kappa x_2$ and $m\\ddot{x}_2 = \\kappa x_1 - (k + \\kappa)x_2$.",
          "Define sum and difference coordinates: $x_s = x_1 + x_2$ and $x_f = x_1 - x_2$.",
          "These decouple into independent oscillator equations with $\\omega_s = \\sqrt{k/m}$ and $\\omega_f = \\sqrt{(k + 2\\kappa)/m}$."
        ],
        result: "Two normal modes emerge: a slow symmetric mode (masses move together) and a fast antisymmetric mode (masses move oppositely). General motion is their superposition."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "Two pendulum clocks on the same shelf will gradually synchronize through tiny vibrations transmitted through the shelf. Huygens observed this in 1665 and called it an odd sympathy."
      },
      {
        title: "AI tutor prompt",
        body: "If you excite only one mass and hold the other still, what combination of normal modes have you created?"
      }
    ],
    quickActions: {
      intuition: "Coupled oscillators cannot be understood one at a time. The system has collective modes, and energy sloshes between the masses at the beat frequency.",
      formal: "The chapter diagonalizes the coupled equations of motion using sum and difference coordinates, finding eigenfrequencies and explaining beats as mode interference.",
      quiz: "Checkpoint: if the coupling spring constant $\\kappa$ equals zero, what happens to the two normal mode frequencies and why?"
    },
    prompts: [
      "Why does coupling create two distinct frequencies instead of one?",
      "Under what conditions do you see pronounced beats?"
    ],
    mathPrereqs: ["eigenvalues", "matrix-methods"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "coupled"
  },
  {
    number: 4,
    title: "Oscillators to Waves",
    slug: "oscillators-to-waves",
    pdf: "./lectures/04-Oscillators-to-Waves.pdf",
    conceptTitle: "Chain many oscillators and a wave equation emerges",
    conceptCaption: "As the number of coupled masses grows, the discrete normal modes turn into smooth sine-wave shapes, and the continuum limit yields the wave equation.",
    explanation: [
      "Extending from 2 to N coupled masses, the <term key='normal-mode-patterns'>normal mode patterns</term> become sinusoidal shapes resembling standing waves. Each mode has a distinct frequency set by how many nodes appear.",
      "In the continuum limit of infinitely many masses with infinitesimal spacing, the discrete system becomes a continuous string obeying the <term key='wave-equation'>wave equation</term>. This is the bridge from oscillators to waves."
    ],
    goals: [
      "Solve the N-mass coupled system and identify the normal mode shapes as sine functions.",
      "Take the continuum limit and derive the wave equation.",
      "Understand the dispersion relation $\\omega(k) = 2\\omega_0|\\sin(ka/2)|$ for the discrete chain."
    ],
    pitfalls: [
      "Forgetting that boundary conditions (fixed walls) select only certain allowed wavelengths.",
      "Confusing the discrete dispersion relation with the continuous linear one.",
      "Thinking the continuum limit works perfectly at all frequencies including very high ones."
    ],
    terms: {
      "normal-mode-patterns": {
        short: "Sine-shaped displacement patterns for $N$ masses.",
        long: "For $N$ masses on springs with fixed endpoints, the normal modes are $x_n \\propto \\sin(n\\pi j/(N+1))$, where $j$ labels the mode. Higher $j$ means more nodes and higher frequency."
      },
      "wave-equation": {
        short: "$\\partial^2 A/\\partial t^2 = v^2\\,\\partial^2 A/\\partial x^2$, the fundamental equation for waves.",
        long: "The wave equation governs vibrations of strings, sound in air, electromagnetic waves, and much more. Its general solution is any function of $(x - vt)$ plus any function of $(x + vt)$, representing left- and right-moving waves."
      },
      "dispersion-relation": {
        short: "The relationship between frequency $\\omega$ and wavenumber $k$.",
        long: "For a discrete chain, $\\omega = 2\\omega_0|\\sin(ka/2)|$ is nonlinear, meaning different wavelengths travel at different speeds. In the continuum limit, this becomes $\\omega = vk$, which is dispersionless."
      }
    },
    derivations: [
      {
        title: "From N masses to the wave equation",
        teaser: "Start with the discrete equations, guess sinusoidal modes, and take the continuum limit.",
        steps: [
          "Write $m\\ddot{x}_n = k(x_{n-1} - 2x_n + x_{n+1})$ for each interior mass.",
          "Guess $x_n = Be^{ipn}e^{i\\omega t}$. Substitution gives $\\omega^2 = 2\\omega_0^2(1 - \\cos p)$.",
          "In the continuum limit ($a \\to 0$, keeping $ka^2/m = v^2$ fixed), the difference operator becomes a second derivative, yielding the wave equation."
        ],
        result: "The wave equation $\\partial^2 A/\\partial t^2 = v^2\\,\\partial^2 A/\\partial x^2$ emerges naturally from the continuum limit of coupled oscillators, with $v = \\sqrt{T/\\mu}$."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "A slinky is a great model: push one end and the disturbance travels along it. Each coil is a mass coupled to its neighbors by the springiness of the slinky."
      },
      {
        title: "AI tutor prompt",
        body: "Why does the discrete chain have a maximum frequency (the cutoff) while the continuous string does not?"
      }
    ],
    quickActions: {
      intuition: "A chain of oscillators is secretly a wave in disguise. As you add more and more masses, the discrete normal modes morph into smooth traveling waves.",
      formal: "The chapter solves the N-mass eigenvalue problem, identifies sinusoidal eigenvectors, derives the discrete dispersion relation, and takes the continuum limit to get the wave equation.",
      quiz: "Checkpoint: what happens to the dispersion relation when the spacing between masses goes to zero?"
    },
    prompts: [
      "Why must boundary conditions be specified to determine the allowed normal modes?",
      "How does the number of normal modes relate to the number of masses?"
    ],
    mathPrereqs: ["eigenvalues", "trig-identities", "pde-basics"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "n-modes"
  },
  {
    number: 5,
    title: "Fourier Series",
    slug: "fourier-series",
    pdf: "./lectures/05-Fourier-Series.pdf",
    conceptTitle: "Any periodic function is a sum of sines and cosines",
    conceptCaption: "Fourier series decompose complex waveforms into simple harmonics, revealing the frequency content hidden in any repeating pattern.",
    explanation: [
      "The <term key='fourier-series'>Fourier series</term> expresses any periodic function as a sum of sines and cosines with integer multiples of a fundamental frequency. The coefficients tell you how much of each harmonic is present.",
      "This is the mathematical backbone of wave analysis. A square wave, a sawtooth, or any shape on a string can be built from pure harmonics. The <term key='orthogonality'>orthogonality</term> of sine and cosine functions is what makes extracting the coefficients simple."
    ],
    goals: [
      "Write down the Fourier series formula with cosine and sine terms.",
      "Compute Fourier coefficients using the orthogonality integrals.",
      "Decompose specific waveforms (sawtooth, square wave) into their harmonic components."
    ],
    pitfalls: [
      "Forgetting the factor of 2/L in the coefficient formulas.",
      "Using a cosine series for an odd function or vice versa.",
      "Expecting the Fourier series to converge pointwise at discontinuities (Gibbs phenomenon)."
    ],
    terms: {
      "fourier-series": {
        short: "Decomposition of a periodic function into sine and cosine harmonics.",
        long: "$f(x) = a_0/2 + \\sum [a_n\\cos(2\\pi nx/L) + b_n\\sin(2\\pi nx/L)]$. The coefficients $a_n$ and $b_n$ are found by integrating $f$ against each basis function. This works because sines and cosines are orthogonal over a full period."
      },
      orthogonality: {
        short: "Different harmonics integrate to zero against each other.",
        long: "The integral of $\\sin(nx)\\cos(mx)$ over a period vanishes unless $n = m$, and similarly for sin-sin and cos-cos pairs. This orthogonality lets us isolate each Fourier coefficient independently."
      },
      harmonics: {
        short: "Integer multiples of the fundamental frequency.",
        long: "The $n$-th harmonic has frequency $n$ times the fundamental. Higher harmonics capture finer detail in the waveform. Musical timbre is largely determined by the relative strengths of the harmonics."
      }
    },
    derivations: [
      {
        title: "Deriving the Fourier coefficients",
        teaser: "Multiply by a basis function and integrate, using orthogonality to isolate each coefficient.",
        steps: [
          "Start with $f(x) = a_0/2 + \\sum [a_n\\cos(2\\pi nx/L) + b_n\\sin(2\\pi nx/L)]$.",
          "Multiply both sides by $\\cos(2\\pi mx/L)$ and integrate over $[0, L]$.",
          "By orthogonality, only the $n = m$ term survives, giving $a_m = \\frac{2}{L}\\int f(x)\\cos(2\\pi mx/L)\\,dx$."
        ],
        result: "Each Fourier coefficient extracts one harmonic from the signal independently, thanks to the orthogonality of the trigonometric basis."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "A musical instrument plays a note, but it does not sound like a pure sine wave. The richness of its timbre comes from the specific mixture of harmonics, which is exactly what the Fourier series captures."
      },
      {
        title: "AI tutor prompt",
        body: "Why do the Fourier coefficients of a square wave decrease as $1/n$ for odd $n$ and vanish for even $n$?"
      }
    ],
    quickActions: {
      intuition: "Fourier series is the idea that any repeating shape can be built from pure sine waves. The recipe tells you exactly how much of each harmonic to include.",
      formal: "The chapter establishes Fourier series via orthogonality of trigonometric functions, derives the coefficient formulas, and demonstrates with sawtooth and square-wave examples.",
      quiz: "Checkpoint: what is the Gibbs phenomenon and why does the Fourier series overshoot at a discontinuity?"
    },
    prompts: [
      "How does the rate at which Fourier coefficients decrease relate to the smoothness of the function?",
      "Why are only sine terms needed for an odd function?"
    ],
    mathPrereqs: ["orthogonality", "integration-techniques", "fourier-math", "trig-identities"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "fourier-series"
  },
  {
    number: 6,
    title: "Waves",
    slug: "waves",
    pdf: "./lectures/06-Waves.pdf",
    conceptTitle: "Disturbances that carry energy without transporting matter",
    conceptCaption: "Sound waves in air and vibrations in strings both satisfy the same wave equation, but the physical mechanisms differ.",
    explanation: [
      "This chapter derives the <term key='wave-eq-string'>wave equation for strings</term> from Newton's second law applied to a small segment under tension. The wave speed $v = \\sqrt{T/\\mu}$ depends on tension and linear mass density.",
      "<term key='sound-waves'>Sound waves</term> in air arise from pressure and density oscillations. The speed of sound depends on the bulk modulus and density, and for an ideal gas involves the ratio of specific heats $\\gamma$."
    ],
    goals: [
      "Derive the wave equation for transverse waves on a string under tension.",
      "Derive the speed of sound in a gas and understand why it depends on $\\gamma$.",
      "Distinguish longitudinal from transverse waves and identify examples of each."
    ],
    pitfalls: [
      "Confusing the displacement $A(x,t)$ of a string element with the density variation in a sound wave.",
      "Thinking sound waves are transverse (they are longitudinal in a gas).",
      "Forgetting that the speed of sound in air depends on temperature through the ideal gas law."
    ],
    terms: {
      "wave-eq-string": {
        short: "$\\partial^2 A/\\partial t^2 = (T/\\mu)\\,\\partial^2 A/\\partial x^2$ for a string under tension $T$.",
        long: "Newton's second law on a small segment of string gives a restoring force proportional to the curvature of the string. This yields the wave equation with speed $v = \\sqrt{T/\\mu}$, where $\\mu$ is mass per unit length."
      },
      "sound-waves": {
        short: "Longitudinal pressure oscillations that propagate through a medium.",
        long: "Sound is a compression wave. The speed in an ideal gas is $v = \\sqrt{\\gamma P/\\rho} = \\sqrt{\\gamma k_B T/m_{\\text{mol}}}$. The adiabatic exponent $\\gamma = (f+2)/f$ depends on the degrees of freedom $f$ of the gas molecules."
      },
      "longitudinal-transverse": {
        short: "Oscillation parallel to or perpendicular to the direction of wave travel.",
        long: "Sound in air is longitudinal. Waves on a string are transverse. Electromagnetic waves are transverse. The distinction matters for polarization and for what kind of medium can support the wave."
      }
    },
    derivations: [
      {
        title: "Wave equation from a vibrating string",
        teaser: "Apply Newton's second law to a small segment of string and keep the leading-order term.",
        steps: [
          "Consider a small segment of string of length $\\Delta x$ under tension $T$ with displacement $A(x,t)$.",
          "The net transverse force is $T[\\partial A/\\partial x]_{x+\\Delta x} - T[\\partial A/\\partial x]_x = T(\\partial^2 A/\\partial x^2)\\Delta x$.",
          "Set this equal to $\\mu\\,\\Delta x\\,(\\partial^2 A/\\partial t^2)$ and cancel $\\Delta x$ to get the wave equation."
        ],
        result: "$\\partial^2 A/\\partial t^2 = (T/\\mu)\\,\\partial^2 A/\\partial x^2$, with wave speed $v = \\sqrt{T/\\mu}$. Tighter strings vibrate faster, heavier strings vibrate slower."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "Pluck a guitar string and the disturbance bounces between the fixed ends. The wave carries energy back and forth but the string itself stays in place on average."
      },
      {
        title: "AI tutor prompt",
        body: "Why does helium make your voice sound higher? Relate it to the dependence of sound speed on molecular mass."
      }
    ],
    quickActions: {
      intuition: "Waves are disturbances that travel. The wave equation says the acceleration of each piece of the medium is proportional to the curvature of the displacement around it.",
      formal: "The chapter derives the wave equation from Newton's second law for strings and from gas dynamics for sound, identifying wave speed in terms of material parameters.",
      quiz: "Checkpoint: what determines the speed of sound in air and how does it change on a hot day versus a cold day?"
    },
    prompts: [
      "Why can a wave carry energy without the medium moving as a whole?",
      "How does the wave speed in a string change if you double the tension?"
    ],
    mathPrereqs: ["pde-basics", "taylor-series"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "waves"
  },
  {
    number: 7,
    title: "Music",
    slug: "music",
    pdf: "./lectures/07-Music.pdf",
    conceptTitle: "Harmonics explain why notes sound good together",
    conceptCaption: "Musical harmony arises from the coincidence of overtone frequencies. The ear responds to the ratios of harmonics, not just individual pitches.",
    explanation: [
      "A vibrating string produces not just a fundamental frequency but a whole series of <term key='overtones'>overtones</term> at integer multiples. The relative amplitudes of these harmonics determine the instrument's <term key='timbre'>timbre</term>.",
      "Two notes sound consonant when their harmonics overlap. The <term key='intervals'>musical intervals</term> -- octave (2:1), perfect fifth (3:2), perfect fourth (4:3) -- are defined by simple frequency ratios. Dissonance arises from beat frequencies in the audible range."
    ],
    goals: [
      "Explain why integer frequency ratios produce consonant musical intervals.",
      "Relate the Fourier spectrum of an instrument to its timbre.",
      "Understand beats as the origin of dissonance between nearby frequencies."
    ],
    pitfalls: [
      "Thinking timbre depends only on the fundamental frequency.",
      "Confusing beats (amplitude modulation) with interference (spatial).",
      "Assuming equal temperament intervals are the same as just intonation ratios."
    ],
    terms: {
      overtones: {
        short: "Frequencies above the fundamental, at integer multiples for a string.",
        long: "A vibrating string has modes at f, 2f, 3f, etc. The strengths of these overtones depend on how the string is excited (plucked vs bowed, where along the string). They give each instrument its characteristic sound."
      },
      timbre: {
        short: "The quality of a musical sound determined by its harmonic content.",
        long: "A flute and a violin can play the same note at the same volume, yet they sound different because the mixture of overtone amplitudes differs. The Fourier spectrum reveals the timbre."
      },
      intervals: {
        short: "Frequency ratios that define musical relationships between notes.",
        long: "The octave is 2:1, the perfect fifth is 3:2, the perfect fourth is 4:3, and the major third is 5:4. These simple ratios ensure harmonic overlap between notes, producing consonance."
      }
    },
    derivations: [
      {
        title: "Why the perfect fifth sounds consonant",
        teaser: "Compare the harmonic series of two notes with a 3:2 frequency ratio.",
        steps: [
          "Let the fundamental be $f_0$ with harmonics $f_0, 2f_0, 3f_0, 4f_0, \\ldots$",
          "The perfect fifth has fundamental $(3/2)f_0$ with harmonics $(3/2)f_0, 3f_0, (9/2)f_0, 6f_0, \\ldots$",
          "The 3rd harmonic of $f_0$ matches the 2nd harmonic of $(3/2)f_0$. Many harmonics align, so there are no dissonant beats."
        ],
        result: "Simple frequency ratios produce harmonic alignment, which the ear perceives as consonance. Complex ratios create beating among nearby harmonics, heard as dissonance."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "A flute spectrum shows a strong fundamental with rapidly decreasing overtones, making it sound pure. A violin has strong higher harmonics, giving it a rich, complex character."
      },
      {
        title: "AI tutor prompt",
        body: "Why does the equal temperament tuning system, which uses irrational frequency ratios, sound nearly as good as just intonation?"
      }
    ],
    quickActions: {
      intuition: "Music is applied Fourier analysis. Consonance comes from harmonic alignment, dissonance from audible beats, and timbre from the Fourier spectrum of the instrument.",
      formal: "The chapter links Fourier series to musical harmony, derives the consonance of simple frequency ratios through harmonic coincidence, and explains timbre via spectral amplitudes.",
      quiz: "Checkpoint: if two notes are separated by a perfect fifth, which harmonics of each note coincide?"
    },
    prompts: [
      "Why do instruments playing the same note sound different?",
      "What is the physical origin of dissonance?"
    ],
    mathPrereqs: ["fourier-math", "trig-identities"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "music"
  },
  {
    number: 8,
    title: "Fourier Transforms",
    slug: "fourier-transforms",
    pdf: "./lectures/08-Fourier-Transforms.pdf",
    conceptTitle: "From periodic decomposition to continuous spectra",
    conceptCaption: "The Fourier transform extends Fourier series to non-periodic signals, revealing the continuous frequency content of any waveform.",
    explanation: [
      "The <term key='fourier-transform'>Fourier transform</term> takes a function of time (or space) and produces a function of frequency (or wavenumber). It is the limit of a Fourier series as the period goes to infinity.",
      "For a damped oscillator, the Fourier transform reveals a <term key='lorentzian'>Lorentzian</term> peak centered at the natural frequency, with width set by the damping. The power spectrum |f-tilde(omega)|^2 is what audio spectrum analyzers display."
    ],
    goals: [
      "Derive the Fourier transform as the L -> infinity limit of Fourier series.",
      "Compute the Fourier transform of a damped oscillator and identify the Lorentzian.",
      "Interpret the power spectrum and its relationship to spectral line shapes."
    ],
    pitfalls: [
      "Confusing Fourier series (discrete frequencies) with Fourier transforms (continuous spectrum).",
      "Getting factors of $2\\pi$ wrong when switching between frequency and angular frequency conventions.",
      "Interpreting the Fourier transform of a real signal as purely real (it is generally complex)."
    ],
    terms: {
      "fourier-transform": {
        short: "$\\tilde{f}(k) = \\frac{1}{2\\pi}\\int f(x)\\,e^{-ikx}\\,dx$.",
        long: "The Fourier transform decomposes a non-periodic function into a continuous superposition of plane waves. The inverse transform recovers the original function from its spectral content."
      },
      lorentzian: {
        short: "The spectral shape of a damped oscillator: $1/[(\\omega - \\omega_0)^2 + (\\gamma/2)^2]$.",
        long: "A Lorentzian peak appears whenever a system has a characteristic frequency with finite damping. Its full width at half maximum equals $\\gamma$, the damping rate. It is the Fourier transform of an exponentially decaying sinusoid."
      },
      "power-spectrum": {
        short: "$|\\tilde{f}(\\omega)|^2$, the intensity at each frequency.",
        long: "The power spectrum shows how much energy is associated with each frequency component. It is what you see on an audio equalizer or spectrum analyzer."
      }
    },
    derivations: [
      {
        title: "From Fourier series to Fourier transform",
        teaser: "Take the period L to infinity and watch discrete sums become integrals.",
        steps: [
          "Start with the exponential Fourier series: $f(x) = \\sum c_n\\,e^{ik_n x}$, where $k_n = 2\\pi n/L$.",
          "Define $\\Delta k = 2\\pi/L$, so the sum becomes $\\sum \\tilde{f}(k_n)\\,e^{ik_n x}\\,\\Delta k$.",
          "As $L \\to \\infty$, $\\Delta k \\to dk$ and the sum becomes an integral: $f(x) = \\int \\tilde{f}(k)\\,e^{ikx}\\,dk$."
        ],
        result: "The Fourier transform pair $\\tilde{f}(k) = \\frac{1}{2\\pi}\\int f(x)\\,e^{-ikx}\\,dx$ and $f(x) = \\int \\tilde{f}(k)\\,e^{ikx}\\,dk$ replaces the discrete coefficients of the Fourier series."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "A violin note that starts and stops has a Fourier spectrum with finite-width peaks. The longer the note is sustained, the narrower the peaks become, approaching the discrete harmonics of an infinite Fourier series."
      },
      {
        title: "AI tutor prompt",
        body: "Why does a signal that is sharply localized in time necessarily have a broad spread in frequency?"
      }
    ],
    quickActions: {
      intuition: "The Fourier transform is the universal translator between time and frequency. Any signal can be broken into its frequency ingredients, and the recipe is invertible.",
      formal: "The chapter derives the Fourier transform from the $L \\to \\infty$ limit of Fourier series, computes the transform of a damped sinusoid to get a Lorentzian, and introduces the power spectrum.",
      quiz: "Checkpoint: what is the Fourier transform of a pure sinusoid that lasts forever, and how does it change if the sinusoid is damped?"
    },
    prompts: [
      "How does the width of a Fourier transform peak relate to the duration of the signal?",
      "What physical information does the power spectrum contain that the Fourier transform alone does not?"
    ],
    mathPrereqs: ["fourier-math", "fourier-transform-math", "dirac-delta-math"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "fourier-transform"
  },
  {
    number: 9,
    title: "Reflection & Impedance",
    slug: "reflection-impedance",
    pdf: "./lectures/09-Reflection-Transmission-Impedance.pdf",
    conceptTitle: "Boundaries split waves into reflected and transmitted parts",
    conceptCaption: "When a wave hits a junction between two media, impedance mismatch determines how much energy bounces back versus passes through.",
    explanation: [
      "At a boundary between two media, a wave splits into <term key='reflected-wave'>reflected</term> and <term key='transmitted-wave'>transmitted</term> components. The amplitudes are determined by matching the wave and its derivative at the junction.",
      "<term key='impedance'>Impedance</term> $Z = \\sqrt{T\\mu}$ (for strings) or $Z = \\rho v$ (for sound) captures everything about a medium relevant to wave transmission. Reflection vanishes when impedances are matched."
    ],
    goals: [
      "Apply boundary conditions at a junction to find reflection and transmission coefficients.",
      "Define impedance and interpret impedance matching.",
      "Understand why a wave inverts upon reflection from a denser medium."
    ],
    pitfalls: [
      "Confusing amplitude transmission coefficient with energy transmission coefficient.",
      "Forgetting that the transmitted wave has a different speed and wavelength in the second medium.",
      "Thinking total reflection can only happen at a fixed end, not realizing it occurs for infinite impedance mismatch."
    ],
    terms: {
      "reflected-wave": {
        short: "The part of the wave that bounces back from a boundary.",
        long: "The reflection coefficient $r = (Z_1 - Z_2)/(Z_1 + Z_2)$ gives the ratio of reflected to incident amplitude. It can be positive or negative depending on which medium has higher impedance."
      },
      "transmitted-wave": {
        short: "The part of the wave that passes through a boundary.",
        long: "The transmission coefficient $t = 2Z_1/(Z_1 + Z_2)$ gives the transmitted amplitude relative to the incident amplitude. Note $t$ can exceed 1 because amplitude and power are different quantities."
      },
      impedance: {
        short: "A medium's resistance to wave motion: $Z = \\rho v$.",
        long: "Impedance encapsulates both the inertia and the stiffness of a medium. Two media with matched impedances transmit waves perfectly. Mismatch causes reflection, with the extreme cases being fixed-end ($Z_2 = \\infty$) and free-end ($Z_2 = 0$)."
      }
    },
    derivations: [
      {
        title: "Reflection and transmission coefficients from boundary conditions",
        teaser: "Match continuity of displacement and force at the junction to solve for the ratios.",
        steps: [
          "At $x = 0$, the string is continuous: $A_I(0,t) + A_R(0,t) = A_T(0,t)$, giving $A_I + A_R = A_T$.",
          "The force (tension times slope) must also match: $T_1(\\partial A_L/\\partial x) = T_2(\\partial A_R/\\partial x)$, which gives $Z_1(A_I - A_R) = Z_2 A_T$.",
          "Solve the two equations: $A_R/A_I = (Z_1 - Z_2)/(Z_1 + Z_2)$ and $A_T/A_I = 2Z_1/(Z_1 + Z_2)$."
        ],
        result: "Impedance mismatch controls reflection. Perfect matching ($Z_1 = Z_2$) means no reflection. Maximum reflection occurs when the impedances are very different."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "Tie a light rope to a heavy rope and send a pulse along the light one. Part of the pulse continues into the heavy rope (transmitted) and part bounces back inverted (reflected) because the heavy rope acts like a partially fixed end."
      },
      {
        title: "AI tutor prompt",
        body: "Why can the transmission coefficient exceed 1 without violating energy conservation?"
      }
    ],
    quickActions: {
      intuition: "Impedance is the medium's personality from the wave's perspective. Matched impedances mean smooth passage; mismatched impedances create echoes.",
      formal: "The chapter applies continuity of displacement and force at a junction, derives reflection and transmission coefficients in terms of impedance, and checks energy conservation.",
      quiz: "Checkpoint: what happens to a wave pulse when it reaches a fixed end, and what impedance ratio does that correspond to?"
    },
    prompts: [
      "How does impedance matching work in practical applications like audio cables?",
      "Why does the reflected wave flip when going from a lighter to a heavier medium?"
    ],
    mathPrereqs: ["complex-numbers", "pde-basics"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "impedance"
  },
  {
    number: 10,
    title: "Power",
    slug: "power",
    pdf: "./lectures/10-Power.pdf",
    conceptTitle: "Waves carry energy at a rate set by impedance",
    conceptCaption: "The power transmitted by a wave equals the impedance times the velocity squared, connecting amplitude and frequency to energy flow.",
    explanation: [
      "Waves carry both <term key='kinetic-energy'>kinetic energy</term> (from the motion of the medium) and <term key='potential-energy'>potential energy</term> (from the stretching or compression of the medium). For a traveling wave, these are equal at every point.",
      "The <term key='power-wave'>power</term> transmitted by a wave is $P = Z(\\partial A/\\partial t)^2$, proportional to the impedance and the square of the velocity. This connects directly to the reflection and transmission coefficients from the previous chapter."
    ],
    goals: [
      "Derive kinetic and potential energy densities for a wave on a string.",
      "Show that energy flows at the wave speed for a traveling wave.",
      "Verify energy conservation at a boundary using reflected and transmitted power."
    ],
    pitfalls: [
      "Confusing energy density (energy per length) with total power (energy per time).",
      "Thinking a standing wave transmits energy (it does not on average).",
      "Forgetting that power goes as amplitude squared, not amplitude."
    ],
    terms: {
      "kinetic-energy": {
        short: "KE per length $= \\frac{1}{2}\\mu(\\partial A/\\partial t)^2$ from the motion of the medium.",
        long: "Each bit of the medium has kinetic energy from its transverse velocity. For a traveling sinusoidal wave, the kinetic energy density oscillates in space and time."
      },
      "potential-energy": {
        short: "PE per length $= \\frac{1}{2}T(\\partial A/\\partial x)^2$ from stretching of the medium.",
        long: "The potential energy comes from the string being stretched beyond its equilibrium length. For a traveling wave, the PE density exactly equals the KE density at every point."
      },
      "power-wave": {
        short: "$P = Z(\\partial A/\\partial t)^2$, the rate of energy transport.",
        long: "Power is force times velocity. For a wave, the transverse force is $T\\,\\partial A/\\partial x$ and the transverse velocity is $\\partial A/\\partial t$. Their product gives $P = -T(\\partial A/\\partial x)(\\partial A/\\partial t) = Z(\\partial A/\\partial t)^2$ for a right-moving wave."
      }
    },
    derivations: [
      {
        title: "Energy conservation at a boundary",
        teaser: "Check that incident power equals reflected plus transmitted power using the impedance coefficients.",
        steps: [
          "Write $P_I = Z_1 A_I^2\\omega^2/2$, $P_R = Z_1 A_R^2\\omega^2/2$, $P_T = Z_2 A_T^2\\omega^2/2$.",
          "Substitute $A_R = rA_I$ and $A_T = tA_I$ with $r = (Z_1-Z_2)/(Z_1+Z_2)$ and $t = 2Z_1/(Z_1+Z_2)$.",
          "Compute $P_R + P_T = Z_1 r^2 A_I^2\\omega^2/2 + Z_2 t^2 A_I^2\\omega^2/2$ and verify it equals $P_I$."
        ],
        result: "Energy is conserved at the boundary: $P_R/P_I + P_T/P_I = r^2 + (Z_2/Z_1)t^2 = 1$, even though the amplitude transmission coefficient can exceed 1."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "Shake one end of a rope and you do work against the tension. That work propagates along the rope as a wave, delivering energy to wherever the wave goes."
      },
      {
        title: "AI tutor prompt",
        body: "Why is the power proportional to the square of the amplitude rather than just the amplitude?"
      }
    ],
    quickActions: {
      intuition: "A wave is an energy delivery system. The impedance of the medium determines how much power is carried for a given amplitude of oscillation.",
      formal: "The chapter derives KE and PE densities for a string wave, shows their equality for traveling waves, defines power as $Z(\\partial A/\\partial t)^2$, and verifies energy conservation at boundaries.",
      quiz: "Checkpoint: for a standing wave, the time-averaged power flow is zero. Explain why in terms of the phase relationship between force and velocity."
    },
    prompts: [
      "Why are KE and PE densities equal for a traveling wave but not for a standing wave?",
      "How does the power scale with frequency for a fixed amplitude wave?"
    ],
    mathPrereqs: ["integration-techniques", "trig-identities"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "power"
  },
  {
    number: 11,
    title: "Wavepackets",
    slug: "wavepackets",
    pdf: "./lectures/11-Wavepackets.pdf",
    conceptTitle: "Localized pulses spread when the medium is dispersive",
    conceptCaption: "A wavepacket carries information at the group velocity, and its width grows over time if different frequencies travel at different speeds.",
    explanation: [
      "A <term key='wavepacket'>wavepacket</term> is a localized pulse built from a superposition of plane waves with a narrow range of frequencies. In a Gaussian wavepacket, the width in real space and the width in frequency space are inversely related.",
      "The <term key='group-velocity'>group velocity</term> $v_g = d\\omega/dk$ is the speed at which the envelope (and the energy) moves. It differs from the <term key='phase-velocity'>phase velocity</term> $v_p = \\omega/k$ in dispersive media, causing the packet to spread over time."
    ],
    goals: [
      "Construct a wavepacket as a superposition of plane waves with a Gaussian envelope.",
      "Distinguish group velocity from phase velocity and know when they differ.",
      "Understand dispersion as the spreading of a wavepacket due to frequency-dependent speed."
    ],
    pitfalls: [
      "Confusing group velocity (envelope speed) with phase velocity (crest speed).",
      "Thinking wavepackets always spread; in non-dispersive media they travel without changing shape.",
      "Forgetting the uncertainty principle: narrower packets require broader frequency content."
    ],
    terms: {
      wavepacket: {
        short: "A localized wave pulse built from a range of frequencies.",
        long: "A wavepacket is a superposition of plane waves, typically with a Gaussian envelope. The width $\\sigma_x$ in position and $\\sigma_k$ in wavenumber satisfy $\\sigma_x\\sigma_k \\geq 1/2$, the uncertainty relation."
      },
      "group-velocity": {
        short: "$v_g = d\\omega/dk$, the speed of the envelope.",
        long: "The group velocity determines how fast the peak of a wavepacket moves and at what speed energy and information travel. For non-dispersive media, $v_g = v_p$. For dispersive media, they differ."
      },
      "phase-velocity": {
        short: "$v_p = \\omega/k$, the speed of individual crests.",
        long: "Phase velocity is the speed at which a single crest of a monochromatic wave travels. It can exceed the speed of light in some media, but this does not violate causality because information travels at the group velocity."
      }
    },
    derivations: [
      {
        title: "Group velocity from the dispersion relation",
        teaser: "Expand omega(k) near the carrier frequency and identify the envelope speed.",
        steps: [
          "Write a wavepacket as $\\int \\tilde{f}(k)\\,e^{i(kx - \\omega(k)t)}\\,dk$, peaked near $k_0$.",
          "Taylor expand $\\omega(k)$ about $k_0$: $\\omega = \\omega_0 + (d\\omega/dk)|_{k_0}(k - k_0) + \\cdots$",
          "The leading-order phase factor gives $e^{i(k_0 x - \\omega_0 t)}$ times an envelope that depends on $(x - v_g t)$, where $v_g = d\\omega/dk$ at $k_0$."
        ],
        result: "The envelope travels at the group velocity $v_g = d\\omega/dk$. Higher-order terms in the expansion cause the envelope to spread (dispersion)."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "Throw a rock into a pond. The resulting ripples spread outward, but notice that individual wave crests move faster than the packet as a whole. Crests appear at the back, travel through the group, and disappear at the front."
      },
      {
        title: "AI tutor prompt",
        body: "How does the time-bandwidth product $\\sigma_t\\sigma_\\omega \\geq 1/2$ limit how short a radar pulse can be at a given frequency?"
      }
    ],
    quickActions: {
      intuition: "A wavepacket is the answer to how to send a localized signal using waves. The group velocity carries the information, and dispersion is the enemy of keeping signals sharp.",
      formal: "The chapter constructs Gaussian wavepackets, Taylor-expands the dispersion relation to identify group velocity, and computes packet spreading from the second derivative of $\\omega(k)$.",
      quiz: "Checkpoint: in deep water, surface wave phase velocity is twice the group velocity. What does this mean for the crests inside a wave group?"
    },
    prompts: [
      "Why does a narrower wavepacket in space require a broader range of frequencies?",
      "Under what conditions does a wavepacket travel without spreading?"
    ],
    mathPrereqs: ["fourier-transform-math", "complex-numbers"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "wavepackets"
  },
  {
    number: 12,
    title: "Wave Phenomena",
    slug: "wave-phenomena",
    pdf: "./lectures/12-Waves-Muller.pdf",
    conceptTitle: "Waves in the real world: earthquakes, sonar, and beyond",
    conceptCaption: "The same wave principles explain seismic waves, sonar, sonic booms, and many technologies used every day.",
    explanation: [
      "This chapter surveys wave phenomena across many domains, from <term key='seismic-waves'>seismic waves</term> that reveal Earth's interior to the sonar used by submarines and bats.",
      "Key concepts include how wave speed depends on the medium, how <term key='shock-waves'>shock waves</term> form when a source moves faster than the wave speed, and how wave interference creates useful patterns in technology."
    ],
    goals: [
      "Identify wave phenomena in diverse physical contexts from seismology to acoustics.",
      "Understand how wave speed differences between media reveal material properties.",
      "Explain the formation of sonic booms and Mach cones."
    ],
    pitfalls: [
      "Thinking all waves behave identically regardless of the medium.",
      "Confusing surface waves with body waves in seismology.",
      "Assuming sonic booms only happen at the exact moment of crossing the sound barrier."
    ],
    terms: {
      "seismic-waves": {
        short: "Waves through the Earth, including P-waves and S-waves.",
        long: "P-waves (primary) are longitudinal compression waves that travel through both solids and liquids. S-waves (secondary) are transverse shear waves that only travel through solids. Their different speeds and behaviors reveal Earth's layered structure."
      },
      "shock-waves": {
        short: "Waves produced when a source exceeds the wave speed.",
        long: "When a source moves faster than the wave speed, wavefronts pile up into a cone (Mach cone) producing a shock wave. The half-angle of the cone is $\\sin(\\theta) = v_{\\text{wave}}/v_{\\text{source}}$."
      },
      "sonar": {
        short: "Using reflected sound waves to detect objects.",
        long: "SONAR (Sound Navigation And Ranging) sends sound pulses and measures the time delay and direction of echoes. It exploits the known speed of sound in water to determine distances."
      }
    },
    derivations: [
      {
        title: "The Mach cone geometry",
        teaser: "Track wavefronts emitted by a supersonic source and find the cone angle.",
        steps: [
          "A source at speed $v_s$ emits a wavefront which expands as a sphere of radius $v_w t$ after time $t$.",
          "The source has moved a distance $v_s t$. The envelope of all these spheres forms a cone.",
          "The half-angle satisfies $\\sin(\\theta) = v_w t/(v_s t) = v_w/v_s = 1/M$, where $M$ is the Mach number."
        ],
        result: "The Mach cone half-angle $\\theta = \\arcsin(1/M)$ gets sharper as the source moves faster relative to the wave speed."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "A boat moving faster than the water wave speed creates a V-shaped wake. A supersonic jet creates a Mach cone of compressed air. Both are the same geometric phenomenon."
      },
      {
        title: "AI tutor prompt",
        body: "How do seismologists use the difference in arrival times of P and S waves to locate an earthquake's epicenter?"
      }
    ],
    quickActions: {
      intuition: "The same wave equation shows up everywhere. Whether it is sound in the ocean, vibrations in the earth, or pressure from a supersonic jet, the principles of reflection, refraction, and interference apply universally.",
      formal: "The chapter surveys wave phenomena across domains, applying reflection, transmission, Doppler, and shock-wave geometry to real-world contexts from seismology to sonar.",
      quiz: "Checkpoint: why can S-waves not travel through the Earth's liquid outer core?"
    },
    prompts: [
      "What does the absence of S-waves at certain stations tell us about the Earth's interior?",
      "How does the SOFAR channel allow sound to travel thousands of miles in the ocean?"
    ],
    mathPrereqs: ["pde-basics", "dimensional-analysis"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "em-waves"
  },
  {
    number: 13,
    title: "Light",
    slug: "light",
    pdf: "./lectures/13-Light.pdf",
    conceptTitle: "Light is an electromagnetic wave",
    conceptCaption: "Maxwell's equations predict electromagnetic waves traveling at $c = 1/\\sqrt{\\mu_0\\epsilon_0}$, unifying electricity, magnetism, and optics.",
    explanation: [
      "Maxwell's equations, when combined, yield the <term key='em-wave-equation'>electromagnetic wave equation</term> for both $\\vec{E}$ and $\\vec{B}$ fields. The predicted speed is $c = 1/\\sqrt{\\mu_0\\epsilon_0}$, which matches the measured speed of light.",
      "The <term key='em-spectrum'>electromagnetic spectrum</term> spans from radio waves to gamma rays. All are the same phenomenon at different frequencies. Light is the tiny visible slice of this spectrum."
    ],
    goals: [
      "Derive the electromagnetic wave equation from Maxwell's equations in vacuum.",
      "Identify the speed of light $c = 1/\\sqrt{\\mu_0\\epsilon_0}$ in terms of fundamental electromagnetic constants.",
      "Survey the electromagnetic spectrum from radio to gamma rays."
    ],
    pitfalls: [
      "Thinking light needs a medium to propagate (it does not; the aether does not exist).",
      "Confusing the electric and magnetic field amplitudes ($B = E/c$ in vacuum).",
      "Forgetting that EM waves are transverse: $\\vec{E}$ and $\\vec{B}$ are perpendicular to the propagation direction."
    ],
    terms: {
      "em-wave-equation": {
        short: "$(\\partial^2/\\partial t^2 - c^2\\nabla^2)\\vec{E} = 0$, derived from Maxwell's equations.",
        long: "By taking the curl of Faraday's law and substituting Ampere's law, you get a wave equation for $\\vec{E}$ (and similarly for $\\vec{B}$). The wave speed is $c = 1/\\sqrt{\\mu_0\\epsilon_0} = 3 \\times 10^8$ m/s."
      },
      "em-spectrum": {
        short: "The full range of electromagnetic wave frequencies.",
        long: "Radio (km wavelengths), microwave (cm), infrared (microns), visible (400-700 nm), ultraviolet, X-rays, gamma rays are all electromagnetic waves differing only in frequency."
      },
      "index-of-refraction": {
        short: "$n = c/v$, the factor by which light slows in a medium.",
        long: "In a material, electromagnetic waves interact with charges in the medium, effectively slowing the wave. The index of refraction $n$ determines the wavelength inside the medium as $\\lambda = \\lambda_0/n$."
      }
    },
    derivations: [
      {
        title: "Deriving the EM wave equation from Maxwell's equations",
        teaser: "Take the curl of Faraday's law and substitute Ampere's law.",
        steps: [
          "Start with $\\nabla \\times \\vec{E} = -\\partial\\vec{B}/\\partial t$ and $\\nabla \\times \\vec{B} = \\mu_0\\epsilon_0\\,\\partial\\vec{E}/\\partial t$ (in vacuum).",
          "Take the curl of the first equation: $\\nabla \\times (\\nabla \\times \\vec{E}) = -\\partial/\\partial t(\\nabla \\times \\vec{B}) = -\\mu_0\\epsilon_0\\,\\partial^2\\vec{E}/\\partial t^2$.",
          "Use the identity $\\nabla \\times (\\nabla \\times \\vec{E}) = \\nabla(\\nabla \\cdot \\vec{E}) - \\nabla^2\\vec{E}$, and $\\nabla \\cdot \\vec{E} = 0$ gives $\\nabla^2\\vec{E} = \\mu_0\\epsilon_0\\,\\partial^2\\vec{E}/\\partial t^2$."
        ],
        result: "The wave equation $(\\partial^2/\\partial t^2 - c^2\\nabla^2)\\vec{E} = 0$ with $c = 1/\\sqrt{\\mu_0\\epsilon_0}$ proves that light is an electromagnetic wave."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "A changing electric field creates a magnetic field, which in turn creates a changing electric field. This self-sustaining dance of fields propagates through space at the speed of light."
      },
      {
        title: "AI tutor prompt",
        body: "Maxwell predicted electromagnetic waves before Hertz detected them experimentally. What was the key theoretical insight that led to the prediction?"
      }
    ],
    quickActions: {
      intuition: "Light is oscillating electric and magnetic fields that regenerate each other as they travel. Maxwell's equations predict the speed exactly: $c = 1/\\sqrt{\\mu_0\\epsilon_0}$.",
      formal: "The chapter derives the electromagnetic wave equation from Maxwell's equations in vacuum, identifies $c$, and surveys the full electromagnetic spectrum.",
      quiz: "Checkpoint: what is the relationship between the electric and magnetic field amplitudes in an electromagnetic plane wave?"
    },
    prompts: [
      "Why did the prediction of electromagnetic waves confirm that light is electromagnetic?",
      "How does the speed of light in a material relate to the index of refraction?"
    ],
    mathPrereqs: ["vector-calculus", "pde-basics"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "light"
  },
  {
    number: 14,
    title: "Polarization",
    slug: "polarization",
    pdf: "./lectures/14-Polarization.pdf",
    conceptTitle: "The direction of oscillation matters",
    conceptCaption: "Electromagnetic waves can oscillate linearly, circularly, or elliptically. Polarization reveals the vector nature of light.",
    explanation: [
      "The electric field of a plane wave oscillates in a plane perpendicular to the propagation direction. The <term key='polarization-vector'>polarization vector</term> specifies the direction and phase of this oscillation.",
      "<term key='linear-polarization'>Linear polarization</term> has the E field oscillating in a fixed direction. <term key='circular-polarization'>Circular polarization</term> has the E field vector rotating at the wave frequency, tracing a circle."
    ],
    goals: [
      "Describe linear, circular, and elliptical polarization states.",
      "Write polarization using the Jones vector formalism.",
      "Understand how polarizers, wave plates, and birefringent materials manipulate polarization."
    ],
    pitfalls: [
      "Thinking circularly polarized light has varying amplitude (it does not; only the direction rotates).",
      "Confusing left and right circular polarization conventions.",
      "Forgetting that unpolarized light cannot be described by a single Jones vector."
    ],
    terms: {
      "polarization-vector": {
        short: "The complex vector $\\vec{E}_0$ specifying the direction and phase of the electric field.",
        long: "$\\vec{E}_0 = (E_x,\\, E_y e^{i\\phi},\\, 0)$ for a wave propagating in $z$. The relative phase $\\phi$ between $x$ and $y$ components determines whether the polarization is linear, circular, or elliptical."
      },
      "linear-polarization": {
        short: "$\\vec{E}$ field oscillates in a single fixed direction.",
        long: "When $E_x$ and $E_y$ are in phase ($\\phi = 0$ or $\\pi$), the electric field oscillates along a line. The direction can be at any angle in the $xy$ plane."
      },
      "circular-polarization": {
        short: "$\\vec{E}$ field vector rotates, tracing a circle.",
        long: "When $E_x$ and $E_y$ have equal magnitude and differ in phase by $\\pi/2$, the tip of the $\\vec{E}$ vector traces a circle. Left-handed and right-handed circular polarizations correspond to opposite senses of rotation."
      }
    },
    derivations: [
      {
        title: "Circular polarization from phase-shifted components",
        teaser: "Set $E_x$ and $E_y$ equal in magnitude with a $\\pi/2$ phase difference.",
        steps: [
          "Write $\\vec{E}_0 = (E_0,\\, iE_0,\\, 0)$, so that $\\vec{E} = (E_0\\cos(kz - \\omega t),\\, -E_0\\sin(kz - \\omega t),\\, 0)$.",
          "At fixed $z$, the tip of $\\vec{E}$ traces a circle in the $xy$ plane as $t$ advances.",
          "The handedness depends on the sign of the phase: $+i$ gives left-handed, $-i$ gives right-handed."
        ],
        result: "Circular polarization is just two perpendicular linear oscillations with a quarter-wave phase shift. Any polarization can be decomposed into a sum of left and right circular states."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "Put on polarized sunglasses and tilt your head while looking at a screen. The brightness changes because the screen emits linearly polarized light, and the polarizer blocks the component perpendicular to its axis."
      },
      {
        title: "AI tutor prompt",
        body: "How does a quarter-wave plate convert linearly polarized light into circularly polarized light?"
      }
    ],
    quickActions: {
      intuition: "Polarization is the direction the electric field oscillates. Linear means it stays in one plane; circular means it corkscrews. These states can be combined to make any polarization.",
      formal: "The chapter introduces the polarization vector and Jones formalism, decomposes general polarization into linear and circular bases, and discusses physical devices that manipulate polarization.",
      quiz: "Checkpoint: if you pass circularly polarized light through a linear polarizer, what fraction of the intensity gets through?"
    },
    prompts: [
      "Why are there only two independent polarization states for a wave traveling in a given direction?",
      "How can you experimentally distinguish linearly polarized light from circularly polarized light?"
    ],
    mathPrereqs: ["complex-numbers", "matrix-methods"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "polarization"
  },
  {
    number: 15,
    title: "Refraction",
    slug: "refraction",
    pdf: "./lectures/15-Refraction.pdf",
    conceptTitle: "Light bends when it changes speed",
    conceptCaption: "Snell's law governs how light rays change direction at an interface, leading to lenses, total internal reflection, and fiber optics.",
    explanation: [
      "<term key='snells-law'>Snell's law</term> $n_1\\sin(\\theta_1) = n_2\\sin(\\theta_2)$ follows from requiring the wavefronts to be continuous at the boundary. Light bends toward the normal when entering a denser medium.",
      "When light goes from a denser to a less dense medium, there exists a critical angle beyond which all light is reflected. This <term key='total-internal-reflection'>total internal reflection</term> is the principle behind fiber optics."
    ],
    goals: [
      "Derive Snell's law from wavefront matching at a boundary.",
      "Calculate the critical angle for total internal reflection.",
      "Apply refraction principles to lenses, fiber optics, and atmospheric phenomena."
    ],
    pitfalls: [
      "Confusing the angle of incidence with the angle measured from the surface instead of the normal.",
      "Thinking total internal reflection can occur when going from less dense to more dense media.",
      "Forgetting that the frequency of light stays the same across a boundary; only the wavelength changes."
    ],
    terms: {
      "snells-law": {
        short: "$n_1\\sin(\\theta_1) = n_2\\sin(\\theta_2)$, the law of refraction.",
        long: "Snell's law follows from the requirement that wave crests match at the boundary. Since the speed changes ($v = c/n$), the wavelength changes, forcing the direction to change to maintain phase matching."
      },
      "total-internal-reflection": {
        short: "Complete reflection when light hits a less dense medium beyond the critical angle.",
        long: "When $n_1 > n_2$ and $\\sin(\\theta_1) > n_2/n_1$, there is no real refraction angle. All light is reflected back. The critical angle is $\\theta_c = \\arcsin(n_2/n_1)$. This is how fiber optic cables guide light."
      },
      "fermats-principle": {
        short: "Light follows the path of least time.",
        long: "Fermat's principle provides an alternative derivation of Snell's law. Light traveling from point A in medium 1 to point B in medium 2 takes the path that minimizes total travel time, which requires bending at the interface."
      }
    },
    derivations: [
      {
        title: "Snell's law from wavefront matching",
        teaser: "Require that the phase of the wave be continuous along the boundary between two media.",
        steps: [
          "A plane wave hits a flat boundary. The wavefronts in medium 1 make angle $\\theta_1$ with the boundary.",
          "The distance between wavefronts along the boundary must be the same on both sides: $\\lambda_1/\\sin(\\theta_1) = \\lambda_2/\\sin(\\theta_2)$.",
          "Since $\\lambda = \\lambda_0/n$, this gives $n_1\\sin(\\theta_1) = n_2\\sin(\\theta_2)$."
        ],
        result: "Snell's law is a geometric consequence of phase matching at a boundary combined with the change in wavelength."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "Muller's analogy: imagine a line of people holding hands marching from pavement onto sand. The side that hits sand first slows down, causing the whole line to rotate. This is exactly how a wavefront refracts."
      },
      {
        title: "AI tutor prompt",
        body: "Why do roads sometimes appear wet on hot days? Explain the mirage in terms of the temperature dependence of the refractive index of air."
      }
    ],
    quickActions: {
      intuition: "Light bends at a boundary because its speed changes but its frequency cannot. The wavefronts have to match at the interface, which forces a change in direction.",
      formal: "The chapter derives Snell's law from wavefront matching, computes the critical angle for total internal reflection, and applies these to fiber optics and atmospheric refraction.",
      quiz: "Checkpoint: what is the critical angle for total internal reflection in glass ($n = 1.5$) surrounded by air?"
    },
    prompts: [
      "Why does the frequency of light not change when it enters a new medium?",
      "How does a SOFAR channel in the ocean work by the same principle as total internal reflection?"
    ],
    mathPrereqs: ["trig-identities", "pde-basics"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "refraction"
  },
  {
    number: 16,
    title: "Prisms",
    slug: "prisms",
    pdf: "./lectures/16-Prisms.pdf",
    conceptTitle: "Accelerating charges radiate; prisms separate colors",
    conceptCaption: "Charges must accelerate to produce electromagnetic radiation. Dispersion in glass makes a prism split white light into its spectrum.",
    explanation: [
      "The <term key='larmor-formula'>Larmor formula</term> says that an accelerating charge radiates power proportional to the acceleration squared. The radiation pattern has the characteristic $\\sin^2(\\theta)$ angular dependence.",
      "A <term key='prism'>prism</term> separates white light because the index of refraction depends on wavelength (dispersion). Blue light bends more than red because glass has higher n at shorter wavelengths."
    ],
    goals: [
      "State the Larmor formula and its angular radiation pattern.",
      "Explain why only accelerating charges radiate.",
      "Describe how dispersion in a prism creates a spectrum."
    ],
    pitfalls: [
      "Thinking a charge moving at constant velocity radiates (it does not in its rest frame).",
      "Confusing dispersion (n depends on wavelength) with diffraction (wave bending around obstacles).",
      "Forgetting the $1/R$ dependence of the radiation field versus $1/R^2$ for the Coulomb field."
    ],
    terms: {
      "larmor-formula": {
        short: "$P = q^2 a^2/(6\\pi\\epsilon_0 c^3)$, power radiated by an accelerating charge.",
        long: "The Larmor formula shows that the power radiated is proportional to the square of the acceleration. It applies to non-relativistic charges and explains why antennas need oscillating currents."
      },
      prism: {
        short: "A transparent wedge that separates light by wavelength.",
        long: "Because the index of refraction of glass is higher for shorter wavelengths (normal dispersion), a prism bends blue light more than red. This spreads white light into a rainbow."
      },
      dispersion: {
        short: "The dependence of wave speed (or refractive index) on wavelength.",
        long: "Dispersion causes a prism to split white light and a wavepacket to spread out. In glass, electrons in the material respond differently to different frequencies, making $n(\\lambda)$ a decreasing function."
      }
    },
    derivations: [
      {
        title: "Why the radiation field falls as $1/R$",
        teaser: "Use Purcell's argument about field-line kinks from a suddenly accelerated charge.",
        steps: [
          "A charge suddenly accelerates. The news travels outward at speed c, creating a shell.",
          "Inside the shell, the field points to the new position. Outside, it points to the old position. In the shell, the field line connects, creating a tangential (radiative) component.",
          "The tangential component $E_\\theta = \\frac{qa\\sin(\\theta)}{4\\pi\\epsilon_0 c^2 R}$ falls as $1/R$, unlike the Coulomb field which falls as $1/R^2$."
        ],
        result: "The radiation field decays as $1/R$, so the radiated power per solid angle goes as $1/R^2$, meaning the total power integrated over a sphere is independent of $R$: energy is truly carried away to infinity."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "Newton's famous experiment: pass sunlight through a prism and see the rainbow on the wall. Then pass one color through a second prism and it does not split further, proving the colors are fundamental."
      },
      {
        title: "AI tutor prompt",
        body: "Why does the sky look blue and sunsets look red? Relate it to the frequency dependence of Rayleigh scattering, which comes from the Larmor formula."
      }
    ],
    quickActions: {
      intuition: "Only acceleration produces radiation. A prism separates colors because glass slows different wavelengths by different amounts, bending blue more than red.",
      formal: "The chapter derives the Larmor formula for radiation from accelerating charges, explains the $\\sin^2\\theta$ radiation pattern, and connects dispersion $n(\\lambda)$ to the separation of colors in a prism.",
      quiz: "Checkpoint: why does the radiation field fall as $1/R$ while the Coulomb field falls as $1/R^2$?"
    },
    prompts: [
      "What physical mechanism causes the index of refraction to depend on wavelength?",
      "Why does the Larmor formula predict zero radiation along the axis of acceleration?"
    ],
    mathPrereqs: ["taylor-series", "trig-identities"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "prisms"
  },
  {
    number: 17,
    title: "Color",
    slug: "color",
    pdf: "./lectures/17-Color.pdf",
    conceptTitle: "Color is a property of the eye, not just the light",
    conceptCaption: "Human color perception depends on three types of cone cells. Color mixing, metamers, and color spaces all follow from this physiology.",
    explanation: [
      "Color is not simply wavelength. The human eye has three types of <term key='cone-cells'>cone cells</term>, sensitive to different ranges of wavelengths. What we perceive as a single color is determined by the ratio of responses from these three receptors.",
      "Two physically different spectra can appear identical to the eye (<term key='metamers'>metamers</term>). The <term key='cie-color-space'>CIE color space</term> maps all perceivable colors into a 2D diagram based on the tristimulus values."
    ],
    goals: [
      "Explain why three numbers (RGB) suffice to describe any perceived color.",
      "Define metamers and why physically different spectra can look the same.",
      "Read a CIE chromaticity diagram and understand the gamut of a display."
    ],
    pitfalls: [
      "Thinking each color corresponds to a unique wavelength (many colors like brown and pink have no single wavelength).",
      "Confusing additive color mixing (light) with subtractive color mixing (paint).",
      "Forgetting that the RGB matching functions have negative values at some wavelengths."
    ],
    terms: {
      "cone-cells": {
        short: "Three types of photoreceptors in the retina sensitive to S (blue), M (green), and L (red) ranges.",
        long: "Each cone type has a broad spectral sensitivity curve. Color perception depends on the relative excitation of all three types. This is why three primary colors can reproduce most visible colors."
      },
      metamers: {
        short: "Physically different spectra that look identical to the eye.",
        long: "Because we have only three types of cones, many different spectral distributions produce the same triplet of cone responses. A computer screen exploits this: it only emits three wavelengths but can match the appearance of most colors."
      },
      "cie-color-space": {
        short: "A standardized map of all colors perceivable by the human eye.",
        long: "The CIE 1931 color space uses the Wright-Guild color matching functions to assign (x, y) chromaticity coordinates to every visible color. The horseshoe-shaped gamut boundary represents monochromatic spectral colors."
      }
    },
    derivations: [
      {
        title: "Why three primaries suffice (Grassmann's laws)",
        teaser: "The linearity of color matching means any color can be represented as a weighted sum of three primaries.",
        steps: [
          "Color matching is empirically linear: if A matches B and C matches D, then A + C matches B + D (Grassmann's law).",
          "Since we have three types of cones, any spectrum is mapped to a 3-vector (L, M, S) of cone responses.",
          "Any two spectra that produce the same (L, M, S) are indistinguishable, so 3 numbers characterize color."
        ],
        result: "The three-dimensional nature of color perception is a consequence of having exactly three cone types. Color spaces like RGB and CIE are coordinate systems in this 3D perceptual space."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "Mix red and green paint and you get brown. Mix red and green light and you get yellow. The difference is subtractive versus additive mixing, and both follow from how our three cone types respond."
      },
      {
        title: "AI tutor prompt",
        body: "Why is there no spectral (single-wavelength) light that looks brown? What combination of wavelengths produces the perception of brown?"
      }
    ],
    quickActions: {
      intuition: "Color is not a property of light alone -- it is created by the eye. Three types of cones reduce the infinite-dimensional space of spectra to a 3D color space, explaining why RGB displays work.",
      formal: "The chapter introduces the Wright-Guild color matching experiments, Grassmann's linearity laws, the CIE chromaticity diagram, and explains metamers through the three-cone model.",
      quiz: "Checkpoint: why do the RGB color matching functions go negative at some wavelengths, and what does that physically mean in the color matching experiment?"
    },
    prompts: [
      "How does a computer monitor that emits only three wavelengths reproduce millions of colors?",
      "Why is the gamut of real displays smaller than the full CIE diagram?"
    ],
    mathPrereqs: ["dimensional-analysis"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "color"
  },
  {
    number: 18,
    title: "Antennas",
    slug: "antennas",
    pdf: "./lectures/18-Antennas.pdf",
    conceptTitle: "Arranged sources create directed radiation patterns",
    conceptCaption: "By combining multiple oscillating sources with specific spacings and phases, antennas can focus electromagnetic energy into narrow beams.",
    explanation: [
      "A single oscillating charge radiates with a $\\sin^2(\\theta)$ pattern. An <term key='antenna-array'>antenna array</term> combines multiple sources to create interference patterns that focus energy in preferred directions.",
      "The radiation pattern from $N$ equally spaced sources with phase difference $\\delta$ between adjacent elements produces sharp <term key='lobes'>lobes</term> whose width decreases as $N$ increases."
    ],
    goals: [
      "Compute the radiation pattern of two sources with a phase difference.",
      "Generalize to N sources and derive the array factor.",
      "Understand how antenna arrays achieve directionality through interference."
    ],
    pitfalls: [
      "Confusing the single-source radiation pattern with the array factor.",
      "Forgetting that the phase difference depends on both the source spacing and the observation angle.",
      "Thinking that adding more sources always increases the total power (it redistributes the pattern)."
    ],
    terms: {
      "antenna-array": {
        short: "Multiple sources arranged to create directional radiation through interference.",
        long: "An antenna array uses the interference of waves from multiple sources to create a radiation pattern with narrow lobes. The spacing, number of elements, and relative phase of the sources control the beam direction and width."
      },
      lobes: {
        short: "Directions of constructive interference in a radiation pattern.",
        long: "The main lobe is the direction of maximum radiation. Side lobes appear at other angles where partial constructive interference occurs. More elements produce narrower main lobes."
      },
      "array-factor": {
        short: "$I = I_0\\sin^2(N\\Delta/2)/\\sin^2(\\Delta/2)$ for $N$ sources.",
        long: "The array factor captures the interference pattern of $N$ equally spaced sources. It produces sharp peaks when $\\Delta = 2\\pi m$ (constructive interference from all sources) and has $N-2$ smaller side lobes between main peaks."
      }
    },
    derivations: [
      {
        title: "Radiation pattern from N equally spaced sources",
        teaser: "Sum the contributions from N sources with progressive phase shifts.",
        steps: [
          "Each source contributes $E_j = E_0 e^{ij\\Delta}$ where $\\Delta = kd\\sin(\\theta) + \\delta_0$ is the phase difference between adjacent sources.",
          "Sum the geometric series: $E_{\\text{total}} = E_0(1 - e^{iN\\Delta})/(1 - e^{i\\Delta})$.",
          "Take $|E_{\\text{total}}|^2$ to get $I = I_0\\sin^2(N\\Delta/2)/\\sin^2(\\Delta/2)$."
        ],
        result: "The intensity pattern has sharp peaks of height $N^2 I_0$ separated by $N-2$ smaller side lobes, giving directional radiation that sharpens with more sources."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "Imagine N speakers in a row, all playing the same note. Directly in front of them, all the sound arrives in phase and you hear maximum volume. Off to the side, the signals arrive at different times and partially cancel."
      },
      {
        title: "AI tutor prompt",
        body: "How does a phased-array radar steer its beam electronically without physically rotating the antenna?"
      }
    ],
    quickActions: {
      intuition: "An antenna array is interference engineering. By carefully spacing sources and controlling their phases, you can send energy in a chosen direction and suppress it elsewhere.",
      formal: "The chapter sums fields from $N$ phase-shifted sources using geometric series to derive the array factor, then analyzes the width and direction of the main lobe as functions of $N$, $d$, and $\\delta$.",
      quiz: "Checkpoint: for two sources separated by half a wavelength with no extra phase shift, in what directions do you get constructive and destructive interference?"
    },
    prompts: [
      "How does increasing the number of array elements affect the radiation pattern?",
      "What is the physical role of the phase shift $\\delta_0$ between adjacent elements?"
    ],
    mathPrereqs: ["fourier-math", "trig-identities", "integration-techniques"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "antennas"
  },
  {
    number: 19,
    title: "Diffraction",
    slug: "diffraction",
    pdf: "./lectures/19-Diffraction.pdf",
    conceptTitle: "Waves bend around obstacles and through slits",
    conceptCaption: "Huygens' principle explains diffraction: every point on a wavefront acts as a new source, and their interference creates the diffraction pattern.",
    explanation: [
      "<term key='huygens-principle'>Huygens' principle</term> states that every point on a wavefront can be treated as a source of secondary wavelets. When a wave passes through a slit, these wavelets interfere to produce a characteristic <term key='diffraction-pattern'>diffraction pattern</term>.",
      "A <term key='diffraction-grating'>diffraction grating</term> with many slits produces extremely sharp peaks, used in spectroscopy to precisely measure wavelengths."
    ],
    goals: [
      "Apply Huygens' principle to predict diffraction through single and multiple slits.",
      "Derive the diffraction grating intensity pattern using the antenna array result.",
      "Understand the Rayleigh criterion for resolving two closely spaced sources."
    ],
    pitfalls: [
      "Confusing single-slit diffraction ($\\text{sinc}^2$ envelope) with multi-slit interference (sharp peaks).",
      "Thinking diffraction only matters when the slit is smaller than the wavelength (it matters whenever they are comparable).",
      "Forgetting that more slits make peaks sharper but do not change their positions."
    ],
    terms: {
      "huygens-principle": {
        short: "Every point on a wavefront acts as a source of secondary wavelets.",
        long: "Huygens' principle is a powerful tool for understanding diffraction. The wave on the far side of an obstacle is entirely determined by the wave amplitude and phase at the opening, as if small sources were placed there."
      },
      "diffraction-pattern": {
        short: "The intensity distribution produced by a wave passing through an aperture.",
        long: "For a single slit of width $a$, the intensity pattern is $I = I_0\\,\\text{sinc}^2(\\pi a\\sin\\theta/\\lambda)$. The central maximum has angular width $2\\lambda/a$, and narrower slits produce wider patterns."
      },
      "diffraction-grating": {
        short: "Many equally spaced slits that produce sharp spectral peaks.",
        long: "A diffraction grating uses $N$ slits to produce intensity peaks at angles where $d\\sin\\theta = m\\lambda$. With many slits, the peaks become extremely narrow, allowing precise wavelength measurement."
      }
    },
    derivations: [
      {
        title: "Diffraction grating pattern from N slits",
        teaser: "Apply the N-source antenna result from the previous chapter to N slits.",
        steps: [
          "Each slit acts as a Huygens source. For $N$ slits spaced by $d$, the phase difference between adjacent slits for angle $\\theta$ is $\\Delta = 2\\pi d\\sin(\\theta)/\\lambda$.",
          "The intensity follows the array factor: $I = I_0\\sin^2(N\\Delta/2)/\\sin^2(\\Delta/2)$.",
          "Main maxima occur when $\\Delta = 2\\pi m$, giving $d\\sin(\\theta) = m\\lambda$. The peak width scales as $1/N$."
        ],
        result: "The diffraction grating equation $d\\sin(\\theta) = m\\lambda$ gives the positions of the bright fringes. More slits mean sharper peaks and better spectral resolution."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "Shine a laser through a fine comb and see the diffraction pattern on the wall. The spacing of the bright dots tells you the tooth spacing of the comb, just as X-ray diffraction reveals atomic spacings in crystals."
      },
      {
        title: "AI tutor prompt",
        body: "Why can you hear sound from around a corner but not see light around a corner? Relate it to the wavelength compared to the size of the obstacle."
      }
    ],
    quickActions: {
      intuition: "Diffraction is what happens when waves encounter edges or openings comparable to their wavelength. The pattern is computed by treating each point in the aperture as a tiny source and summing their contributions.",
      formal: "The chapter applies Huygens' principle and the $N$-source array factor to derive the single-slit and multi-slit diffraction patterns, connecting them to the grating equation $d\\sin\\theta = m\\lambda$.",
      quiz: "Checkpoint: how does the angular width of the central maximum for single-slit diffraction scale with slit width?"
    },
    prompts: [
      "What determines the resolving power of a diffraction grating?",
      "Why does the single-slit pattern have minima at $\\sin(\\theta) = m\\lambda/a$?"
    ],
    mathPrereqs: ["fourier-transform-math", "integration-techniques"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "diffraction"
  },
  {
    number: 20,
    title: "Quantum Mechanics",
    slug: "quantum-mechanics",
    pdf: "./lectures/20-Quantum-Mechanics.pdf",
    conceptTitle: "Particles are waves too",
    conceptCaption: "Quantum mechanics extends wave-particle duality: electrons diffract, photons come in quanta, and the Schrodinger equation is a wave equation.",
    explanation: [
      "The course comes full circle: just as we went from oscillators to waves, quantum mechanics says particles like electrons also behave as <term key='matter-waves'>matter waves</term>. The de Broglie wavelength $\\lambda = h/p$ connects momentum to wavelength.",
      "The <term key='schrodinger-equation'>Schrodinger equation</term> is the wave equation for quantum particles. Its solutions are wavefunctions whose squared magnitude gives the probability of finding the particle at each position."
    ],
    goals: [
      "Understand wave-particle duality for both light (photons) and matter (electrons).",
      "Relate the de Broglie wavelength to momentum.",
      "See the Schrodinger equation as a wave equation with a potential energy term."
    ],
    pitfalls: [
      "Thinking the wavefunction is a physical wave in space like a water wave (it is a probability amplitude).",
      "Confusing the uncertainty principle with measurement error (it is a fundamental limit).",
      "Forgetting that the photoelectric effect requires quantized light, not just classical waves."
    ],
    terms: {
      "matter-waves": {
        short: "Particles have a wavelength $\\lambda = h/p$ (de Broglie).",
        long: "De Broglie proposed that all particles have wave properties with wavelength inversely proportional to momentum. This was confirmed by electron diffraction experiments. It is the foundation of quantum mechanics."
      },
      "schrodinger-equation": {
        short: "The quantum wave equation: $i\\hbar\\,\\partial\\psi/\\partial t = \\hat{H}\\psi$.",
        long: "The Schrodinger equation governs how the quantum wavefunction evolves in time. For a particle in a potential $V(x)$, it becomes $-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} + V(x)\\psi = E\\psi$ for stationary states."
      },
      "uncertainty-principle": {
        short: "$\\Delta x\\,\\Delta p \\geq \\hbar/2$: position and momentum cannot both be precisely known.",
        long: "The uncertainty principle is a direct consequence of wave mechanics. A wavefunction localized in a narrow region requires a broad range of momenta (wavelengths), and vice versa. It is the quantum version of the wavepacket bandwidth relation."
      }
    },
    derivations: [
      {
        title: "Energy quantization in a box from standing waves",
        teaser: "Apply boundary conditions to the Schrodinger equation and get discrete energy levels.",
        steps: [
          "For a particle in a box of width $L$ with infinite walls, the wavefunction must vanish at $x = 0$ and $x = L$.",
          "The solutions are $\\psi_n = A\\sin(n\\pi x/L)$, just like standing waves on a string with fixed ends.",
          "The allowed wavenumbers $k_n = n\\pi/L$ give energies $E_n = \\hbar^2 k_n^2/(2m) = n^2\\pi^2\\hbar^2/(2mL^2)$."
        ],
        result: "Energy is quantized because only certain standing waves fit in the box, exactly like the normal modes of a string. The quantum number n labels the mode."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "An electron in an atom is like a standing wave wrapped around the nucleus. Only whole numbers of wavelengths fit, which is why energy levels are discrete and the periodic table has its structure."
      },
      {
        title: "AI tutor prompt",
        body: "How does the particle-in-a-box problem connect to the vibrating string problem from earlier in the course?"
      }
    ],
    quickActions: {
      intuition: "Quantum mechanics is the final payoff of this course: particles are waves. The de Broglie relation and the Schrodinger equation are the quantum versions of concepts you already know from classical waves.",
      formal: "The chapter introduces the de Broglie relation, the photoelectric effect as evidence for photon quantization, the Schrodinger equation, and solves the particle in a box to show energy quantization.",
      quiz: "Checkpoint: what is the de Broglie wavelength of a baseball moving at 30 m/s, and why is this not observable?"
    },
    prompts: [
      "How is the particle-in-a-box quantization analogous to standing waves on a string?",
      "Why did the ultraviolet catastrophe require the introduction of quantized energy?"
    ],
    mathPrereqs: ["complex-numbers", "probability-waves", "solving-odes"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "quantum"
  },
  {
    number: 21,
    title: "Doppler Effect",
    slug: "doppler-effect",
    pdf: "./lectures/21-Doppler-Effect.pdf",
    conceptTitle: "Motion shifts frequency",
    conceptCaption: "When a source or observer moves, the perceived frequency changes. This effect is universal for all waves and has both classical and relativistic versions.",
    explanation: [
      "The <term key='doppler-effect'>Doppler effect</term> shifts the frequency heard by an observer when there is relative motion between source and observer. For a source moving toward you, wavefronts bunch up and the frequency rises.",
      "The formula differs depending on whether the source or the observer is moving (unlike the relativistic version). At speeds above the wave speed, the source outruns its own waves, creating a <term key='mach-cone'>Mach cone</term>."
    ],
    goals: [
      "Derive the Doppler shift for a moving source and for a moving observer.",
      "Understand why the two cases give different results (unlike the relativistic Doppler effect).",
      "Describe what happens when the source exceeds the wave speed."
    ],
    pitfalls: [
      "Using the relativistic Doppler formula for sound waves or vice versa.",
      "Forgetting the sign convention: frequency increases when source and observer approach.",
      "Thinking the sonic boom occurs only at the moment of crossing the sound barrier."
    ],
    terms: {
      "doppler-effect": {
        short: "Frequency shift due to relative motion between source and observer.",
        long: "For a stationary observer and a source moving at speed $v_s$, the received frequency is $\\nu' = \\nu\\,c_s/(c_s + v_s)$, where $v_s$ is positive for receding motion. For a moving observer and stationary source, $\\nu' = \\nu(c_s + v_o)/c_s$."
      },
      "mach-cone": {
        short: "The cone-shaped shock front from a supersonic source.",
        long: "When $v_s > c_s$, the source outruns its wavefronts. All the accumulated wavefronts pile up along a cone with half-angle $\\theta = \\arcsin(c_s/v_s)$. This is heard as a sonic boom."
      },
      "relativistic-doppler": {
        short: "The Doppler formula including time dilation from special relativity.",
        long: "For light, the Doppler effect depends only on relative velocity (not on who moves) and includes a time dilation factor: $f' = f\\sqrt{(1-\\beta)/(1+\\beta)}$ where $\\beta = v/c$. This is used in measuring the expansion of the universe."
      }
    },
    derivations: [
      {
        title: "Doppler shift for a moving source",
        teaser: "Track the spacing between successive wavefronts emitted by a moving source.",
        steps: [
          "A source emits wavefronts separated by period $T$. In time $T$, the source moves $v_s T$.",
          "Ahead of the source, consecutive wavefronts are separated by $\\lambda' = (c_s - v_s)T = (c_s - v_s)/\\nu$.",
          "The observed frequency is $\\nu' = c_s/\\lambda' = \\nu\\,c_s/(c_s - v_s)$, which is higher (blue-shifted)."
        ],
        result: "The Doppler formula $\\nu' = \\nu\\,c_s/(c_s \\mp v_s)$ gives a higher frequency when the source approaches and a lower frequency when it recedes."
      }
    ],
    deepDives: [
      {
        title: "Physical picture",
        body: "An ambulance siren sounds higher pitched as it approaches and lower as it recedes. The wavefronts are compressed ahead of the ambulance and stretched behind it."
      },
      {
        title: "AI tutor prompt",
        body: "Why does the classical Doppler formula distinguish between source motion and observer motion, while the relativistic version does not?"
      }
    ],
    quickActions: {
      intuition: "The Doppler effect is geometry: a moving source compresses the waves it sends forward and stretches those it sends backward. At the speed of sound, all the waves pile up into a shock.",
      formal: "The chapter derives the classical Doppler shift for moving source and moving observer separately, then combines them. It concludes with the Mach cone geometry for supersonic sources.",
      quiz: "Checkpoint: if a source moves toward you at half the speed of sound, by what factor does the frequency increase?"
    },
    prompts: [
      "Why is the frequency change not symmetric between approaching and receding in the classical Doppler formula?",
      "How do astronomers use the Doppler effect to measure the velocities of distant galaxies?"
    ],
    mathPrereqs: ["trig-identities", "dimensional-analysis"],
    lectureContent: [
      { heading: "Introduction", body: "<p>Lecture content will be loaded here.</p>", interactive: null, mathLinks: [] }
    ],
    scene: "doppler"
  }
];

const chapterTeachingNotes = {
  "oscillators-linearity": {
    "lede": "Oscillation is the most basic motion in physics beyond rest. Any system near equilibrium executes simple harmonic motion because every smooth potential looks like a parabola at the bottom.",
    "bridge": "Focus on this: Hooke's law is universal near equilibrium, linearity lets you add solutions, and complex exponentials turn differential equations into algebra.",
    "mastery": [
      "Derive the oscillator equation from a Taylor expansion of any potential near its minimum.",
      "Solve the damped oscillator and classify underdamped, critically damped, and overdamped regimes.",
      "Explain why linearity (superposition) is the single most important property for everything that follows."
    ]
  },
  "driven-oscillators": {
    "lede": "Driving a damped oscillator at its natural frequency produces the largest response. This is resonance, and it appears everywhere from bridge collapses to radio tuning.",
    "bridge": "The key move is to replace $\\cos(\\omega t)$ with $\\text{Re}(e^{-i\\omega t})$, solve the complex equation algebraically, and then read off the amplitude and phase of the real solution.",
    "mastery": [
      "Solve for the steady-state amplitude and phase as functions of driving frequency.",
      "Identify the resonance peak, its width ($\\gamma$), and the quality factor $Q = \\omega_0/\\gamma$.",
      "Explain why the transient solution dies away and only the steady state survives at long times."
    ]
  },
  "coupled-oscillators": {
    "lede": "Coupling two oscillators creates normal modes: collective motion patterns each with a single frequency. Beats arise when two close normal-mode frequencies interfere.",
    "bridge": "The trick is to change coordinates from individual positions to sum and difference (or eigenvectors). In these new coordinates, the coupled system decouples into independent oscillators.",
    "mastery": [
      "Find normal modes by diagonalizing the coupled equations of motion.",
      "Explain beats as the superposition of two normal modes with close frequencies.",
      "Describe how energy flows back and forth between two coupled oscillators."
    ]
  },
  "oscillators-to-waves": {
    "lede": "Chain together many oscillators, take the continuum limit, and out pops the wave equation. This is the bridge from discrete physics to continuous wave phenomena.",
    "bridge": "The chapter moves from 2 masses to 3 to N, then lets N go to infinity. Watch how the discrete dispersion relation becomes linear in that limit.",
    "mastery": [
      "Solve the N-mass system and recognize the sinusoidal normal mode shapes.",
      "Derive the discrete dispersion relation $\\omega = 2\\omega_0|\\sin(ka/2)|$ and take the continuum limit.",
      "Explain why boundary conditions determine the set of allowed normal modes."
    ]
  },
  "fourier-series": {
    "lede": "Fourier series is the mathematical formalization of the idea that any periodic function can be built from simple harmonics.",
    "bridge": "The orthogonality of sines and cosines is the engine that makes Fourier analysis work. Once you understand why $\\int \\sin(nx)\\cos(mx)\\,dx$ over a period vanishes for $n \\neq m$, everything else follows.",
    "mastery": [
      "Write down the Fourier series and derive the coefficient formulas from orthogonality.",
      "Compute the Fourier series of common waveforms like the sawtooth and square wave.",
      "Explain the Gibbs phenomenon at discontinuities."
    ]
  },
  "waves": {
    "lede": "This chapter grounds the wave equation in physical reality: vibrating strings and sound in air both satisfy it, with wave speed determined by material properties.",
    "bridge": "For strings, the restoring force is tension acting on curvature. For sound, it is pressure differences driving density changes. Both lead to the same mathematical equation.",
    "mastery": [
      "Derive the wave equation for a string from Newton's second law on a small element.",
      "Derive the speed of sound in an ideal gas in terms of $\\gamma$, pressure, and density.",
      "Distinguish longitudinal from transverse waves and give examples of each."
    ]
  },
  "music": {
    "lede": "Music is applied Fourier analysis. The consonance of intervals, the timbre of instruments, and the dissonance of clashing notes all follow from how harmonics combine.",
    "bridge": "The key insight is that simple frequency ratios produce harmonic alignment, which the ear hears as consonance. Complex ratios create audible beating.",
    "mastery": [
      "Explain why the octave (2:1) and perfect fifth (3:2) sound consonant using harmonic overlap.",
      "Relate the Fourier spectrum of an instrument to its perceived timbre.",
      "Describe how beats create the perception of dissonance between nearby frequencies."
    ]
  },
  "fourier-transforms": {
    "lede": "The Fourier transform extends the Fourier series to non-periodic signals, turning the discrete sum over harmonics into a continuous integral over all frequencies.",
    "bridge": "The derivation is clean: take the Fourier series period L to infinity, replace sums with integrals, and replace discrete coefficients with a continuous spectral density.",
    "mastery": [
      "Derive the Fourier transform from the L -> infinity limit of the exponential Fourier series.",
      "Compute the Fourier transform of a damped sinusoid and identify the Lorentzian spectral shape.",
      "Interpret the power spectrum $|\\tilde{f}(\\omega)|^2$ and relate its width to the damping rate."
    ]
  },
  "reflection-impedance": {
    "lede": "When a wave encounters a boundary between two media, impedance mismatch determines how much reflects and how much transmits.",
    "bridge": "The chapter is all about boundary conditions: continuity of displacement and continuity of force at the junction. These two conditions uniquely determine the reflection and transmission coefficients.",
    "mastery": [
      "Derive reflection and transmission coefficients from boundary conditions at a junction.",
      "Define impedance and explain why impedance matching eliminates reflection.",
      "Explain why the reflected wave inverts when going into a denser medium."
    ]
  },
  "power": {
    "lede": "Waves carry energy. The power transmitted depends on the impedance of the medium and the square of the oscillation velocity.",
    "bridge": "The key result is $P = Z(\\partial A/\\partial t)^2$. From this, energy conservation at a boundary follows directly from the reflection and transmission coefficients.",
    "mastery": [
      "Derive kinetic and potential energy densities for a wave on a string.",
      "Show that power equals impedance times velocity squared for a traveling wave.",
      "Verify energy conservation at a boundary: $P_{\\text{reflected}} + P_{\\text{transmitted}} = P_{\\text{incident}}$."
    ]
  },
  "wavepackets": {
    "lede": "A wavepacket is a localized pulse made from many frequencies. Its envelope moves at the group velocity, and dispersion causes it to spread.",
    "bridge": "The distinction between group velocity and phase velocity is the central idea. Taylor-expanding the dispersion relation around the carrier frequency gives both the envelope speed and the spreading rate.",
    "mastery": [
      "Construct a Gaussian wavepacket and relate its spatial width to its spectral width.",
      "Derive the group velocity as $d\\omega/dk$ and distinguish it from phase velocity.",
      "Explain dispersion as the spreading of a wavepacket in a medium where v depends on frequency."
    ]
  },
  "wave-phenomena": {
    "lede": "Wave phenomena show up in earthquakes, sonar, sonic booms, and countless technologies. The same principles apply across all these domains.",
    "bridge": "This is a survey chapter. The goal is to see familiar wave concepts (reflection, refraction, Doppler, shock waves) applied in diverse real-world contexts.",
    "mastery": [
      "Describe how P-waves and S-waves reveal the structure of Earth's interior.",
      "Explain the SOFAR sound channel and why sound can travel far in the ocean.",
      "Derive the Mach cone angle and explain why a sonic boom is heard as a single bang."
    ]
  },
  "light": {
    "lede": "Light is an electromagnetic wave. Maxwell's equations predict its speed, and the electromagnetic spectrum spans from radio to gamma rays.",
    "bridge": "The derivation of the EM wave equation from Maxwell's equations is the central calculation. Everything else follows from recognizing that $1/\\sqrt{\\mu_0\\epsilon_0} = c$.",
    "mastery": [
      "Derive the electromagnetic wave equation from Maxwell's equations in vacuum.",
      "Identify $c = 1/\\sqrt{\\mu_0\\epsilon_0}$ and explain why this was a revolutionary prediction.",
      "Survey the electromagnetic spectrum and relate wavelength/frequency to physical phenomena."
    ]
  },
  "polarization": {
    "lede": "Polarization is the vector nature of electromagnetic waves. The direction and phase of the oscillating E field define linear, circular, and elliptical polarization states.",
    "bridge": "Think of the polarization vector as a complex 2-vector (Jones vector). The relative phase between its components is what distinguishes linear from circular polarization.",
    "mastery": [
      "Describe linear, circular, and elliptical polarization using the Jones vector formalism.",
      "Explain how a quarter-wave plate converts linear to circular polarization.",
      "Calculate the intensity transmitted through a linear polarizer for any input polarization."
    ]
  },
  "refraction": {
    "lede": "Snell's law governs how light bends at a boundary. It follows from the requirement that wavefronts match at the interface.",
    "bridge": "The key physical insight is that frequency is preserved across a boundary but wavelength changes, forcing the direction to change to maintain phase coherence.",
    "mastery": [
      "Derive Snell's law from wavefront matching at a flat boundary.",
      "Calculate the critical angle for total internal reflection and apply it to fiber optics.",
      "Explain atmospheric refraction phenomena like mirages."
    ]
  },
  "prisms": {
    "lede": "Accelerating charges produce radiation, and prisms separate light by wavelength because the index of refraction depends on frequency.",
    "bridge": "The chapter connects two ideas: the Larmor formula for how radiation is generated, and dispersion for how it is separated by wavelength in a prism.",
    "mastery": [
      "State the Larmor formula and explain the $\\sin^2\\theta$ angular pattern of radiation.",
      "Explain why only accelerating charges radiate electromagnetic waves.",
      "Describe how dispersion $n(\\lambda)$ in glass causes a prism to separate white light into colors."
    ]
  },
  "color": {
    "lede": "Color is not a property of light alone. It is created by the three types of cone cells in the human eye, which reduce spectral information to three numbers.",
    "bridge": "The central fact is that we have exactly three cone types, making color a 3D quantity. Metamers, color matching, and the CIE diagram all follow from this biological constraint.",
    "mastery": [
      "Explain why three primary colors can reproduce most perceived colors.",
      "Define metamers and explain why different spectra can look identical.",
      "Read a CIE chromaticity diagram and explain the concept of a display's color gamut."
    ]
  },
  "antennas": {
    "lede": "Antenna arrays use constructive and destructive interference from multiple sources to create directional radiation patterns.",
    "bridge": "The radiation pattern of $N$ sources is a geometric series in the phase. The result is the array factor, which gives sharp peaks whose width decreases as $1/N$.",
    "mastery": [
      "Derive the array factor for N equally spaced sources.",
      "Explain how the beam direction can be steered by adjusting the phase between elements.",
      "Relate antenna directivity to the number of elements and their spacing."
    ]
  },
  "diffraction": {
    "lede": "Diffraction is what happens when waves encounter apertures or obstacles comparable to their wavelength. Huygens' principle turns every point in an aperture into a source.",
    "bridge": "The diffraction grating result is just the antenna array result applied to slits. The only new idea is Huygens' principle, which justifies treating each slit as a source.",
    "mastery": [
      "Apply Huygens' principle to compute diffraction patterns.",
      "Derive the grating equation $d\\sin\\theta = m\\lambda$ and explain the sharpening with more slits.",
      "State the Rayleigh criterion and explain its implications for the resolving power of telescopes."
    ]
  },
  "quantum-mechanics": {
    "lede": "Quantum mechanics is where everything in the course converges: particles are waves, energy is quantized, and the Schrodinger equation is a wave equation.",
    "bridge": "The particle-in-a-box problem is exactly the vibrating-string problem with fixed ends. Quantized energy levels are just the allowed standing wave modes.",
    "mastery": [
      "Explain wave-particle duality and the de Broglie relation $\\lambda = h/p$.",
      "Solve the particle-in-a-box problem and connect it to standing waves on a string.",
      "State the uncertainty principle and derive it from the properties of wavepackets."
    ]
  },
  "doppler-effect": {
    "lede": "The Doppler effect shifts the frequency of waves when there is relative motion between source and observer. It applies to sound, light, and all waves.",
    "bridge": "The derivation is geometric: track the spacing between successive wavefronts from a moving source and compute the received frequency.",
    "mastery": [
      "Derive the Doppler shift for a moving source and for a moving observer.",
      "Explain why the classical Doppler formula is asymmetric between source and observer motion.",
      "Describe the Mach cone and sonic boom for supersonic sources."
    ]
  }
};

function chapterIndexFromHash() {
  const hash = location.hash.replace(/^#/, "");
  if (!hash) return 0;
  const idx = chapters.findIndex((ch) => ch.slug === hash);
  return idx >= 0 ? idx : 0;
}

const state = {
  chapterIndex: chapterIndexFromHash(),
  mode: modes[0].id,
  activeTerm: "hookes-law",
  focusTarget: null,
  showAllTerms: false
};

function navigateToChapter(index) {
  state.chapterIndex = index;
  state.focusTarget = null;
  state.showAllTerms = false;
  location.hash = chapters[index].slug;
  renderNav();
  renderChapter();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const sourceData = window.WAVES_SOURCE_DATA || {};

const chapterNav = document.getElementById("chapter-nav");
const chapterCount = document.getElementById("chapter-count");
const modePills = document.getElementById("mode-pills");
const searchQuery = document.getElementById("search-query");
const searchResults = document.getElementById("search-results");
const heroTitle = document.getElementById("hero-title");
const heroSubtitle = document.getElementById("hero-subtitle");
const chapterKicker = document.getElementById("chapter-kicker");
const chapterTitle = document.getElementById("chapter-title");
const chapterPdfLink = document.getElementById("chapter-pdf-link");
const sourceSummaryNote = document.getElementById("source-summary-note");
const chapterLede = document.getElementById("chapter-lede");
const chapterBridge = document.getElementById("chapter-bridge");
const chapterExplanation = document.getElementById("chapter-explanation");
const chapterGoals = document.getElementById("chapter-goals");
const chapterPitfalls = document.getElementById("chapter-pitfalls");
const labTitle = document.getElementById("lab-title");
const labCaption = document.getElementById("lab-caption");
const scene = document.getElementById("scene");
const assistantQuickActions = document.getElementById("assistant-quick-actions");
const assistantAnswer = document.getElementById("assistant-answer");
const termCloud = document.getElementById("term-cloud");
const termToggle = document.getElementById("term-toggle");
const termDetail = document.getElementById("term-detail");
const derivations = document.getElementById("derivations");
const quizDeck = document.getElementById("quiz-deck");
const deepDives = document.getElementById("deep-dives");
const chapterFrame = document.getElementById("chapter-frame");
const sourcePanel = document.getElementById("source-panel");
const sourceMeta = document.getElementById("source-meta");
const sourcePdfLink = document.getElementById("source-pdf-link");
const sourceSections = document.getElementById("source-sections");
const sourceEquations = document.getElementById("source-equations");
const sidebar = document.getElementById("atlas-sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarClose = document.getElementById("sidebar-close");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const prevChapter = document.getElementById("prev-chapter");
const nextChapter = document.getElementById("next-chapter");
const tooltip = document.getElementById("tooltip");
const studyQuestion = document.getElementById("study-question");
const askButton = document.getElementById("ask-button");
const chapterCoreIdea = document.getElementById("chapter-core-idea");
const chapterWatchout = document.getElementById("chapter-watchout");
const roadmapIntuition = document.getElementById("roadmap-intuition");
const roadmapFormal = document.getElementById("roadmap-formal");
const roadmapQuiz = document.getElementById("roadmap-quiz");
const sectionGuide = document.getElementById("section-guide");
const masteryChecklist = document.getElementById("mastery-checklist");
const masteryProgress = document.getElementById("mastery-progress");

chapterCount.textContent = `${chapters.length} chapters`;
const mobileMedia = window.matchMedia("(max-width: 1120px)");
const masteryStorageKey = "waves-mastery-v1";
const masteryState = loadMasteryState();

function loadMasteryState() {
  try {
    return JSON.parse(window.localStorage.getItem(masteryStorageKey) || "{}");
  } catch {
    return {};
  }
}

function saveMasteryState() {
  window.localStorage.setItem(masteryStorageKey, JSON.stringify(masteryState));
}

function isMobileLayout() {
  return mobileMedia.matches;
}

function closeSidebarDrawer() {
  document.body.classList.remove("sidebar-open");
  sidebarOverlay.hidden = true;
  sidebarToggle.setAttribute("aria-expanded", "false");
}

function openSidebarDrawer() {
  if (!isMobileLayout()) return;
  document.body.classList.add("sidebar-open");
  sidebarOverlay.hidden = false;
  sidebarToggle.setAttribute("aria-expanded", "true");
}

function toggleSidebarDrawer() {
  if (document.body.classList.contains("sidebar-open")) {
    closeSidebarDrawer();
    return;
  }
  openSidebarDrawer();
}

function syncSidebarDrawer() {
  if (!isMobileLayout()) {
    closeSidebarDrawer();
  }
}

function renderModes() {
  modePills.innerHTML = modes
    .map(
      (mode) => `
        <button class="mode-pill ${state.mode === mode.id ? "active" : ""}" data-mode="${mode.id}">
          ${mode.label}
        </button>
      `
    )
    .join("");
}

function renderNav() {
  chapterNav.innerHTML = chapters
    .map(
      (chapter, index) => `
        <button class="chapter-link ${index === state.chapterIndex ? "active" : ""}" data-index="${index}">
          <span class="chapter-link-number">Chapter ${chapter.number}</span>
          <span class="chapter-link-title-row">
            <span class="chapter-link-title">${chapter.title}</span>
          </span>
        </button>
      `
    )
    .join("");
}

function termButton(key, label) {
  return `<button class="inline-term" data-term="${key}">${label}</button>`;
}

function parseExplanation(paragraphs) {
  return paragraphs
    .map((paragraph) => {
      const html = paragraph.replace(/<term key='([^']+)'>(.*?)<\/term>/g, (_, key, label) => termButton(key, label));
      return `<p>${html}</p>`;
    })
    .join("");
}

function renderBullets(element, values) {
  element.innerHTML = values.map((value) => `<li>${value}</li>`).join("");
}

function sourceKeyForChapter(chapter) {
  return chapter.pdf.split("/").pop().replace(".pdf", "");
}

function getSourceForChapter(chapter) {
  return sourceData[sourceKeyForChapter(chapter)] || null;
}

function normalizeSearchText(value) {
  return value.toLowerCase().replace(/[_-]/g, " ").replace(/\s+/g, " ").trim();
}

function renderSearchResults() {
  const query = normalizeSearchText(searchQuery.value || "");
  if (!query) {
    searchResults.innerHTML = "";
    return;
  }

  const terms = query.split(" ").filter(Boolean);
  const matches = [];

  chapters.forEach((chapter, chapterIndex) => {
    const source = getSourceForChapter(chapter);
    if (!source?.searchIndex) return;

    source.searchIndex.forEach((entry) => {
      const haystack = normalizeSearchText(
        `${chapter.title} ${entry.title} ${entry.snippet} ${(entry.equations || []).join(" ")}`
      );
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      if (score === 0) return;
      matches.push({
        chapterIndex,
        chapterTitle: chapter.title,
        chapterNumber: chapter.number,
        kind: entry.kind,
        title: entry.title,
        snippet: entry.snippet,
        target: entry.target,
        anchor: entry.anchor || "",
        score
      });
    });
  });

  matches.sort((a, b) => b.score - a.score || a.chapterNumber - b.chapterNumber);

  searchResults.innerHTML = matches.slice(0, 10)
    .map(
      (result) => `
        <button
          class="search-result"
          data-search-chapter="${result.chapterIndex}"
          data-search-kind="${result.kind}"
          data-search-target="${result.target}"
          data-search-title="${result.title}"
          data-search-anchor="${result.anchor}"
        >
          <small>Chapter ${result.chapterNumber} · ${result.kind}</small>
          <strong>${result.title}</strong>
          <span>${result.snippet}</span>
        </button>
      `
    )
    .join("");
}

function cleanSnippet(text) {
  return text.replace(/\s+/g, " ").trim();
}

function buildOpeningBridge(chapter) {
  const notes = getTeachingNotes(chapter);
  return notes?.bridge || `Focus on this first: ${chapter.goals[0]} Then check yourself with: ${chapter.prompts[0]}`;
}

function buildSectionGuideCards(chapter) {
  const source = getSourceForChapter(chapter);
  const labels = ["Start here", "Then build", "Key move", "Lock it in"];
  const entries = (source?.searchIndex || [])
    .filter((entry) => entry.kind === "section")
    .filter((entry) => !/summary|appendix/i.test(entry.title))
    .slice(0, 4);

  if (!entries.length) {
    return chapter.goals.slice(0, 3).map((goal, index) => ({
      label: labels[index],
      title: chapter.goals[index] || chapter.title,
      summary: goal,
      anchor: ""
    }));
  }

  return entries.map((entry, index) => ({
    label: labels[index] || `Move ${index + 1}`,
    title: entry.title,
    summary: cleanSnippet(entry.snippet),
    anchor: entry.anchor || ""
  }));
}

function getTeachingNotes(chapter) {
  return chapterTeachingNotes[chapter.slug] || null;
}

function getMasteryItems(chapter) {
  return getTeachingNotes(chapter)?.mastery || [
    chapter.goals[0],
    chapter.goals[1] || chapter.prompts[0],
    chapter.prompts[0]
  ];
}

function getMasteryProgress(chapter) {
  const items = getMasteryItems(chapter);
  const completed = masteryState[chapter.slug] || [];
  return {
    completedCount: items.filter((_, index) => completed[index]).length,
    total: items.length
  };
}

function findSourceMentions(chapter, termKey) {
  const source = getSourceForChapter(chapter);
  if (!source) return [];

  const termLabel = termKey.replace(/[_-]/g, " ");
  const tokens = termLabel.split(" ").filter((token) => token.length > 2);
  const candidates = [
    ...((source.searchIndex || []).map((entry) => ({
      title: entry.title,
      text: `${entry.title}. ${entry.snippet}`,
      anchor: entry.anchor || "",
      kind: entry.kind
    }))),
    ...((source.derivationHighlights || []).map((entry) => ({
      title: entry.title,
      text: `${entry.title}. ${entry.excerpt}`,
      anchor: entry.anchor || "",
      kind: "derivation"
    }))),
    ...((source.summaryBlocks || []).map((value) => ({
      title: "Chapter summary",
      text: value,
      anchor: "",
      kind: "summary"
    }))),
    ...((source.openingBlocks || []).map((value) => ({
      title: "Opening notes",
      text: value,
      anchor: "",
      kind: "summary"
    })))
  ];

  const matches = [];
  for (const candidate of candidates) {
    const normalized = normalizeSearchText(`${candidate.title} ${candidate.text}`);
    const hasPhrase = normalized.includes(termLabel);
    const tokenHits = tokens.filter((token) => normalized.includes(token)).length;
    if (!hasPhrase && tokenHits === 0) continue;
    matches.push(candidate);
  }

  const seen = new Set();
  return matches.filter((candidate) => {
    const key = `${candidate.kind}|${candidate.anchor}|${candidate.title}|${candidate.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 3);
}

function renderRoadmap(chapter) {
  chapterCoreIdea.textContent = chapter.quickActions.intuition;
  chapterWatchout.textContent = chapter.pitfalls[0];
  roadmapIntuition.textContent = chapter.quickActions.intuition;
  roadmapFormal.textContent = chapter.quickActions.formal;
  roadmapQuiz.textContent = `${chapter.quickActions.quiz} ${chapter.prompts[1]}`;
}

function renderOpening(chapter) {
  const notes = getTeachingNotes(chapter);
  chapterLede.textContent = notes?.lede || chapter.quickActions.intuition;
  chapterBridge.textContent = buildOpeningBridge(chapter);
}

function renderSectionGuide(chapter) {
  const cards = buildSectionGuideCards(chapter);
  sectionGuide.innerHTML = cards
    .map((card) => `
      <article class="section-guide-card">
        <p class="mini-label">${card.label}</p>
        <h4>${card.title}</h4>
        <p>${card.summary}</p>
        ${
          card.anchor
            ? `
              <button
                class="roadmap-jump"
                data-source-kind="section"
                data-source-title="${card.title}"
                data-source-anchor="${card.anchor}"
              >
                Highlight this section
              </button>
            `
            : ""
        }
      </article>
    `)
    .join("");
}

function renderMastery(chapter) {
  const items = getMasteryItems(chapter);
  const completed = masteryState[chapter.slug] || [];
  const completedCount = items.filter((_, index) => completed[index]).length;
  masteryProgress.textContent = `${completedCount}/${items.length} complete`;
  masteryChecklist.innerHTML = items
    .map((item, index) => `
      <label class="mastery-item ${completed[index] ? "checked" : ""}">
        <input
          type="checkbox"
          data-mastery-index="${index}"
          ${completed[index] ? "checked" : ""}
        />
        <span>${item}</span>
      </label>
    `)
    .join("");
}

function renderQuickActions(chapter) {

  assistantQuickActions.innerHTML = [
    ["intuition", "Intuition"],
    ["formal", "Formal"],
    ["quiz", "Quiz"]
  ]
    .map(
      ([key, label]) => `
        <button class="quick-action" data-answer="${key}">
          ${label}
        </button>
      `
    )
    .join("");

  assistantAnswer.innerHTML = `
    <h4>${chapter.title} through the ${state.mode} lens</h4>
    <p>${chapter.quickActions[state.mode === "math" ? "formal" : state.mode === "exam" ? "quiz" : "intuition"]}</p>
    <p><strong>Try this:</strong> ${chapter.prompts[0]}</p>
  `;
}

function renderTerms(chapter) {
  const entries = Object.entries(chapter.terms);
  const visibleEntries = state.showAllTerms ? entries : entries.slice(0, 2);
  if (!visibleEntries.find(([key]) => key === state.activeTerm)) {
    state.activeTerm = visibleEntries[0][0];
  }

  termCloud.innerHTML = visibleEntries
    .map(
      ([key]) => `
        <button class="term-chip ${key === state.activeTerm ? "active" : ""}" data-term="${key}">
          ${key.replace(/[_-]/g, " ")}
        </button>
      `
    )
    .join("");

  termToggle.hidden = entries.length <= 2;
  termToggle.textContent = state.showAllTerms ? "Show fewer terms" : "Show all terms";

  const detail = chapter.terms[state.activeTerm];
  const sourceMentions = findSourceMentions(chapter, state.activeTerm);
  const primaryMention = sourceMentions[0] || null;
  const extraMentions = sourceMentions.slice(1);
  termDetail.innerHTML = `
    <h4>${state.activeTerm.replace(/[_-]/g, " ")}</h4>
    ${
      primaryMention
        ? `
          <div class="term-source-summary">
            <p><strong>How the notes frame it:</strong> ${primaryMention.text}</p>
            ${
              primaryMention.anchor
                ? `
                  <button
                    class="source-anchor-link"
                    data-source-kind="${primaryMention.kind === "derivation" ? "derivation" : "section"}"
                    data-source-title="${primaryMention.title}"
                    data-source-anchor="${primaryMention.anchor}"
                  >
                    Highlight ${primaryMention.title}
                  </button>
                `
                : ""
            }
          </div>
        `
        : ""
    }
    <p>${detail.long}</p>
    <p><strong>Quick read:</strong> ${detail.short}</p>
    ${
      extraMentions.length
        ? `
          <div class="term-source">
            <p><strong>More note matches:</strong></p>
            ${extraMentions
              .map(
                (mention) => `
                  <p>${mention.text}</p>
                  ${
                    mention.anchor
                      ? `
                        <button
                          class="source-anchor-link"
                          data-source-kind="${mention.kind === "derivation" ? "derivation" : "section"}"
                          data-source-title="${mention.title}"
                          data-source-anchor="${mention.anchor}"
                        >
                          Highlight ${mention.title}
                        </button>
                      `
                      : ""
                  }
                `
              )
              .join("")}
          </div>
        `
        : ""
    }
  `;
}

function renderSourceSummary(chapter) {
  const source = sourceData[sourceKeyForChapter(chapter)];

  if (!source || !source.summaryBlocks || source.summaryBlocks.length === 0) {
    sourceSummaryNote.hidden = true;
    sourceSummaryNote.innerHTML = "";
    return;
  }

  sourceSummaryNote.hidden = false;
  sourceSummaryNote.innerHTML = `
    <h4>Closer to the notes</h4>
    ${source.summaryBlocks.map((block) => `<p>${block}</p>`).join("")}
  `;
}

function renderDerivations(chapter) {
  const source = getSourceForChapter(chapter);
  derivations.innerHTML = chapter.derivations
    .map(
      (derivation, index) => {
        const sourceHighlight = source?.derivationHighlights?.[index];
        const isFocused =
          state.focusTarget?.kind === "derivation" &&
          state.focusTarget?.title &&
          sourceHighlight?.title === state.focusTarget.title;
        return `
        <details
          class="derivation-card"
          data-source-derivation="${sourceHighlight?.title || ""}"
          ${index === 0 || isFocused ? "open" : ""}
        >
          <summary>
            <div>
              <h4>${derivation.title}</h4>
              <p class="derivation-meta">${derivation.teaser}</p>
            </div>
            <span>Expand</span>
          </summary>
          <div class="derivation-body">
            <ol>
              ${derivation.steps.map((step) => `<li>${step}</li>`).join("")}
            </ol>
            <div class="derivation-result"><strong>Key result:</strong> ${derivation.result}</div>
            ${
              sourceHighlight
                ? `
                  <div class="source-derivation">
                    <h5>From "${sourceHighlight.title}"</h5>
                    <p>${sourceHighlight.excerpt}</p>
                    ${
                      sourceHighlight.equations?.length
                        ? `<ul class="source-equation-list">${sourceHighlight.equations
                            .map((equation) => `<li>${equation}</li>`)
                            .join("")}</ul>`
                        : ""
                    }
                    ${
                      sourceHighlight.anchor
                        ? `
                          <button
                            class="source-anchor-link"
                            data-source-kind="derivation"
                            data-source-title="${sourceHighlight.title}"
                            data-source-anchor="${sourceHighlight.anchor}"
                          >
                            Highlight this derivation source
                          </button>
                        `
                        : ""
                    }
                  </div>
                `
                : ""
            }
          </div>
        </details>
      `;
      }
    )
    .join("");
}

function renderQuizzes(chapter) {
  const source = getSourceForChapter(chapter);
  const cards = source?.quizCards?.length
    ? source.quizCards
    : [
        {
          title: "Chapter checkpoint",
          prompt: chapter.prompts[0],
          answer: chapter.quickActions.quiz,
          source: chapter.title,
          anchor: ""
        }
      ];

  quizDeck.innerHTML = cards
    .map(
      (card, index) => `
        <details class="quiz-card" ${index === 0 ? "open" : ""}>
          <summary>
            <h4>${card.title}</h4>
            <p>${card.prompt}</p>
          </summary>
          <div class="quiz-body">
            <div class="quiz-answer">
              <strong>Recoverable answer:</strong>
              <p>${card.answer}</p>
            </div>
            ${
              card.anchor
                ? `
                  <button
                    class="quiz-link"
                    data-source-kind="section"
                    data-source-title="${card.source}"
                    data-source-anchor="${card.anchor}"
                  >
                    Highlight ${card.source}
                  </button>
                `
                : ""
            }
          </div>
        </details>
      `
    )
    .join("");
}

function renderDeepDives(chapter) {
  deepDives.innerHTML = chapter.deepDives
    .map(
      (dive) => `
        <details class="dive-card">
          <summary>
            <h4>${dive.title}</h4>
            <span>Open</span>
          </summary>
          <p>${dive.body}</p>
        </details>
      `
    )
    .join("");
}

function renderSourceMaterial(chapter) {
  const source = getSourceForChapter(chapter);

  if (!source) {
    sourceMeta.textContent = "No extracted source material loaded for this chapter yet.";
    sourcePdfLink.href = chapter.pdf;
    renderBullets(sourceSections, ["Add generated source-data.js to surface section headings from the notes."]);
    renderBullets(sourceEquations, ["Equation landmarks will appear here once the PDF extraction pass runs."]);
    return;
  }

  sourceMeta.textContent = `Generated from ${source.pageCount} PDF pages with ${source.sectionAnchors.length} anchored sections and ${source.equations.length} equation landmarks.`;
  sourcePdfLink.href = chapter.pdf;
  sourceSections.className = "bullet-list source-sections-list";
  sourceEquations.className = "bullet-list source-equations-list";
  const sectionAnchors = source.sectionAnchors?.length
    ? source.sectionAnchors
    : (source.sections || []).map((title) => ({ title, anchor: "" }));
  sourceSections.innerHTML = (sectionAnchors.length ? sectionAnchors : [{ title: "No section headings detected from the current extraction pass.", anchor: "" }])
    .map((section) => {
      const isActive =
        state.focusTarget?.kind === "section" &&
        ((state.focusTarget?.anchor && section.anchor === state.focusTarget.anchor) || section.title === state.focusTarget?.title);
      if (!section.anchor) {
        return `<li>${section.title}</li>`;
      }
      return `
        <li>
          <button
            class="source-section-button ${isActive ? "active" : ""}"
            data-source-kind="section"
            data-source-title="${section.title}"
            data-source-anchor="${section.anchor}"
          >
            ${section.title}
          </button>
        </li>
      `;
    })
    .join("");
  sourceEquations.innerHTML = (source.equations.length ? source.equations : ["No equation landmarks detected from the current extraction pass."])
    .map((value) => `<li>${value}</li>`)
    .join("");
}

function applyFocusTarget(chapter) {
  if (!state.focusTarget) {
    return;
  }

  if (state.focusTarget.kind === "derivation") {
    const node = document.querySelector(`[data-source-derivation="${CSS.escape(state.focusTarget.title)}"]`);
    if (node) {
      node.open = true;
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (state.focusTarget.kind === "section") {
    sourcePanel.open = true;
    const node = document.querySelector(`[data-source-anchor="${CSS.escape(state.focusTarget.anchor || "")}"]`);
    if (node) {
      node.classList.add("active");
    }
    sourceSections.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function sceneMarkup(type) {
  switch (type) {
    case "oscillator":
      return `
        <div class="scene-title">Simple harmonic motion</div>
        <div class="oscillator-scene">
          <div class="spring-coil">
            ${Array.from({ length: 8 }).map((_, i) => `<div class="coil-segment" style="animation-delay: ${-i * 0.06}s;"></div>`).join("")}
          </div>
          <div class="spring-mass"></div>
          <svg class="sine-trail" viewBox="0 0 300 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,10 50,50 Q75,90 100,50 Q125,10 150,50 Q175,90 200,50 Q225,10 250,50 Q275,90 300,50" fill="none" stroke="rgba(99,179,237,0.6)" stroke-width="2"/>
          </svg>
          ${[15, 30, 45, 60, 75].map((x, i) => `<span class="osc-dot" style="left:${x}%; animation-delay:${-i * 0.4}s;"></span>`).join("")}
          <div class="equilibrium-line"></div>
          <div class="potential-curve">
            <svg viewBox="0 0 200 80" preserveAspectRatio="none">
              <path d="M0,80 Q50,0 100,0 Q150,0 200,80" fill="none" stroke="rgba(159,122,234,0.4)" stroke-width="2"/>
            </svg>
          </div>
        </div>
      `;
    case "driven-oscillator":
      return `
        <div class="scene-label">Interactive 2: Driven Oscillator</div>
        <p class="scene-caption">Sweep the driving frequency &omega;<sub>d</sub> through resonance. The left panel shows the mass responding to the sinusoidal force; the right shows the steady-state amplitude and phase vs &omega;<sub>d</sub>. At resonance (&omega;<sub>d</sub> = &omega;<sub>0</sub>), amplitude peaks and phase crosses &minus;90&deg;.</p>
        <div class="interactive-scene">
          <canvas id="scene-driven-oscillator" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label style="position:relative"><span>&omega;<sub>d</sub>:</span> <input type="range" id="driven-wd" min="0.2" max="10" step="0.05" value="3"><span class="scene-val" id="driven-wd-val">3.0</span><span id="driven-res-marker" style="position:absolute;bottom:-2px;pointer-events:none;font-size:8px;color:var(--w-amber,#f59e0b);transform:translateX(-50%)" title="resonance">&blacktriangle;</span></label>
            <label><span>&omega;<sub>0</sub>:</span> <input type="range" id="driven-w0" min="1" max="10" step="0.1" value="5"><span class="scene-val" id="driven-w0-val">5.0</span></label>
            <label><span>&gamma;: </span><input type="range" id="driven-gamma" min="0.1" max="5" step="0.1" value="0.2"><span class="scene-val" id="driven-gamma-val">0.2</span></label>
          </div>
        </div>
      `;
    case "transient-decay":
      return `
        <div class="scene-label">Interactive 3: Transient Decay</div>
        <p class="scene-caption">Drag the mass to set an initial displacement, then release. The transient dies away exponentially, leaving only the steady-state driven response.</p>
        <div class="interactive-scene">
          <canvas id="scene-transient-decay" width="600" height="340"></canvas>
          <div class="scene-controls">
            <label><span>&omega;<sub>d</sub>:</span> <input type="range" id="transient-wd" min="0.5" max="10" step="0.1" value="4"><span class="scene-val" id="transient-wd-val">4.0</span></label>
            <label><span>&omega;<sub>0</sub>:</span> <input type="range" id="transient-w0" min="1" max="10" step="0.1" value="5"><span class="scene-val" id="transient-w0-val">5.0</span></label>
            <label><span>&gamma;: </span><input type="range" id="transient-gamma" min="0.1" max="5" step="0.1" value="0.8"><span class="scene-val" id="transient-gamma-val">0.8</span></label>
            <button id="transient-restart" style="padding:2px 10px;cursor:pointer">Restart</button>
          </div>
        </div>
      `;
    case "phase-lag":
      return `
        <div class="scene-label">Interactive 4: Phase Lag</div>
        <p class="scene-caption">Observe how the phase relationship between the driving force and the oscillator response changes as the driving frequency crosses the natural frequency.</p>
        <div class="interactive-scene">
          <canvas id="scene-phase-lag" width="600" height="300"></canvas>
        </div>
      `;
    case "power-absorption":
      return `
        <div class="scene-label">Interactive 5: Where Does the Energy Go?</div>
        <p class="scene-caption">Watch the force (red) and velocity (blue) arrows on the driven oscillator. The right panel tracks cumulative energy: the absorptive part steadily extracts energy from the driver, while the elastic part just borrows and returns it — its integral stays near zero.</p>
        <div class="interactive-scene">
          <canvas id="scene-power-absorption" width="600" height="300"></canvas>
        </div>
      `;
    case "resonance-curve":
      return `
        <div class="scene-label">Interactive 6: Resonance Curve</div>
        <p class="scene-caption">The Lorentzian resonance curve. The peak is at the natural frequency and the width at half-maximum equals the damping coefficient.</p>
        <div class="interactive-scene">
          <canvas id="scene-resonance-curve" width="600" height="300"></canvas>
        </div>
      `;
    case "coupled":
      return `
        <div class="scene-title">Energy exchange between modes</div>
        <div class="coupled-scene">
          <div class="wall-left"></div>
          <div class="coupled-spring spring-1">
            ${Array.from({ length: 5 }).map((_, i) => `<div class="coil-segment" style="animation-delay: ${-i * 0.06}s;"></div>`).join("")}
          </div>
          <div class="coupled-mass mass-1"></div>
          <div class="coupled-spring spring-2">
            ${Array.from({ length: 5 }).map((_, i) => `<div class="coil-segment" style="animation-delay: ${-i * 0.06 - 0.5}s;"></div>`).join("")}
          </div>
          <div class="coupled-mass mass-2"></div>
          <div class="coupled-spring spring-3">
            ${Array.from({ length: 5 }).map((_, i) => `<div class="coil-segment" style="animation-delay: ${-i * 0.06 - 1}s;"></div>`).join("")}
          </div>
          <div class="wall-right"></div>
          <div class="beat-envelope">
            <svg viewBox="0 0 300 60" preserveAspectRatio="none">
              <path d="M0,30 Q37,5 75,30 Q112,55 150,30 Q187,5 225,30 Q262,55 300,30" fill="none" stroke="rgba(72,187,120,0.5)" stroke-width="2"/>
            </svg>
          </div>
          ${Array.from({ length: 6 }).map((_, i) => `<span class="energy-arrow" style="left:${25 + i * 10}%; animation-delay:${-i * 0.3}s;"></span>`).join("")}
        </div>
      `;
    case "n-modes":
      return `
        <div class="scene-title">Normal modes of N masses</div>
        <div class="n-modes-scene">
          <div class="chain-wall-left"></div>
          ${Array.from({ length: 8 }).map((_, i) => {
            const y = Math.sin((i + 1) * Math.PI / 9) * 35;
            return `<div class="chain-mass" style="left:${12 + i * 10}%; top:${50 - y}%; animation-delay:${-i * 0.15}s;"></div>`;
          }).join("")}
          <div class="chain-wall-right"></div>
          <svg class="mode-shape" viewBox="0 0 300 100" preserveAspectRatio="none">
            <path d="M0,50 Q37,15 75,15 Q112,15 150,50 Q187,85 225,85 Q262,85 300,50" fill="none" stroke="rgba(99,179,237,0.4)" stroke-width="2" stroke-dasharray="4 4"/>
          </svg>
          <svg class="mode-shape-2" viewBox="0 0 300 100" preserveAspectRatio="none">
            <path d="M0,50 Q50,20 100,50 Q150,80 200,50 Q250,20 300,50" fill="none" stroke="rgba(159,122,234,0.3)" stroke-width="2" stroke-dasharray="4 4"/>
          </svg>
          ${Array.from({ length: 7 }).map((_, i) => `<div class="chain-spring" style="left:${7 + i * 10}%; animation-delay:${-i * 0.15}s;"></div>`).join("")}
          <div class="mode-label mode-1">n=1</div>
          <div class="mode-label mode-2">n=2</div>
        </div>
      `;
    case "fourier-series":
      return `
        <div class="scene-title">Building a square wave from harmonics</div>
        <div class="fourier-scene">
          <svg class="fourier-canvas" viewBox="0 0 300 160" preserveAspectRatio="none">
            <path class="harmonic h1" d="M0,80 Q37,20 75,20 Q112,20 150,80 Q187,140 225,140 Q262,140 300,80" fill="none" stroke="rgba(99,179,237,0.7)" stroke-width="2"/>
            <path class="harmonic h3" d="M0,80 Q12,50 25,50 Q37,50 50,80 Q62,110 75,110 Q87,110 100,80 Q112,50 125,50 Q137,50 150,80 Q162,110 175,110 Q187,110 200,80 Q212,50 225,50 Q237,50 250,80 Q262,110 275,110 Q287,110 300,80" fill="none" stroke="rgba(159,122,234,0.5)" stroke-width="1.5"/>
            <path class="harmonic h5" d="M0,80 ${Array.from({ length: 10 }).map((_, i) => {
              const x1 = i * 30 + 7.5;
              const x2 = i * 30 + 15;
              const x3 = i * 30 + 22.5;
              const x4 = i * 30 + 30;
              const y1 = i % 2 === 0 ? 60 : 100;
              const y2 = i % 2 === 0 ? 60 : 100;
              return `Q${x1},${y1} ${x2},80 Q${x3},${120 - y1} ${x4},80`;
            }).join(" ")}" fill="none" stroke="rgba(72,187,120,0.4)" stroke-width="1"/>
            <path class="square-target" d="M0,30 L75,30 L75,130 L150,130 L150,30 L225,30 L225,130 L300,130" fill="none" stroke="rgba(237,137,54,0.6)" stroke-width="2" stroke-dasharray="6 3"/>
          </svg>
          ${["1f", "3f", "5f", "7f"].map((label, i) => `<span class="freq-label" style="left:${15 + i * 22}%; animation-delay:${-i * 0.5}s;">${label}</span>`).join("")}
          <div class="sum-arrow"></div>
        </div>
      `;
    case "waves":
      return `
        <div class="scene-title">Traveling wave</div>
        <div class="waves-scene">
          <svg class="wave-canvas" viewBox="0 0 400 120" preserveAspectRatio="none">
            <path class="traveling-wave" d="" fill="none" stroke="rgba(99,179,237,0.8)" stroke-width="3"/>
            <path class="traveling-wave-2" d="" fill="none" stroke="rgba(159,122,234,0.4)" stroke-width="2"/>
          </svg>
          ${Array.from({ length: 12 }).map((_, i) => {
            return `<span class="medium-dot" style="left:${5 + i * 8}%; animation-delay:${-i * 0.2}s;"></span>`;
          }).join("")}
          <div class="wave-direction-arrow"></div>
          <div class="crest-label">crest</div>
          <div class="trough-label">trough</div>
          <div class="wavelength-bracket"></div>
        </div>
      `;
    case "music":
      return `
        <div class="scene-title">Harmonic modes of a string</div>
        <div class="music-scene">
          <div class="string-bridge-left"></div>
          <div class="string-bridge-right"></div>
          <svg class="harmonics-canvas" viewBox="0 0 300 180" preserveAspectRatio="none">
            <path class="string-mode m1" d="M0,30 Q75,10 150,30 Q225,50 300,30" fill="none" stroke="rgba(237,137,54,0.8)" stroke-width="2.5"/>
            <path class="string-mode m2" d="M0,70 Q37,50 75,70 Q112,90 150,70 Q187,50 225,70 Q262,90 300,70" fill="none" stroke="rgba(99,179,237,0.7)" stroke-width="2"/>
            <path class="string-mode m3" d="M0,110 Q25,95 50,110 Q75,125 100,110 Q125,95 150,110 Q175,125 200,110 Q225,95 250,110 Q275,125 300,110" fill="none" stroke="rgba(72,187,120,0.6)" stroke-width="1.5"/>
            <path class="string-mode m4" d="M0,150 Q18,140 37,150 Q56,160 75,150 Q93,140 112,150 Q131,160 150,150 Q168,140 187,150 Q206,160 225,150 Q243,140 262,150 Q281,160 300,150" fill="none" stroke="rgba(159,122,234,0.5)" stroke-width="1"/>
          </svg>
          ${["f", "2f", "3f", "4f"].map((label, i) => `<span class="harmonic-label" style="top:${18 + i * 22}%; animation-delay:${-i * 0.4}s;">${label}</span>`).join("")}
          ${Array.from({ length: 4 }).map((_, i) => `<span class="note-dot" style="left:${20 + i * 20}%; top:${25 + i * 22}%; animation-delay:${-i * 0.3}s;"></span>`).join("")}
        </div>
      `;
    case "fourier-transform":
      return `
        <div class="scene-title">Time domain to frequency domain</div>
        <div class="ft-scene">
          <div class="time-domain">
            <svg viewBox="0 0 200 80" preserveAspectRatio="none">
              <path class="time-signal" d="M0,40 Q10,20 20,40 Q30,60 40,40 Q50,20 60,40 Q70,55 80,40 Q90,30 100,40 Q110,48 120,40 Q130,35 140,40 Q150,42 160,40 Q170,39 180,40 Q190,40 200,40" fill="none" stroke="rgba(99,179,237,0.8)" stroke-width="2"/>
              <path class="envelope-decay" d="M0,20 Q50,25 100,35 Q150,38 200,40" fill="none" stroke="rgba(237,137,54,0.4)" stroke-width="1" stroke-dasharray="4 3"/>
              <path class="envelope-decay-2" d="M0,60 Q50,55 100,45 Q150,42 200,40" fill="none" stroke="rgba(237,137,54,0.4)" stroke-width="1" stroke-dasharray="4 3"/>
            </svg>
            <span class="domain-label">t</span>
          </div>
          <div class="ft-arrow">
            ${Array.from({ length: 5 }).map((_, i) => `<span class="arrow-particle" style="animation-delay:${-i * 0.3}s;"></span>`).join("")}
          </div>
          <div class="freq-domain">
            <svg viewBox="0 0 200 80" preserveAspectRatio="none">
              <path class="lorentzian-peak" d="M0,75 Q30,74 50,72 Q70,65 80,40 Q88,15 100,10 Q112,15 120,40 Q130,65 150,72 Q170,74 200,75" fill="rgba(159,122,234,0.15)" stroke="rgba(159,122,234,0.8)" stroke-width="2"/>
            </svg>
            <span class="domain-label">omega</span>
            <span class="peak-label">omega_0</span>
            <span class="width-label">gamma</span>
          </div>
        </div>
      `;
    case "impedance":
      return `
        <div class="scene-title">Reflection and transmission at a boundary</div>
        <div class="impedance-scene">
          <div class="medium-1"></div>
          <div class="medium-2"></div>
          <div class="boundary-line"></div>
          <svg class="incident-wave" viewBox="0 0 200 60" preserveAspectRatio="none">
            <path d="M0,30 Q12,10 25,30 Q37,50 50,30 Q62,10 75,30 Q87,50 100,30 Q112,10 125,30 Q137,50 150,30" fill="none" stroke="rgba(99,179,237,0.8)" stroke-width="2.5"/>
          </svg>
          <svg class="reflected-wave" viewBox="0 0 200 60" preserveAspectRatio="none">
            <path d="M200,30 Q187,40 175,30 Q162,20 150,30 Q137,40 125,30 Q112,20 100,30" fill="none" stroke="rgba(237,137,54,0.7)" stroke-width="2"/>
          </svg>
          <svg class="transmitted-wave" viewBox="0 0 200 60" preserveAspectRatio="none">
            <path d="M0,30 Q18,15 37,30 Q56,45 75,30 Q93,15 112,30 Q131,45 150,30 Q168,15 187,30" fill="none" stroke="rgba(72,187,120,0.8)" stroke-width="2"/>
          </svg>
          <span class="z-label z1-label">Z1</span>
          <span class="z-label z2-label">Z2</span>
          ${Array.from({ length: 4 }).map((_, i) => `<span class="inc-arrow" style="left:${10 + i * 10}%; animation-delay:${-i * 0.3}s;"></span>`).join("")}
          ${Array.from({ length: 3 }).map((_, i) => `<span class="ref-arrow" style="left:${40 - i * 8}%; animation-delay:${-i * 0.3 - 0.5}s;"></span>`).join("")}
          ${Array.from({ length: 3 }).map((_, i) => `<span class="trans-arrow" style="left:${55 + i * 10}%; animation-delay:${-i * 0.3 - 0.5}s;"></span>`).join("")}
        </div>
      `;
    case "power":
      return `
        <div class="scene-title">Energy transport in a wave</div>
        <div class="power-scene">
          <svg class="power-wave" viewBox="0 0 300 100" preserveAspectRatio="none">
            <path d="M0,50 Q18,20 37,50 Q56,80 75,50 Q93,20 112,50 Q131,80 150,50 Q168,20 187,50 Q206,80 225,50 Q243,20 262,50 Q281,80 300,50" fill="none" stroke="rgba(99,179,237,0.7)" stroke-width="2.5"/>
          </svg>
          ${Array.from({ length: 10 }).map((_, i) => {
            const height = 20 + Math.abs(Math.sin(i * 0.6)) * 40;
            return `<div class="intensity-bar" style="left:${8 + i * 9}%; height:${height}px; animation-delay:${-i * 0.2}s;"></div>`;
          }).join("")}
          <div class="power-arrow"></div>
          ${Array.from({ length: 6 }).map((_, i) => `<span class="energy-particle" style="left:${10 + i * 15}%; animation-delay:${-i * 0.4}s;"></span>`).join("")}
          <span class="power-label">P = Z(dA/dt)^2</span>
        </div>
      `;
    case "wavepackets":
      return `
        <div class="scene-title">Dispersing wavepacket</div>
        <div class="wavepacket-scene">
          <div class="gaussian-envelope"></div>
          <svg class="packet-canvas" viewBox="0 0 300 100" preserveAspectRatio="none">
            <path class="carrier-wave" d="M0,50 ${Array.from({ length: 30 }).map((_, i) => {
              const x = i * 10;
              const env = Math.exp(-((x - 150) ** 2) / 3000);
              const y = 50 + env * 35 * Math.sin(i * 1.2);
              return `L${x},${y}`;
            }).join(" ")}" fill="none" stroke="rgba(99,179,237,0.8)" stroke-width="2"/>
            <path class="envelope-top" d="M0,50 ${Array.from({ length: 30 }).map((_, i) => {
              const x = i * 10;
              const env = Math.exp(-((x - 150) ** 2) / 3000);
              return `L${x},${50 - env * 35}`;
            }).join(" ")}" fill="none" stroke="rgba(159,122,234,0.5)" stroke-width="1.5" stroke-dasharray="4 3"/>
            <path class="envelope-bottom" d="M0,50 ${Array.from({ length: 30 }).map((_, i) => {
              const x = i * 10;
              const env = Math.exp(-((x - 150) ** 2) / 3000);
              return `L${x},${50 + env * 35}`;
            }).join(" ")}" fill="none" stroke="rgba(159,122,234,0.5)" stroke-width="1.5" stroke-dasharray="4 3"/>
          </svg>
          <div class="group-arrow">v_g</div>
          <div class="phase-arrow">v_p</div>
          ${Array.from({ length: 4 }).map((_, i) => `<span class="dispersion-dot" style="left:${35 + i * 8}%; animation-delay:${-i * 0.3}s;"></span>`).join("")}
        </div>
      `;
    case "em-waves":
      return `
        <div class="scene-title">Electromagnetic wave propagation</div>
        <div class="em-scene">
          <div class="propagation-axis"></div>
          ${Array.from({ length: 8 }).map((_, i) => {
            const angle = i * 45;
            const len = Math.sin(i * 0.8) * 30 + 10;
            return `<div class="e-field-arrow" style="left:${10 + i * 10}%; height:${len}px; animation-delay:${-i * 0.2}s;"></div>`;
          }).join("")}
          ${Array.from({ length: 8 }).map((_, i) => {
            const len = Math.sin(i * 0.8 + Math.PI / 2) * 25 + 8;
            return `<div class="b-field-arrow" style="left:${10 + i * 10}%; width:${len}px; animation-delay:${-i * 0.2}s;"></div>`;
          }).join("")}
          <svg class="e-wave-path" viewBox="0 0 300 100" preserveAspectRatio="none">
            <path d="M0,50 Q18,20 37,50 Q56,80 75,50 Q93,20 112,50 Q131,80 150,50 Q168,20 187,50 Q206,80 225,50 Q243,20 262,50 Q281,80 300,50" fill="none" stroke="rgba(237,137,54,0.5)" stroke-width="1.5"/>
          </svg>
          <svg class="b-wave-path" viewBox="0 0 300 100" preserveAspectRatio="none">
            <path d="M0,50 Q18,30 37,50 Q56,70 75,50 Q93,30 112,50 Q131,70 150,50 Q168,30 187,50 Q206,70 225,50 Q243,30 262,50 Q281,70 300,50" fill="none" stroke="rgba(72,187,120,0.5)" stroke-width="1.5"/>
          </svg>
          <span class="field-label e-label">E</span>
          <span class="field-label b-label">B</span>
          <span class="field-label k-label">k</span>
        </div>
      `;
    case "light":
      return `
        <div class="scene-title">Oscillating electric field beam</div>
        <div class="light-scene">
          <div class="beam-core"></div>
          ${Array.from({ length: 10 }).map((_, i) => {
            return `<div class="e-oscillation" style="left:${8 + i * 9}%; animation-delay:${-i * 0.15}s;"></div>`;
          }).join("")}
          <div class="beam-glow"></div>
          ${Array.from({ length: 6 }).map((_, i) => `<span class="photon-dot" style="left:${15 + i * 14}%; animation-delay:${-i * 0.25}s;"></span>`).join("")}
          <div class="spectrum-bar">
            <div class="spectrum-segment red"></div>
            <div class="spectrum-segment orange"></div>
            <div class="spectrum-segment yellow"></div>
            <div class="spectrum-segment green"></div>
            <div class="spectrum-segment blue"></div>
            <div class="spectrum-segment violet"></div>
          </div>
        </div>
      `;
    case "polarization":
      return `
        <div class="scene-title">Polarization states</div>
        <div class="polarization-scene">
          <div class="pol-axis"></div>
          <div class="linear-pol">
            ${Array.from({ length: 8 }).map((_, i) => `<div class="pol-arrow linear" style="left:${i * 12}%; animation-delay:${-i * 0.2}s;"></div>`).join("")}
          </div>
          <div class="circular-pol">
            ${Array.from({ length: 8 }).map((_, i) => {
              const angle = i * 45;
              return `<div class="pol-arrow circular" style="left:${i * 12}%; transform:rotate(${angle}deg); animation-delay:${-i * 0.2}s;"></div>`;
            }).join("")}
          </div>
          <div class="pol-helix">
            <svg viewBox="0 0 300 80" preserveAspectRatio="none">
              <path d="M0,40 Q18,10 37,40 Q56,70 75,40 Q93,10 112,40 Q131,70 150,40 Q168,10 187,40 Q206,70 225,40 Q243,10 262,40 Q281,70 300,40" fill="none" stroke="rgba(99,179,237,0.6)" stroke-width="2"/>
              <path d="M0,40 Q18,30 37,40 Q56,50 75,40 Q93,30 112,40 Q131,50 150,40 Q168,30 187,40 Q206,50 225,40 Q243,30 262,40 Q281,50 300,40" fill="none" stroke="rgba(159,122,234,0.4)" stroke-width="1.5"/>
            </svg>
          </div>
          <span class="pol-label linear-label">Linear</span>
          <span class="pol-label circular-label">Circular</span>
        </div>
      `;
    case "refraction":
      return `
        <div class="scene-title">Snell's law at an interface</div>
        <div class="refraction-scene">
          <div class="medium-air"></div>
          <div class="medium-glass"></div>
          <div class="refraction-boundary"></div>
          <div class="normal-line"></div>
          <div class="incident-ray"></div>
          <div class="refracted-ray"></div>
          <div class="reflected-ray-small"></div>
          ${Array.from({ length: 5 }).map((_, i) => `<span class="wavefront-line inc" style="top:${15 + i * 8}%; animation-delay:${-i * 0.25}s;"></span>`).join("")}
          ${Array.from({ length: 4 }).map((_, i) => `<span class="wavefront-line ref" style="top:${55 + i * 8}%; animation-delay:${-i * 0.25 - 0.5}s;"></span>`).join("")}
          <span class="angle-label theta1">theta_1</span>
          <span class="angle-label theta2">theta_2</span>
          <span class="medium-label air-label">n1 (air)</span>
          <span class="medium-label glass-label">n2 (glass)</span>
        </div>
      `;
    case "prisms":
      return `
        <div class="scene-title">Prismatic dispersion</div>
        <div class="prism-scene">
          <div class="prism-body">
            <svg viewBox="0 0 200 180" preserveAspectRatio="none">
              <polygon points="100,10 190,170 10,170" fill="rgba(99,179,237,0.12)" stroke="rgba(99,179,237,0.5)" stroke-width="2"/>
            </svg>
          </div>
          <div class="white-beam"></div>
          ${[
            { color: "rgba(255,50,50,0.8)", angle: -8, label: "Red" },
            { color: "rgba(255,165,0,0.7)", angle: -4, label: "Orange" },
            { color: "rgba(255,255,0,0.7)", angle: 0, label: "Yellow" },
            { color: "rgba(50,205,50,0.7)", angle: 4, label: "Green" },
            { color: "rgba(30,144,255,0.7)", angle: 8, label: "Blue" },
            { color: "rgba(148,0,211,0.7)", angle: 12, label: "Violet" }
          ].map((ray, i) => `
            <div class="spectrum-ray" style="background:${ray.color}; transform:rotate(${ray.angle}deg); animation-delay:${-i * 0.15}s;"></div>
          `).join("")}
          ${Array.from({ length: 4 }).map((_, i) => `<span class="prism-photon" style="left:${10 + i * 8}%; animation-delay:${-i * 0.3}s;"></span>`).join("")}
        </div>
      `;
    case "color":
      return `
        <div class="scene-title">Additive color mixing</div>
        <div class="color-scene">
          <div class="color-circle red"></div>
          <div class="color-circle green"></div>
          <div class="color-circle blue"></div>
          <div class="color-overlap rg"></div>
          <div class="color-overlap gb"></div>
          <div class="color-overlap rb"></div>
          <div class="color-overlap-center"></div>
          ${Array.from({ length: 8 }).map((_, i) => {
            const angle = i * 45;
            const r = 55 + Math.random() * 15;
            const x = 50 + r * Math.cos(angle * Math.PI / 180) / 2;
            const y = 50 + r * Math.sin(angle * Math.PI / 180) / 2;
            return `<span class="color-particle" style="left:${x}%; top:${y}%; animation-delay:${-i * 0.3}s;"></span>`;
          }).join("")}
          <span class="color-label r-label">R</span>
          <span class="color-label g-label">G</span>
          <span class="color-label b-label">B</span>
          <span class="mix-label yellow-label">Y</span>
          <span class="mix-label cyan-label">C</span>
          <span class="mix-label magenta-label">M</span>
          <span class="mix-label white-label">W</span>
        </div>
      `;
    case "antennas":
      return `
        <div class="scene-title">Dipole radiation pattern</div>
        <div class="antenna-scene">
          <div class="dipole-rod"></div>
          <div class="dipole-feed"></div>
          ${Array.from({ length: 8 }).map((_, i) => {
            const radius = 20 + i * 12;
            return `<div class="wavefront-circle" style="width:${radius * 2}px; height:${radius * 2}px; animation-delay:${-i * 0.35}s;"></div>`;
          }).join("")}
          <div class="radiation-lobe lobe-top"></div>
          <div class="radiation-lobe lobe-bottom"></div>
          ${Array.from({ length: 6 }).map((_, i) => {
            const angle = -60 + i * 24;
            return `<span class="rad-arrow" style="transform:rotate(${angle}deg); animation-delay:${-i * 0.2}s;"></span>`;
          }).join("")}
          <span class="antenna-label">sin^2 theta</span>
        </div>
      `;
    case "diffraction":
      return `
        <div class="scene-title">Waves through a slit</div>
        <div class="diffraction-scene">
          <div class="diff-barrier"></div>
          <div class="diff-slit"></div>
          ${Array.from({ length: 6 }).map((_, i) => `<div class="incoming-wavefront" style="left:${5 + i * 6}%; animation-delay:${-i * 0.3}s;"></div>`).join("")}
          ${Array.from({ length: 8 }).map((_, i) => {
            const radius = 15 + i * 12;
            return `<div class="huygens-wavelet" style="width:${radius * 2}px; height:${radius * 2}px; animation-delay:${-i * 0.25}s;"></div>`;
          }).join("")}
          <div class="intensity-screen">
            <svg viewBox="0 0 30 200" preserveAspectRatio="none">
              <path d="M15,0 Q15,30 5,50 Q0,60 0,70 Q0,80 5,90 Q15,100 15,100 Q15,100 25,90 Q30,80 30,70 Q30,60 25,50 Q15,30 15,0" fill="rgba(99,179,237,0.3)" stroke="rgba(99,179,237,0.7)" stroke-width="1"/>
            </svg>
          </div>
          ${Array.from({ length: 5 }).map((_, i) => `<span class="diffraction-dot" style="top:${30 + i * 10}%; animation-delay:${-i * 0.2}s;"></span>`).join("")}
        </div>
      `;
    case "quantum":
      return `
        <div class="scene-title">Particle in a potential well</div>
        <div class="quantum-scene">
          <div class="potential-well">
            <svg viewBox="0 0 200 120" preserveAspectRatio="none">
              <path d="M0,10 L0,110 L200,110 L200,10" fill="none" stroke="rgba(159,122,234,0.6)" stroke-width="3"/>
            </svg>
          </div>
          <svg class="wavefunction-canvas" viewBox="0 0 200 100" preserveAspectRatio="none">
            <path class="psi-1" d="M0,80 Q50,20 100,20 Q150,20 200,80" fill="none" stroke="rgba(99,179,237,0.8)" stroke-width="2.5"/>
            <path class="psi-2" d="M0,60 Q25,30 50,60 Q75,90 100,60 Q125,30 150,60 Q175,90 200,60" fill="none" stroke="rgba(72,187,120,0.6)" stroke-width="2"/>
            <path class="psi-3" d="M0,50 Q16,35 33,50 Q50,65 66,50 Q83,35 100,50 Q116,65 133,50 Q150,35 166,50 Q183,65 200,50" fill="none" stroke="rgba(237,137,54,0.5)" stroke-width="1.5"/>
          </svg>
          ${[25, 50, 75].map((pct, i) => `<div class="energy-level-line" style="bottom:${20 + i * 25}%; animation-delay:${-i * 0.3}s;"><span>E${i + 1}</span></div>`).join("")}
          ${Array.from({ length: 6 }).map((_, i) => `<span class="prob-dot" style="left:${15 + i * 14}%; animation-delay:${-i * 0.25}s;"></span>`).join("")}
          <span class="quantum-label">|psi|^2</span>
        </div>
      `;
    case "doppler":
      return `
        <div class="scene-title">Doppler frequency shift</div>
        <div class="doppler-scene">
          <div class="doppler-source"></div>
          ${Array.from({ length: 6 }).map((_, i) => {
            const radius = 18 + i * 16;
            const offset = (5 - i) * 6;
            return `<div class="doppler-wavefront" style="width:${radius * 2}px; height:${radius * 2}px; left:calc(45% + ${offset}px); animation-delay:${-i * 0.4}s;"></div>`;
          }).join("")}
          <div class="observer-ahead">
            <span class="obs-icon"></span>
            <span class="obs-label">Higher f</span>
          </div>
          <div class="observer-behind">
            <span class="obs-icon"></span>
            <span class="obs-label">Lower f</span>
          </div>
          <div class="source-velocity-arrow"></div>
          ${Array.from({ length: 4 }).map((_, i) => `<span class="compressed-wave" style="left:${62 + i * 4}%; animation-delay:${-i * 0.15}s;"></span>`).join("")}
          ${Array.from({ length: 3 }).map((_, i) => `<span class="stretched-wave" style="left:${20 + i * 7}%; animation-delay:${-i * 0.2}s;"></span>`).join("")}
        </div>
      `;
    case "shm-spring":
      return `
        <div class="scene-label">Interactive 1: The Spring Lab</div>
        <p class="scene-caption">Drag the mass to displace it and let go. Adjust the spring constant and mass to see how the frequency changes &mdash; notice that amplitude does not affect the period.</p>
        <div class="interactive-scene">
          <canvas id="scene-shm-spring" width="550" height="280"></canvas>
          <div class="scene-controls">
            <label><span>k: </span><input type="range" id="shm-k" min="1" max="20" step="0.5" value="4"><span class="scene-val" id="shm-k-val">4.0</span></label>
            <label><span>m: </span><input type="range" id="shm-m" min="0.2" max="5" step="0.1" value="1"><span class="scene-val" id="shm-m-val">1.0</span></label>
            <span class="scene-val" id="shm-omega-val"></span>
          </div>
        </div>
      `;
    case "shm-oscillator":
      return `
        <div class="scene-label">Interactive 2: Phasor &amp; Wave</div>
        <p class="scene-caption">The rotating phasor on the left projects onto the sine wave on the right. Adjust amplitude, frequency, and phase to see how circular motion creates sinusoidal oscillation.</p>
        <div class="interactive-scene">
          <canvas id="scene-shm-oscillator" width="550" height="260"></canvas>
          <div class="scene-controls">
            <label><span>A: </span><input type="range" id="osc-amp" min="0.1" max="1" step="0.05" value="0.8"><span class="scene-val" id="osc-amp-val">0.80</span></label>
            <label><span>&omega;: </span><input type="range" id="osc-omega" min="0.5" max="8" step="0.1" value="2"><span class="scene-val" id="osc-omega-val">2.0</span></label>
            <label><span>&phi;: </span><input type="range" id="osc-phi" min="-3.14" max="3.14" step="0.05" value="0"><span class="scene-val" id="osc-phi-val">0.00</span></label>
          </div>
        </div>
      `;
    case "damped-oscillator":
      return `
        <div class="scene-label">Interactive 3: Damping</div>
        <p class="scene-caption">Drag the mass down and release it. Increase &gamma; to add damping and watch the oscillations die out. At critical damping (&gamma; = 2&omega;<sub>0</sub>) the system returns to rest fastest without oscillating. The roots of the characteristic equation move in the complex plane on the right.</p>
        <div class="interactive-scene">
          <canvas id="scene-damped-oscillator" width="550" height="280"></canvas>
          <div class="scene-controls">
            <label><span>&gamma;: </span><input type="range" id="damp-gamma" min="0" max="10" step="0.1" value="2"><span class="scene-val" id="damp-gamma-val">2.0</span></label>
            <label><span>m: </span><input type="range" id="damp-mass" min="0.1" max="2" step="0.05" value="1"><span class="scene-val" id="damp-mass-val">1.0</span></label>
            <span class="scene-val" id="damp-omega-val"></span>
          </div>
        </div>
      `;
    case "damping-regimes":
      return `
        <div class="scene-label">Interactive 4: Race to Equilibrium</div>
        <p class="scene-caption">Three oscillators with the same &omega;<sub>0</sub> but different damping start from the same displacement. The critically damped one (amber) always returns to equilibrium fastest without overshooting. Adjust &omega;<sub>0</sub> to change the natural frequency.</p>
        <div class="interactive-scene">
          <canvas id="scene-damping-regimes" width="580" height="380"></canvas>
          <div class="scene-controls">
            <label><span>&omega;<sub>0</sub>:</span> <input type="range" id="regime-omega0" min="1" max="10" step="0.5" value="5"><span class="scene-val" id="regime-omega0-val">5.0</span></label>
            <button id="regime-go" class="scene-btn">&#9654; Go</button>
          </div>
        </div>
      `;
    case "euler-circle":
      return `
        <div class="scene-label">Euler&rsquo;s Formula</div>
        <p class="scene-caption">e<sup>i&theta;</sup> = cos&theta; + i sin&theta;. The rotating phasor on the unit circle projects onto cosine (real) and sine (imaginary).</p>
        <div class="interactive-scene">
          <canvas id="scene-euler-circle" width="550" height="280"></canvas>
        </div>
      `;

    // =====================================================================
    // CHAPTER 3: COUPLED OSCILLATORS
    // =====================================================================
    case "coupled-oscillators":
      return `
        <div class="scene-label">Coupled Oscillators</div>
        <p class="scene-caption">Drag either mass and release. Adjust the coupling strength &kappa;/k to see how the interaction changes.</p>
        <div class="interactive-scene">
          <canvas id="scene-coupled-oscillators" width="600" height="320"></canvas>
          <div class="scene-controls">
            <label><span>&kappa;/k: </span><input type="range" id="coupled-kappa" min="0.05" max="2" step="0.05" value="0.3"><span class="scene-val" id="coupled-kappa-val">0.30</span></label>
          </div>
        </div>
      `;
    case "normal-modes":
      return `
        <div class="scene-label">Normal Modes</div>
        <p class="scene-caption">The symmetric mode (left) and antisymmetric mode (right). Each oscillates at a single frequency determined by the coupling.</p>
        <div class="interactive-scene">
          <canvas id="scene-normal-modes" width="600" height="280"></canvas>
          <div class="scene-controls">
            <label><span>&kappa;/k: </span><input type="range" id="normal-modes-kappa" min="0.05" max="2" step="0.05" value="0.3"><span class="scene-val" id="normal-modes-kappa-val">0.30</span></label>
          </div>
        </div>
      `;
    case "beats":
      return `
        <div class="scene-label">Beats from Coupled Oscillators</div>
        <p class="scene-caption">Start with one mass displaced. Energy sloshes between the two masses at the beat frequency |&omega;<sub>f</sub> &minus; &omega;<sub>s</sub>|.</p>
        <div class="interactive-scene">
          <canvas id="scene-beats" width="600" height="320"></canvas>
          <div class="scene-controls">
            <label><span>&kappa;/k: </span><input type="range" id="beats-kappa" min="0.05" max="1" step="0.05" value="0.2"><span class="scene-val" id="beats-kappa-val">0.20</span></label>
          </div>
        </div>
      `;
    case "eigenvalue-solver":
      return `
        <div class="scene-label">Eigenvalue Problem</div>
        <p class="scene-caption">Dots oscillate along eigenvector directions at the mode frequency. The symmetric mode (teal) has fixed &omega;; increasing &kappa; speeds up the antisymmetric mode (red).</p>
        <div class="interactive-scene">
          <canvas id="scene-eigenvalue-solver" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>&kappa;/k: </span><input type="range" id="eigen-kappa" min="0.05" max="2" step="0.05" value="0.5"><span class="scene-val" id="eigen-kappa-val">0.50</span></label>
          </div>
        </div>
      `;

    // =====================================================================
    // CHAPTER 4: FROM OSCILLATORS TO WAVES
    // =====================================================================
    case "two-mass-normal-modes":
      return `
        <div class="scene-label">Two-Mass Mode Shapes</div>
        <p class="scene-caption">Select a mode to see the displacement pattern. The symmetric mode has both masses moving together; the antisymmetric mode has them moving in opposite directions.</p>
        <div class="interactive-scene">
          <canvas id="scene-two-mass-normal-modes" width="600" height="300"></canvas>
          <div class="scene-controls">
            <button id="two-mass-sym" class="scene-btn">Symmetric</button>
            <button id="two-mass-anti" class="scene-btn">Antisymmetric</button>
            <button id="two-mass-both" class="scene-btn">Both</button>
          </div>
        </div>
      `;
    case "three-mass-normal-modes":
      return `
        <div class="scene-label">Three-Mass Normal Modes</div>
        <p class="scene-caption">Three normal modes from slowest (top) to fastest (bottom). Higher modes have more nodes and higher frequencies.</p>
        <div class="interactive-scene">
          <canvas id="scene-three-mass-normal-modes" width="600" height="340"></canvas>
        </div>
      `;
    case "n-mass-chain":
      return `
        <div class="scene-label">N-Mass Chain</div>
        <p class="scene-caption">Adjust N and the mode number to see how mode shapes become smoother as N increases.</p>
        <div class="interactive-scene">
          <canvas id="scene-n-mass-chain" width="600" height="340"></canvas>
          <div class="scene-controls">
            <label><span>N: </span><input type="range" id="nchain-n" min="3" max="20" step="1" value="8"><span class="scene-val" id="nchain-n-val">8</span></label>
            <label><span>Mode: </span><input type="range" id="nchain-mode" min="1" max="20" step="1" value="1"><span class="scene-val" id="nchain-mode-val">1</span></label>
          </div>
        </div>
      `;
    case "n-mass-modes-numerical":
      return `
        <div class="scene-label">Normal Mode Shapes (Numerical)</div>
        <p class="scene-caption">Normal mode shapes for N coupled masses. Higher modes oscillate faster and have more nodes.</p>
        <div class="interactive-scene">
          <canvas id="scene-n-mass-modes-numerical" width="600" height="320"></canvas>
          <div class="scene-controls">
            <label><span>N: </span><input type="range" id="nmm-n" min="4" max="20" step="1" value="8"><span class="scene-val" id="nmm-n-val">8</span></label>
            <label><span>Mode j: </span><input type="range" id="nmm-j" min="1" max="20" step="1" value="1"><span class="scene-val" id="nmm-j-val">1</span></label>
          </div>
        </div>
      `;
    case "dispersion-relation-discrete":
      return `
        <div class="scene-label">Discrete Dispersion Relation</div>
        <p class="scene-caption">The dispersion curve &omega;(p) = 2&omega;<sub>0</sub>|sin(p/2)| with allowed modes as dots. The dashed line shows the linear approximation.</p>
        <div class="interactive-scene">
          <canvas id="scene-dispersion-relation-discrete" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>N: </span><input type="range" id="drd-n" min="3" max="30" step="1" value="10"><span class="scene-val" id="drd-n-val">10</span></label>
            <label><span>Mode: </span><input type="range" id="drd-mode" min="1" max="30" step="1" value="1"><span class="scene-val" id="drd-mode-val">1</span></label>
          </div>
        </div>
      `;
    case "continuum-limit":
      return `
        <div class="scene-label">Continuum Limit</div>
        <p class="scene-caption">As N increases, the discrete masses approach a continuous string and the dispersion relation becomes linear.</p>
        <div class="interactive-scene">
          <canvas id="scene-continuum-limit" width="600" height="320"></canvas>
          <div class="scene-controls">
            <label><span>N: </span><input type="range" id="cl-n" min="3" max="100" step="1" value="6"><span class="scene-val" id="cl-n-val">6</span></label>
            <label><span>Mode: </span><input type="range" id="cl-mode" min="1" max="10" step="1" value="1"><span class="scene-val" id="cl-mode-val">1</span></label>
          </div>
        </div>
      `;
    case "traveling-vs-standing":
      return `
        <div class="scene-label">Traveling vs Standing Waves</div>
        <p class="scene-caption">Compare a traveling wave (moves to the right) with a standing wave (oscillates in place with fixed nodes).</p>
        <div class="interactive-scene">
          <canvas id="scene-traveling-vs-standing" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>k: </span><input type="range" id="tvs-k" min="1" max="8" step="0.5" value="3"><span class="scene-val" id="tvs-k-val">3.0</span></label>
            <button id="tvs-mode-btn" class="scene-btn">Toggle View</button>
          </div>
        </div>
      `;

    // =====================================================================
    // CHAPTER 5: FOURIER SERIES
    // =====================================================================
    case "fourier-decomposition":
      return `
        <div class="scene-label">Fourier Series Builder</div>
        <p class="scene-caption">Choose a function and add terms to see the Fourier series converge. Individual harmonics shown in light colors.</p>
        <div class="interactive-scene">
          <canvas id="scene-fourier-decomposition" width="600" height="300"></canvas>
          <div class="scene-controls">
            <button id="fourier-square" class="scene-btn">Square</button>
            <button id="fourier-triangle" class="scene-btn">Triangle</button>
            <button id="fourier-sawtooth" class="scene-btn">Sawtooth</button>
            <label><span>Terms: </span><input type="range" id="fourier-terms" min="1" max="50" step="1" value="5"><span class="scene-val" id="fourier-terms-val">5</span></label>
          </div>
        </div>
      `;
    case "fourier-sawtooth":
      return `
        <div class="scene-label">Sawtooth Fourier Series</div>
        <p class="scene-caption">Building the sawtooth function term by term. Notice the Gibbs overshoot at the discontinuity that persists even with many terms.</p>
        <div class="interactive-scene">
          <canvas id="scene-fourier-sawtooth" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>Terms: </span><input type="range" id="sawtooth-terms" min="1" max="50" step="1" value="5"><span class="scene-val" id="sawtooth-terms-val">5</span></label>
          </div>
        </div>
      `;
    case "plucked-string":
      return `
        <div class="scene-label">Plucked String</div>
        <p class="scene-caption">Click on the string to pluck it! The pluck point determines which harmonics are excited. Each mode oscillates at its own frequency, producing the evolving shape.</p>
        <div class="interactive-scene">
          <canvas id="scene-plucked-string" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>Damping: </span><input type="range" id="pluck-damping" min="0" max="2" step="0.05" value="0"><span class="scene-val" id="pluck-damping-val">0.00</span></label>
            <label><span>Speed: </span><input type="range" id="pluck-speed" min="0.1" max="3" step="0.1" value="1"><span class="scene-val" id="pluck-speed-val">1.0</span></label>
          </div>
        </div>
      `;

    // =====================================================================
    // CHAPTER 6: WAVES
    // =====================================================================
    case "string-transverse-wave":
      return `
        <div class="scene-label">Spherical Wave from a Point Source</div>
        <p class="scene-caption">Circular wavefronts emanate from a small speaker. Compression (dense, bright) and rarefaction (sparse, dim) regions spread outward, with amplitude falling off as 1/&radic;r.</p>
        <div class="interactive-scene">
          <canvas id="scene-string-transverse-wave" width="600" height="280"></canvas>
          <div class="scene-controls">
            <label><span>Frequency: </span><input type="range" id="stw-freq" min="0.5" max="3" step="0.1" value="1.2"><span class="scene-val" id="stw-freq-val">1.2</span></label>
            <label><span>Amplitude: </span><input type="range" id="stw-amp" min="0.3" max="1.5" step="0.1" value="0.8"><span class="scene-val" id="stw-amp-val">0.8</span></label>
            <label><span>Speed: </span><input type="range" id="stw-speed" min="0.005" max="0.04" step="0.005" value="0.015"><span class="scene-val" id="stw-speed-val">0.50x</span></label>
          </div>
        </div>
      `;
    case "sound-wave-longitudinal":
      return `
        <div class="scene-label">Longitudinal Sound Wave</div>
        <p class="scene-caption">Air molecules oscillate back and forth. Regions of compression (dark) and rarefaction (light) propagate as a wave.</p>
        <div class="interactive-scene">
          <canvas id="scene-sound-wave-longitudinal" width="600" height="280"></canvas>
          <div class="scene-controls">
            <label><span>Wavelength: </span><input type="range" id="swl-wl" min="40" max="200" step="10" value="100"><span class="scene-val" id="swl-wl-val">100</span></label>
          </div>
        </div>
      `;
    case "boundary-conditions-demo":
      return `
        <div class="scene-label">Boundary Conditions</div>
        <p class="scene-caption">Compare how different boundary conditions change the allowed standing wave modes. Nodes (&bull;) and antinodes (&circ;) are marked.</p>
        <div class="interactive-scene">
          <canvas id="scene-boundary-conditions-demo" width="600" height="280"></canvas>
          <div class="scene-controls">
            <button id="bcd-ff" class="scene-btn">Fixed-Fixed</button>
            <button id="bcd-fo" class="scene-btn">Fixed-Free</button>
            <button id="bcd-oo" class="scene-btn">Free-Free</button>
            <label><span>Mode: </span><input type="range" id="bcd-mode" min="1" max="8" step="1" value="1"><span class="scene-val" id="bcd-mode-val">1</span></label>
          </div>
        </div>
      `;
    case "standing-wave-modes":
      return `
        <div class="scene-label">Standing Wave Frequency Spectra</div>
        <p class="scene-caption">The first four modes for each boundary type. Fixed-free is missing even harmonics. Frequencies shown as multiples of the fundamental.</p>
        <div class="interactive-scene">
          <canvas id="scene-standing-wave-modes" width="600" height="340"></canvas>
        </div>
      `;
    case "helmholtz-resonator":
      return `
        <div class="scene-label">Helmholtz Resonator</div>
        <p class="scene-caption">A cavity with a neck: air in the neck oscillates as a mass, air in the body acts as a spring. Adjust geometry to change the resonant frequency.</p>
        <div class="interactive-scene">
          <canvas id="scene-helmholtz-resonator" width="600" height="320"></canvas>
          <div class="scene-controls">
            <label><span>A (cm&sup2;): </span><input type="range" id="hr-a" min="0.5" max="10" step="0.5" value="3"><span class="scene-val" id="hr-a-val">3.0</span></label>
            <label><span>V (mL): </span><input type="range" id="hr-v" min="100" max="2000" step="50" value="500"><span class="scene-val" id="hr-v-val">500</span></label>
            <label><span>L (cm): </span><input type="range" id="hr-l" min="0.5" max="10" step="0.5" value="3"><span class="scene-val" id="hr-l-val">3.0</span></label>
          </div>
        </div>
      `;

    // =====================================================================
    // CHAPTER 7: MUSIC
    // =====================================================================
    case "beats-demo":
      return `
        <div class="scene-label">Beats</div>
        <p class="scene-caption">Two waves of slightly different frequencies produce a slowly varying beat pattern. Adjust &Delta;f to change the beat rate.</p>
        <div class="interactive-scene">
          <canvas id="scene-beats-demo" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>&Delta;f (Hz): </span><input type="range" id="bd-df" min="0" max="30" step="0.5" value="5"><span class="scene-val" id="bd-df-val">5.0</span></label>
          </div>
        </div>
      `;
    case "consonance-dissonance":
      return `
        <div class="scene-label">Consonance &amp; Dissonance</div>
        <p class="scene-caption">Slide the frequency ratio to see where harmonics align (consonant, green) or nearly collide (dissonant, red).</p>
        <div class="interactive-scene">
          <canvas id="scene-consonance-dissonance" width="600" height="320"></canvas>
          <div class="scene-controls">
            <label><span>Ratio: </span><input type="range" id="cd-ratio" min="1" max="2" step="0.01" value="1.5"><span class="scene-val" id="cd-ratio-val">1.50</span></label>
          </div>
        </div>
      `;
    case "harmonic-alignment":
      return `
        <div class="scene-label">Harmonic Alignment</div>
        <p class="scene-caption">Select an interval to see which harmonics of the two notes align. Simpler ratios have more alignments.</p>
        <div class="interactive-scene">
          <canvas id="scene-harmonic-alignment" width="600" height="300"></canvas>
          <div class="scene-controls" id="ha-btns">
            <button id="ha-btn-0" class="scene-btn">Octave</button>
            <button id="ha-btn-1" class="scene-btn">Fifth</button>
            <button id="ha-btn-2" class="scene-btn">Fourth</button>
            <button id="ha-btn-3" class="scene-btn">Maj 3rd</button>
            <button id="ha-btn-4" class="scene-btn">Min 3rd</button>
          </div>
        </div>
      `;
    case "circle-of-fifths":
      return `
        <div class="scene-label">Circle of Fifths</div>
        <p class="scene-caption">In equal temperament the circle closes exactly. In Pythagorean tuning, 12 fifths overshoot 7 octaves by the Pythagorean comma.</p>
        <div class="interactive-scene">
          <canvas id="scene-circle-of-fifths" width="600" height="340"></canvas>
          <div class="scene-controls">
            <button id="cof-et" class="scene-btn">Equal Tempered</button>
            <button id="cof-py" class="scene-btn">Pythagorean</button>
            <label><span>Note: </span><input type="range" id="cof-note" min="0" max="11" step="1" value="0"><span class="scene-val" id="cof-note-val">C</span></label>
          </div>
        </div>
      `;
    case "scale-comparison":
      return `
        <div class="scene-label">Scale Comparison</div>
        <p class="scene-caption">Three tuning systems compared on a cents axis. Just intonation is purest in one key; equal temperament works equally in all keys.</p>
        <div class="interactive-scene">
          <canvas id="scene-scale-comparison" width="600" height="300"></canvas>
        </div>
      `;

    // =====================================================================
    // CHAPTER 8: FOURIER TRANSFORMS
    // =====================================================================
    case "violin-spectrum":
      return `
        <div class="scene-label">Instrument Spectrum</div>
        <p class="scene-caption">Drag harmonic bars up and down to reshape the timbre, or choose an instrument preset. Hit Listen to hear how the spectrum sounds.</p>
        <div class="interactive-scene">
          <canvas id="scene-violin-spectrum" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>f<sub>0</sub>: </span><input type="range" id="violin-f0" min="100" max="800" step="10" value="440"><span class="scene-val" id="violin-f0-val">440 Hz</span></label>
          </div>
        </div>
      `;
    case "fourier-transform-derivation":
      return `
        <div class="scene-label">From Series to Transform</div>
        <p class="scene-caption">As L increases, discrete Fourier series bars crowd together and approach the continuous Fourier transform.</p>
        <div class="interactive-scene">
          <canvas id="scene-fourier-transform-derivation" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>L: </span><input type="range" id="ftd-L" min="1" max="20" step="0.5" value="3"><span class="scene-val" id="ftd-L-val">3.0</span></label>
          </div>
        </div>
      `;
    case "underdamped-fourier-transform":
      return `
        <div class="scene-label">Underdamped Oscillator &amp; Power Spectrum</div>
        <p class="scene-caption">Left: decaying oscillation. Right: its Lorentzian power spectrum with peak at &omega;<sub>0</sub> and width &gamma;.</p>
        <div class="interactive-scene">
          <canvas id="scene-underdamped-fourier-transform" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>&gamma;: </span><input type="range" id="uft-gamma" min="0.2" max="5" step="0.2" value="2"><span class="scene-val" id="uft-gamma-val">2.0</span></label>
            <label><span>&omega;<sub>0</sub>:</span> <input type="range" id="uft-omega0" min="2" max="15" step="0.5" value="10"><span class="scene-val" id="uft-omega0-val">10.0</span></label>
          </div>
        </div>
      `;
    case "fourier-magnitude-phase":
      return `
        <div class="scene-label">Magnitude vs Phase</div>
        <p class="scene-caption">Phase carries most of the structural information. Pick two signals and swap their magnitudes to see.</p>
        <div class="interactive-scene">
          <canvas id="scene-fourier-magnitude-phase" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label>Signal A: <select id="fmp-sigA"><option value="square">Square</option><option value="triangle">Triangle</option><option value="sawtooth">Sawtooth</option><option value="pulse">Pulse</option></select></label>
            <label>Signal B: <select id="fmp-sigB"><option value="square">Square</option><option value="triangle" selected>Triangle</option><option value="sawtooth">Sawtooth</option><option value="pulse">Pulse</option></select></label>
          </div>
        </div>
      `;
    case "fourier-filtering":
      return `
        <div class="scene-label">Fourier Filtering</div>
        <p class="scene-caption">Low-pass filtering removes sharp features; high-pass filtering keeps only the rapid variations.</p>
        <div class="interactive-scene">
          <canvas id="scene-fourier-filtering" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>Cutoff: </span><input type="range" id="ff-cutoff" min="1" max="20" step="1" value="5"><span class="scene-val" id="ff-cutoff-val">5</span></label>
          </div>
        </div>
      `;
    case "dirac-delta-visualization":
      return `
        <div class="scene-label">Dirac Delta Function</div>
        <p class="scene-caption">The delta function as a limit of narrowing Gaussians. Area stays 1 while the peak grows. Its FT is constant (all frequencies equally present).</p>
        <div class="interactive-scene">
          <canvas id="scene-dirac-delta-visualization" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>&sigma;: </span><input type="range" id="dd-sigma" min="0.02" max="1" step="0.02" value="0.3"><span class="scene-val" id="dd-sigma-val">0.30</span></label>
          </div>
        </div>
      `;

    // =====================================================================
    // CHAPTER 9: REFLECTION & TRANSMISSION
    // =====================================================================
    case "string-junction":
      return `
        <div class="scene-label">String Junction</div>
        <p class="scene-caption">A pulse hits a junction between two strings of different impedance. Part reflects, part transmits.</p>
        <div class="interactive-scene">
          <canvas id="scene-string-junction" width="600" height="280"></canvas>
          <div class="scene-controls">
            <label><span>Z<sub>2</sub>/Z<sub>1</sub>: </span><input type="range" id="sj-z" min="0.2" max="5" step="0.1" value="2"><span class="scene-val" id="sj-z-val">2.0</span></label>
          </div>
        </div>
      `;
    case "reflection-transmission-pulse":
      return `
        <div class="scene-label">Reflection &amp; Transmission</div>
        <p class="scene-caption">Watch incident (teal), reflected (amber), and transmitted (blue) pulses at a junction.</p>
        <div class="interactive-scene">
          <canvas id="scene-reflection-transmission-pulse" width="600" height="280"></canvas>
          <div class="scene-controls">
            <label><span>Z<sub>2</sub>/Z<sub>1</sub>: </span><input type="range" id="rtp-z" min="0.2" max="5" step="0.1" value="2"><span class="scene-val" id="rtp-z-val">2.0</span></label>
          </div>
        </div>
      `;
    case "phase-flip-demo":
      return `
        <div class="scene-label">Phase Flip on Reflection</div>
        <p class="scene-caption">Adjust impedance ratio to see how reflection and transmission change. Z<sub>2</sub>/Z<sub>1</sub> &gt; 1 &rarr; phase flip; &lt; 1 &rarr; no flip.</p>
        <div class="interactive-scene">
          <canvas id="scene-phase-flip-demo" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>Z<sub>2</sub>/Z<sub>1</sub>: </span><input type="range" id="pfd-zratio" min="0.1" max="5" step="0.1" value="3"><span class="scene-val" id="pfd-zratio-val">3.0</span></label>
            <button id="pfd-restart" style="padding:2px 10px;cursor:pointer">Restart</button>
          </div>
        </div>
      `;
    case "mass-collision-impedance":
      return `
        <div class="scene-label">Mass Collision &amp; Impedance</div>
        <p class="scene-caption">Elastic collisions between masses: energy transfer depends on mass ratio, analogous to impedance matching.</p>
        <div class="interactive-scene">
          <canvas id="scene-mass-collision-impedance" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>m<sub>2</sub>/m<sub>1</sub>: </span><input type="range" id="mci-ratio" min="0.1" max="10" step="0.1" value="1"><span class="scene-val" id="mci-ratio-val">1.0</span></label>
          </div>
        </div>
      `;
    case "complex-impedance":
      return `
        <div class="scene-label">Complex Impedance</div>
        <p class="scene-caption">Real and imaginary parts of impedance vs frequency. At resonance, Im(Z)=0 and the system is purely resistive.</p>
        <div class="interactive-scene">
          <canvas id="scene-complex-impedance" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>m: </span><input type="range" id="ci-m" min="0.1" max="5" step="0.1" value="1"><span class="scene-val" id="ci-m-val">1.0</span></label>
            <label><span>b: </span><input type="range" id="ci-b" min="0.1" max="5" step="0.1" value="1"><span class="scene-val" id="ci-b-val">1.0</span></label>
            <label><span>k: </span><input type="range" id="ci-k" min="1" max="50" step="1" value="10"><span class="scene-val" id="ci-k-val">10.0</span></label>
          </div>
        </div>
      `;

    // =====================================================================
    // CHAPTER 10: POWER
    // =====================================================================
    case "impedance-materials":
      return `
        <div class="scene-label">Material Impedances</div>
        <p class="scene-caption">Acoustic impedance values for common materials. Large mismatch means strong reflection at boundaries.</p>
        <div class="interactive-scene">
          <canvas id="scene-impedance-materials" width="600" height="300"></canvas>
        </div>
      `;
    case "wave-energy-string":
      return `
        <div class="scene-label">Wave Energy on a String</div>
        <p class="scene-caption">For a traveling wave, kinetic and potential energy densities are equal everywhere and move with the wave.</p>
        <div class="interactive-scene">
          <canvas id="scene-wave-energy-string" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>&omega;: </span><input type="range" id="wes-omega" min="1" max="10" step="0.5" value="4"><span class="scene-val" id="wes-omega-val">4.0</span></label>
            <label><span>k: </span><input type="range" id="wes-k" min="1" max="10" step="0.5" value="4"><span class="scene-val" id="wes-k-val">4.0</span></label>
          </div>
        </div>
      `;
    case "power-reflection-transmission":
      return `
        <div class="scene-label">Power Reflection &amp; Transmission</div>
        <p class="scene-caption">R + T = 1 always. Matched impedances (Z<sub>2</sub>/Z<sub>1</sub> = 1) give zero reflection.</p>
        <div class="interactive-scene">
          <canvas id="scene-power-reflection-transmission" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>Z<sub>2</sub>/Z<sub>1</sub>: </span><input type="range" id="prt-z" min="0.1" max="5" step="0.05" value="1"><span class="scene-val" id="prt-z-val">1.00</span></label>
          </div>
        </div>
      `;
    case "decibel-scale":
      return `
        <div class="scene-label">Decibel Scale</div>
        <p class="scene-caption">Common sounds on the dB scale. Sound intensity drops as 1/r&sup2; with distance from the source.</p>
        <div class="interactive-scene">
          <canvas id="scene-decibel-scale" width="600" height="320"></canvas>
          <div class="scene-controls">
            <label><span>Distance (m): </span><input type="range" id="db-dist" min="1" max="100" step="1" value="1"><span class="scene-val" id="db-dist-val">1 m</span></label>
          </div>
        </div>
      `;
    case "plane-wave-3d":
      return `
        <div class="scene-label">3D Plane Wave</div>
        <p class="scene-caption">Parallel wavefronts propagate perpendicular to the wave vector k. Adjust the propagation angle.</p>
        <div class="interactive-scene">
          <canvas id="scene-plane-wave-3d" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>Angle: </span><input type="range" id="pw3d-angle" min="0" max="90" step="5" value="30"><span class="scene-val" id="pw3d-angle-val">30&deg;</span></label>
          </div>
        </div>
      `;

    // =====================================================================
    // CHAPTER 11: WAVEPACKETS
    // =====================================================================
    case "interference-demo":
      return `
        <div class="scene-label">Two-Source Interference</div>
        <p class="scene-caption">Two point sources produce constructive (bright) and destructive (dark) interference. Adjust source separation.</p>
        <div class="interactive-scene">
          <canvas id="scene-interference-demo" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>d/&lambda;: </span><input type="range" id="intdemo-sep" min="0.5" max="5" step="0.1" value="2"><span class="scene-val" id="intdemo-sep-val">2.00</span></label>
          </div>
        </div>
      `;
    case "gaussian-wavepacket":
      return `
        <div class="scene-label">Gaussian Wavepacket</div>
        <p class="scene-caption">A narrow wavepacket in x-space has a wide spectrum in k-space, and vice versa. &Delta;x&middot;&Delta;k &ge; 1/2.</p>
        <div class="interactive-scene">
          <canvas id="scene-gaussian-wavepacket" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>&sigma;<sub>x</sub>: </span><input type="range" id="gwp-sigma" min="0.5" max="5" step="0.1" value="2"><span class="scene-val" id="gwp-sigma-val">2.0</span></label>
          </div>
        </div>
      `;
    case "amplitude-modulation":
      return `
        <div class="scene-label">Amplitude Modulation</div>
        <p class="scene-caption">A slowly varying envelope modulates a high-frequency carrier. Sidebands appear in the frequency domain.</p>
        <div class="interactive-scene">
          <canvas id="scene-amplitude-modulation" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>f<sub>c</sub>: </span><input type="range" id="am-fc" min="20" max="100" step="5" value="50"><span class="scene-val" id="am-fc-val">50</span></label>
            <label><span>f<sub>m</sub>: </span><input type="range" id="am-fm" min="1" max="15" step="0.5" value="5"><span class="scene-val" id="am-fm-val">5.0</span></label>
          </div>
        </div>
      `;
    case "dispersion-relations":
      return `
        <div class="scene-label">Dispersion Relations</div>
        <p class="scene-caption">Different media have different &omega;(k) curves. The slope at any point gives the group velocity.</p>
        <div class="interactive-scene">
          <canvas id="scene-dispersion-relations" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>k<sub>0</sub>: </span><input type="range" id="disp-k0" min="0.5" max="5" step="0.1" value="2"><span class="scene-val" id="disp-k0-val">2.0</span></label>
          </div>
        </div>
      `;
    case "phase-velocity-demo":
      return `
        <div class="scene-label">Phase Velocity</div>
        <p class="scene-caption">In a dispersive medium, different Fourier components travel at different phase velocities v<sub>p</sub> = &omega;/k.</p>
        <div class="interactive-scene">
          <canvas id="scene-phase-velocity-demo" width="600" height="280"></canvas>
          <div class="scene-controls">
            <label><span>k<sub>0</sub>: </span><input type="range" id="pvd-k0" min="1" max="8" step="0.5" value="3"><span class="scene-val" id="pvd-k0-val">3.0</span></label>
            <label><span>&Delta;k: </span><input type="range" id="pvd-dk" min="0.1" max="1.5" step="0.1" value="0.4"><span class="scene-val" id="pvd-dk-val">0.4</span></label>
          </div>
        </div>
      `;
    case "group-velocity-demo":
      return `
        <div class="scene-label">Group Velocity</div>
        <p class="scene-caption">The envelope moves at v<sub>g</sub> = d&omega;/dk while crests move at v<sub>p</sub>. Increase dispersion to see them differ.</p>
        <div class="interactive-scene">
          <canvas id="scene-group-velocity-demo" width="600" height="280"></canvas>
          <div class="scene-controls">
            <label><span>Dispersion: </span><input type="range" id="gvd-disp" min="0" max="5" step="0.1" value="1"><span class="scene-val" id="gvd-disp-val">1.0</span></label>
          </div>
        </div>
      `;
    case "wavepacket-dispersion":
      return `
        <div class="scene-label">Wavepacket Dispersion</div>
        <p class="scene-caption">Top: non-dispersive (shape preserved). Bottom: dispersive (pulse broadens over time).</p>
        <div class="interactive-scene">
          <canvas id="scene-wavepacket-dispersion" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>Dispersion: </span><input type="range" id="wpdisp-d" min="0" max="0.5" step="0.01" value="0.1"><span class="scene-val" id="wpdisp-d-val">0.10</span></label>
          </div>
        </div>
      `;

    // =====================================================================
    // CHAPTER 12: WAVES (MULLER)
    // =====================================================================
    case "wave-transport-energy":
      return `
        <div class="scene-label">Wave Energy Transport</div>
        <p class="scene-caption">Medium particles oscillate in place while the wave pulse carries energy forward.</p>
        <div class="interactive-scene">
          <canvas id="scene-wave-transport-energy" width="600" height="280"></canvas>
          <div class="scene-controls">
            <label><span>Pulse speed: </span><input type="range" id="wte-speed" min="0.2" max="2" step="0.1" value="0.8"><span class="scene-val" id="wte-speed-val">0.8</span></label>
            <label><span>Pulse width: </span><input type="range" id="wte-width" min="20" max="120" step="5" value="60"><span class="scene-val" id="wte-width-val">60</span></label>
          </div>
        </div>
      `;
    case "transverse-longitudinal-demo":
      return `
        <div class="scene-label">Transverse vs Longitudinal</div>
        <p class="scene-caption">Top: transverse wave (displacement perpendicular to propagation). Bottom: longitudinal (displacement parallel).</p>
        <div class="interactive-scene">
          <canvas id="scene-transverse-longitudinal-demo" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>&omega;: </span><input type="range" id="tld-omega" min="0.5" max="6" step="0.1" value="2"><span class="scene-val" id="tld-omega-val">2.0</span></label>
            <label><span>k: </span><input type="range" id="tld-k" min="0.1" max="1" step="0.05" value="0.3"><span class="scene-val" id="tld-k-val">0.30</span></label>
          </div>
        </div>
      `;
    case "sound-refraction-atmosphere":
      return `
        <div class="scene-label">Sound Refraction in the Atmosphere</div>
        <p class="scene-caption">Sound bends toward slower regions. Daytime: rays bend up (shadow zone). Evening: rays bend down (sound carries far).</p>
        <div class="interactive-scene">
          <canvas id="scene-sound-refraction-atmosphere" width="600" height="300"></canvas>
        </div>
      `;

    // =====================================================================
    // CHAPTER 13: LIGHT
    // =====================================================================
    case "em-plane-wave":
      return `
        <div class="scene-label">Electromagnetic Plane Wave</div>
        <p class="scene-caption">E (blue, vertical) and B (red, horizontal) oscillate perpendicular to each other and to the propagation direction k.</p>
        <div class="interactive-scene">
          <canvas id="scene-em-plane-wave" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>Frequency: </span><input type="range" id="empw-freq" min="0.5" max="4" step="0.1" value="1.5"><span class="scene-val" id="empw-freq-val">1.5</span></label>
            <label><span>Amplitude: </span><input type="range" id="empw-amp" min="0.2" max="1" step="0.05" value="0.7"><span class="scene-val" id="empw-amp-val">0.70</span></label>
          </div>
        </div>
      `;

    // =====================================================================
    // CHAPTER 14: POLARIZATION
    // =====================================================================
    case "linear-polarization":
      return `
        <div class="scene-label">Linear Polarization</div>
        <p class="scene-caption">The electric field oscillates along a fixed direction. Adjust the polarization angle.</p>
        <div class="interactive-scene">
          <canvas id="scene-linear-polarization" width="600" height="280"></canvas>
          <div class="scene-controls">
            <label><span>Angle: </span><input type="range" id="linear-pol-angle" min="0" max="3.14" step="0.05" value="0"><span class="scene-val" id="linear-pol-angle-val">0&deg;</span></label>
          </div>
        </div>
      `;
    case "circular-polarization":
      return `
        <div class="scene-label">Circular Polarization</div>
        <p class="scene-caption">The E-field vector rotates as the wave propagates, tracing a helix. Toggle between right and left circular.</p>
        <div class="interactive-scene">
          <canvas id="scene-circular-polarization" width="600" height="300"></canvas>
          <div class="scene-controls">
            <button id="circ-pol-toggle" class="scene-btn">Toggle RCP/LCP</button>
          </div>
        </div>
      `;
    case "malus-law":
      return `
        <div class="scene-label">Malus&rsquo; Law</div>
        <p class="scene-caption">Transmitted intensity through a polarizer follows I = I<sub>0</sub>cos&sup2;&theta;. Rotate the polarizer to see.</p>
        <div class="interactive-scene">
          <canvas id="scene-malus-law" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>&theta;: </span><input type="range" id="malus-theta" min="0" max="180" step="1" value="0"><span class="scene-val" id="malus-theta-val">0&deg;</span></label>
          </div>
        </div>
      `;

    // =====================================================================
    // CHAPTER 15: REFRACTION
    // =====================================================================
    case "snells-law-demo":
      return `
        <div class="scene-label">Snell&rsquo;s Law</div>
        <p class="scene-caption">Light refracting at a boundary. Adjust the angle and index ratio to see the refracted ray bend.</p>
        <div class="interactive-scene">
          <canvas id="scene-snells-law-demo" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>&theta;<sub>1</sub>: </span><input type="range" id="snell-theta1" min="0" max="89" step="1" value="30"><span class="scene-val" id="snell-theta1-val">30&deg;</span></label>
            <label><span>n<sub>2</sub>/n<sub>1</sub>: </span><input type="range" id="snell-nratio" min="0.5" max="3" step="0.05" value="1.5"><span class="scene-val" id="snell-nratio-val">1.50</span></label>
          </div>
        </div>
      `;
    case "total-internal-reflection":
      return `
        <div class="scene-label">Total Internal Reflection</div>
        <p class="scene-caption">Beyond the critical angle, all light reflects. An evanescent wave decays exponentially in the second medium.</p>
        <div class="interactive-scene">
          <canvas id="scene-total-internal-reflection" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>&theta;: </span><input type="range" id="tir-angle" min="0" max="89" step="1" value="30"><span class="scene-val" id="tir-angle-val">30&deg;</span></label>
          </div>
        </div>
      `;
    case "thin-film-interference":
      return `
        <div class="scene-label">Thin Film Interference</div>
        <p class="scene-caption">Adjust film thickness to see which wavelengths constructively or destructively interfere in the reflected light.</p>
        <div class="interactive-scene">
          <canvas id="scene-thin-film-interference" width="600" height="320"></canvas>
          <div class="scene-controls">
            <label><span>Thickness (nm): </span><input type="range" id="thinfilm-thickness" min="50" max="800" step="10" value="300"><span class="scene-val" id="thinfilm-thickness-val">300</span></label>
          </div>
        </div>
      `;
    case "brewster-angle":
      return `
        <div class="scene-label">Brewster&rsquo;s Angle</div>
        <p class="scene-caption">Fresnel coefficients vs angle. At Brewster&rsquo;s angle, the p-polarized reflection vanishes completely.</p>
        <div class="interactive-scene">
          <canvas id="scene-brewster-angle" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>n<sub>2</sub>/n<sub>1</sub>: </span><input type="range" id="brewster-n" min="1.1" max="3" step="0.05" value="1.5"><span class="scene-val" id="brewster-n-val">1.50</span></label>
          </div>
        </div>
      `;

    // =====================================================================
    // CHAPTER 16: PRISMS & SCATTERING
    // =====================================================================
    case "rayleigh-scattering":
      return `
        <div class="scene-label">Rayleigh Scattering</div>
        <p class="scene-caption">Scattering intensity scales as 1/&lambda;&sup4;. Blue light scatters much more than red, making the sky blue and sunsets red.</p>
        <div class="interactive-scene">
          <canvas id="scene-rayleigh-scattering" width="600" height="300"></canvas>
        </div>
      `;
    case "prism-dispersion":
      return `
        <div class="scene-label">Prism Dispersion</div>
        <p class="scene-caption">White light separates into colors because n(&lambda;) differs for each wavelength. Blue bends more than red.</p>
        <div class="interactive-scene">
          <canvas id="scene-prism-dispersion" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>Apex angle: </span><input type="range" id="prism-apex" min="20" max="80" step="1" value="60"><span class="scene-val" id="prism-apex-val">60&deg;</span></label>
          </div>
        </div>
      `;

    // =====================================================================
    // CHAPTER 17: COLOR
    // =====================================================================
    case "color-matching-metamers":
      return `
        <div class="scene-label">Color Matching &amp; Metamers</div>
        <p class="scene-caption">Mix RGB to match a monochromatic target. When they look the same despite different spectra, they are metamers.</p>
        <div class="interactive-scene">
          <canvas id="scene-color-matching-metamers" width="600" height="300"></canvas>
        </div>
      `;
    case "cie-tristimulus-curves":
      return `
        <div class="scene-label">CIE Tristimulus Curves</div>
        <p class="scene-caption">The CIE color matching functions x&#772;(&lambda;), y&#772;(&lambda;), z&#772;(&lambda;) describe how the eye responds to each wavelength.</p>
        <div class="interactive-scene">
          <canvas id="scene-cie-tristimulus-curves" width="600" height="300"></canvas>
        </div>
      `;
    case "cie-color-space-gamut":
      return `
        <div class="scene-label">CIE Color Space &amp; Gamut</div>
        <p class="scene-caption">The horseshoe-shaped CIE chromaticity diagram with the sRGB gamut triangle. Not all visible colors can be displayed by RGB monitors.</p>
        <div class="interactive-scene">
          <canvas id="scene-cie-color-space-gamut" width="600" height="340"></canvas>
        </div>
      `;
    case "blackbody-planckian-locus":
      return `
        <div class="scene-label">Blackbody &amp; Planckian Locus</div>
        <p class="scene-caption">A blackbody&rsquo;s color traces a curve on the CIE diagram as temperature changes from red-hot to blue-white.</p>
        <div class="interactive-scene">
          <canvas id="scene-blackbody-planckian-locus" width="600" height="340"></canvas>
        </div>
      `;
    case "hsv-color-explorer":
      return `
        <div class="scene-label">HSV Color Explorer</div>
        <p class="scene-caption">Click on the color wheel to select hue and saturation. Adjust the value slider for brightness.</p>
        <div class="interactive-scene">
          <canvas id="scene-hsv-color-explorer" width="600" height="300"></canvas>
        </div>
      `;
    case "additive-subtractive-mixing":
      return `
        <div class="scene-label">Additive &amp; Subtractive Mixing</div>
        <p class="scene-caption">Left: RGB additive mixing (light) produces white at center. Right: CMY subtractive mixing (pigments) produces black.</p>
        <div class="interactive-scene">
          <canvas id="scene-additive-subtractive-mixing" width="600" height="300"></canvas>
        </div>
      `;
    case "rod-cone-sensitivity":
      return `
        <div class="scene-label">Rod &amp; Cone Sensitivity</div>
        <p class="scene-caption">Spectral sensitivity curves for rods (scotopic vision) and the three cone types (S, M, L).</p>
        <div class="interactive-scene">
          <canvas id="scene-rod-cone-sensitivity" width="600" height="300"></canvas>
        </div>
      `;

    // =====================================================================
    // CHAPTER 18: ANTENNAS
    // =====================================================================
    case "monopole-radiation-pattern":
      return `
        <div class="scene-label">Dipole Radiation Pattern</div>
        <p class="scene-caption">An oscillating dipole radiates with a sin<sup>n</sup>&theta; pattern. Adjust the exponent to see how directivity changes.</p>
        <div class="interactive-scene">
          <canvas id="scene-monopole-radiation-pattern" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>Exponent n: </span><input type="range" id="mrp-exp" min="1" max="6" step="1" value="2"><span class="scene-val" id="mrp-exp-val">2</span></label>
          </div>
        </div>
      `;
    case "two-source-interference":
      return `
        <div class="scene-label">Two-Source Interference</div>
        <p class="scene-caption">Two coherent sources produce an interference pattern. Adjust d/&lambda; to change the number of lobes.</p>
        <div class="interactive-scene">
          <canvas id="scene-two-source-interference" width="600" height="300"></canvas>
        </div>
      `;
    case "phased-array-radiation":
      return `
        <div class="scene-label">Phased Array</div>
        <p class="scene-caption">N sources with adjustable spacing and phase offset. The beam direction steers with phase.</p>
        <div class="interactive-scene">
          <canvas id="scene-phased-array-radiation" width="600" height="300"></canvas>
        </div>
      `;
    case "interferometer-resolution":
      return `
        <div class="scene-label">Interferometer Resolution</div>
        <p class="scene-caption">Two antennas separated by d. Angular resolution improves as d/&lambda; increases.</p>
        <div class="interactive-scene">
          <canvas id="scene-interferometer-resolution" width="600" height="300"></canvas>
        </div>
      `;

    // =====================================================================
    // CHAPTER 19: DIFFRACTION
    // =====================================================================
    case "huygens-principle-demo":
      return `
        <div class="scene-label">Huygens&rsquo; Principle</div>
        <p class="scene-caption">Plane waves pass through a slit. Each point in the slit acts as a new point source. Narrower slits spread more.</p>
        <div class="interactive-scene">
          <canvas id="scene-huygens-principle-demo" width="600" height="300"></canvas>
        </div>
      `;
    case "diffraction-grating-pattern":
      return `
        <div class="scene-label">Diffraction Grating</div>
        <p class="scene-caption">More slits produce sharper principal maxima. With N slits, peaks are N&sup2; times as intense.</p>
        <div class="interactive-scene">
          <canvas id="scene-diffraction-grating-pattern" width="600" height="300"></canvas>
        </div>
      `;
    case "single-slit-diffraction":
      return `
        <div class="scene-label">Single-Slit Diffraction</div>
        <p class="scene-caption">The sinc&sup2; pattern: a central maximum with side lobes. Narrower slits produce wider patterns.</p>
        <div class="interactive-scene">
          <canvas id="scene-single-slit-diffraction" width="600" height="300"></canvas>
        </div>
      `;
    case "fourier-optics-demo":
      return `
        <div class="scene-label">Fourier Optics</div>
        <p class="scene-caption">The diffraction pattern is the Fourier transform of the aperture. Select different aperture shapes to see.</p>
        <div class="interactive-scene">
          <canvas id="scene-fourier-optics-demo" width="600" height="300"></canvas>
        </div>
      `;

    // =====================================================================
    // CHAPTER 20: QUANTUM MECHANICS
    // =====================================================================
    case "photoelectric-effect-demo":
      return `
        <div class="scene-label">Photoelectric Effect</div>
        <p class="scene-caption">Below the threshold frequency, no electrons are ejected. Above it, KE = hf &minus; &phi; increases linearly with frequency.</p>
        <div class="interactive-scene">
          <canvas id="scene-photoelectric-effect-demo" width="600" height="300"></canvas>
        </div>
      `;
    case "double-slit-photon-buildup":
      return `
        <div class="scene-label">Double-Slit Photon Buildup</div>
        <p class="scene-caption">Individual photons arrive one at a time at random positions, gradually revealing the double-slit interference pattern.</p>
        <div class="interactive-scene">
          <canvas id="scene-double-slit-photon-buildup" width="600" height="300"></canvas>
        </div>
      `;
    case "hydrogen-energy-levels":
      return `
        <div class="scene-label">Hydrogen Energy Levels</div>
        <p class="scene-caption">Energy levels at E<sub>n</sub> = &minus;13.6/n&sup2; eV. Select a spectral series to see transitions.</p>
        <div class="interactive-scene">
          <canvas id="scene-hydrogen-energy-levels" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label>Series: <select id="hel-series"><option value="lyman">Lyman (n&rarr;1, UV)</option><option value="balmer" selected>Balmer (n&rarr;2, visible)</option><option value="paschen">Paschen (n&rarr;3, IR)</option><option value="brackett">Brackett (n&rarr;4, IR)</option></select></label>
          </div>
        </div>
      `;
    case "quantum-wavepacket-dispersion":
      return `
        <div class="scene-label">Quantum Wavepacket Spreading</div>
        <p class="scene-caption">A free quantum particle&rsquo;s wavepacket spreads over time due to dispersion in the Schr&ouml;dinger equation.</p>
        <div class="interactive-scene">
          <canvas id="scene-quantum-wavepacket-dispersion" width="600" height="300"></canvas>
        </div>
      `;

    // =====================================================================
    // CHAPTER 21: DOPPLER EFFECT
    // =====================================================================
    case "doppler-moving-source":
      return `
        <div class="scene-label">Doppler: Moving Source</div>
        <p class="scene-caption">Wave crests bunch up ahead of a moving source and spread out behind it. Adjust source velocity.</p>
        <div class="interactive-scene">
          <canvas id="scene-doppler-moving-source" width="600" height="300"></canvas>
        </div>
      `;
    case "doppler-angle":
      return `
        <div class="scene-label">Doppler: Angle Dependence</div>
        <p class="scene-caption">As a source passes an observer, the received frequency drops from high (approach) to low (recession).</p>
        <div class="interactive-scene">
          <canvas id="scene-doppler-angle" width="600" height="300"></canvas>
          <div class="scene-controls">
            <label><span>v/v<sub>sound</sub>: </span><input type="range" id="da-speed" min="0.1" max="0.9" step="0.05" value="0.5"><span class="scene-val" id="da-speed-val">0.50</span></label>
          </div>
        </div>
      `;
    case "sonic-boom-mach-cone":
      return `
        <div class="scene-label">Sonic Boom &amp; Mach Cone</div>
        <p class="scene-caption">At supersonic speeds, wavefronts pile up into a Mach cone. The half-angle is arcsin(1/M).</p>
        <div class="interactive-scene">
          <canvas id="scene-sonic-boom-mach-cone" width="600" height="300"></canvas>
        </div>
      `;
    case "relativistic-doppler-redshift":
      return `
        <div class="scene-label">Relativistic Doppler</div>
        <p class="scene-caption">For light, the Doppler shift depends only on relative velocity: f&rsquo; = f&radic;((1&minus;&beta;)/(1+&beta;)).</p>
        <div class="interactive-scene">
          <canvas id="scene-relativistic-doppler-redshift" width="600" height="300"></canvas>
        </div>
      `;
    case "doppler-spectroscopy-exoplanet":
      return `
        <div class="scene-label">Exoplanet Doppler Spectroscopy</div>
        <p class="scene-caption">A planet&rsquo;s gravity causes periodic Doppler shifts in its host star&rsquo;s spectral lines, revealing the planet&rsquo;s orbit.</p>
        <div class="interactive-scene">
          <canvas id="scene-doppler-spectroscopy-exoplanet" width="600" height="300"></canvas>
        </div>
      `;

    default:
      return "";
  }
}

function renderScene(chapter) {
  scene.innerHTML = sceneMarkup(chapter.scene);
  setTimeout(initSceneInteractives, 0);
}

function answerQuestion(chapter, rawQuestion) {
  const question = rawQuestion.trim().toLowerCase();

  if (!question) {
    return {
      title: `Ask ${chapter.title}`,
      body: `Try a prompt like "${chapter.prompts[0]}" or click one of the quick actions to switch explanation depth.`
    };
  }

  const matchedTerm = Object.entries(chapter.terms).find(([key]) => {
    const normalized = key.replace(/[_-]/g, " ");
    return question.includes(key) || question.includes(normalized);
  });

  if (matchedTerm) {
    const [key, value] = matchedTerm;
    return {
      title: key.replace(/[_-]/g, " "),
      body: `${value.long} In this chapter, that idea matters because ${chapter.quickActions.intuition.toLowerCase()}`
    };
  }

  if (question.includes("derive") || question.includes("proof") || question.includes("math")) {
    return {
      title: `Math view on ${chapter.title}`,
      body: `${chapter.quickActions.formal} Open the derivation card below to walk the steps in sequence.`
    };
  }

  if (question.includes("confus") || question.includes("mistake") || question.includes("trap")) {
    return {
      title: "Common trap",
      body: `${chapter.pitfalls[0]} Watch how the chapter keeps the microscopic and macroscopic levels conceptually separate.`
    };
  }

  if (question.includes("quiz") || question.includes("check")) {
    return {
      title: "Quick checkpoint",
      body: `${chapter.quickActions.quiz} Follow-up: ${chapter.prompts[1]}`
    };
  }

  return {
    title: `Chapter guide: ${chapter.title}`,
    body: `${chapter.quickActions.intuition} If you want a more formal route, ask about the math, derivation, or a specific glossary term.`
  };
}

function getMathLesson(lessonId) {
  return mathLessons.find((lesson) => lesson.id === lessonId) || null;
}

function renderMathPrereqs(chapter) {
  const prereqs = chapter.mathPrereqs || [];
  if (!prereqs.length) return "";
  return `
    <div class="math-prereq-bar">
      <p class="mini-label">Math Prerequisites</p>
      <div class="math-prereq-pills">
        ${prereqs
          .map((prereqId) => {
            const lesson = getMathLesson(prereqId);
            return lesson
              ? `<button class="math-prereq-pill" data-math-lesson="${prereqId}">${lesson.title}</button>`
              : "";
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderMathLesson(lessonId) {
  const lesson = getMathLesson(lessonId);
  if (!lesson) return;

  const overlay = document.getElementById("math-lesson-overlay");
  overlay.hidden = false;
  overlay.innerHTML = `
    <div class="math-lesson-panel">
      <div class="math-lesson-header">
        <div>
          <p class="mini-label">Math Lesson</p>
          <h3>${lesson.title}</h3>
        </div>
        <button class="math-lesson-close action-button" data-close-math-lesson>Back to lecture</button>
      </div>
      <div class="math-lesson-body">
        ${lesson.sections
          .map(
            (section) => `
            <div class="math-lesson-section">
              <h4>${section.heading}</h4>
              <p>${section.body}</p>
              ${section.interactive ? `<div class="scene math-lesson-interactive" data-interactive="${section.interactive}"><canvas id="scene-${section.interactive}" style="width:100%;height:280px;"></canvas></div>` : ""}
            </div>
          `
          )
          .join("")}
        ${
          lesson.exercises.length
            ? `
            <div class="math-lesson-exercises">
              <p class="mini-label">Exercises</p>
              ${lesson.exercises
                .map(
                  (exercise, index) => `
                  <details class="math-exercise">
                    <summary>
                      <h4>Exercise ${index + 1}</h4>
                      <p>${exercise.question}</p>
                    </summary>
                    <div class="math-exercise-answer">
                      <strong>Answer:</strong>
                      <p>${exercise.answer}</p>
                    </div>
                  </details>
                `
                )
                .join("")}
            </div>
          `
            : ""
        }
      </div>
    </div>
  `;
  setTimeout(renderMath, 0);
  setTimeout(initSceneInteractives, 0);
}

function closeMathLesson() {
  const overlay = document.getElementById("math-lesson-overlay");
  overlay.hidden = true;
  overlay.innerHTML = "";
}

function renderLearnMode(chapter) {
  const learnContainer = document.getElementById("learn-mode-container");
  if (!learnContainer) return;

  const prereqsHtml = renderMathPrereqs(chapter);
  const lectureContent = chapter.lectureContent || [];

  const chapterSceneHtml = chapter.scene
    ? `<div class="chapter-lab panel">
        <div class="lab-header">
          <div>
            <p class="mini-label">Concept Lab</p>
            <h3>${chapter.conceptTitle}</h3>
          </div>
          <p class="lab-caption">${chapter.conceptCaption}</p>
        </div>
        <div class="scene">${sceneMarkup(chapter.scene)}</div>
      </div>`
    : "";

  const tocHtml = lectureContent.length > 1
    ? `
      <details class="lecture-toc">
        <summary class="toc-toggle">Contents</summary>
        <ol>
          ${lectureContent.map((section, index) => `<li><a href="#lecture-section-${index}">${section.heading}</a></li>`).join("")}
        </ol>
      </details>
    `
    : "";

  const sectionsHtml = lectureContent
    .map(
      (section, index) => `
      <div class="lecture-section" id="lecture-section-${index}">
        <h3>${section.heading}</h3>
        <div class="lecture-section-body">${section.body}</div>
        ${
          section.interactive
            ? `<div class="scene lecture-scene" data-interactive="${section.interactive}">${sceneMarkup(section.interactive) || sceneMarkup(chapter.scene)}</div>`
            : ""
        }
        ${
          (section.mathLinks || []).length
            ? `
              <div class="lecture-math-links">
                ${section.mathLinks
                  .map(
                    (linkId) => {
                      const lesson = getMathLesson(linkId);
                      return lesson
                        ? `<button class="inline-math-link" data-math-lesson="${linkId}">Math: ${lesson.title}</button>`
                        : "";
                    }
                  )
                  .join("")}
              </div>
            `
            : ""
        }
      </div>
    `
    )
    .join("");

  const derivationsHtml = chapter.derivations
    .map(
      (derivation, index) => `
      <details class="derivation-card" ${index === 0 ? "open" : ""}>
        <summary>
          <div>
            <h4>${derivation.title}</h4>
            <p class="derivation-meta">${derivation.teaser}</p>
          </div>
          <span>Expand</span>
        </summary>
        <div class="derivation-body">
          <ol>
            ${derivation.steps.map((step) => `<li>${step}</li>`).join("")}
          </ol>
          <div class="derivation-result"><strong>Key result:</strong> ${derivation.result}</div>
        </div>
      </details>
    `
    )
    .join("");

  const summaryHtml = `
    <div class="lecture-summary">
      <p class="mini-label">Chapter Summary</p>
      <p>${chapter.quickActions.intuition}</p>
      <div class="goal-grid">
        <div>
          <p class="mini-label">What you should now know</p>
          <ul class="bullet-list">${chapter.goals.map((goal) => `<li>${goal}</li>`).join("")}</ul>
        </div>
        <div>
          <p class="mini-label">Watch for these mistakes</p>
          <ul class="bullet-list">${chapter.pitfalls.map((pitfall) => `<li>${pitfall}</li>`).join("")}</ul>
        </div>
      </div>
    </div>
  `;

  const problemsHtml = `
    <div class="lecture-problems">
      <p class="mini-label">Problems &amp; Prompts</p>
      ${chapter.prompts.map((prompt) => `<p class="lecture-problem">${prompt}</p>`).join("")}
    </div>
  `;

  learnContainer.innerHTML = `
    <div class="learn-mode-inner">
      <div class="chapter-header">
        <div>
          <p class="chapter-kicker">Chapter ${chapter.number}</p>
          <h3>${chapter.title}</h3>
        </div>
        <a class="pdf-link" href="${chapter.pdf}" target="_blank" rel="noreferrer">Open chapter PDF</a>
      </div>
      ${tocHtml}
      ${prereqsHtml}
      <div class="lecture-sections">
        ${sectionsHtml}
      </div>
      <div class="lecture-derivations">
        <p class="mini-label">Derivations</p>
        ${derivationsHtml}
      </div>
      ${summaryHtml}
      ${problemsHtml}
    </div>
  `;
  setTimeout(initSceneInteractives, 0);
}

function applyModeVisibility() {
  const learnContainer = document.getElementById("learn-mode-container");
  const studyGuideSections = [
    document.getElementById("roadmap-section"),
    document.getElementById("overview-section"),
    document.getElementById("section-guide-section"),
    document.getElementById("mastery-section")
  ];
  const detailGrids = document.querySelectorAll(".detail-grid");
  const derivationPanel = document.getElementById("derivations-section");
  const quizSection = document.getElementById("quiz-section");

  const heroSection = document.querySelector(".hero");

  if (state.mode === "learn") {
    if (learnContainer) learnContainer.hidden = false;
    if (heroSection) heroSection.hidden = true;
    studyGuideSections.forEach((el) => { if (el) el.hidden = true; });
    detailGrids.forEach((el) => { if (el) el.hidden = true; });
    if (derivationPanel) derivationPanel.hidden = true;
    if (quizSection) quizSection.hidden = true;
  } else {
    if (learnContainer) learnContainer.hidden = true;
    if (heroSection) heroSection.hidden = false;
    studyGuideSections.forEach((el) => { if (el) el.hidden = false; });
    detailGrids.forEach((el) => { if (el) el.hidden = false; });
    if (derivationPanel) derivationPanel.hidden = false;
    if (quizSection) quizSection.hidden = false;
  }

  if (state.mode === "math") {
    document.querySelectorAll(".derivation-card").forEach((card) => {
      card.open = true;
    });
  }

  if (state.mode === "exam") {
    const quizEl = document.getElementById("quiz-section");
    const masteryEl = document.getElementById("mastery-section");
    if (quizEl) quizEl.style.borderColor = "rgba(217, 119, 6, 0.3)";
    if (masteryEl) masteryEl.style.borderColor = "rgba(217, 119, 6, 0.3)";
  } else {
    const quizEl = document.getElementById("quiz-section");
    const masteryEl = document.getElementById("mastery-section");
    if (quizEl) quizEl.style.borderColor = "";
    if (masteryEl) masteryEl.style.borderColor = "";
  }
}

function renderChapter() {
  const chapter = chapters[state.chapterIndex];
  const mode = modes.find((item) => item.id === state.mode);

  heroTitle.textContent = mode.hero;
  heroSubtitle.textContent = mode.subtitle;
  chapterKicker.textContent = `Chapter ${chapter.number}`;
  chapterTitle.textContent = chapter.title;
  chapterPdfLink.href = chapter.pdf;
  renderSourceSummary(chapter);
  renderOpening(chapter);
  chapterExplanation.innerHTML = parseExplanation(chapter.explanation);
  renderBullets(chapterGoals, chapter.goals);
  renderBullets(chapterPitfalls, chapter.pitfalls);
  labTitle.textContent = chapter.conceptTitle;
  labCaption.textContent = chapter.conceptCaption;
  renderScene(chapter);
  renderRoadmap(chapter);
  renderSectionGuide(chapter);
  renderQuickActions(chapter);
  renderTerms(chapter);
  renderDerivations(chapter);
  renderQuizzes(chapter);
  renderMastery(chapter);
  renderDeepDives(chapter);
  renderSourceMaterial(chapter);
  chapterFrame.src = `${chapter.pdf}#toolbar=0&navpanes=0&page=1`;
  if (!state.focusTarget) {
    sourcePanel.open = false;
  }
  applyFocusTarget(chapter);

  if (state.mode === "learn") {
    renderLearnMode(chapter);
  }
  applyModeVisibility();

  prevChapter.disabled = state.chapterIndex === 0;
  nextChapter.disabled = state.chapterIndex === chapters.length - 1;
  setTimeout(renderMath, 0);
}

function showTooltip(target, text) {
  const bounds = target.getBoundingClientRect();
  tooltip.textContent = text;
  tooltip.classList.add("visible");
  tooltip.setAttribute("aria-hidden", "false");
  tooltip.style.transform = `translate(${bounds.left + window.scrollX}px, ${bounds.top + window.scrollY - 48}px)`;
}

function hideTooltip() {
  tooltip.classList.remove("visible");
  tooltip.setAttribute("aria-hidden", "true");
  tooltip.style.transform = "translate(-9999px, -9999px)";
}

function attachEvents() {
  modePills.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode]");
    if (!button) return;
    state.mode = button.dataset.mode;
    renderModes();
    renderChapter();
    closeSidebarDrawer();
  });

  chapterNav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-index]");
    if (!button) return;
    navigateToChapter(Number(button.dataset.index));
    closeSidebarDrawer();
  });

  searchQuery.addEventListener("input", () => {
    renderSearchResults();
  });

  searchResults.addEventListener("click", (event) => {
    const button = event.target.closest("[data-search-chapter]");
    if (!button) return;
    const idx = Number(button.dataset.searchChapter);
    state.chapterIndex = idx;
    state.showAllTerms = false;
    state.focusTarget = {
      kind: button.dataset.searchKind,
      title: button.dataset.searchTitle || button.dataset.searchTarget,
      anchor: button.dataset.searchAnchor || ""
    };
    location.hash = chapters[idx].slug;
    renderNav();
    renderChapter();
    closeSidebarDrawer();
  });

  document.body.addEventListener("click", (event) => {
    const jumpButton = event.target.closest("[data-jump-target]");
    if (jumpButton) {
      const target = document.getElementById(jumpButton.dataset.jumpTarget);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    const term = event.target.closest("[data-term]");
    if (term) {
      state.activeTerm = term.dataset.term;
      renderTerms(chapters[state.chapterIndex]);
    }

    const answerButton = event.target.closest("[data-answer]");
    if (answerButton) {
      const chapter = chapters[state.chapterIndex];
      const answerKey = answerButton.dataset.answer;
      assistantAnswer.innerHTML = `
        <h4>${answerButton.textContent.trim()} view</h4>
        <p>${chapter.quickActions[answerKey]}</p>
        <p><strong>Prompt:</strong> ${chapter.prompts[0]}</p>
      `;
      document.querySelectorAll(".quick-action").forEach((node) => node.classList.remove("active"));
      answerButton.classList.add("active");
    }

    const sourceAnchorButton = event.target.closest("[data-source-anchor]");
    if (sourceAnchorButton) {
      const chapter = chapters[state.chapterIndex];
      state.focusTarget = {
        kind: sourceAnchorButton.dataset.sourceKind || "section",
        title: sourceAnchorButton.dataset.sourceTitle || "",
        anchor: sourceAnchorButton.dataset.sourceAnchor || ""
      };
      renderDerivations(chapter);
      renderSourceMaterial(chapter);
      if (state.focusTarget.kind === "section") {
        sourcePanel.open = true;
      }
      applyFocusTarget(chapter);
    }
  });

  document.body.addEventListener("mouseover", (event) => {
    const term = event.target.closest("[data-term]");
    if (!term) return;
    const chapter = chapters[state.chapterIndex];
    const info = chapter.terms[term.dataset.term];
    if (!info) return;
    showTooltip(term, info.short);
  });

  document.body.addEventListener("mouseout", (event) => {
    if (event.target.closest("[data-term]")) {
      hideTooltip();
    }
  });

  askButton.addEventListener("click", () => {
    const chapter = chapters[state.chapterIndex];
    const answer = answerQuestion(chapter, studyQuestion.value);
    assistantAnswer.innerHTML = `<h4>${answer.title}</h4><p>${answer.body}</p>`;
  });

  studyQuestion.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      askButton.click();
    }
  });

  prevChapter.addEventListener("click", () => {
    if (state.chapterIndex === 0) return;
    navigateToChapter(state.chapterIndex - 1);
    closeSidebarDrawer();
  });

  nextChapter.addEventListener("click", () => {
    if (state.chapterIndex === chapters.length - 1) return;
    navigateToChapter(state.chapterIndex + 1);
    closeSidebarDrawer();
  });

  masteryChecklist.addEventListener("change", (event) => {
    const input = event.target.closest("[data-mastery-index]");
    if (!input) return;
    const chapter = chapters[state.chapterIndex];
    const completed = masteryState[chapter.slug] || [];
    completed[Number(input.dataset.masteryIndex)] = input.checked;
    masteryState[chapter.slug] = completed;
    saveMasteryState();
    renderNav();
    renderMastery(chapter);
  });

  termToggle.addEventListener("click", () => {
    state.showAllTerms = !state.showAllTerms;
    renderTerms(chapters[state.chapterIndex]);
  });

  sidebarToggle.addEventListener("click", () => {
    toggleSidebarDrawer();
  });

  sidebarClose.addEventListener("click", () => {
    closeSidebarDrawer();
  });

  sidebarOverlay.addEventListener("click", () => {
    closeSidebarDrawer();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const overlay = document.getElementById("math-lesson-overlay");
      if (overlay && !overlay.hidden) {
        closeMathLesson();
        return;
      }
      closeSidebarDrawer();
    }
  });

  document.body.addEventListener("click", (event) => {
    const mathLessonButton = event.target.closest("[data-math-lesson]");
    if (mathLessonButton) {
      renderMathLesson(mathLessonButton.dataset.mathLesson);
      return;
    }
    const inlineMathLink = event.target.closest("[data-math]");
    if (inlineMathLink) {
      renderMathLesson(inlineMathLink.dataset.math);
      return;
    }
    const closeMathButton = event.target.closest("[data-close-math-lesson]");
    if (closeMathButton) {
      closeMathLesson();
      return;
    }
  });

  mobileMedia.addEventListener("change", () => {
    syncSidebarDrawer();
  });

  window.addEventListener("hashchange", () => {
    const idx = chapterIndexFromHash();
    if (idx !== state.chapterIndex) {
      state.chapterIndex = idx;
      state.focusTarget = null;
      state.showAllTerms = false;
      renderNav();
      renderChapter();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

// Load lecture content from external files into chapter objects
(function loadLectureContent() {
  const sources = [
    window.LECTURE_CONTENT_1_3 || {},
    window.LECTURE_CONTENT_4_7 || {},
    window.LECTURE_CONTENT_8_11 || {},
    window.LECTURE_CONTENT_12_16 || {},
    window.LECTURE_CONTENT_17_21 || {}
  ];
  sources.forEach((source) => {
    Object.keys(source).forEach((num) => {
      const idx = Number(num) - 1;
      if (chapters[idx]) {
        chapters[idx].lectureContent = source[num];
      }
    });
  });
})();

function renderMath() {
  if (typeof renderMathInElement === "function") {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false
    });
  }
}

syncSidebarDrawer();
renderModes();
renderNav();
renderChapter();
renderMath();
attachEvents();
if (!location.hash) {
  history.replaceState(null, "", "#" + chapters[state.chapterIndex].slug);
}
