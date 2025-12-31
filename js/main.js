// Scroll smooth via data-scroll
document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
        const target = document.querySelector(btn.getAttribute("data-scroll"));
        if (target) target.scrollIntoView({ behavior: "smooth" });
    });
});

// Form submission
function handleFormSubmit(event) {
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    alert(`Merci ${data.name}! Votre demande a été envoyée. Je vous répondrai sous 24 heures à ${data.email}`);
}

const form = document.getElementById("contact-form");
 if (form) {
  form.addEventListener("submit", handleFormSubmit);
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px"
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll(".fade-in, .service-card, .project-card, .skill-group").forEach(el => {
    observer.observe(el);
});
// ==================== RECHERCHE GLOBALE AVEC SURBRILLANCE + SCROLL ====================

const searchableBlocks = Array.from(
    document.querySelectorAll(
        "section, .service-card, .project-card, .skill-group, .testimonial, .about-content, .about-image, .footer-section"
    )
);

// Sauvegarde du HTML d'origine
const originalHTMLMap = new Map();
searchableBlocks.forEach(el => {
    originalHTMLMap.set(el, el.innerHTML);
});

const searchInput = document.getElementById("site-search");

function highlightInElement(el, query) {
    if (!query) {
        el.innerHTML = originalHTMLMap.get(el);
        return;
    }

    const originalHTML = originalHTMLMap.get(el);
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${safeQuery})`, "gi");

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = originalHTML;

    function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.toLowerCase().includes(query.toLowerCase())) {
                const wrapper = document.createElement("span");
                wrapper.innerHTML = node.textContent.replace(
                    regex,
                    '<span class="search-highlight">$1</span>'
                );
                node.parentNode.replaceChild(wrapper, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (["SCRIPT", "STYLE"].includes(node.tagName)) return;
            Array.from(node.childNodes).forEach(walk);
        }
    }

    Array.from(tempDiv.childNodes).forEach(walk);
    el.innerHTML = tempDiv.innerHTML;
}

if (searchInput) {
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();

        // 1) Appliquer / nettoyer le surlignage partout
        searchableBlocks.forEach(el => {
            highlightInElement(el, query);
        });

        // 2) Si rien tapé → ne pas scroller
        if (!query) return;

        // 3) Récupérer toutes les occurrences surlignées
        const highlights = document.querySelectorAll(".search-highlight");

        if (highlights.length > 0) {
            // Scroll vers la première occurrence trouvée
            highlights[0].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    });
}

// ==================== MENU BURGER MOBILE ====================
const nav = document.querySelector("nav");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("nav-menu");

if (nav && navToggle && navMenu) {
  // ouvrir/fermer au clic sur ☰
  navToggle.addEventListener("click", event => {
    event.stopPropagation(); // ne pas déclencher le "clic dehors"
    nav.classList.toggle("open");
  });

  // fermer le menu en cliquant sur un lien
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });

  // fermer le menu quand on clique en dehors de la nav
  document.addEventListener("click", event => {
    if (!nav.contains(event.target)) {
      nav.classList.remove("open");
    }
  });
}

// ==================== SOUS-MENUS (Services / Projets / Compétences) ====================
const submenuButtons = document.querySelectorAll(
  '.nav-item.has-submenu .nav-link-toggle'
);
const submenuItems = document.querySelectorAll('.nav-item.has-submenu');

// Ouverture / fermeture au clic sur le bouton
submenuButtons.forEach(btn => {
  btn.addEventListener('click', event => {
    event.stopPropagation(); // sinon le document.click ferme tout

    const li = btn.parentElement;
    const isOpen = li.classList.contains('open');

    // Fermer tous les sous-menus
    submenuItems.forEach(item => item.classList.remove('open'));

    // Si celui-ci n'était pas ouvert, on l'ouvre
    if (!isOpen) {
      li.classList.add('open');
    }
  });
});

// Fermer les sous-menus quand on clique sur un lien de nav (desktop + mobile)
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => {
    submenuItems.forEach(item => item.classList.remove('open'));
  });
});

// Fermer les sous-menus quand on clique ailleurs (page ou barre hors boutons)
document.addEventListener('click', event => {
  const clickedToggle = event.target.closest('.nav-link-toggle');
  const clickedInsideNav = nav && nav.contains(event.target);

  // clic en dehors de la nav OU dans la nav mais pas sur un bouton de sous-menu
  if (!clickedInsideNav || !clickedToggle) {
    submenuItems.forEach(item => item.classList.remove('open'));
  }
});

