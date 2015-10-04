# This file is generated by gyp; do not edit.

TOOLSET := target
TARGET := app
DEFS_Debug := \
	'-DEXPAT_RELATIVE_PATH' \
	'-DFEATURE_ENABLE_VOICEMAIL' \
	'-DGTEST_RELATIVE_PATH' \
	'-DJSONCPP_RELATIVE_PATH' \
	'-DLOGGING=1' \
	'-DSRTP_RELATIVE_PATH' \
	'-DFEATURE_ENABLE_SSL' \
	'-DFEATURE_ENABLE_PSTN' \
	'-DHAVE_SCTP' \
	'-DHAVE_SRTP' \
	'-DHAVE_WEBRTC_VIDEO' \
	'-DHAVE_WEBRTC_VOICE' \
	'-DWEBRTC_POSIX' \
	'-DWEBRTC_MAC' \
	'-DWEBRTC_INCLUDE_INTERNAL_AUDIO_DEVICE' \
	'-DOSX' \
	'-DCARBON_DEPRECATED=YES' \
	'-DHASH_NAMESPACE=__gnu_cxx' \
	'-DDISABLE_DYNAMIC_CAST' \
	'-D_REENTRANT' \
	'-DDEBUG'

# Flags passed to all source files.
CFLAGS_Debug := \
	-fasm-blocks \
	-mpascal-strings \
	-O0 \
	-gdwarf-2 \
	-mmacosx-version-min=10.5 \
	-arch x86_64 \
	-Wall \
	-Wendif-labels \
	-W \
	-Wno-unused-parameter \
	-Wall \
	-Wendif-labels \
	-W \
	-Wno-unused-parameter

# Flags passed to only C files.
CFLAGS_C_Debug := \
	-fno-strict-aliasing \
	-fno-strict-aliasing

# Flags passed to only C++ files.
CFLAGS_CC_Debug := \
	-std=c++11 \
	-fno-rtti \
	-fno-strict-aliasing \
	-fno-strict-aliasing

# Flags passed to only ObjC files.
CFLAGS_OBJC_Debug :=

# Flags passed to only ObjC++ files.
CFLAGS_OBJCC_Debug :=

INCS_Debug := \
	-I$(srcdir)/. \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/third_party \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/third_party/webrtc \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/webrtc \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libsrtp/srtp \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libyuv/include \
	-I$(srcdir)/vendor/libwebsockets/lib \
	-I$(srcdir)/vendor/libwebsockets/build \
	-I$(srcdir)/vendor/jsoncpp/include

DEFS_Debug_Base := \
	'-DEXPAT_RELATIVE_PATH' \
	'-DFEATURE_ENABLE_VOICEMAIL' \
	'-DGTEST_RELATIVE_PATH' \
	'-DJSONCPP_RELATIVE_PATH' \
	'-DLOGGING=1' \
	'-DSRTP_RELATIVE_PATH' \
	'-DFEATURE_ENABLE_SSL' \
	'-DFEATURE_ENABLE_PSTN' \
	'-DHAVE_SCTP' \
	'-DHAVE_SRTP' \
	'-DHAVE_WEBRTC_VIDEO' \
	'-DHAVE_WEBRTC_VOICE' \
	'-DWEBRTC_POSIX' \
	'-DWEBRTC_MAC' \
	'-DWEBRTC_INCLUDE_INTERNAL_AUDIO_DEVICE' \
	'-DOSX' \
	'-DCARBON_DEPRECATED=YES' \
	'-DHASH_NAMESPACE=__gnu_cxx' \
	'-DDISABLE_DYNAMIC_CAST' \
	'-D_REENTRANT' \
	'-D_DEBUG'

# Flags passed to all source files.
CFLAGS_Debug_Base := \
	-fasm-blocks \
	-mpascal-strings \
	-Os \
	-gdwarf-2 \
	-arch x86_64

# Flags passed to only C files.
CFLAGS_C_Debug_Base :=

# Flags passed to only C++ files.
CFLAGS_CC_Debug_Base :=

# Flags passed to only ObjC files.
CFLAGS_OBJC_Debug_Base :=

# Flags passed to only ObjC++ files.
CFLAGS_OBJCC_Debug_Base :=

INCS_Debug_Base := \
	-I$(srcdir)/. \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/third_party \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/third_party/webrtc \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/webrtc \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libsrtp/srtp \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libyuv/include \
	-I$(srcdir)/vendor/libwebsockets/lib \
	-I$(srcdir)/vendor/libwebsockets/build \
	-I$(srcdir)/vendor/jsoncpp/include

DEFS_Release := \
	'-DEXPAT_RELATIVE_PATH' \
	'-DFEATURE_ENABLE_VOICEMAIL' \
	'-DGTEST_RELATIVE_PATH' \
	'-DJSONCPP_RELATIVE_PATH' \
	'-DLOGGING=1' \
	'-DSRTP_RELATIVE_PATH' \
	'-DFEATURE_ENABLE_SSL' \
	'-DFEATURE_ENABLE_PSTN' \
	'-DHAVE_SCTP' \
	'-DHAVE_SRTP' \
	'-DHAVE_WEBRTC_VIDEO' \
	'-DHAVE_WEBRTC_VOICE' \
	'-DWEBRTC_POSIX' \
	'-DWEBRTC_MAC' \
	'-DWEBRTC_INCLUDE_INTERNAL_AUDIO_DEVICE' \
	'-DOSX' \
	'-DCARBON_DEPRECATED=YES' \
	'-DHASH_NAMESPACE=__gnu_cxx' \
	'-DDISABLE_DYNAMIC_CAST' \
	'-D_REENTRANT' \
	'-DNDEBUG'

