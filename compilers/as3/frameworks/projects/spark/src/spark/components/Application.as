////////////////////////////////////////////////////////////////////////////////
//
//  ADOBE SYSTEMS INCORPORATED
//  Copyright 2003-2007 Adobe Systems Incorporated
//  All Rights Reserved.
//
//  NOTICE: Adobe permits you to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
//
////////////////////////////////////////////////////////////////////////////////

package spark.components
{

import flash.display.DisplayObject;
import flash.display.InteractiveObject;
import flash.events.ContextMenuEvent;
import flash.events.Event;
import flash.external.ExternalInterface;
import flash.net.URLRequest;
import flash.net.navigateToURL;
import flash.system.Capabilities;
import flash.ui.ContextMenu;
import flash.ui.ContextMenuItem;
import flash.utils.setInterval;
import mx.core.FlexGlobals;
import mx.core.IInvalidating;
import mx.core.Singleton;
import mx.core.UIComponentGlobals;
import mx.core.mx_internal;
import mx.managers.FocusManager;
import mx.managers.IActiveWindowManager;
import mx.managers.ILayoutManager;
import mx.managers.ISystemManager;
import mx.styles.CSSStyleDeclaration;
import mx.styles.StyleManager;
import mx.utils.BitFlagUtil;
import mx.utils.LoaderUtil;
import spark.layouts.supportClasses.LayoutBase;

use namespace mx_internal;

//--------------------------------------
//  Events
//--------------------------------------

/**
 *  Dispatched after the Application has been initialized,
 *  processed by the LayoutManager, and attached to the display list.
 * 
 *  @eventType mx.events.FlexEvent.APPLICATION_COMPLETE
 *  
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
[Event(name="applicationComplete", type="mx.events.FlexEvent")]

/**
 *  Dispatched when an HTTPService call fails.
 * 
 *  @eventType flash.events.ErrorEvent.ERROR
 *  
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
[Event(name="error", type="flash.events.ErrorEvent")]

//--------------------------------------
//  Styles
//--------------------------------------

/**
 *  The background color of the application. This color is used as the stage color for the
 *  application and the background color for the HTML embed tag.
 *   
 *  @langversion 3.0
 *  @playerversion Flash 9
 *  @playerversion AIR 1.1
 *  @productversion Flex 3
 */
[Style(name="backgroundColor", type="uint", format="Color", inherit="no")]

//--------------------------------------
//  Excluded APIs
//--------------------------------------

[Exclude(name="direction", kind="property")]
[Exclude(name="tabIndex", kind="property")]
[Exclude(name="toolTip", kind="property")]
[Exclude(name="x", kind="property")]
[Exclude(name="y", kind="property")]

//--------------------------------------
//  Other metadata
//--------------------------------------

/**
 *  The frameworks must be initialized by SystemManager.
 *  This factoryClass will be automatically subclassed by any
 *  MXML applications that don't explicitly specify a different
 *  factoryClass.
 *  
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
[Frame(factoryClass="mx.managers.SystemManager")]

[ResourceBundle("components")]

/**
 *  Flex defines a default, or Application, container that lets you start
 *  adding content to your application without explicitly defining
 *  another container.
 *
 *  <p>The Application container has the following default characteristics:</p>
 *     <table class="innertable">
 *        <tr>
 *           <th>Characteristic</th>
 *           <th>Description</th>
 *        </tr>
 *        <tr>
 *           <td>Default size</td>
 *           <td>375 pixels high and 500 pixels wide in the Standalone Flash Player, 
 *               and all available space in a browser</td>
 *        </tr>
 *        <tr>
 *           <td>Minimum size</td>
 *           <td>0 pixels wide and 0 pixels high</td>
 *        </tr>
 *        <tr>
 *           <td>Maximum size</td>
 *           <td>No limit</td>
 *        </tr>
 *        <tr>
 *           <td>Default skin class</td>
 *           <td>spark.skins.spark.ApplicationSkin</td>
 *        </tr>
 *     </table>
 * 
 *  @mxml
 *
 *  <p>The <code>&lt;s:Application&gt;</code> tag inherits all of the tag 
 *  attributes of its superclass and adds the following tag attributes:</p>
 *
 *  <pre>
 *  &lt;s:Application
 *    <strong>Properties</strong>
 *    backgroundColor="0xFFFFFF"
 *    colorCorrection="default"
 *    controlBarContent="null"
 *    controlBarLayout="HorizontalLayout"
 *    controlBarVisible="true"
 *    frameRate="24"
 *    pageTitle""
 *    preloader="<i>No default</i>"
 *    preloaderChromeColor="<i>No default</i>"
 *    scriptRecursionLimit="1000"
 *    scriptTimeLimit="60"
 *    usePreloader="true"
 *    viewSourceURL=""
 *    xmlns:<i>No default</i>="<i>No default</i>"
 *  
 *    <strong>Events</strong>
 *    applicationComplete="<i>No default</i>"
 *    error="<i>No default</i>"
 *  /&gt;
 *  </pre>
 *
 *  @see spark.skins.spark.ApplicationSkin
 *  @includeExample examples/ApplicationContainerExample.mxml
 *
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
public class Application extends SkinnableContainer 
{
    include "../core/Version.as";

    //--------------------------------------------------------------------------
    //
    //  Class constants
    //
    //--------------------------------------------------------------------------
    
    /**
     *  @private
     */
    private static const CONTROLBAR_PROPERTY_FLAG:uint = 1 << 0;

    /**
     *  @private
     */
    private static const LAYOUT_PROPERTY_FLAG:uint = 1 << 1;

    /**
     *  @private
     */
    private static const VISIBLE_PROPERTY_FLAG:uint = 1 << 2;

    //--------------------------------------------------------------------------
    //
    //  Class properties
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
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function Application()
    {
        UIComponentGlobals.layoutManager = ILayoutManager(
            Singleton.getInstance("mx.managers::ILayoutManager"));
        UIComponentGlobals.layoutManager.usePhasedInstantiation = true;

        if (!FlexGlobals.topLevelApplication)
            FlexGlobals.topLevelApplication = this;

        super();
                    
        showInAutomationHierarchy = true;
        
        initResizeBehavior();
    }

    //--------------------------------------------------------------------------
    //
    //  Variables
    //
    //--------------------------------------------------------------------------

    /**
     *  @private
     */
    private var resizeHandlerAdded:Boolean = false;
    
    /**
     *  @private
     */
    private var percentBoundsChanged:Boolean;

    /**
     *  @private
     *  Placeholder for Preloader object reference.
     */
    private var preloadObj:Object;
    
    /**
     *  @private
     *  This flag indicates whether the width of the Application instance
     *  can change or has been explicitly set by the developer.
     *  When the stage is resized we use this flag to know whether the
     *  width of the Application should be modified.
     */
    private var resizeWidth:Boolean = true;
    
    /**
     *  @private
     *  This flag indicates whether the height of the Application instance
     *  can change or has been explicitly set by the developer.
     *  When the stage is resized we use this flag to know whether the
     *  height of the Application should be modified.
     */
    private var resizeHeight:Boolean = true;
    
    /**
     *  @private
     */ 
    private var synchronousResize:Boolean = false;
    
    /**
     * @private
     * (Possibly null) reference to the View Source context menu item,
     * so that we can update it for runtime localization.
     */
    private var viewSourceCMI:ContextMenuItem;

    //----------------------------------
    //  colorCorrection
    //----------------------------------
    
    [Inspectable(enumeration="default,off,on", defaultValue="default" )]
    
   /**
    *  The value of the stage's <code>colorCorrection</code> property. 
    *  If this application does not have access to the stage's <code>colorCorrection</code> property, 
    *  the value of the <code>colorCorrection</code> property is <code>null</code>.
    *  
    *  <p>Only the main application is allowed to set the <code>colorCorrection</code>
    *  property. If a nested application's needs to set the color correction property, it 
    *  must set it by referencing the main application's instance.</p>
    *
    *  @default ColorCorrection.DEFAULT
    *
    *  @see flash.display.ColorCorrection
    *  
    *  @langversion 3.0
    *  @playerversion Flash 10
    *  @playerversion AIR 1.5
    *  @productversion Flex 4
    */
    public function get colorCorrection():String
    {
        try
        {
            var sm:ISystemManager = systemManager;
            if (sm && sm.stage)
                return sm.stage.colorCorrection;
        }
        catch (e:SecurityError)
        {
            // ignore error if this application is not allow
            // to view the colorCorrection property.
        }

        return null;
    }
    
    /**
     * @private
     */
    public function set colorCorrection(value:String):void
    {
        // Since only the main application is allowed to change the value this property, there
        // is no need to catch security violations like in the getter.
        var sm:ISystemManager = systemManager;
        if (sm && sm.stage && sm.isTopLevelRoot())
            sm.stage.colorCorrection = value;
    }
    
    /**
     *  @private
     *  Several properties are proxied to controlBarGroup.  However, when controlBarGroup
     *  is not around, we need to store values set on SkinnableContainer.  This object 
     *  stores those values.  If controlBarGroup is around, the values are stored 
     *  on the controlBarGroup directly.  However, we need to know what values 
     *  have been set by the developer on the SkinnableContainer (versus set on 
     *  the controlBarGroup or defaults of the controlBarGroup) as those are values 
     *  we want to carry around if the controlBarGroup changes (via a new skin). 
     *  In order to store this info effeciently, controlBarGroupProperties becomes 
     *  a uint to store a series of BitFlags.  These bits represent whether a 
     *  property has been explicitely set on this SkinnableContainer.  When the 
     *  controlBarGroup is not around, controlBarGroupProperties is a typeless 
     *  object to store these proxied properties.  When controlBarGroup is around,
     *  controlBarGroupProperties stores booleans as to whether these properties 
     *  have been explicitely set or not.
     */
    private var controlBarGroupProperties:Object = { visible: true };

    //----------------------------------
    //  controlBarGroup
    //---------------------------------- 
    
    [SkinPart(required="false")]

    /**
     *  The skin part that defines the appearance of the 
     *  control bar area of the container.
     *  By default, the ApplicationSkin class defines the control bar area to appear at the top 
     *  of the content area of the Application container with a grey background. 
     *
     *  @see spark.skins.spark.ApplicationSkin
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public var controlBarGroup:Group;

    //----------------------------------
    //  controlBarContent
    //---------------------------------- 
    
    [ArrayElementType("mx.core.IVisualElement")]
    
    /**
     *  The set of components to include in the control bar area of the 
     *  Application container. 
     *  The location and appearance of the control bar area of the Application container 
     *  is determined by the spark.skins.spark.ApplicationSkin class. 
     *  By default, the ApplicationSkin class defines the control bar area to appear at the top 
     *  of the content area of the Application container with a grey background. 
     *  Create a custom skin to change the default appearance of the control bar.
     *
     *  @default null
     *
     *  @see spark.skins.spark.ApplicationSkin
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function get controlBarContent():Array
    {
        if (controlBarGroup)
            return controlBarGroup.getMXMLContent();
        else
            return controlBarGroupProperties.controlBarContent;
    }

    /**
     *  @private
     */
    public function set controlBarContent(value:Array):void
    {
        if (controlBarGroup)
        {
            controlBarGroup.mxmlContent = value;
            controlBarGroupProperties = BitFlagUtil.update(controlBarGroupProperties as uint, 
                                                        CONTROLBAR_PROPERTY_FLAG, value != null);
        }
        else
            controlBarGroupProperties.controlBarContent = value;

        invalidateSkinState();
    }

    //----------------------------------
    //  controlBarLayout
    //---------------------------------- 
    
    /**
     *  Defines the layout of the control bar area of the container.
     *
     *  @default HorizontalLayout
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function get controlBarLayout():LayoutBase
    {
        return (controlBarGroup) 
            ? controlBarGroup.layout 
            : controlBarGroupProperties.layout;
    }

    public function set controlBarLayout(value:LayoutBase):void
    {
        if (controlBarGroup)
        {
            controlBarGroup.layout = value;
            controlBarGroupProperties = BitFlagUtil.update(controlBarGroupProperties as uint, 
                                                        LAYOUT_PROPERTY_FLAG, true);
        }
        else
            controlBarGroupProperties.layout = value;
    }

    //----------------------------------
    //  controlBarVisible
    //---------------------------------- 
    
    /**
     *  If <code>true</code>, the control bar is visible.
     *  The flag has no affect if there is no value set for
     *  the <code>controlBarContent</code> property.
     *
     *  <p><b>Note:</b> The Application container does not monitor the 
     *  <code>controlBarGroup</code> property. 
     *  If other code makes it invisible, the Application container might 
     *  not update correctly.</p>
     *
     *  @default true
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function get controlBarVisible():Boolean
    {
        return (controlBarGroup) 
            ? controlBarGroup.visible 
            : controlBarGroupProperties.visible;
    }

    public function set controlBarVisible(value:Boolean):void
    {
        if (controlBarGroup)
        {
            controlBarGroup.visible = value;
            controlBarGroupProperties = BitFlagUtil.update(controlBarGroupProperties as uint, 
                                                        VISIBLE_PROPERTY_FLAG, value);
        }
        else
            controlBarGroupProperties.visible = value;

        invalidateSkinState();
        if (skin)
            skin.invalidateSize();
    }

    //--------------------------------------------------------------------------
    //
    //  Compile-time pseudo-properties
    //
    //--------------------------------------------------------------------------

    // These declarations correspond to the MXML-compile-time attributes
    // allowed on the <Application> tag. These attributes affect the MXML
    // compiler, but they aren't actually used in the runtime framework.
    // The declarations appear here in order to provide metadata about these
    // attributes for Flash Builder.

    //----------------------------------
    //  frameRate
    //----------------------------------

    [Inspectable(defaultValue="24")]

    /**
     *    Specifies the frame rate of the application.
     * 
     *    <p><b>Note:</b> This property cannot be set by ActionScript code; it must be set in MXML code.</p>
     *
     *    @default 24
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public var frameRate:Number;

    //----------------------------------
    //  pageTitle
    //----------------------------------

    /**
     *    Specifies a string that appears in the title bar of the browser.
     *    This property provides the same functionality as the
     *    HTML <code>&lt;title&gt;</code> tag.
     * 
     *    <p><b>Note:</b> This property cannot be set by ActionScript code; it must be set in MXML code. 
     *    The value set in MXML code is designed to be used by a tool to update the HTML templates 
     *    provided with the SDK.</p>
     *
     *    @default ""
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public var pageTitle:String;

    //----------------------------------
    //  preloader
    //----------------------------------

    [Inspectable(defaultValue="mx.preloaders.DownloadProgressBar")]

    /**
     *  Specifies the path of a SWC component class or ActionScript
     *  component class that defines a custom progress bar.
     *  A SWC component must be in the same directory as the MXML file
     *  or in the WEB-INF/flex/user_classes directory of your Flex
     *  web application.
     * 
     *  <p><b>Note:</b> This property cannot be set by ActionScript code; it must be set in MXML code.</p>
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public var preloader:Object;
    
    //----------------------------------
    //  preloaderChromeColor
    //----------------------------------
    
    [Inspectable(defaultValue="0xCCCCCC", format="Color")]
    
    /**
     *  Specifies the chrome color used by the default preloader component. This property
     *  has the same effect as the <code>chromeColor</code> style used by Spark skins.
     *  Typically this property should be set to the same value as the 
     *  Application container's <code>chromeColor</code> style property.
     *    
     *  <p>Note: This property cannot be set by ActionScript code; it must be set in MXML code.</p>
     * 
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    
    /* This property is not directly read by the download progress bar (preloader)
     * component. It is here so that it gets picked up by the compiler and included 
     * in the info() structure for the generated system manager. The download progress bar
     * grabs the value directly from the info() structure. */
    public var preloaderChromeColor:uint;

    //----------------------------------
    //  scriptRecursionLimit
    //----------------------------------

    [Inspectable(defaultValue="1000")]

    /**
     *    Specifies the maximum depth of Flash Player or AIR 
     *    call stack before the player stops.
     *    This is essentially the stack overflow limit.
     * 
     *    <p><b>Note:</b> This property cannot be set by ActionScript code; it must be set in MXML code.</p>
     *
     *    @default 1000
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public var scriptRecursionLimit:int;

    //----------------------------------
    //  scriptTimeLimit
    //----------------------------------

    [Inspectable(defaultValue="60")]

    /**
     *    Specifies the maximum duration, in seconds, that an ActionScript
     *    event handler can execute before Flash Player or AIR assumes
     *    that it is hung, and aborts it.
     *    The maximum allowable value that you can set is 60 seconds.
     *
     *  @default 60
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public var scriptTimeLimit:Number;

    //----------------------------------
    //  usePreloader
    //----------------------------------

    [Inspectable(defaultValue="true")]

    /**
     *    If <code>true</code>, specifies to display the application preloader.
     * 
     *    <p><b>Note:</b> This property cannot be set by ActionScript code; it must be set in MXML code.</p>
     *
     *    @default true
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public var usePreloader:Boolean;

    //--------------------------------------------------------------------------
    //
    //  Overridden properties (to block metadata from superclasses)
    //
    //--------------------------------------------------------------------------
    
    //----------------------------------
    //  id
    //----------------------------------

    [Inspectable(environment="none")]

    /**
     *  @private
     */
    override public function get id():String
    {
        if (!super.id &&
            this == FlexGlobals.topLevelApplication && 
            ExternalInterface.available)
        {
            return ExternalInterface.objectID;
        }

        return super.id;
    }

    //----------------------------------
    //  percentHeight
    //----------------------------------

    /**
     *  @private
     */
    override public function set percentHeight(value:Number):void
    {
        if (value != super.percentHeight)
        {
            super.percentHeight = value;
            percentBoundsChanged = true;
            invalidateProperties();
        }
    }
    
    //----------------------------------
    //  percentWidth
    //----------------------------------

    /**
     *  @private
     */
    override public function set percentWidth(value:Number):void
    {
        if (value != super.percentWidth)
        {
            super.percentWidth = value;
            percentBoundsChanged = true;
            invalidateProperties();
        }
    }

    //----------------------------------
    //  tabIndex
    //----------------------------------

    [Inspectable(environment="none")]

    /**
     *  @private
     */
    override public function set tabIndex(value:int):void
    {
    }

    //----------------------------------
    //  toolTip
    //----------------------------------

    [Inspectable(environment="none")]

    /**
     *  @private
     */
    override public function set toolTip(value:String):void
    {
    }

    //--------------------------------------------------------------------------
    //
    //  Properties
    //
    //--------------------------------------------------------------------------

    //----------------------------------
    //  parameters
    //----------------------------------

    /**
     *  @private
     *  Storage for the parameters property.
     *  This variable is set in the initialize() method of SystemManager.
     */
    mx_internal var _parameters:Object;

    /**
     *  An Object containing name-value
     *  pairs representing the parameters provided to this Application.
     *
     *  <p>You can use a for-in loop to extract all the names and values
     *  from the parameters Object.</p>
     *
     *  <p>There are two sources of parameters: the query string of the
     *  Application's URL, and the value of the FlashVars HTML parameter
     *  (this affects only the main Application).</p>
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function get parameters():Object
    {
        return _parameters;
    }

    //----------------------------------
    //  url
    //----------------------------------

    /**
     *  @private
     *  Storage for the url property.
     *  This variable is set in the initialize().
     */
    mx_internal var _url:String;

    /**
     *  The URL from which this Application's SWF file was loaded.
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function get url():String
    {
        return _url;
    }
    
    //----------------------------------
    //  viewSourceURL
    //----------------------------------

    /**
     *  @private
     *  Storage for viewSourceURL property.
     */
    private var _viewSourceURL:String;

    /**
     *  URL where the application's source can be viewed. Setting this
     *  property inserts a "View Source" menu item into the application's
     *  default context menu.  Selecting the menu item opens the
     *  <code>viewSourceURL</code> in a new window.
     *
     *  <p>You must set the <code>viewSourceURL</code> property 
     *  using MXML, not using ActionScript, as the following example shows:</p>
     *
     *  <pre>
     *    &lt;Application viewSourceURL="http://path/to/source"&gt;
     *      ...
     *    &lt;/Application&gt;</pre>
     *
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function get viewSourceURL():String
    {
        return _viewSourceURL;
    }
    
    /**
     *  @private
     */
    public function set viewSourceURL(value:String):void
    {
        _viewSourceURL = value;
    }

    //--------------------------------------------------------------------------
    //
    //  Overridden methods: UIComponent
    //
    //--------------------------------------------------------------------------

    /**
     *  @private 
     */
    override protected function invalidateParentSizeAndDisplayList():void
    {
        if (!includeInLayout)
            return;

        var p:IInvalidating = parent as IInvalidating;
        if (!p)
        {
            if (parent is ISystemManager)
                ISystemManager(parent).invalidateParentSizeAndDisplayList();

            return;
        }

        super.invalidateParentSizeAndDisplayList();
    }

    /**
     *  @private
     */
    override public function initialize():void
    {
        // trace("FxApp initialize FxApp");
        
        var sm:ISystemManager = systemManager;
        
        _url = LoaderUtil.normalizeURL(sm.loaderInfo);
        _parameters = sm.loaderInfo.parameters;

        initManagers(sm);

        // Setup the default context menu here. This allows the application
        // developer to override it in the initialize event, if desired.
        initContextMenu();

        super.initialize();
        
        // Stick a timer here so that we will execute script every 1.5s
        // no matter what.
        // This is strictly for the debugger to be able to halt.
        // Note: isDebugger is true only with a Debugger Player.
        if (sm.isTopLevel() && Capabilities.isDebugger == true)
            setInterval(debugTickler, 1500);
    }
    
    /**
     *  @private
     */
    override protected function commitProperties():void
    {
        super.commitProperties();

        resizeWidth = isNaN(explicitWidth);
        resizeHeight = isNaN(explicitHeight);
        
        if (resizeWidth || resizeHeight)
        {
            resizeHandler(new Event(Event.RESIZE));

            if (!resizeHandlerAdded)
            {
                // weak reference
                systemManager.addEventListener(Event.RESIZE, resizeHandler, false, 0, true);
                resizeHandlerAdded = true;
            }
        }
        else
        {
            if (resizeHandlerAdded)
            {
                systemManager.removeEventListener(Event.RESIZE, resizeHandler);
                resizeHandlerAdded = false;
            }
        }
        
        if (percentBoundsChanged)
        {
            updateBounds();
            percentBoundsChanged = false;
        }
    }
    
    /**
     *  @private
     */
    override protected function resourcesChanged():void
    {
        super.resourcesChanged();
        
        // "View Source" on the context menu
        if (viewSourceCMI)
        {
            viewSourceCMI.caption = resourceManager.getString("components", "viewSource");
        }
    }
    
    /**
     *  @private
     */
    override protected function partAdded(partName:String, instance:Object):void
    {
        super.partAdded(partName, instance);
        
        if (instance == controlBarGroup)
        {
            // copy proxied values from controlBarGroupProperties (if set) to contentGroup
            var newControlBarGroupProperties:uint = 0;
            
            if (controlBarGroupProperties.controlBarContent !== undefined)
            {
                controlBarGroup.mxmlContent = controlBarGroupProperties.controlBarContent;
                newControlBarGroupProperties = BitFlagUtil.update(newControlBarGroupProperties, 
                                                               CONTROLBAR_PROPERTY_FLAG, true);
            }

            if (controlBarGroupProperties.layout !== undefined)
            {
                controlBarGroup.layout = controlBarGroupProperties.layout;
                newControlBarGroupProperties = BitFlagUtil.update(newControlBarGroupProperties, 
                                                               LAYOUT_PROPERTY_FLAG, true);
            }

            if (controlBarGroupProperties.visible !== undefined)
            {
                controlBarGroup.visible = controlBarGroupProperties.visible;
                newControlBarGroupProperties = BitFlagUtil.update(newControlBarGroupProperties, 
                                                               VISIBLE_PROPERTY_FLAG, true);
            }

            controlBarGroupProperties = newControlBarGroupProperties;
        }
    }

    /**
     *  @private
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    override protected function partRemoved(partName:String, instance:Object):void
    {
        super.partRemoved(partName, instance);

        if (instance == controlBarGroup)
        {
            // copy proxied values from contentGroup (if explicitely set) to contentGroupProperties
            
            var newControlBarGroupProperties:Object = {};
            
            if (BitFlagUtil.isSet(controlBarGroupProperties as uint, CONTROLBAR_PROPERTY_FLAG))
                newControlBarGroupProperties.controlBarContent = controlBarGroup.getMXMLContent();
            
            if (BitFlagUtil.isSet(controlBarGroupProperties as uint, LAYOUT_PROPERTY_FLAG))
                newControlBarGroupProperties.layout = controlBarGroup.layout;
            
            if (BitFlagUtil.isSet(controlBarGroupProperties as uint, VISIBLE_PROPERTY_FLAG))
                newControlBarGroupProperties.visible = controlBarGroup.visible;
            
            controlBarGroupProperties = newControlBarGroupProperties;

            controlBarGroup.mxmlContent = null;
            controlBarGroup.layout = null;
        }
    }

    /**
     *  @private
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    override protected function getCurrentSkinState():String
    {
        var state:String = enabled ? "normal" : "disabled";
        if (controlBarGroup)
        {
            if (BitFlagUtil.isSet(controlBarGroupProperties as uint, CONTROLBAR_PROPERTY_FLAG) &&
                BitFlagUtil.isSet(controlBarGroupProperties as uint, VISIBLE_PROPERTY_FLAG))
                state += "WithControlBar";
        }
        else
        {
            if (controlBarGroupProperties.controlBarContent &&
                controlBarGroupProperties.visible)
                state += "WithControlBar";
        }

        return state;
    }

    //----------------------------------
    //  unscaledHeight
    //----------------------------------
    
    /**
     *  @private
     */
    override mx_internal function setUnscaledHeight(value:Number):void
    {
        // we invalidate so we can properly add/remove the resize 
        // event handler (SDK-12664)
        invalidateProperties();
        
        super.setUnscaledHeight(value);
    }
    
    //----------------------------------
    //  unscaledWidth
    //----------------------------------
    
    /**
     *  @private
     */
    override mx_internal function setUnscaledWidth(value:Number):void
    {
        // we invalidate so we can properly add/remove the resize 
        // event handler (SDK-12664)
        invalidateProperties();
        
        super.setUnscaledWidth(value);
    }
    
    //--------------------------------------------------------------------------
    //
    //  Methods
    //
    //--------------------------------------------------------------------------

    /**
     *  @private
     *  This is here so we get the this pointer set to Application.
     */
    private function debugTickler():void
    {
        // We need some bytes of code in order to have a place to break.
        var i:int = 0;
    }

    /**
     *  @private
     */
    private function initManagers(sm:ISystemManager):void
    {
        if (sm.isTopLevel())
        {
            focusManager = new FocusManager(this);
            var awm:IActiveWindowManager = 
                IActiveWindowManager(sm.getImplementation("mx.managers::IActiveWindowManager"));
            if (awm)
                awm.activate(this);
            else
                focusManager.activate();
        }
    }
    
    /**
     *  @private
     *  Disable all the built-in items except "Print...".
     */
    private function initContextMenu():void
    {
        // context menu already set
        // nothing to init
        if (flexContextMenu != null)
        {
            // make sure we set it back on systemManager b/c it may have been overridden by now
            if (systemManager is InteractiveObject)
                InteractiveObject(systemManager).contextMenu = contextMenu;
            return;
        }
        
        var defaultMenu:ContextMenu = new ContextMenu();
        defaultMenu.hideBuiltInItems();
        defaultMenu.builtInItems.print = true;

        if (_viewSourceURL)
        {
            // don't worry! this gets updated in resourcesChanged()
            const caption:String = resourceManager.getString("components", "viewSource");
            
            viewSourceCMI = new ContextMenuItem(caption, true);
            viewSourceCMI.addEventListener(ContextMenuEvent.MENU_ITEM_SELECT, menuItemSelectHandler);
            
            defaultMenu.customItems.push(viewSourceCMI);
        }

        contextMenu = defaultMenu;
        
        if (systemManager is InteractiveObject)
            InteractiveObject(systemManager).contextMenu = defaultMenu;
    }

    /**
     *  @private
     *  Check to see if we're able to synchronize our size with the stage
     *  immediately rather than deferring (dependent on WATSON 2200950).
     */
    private function initResizeBehavior():void
    {
        var version:Array = Capabilities.version.split(' ')[1].split(',');
        
        synchronousResize = (parseFloat(version[0]) > 10 || 
            (parseFloat(version[0]) == 10 && parseFloat(version[1]) >= 1))
            && (Capabilities.playerType != "Desktop");
    }
    
    //--------------------------------------------------------------------------
    //
    //  Event handlers
    //
    //--------------------------------------------------------------------------
    
    /**
     *  @private 
     *  Triggered by a resize event of the stage.
     *  Sets the new width and height.
     *  After the SystemManager performs its function,
     *  it is only necessary to notify the children of the change.
     */
    private function resizeHandler(event:Event):void
    {
        // If we're already due to update our bounds on the next
        // commitProperties pass, avoid the redundancy.
        if (!percentBoundsChanged)
        {
            updateBounds();
            
            // Update immediately when stage resizes so that we may appear 
            // in synch with the stage rather than visually "catching up".
            if (synchronousResize) 
                UIComponentGlobals.layoutManager.validateNow();
        }
    }
    
    /**
     *  @private
     *  Called when the "View Source" item in the application's context menu is
     *  selected.
     */
    protected function menuItemSelectHandler(event:Event):void
    {
        navigateToURL(new URLRequest(_viewSourceURL), "_blank");
    }
    
    /**
     *  @private
     *  Sets the new width and height after the Stage has resized
     *  or when percentHeight or percentWidth has changed.
     */
    private function updateBounds():void
    {
        // When user has not specified any width/height,
        // application assumes the size of the stage.
        // If developer has specified width/height,
        // the application will not resize.
        // If developer has specified percent width/height,
        // application will resize to the required value
        // based on the current SystemManager's width/height.
        // If developer has specified min/max values,
        // then application will not resize beyond those values.
        
        var w:Number;
        var h:Number
        
        if (resizeWidth)
        {
            if (isNaN(percentWidth))
            {
                w = DisplayObject(systemManager).width;
            }
            else 
            {
                super.percentWidth = Math.max(percentWidth, 0);
                super.percentWidth = Math.min(percentWidth, 100);
                w = percentWidth*DisplayObject(systemManager).width/100;
            }
            
            if (!isNaN(explicitMaxWidth))
                w = Math.min(w, explicitMaxWidth);
            
            if (!isNaN(explicitMinWidth))
                w = Math.max(w, explicitMinWidth);
        }
        else
        {
            w = width;
        }
        
        if (resizeHeight)
        {
            if (isNaN(percentHeight))
            {
                h = DisplayObject(systemManager).height;
            }
            else
            {
                super.percentHeight = Math.max(percentHeight, 0);
                super.percentHeight = Math.min(percentHeight, 100);
                h = percentHeight*DisplayObject(systemManager).height/100;
            }
            
            if (!isNaN(explicitMaxHeight))
                h = Math.min(h, explicitMaxHeight);
            
            if (!isNaN(explicitMinHeight))
                h = Math.max(h, explicitMinHeight);
        }
        else
        {
            h = height;
        }
        
        if (w != width || h != height)
        {
            invalidateProperties();
            invalidateSize();
        }
        
        setActualSize(w, h);
        
        invalidateDisplayList();        
    }
}

}
