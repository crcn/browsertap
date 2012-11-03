#ifndef BROADCAST_CONTEXT_H_
#define BROADCAST_CONTEXT_H_

#include <cstddef>



namespace Broadcast
{
	class FFmpegContext
	{
	public:

		const char* output;

		/**
		* left offset (bounds)
		*/

		int left, 
			right,
			top,
			bottom,
			width,
			height,
			bit_rate,
			gop_size,
			qmin,
			qmax,
			frame_rate,
			capture_timeout,

			bit_rate_tolerance,
			max_qdiff,
			b_quant_factor,
			luma_elim_threshold,
			chroma_elim_threshold,
			rc_eq,
			rc_max_rate,
			rc_min_rate,
			dp_mask,
			bits_per_coded_sample,
			prediction_method,
			me_cmp,
			me_sub_cmp,
			dia_size,
			pre_me,
			me_pre_cmp,
			pre_dia_size,
			me_subpel_quality,
			me_range,
			intra_quant_bias,
			global_quality,
			coder_type,
			mb_decision,
			lmin,
			lmax,
			scenechange_threshold,
			noise_reduction,
			inter_threshold,
			quantizer_noise_shaping,
			me_threshold,
			mb_threshold,
			intra_dc_precision,
			nsse_weight,
			profile,
			level,
			mb_lmin,
			mb_lmax,
			me_penalty_compensation,
			bidir_refine,
			brd_scale,
			keyint_min,
			refs,
			chromaoffset,
			bframebias,
			trellis,
			deblockalpha,
			deblockbeta,
			partitions,
			directpred,
			scenechange_factor,
			b_sensitivity,
			compression_level,
			use_lpc,
			lpc_coeff_precision,
			min_prediction_order,
			max_prediction_order,
			prediction_order_method;



		double qcompress,
			qblur,
			b_quant_offset,
			rc_qsquish,
			rc_buffer_aggressivity,
			i_quant_factor,
			i_quant_offset,
			rc_initial_cplx,
			lumi_masking,
			temporal_cplx_masking,
			spatial_cplx_masking,
			p_masking,
			dark_masking,
			crf,
			cqp,
			complexityblur,
			aq_mode,
			psyd_rd,
			psy_trellis;


		/**
		*/

		FFmpegContext(int left, int right, int top, int bottom):
		left(left),
			right(right),
			top(top),
			bottom(bottom)
		{
			this->output = NULL;
			this->init();
		}

		FFmpegContext(const char* output):
		left(0),
			right(0),
			top(0),
			bottom(0)
		{
			this->output = output;
			this->init();
		}

		/**
		*/


#define WTO(prop) if(this->prop != to->prop) { /*printf("%s has changed", #prop);*/ different = true; to->prop = this->prop; }

