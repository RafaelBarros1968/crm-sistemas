const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("[data-mobile-nav]");

window.addEventListener(
  "scroll",
  () => header?.classList.toggle("scrolled", window.scrollY > 24),
  { passive: true }
);

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  mobileNav?.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  });
});

const serviceData = {
  networking: {
    index: "01 / NETWORKING AVANZADO",
    title: "Networking avanzado",
    copy:
      "Diseñamos y optimizamos redes de misión crítica con especial atención a capacidad, continuidad, segmentación y facilidad de administración. El alcance se ajusta al tamaño real de cada operación.",
    scope: [
      "Topología LAN / WAN / WLAN",
      "MikroTik RouterOS",
      "VLAN y routing dinámico",
      "QoS y priorización",
      "Balanceo y failover",
      "Hotspot y portal cautivo",
      "Optimización Wi-Fi",
      "Documentación técnica",
    ],
  },
  security: {
    index: "02 / CIBERSEGURIDAD",
    title: "Ciberseguridad",
    copy:
      "Fortalecemos la red desde su arquitectura: menos exposición, accesos controlados y separación clara entre usuarios, servicios y dispositivos. Cada medida se diseña para ser mantenible.",
    scope: [
      "Firewall y reglas",
      "Segmentación segura",
      "VPN cifrada",
      "Hardening de equipos",
      "Control de accesos",
      "Diagnóstico de riesgos",
      "Protección perimetral",
      "Plan de mejora",
    ],
  },
  remote: {
    index: "03 / CONEXIONES REMOTAS",
    title: "Conexiones remotas",
    copy:
      "Conectamos personas, sedes y recursos internos mediante canales cifrados y permisos definidos. El objetivo es trabajar a distancia sin convertir la comodidad en un riesgo.",
    scope: [
      "VPN site-to-site",
      "VPN client-to-site",
      "Acceso a cámaras IP",
      "Soporte remoto",
      "Perfiles por usuario",
      "Trazabilidad",
      "Mantenimiento remoto",
      "Conexión multisede",
    ],
  },
  infrastructure: {
    index: "04 / INFRAESTRUCTURA",
    title: "Infraestructura & soporte",
    copy:
      "Integramos los componentes físicos y lógicos que sostienen la red, desde el cableado y los equipos hasta el respaldo, la documentación y el acompañamiento técnico.",
    scope: [
      "Cableado estructurado",
      "Organización de rack",
      "Cámaras IP",
      "Servidores y respaldo",
      "Inventario técnico",
      "Mantenimiento",
      "Diagnóstico de fallas",
      "Soporte a usuarios",
    ],
  },
};

const dialog = document.querySelector("[data-dialog]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogIndex = document.querySelector("[data-dialog-index]");
const dialogCopy = document.querySelector("[data-dialog-copy]");
const dialogScope = document.querySelector("[data-dialog-scope]");

document.querySelectorAll("[data-service]").forEach((button) => {
  button.addEventListener("click", () => {
    const service = serviceData[button.dataset.service];
    if (!service || !dialog) return;
    dialogTitle.textContent = service.title;
    dialogIndex.textContent = service.index;
    dialogCopy.textContent = service.copy;
    dialogScope.innerHTML = service.scope.map((item) => `<span>${item}</span>`).join("");
    dialog.showModal();
  });
});

document.querySelector(".dialog-close")?.addEventListener("click", () => dialog?.close());
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const counter = document.querySelector("[data-counter]");
const counterObserver = new IntersectionObserver(
  ([entry]) => {
    if (!entry?.isIntersecting || !counter) return;
    const target = Number(counter.dataset.counter);
    if (reduceMotion) {
      counter.textContent = target;
      return;
    }
    let value = 0;
    const step = () => {
      value += Math.max(1, Math.ceil((target - value) / 9));
      counter.textContent = Math.min(value, target);
      if (value < target) requestAnimationFrame(step);
    };
    step();
    counterObserver.disconnect();
  },
  { threshold: 0.6 }
);
if (counter) counterObserver.observe(counter);

const canvas = document.querySelector("[data-network]");
const context = canvas?.getContext("2d");
let particles = [];
let animationFrame;

function resizeCanvas() {
  if (!canvas || !context) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const bounds = canvas.getBoundingClientRect();
  canvas.width = bounds.width * ratio;
  canvas.height = bounds.height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: window.innerWidth < 680 ? 22 : 46 }, () => ({
    x: Math.random() * bounds.width,
    y: Math.random() * bounds.height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    radius: Math.random() * 1.2 + 0.7,
  }));
}

function drawNetwork() {
  if (!canvas || !context) return;
  const { width, height } = canvas.getBoundingClientRect();
  context.clearRect(0, 0, width, height);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(55, 203, 255, .58)";
    context.fill();

    for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
      const other = particles[otherIndex];
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (distance < 150) {
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(other.x, other.y);
        context.strokeStyle = `rgba(28, 145, 255, ${0.12 * (1 - distance / 150)})`;
        context.lineWidth = 0.7;
        context.stroke();
      }
    }
  });

  if (!reduceMotion) animationFrame = requestAnimationFrame(drawNetwork);
}

if (canvas && context) {
  resizeCanvas();
  drawNetwork();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationFrame);
    resizeCanvas();
    drawNetwork();
  });
}
