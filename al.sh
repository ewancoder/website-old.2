clear
echo "Choose branch: [master, develop, feature/X]"
read branch
echo Downloading Ewancoder Arch Linux script files for installation...
echo -e "\n-> eal.sh"
curl -O https://raw.githubusercontent.com/ewancoder/eal/$branch/eal.sh
echo -e "\n-> ceal.sh"
curl -O https://raw.githubusercontent.com/ewancoder/eal/$branch/ceal.sh
echo -e "\n-> heal.sh"
curl -O https://raw.githubusercontent.com/ewancoder/eal/$branch/heal.sh
echo -e "\n-> peal.sh"
curl -O https://raw.githubusercontent.com/ewancoder/eal/$branch/peal.sh
echo -e "\n-> install.sh"
curl -O https://raw.githubusercontent.com/ewancoder/eal/$branch/install.sh
echo -e "\n-> root_script.sh"
curl -O https://raw.githubusercontent.com/ewancoder/eal/$branch/root_script.sh
echo -e "\n-> ewancoder_script.sh"
curl -O https://raw.githubusercontent.com/ewancoder/eal/$branch/ewancoder_script.sh
echo -e "\n-> makepkg.patch"
curl -O https://raw.githubusercontent.com/ewancoder/eal/$branch/makepkg.patch
echo -e "\nDownload complete. Making install.sh executable...\n"
chmod +x install.sh
echo -e "Editing ceal.sh"
vim -c "syntax on" ceal.sh
clear
echo -e "Now PREPARE YOUR PARTITIONS, (edit all constants in ceal.sh file) and execute ./install.sh to start installation\n"
