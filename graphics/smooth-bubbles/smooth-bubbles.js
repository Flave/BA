var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

//["#484160", "#574E67", "#665C6F", "#766B77", "#877C7F", "#998E88", "#ADA391", "#C3B99B", "#DBD2A5", "#F9F0B1"]
//["#F392D1","#FBE9A9","#90E4D0","#F8DED8","#97D9E4","#FBCE77","#FEF0D5","#4697FE","#9BF4EE"]




var i2Color = d3.scaleOrdinal()
  .domain(d3.range(0, 9))
  .range(["#F7BDAD","#F392D1","#FBE9A9","#F8DED8","#FBCE77","#FEF0D5","#FFD5A7","#FF8383"])

var bubbles = [];

function getDistance(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;

  return Math.sqrt( dx*dx + dy*dy );
}

function bubbleCollides(bubble) {
  var collide;
  for(var cIndex=0; cIndex<bubbles.length; cIndex++) {
    var checkCircle = bubbles[cIndex];
    var dist = Math.abs(getDistance(bubble, checkCircle));
    collide = dist < bubble.r + checkCircle.r; //d3.max([bubble.r, checkCircle.r]);
    if(collide) break;
  }
  return collide;
}

function generateRandomCircle() {
  return {
    x: Math.random() * 1440,
    y: Math.random() * 1024,
    r: Math.random() * 60 + 40,
    props: d3.range(10).map(() => { return {value: Math.random()} })
  }
}

function generateCircle() {
  var bubble = generateRandomCircle();
  if(bubbleCollides(bubble)) {
    return generateCircle();
  }
  else
    return bubble;
}

for(var i=0; i<20; i++) {
  bubbles.push(generateCircle());
}

var bubble = svg.selectAll('g').data(bubbles);

var bubbleEnter = bubble
  .enter()
  .append('g');


var clipPath = bubbleEnter
  .append('clipPath')
  .attr('id', (d, i) => ("circle-clip-" + i))

clipPath
  .append('circle')
  .attr('cx', (d, i) => d.x)
  .attr('cy', (d, i) => d.y)
  .attr('r', (d, i) => d.r);


bubbleEnter.each(function(bubble, i) {
  var gradient = d3.select(this)
    .selectAll('radialGradient')
    .data(bubble.props);

  var gradientEnter = gradient
    .enter()
    .append('radialGradient')
    .attr('id', (prop, propIndex) => ('gradient-' + i + '-' + propIndex))
    .each(function(prop, propIndex) {
      var a = ((Math.PI * 2) / bubble.props.length) * propIndex;
      var gradientRadius = .5;
      var placementRadius = .5 * prop.value;
      var x = Math.cos(a) * placementRadius + .3;
      var y = Math.sin(a) * placementRadius + .3;
      var fx = Math.cos(a) * placementRadius + .5;
      var fy = Math.sin(a) * placementRadius + .5;

      d3.select(this)
        .attr('cx', x)
        .attr('cy', y)
        .attr('fx', fx)
        .attr('fy', fy)
        .attr('r', gradientRadius);
    });

  gradientEnter
    .append('stop')
    .attr('offset', '0%')
    .each((d, i) => {
      console.log(i, i2Color(i))
    })
    .attr('stop-color', (d, i) => hexToRgbA(i2Color(i), 1));

  gradientEnter
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', (d, i) => hexToRgbA(i2Color(i), 0));


  d3.select(this)
    .selectAll('circle')
    .data(bubble.props)
    .enter()
    .append('circle')
    .attr('cx', bubble.x)
    .attr('cy', bubble.y)
    .attr('r', bubble.r)
    .style('opacity', (prop) => Math.pow(prop.value, 2))
    .attr('fill', (prop, propIndex) => 'url(#gradient-' + i + '-' + propIndex + ')')
    .attr('mask', 'url(#circle-clip-' + i + ')')
    .attr('filter', 'url(#pixelate)');
});


function hexToRgbA(hex, opacity){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',' + opacity + ')';
    }
    throw new Error('Bad Hex');
}