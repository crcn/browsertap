var fig = require('fig'),
malt = require('malt'),
views = fig.views,
models = malt.models;
                                         

/**
 * the home page
 */

views.VirtView = views.Template.extend({
	

	/**
	 */

	'tpl': '/views/desktop.mu',

	/**
	 */


	'el': '#page-view',


	/**
	 */

	'override __construct': function()
	{
		this._super.apply(this, arguments);

		this.addChild(new views.BrowserSwitcherView( { browser: this.ops.browser }));
	}


});  


views.DesktopView = views.View.extend({
	



	/**
	 */

	'el': '#desktop',



	/**
	 */

	 'render': function() {

	 	swfobject.embedSWF("/player/DesktopPlayer.swf", 
		"desktop", 
		/*"100%", 
		"100%", */
		"1024",
		"768",
		"9.0.0",
		"/player/expressInstall.swf",
		{ server: this.ops.server, debug: true },
		{ allowscriptaccess: 'always', menu: false });

	 },

	 /**
	  */

	 'override listen': function() {
	 	this._super();

		$('#desktop-holder').mousedown(function(e) {
			$(window).trigger('desktopDown', [{ button: e.button }]);

			if(e.button == 2) e.preventDefault()
		});

		$('#desktop-holder').mouseup(function(e) {
			$(window).trigger('desktopUp', [{ button: e.button }]);
		})
	 }
});


views.BrowserSwitcherView = views.View.extend({
	
	/**
	 */

	'el': '#desktop-selector',


	'render': function() {

		this.$("option[value=" + this.ops.browser +"]").attr("selected","selected") ;

		var self = this;

		$(this.el).change(function(ev) {
			self._router.push('remote/test/url', { browser: ev.target.value.toString() });
		});
	}
});

views.QualityView = views.Template.extend({
	
	/**
	 */

	'tpl': '/views/settings.mu',

	'el': '#page-view',


	/**
	 */

	'bindings': {
		'submit #qualityForm': 'submit'
	},

	'override render': function() {

		this._super();

		var fields = {
			captureTimeout: 10,
			bitRate: 64, //!
			frameRate: 24, //!
			gopSize: 12, //!
			qmin: 1, //!
			qmax: 11, //!
			bit_rate_tolerance: -1, //!
			qcompress: -1.0,
			qblur: -1.0,
			max_qdiff: -1,
			max_b_frames: -1,
			b_quant_factor: -1.0,
			luma_elim_threshold: -1,
			chroma_elim_threshold: -1,
			b_quant_offset: -1.0,
			rc_qsquish: -1.0,
			rc_eq: -1,
			rc_max_rate: -1,
			rc_min_rate: -1,
			rc_buffer_aggressivitiy: -1.0,
			i_quant_factor: -1.0,
			i_quant_offset: -1.0,
			rc_initial_cplx: -1.0,
			lumi_masking: -1.0,
			temporal_cplx_masking: -1.0,
			spatial_cplx_masking: -1.0,
			p_masking: -1.0,
			dark_masking: -1.0,
			dsp_mask: -1,
			bits_per_coded_sample: -1,
			prediction_method: -1,
			me_cmp: -1, //!
			me_sub_cmp: -1, //!
			dia_size: -1,
			last_predictor_count: -1,
			pre_me: -1,
			me_pre_cmp: -1, //!
			pre_dia_size: -1,
			me_subpel_quality: -1,
			dtg_active_format: -1,
			me_range: -1,
			intra_quant_bias: -1,
			global_quality: -1,
			coder_type: -1,
			mb_decision: -1,
			lmin: -1,
			lmax: -1,
			scenechange_threshold: -1,
			noise_reduction: -1,
			inter_threshold: -1,
			quantizer_noise_shaping: -1,
			me_threshold: -1,
			mb_threshold: -1,
			intra_dc_precision: -1,
			nsse_weight: -1,
			profile: -1,
			level: -1,
			mb_lmin: -1,
			mb_lmax: -1,
			me_penalty_compensation: -1,
			bidir_refine: -1,
			brd_scale: -1,
			crf: -1.0,
			cqp: -1.0,
			keyint_min: -1,
			refs: -1,
			chromaoffset: -1,
			bframebias: -1,
			trellis: -1, 
			complexityblur: -1.0,
			deblockalpha: -1,
			deblockbeta: -1,
			partitions: -1,
			directpred: -1,
			scenechange_factor: -1,
			b_sensitivity: -1,
			compression_level: -1, //!
			use_lpc: -1,
			lpc_coeff_precision: -1,
			min_prediction_order: -1,
			max_prediction_order: -1,
			prediction_order_method: -1,
			aq_mode: -1.0, //!
			psyd_rd: -1.0, //!
			psy_trellis: -1.0, //!


		}



		for(var type in fields) {
			$('#qualityForm').append(type +': <input name="'+type+'" value="'+(store.get(type) || fields[type])+'"> <br />');
		}

		$('#qualityForm').append('<input  type="submit" id="submit-form" value="submit"> <br />');

		var router = this._router;

		
	},

	/**
	 */

	 'submit': function(e) {
		e.preventDefault();

	    var $inputs = $('#qualityForm :input');

	    var values = {};
	    $inputs.each(function() {
	        values[this.name] = Number($(this).val()) || -1;
	        store.set(this.name, values[this.name]);
	    });

	    this._router.push('change/ctx', values);
	 }
});




module.exports = views;