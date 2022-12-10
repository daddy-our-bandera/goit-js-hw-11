import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchApi } from "./fetchApi";

const refs = {
    input: document.querySelector("input"),
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    guard: document.querySelector('.js-guard'),
  };

  let page = 1
  let total = 0
  const imagesPerPage = 40;
  


const simpleligthbox = new SimpleLightbox('.gallery a', { loop: false });
  
const options = {
    root: null,
    rootMargin: '200px',
    threshold: 1.0,
  };
  const observer = new IntersectionObserver(onLoad, options);
  
  refs.form.addEventListener("submit",onSearch)

  function onSearch(evt){
    evt.preventDefault();
    const searchName = evt.currentTarget.elements.searchQuery.value.trim();
   
    fetchApi(searchName).then(resp =>{
      if (!resp.totalHits) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );return}
        page = 1
        refs.gallery.innerHTML = '';
        Notify.success(`Hooray! We found ${resp.totalHits} images.`);
        refs.gallery.insertAdjacentHTML('beforeend', createMurkup(resp.hits));
        observer.observe(refs.guard);
        
        totalPages = Math.ceil(resp.totalHits / imagesPerPage);
      if (page === total) {
        Notify.info(
          `We're sorry, but you've reached the end of search results.`
        );
        observer.unobserve(refs.guard);

        return;
      }
   }).then(() => simpleligthbox.refresh());}


function onLoad(entries,observer) {
  entries.forEach(entri => {
    if (entri.isIntersecting) {
      page += 1;

      fetchApi(refs.input.value, page)
        .then((data) => {
          refs.gallery.insertAdjacentHTML('beforeend',createMurkup(data.hits)
          );
          total = Math.ceil(data.totalHits / imagesPerPage);
          if (page === total) {
            console.log(page);
            Notify.info(
              `We're sorry, but you've reached the end of search results.`
            );
            observer.unobserve(refs.guard);

            return;
          }
        })
        .then(() => simpleligthbox.refresh());
    }
  });
}

function createMurkup(arr) {
  return  arr.map(({ webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads, }) => {
     return `
     <div class="photo-card">
     <div class="thumb"><a class="gallery-item" href="${largeImageURL}">
       <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a></div>
 <div class="info">
   <p class="info-item">
     <b>Likes</b>${likes}
   </p>
   <p class="info-item">
     <b>Views</b>${views}
   </p>
   <p class="info-item">
     <b>Comments</b>${comments}
   </p>
   <p class="info-item">
     <b>Downloads </b>${downloads}
   </p>
 </div>
</div>`}).join('')
};