# Flags passed to all source files.
CFLAGS_Release := \
	-fasm-blocks \
	-mpascal-strings \
	-O3 \
	-mmacosx-version-min=10.5 \
	-arch x86_64 \
	-Wall \
	-Wendif-labels \
	-W \
	-Wno-unused-parameter \
	-Wall \
	-Wendif-labels \
	-W \
	-Wno-unused-parameter

# Flags passed to only C files.
CFLAGS_C_Release := \
	-fno-strict-aliasing \
	-fno-strict-aliasing

# Flags passed to only C++ files.
CFLAGS_CC_Release := \
	-std=c++11 \
	-fno-rtti \
	-fvisibility-inlines-hidden \
	-fno-strict-aliasing \
	-fno-strict-aliasing

# Flags passed to only ObjC files.
CFLAGS_OBJC_Release :=

# Flags passed to only ObjC++ files.
CFLAGS_OBJCC_Release :=

INCS_Release := \
	-I$(srcdir)/. \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/third_party \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/third_party/webrtc \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/webrtc \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libsrtp/srtp \
	-I$(srcdir)/vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libyuv/include \
	-I$(srcdir)/vendor/libwebsockets/lib \
	-I$(srcdir)/vendor/libwebsockets/build \
	-I$(srcdir)/vendor/jsoncpp/include

OBJS := \
	$(obj).target/$(TARGET)/src/application.o \
	$(obj).target/$(TARGET)/src/commands/commands.o \
	$(obj).target/$(TARGET)/src/active_records/wrtc_connection.o \
	$(obj).target/$(TARGET)/src/active_records/virt_window.o \
	$(obj).target/$(TARGET)/src/plugins/log_operations.o \
	$(obj).target/$(TARGET)/src/core/wrtc/connection.o \
	$(obj).target/$(TARGET)/src/core/wrtc/observers.o \
	$(obj).target/$(TARGET)/src/core/wrtc/core.o \
	$(obj).target/$(TARGET)/src/core/wrtc/printable_video_capturer.o \
	$(obj).target/$(TARGET)/src/core/thread/condition.o \
	$(obj).target/$(TARGET)/src/core/thread/mutex.o \
	$(obj).target/$(TARGET)/src/core/thread/thread.o \
	$(obj).target/$(TARGET)/src/core/thread/manager.o \
	$(obj).target/$(TARGET)/src/core/thread/worker.o \
	$(obj).target/$(TARGET)/src/core/active_record/object.o \
	$(obj).target/$(TARGET)/src/core/active_record/collection.o \
	$(obj).target/$(TARGET)/src/core/active_record/db.o \
	$(obj).target/$(TARGET)/src/core/events/event_emitter.o \
	$(obj).target/$(TARGET)/src/core/io/console.o \
	$(obj).target/$(TARGET)/src/core/io/websockets.o \
	$(obj).target/$(TARGET)/src/core/virt/osx/window.o \
	$(obj).target/$(TARGET)/src/core/virt/osx/desktop.o \
	$(obj).target/$(TARGET)/src/main.o

# Add to the list of files we specially track dependencies for.
all_deps += $(OBJS)

# CFLAGS et al overrides must be target-local.
# See "Target-specific Variable Values" in the GNU Make manual.
$(OBJS): TOOLSET := $(TOOLSET)
$(OBJS): GYP_CFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_C_$(BUILDTYPE))
$(OBJS): GYP_CXXFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_CC_$(BUILDTYPE))
$(OBJS): GYP_OBJCFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_C_$(BUILDTYPE)) $(CFLAGS_OBJC_$(BUILDTYPE))
$(OBJS): GYP_OBJCXXFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_CC_$(BUILDTYPE)) $(CFLAGS_OBJCC_$(BUILDTYPE))

# Suffix rules, putting all outputs into $(obj).

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(srcdir)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# Try building from generated source, too.

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj).$(TOOLSET)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# End of this set of suffix rules
### Rules for final target.
LDFLAGS_Debug := \
	-mmacosx-version-min=10.5 \
	-arch x86_64 \
	-L$(builddir)

LIBTOOLFLAGS_Debug :=

LDFLAGS_Debug_Base := \
	-arch x86_64 \
	-L$(builddir)

LIBTOOLFLAGS_Debug_Base :=

LDFLAGS_Release := \
	-Wl,-dead_strip \
	-mmacosx-version-min=10.5 \
	-arch x86_64 \
	-L$(builddir)

LIBTOOLFLAGS_Release :=

LIBS := \
	/usr/local/bt/remote-desktop-server/vendor/webrtc-build-scripts/ios/webrtc/libjingle_peerconnection_builds/libWebRTC-9725-mac-x86_64-Release.a \
	/usr/local/bt/remote-desktop-server/shared/libwebsockets_darwin.a \
	-lz \
	-framework AudioToolbox \
	-framework AudioUnit \
	-framework CoreAudio \
	-framework CoreVideo \
	-framework OpenGL \
	-framework QTKit \
	-framework AppKit \
	-framework Foundation

$(builddir)/app: GYP_LDFLAGS := $(LDFLAGS_$(BUILDTYPE))
$(builddir)/app: LIBS := $(LIBS)
$(builddir)/app: GYP_LIBTOOLFLAGS := $(LIBTOOLFLAGS_$(BUILDTYPE))
$(builddir)/app: LD_INPUTS := $(OBJS)
$(builddir)/app: TOOLSET := $(TOOLSET)
$(builddir)/app: $(OBJS) FORCE_DO_CMD
	$(call do_cmd,link)

all_deps += $(builddir)/app
# Add target alias
.PHONY: app
app: $(builddir)/app

# Add executable to "all" target.
.PHONY: all
all: $(builddir)/app

