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
    
import flash.display.DisplayObject;
import flash.events.Event;
import flash.events.KeyboardEvent;
import flash.events.MouseEvent;
import flash.geom.Point;
import flash.system.ApplicationDomain;
import flash.text.TextField;
import flash.ui.Keyboard;

import mx.collections.IList;
import mx.core.DragSource;
import mx.core.EventPriority;
import mx.core.IFactory;
import mx.core.IFlexDisplayObject;
import mx.core.IUID;
import mx.core.IVisualElement;
import mx.core.mx_internal;
import mx.events.CollectionEvent;
import mx.events.CollectionEventKind;
import mx.events.DragEvent;
import mx.events.FlexEvent;
import mx.events.SandboxMouseEvent;
import mx.managers.DragManager;
import mx.managers.IFocusManagerComponent;
import mx.utils.ObjectUtil;
import mx.utils.UIDUtil;

import spark.components.supportClasses.ListBase;
import spark.core.NavigationUnit;
import spark.events.IndexChangeEvent;
import spark.events.RendererExistenceEvent;
import spark.layouts.supportClasses.DropLocation;

use namespace mx_internal;  //ListBase and List share selection properties that are mx_internal

//--------------------------------------
//  Styles
//--------------------------------------

/**
 *  @copy spark.components.supportClasses.GroupBase#style:alternatingItemColors
 * 
 *  @default undefined
 *  
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
[Style(name="alternatingItemColors", type="Array", arrayType="uint", format="Color", inherit="yes", theme="spark")]

/**
 *  The alpha of the border for this component.
 *
 *  @default 1.0
 * 
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
[Style(name="borderAlpha", type="Number", inherit="no", theme="spark", minValue="0.0", maxValue="1.0")]

/**
 *  The color of the border for this component.
 *
 *   @default #696969
 * 
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
[Style(name="borderColor", type="uint", format="Color", inherit="no", theme="spark")]

/**
 *  Controls the visibility of the border for this component.
 *
 *  @default true
 * 
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
[Style(name="borderVisible", type="Boolean", inherit="no", theme="spark")]

/**
 *  The alpha of the content background for this component.
 * 
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
[Style(name="contentBackgroundAlpha", type="Number", inherit="yes", theme="spark", minValue="0.0", maxValue="1.0")]

/**
 *  @copy spark.components.supportClasses.GroupBase#style:contentBackgroundColor
 *   
 *  @default 0xFFFFFF
 *  
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
[Style(name="contentBackgroundColor", type="uint", format="Color", inherit="yes", theme="spark")]

/**
 *  The class to create instance of for the drag indicator during drag
 *  and drop operations initiated by the List.
 *  Must be of type <code>IFlexDisplayObject</code>.
 *
 *  <p>If the class implements the <code>ILayoutManagerClient</code> interface,
 *  then the instance is validated by the DragManager.</p>
 *
 *  <p>If the class implements the <code>IVisualElement</code> interface,
 *  then the instance's <code>owner</code> property is set to the List
 *  that initiates the drag.</p>
 *
 *  <p>The AIR DragManager takes a snapshot of the instance, while
 *  the non-AIR DragManager uses the instance directly.</p>
 *
 *  @default spark.components.supportClasses.ListItemDragProxy
 *
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
[Style(name="dragIndicatorClass", type="Class", inherit="no")]

/**
 *  If a <code>dropIndicator</code> skin part is not specified in the List skin,
 *  then an instance of this class is created and used for the default drop
 *  indicator during drag and drop operations where the List is a potential
 *  drop target.
 *
 *  @default spark.skins.spark.ListDropIndicator
 *
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
[Style(name="dropIndicatorSkin", type="Class", inherit="no")]

/**
 *  @copy spark.components.supportClasses.GroupBase#style:rollOverColor
 *   
 *  @default 0xCEDBEF
 *  
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
[Style(name="rollOverColor", type="uint", format="Color", inherit="yes", theme="spark")]

/**
 *  @copy mx.controls.listClasses.ListBase#style:selectionColor
 *
 *  @default 0xA8C6EE
 *  
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
[Style(name="selectionColor", type="uint", format="Color", inherit="yes", theme="spark")]

/**
 *  @copy spark.components.supportClasses.GroupBase#style:symbolColor
 *   
 *  @default 0x000000
 *  
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */ 
[Style(name="symbolColor", type="uint", format="Color", inherit="yes", theme="spark")]

//--------------------------------------
//  Other metadata
//--------------------------------------

[AccessibilityClass(implementation="spark.accessibility.ListAccImpl")]

[DefaultTriggerEvent("change")]

[IconFile("List.png")]

