
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
#include <libavcore/parseutils.h>

}


#include "Window.h"
#include "WindowPrinter.h"
#include "WindowCaptureContext.h"
#include <vcclr.h>

using namespace System;

#pragma once

namespace Broadcast 
{
	public class FFMPeg
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

		void update(WindowCaptureContext^ ctx);

		/**
		* broadcasts screenshot data
		*/

		void broadcast(PrintData* data);


		/**
		*/

		~RTMPBroadcaster() 
		{
			cleanup();
		}

	private:

		/**
		*/

		int _width, _height, _bufferSize;
		//int _width, _height, _bitRate, _frameRate, _bufferSize, _gopSize, _qmin, _qmax;
		 
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

		void resize(int width, int height);


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