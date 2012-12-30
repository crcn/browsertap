package
{
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.AsyncErrorEvent;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.events.NetStatusEvent;
	import flash.events.StatusEvent;
	import flash.events.SecurityErrorEvent;
	import flash.external.ExternalInterface;
	import flash.media.Video;
	import flash.net.NetConnection;
	import flash.net.NetStream;
	import flash.net.ObjectEncoding;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.ui.Keyboard;
	import flash.utils.*;
	import flash.system.System;
	import flash.desktop.*;

	
		[SWF(frameRate=30,backgroundColor='#FFFFFF')]
	
	public class DesktopPlayer extends Sprite
	{
		
		private var _connection: NetConnection;
		private var _stream: NetStream;
		private var _video: Video;
		private var _server: String;
		private var _debugInfo:TextField;
		private var _debug:Boolean;
		private var _channel:String;
		private var _checkCount:int;
		private var _end:Boolean = true;
		private var _clipboard:String;
		private var _setClipboard:String;
		private var _copyPaste:TextField;
		private var _mask:Sprite;
		private var _padding:Object;
		
		
		
		
		public function DesktopPlayer()
		{

			
			this._server =  this.root.loaderInfo.parameters.host || "rtmp://192.168.2.3:1935/live";
			this._channel = this.root.loaderInfo.parameters.channel || "default";
			this._debug =   Boolean(this.root.loaderInfo.parameters.debug);
			//this._setClipboard = String(this.root.loaderInfo.parameters.clipboard);
			
			this._copyPaste = new TextField();
			this._copyPaste.width = 0;
			this._copyPaste.height = 0;
			this._copyPaste.type = TextFieldType.INPUT;
			this._copyPaste.x = 500;
			this._mask = new Sprite();
			this._padding = { top: 0, right: 0, left: 0, bottom: 0};
			this.addChild(this._mask);
			this.addChild(this._copyPaste);
			
			this._debugInfo = new TextField();
			this._debugInfo.text = "connecting to " + this._server;
			this._debugInfo.autoSize = 'left';
			this._debugInfo.width = 700;
			this._debugInfo.height = 700;
			this._debugInfo.background = true;
			this._debugInfo.backgroundColor = 0xFFFFFF;
			this._debugInfo.alpha = 0.5;
			if(this._debug) this.addChild(this._debugInfo);
			this.addChild(this._copyPaste);
			
			
			this.stage.align = StageAlign.TOP_LEFT;
			this.stage.scaleMode = StageScaleMode.NO_SCALE;
			this._copyPaste.addEventListener(Event.PASTE, onPaste);
			
			this.openStream();
			
			
			this.stage.showDefaultContextMenu = false;
			
			this.stage.addEventListener(Event.RESIZE, onStageResize);
			
			var mouseEvents:Array = [MouseEvent.CLICK, 
				MouseEvent.DOUBLE_CLICK, 
				MouseEvent.MOUSE_DOWN, 
				MouseEvent.MOUSE_MOVE,
				MouseEvent.MOUSE_OUT,
				MouseEvent.MOUSE_OVER,
				MouseEvent.MOUSE_UP,
				MouseEvent.MOUSE_WHEEL];

			_trace("ev listen")
			
			var keyboardEvents:Array = [KeyboardEvent.KEY_DOWN, KeyboardEvent.KEY_UP];
			
			for each(var mouseEvent:String in mouseEvents)
			{
				this.stage.addEventListener(mouseEvent, onMouseEvent);
			}

			
			for each(var keyboardEvent:String in keyboardEvents)
			{
				this.stage.addEventListener(keyboardEvent, onKeyboardEvent);
			}

			setInterval(this._checkFramerate, 500);

			ExternalInterface.addCallback("setClipboard", setClipboard);
			ExternalInterface.addCallback("setPadding", setPadding);
			//ExternalInterface.addCallback("setSize", setSize);
			ExternalInterface.addCallback("getClipboard", getClipboard);
			this.stage.focus = this._copyPaste;
		}
		
		private function onMouseEvent(event:MouseEvent):void
		{

			if(event.type == MouseEvent.MOUSE_DOWN && this._setClipboard) 
			{
				_trace("set clipboard data to " + this._setClipboard);
				try 
				{
					Clipboard.generalClipboard.clear();
					//Clipboard.generalClipboard.setData(ClipboardFormats.TEXT_FORMAT, this._clipboard = this._setClipboard);
					System.setClipboard(this._clipboard = this._setClipboard);
				} catch(e:Error) {
					_trace(e.message);
				}
				this._setClipboard = null;
			}
			
			ExternalInterface.call('desktopEvents.' + event.type, { x: event.stageX, y: event.stageY, delta: event.delta, ctrlKey: event.ctrlKey, shiftKey: event.shiftKey });
		}
		
		private function onKeyboardEvent(event:KeyboardEvent):void
		{   
			clearCopyPaste();

			if(this._setClipboard) 
			{
				this._copyPaste.text = this._clipboard = this._setClipboard;
				this._copyPaste.setSelection(0, this._setClipboard.length)
			} 


			this.stage.focus = this._copyPaste;
			setTimeout(onKeyEventDelayed, 1, event);
		}

		private function onKeyEventDelayed(event:KeyboardEvent): void 
		{
			if(event.ctrlKey) 
			{
				var newClipboardText:String = this._copyPaste.text;
				if(event.charCode == "v".charCodeAt(0) && newClipboardText != this._clipboard) 
				{
					_trace("set external clipboard to " + newClipboardText);
					this._clipboard = newClipboardText;
					ExternalInterface.call("desktopEvents.setClipboard", this._clipboard);
				} else
				if(event.charCode == "c".charCodeAt(0) && this._setClipboard) 
				{
					_trace("set clipboard to " + this._setClipboard);
					this._setClipboard = null;
				}	
			}

			ExternalInterface.call('desktopEvents.' + event.type, { keyCode: event.keyCode, altKey: event.altKey, shiftKey: event.shiftKey, ctrlKey: event.ctrlKey });
		}


		private function clearCopyPaste():void 
		{
			this._copyPaste.text = "";
		}

		private function onPaste(e:Event):void 
		{
			_trace("PASTE")
		}

		
		
		private function openVideo():void
		{
			_trace("selecting stream " + this._channel);

			if(this._video) {
				this.removeChild(this._video);
			}
			
			var video:Video = this._video = new Video(this.stage.stageWidth, this.stage.stageHeight);
			video.attachNetStream(this._stream);
			video.mask = this._mask;
			
			video.deblocking = 2;
			video.smoothing = true;
			
			this._stream.play(this._channel);
			this.addChildAt(this._video, 0);
			
			this.onStageResize();
		}
		

		private function _trace(arg:String): void
		{

			this._debugInfo.text = (arg + "\n" + this._debugInfo.text).substr(0, 1000);//arg;//(arg + "\n" + this._debugInfo.text).substr(0, 100);

			trace(arg);
		}
			
		
		private function openStream():void
		{

			//_trace("Connecting to " + this._server);


			
			this._connection = new NetConnection();
			this._connection.addEventListener(NetStatusEvent.NET_STATUS, onNetStatus, false, 0, true);
			this._connection.addEventListener(IOErrorEvent.IO_ERROR, onError, false, 0, true);
			this._connection.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onError, false, 0, true);
			this._connection.addEventListener(AsyncErrorEvent.ASYNC_ERROR, onError, false, 0, true);
			this._connection.objectEncoding = ObjectEncoding.AMF0;
			this._connection.connect(this._server);
			
			
		}
		
		private var _status:String;
		
		/*private function log(status:String):void
		{
			if(status) this._status = status;
			
			var fps:String = '--';
			
			if(this._stream) fps = this._stream.currentFPS;
			
			this._debugInfo.text = 'Status: ' + _status + ', fps: ' + fps + '';
		}*/
		
		
		private function onStageResize(event:Event = null):void
		{
			if(!this._video) return;
				
			this._video.x = 0;//-this._padding.left;//Math.floor(this.stage.stageWidth / 2 - this._video.width / 2);
			this._video.y = 0;//-this._padding.top;//Math.floor(this.stage.stageHeight / 2 - this._video.height / 2);
			this._mask.x = this._video.x;
			this._mask.y = this._video.y;
			
			//this._video.width = this.stage.stageWidth;
			//this._video.height = this.stage.stageHeight;

			this._debugInfo.y = this.stage.stageHeight - 200;
		}
		
		private function onNetStatus(event:NetStatusEvent):void
		{
		//	_trace(event.info.code);
			if(event.info.code == "NetConnection.Connect.Success")
			{

				this._stream = new NetStream(this._connection);
				this._stream.addEventListener(AsyncErrorEvent.ASYNC_ERROR, onError, false, 0, true);
				this._stream.addEventListener(IOErrorEvent.IO_ERROR, onError, false, 0, true);
				this._stream.addEventListener(StatusEvent.STATUS, onStatus, false, 0, true);
				this._stream.addEventListener(NetStatusEvent.NET_STATUS, onNetStatus, false, 0, true);
				this._stream.client= this;
				//this._stream.receiveVideoFPS(60);
				this._stream.bufferTime = 0; //we're running live.
				//this._stream.bufferTimeMax = 0;
				this.openVideo();
			} else
			if(event.info.code == "NetStream.Play.StreamNotFound")
			{
				flash.utils.setTimeout(this.openStream, 1000);
			}
		}



		public function onMetaData(obj:Object):void 
		{
			_trace(obj.width + " " + obj.height+" "+obj.framerate);
			this._video.width = obj.width;
			this._video.height = obj.height;
			if(this._padding) this.setPadding(this._padding);

			this.stage.frameRate = obj.frameRate;
			ExternalInterface.call('desktopEvents.resize', { width: this._video.width, height: this._video.height });
			onStageResize();
		}


		private function getClipboard():String
		{
			return this._clipboard;
		}

		private function setClipboard(value:String):void
		{
			this._setClipboard = value;
		}
		
		private function onError(event:*):void
		{
			_trace("IO ERROR");
		}
		
		private function onSecurityError(event:SecurityErrorEvent):void
		{
			_trace("SEC ERROR");
		}


		private function setPadding(obj:Object):void
		{
			this._padding = obj;

			with(this._mask.graphics) 
			{
				clear();
				beginFill(0);
				drawRect(obj.left, obj.top, this._video.width - obj.left - obj.right, this._video.height - obj.top - obj.bottom);
				endFill();
			}
		}

		private function _checkFramerate():void 
		{

			if(!this._stream) return;
			var fps:Number = this._stream.currentFPS;
			//_trace("current framerate: " + fps+" cc: "+this._checkCount);

			ExternalInterface.call('desktopEvents.framerateChange', fps);

			return;
			if(fps == 0 && this._checkCount++ >= 2) {
			//	_trace("resetting");
				this.openStream();
				this._checkCount = 0;
			}
			else if(fps > 0) {
				this._checkCount = 0;
			}
		} 

		private function onStatus(event:*):void
		{
			_trace("stream status");
		}
		
	}
}