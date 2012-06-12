/*
 * TODO
 * clear button
 * show results n of total
 *
 * next
 * setup repo on github
 *
 * next:
 * basic tests
 * regex
 * history
 * finesse the ui to fit the viewport
// console.log(["width:",w.innerWidth,",",screen.availWidth].concat(""));
 * finesse the ui
 *
 * */
(function(){
var w = window, d = document, b = d.body, f = d.createElement("form"), scrollTimer; o = {
		cAse: false,
		dir: 1,
		index: 0
	}, n = (new Date).getTime();
	function L(l,t,f){l.addEventListener(t,f)}
	function S(e){f.setAttribute("style","top:"+b.scrollTop+"px;left:"+b.scrollLeft+"px;")};
	function Q(l,s){return l.querySelectorAll(s)}
	o.l = Q(d,"form.findonpage")[0] || false;
	if(o.l) return o.l.style.display="block";
	f.className = "findonpage";
	f.innerHTML = "<input type=text><input type=submit class=prev value=&lt;><input type=submit class=next value=\"&gt;\"><br><input type=checkbox class=regex id=regex> <label for=regex>regex</label><input type=checkbox class=case id=cAse> <label for=cAse title=Case-Sensitive>Case</label><input type=button value=clear><input type=button value=x><style>.findonpage{z-index:99999;background:rgba(255,255,255,0.8);position:absolute;top:0;left:0;}.found_string{border-radius:5px;border:1px dotted #555;color:black !important;background:yellow !important;padding:1px;}.found_highlight{padding:3px;border:1px solid black;box-shadow:0 0 8px #555;}</style>";
	var hasNext = /\bnext\b/;
	var i=0, _, submits = Q(f,"[type=submit]");
	while(_=submits[i++]){
		L(_,"click",function(e){
			o.dir = hasNext.test(this.className) ? 1:0;
		});
	};
	b.appendChild(f);
	L(f,"submit",function(e){
		e.preventDefault();
		function doSearch(txt) {
				// enable execCommand, ie highlighting results
				d.designMode = "on";
				var s = w.getSelection();
				// move cursor to beginning of doc
				s.collapse(b, 0);

				var p,q,a,b,m,n,c,i=0,t=/^(?:INPUT|TEXTAREA|text)$/i;
				while (w.find(txt, o.cAse, 0, 0, 0, 1, 1
/*
					0, // backwards
					0, // wrap
					0, //whole,
					1, //o.frames,
					1, //o.dialog
*/
				)) {
					i++;
					a = s.anchorNode;
					p = a.parentNode;
					q = d.activeElement;
					if(!(t.test(q.nodeName) && t.test(q.type))){
						b = s.focusNode;
						m = a == b ? false:b.parentNode;
						c = d.defaultView.getComputedStyle(p,null).backgroundColor;
						// highlight this search
						d.execCommand("HiliteColor", false, "yellow");
						if(m){
							n = s.focusNode.parentNode;
							n.setAttribute("data-search_generated", n != m ? "true":c);
						};
						q = s.anchorNode.parentNode;
						q.setAttribute("data-search_generated", p != q ? "true":c);
					}
					q.className += (" found_string search"+i);
					if(n) n.className += (" found_string search"+i);
					m = n = 0;
					// move the cursor to the end of this search
					s.collapseToEnd();
				}
				d.designMode = "off";
				o.max = i;
				o.i = o.dir ? 0 : i - 1;
		}; // doSearch()

		var x, y, results, j, i, _, c, txt = Q(this,"[type=text]")[0].value, foundClasses = /\b(?:found_string|search[0-9]+|found_highlight)\b/g;
		c = Q(this,".case")[0].checked;
		// check that nothing has changed on the search
		var z = !!(o.txt == txt && o.cAse == c);
		o.cAse = c;
/*
		Q(this,".regex")[0].checked;
	grab page text
	do regex match to get results
	walk thru results, in their order (if not already searched-for, ie once each)
	highlight each with w.find like basic find
	var _txt, r = d.createRange(); r.selectNodeContents(b); s.removeAllRanges(); s.addRange(r); _txt = s.toString(); s.removeAllRanges(); console.log("txt:"+_txt);
*/
		if(z){ // unchanged search
			// step to next item
			o.i += o.dir ? 1:-1;
		}else{ // new search
			o.txt = txt;
			// clear previous search
			results = Q(d,".found_string");
			i=0;
			while(_= results[i++]){
				c = _.getAttribute("data-search_generated");
				if(c == "true"){
					c = d.createDocumentFragment();
					x = 0;
					y = _.childNodes;
					while(y.length){
						c.appendChild(y[0]);
					};
					_.parentNode.replaceChild(c,_);
				}else{
					_.style.backgroundColor = c;
					_.className = _.className.replace(foundClasses, " ");
				};
			};
			b.removeChild(this);
			// search the page
			doSearch(txt);
			b.appendChild(this);
		};
		// highlight item
		if(o.i >= o.max) o.i = 0;
		else if(o.i < 0) o.i = o.max - 1;
		results = Q(d,".search" + (o.i+1));
		if(results.length){
			i = 0;
			c = Q(d,".found_highlight");
			while(_ = c[i++]) _.className = _.className.replace(/\bfound_highlight\b/g," ");
			i = 0;
			while(_ = results[i++]){
				_.className += " found_highlight";
			};
			results = results[0];
			x = 0, y = 0;
			while(results){
				x += results.offsetLeft, y += results.offsetTop;
				results = results.offsetParent;
			};
			y -= this.offsetHeight;
			w.scrollTo(x-10,y-10);
		}
		Q(f,"[type=submit]")[o.dir].focus();
	}); // f.submit()
	_ = Q(f,"[type=text]")[0];
	_.value = "flow";
	_.focus();
	L(w,"scroll",S);
})();