/**
 *  The List control displays a vertical list of items.
 *  Its functionality is similar to that of the SELECT
 *  form element in HTML.
 *  If there are more items than can be displayed at once, it
 *  can display a vertical scroll bar so the user can access
 *  all items in the list.
 *  An optional horizontal scroll bar lets the user view items
 *  when the full width of the list items is unlikely to fit.
 *  The user can select one or more items from the list, depending
 *  on the value of the <code>allowMultipleSelection</code> property.
 *
 *  <p><b>Note: </b>The Spark list-based controls (the Spark ListBase class and its subclasses
 *  such as ButtonBar, ComboBox, DropDownList, List, and TabBar) do not support the BasicLayout class
 *  as the value of the <code>layout</code> property. 
 *  Do not use BasicLayout with the Spark list-based controls.</p>
 *
 *  <p>The List control has the following default characteristics:</p>
 *  <table class="innertable">
 *     <tr><th>Characteristic</th><th>Description</th></tr>
 *     <tr><td>Default size</td><td>112 pixels wide by 112 pixels high</td></tr>
 *     <tr><td>Minimum size</td><td>112 pixels wide by 112 pixels high</td></tr>
 *     <tr><td>Maximum size</td><td>10000 pixels wide and 10000 pixels high</td></tr>
 *     <tr><td>Default skin class</td><td>spark.skins.spark.BorderContainerSkin</td></tr>
 *  </table>
 *
 *  @mxml <p>The <code>&lt;s:List&gt;</code> tag inherits all of the tag 
 *  attributes of its superclass and adds the following tag attributes:</p>
 *
 *  <pre>
 *  &lt;s:List
 *    <strong>Properties</strong>
 *    allowMultipleSelection="false"
 *    dragEnabled="false"
 *    dragMoveEnabled="false"
 *    dropEnabled="false"
 *    selectedIndices="null"
 *    selectedItems="null"
 *    useVirtualLayout="true"
 * 
 *    <strong>Styles</strong>
 *    alternatingItemColors="undefined"
 *    borderAlpha="1.0"
 *    borderColor="0#CCCCCC"
 *    borderVisible="true"
 *    contentBackgroundColor="0xFFFFFF"
 *    dragIndicator="ListItemDragProxy"
 *    dropIndicatorSkin="ListDropIndicator"
 *    rollOverColor="0xCEDBEF"
 *    selectionColor="0xA8C6EE"
 *    symbolColor="0x000000"
 *  /&gt;
 *  </pre>
 *
 *  @see spark.skins.spark.ListSkin
 *
 *  @includeExample examples/ListExample.mxml
 *  
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
public class List extends ListBase implements IFocusManagerComponent
{
    include "../core/Version.as";
    
    //--------------------------------------------------------------------------
    //
    //  Class mixins
    //
    //--------------------------------------------------------------------------

    /**
     *  @private
     *  Placeholder for mixin by ListAccImpl.
     */
    mx_internal static var createAccessibilityImplementation:Function;

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
    public function List()
    {
        super();

        useVirtualLayout = true;
        
        // If available, get soft reference to the RichEditableText class
        // to use in keyDownHandler().
        if (ApplicationDomain.currentDomain.hasDefinition(
            "spark.components.RichEditableText"))
        {
            richEditableTextClass =
                Class(ApplicationDomain.currentDomain.getDefinition(
                    "spark.components.RichEditableText"));
        }
    }
    
    //--------------------------------------------------------------------------
    //
    //  Variables
    //
    //--------------------------------------------------------------------------
    
    /**
     *  @private
     *  The point where the mouse down event was received.
     *  Used to track whether a drag operation should be initiated when the user
     *  drags further than a certain threshold. 
     */
    mx_internal var mouseDownPoint:Point;

    /**
     *  @private
     *  The index of the element the mouse down event was received for. Used to
     *  track which is the "focus item" for a drag and drop operation.
     */
    mx_internal var mouseDownIndex:int = -1;
    
    /**
     *  @private
     *  When dragging is enabled with multiple selection, the selection is not
     *  comitted immediately on mouse down, but we wait to see whether the user
     *  intended to start a drag gesture instead. In that case we postpone
     *  comitting the selection until mouse up.
     */
    mx_internal var pendingSelectionOnMouseUp:Boolean = false;

    /**
     *  @private
     */
    mx_internal var pendingSelectionShiftKey:Boolean;

    /**
     *  @private
     */
    mx_internal var pendingSelectionCtrlKey:Boolean;
    
    /**
     *  @private
     *  Soft reference to RichEditableText class object, if available.
     */
    private var richEditableTextClass:Class;
    
    //--------------------------------------------------------------------------
    //
    //  Skin Parts
    //
    //--------------------------------------------------------------------------

    //----------------------------------
    //  dropIndicator
    //----------------------------------

    [SkinPart(required="false", type="flash.display.DisplayObject")]

    /**
     *  A skin part that defines the appearance of the drop indicator. 
     *  The drop indicator is resized and positioned by the layout 
     *  to outline the insert location when dragging over the List.
     *
     *  <p>By default, the drop indicator for a Spark control is a solid line 
     *  that spans the width of the control.
     *  Create a custom drop indicator by creating a custom skin class for the drop target.
     *  In your skin class, create a skin part named <code>dropIndicator</code>,
     *  in the &lt;fx:Declarations&gt; area of the skin class</p>
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public var dropIndicator:IFactory; 

    //----------------------------------
    //  scroller
    //----------------------------------

    [SkinPart(required="false")]

    /**
     *  The optional Scroller used to scroll the List.
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public var scroller:Scroller;
    
    //--------------------------------------------------------------------------
    //
    //  Overridden properties
    //
    //--------------------------------------------------------------------------

    //----------------------------------
    //  hasFocusableChildren
    //----------------------------------

    /**
     *  A flag that indicates whether this List's focusable item renderers 
     *  can take keyboard focus. 
     *
     *  <p><b>Note: </b>This property is similar to the <code>tabChildren</code> property
     *  used by Flash Player. 
     *  Use the <code>hasFocusableChildren</code> property with Flex applications.
     *  Do not use the <code>tabChildren</code> property.</p>
     *
     *  <p>This property is usually <code>false</code> because most components
     *  either receive focus themselves or delegate focus to a single
     *  internal sub-component and appear as if the component has
     *  received focus. You may choose to set this to true on a  List 
     *  such that the contents within your List become focusable.</p>
     * 
     *  <p>If set, and the List skin contains a Scroller skin part, 
     *  the value is proxied down onto the Scroller.</p> 
     * 
     *  <p>If the value is <code>true</code>, this proxying means that
     *  the contents of the Scroller, like item renderers, are now 
     *  focusable. For example, this means the first tab keystroke will 
     *  put focus on the List control, and the second tab keystroke will 
     *  put focus on the first focusable child of the Scroller.</p> 
     *  
     *  <p>If <code>false</code>, the first tab keystroke will put focus 
     *  on the List control and the second tab keystroke will move focus 
     *  to the next focusable control after the List.</p> 
     *  
     *  @default false
     *  
     *  @langversion 4.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    override public function set hasFocusableChildren(value:Boolean):void
    {
        super.hasFocusableChildren = value;

        if (scroller)
            scroller.hasFocusableChildren = value;
    }
    
    //----------------------------------
    //  useVirtualLayout
    //----------------------------------

    /**
     *  @inheritDoc
     *
     *  @default true
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    override public function get useVirtualLayout():Boolean
    {
        return super.useVirtualLayout;
    }

    /**
     *  Overrides the inherited default property , it is true for this class.
     * 
     *  Sets the value of the <code>useVirtualLayout</code> property
     *  of the layout associated with this control.  
     *  If the layout is subsequently replaced and the value of this 
     *  property is <code>true</code>, then the new layout's 
     *  <code>useVirtualLayout</code> property is set to <code>true</code>.
     *
     *  @default true
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    override public function set useVirtualLayout(value:Boolean):void
    {
        super.useVirtualLayout = value;
    }
    
    /**
     *  @private
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    override public function set dataProvider(value:IList):void
    {
        // Uconditionally clear the selection, see SDK-21645
        if (!isEmpty(_proposedSelectedIndices) || !isEmpty(selectedIndices))
        {
            _proposedSelectedIndices.length = 0;
            multipleSelectionChanged = true;
            invalidateProperties();
        }
        super.dataProvider = value;
    }
        
        
    //--------------------------------------------------------------------------
    //
    //  Properties
    //
    //--------------------------------------------------------------------------
    
    //----------------------------------
    //  allowMultipleSelection
    //----------------------------------
    
    /**
     *  @private
     */
    private var _allowMultipleSelection:Boolean = false;
    
    /**
     *  If <code>true</code> multiple selection is enabled. 
     *  When switched at run time, the current selection
     *  is cleared. 
     *
     *  @default false
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function get allowMultipleSelection():Boolean
    {
        return _allowMultipleSelection;
    }
    
    /**
     *  @private
     */
    public function set allowMultipleSelection(value:Boolean):void
    {
        if (value == _allowMultipleSelection)
            return;     
        
        _allowMultipleSelection = value; 
    }
    
    //----------------------------------
    //  dragEnabled
    //----------------------------------
    
    /**
     *  @private
     *  Storage for the dragEnabled property.
     */
    private var _dragEnabled:Boolean = false;
    
    [Inspectable(defaultValue="false")]
    
    /**
     *  A flag that indicates whether you can drag items out of
     *  this control and drop them on other controls.
     *  If <code>true</code>, dragging is enabled for the control.
     *  If the <code>dropEnabled</code> property is also <code>true</code>,
     *  you can drag items and drop them within this control
     *  to reorder the items.
     *
     *  @default false
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function get dragEnabled():Boolean
    {
        return _dragEnabled;
    }
    
    /**
     *  @private
     */
    public function set dragEnabled(value:Boolean):void
    {
        if (value == _dragEnabled)
            return;
        _dragEnabled = value;
        
        if (_dragEnabled)
        {
            addEventListener(DragEvent.DRAG_START, dragStartHandler, false, EventPriority.DEFAULT_HANDLER);
            addEventListener(DragEvent.DRAG_COMPLETE, dragCompleteHandler, false, EventPriority.DEFAULT_HANDLER);
        }
        else
        {
            removeEventListener(DragEvent.DRAG_START, dragStartHandler, false);
            removeEventListener(DragEvent.DRAG_COMPLETE, dragCompleteHandler, false);
        }
    }
    
    //----------------------------------
    //  dragMoveEnabled
    //----------------------------------
    
    /**
     *  @private
     *  Storage for the dragMoveEnabled property.
     */
    private var _dragMoveEnabled:Boolean = false;
    
    [Inspectable(defaultValue="false")]
    
    /**
     *  A flag that indicates whether items can be moved instead
     *  of just copied from the control as part of a drag-and-drop
     *  operation.
     *  If <code>true</code>, and the <code>dragEnabled</code> property
     *  is <code>true</code>, items can be moved.
     *  Often the data provider cannot or should not have items removed
     *  from it, so a MOVE operation should not be allowed during
     *  drag-and-drop.
     *
     *  @default false
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function get dragMoveEnabled():Boolean
    {
        return _dragMoveEnabled;
    }
    
    /**
     *  @private
     */
    public function set dragMoveEnabled(value:Boolean):void
    {
        _dragMoveEnabled = value;
    }

    //----------------------------------
    //  dropEnabled
    //----------------------------------

    /**
     *  @private
     *  Storage for the <code>dropEnabled</code> property.
     */
    private var _dropEnabled:Boolean = false;

    [Inspectable(defaultValue="false")]

    /**
     *  A flag that indicates whether dragged items can be dropped onto the 
     *  control.
     *
     *  <p>If you set this property to <code>true</code>,
     *  the control accepts all data formats, and assumes that
     *  the dragged data matches the format of the data in the data provider.
     *  If you want to explicitly check the data format of the data
     *  being dragged, you must handle one or more of the drag events,
     *  such as <code>dragEnter</code> and <code>dragOver</code>, 
     *  and call the DragEvent's <code>preventDefault()</code> method 
     *  to customize the way the list class accepts dropped data.</p>
     *
     *  <p>When you set <code>dropEnabled</code> to <code>true</code>, 
     *  Flex automatically calls the <code>showDropFeedback()</code> 
     *  and <code>hideDropFeedback()</code> methods to display the drop
     *  indicator.</p>
     *
     *  @default false
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function get dropEnabled():Boolean
    {
        return _dropEnabled;
    }

    /**
     *  @private
     */
    public function set dropEnabled(value:Boolean):void
    {
        if (value == _dropEnabled)
            return;
        _dropEnabled = value;
        
        if (_dropEnabled)
        {
            addEventListener(DragEvent.DRAG_ENTER, dragEnterHandler, false, EventPriority.DEFAULT_HANDLER);
            addEventListener(DragEvent.DRAG_EXIT, dragExitHandler, false, EventPriority.DEFAULT_HANDLER);
            addEventListener(DragEvent.DRAG_OVER, dragOverHandler, false, EventPriority.DEFAULT_HANDLER);
            addEventListener(DragEvent.DRAG_DROP, dragDropHandler, false, EventPriority.DEFAULT_HANDLER);
        }
        else
        {
            removeEventListener(DragEvent.DRAG_ENTER, dragEnterHandler, false);
            removeEventListener(DragEvent.DRAG_EXIT, dragExitHandler, false);
            removeEventListener(DragEvent.DRAG_OVER, dragOverHandler, false);
            removeEventListener(DragEvent.DRAG_DROP, dragDropHandler, false);
        }
    }

    //----------------------------------
    //  selectedIndices
    //----------------------------------
    
    /**
     *  @private
     *  Internal storage for the selectedIndices property.
     */
    private var _selectedIndices:Vector.<int> = new Vector.<int>();
    
    /**
     *  @private
     */
    private var _proposedSelectedIndices:Vector.<int> = new Vector.<int>(); 
    
    /**
     *  @private
     */
    private var multipleSelectionChanged:Boolean; 
    
    [Bindable("change")]
    [Bindable("valueCommit")]
    
    /**
     *  A Vector of ints representing the indices of the currently selected  
     *  item or items. 
     *  If multiple selection is disabled by setting 
     *  <code>allowMultipleSelection</code> to <code>false</code>, and this property  
     *  is set, the data item corresponding to the first index in the Vector is selected.  
     *
     *  <p>If multiple selection is enabled by setting 
     *  <code>allowMultipleSelection</code> to <code>true</code>, this property  
     *  contains a list of the selected indices in the reverse order in which they were selected. 
     *  That means the first element in the Vector corresponds to the last item selected.</p>
     *  
     *  @default []
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function get selectedIndices():Vector.<int>
    {
        return _selectedIndices;
    }
    
    /**
     *  @private
     */
    public function set selectedIndices(value:Vector.<int>):void
    {
        setSelectedIndices(value, false);
    }
    
    /**
     *  @private
     *  Used internally to specify whether the selectedIndices changed programmatically or due to 
     *  user interaction. 
     * 
     *  @param dispatchChangeEvent if true, the component will dispatch a "change" event if the
     *  value has changed. Otherwise, it will dispatch a "valueCommit" event. 
     */
    mx_internal function setSelectedIndices(value:Vector.<int>, dispatchChangeEvent:Boolean = false):void
    {
        // TODO (jszeto) Do a deep compare of the vectors
        if (_proposedSelectedIndices == value || 
            (value && value.length == 1 && 
             selectedIndices && selectedIndices.length == 1 &&    
             value[0] == selectedIndices[0]))
            return; 
        
        if (dispatchChangeEvent)
            dispatchChangeAfterSelection = dispatchChangeEvent;
        
        if (value)
            _proposedSelectedIndices = value;
        else
            _proposedSelectedIndices = new Vector.<int>();
        multipleSelectionChanged = true;  
        invalidateProperties();
    }
    
    //----------------------------------
    //  selectedItems
    //----------------------------------

    [Bindable("change")]
    [Bindable("valueCommit")]
    
    /**
     *  A Vector of Objects representing the currently selected data items. 
     *  If multiple selection is disabled by setting <code>allowMultipleSelection</code>
     *  to <code>false</code>, and this property is set, the data item 
     *  corresponding to the first item in the Vector is selected.  
     *
     *  <p>If multiple selection is enabled by setting 
     *  <code>allowMultipleSelection</code> to <code>true</code>, this property  
     *  contains a list of the selected items in the reverse order in which they were selected. 
     *  That means the first element in the Vector corresponds to the last item selected.</p>
     * 
     *  @default []
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function get selectedItems():Vector.<Object>
    {
        var result:Vector.<Object> = new Vector.<Object>();
        
        if (selectedIndices)
        {
            var count:int = selectedIndices.length;
            
            for (var i:int = 0; i < count; i++)
                result[i] = dataProvider.getItemAt(selectedIndices[i]);  
        }
        
        return result;
    }
    
    /**
     *  @private
     */
    public function set selectedItems(value:Vector.<Object>):void
    {
        var indices:Vector.<int> = new Vector.<int>();
        
        if (value)
        {
            var count:int = value.length;
            
            for (var i:int = 0; i < count; i++)
            {
                var index:int = dataProvider.getItemIndex(value[i]);
                if (index != -1)
                { 
                    indices.splice(0, 0, index);   
                }
                // If an invalid item is in the selectedItems vector,
                // we set selectedItems to an empty vector, which 
                // essentially clears selection. 
                if (index == -1)
                {
                    indices = new Vector.<int>();
                    break;  
                }
            }
        }
        
        _proposedSelectedIndices = indices;
        multipleSelectionChanged = true;
        invalidateProperties(); 
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
        if (List.createAccessibilityImplementation != null)
            List.createAccessibilityImplementation(this);
    }
    
     /**
     *  @private
     */
    override protected function commitProperties():void
    {
        super.commitProperties(); 
        
        if (multipleSelectionChanged)
        {
            // multipleSelectionChanged flag is cleared in commitSelection();
            // this is so, because commitSelection() could be called from
            // super.commitProperties() as well and in that case we don't
            // want to commitSelection() twice, as that will actually wrongly 
            // clear the selection.
            commitSelection();
        }
    }
    
    /**
     *  @private
     */
    override protected function partAdded(partName:String, instance:Object):void
    {
        super.partAdded(partName, instance);

        if (instance == dataGroup)
        {
            dataGroup.addEventListener(
                RendererExistenceEvent.RENDERER_ADD, dataGroup_rendererAddHandler);
            dataGroup.addEventListener(
                RendererExistenceEvent.RENDERER_REMOVE, dataGroup_rendererRemoveHandler);
        }
        else if (instance == scroller)
        {
            scroller.hasFocusableChildren = hasFocusableChildren;
        }
    }

    /**
     *  @private
     */
    override protected function partRemoved(partName:String, instance:Object):void
    {
        if (instance == dataGroup)
        {
            dataGroup.removeEventListener(
                RendererExistenceEvent.RENDERER_ADD, dataGroup_rendererAddHandler);
            dataGroup.removeEventListener(
                RendererExistenceEvent.RENDERER_REMOVE, dataGroup_rendererRemoveHandler);
        }

        super.partRemoved(partName, instance);
    }
    
    /**
     *  @private
     *  Called when an item has been added to this component.
     */
    override protected function itemAdded(index:int):void
    {
        adjustSelection(index, true); 
    }
    
    /**
     *  @private
     *  Called when an item has been removed from this component.
     */
    override protected function itemRemoved(index:int):void
    {
        adjustSelection(index, false);        
    }
    
    /**
     *  @private
     *  Used to filter _proposedSelectedIndices.
     */
    private function isValidIndex(item:int, index:int, v:Vector.<int>):Boolean
    {
        return (dataProvider != null) && (item >= 0) && (item < dataProvider.length); 
    }
    
    /**
     *  @private
     *  Let ListBase handle single selection and afterwards come in and 
     *  handle multiple selection via the commitMultipleSelection() 
     *  helper method. 
     */
    override protected function commitSelection(dispatchChangedEvents:Boolean = true):Boolean
    {
        // Clear the flag so that we don't commit the selection again.
        multipleSelectionChanged = false;

        var oldSelectedIndex:Number = _selectedIndex;
        var oldCaretIndex:Number = _caretIndex;  
        
        _proposedSelectedIndices = _proposedSelectedIndices.filter(isValidIndex);
               
        // Ensure that multiple selection is allowed and that proposed 
        // selected indices honors it. For example, in the single 
        // selection case, proposedSelectedIndices should only be a 
        // vector of 1 entry. If its not, we pare it down and select the 
        // first item.  
        if (!allowMultipleSelection && !isEmpty(_proposedSelectedIndices))
        {
            var temp:Vector.<int> = new Vector.<int>(); 
            temp.push(_proposedSelectedIndices[0]); 
            _proposedSelectedIndices = temp;  
        }
        // Keep _proposedSelectedIndex in-sync with multiple selection properties. 
        if (!isEmpty(_proposedSelectedIndices))
           _proposedSelectedIndex = getFirstItemValue(_proposedSelectedIndices); 
        
        // Let ListBase handle the validating and commiting of the single-selection
        // properties.  
        var retVal:Boolean = super.commitSelection(false); 
        
        // If super.commitSelection returns a value of false, 
        // the selection was cancelled, so return false and exit. 
        if (!retVal)
            return false; 
        
        // Now keep _proposedSelectedIndices in-sync with single selection 
        // properties now that the single selection properties have been 
        // comitted.  
        if (selectedIndex > NO_SELECTION)
        {
            if (_proposedSelectedIndices && _proposedSelectedIndices.indexOf(selectedIndex) == -1)
                _proposedSelectedIndices.push(selectedIndex);
        }
        
        // Validate and commit the multiple selection related properties. 
        commitMultipleSelection(); 
        
        // Set the caretIndex based on the current selection 
        setCurrentCaretIndex(selectedIndex);
        
        // And dispatch change and caretChange events so that all of 
        // the bindings update correctly. 
        if (dispatchChangedEvents && retVal)
        {
            var e:IndexChangeEvent; 
            
            if (dispatchChangeAfterSelection)
            {
                e = new IndexChangeEvent(IndexChangeEvent.CHANGE);
                e.oldIndex = oldSelectedIndex;
                e.newIndex = _selectedIndex;
                dispatchEvent(e);
                dispatchChangeAfterSelection = false;
            }
            else
            {
                dispatchEvent(new FlexEvent(FlexEvent.VALUE_COMMIT));
            }
            
            e = new IndexChangeEvent(IndexChangeEvent.CARET_CHANGE); 
            e.oldIndex = oldCaretIndex; 
            e.newIndex = caretIndex;
            dispatchEvent(e);    
        }
        
        return retVal; 
    }
    
    /**
     *  @private
     *  Given a new selection interval, figure out which
     *  items are newly added/removed from the selection interval and update
     *  selection properties and view accordingly. 
     */
    protected function commitMultipleSelection():void
    {
        var removedItems:Vector.<int> = new Vector.<int>();
        var addedItems:Vector.<int> = new Vector.<int>();
        var i:int;
        var count:int;
        
        if (!isEmpty(_selectedIndices) && !isEmpty(_proposedSelectedIndices))
        {
            // Changing selection, determine which items were added to the 
            // selection interval 
            count = _proposedSelectedIndices.length;
            for (i = 0; i < count; i++)
            {
                if (_selectedIndices.indexOf(_proposedSelectedIndices[i]) < 0)
                    addedItems.push(_proposedSelectedIndices[i]);
            }
            // Then determine which items were removed from the selection 
            // interval 
            count = _selectedIndices.length; 
            for (i = 0; i < count; i++)
            {
                if (_proposedSelectedIndices.indexOf(_selectedIndices[i]) < 0)
                    removedItems.push(_selectedIndices[i]);
            }
        }
        else if (!isEmpty(_selectedIndices))
        {
            // Going to a null selection, remove all
            removedItems = _selectedIndices;
        }
        else if (!isEmpty(_proposedSelectedIndices))
        {
            // Going from a null selection, add all
            addedItems = _proposedSelectedIndices;
        }

        // Commit _selectedIndices before calling itemSelected() because
        // selecting item renderers may cause updates that will check
        // the value of _selectedIndices. Setting it first makes the
        // indices consistent with the new selection values on the items.
        _selectedIndices = _proposedSelectedIndices;
         
        // De-select the old items that were selected 
        if (removedItems.length > 0)
        {
            count = removedItems.length;
            for (i = 0; i < count; i++)
            {
                itemSelected(removedItems[i], false);
            }
        }
        
        // Select the new items in the new selection interval 
        if (!isEmpty(_proposedSelectedIndices))
        {
            count = _proposedSelectedIndices.length;
            for (i = 0; i < count; i++)
            {
                itemSelected(_proposedSelectedIndices[i], true);
            }
        }
        
        // Put _proposedSelectedIndices back to its default value.  
        _proposedSelectedIndices = new Vector.<int>();
    }
    
    /**
     *  @private
     */
    override protected function itemSelected(index:int, selected:Boolean):void
    {
        super.itemSelected(index, selected);
        
        var renderer:Object = dataGroup ? dataGroup.getElementAt(index) : null;
        
        if (renderer is IItemRenderer)
        {
            IItemRenderer(renderer).selected = selected;
        }
    }
    
    /**
     *  @private 
     */
    override protected function itemShowingCaret(index:int, showsCaret:Boolean):void
    {
        super.itemShowingCaret(index, showsCaret); 
        
        var renderer:Object = dataGroup ? dataGroup.getElementAt(index) : null;
        
        if (renderer is IItemRenderer)
        {
            IItemRenderer(renderer).showsCaret = showsCaret;
        }
    }
    
    /**
     *  @private
     */
    override mx_internal function isItemIndexSelected(index:int):Boolean
    {
        if (allowMultipleSelection && (selectedIndices != null))
            return selectedIndices.indexOf(index) != -1;
        
        return index == selectedIndex;
    }
    
    //--------------------------------------------------------------------------
    //
    //  Methods
    //
    //--------------------------------------------------------------------------
    
    /**
     *  @private
     *  Returns the index of the last selected item. In single 
     *  selection, this is just selectedIndex. In multiple 
     *  selection, this is the index of the first selected item.  
     */
    private function getLastSelectedIndex():int
    {
        if (selectedIndices && selectedIndices.length > 0)
            return selectedIndices[selectedIndices.length - 1]; 
        else 
            return 0; 
    }
    
    /**
     *  @private
     *  Given a Vector, returns the value of the first item, 
     *  or -1 if there are no items in the Vector; 
     */
    private function getFirstItemValue(v:Vector.<int>):int
    {
        if (v && v.length > 0)
            return v[0]; 
        else 
            return -1; 
    }
    
    /**
     *  @private
     *  Returns true if v is null or an empty Vector.
     */
    private function isEmpty(v:Vector.<int>):Boolean
    {
        return v == null || v.length == 0;
    }
    
    /**
     *  Helper method to calculate how the current selection changes when an item is clicked.
     *
     *  @param index The index of the item that has been clicked.
     *  @param shiftKey True when the shift key is pressed.
     *  @param ctrlKey True when the control key is pressed.
     *  @return The updated item indices that the new selection will be committed to.
     * 
     *  @see #selectedIndices
     *   
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    protected function calculateSelectedIndices(index:int, shiftKey:Boolean, ctrlKey:Boolean):Vector.<int>
    {
        var i:int; 
        var interval:Vector.<int> = new Vector.<int>();  
        
        if (!shiftKey)
        {
            if (ctrlKey)
            {
                if (!isEmpty(selectedIndices))
                {
                    // Quick check to see if selectedIndices had only one selected item
                    // and that item was de-selected
                    if (selectedIndices.length == 1 && (selectedIndices[0] == index))
                    {
                        // We need to respect requireSelection 
                        if (!requireSelection)
                            return interval; 
                        else 
                        {
                            interval.splice(0, 0, selectedIndices[0]); 
                            return interval; 
                        }
                    }
                    else
                    {
                        // Go through and see if the index passed in was in the 
                        // selection model. If so, leave it out when constructing
                        // the new interval so it is de-selected. 
                        var found:Boolean = false; 
                        for (i = 0; i < _selectedIndices.length; i++)
                        {
                            if (_selectedIndices[i] == index)
                                found = true; 
                            else if (_selectedIndices[i] != index)
                                interval.splice(0, 0, _selectedIndices[i]);
                        }
                        if (!found)
                        {
                            // Nothing from the selection model was de-selected. 
                            // Instead, the Ctrl key was held down and we're doing a  
                            // new add. 
                            interval.splice(0, 0, index);   
                        }
                        return interval; 
                    } 
                }
                // Ctrl+click with no previously selected items 
                else
                { 
                    interval.splice(0, 0, index); 
                    return interval; 
            }
            }
            // A single item was newly selected, add that to the selection interval.  
            else 
            { 
                interval.splice(0, 0, index); 
                return interval; 
        }
        }
        else // shiftKey
        {
            // A contiguous selection action has occurred. Figure out which new 
            // indices to add to the selection interval and return that. 
            var start:int = (!isEmpty(selectedIndices)) ? selectedIndices[selectedIndices.length - 1] : 0; 
            var end:int = index; 
            if (start < end)
            {
                for (i = start; i <= end; i++)
                {
                    interval.splice(0, 0, i); 
                }
            }
            else 
            {
                for (i = start; i >= end; i--)
                {
                    interval.splice(0, 0, i); 
                }
            }
            return interval; 
        }
    }
    
    //--------------------------------------------------------------------------
    //
    //  Drag methods
    //
    //--------------------------------------------------------------------------
    
    /**
     *  @private
     *  The default handler for the <code>dragStart</code> event.
     *
     *  @param event The DragEvent object.
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    protected function dragStartHandler(event:DragEvent):void
    {
        if (event.isDefaultPrevented())
            return;
        
        var dragSource:DragSource = new DragSource();
        addDragData(dragSource);
        DragManager.doDrag(this, 
                           dragSource, 
                           event, 
                           createDragIndicator(), 
                           0 /*xOffset*/, 
                           0 /*yOffset*/, 
                           0.5 /*imageAlpha*/, 
                           dragMoveEnabled);
    }
    
    /**
     *  @private
     *  Used to sort the selected indices during drag and drop operations.
     */
    private function compareValues(a:int, b:int):int
    {
        return a - b;
    } 
    
    /**
     *  @private
     *  Handles <code>DragEvent.DRAG_COMPLETE</code> events.  This method
     *  removes the items from the data provider.
     *
     *  @param event The DragEvent object.
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    protected function dragCompleteHandler(event:DragEvent):void
    {
        if (event.isDefaultPrevented())
            return;
        
        // Remove the dragged items only if they were drag moved to
        // a different list. If the items were drag moved to this
        // list, the reordering was already handles in the 
        // DragEvent.DRAG_DROP listener.
        if (!dragMoveEnabled ||
            event.action != DragManager.MOVE || 
            event.relatedObject == this)
            return;
        
        // Clear the selection, but remember which items were moved
        var movedIndices:Vector.<int> = selectedIndices;
        setSelectedIndices(new Vector.<int>(), true);
        validateProperties(); // To commit the selection
        
        // Remove the moved items
        movedIndices.sort(compareValues);
        var count:int = movedIndices.length;
        for (var i:int = count - 1; i >= 0; i--)
        {
            dataProvider.removeItemAt(movedIndices[i]);
        }
    }
    
    /**
     *  Creates an instance of a class that is used to display the visuals
     *  of the dragged items during a drag and drop operation.
     *  The default <code>DragEvent.DRAG_START</code> handler passes the
     *  instance to the <code>DragManager.doDrag()</code> method. 
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function createDragIndicator():IFlexDisplayObject
    {
        var dragIndicator:IFlexDisplayObject;
        var dragIndicatorClass:Class = Class(getStyle("dragIndicatorClass"));
        if (dragIndicatorClass)
        {
            dragIndicator = new dragIndicatorClass();
            if (dragIndicator is IVisualElement)
                IVisualElement(dragIndicator).owner = this;
        }
        
        return dragIndicator;
    }

    /**
     *  Adds the selected items to the DragSource object as part of
     *  a drag-and-drop operation.
     *  Override this method to add other data to the drag source.
     * 
     *  @param ds The DragSource object to which to add the data.
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function addDragData(dragSource:DragSource):void
    {
        dragSource.addHandler(copySelectedItemsForDragDrop, "itemsByIndex");
        
        // Calculate the index of the focus item within the vector
        // of ordered items returned for the "itemsByIndex" format.
        var caretIndex:int = 0;
        var draggedIndices:Vector.<int> = selectedIndices;
        var count:int = draggedIndices.length;
        for (var i:int = 0; i < count; i++)
        {
            if (mouseDownIndex > draggedIndices[i])
                caretIndex++;
        }
        dragSource.addData(caretIndex, "caretIndex");
    }

    /**
     *  @private
     */
    private function copySelectedItemsForDragDrop():Vector.<Object>
    {
        // Copy the vector so that we don't modify the original
         // since selectedIndices returns a reference.
        var draggedIndices:Vector.<int> = selectedIndices.slice(0, selectedIndices.length);
        var result:Vector.<Object> = new Vector.<Object>(draggedIndices.length);

        // Sort in the order of the data source
        draggedIndices.sort(compareValues);
        
        // Copy the items
        var count:int = draggedIndices.length;
        for (var i:int = 0; i < count; i++)
            result[i] = dataProvider.getItemAt(draggedIndices[i]);  
        return result;
    }
    
    /**
     *  @private
     *  Handles <code>MouseEvent.MOUSE_DOWN</code> events from any of the 
     *  item renderers. This method handles the updating and commitment 
     *  of selection as well as remembers the mouse down point and
     *  attaches <code>MouseEvent.MOUSE_MOVE</code> and
     *  <code>MouseEvent.MOUSE_UP</code> listeners in order to handle
     *  drag gestures.
     *
     *  @param event The MouseEvent object.
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    protected function item_mouseDownHandler(event:MouseEvent):void
    {
        // Handle the fixup of selection
        var newIndex:int
        if (event.currentTarget is IItemRenderer)
            newIndex = IItemRenderer(event.currentTarget).itemIndex;
        else
            newIndex = dataGroup.getElementIndex(event.currentTarget as IVisualElement);

        if (!allowMultipleSelection)
        {
            // Single selection case, set the selectedIndex 
            var currentRenderer:IItemRenderer;
            if (caretIndex >= 0)
            {
                currentRenderer = dataGroup.getElementAt(caretIndex) as IItemRenderer;
                if (currentRenderer)
                    currentRenderer.showsCaret = false;
            }
            
            // Check to see if we're deselecting the currently selected item 
            if (event.ctrlKey && selectedIndex == newIndex)
            {
                pendingSelectionOnMouseUp = true;
                pendingSelectionCtrlKey = true;
                pendingSelectionShiftKey = event.shiftKey;
            }
            else
                setSelectedIndex(newIndex, true);
        }
        else 
        {
            // Don't commit the selection immediately, but wait to see if the user
            // is actually dragging. If they don't drag, then commit the selection
            if (isItemIndexSelected(newIndex))
            {
                pendingSelectionOnMouseUp = true;
                pendingSelectionShiftKey = event.shiftKey;
                pendingSelectionCtrlKey = event.ctrlKey;
            }
            else
            {
                setSelectedIndices(calculateSelectedIndices(newIndex, event.shiftKey, event.ctrlKey), true);
            }
        }
        
        // If selection is pending on mouse up then we have just moused down on
        // an item, part of an already commited selection.
        // However if we moused down on an item that's not currently selected,
        // we must commit the selection before trying to start dragging since
        // listeners may prevent the item from being selected.
        if (!pendingSelectionOnMouseUp)
            validateProperties();

        mouseDownPoint = event.target.localToGlobal(new Point(event.localX, event.localY));
        mouseDownIndex = newIndex;

        var listenForDrag:Boolean = (dragEnabled && selectedIndices && this.selectedIndices.indexOf(newIndex) != -1);
        // Handle any drag gestures that may have been started
        if (listenForDrag)
        {
            // Listen for MOUSE_MOVE on the sandboxRoot.
            // The user may have cliked on the item renderer close
            // to the edge of the list, and we still want to start a drag
            // operation if they move out of the list.
            systemManager.getSandboxRoot().addEventListener(MouseEvent.MOUSE_MOVE, mouseMoveHandler, false, 0, true);
        }

        if (pendingSelectionOnMouseUp || listenForDrag)
        {
            systemManager.getSandboxRoot().addEventListener(SandboxMouseEvent.MOUSE_UP_SOMEWHERE, mouseUpHandler, false, 0, true);
            systemManager.getSandboxRoot().addEventListener(MouseEvent.MOUSE_UP, mouseUpHandler, false, 0, true);
        }
    }

    /**
     *  @private
     *  Handles <code>MouseEvent.MOUSE_MOVE</code> events from any mouse
     *  targets contained in the list including the renderers.  This method
     *  watches for a gesture that constitutes the beginning of a
     *  drag drop and send a <code>DragEvent.DRAG_START</code> event.
     *  It also checks to see if the mouse is over a non-target area of a
     *  renderer so that Flex can try to make it look like that renderer was 
     *  the target.
     *
     *  @param event The MouseEvent object.
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    protected function mouseMoveHandler(event:MouseEvent):void
    {
        if (!mouseDownPoint || !dragEnabled)
            return;
        
        var pt:Point = new Point(event.localX, event.localY);
        pt = DisplayObject(event.target).localToGlobal(pt);
        
        const DRAG_THRESHOLD:int = 5;
        
        if (Math.abs(mouseDownPoint.x - pt.x) > DRAG_THRESHOLD ||
            Math.abs(mouseDownPoint.y - pt.y) > DRAG_THRESHOLD)
        {
            var dragEvent:DragEvent = new DragEvent(DragEvent.DRAG_START);
            dragEvent.dragInitiator = this;
            
            var localMouseDownPoint:Point = this.globalToLocal(mouseDownPoint);
            
            dragEvent.localX = localMouseDownPoint.x;
            dragEvent.localY = localMouseDownPoint.y;
            dragEvent.buttonDown = true;
            
            // We're starting a drag operation, remove the handlers
            // that are monitoring the mouse move, we don't need them anymore:
            dispatchEvent(dragEvent);

            // Finally, remove the mouse handlers
            removeMouseHandlersForDragStart();
        }
    }
    
    private function removeMouseHandlersForDragStart():void
    {
        // If dragging failed, but we had a pending selection, commit it here
        if (pendingSelectionOnMouseUp && !DragManager.isDragging)
        {
            if (allowMultipleSelection)
            {
                setSelectedIndices(calculateSelectedIndices(mouseDownIndex, pendingSelectionShiftKey, pendingSelectionCtrlKey), true);
            }
            else
            {
                // Must be deselecting the current selected item.
                setSelectedIndex(NO_SELECTION, true);
            }
        }

        // Always clean up the flag, even if currently dragging.
        pendingSelectionOnMouseUp = false;
        
        mouseDownPoint = null;
        mouseDownIndex = -1;
        
        systemManager.getSandboxRoot().removeEventListener(MouseEvent.MOUSE_MOVE, mouseMoveHandler, false);
        systemManager.getSandboxRoot().removeEventListener(MouseEvent.MOUSE_UP, mouseUpHandler, false);
        systemManager.getSandboxRoot().removeEventListener(SandboxMouseEvent.MOUSE_UP_SOMEWHERE, mouseUpHandler, false);
    }
    
    /**
     *  @private
     *  Handles <code>MouseEvent.MOUSE_DOWN</code> events from any mouse
     *  targets contained in the list including the renderers. This method
     *  finds the renderer that was pressed and prepares to receive
     *  a <code>MouseEvent.MOUSE_UP</code> event.
     *
     *  @param event The MouseEvent object.
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    protected function mouseUpHandler(event:Event):void
    {
        removeMouseHandlersForDragStart();
    }
    
    //--------------------------------------------------------------------------
    //
    //  Drop methods
    //
    //--------------------------------------------------------------------------
    
    private function calculateDropLocation(event:DragEvent):DropLocation
    {
        // Verify data format
        if (!enabled || !event.dragSource.hasFormat("itemsByIndex"))
            return null;
        
        // Calculate the drop location
        return layout.calculateDropLocation(event);
    }

    /**
     *  Creates and instance of the dropIndicator class that is used to
     *  display the visuals of the drop location during a drag and drop
     *  operation. The instance is set in the layout's 
     *  <code>dropIndicator</code> property.
     *
     *  <p>If you override the <code>dragEnter</code> event handler, 
     *  and call <code>preventDefault()</code> so that the default handler does not execute, 
     *  call <code>createDropIndicator()</code> to create the drop indicator.</p>
     * 
     *  @return Returns the dropIndicator that was set in the layout.
     *
     *  @see #destroyDropIndicator
     *
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function createDropIndicator():DisplayObject
    {
        // Do we have a drop indicator already?
        if (layout.dropIndicator)
            return layout.dropIndicator;
        
        var dropIndicatorInstance:DisplayObject;
        if (dropIndicator)
        {
            dropIndicatorInstance = DisplayObject(createDynamicPartInstance("dropIndicator"));
        }
        else
        {
            var dropIndicatorClass:Class = Class(getStyle("dropIndicatorSkin"));
            if (dropIndicatorClass)
                dropIndicatorInstance = new dropIndicatorClass();
        }
        if (dropIndicatorInstance is IVisualElement)
            IVisualElement(dropIndicatorInstance).owner = this;

        // Set it in the layout
        layout.dropIndicator = dropIndicatorInstance;
        return dropIndicatorInstance;
    }
    
    /**
     *  Releases the <code>dropIndicator</code> instance that is currently set in the layout.
     *
     *  <p>If you override the <code>dragExit</code> event handler, 
     *  and call <code>preventDefault()</code> so that the default handler does not execute, 
     *  call <code>destroyDropIndicator()</code> to delete the drop indicator.</p>
     *
     *  @return Returns the dropIndicator that was removed. 
     * 
     *  @see #createDropIndicator
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function destroyDropIndicator():DisplayObject
    {
        var dropIndicatorInstance:DisplayObject = layout.dropIndicator;
        if (!dropIndicatorInstance)
            return null;
        
        // Release the reference from the layout
        layout.dropIndicator = null;
        
        // Release it if it's a dynamic skin part
        var count:int = numDynamicParts("dropIndicator");
        for (var i:int = 0; i < count; i++)
        {
            if (dropIndicatorInstance == getDynamicPartAt("dropIndicator", i))
            {
                // This was a dynamic part, remove it now:
                removeDynamicPartInstance("dropIndicator", dropIndicatorInstance);
                break;
            }
        }
        return dropIndicatorInstance;
    }
    
    /**
     *  @private
     *  Handles <code>DragEvent.DRAG_ENTER</code> events.  This method
     *  determines if the DragSource object contains valid elements and uses
     *  the <code>DragManager.showDropFeedback()</code> method to set up the 
     *  UI feedback as well as the layout's <code>showDropIndicator()</code>
     *  method to display the drop indicator and initiate drag scrolling.
     *
     *  @param event The DragEvent object.
     * 
     *  @see spark.layouts.LayoutBase#showDropIndicator
     *  @see spark.layouts.LayoutBase#hideDropIndicator
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    protected function dragEnterHandler(event:DragEvent):void
    {
        if (event.isDefaultPrevented())
            return;
        
        var dropLocation:DropLocation = calculateDropLocation(event); 
        if (dropLocation)
        {
            DragManager.acceptDragDrop(this);
            
            // Create the dropIndicator instance. The layout will take care of
            // parenting, sizing, positioning and validating the dropIndicator.
            createDropIndicator();
            
            // Show focus
            drawFocusAnyway = true;
            drawFocus(true);
            
            // Notify manager we can drop
            DragManager.showFeedback(event.ctrlKey ? DragManager.COPY : DragManager.MOVE);

            // Show drop indicator
            layout.showDropIndicator(dropLocation);
        }
        else
        {
            DragManager.showFeedback(DragManager.NONE);
        }
    }
    
    /**
     *  @private
     *  Handles <code>DragEvent.DRAG_OVER</code> events. This method
     *  determines if the DragSource object contains valid elements and uses
     *  the <code>showDropFeedback()</code> method to set up the UI feedback 
     *  as well as the layout's <code>showDropIndicator()</code> method
     *  to display the drop indicator and initiate drag scrolling.
     *
     *  @param event The DragEvent object.
     *  
     *  @see spark.layouts.LayoutBase#showDropIndicator
     *  @see spark.layouts.LayoutBase#hideDropIndicator
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    protected function dragOverHandler(event:DragEvent):void
    {
        if (event.isDefaultPrevented())
            return;
        
        var dropLocation:DropLocation = calculateDropLocation(event);
        if (dropLocation)
        {
            // Show focus
            drawFocusAnyway = true;
            drawFocus(true);
            
            // Notify manager we can drop
            DragManager.showFeedback(event.ctrlKey ? DragManager.COPY : DragManager.MOVE);

            // Show drop indicator
            layout.showDropIndicator(dropLocation);
        }
        else
        {
            // Hide if previously showing
            layout.hideDropIndicator();

            // Hide focus
            drawFocus(false);
            drawFocusAnyway = false;
            
            // Notify manager we can't drop
            DragManager.showFeedback(DragManager.NONE);
        }
    }
    
    /**
     *  @private
     *  Handles <code>DragEvent.DRAG_EXIT</code> events. This method hides
     *  the UI feedback by calling the <code>hideDropFeedback()</code> method
     *  and also hides the drop indicator by calling the layout's 
     *  <code>hideDropIndicator()</code> method.
     *
     *  @param event The DragEvent object.
     *  
     *  @see spark.layouts.LayoutBase#showDropIndicator
     *  @see spark.layouts.LayoutBase#hideDropIndicator
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    protected function dragExitHandler(event:DragEvent):void
    {
        if (event.isDefaultPrevented())
            return;
        
        // Hide if previously showing
        layout.hideDropIndicator();
        
        // Hide focus
        drawFocus(false);
        drawFocusAnyway = false;
        
        // Destroy the dropIndicator instance
        destroyDropIndicator();
    }
    
    /**
     *  @private
     *  Handles <code>DragEvent.DRAG_DROP events</code>. This method  hides
     *  the drop feedback by calling the <code>hideDropFeedback()</code> method.
     *
     *  <p>If the action is a <code>COPY</code>, 
     *  then this method makes a deep copy of the object 
     *  by calling the <code>ObjectUtil.copy()</code> method, 
     *  and replaces the copy's <code>uid</code> property (if present) 
     *  with a new value by calling the <code>UIDUtil.createUID()</code> method.</p>
     * 
     *  @param event The DragEvent object.
     *
     *  @see mx.utils.ObjectUtil
     *  @see mx.utils.UIDUtil
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    protected function dragDropHandler(event:DragEvent):void
    {
        if (event.isDefaultPrevented())
            return;
        
        // Hide the drop indicator
        layout.hideDropIndicator();
        destroyDropIndicator();
        
        // Hide focus
        drawFocus(false);
        drawFocusAnyway = false;
        
        // Get the dropLocation
        var dropLocation:DropLocation = calculateDropLocation(event);
        if (!dropLocation)
            return;
        
        // Find the dropIndex
        var dropIndex:int = dropLocation.dropIndex;
        
        // Make sure the manager has the appropriate action
        DragManager.showFeedback(event.ctrlKey ? DragManager.COPY : DragManager.MOVE);
        
        var dragSource:DragSource = event.dragSource;
        var items:Vector.<Object> = dragSource.dataForFormat("itemsByIndex") as Vector.<Object>;

        var caretIndex:int = -1;
        if (dragSource.hasFormat("caretIndex"))
            caretIndex = event.dragSource.dataForFormat("caretIndex") as int;
        
        // Clear the selection first to avoid extra work while adding and removing items.
        // We will set a new selection further below in the method.
        var indices:Vector.<int> = selectedIndices; 
        setSelectedIndices(new Vector.<int>(), false);
        validateProperties(); // To commit the selection
        
        // If we are reordering the list, remove the items now,
        // adjusting the dropIndex in the mean time.
        // If the items are drag moved to this list from a different list,
        // the drag initiator will remove the items when it receives the
        // DragEvent.DRAG_COMPLETE event.
        if (dragMoveEnabled &&
            event.action == DragManager.MOVE &&
            event.dragInitiator == this)
        {
            // Remove the previously selected items
            indices.sort(compareValues);
            for (var i:int = indices.length - 1; i >= 0; i--)
            {
                if (indices[i] < dropIndex)
                    dropIndex--;
                dataProvider.removeItemAt(indices[i]);
            }
        }
        
        // Drop the items at the dropIndex
        var newSelection:Vector.<int> = new Vector.<int>();

        // Update the selection with the index of the caret item
        if (caretIndex != -1)
            newSelection.push(dropIndex + caretIndex);

        var copyItems:Boolean = (event.action == DragManager.COPY);
        for (i = 0; i < items.length; i++)
        {
            // Get the item, clone if needed
            var item:Object = items[i];
            if (copyItems)
                item = copyItemWithUID(item);

            // Copy the data
            dataProvider.addItemAt(item, dropIndex + i);

            // Update the selection
            if (i != caretIndex)
                newSelection.push(dropIndex + i);
        }

        // Set the selection
        setSelectedIndices(newSelection, false);

        // Scroll the caret index in view
        if (caretIndex != -1)
        {
            // Sometimes we may need to scroll several times as for virtual layouts
            // this is not guaranteed to bring in the element in view the first try
            // as some items in between may not be loaded yet and their size is only
            // estimated.
            var delta:Point;
            var loopCount:int = 0;
            while (loopCount++ < 10)
            {
                validateNow();
                delta = layout.getScrollPositionDeltaToElement(dropIndex + caretIndex);
                if (!delta || (delta.x == 0 && delta.y == 0))
                    break;
                layout.horizontalScrollPosition += delta.x;
                layout.verticalScrollPosition += delta.y;
            }
        }
    }

    /**
     *  Makes a deep copy of the object by calling the 
     *  <code>ObjectUtil.copy()</code> method, and replaces 
     *  the copy's <code>uid</code> property (if present) with a 
     *  new value by calling the <code>UIDUtil.createUID()</code> method.
     * 
     *  <p>This method is used for a drag and drop copy.</p>
     * 
     *  @param item The item to copy.
     *  
     *  @return The copy of the object.
     *
     *  @see mx.utils.ObjectUtil
     *  @see mx.utils.UIDUtil
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    protected function copyItemWithUID(item:Object):Object
    {
        var copyObj:Object = ObjectUtil.copy(item);
        
        if (copyObj is IUID)
        {
            IUID(copyObj).uid = UIDUtil.createUID();
        }
        else if (copyObj is Object && "mx_internal_uid" in copyObj)
        {
            copyObj.mx_internal_uid = UIDUtil.createUID();
        }
        
        return copyObj;
    }

    //--------------------------------------------------------------------------
    //
    //  Event Handlers
    //
    //--------------------------------------------------------------------------
    
    /**
     *  @private
     *  Called when an item has been added to this component.
     */
    private function dataGroup_rendererAddHandler(event:RendererExistenceEvent):void
    {
        var index:int = event.index;
        var renderer:IVisualElement = event.renderer;
        
        if (!renderer)
            return;
        
        renderer.addEventListener(MouseEvent.MOUSE_DOWN, item_mouseDownHandler);
    }
    
    /**
     *  @private
     *  Called when an item has been removed from this component.
     */
    private function dataGroup_rendererRemoveHandler(event:RendererExistenceEvent):void
    {
        var index:int = event.index;
        var renderer:Object = event.renderer;
        
        if (!renderer)
            return;
        
        renderer.removeEventListener(MouseEvent.MOUSE_DOWN, item_mouseDownHandler);
    }
    
    /**
     *  A convenience method that handles scrolling a data item
     *  into view. 
     * 
     *  If the data item at the specified index is not completely 
     *  visible, the List scrolls until it is brought into 
     *  view. If the data item is already in view, no additional
     *  scrolling occurs. 
     * 
     *  @param index The index of the data item.
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function ensureIndexIsVisible(index:int):void
    {
        if (!layout)
            return;

        var spDelta:Point = dataGroup.layout.getScrollPositionDeltaToElement(index);
         
        if (spDelta)
        {
            dataGroup.horizontalScrollPosition += spDelta.x;
            dataGroup.verticalScrollPosition += spDelta.y;
        }
    }
    
    /**
     *  Adjusts the selected indices to account for items being added to or 
     *  removed from this component. 
     *   
     *  @param index The new index.
     *   
     *  @param add <code>true</code> if an item was added to the component, 
     *  and <code>false</code> if an item was removed.
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    override protected function adjustSelection(index:int, add:Boolean=false):void
    {
        var i:int; 
        var curr:Number; 
        var newInterval:Vector.<int> = new Vector.<int>(); 
        var e:IndexChangeEvent; 
        
        if (selectedIndex == NO_SELECTION || doingWholesaleChanges)
        {
            // The case where one item has been newly added and it needs to be 
            // selected and careted because requireSelection is true. 
            if (dataProvider && dataProvider.length == 1 && requireSelection)
            {
                newInterval.push(0);
                _selectedIndices = newInterval;   
                _selectedIndex = 0; 
                itemShowingCaret(0, true); 
                // If the selection properties have been adjusted to account for items that
                // have been added or removed, send out a "valueCommit" event and 
                // "caretChange" event so any bindings to them are updated correctly.
                 
                dispatchEvent(new FlexEvent(FlexEvent.VALUE_COMMIT));
                
                e = new IndexChangeEvent(IndexChangeEvent.CARET_CHANGE); 
                e.oldIndex = -1; 
                e.newIndex = _caretIndex;
                dispatchEvent(e); 
            }
            return; 
        }
        
        // Ensure multiple and single selection are in-sync before adjusting  
        // selection. Sometimes if selection has been changed before adding/removing
        // an item, we may not have handled selection via invalidation, so in those 
        // cases, force a call to commitSelection() to validate and commit the selection. 
        if ((!selectedIndices && selectedIndex > NO_SELECTION) ||
            (selectedIndex > NO_SELECTION && selectedIndices.indexOf(selectedIndex) == -1))
        {
            commitSelection(); 
        }
        
        // Handle the add or remove and adjust selection accordingly. 
        if (add)
        {
            for (i = 0; i < selectedIndices.length; i++)
            {
                curr = selectedIndices[i];
                 
                // Adding an item above one of the selected items,
                // bump the selected item up. 
                if (curr >= index)
                    newInterval.push(curr + 1); 
                else 
                    newInterval.push(curr); 
            }
        }
        else
        {
            // Quick check to see if we're removing the only selected item
            // in which case we need to honor requireSelection. 
            if (!isEmpty(selectedIndices) && selectedIndices.length == 1 
                && index == selectedIndex && requireSelection)
            {
                //Removing the last item 
                if (dataProvider.length == 0)
                {
                    newInterval = new Vector.<int>(); 
                }
                else if (index == 0)
                {
                    // We can't just set selectedIndex to 0 directly
                    // since the previous value was 0 and the new value is
                    // 0, so the setter will return early.
                    _proposedSelectedIndex = 0; 
                    invalidateProperties();
                    return;
                }    
                else
                {
                    newInterval.push(0);  
                }
            }
            else
            {    
                for (i = 0; i < selectedIndices.length; i++)
                {
                    curr = selectedIndices[i]; 
                    // Removing an item above one of the selected items,
                    // bump the selected item down. 
                    if (curr > index)
                        newInterval.push(curr - 1); 
                    else if (curr < index) 
                        newInterval.push(curr);
                }
            }
        }
        
        if (caretIndex == selectedIndex)
        {
            // caretIndex is not changing, so we just need to dispatch
            // an "caretChange" event to update any bindings and update the 
            // caretIndex backing variable. 
            var oldIndex:Number = caretIndex; 
            _caretIndex = getFirstItemValue(newInterval);
            e = new IndexChangeEvent(IndexChangeEvent.CARET_CHANGE); 
            e.oldIndex = oldIndex; 
            e.newIndex = caretIndex; 
            dispatchEvent(e); 
        }
        else 
        {
            // De-caret the previous caretIndex renderer and set the 
            // caretIndexAdjusted flag to true. This will mean in 
            // commitProperties, the caretIndex will be adjusted to 
            // match the selectedIndex; 
            
            // TODO (dsubrama): We should revisit the synchronous nature of the 
            // de-careting/re-careting behavior.
            itemShowingCaret(caretIndex, false); 
            caretIndexAdjusted = true; 
            invalidateProperties(); 
        }
        
        var oldIndices:Vector.<int> = selectedIndices;  
        _selectedIndices = newInterval;
        _selectedIndex = getFirstItemValue(newInterval);
        // If the selection has actually changed, trigger a pass to 
        // commitProperties where a change event will be 
        // fired to update any bindings to selection properties. 
        if (_selectedIndices != oldIndices)
        {
            selectedIndexAdjusted = true; 
            invalidateProperties(); 
        }
    }
    
    /**
     *  Tries to find the next item in the data provider that
     *  starts with the character in the <code>eventCode</code> parameter.
     *  You can override this method to perform custom typeahead lookups. 
     *  The search starts at the <code>selectedIndex</code> location.
     *  If it reaches the end of the data provider, it starts over from the beginning.
     *
     *  @param eventCode The key that was pressed on the keyboard.
     *  @return <code>true</code> if a match was found.
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    mx_internal function findKey(eventCode:int):Boolean
    {
        var tmpCode:int = eventCode;
        
        return tmpCode >= 33 &&
               tmpCode <= 126 &&
               findString(String.fromCharCode(tmpCode));
    }
    
    /**
     *  Finds an item in the list based on a String,
     *  and moves the selection to it. The search
     *  starts at the <code>selectedIndex</code> location.
     *  If it reaches the end of the data provider, it starts over from the beginning.
     *
     *  @param str The String to match.
     * 
     *  @return <code>true</code> if a match is found.
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    mx_internal function findString(str:String):Boolean
    {
        if (!dataProvider || dataProvider.length == 0)
            return false;

        var startIndex:int;
        var stopIndex:int;
        var retVal:Number;  

        if (selectedIndex == NO_SELECTION || selectedIndex == CUSTOM_SELECTED_ITEM)
        {
            startIndex = 0;
            stopIndex = dataProvider.length; 
            retVal = findStringLoop(str, startIndex, stopIndex);
        }
        else
        {
            startIndex = selectedIndex + 1; 
            stopIndex = dataProvider.length; 
            retVal = findStringLoop(str, startIndex, stopIndex); 
            // We didn't find the item, loop back to the top 
            if (retVal == -1)
            {
                retVal = findStringLoop(str, 0, selectedIndex); 
            }
        }
        if (retVal != -1)
        {
            setSelectedIndex(retVal, true);
            ensureIndexIsVisible(retVal); 
            return true; 
        }
        else 
            return false; 
    }
    
    /**
     *  @private
     */
    mx_internal function findStringLoop(str:String, startIndex:int, stopIndex:int):Number
    {
        // Try to find the item based on the start and stop indices. 
        for (startIndex; startIndex != stopIndex; startIndex++)
        {
            var itmStr:String = itemToLabel(dataProvider.getItemAt(startIndex));

            itmStr = itmStr.substring(0, str.length);
            if (str == itmStr || str.toUpperCase() == itmStr.toUpperCase())
            {
               return startIndex;
            }
        }
        return -1;
    }
    
    /**
     *  @private
     *  Build in basic keyboard navigation support in List. 
     */
    override protected function keyDownHandler(event:KeyboardEvent):void
    {   
        super.keyDownHandler(event);
        
        if (!dataProvider || !layout || event.isDefaultPrevented())
            return;
            
        // In lue of a formal item editor architecture (pending), we will
        // defer all keyboard events to the target if the target happens to 
        // be an editable input control.
        if (isEditableTarget(event.target))
            return;
        
        // 1. Was the space bar hit? 
        // Hitting the space bar means the current caret item, 
        // that is the item currently in focus, is being 
        // selected. 
        if (event.keyCode == Keyboard.SPACE)
        {
            setSelectedIndex(caretIndex, true); 
            event.preventDefault();
            return; 
        }

        // 2. Or was an alphanumeric key hit? 
        // Hitting an alphanumeric key causes List's
        // findKey method to run to find a matching 
        // item in the dataProvider whose first char 
        // matches the keystroke. 
        if (findKey(event.charCode))
        {
            event.preventDefault();
            return;
        }
            
        // 3. Was a navigation key hit (like an arrow key,
        // or Shift+arrow key)?  
        // Delegate to the layout to interpret the navigation
        // key and adjust the selection and caret item based
        // on the combination of keystrokes encountered.      
        adjustSelectionAndCaretUponNavigation(event); 
    }
    
    /**
     *  Adjusts the selection based on what keystroke or 
     *  keystroke combinations were encountered. The keystroke
     *  is sent down to the layout and it is up to the layout's
     *  getNavigationDestinationIndex() method to determine 
     *  what the index to navigate to based on the item that 
     *  is currently in focus. Once the index is determined, 
     *  single selection, caret item and if necessary, multiple 
     *  selections are updated to reflect the newly selected
     *  item.  
     *
     *  @param event The Keyboard Event encountered
     * 
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    protected function adjustSelectionAndCaretUponNavigation(event:KeyboardEvent):void
    {
        // If rtl layout, need to swap Keyboard.LEFT and Keyboard.RIGHT.
        var navigationUnit:uint = mapKeycodeForLayoutDirection(event);
        
        // Some unrecognized key stroke was entered, return. 
        if (!NavigationUnit.isNavigationUnit(event.keyCode))
            return; 
           
        // Delegate to the layout to tell us what the next item is we should select or focus into.
        // TODO (dsubrama): At some point we should refactor this so we don't depend on layout
        // for keyboard handling. If layout doesn't exist, then use some other keyboard handler
        var proposedNewIndex:int = layout.getNavigationDestinationIndex(caretIndex, navigationUnit, arrowKeysWrapFocus); 
        
        // Note that the KeyboardEvent is canceled even if the current selected or in focus index
        // doesn't change because we don't want another component to start handling these
        // events when the index reaches a limit.
        if (proposedNewIndex == -1)
            return;
            
        event.preventDefault(); 
        
        // Contiguous multi-selection action. Create the new selection
        // interval.   
        if (allowMultipleSelection && event.shiftKey && selectedIndices)
        {
            var startIndex:Number = getLastSelectedIndex(); 
            var newInterval:Vector.<int> = new Vector.<int>();  
            var i:int; 
            if (startIndex <= proposedNewIndex)
            {
                for (i = startIndex; i <= proposedNewIndex; i++)
                {
                    newInterval.splice(0, 0, i); 
                }
            }
            else 
            {
                for (i = startIndex; i >= proposedNewIndex; i--)
                {
                    newInterval.splice(0, 0, i); 
                }
            }
            setSelectedIndices(newInterval, true);  
            ensureIndexIsVisible(proposedNewIndex); 
        }
        // Entering the caret state with the Ctrl key down 
        else if (event.ctrlKey)
        {
            var oldCaretIndex:Number = caretIndex; 
            setCurrentCaretIndex(proposedNewIndex);
            var e:IndexChangeEvent = new IndexChangeEvent(IndexChangeEvent.CARET_CHANGE); 
            e.oldIndex = oldCaretIndex; 
            e.newIndex = caretIndex; 
            dispatchEvent(e);    
            ensureIndexIsVisible(proposedNewIndex); 
        }
        // Its just a new selection action, select the new index.
        else
        {
            setSelectedIndex(proposedNewIndex, true);
            ensureIndexIsVisible(proposedNewIndex);
        }
    }
    
    /**
     *  @private
     *  Helper used to determine if the target of a KeyboardEvent happens to 
     *  be an editable text instance.
     */
    protected function isEditableTarget(target:Object):Boolean
    {
        var focusObj:Object = getFocus();
        return ((focusObj is TextField && focusObj.type=="input") ||
            (richEditableTextClass && focusObj is richEditableTextClass &&
             focusObj.editable == true))
    }
}

}
