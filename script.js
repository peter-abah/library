'use strict';

// ------------------
// THEME SECTION
// ------------------

const bodyElement = document.querySelector('body')
const themeToggleBtn = document.querySelector('#theme-toggle-btn');
themeToggleBtn.addEventListener('click', event => {
  [...themeToggleBtn.children].forEach(icon => 
    icon.classList.toggle('header__btn__icon--hidden')
  );

  ['dark-theme', 'light-theme'].forEach(cls => bodyElement.classList.toggle(cls));
});

// -----------------
// BOOKS SECTION
// ----------------- 

// keeps track of the number of books
let booksCount = 0;

// book object constuctor
const Book = function(title, author, pageNo, img, status) {
  this.title = title;
  this.author = author;
  this.pageNo = pageNo;
  this.img = img;
  this.status = status;
  booksCount++;
};

// returns an object with default books
const getDefaultBooks = function() {
  let books = {};

  books[booksCount] = new Book('Geometry for Ocelots', 'Exurb1a', 521, 'images/geometry.webp', false);
  books[booksCount] = new Book('Eloquent JavaScript', 'Marijn Haverbeke', 382, 'images/eloquent-js.webp', true);
  books[booksCount] = new Book('The Subtle Art of not Giving a F*ck', 'Mark Manson', 290, 'images/subtle-fuck.webp', true);
  books[booksCount] = new Book('Stories of Your Life and Others', 'Ted Chiang', 402, 'images/stories-life.webp', false);

  return books;
};

// returns books from local storage if it exists
const getBooksFromStorage = function() {
  return JSON.parse(window.localStorage.getItem('books'));
}

const books = getBooksFromStorage() || getDefaultBooks();

const booksWrapper = document.querySelector('.books');
const modal = document.querySelector('.modal')
const openModalBtn = document.querySelector('#open-modal-btn');
const closeModalBtn = document.querySelector('.modal__close-btn');

const deleteBookBtns = [...document.querySelectorAll('.book__delete-btn')];
const bookForm = document.querySelector('.modal__form');

// delete books from books object and DOM
const deleteBook = function(event) {
  let bookId = event.currentTarget.getAttribute('data-book-id');
  delete books[bookId];

  let bookElement = document.querySelector(`.book[data-book-id="${bookId}"]`);
  booksWrapper.removeChild(bookElement);
  updateLocalStorage(books)
};

// adds book to dom
const addBook = function(event) {
  event.preventDefault();

  const book = new Book(...getBookInfoFromForm());
  books[booksCount] = book;
  booksWrapper.appendChild(createBookElement(book, booksCount));

  bookForm.reset();
  modal.classList.toggle('modal--hidden')
  updateLocalStorage(books)
};

// returns an array of book info from submitted form
const getBookInfoFromForm = function() {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const pageNo = document.getElementById('page-no').checked;
  const img = getBookImage()
  const status = document.getElementById('status').value;

  return [title, author, pageNo, img, status];
}

// gets book url or default url
const getBookImage = function() {
  let fileInput = document.getElementById('book-img');
  let imgURL = document.getElementById('book-img-url').value;

  if (fileInput.files[0]) {
    imgURL = URL.createObjectURL(fileInput.files[0]);
  }

  return imgURL || 'images/default-book-cover.webp';
};

// creates an element from information in book object
const createBookElement = function(book, booksCount) {
  let bookImg = createElement('img', {
    class: 'book__img',
    src: book.img,
    alt: book.title,
    width: 120,
    height: 172,
  });

  let bookTitle = createElement(
    'h2', {class: 'book__title'}, [document.createTextNode(book.title)]
  );

  let bookAuthor = createElement(
    'p', {class: 'book__author'}, [document.createTextNode(book.author)]
  );

  let bookPageNo = createElement(
    'p', {class: 'book__page-no'}, [document.createTextNode(book.pageNo)]
  );


  let checkBox = createElement('input', {
    type: 'checkbox', checked: book.status, 'data-book-id': booksCount, id: `checkBox-${booksCount}`
  });
  

  // event listener to change book status
  checkBox.addEventListener('change', event => {
    book.status = checkBox.checked;
    updateLocalStorage(books);
  });
    
  let statusLabel = createElement('label', {for: `checkBox-${booksCount}`}, [document.createTextNode(' Read')]);

  let bookStatus = createElement(
    'div', {class: 'book__status'}, [checkBox, statusLabel]
  );

  let deleteBookBtn = createElement(
    'button', {class: 'book__delete-btn', 'data-book-id': booksCount}, [
      createElement('span', {class: 'material-icons', title: 'Delete Book'}, [
        document.createTextNode('delete')
      ])
    ]
  );
  deleteBookBtn.addEventListener('click', deleteBook);

  let bookInfoWrapper = createElement('div', {class: 'book__info'}, [
    bookTitle, bookAuthor, bookPageNo, bookStatus, deleteBookBtn,
  ]);

  let bookElement = createElement('div', {class: 'book', 'data-book-id': booksCount}, [
    bookImg, bookInfoWrapper
  ]);

  return bookElement;
}

// creates a element with tagName and properties and children
// example createELement(div, {class: 'big', id: '2'}) will return
// <div class="big", id="2"></div>
const createElement =  function(tagName, properties = {}, children = []) {
  let element = document.createElement(tagName);

  for(let property of Object.keys(properties)) {
    // set the attribute of element unlesss the value is falsey
    properties[property] && element.setAttribute(property, properties[property]);
  }

  for(let child of children) {
    element.appendChild(child);
  }

  return element;
};

// updates local storage with books object
const updateLocalStorage = function(books) {
  window.localStorage.setItem('books', JSON.stringify(books));
  console.log(window.localStorage)
}

// add books in books object to DOM
const addBooksToDom = function(books) {
  for(let bookId of Object.keys(books)) {
    booksWrapper.appendChild(createBookElement(books[bookId], bookId));
  }
};

// add event listener to toggle modal visibility
[openModalBtn, closeModalBtn].forEach(btn => {
  btn.addEventListener('click', event => modal.classList.toggle('modal--hidden'));
});

// add event listener to add book
bookForm.addEventListener('submit', addBook);

addBooksToDom(books);