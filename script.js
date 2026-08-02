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
doc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



const firebaseConfig = {

apiKey: "AIzaSyDLWjVuuRU2HB7agBy1D0W5jzuDl2jJkB4",

authDomain: "digital-shop-ebea5.firebaseapp.com",

projectId: "digital-shop-ebea5",

storageBucket: "digital-shop-ebea5.firebasestorage.app",

messagingSenderId: "643413206306",

appId: "1:643413206306:web:c232968f4dca8fbf0d317b"

};



const adminEmail="mdrayhn3331@gmail.com";


const app=initializeApp(firebaseConfig);

const auth=getAuth(app);

const db=getFirestore(app);





window.register=function(){

let email=document.getElementById("user").value;

let password=document.getElementById("pass").value;


createUserWithEmailAndPassword(
auth,email,password
)

.then(()=>{

alert("Account Created ✅");

openDashboard(email);

loadProductsUser();

})

.catch(e=>alert(e.message));


}





window.login=function(){

let email=document.getElementById("user").value;

let password=document.getElementById("pass").value;


signInWithEmailAndPassword(
auth,email,password
)

.then(()=>{


alert("Login Success 🎉");


openDashboard(email);


loadProductsUser();



if(email===adminEmail){

document.getElementById("adminPanel").style.display="block";

loadAdminProducts();

}


})

.catch(e=>alert(e.message));


}




function openDashboard(email){

document.getElementById("shop").style.display="none";

document.getElementById("dashboard").style.display="block";

document.getElementById("username").innerHTML=email;

}





window.logout=function(){

signOut(auth)

.then(()=>{

document.getElementById("dashboard").style.display="none";

document.getElementById("shop").style.display="block";

alert("Logout ✅");

});


}// ================= ADD PRODUCT =================

window.addProduct=function(){

let name=document.getElementById("pname").value;
let price=document.getElementById("pprice").value;
let image=document.getElementById("pimage").value;


if(name=="" || price==""){

alert("Fill Product Info");

return;

}


addDoc(collection(db,"products"),{

name:name,
price:Number(price),
image:image

})

.then(()=>{

alert("Product Added ✅");

loadAdminProducts();

loadProductsUser();

});


}






// ================= ADMIN PRODUCTS =================


window.loadAdminProducts=function(){

let box=document.getElementById("adminProducts");

if(!box)return;


box.innerHTML="";


getDocs(collection(db,"products"))

.then(snapshot=>{


snapshot.forEach(item=>{


let data=item.data();


box.innerHTML+=`

<div class="card">

<img src="${data.image}" width="100%">

<h3>${data.name}</h3>

<p>$${data.price}</p>


<button onclick="window.removeProduct('${item.id}')">

Delete ❌

</button>


</div>

`;


});


});


}







// ================= USER PRODUCTS =================


window.loadProductsUser=function(){

let box=document.getElementById("products");

if(!box)return;


box.innerHTML="";


getDocs(collection(db,"products"))

.then(snapshot=>{


snapshot.forEach(item=>{


let data=item.data();


box.innerHTML+=`

<div class="card">


<img src="${data.image}" width="100%">


<h3>${data.name}</h3>


<p>Price: $${data.price}</p>



<button onclick="window.addCart('${data.name}',${data.price})">

Add Cart 🛒

</button>



</div>

`;


});


});


}







// ================= DELETE =================


window.removeProduct=function(id){


deleteDoc(doc(db,"products",id))

.then(()=>{


alert("Deleted ✅");


loadAdminProducts();

loadProductsUser();


});


}








// ================= CART =================


let cart=[];



window.addCart=function(name,price){


cart.push({

name:name,

price:Number(price)

});


showCart();


alert(name+" Added To Cart ✅");


}





function showCart(){


let box=document.getElementById("cartItems");

let count=document.getElementById("cartCount");

let totalBox=document.getElementById("total");


if(!box)return;


box.innerHTML="";


let total=0;



cart.forEach((item,index)=>{


total += item.price;



box.innerHTML+=`

<div class="product">


<h4>${item.name}</h4>


<p>$${item.price}</p>


<button onclick="removeCart(${index})">

Remove ❌

</button>


</div>

`;


});



count.innerHTML=cart.length;

totalBox.innerHTML=total;


}





window.removeCart=function(index){

cart.splice(index,1);

showCart();

}







// ================= ORDER =================


window.placeOrder=function(){


let name=document.getElementById("cname").value;

let phone=document.getElementById("phone").value;

let address=document.getElementById("address").value;


if(name=="" || phone=="" || address==""){

alert("Fill Checkout Info");

return;

}


alert("Order Placed Successfully ✅");


  }
