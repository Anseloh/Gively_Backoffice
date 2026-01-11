import dayjs from 'dayjs';

export default {
    formatCurrency(value, currency = 'USD', language = 'en-US') {
        //currency eg USD
        //language eg fr-FR, en-US
        return new Intl.NumberFormat(language, { style: 'currency', currency: currency }).formatToParts(value).map(
            p => (p.type != 'literal' && p.type != 'currency' ? p.value : '')
        ).join('');
    },
    formatNumber: function(n) {
        const str = n.toString();
        return str[1] ? str : `0${str}`;
    },

    formatToDays: value => {
        if(!value.toLowerCase().includes('z')){
            value = new Date(value);
            value.setUTCHours(value.getHours(),value.getMinutes());
            value.setUTCFullYear(value.getFullYear());
            value.setUTCMonth(value.getMonth());
        }
        return dayjs(value).endOf('day').fromNow();
    },

    getCountries(){
        return require('./countries.json');
    },


    getProgress(targetAmount = 0, currentAmount = 0){
        if(currentAmount == 0 || targetAmount == 0) return 0;
        return Number((currentAmount * 100) / targetAmount).toFixed(2);
    },
    getQueryParams: () => {
        var params = {};
        location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
            if (value === "undefined") {
                value = "";
            }

            params[key] = decodeURIComponent(value);
        });

        // noCache
        if (params.noCache) {
            // clear cache
            this.xwsStorage.clearAll();
        }

        if (params.resetAuth) {
            // clear resetAuth
            this.xwsStorage.clear("token");
            this.xwsStorage.clear("xwsUserInfo");
        }

        return params;
    },
    loadScript: function(path, callback, scriptId) {
        scriptId = scriptId || "external-" + Date.now();
        setTimeout(() => {
            ((d, s, id) => {
                var js;
                var fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.onload = function() {
                    if (typeof callback === "function") callback();
                };
                js.src = path;
                js.type = "text/javascript";
                fjs.parentNode.insertBefore(js, fjs);
            })(document, "script", scriptId);
        }, 300);
    },
    localUserInfo: {
        get: () => {
            const result = localStorage.getItem("xwsUserInfo");

            return result ? JSON.parse(result) : {};
        },
        set: user => {
            localStorage.setItem("xwsUserInfo", JSON.stringify(user));
        },
        clearToken: () => {
            // localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
    },
    localStorage: {
        get(name) {
            const data = localStorage.getItem(name);

            return data === undefined ? null : JSON.parse(data);
        },
        set(name, data) {
            localStorage.setItem(name, JSON.stringify(data));
        },
        clear(name) {
            localStorage.removeItem(name);
        }
    },
    getUUID: function() {
        const id =
            Math.random()
            .toString(36)
            .substring(5) +
            Date.now() +
            Math.floor(1000000 * Math.random()).toString();

        return id;
    },
    getDistinctId: function() {
        let xwsGlobalDistinctId = localStorage.getItem("tzDistinctId");

        if (!xwsGlobalDistinctId) {
            xwsGlobalDistinctId = this.getUUID();
            localStorage.setItem("tzDistinctId", xwsGlobalDistinctId);
        }

        return xwsGlobalDistinctId;
    },
    numberWithUnit: (num = 0, decimal = 1) => {
        if (num >= 10000) {
            return (num / 10000).toFixed(decimal) + "W";
        }
        return num.toFixed(0);
    },
    formatDate: value => {
        if(!value.toLowerCase().includes('z')) {
            value = new Date(value);
            value.setUTCHours(value.getHours(),value.getMinutes());
            value.setUTCFullYear(value.getFullYear());
            value.setUTCMonth(value.getMonth());
        }
        return dayjs(value).format('DD.MM.YYYY hh:mm')
    },
    // formatDate: value => dayjs(String(value)).format('DD.MM.YYYY hh:mm'),
    coverNum: num => {
        if (isNaN(num) || parseInt(num) < 0) {
            return "00";
        }
        if (parseInt(num) < 10) {
            return "0" + num;
        }
        return num;
    },
    debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    },
    debounceLeading(func, timeout = 300) {
        let timer;
        return (...args) => {
            if (!timer) {
                func.apply(this, args);
            }
            clearTimeout(timer);
            timer = setTimeout(() => {
                timer = undefined;
            }, timeout);
        };
    },
    messageTypes: Object.freeze({
        TEXT: 1,
        IMAGE: 2,
        VIDEO: 3,
        AUDIO: 4,
        CASH: 10
    }),
    completeTable(items = []) {
        if (items.length >= 10) return items;
        const loop = 10 - items.length;
        for (let i = 0; i < loop; i++) {
            items.push({});
        }
        return items;
    },
    secondsToDisplayTime(seconds) {
        const date = new Date(seconds * 1000).toISOString();

        if (seconds >= 3600) {
            return date.substr(11, 8);
        }

        return date.substr(14, 5);
    },
    showErrorToast: (vm, msg, title = "Error") => {
        try {
            vm.$bvToast.toast(msg, {
                title: title,
                solid: false,
                toaster: 'b-toaster-top-center',
                variant: 'primary',
            });

        } catch (e) { console.log(e); }
    },
    showInfoToast: (vm, msg, title = "Info") => {

        try {
            vm.$bvToast.toast(msg, {
                title,
                solid: false,
                toaster: 'b-toaster-top-center',
                variant: 'info',
            });
        } catch (e) { console.log(e); }
    }
}