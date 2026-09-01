(() => {
  const searchInput = document.querySelector("#searchInput");
  const searchStatus = document.querySelector("#searchStatus");
  const emptyState = document.querySelector("#emptyState");
  const rows = [...document.querySelectorAll(".file-row")];
  const folders = [...document.querySelectorAll(".folder-card")];

  const normalize = (value) =>
    value
      .toLocaleLowerCase("vi")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");

  const updateSearch = () => {
  const rawQuery = searchInput.value.trim();
  const query = normalize(rawQuery);
  let visibleCount = 0;
  let visibleSectionCount = 0;

    rows.forEach((row) => {
      const matches = !query || normalize(row.dataset.search).includes(query);
      row.classList.toggle("is-hidden", !matches);
      if (matches) visibleCount += 1;
    });

  folders.forEach((folder) => {
    const hasVisibleRow = [...folder.querySelectorAll(".file-row")].some(
      (row) => !row.classList.contains("is-hidden"),
    );
    const matchesFolder = !query || normalize(folder.dataset.search).includes(query);
    const shouldShow = !query ? true : matchesFolder || hasVisibleRow;
    folder.classList.toggle("is-hidden", !shouldShow);
    if (shouldShow) visibleSectionCount += 1;
  });

    emptyState.hidden = visibleCount > 0 || visibleSectionCount > 0;
    if (!query) {
      searchStatus.textContent = "Có thể tìm theo tên tài liệu, nhóm nội dung hoặc từ khóa.";
  } else if (visibleCount === 0 && visibleSectionCount === 0) {
    searchStatus.textContent = "Không có tài liệu nào khớp với từ khóa này.";
  } else if (visibleCount === 0) {
    searchStatus.textContent = `${visibleSectionCount} section phù hợp với “${rawQuery}”.`;
    } else {
      searchStatus.textContent = `${visibleCount} tài liệu phù hợp với “${rawQuery}”.`;
    }
  };

  searchInput.addEventListener("input", updateSearch);

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== searchInput) {
      event.preventDefault();
      searchInput.focus();
    }
  });

  updateSearch();
})();
