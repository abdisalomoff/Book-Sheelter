
// ---------------------------------  Get elements from HTML --------------------------------------

let elForm = document.querySelector(".site-header__form");
let elSearchInput = document.querySelector(".site-header__input");
let elSearchResult = document.querySelector(".result__search");
let elNewestBtn = document.querySelector(".newest__btn");
let elWrapper = document.querySelector(".wrapper");
let elTemplate = document.querySelector("#bookstemp").content;
let elBookmarksWrapper = document.querySelector(".bookmarks-wrapper")
let elBookmarksTemp = document.querySelector("#bookmarkstemp").content;
let elModalTemplate = document.querySelector("#modalTemp").content;
let moreInfoWrapper = document.querySelector(".offcanvas");


let localList = JSON.parse(localStorage.getItem("bookmark"));
let saveBookmark = []
if (localList) {
    saveBookmark = localList
    bookmarkRender(saveBookmark)
}else{
    saveBookmark = []
}


elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  fetch(
    `https://books.googleapis.com/books/v1/volumes?q=${elSearchInput.value}`
  )
    .then((response) => response.json())
    .then((data) => {
      renderBooks(data.items, elWrapper);
    });
});

elNewestBtn.addEventListener("click", function () {

  fetch(
    `https://books.googleapis.com/books/v1/volumes?q=${elSearchInput.value}&orderBy=newest`
  )
    .then((response) => response.json())
    .then((data) => {
      renderBooks(data.items, elWrapper);
    });
});


// ---------------------------------  Books Render --------------------------------------


function renderBooks(array, node) {
  node.innerHTML = null;
  elSearchResult.innerHTML = array.length;

  let elFragment = document.createDocumentFragment();

  array.forEach(item => {
    let bookCard = elTemplate.cloneNode(true);

        bookCard.querySelector(".card__img").src = item.volumeInfo.imageLinks.thumbnail;
        bookCard.querySelector(".card__title").textContent = item.volumeInfo.title;
        bookCard.querySelector(".card__by").textContent = item.volumeInfo.authors;
        bookCard.querySelector(".card__year").textContent = item.volumeInfo.publishedDate;
        bookCard.querySelector(".btn-bookmark").dataset.bookmarkId = item.id;
        bookCard.querySelector(".btn-read").href = item.accessInfo.webReaderLink;
        bookCard.querySelector(".btn-info").dataset.infoId = item.id;
        bookCard.querySelector(".btn-read").dataset.readId = item.id;
        
        elFragment.appendChild(bookCard);
  });
  node.appendChild(elFragment);
}


// ---------------------------------  Bookmark Render --------------------------------------


  elWrapper.addEventListener("click", function(evt) {
    let bookmarkId = evt.target.dataset.bookmarkId
    
    if (bookmarkId) {
      if (saveBookmark.length == 0) {
          fetch(`https://www.googleapis.com/books/v1/volumes/${bookmarkId}`)
          .then(response => response.json())
          .then(data => {
              saveBookmark.unshift(data)
              bookmarkRender(saveBookmark)
              localStorage.setItem("bookmark", JSON.stringify(saveBookmark))
          })
      } else if (!saveBookmark.find(item => item.id == bookmarkId)) {
          fetch(`https://www.googleapis.com/books/v1/volumes/${bookmarkId}`)
          .then(response => response.json())
          .then(data => {
              saveBookmark.unshift(data)
              bookmarkRender(saveBookmark)
              localStorage.setItem("bookmark", JSON.stringify(saveBookmark))
          })
      }
      bookmarkRender(saveBookmark)
  }
})





elWrapper.addEventListener("click", (evt) => {
  let infoId = evt.target.dataset.infoId;

  if (infoId) {
    fetch(`https://www.googleapis.com/books/v1/volumes/${infoId}`)
      .then((response) => response.json())
      .then((data) => {
        renderModal(data);
      });
  }
});


  function bookmarkRender(array) {

   elBookmarksWrapper.innerHTML = null;

    let elFragment = document.createDocumentFragment();
    
    for (const item of array) {

        let bookmarksItem = elBookmarksTemp.cloneNode(true)
        
        bookmarksItem.querySelector(".bookmarks-wrapper__title").textContent = item.volumeInfo.title;
        bookmarksItem.querySelector(".bookmarks-wrapper__by").textContent = item.volumeInfo.authors;
        bookmarksItem.querySelector(".bookmark-btn").href = item.accessInfo.webReaderLink;
        bookmarksItem.querySelector(".delete-btn").dataset.bookmarkId = item.id;   
        
        elFragment.appendChild(bookmarksItem)
    }
    
   elBookmarksWrapper.appendChild(elFragment)
}


// --------------------------------- Bookmark Delete ---------------------------------------


elBookmarksWrapper.addEventListener("click", evt => {

    const btnDelete = evt.target.closest(".delete-btn").dataset.bookmarkId;
    
    if(btnDelete){
      let elDeleteBtn = saveBookmark.findIndex(function (item) {
          return item.id == btnDelete
      })
      saveBookmark.splice(elDeleteBtn, 1)
      localStorage.setItem("bookmark", JSON.stringify(saveBookmark))
    }
    
    bookmarkRender(saveBookmark)
})


// --------------------------------- Modal Render ---------------------------------------


function renderModal(array) {
  let fragment = document.createDocumentFragment();
  
  for (const item of array) {
      let modaltem = elModalTemplate.cloneNode(true)
      
      modaltem.querySelector(".modal-heading__title").textContent = item.volumeInfo.title;
      modaltem.querySelector(".modal-info__img").src = item.volumeInfo.imageLinks.thumbnail;
      modaltem.querySelector(".modal-info__text").textContent = item.volumeInfo.description;
      modaltem.querySelector(". modal-link__author").textContent = item.volumeInfo.authors;
      modaltem.querySelector(".modal-link__year").textContent = item.volumeInfo.publishedDate;
      modaltem.querySelector(".modal-link__public").textContent = item.volumeInfo.publisher;
      modaltem.querySelector(".modal-link__category").textContent = item.volumeInfo.categories;
      modaltem.querySelector(".modal-link__pages").textContent = item.volumeInfo.pageCount;

      
      fragment.appendChild(modaltem)
  }
  
  elInfoWrapperRender.appendChild(fragment)
}