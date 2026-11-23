/**
 * HỆ THỐNG QUẢN LÝ THƯ VIỆN - JAVASCRIPT THUẦN (VANILLA JS)
 * Lưu trữ dữ liệu: LocalStorage
 */

// ==========================================
// 1. DỮ LIỆU KHỞI TẠO (MẪU)
// ==========================================
const DEFAULT_BOOKS = [
  { id: "b1", code: "BK001", title: "Đắc Nhân Tâm", author: "Dale Carnegie", category: "Kỹ năng sống", year: 2020, totalQuantity: 5 },
  { id: "b2", code: "BK002", title: "Nhà Giả Kim", author: "Paulo Coelho", category: "Văn học", year: 2018, totalQuantity: 3 },
  { id: "b3", code: "BK003", title: "Clean Code", author: "Robert C. Martin", category: "Công nghệ", year: 2019, totalQuantity: 4 },
  { id: "b4", code: "BK004", title: "Lược Sử Loài Người", author: "Yuval Noah Harari", category: "Khoa học", year: 2021, totalQuantity: 4 },
  { id: "b5", code: "BK005", title: "Cha Giàu Cha Nghèo", author: "Robert Kiyosaki", category: "Kinh tế", year: 2022, totalQuantity: 5 },
  { id: "b6", code: "BK006", title: "Đại Việt Sử Ký Toàn Thư", author: "Ngô Sĩ Liên", category: "Lịch sử", year: 2017, totalQuantity: 2 }
];

const DEFAULT_READERS = [
  { id: "r1", code: "DG001", name: "Nguyễn Văn An", email: "an.nguyen@gmail.com", phone: "0901234567", createdAt: "2024-01-15" },
  { id: "r2", code: "DG002", name: "Trần Thị Mai", email: "mai.tran@gmail.com", phone: "0912345678", createdAt: "2024-02-20" },
  { id: "r3", code: "DG003", name: "Lê Hoàng Long", email: "long.le@gmail.com", phone: "0987654321", createdAt: "2024-03-10" },
  { id: "r4", code: "DG004", name: "Phạm Thu Trang", email: "trang.pham@gmail.com", phone: "0933445566", createdAt: "2024-04-05" }
];

function getSampleBorrows() {
  const today = new Date();
  const formatDate = (d) => d.toISOString().split('T')[0];

  const borrowDate1 = new Date();
  borrowDate1.setDate(today.getDate() - 5);
  const dueDate1 = new Date();
  dueDate1.setDate(today.getDate() + 9);

  const borrowDate2 = new Date();
  borrowDate2.setDate(today.getDate() - 20);
  const dueDate2 = new Date();
  dueDate2.setDate(today.getDate() - 6); // Đã quá hạn

  const borrowDate3 = new Date();
  borrowDate3.setDate(today.getDate() - 14);
  const dueDate3 = new Date();
  dueDate3.setDate(today.getDate());
  const returnDate3 = new Date();
  returnDate3.setDate(today.getDate() - 2);

  return [
    {
      id: "br1",
      code: "PM001",
      readerId: "r1",
      bookId: "b1",
      borrowDate: formatDate(borrowDate1),
      dueDate: formatDate(dueDate1),
      returnDate: null,
      status: "borrowed"
    },
    {
      id: "br2",
      code: "PM002",
      readerId: "r2",
      bookId: "b3",
      borrowDate: formatDate(borrowDate2),
      dueDate: formatDate(dueDate2),
      returnDate: null,
      status: "borrowed"
    },
    {
      id: "br3",
      code: "PM003",
      readerId: "r3",
      bookId: "b2",
      borrowDate: formatDate(borrowDate3),
      dueDate: formatDate(dueDate3),
      returnDate: formatDate(returnDate3),
      status: "returned"
    }
  ];
}

// ==========================================
// 2. QUẢN LÝ TRẠNG THÁI & LOCALSTORAGE
// ==========================================
class LibraryStore {
  constructor() {
    this.initStore();
  }

