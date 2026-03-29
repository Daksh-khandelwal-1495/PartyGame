// =====================================================
// DEFAULT DECKS – 10 curated themed packs
// =====================================================

export const DEFAULT_DECKS = [
  {
    id: 'movies-tv',
    name: 'Movies & TV',
    emoji: '🎬',
    color: '#7c3aed',
    category: 'entertainment',
    tags: ['popular', 'fun'],
    isCustom: false,
    words: [
      'Breaking Bad', 'The Godfather', 'Inception', 'Jurassic Park',
      'Star Wars', 'The Office', 'Friends', 'Titanic', 'Avatar',
      'Game of Thrones', 'The Matrix', 'Interstellar', 'Pulp Fiction',
      'Avengers', 'Stranger Things', 'The Crown', 'Squid Game',
      'Parasite', 'Forrest Gump', 'The Lion King', 'Frozen',
      'Harry Potter', 'Lord of the Rings', 'Spider-Man', 'Black Panther',
    ],
  },
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐾',
    color: '#16a34a',
    category: 'nature',
    tags: ['kids', 'easy'],
    isCustom: false,
    words: [
      'Elephant', 'Giraffe', 'Penguin', 'Kangaroo', 'Dolphin',
      'Tiger', 'Gorilla', 'Cheetah', 'Flamingo', 'Crocodile',
      'Octopus', 'Panda', 'Polar Bear', 'Peacock', 'Chameleon',
      'Platypus', 'Manta Ray', 'Snow Leopard', 'Axolotl', 'Capybara',
      'Red Panda', 'Narwhal', 'Sloth', 'Quokka', 'Wombat',
    ],
  },
  {
    id: 'countries',
    name: 'Countries & Places',
    emoji: '🌍',
    color: '#0891b2',
    category: 'geography',
    tags: ['educational', 'geography'],
    isCustom: false,
    words: [
      'Brazil', 'Japan', 'Australia', 'Egypt', 'Iceland',
      'New Zealand', 'Morocco', 'Vietnam', 'Peru', 'Norway',
      'Kenya', 'Thailand', 'Portugal', 'Argentina', 'Finland',
      'Maldives', 'Costa Rica', 'Nepal', 'Tanzania', 'Croatia',
      'Amazon River', 'Mount Everest', 'Great Wall', 'Eiffel Tower', 'Colosseum',
    ],
  },
  {
    id: 'music',
    name: 'Music & Artists',
    emoji: '🎵',
    color: '#db2777',
    category: 'entertainment',
    tags: ['popular', 'music'],
    isCustom: false,
    words: [
      'Taylor Swift', 'Beyoncé', 'Eminem', 'The Beatles', 'Elvis Presley',
      'Michael Jackson', 'Adele', 'Drake', 'Billie Eilish', 'Ed Sheeran',
      'Bruno Mars', 'Lady Gaga', 'Coldplay', 'Foo Fighters', 'Nirvana',
      'BTS', 'Doja Cat', 'Post Malone', 'SZA', 'Bad Bunny',
      'Jazz', 'Hip-Hop', 'Pop', 'Heavy Metal', 'Classical Music',
    ],
  },
  {
    id: 'food-drink',
    name: 'Food & Drink',
    emoji: '🍕',
    color: '#ea580c',
    category: 'lifestyle',
    tags: ['easy', 'fun'],
    isCustom: false,
    words: [
      'Sushi', 'Tacos', 'Pizza', 'Ramen', 'Croissant',
      'Guacamole', 'Dim Sum', 'Paella', 'Hummus', 'Tiramisu',
      'Bubble Tea', 'Kimchi', 'Pho', 'Falafel', 'Churros',
      'Baklava', 'Cheeseburger', 'Peking Duck', 'Biryani', 'Gelato',
      'Kombucha', 'Espresso', 'Mojito', 'Green Smoothie', 'Hot Chocolate',
    ],
  },
  {
    id: 'sports',
    name: 'Sports & Athletes',
    emoji: '⚽',
    color: '#0d9488',
    category: 'sports',
    tags: ['popular', 'active'],
    isCustom: false,
    words: [
      'Cristiano Ronaldo', 'Serena Williams', 'LeBron James', 'Usain Bolt', 'Michael Phelps',
      'Messi', 'Roger Federer', 'Tiger Woods', 'Muhammad Ali', 'Simone Biles',
      'Basketball', 'Tennis', 'Swimming', 'Gymnastics', 'Archery',
      'Skateboarding', 'Rock Climbing', 'Fencing', 'Curling', 'Bobsleigh',
      'Grand Slam', 'Hat Trick', 'Slam Dunk', 'Hole in One', 'Marathon',
    ],
  },
  {
    id: 'celebrities',
    name: 'Celebrities',
    emoji: '👑',
    color: '#b45309',
    category: 'entertainment',
    tags: ['popular', 'fun'],
    isCustom: false,
    words: [
      'Elon Musk', 'Oprah Winfrey', 'Kim Kardashian', 'Dwayne Johnson', 'Jennifer Aniston',
      'Tom Hanks', 'Meryl Streep', 'Will Smith', 'Angelina Jolie', 'Brad Pitt',
      'Keanu Reeves', 'Ryan Reynolds', 'Margot Robbie', 'Zendaya', 'Chris Evans',
      'Gordon Ramsay', 'Ellen DeGeneres', 'David Beckham', 'Prince Harry', 'Malala Yousafzai',
      'Greta Thunberg', 'Neil deGrasse Tyson', 'Bill Gates', 'Mark Zuckerberg', 'Jeff Bezos',
    ],
  },
  {
    id: 'science-tech',
    name: 'Science & Tech',
    emoji: '🔬',
    color: '#4f46e5',
    category: 'educational',
    tags: ['educational', 'hard'],
    isCustom: false,
    words: [
      'Black Hole', 'DNA', 'Quantum Physics', 'Artificial Intelligence', 'Blockchain',
      'Virtual Reality', 'CRISPR', 'Dark Matter', 'Photosynthesis', 'Relativity',
      'Chatbot', 'Cloud Computing', 'Robot', 'Satellite', 'Nuclear Reactor',
      'Vaccine', 'Telescope', 'Electric Car', 'Solar Panel', 'Drone',
      'Space Station', 'Wormhole', 'Supernova', 'Big Bang', '3D Printing',
    ],
  },
  {
    id: 'video-games',
    name: 'Video Games',
    emoji: '🎮',
    color: '#7c3aed',
    category: 'entertainment',
    tags: ['popular', 'gaming'],
    isCustom: false,
    words: [
      'Minecraft', 'Fortnite', 'Mario', 'Zelda', 'Pokémon',
      'Call of Duty', 'GTA', 'The Sims', 'Among Us', 'Roblox',
      'FIFA', 'Halo', 'God of War', 'Elden Ring', 'Red Dead Redemption',
      'Tetris', 'Pac-Man', 'Candy Crush', 'Clash of Clans', 'PUBG',
      'Respawn', 'Health Bar', 'Easter Egg', 'Boss Fight', 'Side Quest',
    ],
  },
  {
    id: 'kids-mode',
    name: 'Kids Mode 🧸',
    emoji: '🧒',
    color: '#f59e0b',
    category: 'kids',
    tags: ['kids', 'easy', 'family'],
    isCustom: false,
    kidsMode: true,
    words: [
      'Dog', 'Cat', 'Rainbow', 'Butterfly', 'Snowman',
      'Dragon', 'Mermaid', 'Superhero', 'Princess', 'Dinosaur',
      'Ice Cream', 'Balloon', 'Bicycle', 'Playground', 'Rainbow',
      'Teddy Bear', 'Lollipop', 'Rocket Ship', 'Unicorn', 'Pirate',
      'Lion', 'Elephant', 'Turtle', 'Frog', 'Bunny',
    ],
  },
];

export function getStoredDecks() {
  try {
    const raw = localStorage.getItem('custom_decks');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveCustomDecks(decks) {
  localStorage.setItem('custom_decks', JSON.stringify(decks));
}

export function getAllDecks() {
  return [...DEFAULT_DECKS, ...getStoredDecks()];
}
