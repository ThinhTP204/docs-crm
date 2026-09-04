import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";

const PDF_WORKER = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER;

const documents = {
  "student-360": {
    file: "Student-360-Phan-tich-chan-dung-va-phan-loai.pdf",
    title: "Student 360",
    category: "STUDENT",
    group: "student",
  },
  "school-360": {
    file: "School-360-Phan-tich-dia-ban-va-quan-he-truong-THPT.pdf",
    title: "School 360",
    category: "SCHOOL",
    group: "school",
  },
  "school-index": {
    file: "Bo-chi-so-dinh-luong-School-360.pdf",
    title: "Bộ chỉ số định lượng School 360",
    category: "SCHOOL",
    group: "school",
  },
  "dashboard-charts": {
    file: "Thu-vien-bieu-do-chuan-dashboard-tuyen-sinh.pdf",
    title: "Thư viện biểu đồ chuẩn",
    category: "DASHBOARD",
    group: "dashboard",
  },
  "manager-control-center": {
    file: "new/Trung-tam-dieu-khien-va-quan-tri-cap-Manager.pdf",
    title: "Trung tâm điều khiển và quản trị cấp Manager",
    category: "DASHBOARD",
    group: "dashboard",
  },
  "school-charts": {
    file: "Thu-vien-bieu-do-School-360.pdf",
    title: "Thư viện biểu đồ School 360",
    category: "SCHOOL",
    group: "school",
  },
  "acquisition-map": {
    file: "Thu-vien-bieu-do-Acquisition-Map.pdf",
    title: "Thư viện biểu đồ Acquisition Map",
    category: "MARKETING",
    group: "charts",
  },
  "ai-native-crm": {
    file: "Nguyen-ly-thiet-ke-AI-Native-CRM-v3.pdf",
    title: "Nguyên lý thiết kế AI-Native CRM",
    category: "THIẾT KẾ HỆ THỐNG",
    group: "design",
  },
  "crud-lead-permission": {
    file: "Ma-tran-CRUD-phan-quyen-Lead.pdf",
    title: "Ma trận CRUD phân quyền Lead",
    category: "THIẾT KẾ HỆ THỐNG",
    group: "design",
  },
  "student-data-policy": {
    file: "Chinh-sach-du-lieu-hoc-sinh_1.pdf",
    title: "Chính sách dữ liệu học sinh",
    category: "CHÍNH SÁCH",
    group: "policy",
  },
  "sale-process": {
    file: "Quy-trinh-van-hanh-Bo-phan-Sale.pdf",
    title: "Quy trình vận hành Bộ phận Sale",
    category: "STUDENT",
    group: "student",
  },
  "marketing-process": {
    file: "Quy-trinh-van-hanh-Bo-phan-Marketing.pdf",
    title: "Quy trình vận hành Bộ phận Marketing",
    category: "MARKETING",
    group: "marketing",
  },
  "pr-process": {
    file: "Quy-trinh-van-hanh-Bo-phan-PR.pdf",
    title: "Quy trình vận hành Bộ phận PR",
    category: "OFFLINE",
    group: "offline",
  },
};

const groups = {
  student: {
    title: "Student",
    documents: ["student-360", "sale-process"],
  },
  school: {
    title: "School",
    documents: ["school-360", "school-index", "school-charts"],
  },
  charts: {
    title: "Biểu đồ",
    documents: ["acquisition-map"],
  },
  dashboard: {
    title: "Dashboard",
    documents: ["dashboard-charts", "manager-control-center"],
  },
  design: {
    title: "Thiết kế hệ thống",
    documents: ["ai-native-crm"],
  },
  policy: {
    title: "Chính sách",
    documents: ["student-data-policy"],
  },
  marketing: {
    title: "Marketing",
    documents: ["marketing-process"],
  },
  offline: {
    title: "Offline",
    documents: ["pr-process"],
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
  document.title = "Không tìm thấy tài liệu · FAIP";
  titleElement.textContent = "Không tìm thấy tài liệu";
  stateElement.classList.add("is-error");
  stateElement.innerHTML = '<strong>Đường dẫn tài liệu không hợp lệ.</strong><a href="index.html">Quay lại kho tài liệu</a>';
} else {
  document.title = `${documentInfo.title} · FAIP`;
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
