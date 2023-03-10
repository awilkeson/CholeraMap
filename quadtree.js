class Point {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
}

class Rectangle {
  constructor (x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point) {
    return (point.x > this.x - this.w &&
            point.x < this.x + this.w &&
            point.y > this.y - this.h &&
            point.y < this.y + this.h)
  }


}


class QuadTree {
  constructor(boundary, n) {
    this.boundary = boundary;
    this.capacity = n;
    this.points = [];
    this.clusterpoints = [];
    this.divided = false;
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;

    let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
    this.northeast = new QuadTree(ne, this.capacity);
    let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
    this.northwest = new QuadTree(nw, this.capacity);
    let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    this.southeast = new QuadTree(se, this.capacity);
    let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
    this.southwest = new QuadTree(sw, this.capacity);
    this.divided = true;

  }

  insert(point) {

    if (!this.boundary.contains(point)){
      return;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
    } else {
      if (!this.divided) {
        this.subdivide();
      }

      this.northeast.insert(point);
      this.northwest.insert(point);
      this.southeast.insert(point);
      this.southwest.insert(point);
    }
  } //end insert

  // viewTree() {
  //   plotsvg.selectAll("rect.qtree")
  //   .attr("visibility", "visible")
  //
  //   plotsvg.selectAll("circle.clusterpoint")
  //   .attr("visibility", "visible")
  //
  //   plotsvg.selectAll("text.clusterpoint")
  //   .attr("visibility", "visible")
  //
  //   plotsvg.selectAll("circle.clusterdot")
  //   .attr("visibility", "visible")
  // }

  printTree() {

    plotsvg.append('rect')
    .attr("class", "qtree")
    .attr("height", this.boundary.h*2)
    .attr("width", this.boundary.w*2)
    .attr("x", this.boundary.x)
    .attr("y", this.boundary.y)
    .attr("fill", "none")
    // rgba(0,0,0,0.25)
    .attr("stroke", "rgba(0,0,0,0.3)")
    .attr("stroke-width", "1.5")
    .attr("visibility", "hidden")
    if (this.divided) {
       this.northeast.printTree();
       this.northwest.printTree();
       this.southeast.printTree();
       this.southwest.printTree();
     }

    let c = this.points.length;

    if (c >= 1) {
      let totalx = 0;
      let totaly = 0;

      for (let p of this.points){
        totalx = totalx + p.x;
        totaly = totaly + p.y;
      }

      let newx = totalx / c;
      let newy = totaly / c;

      let np = new Point(newx, newy)

      this.clusterpoints.push(np, this.points);

      // console.log(this.clusterpoints);

      for (let np of this.clusterpoints){
        var cluster = this.clusterpoints[1];
        var clusterg = plotsvg.append('g').attr('class', 'clustered')
        .attr("visibility", "visible");
        var clicked = false;

        clusterg.append('circle')
        .attr("class", "clusterpoint")
        .attr("cx", np.x)
        .attr("cy", np.y)
        .attr("r", "5");


        clusterg.append("text")
        .text(c)
        .attr("class", "clusterpoint")
        .attr("x", np.x - 2.5)
        .attr("y", np.y + 3)
        .attr("fill", "white")
        .attr("font-size", "8");

        clusterg.on("mouseover", function(d){
          d3.select(this).attr("fill", "red");
        } );

        clusterg.on("click", function(d){
          clicked = true;
          d3.select(this).attr("visibility","hidden");
          for (let p of cluster){
            plotsvg.append('circle')
            .attr("class", "clusterdot")
            .attr("cx", p.x)
            .attr("cy", p.y)
            .attr("r", "3")
            .attr("fill", "pink")
            .attr("stroke", "gray")
            .attr("stroke-width", ".5");
          }

        } );
        clusterg.on("mouseout", function(d){
          if (clicked == true) {
            d3.select(this).attr("fill","#red")
          } else {
            d3.select(this).attr("fill","black")
          }
        } );

      } //end of each cluster point loop

      // plotsvg.selectAll("circle.clusterpoint")
      // .attr("visibility", "visible");
      //
      // plotsvg.selectAll("text.clusterpoint")
      // .attr("visibility", "visible");
      //
      // plotsvg.selectAll("circle.clusterdot")
      // .attr("visibility", "visible");

    } //end of if

  }

  clearTree() {
    plotsvg.selectAll("rect.qtree")
    .attr("visibility", "hidden")

    plotsvg.selectAll("circle.clusterpoint")
    .attr("visibility", "hidden")

    plotsvg.selectAll("text.clusterpoint")
    .attr("visibility", "hidden")

    plotsvg.selectAll("circle.clusterdot")
    .attr("visibility", "hidden")
  }


}
