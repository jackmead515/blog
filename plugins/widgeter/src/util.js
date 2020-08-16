export function partition(count) {
  let partition = [];
  return (accumulator, currentItem, index, array) => {
      partition.push(currentItem);
  
      if (partition.length === count || index >= array.length - 1) {
          accumulator.push(partition);
          partition = [];
      }
  
      return accumulator;
  };
}