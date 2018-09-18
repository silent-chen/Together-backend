// err callback function
let errback = function(err) { console.log(err.message); };

// default trace level and debug level
let trace_level = 3;
const default_debug_level = 0;

let	local =	true;

let	debug_on = true;
let	error_on = true;
let	debug_level = default_debug_level;

let	set_levels = function(debug_it, error_it, is_local, level) {
    debug_on = debug_it;
    error_on = error_it;
    local = is_local;
    debug_level = level;

    console.log("Setting debug to on = " + debug_on + ", error on = " + error_on + ", is local = " + local + ", level = " + debug_level);
};

let console_message = function(str, obj) {
    let	msg = str;
    if ((obj !== null) && (obj !== undefined)) {
        if (local) {
            // when local, add 2 space to improve readability
            msg = msg + " " + JSON.stringify(obj, null, 2);
        }
        else {
            msg = msg + " " + JSON.stringify(obj);
        }
    }
    console.log(msg);
};

let	debug_message = function(str, obj, lv) {
    let	level;
    if ((lv === undefined) || (lv === null)) {
        // change to default level
        level = default_debug_level;
    }
    else {
        level = lv;
    }

    if ((debug_on)&&(level >= debug_level)) {
        console_message(str, obj);
    }
};

let error_message = function(s,o) {
    if (error_on) {
        console_message(s,o);
    }
};


exports.debug_message = debug_message;
exports.error_message = error_message;
exports.set_levels = set_levels;
exports.trace_level = trace_level;
