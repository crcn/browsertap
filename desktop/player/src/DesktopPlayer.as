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
	import flash.events.SecurityErrorEvent;
	import flash.external.ExternalInterface;
	import flash.media.Video;
	import flash.net.NetConnection;
	import flash.net.NetStream;
	import flash.net.ObjectEncoding;
	import flash.text.TextField;
	import flash.ui.Keyboard;
	
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
		
		[SWF(frameRate='60',backgroundColor='#ffffff')]
		
		
		
		public function DesktopPlayer()
		{
			
			
			this._server =  this.root.loaderInfo.parameters.server || "rtmp://10.0.1.6:1935/live";
			this._debug = Boolean(this.root.loaderInfo.parameters.debug);
			
			
			this._debugInfo = new TextField();
			this._debugInfo.text = "loading..";
			this._debugInfo.autoSize = 'left';
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
			
			var keyboardEvents:Array = [KeyboardEvent.KEY_DOWN, KeyboardEvent.KEY_UP];
			
			for each(var mouseEvent:String in mouseEvents)
			{
				this.stage.addEventListener(mouseEvent, onMouseEvent);
			}
			
			trace("G");
			
			for each(var keyboardEvent:String in keyboardEvents)
			{
				this.stage.addEventListener(keyboardEvent, onKeyboardEvent);
			}
		}
		
		private function onMouseEvent(event:MouseEvent):void
		{
			
			ExternalInterface.call('desktopEvents.' + event.type, { x: event.stageX, y: event.stageY, delta: event.delta, ctrlKey: event.ctrlKey, shiftKey: event.shiftKey });
		}
		
		private function onKeyboardEvent(event:KeyboardEvent):void
		{     
			trace("KEY DOWN");
			//if(event.keyCode == Keyboard.SHIFT || event.keyCode == Keyboard.CONTROL) return;
			
			ExternalInterface.call('desktopEvents.' + event.type, { keyCode: event.keyCode, altKey: event.altKey, shiftKey: event.shiftKey, ctrlKey: event.ctrlKey });
		}
		
		
		private function openVideo()
		{
			
			var video:Video = this._video = new Video(this.stage.stageWidth, this.stage.stageHeight);
			video.attachNetStream(this._stream);
			
			video.deblocking = 2;
			video.smoothing = true;
			
			this._stream.play("desktop");
			this.addChildAt(this._video, 0);
			
		}
		
			
		
		private function openStream()
		{
			trace("OPEN STREAM: " + this._server);
			
			this._connection = new NetConnection();
			this._connection.addEventListener(NetStatusEvent.NET_STATUS, onNetStatus);
			this._connection.addEventListener(IOErrorEvent.IO_ERROR, onError);
			this._connection.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onError);
			this._connection.addEventListener(AsyncErrorEvent.ASYNC_ERROR, onError);
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
		
		
		private function onStageResize(event:Event):void
		{
			if(!this._video) return;
			
			
			this._video.width = this.stage.stageWidth;
			this._video.height = this.stage.stageHeight;
		}
		
		private function onNetStatus(event:NetStatusEvent):void
		{
			this._debugInfo.text = event.info.code;
			
			if(event.info.code == NetConnectionCodes.CONNECT_SUCCESS)
			{
				this._stream = new NetStream(this._connection);
				this._stream.addEventListener(AsyncErrorEvent.ASYNC_ERROR, onError);
				this._stream.client={onMetaData:function(obj:Object):void{} }
				this._stream.bufferTime = 0; //we're running live.
				this.openVideo();
			}
		}
		
		private function onError(event:*):void
		{
			trace("IO ERROR");
		}
		
		private function onSecurityError(event:SecurityErrorEvent):void
		{
			trace("SEC ERROR");
		}
		
		private function onMetaData(obj:Object):void
		{
		
		}
		
	}
}