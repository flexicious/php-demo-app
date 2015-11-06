
(function(window){
    var CustomHeaderRender = function(){
        flexiciousNmsp.UIComponent.apply(this, ["div"]);

        var img = new flexiciousNmsp.UIComponent("img");
        this.img = img;

        var label = new flexiciousNmsp.UIComponent("span");
        this.label = label;

        this.addChild(img);
        this.addChild(label);
    };

    window.CustomHeaderRender = CustomHeaderRender;
    CustomHeaderRender.prototype = new flexiciousNmsp.UIComponent();
    CustomHeaderRender.prototype.typeName = CustomHeaderRender.typeName = 'CustomHeaderRender';
    CustomHeaderRender.prototype.getClassNames=function(){
        return ["CustomHeaderRender","UIComponent"];
    };

    CustomHeaderRender.prototype.setText = function(text){
        this.label.setInnerHTML(text);
        var imagePath = "images/";
        if(text.toLowerCase() == "status")
            imagePath += "flexicious/restore.png";

        // TODO : need to add images for other columns


        this.img.domElement.setAttribute("src",imagePath);
    }

}(window));