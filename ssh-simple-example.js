// Firtly, setup ssh-keygen to remote login your server on Linux 
// Below example show how to login remote server by ssh-keygen

const fs = require('fs')
const path = require('path')
const {NodeSSH} = require('node-ssh')

const ssh = new NodeSSH()

ssh.connect({
  host: '65.108.232.174', // Your remote server IP
  username: 'root',
  privateKeyPath: '/root/.ssh/id_rsa', // Your private key on local server
  passphrase: 'Qu@ngvien03dt2' // passphrase of private key
})
.then(function() {
  // Local, Remote'
    ssh.execCommand('ls -al', { cwd:'/root/subspace/' }).then(function(result) {
    console.log('STDOUT: ' + result.stdout); // Show result log
    console.log('STDERR: ' + result.stderr); // Show error log
    ssh.dispose(); // Disconnect session
  })

})
