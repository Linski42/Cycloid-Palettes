<!-- <script lang="ts">
    import { formatHex, converter } from 'culori';
    import {
      Poline,
      positionFunctions,
      randomHSLPair,
    } from "poline";


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
    const namespaceURI = 'http://www.w3.org/2000/svg';

    const stepsToLabels = (steps = 360 / 10) => new Array(steps)
        .fill('')
        .map((_, i) => `
          <strong class="wheel__huelabel" data-huelabel="${i}" style="--i: ${i / steps}">${i * 10}</strong>`)
        .join('')
    const createSVG = (svgscale = 100) => {
      const $svg = document.createElementNS(
        namespaceURI, 'svg'
      );
      $svg.setAttribute('viewBox', `0 0 ${svgscale} ${svgscale}`);
      return $svg;
    }

    const createCSSRainbowGradient = (steps = 360 / 10) => new Array(steps)
        .fill('')
        .map((_, i) => `hsl(${i / (steps - 1) * 360}, calc(var(--s) * 100%), calc(var(--l,0) * 100%))`)
        .join(',');
    const colorArrToSteppedGradient = (colorsArr) => colorsArr.map(
      (c, i) => `${c} ${i / colorsArr.length * 100}% ${(i + 1) / colorsArr.length * 100}%`
    ).join();

    const picker = document.querySelector('[data-picker]');
    const hueSteps = 360 / 10;
    
    const svg = createSVG(svgscale);
    picker.innerHTML = stepsToLabels(hueSteps);
    const huelabels = document.querySelectorAll('[data-huelabel]');
    picker.appendChild(svg);
    
    picker.style.setProperty('--grad', createCSSRainbowGradient(hueSteps));

    function updateSVG () {
      huelabels.forEach(($huelabel, i) => {
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

</script>
 -->