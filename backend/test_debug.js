try {
    console.log('Loading controller...');
    require('./src/controllers/analyticsController');
    console.log('Controller loaded successfully');

    console.log('Loading routes...');
    require('./src/routes/analyticsRoutes');
    console.log('Routes loaded successfully');
} catch (e) {
    console.error('ERROR LOADING MODULES:');
    console.error(e);
}
