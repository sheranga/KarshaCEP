function StockPRC_graph(permno,id){
	var url = "stockprice?PERMNO="+permno;
	$.ajax({
		type : 'GET',
		url : url,
		dataType : 'json',
		success : function(data) {
			negSlope_getdata(id,data,url,permno);
			draw_pricegrap(id,data);
			},
			error : function(data, error) {
				console.log(error+"data doesn't loading correctly");
			},
			async : false
	});
}

var globalDates=[], globalPrice=[];

function negSlope_getdata(id,data,url,permno){
	console.log("new element loaded: "+data);
	
	$.ajax({
		type : 'GET',
		url : url,
		dataType : 'json',
		success : function(data) {
			console.log("original :"+data);
			var dates=[], Pprice=[], slope=[], d=1;
			//dates.push("x");
			//slope.push("Slope value");
			var sizeOfArr = Object.keys(data.AllDates).length;
			for(var i=0; i<sizeOfArr; i=i+d){
				dates.push(data.AllDates[i]);
				Pprice.push(data.PseudoPRC[i]);
				//console.log(dates[i]);
			}
			globalPrice=Pprice;
			globalDates=dates;
			intermediateSlopeData(dates,Pprice,d);
		},
		error : function(data, error) {
			console.log(error+"data doesn't loading correctly");
		},
		async : false
	});
	//console.log(data);
}

function intermediateSlopeData(dates,Pprice,d){
	var slope=[], newPprice=[], newDates=[];
	slope.push("Slope values");
	newDates.push("x");
	for(var i=0; i<globalPrice.length; i=i+d){
		newDates.push(globalDates[i]);
		slope.push(globalPrice[i+d]-globalPrice[i]);
		//console.log(slope[i]);
	}
	draw_negSlope(newDates,slope);
}



function draw_negSlope(dates,slope) {
	console.log(slope);
	console.log(dates);
	var dates1 = dates;
	var slope1  = slope;
	
    var chart = c3.generate({
    	bindto:"#drop",
        data: {
            x: 'x',
            xFormat: '%Y-%m-%d', // 'xFormat' can be used as custom format of 'x'
            columns: [
                      dates1,slope1
            ]
        },
        size: {
        	  width: 1050,
        	  height: 300
        },
        point:{
        	show:false,
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                },
                label:'Time',
            },
            y:{
            	show: true,
                label:'Slope values',
            } 
        },
        grid: {
            y: {
                lines: [
                    {value: 0, text: 'Slope ="0"', position: 'end'}
                ]
            }
        },
    zoom: {
        enabled: true
    }
    });
}
function draw_pricegrap (id,data) {
    var chart = c3.generate({
        bindto: id,
        data: {
            x: 'AllDates',
    //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
            axes: {
                PRC: 'y',
                PseudoPrice: 'y',
                Turnover : 'y2'
            },
            json : data,
			mimeType : 'json'
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                },
                label:'Time',
            },
            y:{
                label:'Price/PseudoPrice in $',
            } ,
            y2: {
                show: true,
                label:'Turnover'
            }
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    var format = id === 'Turnover' ? d3.format(',') : d3.format('$');
                    return format(value);
                }
            }
        },
    zoom: {
        enabled: true
    }
    });
}
var count_maximas = 0;
function maximas_getData(permno,D,d,L,l) {
		
	var maxima_cantainer = document.getElementById("maxima_container");
	var nw_elmnt = document.createElement('div');
	    nw_elmnt.setAttribute("class","col-lg-12");
	var maxima_result = document.createElement('h3');
	    maxima_result.setAttribute("class","col-lg-12");
	var node_txt = document.createTextNode("Maxima Result");
	    maxima_result.appendChild(node_txt);
	    nw_elmnt.appendChild(maxima_result); 
	    maxima_cantainer.appendChild(nw_elmnt);
	console.log(permno);
	var url = "stockMaxima?PERMNO="+permno+"&D="+D+"&d="+d+"&L="+L+"&l="+l;
	console.log("URL maxima : "+url);
	$.ajax({
		type : 'GET',
		url : url,
		dataType : 'json',
		success : function(data) {
			console.log(url);
				for (var i = 0; i < data.length; i++) {
					create_elmnt("maxima_",i);
					draw_maxima(data[i],"maxima_"+i,i+1);
				}
			},
			error : function(data, error) {
				console.log(error+" data doesnt loading correctly");
			},
			async : false
	});
}

