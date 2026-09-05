(() => {
  const moduleCards = [...document.querySelectorAll(".module-card")];
  const folders = [...document.querySelectorAll(".folder-card")];
  const documentsSection = document.querySelector("#documents-section");
  const documentsEmpty = document.querySelector("#documents-empty");

  const setActiveSection = (targetId, shouldScroll = true) => {
    const targetFolder = document.getElementById(targetId);
    if (!targetFolder) return;

    folders.forEach((folder) => {
      folder.classList.toggle("is-filtered-out", folder !== targetFolder);
    });

    if (documentsEmpty) documentsEmpty.hidden = true;

    moduleCards.forEach((card) => {
      const isActive = card.getAttribute("href") === `#${targetId}`;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-current", isActive ? "true" : "false");
      card.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    if (
      shouldScroll &&
      documentsSection &&
      window.matchMedia("(max-width: 900px)").matches
    ) {
      documentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  moduleCards.forEach((card) => {
    card.setAttribute("aria-current", "false");
    card.setAttribute("aria-selected", "false");
    card.addEventListener("click", (event) => {
      const targetId = card.getAttribute("href")?.slice(1);
      if (!targetId) return;

      event.preventDefault();
      setActiveSection(targetId);
      history.replaceState(null, "", `#${targetId}`);
    });
  });

  folders.forEach((folder) => folder.classList.add("is-filtered-out"));
  if (documentsEmpty) documentsEmpty.hidden = false;

  folders.forEach((folder) => {
    const fileList = folder.querySelector(".file-list");
    const fileCount = fileList?.querySelectorAll(".file-row").length || 0;
    fileList?.classList.toggle("file-list--two-column", fileCount > 2);
  });

  const initialTarget = window.location.hash.slice(1);
  if (folders.some((folder) => folder.id === initialTarget)) {
    setActiveSection(initialTarget, false);
  }

  const videoModal = document.querySelector("#videoModal");
  const openVideoModalBtn = document.querySelector("#openVideoModal");
  const closeVideoModalBtn = document.querySelector("#closeVideoModal");
  const videoModalBackdrop = document.querySelector("#videoModalBackdrop");
  const videoModalPlayer = document.querySelector("#videoModalPlayer");

  const openVideoModal = () => {
    if (!videoModal) return;
    videoModal.hidden = false;
    document.body.style.overflow = "hidden";
    videoModalPlayer?.play().catch(() => {});
  };

  const closeVideoModal = () => {
    if (!videoModal) return;
    videoModal.hidden = true;
    document.body.style.overflow = "";
    videoModalPlayer?.pause();
  };

  openVideoModalBtn?.addEventListener("click", openVideoModal);
  closeVideoModalBtn?.addEventListener("click", closeVideoModal);
  videoModalBackdrop?.addEventListener("click", closeVideoModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && videoModal && !videoModal.hidden) {
      closeVideoModal();
    }
  });
})();
