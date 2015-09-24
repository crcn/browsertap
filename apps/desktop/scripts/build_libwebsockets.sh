cd ./vendor/libwebsockets;
rm -rf build;
mkdir build;
cd build;
cmake .. \
-DCMAKE_OSX_DEPLOYMENT_TARGET=10.5 \
-DCMAKE_OSX_ARCHITECTURES=x86_64;i386 \
-DWITHOUT_EXTENSIONS=ON
make