const path    = require('path'),
      express = require('express'),
      app     = express(),
      port    = process.env.PORT || 3200,
      proxy   = require('fire-proxy');

app.use('/api', proxy({
    target: `${process.env.BACKEND|| 'https://taxi.ngrok.kenyip.cc' }/api`
}));

app.use(express.static(path.resolve( __dirname, 'www')));  

app.get('*', (req, res) => {
    res.sendFile(path.resolve( __dirname, 'www', 'index.html'));
});

app.listen( port, ()=>{
    console.log(`Server is listened at port ${port}`);
});