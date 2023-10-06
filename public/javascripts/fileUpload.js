
const rootStyles = window.getComputedStyle(document.documentElement)
const ready = () =>{
  console.log('ready')
  const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width'))
  const aspectRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ration')) 
  const coverHeight = coverWidth / aspectRatio; 
  
  FilePond.registerPlugin(FilePondPluginImagePreview);
  FilePond.registerPlugin(FilePondPluginImageResize);
  FilePond.registerPlugin(FilePondPluginFileEncode);
  
  FilePond.setOptions({
    stylePanelAspectRatio:1 / aspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight
  })

  FilePond.parse(document.body);
}


if(rootStyles.getPropertyValue('--book-cover-width') != null  && rootStyles.getPropertyValue('--book-cover-width') !== ''){
  ready()
}else{
  document.getElementById('mainCss').addEventListener('load',ready)
}


const productCards = document.querySelectorAll('.author-card');

function showCardsOneByOne(cards) {
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.animation = 'slideIn 0.5s ease-in-out';
      card.style.animationFillMode = 'forwards';
      card.style.animationPlayState = 'running';
    }, index * 500); // Adjust the delay (in milliseconds) as needed
  });
}

// Call the function to start the animation
showCardsOneByOne(productCards);

// JavaScript for lazy loading (fallback)
const lazyImages = document.querySelectorAll('.lazy');

const lazyLoad = (target) => {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        img.setAttribute('src', src);
        img.classList.remove('lazy');
        observer.disconnect();
      }
    });
  });

  io.observe(target);
};

lazyImages.forEach(lazyLoad);





