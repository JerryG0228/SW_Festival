import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import versor from 'versor';

export default function Sphere() {
  const d3Container = useRef(null);

  useEffect(() => {
    if (d3Container.current) {
      const canvasExists = !d3.select('body').select('canvas').empty();
      const svgExists = !d3.select('body').select('svg').empty();

      // 요소가 존재하는 경우에만 제거
      if (canvasExists) {
        d3.select('body').select('canvas').remove();
      }
      if (svgExists) {
        d3.select('body').select('svg').remove();
      }

      // const svg = d3.select(d3Container.current);
      let starPath = null;
      var width = 650; // window.innerWidth;
      var projection = d3.geoOrthographic();
      var sphere = { type: 'Sphere' };

      var height = function (c) {
        var c = d3.geoPath(projection.fitWidth(width, sphere)).bounds(sphere);
        var x0 = c[0][0];
        var y0 = c[0][1];
        var x1 = c[1][0];
        var y1 = c[1][1];
        var dy = Math.ceil(y1 - y0);
        var l = Math.min(Math.ceil(x1 - x0), dy);
        projection.scale((projection.scale() * (l - 1)) / l).precision(0.2);
        return dy;
      };
      height = height(width); // made it as number

      var canvas = d3.select('body').append('canvas').attr('width', width).attr('height', height);

      var context = canvas.node().getContext('2d');

      // Angeles National Forest
      var observer = { longitude: -118.133333, latitude: 34.333333 };
      var obChger = [observer.longitude, observer.latitude];

      // Lambda λ(scr y axis), Phi φ(scr x axis)
      function flippedStereographic(λ, φ) {
        var cosλ = Math.cos(λ);
        var cosφ = Math.cos(φ);
        var k = 1 / (1 + cosλ * cosφ);
        return [-k * cosφ * Math.sin(λ), k * Math.sin(φ)];
      }

      var projectionLookup = d3
        .geoProjection(flippedStereographic)
        .scale(width / 2)
        .clipAngle(90)
        .rotate([-observer.longitude, -observer.latitude])
        .translate([width / 2, height / 2])
        .precision(0.1);

      projection
        .scale(width / 2)
        .clipAngle(90)
        .rotate([observer.longitude, observer.latitude])
        .translate([width / 2, height / 2])
        .precision(0.1);

      // lookup view
      var lookupPath = d3.geoPath(projectionLookup, context);

      // drag use
      var dragPath = d3.geoPath(projection, context);

      var gratln = d3
        .geoGraticule()
        .step([15, 15])
        .stepMajor([90, 360])
        .extentMinor([
          [-180, -75 - 1e-6],
          [180, 75 + 1e-6],
        ])();

      var meridian0 = d3
        .geoGraticule()
        .step([90, 0])
        .extent([
          [-0.1, -90 - 1e-6],
          [0.1, 90 + 1e-6],
        ])();

      var equator = d3
        .geoGraticule()
        .step([0, 90])
        .extent([
          [-180, -1],
          [180, 1],
        ])();

      var ecliptic = {
        type: 'LineString',
        coordinates: [
          [-180, 0],
          [-90, -23.43656],
          [0, 0],
          [90, 23.43656],
          [180, 0],
        ],
      };

      var stars,
        ctLines,
        rScale,
        legendScale,
        legendSqrt,
        cLegend = [];

      var map = d3
        .select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', width / 10)
        .attr('transform', 'translate(-500, 80)')
        .append('g')
        .attr('id', 'legend')
        .attr('transform', 'translate(20, 35)');

      function drawLegend(min, max) {
        cLegend.push(min);

        for (let i = 0; i < max; ++i) {
          cLegend.push(i);
        }
        cLegend.push(max);

        legendScale = d3
          .scaleLinear()
          .domain([min, max])
          .range([30, height - height / 10]);

        legendSqrt = d3.scaleSqrt().domain([min, max]).range([max, 0.25]);

        d3.select('#legend')
          .selectAll('circle')
          .data(cLegend)
          .enter()
          .append('circle')
          .attr('r', function (d) {
            return legendSqrt(d);
          })
          .attr('cx', function (d) {
            return legendScale(d);
          });

        d3.select('#legend')
          .selectAll('text')
          .data(cLegend)
          .enter()
          .append('text')
          .attr('x', function (d) {
            return legendScale(d) - 4;
          })
          .attr('y', -25)
          .attr('fill', 'red')
          .text(function (d) {
            return d;
          });
      }

      var urlA = 'https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/constellations.lines.json';
      d3.json(urlA).then(function (d) {
        ctLines = d;
      });

      var urlB = 'https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/stars.8.json';
      d3.json(urlB).then(function (data) {
        stars = data;
        var maxMag,
          starsize = [];

        //bl.ocks.org/pnavarrc/9730300
        rScale = d3
          .scaleSqrt() // scaleLinear()
          .domain(
            d3.extent(
              data.features, // d => d.properties.mag
              function (d) {
                starsize.push(d.properties.mag);
                return d.properties.mag;
              }
            )
          )
          .range([d3.max(starsize), 0.25]);
        /*
  // - Try to draw stars legend
  // d3.max() Mag. dimmest: 8
  // d3.min() Mag. brightest: -1.44
  cLegend = [d3.min(starsize), 0, 1, 2, 3, 4, 5, 6, 7, d3.max(starsize)];
*/
        // drawLegend(d3.min(starsize), d3.max(starsize));
        // - End Try

        starPath = d3.geoPath(projectionLookup, context).pointRadius((d) => rScale(d.properties.mag));

        /** the shortest version without rScale
  starPath = d3.geoPath(projection, context)
    .pointRadius(d => d.properties ?
      d3.scaleLinear()
        .domain(d3.extent(star.features, d => d.properties.mag))
        .range([5, 1])(d.properties.mag) : 5
    );
*/
        function render(highend) {
          context.clearRect(0, 0, width, height);

          // Globe Background
          context.beginPath();
          lookupPath(sphere);
          context.fillStyle = 'rgb(1, 16, 32)';
          context.fill();

          // Graticule
          context.beginPath();
          lookupPath(gratln);
          context.lineWidth = 0.5;
          context.strokeStyle = '#fff';
          context.stroke();

          // Equator
          context.beginPath();
          context.lineWidth = 2.0;
          lookupPath(equator);
          context.strokeStyle = 'rgba(255, 0, 0, 0.85)';
          context.stroke();

          // Prime Meridian
          context.beginPath();
          lookupPath(meridian0);
          context.strokeStyle = 'rgba(16, 138, 0, 0.85)';
          context.stroke();

          // Ecliptic
          context.beginPath();
          lookupPath(ecliptic);
          context.strokeStyle = 'rgb(241, 177, 14)';
          context.stroke();

          // Constellations Lines
          context.beginPath();
          lookupPath(ctLines);
          context.lineWidth = 1.0;
          context.strokeStyle = 'rgb(255, 255, 32)';
          context.stroke();

          if (highend) {
            // Stars Map
            stars.features.forEach((star) => {
              context.beginPath();
              starPath(star);
              context.fillStyle = 'rgba(255, 255, 255, 0.5)';
              context.fill();
            });
          }
          // Globe Edge
          context.beginPath();
          dragPath(sphere);
          context.lineWidth = 4.0;
          context.strokeStyle = '#00f';
          context.stroke();
        }
        render();

        // zoom v6
        return d3
          .select(context.canvas)
          .call(
            zoom(projection)
              .on('zoom.render', () => render(false))
              .on('end.render', () => render(true))
          )
          .call(() => render(true))
          .node();

        function zoom(
          projection,
          {
            // Capture the projection’s original scale, before any zooming.
            scale = projection._scale === undefined ? (projection._scale = projection.scale()) : projection._scale,
            scaleExtent = [1.0, 10],
          } = {}
        ) {
          let v0, q0, r0, a0, tl;

          const zoom = d3
            .zoom()
            .scaleExtent(scaleExtent.map((x) => x * scale))
            .on('start', zoomstarted)
            .on('zoom', zoomed);

          function point(event, that) {
            const t = d3.pointers(event, that);

            if (t.length !== tl) {
              tl = t.length;

              if (tl > 1) {
                a0 = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
              }
              zoomstarted.call(that, event);
            }

            return tl > 1
              ? [d3.mean(t, (p) => p[0]), d3.mean(t, (p) => p[1]), Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0])]
              : t[0];
          }

          function zoomstarted(event) {
            v0 = versor.cartesian(projection.invert(point(event, this)));
            q0 = versor((r0 = projection.rotate()));
          }

          function zoomed(event) {
            projection.scale(event.transform.k);
            projectionLookup.scale(event.transform.k);

            const pt = point(event, this);
            const v1 = versor.cartesian(projection.rotate(r0).invert(pt));
            const delta = versor.delta(v0, v1);
            let q1 = versor.multiply(q0, delta);

            // For multitouch, compose with a rotation around the axis.
            if (pt[2]) {
              const d = (pt[2] - a0) / 2;
              const s = -Math.sin(d);
              const c = Math.sign(Math.cos(d));
              q1 = versor.multiply([Math.sqrt(1 - s * s), 0, 0, c * s], q1);
            }
            projection.rotate(versor.rotation(q1));
            var newPoint = projection.invert([width / 2, width / 2]);

            obChger = newPoint;
            observer.longitude = newPoint[0];
            observer.latitude = newPoint[1];

            projectionLookup.rotate([observer.longitude, -observer.latitude]);

            // In vicinity of the antipode (unstable) of q0, restart.
            if (delta[0] < 0.7) {
              zoomstarted.call(this, event);
            }
          }

          return Object.assign(
            (selection) => selection.property('__zoom', d3.zoomIdentity.scale(projection.scale())).call(zoom),
            {
              on(type, ...options) {
                return options.length ? (zoom.on(type, ...options), this) : zoom.on(type);
              },
            }
          );
        }
      });
    }
  }, []);

  return <svg className='d3-component' width={400} height={200} ref={d3Container} />;
}
