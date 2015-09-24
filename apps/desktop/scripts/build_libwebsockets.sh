cd ./vendor/libwebsockets;
rm -rf build;
mkdir build;
cd build;
cmake .. -DLWS_IPV6=OFF \
-DCMAKE_OSX_DEPLOYMENT_TARGET=10.5 \
# -DCMAKE_OSX_SYSROOT=/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.11.sdk \
-DWITHOUT_EXTENSIONS=ON -DWITH_SSL=0 -DLWS_IPV6=OFF -DCMAKE_C_COMPILER=/usr/bin/gcc \
-DCMAKE_INCLUDE_DIRECTORIES_PROJECT_BEFORE=/usr/local/ssl
make