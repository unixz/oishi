(function(){
var maxBlocks = 20; 
var countBoxOpen = maxBlocks
var blocksTmp = [];
var arrays = [];
var select = [];
var compare;
var isFirstStart = true;

var isEndGame = false;
var isGameLogDone = false;
var GAME_SCORE = 0;
var GAME_DURATION = 10;//sec
var GAME_TIMER;
var GAME_CLICK_COUNT = 0 ;

var GAME_FINISH_DATA

var SEND_QUEUE_PACK = [];

var BOXOPEN_TWEEN;

var openBoxPack = [
    {//wave1
        open : 1,
        opendelay : 0.5,
        closedelay : 0,
        wave: [
            [0,1,2,3],
            [4,5,6,7],
            [8,9,10,11],
            [12,13,14,15],
            [16,17,18,19],
        ]

    }
    ,{//wave 2 
        open : 1,
        opendelay : 0.5,
        closedelay : 0,
        wave: [
            [16,17,18,19],
            [12,13,14,15],
            [8,9,10,11],
            [4,5,6,7],
            [0,1,2,3]
        ]
    }
    ,{//wave 3 
        open : 1,
        opendelay : 0.5,
        closedelay : 0,
        wave: [
            [0,4,8,12,16],
            [1,5,9,13,17],
            [2,6,10,14,18],
            [3,7,11,15,19]
        ]
    }
    ,{//wave 4 
        open : 1,
        opendelay : 0.5,
        closedelay : 0,
        wave: [
            [3,7,11,15,19],
            [2,6,10,14,18],
            [1,5,9,13,17],
            [0,4,8,12,16]
        ]
    }
    ,{//wave 5 
        open : 1.1,
        opendelay : 0.5,
        closedelay : 0,
        wave: [
            [8,9,10,11],
            [12,13,14,15,4,5,6,7],
            [16,17,18,19,0,1,2,3]
        ]
    }
    ,{//wave 6
        open : 1.1,
        opendelay : 0.5,
        closedelay : 0,
        wave: [
            [16,17,18,19,0,1,2,3],
            [12,13,14,15,4,5,6,7],
            [8,9,10,11]
        ]
    }
]


var TWEEN_READY  = new TimelineMax({ 
    onComplete:function(){
        $('.ready').hide();
        initGame();
    },
    paused:true
});



// initGame();
$('.guide').show();
setTimeout(function(){
  console.log('settime')
  if($.browser.safari) bodyelem = $("body")
  else bodyelem = $("html,body")
  // bodyelem.scrollTop(500)
  bodyelem.animate({ scrollTop: 500 } , 500);
} , 1200)

setReadyTween();
// TweenMax.ticker.fps(25);

$('.result').hide();
$('.guide a').eq(1).on('click' , function(){
    overlay.open();
    $( window).scrollTop( 400 );
    startplay(function(){
        overlay.close();
        console.log('success')
        $('.guide').hide();
        $('.ready').show();
        TWEEN_READY.play();
    } , 
    function(){
        overlay.close();
        // alert('startplay error') 
    });
    
})

function setReadyTween(){
    var readyDiv = $('.ready div').eq(0)
    var goDiv = $('.ready div').eq(1)

    TWEEN_READY
    .fromTo( readyDiv , 0.5 ,{scale:0.5 , autoAlpha:0} ,{scale:1 ,autoAlpha:1 ,  ease:Power4.easeOut })
    .to( readyDiv , 0.3 ,{scale:1.2 ,autoAlpha:0 ,  ease:Power4.easeOut })
    .fromTo( goDiv , 0.5 ,{scale:0.5 , autoAlpha:0} ,{scale:1 ,autoAlpha:1 ,  ease:Power4.easeOut} , '-=0.2')
    .to( goDiv , 0.4 ,{scale:1.4 , ease:Power4.easeOut} , 'OUT')
    .to( $('.ready') , 0.4 ,{autoAlpha:0 , ease:Power4.easeOut } , 'OUT')

}

function initGame(){
    // console.log('initGame');
    GAME_SCORE = 0;
    countBoxOpen = maxBlocks;
    // TweenMax.lagSmoothing(0)
    $('.scores div:eq(0) span').html( GAME_SCORE )//score = 0

    // $('.guide').hide();

    for(var  i = 0 ; i < maxBlocks ; i++){
        blocksTmp.push(i)
    }

    for(var i = 0;i < maxBlocks/2 ;i++) {
        
        var match =  {
                blocks:[],
                img:i,
                status:'unmatch'
        }
        
        var value1 = Math.floor(Math.random() * blocksTmp.length);
        var value2;

        do{
            value2 = Math.floor(Math.random() * blocksTmp.length);        
        }while(value1 == value2)

        var tmp1 = match.blocks[0] = blocksTmp[value1];
        var tmp2 = match.blocks[1] = blocksTmp[value2];

        arrays[ tmp1 ] = match;
        arrays[ tmp2 ] = match;
        
        blocksTmp.splice(Math.max(value1 , value2), 1);
        blocksTmp.splice(Math.min(value1 , value2), 1);
    }
    openAllBox();
}

function openItem( _index , prop ){
    // console.log('openItem '+_index);
    if(prop == null) prop = {};

    var defaultprop = {
        scaleFrom : 0.5,
        scaleTo : 1,
        open : 0.5,
        opendelay : 0,
        autoclose : false,
        closedelay : 0.5
    }

    for(var p in defaultprop) if(prop[p] == null) prop[p] = defaultprop[p]
        // prop = defaultprop

    
    var image = 'images/icons/' + arrays[ _index ].img + '.png';
    
    TweenMax.fromTo( $('.items .item:eq('+ _index +') div img') , prop.open , {scale:prop.scaleFrom} , {delay:prop.opendelay , scale:prop.scaleTo , ease:Elastic.easeOut
    ,onStart:function(){
        // console.log('OPEN START : '+_index)
        $('.items .item:eq('+ _index +') div img').attr('src' , image);
        $('.items .item:eq('+ _index +')').addClass('open');
    } 
    ,onComplete:function(){
        // console.log('OPEN COMPLETE : '+_index)
        if( prop.autoclose && isFirstStart) {
            TweenLite.to( $('.items .item:eq('+ _index +') div') , prop.closedelay , {
                onComplete:function(){
                    closeItem( _index );
                    // $('.items .item').eq( _index ).removeClass('open').children().attr('src' , '');
                    //countbox then startgame
                    countBoxOpen--;
                    if(countBoxOpen == 0){
                        isFirstStart = false;
                        gameStart();     
                    } 
                }
            })
        }
    }});

    
}

function closeItem( _index ){
    // console.log('closeItem '+_index)
    if( arrays[ _index ].status == 'match' ){
        $('.items .item:eq('+ _index +')').addClass('open').find('img').attr('src' , '');
    }else{
        $('.items .item:eq('+ _index +')').removeClass('open').find('img').attr('src' , '');
    }
}

function openAllBox(){
    var prop = openBoxPack[ Math.floor(Math.random()*openBoxPack.length) ]
    for(var i = 0; i < prop.wave.length ; i++){
        var prop2 = {
            open : prop.open,
            opendelay : prop.opendelay*i,
            closedelay : prop.closedelay,
            autoclose : true
        }
        for(var j =0 ; j < prop.wave[i].length ; j++){
            var index = prop.wave[i][j];
            openItem(index , prop2)    
        }
    }
}


var timer = { timeCount:0 }

function timeStart(){
    
    calltimeout();

    timer.timeCount = 0;
    GAME_TIMER = TweenMax.to( timer , GAME_DURATION , {timeCount:1,
        ease:Power0.easeNone,
        onComplete:function(){
            $('.clocks div:eq(0) span').addClass('disable');
            gameOver();    
        },
        onUpdate:function(){
            var bottle = Math.ceil(timer.timeCount * $('.clocks div:eq(0) span').length) -1 ;
            if( bottle < 0 ) return;

            console.log(GAME_TIMER.time())
            $('.clocks div:eq(0) span').eq( bottle ).prevAll().addClass('disable');
        }
    } )
    
}

function addScore(){
    GAME_SCORE++;
    $('.scores div:eq(0) span').html( GAME_SCORE );
    if( GAME_SCORE == 10 ) gameOver();
}



function gameStart(){
    timeStart();
    $(document).on('mousedown touchstart' , '.items > div:not(.open) ' , function() {
        GAME_CLICK_COUNT++;
        var index = $(this).index();
        
        //data = "10.000|01"; //stepup time|Position
        var data = [ GAME_TIMER.time().toFixed(3) , index , arrays[index].img ].join('|')
        // console.log(data)
        SEND_QUEUE_PACK.push(data);


        if(select.length > 0 && index == select[0].box) return;        
        openItem( index );
        
        var boxSelected  = {box:index, img:arrays[index].img }
        select.push( boxSelected );

        if (select.length > 1) {
            var sel0 = select[0];
            var sel1 = select[1];
            // console.log('start compare');
            // if ($(arrays[$(this).index()].blocks).not(select).length === 0 && $(select).not(arrays[$(this).index()].blocks).length === 0) {
            if(sel0.img == sel1.img){
                // console.log('---------------- MATCH '+sel0 , sel1);
                arrays[sel0.box].status = 'match'
                arrays[sel1.box].status = 'match'

                select = [];
                addScore();

                TweenMax.to([ $('.items .item:eq('+ sel0.box +') div img') , $('.items .item:eq('+ sel1.box +') div img') ] 
                    , 0.3 , { autoAlpha:0 , scale:0.5 , ease:Back.easeOut , delay:0.5 , 
                    onStart:function(){
                        // console.log('MATCH START FADE : '+sel0 , sel1);
                    },
                    onComplete:function(){
                        $('.items .item:eq('+ sel0.box +') div img').attr('src' , '');
                        $('.items .item:eq('+ sel1.box +') div img').attr('src' , '');
                        $('.items .item:eq('+ sel0.box +')').addClass('open');
                        $('.items .item:eq('+ sel1.box +')').addClass('open');
                    }
                })
                
            }else{
                // console.log('unmatch');
                select = [];
                TweenMax.delayedCall(0.5 , function(){
                    closeItem( sel0.box );
                    closeItem( sel1.box );
                })
            }

        }
    });
}

function gameOver(){
    $(document).off('mousedown touchstart');
    if(window.addEventListener){
        window.removeEventListener("focus" , checkTimeInFocus)
        window.removeEventListener("blur" , getTimeOutFocus)
    }else if(window.attachEvent){
        window.detachEvent ("focus" , checkTimeInFocus)
        window.detachEvent ("blur" , getTimeOutFocus)
    }

    $(window).off("focusin", checkTimeInFocus)
    $(window).off("focusout", getTimeOutFocus)
    

    overlay.open();
    GAME_TIMER.kill();
    var gameTime = (GAME_DURATION < GAME_TIMER.time()) ? GAME_DURATION : GAME_TIMER.time()
    GAME_FINISH_DATA = [ gameTime , GAME_SCORE , GAME_CLICK_COUNT].join('|')
    console.log(GAME_FINISH_DATA)
    sendFinishGameData();
}

function sendFinishGameData(){
    console.log(GAME_FINISH_DATA);
    finishplay(GAME_FINISH_DATA , function(){
        isEndGame = true;
    } , function(){
        sendFinishGameData();
        // alert('finishplay ERROR')
    })
}

function showResult(){
    overlay.close();
    $('.result').show();
    $('.result div span').eq(0).html( GAME_SCORE )
    $('.result div span').eq(1).html( GAME_TIMER.time().toFixed(2) )   
}

// check if browser window has focus        
var TIME_OUT;
var notIE = (document.documentMode === undefined),
    isChromium = window.chrome;
      
if (notIE && !isChromium) {

    // checks for Firefox and other  NON IE Chrome versions
    $(window).on("focusin", checkTimeInFocus)
    $(window).on("focusout", getTimeOutFocus)

    // $(window).on("focusin", function () { 

    //     // tween resume() code goes here
    //     setTimeout(function(){            
    //         console.log("focus");
    //     },300);

    // }).on("focusout", function () {

    //     // tween pause() code goes here
    //     console.log("blur");

    // });

} else {
    
    // checks for IE and Chromium versions
    if (window.addEventListener) {

        // // bind focus event
        // window.addEventListener("focus", function (event) {
        //     checkTimeInFocus();
        // }, false);

        // // bind blur event
        // window.addEventListener("blur", function (event) {
        //     getTimeOutFocus();
        // }, false);

        window.addEventListener("focus", checkTimeInFocus);
        window.addEventListener("blur", getTimeOutFocus);

    } else {
        // bind focus event
        // window.attachEvent("focus", function (event) {
        //     checkTimeInFocus()
        // });

        // // bind focus event
        // window.attachEvent("blur", function (event) {
        //     getTimeOutFocus()
        // });


        window.attachEvent("focus", checkTimeInFocus);

        // bind focus event
        window.attachEvent("blur", getTimeOutFocus);
    }
}

var gameTimeOut;
function getTimeOutFocus(){
    TIME_OUT = new Date().getTime();
    
    // console.log('BLUR TIME_OUT : '+TIME_OUT/1000);
    if(GAME_TIMER != undefined){
        gameTimeOut = GAME_TIMER.time();
        // console.log('BLUR GAME_TIMER : '+GAME_TIMER.time())   
    }
}

function checkTimeInFocus(){
    

   if(GAME_TIMER != undefined && gameTimeOut != undefined){

        gameTimeOut = GAME_TIMER.time() - gameTimeOut
        // console.log('gameTimeOut : '+gameTimeOut)
        if(gameTimeOut <= 0) gameTimeOut = 0;
        TIME_OUT = ( new Date().getTime() - TIME_OUT ) - (gameTimeOut*1000);
        // console.log('FOCUS TIME_OUT : '+TIME_OUT/1000)
        GAME_TIMER.seek(GAME_TIMER.time() + TIME_OUT/1000)
        // console.log('GAME_TIMER : '+GAME_TIMER.time())   
    }
    
    // console.log('----')

}




function sendGameLogger(){
    if(SEND_QUEUE_PACK.length > 0){
        var data = SEND_QUEUE_PACK[0]
        gamelogger( data , function(){
            SEND_QUEUE_PACK.splice(0,1);
            calltimeout()
        } , function(){
            calltimeout();
            console.log('gamelogger error')
        })
    }else{
        if( isEndGame ) {
            clearTimeout(sendTimeout);
            showResult();
        }
        else calltimeout();
        
    }
}


var sendTimeout
function calltimeout(){
    // console.log('calltimeout')
    sendTimeout = setTimeout(function(){
        sendGameLogger()
    } , 100)

}






})()
        
