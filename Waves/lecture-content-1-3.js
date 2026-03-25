window.LECTURE_CONTENT_1_3 = {
  "1": [
    {
      heading: "Introduction",
      body: `<p>The simplest thing that can happen in the physical universe is nothing. The next simplest thing, which doesn't get too far away from nothing, is an <strong>oscillation</strong> about nothing. This course studies those oscillations. When many oscillators are put together, you get <strong>waves</strong>.</p>

<p>Almost all physical processes can be explained by breaking them down into simple building blocks and putting those blocks together. Oscillators are the building blocks of a tremendous diversity of physical phenomena and technologies, including musical instruments, antennas, patriot missiles, x-ray crystallography, holography, quantum mechanics, 3D movies, cell phones, atomic clocks, ocean waves, gravitational waves, sonar, rainbows, color perception, prisms, soap films, sunglasses, information theory, solar sails, molecular spectroscopy, acoustics, and lots more.</p>

<p>The key mathematical technique to be mastered through this course is the <strong>Fourier transform</strong>. Fourier transforms, and <strong>Fourier series</strong>, play an absolutely crucial role in almost all areas of modern physics.</p>

<p>The first couple of weeks build on what you've already covered -- balls and springs and simple oscillators. These are described by the differential equation for the <strong>damped, driven oscillator</strong>:</p>

<p style="text-align:center;"><strong>$$\\frac{d^2 x(t)}{dt^2} + \\gamma \\frac{dx(t)}{dt} + \\omega_0^2 x(t) = \\frac{F(t)}{m}$$</strong></p>

<p>Here $x(t)$ is the displacement from equilibrium, $\\omega_0$ is the natural angular frequency, $\\gamma$ is a damping coefficient, and $F(t)$ is a driving force. We'll start with $\\gamma = 0$ and $F = 0$ (simple harmonic oscillator), then add $\\gamma$ (damped harmonic oscillator), then add $F(t)$ (driven oscillator in Lecture 2). Studying multiple coupled oscillators will lead to the concept of <strong>normal modes</strong>, which lead naturally to the <strong>wave equation</strong>, the Fourier series, and the Fourier transform.</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: []
    },
    {
      heading: "Why Waves? Why Oscillators?",
      body: `<p>Recall <strong>Hooke's law</strong>: if you displace a spring a distance $x$ from its equilibrium position, the restoring force will be $F = -kx$ for some constant $k$. You probably had this law told to you in high school or introductory physics. Maybe it's an empirical fact, deduced from measuring springs, maybe it was just stated as true. Why is it true? Why does Hooke's law hold?</p>

<p>To derive Hooke's law, you might imagine you need a microscopic description of a spring -- what is it made out of, how does it bend, how are the atoms arranged, and so on. Indeed, if you hope to <em>compute</em> $k$, yes, absolutely, you need all of this. In fact you need so much detail that generally it's impossible to compute $k$ in any real spring. But also generally, we don't care to compute $k$, we just measure it. That's not the point. We don't want to compute $k$. What we want to know is why the force is <em>proportional</em> to displacement. Why is Hooke's law true?</p>

<p>First of all, it <em>is</em> true. Hooke's law applies not just to springs, but to just about everything: bending trees, swings, balls, tires -- the restoring force for pretty much anything is linear close to equilibrium. You can move any of these systems a little bit away from equilibrium and it will want to come back. The more you move it, the stronger the restoring force. And often to an excellent approximation, the distance and force are directly proportional.</p>

<details class="derivation-card"><summary>Derive: Hooke's Law from Taylor Expansion</summary><div class="derivation-body">
<p>To derive Hooke's law, we just need a little bit of calculus. Let's say we displace some system -- a spring or a tire or whatever -- a distance $x$ from its equilibrium and measure the function $F(x)$. We define $x = 0$ as the equilibrium point, so by definition, $F(0) = 0$. Then, we can use Taylor's theorem: <span class="inline-math-link" data-math="taylor-series">Taylor Series &rarr;</span></p>

<p style="text-align:center;">$$F(x) = F(0) + x F'(0) + \\frac{1}{2} x^2 F''(0) + \\cdots$$</p>

<p>Now $F(0) = 0$ and $F'(0)$, $F''(0)$, etc. are just fixed numbers. So no matter what these numbers are, we can always find an $x$ small enough so that $F'(0) \\gg \\frac{1}{2} x F''(0)$. Then we can neglect the $\\frac{1}{2} x^2 F''(0)$ term compared to the $x F'(0)$ term. Similarly, we can always take $x$ small enough that all the higher derivative terms are as small as we want. And therefore:</p>

<p style="text-align:center;"><strong>$$F(x) = -kx$$</strong></p>

<p>with $k = -F'(0)$. We have just derived Hooke's law! Close enough to equilibrium, the restoring force for <em>anything</em> will be proportional to the displacement.</p>
</div></details>

<p>Since $F = -kx$ is the equation for a line, we say systems obeying Hooke's law are <strong>linear</strong>. Thus, everything is linear close to equilibrium.</p>

<p>You might also ask, why does $F$ depend only on $x$? Well, what else could it depend on? It could, for example, depend on velocity. Wind resistance is an example of a velocity-dependent force. However, since we are assuming the object is close to equilibrium, its speed must be small (or else our assumption would quickly be violated). So we can Taylor expand in the velocity as well: <span class="inline-math-link" data-math="taylor-series">Taylor Series &rarr;</span></p>

<p style="text-align:center;">$$F(x, \\dot{x}) = x \\cdot \\left.\\frac{\\partial F}{\\partial x}\\right|_0 + \\dot{x} \\cdot \\left.\\frac{\\partial F}{\\partial \\dot{x}}\\right|_0 + \\cdots$$</p>

<p>Writing the velocity-dependent coefficient as $-m\\gamma$, we get $F(x, \\dot{x}) = -kx - m\\gamma\\dot{x}$. Then $F = ma$ gives us:</p>

<p style="text-align:center;"><strong>$$\\frac{d^2 x}{dt^2} + \\gamma \\frac{dx}{dt} + \\omega_0^2 x = 0$$</strong></p>

<p>with $\\omega_0 = \\sqrt{k/m}$. The coefficient $\\gamma$ is called a <strong>damping coefficient</strong>, since the velocity dependence tends to slow the system down. The other piece, $F(t)$, is the <strong>driving force</strong> -- it represents the action of something external to the system, like a person pushing a swing or a car tire being compressed by the car.</p>`,
      interactive: "shm-spring",
      interactiveCaption: "A mass on a spring displaced from equilibrium. The restoring force is proportional to displacement for small oscillations.",
      mathLinks: ["taylor-series"]
    },
    {
      heading: "Simple Harmonic Motion",
      body: `<p>We have seen that the oscillator equation describes universally any system close to equilibrium. Now let's solve it. First, take $\\gamma = 0$. Then the equation becomes:</p>

<p style="text-align:center;"><strong>$$\\frac{d^2 x(t)}{dt^2} + \\omega_0^2 x(t) = 0$$</strong></p>

<p>For a spring, $\\omega_0 = \\sqrt{k/m}$; for a pendulum, $\\omega_0 = \\sqrt{g/L}$. Other systems have different expressions for $\\omega_0$ in terms of the relevant physical parameters.</p>

<p>We can solve this equation by hand, by plugging into Mathematica, or just by guessing. Guessing is often the easiest. So, we want to guess a function whose second derivative is proportional to itself. You know at least two functions with this property: sine and cosine. So let us write as an <em>ansatz</em> (ansatz is a sciency word for "educated guess"):</p>

<p style="text-align:center;">$$x(t) = A \\sin(\\omega t) + B \\cos(\\omega t)$$</p>

<details class="derivation-card"><summary>Derive: Solving the SHM Equation</summary><div class="derivation-body">
<p>This solution has 3 free parameters: $A$, $B$, and $\\omega$. Plugging into the equation gives:</p>

<p style="text-align:center;">$$-\\omega^2[A \\sin(\\omega t) + B \\cos(\\omega t)] + \\omega_0^2[A \\sin(\\omega t) + B \\cos(\\omega t)] = 0$$</p>

<p>Thus $\\omega = \\omega_0$. That is, the angular frequency $\\omega$ of the solution must be the parameter $\\omega_0 = \\sqrt{k/m}$ in the differential equation. We get no constraint on $A$ and $B$.</p>
</div></details>

<p>$\\omega$ is called the <strong>angular frequency</strong>. It has units of radians per second. The <strong>frequency</strong> is $\\nu = \\omega/(2\\pi)$, with units of 1/sec. The solution $x(t)$ goes back to itself after $t \\to t + T$ where $T = 1/\\nu = 2\\pi/\\omega$ is the <strong>period</strong>. $T$ has units of seconds. In other words, the solutions <em>oscillate</em>!</p>

<p>$A$ and $B$ are the <strong>amplitudes</strong> of the oscillation. They can be fixed by <strong>boundary conditions</strong>. For example, you specify the position and velocity at any given time, you can determine $A$ and $B$. To be concrete, suppose we start with $x(0) = 1$ m and $x'(0) = 2$ m/s. Then $x(0) = B = 1$ m and $x'(0) = \\omega A = 2$ m/s, so $A = 2/\\omega$ m/s and $B = 1$ m.</p>

<p>Keep in mind that the angular frequency $\\omega$ is <em>not</em> fixed by boundary conditions. It is determined by the physical problem: $\\omega = \\sqrt{k/m}$ where $k = -F'(0)$ and $m$ is the mass. That is why if you start a pendulum from any height and give it any sort of initial kick, it will oscillate with the same frequency.</p>

<p>Another representation of the general solution is often convenient. Instead of using $A$ and $B$ we can write:</p>

<p style="text-align:center;"><strong>$$x(t) = C \\sin(\\omega t + \\phi)$$</strong></p>

<p>Using trig identities, $C \\sin(\\omega t + \\phi) = C \\cos(\\phi) \\sin(\\omega t) + C \\sin(\\phi) \\cos(\\omega t)$, so $A = C \\cos(\\phi)$ and $B = C \\sin(\\phi)$. Thus we can swap the amplitudes $A$ and $B$ for the sine and cosine components for a single amplitude $C$ and a phase $\\phi$. <span class="inline-math-link" data-math="trig-identities">Trig Identities &rarr;</span></p>`,
      interactive: "shm-oscillator",
      interactiveCaption: "Simple harmonic motion showing how amplitude and phase are determined by initial conditions, while frequency depends only on the system parameters.",
      mathLinks: ["trig-identities", "differential-equations"]
    },
    {
      heading: "Damped Oscillators",
      body: `<p>A <strong>damped oscillator</strong> dissipates its energy, returning eventually to the equilibrium $x(t) = \\text{const}$ solution. When the object is at rest, the damping force must vanish. For small velocities, the damping force should be proportional to velocity: $F = -\\gamma \\, dx/dt$ with $\\gamma$ some constant. Contributions proportional to higher powers of velocity will be suppressed when the object is moving slowly. Thus the generic form for damped motion close to equilibrium is:</p>

<p style="text-align:center;"><strong>$$\\frac{d^2 x}{dt^2} + \\gamma \\frac{dx}{dt} + \\omega_0^2 x = 0$$</strong></p>

<p>This equation describes a great many physical systems: vibrating strings, sound waves, and basically everything we study in this course will have damping.</p>

<p>Neither $\\sin(\\omega t)$ nor $\\cos(\\omega t)$ solve the damped oscillator equation. Sines and cosines are proportional to their <em>second</em> derivatives, but here we also have a first derivative. Since $(d/dt) \\sin(\\omega t) \\propto \\cos(\\omega t)$ and vice versa, neither sines nor cosines alone will solve this equation. However, the exponential function is proportional to its <em>first</em> derivative. Thus exponentials are a natural guess, and indeed they will work.</p>

<details class="derivation-card"><summary>Derive: Solving the Damped Oscillator Equation</summary><div class="derivation-body">
<p>Let's try plugging $x(t) = Ce^{\\alpha t}$ into the equation. We find:</p>

<p style="text-align:center;">$$\\alpha^2 Ce^{\\alpha t} + \\gamma \\alpha Ce^{\\alpha t} + \\omega_0^2 Ce^{\\alpha t} = 0$$</p>

<p>Dividing out by $Ce^{\\alpha t}$ we have reduced this to an algebraic equation: <span class="inline-math-link" data-math="quadratic-formula">Quadratic Formula &rarr;</span></p>

<p style="text-align:center;">$$\\alpha^2 + \\gamma \\alpha + \\omega_0^2 = 0$$</p>

<p>The solutions are:</p>

<p style="text-align:center;"><strong>$$\\alpha = -\\frac{\\gamma}{2} \\pm \\sqrt{\\left(\\frac{\\gamma}{2}\\right)^2 - \\omega_0^2}$$</strong></p>

<p>The general solution is therefore:</p>

<p style="text-align:center;">$$x(t) = e^{-(\\gamma/2)t} \\left(C_1 e^{t\\sqrt{(\\gamma/2)^2 - \\omega_0^2}} + C_2 e^{-t\\sqrt{(\\gamma/2)^2 - \\omega_0^2}}\\right)$$</p>

<p>The cases when $\\gamma > 2\\omega_0$, $\\gamma = 2\\omega_0$, and $\\gamma < 2\\omega_0$ give very different physical behavior.</p>
</div></details>

<p>The three damping regimes -- <strong>underdamping</strong>, <strong>critical damping</strong>, and <strong>overdamping</strong> -- are determined by the relative size of $\\gamma$ and $2\\omega_0$. This classification is at the heart of understanding how dissipation affects oscillatory systems.</p>`,
      interactive: "damped-oscillator",
      interactiveCaption: "Compare underdamped, critically damped, and overdamped motion by adjusting the damping coefficient.",
      mathLinks: ["quadratic-formula", "complex-numbers"]
    },
    {
      heading: "Underdamping, Overdamping, and Critical Damping",
      body: `<p><strong>Underdamping ($\\gamma < 2\\omega_0$):</strong> This case includes $\\gamma = 0$. For $\\gamma = 0$ the damping vanishes and we should regain the oscillator solution. Increasing $\\gamma$ from zero should slowly damp the oscillator. Since $\\gamma < 2\\omega_0$, the quantity $\\omega_u = \\sqrt{\\omega_0^2 - (\\gamma/2)^2}$ is a real number. The general solution becomes:</p>

<p style="text-align:center;"><strong>$$x(t) = A e^{-(\\gamma/2)t} \\cos(\\omega_u t + \\phi)$$</strong></p>

<p>Thus in the underdamped case, the object still oscillates, but at an angular frequency $\\omega_u = \\sqrt{\\omega_0^2 - (\\gamma/2)^2}$ and the amplitude slowly goes down over time. <span class="inline-math-link" data-math="complex-numbers">Complex Numbers &rarr;</span></p>

<p>Both $\\omega_0$ and $\\gamma$ have dimensions of 1/seconds. Their relative size determines how much the amplitude gets damped in a single oscillation. To quantify this, we define the <strong>Q-factor</strong> (or <strong>Q-value</strong>) as:</p>

<p style="text-align:center;"><strong>$$Q = \\frac{\\omega_0}{\\gamma}$$</strong></p>

<p>The smaller the $Q$, the more the damping. $Q$ stands for "quality." The higher $Q$ is, the higher quality, and the less resistance/friction/damping is involved. For example, a tuning fork vibrates for a long time -- it is a very high quality resonator with $Q \\sim 1000$. An atomic clock has $Q \\approx 10^{11}$, while silly putty has $Q \\sim 0.01$.</p>

<p>$Q$ is roughly the number of complete oscillations a system has gone through before its amplitude goes down by a factor of around 20.</p>

<details class="derivation-card"><summary>Derive: The 1/20 Rule for Q</summary><div class="derivation-body">
<p>Due to the $\\cos(\\omega_u t)$ factor, it takes a time $t_Q = (2\\pi/\\omega_u) \\cdot Q$ to go through $Q$ complete cycles. Due to the $e^{-(\\gamma/2)t}$ envelope, the amplitude has decayed by a factor of:</p>

<p style="text-align:center;">$$\\exp\\!\\left(-\\frac{\\gamma}{2}\\,t_Q\\right) = \\exp\\!\\left(-\\frac{\\gamma}{2} \\cdot Q \\cdot \\frac{2\\pi}{\\omega_u}\\right) = \\exp\\!\\left(-\\frac{\\omega_0}{\\omega_u}\\,\\pi\\right) \\approx e^{-\\pi} = 0.043$$</p>

<p>In the last step, we used that $\\omega_u \\approx \\omega_0$ when $Q \\gg 1$. (If $Q$ is not large, then the system is highly damped and counting oscillations is not so useful.) Since $0.043 \\approx 1/23$, we get the "<strong>1/20 rule</strong>": after $Q$ oscillations, the amplitude has dropped to roughly $1/20$ of its initial value.</p>
</div></details>

<p><strong>Overdamping ($\\gamma > 2\\omega_0$):</strong> In the overdamped case, $(\\gamma/2)^2 - \\omega_0^2$ is positive, so the roots are real. The general solution is simply $x(t) = C_1 e^{-u_1 t} + C_2 e^{-u_2 t}$, where $u_1$ and $u_2$ are both positive real numbers. Both solutions have exponential decay -- no oscillation at all. Since $u_1 > u_2$, the $u_1$ solution dies away first. Overdamped systems have $Q < 1/2$.</p>

<p><strong>Critical damping ($\\gamma = 2\\omega_0$):</strong> In the critically damped case, the two solutions reduce to one: $x(t) = Ce^{-\\omega_0 t}$. But a second-order differential equation should have two independent solutions! To find the other, set $\\gamma = 2\\omega_0$ from the start. The general solution is:</p>

<p style="text-align:center;"><strong>$$x(t) = (C + Bt) e^{-\\omega_0 t}$$</strong></p>

<p>One thing to note is that the critically damped curve goes to zero <em>faster</em> than the overdamped curve! Can you think of an application for which you'd want a critically damped oscillator? (Think: car shock absorbers, or a door closer that returns to the closed position as quickly as possible without bouncing.)</p>`,
      interactive: "damping-regimes",
      interactiveCaption: "Comparison of underdamping, overdamping, and critical damping. The critically damped solution returns to equilibrium fastest without oscillating.",
      mathLinks: ["complex-numbers"]
    },
    {
      heading: "Linearity",
      body: `<p>The oscillator equation we have been solving has a very important property: <strong>linearity</strong>. Differential equations with at most single powers of $x$ are <strong>linear differential equations</strong>. For example, $d^2x/dt^2 + \\omega^2 x = 0$ is linear. If there is no constant ($x^0$ term), the differential equations are <strong>homogeneous</strong>.</p>

<p>Linearity is important because it implies that if $x_1(t)$ and $x_2(t)$ are solutions to the equations of motion for a homogeneous linear system, then $x(t) = x_1(t) + x_2(t)$ is also a solution. You can verify this by simply adding the two equations -- since both satisfy the differential equation, their sum does too. So, <em>solutions to homogeneous linear differential equations add</em>.</p>

<p>Examples of linear systems abound. The damped oscillator is a linear system. The <strong>wave equation</strong> for a vibrating string with tension $T$ and mass density $\\mu$ is linear: $\\mu \\, \\partial^2 y/\\partial t^2 - T \\, \\partial^2 y/\\partial x^2 = 0$. Electromagnetic waves, described by Maxwell's equations, satisfy a wave equation for the electric field: $c^2 \\, \\partial^2 E/\\partial t^2 - \\partial^2 E/\\partial x^2 = 0$. Sound waves, water waves, and many other physical phenomena all satisfy linear differential equations.</p>

<p><strong>Forced oscillation:</strong> What happens if the equation is not homogeneous? Suppose we have $d^2x/dt^2 = F_1(t)$. Here $F(t)$ represents some force from a motor or the wind or someone pushing you on a swing. Say this is your motion on a swing when you are being pushed. Now say some friend comes and pushes you too: $d^2x/dt^2 = F_1(t) + F_2(t)$. The amazing thing about linearity is that if we can find separate solutions $x_1(t)$ and $x_2(t)$ for each force individually, then $x = x_1 + x_2$ satisfies the equation with the combined force. This is <em>extremely important</em>. It is the key to this whole course. Really complicated systems are solvable by simpler systems, as long as the equations are linear.</p>

<p>In contrast, we <em>cannot</em> add solutions to nonlinear equations. If we had something like $a \\, (d^2/dt^2)x + b \\, (d/dt)x^2 = F_1(t) + F_2(t)$, the $x^2$ term couples the solutions together, so there is interference.</p>

<p>An important example is electromagnetism -- Maxwell's equations are linear. Suppose you are making radio waves at frequency $\\nu = 89.9$ MHz and someone else is broadcasting at $\\nu = 90.3$ MHz. Because electromagnetism is linear, the waves don't interfere with each other. That explains why we can tune our radio -- the different frequencies don't mix. All we have to do is get our radio to extract the coefficient of the oscillation at our desired frequency. As we will see, you can always find out which frequencies are present with which amplitudes using <strong>Fourier decomposition</strong>.</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: ["differential-equations"]
    },
    {
      heading: "Linearity and Universality",
      body: `<p>Linearity is a really important concept in physics. The definition of linearity is that all terms in a differential equation for $x(t)$ have at most one power of $x(t)$. So $(d^3/dt^3)x(t) = 0$ is linear, but $(d/dt)x(t)^2$ is nonlinear.</p>

<p>For linear systems, one can add different solutions and still get a solution. This lets us break the problem down to easier subproblems.</p>

<p>Linearity does not only let us solve problems simply, but it is also a <strong>universal feature of physical systems</strong>. Whenever you are close to a static solution $x(t) = x_0 = \\text{constant}$, the equations for deviations around this solution will be linear. To see that, we again use Taylor's theorem. <span class="inline-math-link" data-math="taylor-series">Taylor Series &rarr;</span> We shift by $x(t) \\to x(t) - x_0$ so the equilibrium point is now $x(t) = 0$. Then no matter how complicated and nonlinear the exact equations of motion for the system are, when $x - x_0 \\ll 1$, the linear term, proportional to $x - x_0$, will dominate.</p>

<p>For example, if we had some horrible nonlinear equation like $(d^2/dt^2) \\, x/(x^2 - 2) \\cdot e^{-x^4} + (d/dt)x^7 + (x^2 - 4)\\sin^3(x) = 0$, then $x(t) = 0$ is a solution. For $x \\ll 1$ this simplifies to $-(1/2) \\, d^2x/dt^2 - 4x = 0$, which is again linear -- it's the oscillator equation again.</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: ["taylor-series"]
    },
    {
      heading: "Solving General Linear Systems",
      body: `<p>At this point, we've defined linearity, argued that it should be universal for small deviations from equilibrium, and showed how it can help us combine solutions to a differential equation. Now we will see how to solve general linear differential equations.</p>

<p>A general linear equation has a bunch of derivatives with respect to time acting on a single function $x$: $\\cdots + a_3(d^3/dt^3)x + a_2(d^2/dt^2)x + a_1(d/dt)x + a_0 x = F(t)$. A really easy way to solve these equations (for $F = 0$) is to consider solutions for which all the derivatives are proportional to each other. Sines and cosines have derivatives proportional to themselves, but only for <em>second</em> (or even numbers of) derivatives. A function with <em>all</em> of its derivatives proportional to itself is the exponential: $x(t) = Ce^{\\alpha t}$.</p>

<details class="derivation-card"><summary>Derive: Exponential Solutions to the Oscillator Equation</summary><div class="derivation-body">
<p>Plugging $x(t) = Ce^{\\alpha t}$ into $d^2x/dt^2 = -\\omega^2 x$ gives $\\alpha^2 e^{\\alpha t} = -\\omega^2 e^{\\alpha t}$, which implies $\\alpha^2 = -\\omega^2$, or $\\alpha = \\pm i\\omega$. Thus the solutions are:</p>

<p style="text-align:center;">$$x(t) = C_1 e^{i\\omega t} + C_2 e^{-i\\omega t}$$</p>

<p>Recalling that $\\sin(\\omega t) = (e^{i\\omega t} - e^{-i\\omega t})/(2i)$ and $\\cos(\\omega t) = (e^{i\\omega t} + e^{-i\\omega t})/2$, we can also write $x(t) = i(C_1 - C_2)\\sin(\\omega t) + (C_1 + C_2)\\cos(\\omega t)$.</p>
</div></details>

<p>In summary: sines and cosines are useful if you have only 2nd derivatives; exponentials work for any number of derivatives.</p>

<p>Now, if $F \\neq 0$, then a simple exponential will not obviously be a solution. The key, however, is that we can always write any function $F(t)$ on an interval as a sum of exponentials: $F(t) = \\sum a_n e^{2\\pi i n t/T}$. This is called a <strong>Fourier decomposition</strong>. Since we can solve the equation for each exponential term separately, we can then add solutions using linearity to find a solution with the original $F(t)$.</p>

<p>We can also derive the relationship between exponentials and trig functions directly from the oscillator equation itself. Since $x(t) = A \\sin(\\omega t) + B \\cos(\\omega t)$ and $x(t) = C_1 e^{i\\omega t} + C_2 e^{-i\\omega t}$ are both general solutions to the same second-order equation, they must be equivalent. Matching boundary conditions $x(0) = 0$, $x'(0) = \\omega$ for the sine function leads to $C_1 = -1/(2i)$ and $C_2 = 1/(2i)$, giving us: <span class="inline-math-link" data-math="complex-numbers">Complex Numbers &rarr;</span></p>

<p style="text-align:center;"><strong>$$\\sin(\\omega t) = \\frac{e^{i\\omega t} - e^{-i\\omega t}}{2i}$$</strong></p>
<p style="text-align:center;"><strong>$$\\cos(\\omega t) = \\frac{e^{i\\omega t} + e^{-i\\omega t}}{2}$$</strong></p>

<p>You should have these relationships memorized -- we will use them a lot.</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: ["complex-numbers", "differential-equations"]
    },
    {
      heading: "Problems",
      body: `<p><strong>Problem 1 (Conceptual):</strong> Explain in your own words why Hooke's law is universal for small displacements. What mathematical tool makes this argument work?</p>

<p><strong>Problem 2 (Conceptual):</strong> A pendulum clock is taken to the top of a mountain where $g$ is slightly smaller. Does the clock run fast or slow? Explain using the expression for $\\omega_0$.</p>

<p><strong>Problem 3 (Computational):</strong> A mass $m = 0.5$ kg on a spring with $k = 200$ N/m is displaced 3 cm from equilibrium and released from rest. Find: (a) the angular frequency $\\omega_0$, (b) the period $T$, (c) the maximum velocity, and (d) $x(t)$ as a function of time.</p>

<p><strong>Problem 4 (Computational):</strong> A damped oscillator has $\\omega_0 = 10$ rad/s and $\\gamma = 2$ s$^{-1}$. (a) What is the Q-factor? (b) What is the frequency of oscillation $\\omega_u$? (c) How many oscillations occur before the amplitude drops to 1/20 of its initial value?</p>

<p><strong>Problem 5 (Conceptual):</strong> Why does a critically damped system return to equilibrium faster than an overdamped system, even though the overdamped system has more damping? Give a physical explanation and consider where a critically damped oscillator might be useful in engineering.</p>

<p><strong>Problem 6 (Computational):</strong> Show that if $x(t) = (C + Bt)e^{-\\omega_0 t}$, then $x(t)$ satisfies $d^2x/dt^2 + 2\\omega_0 \\, dx/dt + \\omega_0^2 x = 0$. (This verifies the critically damped solution.)</p>

<p><strong>Problem 7 (Conceptual):</strong> Explain why linearity is essential for radio communication. What would happen if Maxwell's equations were nonlinear? Could you still tune a radio to a single station?</p>

<p><strong>Problem 8 (Computational):</strong> Consider the nonlinear equation $d^2x/dt^2 + \\sin(x) = 0$ (a pendulum with no small-angle approximation). Expand $\\sin(x)$ to third order in $x$. For what values of $x$ (in degrees) does the linear approximation $\\sin(x) \\approx x$ differ from the true value by less than 1%?</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: []
    }
  ],

  "2": [
    {
      heading: "Introduction",
      body: `<p>We started last time to analyze the equation describing the motion of a <strong>damped-driven oscillator</strong>:</p>

<p style="text-align:center;"><strong>$$\\frac{d^2 x}{dt^2} + \\gamma \\frac{dx}{dt} + \\omega_0^2 x = F(t)$$</strong></p>

<p>For small damping $\\gamma \\ll \\omega_0$, we found solutions for $F(t) = 0$ of the form $x(t) = Ae^{-(\\gamma/2)t} \\cos(\\omega_0 t + \\phi)$, where the amplitude $A$ and phase $\\phi$ are determined by initial conditions. Now we will see how to deal with $F(t)$.</p>

<p>We found the damped solution by guessing that an exponential $x(t) = Ae^{\\alpha t}$ should work, since its derivatives are all proportional to itself. Plugging this ansatz in with $F(t)$ we find $Ae^{\\alpha t}(\\alpha^2 + \\gamma\\alpha + \\omega_0^2) = F(t)$. This will clearly not be solved for constant $\\alpha$ unless $F(t)$ happens to be of the form $e^{\\alpha t}$. The trick to solving this equation is to use <strong>linearity</strong>.</p>

<p>Let us suppose that we can write $F(t) = \\sum_j c_j \\cos(\\omega_j t)$. It may seem that only a handful of functions can be written this way, but actually <em>any periodic function</em> can be written as a sum of sines and cosines: $F(t) = \\sum_j [a_j \\sin(\\omega_j t) + b_j \\cos(\\omega_j t)]$. This truly remarkable fact is known as <strong>Fourier's theorem</strong>, and we will study it soon.</p>

<p>Once $F(t)$ is written as a sum of cosines, we can solve the differential equation for each cosine separately then add them. By linearity we then get a solution to the original equation. That is, if we can find functions $x_j(t)$ satisfying $d^2 x_j/dt^2 + \\gamma \\, dx_j/dt + \\omega_0^2 x_j = \\cos(\\omega_j t)$, then $x(t) = \\sum c_j x_j(t)$ satisfies the original equation. In summary, if we can solve the equation with a $\\cos(\\omega_d t)$ driving force, we can solve the equation for <em>any</em> driving force.</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: ["fourier-series"]
    },
    {
      heading: "Solving the Driven Oscillator",
      body: `<p>Our first task is to solve:</p>

<p style="text-align:center;"><strong>$$\\frac{d^2 x}{dt^2} + \\gamma \\frac{dx}{dt} + \\omega_0^2 x = \\frac{F_0}{m} \\cos(\\omega_d t)$$</strong></p>

<p>Here we have made the normalization more physical by adding $F_0$, for the strength of force with units of force, and dividing by the oscillator mass $m$ to get an acceleration. What's a good guess for a solution? Trying $x(t) = \\cos(\\omega_d t)$ or $x(t) = \\sin(\\omega_d t)$ will not work since there are first <em>and</em> second derivatives in the equation. We need exponentials.</p>

<p>The key to turning the problem from cosines into exponentials is to recall that $e^{-i\\omega t} = \\cos(\\omega t) - i\\sin(\\omega t)$, so that $\\cos(\\omega_d t) = \\text{Re}(e^{-i\\omega_d t})$. <span class="inline-math-link" data-math="complex-numbers">Complex Numbers &rarr;</span></p>

<p>Now suppose we find a solution to the complexified equation: $d^2z/dt^2 + \\gamma \\, dz/dt + \\omega_0^2 z = (F_0/m) e^{-i\\omega_d t}$. Then we define $x(t) = \\text{Re}[z(t)]$. Taking the real part of the complex equation gives us exactly the original equation with cosine driving. So we have reduced the problem to using an exponential driving force instead of a cosine driving force.</p>

<details class="derivation-card"><summary>Derive: The Driven Oscillator Solution</summary><div class="derivation-body">
<p>Plugging in $z(t) = Ce^{-i\\omega_d t}$ gives:</p>

<p style="text-align:center;">$$Ce^{-i\\omega_d t}[-\\omega_d^2 - i\\gamma\\omega_d + \\omega_0^2] = \\frac{F_0}{m} e^{-i\\omega_d t}$$</p>

<p>The exponential factors drop out, leaving a simple algebraic relation:</p>

<p style="text-align:center;">$$C = \\frac{F_0}{m} \\cdot \\frac{1}{\\omega_0^2 - i\\gamma\\omega_d - \\omega_d^2}$$</p>

<p>Thus $z(t) = (F_0/m) \\cdot e^{-i\\omega_d t} / (\\omega_0^2 - i\\gamma\\omega_d - \\omega_d^2)$. To get $x(t) = \\text{Re}[z(t)]$, we rationalize the denominator by multiplying by the complex conjugate:</p>

<p style="text-align:center;">$$\\frac{1}{\\omega_0^2 - i\\gamma\\omega_d - \\omega_d^2} = \\frac{\\omega_0^2 - \\omega_d^2 + i\\gamma\\omega_d}{(\\omega_0^2 - \\omega_d^2)^2 + (\\gamma\\omega_d)^2}$$</p>

<p>Writing this as $A + Bi$ and expanding $\\text{Re}[(A + Bi)(\\cos(\\omega_d t) - i\\sin(\\omega_d t))] = A\\cos(\\omega_d t) + B\\sin(\\omega_d t)$, we arrive at the final solution.</p>
</div></details>

<p>The exact solution is:</p>

<p style="text-align:center;"><strong>$$x(t) = \\frac{F_0}{m} \\left[ A \\cos(\\omega_d t) + B \\sin(\\omega_d t) \\right]$$</strong></p>

<p>where $A = (\\omega_0^2 - \\omega_d^2) / [(\\omega_0^2 - \\omega_d^2)^2 + (\\gamma\\omega_d)^2]$ and $B = \\gamma\\omega_d / [(\\omega_0^2 - \\omega_d^2)^2 + (\\gamma\\omega_d)^2]$.</p>`,
      interactive: "driven-oscillator",
      interactiveCaption: "A driven oscillator responding to a sinusoidal driving force. Adjust the driving frequency to see how the amplitude and phase of the response change.",
      mathLinks: ["complex-numbers"]
    },
    {
      heading: "Transients",
      body: `<p>We found a single exact solution. What happened to the boundary conditions? The dependence on boundary conditions is entirely determined by solutions to the <strong>homogeneous equation</strong>, with $F = 0$:</p>

<p style="text-align:center;">$$\\frac{d^2 x_0}{dt^2} + \\gamma \\frac{dx_0}{dt} + \\omega_0^2 x_0 = 0$$</p>

<p>Solutions to this equation are called <strong>homogeneous solutions</strong>. The solution $x(t)$ we found above is called the <strong>inhomogeneous solution</strong>. Note that $x_0(t) + x(t)$ will also satisfy the inhomogeneous equation, due to linearity. Thus we can always add a homogeneous solution to an inhomogeneous solution.</p>

<p>We saw before that the homogeneous solutions all have $e^{-(\\gamma/2)t}$ factors, plus possibly some oscillatory component. Thus they die off at late time. For this reason, they are called <strong>transient</strong>. Transients are determined by boundary conditions. If you have a driving force for long enough time, then the transient is irrelevant -- only the steady-state driven solution survives.</p>`,
      interactive: "transient-decay",
      interactiveCaption: "Drag the mass to set an initial displacement, then release. The transient dies away exponentially, leaving only the steady-state driven response.",
      mathLinks: ["differential-equations"]
    },
    {
      heading: "Phase Lag",
      body: `<p>A good way to see the physics hidden in the solution $x(t)$ is to take limits. First, consider the limit with no damping, $\\gamma = 0$. Then:</p>

<p style="text-align:center;"><strong>$$x(t) = \\frac{F_0}{m} \\cdot \\frac{\\cos(\\omega_d t)}{\\omega_0^2 - \\omega_d^2}$$</strong></p>

<p>We can compare this to our driving force $F(t) = F_0 \\cos(\\omega_d t)$. For $\\omega_d < \\omega_0$, the sign of the position and the force are the same, so they are exactly <strong>in phase</strong>. Now say we crank up the driving frequency $\\omega_d$ until it reaches then surpasses $\\omega_0$. For $\\omega_d > \\omega_0$, the sign of the solution flips and the oscillator is <strong>out of phase</strong> with the driver. Physically, the oscillator can't keep up with the driving force: it experiences <strong>phase lag</strong>.</p>

<p>This is a deeply physical result. At low driving frequencies, the system has time to follow the force -- push right, it moves right. But when the driver oscillates faster than the system's natural frequency, there is a lag: by the time the system responds to a rightward push, the force has already reversed. The system ends up moving opposite to the applied force.</p>`,
      interactive: "phase-lag",
      interactiveCaption: "Observe how the phase relationship between the driving force and the oscillator response changes as the driving frequency crosses the natural frequency.",
      mathLinks: []
    },
    {
      heading: "Power and Energy",
      body: `<p>We see from the solution that there is a part of $x(t)$ which is exactly proportional to the driving force $F(t) = F_0 \\cos(\\omega_d t)$ and a part which is out of phase. We call the in-phase part the <strong>elastic amplitude</strong>. It is proportional to $A = (\\omega_0^2 - \\omega_d^2) / [(\\omega_0^2 - \\omega_d^2)^2 + (\\gamma\\omega_d)^2]$. The out-of-phase part is the <strong>absorptive amplitude</strong>, proportional to $B = \\gamma\\omega_d / [(\\omega_0^2 - \\omega_d^2)^2 + (\\gamma\\omega_d)^2]$.</p>

<p>Thus for $\\gamma = 0$ (no damping), there is no absorptive part. Since the absorptive part is proportional to $\\gamma$, it should have to do with energy being lost from the oscillator into the system. To see how this works, we compute the power.</p>

<p>Recall that work is force times displacement $W = F \\Delta x$, and power is work per unit time: $P = F \\, dx/dt$. Plugging in our solution:</p>

<p style="text-align:center;">$$P = -\\frac{F_0^2}{2m} \\omega_d A \\sin(2\\omega_d t) + \\frac{F_0^2}{m} B \\omega_d \\cos^2(\\omega_d t)$$</p>

<p>The absorptive part is proportional to $\\cos^2(\\omega_d t)$, which is <strong>positive for all times</strong>. Thus it always takes (absorbs) power. On the other hand, the elastic amplitude is proportional to $\\sin(2\\omega_d t)$, which is sometimes positive and sometimes negative. When the power is negative, the oscillator is <em>returning</em> power to the driver. The elastic amplitude averages to zero over a full cycle.</p>

<p>Since $\\gamma = 0$ implies the absorptive amplitude vanishes (the entire solution is elastic), we draw the logical conclusion that with no damping, <em>no net power is needed to drive the system</em>. A little power is needed to get it started, but once it's moving, the driver no longer does work.</p>`,
      interactive: "power-absorption",
      interactiveCaption: "Watch the force and velocity arrows on the driven oscillator. The cumulative energy plot shows the absorptive part steadily extracting energy, while the elastic part just borrows and returns it.",
      mathLinks: []
    },
    {
      heading: "Resonance",
      body: `<p>The average power put into the system over a period $T = 2\\pi/\\omega_d$ is:</p>

<p style="text-align:center;"><strong>$$\\langle P \\rangle = \\frac{F_0^2}{2\\gamma m} \\cdot \\frac{(\\gamma\\omega_d)^2}{(\\omega_0^2 - \\omega_d^2)^2 + (\\gamma\\omega_d)^2}$$</strong></p>

<p>This power absorption curve has a maximum at $\\omega_d = \\omega_0$, where $\\langle P \\rangle = F_0^2/(2\\gamma m)$. This is known as a <strong>resonance</strong>. One way to find the resonance frequency $\\omega_0$ of a system is by varying the driving force until maximum power is absorbed.</p>

<p>The power is half the resonant power, $\\langle P \\rangle = F_0^2/(4\\gamma m)$, when $\\omega_d = \\frac{1}{2}\\sqrt{4\\omega_0^2 + \\gamma^2} \\pm \\frac{1}{2}\\gamma$. The difference between these two driving frequencies is $\\gamma$. Thus one can read $\\gamma$ off of the power curve: it is the value of the <strong>width at half-maximum</strong>.</p>

<p>This kind of curve is called a <strong>Lorentzian</strong>. Its maximum is at $\\omega_0$ and its width is $\\gamma$. The Lorentzian shape appears throughout physics -- from the spectral lines of atoms to the response curves of electrical circuits. The sharpness of the peak is directly related to the Q-factor: a high-Q oscillator has a very narrow, tall resonance peak, meaning it responds strongly only to driving frequencies very close to its natural frequency. A low-Q oscillator has a broad peak and responds to a wider range of frequencies.</p>

<p>Resonance is everywhere in physics and engineering. It explains why a wine glass shatters when a singer hits the right note, why a bridge can collapse if soldiers march across it in step, and why your car radio can pick out a single station from the electromagnetic spectrum. In every case, the system absorbs maximum energy when driven at its natural frequency.</p>`,
      interactive: "resonance-curve",
      interactiveCaption: "The Lorentzian resonance curve. The peak is at the natural frequency and the width at half-maximum equals the damping coefficient.",
      mathLinks: []
    },
    {
      heading: "Problems",
      body: `<p><strong>Problem 1 (Conceptual):</strong> Explain in your own words the strategy for solving the driven oscillator equation. Why do we complexify the driving force? Why is linearity essential to this approach?</p>

<p><strong>Problem 2 (Conceptual):</strong> A child on a swing is being pushed by a parent. Explain what happens to the child's oscillation amplitude as the pushing frequency is slowly increased from well below the natural frequency, through resonance, and to well above it. What happens to the phase?</p>

<p><strong>Problem 3 (Computational):</strong> An oscillator with $\\omega_0 = 5$ rad/s and $\\gamma = 1$ s$^{-1}$ is driven by a force $F(t) = F_0 \\cos(\\omega_d t)$ with $\\omega_d = 5$ rad/s (at resonance). Find the steady-state amplitude of oscillation in terms of $F_0$ and $m$. What is the phase of the response relative to the driving force?</p>

<p><strong>Problem 4 (Computational):</strong> Show that the average power absorbed by a driven oscillator is maximized when $\\omega_d = \\omega_0$. (Hint: differentiate the average power expression with respect to $\\omega_d$ and set it to zero.)</p>

<p><strong>Problem 5 (Conceptual):</strong> Explain the physical difference between the elastic and absorptive amplitudes. Why does the elastic amplitude average to zero power? Why is the absorptive amplitude proportional to the damping coefficient $\\gamma$?</p>

<p><strong>Problem 6 (Computational):</strong> A driven oscillator has $\\omega_0 = 10$ rad/s and you measure that the width at half-maximum of its power absorption curve is 0.5 rad/s. What is $\\gamma$? What is $Q$? Approximately how many oscillations does the system undergo before its free oscillation amplitude decays to 1/20 of its initial value?</p>

<p><strong>Problem 7 (Conceptual):</strong> Why are transients called transients? If a driving force is suddenly turned on, describe qualitatively what the motion looks like at early times (when the transient is still important) versus late times (when only the steady-state solution survives).</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: []
    }
  ],

  "3": [
    {
      heading: "Two Coupled Masses",
      body: `<p>To get to waves from oscillators, we have to start coupling them together. In the limit of a large number of coupled oscillators, we will find solutions that look like waves. Certain features of waves, such as resonance and <strong>normal modes</strong>, can be understood with a finite number of oscillators. Thus we start with two oscillators.</p>

<p>Consider two identical masses attached by springs: each mass is connected to a wall by a spring of constant $k$, and the two masses are connected to each other by a spring of constant $\\kappa$. Let $x_1$ be the displacement of the first mass from its equilibrium and $x_2$ be the displacement of the second mass from its equilibrium.</p>

<p>To work out Newton's laws, we first want to know the force on $x_1$ when it is moved from its equilibrium while holding $x_2$ fixed. The wall spring pulls back with $-kx_1$ and the coupling spring also pulls back with $-\\kappa x_1$, so $F_{\\text{on 1 from moving 1}} = -(k + \\kappa)x_1$. There is also a force on $x_1$ if we move $x_2$ holding $x_1$ fixed: $F_{\\text{on 1 from moving 2}} = \\kappa x_2$. To check the sign, note that if $x_2$ is increased, it pulls $x_1$ to the right. Thus:</p>

<p style="text-align:center;"><strong>$$m \\ddot{x}_1 = -(k + \\kappa) x_1 + \\kappa x_2$$</strong></p>
<p style="text-align:center;"><strong>$$m \\ddot{x}_2 = -(k + \\kappa) x_2 + \\kappa x_1$$</strong></p>

<p>These are two coupled linear differential equations -- the motion of each mass depends on the position of the other. We need to solve them simultaneously.</p>`,
      interactive: "coupled-oscillators",
      interactiveCaption: "Two masses connected by springs to each other and to fixed walls. Displace one or both masses to see how they interact.",
      mathLinks: []
    },
    {
      heading: "Normal Modes",
      body: `<p>One way to solve the coupled equations is to note that if we <em>add</em> them, we get:</p>

<p style="text-align:center;">$$m(\\ddot{x}_1 + \\ddot{x}_2) = -k(x_1 + x_2)$$</p>

<p>This is just $m\\ddot{y} = -ky$ for $y = x_1 + x_2$, so the solutions are sines and cosines:</p>

<p style="text-align:center;"><strong>$$x_1 + x_2 = A_s \\cos(\\omega_s t + \\phi_s), \\quad \\omega_s = \\sqrt{k/m}$$</strong></p>

<p>If instead we take the <em>difference</em>:</p>

<p style="text-align:center;">$$m(\\ddot{x}_1 - \\ddot{x}_2) = (-k - 2\\kappa)(x_1 - x_2)$$</p>

<p style="text-align:center;"><strong>$$x_1 - x_2 = A_f \\cos(\\omega_f t + \\phi_f), \\quad \\omega_f = \\sqrt{(k + 2\\kappa)/m}$$</strong></p>

<p>We write $\\omega_s$ for $\\omega_{\\text{slow}}$ and $\\omega_f$ for $\\omega_{\\text{fast}}$, since $\\omega_f > \\omega_s$. Thus we have found two solutions, each of which oscillates with a fixed frequency. These are the <strong>normal modes</strong> for this system. A general solution is a linear combination of these two solutions:</p>

<p style="text-align:center;">$$x_1 = \\frac{1}{2}[A_s \\cos(\\omega_s t + \\phi_s) + A_f \\cos(\\omega_f t + \\phi_f)]$$</p>
<p style="text-align:center;">$$x_2 = \\frac{1}{2}[A_s \\cos(\\omega_s t + \\phi_s) - A_f \\cos(\\omega_f t + \\phi_f)]$$</p>

<p>If we excite the masses so that $A_f = 0$, then both masses oscillate at frequency $\\omega_s$. In practice, we do this by pulling both masses to the right by the same amount, so that $x_1(0) = x_2(0)$. The solution is then $x_1 = x_2$ and both oscillate together for all time. This is the <strong>symmetric oscillation mode</strong>: both masses move right together, then left together. The coupling spring between them is never stretched or compressed, which is why the frequency $\\omega_s = \\sqrt{k/m}$ doesn't involve $\\kappa$ at all.</p>

<p>If we excite the masses so that $A_s = 0$, then $x_1 = -x_2$ and both oscillate at frequency $\\omega_f$. We set this up by pulling the masses in opposite directions. When one mass is right of equilibrium, the other is left, and vice versa. This is the <strong>antisymmetric mode</strong>. The coupling spring is maximally stretched and compressed, contributing an additional restoring force, which is why $\\omega_f = \\sqrt{(k + 2\\kappa)/m}$ is larger than $\\omega_s$.</p>`,
      interactive: "normal-modes",
      interactiveCaption: "The symmetric mode (both masses move together) and the antisymmetric mode (masses move in opposite directions). Each normal mode oscillates at a single frequency.",
      mathLinks: []
    },
    {
      heading: "Beats",
      body: `<p>What happens if we start with initial conditions that don't correspond to a single normal mode? For example, suppose we pull mass 1 to the right and leave mass 2 at rest: $x_1(0) = 1$, $x_2(0) = 0$. Then $A_s = A_f = 1$, and the motion of each mass involves <em>both</em> normal mode frequencies.</p>

<p>When the coupling spring constant $\\kappa$ is small compared to $k$, we have $\\omega_s \\approx \\omega_f$. What we see in this case is the emergence of <strong>beats</strong>. Beats occur when two normal mode frequencies get close.</p>

<p>Beats can be understood from the simple trigonometric relation: <span class="inline-math-link" data-math="trig-identities">Trig Identities &rarr;</span></p>

<p style="text-align:center;"><strong>$$\\cos(\\omega_1 t) + \\cos(\\omega_2 t) = 2 \\cos\\!\\left(\\frac{\\omega_1 + \\omega_2}{2} t\\right) \\cos\\!\\left(\\frac{\\omega_1 - \\omega_2}{2} t\\right)$$</strong></p>

<p>When you excite two frequencies $\\omega_1$ and $\\omega_2$ at the same time, the solution is the sum of the separate oscillating solutions (by linearity!). This sum can also be written as the <em>product</em> of two cosines. In particular, if $\\omega_1 \\approx \\omega_2$, then $\\omega = (\\omega_1 + \\omega_2)/2 \\approx \\omega_1 \\approx \\omega_2$ is a fast oscillation, and $\\epsilon = (\\omega_1 - \\omega_2)/2 \\ll \\omega_1, \\omega_2$ is a slow modulation. So the sum looks like an oscillation whose frequency is the <em>average</em> of the two normal mode frequencies, modulated by an oscillation with frequency given by half the <em>difference</em>.</p>

<p>Beats are important because they can generate frequencies well below the normal mode frequencies. For example, suppose you have two strings which are not quite in tune. Say they are supposed to both be the note A4 at 440 Hz, but one is actually $\\nu_1 = 442$ Hz and the other is $\\nu_2 = 439$ Hz. If you pluck both strings together you will hear the average frequency 440.5 Hz, but also there will be a slow oscillation at the <strong>beat frequency</strong>:</p>

<p style="text-align:center;"><strong>$$\\nu_{\\text{beat}} = |\\nu_1 - \\nu_2|$$</strong></p>

<p>So $\\nu_{\\text{beat}} = 3$ Hz -- you hear something happening 3 times a second. This regular beating in off-tune notes is audible by ear. In fact, it is a useful trick for tuning: change one string until the beating disappears. Then the strings are in tune. We use an absolute value since the frequency is the same whether $\\nu_1 > \\nu_2$ or $\\nu_2 > \\nu_1$. There is no factor of 2 because we only ever hear the modulus of the oscillation, not the phase.</p>`,
      interactive: "beats",
      interactiveCaption: "Beats produced by two coupled oscillators with similar frequencies. The amplitude slowly oscillates between the two masses at the beat frequency.",
      mathLinks: ["trig-identities"]
    },
    {
      heading: "The Matrix Method for Coupled Oscillators",
      body: `<p>We solved the two coupled mass problem by looking at the equations and noting that their sum and difference would be independent solutions. For more complicated systems -- more masses, different couplings -- we should not expect to be able to guess the answer this way. Can you guess the solution if the two oscillators have different masses?</p>

<p>To develop a more systematic procedure, suppose we have lots of masses with lots of different springs connected in a complicated way. Then the equations of motion are: $m_1 \\ddot{x}_1 = k_{11}x_1 + k_{12}x_2 + \\cdots + k_{1n}x_n$, and so on for each mass. All of these equations are linear. What are the solutions in this general case? This is an algebra problem involving linear equations. Hence we should be able to solve it with <strong>linear algebra</strong>. <span class="inline-math-link" data-math="linear-algebra">Linear Algebra &rarr;</span></p>

<p>Since the equations of motion are linear, we expect them to be solved by exponentials $x_j = c_j e^{i\\omega t}$ for some $\\omega$ and constants $c_j$. As with the driven oscillator, we are using complex solutions to make the math simpler, then we can take the real part at the end. Plugging in these guesses, the equations become:</p>

<p style="text-align:center;">$$-m_1 \\omega^2 c_1 = -(k + \\kappa)c_1 + \\kappa c_2$$</p>
<p style="text-align:center;">$$-m_2 \\omega^2 c_2 = -(k + \\kappa)c_2 + \\kappa c_1$$</p>

<p>We write these in matrix form by defining a vector $\\vec{c} = (c_1, c_2)$. The equations of motion become:</p>

<p style="text-align:center;"><strong>$$M \\cdot \\vec{c} = -\\omega^2 \\vec{c}$$</strong></p>

<p>You might recognize this as an <strong>eigenvalue equation</strong>. An $n \\times n$ matrix $A$ has $n$ <strong>eigenvalues</strong> $\\lambda_i$ and $n$ associated <strong>eigenvectors</strong> $\\vec{v}_i$ which satisfy $A \\cdot \\vec{v}_i = \\lambda_i \\vec{v}_i$. The left-hand side is a matrix multiplying a vector while the right-hand side is just a number multiplying a vector. So studying eigenvalues and eigenvectors lets us turn matrices into numbers! Eigenvalues and eigenvectors are <em>the</em> fundamental mathematical concept of quantum mechanics.</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: ["linear-algebra", "eigenvalues"]
    },
    {
      heading: "Finding Normal Modes from Eigenvalues",
      body: `<p>Let's recall how to solve an eigenvalue equation. The trick is to write it first as $(A - \\lambda \\mathbb{1})\\vec{v} = 0$, where $\\mathbb{1}$ is the identity matrix. For most values of $\\lambda$, the matrix $(A - \\lambda \\mathbb{1})$ has an inverse. Multiplying both sides by that inverse, we find $\\vec{v} = 0$, which is the trivial solution. The nontrivial solutions must correspond to values of $\\lambda$ for which $(A - \\lambda \\mathbb{1})$ does <strong>not</strong> have an inverse. <span class="inline-math-link" data-math="eigenvalues">Eigenvalues &rarr;</span></p>

<p>When does a matrix not have an inverse? A result from linear algebra is that a matrix is not invertible if and only if its <strong>determinant is zero</strong>. Thus the equation $\\det(A - \\lambda \\mathbb{1}) = 0$ is an algebraic equation for $\\lambda$ whose solutions are the eigenvalues $\\lambda_i$.</p>

<p>It is useful to know that the determinant of a $2 \\times 2$ matrix is $\\det\\begin{pmatrix} a & b \\ c & d \\end{pmatrix} = ad - bc$. You should have this memorized.</p>

<details class="derivation-card"><summary>Derive: Normal Mode Frequencies from the Determinant</summary><div class="derivation-body">
<p>For our two-mass system (with equal masses $m$), the eigenvalues $-\\omega^2$ must satisfy:</p>

<p style="text-align:center;">$$\\det(M + \\omega^2 \\mathbb{1}) = \\left(-\\frac{k + \\kappa}{m} + \\omega^2\\right)\\left(-\\frac{k + \\kappa}{m} + \\omega^2\\right) - \\frac{\\kappa^2}{m^2} = 0$$</p>

<p>Multiplying by $m^2$, this reduces to:</p>

<p style="text-align:center;">$$(k + \\kappa - m\\omega^2)^2 = \\kappa^2$$</p>

<p>Thus $k + \\kappa - m\\omega^2 = \\pm \\kappa$. The two solutions are:</p>

<p style="text-align:center;"><strong>$$\\omega = \\omega_s = \\sqrt{k/m}, \\quad \\omega = \\omega_f = \\sqrt{(k + 2\\kappa)/m}$$</strong></p>

<p>These are exactly the two normal mode frequencies we found before by the sum-and-difference trick.</p>
</div></details>

<p>Note that we didn't have to take the real part of the solution to find the normal mode frequencies. We only need to take the real part to find the actual solutions $x(t)$.</p>

<p><strong>Extension to three masses:</strong> For three masses coupled together, the equations of motion take the same form but with a $3 \\times 3$ matrix. Writing $x_j = c_j e^{i\\omega t}$, we get $(M + \\omega^2 \\mathbb{1})\\vec{x} = 0$, where $M$ is now a $3 \\times 3$ matrix. To find the normal mode frequencies $\\omega$, we need to solve $\\det(M + \\omega^2 \\mathbb{1}) = 0$. For a $3 \\times 3$ matrix, there will be 3 eigenvalues and hence <strong>three normal-mode frequencies</strong>. The pattern is clear: $n$ coupled oscillators have $n$ normal modes, found by solving an $n \\times n$ eigenvalue problem.</p>

<p>This matrix approach is completely general. It works for any number of masses, any arrangement of springs, and even for different masses. The normal modes are the eigenvectors, and the normal mode frequencies are determined by the eigenvalues. This is the bridge from a handful of coupled oscillators to the wave equation -- when we take the number of oscillators to infinity.</p>`,
      interactive: "eigenvalue-solver",
      interactiveCaption: "Solving the eigenvalue problem for coupled oscillators. The eigenvalues give the normal mode frequencies, and the eigenvectors give the mode shapes.",
      mathLinks: ["eigenvalues", "linear-algebra"]
    },
    {
      heading: "Problems",
      body: `<p><strong>Problem 1 (Conceptual):</strong> Two identical masses are connected by three identical springs (each mass connected to a wall and to each other). Describe the two normal modes physically. Which mode has the higher frequency and why?</p>

<p><strong>Problem 2 (Computational):</strong> Two masses $m = 1$ kg are connected as in the lecture, with $k = 4$ N/m and $\\kappa = 0.5$ N/m. (a) Find the normal mode frequencies $\\omega_s$ and $\\omega_f$. (b) If both masses are displaced 5 cm to the right and released from rest, describe the subsequent motion. Which normal mode is excited?</p>

<p><strong>Problem 3 (Computational):</strong> For the system in Problem 2, suppose mass 1 is displaced 5 cm to the right and mass 2 is not displaced: $x_1(0) = 5$ cm, $x_2(0) = 0$, both released from rest. (a) Write $x_1(t)$ and $x_2(t)$ in terms of normal mode amplitudes. (b) What is the beat frequency? (c) How long does it take for all the energy to transfer from mass 1 to mass 2?</p>

<p><strong>Problem 4 (Conceptual):</strong> Two guitar strings are tuned to slightly different frequencies: 440 Hz and 443 Hz. What beat frequency do you hear? If you tighten one string until the beat frequency drops to 1 Hz, what are the possible frequencies of that string?</p>

<p><strong>Problem 5 (Computational):</strong> Two masses $m_1 = 1$ kg and $m_2 = 2$ kg are coupled by springs with $k = 6$ N/m and $\\kappa = 3$ N/m. Set up the matrix $M$ from the eigenvalue equation $M \\cdot \\vec{c} = -\\omega^2 \\vec{c}$. Find the two normal mode frequencies by computing $\\det(M + \\omega^2 \\mathbb{1}) = 0$.</p>

<p><strong>Problem 6 (Conceptual):</strong> Why is the antisymmetric mode always the higher-frequency mode for two identical coupled oscillators? Give both a mathematical argument (in terms of the eigenvalue) and a physical argument (in terms of the effective spring constant).</p>

<p><strong>Problem 7 (Computational):</strong> Three identical masses ($m = 1$ kg) are connected in a line by four identical springs ($k = 1$ N/m), with the two end springs attached to walls. Write down the $3 \\times 3$ matrix $M$ for this system and find the three normal mode frequencies. (Hint: the matrix is symmetric and tridiagonal.)</p>

<p><strong>Problem 8 (Conceptual):</strong> Explain why $n$ coupled oscillators have exactly $n$ normal modes. What is the physical significance of the fact that normal modes form a complete set -- that is, any motion of the system can be written as a sum of normal modes?</p>`,
      interactive: null,
      interactiveCaption: null,
      mathLinks: []
    }
  ]
};
