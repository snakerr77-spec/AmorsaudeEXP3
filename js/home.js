document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("homeNavigation");
  const menuToggle = document.getElementById("homeMenuToggle");
  const notifyToggle = document.getElementById("homeNotificationToggle");
  const notifyPanel = document.getElementById("homeNotificationPanel");
  const notifyCount = document.getElementById("homeNotificationCount");
  const markAllRead = document.getElementById("homeMarkAllRead");
  const profileToggle = document.getElementById("homeProfileToggle");
  const profilePanel = document.getElementById("homeProfilePanel");
  const backToTop = document.getElementById("backToTop");

  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  function toggleMenu(event) {
    event?.stopPropagation();
    if (!nav || !menuToggle) return;
    const isOpen = nav.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
    if (isOpen) {
      closeNotifications();
      closeProfile();
    }
  }

  function closeNotifications() {
    if (!notifyPanel || !notifyToggle) return;
    notifyPanel.classList.remove("active");
    notifyPanel.setAttribute("aria-hidden", "true");
    notifyToggle.setAttribute("aria-expanded", "false");
  }

  function toggleNotifications(event) {
    event.stopPropagation();
    if (!notifyPanel || !notifyToggle) return;
    const isOpen = notifyPanel.classList.toggle("active");
    notifyPanel.setAttribute("aria-hidden", String(!isOpen));
    notifyToggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      closeMenu();
      closeProfile();
    }
  }

  function closeProfile() {
    if (!profilePanel || !profileToggle) return;
    profilePanel.classList.remove("active");
    profilePanel.setAttribute("aria-hidden", "true");
    profileToggle.setAttribute("aria-expanded", "false");
  }

  function toggleProfile(event) {
    event.stopPropagation();
    if (!profilePanel || !profileToggle) return;
    const isOpen = profilePanel.classList.toggle("active");
    profilePanel.setAttribute("aria-hidden", String(!isOpen));
    profileToggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      closeMenu();
      closeNotifications();
    }
  }

  menuToggle?.addEventListener("click", toggleMenu);
  notifyToggle?.addEventListener("click", toggleNotifications);
  profileToggle?.addEventListener("click", toggleProfile);

  notifyPanel?.addEventListener("click", (event) => event.stopPropagation());
  profilePanel?.addEventListener("click", (event) => event.stopPropagation());

  markAllRead?.addEventListener("click", () => {
    document.querySelectorAll(".home-notification-item.unread").forEach((item) => {
      item.classList.remove("unread");
    });

    if (notifyCount) {
      notifyCount.textContent = "0";
      notifyCount.style.display = "none";
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      closeMenu();
      closeNotifications();
      closeProfile();

      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll("[data-scroll-target]").forEach((item) => {
    item.addEventListener("click", (event) => {
      if (event.target.closest("a, button, input, select, textarea")) return;
      const targetId = item.dataset.scrollTarget;
      const target = targetId ? document.querySelector(targetId) : null;
      if (!target) return;
      closeMenu();
      closeNotifications();
      closeProfile();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    item.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const targetId = item.dataset.scrollTarget;
      const target = targetId ? document.querySelector(targetId) : null;
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });



  document.querySelectorAll("[data-open-url]").forEach((item) => {
    item.addEventListener("click", (event) => {
      if (event.target.closest("a, button, input, select, textarea")) return;
      const url = item.dataset.openUrl;
      if (url) window.location.href = url;
    });

    item.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const url = item.dataset.openUrl;
      if (url) window.location.href = url;
    });
  });

  document.addEventListener("click", () => {
    closeMenu();
    closeNotifications();
    closeProfile();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeNotifications();
      closeProfile();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) closeMenu();
  });

  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle("show", window.scrollY > 420);
  }

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelectorAll(".card, .news-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      if (window.innerWidth > 760) card.style.transform = "translateY(-6px)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
});
