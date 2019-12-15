var moment = require('moment');
// Our random generator
const uuidv4 = require('uuid/v4');
let maxArraySize = 10000000;    // WARNING! Make sure you increase your Node --max-old-space-size (hits around 4GB)
//let maxArraySize = 20;

(() => {
    let startBuildTest = moment();
    // Use the same word list for all tests to make it fair
    let wordList = buildWordList();
    let endBuildTest = moment();
    let testBuildDuration = moment.duration(endBuildTest.diff(startBuildTest));
    let testBuildSeconds = testBuildDuration.asSeconds();
    console.log('testBuildSeconds', testBuildSeconds);

    // Build our indexed obj array for our last test.
    let startIndexTest = moment();
    // Use the same word list for all tests to make it fair
    let indexedObj = createIndexArr(wordList);
    let endIndexTest = moment();
    let testIndexDuration = moment.duration(endIndexTest.diff(startIndexTest));
    let testIndexSeconds = testIndexDuration.asSeconds();
    console.log('testIndexSeconds', testIndexSeconds);

    // The string we want to find.
    let ourStringToFind =  wordList[Math.floor(Math.random() * Math.floor(maxArraySize))];
    
    wrapBenchmark('forLoop', forLoop, wordList, ourStringToFind);
  //  wrapBenchmark('forIn', forIn, wordList, ourStringToFind);
    wrapBenchmark('forEach', forEach, wordList, ourStringToFind);
    wrapBenchmark('indexOf', indexOf, wordList, ourStringToFind);
   // wrapBenchmark('stabInTheDark', stabInTheDark, wordList, ourStringToFind);
    wrapBenchmark('searchInIndexed', searchInIndexed, indexedObj, ourStringToFind)
})();

function wrapBenchmark(functionName, functionToRun, array, ourStringToFind){
    let startTest = moment();
    for(let i = 0; i < 1; i++){
        functionToRun(array, ourStringToFind);
    }
    let endTest = moment();
    let testduration = moment.duration(endTest.diff(startTest));
    let testSeconds = testduration.asSeconds();
    console.log(functionName, testSeconds);
};

function forLoop(array, stringToFind){
    for(let i = 0 ; i < maxArraySize; i++) {
        if(array[i] === stringToFind){
            return true;
        }
    }
}

function forIn(array, stringToFind){
    for (let val in array) {
        if(val === stringToFind){
            return true;
        }
    }
}

function forEach(array, stringToFind){
    array.forEach(val => {
        if(val === stringToFind){
            return true;
        }
    });
}

/**
 * Is JS built in method the most "optimised"?
 */
function indexOf(array, stringToFind){
    return array.indexOf(stringToFind);
}

/**
 * This one is interesting as we're not going to keep track of ones we've already done, since we're "stabbing in the dark".
 */
function stabInTheDark(array, stringToFind){
    // We don't need to protect the loop because we know the array item exists, it might just take a while.
    while(true){
        let index = Math.floor(Math.random() * Math.floor(maxArraySize));
        if(array[index] === stringToFind){
            return true;
        }
    }
}

function searchInIndexed(indexedObj, stringToFind){
    let firstChar = stringToFind[0];
    let n = indexedObj[firstChar].length;
    for(let i = 0 ; i < n; i++) {
        if(indexedObj[firstChar][i] === stringToFind){
            return true;
        }
    }
}

function createIndexArr(array){
    // Our indexed object
    let newObj = {}
    for(let i = 0 ; i < maxArraySize; i++) {
        // We'll use the first character of the string to base our index. Could in the range of [a-z,1-9]
        let firstChar = array[i][0];
        if(newObj[firstChar]){
            newObj[firstChar].push(array[i]);
        } else {
            newObj[firstChar] = [array[i]];
        }
    }
    console.log(newObj)
    return newObj;
}

function buildWordList(){
    let arr = [];
    for(let i = 0; i < maxArraySize; i++){
        arr.push(uuidv4());
    }
    return arr;
}