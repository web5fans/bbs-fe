export function createHighlights(total = 12, size = 4) {
  let position = 0;

  const getIndexes = () => {
    const indexes = [];
    for (let i = 0; i < size; i++) {
      indexes.push((position + i) % total);
    }
    return indexes;
  }

  return {
    getIndexes,

    next: () => {
      position = (position + 1) % total;
      return getIndexes();
    },

    setPosition: (newPos) => {
      position = newPos % total;
      return getIndexes();
    },

    getPosition: () => position
  };
}

export const svgLinesXY = [{
  x1: '1.5',
  y1: '12',
  x2: '1.5',
  y2: '21',
},{
  x1: '4.5',
  y1: '6',
  x2: '4.5',
  y2: '12',
},{
  x1: '12',
  y1: '4.5',
  x2: '6',
  y2: '4.5',
},{
  x1: '21',
  y1: '1.5',
  x2: '12',
  y2: '1.5',
},{
  x1: '27',
  y1: '4.5',
  x2: '21',
  y2: '4.5',
},{
  x1: '28.5',
  y1: '6',
  x2: '28.5',
  y2: '12',
},{
  x1: '31.5',
  y1: '12',
  x2: '31.5',
  y2: '21',
},{
  x1: '28.5',
  y1: '21',
  x2: '28.5',
  y2: '27',
},{
  x1: '27',
  y1: '28.5',
  x2: '21',
  y2: '28.5',
},{
  x1: '21',
  y1: '31.5',
  x2: '12',
  y2: '31.5',
}, {
  x1: '12',
  y1: '28.5',
  x2: '6',
  y2: '28.5',
},{
  x1: '4.5',
  y1: '21',
  x2: '4.5',
  y2: '27',
}]