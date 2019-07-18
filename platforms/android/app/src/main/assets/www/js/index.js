var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    
    onDeviceReady: function() {
       // this.receivedEvent('deviceready');
       console.log("Device is Ready ....")        
       ko.applyBindings(myViewModel);

       db = new PouchDB('expenses');
       remoteCouch = false;    
       setUpExpense ()
       showAllExpenses()
       $("#expenseip").click(function() {
           console.log("date clicked")
           $('#db1', window.parent.document).get(0).scrollIntoView();
        
       });
       $(document).on("pageshow","#page1", function(){
        console.log("Page1 show")
        myViewModel.canAdd(true);
        myViewModel.canUpdate(false);
    });

       cameraCleanup();  
    },       
};

app.initialize();



var myViewModel = {    
    personName: ko.observable('Dave'),
    idip:ko.observable(0),
    shopid:ko.observable(''),
    descip:ko.observable(''),
    whenPurchasedip:ko.observable(''),
    totalip:ko.observable(''),
    imagePath: ko.observable(''),
    errorMsg: ko.observable(''),
    resultMsg: ko.observable(''),
    resultArr: ko.observableArray([]),
    expenses: ko.observableArray([]),

    editShop: ko.observable(''),
    editDesc: ko.observableArray([]),
    editTotal: ko.observable(''),
    editDate : ko.observable(''),
    editId: ko.observable(0),
    editExp: ko.observable(''),
    editExpenses: ko.observableArray([]),
    canUpdate: ko.observable(false),
    canAdd:ko.observable(true),


    takePicture : function() {
        //use camera       
        takePhotograph();
    },
    retrievePicture : function(){
        //use gallery
        retrievePhotograph();
    },
    readPicture : function(){
        //retrive data from photograph
        decodeText();
        //readPhotograph()
    },
   
    
    resetPhotoExpense : function(){
        const x = this.idip()
        this.idip(x),
        this.editShop(''),
        this.editDesc(''),
        this.editDate(''),
        this.editTotal('')

    },
    
    addExpense : function(){         
        addNewExpense ();    
    },
    patchExpense: function(){
        //addNewExpense ();
        const exp =  myViewModel.editExp();
        updateExpense(exp)        
       

    },
 
    editExpense : function(el){
        console.log(el);
        if(el){
            editDisplay(el);
            myViewModel.canUpdate(true);
            myViewModel.canAdd(false);    
            $.mobile.navigate("#page3");
        }       
    },
    removeExpense : function(el){
        
        console.log(el);
        console.log("-------------")     
        deleteExpense(el)
       
    },
    showExpenses : function(){
        showAllExpenses();
    },
    goToExpensePage : function(){
        myViewModel.canUpdate(false);
        myViewModel.canAdd(true);  
        $.mobile.navigate("#page3");
    }
};



function takePhotograph(){

    const srcType = Camera.PictureSourceType.CAMERA;

    const options = setOptions(srcType);

    navigator.camera.getPicture(onSuccess, onFail, options);
    
    function onSuccess(imageURI) {
       // var image = document.getElementById('myImage');
        myViewModel.imagePath(imageURI);
        console.log(imageURI)
        
    }
    
    function onFail(message) {
        myViewModel.errorMsg('Failed because: ' + message);
    }
}

function retrievePhotograph(){
    const srcType = Camera.PictureSourceType.PHOTOLIBRARY;
    const options = setOptions(srcType);

    navigator.camera.getPicture(onSuccess, onFail, options);
    
    function onSuccess(imageURI) {
       // var image = document.getElementById('myImage');
        myViewModel.imagePath(imageURI);
        console.log(imageURI)
        
    }
    
    function onFail(message) {
        myViewModel.errorMsg('Failed because: ' + message);
    }

}

function cameraCleanup(){
    navigator.camera.cleanup(
        onSuccess,
        onFail
    )
    function onSuccess(data){
        console.log("Cleanup Success");
    }
    function onFail(err){
        console.log("Cleanup fail");
        console.log(err);
    }

}
function setOptions(srcType) {
    // srcTypes
    // Camera.PictureSourceType.CAMERA;
    // Camera.PictureSourceType.PHOTOLIBRARY
    // Camera.PictureSourceType.SAVEDPHOTOALBUM

    // destinationType
    // DATA_URL 0   base64 encoded string
    // FILE_URL 1   file uri
    // NATIVE_URI 2 native uri

    // encodingType
    // JPEG
    // PNG

    // mediaType
    // PICTURE  0  still pictures
    // VIDEO    1  video only
    // ALLMEDIA 2  selection

    // saveToPhotoAlbum boolean 
    // cameraDirection 0 BACK || 1 FRONT 
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}

function setUpExpense (){
    myViewModel.expenses([]);    
};
function editDisplay(expense){    
    // myViewModel.shopid(expense.shop),
    // myViewModel.descip(expense.desc),
    // myViewModel.whenPurchasedip(expense.whenPurchased),
    // myViewModel.totalip(expense.total)
    myViewModel.editExp(expense)
    myViewModel.editShop(expense.shop),
    myViewModel.editDesc(expense.desc),
    myViewModel.editDate(expense.whenPurchased),
    myViewModel.editTotal(expense.total)
    

};

function addNewExpense(){
    let x = myViewModel.editId()
    x++;
    myViewModel.idip(x)
    const exp = {
        id:myViewModel.editId(),
        shop:myViewModel.editShop(),
        desc:myViewModel.editDesc(),
        whenPurchased:myViewModel.editDate(),
        total:myViewModel.editTotal()
    }

    //let exp1 = new Expense(exp);
    addExpenceDB(new Expense(exp));
    myViewModel.resetPhotoExpense();
    myViewModel.expenses.push(exp)     
    // $( "#expenseset" ).collapsibleset( "refresh" );
    // $( "#inputset" ).collapsibleset( "refresh" );
    refreshList();

};


function refreshList (){
    setTimeout(function(){
       
        $( "#expenseset" ).collapsibleset( "refresh" );
        myViewModel.canUpdate(false);
        myViewModel.canAdd(true);  
        $.mobile.navigate("#page1");

    },5);
}

function removeSomeExpense(el){
    console.log(el)
    let x = myViewModel.idip()
    x--;
    myViewModel.idip(x)
    if(x <= 0){
        myViewModel.idip(x)
    }

    let newArr = myViewModel.expenses();
    console.log(myViewModel.expenses().length);
    
    newArr = newArr.filter(x => x.id !== el.id);
    console.log(newArr);
    myViewModel.expenses(newArr);
}

