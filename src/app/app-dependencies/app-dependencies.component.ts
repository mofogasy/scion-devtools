import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DevToolsManifestService } from '../dev-tools-manifest.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-app-dependencies',
  templateUrl: './app-dependencies.component.html',
  styleUrls: ['./app-dependencies.component.scss']
})
export class AppDependenciesComponent implements OnInit, OnDestroy {

  @ViewChild('svg', {read: ElementRef, static: true})
  private _svg: ElementRef;

  private _destroy$ = new Subject<void>();

  constructor(private _manifestService: DevToolsManifestService) {
  }

  ngOnInit(): void {
    this._manifestService.applicationDependencyMap$()
      .pipe(takeUntil(this._destroy$))
      .subscribe(deps => {

      const links = Array.from(deps.entries())
        .map(([app, apps]) => apps.map(a => ({source: app.symbolicName, target: a.symbolicName, type: 'licensing'})))
        .reduce((arr, a) => [...arr, ...a], []);

      console.log(links);

      const nodes = Array.from(deps.keys(), id => ({id: id.symbolicName}));
      const types = Array.from(new Set(links.map(d => d.type)));
      const color = d3.scaleOrdinal(types, d3.schemeCategory10);
      const width = 600;
      const height = 600;

      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-1500))
        .force('x', d3.forceX())
        .force('y', d3.forceY());

      // define svg to draw graph
      const svg = d3.select(this._svg.nativeElement);
      svg.selectAll('*').remove();
      svg.attr('viewBox', [-width / 2, -height / 2, width, height])
        .style('font', '12px sans-serif');

      // create arrow markers
      svg.append('defs').selectAll('marker')
        .data(types)
        .join('marker')
        .attr('id', d => `arrow-${d}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 15)
        .attr('refY', -0.5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('fill', color)
        .attr('d', 'M0,-5L10,0L0,5');

      // add links
      const link = svg.append('g')
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
        .selectAll('path')
        .data(links)
        .join('path')
        .attr('stroke', d => color(d.type))
        .attr('marker-end', d => `url(${new URL(`#arrow-${d.type}`, location.origin)})`);

      // add nodes
      const node = svg.append('g')
        .attr('fill', 'currentColor')
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .call(drag(simulation)); // allow nodes to be dragged

      node.append('circle')
        .attr('stroke', 'white')
        .attr('stroke-width', 1.5)
        .attr('r', 4);

      // add labels
      node.append('text')
        .attr('x', 8)
        .attr('y', '0.31em')
        .text(d => d.id)
        .clone(true).lower()
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 3);

      simulation.on('tick', () => {
        // position links
        link.attr('d', linkArc);

        // position nodes
        node.attr('transform', d => `translate(${d.x},${d.y})`);
      });

      node.exit().remove();

      // invalidation.then(() => chart.simulation.stop());
    });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
  }
}

function drag(simulation) {
  function dragstarted(d) {
    if (!d3.event.active) {
      simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) {
      simulation.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
}

function linkArc(d) {
  const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
  return `
    M${d.source.x},${d.source.y}
    A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
  `;
}
