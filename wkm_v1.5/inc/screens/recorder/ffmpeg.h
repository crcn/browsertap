#ifndef BROADCAST_FFMPEG_H_
#define BROADCAST_FFMPEG_H_


extern "C"
{
#ifdef __cplusplus
 #define __STDC_CONSTANT_MACROS
 #ifdef _STDINT_H
  #undef _STDINT_H
 #endif
 # include <stdint.h>
#endif
	#ifndef INT64_C
#define INT64_C(c) (c ## LL)
#define UINT64_C(c) (c ## ULL)
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


#include "screens/recorder/ffmpeg_context.h"
#include "common/graphics.h"
#include "common/geometry.h"


namespace Screens 
{
	class FFMPeg
	{

	public:

		/**
		*/

		FFMPeg(FFmpegContext* ctx);

		/**
		*/

		//void location(const char *value);

		/**
		 */

		//const char* location();

		/**
		 */

		void update(FFmpegContext* ctx);

		/**
		* broadcasts screenshot data
		*/

		void broadcast(Graphics::Bitmap* data);

		/**
		 */

		FFmpegContext* context();

		/**
		*/

		~FFMPeg() 
		{
			cleanup();
		}


	private:

		/**
		*/

		Geometry::Rectangle _bounds;
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

		//const char *_url;

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

		void resize(Geometry::Rectangle* rect);


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