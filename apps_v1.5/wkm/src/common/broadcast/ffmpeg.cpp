#include "common/broadcast/ffmpeg.h"
#include <iostream>




AVFrame *alloc_picture(enum PixelFormat pix_fmt, int width, int height)
{
	AVFrame *picture;
	uint8_t *picture_buf;
	int size;

	picture = avcodec_alloc_frame();
	if(!picture) return NULL;

	size = avpicture_get_size(pix_fmt, width, height);
	picture_buf = (uint8_t*)av_malloc(size);
	if(!picture_buf)
	{
		av_free(picture); 
		return NULL;
	}

	avpicture_fill((AVPicture*)picture,picture_buf,pix_fmt,width,height);
	return picture;
}

/* prepare a dummy image */
/*static void fill_yuv_image(AVFrame *pict, int frame_index, int width, int height)
{
    int x, y, i;

    i = frame_index;

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            pict->data[0][y * pict->linesize[0] + x] = x + y + i * 3;
        }
    }

    for (y = 0; y < height/2; y++) {
        for (x = 0; x < width/2; x++) {
            pict->data[1][y * pict->linesize[1] + x] = 128 + y + i * 2;
            pict->data[2][y * pict->linesize[2] + x] = 64 + x + i * 5;
        }
    }
}*/

#define ENCODE_PX_FORMAT PIX_FMT_YUV420P

int frame_count = 0;

namespace Broadcast
{


	FFMPeg::FFMPeg(FFmpegContext* ctx)
	{
		//avcodec_init();
		avcodec_register_all();	
		avformat_network_init();
		av_register_all();

		_prepared		 = false;
		_srcPicture      = NULL;
		_dstPicture      = NULL;
		_needsRefreshing = true;

		this->_ctx = ctx;
	}

	void FFMPeg::broadcast(Graphics::Bitmap* data)
	{
		resize(&data->bounds());
		refresh(true);

		Geom::Rectangle& bounds = data->bounds();

		//std::cout << bounds.width << " " << bounds.height << std::endl;


		avpicture_fill((AVPicture*)_srcPicture, (uint8_t*)data->buffer(), PIX_FMT_BGRA, bounds.width, bounds.height);
		//fill_yuv_image((AVFrame*)_dstPicture, frame_count++, bounds.width, bounds.height);
		sws_scale(_convertCtx, 
			_srcPicture->data, 
			_srcPicture->linesize, 
			0, 
			bounds.height, 
			_dstPicture->data, 
			_dstPicture->linesize);
		

		int outSize = avcodec_encode_video(_videoCodecCtx, _outputBuffer, _bufferSize, _dstPicture);


		int ret = 0;
		if(outSize > 0)
		{       
			AVPacket pkt;
			av_init_packet(&pkt);

			if (_videoCodecCtx->coded_frame->pts != AV_NOPTS_VALUE) 
			{
				pkt.pts = av_rescale_q(_videoCodecCtx->coded_frame->pts, _videoCodecCtx->time_base, _videoStream->time_base);
			} else
			{
				// std::cout << "G" << std::endl;
			}

			if(_videoCodecCtx->coded_frame->key_frame)
			{
				pkt.flags |= AV_PKT_FLAG_KEY;
			}

			pkt.stream_index = _videoStream->index;
			pkt.data = _outputBuffer;
			pkt.size = outSize;


			/* write the compressed frame in the media file */
			ret = av_interleaved_write_frame(_formatCtx, &pkt);
		}
		else
		{
			ret = 0;
		}

		if(ret != 0) 
		{
			fprintf(stderr, "Error writing video frame\n");
		}
	}


	void FFMPeg::resize(Geom::Rectangle* rect)
	{
		//no change in size? return.
		if(!this->_bounds.resize(rect)) return;

		_needsRefreshing = true;
	}


	void FFMPeg::refresh(bool force)
	{
		if(_prepared && (!_needsRefreshing || !force)) return;
		
		prepare();
	}


	void FFMPeg::update(FFmpegContext* ctx)
	{
		_needsRefreshing = _needsRefreshing || ctx->copy(this->_ctx);
	}

