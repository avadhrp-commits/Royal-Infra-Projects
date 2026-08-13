// Royal Infra Projects — shared site behaviour
(function () {
  "use strict";

  /* ---------- Header scroll state + mobile nav ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Active nav link ---------- */
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a[data-page]").forEach(function (a) {
    if (a.dataset.page === here) a.classList.add("active");
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Circuit trace draw-on-load ---------- */
  function drawTraces() {
    document.querySelectorAll(".trace-path").forEach(function (path, i) {
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.getBoundingClientRect(); // force reflow
      path.style.transition = "stroke-dashoffset " + (1.8 + i * 0.3) + "s cubic-bezier(.22,.85,.34,1) " + (i * 0.25) + "s";
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { path.style.strokeDashoffset = "0"; });
      });
    });
  }
  if (document.querySelector(".trace-path")) {
    if (document.readyState === "complete") drawTraces();
    else window.addEventListener("load", drawTraces);
  }

  /* ---------- Cert / image lightbox ---------- */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    document.querySelectorAll("[data-lightbox]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        lightboxImg.src = trigger.getAttribute("data-lightbox");
        lightboxImg.alt = trigger.getAttribute("data-lightbox-alt") || "";
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    });
    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    lightbox.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  /* ---------- Contact form (Formspree-ready, graceful fallback) ---------- */
  var form = document.querySelector("#contact-form");
  if (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var action = form.getAttribute("action") || "";
      var placeholder = action.indexOf("YOUR_FORM_ID") !== -1;
      if (placeholder) {
        status.textContent =
          "Form isn't connected yet — please email info@royalinfraprojects.com or call +91 78749 40140 directly. (Site owner: connect a Formspree endpoint in contact.html.)";
        status.className = "form-status show err";
        return;
      }
      var data = new FormData(form);
      status.textContent = "Sending...";
      status.className = "form-status show";
      fetch(action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (res.ok) {
            status.textContent = "Thank you — your enquiry has been sent. We'll get back to you shortly.";
            status.className = "form-status show ok";
            form.reset();
          } else {
            throw new Error("Submit failed");
          }
        })
        .catch(function () {
          status.textContent = "Something went wrong. Please email info@royalinfraprojects.com or call +91 78749 40140.";
          status.className = "form-status show err";
        });
    });
  }

  /* ---------- FAQ Chatbot (rule-based, fully client-side) ---------- */
  var FAQ = [
    {
      q: ["service", "services", "what do you do", "what do you offer"],
      a: "We deliver 14 service lines across four groups: Network & Conversion (HT/LT networks, OH-to-UG conversion, RMU/DTR infrastructure), Installation & Commissioning (HDD, substation commissioning, cable jointing, earthing), Testing & Efficiency (diagnostics, AMC, solar grid integration, power factor automation), and Utility & Civil Support. See the full list on our <a href='services.html'>Services page</a>.",
    },
    {
      q: ["iso", "certificate", "certification", "certified", "quality"],
      a: "Yes. Our management systems are independently certified by Ranalysis Certification Pvt. Ltd. (IAF / EGAC accredited) &mdash; ISO 9001:2015 for quality, ISO 14001:2015 for environmental management and ISO 45001:2018 for occupational health &amp; safety. The certificates are shown on our <a href='index.html#certificates'>home page</a> &mdash; click any one to view it full size.",
    },
    {
      q: ["quote", "quotation", "cost", "price", "pricing", "estimate", "enquiry", "enquire"],
      a: "For a project quote, share your scope (location, voltage class, scale) via our <a href='contact.html'>Contact page</a> or WhatsApp us directly at +91 78749 40140 — our commercial team typically responds within a business day.",
    },
    {
      q: ["contact", "phone", "email", "address", "office", "location", "where are you"],
      a: "Reach us at +91 78749 40140 or info@royalinfraprojects.com. Our office is in Sanand, Ahmedabad, Gujarat. Full details and a map are on the <a href='contact.html'>Contact page</a>.",
    },
    {
      q: ["career", "job", "vacancy", "hiring", "work with you", "apply"],
      a: "We're actively hiring across electrical, civil and project-management roles. Check open positions and how to apply on our <a href='careers.html'>Careers page</a>.",
    },
    {
      q: ["client", "partner", "getco", "ugvcl", "gsrdc", "l&t", "l and t"],
      a: "We work with utilities including UGVCL and GSRDC, and alongside channel partners such as L&T Infrastructure and Rajesh Power Services. More on our <a href='partners.html'>Partners page</a>.",
    },
    {
      q: ["project", "portfolio", "work", "case study", "rmu", "substation", "cable"],
      a: "Our project work spans OH-to-UG conversions, RMU/DTR foundation execution, substation commissioning and solar grid integration across Gujarat. See real project photos on our <a href='projects.html'>Projects page</a>.",
    },
    {
      q: ["leadership", "team", "founder", "chairman", "director", "who runs", "ceo"],
      a: "Royal Infra Projects is led by Rajesh M. Patel (Chairman & Managing Head), Avadh R. Patel (Director – Commercial & Finance) and Harshal D. Patel (Operations Manager). Read more on our <a href='leadership.html'>Leadership page</a>.",
    },
    {
      q: ["hello", "hi", "hey", "namaste"],
      a: "Hello! I can help with questions about our services, ISO certifications, projects, careers or how to get a quote. What would you like to know?",
    },
  ];

  var FALLBACK =
    "I don't have a direct answer for that yet — for anything specific, please call +91 78749 40140, email info@royalinfraprojects.com, or use the WhatsApp button for a quick reply from our team.";

  function matchFaq(text) {
    var t = text.toLowerCase();
    for (var i = 0; i < FAQ.length; i++) {
      for (var j = 0; j < FAQ[i].q.length; j++) {
        if (t.indexOf(FAQ[i].q[j]) !== -1) return FAQ[i].a;
      }
    }
    return null;
  }

  var launcher = document.querySelector(".chat-launcher");
  var panel = document.querySelector(".chat-panel");
  if (launcher && panel) {
    var body = panel.querySelector(".chat-body");
    var input = panel.querySelector('input[type="text"]');
    var sendBtn = panel.querySelector(".chat-send");
    var closeBtn = panel.querySelector(".chat-close");
    var quickWrap = panel.querySelector(".chat-quick");

    function addMsg(text, who) {
      var el = document.createElement("div");
      el.className = "chat-msg " + who;
      el.innerHTML = text;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
      return el;
    }

    function addTyping() {
      var el = document.createElement("div");
      el.className = "chat-msg bot typing";
      el.innerHTML = "<span></span><span></span><span></span>";
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
      return el;
    }

    // Reveals HTML answer text character-by-character (tags are inserted whole, not chopped)
    function typewrite(el, html) {
      var i = 0;
      var caret = document.createElement("span");
      caret.className = "cursor";
      function step() {
        if (i >= html.length) {
          el.innerHTML = html;
          body.scrollTop = body.scrollHeight;
          return;
        }
        if (html[i] === "<") {
          var close = html.indexOf(">", i);
          i = close === -1 ? html.length : close + 1;
        } else {
          i++;
        }
        el.innerHTML = html.slice(0, i);
        el.appendChild(caret);
        body.scrollTop = body.scrollHeight;
        window.setTimeout(step, 14);
      }
      step();
    }

    function respond(text) {
      addMsg(text, "user");
      var answer = matchFaq(text) || FALLBACK;
      var typingEl = addTyping();
      window.setTimeout(function () {
        typingEl.remove();
        var botEl = addMsg("", "bot");
        typewrite(botEl, answer);
      }, 3000);
    }

    launcher.addEventListener("click", function () {
      panel.classList.add("is-open");
      launcher.setAttribute("aria-expanded", "true");
      if (input) input.focus();
    });
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        panel.classList.remove("is-open");
        launcher.setAttribute("aria-expanded", "false");
      });
    }
    if (quickWrap) {
      quickWrap.querySelectorAll("button").forEach(function (btn) {
        btn.addEventListener("click", function () { respond(btn.textContent); });
      });
    }
    if (sendBtn && input) {
      function submit() {
        var val = input.value.trim();
        if (!val) return;
        respond(val);
        input.value = "";
      }
      sendBtn.addEventListener("click", submit);
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") submit();
      });
    }
  }
})();
