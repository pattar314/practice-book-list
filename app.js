// Book class: represents a book

class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle ui tasks
class UI {
    static displayBooks() {
        
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book))
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        
        let row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class='btn btn-danger btn-small delete'>x</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // die after 3 sec
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static clearFields(){
        document.getElementById('title').value='';
        document.getElementById('author').value='';
        document.getElementById('isbn').value='';
    }
}

// Store class: Handles storage
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        }

        else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        let books = Store.getBooks();
        for (let book of books) {
            console.log('checking');
            if(book.isbn === isbn){
                books.splice(books.indexOf(book), 1);
                console.log('rebinding books');
                localStorage.setItem('books', JSON.stringify(books));
                console.log(JSON.stringify(books));
                books = Store.getBooks();
                console.log(books);
            }
        };

        
    }

}


// Event: display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event : add a book
document.querySelector('#book-form').addEventListener('submit', (e) => 
{
    e.preventDefault();
    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate

    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all fields', 'danger')
    }
    else {

    // instantiate book 
    const book = new Book(title, author, isbn);

    //add book to ui
    UI.addBookToList(book);

    //add book to store

    Store.addBook(book);

    //show success message
    UI.showAlert('Book successfully added', 'success');

    //clear fields
    UI.clearFields();
}
});

// Event: remove a book

document.getElementById('book-list').addEventListener('click', (e) => {

    //remove from ui
    UI.deleteBook(e.target);

    // remove from store
    
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show success message
    UI.showAlert('Book successfully removed', 'success');
}
);


console.log(Store.getBooks());