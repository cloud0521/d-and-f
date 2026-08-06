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
import gallery12Small from '../assets/gallery/gallery-12-720.webp';
import gallery12Large from '../assets/gallery/gallery-12-1200.webp';
import gallery13Small from '../assets/gallery/gallery-13-720.webp';
import gallery13Large from '../assets/gallery/gallery-13-1200.webp';
import gallery14Small from '../assets/gallery/gallery-14-720.webp';
import gallery14Large from '../assets/gallery/gallery-14-1200.webp';

const photo = (id: string, small: string, large: string, caption: string, alt: string) => ({
  id,
  img: small,
  webpSrcSet: `${small} 720w, ${large} 1200w`,
  preloadSrc: large,
  caption,
  alt,
});

export const stefanoMhykaGallery = [
  photo('garden-promise', gallery01Small, gallery01Large, 'Where Our Story Blooms', 'Stefano and Mhyka smiling at one another in a garden'),
  photo('walking-together', gallery02Small, gallery02Large, 'Side by Side', 'Stefano and Mhyka walking hand in hand'),
  photo('shared-laughter', gallery03Small, gallery03Large, 'The Joy We Share', 'Stefano and Mhyka laughing together'),
  photo('close-to-you', gallery04Small, gallery04Large, 'Close to You', 'Stefano and Mhyka sharing a tender moment'),
  photo('portrait-together', gallery05Small, gallery05Large, 'At Home With You', 'Mhyka embracing Stefano from behind'),
  photo('playful-love', gallery06Small, gallery06Large, 'Our Playful Kind of Love', 'Stefano and Mhyka sharing a playful moment'),
  photo('smiles-up-close', gallery07Small, gallery07Large, 'A Thousand Reasons to Smile', 'A close portrait of Stefano and Mhyka smiling'),
  photo('her-happiness', gallery08Small, gallery08Large, 'You Make Me Smile', 'Mhyka smiling beside Stefano'),
  photo('golden-gaze', gallery09Small, gallery09Large, 'In Every Light', 'Stefano and Mhyka looking at one another in golden light'),
  photo('sunlit-embrace', gallery10Small, gallery10Large, 'Held in Golden Light', 'Stefano and Mhyka embracing by the sea'),
  photo('seaside-dance', gallery11Small, gallery11Large, 'Dancing Into Forever', 'Stefano and Mhyka holding hands beside the sea'),
  photo('running-at-sunset', gallery12Small, gallery12Large, 'Chasing Sunsets Together', 'Stefano and Mhyka running hand in hand at sunset'),
  photo('sunset-embrace', gallery13Small, gallery13Large, 'Always in Your Arms', 'Stefano embracing Mhyka beneath a sunset sky'),
  photo('forever-silhouette', gallery14Small, gallery14Large, 'And So Forever Begins', 'Stefano and Mhyka silhouetted against the setting sun'),
];
