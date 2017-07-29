import fps from 'frame-interval';
import parameters from 'queryparams';
import textFit from 'textfit';

window.parameters = parameters;

const DOM = {
  app: document.getElementById('app'),
  stage: document.getElementById('stage'),
};

const PARAMS = parameters({
  value: 1.0,
  increment: 0.0,
});

const remap = (n, options = {}) =>
  (n - options.in.min) * (options.out.max - options.out.min) /
  (options.in.max - options.in.min) + options.out.min;

export default () => {
  const { value, increment } = PARAMS;

  let offset = value * 1000.0;
  let accumulator = 0;
  let then = new Date;
  let total = 0;

  fps(requestAnimationFrame)(60, () => {
    const now = new Date;

    // Process
    const delta = now.getTime() - then.getTime();
    accumulator = accumulator + delta;

    // Event
    const n = total + remap(accumulator, {
      in: {
        min: 0.0,
        max: offset,
      },
      out: {
        min: 0.0,
        max: 1.0,
      }
    });

    DOM.stage.innerHTML = `
      ${n.toFixed(2)}
    `;

    textFit(DOM.stage, { maxFontSize: 500 });

    // Reset
    then = now;

    if (accumulator >= offset) {
      accumulator = 0;
      total = total + 1;
      offset = offset + increment;
    }
  })();
};
