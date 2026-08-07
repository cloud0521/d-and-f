import type { WeddingExperience } from '../../types/wedding';
import { paolaRyanGallery } from '../gallery';

export const paolaRyanWedding: WeddingExperience = {
  identity: {
    slug: 'paola-and-ryan',
    coupleNames: 'Paola & Ryan',
    shortNames: 'P & R',
    monogramAlt: 'Paola and Ryan wedding monogram',
    weddingDate: '2027-05-22T15:00:00+08:00',
  },
  branding: {
    companyName: 'DreamZ',
    signature: 'Crafted with love by DreamZ, creating timeless digital wedding experiences.',
  },
  opening: {
    verse: 'I have found the one my soul loves. I held him and would not let him go.',
    citation: 'Song of Solomon 3:4',
    musicSrc: '/bg-music.mp3',
  },
  templateId: 'elegant-floral',
  schedule: {
    ceremony: {
      title: 'The Ceremony',
      dateTime: '2027-05-22T15:00:00+08:00',
      timeLabel: '3:00 PM',
      venue: 'San Antonio de Padua Parish',
      address: 'Pooc, Silang, Cavite',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=San%20Antonio%20de%20Padua%20Parish%20Pooc%20Silang%20Cavite',
    },
    reception: {
      title: 'The Reception',
      dateTime: '2027-05-22T17:30:00+08:00',
      timeLabel: '5:30 PM',
      venue: 'Alta Veranda de Tibig',
      address: 'Tibig Road, Silang, Cavite',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Alta%20Veranda%20de%20Tibig%20Silang%20Cavite',
    },
    dressCode: {
      name: 'Garden Formal',
      description: 'We would love to see you in dusty rose, sage, champagne, or warm neutral tones.',
      colors: ['#C27C91', '#93A387', '#D9C6A5', '#B88A72'],
    },
  },
  chapters: [
    {
      id: 'our-beginning',
      order: 1,
      eyebrow: 'Chapter I',
      title: 'Our Beginning',
      blocks: [{
        type: 'timeline',
        items: [
          { label: '2019', title: 'The Accidental Table', description: 'A crowded birthday dinner left one empty chair beside Paola. Ryan took it, and neither of them noticed how quickly the evening disappeared.' },
          { label: '2020', title: 'Love, From a Distance', description: 'When the world slowed down, their story kept moving through midnight calls, handwritten notes, and Sunday breakfasts over video.' },
          { label: '2023', title: 'A Life in the Little Things', description: 'New jobs, road trips, rescued plants, and ordinary Tuesdays became proof that home was never a place—it was each other.' },
          { label: '2026', title: 'The Yes by the Sea', description: 'At sunset, on the shore where they had taken their first trip together, Ryan asked Paola to choose him for every chapter still to come.' },
        ],
      }],
    },
  ],
  gallery: paolaRyanGallery.map(({ id, preloadSrc, alt, caption }) => ({ id, src: preloadSrc, alt, caption })),
  entourage: [
    { id: 'maid-of-honor', name: 'Elena Reyes', role: 'Maid of Honor' },
    { id: 'best-man', name: 'Marco Villanueva', role: 'Best Man' },
    { id: 'bridesmaid-1', name: 'Sofia Lim', role: 'Bridesmaid' },
    { id: 'bridesmaid-2', name: 'Isabel Cruz', role: 'Bridesmaid' },
    { id: 'groomsman-1', name: 'Paolo Santos', role: 'Groomsman' },
    { id: 'groomsman-2', name: 'Daniel Co', role: 'Groomsman' },
  ],
  gifts: [{
    id: 'monetary-gift',
    title: 'Your presence is our greatest gift',
    description: 'We already have a home filled with everything we need. If you wish to bless our next adventure, a contribution to our honeymoon fund would be deeply appreciated.',
    details: 'A private gift link will be shared with invited guests upon request.',
  }],
  rsvp: {
    deadline: '2027-04-22T23:59:59+08:00',
    allowGuestMessage: true,
    questions: [
      { id: 'attendance', label: 'Attendance', type: 'select', required: true, options: [{ label: 'Joyfully accept', value: 'accepted' }, { label: 'Regretfully decline', value: 'declined' }] },
      { id: 'guest-count', label: 'Number of guests', type: 'select', required: true, options: [{ label: '1 person', value: '1' }, { label: '2 persons', value: '2' }, { label: '3 persons', value: '3' }] },
      { id: 'message', label: 'Wishes for the couple', type: 'textarea' },
    ],
    confirmation: {
      accepted: 'We have recorded your response and cannot wait to celebrate with you.',
      declined: 'Thank you for letting us know. You will be missed on our special day.',
    },
  },
  faqs: [
    { id: 'arrival', question: 'When should I arrive?', answer: 'Please arrive by 2:30 PM. The ceremony will begin promptly at 3:00 PM.' },
    { id: 'children', question: 'May we bring children?', answer: 'We adore your little ones, but our celebration will be adults-only except for children included in the entourage.' },
    { id: 'transport', question: 'Will transportation be available?', answer: 'A shuttle will leave the reception venue for the church at 2:00 PM and return after the ceremony. Seats must be reserved with your RSVP.' },
    { id: 'photos', question: 'May we take photos?', answer: 'Yes, you are welcome to take photos. We kindly ask that you remain mindful of our official photographer, avoid blocking their view, and allow them to capture the important moments.' },
  ],
};
