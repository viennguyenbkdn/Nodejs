## Nodejs for cosmos
### 1. INTRODUCTION
- Guide is used to setup TeleBot by Nodejs to monitor and alert some specific events on your validator node, also support to query your balances
- Currently only support HAQQ chain with a little functions, later it will be added more
  - Query status of validator 
  - Check all balances in your wallet 
  - Monitor and alerting some events happened on your node to the BOT, which includes 
    + Validator node gets jailed
    + Validator node changes status between Active and Inactive
    + Number of delegators on your validator node is changed
    + Total delegated asset on your validator node is changed

### 2. Guide of Running Bot
- In your Telegram, seach [TeleBOT](https://t.me/cosmos_sei_bot), then `start` it. You can type `/help` if need support

- **Query your balance**: Input your wallet address as below format with prefix `/balance` 
```
/balance haqq1mc0kvscpucsndf948dnsrrpd954t9l4l9z4zjm
```
![image](https://user-images.githubusercontent.com/91453629/193459486-1a964a77-1283-4198-8438-5045fc365553.png)

- **Query current status of your validator**: Input your validator address as below format with prefix `/validator`
 ```
/validator haqqvaloper1mc0kvscpucsndf948dnsrrpd954t9l4lfqevk6
 ```
![image](https://user-images.githubusercontent.com/91453629/193459357-8eeb3c34-b4d7-47f1-a037-9ef33171485c.png)

- **Start monitoring of your validator node**: 
   - Input validator address with format: `` /validator haqqvaloper1mc0kvscpucsndf948dnsrrpd954t9l4lfqevk6 ``
   - Type `/run` to start monitoring
   - Every minutes, BOT will check and send message if any above specific events is happened. Below is example of alerting of changing validator status or total delegated asset  
![image](https://user-images.githubusercontent.com/91453629/193459733-e3c1e04f-72a5-41fd-ab55-0d34ed2a0ed9.png)

- **Stop monitoring of your validator node**: 
    * Type `/stop` to start monitoring   
 ![image](https://user-images.githubusercontent.com/91453629/193459810-ec507f9e-6cfc-4a2d-9dfa-fd1b6db1790a.png)

 