function minimas_getData(permno,D,d,L,l) {
	
	var maxima_cantainer = document.getElementById("maxima_container");
	var nw_elmnt = document.createElement('div');
	    nw_elmnt.setAttribute("class","col-lg-12");
	var maxima_result = document.createElement('h3');
	    maxima_result.setAttribute("class","col-lg-12");
	var node_txt = document.createTextNode("Minima Result");
	    maxima_result.appendChild(node_txt);
	    nw_elmnt.appendChild(maxima_result); 
	    maxima_cantainer.appendChild(nw_elmnt);
	//console.log(permno);
	var url = "stockMinima?PERMNO="+permno+"&D="+D+"&d="+d+"&L="+L+"&l="+l;
	console.log("URL maxima : "+url);
	$.ajax({
		type : 'GET',
		url : url,
		dataType : 'json',
		success : function(data) {
			console.log(url);
				for (var i = 0; i < data.length; i++) {
					create_elmnt("maxima_",i);
					draw_minima(data[i],"maxima_"+i,i+1);
				}
			},
			error : function(data, error) {
				console.log(error+" data doesnt loading correctly");
			},
			async : false
	});
}

function draw_maxima(data,id,count) {
	//console.log(data);
	var dup_arr = data.PseudoPRC;
	var max = Math.max.apply(null, dup_arr);
	var max_key = dup_arr.indexOf(max);
	//console.log(data.PseudoPRC[max_key]);
	
    var chart1 = c3.generate({
        bindto: "#"+id,
        size: {
            width: 250,
            height:189
        },
        data: {
        	 x: 'AllDates',
             axes: {
        	     PRC: 'y',
        	     PseudoPrice: 'y',
        	     Turnover : 'y2'
        	 },
        	 json : data,
             mimeType : 'json'
        },
        grid: {
            x: {
                lines: [
                    {value: data.AllDates[max_key] , text: 'MAXIMA',position: 'middle'},
                ]
               }
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    count: 3,
                    format: '%Y-%m-%d'
                },
                label:'Time',
            },
            y:{
                label:'PRC/PseudoPrice in $',
                tick: {
                    format: d3.format('.2f')
                }
            },
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                	var format = id === 'Turnover' ? d3.format(',') : d3.format('$');
                    return format(value);
                }
            }
        },   
    zoom: {
        enabled: true
    }
    });
    d3.select('#'+id+' svg').append('text')
    .attr('x', 150)
    .attr('y', 10)
    .attr('text-anchor', 'middle')
    .style('font-size', '1.4em')
    .text('Maxima - '+count);
}

function draw_minima(data,id,count) {
	//console.log(data);
	var dup_arr = data.PseudoPRC;
	var max = Math.min.apply(null, dup_arr);
	var max_key = dup_arr.indexOf(max);
	//console.log(data.PseudoPRC[max_key]);
	
    var chart1 = c3.generate({
        bindto: "#"+id,
        size: {
            width: 250,
            height:189
        },
        data: {
        	 x: 'AllDates',
             axes: {
        	     PRC: 'y',
        	     PseudoPrice: 'y',
        	     Turnover : 'y2'
        	 },
        	 json : data,
             mimeType : 'json'
        },
        grid: {
            x: {
                lines: [
                    {value: data.AllDates[max_key] , text: 'MINIMA',position: 'middle'},
                ]
               }
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    count: 3,
                    format: '%Y-%m-%d'
                },
                label:'Time',
            },
            y:{
                label:'PRC/PseudoPrice in $',
                tick: {
                    format: d3.format('.2f')
                }
            } ,
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                	var format = id === 'Turnover' ? d3.format(',') : d3.format('$');
                    return format(value);
                }
            }
        },   
    zoom: {
        enabled: true
    }
    });
    d3.select('#'+id+' svg').append('text')
    .attr('x', 150)
    .attr('y', 10)
    .attr('text-anchor', 'middle')
    .style('font-size', '1.4em')
    .text('Minima - '+count);
}
function create_elmnt(tag,cnt) {
	var maxima_cantainer = document.getElementById("maxima_container");
	var nw_elmnt = document.createElement('div');
	var tag_id = tag+cnt;
	    nw_elmnt.setAttribute("id",tag_id);
	    nw_elmnt.setAttribute("class", "col-lg-3 col-md-4 col-xs-6 thumb");
	    maxima_cantainer.appendChild(nw_elmnt);
}