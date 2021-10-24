'use strict';

// keeps track of the number of books
let booksCount = 0;

// book object constuctot
const Book = function(title, author, pageNo, img, status) {
  this.title = title;
  this.author = author;
  this.pageNo = pageNo;
  this.img = img;
  this.status = status;
  booksCount++;
};

const deleteBook = function(event) {
  let bookId = event.currentTarget.getAttribute('data-book-id');
  delete books[bookId];

  let bookElement = document.querySelector(`.book[data-book-id="${bookId}"]`);
  booksWrapper.removeChild(bookElement);
};

// adds book to dom
const addBook = function(event) {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const pageNo = document.getElementById('page-no').checked;
  const img = getBookImage()
  const status = document.getElementById('status').value;

  const book = new Book(title, author, pageNo, img, status);
  books[booksCount] = book;
  booksWrapper.appendChild(createBookElement(book, booksCount));

  bookForm.reset();
  modal.classList.toggle('modal--hidden')
  event.preventDefault();
};

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
    width: 100,
    height: 150,
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
    type: 'checkbox', checked: book.status, 'data-book-id': booksCount
  });

  checkBox.addEventListener('change', event => book.status = checkBox.checked );
    
  let statusLabel = createElement('label', {}, [document.createTextNode(' Read')]);

  let bookStatus = createElement(
    'div', {class: 'book__status'}, [checkBox, statusLabel]
  );

  let deleteBookBtn = createElement(
    'button', {class: 'book__delete-btn', 'data-book-id': booksCount}, [
      createElement('span', {class: 'material-icons'}, [
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
    element.setAttribute(property, properties[property]);
  }

  for(let child of children) {
    element.appendChild(child);
  }

  return element;
};

const books = {};
const booksWrapper = document.querySelector('.books');

const modal = document.querySelector('.modal')
const openModalBtn = document.querySelector('.open-modal-btn');
const closeModalBtn = document.querySelector('.modal__close-btn');

const deleteBookBtns = [...document.querySelectorAll('.book__delete-btn')];
const bookForm = document.querySelector('.modal__form');
const addBookBtn = document.querySelector('modal__form__btn');

// add event listener to toggle modal visibility
[openModalBtn, closeModalBtn].forEach(btn => {
  btn.addEventListener('click', event => modal.classList.toggle('modal--hidden'));
});

// add event listener to add book
bookForm.addEventListener('submit', addBook);