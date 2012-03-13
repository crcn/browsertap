////////////////////////////////////////////////////////////////////////////////
//
//  ADOBE SYSTEMS INCORPORATED
//  Copyright 2008 Adobe Systems Incorporated
//  All Rights Reserved.
//
//  NOTICE: Adobe permits you to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
//
////////////////////////////////////////////////////////////////////////////////

package spark.components
{
import flash.events.EventPhase;
import flash.events.FocusEvent;
import flash.events.KeyboardEvent;
import flash.events.MouseEvent;
import flash.ui.Keyboard;

import mx.core.EventPriority;
import mx.core.IFactory;
import mx.core.ISelectableList;
import mx.core.IVisualElement;
import mx.core.mx_internal;
import mx.managers.IFocusManagerComponent;

import spark.components.supportClasses.ButtonBarBase;
import spark.components.supportClasses.ItemRenderer;
import spark.events.IndexChangeEvent;
import spark.events.RendererExistenceEvent;

use namespace mx_internal;  // ListBase/setCurrentCaretIndex(index);

/**
 *  Defines the radius of the TabBar buttons' top-left and top-right corners for the default
 *  TabBarButton skin.
 *
 *  @default 4
 * 
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
[Style(name="cornerRadius", type="Number", format="Length", inherit="no", theme="spark")]

//--------------------------------------
//  Other metadata
//--------------------------------------

[AccessibilityClass(implementation="spark.accessibility.TabBarAccImpl")]

[IconFile("TabBar.png")]

/**
 *  The TabBar class displays a set of identical tabs.  
 *  One tab can be selected at a time, and the first tab is selected by default.
 *  The TabBarSkin class arranges the tabs in a single row.  
 *  Use the TabBar <code>cornerRadius</code> style to configure the corner radius 
 *  of the tabs.
 * 
 *  <p>The set of tabs is defined by the <code>dataProvider</code> property.
 *  The appearance of each tab is defined by the TabBarSkin class.
 *  By default, each tab is defined as a ButtonBarButton component 
 *  with a skin defined by the TabBarButtonSkin class.</p>
 *
 *  <p>You can use the TabBar control to set the active child of a ViewStack container, 
 *  as the following example shows:</p>
 *
 *  <p><b>Note: </b>The Spark list-based controls (the Spark ListBase class and its subclasses
 *  such as ButtonBar, ComboBox, DropDownList, List, and TabBar) do not support the BasicLayout class
 *  as the value of the <code>layout</code> property. 
 *  Do not use BasicLayout with the Spark list-based controls.</p>
 *  
 *  <pre>
 *  &lt;s:TabBar dataProvider="{myViewStack}"/&gt; 
 *  
 *  &lt;mx:ViewStack id="myViewStack" 
 *      borderStyle="solid"&gt; 
 *  
 *      &lt;s:NavigatorContent id="search" label="Search"&gt; 
 *          &lt;s:Label text="Search Screen"/&gt; 
 *          &lt;/s:NavigatorContent&gt; 
 *  
 *      &lt;s:NavigatorContent id="custInfo" label="Customer Info"&gt; 
 *          &lt;s:Label text="Customer Info"/&gt; 
 *          &lt;/s:NavigatorContent&gt; 
 *  
 *      &lt;s:NavigatorContent id="accountInfo" label="Account Info"&gt; 
 *          &lt;s:Label text="Account Info"/&gt; 
 *          &lt;/s:NavigatorContent&gt; 
 *      &lt;/mx:ViewStack&gt; </pre>
 *
 *  <p>The TabBar container has the following default characteristics:</p>
 *  <table class="innertable">
 *     <tr><th>Characteristic</th><th>Description</th></tr>
 *     <tr><td>Default size</td><td>Large enough to display the tabs</td></tr>
 *     <tr><td>Minimum size</td><td>0 pixels</td></tr>
 *     <tr><td>Maximum size</td><td>10000 pixels wide and 10000 pixels high</td></tr>
 *  </table>
 *  
 *  @mxml <p>The <code>&lt;s:TabBar&gt;</code> tag inherits all of the tag 
 *  attributes of its superclass and adds the following tag attributes:</p>
 *
 *  <pre>
 *  &lt;s:TabBar
 *    <b>Styles</b>
 *    cornerRadius="4"
 *  /&gt;
 *  </pre>
 *
 *  @see mx.containers.ViewStack
 *  @see spark.skins.spark.TabBarSkin
 *  @see spark.skins.spark.TabBarButtonSkin
 *  @see spark.components.ButtonBarButton
 * 
 *  @includeExample examples/TabBarExample.mxml
 *  
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
public class TabBar extends ButtonBarBase implements IFocusManagerComponent
{
    include "../core/Version.as";
    
    //--------------------------------------------------------------------------
    //
    //  Class mixins
    //
    //--------------------------------------------------------------------------
    
    /**
     *  @private
     *  Placeholder for mixin by TabBarAccImpl.
     */
    mx_internal static var createAccessibilityImplementation:Function;

    
    /**
     *  Constructor.
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function TabBar()
    {
        super();

        requireSelection = true;
        mouseFocusEnabled = false;        
    }

    //--------------------------------------------------------------------------
    //
    //  Overridden methods
    //
    //--------------------------------------------------------------------------
    
    /**
     *  @private
     */
    override protected function initializeAccessibility():void
    {
        if (TabBar.createAccessibilityImplementation != null)
            TabBar.createAccessibilityImplementation(this);
    }
}
}