//destructuring
var food = {
    cookie: 1,
    cake: 2
};
var { cookie, cake} = food;

var tenses = ["me", "you", "he"];
var [ firstPerson, secondPerson ] = tenses;

var foo = 2;
var obj = {
    bar: 1,
    foo, //prints out 2
}

//template strings
var name = "Danning";
var thing = "sleep";
var greet = `hi, my name is ${name}
and I like to ${thing}!`;


let promiseToClean = new Promise(function(resolve, reject){
    //cleaning the room

    let isClean = false;
    if(isClean) {
        resolve('Clean');
    } else {
        reject('not Clean');
    }
});

promiseToClean.then(function(fromResolve){
    alert('The room is ' + fromResolve);
}).catch(function(fromReject){
    alert('The room is ' + fromReject)
})
