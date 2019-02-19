function Cookie( data ){
    for ( const key in data )
        if ( key !== 'save' && key !== 'clear')
            this[key] = data[key];
}

Cookie.prototype.save = function( cookie ){
    for ( const key in cookie.getAll())
        cookie.remove(key);
    for ( const key in this )
        cookie.set( key, typeof this[key] === 'object'? JSON.stringify(this[key]) : this[key]);
};

Cookie.prototype.clear = function( cookie ){
    for ( const key in this )
        delete this[key];
    for ( const key in cookie.getAll())
        cookie.remove(key);
};

module.exports = Cookie;