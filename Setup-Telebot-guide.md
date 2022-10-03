### Create Telegram bot 
- Using [@BotFather](https://t.me/BotFather) to create your BOT, then store HTTP API of your BOT carefully
![image](https://user-images.githubusercontent.com/91453629/193503710-a5afa251-244f-4d05-9cef-f41a7bead209.png)


- Set environment variable of API BOT in your server
```
echo export TG_API='5562669561:AAHGZYLG_FR_Si8E6_xN-_lnU2jvaCcLMrI' >> $HOME/.bash_profile
source $HOME/.bash_profile
```
- Download repo.
- Add Telegram BOT token to the downloaded file `index.js`
![image](https://user-images.githubusercontent.com/91453629/193504012-c590a2e3-4b9f-4d09-a429-115c71331b8a.png)
- You can edit script `index.js` to add or modify some function
- Set systemd for `npm` process
```
[Unit]
Description=NPM
After=network-online.target

[Service]
User=root
WorkingDirectory=/path/to/your/script/index.js
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```
- Start `npm` from systemd, then your BOT works now
