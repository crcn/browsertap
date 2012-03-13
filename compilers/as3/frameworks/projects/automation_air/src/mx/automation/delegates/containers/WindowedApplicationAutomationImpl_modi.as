////////////////////////////////////////////////////////////////////////////////
//
//  ADOBE SYSTEMS INCORPORATED
//  Copyright 2006-2007 Adobe Systems Incorporated
//  All Rights Reserved.
//
//  NOTICE: Adobe permits you to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
//
////////////////////////////////////////////////////////////////////////////////

package mx.automation.delegates.containers 
{
import flash.display.DisplayObject;
import flash.events.Event;

import mx.automation.Automation;
import mx.automation.delegates.containers.ApplicationAutomationImpl;
import mx.core.WindowedApplication;
import mx.core.mx_internal;
import mx.events.AIREvent;
import mx.events.WindowExistenceEvent;
use namespace mx_internal;

[Mixin]
/**
 * 
 *  Defines the methods and properties required to perform instrumentation for the 
 *  Canvas class. 
 * 
 *  @see mx.containers.Canvas
 *  
 *  
 *  @langversion 3.0
 *  @playerversion Flash 9
 *  @playerversion AIR 1.1
 *  @productversion Flex 4
 */
public class WindowedApplicationAutomationImpl extends  ApplicationAutomationImpl 
{
    
    //--------------------------------------------------------------------------
    //
    //  Class methods
    //
    //--------------------------------------------------------------------------

    /**
     *  Registers the delegate class for a component class with automation manager.
     *  
     *  @param root The SystemManger of the application.
     *  
     *  @langversion 3.0
     *  @playerversion Flash 9
     *  @playerversion AIR 1.1
     *  @productversion Flex 4
     */
    public static function init(root:DisplayObject):void
    {
        Automation.registerDelegateClass(WindowedApplication, WindowedApplicationAutomationImpl);
    }   
    
    //--------------------------------------------------------------------------
    //
    //  Constructor
    //
    //--------------------------------------------------------------------------

    /**
     *  Constructor.
     * @param obj Canvas object to be automated.     
     *  
     *  @langversion 3.0
     *  @playerversion Flash 9
     *  @playerversion AIR 1.1
     *  @productversion Flex 4
     */
    public function WindowedApplicationAutomationImpl(obj:WindowedApplication)
    {
        super(obj);
        obj.showInAutomationHierarchy = true;
        obj.addEventListener(WindowExistenceEvent.WINDOW_CREATE,newWindowHandler);
        recordClick = true;
    }
   
    /**
     *  @private
     */
    private function newWindowHandler(event:WindowExistenceEvent):void
    {
    	Automation.automationManager2.registerNewWindow(event.window as DisplayObject);
    }
    
    /**
     *  @private
     */
    public function get windowedApplication():WindowedApplication
    {
    	return  uiComponent as WindowedApplication;
    }
     
}

}
