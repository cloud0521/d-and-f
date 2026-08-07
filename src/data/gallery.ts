import photo01 from '../assets/gallery/divine-francis-1.webp';
import photo02 from '../assets/gallery/divine-francis-3.webp';
import photo03 from '../assets/gallery/divine-francis-4.webp';
import photo04 from '../assets/gallery/divine-francis-5.webp';
import photo05 from '../assets/gallery/divine-francis-6.webp';
import photo06 from '../assets/gallery/divine-francis-7.webp';
import photo07 from '../assets/gallery/divine-francis-8.webp';
import photo08 from '../assets/gallery/divine-francis-9.webp';
import photo09 from '../assets/gallery/divine-francis-10.webp';
import photo10 from '../assets/gallery/divine-francis-11.webp';
import photo11 from '../assets/gallery/divine-francis-12.webp';
import photo12 from '../assets/gallery/divine-francis-13.webp';
import photo13 from '../assets/gallery/divine-francis-14.webp';
import photo14 from '../assets/gallery/divine-francis-15.webp';
import photo15 from '../assets/divine-francis-pool.webp';

const photo = (id: string, img: string, caption: string, alt: string) => ({
  id,
  img,
  webpSrcSet: undefined,
  preloadSrc: img,
  caption,
  alt,
});

export const divineFrancisGallery = [
  photo('our-beginning', photo01, 'Where Our Story Begins', 'A cinematic opening from Divine and Francis\'s prenup film'),
  photo('a-love-in-bloom', photo02, 'A Love in Bloom', 'Divine and Francis sharing a flower beneath a blue sky'),
  photo('closer-still', photo03, 'Closer Still', 'Divine and Francis embracing in the garden'),
  photo('all-my-heart', photo04, 'All My Heart', 'Divine holding Francis\'s face as they smile together'),
  photo('gentle-promise', photo05, 'A Gentle Promise', 'Francis kissing Divine on the forehead'),
  photo('joy-like-sunlight', photo06, 'Joy Like Sunlight', 'Divine and Francis laughing among sparkling bubbles'),
  photo('weathering-together', photo07, 'Whatever the Weather', 'Divine and Francis smiling together beneath a clear umbrella'),
  photo('under-one-sky', photo08, 'Under One Sky', 'Divine and Francis looking into each other\'s eyes beneath an umbrella'),
  photo('favorite-place', photo09, 'My Favorite Place', 'Divine hugging Francis from behind'),
  photo('playful-hearts', photo10, 'Playful Hearts', 'Divine and Francis sharing a playful portrait'),
  photo('swept-away', photo11, 'Swept Away', 'Francis carrying Divine as they laugh together'),
  photo('only-you', photo12, 'Only You', 'Divine and Francis sharing a quiet moment beside a tree'),
  photo('little-moments', photo13, 'The Little Moments', 'Divine and Francis laughing over a handwritten note'),
  photo('forever-in-view', photo14, 'Forever in View', 'Divine and Francis framed against a dramatic blue sky'),
  photo('adventure-ahead', photo15, 'Our Greatest Adventure', 'Divine and Francis sharing a playful moment beside the pool'),
];
