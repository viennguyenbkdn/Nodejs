const { Telegraf } = require('telegraf');
const axios = require('axios').default;

const TOKEN = "5562669561:AAHGZYLG_FR_Si8E6_xN-_lnU2jvaCcLMrI"
const bot = new Telegraf(TOKEN);

const SSH = require('simple-ssh');
const ssh = new SSH({ host: '127.0.0.1', user: 'root', pass: 'Qu@ngvien03dt2' });


// START & HELP MESSAGE

bot.start((ctx) => ctx.reply(`
		Welcome to HAQQ bot.
\t\t - The bot is used to monitor your validator node.
\t\t - Then report event and status of your node.
\t\t - For more detail, please input /help
`));

bot.help((ctx) => ctx.reply(`
 - Firsly, you must add your validator with format
 <b> /validator YOUR_VALIDATOR_ADDRESS </b>
 - Run monitor: <b>/run</b>
 - Stop monitor: <b>/stop</b>
 - Query balance: <b>/query YOUR_WALLET_ADDR</b>
 - Check status: <b>/status</b>
`, {parse_mode: 'html'}));


// STORE and QUERY VALIDATOR INFO
let val_addr = "";
var validator = "";
var validator_status = "Inactive"
var delegations = ""; // Array of current delegator list
var delegations_length = ""; // Number of current delegators
var total_delegate = 0; // Total current delegated asset



bot.command("validator", async (response) => {
    const validatorAddress = response.update.message.text.split('/validator ')[1].trim();
     val_addr = validatorAddress;
    
    // VALIDATOR INFO
    await axios.get(`https://haqq-api.onepiece-cosmos-explorer.xyz/cosmos/staking/v1beta1/validators/${val_addr}`)
    .then((res) => {
 	validator = res.data.validator; // collect status of validator
  	// Check whether validator active or not
  	if (validator.status = "BOND_STATUS_BONDED") { validator_status = "Active" }
     }) .catch((e) => {
     		console.log(e);
     		bot.telegram.sendMessage(response.chat.id, 'Can\'t get info of validator', {});
     });

     // DELEGATION INFO
     await axios.get(`https://haqq-api.onepiece-cosmos-explorer.xyz/cosmos/staking/v1beta1/validators/${val_addr}/delegations`)
     .then((res) => {
        delegations = res.data.delegation_responses; // collect delegation of validator
	delegations_length = delegations.length;
      }) .catch((e) => {
     		console.log(e);
     		bot.telegram.sendMessage(response.chat.id, 'Can\'t get info of delegators ', {});
      });
      for(var i=0; i < delegations_length; i++) {
	      total_delegate = total_delegate + (`${delegations[i].balance.amount}`/1e18); }
	
      // SEND INFO to TELEBOT
	bot.telegram.sendMessage(response.chat.id, `
<b>Nodename: </b> <span class="tg-spoiler"> ${validator.description.moniker} </span>
<b>Website: </b> <i> ${validator.description.website} </i>
<b>Details: </b> <i> ${validator.description.details} </i>
<b>Status: </b> <i> ${validator_status} </i>
<b>Unbonding at block height: </b> <i> ${validator.unbonding_height} </i>
<b>Unbonding at time: </b> <i> ${validator.unbonding_time} </i>
<b>Jailed Status: </b> <i> ${validator.jailed} </i> 
<b>Delegator No.: </b> <i> ${delegations_length} </i>
<b>Total delegate: </b> <i> ${total_delegate} </i>
`
   , { parse_mode: 'html' });

});

// MONITOR
const cron = require('node-cron');
let task = null;

bot.command("run", async (ctx) => 
{
 if (!task) {
 	// console.log(ctx);
        task = cron.schedule('* * * * *', async (cronnode) =>  {
            await axios.get(`https://haqq-api.onepiece-cosmos-explorer.xyz/cosmos/staking/v1beta1/validators/${val_addr}`)
                .then((res) => {
                     var new_validator = res.data.validator; // collect status of validator
		     var new_validator_status = "Inactive"; 	                     
		     // =========================================================
		     // ALERTING TO TELEBOT FOR CHANGING STATUS OF VALIDATOR NODE
		     // =========================================================
		     // Check latest validator status
		     if (new_validator.status = "BOND_STATUS_BONDED") { new_validator_status = "Active" }
		     else { new_validator_status = "Inactive"}
		     
		     // Send alerting to TeleBot if status is changed
		     if (`${validator_status}` != `${new_validator_status}`) {
		     	bot.telegram.sendMessage(ctx.chat.id, `
               		     - Your validator <b>${val_addr}</b> is changed from <b>${validator_status}</b> to <b>${new_validator_status}</b>`
                    	, { parse_mode: 'html' });
			validator_status = new_validator_status;
		     }		

		     // =========================================================
                     // ALERTING TO TELEBOT IF VALIDATOR NODE GET JAILED
                     // =========================================================
	             if (`${validator.jailed}` != "false") {
                        bot.telegram.sendMessage(ctx.chat.id, `
                             - Your validator <b>${val_addr}</b> got jailed.`
                        , { parse_mode: 'html' });
                     }

               	})
            	.catch((e) => {
                    	console.log(e);
                    	bot.telegram.sendMessage(ctx.chat.id, 'Can\'t get info of validator', {});
            	      });
	     
	     await axios.get(`https://haqq-api.onepiece-cosmos-explorer.xyz/cosmos/staking/v1beta1/validators/${val_addr}/delegations`)
     		.then((res) => {
        		var new_delegations = res.data.delegation_responses; // collect latest  delegation of validator
        		var new_delegations_length = new_delegations.length; // latest of number delegator
			var new_total_delegate = 0;
			for(var i=0; i < new_delegations_length; i++) {
                        	new_total_delegate = new_total_delegate + (`${new_delegations[i].balance.amount}`/1e18); }
			// Sending alarm if total delegate is changed
			if (`${total_delegate}` != `${new_total_delegate}`) {
                        bot.telegram.sendMessage(ctx.chat.id, `
                             - Total delegated asset on your node <b>${val_addr}</b> is changed from <b>${total_delegate}</b> to <b>${new_total_delegate}</b>`
                        , { parse_mode: 'html' });
                        total_delegate = new_total_delegate;
                     	}
                        // Sending alarm if total delegator is changed
                        if (`${delegations_length}` != `${new_delegations_length}`) {
                        bot.telegram.sendMessage(ctx.chat.id, `
                             - Number delegator on your node <b>${val_addr}</b> is changed from <b>${delegations_length}</b> to <b>${new_delegations_length}</b>`
                        , { parse_mode: 'html' });
                        delegations_length = new_delegations_length;
                        }


      		}) .catch((e) => {
                	console.log(e);
                	bot.telegram.sendMessage(response.chat.id, 'Can\'t get info of delegators ', {});
      		});

  
  });
        task.start();
}
});

bot.command("stop", async (ctx) => {
        const msg = ctx.update.message.text;
	ctx.reply("Your bot is stopped");
	if (task) task.stop();
    	task = null;

});

bot.launch();
