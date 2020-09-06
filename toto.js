onmessage = function(e) {
    console.log('Message reçu depuis le script principal.');
    var workerResult = 'Résultat';
    console.log('Envoi du message de retour au script principal');
    postMessage(workerResult);
}
