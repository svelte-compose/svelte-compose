import{S as x,i as ee,s as te,e as O,b as g,g as k,v as R,f as X,d as N,M as Y,h as p,k as B,a as E,q as y,y as T,l as D,m as A,c as w,r as L,z as H,n as I,D as $,A as U,u as M,B as W,N as le}from"./index.e42fb5e6.js";import{a as se,B as ne,b as oe,c as re}from"./Seo.53ba8c83.js";function J(a,l,o){const s=a.slice();return s[6]=l[o][0],s[7]=l[o][1],s}function K(a,l,o){const s=a.slice();return s[10]=l[o].metadata,s}function ae(a){let l=a[6].name+"",o;return{c(){o=y(l)},l(s){o=L(s,l)},m(s,e){g(s,o,e)},p(s,e){e&1&&l!==(l=s[6].name+"")&&M(o,l)},d(s){s&&p(o)}}}function ie(a){let l,o=a[6].name+"",s,e;return{c(){l=B("a"),s=y(o),this.h()},l(f){l=D(f,"A",{href:!0});var t=A(l);s=L(t,o),t.forEach(p),this.h()},h(){I(l,"href",e="/categories/"+a[6].id)},m(f,t){g(f,l,t),$(l,s)},p(f,t){t&1&&o!==(o=f[6].name+"")&&M(s,o),t&1&&e!==(e="/categories/"+f[6].id)&&I(l,"href",e)},d(f){f&&p(l)}}}function fe(a){let l,o,s,e,f=a[10].name+"",t,r,n,c,d=a[10].description+"",v,C,h,m,u,b,V,z,j,F;o=new oe({props:{id:a[10].id,name:a[10].name}}),h=new re({props:{svelte:a[10].environments.svelte,kit:a[10].environments.kit}});function Z(){return a[4](a[10])}return{c(){l=B("a"),T(o.$$.fragment),s=E(),e=B("div"),t=y(f),n=E(),c=B("div"),v=y(d),C=E(),T(h.$$.fragment),m=E(),u=B("button"),b=y("Add / remove"),V=E(),this.h()},l(i){l=D(i,"A",{href:!0});var _=A(l);H(o.$$.fragment,_),s=w(_),e=D(_,"DIV",{class:!0});var S=A(e);t=L(S,f),S.forEach(p),_.forEach(p),n=w(i),c=D(i,"DIV",{});var q=A(c);v=L(q,d),q.forEach(p),C=w(i),H(h.$$.fragment,i),m=w(i),u=D(i,"BUTTON",{class:!0});var G=A(u);b=L(G,"Add / remove"),G.forEach(p),V=w(i),this.h()},h(){I(e,"class","test"),I(l,"href",r="/composer/"+a[10].id),I(u,"class","button is-primary")},m(i,_){g(i,l,_),U(o,l,null),$(l,s),$(l,e),$(e,t),g(i,n,_),g(i,c,_),$(c,v),g(i,C,_),U(h,i,_),g(i,m,_),g(i,u,_),$(u,b),g(i,V,_),z=!0,j||(F=le(u,"click",Z),j=!0)},p(i,_){a=i;const S={};_&1&&(S.id=a[10].id),_&1&&(S.name=a[10].name),o.$set(S),(!z||_&1)&&f!==(f=a[10].name+"")&&M(t,f),(!z||_&1&&r!==(r="/composer/"+a[10].id))&&I(l,"href",r),(!z||_&1)&&d!==(d=a[10].description+"")&&M(v,d);const q={};_&1&&(q.svelte=a[10].environments.svelte),_&1&&(q.kit=a[10].environments.kit),h.$set(q)},i(i){z||(k(o.$$.fragment,i),k(h.$$.fragment,i),z=!0)},o(i){N(o.$$.fragment,i),N(h.$$.fragment,i),z=!1},d(i){i&&p(l),W(o),i&&p(n),i&&p(c),i&&p(C),W(h,i),i&&p(m),i&&p(u),i&&p(V),j=!1,F()}}}function P(a){let l,o;return l=new ne({props:{$$slots:{default:[fe]},$$scope:{ctx:a}}}),{c(){T(l.$$.fragment)},l(s){H(l.$$.fragment,s)},m(s,e){U(l,s,e),o=!0},p(s,e){const f={};e&8193&&(f.$$scope={dirty:e,ctx:s}),l.$set(f)},i(s){o||(k(l.$$.fragment,s),o=!0)},o(s){N(l.$$.fragment,s),o=!1},d(s){W(l,s)}}}function ce(a){let l,o,s=a[7],e=[];for(let t=0;t<s.length;t+=1)e[t]=P(K(a,s,t));const f=t=>N(e[t],1,1,()=>{e[t]=null});return{c(){for(let t=0;t<e.length;t+=1)e[t].c();l=O()},l(t){for(let r=0;r<e.length;r+=1)e[r].l(t);l=O()},m(t,r){for(let n=0;n<e.length;n+=1)e[n]&&e[n].m(t,r);g(t,l,r),o=!0},p(t,r){if(r&5){s=t[7];let n;for(n=0;n<s.length;n+=1){const c=K(t,s,n);e[n]?(e[n].p(c,r),k(e[n],1)):(e[n]=P(c),e[n].c(),k(e[n],1),e[n].m(l.parentNode,l))}for(R(),n=s.length;n<e.length;n+=1)f(n);X()}},i(t){if(!o){for(let r=0;r<s.length;r+=1)k(e[r]);o=!0}},o(t){e=e.filter(Boolean);for(let r=0;r<e.length;r+=1)N(e[r]);o=!1},d(t){Y(e,t),t&&p(l)}}}function Q(a){let l,o,s,e,f=a[6].description+"",t,r,n,c,d;function v(m,u){return m[1]?ie:ae}let C=v(a),h=C(a);return n=new se({props:{$$slots:{default:[ce]},$$scope:{ctx:a}}}),{c(){l=B("div"),o=B("h2"),h.c(),s=E(),e=B("div"),t=y(f),r=E(),T(n.$$.fragment),c=E(),this.h()},l(m){l=D(m,"DIV",{class:!0});var u=A(l);o=D(u,"H2",{class:!0});var b=A(o);h.l(b),b.forEach(p),s=w(u),e=D(u,"DIV",{});var V=A(e);t=L(V,f),V.forEach(p),r=w(u),H(n.$$.fragment,u),c=w(u),u.forEach(p),this.h()},h(){I(o,"class","text-xl"),I(l,"class","category svelte-1mz5zla")},m(m,u){g(m,l,u),$(l,o),h.m(o,null),$(l,s),$(l,e),$(e,t),$(l,r),U(n,l,null),$(l,c),d=!0},p(m,u){C===(C=v(m))&&h?h.p(m,u):(h.d(1),h=C(m),h&&(h.c(),h.m(o,null))),(!d||u&1)&&f!==(f=m[6].description+"")&&M(t,f);const b={};u&8193&&(b.$$scope={dirty:u,ctx:m}),n.$set(b)},i(m){d||(k(n.$$.fragment,m),d=!0)},o(m){N(n.$$.fragment,m),d=!1},d(m){m&&p(l),h.d(),W(n)}}}function ue(a){let l,o,s=[...a[0]],e=[];for(let t=0;t<s.length;t+=1)e[t]=Q(J(a,s,t));const f=t=>N(e[t],1,1,()=>{e[t]=null});return{c(){for(let t=0;t<e.length;t+=1)e[t].c();l=O()},l(t){for(let r=0;r<e.length;r+=1)e[r].l(t);l=O()},m(t,r){for(let n=0;n<e.length;n+=1)e[n]&&e[n].m(t,r);g(t,l,r),o=!0},p(t,[r]){if(r&7){s=[...t[0]];let n;for(n=0;n<s.length;n+=1){const c=J(t,s,n);e[n]?(e[n].p(c,r),k(e[n],1)):(e[n]=Q(c),e[n].c(),k(e[n],1),e[n].m(l.parentNode,l))}for(R(),n=s.length;n<e.length;n+=1)f(n);X()}},i(t){if(!o){for(let r=0;r<s.length;r+=1)k(e[r]);o=!0}},o(t){e=e.filter(Boolean);for(let r=0;r<e.length;r+=1)N(e[r]);o=!1},d(t){Y(e,t),t&&p(l)}}}function me(a,l,o){let{composerCategories:s=new Map}=l,{selectedComposers:e=[]}=l,{linkCategories:f=!1}=l,t=[];function r(c){t.includes(c)?t=t.filter(v=>v!=c):(t.push(c),t=t);const d=[];for(const v of s.values())d.push(...v);o(3,e=d.filter(v=>t.includes(v.metadata.id)))}const n=c=>r(c.id);return a.$$set=c=>{"composerCategories"in c&&o(0,s=c.composerCategories),"selectedComposers"in c&&o(3,e=c.selectedComposers),"linkCategories"in c&&o(1,f=c.linkCategories)},[s,f,r,e,n]}class pe extends x{constructor(l){super(),ee(this,l,me,ue,te,{composerCategories:0,selectedComposers:3,linkCategories:1})}}export{pe as C};
