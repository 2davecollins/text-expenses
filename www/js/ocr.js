function decodeText(){
    const img = myViewModel.imagePath();
    textocr.recText(0,img, onSuccess, onFail)

    function onSuccess(recognisedText){
        
        console.log(recognisedText);
        if(recognisedText.lines){
            setupObj(recognisedText.lines);

        }else{
            myViewModel.errorMsg("cant read from image");
            console.log("Cant read image")
        }
       
    }
    function onFail(message){
        console.log(message);
    }
}

function setupObj (srcObj){
    let dateArr = []
    let totalArr = []
    let priceArr = []
    
    for(var i = 0; i < srcObj.lineframe.length; i++){
        srcObj.lineframe[i].text = srcObj.linetext[i];
    }
    let sortedArray = sortArray(srcObj.lineframe)
    
    //TODO remove  display of string result in GUI
    myViewModel.resultArr(sortedArray);

    //Create an array by grouping items per line    
    let sortedLine = groupLineByLine(sortedArray);
    
    //convert array into a string seperated by \n
    let stdisplay = '';
    let totalP = '';
    let strDisplayFiltered = '';

    for (var itd in sortedLine){
        sortedLine[itd].forEach(function (e){               
                stdisplay += e.text+" ";                              
        })
        stdisplay += "\n";
    }
    // find by Regular Expression date in multipate format 
    // select first date found
    // TODO || today 

    dateArr = findDateStrArray(stdisplay)
    console.log(dateArr)
    myViewModel.editDate(dateArr[0]);

    // filter the display and show only items that contain price

    let strArr = stdisplay.split("\n");
     myViewModel.editShop(strArr[0])
     strArr.forEach( function(item, index){
         if(checkContainsPrice(item)){
            strDisplayFiltered += item;
            console.log(item);    
            strDisplayFiltered += "\n";
             if(checkContainsTotal(item)){
                 totalP = item;
             }             
         }           
     })
     myViewModel.editTotal(getPriceFromTotal(totalP));
     myViewModel.editDesc(strDisplayFiltered);


}
function sortArray(srcArray){
    //TODO 
    // Divide by some better number
    
    srcArray.map(o => { o.x = Math.floor(o.x/100); return o});
    srcArray.map(o => { o.y = Math.floor(o.y/100); return o});    
    srcArray.sort(function(a,b){
        return a['y'] - b['y'] || a['x'] - b['x'];
    })
    return srcArray;
}

function groupLineByLine(myA){
    // group array to combine items on the same line
    let verticalArr = myA.reduce((r, a) => {      
        r[a.y] = [...r[a.y] || [], a];
        return r;
    }, {});
    return verticalArr; 
}

function findDateStrArray(str){
    // Regular expression to find date strings in form
    // dd/mm/yyyy
    // dd/jan/yyyy
    // return an array of all dates found
    // TODO consider format of mm/dd/yy

    let regeditNumbers = /\b\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}\b/ig;
    let regeditMonths = /(\b\d{1,2}\D{0,3})?(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|(Nov|Dec)(?:ember)?)\D?(\d{1,2}\D?)?\D?((19[7-9]\d|20\d{2})|\d{2})/ig
    let res1 = []
    let res2 = []
    if (regeditNumbers.test(str)){
        res1 = str.match(regeditNumbers)
    }if(regeditMonths.test(str)){
       res2 =str.match(regeditMonths)
    }
    return res1.concat(res2)       
}

function checkContainsPrice(str){
    // Regular expression  find if it contains a price xxx.xx space
    const regeditPrice = /\d{1,}[.]\d{2}\b/i;
    return regeditPrice.test(str);
}

function checkContainsTotal(str){
    //Regular expression to find if text contains dictionary
    //Total Bal Cash TODO may be more required
    let regeditTotal = /Total?|Bal(?:ance)?|Cash?/ig;
    return regeditTotal.test(str);
}

function getPriceFromTotal(str){
    // if line contains Total Bal Cash return the decmial value
    const regeditPrice = /\d{1,}[.]\d{2}/i;
    return str.match(regeditPrice);
}