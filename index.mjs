var L=Object.defineProperty;var S=Object.getOwnPropertySymbols;var B=Object.prototype.hasOwnProperty,K=Object.prototype.propertyIsEnumerable;var C=(o,e,t)=>e in o?L(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t,D=(o,e)=>{for(var t in e||(e={}))B.call(e,t)&&C(o,t,e[t]);if(S)for(var t of S(e))K.call(e,t)&&C(o,t,e[t]);return o};var T=function(o,e){return{handler:o,config:e}};T.withOptions=function(o,e){e===void 0&&(e=function(){return{}});var t=function(n){return n===void 0&&(n={}),{__options:n,handler:o(n),config:e(n)}};return t.__isOptionsFunction=!0,t.__pluginFunction=o,t.__configFunction=e,t};var k=T;var $=(o,e=0,t=100)=>Math.min(Math.max(o,e),t),d=o=>{let e,t,n;if(o.length===4)[e,t,n]=o.split("").slice(1).map(r=>parseInt(r+r,16));else{let r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(o);if(r==null)throw new Error(`Please use the #RGB or #RRGGBB format for hex colors, got wrong color hex ${o}`);e=parseInt(r[1],16),t=parseInt(r[2],16),n=parseInt(r[3],16)}return[e,t,n]},w=o=>{let[e,t,n]=d(o).map(i=>i/255),r=Math.max(e,t,n),l=Math.min(e,t,n),a=0,p=0,m=(r+l)/2;if(r===l)a=p=0;else{let i=r-l;switch(p=m>.5?i/(2-r-l):i/(r+l),r){case e:a=(t-n)/i+(t<n?6:0);break;case t:a=(n-e)/i+2;break;case n:a=(e-t)/i+4;break}a/=6}return[a*360,p*100,m*100]},f=([o,e,t])=>{e=$(e,0,100),t=$(t,0,100),t/=100;let n=e*Math.min(t,1-t)/100,r=l=>{let a=(l+o/30)%12,p=t-n*Math.max(Math.min(a-3,9-a,1),-1);return Math.round(255*p).toString(16).padStart(2,"0")};return`#${r(0)}${r(8)}${r(4)}`};var A=(o,e=x,t=b,n=!1)=>{let[r,l,a]=w(o),p=[97];for(;p.length<u.length;)p.push(p[p.length-1]-t);let m=p.reduce((s,c)=>Math.abs(c-a)<Math.abs(s-a)?c:s),i=p.indexOf(m),h={DEFAULT:o};for(let s=i;s<u.length;s++){let c=s-i;h[u[s]]=f([r,l-e*c,a-t*c])}for(let s=0;s<i;s++){let c=i-s;h[u[s]]=f([r,l+e*c,a+t*c])}if(n)for(let s=0,c=u.length-1;s<c;s++,c--)[h[u[s]],h[u[c]]]=[h[u[c]],h[u[s]]];return h};var M=["background","foreground","selection","comment","cyan","green","orange","pink","purple","red","yellow"],x=1.771968374684816,b=7.3903743315508015,u=[50,100,200,300,400,500,600,700,800,900],O={name:"dracula",palette:{background:"#282A36",foreground:"#F8F8F2",selection:"#44475A",comment:"#6272A4",cyan:"#8BE9FD",green:"#50FA7B",orange:"#FFB86C",pink:"#FF79C6",purple:"#BD93F9",red:"#FF5555",yellow:"#F1FA8C"},isDark:!0},U={name:"material",palette:{background:"#FFFFFF",foreground:"#000000",selection:"#8796B0",comment:"#6182B8",cyan:"#39ADB5",green:"#91B859",orange:"#F76D47",pink:"#FF5370",purple:"#9C3EDA",red:"#E53935",yellow:"#E2931D"}},g=[O,U],_=(o,e,t,n)=>{let{DEFAULT:r}=o,l=A(r,e,t,n);return Object.assign(l,o)},E=o=>({opacityValue:e})=>e==null?`var(${o})`:`rgba(var(${o}), ${e})`,y=(o,e,t)=>`--${o}-${e}${t==="DEFAULT"?"":`-${t}`}`,W=k.withOptions(({themes:o=[],classPrefix:e="themeable",defaultTheme:t="dracula",saturationFactor:n=x,lightFactor:r=b})=>({addBase:l})=>{o=[...g,...o],o.forEach(a=>{for(let p in a.palette){let m=a.palette[p],i;typeof m=="string"?i={DEFAULT:m}:i=m;let h=_(i,n,r,a.isDark),s;for(s in h){let c=y(e,p,s),F=d(h[s]).join(", "),H=D({[`.${e}-${a.name}`]:{[c]:F}},t===a.name?{":root":{[c]:F}}:{});l(H)}}})},({classPrefix:o="themeable",themes:e=[]})=>{e=[...g,...e];let t={},n=new Set;e.forEach(r=>{for(let l in r.palette)n.add(l)});for(let r of n){let l={};for(let a of u)l[a]=E(y(o,r,a));if(l.DEFAULT=E(y(o,r,"DEFAULT")),t[`${o}-${r}`]=l,!M.includes(r))for(let a of e)g.includes(a)||a.palette[r]===void 0&&console.warn(`[tailwindcss-themeable]: theme ${a.name} missing the palette ${r}, please add the palette key to theme or delete the palette key from other themes to avoid inconsistent`)}return{theme:{extend:{colors:t}}}});export{M as builtinPaletteKeys,g as builtinThemes,_ as fillColorShades,b as lightFactorDefault,y as paletteKeyShade2CSSVariable,x as saturationFactorDefault,u as shadeStops,O as themeDracula,U as themeMaterial,W as themeable};
