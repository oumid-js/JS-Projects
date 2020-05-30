//BOOK CLASS: REPRESENTS A BOOK
class Book {
    constructor(title,author,isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}




//UI CLASS: HANDLES UI TASKS
class UI {
    static displayBooks() {
 
        const books = store.getBooks(); 

        books.forEach(book => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td><a href='#' class="btn btn-danger btn-sm delete">X</a></td>        
         `;

        list.appendChild(row);

    }
    
    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //make vanishing in 2 secs
        setTimeout(() => document.querySelector('.alert').remove(),2000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';

    }
}


//STORE CLASS: HANDLES STORAGE
class store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index,1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}



//EVENT: DISPLAY BOOKS
document.addEventListener('DOMContentLoaded', UI.displayBooks);
//EVENT: ADD A BOOK
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //prevent acutal submit
    e.preventDefault();
    
    //get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate
    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all the fields','danger');
    } else {
        //instantiate book
    const book = new Book(title, author, isbn);

    console.log(book);

    //add a book to UI
    UI.addBookToList(book);
    
    //add book to store
    store.addBook(book);

    //show success message
    UI.showAlert('Book Added', 'success');

    //clear fields
    UI.clearFields(); 
    }

   
})

//EVENT: REMOVE A BOOK
document.querySelector('#book-list').addEventListener('click', e => {
    UI.deleteBook(e.target);

    //remove book from store
    store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    //show delete book message
    UI.showAlert('Book Removed', 'success');
});