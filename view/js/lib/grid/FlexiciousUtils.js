 /**
 * Created by 19.06.2013-7pm on 28-Apr-15.
 */
angular.module("app").factory('FlexiciousUtils',function(){
	var groupBy= function(dp, prop, nullValue,filterfunction,additionalProperties,  useOtherBucket, childrenPropName) {
		if(!additionalProperties)
			additionalProperties=[];
		if(!nullValue)
			nullValue = "None";
		var buckets = {};
		buckets.length = 0;
		var key = {};
		var result = [];
		//iterate through the flat list and create a hierarchy
		if(useOtherBucket){
			buckets.other = [];
			buckets.length += 1;
		}
		for(var i = 0; i < dp.length;i++){
			var item = dp[i];
			key = item ? flexiciousNmsp.UIUtils.resolveExpression(item,prop) : ""; //the parent
			if(!key)
				key="";
			if(typeof key == "string")
				key = (key.toString().trim());

			if(!buckets[key]){
				buckets[key] = [];//the children
				buckets.length += 1;
			}
			if(filterfunction==null || filterfunction(item))
				buckets[key].push(item); //add to the parents child list
			else if(useOtherBucket){
				buckets.other.push(item);
			}
		}
		//for (var i = 0; i < buckets.length; i++){
		Object.keys(buckets).forEach(function(key) {
			//var key = buckets[i];
			if(key == "length") // this way we can eliminate the "length field as data in grouped array"
				return;
			var obj = {};
			obj[prop]= !key||key.toString().trim()==""?nullValue:key;
			if(childrenPropName)
				obj[childrenPropName]=buckets[key];
			else
				obj['children']=buckets[key];
			if(buckets[key].length>0){
				for(var j = 0; j < additionalProperties.length; j++){
					var addProp = additionalProperties[j];
					obj[addProp] = buckets[key][0][addProp];
				}
			}else{
				for(var k = 0; k < additionalProperties.length; k++){
					var addProp = additionalProperties[k];
					obj[addProp] = "";
				}
			}
			if(key == "")
				result.unshift(obj);
			else
				result.push(obj); //create the final structure
		})
		return result; //this will refresh the grid...
	}

	var dateFormat = window.dateFormat = function () {
		var    token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
			timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
			timezoneClip = /[^-+\dA-Z]/g,
			pad = function (val, len) {
				val = String(val);
				len = len || 2;
				while (val.length < len) val = "0" + val;
				return val;
			};

		// Regexes and supporting functions are cached through closure
		return function (date, mask, utc) {
			var dF = dateFormat;

			// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
			if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
				mask = date;
				date = undefined;
			}

			// Passing date through Date applies Date.parse, if necessary
			date = date ? new Date(date) : new Date;
			if (isNaN(date)) throw SyntaxError("invalid date");

			mask = String(dF.masks[mask] || mask || dF.masks["default"]);

			// Allow setting the utc argument via the mask
			if (mask.slice(0, 4) == "UTC:") {
				mask = mask.slice(4);
				utc = true;
			}

			var    _ = utc ? "getUTC" : "get",
				d = date[_ + "Date"](),
				D = date[_ + "Day"](),
				m = date[_ + "Month"](),
				y = date[_ + "FullYear"](),
				H = date[_ + "Hours"](),
				M = date[_ + "Minutes"](),
				s = date[_ + "Seconds"](),
				L = date[_ + "Milliseconds"](),
				o = utc ? 0 : date.getTimezoneOffset(),
				flags = {
					d:    d,
					dd:   pad(d),
					ddd:  dF.i18n.dayNames[D],
					dddd: dF.i18n.dayNames[D + 7],
					m:    m + 1,
					mm:   pad(m + 1),
					mmm:  dF.i18n.monthNames[m],
					mmmm: dF.i18n.monthNames[m + 12],
					yy:   String(y).slice(2),
					yyyy: y,
					h:    H % 12 || 12,
					hh:   pad(H % 12 || 12),
					H:    H,
					HH:   pad(H),
					M:    M,
					MM:   pad(M),
					s:    s,
					ss:   pad(s),
					l:    pad(L, 3),
					L:    pad(L > 99 ? Math.round(L / 10) : L),
					t:    H < 12 ? "a"  : "p",
					tt:   H < 12 ? "am" : "pm",
					T:    H < 12 ? "A"  : "P",
					TT:   H < 12 ? "AM" : "PM",
					Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
					o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
					S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
				};

			return mask.replace(token, function ($0) {
				return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
			});
		};
	}();

// Some common format strings
	dateFormat.masks = {
		"default":      "ddd mmm dd yyyy HH:MM:ss",
		shortDate:      "m/d/yy",
		mediumDate:     "mmm d, yyyy",
		longDate:       "mmmm d, yyyy",
		fullDate:       "dddd, mmmm d, yyyy",
		shortTime:      "h:MM TT",
		mediumTime:     "h:MM:ss TT",
		longTime:       "h:MM:ss TT Z",
		isoDate:        "yyyy-mm-dd",
		isoTime:        "HH:MM:ss",
		isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
		isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
	};

// Internationalization strings
	dateFormat.i18n = {
		dayNames: [
			"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
			"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
		],
		monthNames: [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
			"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		]
	};

	return {
		groupBy : groupBy,
		dateFormat : dateFormat
	}
});



 (function(window){
	 Date.YEAR = 0x00;
	 Date.MONTH = 0x11;
	 Date.DATE = 0x22;
	 Date.HOUR = 0x33;
	 Date.MINUTE = 0x44;
	 Date.SECOND = 0x55;
	 Date.prototype.ceil = function(toFloor){
		 switch (toFloor){
			 case Date.YEAR:
				 this.setMonth(0);
			 case Date.MONTH:
				 this.setDate(1);
			 case Date.DATE:
				 this.setHours(0);
			 case Date.MINUTE:
				 this.setMinutes(0);
			 case Date.SECONDS:
				 this.setSeconds(0);
		 }
		 return this;
	 };

	 Date.prototype.floor = function(toCeil){
		 var monthDays = [31, this.isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30 , 31 ];
		 switch (toCeil){
			 case Date.YEAR:
				 this.setMonth(11);
			 case Date.MONTH:
				 this.setDate(monthDays[this.getMonth()]);
			 case Date.DATE:
				 this.setHours(23);
			 case Date.MINUTE:
				 this.setMinutes(59);
			 case Date.SECONDS:
				 this.setSeconds(59);
		 }
		 return this;
	 };

	 Date.prototype.isLeapYear = function()
	 {
		 var year = this.getYear();
		 return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
	 };

	 Date.prototype.copy = function(){
		 return new Date(this.getTime());
	 };

 }(window));
