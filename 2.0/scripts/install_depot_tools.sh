mkdir -p /opt
sudo chown `whoami` /opt
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git /opt/depot_tools
export PATH=/opt/depot_tools:"$PATH"
