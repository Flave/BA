var _ = require('lodash');
const d3RandomNormal = require('d3-random').randomNormal;

module.exports = {
  getRandomItems: (allItems, count) => {
    let items = _.clone(allItems);
    let selection = [];

    return _.range(count).map(i => {
      // get a normal distributed index to select a sub
      let spread = items.length/15;
      let index = Math.abs(Math.floor(d3RandomNormal(0, spread)()));
      // make sure the index is not out of bounds
      index = index > (allItems.length - 1) ? allItems.length - 1 : index;
      return items.splice(index, 1)[0];
    });
  }
}