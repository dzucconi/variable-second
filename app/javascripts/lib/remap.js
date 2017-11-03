export default (n, options = {}) =>
  (n - options.in.min) * (options.out.max - options.out.min) /
  (options.in.max - options.in.min) + options.out.min;