  initStore(forceReset = false) {
    if (forceReset || !localStorage.getItem("lib_books")) {
      localStorage.setItem("lib_books", JSON.stringify(DEFAULT_BOOKS));
      localStorage.setItem("lib_readers", JSON.stringify(DEFAULT_READERS));
      localStorage.setItem("lib_borrows", JSON.stringify(getSampleBorrows()));
    }
  }

  getBooks() {
    return JSON.parse(localStorage.getItem("lib_books")) || [];
  }

  saveBooks(books) {
    localStorage.setItem("lib_books", JSON.stringify(books));
  }

  getReaders() {
    return JSON.parse(localStorage.getItem("lib_readers")) || [];
  }

  saveReaders(readers) {
    localStorage.setItem("lib_readers", JSON.stringify(readers));
  }

  getBorrows() {
    return JSON.parse(localStorage.getItem("lib_borrows")) || [];
  }

  saveBorrows(borrows) {
    localStorage.setItem("lib_borrows", JSON.stringify(borrows));
  }

  // Tính số sách đang mượn của một đầu sách
  getBookActiveBorrowCount(bookId) {
    const borrows = this.getBorrows();
    return borrows.filter(b => b.bookId === bookId && b.status === "borrowed").length;
  }

  // Tính số lượng còn lại khả dụng của cuốn sách
  getBookAvailable(book) {
    const activeBorrows = this.getBookActiveBorrowCount(book.id);
    return Math.max(0, book.totalQuantity - activeBorrows);
  }

  // Tính số sách một độc giả đang mượn
  getReaderActiveBorrowCount(readerId) {
    const borrows = this.getBorrows();
    return borrows.filter(b => b.readerId === readerId && b.status === "borrowed").length;
  }
}

const store = new LibraryStore();

// ==========================================
// 3. TIỆN ÍCH HỖ TRỢ (HELPERS)
// ==========================================
function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function getTodayString() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function getFutureDateString(days = 14) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let icon = "✅";
  if (type === "error") icon = "❌";
  if (type === "warning") icon = "⚠️";

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Modal xác nhận
let pendingConfirmAction = null;
function openConfirmModal(title, message, onConfirm) {
  document.getElementById("confirm-title").textContent = title;
  document.getElementById("confirm-message").textContent = message;
  pendingConfirmAction = onConfirm;
  openModal("modal-confirm");
}

document.getElementById("btn-agree-confirm").addEventListener("click", () => {
  if (typeof pendingConfirmAction === "function") {
    pendingConfirmAction();
  }
  closeModal("modal-confirm");
});

document.getElementById("btn-cancel-confirm").addEventListener("click", () => {
  closeModal("modal-confirm");
});

// Modal helpers
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("active");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("active");
}

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetModal = btn.getAttribute("data-close");
    closeModal(targetModal);
  });
});

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop")) {
    e.target.parentElement.classList.remove("active");
  }
});

// ==========================================
// 4. CHUYỂN ĐỔI TAB
// ==========================================
function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const target = btn.getAttribute("data-tab");
      document.getElementById(target).classList.add("active");
    });
  });
}

// ==========================================
// 5. CẬP NHẬT THỐNG KÊ (STATS BAR)
// ==========================================
function updateDashboardStats() {
  const books = store.getBooks();
  const readers = store.getReaders();
  const borrows = store.getBorrows();

  const totalBooksCount = books.reduce((acc, b) => acc + Number(b.totalQuantity || 0), 0);
  const activeBorrows = borrows.filter(b => b.status === "borrowed");
  const availableBooksCount = Math.max(0, totalBooksCount - activeBorrows.length);

  document.getElementById("stat-total-books").textContent = books.length;
  document.getElementById("stat-avail-books").textContent = availableBooksCount;
  document.getElementById("stat-total-readers").textContent = readers.length;
  document.getElementById("stat-active-borrows").textContent = activeBorrows.length;
}

