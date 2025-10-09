


export const properInitialPages = [
  {
    pageNumber: 0,
    content: '# Welcome to Your Digital Journal\n\nStart your writing journey...',
    type: 'cover',
    customization: {
      fontFamily: 'serif',
      fontSize: 16,
      lineHeight: 1.5,
      textColor: '#000',
      backgroundColor: '#f0f0f0',
      backgroundImage: null,
      texture: 'dotted'
    }
  },
  {
    pageNumber: 1,
    content: '## Page 1\n\nStart writing here...',
    type: 'text',
    customization: {
      fontFamily: 'serif',
      fontSize: 16,
      lineHeight: 1.5,
      textColor: '#000',
      backgroundColor: '#fff',
      backgroundImage: null,
      texture: 'lined'
    }
  },
  {
    pageNumber: 2,
    content: '## Page 2\n\nStart writing here...',
    type: 'text',
    customization: {
      fontFamily: 'serif',
      fontSize: 16,
      lineHeight: 1.5,
      textColor: '#000',
      backgroundColor: '#fff',
      backgroundImage: null,
      texture: 'grid'
    }
  }
];


export const FONT_OPTIONS = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Brush Script', value: 'Brush Script MT, cursive' }
];

export const TEXTURE_OPTIONS = [
  { name: 'None', value: 'none' },
  { name: 'Lined', value: 'lined' },
  { name: 'Grid', value: 'grid' },
  { name: 'Dots', value: 'dots' }
];

export const PAGE_TEMPLATES = [
  { name: 'Blank', type: 'blank', content: '' },
  { name: 'Journal', type: 'text', content: '## Daily Entry\n\nDate: \n\nToday I want to write about...' },
  { name: 'To-Do List', type: 'text', content: '## To-Do List\n\n- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3' },
  { name: 'Creative', type: 'mixed', content: '## Creative Space\n\nIdeas and inspiration...' }
];