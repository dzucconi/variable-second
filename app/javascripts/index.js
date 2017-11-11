import fps from 'frame-interval';
import parameters from 'queryparams';
import textFit from 'textfit';
import remap from './lib/remap';
import * as dom from './lib/dom';

window.parameters = parameters;

const DOM = {
  app: document.getElementById('app'),
};

const PARAMS = parameters({
  values: [1.0],
  increment: 0.0,
  pulse: false,
});

const secondify = ({ value, el, increment }) => {
  let offset = value * 1000.0;
  let accumulator = 0;
  let then = new Date;
  let total = 0;

  return () => {
    const now = new Date;
    const delta = now.getTime() - then.getTime();

    accumulator = accumulator + delta;

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

    then = now;

    if (accumulator >= offset) {
      accumulator = 0;
      total = total + 1;
      offset = offset + increment;
    }

    el.innerHTML = n.toFixed(2);

    textFit(el, { maxFontSize: 500 });

    if (PARAMS.pulse) {
      el.style.opacity = 1.0 - (accumulator / 1000.0);
    }
  };
};

export default () => {
  const { values, increment } = PARAMS;

  const max = `${100 / values.length}%`;

  const renderers = values.map(value => {
    const el = dom.tag('div', {
      klass: 'second',
    });

    const wrap = dom.tag('div', {
      klass: 'wrap',
      style: {
        'max-width': max,
        'max-height': max,
      },
    });

    wrap.appendChild(el);
    DOM.app.appendChild(wrap);

    return secondify({ el, value, increment });
  });

  fps(requestAnimationFrame)(60, () => {
    for (var i = renderers.length - 1; i >= 0; i--) {
      renderers[i]();
    }
  })();
};
