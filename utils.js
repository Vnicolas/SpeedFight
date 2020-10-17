module.exports = {
  generateNumberInRange: (min, max, multiplier = 1) => {
    return Math.floor(Math.random() * (max - min + 1) + min) * multiplier;
  },
};
