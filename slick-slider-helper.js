(function() {
	//---------------------------------------------------------------------
	//---------------------------------------------------------------------
	var SlickSliderHelper = function(prop) {	
		this.initialize(prop);
	}
	var p = SlickSliderHelper.prototype;
	
	//---  V A R I A B L E S  -------------------------------------------------
	p.numOfLeftRightSlideVisible;
	p.startScale;
	p.decreaseScale;
	//---------------------------------------------------------------------
	p.initialize = function(prop) {
    this.numOfLeftRightSlideVisible = prop.numOfLeftRightSlideVisible!=undefined?prop.numOfLeftRightSlideVisible:3;
    this.startScale = prop.startScale!=undefined?prop.startScale:0.5;
    this.decreaseScale = prop.decreaseScale!=undefined?prop.decreaseScale:0.17;
    //-------------------------------------------------------
    this.lastTempMargin;
  }
  p.alignSlides = function(prop){
    this.alignImg({slideId:prop.currentSlide, slick:prop.slick});
    this.alignImg({slideId:prop.currentSlide-prop.slick.slideCount, slick:prop.slick});
    this.alignImg({slideId:prop.currentSlide+prop.slick.slideCount, slick:prop.slick});
  }
  p.alignImg = function(prop){
    var centerSlide = prop.slick.$slider.find("[data-slick-index="+prop.slideId+"]");
    this.applyCSS({ele:centerSlide.find("img"), margin:0, opacity:1, scale:1});    
    this.lastTempMargin = 0;
    for (var i = 0; i < this.numOfLeftRightSlideVisible+1; i++) {
      var id = prop.slideId-1-i;
      var prevSlide = prop.slick.$slider.find("[data-slick-index="+id+"]");            
      if(prevSlide.length>0){      
        this.decideCSS({slide:prevSlide, i:i, dir:-1});
      }
    }
    this.lastTempMargin = 0;
    for (var i = 0; i < this.numOfLeftRightSlideVisible+1; i++) {
      var id = prop.slideId+1+i;
      var nextSlide = prop.slick.$slider.find("[data-slick-index="+id+"]"); 
      if(nextSlide.length>0){
        this.decideCSS({slide:nextSlide, i:i, dir:1});  
      }
    }
  }
  p.decideCSS = function(obj){   
    var scale = this.startScale-this.decreaseScale*obj.i;
    var marginShift = (((1-scale)/2)*100);  
    var margin = marginShift+this.lastTempMargin;    
    this.lastTempMargin = this.lastTempMargin+marginShift*2;  
    var opacity = 1;
    if(obj.i==this.numOfLeftRightSlideVisible){                 
      opacity = 0;
    }
    this.applyCSS({ele:obj.slide.find("img"), margin:margin*obj.dir*-1, opacity:opacity, scale:scale});
  }
  
  p.applyCSS = function(obj){
    obj.ele.css({
      "margin-left": obj.margin+"%", 
      opacity:obj.opacity, 
      transform: "scale("+obj.scale+")"
    });
  }
	
	
	
	//---------------------------------------------------------------------
	window.SlickSliderHelper = SlickSliderHelper;
}());