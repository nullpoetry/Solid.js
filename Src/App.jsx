import { createSignal, onMount } from "solid-js";

function AccordionSection(props) {
  const [isOpen, setOpen] = createSignal(false);
  let contentRef;

  function updateHeight() {
    if (contentRef) {
      if (isOpen()) {
        contentRef.style.height = contentRef.scrollHeight + "px";
      } else {
        contentRef.style.height = "0px";
      }
    }
  }

  onMount(() => {
    updateHeight();
  });

  function toggle() {
    setOpen(!isOpen());
    setTimeout(updateHeight, 10);
  }

  return (
    <section class="accordion-section" aria-expanded={isOpen()} aria-label={props.title}>
      <button
        class={"folding-header" + (isOpen() ? " open" : "")}
        onClick={toggle}
        aria-controls={"content-" + props.id}
        aria-expanded={isOpen()}
        id={"header-" + props.id}
      >
        {props.title}
        <svg
          class="folding-header-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
      <div
        id={"content-" + props.id}
        class="folding-content-wrapper"
        aria-labelledby={"header-" + props.id}
        ref={el => { contentRef = el; }}
        style={{ height: "0px" }}
      >
        <div class="folding-content">{props.children}</div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Mono&family=Inter:wght@400;700&display=swap');
        :root {
          --cyan: #00ffffcc;
          --background: rgba(10,10,30,0.7);
          --background-inner: rgba(10,10,30,0.8);
          --text-color: #c0ffffdd;
        }
        html, body {
          margin:0; padding:0; height:100%;
          background: #0e0e14;
          font-family: 'Inter', sans-serif;
          color: #ddd;
          user-select:none;
          overflow-x: hidden;
        }
        #root {
          max-width: 370px;
          margin: 1rem auto 5rem;
          padding: 0 1rem;
        }
        h1 {
          font-weight: 700;
          font-size: 1.8rem;
          text-align: center;
          color: #a0eaff;
          margin-bottom: 1rem;
          text-shadow: 0 0 6px #00d8ff99;
        }
        .accordion-section {
          perspective: 1000px;
          margin-bottom: 18px;
        }
        button.folding-header {
          cursor: pointer;
          user-select:none;
          background: var(--background);
          border-radius: 12px;
          padding: 16px 20px;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--cyan);
          box-shadow:
            inset 0 0 20px var(--cyan),
            0 0 8px var(--cyan);
          display: flex;
          justify-content: space-between;
          align-items: center;
          transform-style: preserve-3d;
          transition: transform 0.5s cubic-bezier(.65,.05,.36,1);
          will-change: transform;
          border:none;
          width: 100%;
          text-align: left;
        }
        button.folding-header:hover {
          box-shadow:
            inset 0 0 30px #67ffffff,
            0 0 14px #67ffffff;
        }
        .folding-header-icon {
          width: 24px;
          height: 24px;
          fill: var(--cyan);
          transition: transform 0.5s cubic-bezier(.65,.05,.36,1);
          transform-origin: center center;
        }
        button.folding-header.open {
          transform: rotateX(180deg);
        }
        button.folding-header.open .folding-header-icon {
          transform: rotate(180deg);
        }
        .folding-content-wrapper {
          overflow: hidden;
          border-radius: 0 0 12px 12px;
          height: 0;
          transition: height 0.5s ease;
        }
        .folding-content {
          background: var(--background-inner);
          box-shadow: inset 0 0 20px #00ffff44;
          padding: 16px 20px;
          font-size: 0.9rem;
          line-height: 1.4;
          color: var(--text-color);
          user-select: text;
        }
        #ninerCanvas {
          display: block;
          margin: 25px auto 50px;
          filter: drop-shadow(0 0 8px var(--cyan));
          border-radius: 20px;
          background: radial-gradient(ellipse at center, #12161b 0%, #0d1117 80%);
          box-shadow: 0 0 30px #0ff9ff88;
          width: 100%;
          max-width: 600px;
          height: 600px;
        }
      `}</style>
      <h1>Origami Folding Accordion & Niner Orb Fibonacci Spiral</h1>
      <AccordionSection id="1" title="Introduction">
        <p>This demo combines a 3D origami folding accordion with an animated Fibonacci spiral orb visualization called 'Niner Orb'.</p>
        <p>Click the headings to see folding animations and watch the orb spiral below.</p>
      </AccordionSection>
      <AccordionSection id="2" title="Features">
        <ul>
          <li>Origami style 3D folding accordion in SolidJS</li>
          <li>Canvas based animated Fibonacci orb spiral visualization</li>
          <li>Clean modern UI with cool cyan glow effects</li>
          <li>Accessible and responsive</li>
        </ul>
      </AccordionSection>
      <AccordionSection id="3" title="Usage">
        <p>Explore the accordion sections to toggle content. Observe the niner orb Fibonacci spiral animation below as a background visual element.</p>
        <p>Perfect for artistic UI, data visualization, or futuristic dashboards.</p>
      </AccordionSection>
      <canvas id="ninerCanvas" aria-label="Niner Orb Fibonacci Spiral"></canvas>
      <script>{`
        (function(){
          const canvas = document.getElementById('ninerCanvas');
          const ctx = canvas.getContext('2d');
          let width = canvas.width;
          let height = canvas.height;
          const orbCount = 45;
          const orbBaseRadius = 6;
          const angleIncrement = 137.5 * Math.PI / 180;

          const orbs = [];

          for(let i=1; i<=orbCount; i++){
            let r = orbBaseRadius + Math.sqrt(i)*1.5;
            let angle = i * angleIncrement;
            let spiralRadius = 7 * Math.sqrt(i);

            orbs.push({
              x: width/2 + spiralRadius * Math.cos(angle),
              y: height/2 + spiralRadius * Math.sin(angle),
              radius: r,
              angle,
              baseRadius: r,
              spiralRadius,
              speed: 0.002 + (i*0.0001),
              phase: Math.random()*Math.PI*2,
              color: \`hsl(\${(i*8)%360}, 90%, 60%)\`
            });
          }

          function animate(time=0){
            ctx.clearRect(0, 0, width, height);

            let bgGradient = ctx.createRadialGradient(width/2, height/2, 10, width/2, height/2, width/2);
            bgGradient.addColorStop(0, "#0c121a");
            bgGradient.addColorStop(1, "#041014");
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            orbs.forEach(orb => {
              let pulse = 0.3 * Math.sin(time * 0.003 * orb.speed * 300 + orb.phase) + 1;
              let radius = orb.baseRadius * pulse;

              orb.angle += orb.speed * 0.5;
              orb.x = width/2 + orb.spiralRadius * Math.cos(orb.angle);
              orb.y = height/2 + orb.spiralRadius * Math.sin(orb.angle);

              let gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, radius * 5);
              gradient.addColorStop(0, orb.color + "cc");
              gradient.addColorStop(1, orb.color + "00");

              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(orb.x, orb.y, radius*5, 0, Math.PI*2);
              ctx.fill();

              ctx.fillStyle = orb.color;
              ctx.shadowColor = orb.color;
              ctx.shadowBlur = 12;
              ctx.beginPath();
              ctx.arc(orb.x, orb.y, radius, 0, Math.PI*2);
              ctx.fill();
              ctx.shadowBlur = 0;
            });

            requestAnimationFrame(animate);
          }

          animate();
        })();
      `}</script>
    </>
  );
}
