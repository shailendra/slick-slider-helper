/*
  Author: Shailendra More
  Repo: https://github.com/shailendra/slick-slider-helper
  Issues: https://github.com/shailendra/slick-slider-helper/issues
  Blog: http://setvelocity.blogspot.com/

 */

;(function () {
  //---------------------------------------------------------------------
  //---------------------------------------------------------------------
  var SlickSliderHelper = function (prop) {
    this.initialize(prop)
  }
  var p = SlickSliderHelper.prototype

  //---  V A R I A B L E S  -------------------------------------------------
  p.numOfLeftRightSlideVisible
  p.startScale
  p.decreaseScale
  //---------------------------------------------------------------------
  p.initialize = function (prop) {
    this.slick = prop.slick != undefined ? prop.slick : null;
    this.numOfLeftRightSlideVisible = prop.numOfLeftRightSlideVisible != undefined ? prop.numOfLeftRightSlideVisible : 3;
    this.startScale = prop.startScale != undefined ? prop.startScale : 0.5;
    this.decreaseScale = prop.decreaseScale != undefined ? prop.decreaseScale : 0.17;
    this.firstGap = prop.firstGap != undefined ? prop.firstGap : 0;
    this.gap = prop.gap != undefined ? prop.gap : 0;
    this.centerScale = prop.centerScale != undefined ? prop.centerScale : 1;
    this.startYpos = prop.startYpos != undefined ? prop.startYpos : 0;
    this.adjustHeight = prop.adjustHeight != undefined ? prop.adjustHeight : true;        
    //-------------------------------------------------------
    this.lastTempMargin
    //-------------------------------------------------------
    this.slick.$slider.find("img").css({backfaceVisibility: "hidden"});
    this.setupEvents();
  }
  p.setupEvents = function(){
    var This = this;
    $(window).bind("resize", function(){
      This.resize();
    });    
    this.resize();
  }
  p.alignSlides = function (prop) {
    this.alignImg({ slideId: prop.currentSlide, slick: prop.slick })
    this.alignImg({
      slideId: prop.currentSlide - prop.slick.slideCount,
      slick: prop.slick
    })
    this.alignImg({
      slideId: prop.currentSlide + prop.slick.slideCount,
      slick: prop.slick
    })
  }
  p.alignImg = function (prop) {
    var centerSlide = prop.slick.$slider.find(
      '[data-slick-index=' + prop.slideId + ']'
    )
    this.applyCSS({
      slide: centerSlide,
      margin: 0,
      opacity: 1,
      scale: this.centerScale,
      y:0
    })
    this.lastTempMargin = this.firstGap;
    for (var i = 0; i < this.numOfLeftRightSlideVisible + 1; i++) {
      var id = prop.slideId - 1 - i
      var prevSlide = prop.slick.$slider.find('[data-slick-index=' + id + ']')
      if (prevSlide.length > 0) {
        this.decideCSS({ slide: prevSlide, i: i, dir: -1 })
      }
    }
    this.lastTempMargin = this.firstGap;
    for (var i = 0; i < this.numOfLeftRightSlideVisible + 1; i++) {
      var id = prop.slideId + 1 + i
      var nextSlide = prop.slick.$slider.find('[data-slick-index=' + id + ']')
      if (nextSlide.length > 0) {
        this.decideCSS({ slide: nextSlide, i: i, dir: 1 })
      }
    }
  }
  p.decideCSS = function (obj) {
    var scale = this.startScale - this.decreaseScale * obj.i
    var marginShift = (((1 - scale)/2)* 100)/scale
    if(obj.i==0){
      /*console.log((((1 - scale)/2)* 100)/scale);
      console.log(marginShift)*/
    }
    var margin = marginShift + (obj.i*100-this.lastTempMargin)/scale;
    //this.lastTempMargin = this.lastTempMargin + marginShift * 2
    this.lastTempMargin = this.lastTempMargin + (scale*100) +this.gap;
    var opacity = 1
    if (obj.i == this.numOfLeftRightSlideVisible) {
      opacity = 0
    }
    this.applyCSS({
      id:obj.i,
      slide: obj.slide,
      margin: margin * obj.dir * -1,
      opacity: opacity,
      scale: scale,
      y:this.startYpos
    })
  }

  p.applyCSS = function (obj) {
    obj.slide.css({
      opacity: obj.opacity,
      zIndex:10-obj.id,
      transform: 'scale(' + obj.scale + ') translate('+obj.margin+'%, '+obj.y+'%)'
    });
    /*obj.slide.find("img").css({
      opacity: obj.opacity,
      zIndex:10-obj.id,
      transform: 'scale(' + obj.scale + ') translate('+obj.margin+'%, 100px)'
    })*/
  }
  SlickSliderHelper.decideNextPrev = function(currentSlide, nextSlide, slideCount ){
    if(currentSlide==0 && nextSlide==slideCount-1 && currentSlide<nextSlide){
      return "prev";
    }else if(currentSlide==slideCount-1 && nextSlide==0 && currentSlide>nextSlide){
      return "next";
    }else if(currentSlide<nextSlide){
      return "next";
    }else{
      return "prev";
    }
  }
  p.adjustHeightIfCenterScaleMore = function(){
    var This = this;
    if(this.adjustHeight && this.centerScale>1 && this.slick){
      var slickTrack = this.slick.$list.find(".slick-track");
      var slickTrackHeight = slickTrack.height();
      if(slickTrackHeight<50){
        setTimeout(function(){
          This.adjustHeightIfCenterScaleMore();
        }, 500)
        return;
      }      
      var newHeight = slickTrackHeight*this.centerScale;
      var paddingTop = newHeight-slickTrackHeight;
      this.slick.$list.css({height:newHeight+"px"});
      this.slick.$list.find(".slick-track").css({paddingTop:paddingTop/2+"px"});
    }
  }
  p.resize = function(){
    var This = this;
    This.adjustHeightIfCenterScaleMore();
    setTimeout(function(){      
      This.adjustHeightIfCenterScaleMore();
    }, 500)
    setTimeout(function(){      
      This.adjustHeightIfCenterScaleMore();
    }, 1000)
  }

  //---------------------------------------------------------------------
  window.SlickSliderHelper = SlickSliderHelper
})()