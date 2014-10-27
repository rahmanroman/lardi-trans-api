lardi-trans.com API
===================

Библиотека для доступа к API транспортно-информационного сервера [lardi-trans.com](http://lardi-trans.com/)

Пример использования:

```javascript
var crypto = require('crypto');
var api = require('lardi-trans-api')('<USER_NAME>', crypto.createHash('md5').update('<USER_PASSWORD>').digest('hex'));

api.distance.calc(from, to).then(function(data) {
	console.log([from, to, data.total_range].join(','));
});
```

Авторизация происходит по __USER_NAME__ /md5(__USER_PASSWORD__)
Каждый метод возвращает `promise`.

Детали о методах см. на [официальном сайте](http://api.lardi-trans.com/).

P.S. Пока реализованы только методы `testSig` и `distance.calc`