		bool copy(FFmpegContext* to)
		{
			bool different = false;
			
			WTO(qmin)
			WTO(qmax)
			WTO(bit_rate)
			WTO(gop_size)
			WTO(frame_rate)
			WTO(width)
			WTO(height)
			WTO(height)WTO(bit_rate_tolerance)
			WTO(max_qdiff)
			WTO(b_quant_factor)
			WTO(luma_elim_threshold)
			WTO(chroma_elim_threshold)
			WTO(rc_eq)
			WTO(rc_max_rate)
			WTO(rc_min_rate)
			WTO(dp_mask)
			WTO(bits_per_coded_sample)
			WTO(prediction_method)
			WTO(me_cmp)
			WTO(me_sub_cmp)
			WTO(dia_size)
			WTO(pre_me)
			WTO(me_pre_cmp)
			WTO(pre_dia_size)
			WTO(me_subpel_quality)
			WTO(me_range)
			WTO(intra_quant_bias)
			WTO(global_quality)
			WTO(coder_type)
			WTO(mb_decision)
			WTO(lmin)
			WTO(lmax)
			WTO(scenechange_threshold)
			WTO(noise_reduction)
			WTO(inter_threshold)
			WTO(quantizer_noise_shaping)
			WTO(me_threshold)
			WTO(mb_threshold)
			WTO(intra_dc_precision)
			WTO(nsse_weight)
			WTO(profile)
			WTO(level)
			WTO(mb_lmin)
			WTO(mb_lmax)
			WTO(me_penalty_compensation)
			WTO(bidir_refine)
			WTO(brd_scale)
			WTO(keyint_min)
			WTO(refs)
			WTO(chromaoffset)
			WTO(bframebias)
			WTO(trellis)
			WTO(deblockalpha)
			WTO(deblockbeta)
			WTO(partitions)
			WTO(directpred)
			WTO(scenechange_factor)
			WTO(b_sensitivity)
			WTO(compression_level)
			WTO(use_lpc)
			WTO(lpc_coeff_precision)
			WTO(min_prediction_order)
			WTO(max_prediction_order)
			WTO(prediction_order_method)
			WTO(qcompress)
			WTO(qblur)
			WTO(b_quant_offset)
			WTO(rc_qsquish)
			WTO(rc_buffer_aggressivity)
			WTO(i_quant_factor)
			WTO(i_quant_offset)
			WTO(rc_initial_cplx)
			WTO(lumi_masking)
			WTO(temporal_cplx_masking)
			WTO(spatial_cplx_masking)
			WTO(p_masking)
			WTO(dark_masking)
			WTO(crf)
			WTO(cqp)
			WTO(complexityblur)
			WTO(aq_mode)
			WTO(psyd_rd)
			WTO(psy_trellis)



			return different;

		}

#undef WTO

	private:

		void init() 
		{

			qmin = -1;
			qmax = -1;
			bit_rate_tolerance = -1;
			max_qdiff = -1;
			b_quant_factor = -1;
			luma_elim_threshold = -1;
			chroma_elim_threshold = -1;
			rc_eq = -1;
			rc_max_rate = -1;
			rc_min_rate = -1;
			dp_mask = -1;
			bits_per_coded_sample = -1;
			prediction_method = -1;
			me_cmp = -1;
			me_sub_cmp = -1;
			dia_size = -1;
			pre_me = -1;
			me_pre_cmp = -1;
			pre_dia_size = -1;
			me_subpel_quality = -1;
			me_range = -1;
			intra_quant_bias = -1;
			global_quality = -1;
			coder_type = -1;
			mb_decision = -1;
			lmin = -1;
			lmax = -1;
			scenechange_threshold = -1;
			noise_reduction = -1;
			inter_threshold = -1;
			quantizer_noise_shaping = -1;
			me_threshold = -1;
			mb_threshold = -1;
			intra_dc_precision = -1;
			nsse_weight = -1;
			profile = -1;
			level = -1;
			mb_lmin = -1;
			mb_lmax = -1;
			me_penalty_compensation = -1;
			bidir_refine = -1;
			brd_scale = -1;
			keyint_min = -1;
			refs = -1;
			chromaoffset = -1;
			bframebias = -1;
			trellis = -1;
			deblockalpha = -1;
			deblockbeta = -1;
			partitions = -1;
			directpred = -1;
			scenechange_factor = -1;
			b_sensitivity = -1;
			compression_level = -1;
			use_lpc = -1;
			lpc_coeff_precision = -1;
			min_prediction_order = -1;
			max_prediction_order = -1;
			prediction_order_method = -1;
			qcompress = -1;
			qblur = -1;
			b_quant_offset = -1;
			rc_qsquish = -1;
			rc_buffer_aggressivity = -1;
			i_quant_factor = -1;
			i_quant_offset = -1;
			rc_initial_cplx = -1;
			lumi_masking = -1;
			temporal_cplx_masking = -1;
			spatial_cplx_masking = -1;
			p_masking = -1;
			dark_masking = -1;
			crf = -1;
			cqp = -1;
			complexityblur = -1;
			aq_mode = -1;
			psyd_rd = -1;
			psy_trellis = -1;
		}

	};
}



#endif