import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';
const apiKey = '29769658-2e9c8ec471a16ce567c0ae4f1';
let page = 1;
let queryString = '';
let firstRender = true;

const form = document.querySelector('#search-form');
const input = document.querySelector('input');

const gallery = document.createElement('div');
gallery.classList.add('gallery');
const btn = document.createElement('button');
btn.setAttribute('type', 'button');
btn.classList.add('load-btn', 'hide');
btn.textContent = 'Load more...';
document.body.append(gallery);
gallery.after(btn);

input.addEventListener('input', e => {
  queryString = e.target.value;
  gallery.innerHTML = '';
  btn.classList.add('hide');
});

form.addEventListener('submit', e => {
  e.preventDefault();
  fetchImages().then(response => {
    return createGallery(response.hits);
  });
});

const fetchImages = () => {
  return axios
    .get(
      ` ${BASE_URL}?key=${apiKey}&q=${queryString}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    )
    .then(response => {
      return response.data;
    });
};

const createGallery = data => {
  if (firstRender) {
    gallery.innerHTML = '';
  }
  if (data.length === 0) {
    btn.classList.add('hide');
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  const galleryCardList = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <div class="gallery_card">
      <a><img class="gallery_card-img" src="${webformatURL}" alt="${tags}" loading="lazy" width="300px"></a>
      <ul class="gallery_card-desc">
        <li class="likes">
        <p>
          <span class="span">Likes</span> ${likes}
        </p>
        <li class="views">
        <p><span class="span">Views</span> ${views}</p>
        </li>
        <li class="comments">
        <p><span class="span">Comments</span> ${comments}</p>
          
        </li>
        <li class="downloads">
        <p><span class="span">Downloads</span> ${downloads}</p>
          
        </li>
      </ul>
    </div>
  `
    )
    .join('');
  btn.classList.remove('hide');

  return gallery.insertAdjacentHTML('beforeend', galleryCardList);
};

const onLoadBtnClick = () => {
  page = page + 1;
  firstRender = false;
  fetchImages().then(response => {
    if (response.hits.length < 40) {
      btn.classList.add('hide');
      return Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    return createGallery(response.hits);
  });
};
btn.addEventListener('click', onLoadBtnClick);
