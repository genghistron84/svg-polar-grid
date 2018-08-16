function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  var d = [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
  return d;       
}

function generate_svg()
{
  var q_width = $('#qwidth').val();
  var q_height = $('#qheight').val();
  var num_circles = $('#n_circles').val();
  var num_divisions = $('#divisions').val();
  var c_angle = 360 / $('#divisions').val();
  var n_sub_circles = $('#n_sub_circles').val();
  
  // convert inches into pixels
  qwp = q_width * 96;
  qhp = q_height * 96;	  
  path = '';

  /*for(i = 1; i <= q_width; i++)
  {
    path += '<path style="opacity:1;fill:none;fill-opacity:1;stroke:#eeeeee;stroke-width:0.96;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 0 ' + ((96 * i) - 48) + ' L ' + (96 * q_width) + ' ' + ((96 * i) - 48) + '" />';
    path += '<path style="opacity:1;fill:none;fill-opacity:1;stroke:#eeeeee;stroke-width:0.96;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M ' + ((96 * i) - 48) + ' 0 L ' + ((96 * i) - 48) + ' ' + (96 * q_height) + '" />';

    if(i < q_width) 
    {
      path += '<path style="opacity:1;fill:none;fill-opacity:1;stroke:#dddddd;stroke-width:0.96;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 0 ' + (96 * i) + ' L ' + (96 * q_width) + ' ' + (96 * i) + '" />';    
      path += '<path style="opacity:1;fill:none;fill-opacity:1;stroke:#dddddd;stroke-width:0.96;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M ' + (96 * i) + ' 0 L ' + (96 * i) + ' ' + (96 * q_height) + '" />';
    }
  }*/

  //draw angled lines
  for(i = 1; i <= num_divisions; i++)
  {
    angle = ((i - 1) * c_angle) * (Math.PI / 180);
    start_x = (q_height / 2) * 96;
    start_y = (q_width / 2) * 96;

    for(j = 1; j <= num_circles * 2; j++) 
    {	
      //len = (q_width / 2) * 96;
      len = 48;
      end_x = start_x + len * Math.cos(angle);
      end_y = start_y + len * Math.sin(angle);
      path += '<path style="opacity:1;fill:none;fill-opacity:1;stroke:#' + (j % 2 ? 'aaaaaa' : 'ccc') + ';stroke-width:' + (i % 2 ? 0.48 : 0.96) + ';stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M ' + start_x + ' ' + start_y + ' L ' + end_x + ' ' + end_y + '" />';
      start_x = end_x;
      start_y = end_y;
    }
  }

  for(j = 1; j <= num_circles; j++)
  {
    for(i = 1; i <= num_divisions; i++)
    {		  
      var color = "999";
      if(i % 2 == 1) {
        color = "555";
      }
      var start_angle = i * c_angle;
      var end_angle = (i * c_angle) + c_angle;
      console.log("start: " + start_angle + ", end angle: " + end_angle);      
      path += '<path style="opacity:1;fill:none;fill-opacity:1;stroke:#' + color + ';stroke-width:0.96;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="' + describeArc((q_width / 2) * 96, (q_height / 2) * 96, (96 * j), start_angle, end_angle) + '" />'

      // half diameter
      if(n_sub_circles == "half-inch")
      {
        path += '<path style="opacity:1;fill:none;fill-opacity:1;stroke:#' + (i % 2 ? "000" : "555") + ';stroke-width:0.48;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="' + describeArc((q_width / 2) * 96, (q_height / 2) * 96, ((96 * j) - 48), start_angle, end_angle) + '" />'
      }
      else if(n_sub_circles == "quarter-inch")
      {
        path += '<path style="opacity:1;fill:none;fill-opacity:1;stroke:#' + (i % 2 ? "000" : "555") + ';stroke-width:0.48;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="' + describeArc((q_width / 2) * 96, (q_height / 2) * 96, ((96 * j) - 72), start_angle, end_angle) + '" />'
        path += '<path style="opacity:1;fill:none;fill-opacity:1;stroke:#' + (i % 2 ? "000" : "555") + ';stroke-width:0.48;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="' + describeArc((q_width / 2) * 96, (q_height / 2) * 96, ((96 * j) - 48), start_angle, end_angle) + '" />'
        path += '<path style="opacity:1;fill:none;fill-opacity:1;stroke:#' + (i % 2 ? "000" : "555") + ';stroke-width:0.48;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="' + describeArc((q_width / 2) * 96, (q_height / 2) * 96, ((96 * j) - 24), start_angle, end_angle) + '" />'
      }	
    }
  }

  svg = '<?xml version="1.0" encoding="UTF-8" standalone="no"?> \
  <svg xmlns:dc="http://purl.org/dc/elements/1.1/" \
  xmlns:cc="http://creativecommons.org/ns#" \
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" \
  xmlns:svg="http://www.w3.org/2000/svg" \
  xmlns="http://www.w3.org/2000/svg" \
  xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" \
  xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" \
  version="1.0" \
  id="svg2" \
  height="' + q_height + 'in" \
  width="' + q_width + 'in" \
  sodipodi:docname="test2.svg" \
  inkscape:version="0.92.3 (2405546, 2018-03-11)"> \
  <metadata id="metadata2224"> \
  <rdf:RDF> \
  <cc:Work rdf:about=""> \
  <dc:format>image/svg+xml</dc:format> \
  <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> \
  <dc:title></dc:title> \
  </cc:Work> \
  </rdf:RDF> \
  </metadata> \
  <defs id="defs2222" /> \
  <sodipodi:namedview \
  pagecolor="#ffffff" \
  bordercolor="#666666" \
  borderopacity="1" \
  objecttolerance="10" \
  gridtolerance="10" \
  guidetolerance="10" \
  inkscape:pageopacity="0" \
  inkscape:pageshadow="2" \
  inkscape:window-width="1920" \
  inkscape:window-height="1017" \
  id="namedview2220" \
  showgrid="false" \
  inkscape:zoom="0.73611111" \
  inkscape:cx="576" \
  inkscape:cy="684.67925" \
  inkscape:window-x="-8" \
  inkscape:window-y="-8" \
  inkscape:window-maximized="1" \
  inkscape:current-layer="svg2" /> \
  ' + path + ' \
  </svg>';

  document.getElementById('drawing-area').innerHTML = svg;  
  //var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
  //set url value to a element's href attribute.
  var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
  var link = document.getElementById("svg-source")
  link.href = url;
  link.download = "circles.svg";
}
