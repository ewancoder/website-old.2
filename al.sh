clear
echo Downloading Ewancoder Arch Linux script files for installation...
echo -e "\n-> eal.sh"
curl -O https://raw.githubusercontent.com/ewancoder/eal/master/eal.sh
echo -e "\n-> ceal.sh"
curl -O https://raw.githubusercontent.com/ewancoder/eal/master/ceal.sh
echo -e "\n-> heal.sh"
curl -O https://raw.githubusercontent.com/ewancoder/eal/master/heal.sh
echo -e "\n-> peal.sh"
curl -O https://raw.githubusercontent.com/ewancoder/eal/master/peal.sh
echo -e "\n-> install.sh"
curl -O https://raw.githubusercontent.com/ewancoder/eal/master/install.sh
echo -e "\n-> makepkg.patch"
curl -O https://raw.githubusercontent.com/ewancoder/eal/master/makepkg.patch
echo -e "\nDownload complete. Making install.sh executable...\n"
chmod +x install.sh
echo -e "Now prepare your partitions, change all constants in ceal.sh file and execute ./install.sh to start installation\n"
