////////////////////////////////////////////////////////////////////////////////
//
//  ADOBE SYSTEMS INCORPORATED
//  Copyright 2009 Adobe Systems Incorporated
//  All Rights Reserved.
//
//  NOTICE: Adobe permits you to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
//
////////////////////////////////////////////////////////////////////////////////

package mx.charts
{

import mx.charts.chartClasses.CartesianChart;
import mx.charts.chartClasses.DataTip;
import mx.charts.chartClasses.IAxis;
import mx.charts.chartClasses.Series;
import mx.charts.series.BubbleSeries;
import mx.charts.styles.HaloDefaults;
import mx.graphics.SolidColor;
import mx.graphics.Stroke;
import mx.styles.CSSStyleDeclaration;
import mx.core.IFlexModuleFactory;
import mx.core.mx_internal;

use namespace mx_internal;

//--------------------------------------
//  Styles
//--------------------------------------

/**
 *  The maximum radius of the largest chart element, in pixels
 *  Flex assigns this radius to the data point with the largest value;
 *  all other data points are assigned a smaller radius
 *  based on their value relative to the smallest and largest value.
 *  The default value is 50 pixels.
 *  
 *  @langversion 3.0
 *  @playerversion Flash 9
 *  @playerversion AIR 1.1
 *  @productversion Flex 3
 */
[Style(name="maxRadius", type="Number", format="Length", inherit="no")]

/**
 *  The minimum radius of the smallest chart element, in pixels
 *  Flex assigns this radius to the data point with the smallest value;
 *  all other data points are assigned a larger radius
 *  based on their value relative to the smallest and largest value.
 *  The default value is 0 pixels.
 *  
 *  @langversion 3.0
 *  @playerversion Flash 9
 *  @playerversion AIR 1.1
 *  @productversion Flex 3
 */
[Style(name="minRadius", type="Number", format="Length", inherit="no")]

//--------------------------------------
//  Other metadata
//--------------------------------------

[DefaultBindingProperty(destination="dataProvider")]

[DefaultTriggerEvent("itemClick")]

[IconFile("BubbleChart.png")]

/**
 *  The BubbleChart control represents data with three values
 *  for each data point.
 *  Each data point is defined by a value determining its position
 *  along the horizontal axis, a value determining its position
 *  along the vertical axis, and a value determining the size
 *  of the chart element, relative to the other data points on the chart.
 *  
 *  <p>The BubbleChart control expects its <code>series</code> property
 *  to contain an array of BubbleSeries objects.</p>
 *  
 *  @mxml
 *  
 *  The <code>&lt;mx:BubbleChart&gt;</code> tag inherits all the properties
 *  of its parent classes and adds the following properties:</p>
 *  
 *  <pre>
 *  &lt;mx:BubbleChart
 *    <strong>Properties</strong>
 *    radiusAxis="<i>LinearAxis</i>"
 *    secondRadiusAxis="<i>LinearAxis</i>"
 * 
 *    <strong>Styles</strong>
 *    maxRadius="50"
 *    minRadius="0"
 *  /&gt;
 *  </pre>
 *  
 *  @includeExample examples/BubbleChartExample.mxml
 *  
 *  @see mx.charts.series.BubbleSeries
 *  
 *  @langversion 3.0
 *  @playerversion Flash 9
 *  @playerversion AIR 1.1
 *  @productversion Flex 3
 */
public class BubbleChart extends CartesianChart
{
    include "../core/Version.as";

	//--------------------------------------------------------------------------
	//
	//  Class initialization
	//
	//--------------------------------------------------------------------------
	

	//--------------------------------------------------------------------------
	//
	//  Constructor
	//
	//--------------------------------------------------------------------------

	/**
	 *  Constructor.
	 *  
	 *  @langversion 3.0
	 *  @playerversion Flash 9
	 *  @playerversion AIR 1.1
	 *  @productversion Flex 3
	 */
	public function BubbleChart()
	{
		super();

		var zAxis:LinearAxis = new LinearAxis();
		zAxis.autoAdjust = false;
		zAxis.minimum = 0;
		zAxis.interval = 1;
		radiusAxis = zAxis;
	}

	//--------------------------------------------------------------------------
	//
	//  Variables
	//
	//--------------------------------------------------------------------------
	
	/**
	 *  @private
	 */
	private var _moduleFactoryInitialized:Boolean = false;
	
	//--------------------------------------------------------------------------
	//
	//  Properties
	//
	//--------------------------------------------------------------------------
	
    //----------------------------------
	//  radiusAxis
    //----------------------------------

	/**
	 *  @private
	 *  Storage for the radiusAxis property.
	 */
	private var _radiusAxis:IAxis;
	
    [Inspectable(category="Data")]

	/**
	 *  The axis the bubble radius is mapped against
	 *  Bubble charts treat the size of the individual bubbles
	 *  as a third dimension of data which is transformed
	 *  in a similar manner to how x and y position is transformed.  
	 *  By default, the <code>radiusAxis</code> is a LinearAxis
	 *  with the <code>autoAdjust</code> property set to <code>false</code>.
	 *  
	 *  @langversion 3.0
	 *  @playerversion Flash 9
	 *  @playerversion AIR 1.1
	 *  @productversion Flex 3
	 */
	public function get radiusAxis():IAxis
	{
		return _transforms[0].getAxis(BubbleSeries.RADIUS_AXIS);
	}

	/**
	 *  @private
	 */
	public function set radiusAxis(value:IAxis):void
	{
		_radiusAxis = value;
		_transforms[0].setAxis(BubbleSeries.RADIUS_AXIS, value);
		
		invalidateData();
	}

    //----------------------------------
	//  secondRadiusAxis
    //----------------------------------

	/**
	 *  @private
	 *  Storage for the secondRadiusAxis property.
	 */
	private var _secondRadiusAxis:IAxis;
	
    [Inspectable(category="Data")]
    [Deprecated(replacement="series specific axis, example:BubbleSeries.radiusAxis")]

	/**
	 *  The axis the bubble radius of secondary series is mapped against. 
	 *  Bubble charts treat the size of the individual bubbles
	 *  as a third dimension of data which is transformed
	 *  in a similar manner to how x and y position is transformed.  
	 *  By default, the <code>secondRadisAxis</code> is a LinearAxis
	 *  with the <code>autoAdjust</code> property set to <code>false</code>.
	 *  
	 *  @langversion 3.0
	 *  @playerversion Flash 9
	 *  @playerversion AIR 1.1
	 *  @productversion Flex 3
	 */
	public function get secondRadiusAxis():IAxis
	{
		return _secondRadiusAxis;
	}

	/**
	 *  @private
	 */
	public function set secondRadiusAxis(value:IAxis):void
	{
		_secondRadiusAxis = value;

		initSecondaryMode();

		_transforms[1].setAxis(2, value);
		
		invalidateData();
		invalidateProperties();
	}
	
	//--------------------------------------------------------------------------
	//
	//  Overridden methods: UIComponent
	//
	//--------------------------------------------------------------------------

	/**
	 *  @private
	 */
	private function initStyles():Boolean
	{
		HaloDefaults.init(styleManager);
		
		var bubbleChartStyle:CSSStyleDeclaration =
			HaloDefaults.createSelector("mx.charts.BubbleChart", styleManager);		
		
		bubbleChartStyle.defaultFactory = function():void
		{
			this.axisColor = 0xD5DEDD;
			this.chartSeriesStyles = HaloDefaults.chartBaseChartSeriesStyles;		
			this.dataTipCalloutStroke = new Stroke(2, 0);
			this.dataTipRenderer = DataTip;
			this.fill = new SolidColor(0xFFFFFF, 0);
			this.calloutStroke = new Stroke(0x888888,2);						
			this.fontSize = 10;
			this.gridLinesStyleName = "bothGridLines";
			this.horizontalAxisStyleName = "blockNumericAxis";
			this.maxRadius = 50;
			this.minRadius = 0;
			this.secondHorizontalAxisStyleName = "blockNumericAxis";
			this.secondVerticalAxisStyleName = "blockNumericAxis";
			this.textAlign = "left";
			this.verticalAxisStyleName = "blockNumericAxis";
			this.horizontalAxisStyleNames = ["blockNumericAxis"];
			this.verticalAxisStyleNames = ["blockNumericAxis"];
		}
		
		return true;
	}
	
	/**
	 *  @inheritDoc
	 *  
	 *  @langversion 3.0
	 *  @playerversion Flash 9
	 *  @playerversion AIR 1.1
	 *  @productversion Flex 3
	 */
	override public function set moduleFactory(factory:IFlexModuleFactory):void
	{
		super.moduleFactory = factory;
		
		if (_moduleFactoryInitialized)
			return;
		
		_moduleFactoryInitialized = true;
		
		// our style settings
		initStyles();
	}
	
	/**
	 *  @private
	 */
	override public function styleChanged(styleProp:String):void
	{
		var series:Array /* of Series */;
		var n:int;
		var i:int;
		
		if (styleProp == null || styleProp == "maxRadius")
		{
			var maxRadius:Number = getStyle("maxRadius");
			
			series = this.series;
			n = series.length;
			for (i = 0; i < n; i++)
			{
				if (series[i] is BubbleSeries)
				{
					series[i].maxRadius = maxRadius;
					series[i].invalidateDisplayList();
				}
			}			
			
			series = secondSeries;
			n = series.length;
			for (i = 0; i < n;i++)
			{
				if (series[i] is BubbleSeries)
				{
					series[i].maxRadius = maxRadius;
					series[i].invalidateDisplayList();
				}
			}			
		}
		if (styleProp == null || styleProp == "minRadius")
		{
			var minRadius:Number = getStyle("minRadius");
			
			series = this.series;
			n = series.length;
			for (i = 0; i < n; i++)
			{
				if (series[i] is BubbleSeries)
				{
					series[i].minRadius = minRadius;
					series[i].invalidateDisplayList();
				}
			}			
			
			series = secondSeries;
			n = series.length;
			for (i = 0; i < n;i++)
			{
				if (series[i] is BubbleSeries)
				{
					series[i].minRadius = minRadius;
					series[i].invalidateDisplayList();
				}
			}			
		}
	}

	//--------------------------------------------------------------------------
	//
	//  Overridden methods: ChartBase
	//
	//--------------------------------------------------------------------------

	/**
	 *  @private
	 */
	override protected function customizeSeries(seriesGlyph:Series, i:uint):void
	{
		var maxRadius:Number = getStyle("maxRadius");
		var minRadius:Number = getStyle("minRadius");

		if ((seriesGlyph is BubbleSeries) && !isNaN(maxRadius))
			BubbleSeries(seriesGlyph).maxRadius = maxRadius;
		if ((seriesGlyph is BubbleSeries) && !isNaN(minRadius))
			BubbleSeries(seriesGlyph).minRadius = minRadius;
	}

	//--------------------------------------------------------------------------
	//
	//  Overridden methods: CartesianChart
	//
	//--------------------------------------------------------------------------

	/**
	 *  @private
	 */
	override protected function initSecondaryMode():void
	{
		super.initSecondaryMode();
		
		if (!secondVerticalAxis)
			secondVerticalAxis = new LinearAxis();

		if (!secondHorizontalAxis)
			secondHorizontalAxis = new LinearAxis();

		if (!_secondRadiusAxis)
		{
			var la:LinearAxis = new LinearAxis();
			la.autoAdjust = false;
			la.minimum = 0;
			la.interval = 1;
			_secondRadiusAxis = la;
			_transforms[1].setAxis(2, _secondRadiusAxis);
		}
		
		if (!secondVerticalAxisRenderer)
			secondVerticalAxisRenderer = new AxisRenderer();			

		if (!secondHorizontalAxis)
			secondHorizontalAxis = new LinearAxis();

		if (!secondHorizontalAxisRenderer)
			secondHorizontalAxisRenderer = new AxisRenderer();			
	}
}

}
