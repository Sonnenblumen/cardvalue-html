/**
 * Created by cardvalue on 2016/1/4.
 */
var screenWidth = $(window).width();
var clickNumber = 0;
var ccds;
var i =0;
var $btn = $('.home-page-button-content span');
var $btn2 = $('.home-page-click-steps span');
var menuLeft = document.getElementById( 'cbp-spmenu-s1' ), showLeft = document.getElementById( 'showLeft'), pagesidden = document.getElementById('pages-contents');
var $back = document.getElementById('back-ttps');
var closeImgClickNum = 0;

var slider = {
//判断设备是否支持touch事件
    touch:('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    slider:document.getElementById('slider'),
//事件
    events:{
        index:0, //显示元素的索引
        slider:this.slider, //this为slider对象
        icons:document.getElementById('icons1'),
        icon:this.icons.getElementsByTagName('span'),
        handleEvent:function(event){
            var self = this; //this指events对象
            if(event.type == 'touchstart'){
                self.start(event);
            }else if(event.type == 'touchmove'){
                self.move(event);
            }else if(event.type == 'touchend'){
                self.end(event);
            }
        },
//滑动开始
        start:function(event){
            var touch = event.targetTouches[0]; //touches数组对象获得屏幕上所有的touch，取第一个touch
            startPos = {x:touch.pageX,y:touch.pageY,time:+new Date}; //取第一个touch的坐标值
            isScrolling = 0; //这个参数判断是垂直滚动还是水平滚动
            this.slider.addEventListener('touchmove',this,false);
            this.slider.addEventListener('touchend',this,false);
        },
//移动
        move:function(event){
//当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
            var touch = event.targetTouches[0];
            endPos = {x:touch.pageX - startPos.x,y:touch.pageY - startPos.y};
            isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1:0; //isScrolling为1时，表示纵向滑动，0为横向滑动
            if(isScrolling === 0){
                event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
                this.slider.className = 'cnt';
                if(clickNumber != 0){
                    this.index = clickNumber;
                    this.slider.style.left = -this.index*screenWidth + endPos.x + 'px';
                }
                else{
                    this.slider.style.left = -this.index*screenWidth + endPos.x + 'px';
                }
            }
        },
//滑动释放
        end:function(event){
            var duration = +new Date - startPos.time; //滑动的持续时间
            if(isScrolling === 0){ //当为水平滚动时
                this.icon[this.index].className = 'btn home-numbers-button';
                if(clickNumber == 0){
                    if(Number(duration) > 10){
                        if(endPos.x > 10){
                            if(this.index == 0) classie.add( menuLeft, 'cbp-spmenu-open' ); classie.remove( $back, 'displaynone' );
                        }else if(endPos.x < -5){
                            classie.remove( menuLeft, 'cbp-spmenu-open' );
                        }
                    }
                    if(Number(duration) > 50){ //判断是左移还是右移，当偏移量大于30时执行
                        if(endPos.x > 50){
                            if(this.index !== 0) this.index -= 1;
                        }else if(endPos.x < -50){
                            classie.remove( menuLeft, 'cbp-spmenu-open' );
                            classie.add( $back, 'displaynone' );
                            if(this.index !== this.icon.length-1) this.index += 1;
                        }
                    }
                    this.icon[this.index].className = 'btn home-numbers-button home-button-border';
                    this.slider.className = 'cnt f-anim';
                    this.slider.style.left = -this.index*screenWidth + 'px';
                }
                else if(clickNumber != 0){
                    this.index = clickNumber;
                    if(Number(duration) > 50){ //判断是左移还是右移，当偏移量大于30时执行
                        if(endPos.x > 50){
                            if(this.index !== 0)  this.index -= 1;
                        }else if(endPos.x < -50){
                            if(this.index !== this.icon.length-1) this.index += 1;
                        }
                    }
                    this.icon[this.index].className = 'btn home-numbers-button home-button-border';
                    this.icon[clickNumber].className = 'btn home-numbers-button';
                    this.slider.className = 'cnt f-anim';
                    this.slider.style.left = -this.index*screenWidth + 'px';
                    clickNumber = 0;
                }
                this.icon[this.index].className = 'btn home-numbers-button home-button-border';
                this.slider.className = 'cnt f-anim';
                this.slider.style.left = -this.index*screenWidth + 'px';
            }
//解绑事件
            this.slider.removeEventListener('touchmove',this,false);
            this.slider.removeEventListener('touchend',this,false);
            if(this.index >= 3){
                var scrollDis = this.index * 50;
                $('.home-page-numbers').scrollLeft(scrollDis);
            }
            else{
                $('.home-page-numbers').scrollLeft(0);
            }
        }
    },
//初始化
    init:function(){
        var self = this; //this指slider对象
        if(!!self.touch) self.slider.addEventListener('touchstart',self.events,false); //addEventListener第二个参数可以传一个对象，会调用该对象的handleEvent属性
    }
};


$btn.each(function(index) {
    $(this).click(function(){
        document.getElementById('slider').style.left = -screenWidth*index + 'px';
        if(index > 2){
            var scrollDis = index * 50;
            $('.home-page-numbers').scrollLeft(scrollDis);
        }
        $(this).addClass('home-button-border').siblings().removeClass('home-button-border');
        $btn2.eq(index).addClass('button-font1-act').siblings().removeClass('button-font1-act');
        clickNumber = index;
    })
});

$btn2.each(function(index){
    $(this).click(function(){
        document.getElementById('slider').style.left = -screenWidth*index + 'px';
        if(index > 2){
            var scrollDis = index * 50;
            $('.home-page-numbers').scrollLeft(scrollDis);
        }
        $(this).addClass('button-font1-act').siblings().removeClass('button-font1-act');
        $btn.eq(index).addClass('home-button-border').siblings().removeClass('home-button-border');
        clickNumber = index;
    });
});

$('#closeStep').click(function(){
    closeImgClickNum ++;
    $('.home-page-click-steps').slideToggle();
    $('.home-back-black').toggle();
    $('#icons span').toggle();
    $('.home-font2').toggle();
    if(closeImgClickNum%2 != 0){
        $('#closeStep img').removeClass('rotate45').addClass('home-page-scroll');
    }
    else{
        $('#closeStep img').removeClass('home-page-scroll').addClass('rotate45');
    };
});

$('.home-back-black').click(function(){
    $('.home-page-click-steps').slideToggle();
    $('.home-back-black').toggle();
    $('#icons span').toggle();
    $('.home-font2').toggle();
    $('#closeStep img').removeClass('home-page-scroll').addClass('rotate45');
});

