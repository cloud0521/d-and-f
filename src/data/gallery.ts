import gallery01Small from '../assets/gallery/gallery-01-720.webp';
import gallery01Large from '../assets/gallery/gallery-01-1200.webp';
import gallery02Small from '../assets/gallery/gallery-02-720.webp';
import gallery02Large from '../assets/gallery/gallery-02-1200.webp';
import gallery03Small from '../assets/gallery/gallery-03-720.webp';
import gallery03Large from '../assets/gallery/gallery-03-1200.webp';
import gallery04Small from '../assets/gallery/gallery-04-720.webp';
import gallery04Large from '../assets/gallery/gallery-04-1200.webp';
import gallery05Small from '../assets/gallery/gallery-05-720.webp';
import gallery05Large from '../assets/gallery/gallery-05-1200.webp';
import gallery06Small from '../assets/gallery/gallery-06-720.webp';
import gallery06Large from '../assets/gallery/gallery-06-1200.webp';
import gallery07Small from '../assets/gallery/gallery-07-720.webp';
import gallery07Large from '../assets/gallery/gallery-07-1200.webp';
import gallery08Small from '../assets/gallery/gallery-08-720.webp';
import gallery08Large from '../assets/gallery/gallery-08-1200.webp';
import gallery09Small from '../assets/gallery/gallery-09-720.webp';
import gallery09Large from '../assets/gallery/gallery-09-1200.webp';
import gallery10Small from '../assets/gallery/gallery-10-720.webp';
import gallery10Large from '../assets/gallery/gallery-10-1200.webp';
import gallery11Small from '../assets/gallery/gallery-11-720.webp';
import gallery11Large from '../assets/gallery/gallery-11-1200.webp';

const photo = (id: string, small: string, large: string, caption: string, alt: string) => ({
  id,
  img: small,
  webpSrcSet: `${small} 720w, ${large} 1200w`,
  preloadSrc: large,
  caption,
  alt,
});

export const paolaRyanGallery = [
  photo('our-horizon', gallery01Small, gallery01Large, 'Where Forever Begins', 'Paola and Ryan together on a sunlit hill beneath an open sky'),
  photo('reaching-for-you', gallery02Small, gallery02Large, 'Always Reaching for You', 'Paola and Ryan reaching for one another on a grassy hill'),
  photo('promise-in-bloom', gallery03Small, gallery03Large, 'A Promise in Bloom', 'Paola and Ryan smiling together with a white bouquet'),
  photo('dance-in-the-light', gallery04Small, gallery04Large, 'Dancing in the Light', 'Paola and Ryan dancing against a mountain view'),
  photo('quiet-happiness', gallery05Small, gallery05Large, 'The Joy You Bring', 'Paola smiling with flowers while Ryan looks on'),
  photo('chasing-sunsets', gallery06Small, gallery06Large, 'Chasing Sunsets Together', 'Paola and Ryan running hand in hand along the shore at sunset'),
  photo('evening-promise', gallery07Small, gallery07Large, 'Into Every Sunset', 'Paola and Ryan holding hands before a vivid sunset'),
  photo('sparkler-light', gallery08Small, gallery08Large, 'You Are My Light', 'Paola and Ryan smiling together with sparklers by the sea'),
  photo('close-to-you', gallery09Small, gallery09Large, 'Close to You', 'Paola resting her head on Ryan while watching the sunset'),
  photo('by-the-water', gallery10Small, gallery10Large, 'In Every Light', 'Ryan looking at Paola beside the water at twilight'),
  photo('side-by-side', gallery11Small, gallery11Large, 'Side by Side', 'Paola and Ryan walking hand in hand through a sunlit field'),
];
