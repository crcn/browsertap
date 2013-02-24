var structr = require("structr"),
Desktops = require("./desktops");


module.exports = structr({

  /**
   */

  "__construct": function(options, ectwo) {

    this.ectwo = ectwo;

    //the desktops people can control
    this.desktops     = new Desktops(options, this, ectwo.instances);

    //the images which need to 
    this.destopImages = new DesktopImages(options, this, ectwo.images);

    //the available regions
    this.regions = new Regions(options, this, ectwo.regions);
  }




});