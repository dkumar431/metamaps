/* global Metamaps, $ */

/*
 * Metamaps.Organize.js.erb
 *
 * Dependencies:
 *  - Metamaps.Visualize
 */
Metamaps.Organize = {
  init: function () {},
  arrange: function (layout, centerNode) {
    // first option for layout to implement is 'grid', will do an evenly spaced grid with its center at the 0,0 origin
    if (layout == 'grid') {
      var numNodes = _.size(Metamaps.Visualize.mGraph.graph.nodes); // this will always be an integer, the # of nodes on your graph visualization
      var numColumns = Math.floor(Math.sqrt(numNodes)) // the number of columns to make an even grid
      var GRIDSPACE = 400
      var row = 0
      var column = 0
      Metamaps.Visualize.mGraph.graph.eachNode(function (n) {
        if (column == numColumns) {
          column = 0
          row += 1
        }
        var newPos = new $jit.Complex()
        newPos.x = column * GRIDSPACE
        newPos.y = row * GRIDSPACE
        n.setPos(newPos, 'end')
        column += 1
      })
      Metamaps.Visualize.mGraph.animate(Metamaps.JIT.ForceDirected.animateSavedLayout)
    } else if (layout == 'grid_full') {
      // this will always be an integer, the # of nodes on your graph visualization
      var numNodes = _.size(Metamaps.Visualize.mGraph.graph.nodes)
      // var numColumns = Math.floor(Math.sqrt(numNodes)) // the number of columns to make an even grid
      // var GRIDSPACE = 400
      var height = Metamaps.Visualize.mGraph.canvas.getSize(0).height
      var width = Metamaps.Visualize.mGraph.canvas.getSize(0).width
      var totalArea = height * width
      var cellArea = totalArea / numNodes
      var ratio = height / width
      var cellWidth = sqrt(cellArea / ratio)
      var cellHeight = cellArea / cellWidth
      var row = floor(height / cellHeight)
      var column = floor(width / cellWidth)
      var totalCells = row * column

      if (totalCells)
        Metamaps.Visualize.mGraph.graph.eachNode(function (n) {
          if (column == numColumns) {
            column = 0
            row += 1
          }
          var newPos = new $jit.Complex()
          newPos.x = column * GRIDSPACE
          newPos.y = row * GRIDSPACE
          n.setPos(newPos, 'end')
          column += 1
        })
      Metamaps.Visualize.mGraph.animate(Metamaps.JIT.ForceDirected.animateSavedLayout)
    } else if (layout == 'radial') {
      var centerX = centerNode.getPos().x
      var centerY = centerNode.getPos().y
      centerNode.setPos(centerNode.getPos(), 'end')

      console.log(centerNode.adjacencies)
      var lineLength = 200
      var usedNodes = {}
      usedNodes[centerNode.id] = centerNode
      var radial = function (node, level, degree) {
        if (level == 1) {
          var numLinksTemp = _.size(node.adjacencies)
          var angleTemp = 2 * Math.PI / numLinksTemp
        } else {
          angleTemp = 2 * Math.PI / 20
        }
        node.eachAdjacency(function (a) {
          var isSecondLevelNode = (centerNode.adjacencies[a.nodeTo.id] != undefined && level > 1)
          if (usedNodes[a.nodeTo.id] == undefined && !isSecondLevelNode) {
            var newPos = new $jit.Complex()
            newPos.x = level * lineLength * Math.sin(degree) + centerX
            newPos.y = level * lineLength * Math.cos(degree) + centerY
            a.nodeTo.setPos(newPos, 'end')
            usedNodes[a.nodeTo.id] = a.nodeTo

            radial(a.nodeTo, level + 1, degree)
            degree += angleTemp
          }
        })
      }
      radial(centerNode, 1, 0)
      Metamaps.Visualize.mGraph.animate(Metamaps.JIT.ForceDirected.animateSavedLayout)
    } else if (layout == 'center_viewport') {
      var lowX = 0,
        lowY = 0,
        highX = 0,
        highY = 0
      var oldOriginX = Metamaps.Visualize.mGraph.canvas.translateOffsetX
      var oldOriginY = Metamaps.Visualize.mGraph.canvas.translateOffsetY

      Metamaps.Visualize.mGraph.graph.eachNode(function (n) {
        if (n.id === 1) {
          lowX = n.getPos().x
          lowY = n.getPos().y
          highX = n.getPos().x
          highY = n.getPos().y
        }
        if (n.getPos().x < lowX) lowX = n.getPos().x
        if (n.getPos().y < lowY) lowY = n.getPos().y
        if (n.getPos().x > highX) highX = n.getPos().x
        if (n.getPos().y > highY) highY = n.getPos().y
      })
      console.log(lowX, lowY, highX, highY)
      var newOriginX = (lowX + highX) / 2
      var newOriginY = (lowY + highY) / 2
    } else alert('please call function with a valid layout dammit!')
  }
}; // end Metamaps.Organize
