import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



const firebaseConfig={

apiKey:"AIzaSyDLWjVuuRU2HB7agBy1D0W5jzuDl2jJkB4",

authDomain:"digital-shop-ebea5.firebaseapp.com",

projectId:"digital-shop-ebea5",

storageBucket:"digital-shop-ebea5.firebasestorage.app",

messagingSenderId:"643413206306",

appId:"1:643413206306:web:c232968f4dca8fbf0d317b"

};



const adminEmail="mdrayhn3331@gmail.com";


const app=initializeApp(firebaseConfig);

const auth=getAuth(app);

const db=getFirestore(app);




// REGISTER

window.register=function(){

let email=document.getElementById("user").value;

let password=document.getElementById("pass").value;


createUserWithEmailAndPassword(auth,email,password)

.then(()=>{

alert("Account Created ✅");

showDashboard(email);

loadProducts();

})


.catch(e=>alert(e.message));

}






// LOGIN

window.login=function(){

let email=document.getElementById("user").value;

let password=document.getElementById("pass").value;


signInWithEmailAndPassword(auth,email,password)

.then(()=>{


alert("Login Success 🎉");


showDashboard(email);


loadProducts();



if(email===adminEmail){

adminPanel.style.display="block";

loadAdminProducts();

loadBalanceRequests();

}


})

.catch(e=>alert(e.message));


}





function showDashboard(email){

shop.style.display="none";

dashboard.style.display="block";

username.innerHTML=email;

}






// LOGOUT

window.logout=function(){

signOut(auth).then(()=>{

dashboard.style.display="none";

shop.style.display="block";


});

}







// ADD PRODUCT

window.addProduct=function(){


let name=pname.value;

let price=pprice.value;

let image=pimage.value;



addDoc(collection(db,"products"),{

name:name,

price:Number(price),

image:image

})

.then(()=>{

alert("Product Added ✅");

loadAdminProducts();

loadProducts();


});

}






// SHOW PRODUCTS USER

function loadProducts(){


let box=document.getElementById("products");


if(!box)return;


box.innerHTML="";


getDocs(collection(db,"products"))

.then(s=>{


s.forEach(item=>{


let p=item.data();


box.innerHTML+=`

<div class="card">

<img src="${p.image}">

<h3>${p.name}</h3>

<p>Price: ৳${p.price}</p>


<button onclick="addCart('${p.name}',${p.price})">

Add Cart 🛒

</button>


</div>

`;


});


});


}





// ADMIN PRODUCTS

function loadAdminProducts(){

let box=document.getElementById("adminProducts");


if(!box)return;


box.innerHTML="";


getDocs(collection(db,"products"))

.then(s=>{


s.forEach(item=>{


let p=item.data();


box.innerHTML+=`

<div class="card">

<h3>${p.name}</h3>

<p>৳${p.price}</p>


<button onclick="deleteProduct('${item.id}')">

Delete ❌

</button>


</div>

`;


});


});


}





window.deleteProduct=function(id){


deleteDoc(doc(db,"products",id))

.then(()=>{

loadAdminProducts();

loadProducts();

});


}







// CART


let cart=[];


window.addCart=function(name,price){


cart.push({

name:name,

price:Number(price)

});


showCart();


alert("Added ✅");


}




function showCart(){


cartItems.innerHTML="";


let total=0;


cart.forEach(i=>{


total+=i.price;


cartItems.innerHTML+=`

<p>${i.name} - ৳${i.price}</p>

`;


});


cartCount.innerHTML=cart.length;

total.innerHTML=total;


}






// BALANCE REQUEST


window.requestBalance=function(){


let amount=document.getElementById("amount").value;

let number=document.getElementById("payNumber").value;

let trx=document.getElementById("trxId").value;

let method=document.getElementById("method").value;



addDoc(collection(db,"balanceRequests"),{


amount:Number(amount),

number:number,

trx:trx,

method:method,

status:"pending"


})


.then(()=>{

alert("Request Sent ✅");

});


}







// ADMIN BALANCE REQUEST


function loadBalanceRequests(){


let box=document.getElementById("balanceRequests");


getDocs(collection(db,"balanceRequests"))

.then(s=>{


box.innerHTML="";


s.forEach(item=>{


let d=item.data();


box.innerHTML+=`

<div class="card">


<p>
${d.method} 
${d.number}
</p>


<p>
Amount: ৳${d.amount}
</p>


<p>
TRX: ${d.trx}
</p>


<button onclick="approve('${item.id}')">

Approve ✅

</button>


</div>

`;


});


});


}





window.approve=function(id){


updateDoc(doc(db,"balanceRequests",id),{


status:"approved"


})

.then(()=>{

alert("Approved ✅");

loadBalanceRequests();


});


}







// ORDER

window.placeOrder=function(){

alert("Order Placed ✅");

}
