import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";

const PDF_WORKER = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER;

const documents = {
  "student-360": {
    file: "Student-360-Phan-tich-chan-dung-va-phan-loai.pdf",
    title: "Student 360",
    category: "PHÂN TÍCH THÍ SINH",
    group: "student",
  },
  "school-360": {
    file: "School-360-Phan-tich-dia-ban-va-quan-he-truong-THPT.pdf",
    title: "School 360",
    category: "PHÂN TÍCH TRƯỜNG",
    group: "school",
  },
  "school-index": {
    file: "Bo-chi-so-dinh-luong-School-360.pdf",
    title: "Bộ chỉ số định lượng School 360",
    category: "PHÂN TÍCH TRƯỜNG",
    group: "school",
  },
  "dashboard-charts": {
    file: "Thu-vien-bieu-do-chuan-dashboard-tuyen-sinh.pdf",
    title: "Thư viện biểu đồ chuẩn",
    category: "THƯ VIỆN BIỂU ĐỒ",
    group: "charts",
  },
  "school-charts": {
    file: "Thu-vien-bieu-do-School-360.pdf",
    title: "Thư viện biểu đồ School 360",
    category: "PHÂN TÍCH TRƯỜNG",
    group: "school",
  },
  "acquisition-map": {
    file: "Thu-vien-bieu-do-Acquisition-Map.pdf",
    title: "Thư viện biểu đồ Acquisition Map",
    category: "THƯ VIỆN BIỂU ĐỒ",
    group: "charts",
  },
};

const groups = {
  student: {
    title: "Phân tích thí sinh",
    documents: ["student-360"],
  },
  school: {
    title: "Phân tích trường",
    documents: ["school-360", "school-index", "school-charts"],
  },
  charts: {
    title: "Thư viện biểu đồ",
    documents: ["dashboard-charts", "acquisition-map"],
  },
};

const params = new URLSearchParams(window.location.search);
const documentInfo = documents[params.get("doc")];
const titleElement = document.querySelector("#viewerTitle");
const categoryElement = document.querySelector("#viewerCategory");
const stateElement = document.querySelector("#viewerState");
const stateTextElement = document.querySelector("#viewerStateText");
const pagesElement = document.querySelector("#pdfPages");
const nativeLink = document.querySelector("#nativeLink");
const relatedDocsElement = document.querySelector("#relatedDocs");

const showError = (message) => {
  stateElement.classList.add("is-error");
  stateElement.innerHTML = `<strong>${message}</strong><span>Hãy chạy trang bằng một máy chủ nội bộ, ví dụ <b>python3 -m http.server 4173</b>, rồi mở lại đường dẫn.</span>`;
};

if (!documentInfo) {
  document.title = "Không tìm thấy tài liệu · Kho tài liệu";
  titleElement.textContent = "Không tìm thấy tài liệu";
  stateElement.classList.add("is-error");
  stateElement.innerHTML = '<strong>Đường dẫn tài liệu không hợp lệ.</strong><a href="index.html">Quay lại kho tài liệu</a>';
} else {
  document.title = `${documentInfo.title} · Kho tài liệu`;
  titleElement.textContent = documentInfo.title;
  categoryElement.textContent = documentInfo.category;
  nativeLink.href = documentInfo.file;

  const group = groups[documentInfo.group];
  relatedDocsElement.innerHTML = `<span class="related-label">${group.title}:</span>`;
  group.documents.forEach((documentKey) => {
    const relatedDocument = documents[documentKey];
    if (documentKey === params.get("doc")) {
      const current = document.createElement("span");
      current.className = "related-current";
      current.textContent = relatedDocument.title;
      current.setAttribute("aria-current", "page");
      relatedDocsElement.appendChild(current);
      return;
    }

    const link = document.createElement("a");
    link.className = "related-link";
    link.href = `viewer.html?doc=${documentKey}`;
    link.textContent = relatedDocument.title;
    relatedDocsElement.appendChild(link);
  });

  const renderPage = async (pdf, pageNumber) => {
    const page = await pdf.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const availableWidth = Math.min(pagesElement.clientWidth, 1120);
    const cssScale = availableWidth / baseViewport.width;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const renderViewport = page.getViewport({ scale: cssScale * pixelRatio });
    const cssViewport = page.getViewport({ scale: cssScale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });
    canvas.className = "pdf-page";
    canvas.width = Math.floor(renderViewport.width);
    canvas.height = Math.floor(renderViewport.height);
    canvas.style.width = `${cssViewport.width}px`;
    canvas.style.height = `${cssViewport.height}px`;
    canvas.setAttribute("aria-label", `Trang ${pageNumber}`);
    pagesElement.appendChild(canvas);

    await page.render({ canvasContext: context, viewport: renderViewport }).promise;
  };

  const loadDocument = async () => {
    try {
      const pdf = await pdfjsLib.getDocument(documentInfo.file).promise;
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        stateTextElement.textContent = `Đang hiển thị trang ${pageNumber}/${pdf.numPages}...`;
        await renderPage(pdf, pageNumber);
      }
      stateElement.remove();
    } catch (error) {
      console.error(error);
      showError("Không thể hiển thị tài liệu PDF.");
    }
  };

  loadDocument();
}
