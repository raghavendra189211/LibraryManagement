// Retrieve books from localStorage or load default sample data
let books = JSON.parse(localStorage.getItem('libraryBooks')) || [
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    genre: 'Science',
    status: 'Available'
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    genre: 'Fiction',
    status: 'Borrowed'
  }
];

const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
const searchInput = document.getElementById('search-input');
const bookCount = document.getElementById('book-count');

// Save books array to localStorage
function saveBooks() {
  localStorage.setItem('libraryBooks', JSON.stringify(books));
}

// Render the books table
function renderBooks(filterText = '') {
  bookList.innerHTML = '';
  const query = filterText.toLowerCase();

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query) ||
    book.isbn.toLowerCase().includes(query)
  );

  bookCount.textContent = filteredBooks.length;

  if (filteredBooks.length === 0) {
    bookList.innerHTML = `<tr><td colspan="6" style="text-align:center;">No books found.</td></tr>`;
    return;
  }

  filteredBooks.forEach(book => {
    const row = document.createElement('tr');
    const badgeClass = book.status === 'Available' ? 'badge-available' : 'badge-borrowed';
    const actionLabel = book.status === 'Available' ? 'Borrow' : 'Return';

    row.innerHTML = `
      <td><strong>${book.title}</strong></td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td>${book.genre}</td>
      <td><span class="badge ${badgeClass}">${book.status}</span></td>
      <td>
        <button class="btn btn-toggle" onclick="toggleStatus(${book.id})">${actionLabel}</button>
        <button class="btn btn-delete" onclick="deleteBook(${book.id})">Delete</button>
      </td>
    `;
    bookList.appendChild(row);
  });
}

// Add a new book
bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newBook = {
    id: Date.now(),
    title: document.getElementById('title').value.trim(),
    author: document.getElementById('author').value.trim(),
    isbn: document.getElementById('isbn').value.trim(),
    genre: document.getElementById('genre').value,
    status: 'Available'
  };

  books.push(newBook);
  saveBooks();
  renderBooks(searchInput.value);
  bookForm.reset();
});

// Toggle Available / Borrowed status
function toggleStatus(id) {
  books = books.map(book => {
    if (book.id === id) {
      return {
        ...book,
        status: book.status === 'Available' ? 'Borrowed' : 'Available'
      };
    }
    return book;
  });

  saveBooks();
  renderBooks(searchInput.value);
}

// Delete a book
function deleteBook(id) {
  books = books.filter(book => book.id !== id);
  saveBooks();
  renderBooks(searchInput.value);
}

// Live search filter
searchInput.addEventListener('input', (e) => {
  renderBooks(e.target.value);
});

// Initial render on page load
renderBooks();
