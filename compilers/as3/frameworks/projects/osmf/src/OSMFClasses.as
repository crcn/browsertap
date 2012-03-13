////////////////////////////////////////////////////////////////////////////////
//
//  ADOBE SYSTEMS INCORPORATED
//  Copyright 2005-2009 Adobe Systems Incorporated
//  All Rights Reserved.
//
//  NOTICE. Adobe permits you to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
//
////////////////////////////////////////////////////////////////////////////////

package
{

/**
 *  @private
 *  This class is used to link additional classes into osmf.swc.
 */
internal class OSMFClasses
{
import org.osmf.audio.AudioElement; org.osmf.audio.AudioElement;
import org.osmf.audio.SoundLoader; org.osmf.audio.SoundLoader;
import org.osmf.composition.CompositeElement; org.osmf.composition.CompositeElement;
import org.osmf.composition.ParallelElement; org.osmf.composition.ParallelElement;
import org.osmf.composition.SerialElement; org.osmf.composition.SerialElement;
import org.osmf.content.ContentElement; org.osmf.content.ContentElement;
import org.osmf.content.ContentLoadedContext; org.osmf.content.ContentLoadedContext;
import org.osmf.content.ContentLoader; org.osmf.content.ContentLoader;
import org.osmf.display.MediaElementSprite; org.osmf.display.MediaElementSprite;
import org.osmf.display.MediaPlayerSprite; org.osmf.display.MediaPlayerSprite;
import org.osmf.display.ScalableSprite; org.osmf.display.ScalableSprite;
import org.osmf.display.ScaleMode; org.osmf.display.ScaleMode;
import org.osmf.display.ScaleModeUtils; org.osmf.display.ScaleModeUtils;
import org.osmf.drm.DRMServices; org.osmf.drm.DRMServices;
import org.osmf.events.AudioEvent; org.osmf.events.AudioEvent;
import org.osmf.events.BeaconEvent; org.osmf.events.BeaconEvent;
import org.osmf.events.BufferEvent; org.osmf.events.BufferEvent;
import org.osmf.events.ContentProtectionEvent; org.osmf.events.ContentProtectionEvent;
import org.osmf.events.DimensionEvent; org.osmf.events.DimensionEvent;
import org.osmf.events.FacetValueChangeEvent; org.osmf.events.FacetValueChangeEvent;
import org.osmf.events.FacetValueEvent; org.osmf.events.FacetValueEvent;
import org.osmf.events.GatewayChangeEvent; org.osmf.events.GatewayChangeEvent;
import org.osmf.events.LoadEvent; org.osmf.events.LoadEvent;
import org.osmf.events.LoaderEvent; org.osmf.events.LoaderEvent;
import org.osmf.events.MediaElementEvent; org.osmf.events.MediaElementEvent;
import org.osmf.events.MediaError; org.osmf.events.MediaError;
import org.osmf.events.MediaErrorCodes; org.osmf.events.MediaErrorCodes;
import org.osmf.events.MediaErrorEvent; org.osmf.events.MediaErrorEvent;
import org.osmf.events.MediaPlayerCapabilityChangeEvent; org.osmf.events.MediaPlayerCapabilityChangeEvent;
import org.osmf.events.MediaPlayerStateChangeEvent; org.osmf.events.MediaPlayerStateChangeEvent;
import org.osmf.events.MetadataEvent; org.osmf.events.MetadataEvent;
import org.osmf.events.NetConnectionFactoryEvent; org.osmf.events.NetConnectionFactoryEvent;
import org.osmf.events.NetNegotiatorEvent; org.osmf.events.NetNegotiatorEvent;
import org.osmf.events.PausedChangeEvent; org.osmf.events.PausedChangeEvent;
import org.osmf.events.PlayingChangeEvent; org.osmf.events.PlayingChangeEvent;
import org.osmf.events.PluginLoadEvent; org.osmf.events.PluginLoadEvent;
import org.osmf.events.SeekEvent; org.osmf.events.SeekEvent;
import org.osmf.events.SwitchEvent; org.osmf.events.SwitchEvent;
import org.osmf.events.TimeEvent; org.osmf.events.TimeEvent;
import org.osmf.events.ViewEvent; org.osmf.events.ViewEvent;
import org.osmf.gateways.HTMLGateway; org.osmf.gateways.HTMLGateway;
import org.osmf.gateways.RegionGateway; org.osmf.gateways.RegionGateway;
import org.osmf.html.HTMLElement; org.osmf.html.HTMLElement;
import org.osmf.image.ImageElement; org.osmf.image.ImageElement;
import org.osmf.image.ImageLoader; org.osmf.image.ImageLoader;
import org.osmf.layout.AbsoluteLayoutFacet; org.osmf.layout.AbsoluteLayoutFacet;
import org.osmf.layout.AnchorLayoutFacet; org.osmf.layout.AnchorLayoutFacet;
import org.osmf.layout.DefaultLayoutRenderer; org.osmf.layout.DefaultLayoutRenderer;
import org.osmf.layout.ILayoutContext; org.osmf.layout.ILayoutContext;
import org.osmf.layout.ILayoutRenderer; org.osmf.layout.ILayoutRenderer;
import org.osmf.layout.ILayoutTarget; org.osmf.layout.ILayoutTarget;
import org.osmf.layout.LayoutAttributesFacet; org.osmf.layout.LayoutAttributesFacet;
import org.osmf.layout.LayoutContextSprite; org.osmf.layout.LayoutContextSprite;
import org.osmf.layout.LayoutRendererBase; org.osmf.layout.LayoutRendererBase;
import org.osmf.layout.LayoutRendererFacet; org.osmf.layout.LayoutRendererFacet;
import org.osmf.layout.LayoutUtils; org.osmf.layout.LayoutUtils;
import org.osmf.layout.MediaElementLayoutTarget; org.osmf.layout.MediaElementLayoutTarget;
import org.osmf.layout.PaddingLayoutFacet; org.osmf.layout.PaddingLayoutFacet;
import org.osmf.layout.RegistrationPoint; org.osmf.layout.RegistrationPoint;
import org.osmf.layout.RelativeLayoutFacet; org.osmf.layout.RelativeLayoutFacet;
import org.osmf.logging.ILogger; org.osmf.logging.ILogger;
import org.osmf.logging.ILoggerFactory; org.osmf.logging.ILoggerFactory;
import org.osmf.logging.Log; org.osmf.logging.Log;
import org.osmf.logging.TraceLogger; org.osmf.logging.TraceLogger;
import org.osmf.logging.TraceLoggerFactory; org.osmf.logging.TraceLoggerFactory;
import org.osmf.media.DefaultMediaResourceHandlerResolver; org.osmf.media.DefaultMediaResourceHandlerResolver;
import org.osmf.media.IContainerGateway; org.osmf.media.IContainerGateway;
import org.osmf.media.IMediaGateway; org.osmf.media.IMediaGateway;
import org.osmf.media.IMediaReferrer; org.osmf.media.IMediaReferrer;
import org.osmf.media.IMediaResource; org.osmf.media.IMediaResource;
import org.osmf.media.IMediaResourceHandler; org.osmf.media.IMediaResourceHandler;
import org.osmf.media.IMediaResourceHandlerResolver; org.osmf.media.IMediaResourceHandlerResolver;
import org.osmf.media.IMediaTrait; org.osmf.media.IMediaTrait;
import org.osmf.media.IURLResource; org.osmf.media.IURLResource;
import org.osmf.media.LoadableMediaElement; org.osmf.media.LoadableMediaElement;
import org.osmf.media.MediaElement; org.osmf.media.MediaElement;
import org.osmf.media.MediaFactory; org.osmf.media.MediaFactory;
import org.osmf.media.MediaInfo; org.osmf.media.MediaInfo;
import org.osmf.media.MediaInfoType; org.osmf.media.MediaInfoType;
import org.osmf.media.MediaPlayer; org.osmf.media.MediaPlayer;
import org.osmf.media.MediaPlayerState; org.osmf.media.MediaPlayerState;
import org.osmf.media.URLResource; org.osmf.media.URLResource;
import org.osmf.metadata.IFacet; org.osmf.metadata.IFacet;
import org.osmf.metadata.IIdentifier; org.osmf.metadata.IIdentifier;
import org.osmf.metadata.KeyValueFacet; org.osmf.metadata.KeyValueFacet;
import org.osmf.metadata.MediaType; org.osmf.metadata.MediaType;
import org.osmf.metadata.MediaTypeFacet; org.osmf.metadata.MediaTypeFacet;
import org.osmf.metadata.Metadata; org.osmf.metadata.Metadata;
import org.osmf.metadata.MetadataNamespaces; org.osmf.metadata.MetadataNamespaces;
import org.osmf.metadata.MetadataUtils; org.osmf.metadata.MetadataUtils;
import org.osmf.metadata.MetadataWatcher; org.osmf.metadata.MetadataWatcher;
import org.osmf.metadata.MimeTypes; org.osmf.metadata.MimeTypes;
import org.osmf.metadata.ObjectFacet; org.osmf.metadata.ObjectFacet;
import org.osmf.metadata.ObjectIdentifier; org.osmf.metadata.ObjectIdentifier;
import org.osmf.metadata.StringIdentifier; org.osmf.metadata.StringIdentifier;
import org.osmf.metadata.TemporalFacet; org.osmf.metadata.TemporalFacet;
import org.osmf.metadata.TemporalFacetEvent; org.osmf.metadata.TemporalFacetEvent;
import org.osmf.metadata.TemporalIdentifier; org.osmf.metadata.TemporalIdentifier;
import org.osmf.net.NetClient; org.osmf.net.NetClient;
import org.osmf.net.NetConnectionAttempt; org.osmf.net.NetConnectionAttempt;
import org.osmf.net.NetConnectionCodes; org.osmf.net.NetConnectionCodes;
import org.osmf.net.NetConnectionFactory; org.osmf.net.NetConnectionFactory;
import org.osmf.net.NetLoadedContext; org.osmf.net.NetLoadedContext;
import org.osmf.net.NetLoader; org.osmf.net.NetLoader;
import org.osmf.net.NetNegotiator; org.osmf.net.NetNegotiator;
import org.osmf.net.NetStreamAudibleTrait; org.osmf.net.NetStreamAudibleTrait;
import org.osmf.net.NetStreamBufferableTrait; org.osmf.net.NetStreamBufferableTrait;
import org.osmf.net.NetStreamCodes; org.osmf.net.NetStreamCodes;
import org.osmf.net.NetStreamContentProtectableTrait; org.osmf.net.NetStreamContentProtectableTrait;
import org.osmf.net.NetStreamDownloadableTrait; org.osmf.net.NetStreamDownloadableTrait;
import org.osmf.net.NetStreamPausableTrait; org.osmf.net.NetStreamPausableTrait;
import org.osmf.net.NetStreamPlayableTrait; org.osmf.net.NetStreamPlayableTrait;
import org.osmf.net.NetStreamSeekableTrait; org.osmf.net.NetStreamSeekableTrait;
import org.osmf.net.NetStreamTemporalTrait; org.osmf.net.NetStreamTemporalTrait;
import org.osmf.net.NetStreamUtils; org.osmf.net.NetStreamUtils;
import org.osmf.net.StreamType; org.osmf.net.StreamType;
import org.osmf.net.StreamingURLResource; org.osmf.net.StreamingURLResource;
import org.osmf.net.dynamicstreaming.DroppedFramesRule; org.osmf.net.dynamicstreaming.DroppedFramesRule;
import org.osmf.net.dynamicstreaming.DynamicNetStream; org.osmf.net.dynamicstreaming.DynamicNetStream;
import org.osmf.net.dynamicstreaming.DynamicStreamingItem; org.osmf.net.dynamicstreaming.DynamicStreamingItem;
import org.osmf.net.dynamicstreaming.DynamicStreamingNetLoadedContext; org.osmf.net.dynamicstreaming.DynamicStreamingNetLoadedContext;
import org.osmf.net.dynamicstreaming.DynamicStreamingNetLoader; org.osmf.net.dynamicstreaming.DynamicStreamingNetLoader;
import org.osmf.net.dynamicstreaming.DynamicStreamingResource; org.osmf.net.dynamicstreaming.DynamicStreamingResource;
import org.osmf.net.dynamicstreaming.INetStreamMetrics; org.osmf.net.dynamicstreaming.INetStreamMetrics;
import org.osmf.net.dynamicstreaming.ISwitchingRule; org.osmf.net.dynamicstreaming.ISwitchingRule;
import org.osmf.net.dynamicstreaming.InsufficientBandwidthRule; org.osmf.net.dynamicstreaming.InsufficientBandwidthRule;
import org.osmf.net.dynamicstreaming.InsufficientBufferRule; org.osmf.net.dynamicstreaming.InsufficientBufferRule;
import org.osmf.net.dynamicstreaming.MetricsProvider; org.osmf.net.dynamicstreaming.MetricsProvider;
import org.osmf.net.dynamicstreaming.NetStreamSwitchableTrait; org.osmf.net.dynamicstreaming.NetStreamSwitchableTrait;
import org.osmf.net.dynamicstreaming.SufficientBandwidthRule; org.osmf.net.dynamicstreaming.SufficientBandwidthRule;
import org.osmf.net.dynamicstreaming.SwitchingDetail; org.osmf.net.dynamicstreaming.SwitchingDetail;
import org.osmf.net.dynamicstreaming.SwitchingDetailCodes; org.osmf.net.dynamicstreaming.SwitchingDetailCodes;
import org.osmf.net.dynamicstreaming.SwitchingRuleBase; org.osmf.net.dynamicstreaming.SwitchingRuleBase;
import org.osmf.plugin.IPluginInfo; org.osmf.plugin.IPluginInfo;
import org.osmf.plugin.PluginClassResource; org.osmf.plugin.PluginClassResource;
import org.osmf.proxies.ListenerProxyElement; org.osmf.proxies.ListenerProxyElement;
import org.osmf.proxies.ProxyElement; org.osmf.proxies.ProxyElement;
import org.osmf.proxies.TemporalProxyElement; org.osmf.proxies.TemporalProxyElement;
import org.osmf.swf.SWFElement; org.osmf.swf.SWFElement;
import org.osmf.swf.SWFLoader; org.osmf.swf.SWFLoader;
import org.osmf.tracking.Beacon; org.osmf.tracking.Beacon;
import org.osmf.tracking.BeaconElement; org.osmf.tracking.BeaconElement;
import org.osmf.traits.AudibleTrait; org.osmf.traits.AudibleTrait;
import org.osmf.traits.BufferableTrait; org.osmf.traits.BufferableTrait;
import org.osmf.traits.ContentProtectableTrait; org.osmf.traits.ContentProtectableTrait;
import org.osmf.traits.DownloadableTrait; org.osmf.traits.DownloadableTrait;
import org.osmf.traits.IAudible; org.osmf.traits.IAudible;
import org.osmf.traits.IBufferable; org.osmf.traits.IBufferable;
import org.osmf.traits.IContentProtectable; org.osmf.traits.IContentProtectable;
import org.osmf.traits.IDisposable; org.osmf.traits.IDisposable;
import org.osmf.traits.IDownloadable; org.osmf.traits.IDownloadable;
import org.osmf.traits.ILoadable; org.osmf.traits.ILoadable;
import org.osmf.traits.ILoadedContext; org.osmf.traits.ILoadedContext;
import org.osmf.traits.ILoader; org.osmf.traits.ILoader;
import org.osmf.traits.IPausable; org.osmf.traits.IPausable;
import org.osmf.traits.IPlayable; org.osmf.traits.IPlayable;
import org.osmf.traits.ISeekable; org.osmf.traits.ISeekable;
import org.osmf.traits.ISpatial; org.osmf.traits.ISpatial;
import org.osmf.traits.ISwitchable; org.osmf.traits.ISwitchable;
import org.osmf.traits.ITemporal; org.osmf.traits.ITemporal;
import org.osmf.traits.IViewable; org.osmf.traits.IViewable;
import org.osmf.traits.LoadState; org.osmf.traits.LoadState;
import org.osmf.traits.LoadableTrait; org.osmf.traits.LoadableTrait;
import org.osmf.traits.LoaderBase; org.osmf.traits.LoaderBase;
import org.osmf.traits.MediaTraitBase; org.osmf.traits.MediaTraitBase;
import org.osmf.traits.MediaTraitType; org.osmf.traits.MediaTraitType;
import org.osmf.traits.PausableTrait; org.osmf.traits.PausableTrait;
import org.osmf.traits.PlayableTrait; org.osmf.traits.PlayableTrait;
import org.osmf.traits.SeekableTrait; org.osmf.traits.SeekableTrait;
import org.osmf.traits.SpatialTrait; org.osmf.traits.SpatialTrait;
import org.osmf.traits.SwitchableTrait; org.osmf.traits.SwitchableTrait;
import org.osmf.traits.TemporalTrait; org.osmf.traits.TemporalTrait;
import org.osmf.traits.ViewableTrait; org.osmf.traits.ViewableTrait;
import org.osmf.utils.BinarySearch; org.osmf.utils.BinarySearch;
import org.osmf.utils.FMSHost; org.osmf.utils.FMSHost;
import org.osmf.utils.FMSURL; org.osmf.utils.FMSURL;
import org.osmf.utils.HTTPLoadedContext; org.osmf.utils.HTTPLoadedContext;
import org.osmf.utils.HTTPLoader; org.osmf.utils.HTTPLoader;
import org.osmf.utils.OSMFStrings; org.osmf.utils.OSMFStrings;
import org.osmf.utils.URL; org.osmf.utils.URL;
import org.osmf.utils.Version; org.osmf.utils.Version;
import org.osmf.video.CuePoint; org.osmf.video.CuePoint;
import org.osmf.video.CuePointType; org.osmf.video.CuePointType;
import org.osmf.video.VideoElement; org.osmf.video.VideoElement;
}

}