// ==========================================
// 6. QUẢN LÝ SÁCH (TAB 1)
// ==========================================
function renderBooks() {
  const tbody = document.getElementById("books-table-body");
  const emptyState = document.getElementById("books-empty");
  const search = document.getElementById("book-search").value.toLowerCase().trim();
  const categoryFilter = document.getElementById("book-filter-category").value;
  const statusFilter = document.getElementById("book-filter-status").value;

  const books = store.getBooks();
  tbody.innerHTML = "";

  const filteredBooks = books.filter(b => {
    const matchSearch = (
      b.title.toLowerCase().includes(search) ||
      b.author.toLowerCase().includes(search) ||
      b.code.toLowerCase().includes(search)
    );
    const matchCategory = !categoryFilter || b.category === categoryFilter;
    const avail = store.getBookAvailable(b);
    let matchStatus = true;
    if (statusFilter === "available") matchStatus = avail > 0;
    if (statusFilter === "unavailable") matchStatus = avail === 0;

    return matchSearch && matchCategory && matchStatus;
  });

  if (filteredBooks.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    filteredBooks.forEach(book => {
      const avail = store.getBookAvailable(book);
      const isAvailable = avail > 0;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="badge-code">${escapeHtml(book.code)}</span></td>
        <td><strong>${escapeHtml(book.title)}</strong></td>
        <td>${escapeHtml(book.author)}</td>
        <td><span class="badge badge-category">${escapeHtml(book.category)}</span></td>
        <td>${book.year}</td>
        <td><strong>${avail}</strong> / ${book.totalQuantity}</td>
        <td>
          <span class="badge ${isAvailable ? 'badge-success' : 'badge-danger'}">
            ${isAvailable ? `● Còn sách (${avail})` : '● Hết sách'}
          </span>
        </td>
        <td class="text-right">
          <div class="table-actions">
            <button class="btn-action btn-edit" onclick="editBook('${book.id}')">✏️ Sửa</button>
            <button class="btn-action btn-del" onclick="deleteBook('${book.id}')">🗑️ Xóa</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  updateDashboardStats();
}

function openAddBookModal() {
  document.getElementById("modal-book-title").textContent = "Thêm Sách Mới";
  document.getElementById("form-book").reset();
  document.getElementById("book-id").value = "";
  
  // Tự động gợi ý mã sách tiếp theo
  const books = store.getBooks();
  const nextNum = books.length + 1;
  document.getElementById("book-code").value = `BK${String(nextNum).padStart(3, "0")}`;
  document.getElementById("book-year").value = new Date().getFullYear();
  document.getElementById("book-quantity").value = 5;

  openModal("modal-book");
}

function editBook(id) {
  const books = store.getBooks();
  const book = books.find(b => b.id === id);
  if (!book) return;

  document.getElementById("modal-book-title").textContent = "Chỉnh Sửa Sách";
  document.getElementById("book-id").value = book.id;
  document.getElementById("book-code").value = book.code;
  document.getElementById("book-title").value = book.title;
  document.getElementById("book-author").value = book.author;
  document.getElementById("book-category").value = book.category;
  document.getElementById("book-year").value = book.year;
  document.getElementById("book-quantity").value = book.totalQuantity;

  openModal("modal-book");
}

function handleSaveBook(e) {
  e.preventDefault();
  const id = document.getElementById("book-id").value;
  const code = document.getElementById("book-code").value.trim().toUpperCase();
  const title = document.getElementById("book-title").value.trim();
  const author = document.getElementById("book-author").value.trim();
  const category = document.getElementById("book-category").value;
  const year = parseInt(document.getElementById("book-year").value, 10);
  const totalQuantity = parseInt(document.getElementById("book-quantity").value, 10);

  let books = store.getBooks();

  // Kiểm tra trùng mã sách
  const duplicate = books.find(b => b.code.toUpperCase() === code && b.id !== id);
  if (duplicate) {
    showToast(`Mã sách ${code} đã tồn tại! Vui lòng chọn mã khác.`, "error");
    return;
  }

  if (id) {
    // Chỉnh sửa sách
    const bookIndex = books.findIndex(b => b.id === id);
    if (bookIndex !== -1) {
      // Kiểm tra nếu giảm số lượng nhỏ hơn số lượng đang mượn
      const activeBorrows = store.getBookActiveBorrowCount(id);
      if (totalQuantity < activeBorrows) {
        showToast(`Không thể đặt số lượng (${totalQuantity}) nhỏ hơn số sách đang được mượn (${activeBorrows})!`, "warning");
        return;
      }

      books[bookIndex] = { ...books[bookIndex], code, title, author, category, year, totalQuantity };
      store.saveBooks(books);
      showToast("Cập nhật thông tin sách thành công!", "success");
    }
  } else {
    // Thêm mới
    const newBook = {
      id: generateId("b"),
      code,
      title,
      author,
      category,
      year,
      totalQuantity
    };
    books.push(newBook);
    store.saveBooks(books);
    showToast("Thêm sách mới thành công!", "success");
  }

  closeModal("modal-book");
  renderBooks();
}

function deleteBook(id) {
  const books = store.getBooks();
  const book = books.find(b => b.id === id);
  if (!book) return;

  const activeBorrows = store.getBookActiveBorrowCount(id);
  if (activeBorrows > 0) {
    showToast(`Không thể xóa cuốn "${book.title}" vì đang có ${activeBorrows} độc giả mượn!`, "error");
    return;
  }

  openConfirmModal(
    "Xóa Cuốn Sách",
    `Bạn có chắc chắn muốn xóa cuốn sách "${book.title}" (Mã: ${book.code}) không?`,
    () => {
      const updated = books.filter(b => b.id !== id);
      store.saveBooks(updated);
      showToast("Đã xóa cuốn sách thành công!", "success");
      renderBooks();
    }
  );
}

// ==========================================
// 7. QUẢN LÝ ĐỘC GIẢ (TAB 2)
// ==========================================
function renderReaders() {
  const tbody = document.getElementById("readers-table-body");
  const emptyState = document.getElementById("readers-empty");
  const search = document.getElementById("reader-search").value.toLowerCase().trim();

  const readers = store.getReaders();
  tbody.innerHTML = "";

  const filteredReaders = readers.filter(r => (
    r.name.toLowerCase().includes(search) ||
    r.code.toLowerCase().includes(search) ||
    r.email.toLowerCase().includes(search) ||
    r.phone.includes(search)
  ));

  if (filteredReaders.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    filteredReaders.forEach(reader => {
      const activeBorrowCount = store.getReaderActiveBorrowCount(reader.id);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="badge-code">${escapeHtml(reader.code)}</span></td>
        <td><strong>${escapeHtml(reader.name)}</strong></td>
        <td>${escapeHtml(reader.email)}</td>
        <td>${escapeHtml(reader.phone)}</td>
        <td>${formatDateDisplay(reader.createdAt)}</td>
        <td>
          <span class="badge ${activeBorrowCount > 0 ? 'badge-warning' : 'badge-secondary'}">
            ${activeBorrowCount > 0 ? `📖 Đang mượn: ${activeBorrowCount}` : 'Chưa mượn'}
          </span>
        </td>
        <td class="text-right">
          <div class="table-actions">
            <button class="btn-action btn-edit" onclick="editReader('${reader.id}')">✏️ Sửa</button>
            <button class="btn-action btn-del" onclick="deleteReader('${reader.id}')">🗑️ Xóa</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  updateDashboardStats();
}

function openAddReaderModal() {
  document.getElementById("modal-reader-title").textContent = "Thêm Độc Giả Mới";
  document.getElementById("form-reader").reset();
  document.getElementById("reader-id").value = "";

  const readers = store.getReaders();
  const nextNum = readers.length + 1;
  document.getElementById("reader-code").value = `DG${String(nextNum).padStart(3, "0")}`;

  openModal("modal-reader");
}

function editReader(id) {
  const readers = store.getReaders();
  const reader = readers.find(r => r.id === id);
  if (!reader) return;

  document.getElementById("modal-reader-title").textContent = "Chỉnh Sửa Độc Giả";
  document.getElementById("reader-id").value = reader.id;
  document.getElementById("reader-code").value = reader.code;
  document.getElementById("reader-name").value = reader.name;
  document.getElementById("reader-email").value = reader.email;
  document.getElementById("reader-phone").value = reader.phone;

  openModal("modal-reader");
}

function handleSaveReader(e) {
  e.preventDefault();
  const id = document.getElementById("reader-id").value;
  const code = document.getElementById("reader-code").value.trim().toUpperCase();
  const name = document.getElementById("reader-name").value.trim();
  const email = document.getElementById("reader-email").value.trim();
  const phone = document.getElementById("reader-phone").value.trim();

  let readers = store.getReaders();

  // Kiểm tra trùng mã độc giả
  const duplicate = readers.find(r => r.code.toUpperCase() === code && r.id !== id);
  if (duplicate) {
    showToast(`Mã độc giả ${code} đã tồn tại! Vui lòng chọn mã khác.`, "error");
    return;
  }

  if (id) {
    const idx = readers.findIndex(r => r.id === id);
    if (idx !== -1) {
      readers[idx] = { ...readers[idx], code, name, email, phone };
      store.saveReaders(readers);
      showToast("Cập nhật thông tin độc giả thành công!", "success");
    }
  } else {
    const newReader = {
      id: generateId("r"),
      code,
      name,
      email,
      phone,
      createdAt: getTodayString()
    };
    readers.push(newReader);
    store.saveReaders(readers);
    showToast("Thêm độc giả mới thành công!", "success");
  }

  closeModal("modal-reader");
  renderReaders();
}

function deleteReader(id) {
  const readers = store.getReaders();
  const reader = readers.find(r => r.id === id);
  if (!reader) return;

  const activeBorrows = store.getReaderActiveBorrowCount(id);
  if (activeBorrows > 0) {
    showToast(`Không thể xóa độc giả "${reader.name}" vì chưa hoàn trả ${activeBorrows} cuốn sách!`, "error");
    return;
  }

  openConfirmModal(
    "Xóa Độc Giả",
    `Bạn có chắc chắn muốn xóa độc giả "${reader.name}" (Mã: ${reader.code}) không?`,
    () => {
      const updated = readers.filter(r => r.id !== id);
      store.saveReaders(updated);
      showToast("Đã xóa độc giả thành công!", "success");
      renderReaders();
    }
  );
}

// ==========================================
// 8. QUẢN LÝ MƯỢN / TRẢ SÁCH (TAB 3)
// ==========================================
function renderBorrows() {
  const tbody = document.getElementById("borrows-table-body");
  const emptyState = document.getElementById("borrows-empty");
  const search = document.getElementById("borrow-search").value.toLowerCase().trim();
  const statusFilter = document.getElementById("borrow-filter-status").value;

  const borrows = store.getBorrows();
  const books = store.getBooks();
  const readers = store.getReaders();
  const todayStr = getTodayString();

  tbody.innerHTML = "";

  const bookMap = new Map(books.map(b => [b.id, b]));
  const readerMap = new Map(readers.map(r => [r.id, r]));

  const filteredBorrows = borrows.filter(b => {
    const reader = readerMap.get(b.readerId);
    const book = bookMap.get(b.bookId);

    const readerName = reader ? reader.name.toLowerCase() : "";
    const bookTitle = book ? book.title.toLowerCase() : "";
    const code = b.code.toLowerCase();

    const matchSearch = readerName.includes(search) || bookTitle.includes(search) || code.includes(search);

    let currentStatus = b.status;
    if (b.status === "borrowed" && b.dueDate < todayStr) {
      currentStatus = "overdue";
    }

    let matchStatus = true;
    if (statusFilter === "borrowed") matchStatus = (b.status === "borrowed" && b.dueDate >= todayStr);
    if (statusFilter === "returned") matchStatus = (b.status === "returned");
    if (statusFilter === "overdue") matchStatus = (b.status === "borrowed" && b.dueDate < todayStr);

    return matchSearch && matchStatus;
  });

  if (filteredBorrows.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    // Sắp xếp: phiếu đang mượn lên trước
    filteredBorrows.sort((a, b) => {
      if (a.status === "borrowed" && b.status !== "borrowed") return -1;
      if (a.status !== "borrowed" && b.status === "borrowed") return 1;
      return new Date(b.borrowDate) - new Date(a.borrowDate);
    });

    filteredBorrows.forEach(borrow => {
      const reader = readerMap.get(borrow.readerId);
      const book = bookMap.get(borrow.bookId);

      const isOverdue = borrow.status === "borrowed" && borrow.dueDate < todayStr;
      let statusBadge = "";
      if (borrow.status === "returned") {
        statusBadge = '<span class="badge badge-success">✓ Đã trả</span>';
      } else if (isOverdue) {
        statusBadge = '<span class="badge badge-danger">⚠️ Quá hạn</span>';
      } else {
        statusBadge = '<span class="badge badge-warning">⏳ Đang mượn</span>';
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="badge-code">${escapeHtml(borrow.code)}</span></td>
        <td>
          <strong>${reader ? escapeHtml(reader.name) : "Độc giả không tồn tại"}</strong>
          <br><small class="text-muted">${reader ? reader.code : ""}</small>
        </td>
        <td>
          <strong>${book ? escapeHtml(book.title) : "Sách không tồn tại"}</strong>
          <br><small class="text-muted">${book ? book.code : ""}</small>
        </td>
        <td>${formatDateDisplay(borrow.borrowDate)}</td>
        <td>${formatDateDisplay(borrow.dueDate)}</td>
        <td>${borrow.returnDate ? formatDateDisplay(borrow.returnDate) : "-"}</td>
        <td>${statusBadge}</td>
        <td class="text-right">
          <div class="table-actions">
            ${borrow.status === "borrowed"
              ? `<button class="btn-action btn-return" onclick="returnBook('${borrow.id}')">📥 Trả sách</button>`
              : `<button class="btn-action btn-del" onclick="deleteBorrowRecord('${borrow.id}')">🗑️ Xóa</button>`
            }
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  updateDashboardStats();
}

function openAddBorrowModal() {
  const books = store.getBooks();
  const readers = store.getReaders();

  if (readers.length === 0) {
    showToast("Chưa có độc giả nào. Vui lòng thêm độc giả trước!", "warning");
    return;
  }

  if (books.length === 0) {
    showToast("Thư viện chưa có sách. Vui lòng thêm sách trước!", "warning");
    return;
  }

  // Populate readers
  const readerSelect = document.getElementById("borrow-reader-select");
  readerSelect.innerHTML = readers.map(r => 
    `<option value="${r.id}">${escapeHtml(r.name)} (${r.code})</option>`
  ).join("");

  // Populate available books
  const bookSelect = document.getElementById("borrow-book-select");
  const availableBooks = books.filter(b => store.getBookAvailable(b) > 0);

  if (availableBooks.length === 0) {
    showToast("Tất cả sách hiện đã được mượn hết!", "warning");
    return;
  }

  bookSelect.innerHTML = availableBooks.map(b => {
    const avail = store.getBookAvailable(b);
    return `<option value="${b.id}">${escapeHtml(b.title)} - [Còn: ${avail}/${b.totalQuantity}]</option>`;
  }).join("");

  // Mã phiếu tự sinh
  const borrows = store.getBorrows();
  const nextNum = borrows.length + 1;
  document.getElementById("borrow-code").value = `PM${String(nextNum).padStart(3, "0")}`;

  // Ngày mượn & hạn trả mặc định
  document.getElementById("borrow-date").value = getTodayString();
  document.getElementById("borrow-due-date").value = getFutureDateString(14);

  openModal("modal-borrow");
}

function handleSaveBorrow(e) {
  e.preventDefault();
  const code = document.getElementById("borrow-code").value.trim().toUpperCase();
  const readerId = document.getElementById("borrow-reader-select").value;
  const bookId = document.getElementById("borrow-book-select").value;
  const borrowDate = document.getElementById("borrow-date").value;
  const dueDate = document.getElementById("borrow-due-date").value;

  if (dueDate < borrowDate) {
    showToast("Hạn trả không thể trước ngày mượn!", "error");
    return;
  }

  const books = store.getBooks();
  const book = books.find(b => b.id === bookId);
  if (!book || store.getBookAvailable(book) <= 0) {
    showToast("Sách này hiện không còn cuốn nào sẵn sàng để mượn!", "error");
    return;
  }

  const borrows = store.getBorrows();
  const newBorrow = {
    id: generateId("br"),
    code,
    readerId,
    bookId,
    borrowDate,
    dueDate,
    returnDate: null,
    status: "borrowed"
  };

  borrows.push(newBorrow);
  store.saveBorrows(borrows);

  showToast("Lập phiếu mượn sách thành công!", "success");
  closeModal("modal-borrow");

  renderBorrows();
  renderBooks(); // Cập nhật lại số lượng sách còn lại
  renderReaders(); // Cập nhật số sách độc giả đang mượn
}

function returnBook(borrowId) {
  const borrows = store.getBorrows();
  const borrow = borrows.find(b => b.id === borrowId);
  if (!borrow) return;

  const books = store.getBooks();
  const readers = store.getReaders();
  const book = books.find(b => b.id === borrow.bookId);
  const reader = readers.find(r => r.id === borrow.readerId);

  const bookTitle = book ? book.title : "cuốn sách này";
  const readerName = reader ? reader.name : "độc giả";

  openConfirmModal(
    "Xác Nhận Trả Sách",
    `Xác nhận độc giả "${readerName}" đã trả "${bookTitle}" vào kho thư viện?`,
    () => {
      borrow.status = "returned";
      borrow.returnDate = getTodayString();
      store.saveBorrows(borrows);

      showToast(`Đã nhận lại sách "${bookTitle}" thành công!`, "success");
      renderBorrows();
      renderBooks();
      renderReaders();
    }
  );
}

function deleteBorrowRecord(borrowId) {
  openConfirmModal(
    "Xóa Phiếu Mượn",
    "Bạn có chắc chắn muốn xóa bản ghi phiếu mượn đã hoàn tất này?",
    () => {
      let borrows = store.getBorrows();
      borrows = borrows.filter(b => b.id !== borrowId);
      store.saveBorrows(borrows);
      showToast("Đã xóa bản ghi phiếu mượn!", "success");
      renderBorrows();
    }
  );
}

// ==========================================
// 9. BẢO MẬT & ESCAPE HTML
// ==========================================
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================
// 10. KHỞI TẠO SỰ KIỆN TOÀN CỤC (INIT)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  // Nút mở modal
  document.getElementById("btn-add-book").addEventListener("click", openAddBookModal);
  document.getElementById("btn-add-reader").addEventListener("click", openAddReaderModal);
  document.getElementById("btn-add-borrow").addEventListener("click", openAddBorrowModal);

  // Form submit
  document.getElementById("form-book").addEventListener("submit", handleSaveBook);
  document.getElementById("form-reader").addEventListener("submit", handleSaveReader);
  document.getElementById("form-borrow").addEventListener("submit", handleSaveBorrow);

  // Bộ lọc & Tìm kiếm Sách
  document.getElementById("book-search").addEventListener("input", renderBooks);
  document.getElementById("book-filter-category").addEventListener("change", renderBooks);
  document.getElementById("book-filter-status").addEventListener("change", renderBooks);

  // Bộ lọc & Tìm kiếm Độc giả
  document.getElementById("reader-search").addEventListener("input", renderReaders);

  // Bộ lọc & Tìm kiếm Mượn/Trả
  document.getElementById("borrow-search").addEventListener("input", renderBorrows);
  document.getElementById("borrow-filter-status").addEventListener("change", renderBorrows);

  // Cài lại dữ liệu mẫu
  document.getElementById("btn-reset-data").addEventListener("click", () => {
    openConfirmModal(
      "Khôi Phục Dữ Liệu Mẫu",
      "Hành động này sẽ xóa toàn bộ dữ liệu hiện tại và nạp lại danh sách sách, độc giả mẫu ban đầu. Bạn có đồng ý?",
      () => {
        store.initStore(true);
        showToast("Đã khôi phục dữ liệu mẫu thành công!", "success");
        renderBooks();
        renderReaders();
        renderBorrows();
      }
    );
  });

  // Render dữ liệu lần đầu
  renderBooks();
  renderReaders();
  renderBorrows();
});

// Cho phép gọi từ HTML inline onclick (expose global functions)
window.editBook = editBook;
window.deleteBook = deleteBook;
window.editReader = editReader;
window.deleteReader = deleteReader;
window.returnBook = returnBook;
window.deleteBorrowRecord = deleteBorrowRecord;
