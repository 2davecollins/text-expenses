class Expense {

    constructor(obj) {
        this._id = generateUUID();
        this.shop = obj.shop;
        this.desc = obj.desc;
        this.whenPurchased = obj.whenPurchased;
        this.total = obj.total;
        this.uploaded = false;
    }
    get expenseId() {
        return this._id;
    }
    get expenseUpLoaded (){
        return this.uploaded;
    }
           
}
var db;
var remoteCouch;

//pouchdb
function showAllExpenses() {
    myViewModel.expenses([]);
    db.allDocs({
        include_docs: true,
        attachments: true
      }).then(function (result) {
        // handle result
        let res = result.rows;        
        res.forEach(function (item){
            myViewModel.expenses.push(item.doc);
        })
        
      }).then(function(){
        console.log("Refreshing List");
        refreshList()
      }).catch(function (err) {
        console.log(err);
      });
}

function addExpenceDB(expenceobj) {
    
    db.put(expenceobj, function callback(err, result) {
      if (!err) {
        console.log('Successfully posted a expense!');
      }
    });
}

function deleteExpense(expense) {
    //TODO remove console log
    db.get(expense._id).then(function(doc){       
        return db.remove(doc._id,doc._rev);
    }).then(function(result){       
        console.log(result);
        showAllExpenses();
    }).catch(function(err){        
        console.log(err);
    })
}

function updateExpense(expense){
    console.log(expense);
    Object.assign(expense,{
        shop:myViewModel.editShop(),
        desc:myViewModel.editDesc(),
        whenPurchased: myViewModel.editDate(),
        total: myViewModel.editTotal()
    })
    console.log(expense)
    db.get(expense._id).then(function(doc) {
        return db.put(expense);
      }).then(function(response) {
        // handle response
            console.log("update  : ")
            console.log(response);
            showAllExpenses();
           
      }).catch(function (err) {
            console.log("Update error")
            console.log(err);
      });
}

function findInDB (datatofind){

    db.find({
        selector: {shop: {$eq: datatofind}}
      }).then(function (result) {
        // handle result
        console.log(result)
      }).catch(function (err) {
        console.log(err);
      });
}

function deteteDB (){

    db.destroy().then(function (response) {
        // success
        console.log(response)
      }).catch(function (err) {
        console.log(err);
      });
}

function generateUUID() { 
    // Generate a UUID for database
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

