(this["webpackJsonpd3-graphs"]=this["webpackJsonpd3-graphs"]||[]).push([[0],{69:function(t,n,e){t.exports=e(75)},74:function(t,n,e){},75:function(t,n,e){"use strict";e.r(n);var a=e(0),r=e.n(a),i=e(26),c=e.n(i),u=e(7),o=e(8),l=e(10),h=e(9),d=e(11),p=e(2),s=function(t){function n(t){var e;return Object(u.a)(this,n),(e=Object(l.a)(this,Object(h.a)(n).call(this,t))).interval=null,e}return Object(d.a)(n,t),Object(o.a)(n,[{key:"componentWillUnmount",value:function(){clearInterval(this.interval)}},{key:"componentDidMount",value:function(){var t=p.d("#graph").node().getBoundingClientRect(),n=p.c().domain([0,100]).range([0,t.width]),e=p.c().domain([0,10]).range([t.height,0]),a=new Array(100).fill(0).map((function(){return 10*Math.random()})),r=p.d("#graph").append("svg").attr("id","svg").attr("width","100%").attr("height","100%"),i=p.b().curve(p.a).x((function(t,e){return n(e)})).y((function(t){return e(t)}));r.append("path").attr("d",i(a)),this.interval=setInterval((function(){a.pop(),a.unshift(10*Math.random()),r.selectAll("path").data([a]).attr("d",i)}),50)}},{key:"render",value:function(){return r.a.createElement("div",{id:"graph",style:{width:"100vw",height:"100vh"}})}}]),n}(a.Component),v=function(t){function n(){return Object(u.a)(this,n),Object(l.a)(this,Object(h.a)(n).apply(this,arguments))}return Object(d.a)(n,t),Object(o.a)(n,[{key:"render",value:function(){return r.a.createElement(s,null)}}]),n}(r.a.Component);e(74);c.a.render(r.a.createElement(v,null),document.getElementById("root"))}},[[69,1,2]]]);
//# sourceMappingURL=main.bea0a558.chunk.js.map