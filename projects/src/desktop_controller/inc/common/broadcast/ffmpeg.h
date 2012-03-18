#ifndef BROADCAST_FFMPEG_H_
#define BROADCAST_FFMPEG_H_

extern "C"
{
#ifndef __STDC_CONSTANT_MACROS
#  define __STDC_CONSTANT_MACROS
#endif

#include <libavformat/avformat.h>
#include <libavcodec/avcodec.h>   
#include <libswscale/swscale.h>
#include <libavfilter/avfilter.h>
#include <libavutil/fifo.h>
#include <libavutil/intreadwrite.h>
#include <libavutil/avstring.h>
//#include <libavcore/parseutils.h>

}


#include "common/broadcast/ffmpeg_context.h"
#include "common/graphics/bitmap.h"
#include "common/geom/rectangle.h"


namespace Broadcast 
{
	class FFMPeg
	{

	public:

		/**
		*/

		FFMPeg(const char *url);

		/**
		*/

		void location(const char *value);

		/**
		 */

		void update(FFmpegContext* ctx);

		/**
		* broadcasts screenshot data
		*/

		void broadcast(Graphics::Bitmap* data);


		/**
		*/

		~FFMPeg() 
		{
			cleanup();
		}

	private:

		/**
		*/

		Geom::Rectangle _bounds;
		int _bufferSize;
		//int _width, _height, _bitRate, _frameRate, _bufferSize, _gopSize, _qmin, _qmax;
		 
		FFmpegContext* _ctx;
		//gcroot<WindowCaptureContext^> _ctx;

		/**
		*/

		bool _prepared;

		/**
		 * TRUE if opened, and bitRate / window size changes (among other variables)
		 */

		bool _needsRefreshing;

		/**
		* RTMP server
		*/

		const char *_url;

		/**
		*/

		AVFormatContext *_formatCtx;
		AVOutputFormat *_outputFmt;
		AVStream *_videoStream;
		AVCodecContext *_videoCodecCtx;
		AVCodec *_videoCodec;
		AVFrame* _srcPicture;
		AVFrame* _dstPicture;
		SwsContext* _convertCtx;

		uint8_t *_outputBuffer;




		/**
		*/

		void resize(Geom::Rectangle* rect);


		/**
		* refreshes settings if anything has changed
		*/

		void refresh(bool force);

		/**
		 */

		void refresh()
		{
			refresh(false);
		}


		/**
		* prepares the broadcaster
		*/

		void prepare();

		/**
		*/

		void addVideoStream();

		/**
		*/

		void openVideoStream();

		/**
		* cleanup from previous prepare();
		*/

		void cleanup();




	};

}

#endif