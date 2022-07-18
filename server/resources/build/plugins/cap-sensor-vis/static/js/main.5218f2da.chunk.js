(this["webpackJsonpcap-sensor-vis"]=this["webpackJsonpcap-sensor-vis"]||[]).push([[0],{70:function(t,e,a){t.exports=a(76)},75:function(t,e,a){},76:function(t,e,a){"use strict";a.r(e);var i=a(0),n=a.n(i),s=a(24),r=a.n(s),h=a(26),c=a(25),o=a(1),l=a(27),d=a(15),u=a(16),p=a(2),g=function(){function t(e,a){Object(d.a)(this,t),this.func=a,this.time=e,this.start=Date.now()}return Object(u.a)(t,[{key:"execute",value:function(){Date.now()-this.start>=this.time&&(this.start=Date.now(),this.func())}},{key:"setTime",value:function(t){this.time=t}}]),t}(),f=function(t){function e(t){var a;return Object(d.a)(this,e),(a=Object(h.a)(this,Object(c.a)(e).call(this,t))).state={capacitance:5,noise:5,speed:10},a.readings=[],a.saturation=0,a.animation=null,a.width=null,a.height=null,a.pointSpacing=null,a.maxReadings=null,a.svg=null,a.text=null,a.line=null,a.stop=a.stop.bind(Object(o.a)(a)),a.start=a.start.bind(Object(o.a)(a)),a.restart=a.restart.bind(Object(o.a)(a)),a.read=a.read.bind(Object(o.a)(a)),a.volts=a.volts.bind(Object(o.a)(a)),a.readSensor=new g(a.state.speed,a.read),a.updateVolts=new g(100,a.volts),a}return Object(l.a)(e,t),Object(u.a)(e,[{key:"componentDidMount",value:function(){this.graphReadings(),this.graphSensor()}},{key:"componentWillUnmount",value:function(){this.stop()}},{key:"restart",value:function(){this.stop(),this.readings=[];var t=document.getElementById("svgg");t&&t.parentNode.removeChild(t);var e=document.getElementById("svgs");e&&e.parentNode.removeChild(e),this.graphReadings(),this.graphSensor()}},{key:"start",value:function(){null===this.animation&&this.loop()}},{key:"stop",value:function(){null!==this.animation&&(window.cancelAnimationFrame(this.animation),this.animation=null)}},{key:"graphSensor",value:function(){var t=this,e=p.d("#sensor").node().getBoundingClientRect(),a=e.width,i=e.height,n=p.d("#sensor").append("svg").attr("id","svgs").attr("width",a).attr("height",i),s=n.append("rect").attr("fill","#00cc99").attr("width",0).attr("height",i).attr("x",0).attr("y",0);n.append("rect").attr("width",a).attr("height",i).attr("opacity",0).on("mousemove",(function(){var e=p.b.offsetX;s.attr("width",e),t.saturation=e/a}))}},{key:"graphReadings",value:function(){var t=p.d("#graph").node().getBoundingClientRect();this.width=t.width,this.height=t.height,this.pointSpacing=20,this.maxReadings=this.width/this.pointSpacing+1,this.svg=p.d("#graph").append("svg").attr("id","svgg").attr("width","100%").attr("height","100%"),this.svg.append("rect").attr("fill","#ffffff").attr("width",this.width).attr("height",2).attr("x",0).attr("y",this.height/2);for(var e=1;e<this.width;e++){var a=e*this.pointSpacing;if(a>this.width)break;this.svg.append("rect").attr("fill","#ffffff").attr("opacity","0.2").attr("width",1).attr("height",this.height).attr("x",a).attr("y",0)}for(var i=1;i<this.height;i++){var n=i*this.pointSpacing;if(n>this.height)break;this.svg.append("rect").attr("fill","#ffffff").attr("opacity","0.2").attr("width",this.width).attr("height",1).attr("x",0).attr("y",n)}this.svg.append("text").attr("fill","#ffffff").attr("x",5).attr("y",20).text("Cool Oscilloscope Simulation \xae"),this.text=this.svg.append("text").attr("fill","#ffffff").attr("x",5).attr("y",40).text(""),this.line=p.c().curve(p.a).x((function(t){return t.x})).y((function(t){return t.y})),this.svg.append("svg:path").attr("d",this.line(this.readings))}},{key:"createReading",value:function(){var t=this.state,e=t.capacitance,a=t.noise,i=this.readings[this.readings.length-1],n=this.height-.1*this.height,s=n+Math.random()*(this.height/8*(a/100))-this.saturation*(n-.1*this.height);if(i){var r=i.y,h=Math.abs(r-s);h-=h*(e/100),s=r-s<0?r+(h+.5*h):r-(h+.5*h)}return{x:0,y:s}}},{key:"read",value:function(){for(var t=0;t<this.readings.length;t++){var e=this.readings[t];e.x+=this.pointSpacing,this.readings[t]=e}this.readings.length>this.maxReadings&&this.readings.shift(),this.readings.push(this.createReading()),this.svg.selectAll("path").data([this.readings]).attr("d",this.line)}},{key:"volts",value:function(){var t=this.readings[this.readings.length-1];if(t){var e=5-t.y/this.height*5;e=e<0?0:e,this.text.text("".concat(e.toFixed(2)," V"))}}},{key:"loop",value:function(){var t=this;this.animation=window.requestAnimationFrame((function e(){t.readSensor.setTime(t.state.speed),t.readSensor.execute(),t.updateVolts.execute(),t.animation=window.requestAnimationFrame(e)}))}},{key:"render",value:function(){var t=this;return n.a.createElement("div",{className:"container"},n.a.createElement("div",{className:"controls"},n.a.createElement("button",{onClick:this.start},"Start"),n.a.createElement("button",{onClick:this.stop},"Stop"),n.a.createElement("button",{onClick:this.restart},"Restart"),n.a.createElement("div",{className:"check"},n.a.createElement("button",{onClick:function(){return t.setState({capacitance:t.state.capacitance+5>=100?99:t.state.capacitance+5})}},"\u25b2"),n.a.createElement("button",{onClick:function(){return t.setState({capacitance:t.state.capacitance-5<=0?1:t.state.capacitance-5})}},"\u25bc"),n.a.createElement("span",null,this.state.capacitance," farads")),n.a.createElement("div",{className:"check"},n.a.createElement("button",{onClick:function(){return t.setState({noise:t.state.noise+5>=100?99:t.state.noise+5})}},"\u25b2"),n.a.createElement("button",{onClick:function(){return t.setState({noise:t.state.noise-5<=0?1:t.state.noise-5})}},"\u25bc"),n.a.createElement("span",null,this.state.noise," dB")),n.a.createElement("div",{className:"check"},n.a.createElement("button",{onClick:function(){return t.setState({speed:t.state.speed+5>=100?99:t.state.speed+5})}},"\u25b2"),n.a.createElement("button",{onClick:function(){return t.setState({speed:t.state.speed-5<=0?1:t.state.speed-5})}},"\u25bc"),n.a.createElement("span",null,this.state.speed," speed"))),n.a.createElement("div",{id:"sensor"}),n.a.createElement("div",{id:"graph"}))}}]),e}(i.Component);a(75);r.a.render(n.a.createElement(f,null),document.getElementById("root"))}},[[70,1,2]]]);
//# sourceMappingURL=main.5218f2da.chunk.js.map