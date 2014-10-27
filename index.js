'use strict';

var Q = require('q');
var request	= require('request');
var xml2js	= require('xml2js');

module.exports = function(login, password_md5) {
	var auth = Q.defer(), sig = '';

	function api(method, data, callback) {
		var data = data || {};
		data.method = method;
		
		var callback = callback || function() {};
		
		request({
			url:	'http://api.lardi-trans.com/api/',
			method:	'GET',
			qs:		data,
			
			headers:	{
				"accept":			"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				"accept-language":	"ru,en-us;q=0.8,en",
				"accept-encoding":	"gzip, deflate",
				"connection":		"keep-alive"
			}
		}, function(e, r, body) {
			if(!e) {
				xml2js.parseString(body, {
					explicitArray:	false
				},function(err, data) {
					if(!err && data && data.response)
						callback(err, data.response);
					else
						callback(err, null);
				});
			} else {
				callback(e, null);
			}
		});
	};
	
	function wrap(method, data) {
		var deffered = Q.defer();
		var data = data || {};
		
		auth.promise.then(function() {
			data.sig = sig;
			
			api(method, data, function(e, r) {
				if(!e) 
					deffered.resolve(r);
				else
					deffered.reject(e);
			});
		});
		
		return deffered.promise;
	};
	
	api('auth', {
		'login':	login,
		'password':	password_md5
	}, function(e, data) {
		if(!e && data.sig) {
			sig = data.sig;
			auth.resolve();
		} else {
			auth.reject();
		}
	});
	
	return {
		testSig: function() {
			return wrap('test.sig');
		},
		
		distance: {
			calc: function(from, to) {
				return wrap('distance.calc', {
					towns:	from + '|' + to
				});
			}
		}
	}
};