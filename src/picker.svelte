 <!-- 
 <script lang='ts' type="module">
    console.clear();
    import { formatHex, converter } from 'culori';
    
    import {
      Poline,
      positionFunctions,
      randomHSLPair,
    } from "poline";

    const toHSL = converter('hsl');

    const svgscale = 100;
    const namespaceURI = 'http://www.w3.org/2000/svg';

    const hueBasedModels = [{
      key: 'okhsl',
      label: 'OKHSL',
      fn: (hsl) => {return {h : hsl[0], s: hsl[1], l: hsl[2]}},
    },
    {
      key: 'hsl',
      label: 'HSL',
      fn: (hsl) => { return { h: hsl[0], s: hsl[1], l: hsl[2] } },
    }
    , {
      key: 'jch',
      label: 'JCH',
      fn: (hsl) => { return { j: hsl[2] * 0.222, c: hsl[1] * 0.190, h: hsl[0] } },
    }, {
      key: 'oklch',
      label: 'OKLCH',
      fn: (hsl) => { return { l: hsl[2] * 0.999, c: hsl[1] * 0.322, h: hsl[0] } },
    }, {
      key: 'lch',
      label: 'LCH',
      fn: (hsl) => { return { l: hsl[2] * 100, c: hsl[1] * 51.484, h: hsl[0] } },
    }, {
        key: 'dlch',
        label: 'DLCH',
        fn: (hsl) => { return { l: hsl[2] * 100, c: hsl[1] * 51.484, h: hsl[0] } },
      }];

    let currentHueModel = 'hsl';
    let currentModelFn = hueBasedModels.find(m => m.key === currentHueModel).fn;

    const stepsToLabels = (steps = 360 / 10) => new Array(steps)
        .fill('')
        .map((_, i) => `
          <strong class="wheel__huelabel" data-huelabel="${i}" style="--i: ${i / steps}">${i * 10}</strong>`)
        .join('')

    const createCSSRainbowGradient = (steps = 360 / 10) => new Array(steps)
        .fill('')
        .map((_, i) => `hsl(${i / (steps - 1) * 360}, calc(var(--s) * 100%), calc(var(--l,0) * 100%))`)
        .join(',');

    const createSVG = (svgscale = 100) => {
      const $svg = document.createElementNS(
        namespaceURI, 'svg'
      );
      $svg.setAttribute('viewBox', `0 0 ${svgscale} ${svgscale}`);
      return $svg;
    }

    const colorArrToSteppedGradient = (colorsArr) => colorsArr.map(
      (c, i) => `${c} ${i / colorsArr.length * 100}% ${(i + 1) / colorsArr.length * 100}%`
    ).join();
    //gotta fix
    const $steps = document.querySelectorAll('[data-steps]');
    const $selects = document.querySelectorAll('[data-select]');
    const $xSelect = document.querySelectorAll('[data-select="x"]');
    const $ySelect = document.querySelectorAll('[data-select="y"]');
    const $zSelect = document.querySelectorAll('[data-select="z"]');
    const $allSelect = document.querySelector('[data-select="all"]');
    const $models = document.querySelectorAll('[data-models]');
    const $loop = document.querySelectorAll('[data-loop]');
    const $randomize = document.querySelectorAll('[data-randomize]');
    const $toc = document.querySelector('[data-toc]');

    $models.forEach($model => {
      $model.innerHTML = hueBasedModels
        .map(model => `<option ${model.key == currentHueModel ? 'selected="true"' : ""} value="${model.key}">${model.label}</option>`)
        .join('');
      
      $model.addEventListener('change', (e) => {
        currentHueModel = e.target.value;
        currentModelFn = hueBasedModels.find(m => m.key === currentHueModel).fn;
        $models.forEach($model => $model.value = currentHueModel);
        updateSVG();
      });
    });

    let fnx = 'sinusoidalPosition';
    let fny = 'quadraticPosition';
    let fnz = 'linearPosition';
    let fnAll = 'sinusoidalPosition';

    $selects.forEach($select => {
      Object.keys(positionFunctions).forEach(fn => {
        const $option = document.createElement('option');
        if ($select === $xSelect && fn === fnx) $option.selected = true;
        if ($select === $ySelect && fn === fny) $option.selected = true;
        if ($select === $zSelect && fn === fnz) $option.selected = true;
        if ($select === $allSelect && fn === fnAll) $option.selected = true;
        $option.value = fn;
        $option.textContent = fn;
        $select.appendChild($option);
      });
    });

    let steps = parseInt($steps[0].value);

    let startHue = Math.random() * 360;

    let poline = new Poline({
      /*anchorColors: [
        [startHue, Math.random(), 0.8],
        [(startHue + 60 + Math.random() * 180) % 360, Math.random(), Math.random() * .2],
        [(startHue + 60 + Math.random() * 180) % 360, Math.random(), .8]
      ],*/
      numPoints: steps,
      positionFunctionX: positionFunctions[fnx],
      positionFunctionY: positionFunctions[fny],
      positionFunctionZ: positionFunctions[fnz],
      closedLoop: false,
    });

    const $picker = document.querySelector('[data-picker]');
    const hueSteps = 360 / 10;
    
    const svg = createSVG(svgscale);
    $picker.innerHTML = stepsToLabels(hueSteps);
    const huelabels = document.querySelectorAll('[data-huelabel]');
    $picker.appendChild($svg);
    
    $picker.style.setProperty('--grad', createCSSRainbowGradient(hueSteps));

    //const hue = Math.random() * 360;

    //poline.addAnchorPoint({color: [(startHue + 60 + Math.random() * 180) % 360, Math.random(), .8] });    
    //poline.addAnchorPoint({color: poline.anchorPoints[0].color});
    //console.log(poline);

    function updateSVG () {
      $huelabels.forEach(($huelabel, i) => {
        $huelabel.classList.remove('wheel__huelabel--active');
        // if the HUE label is within the range of the current anchor point
        poline.anchorPoints.forEach(anchor => {
          const currentHue = anchor.color[0];
          currentHue - hueSteps / 2 < i * 10 && currentHue + hueSteps / 2 > i * 10 && $huelabel.classList.add('wheel__huelabel--active');
        });
      });

      $svg.innerHTML = '';

      poline.anchorPoints.forEach(anchor => {
        const $circle = document.createElementNS(namespaceURI, 'circle');
        $circle.setAttribute('cx', anchor.x * svgscale);
        $circle.setAttribute('cy', anchor.y * svgscale);
        $circle.setAttribute('r', 2)
        //anchor.hslCSS
        $circle.classList.add('wheel__anchor');
        $circle.setAttribute('fill', '#fff');
        $svg.appendChild($circle);
      });

      poline.flattenedPoints.forEach((point, i) => {
        const $line = document.createElementNS(namespaceURI, 'line');
        $line.classList.add('wheel__line');
        $line.setAttribute('x1', point.x * svgscale);
        $line.setAttribute('y1', point.y * svgscale);
        const nextI = (i + 1) % poline.flattenedPoints.length;
        $line.setAttribute('x2', poline.flattenedPoints[nextI].x * svgscale);
        $line.setAttribute('y2', poline.flattenedPoints[nextI].y * svgscale);
        if (i !== poline.flattenedPoints.length - 1) {
          $svg.appendChild($line);
        }

        const $circle = document.createElementNS(namespaceURI, 'circle');
        $circle.setAttribute('cx', point.x * svgscale);
        $circle.setAttribute('cy', point.y * svgscale);
        $circle.setAttribute('r', .5 + point.color[1] * 1)
        $circle.classList.add('wheel__point');
        $circle.setAttribute('fill', formatHex({ mode: currentHueModel, ...currentModelFn(point.color) }) );
        $svg.appendChild($circle);
      });
      
      let cssColors = [...poline.colorsCSS];
      let colors = [...poline.colors].map(c => formatHex({ mode: currentHueModel, ...currentModelFn(c) }));
      //colors = [...poline.colors].map(c => formatCss({ mode: 'p3', ...currentModelFn(c) }));
      document.documentElement.style.setProperty(
        '--prev',
        colorArrToSteppedGradient(colors)
      )

      document.documentElement.style.setProperty(
        '--prev-smooth',
        colors.join(',')
      )

      document.documentElement.style.setProperty(
        '--c0',
        colors[colors.length - 1]
      );

      document.documentElement.style.setProperty(
        '--c1',
        colors[0]
      );
    }

    updateSVG();

    $loop.forEach($l => {
      $l.checked = poline.closedLoop;
      $l.addEventListener('change', () => {
        poline.closedLoop = $l.checked;
        updateSVG();
        $loop.forEach($l => {
          $l.checked = poline.closedLoop;
        });
      });
    });

    $steps.forEach($step => {
      $step.addEventListener('input', () => {
        steps = parseInt($step.value);
        poline.numPoints = steps;
        updateSVG();
        $steps.forEach($step => {
          $step.value = steps;
        });
      });
    });


    $allSelect.addEventListener('input', () => {
      fnAll = $allSelect.value;
      poline.positionFunction = positionFunctions[fnAll];
      updateSVG();
    });

    $xSelect.forEach($xSelect => {
      $xSelect.addEventListener('input', () => {
        fnx = $xSelect.value;
        poline.positionFunctionX = positionFunctions[fnx];
        updateSVG();
        $xSelect.forEach($el => {
          $el.value = fnx;
        });
      });
    });


    $ySelect.forEach($ySelect => {
      $ySelect.addEventListener('input', () => {
        fny = $ySelect.value;
        poline.positionFunctionY = positionFunctions[fny];
        updateSVG();
        $ySelect.forEach($el => {
          $el.value = fnx;
        });
      });
    });

    $zSelect.forEach($zSelect => {
      $zSelect.addEventListener('input', () => {
        fnz = $zSelect.value;
        poline.positionFunctionZ = positionFunctions[fnz];
        updateSVG();
        $zSelect.forEach($el => {
          $el.value = fnz;
        });
      });
    });

    $randomize.forEach($randomize => {
      $randomize.addEventListener('click', () => {
        poline.anchorPoints.forEach(anchor => {
          anchor.hsl = [
            (anchor.color[0] + (-90 + Math.random() * 90)) % 360,
            Math.random(),
            anchor.color[2] + (-.05 + Math.random() * .1)
          ];
        });
        poline.updatePointPairs();
        updateSVG();
      });
    });

    let currentPoint = null;
    let lastSelectedPoint = null;
    let lastX = 0;
    let lastY = 0;

    $picker.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      const x = lastX = e.offsetX / $picker.offsetWidth;
      const y = lastY = e.offsetY / $picker.offsetHeight;

      if (!currentPoint) {
        
        currentPoint = poline.getClosestAnchorPoint({ 
          xyz: [x, y, null], 
          maxDistance: .1 
        });
        lastSelectedPoint = currentPoint;
      } else {
        currentPoint = null;
      }
    });

    $picker.addEventListener('pointermove', (e) => {
      const x = lastX = e.offsetX / $picker.offsetWidth;
      const y = lastY = e.offsetY / $picker.offsetHeight;

      if (currentPoint) {
        e.stopPropagation();
        poline.updateAnchorPoint({point: currentPoint, xyz: [x, y, currentPoint.z]});
        updateSVG();
      } 
    });

  
  /*
  setInterval(() => {
    poline.anchorPoints[0].hsl = [
      (poline.anchorPoints[0].color[0] + 1) % 360,
      poline.anchorPoints[0].color[1],
      poline.anchorPoints[0].color[2]
    ];
    poline.anchorPoints[2].hsl = [
      (poline.anchorPoints[2].color[0] - 1) % 360,
      poline.anchorPoints[2].color[1],
      poline.anchorPoints[2].color[2]
    ];
    poline.updatePointPairs();
    updateSVG();
  }, 16.66);
  */
  


  $picker.addEventListener('pointerup', (e) => {
    currentPoint = null;
  });

  // listen for keypresses
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (!lastSelectedPoint) return;
      poline.removeAnchorPoint({point: lastSelectedPoint});
      updateSVG();
    }

    if (e.key === 'p') {
      lastSelectedPoint = poline.addAnchorPoint({xyz: [lastX, lastY, lastY]});
      updateSVG();
    }

    if (e.key === 'c') {
      if (!lastSelectedPoint) return;
      const $color = document.createElement('input');
      $color.type = 'color';
      $color.classList.add('hidden-color-picker');
      $color.setAttribute('aria-hidden', 'true');
      $color.style.position = 'absolute';
      $color.style.top = '-1000px';
      $color.style.right = '-1000px';
      $color.value = formatHex(lastSelectedPoint.hslCSS);
      $color.addEventListener('input', () => {
        const hslObj = toHSL($color.value);
        poline.updateAnchorPoint({
          point: lastSelectedPoint, color: [hslObj.h || 0, hslObj.s, hslObj.l]
        });
        
        updateSVG();
      });
      document.body.appendChild($color);
      $color.click();
    }

    if (e.key === 'ArrowLeft') {
      poline.shiftHue(-2)
      updateSVG();
    }

    if (e.key === 'ArrowRight') {
      poline.shiftHue(2)
      updateSVG();
    }
  });

  let exStartHue = Math.random() * 360;
  let globalInterval = null;

  // scripts per section
  const storyScripts = [{
    section: 'intro',
    fn: () => {
      console.log('intro');
      poline = new Poline({
        numPoints: steps,
      });
      updateSVG();
    },
  },
  {
    section: 'summoning',
    fn: (section) => {
      console.log('summoning');
      exStartHue = Math.random() * 360;
      poline = new Poline({
        anchorColors: [
          [exStartHue, Math.random(), 0.8],
          [(exStartHue + 60 + Math.random() * 180) % 360, Math.random(), Math.random() * .2],
          /*[(exStartHue + 60 + Math.random() * 180) % 360, Math.random(), .8]*/
        ],
      });
      updateSVG();
      const $code = section.target.querySelector('[data-code]');
      $code.innerHTML = `new Poline({
  anchorColors: [
    [${
      Math.round(poline.anchorPoints[0].color[0])
    }, ${
      poline.anchorPoints[0].color[1].toFixed(2)
    }, ${
      poline.anchorPoints[0].color[2].toFixed(2)
    }],
    [${
      Math.round(poline.anchorPoints[1].color[0])
    }, ${
      poline.anchorPoints[1].color[1].toFixed(2)
    }, ${
      poline.anchorPoints[1].color[2].toFixed(2)
    }],
    //... more colors
  ],
});`;

    hljs.highlightElement($code);
    },
  },
  {
    section: 'points',
    fn: (section) => {
      console.log('points');
      poline.numPoints = 6;
      updateSVG();
      const $code = section.target.querySelector('[data-code]');
      $code.innerHTML = `new Poline({
  numPoints: 6,
});`;
      hljs.highlightElement($code);
    },
  },
  {
    section: 'anchors',
    fn: (section) => {
      console.log('anchors');
      if (poline.anchorPoints.length > 2) {
        poline.anchorPoints.forEach((anchor, i) => {
          if (i > 1) poline.removeAnchorPoint({point: anchor});
        });
      }
      poline.addAnchorPoint({color: [(exStartHue + 60 + Math.random() * 180) % 360, Math.random(), .8] });
      const $code = section.target.querySelector('[data-code]');
      const lastPoint = poline.anchorPoints[poline.anchorPoints.length - 1];
      $code.innerHTML = `poline.addAnchorPoint({
  color: [${
        Math.round(lastPoint.color[0])
      }, ${
        lastPoint.color[1].toFixed(2)
      }, ${
        lastPoint.color[2].toFixed(2)
      }]
});
// or
poline.addAnchorPoint({
  xyz: [${
        lastPoint.position[0].toFixed(2)
      }, ${
        lastPoint.position[1].toFixed(2)
      }, ${
        lastPoint.position[2].toFixed(2)
      }]
});`;
      hljs.highlightElement($code);
      updateSVG();
    },
  },
  {
    section: 'closedLoop',
    fn: (section) => {
      console.log('closedLoop');
      poline.closedLoop = true;
      updateSVG();
      const $code = section.target.querySelector('[data-code]');
      $code.innerHTML = `let poline = new Poline({
  closedLoop: true,
});
// or
poline.closedLoop = true;`;
      hljs.highlightElement($code);
      updateSVG();
    }
  },
  {
    section: 'positionFunction',
    fn: (section) => {
      console.log('Position Function');
      if (poline.anchorPoints.length > 3) {
        poline.anchorPoints.forEach((anchor, i) => {
          if (i > 1) poline.removeAnchorPoint({ point: anchor });
        });
      }
      poline.closedLoop = false;
      poline.positionFunction = positionFunctions.linearPosition;
      poline.updatePointPairs();
      const $code = section.target.querySelector('[data-code]');
      $code.innerHTML = `import {
Poline, positionFunctions
} from 'poline';
new Poline({
  positionFunction: 
    positionFunctions.linearPosition,
});`;
      hljs.highlightElement($code);
      updateSVG();
    },
  },
  {
    section: 'positionFunctions',
    fn: (section) => {
      console.log('Position Functions');
      if (poline.anchorPoints.length > 3) {
        poline.anchorPoints.forEach((anchor, i) => {
          if (i > 1) poline.removeAnchorPoint({point: anchor});
        });
      }
      poline.closedLoop = false;
      poline.positionFunctionX = positionFunctions[fnx];
      poline.positionFunctionY = positionFunctions[fny];
      poline.positionFunctionZ = positionFunctions[fnz];
      $xSelect.forEach($xs => {
        $xs.value = fnx;
      });
      $ySelect.forEach($ys => {
        $ys.value = fny;
      });
      $zSelect.forEach($zs => {
        $zs.value = fnz;
      });
      poline.updatePointPairs();
      const $code = section.target.querySelector('[data-code]');
      $code.innerHTML = `new Poline({
  positionFunctionX: 
    positionFunctions.${poline.positionFunctionX.name},
  positionFunctionY: 
    positionFunctions.${poline.positionFunctionY.name},
  positionFunctionZ: 
    positionFunctions.${poline.positionFunctionZ.name},
});`;
      hljs.highlightElement($code);
      updateSVG();
    },
  },
  {
    section: 'closedLoop',
    fn: (section) => {
      console.log('closedLoop');
      poline.closedLoop = true;
      poline.updatePointPairs();
      const $code = section.target.querySelector('[data-code]');
      $code.innerHTML = `new Poline({
  closedLoop: true,
});`;
      hljs.highlightElement($code);
      updateSVG()
    },
  },
  {
    section: 'UpdatingAnchors',
    fn: (section) => {
      console.log('Updating Anchors');
      poline.anchorPoints.forEach((anchor, i) => {
        const hsl = anchor.color;
        poline.updateAnchorPoint({
          point: anchor,
          color: [
            hsl[0] + Math.random() * 60 - 30,
            hsl[1],
            hsl[1],
          ],
        });
      });
      const $code = section.target.querySelector('[data-code]');
      $code.innerHTML = `poline.updateAnchorPoint({
  point: poline.anchorPoints[0],
  color: [${
      Math.round(poline.anchorPoints[0].color[0])
    }, ${
      poline.anchorPoints[0].color[1].toFixed(2)
    }, ${
      poline.anchorPoints[0].color[2].toFixed(2)
    }]
});`;
      hljs.highlightElement($code);
      updateSVG();
    }, 
  },
  {
    section: 'closestAnchor',
    fn: (section) => {
      console.log('closestAnchor');
      const $code = section.target.querySelector('[data-code]');
      hljs.highlightElement($code);
    },
  },
  {
    section: 'removeAnchor',
    fn: (section) => {
      console.log('removeAnchor');

      poline.closedLoop = false;
      if (poline.anchorPoints.length < 3) {
        while (poline.anchorPoints.length < 3) {
          poline.addAnchorPoint({color: [(exStartHue + 60 + Math.random() * 180) % 360, Math.random(), .8] });
        }
      }

      poline.removeAnchorPoint({index: poline.anchorPoints.length - 1});
      const $code = section.target.querySelector('[data-code]');
      $code.innerHTML = `poline.removeAnchorPoint({
  point: poline.anchorPoints[
    poline.anchorPoints.length - 1
  ]
});
  // or
poline.removeAnchorPoint({
  index: poline.anchorPoints.length - 1
});`;
      hljs.highlightElement($code);
      updateSVG();
    },
  },
  {
    section: 'colorSpace',
    fn: (section) => {
      console.log('colorSpace');
      const $code = section.target.querySelector('[data-code]');
      $code.innerHTML = `import {Poline} from "poline";
import {formatHex} from "culori";
const poline = new Poline(/** options */);
const OKHslColors = [...poline.colors].map(
  c => formatHex({ 
    mode: 'okhsl', 
    {
      h: c.hsl[0], 
      s: c.hsl[1], 
      l: c.hsl[2]}
  })
);
const LCHColors = [...poline.colors].map(
  c => formatHex({ 
    mode: 'lch', 
    { 
      h: hsl[0],
      c: hsl[1] * 51.484,
      l: hsl[2] * 100,  
    }
  })
);`
      hljs.highlightElement($code);
      updateSVG();
    },
  },
  {
    section: 'hueShift',
    fn: (section) => {
      console.log('hueShift');
      const $code = section.target.querySelector('[data-code]');
      $code.innerHTML = `poline.shiftHue(1);`;
      hljs.highlightElement($code);
      globalInterval = setInterval(() => {
        poline.shiftHue(1);
        updateSVG();
      }, 16.66);
    }
  },
  {
    section: 'getColors',
    fn: (section) => {
      console.log('getColors');
      const $code = section.target.querySelector('[data-code]');
      hljs.highlightElement($code);
      updateSVG();
    },
  },
  {
    section: 'installation',
    fn: (section) => {
      console.log('Installation');
      const $code = section.target.querySelectorAll('[data-code]');
      $code.forEach($c => hljs.highlightElement($c));
    },
  }
];
  
  // create a table of contents
  const $sections = document.querySelectorAll('[data-section]');
  $sections.forEach($s => {
    const $h2 = $s.querySelector('h2');
    if ($h2) {
      const $li = document.createElement('li');
      $li.innerHTML = `<a href="#${$h2.id}">${$h2.innerHTML}</a>`;
      $toc.appendChild($li);
    }
  });

  $toc.addEventListener('click', (e) => {
    e.preventDefault();
    const $a = e.target;
    if ($a.tagName !== 'A') return;
    const $h2 = document.querySelector(`#${$a.getAttribute('href').replace('#', '')}`);
    $h2.scrollIntoView({behavior: 'smooth'});
  });

  // create an intersection onserver for all the `data-section`s
  const sections = [...document.querySelectorAll('[data-section]')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // find the script for this section in storyScripts
        const script = storyScripts.find(s => s.section === entry.target.dataset.section);
        if (script) {
          clearInterval(globalInterval);
          script.fn(entry);
        }
        // add .l-sec--active to the section when it's in view
        // and remove it on all other sections
        sections.forEach(section => {
          if (section === entry.target) {
            section.parentElement.classList.add('l-sec--active');
          } else {
            section.parentElement.classList.remove('l-sec--active');
          }
        });
        
      }
    });
  }, {
    rootMargin: '0px 0px -50% 0px'
  });

  sections.forEach(section => {
    observer.observe(section);
  });

  const $dmenu = document.querySelector('[data-menu]');

  $dmenu.addEventListener('scroll', (e) => {
    const scrollY = $dmenu.scrollTop;
    document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
  });
  </script>
   -->