	void FFMPeg::prepare()
	{
		printf("Preparing RTMP connection for \n %s \n", _ctx->output);

		cleanup();
		_prepared = true;
		_needsRefreshing = false;
		

		//open the RTMP server
		avformat_alloc_output_context2(&_formatCtx, NULL, "flv", _ctx->output);

		//unable to open the connection? probably down...
		if(_formatCtx == NULL)
		{
			exit(1);
		}

		_outputFmt = _formatCtx->oformat;

		addVideoStream();

		av_dump_format(_formatCtx, 0, _ctx->output, 1);

		printf("Opening RTMP connection");

		//open the file
		if (!(_outputFmt->flags & AVFMT_NOFILE)) 
		{
			int code = avio_open(&_formatCtx->pb, _ctx->output, AVIO_FLAG_WRITE);
			if (code < 0) 
			{
				fprintf(stderr, "Could not open '%s'\n", _ctx->output);

				exit(1);
			}
		}

		
		printf("Opening Video Stream");
		openVideoStream();
		avformat_write_header(_formatCtx, NULL);
		printf("Connected to RTMP server");

	}

	FFmpegContext* FFMPeg::context()
	{
		return _ctx;
	}


	void FFMPeg::addVideoStream()
	{
		_videoStream = avformat_new_stream(_formatCtx, NULL);

		if(!_videoStream) 
		{
			fprintf(stderr, "Could not allocate video stream\n");

			exit(1);
		}

		_videoCodecCtx = _videoStream->codec;
		_videoCodec = avcodec_find_encoder(_outputFmt->video_codec);

		if(!_videoCodec) 
		{
			fprintf(stderr, "Video codec could not be found\n");
			exit(1);
		}

		avcodec_get_context_defaults3(_videoCodecCtx, _videoCodec);
		_videoCodecCtx->codec_id = _outputFmt->video_codec;

		int br = _ctx->bit_rate * 1000;
		
		
		//_videoCodecCtx->flags |= CODEC_FLAG_GRAY;
		//_videoCodecCtx->flags |= CODEC_FLAG_LOW_DELAY;
		//_videoCodecCtx->rc_min_rate      = br;// 64 * 1000; //average bit rate
		_videoCodecCtx->bit_rate      = br; //average bit rate
		//_videoCodecCtx->rc_max_rate      = br;// 64 * 1000; //average bit rate
		//_videoCodecCtx->qblur      = 1.0;// 64 * 1000; //average bit rate
		//_videoCodecCtx->qcompress      = 1.0;// 64 * 1000; //average bit rate
		//_videoCodecCtx->bit_rate_tolerance      = br * 2;// kb * 1000;
		//_videoCodecCtx->rc_min_rate   = 0; //max bit rate
		//_videoCodecCtx->rc_max_rate   = 0; //max bit rate
		//_videoCodecCtx->rc_buffer_size   = 0; 
		_videoCodecCtx->width         = this->_bounds.width;
		_videoCodecCtx->height        = this->_bounds.height;

		_videoCodecCtx->time_base.den = _ctx->frame_rate; // HIGH framerate = smooth playback.
		_videoCodecCtx->time_base.num = 1;
		_videoCodecCtx->gop_size      = _ctx->gop_size;
		//_videoCodecCtx->level = 30;Z
		//_videoCodecCtx->flags		  |= CODEC_FLAG_PSNR;
		//_videoCodecCtx->partitions		  &= ~(X264_PART_I4X4 | X264_PART_I8X8 | X264_PART_P8X8 | X264_PART_P4X4 | X264_PART_B8X8);
		//_videoCodecCtx->crf		  = 0.0f;
		//_videoCodecCtx->cqp = 26;
		//_videoCodecCtx->i_quant_factor = 0.769f;
		//_videoCodecCtx->b_quant_factor = 1.4f;
		//_videoCodecCtx->rc_initial_buffer_occupancy = (int)(0.9 * _formatCtx->rc_buffer_size);
		//_videoCodecCtx->me_method = ME_EPZS;
		//_videoCodecCtx->me_range = 0;
		// _videoCodecCtx->noise_reduction = 10;
		//_videoCodecCtx->scenechange_threshold = 40;
		//_videoCodecCtx->b_quant_offset = 1.25;
		//_videoCodecCtx->scenechange_threshold = -500;
		
		//_videoCodecCtx->me_method = ME_ZERO;
		//_videoCodecCtx->qmin = 1;
		//_videoCodecCtx->qmax = 10;
		//_videoCodecCtx->coder_type = FF_CODER_TYPE_VLC;
		
		//s_videoCodecCtx->qmin = _ctx->qmin;
		//_videoCodecCtx->qmax = _ctx->qmax;

		//_videoCodecCtx->qmin = 1;
		//_videoCodecCtx->qmax = 3;
		//_videoCodecCtx->rc_qsquish = 1;
		
		//_videoCodecCtx->flags2 |= CODEC_FLAG2_FAST|CODEC_FLAG2_STRICT_GOP|CODEC_FLAG2_DROP_FRAME_TIMECODE|CODEC_FLAG2_SKIP_RD;
		
		//_videoCodecCtx->flags |= CODEC_FLAG_LOOP_FILTER;//|CODEC_FLAG_GRAY;
		//_videoCodecCtx->me_cmp |= FF_CMP_CHROMA;
		//_videoCodecCtx->qmin = 10;
		//_videoCodecCtx->qmax = 51;
		//_videoCodecCtx->max_qdiff = 4;
		//_videoCodecCtx->directpred = 1;
		//_videoCodecCtx->flags2 |= CODEC_FLAG2_FASTPSKIP|CODEC_FLAG2_MBTREE;
		// _videoCodecCtx->cqp = 0;
		//_videoCodecCtx->crf = 22;
		//_videoCodecCtx->b_frame_strategy = 1;
		//_videoCodecCtx->i_quant_factor = 1.0;
		//_videoCodecCtx->scenechange_threshold = 40;
		//_videoCodecCtx->keyint_min = 25;
		//_videoCodecCtx->me_range = 16;
		//_videoCodecCtx->me_subpel_quality = 0;

			
		_videoCodecCtx->me_subpel_quality = 0;	
		//_videoCodecCtx->subme = 1;
		//_videoCodecCtx->thread_count = 1;

		//_videoCodecCtx->qmin = 1;
		//_videoCodecCtx->qmax = 10;
		//_videoCodecCtx->me_method = 7;//ME_EPZS;


		//_videoCodecCtx->max_qdiff = 3;
		//_videoCodecCtx->i_quant_factor = -0.8;
		//_videoCodecCtx->b_quant_factor = 1.25;
		//_videoCodecCtx->b_quant_offset = 1.25;
		_videoCodecCtx->pix_fmt       = ENCODE_PX_FORMAT;
		//_videoCodecCtx->compression_level       = -8; //best, -5 = default
		//_videoCodecCtx->aq_mode       = 0; //best
		//_videoCodecCtx->qmin       = 1; 
		//_videoCodecCtx->qmax       = 3; 
		

#define CTO(prop) if(_ctx->prop != -1){ /*printf("%s:%f", #prop, _ctx->prop);*/ _videoCodecCtx->prop = _ctx->prop; }
		CTO(bit_rate_tolerance)
			CTO(max_qdiff)
			CTO(b_quant_factor)
			//CTO(luma_elim_threshold)
			//CTO(chroma_elim_threshold)
			CTO(qmin)
			CTO(qmax)
			CTO(rc_max_rate)
			CTO(rc_min_rate)
			CTO(bits_per_coded_sample)
			CTO(prediction_method)
			CTO(me_cmp)
			CTO(me_sub_cmp)
			CTO(dia_size)
			CTO(pre_me)
			CTO(me_pre_cmp)
			CTO(pre_dia_size)
			CTO(me_subpel_quality)
			CTO(me_range)
			CTO(intra_quant_bias)
			CTO(global_quality)
			CTO(coder_type)
			CTO(mb_decision)
			CTO(lmin)
			CTO(lmax)
			//CTO(qscale)
			CTO(scenechange_threshold)
			CTO(noise_reduction)
			//CTO(inter_threshold)
			// CTO(quantizer_noise_shaping)©
			CTO(me_threshold)
			CTO(mb_threshold)
			CTO(intra_dc_precision)
			CTO(nsse_weight)
			CTO(profile)
			CTO(level)
			CTO(mb_lmin)
			CTO(mb_lmax)
			CTO(me_penalty_compensation)
			CTO(bidir_refine)
			CTO(brd_scale)
			CTO(keyint_min)
			CTO(refs)
			CTO(chromaoffset)
			// CTO(bframebias)
			CTO(trellis)
			//CTO(deblockalpha)
			//CTO(deblockbeta)
			//CTO(partitions)
			//CTO(directpred)
			CTO(scenechange_factor)
			CTO(b_sensitivity)
			CTO(compression_level)
			//CTO(use_lpc)
			//CTO(lpc_coeff_precision)
			CTO(min_prediction_order)
			CTO(max_prediction_order)
			//CTO(prediction_order_method)
			CTO(qcompress)
			CTO(qblur)
			CTO(b_quant_offset)
			CTO(rc_qsquish)
			CTO(rc_buffer_aggressivity)
			CTO(i_quant_factor)
			CTO(i_quant_offset)
			CTO(rc_initial_cplx)
			CTO(lumi_masking)
			CTO(temporal_cplx_masking)
			CTO(spatial_cplx_masking)
			CTO(p_masking)
			CTO(dark_masking)
			//CTO(crf)
			//CTO(cqp)
			//CTO(complexityblur)
			//CTO(aq_mode)
			//CTO(psyd_rd)
			//CTO(psy_trellis)
#undef CTO


		if (_videoCodecCtx->codec_id == CODEC_ID_MPEG2VIDEO) 
		{
			// just for testing, we also add B frames
			_videoCodecCtx->max_b_frames = 2;
		}

		if (_videoCodecCtx->codec_id == CODEC_ID_MPEG1VIDEO)
		{
			// Needed to avoid using macroblocks in which some coeffs overflow.
			// This does not happen with normal video, it just happens here as
			// the motion of the chroma plane does not match the luma plane. 
			_videoCodecCtx->mb_decision=2;
		}

		// some formats want stream headers to be separate
		if (_formatCtx->oformat->flags & AVFMT_GLOBALHEADER)
			_videoCodecCtx->flags |= CODEC_FLAG_GLOBAL_HEADER;


	}

