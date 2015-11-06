/**
 * Created by 19.06.2013-7pm on 03-Nov-15.
 */

(function (window) {
    
    var Spinner = function(){
        this.domElement.style.width = "100%";
        this.domElement.style.height = "100%";
        this.domElement.style.zIndex = "200000000";
        this.domElement.style.position = "absolute";
        this.spinUI = this.getSpinUI();
        this.spinImage = this.getSpinnerImage();
        this.spinUI.addChild(this.spinImage);
        this.addChild(this.spinUI);
    };

    Spinner.prototype= new flexiciousNmsp.UIComponent();
    Spinner.prototype.typeName=Spinner.typeName="Spinner";


    Spinner.prototype.spin = function(parent){
        parent = parent || document.body;
        if(Array.prototype.indexOf.call(parent.children, this.domElement) == -1) {
            parent.appendChild(this.domElement);
            new imageLoader(cImageSrc, 'startAnimation()');
        }
    };

    Spinner.prototype.stop = function(){
        if(this.domElement.parentNode) {
            this.domElement.parentNode.removeChild(this.domElement);
            stopAnimation();
        }
    };

    Spinner.prototype.opacity = function(){

    };

    Spinner.prototype.lines = function(){

    };

    Spinner.prototype.getSpinUI = function(){
        var spinUI = new flexiciousNmsp.UIComponent("div");
        spinUI.domElement.style.width = "100%";
        spinUI.domElement.style.height = "100%";
        spinUI.domElement.style.textAlign = "center";
        spinUI.domElement.style.background = "rgba(0,0,0,.15)";
        return spinUI;
    };

    Spinner.prototype.getSpinnerImage = function () {
        var img = new flexiciousNmsp.UIComponent("div");
        img.domElement.id = "loaderImage";
        img.domElement.style.marginTop = "20%";
        return img;
    };

    flexiciousNmsp.Spinner = Spinner;
}(window));

var cSpeed=6;
var cWidth=64;
var cHeight=64;
var cTotalFrames=12;
var cFrameWidth=64;
var cImageSrc='images/sprites.png';

var cImageTimeout=false;
var cIndex=0;
var cXpos=0;
var cPreloaderTimeout=false;
var SECONDS_BETWEEN_FRAMES=0;

function startAnimation(){

    if(!document.getElementById('loaderImage'))
        return;
    document.getElementById('loaderImage').style.backgroundImage='url('+cImageSrc+')';
    document.getElementById('loaderImage').style.width=cWidth+'px';
    document.getElementById('loaderImage').style.height=cHeight+'px';

    //FPS = Math.round(100/(maxSpeed+2-speed));
    FPS = Math.round(100/cSpeed);
    SECONDS_BETWEEN_FRAMES = 1 / FPS;

    cPreloaderTimeout=setTimeout('continueAnimation()', SECONDS_BETWEEN_FRAMES/1000);

}

function continueAnimation(){

    cXpos += cFrameWidth;
    //increase the index so we know which frame of our animation we are currently on
    cIndex += 1;

    //if our cIndex is higher than our total number of frames, we're at the end and should restart
    if (cIndex >= cTotalFrames) {
        cXpos =0;
        cIndex=0;
    }

    if(document.getElementById('loaderImage'))
        document.getElementById('loaderImage').style.backgroundPosition=(-cXpos)+'px 0';

    cPreloaderTimeout=setTimeout('continueAnimation()', SECONDS_BETWEEN_FRAMES*1000);
}

function stopAnimation(){//stops animation
    clearTimeout(cPreloaderTimeout);
    cPreloaderTimeout=false;
}

function imageLoader(s, fun)//Pre-loads the sprites image
{
    clearTimeout(cImageTimeout);
    cImageTimeout=0;
    genImage = new Image();
    genImage.onload=function (){cImageTimeout=setTimeout(fun, 0)};
    genImage.onerror=new Function('alert(\'Could not load the image\')');
    genImage.src=s;
}