<!-- <script context="module" lang="ts">

    import { formatHex, converter } from 'culori';
    import {
      Poline,
      positionFunctions,
      randomHSLPair,
    } from "poline";
    import { onMount } from 'svelte';

  onMount(() => {
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
    const createSVG = (svgscale = 100) => {
      const $svg = document.createElementNS(
        namespaceURI, 'svg'
      );
      $svg.setAttribute('viewBox', `0 0 ${svgscale} ${svgscale}`);
      return $svg;
    }
    const svg = createSVG(svgscale);
    function updateSVG(poline: Poline, canvas: HTMLCanvasElement){
      poline.flattenedPoints.forEach((point, i) => {
        const line = document.createElementNS(namespaceURI, 'line');
        line.classList.add('wheel__line');
        line.setAttribute('x1', (point.x * svgscale).toString());
        line.setAttribute('y1', (point.y * svgscale).toString());
        const nextI = (i + 1) % poline.flattenedPoints.length;
        line.setAttribute('x2', (poline.flattenedPoints[nextI].x * svgscale).toString());
        line.setAttribute('y2', (poline.flattenedPoints[nextI].y * svgscale).toString());
        if (i !== poline.flattenedPoints.length - 1) {
          svg.appendChild(line);
        }

        const circle = document.createElementNS(namespaceURI, 'circle');
        circle.setAttribute('cx', (point.x * svgscale).toString());
        circle.setAttribute('cy', (point.y * svgscale).toString());
        circle.setAttribute('r',  (.5 + point.color[1] * 1).toString());
        circle.classList.add('wheel__point');
        circle.setAttribute('fill', (formatHex({ mode: currentHueModel, ...currentModelFn(point.color) })));
        svg.appendChild(circle);
      });
    }
    }
</script>
    <svg
    	bind:this={svg}
    	width={32}
    	height={32}
    > </svg>
-->