	void FFMPeg::openVideoStream()
	{
		//open the codec
		if (avcodec_open(_videoCodecCtx ,_videoCodec) < 0) 
		{
			fprintf(stderr, "could not open codec\n");
			exit(1);
		}


		_bufferSize = avpicture_get_size(_videoCodecCtx->pix_fmt, _videoCodecCtx->width, _videoCodecCtx->height);
		_outputBuffer = (uint8_t *)av_malloc(_bufferSize);
		_dstPicture = alloc_picture(_videoCodecCtx->pix_fmt, _videoCodecCtx->width, _videoCodecCtx->height);
		_srcPicture = alloc_picture(PIX_FMT_YUV420P, _videoCodecCtx->width, _videoCodecCtx->height);

		if(_dstPicture == NULL || _srcPicture == NULL)
		{
			fprintf(stderr, "Unable to allocate pictures\n");
			exit(1);
		}


		_convertCtx = sws_getContext(_videoCodecCtx->width,
			_videoCodecCtx->height, 
			PIX_FMT_BGRA, 
			_videoCodecCtx->width,
			_videoCodecCtx->height, 
			_videoCodecCtx->pix_fmt,
			SWS_FAST_BILINEAR,
			NULL, 
			NULL, 	
			NULL);

		if(_convertCtx == NULL)
		{
			fprintf(stderr, "Cannot initialize conversion context \n");

			exit(1);
		}
	}

	void FFMPeg::cleanup()
	{

		/*AVFormatContext *_formatCtx;
		AVOutputFormat *_outputFmt;
		AVStream *_videoStream;
		AVCodecContext *_videoCodecCtx;
		AVCodec *_videoCodec;
		AVFrame* _srcPicture;
		AVFrame* _dstPicture;
		SwsContext* _convertCtx;

		uint8_t *_outputBuffer;*/


		if(!_prepared) return;

		av_write_trailer(_formatCtx);


		avcodec_close(_videoCodecCtx);

		//causes mem issues
		//av_free(_dstPicture->data[0]);
		av_free(_dstPicture);
		//av_free(_srcPicture->data[0]);
		av_free(_srcPicture);
		av_free(_outputBuffer);


		for(int i = 0; i < _formatCtx->nb_streams; i++)
		{
			av_freep(&_formatCtx->streams[i]->codec);
			av_freep(&_formatCtx->streams[i]);
		}

		if(!(_outputFmt->flags & AVFMT_NOFILE)) 
		{
			avio_close(_formatCtx->pb);
		}

		av_free(_formatCtx);
	}



}