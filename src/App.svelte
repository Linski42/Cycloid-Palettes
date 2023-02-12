<script lang="ts">
  import {hslToPoint, Poline, positionFunctions} from "poline";
  import { interpolate } from 'culori';
  import { formatHex } from 'culori';
  let H = 120;
  let Hp = 0;
  let S = 0.7;
  let Sp = 1;
  let L = 0.6;
  let Lp = 0.6; 
  let cycloidRadius = 0.14;
  let nPoints = 7;
  let scale = 0.3;
  let polina = new Poline({
    anchorColors: [
      [H, S, L],
    [Hp, Sp, Lp]
  ],
  numPoints: nPoints,
  closedLoop: false,
   positionFunction: 
    positionFunctions.linearPosition,
  });
  function cycloid(y: number){//returns cycloid x value given y
    const h = cycloidRadius;
    let v: number = h*Math.acos( (1 - ((y*scale)/h)) ) - Math.sqrt( 2*h*(y*scale)-(y*scale)^2 )
    if(isNaN(v)){
      v = -( h*Math.acos( (1 - ((scale*y)/h)) ) - Math.sqrt( 2*h*(scale*y)-(y*scale)^2 ) ) + 2*Math.PI*h
    }
    return v;
  }
  function calculateCycloidFromPoint(){
    let origin = polina.anchorPoints[0];
    while(polina.anchorPoints.length > 2){
      polina.removeAnchorPoint({index: polina.anchorPoints.length-1})
    }
    for(let i = 0; i<cycloidRadius*2*Math.PI; i=i + 0.2){
    polina.addAnchorPoint({
      xyz: [origin.y+cycloid(i),origin.y+i, 0.5],
      insertAtIndex: polina.anchorPoints.length-1
      })
  }
  updateColorPoints()
}
  function updateNPoints(){
    polina.numPoints = nPoints-2
  }
  function updateColorPoints(){
    //polina.anchorPoints.forEach(e => {
    //  polina.updateAnchorPoint({})
    //});
    polina.updateAnchorPoint({
    point: polina.anchorPoints[0],
    color: [H, S, L]
    });
    polina.updateAnchorPoint({
    point: polina.anchorPoints[1],
    color: [Hp, Sp, Lp]
    });
    polina.numPoints = nPoints - 2
    polina = polina
  }

  //Color wheel/bar 
  let canvas: HTMLCanvasElement;
  var colors;
  import { onMount, tick } from 'svelte';
  onMount(() => {
    let frame;
  	let ctx = canvas.getContext('2d');
  	(function loop() {
    const width = canvas.width;
    const height = canvas.height;
    frame = requestAnimationFrame(loop);
    let grd = ctx.createConicGradient(Math.PI/2, width/2, height/2);
    colors = polina.colors.map((e, i) => {
      if(i===0){return formatHex({ mode: 'okhsl', h: e[0], s: e[1], l: e[2] })}
      if(i===polina.colors.length-1){return formatHex({ mode: 'okhsl', h: e[0], s: e[1], l: e[2] });}
      return formatHex({ mode: 'okhsl', h: e[0], s: e[1], l: e[2] });
    });

    //let inter = interpolate(['red', ['green', 0.5], 'blue']);//swap these out for our hsl values
    //let inter = interpolate(colors);//swap these out for our hsl values
    for(let i = 0; i < colors.length; i++){
      grd.addColorStop(i*(1/colors.length), colors[i]);
      grd.addColorStop(i*(1/colors.length)+(1/(colors.length)), colors[i]);
    }

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);
}())
  	return () => {
  		cancelAnimationFrame(frame);
  	};
  });
</script>

<main>
    <div>
    <canvas 
    	bind:this={canvas}
      width = {400}
      height = {400}
    > </canvas>
    </div>
  <div>

  </div>
  <h1>Colors</h1>
    <div>
      	Number of Points: <input type=range bind:value={nPoints} on:change={updateNPoints} min = 3 max = 50> {nPoints}
    </div>
    <div>
    Cycloid: <input type=button on:click={calculateCycloidFromPoint}>
    </div>
    <div>
    Radius: {cycloidRadius}<input type=range bind:value={cycloidRadius} on:change={calculateCycloidFromPoint} min = -1 max = 1 step = 0.001>
    </div>
    <div>
    Scale: {scale}<input type=range bind:value={scale} on:change={calculateCycloidFromPoint} min = -1 max = 1 step = 0.001>
    </div>
  <div class = "card">
    <label>
      [HSL One]
    	H: ({H})<input type=range bind:value={H} on:input={updateColorPoints} min = 0 max = 360>
    	S: <input type=range bind:value={S} on:input={updateColorPoints} min = 0 max = 1 step = 0.01>
    	L: <input type=range bind:value={L} on:input={updateColorPoints} min = 0 max = 1 step = 0.01>
    </label>

    <label>
      <div></div>
      [HSL Two]
    	H: ({Hp})<input type=range bind:value={Hp} on:input={updateColorPoints} min = 0 max = 360>
    	S: <input type=range bind:value={Sp} on:input={updateColorPoints} min = 0 max = 1 step = 0.01>
    	L: <input type=range bind:value={Lp} on:input={updateColorPoints} min = 0 max = 1 step = 0.01>
    </label>
    <div>
      <!-- <p>Color values are: {colors}</p>
      <p>colors hex is: { ii }</p> -->

    </div>
  </div>


</main>

<style>

  p, input {text-align: left;}
    .breaking{    
        width:500px;
        word-wrap: break-word;
    }
    canvas {
		width: 50%;
		height: 50%;
		background-color: #666;
    word-wrap: break-word;
	  }
  .picker {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      --s: .4;
      --l: .5;
      border-radius: 50%;
      background: radial-gradient(closest-side, #000, rgba(255, 255, 255, 0), #fff), 
                  conic-gradient(from 90deg, var(--grad));
    }
    .poline-picker {
      position: absolute;
      width: min(60vmin, 60%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .poline-picker__circprev {
      width: 12vmin;
      height: 12vmin;
      background: conic-gradient(var(--prev));
      border-radius: 50%;
      position: absolute;
      top: 100%;
      left: 50%;
      z-index: 3;
      transition: transform 0.5s cubic-bezier(0.3, 0.7, 0, 1);
      box-shadow: 0 0 0 0.7vmin var(--bg);
      pointer-events: none;
      transform: translate(-50%, -50%) scale(0.4);
    }
</style>