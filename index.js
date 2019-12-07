console.log('\n----------------- watch file change----------------\n');

const { exec } = require('child_process');
exec('cd src && tsc', (err, stdout, stderr) => {
    if (err) {
        console.error('\n[error]------------->\n', err);
        return;
    }
    console.log('\n[success]!!!\n',stdout);
});