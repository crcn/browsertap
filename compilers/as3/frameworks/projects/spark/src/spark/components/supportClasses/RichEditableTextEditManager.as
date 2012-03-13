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

package spark.components.supportClasses
{
import flash.events.TextEvent;

import flashx.textLayout.edit.EditManager;
import flashx.textLayout.tlf_internal;
import flashx.undo.IUndoManager;

import mx.core.mx_internal;

import spark.components.RichEditableText;

use namespace mx_internal;
use namespace tlf_internal;

[ExcludeClass]

/**
 *  @private
 *  A subclass of EditManager that turns off screen updates when there is an
 *  edit.  This allows us to control screen update by calling the
 *  TextContainerManager's updateContainers() directly.
 *  
 *  @langversion 3.0
 *  @playerversion Flash 10
 *  @playerversion AIR 1.5
 *  @productversion Flex 4
 */
public class RichEditableTextEditManager extends EditManager
{
    /**
     *  Constructor. 
     *  
     *  @langversion 3.0
     *  @playerversion Flash 10
     *  @playerversion AIR 1.5
     *  @productversion Flex 4
     */
    public function RichEditableTextEditManager(
                                component:RichEditableText,
                                undoManager:IUndoManager = null)
    {
        super(undoManager);
        
        textDisplay = component;        
    }

    //--------------------------------------------------------------------------
    //
    //  Variables
    //
    //--------------------------------------------------------------------------

    /**
     *  @private
     */
    private var textDisplay:RichEditableText;
    
    //--------------------------------------------------------------------------
    //
    //  Overridden methods
    //
    //--------------------------------------------------------------------------
    
    /** 
     * @private  
     */
    override public function textInputHandler(event:TextEvent):void
    {
        super.textInputHandler(event);

        // Normally keystrokes are saved until the next enter frame event before
        // they are inserted into the text flow.  If this flag is false, the 
        // character just typed will be inserted into the text flow immediately.
        if (!textDisplay.batchTextInput)
            flushPendingOperations();        
    }    
}

}
