cmd_Makefile := cd ../..; ./vendor/gyp/gyp_main.py -fmake --ignore-environment "--toplevel-dir=." "--depth=." "--generator-output=build/app_test" tests.gyp
