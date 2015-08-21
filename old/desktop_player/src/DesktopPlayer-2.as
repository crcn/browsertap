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
	import flash.ui.Keyboard;
	import flash.utils.*;
	
	import org.osmf.net.NetConnectionCodes;
	import org.osmf.net.NetStreamCodes;
	
	public class DesktopPlayer extends Sprite
	{
		
		private var _connection: NetConnection;
		private var _stream: NetStream;
		private var _video: Video;
		private var _server: String;
		private var _debugInfo:TextField;
		private var _debug:Boolean;
		private var _checkCount:int;
		
		[SWF(frameRate='24',backgroundColor='#FFFFFF')]
		
		
		
		public function DesktopPlayer()
		{
			
			this._server =  this.root.loaderInfo.parameters.host || "rtmp://192.168.2.3:1935/live";
			this._debug = true;//Boolean(this.root.loaderInfo.parameters.debug);
			
			
			this._debugInfo = new TextField();
			this._debugInfo.text = "connecting to " + this._server;
			this._debugInfo.autoSize = 'left';
			this._debugInfo.width = 700;
			this._debugInfo.height = 700;
			this._debugInfo.background = true;
			this._debugInfo.backgroundColor = 0xFFFFFF;
			if(this._debug) this.addChild(this._debugInfo);
			
			
			this.stage.align = StageAlign.TOP_LEFT;
			this.stage.scaleMode = StageScaleMode.NO_SCALE;
			
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
		}
		
		private function onMouseEvent(event:MouseEvent):void
		{
			//_trace(event.type);
			
			ExternalInterface.call('desktopEvents.' + event.type, { x: event.stageX, y: event.stageY, delta: event.delta, ctrlKey: event.ctrlKey, shiftKey: event.shiftKey });
		}
		
		private function onKeyboardEvent(event:KeyboardEvent):void
		{     
			//if(event.keyCode == Keyboard.SHIFT || event.keyCode == Keyboard.CONTROL) return;

			//_trace(event.type);
			
			ExternalInterface.call('desktopEvents.' + event.type, { keyCode: event.keyCode, altKey: event.altKey, shiftKey: event.shiftKey, ctrlKey: event.ctrlKey });
		}
		
		
		private function openVideo():void
		{
			_trace("selecting stream...");

			if(this._video) {
				this.removeChild(this._video);
			}
			
			var video:Video = this._video = new Video(this.stage.stageWidth, this.stage.stageHeight);
			video.attachNetStream(this._stream);
			
			video.deblocking = 2;
			video.smoothing = true;
			
			this._stream.play("default");
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

			_trace("Connecting to " + this._server);


			
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
			
			
			this._video.width = this.stage.stageWidth;
			this._video.height = this.stage.stageHeight;

			ExternalInterface.call('desktopEvents.resize', { width: this._video.width, height: this._video.height });
		}
		
		private function onNetStatus(event:NetStatusEvent):void
		{
			_trace(event.info.code);
			if(event.info.code == "NetConnection.Connect.Success")
			{

				this._stream = new NetStream(this._connection);
				this._stream.addEventListener(AsyncErrorEvent.ASYNC_ERROR, onError, false, 0, true);
				this._stream.addEventListener(IOErrorEvent.IO_ERROR, onError, false, 0, true);
				this._stream.addEventListener(StatusEvent.STATUS, onStatus, false, 0, true);
				this._stream.client={onMetaData:function(obj:Object):void{} }
				//this._stream.receiveVideoFPS(60);
				this._stream.bufferTime = 0; //we're running live.
				//this._stream.bufferTimeMax = 0;
				this.openVideo();
			}
		}
		
		private function onError(event:*):void
		{
			_trace("IO ERROR");
		}
		
		private function onSecurityError(event:SecurityErrorEvent):void
		{
			_trace("SEC ERROR");
		}
		
		private function onMetaData(obj:Object):void
		{
		
		}

		private function _checkFramerate():void 
		{

			if(!this._stream) return;
			var fps:Number = this._stream.currentFPS;
			_trace("current framerate: " + fps+" cc: "+this._checkCount);

			return;
			if(fps == 0 && this._checkCount++ >= 2) {
				_trace("resetting");
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