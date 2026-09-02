(() => {
  const moduleCards = [...document.querySelectorAll(".module-card")];
  const folders = [...document.querySelectorAll(".folder-card")];
  const documentsSection = document.querySelector("#documents-section");
  const documentsEmpty = document.querySelector("#documents-empty");
  const documentsContext = document.querySelector("#documents-context");
  const selectedModuleNumber = document.querySelector("#selected-module-number");
  const selectedModuleTitle = document.querySelector("#selected-module-title");
  const selectedModuleCount = document.querySelector("#selected-module-count");

  const setActiveSection = (targetId, shouldScroll = true) => {
    const targetFolder = document.getElementById(targetId);
    if (!targetFolder) return;

    folders.forEach((folder) => {
      folder.classList.toggle("is-filtered-out", folder !== targetFolder);
    });

    if (documentsEmpty) documentsEmpty.hidden = true;
    if (documentsContext) documentsContext.hidden = false;
    if (documentsSection) documentsSection.classList.add("has-selection");

    moduleCards.forEach((card) => {
      const isActive = card.getAttribute("href") === `#${targetId}`;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-current", isActive ? "true" : "false");

      if (isActive) {
        if (selectedModuleNumber) {
          selectedModuleNumber.textContent = card.querySelector(".module-number")?.textContent.trim() || "";
        }
        if (selectedModuleTitle) {
          selectedModuleTitle.textContent = card.querySelector("strong")?.textContent.trim() || "";
        }
      }
    });

    if (selectedModuleCount) {
      const fileCount = targetFolder.querySelectorAll(".file-row").length;
      selectedModuleCount.textContent = `${String(fileCount).padStart(2, "0")} tài liệu`;
    }

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
  if (documentsContext) documentsContext.hidden = true;
  if (documentsSection) documentsSection.classList.remove("has-selection");

  const initialTarget = window.location.hash.slice(1);
  if (folders.some((folder) => folder.id === initialTarget)) {
    setActiveSection(initialTarget, false);
  }
})();
