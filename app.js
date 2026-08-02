// ================= FIREBASE IMPORT =================

import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
sendPasswordResetEmail
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc,
getDoc,
setDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



// ================= FIREBASE CONFIG =================

const firebaseConfig = {

apiKey:"AIzaSyDLWjVuuRU2HB7agBy1D0W5jzuDl2jJkB4",

authDomain:"digital-shop-ebea5.firebaseapp.com",

projectId:"digital-shop-ebea5",

storageBucket:"digital-shop-ebea5.firebasestorage.app",

messagingSenderId:"643413206306",

appId:"1:643413206306:web:c232968f4dca8fbf0d317b"

};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);



// ================= REGISTER =================


window.register = function(){


let email=document.getElementById("user").value;

let password=document.getElementById("pass").value;


if(!email || !password){

alert("Email Password দিন");

return;

}



createUserWithEmailAndPassword(auth,email,password)

.then(async(result)=>{


let user=result.user;


await setDoc(doc(db,"users",user.uid),{

email:email,

balance:0,

role:"user"

});


alert("Register Success ✅");


showDashboard(email);


})


.catch(e=>alert(e.message));


}




// ================= LOGIN =================


window.login=function(){


let email=document.getElementById("user").value;

let password=document.getElementById("pass").value;



signInWithEmailAndPassword(auth,email,password)

.then(async(result)=>{


let user=result.user;


let snap=await getDoc(doc(db,"users",user.uid));



alert("Login Success 🎉");


showDashboard(email);



if(snap.exists() && snap.data().role==="admin"){


document.getElementById("adminPanel").style.display="block";


}else{


document.getElementById("adminPanel").style.display="none";


}



})


.catch(e=>alert(e.message));


}




// ================= DASHBOARD =================


function showDashboard(email){


let shop=document.getElementById("shop");

let dash=document.getElementById("dashboard");


if(shop) shop.style.display="none";


if(dash) dash.style.display="block";


let name=document.getElementById("username");


if(name) name.innerHTML=email;


}





// ================= LOGOUT =================


window.logout=function(){


signOut(auth)

.then(()=>{


alert("Logout Done ✅");


location.reload();


})


}
// ================= ADD PRODUCT ADMIN =================


window.addProduct=function(){

let name=document.getElementById("pname").value;
let price=document.getElementById("pprice").value;
let image=document.getElementById("pimage").value;


if(!name || !price){

alert("Product Info দিন");

return;

}


addDoc(collection(db,"products"),{

name:name,

price:Number(price),

image:image,

createdAt:new Date()

})


.then(()=>{

alert("Product Added ✅");

loadProducts();

loadAdminProducts();


});


}




// ================= LOAD PRODUCTS =================


window.loadProducts=function(){


let box=document.getElementById("products");


if(!box)return;


box.innerHTML="";


getDocs(collection(db,"products"))

.then(snapshot=>{


snapshot.forEach(item=>{


let p=item.data();


box.innerHTML += `


<div class="card">


<img src="${p.image}" width="150">


<h3>${p.name}</h3>


<p>Price: ৳${p.price}</p>


<button onclick="addCart('${p.name}',${p.price})">

Add Cart 🛒

</button>


<button onclick="buyNow('${p.name}',${p.price})">

Buy Now ⚡

</button>


</div>


`;



});


});


}







// ================= ADMIN PRODUCT =================


window.loadAdminProducts=function(){


let box=document.getElementById("adminProducts");


if(!box)return;


box.innerHTML="";


getDocs(collection(db,"products"))

.then(snapshot=>{


snapshot.forEach(item=>{


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


alert("Deleted ✅");


loadProducts();

loadAdminProducts();


});


}







// ================= CART =================


let cart = JSON.parse(localStorage.getItem("cart")) || [];




window.addCart=function(name,price){


cart.push({

name:name,

price:Number(price)

});


localStorage.setItem(

"cart",

JSON.stringify(cart)

);


showCart();


alert("Added To Cart ✅");


}






window.showCart=function(){


let box=document.getElementById("cartItems");


let count=document.getElementById("cartCount");


let total=document.getElementById("total");


if(!box)return;


box.innerHTML="";


let sum=0;



cart.forEach((item,index)=>{


sum += item.price;



box.innerHTML+=`


<div>


<h4>${item.name}</h4>

<p>৳${item.price}</p>


<button onclick="removeCart(${index})">

Remove

</button>


</div>


`;



});


if(count)

count.innerHTML=cart.length;


if(total)

total.innerHTML=sum;


}







window.removeCart=function(index){


cart.splice(index,1);


localStorage.setItem(

"cart",

JSON.stringify(cart)

);


showCart();


}






// ================= BUY NOW =================


window.buyNow=function(name,price){


cart=[];


cart.push({

name:name,

price:Number(price)

});


localStorage.setItem(

"cart",

JSON.stringify(cart)

);


showCart();


alert("Ready Checkout ✅");


}






// ================= ORDER =================


window.placeOrder=function(){



let customer=document.getElementById("cname").value;

let phone=document.getElementById("phone").value;

let address=document.getElementById("address").value;



if(!customer || !phone || !address){

alert("সব তথ্য দিন");

return;

}



addDoc(collection(db,"orders"),{


customer:customer,

phone:phone,

address:address,

items:cart,

total:cart.reduce(

(a,b)=>a+b.price,

0

),


status:"Pending",

userId:auth.currentUser.uid,

date:new Date()


})


.then(()=>{


alert("Order Complete ✅");


cart=[];


localStorage.removeItem("cart");


showCart();


});


                                     }
// ================= PAYMENT REQUEST =================


window.requestBalance=function(){


let amount=document.getElementById("amount").value;

let number=document.getElementById("payNumber").value;

let trx=document.getElementById("trxId").value;

let method=document.getElementById("method").value;


let user=auth.currentUser;


if(!user){

alert("আগে Login করুন");

return;

}



if(!amount || !number || !trx){

alert("সব তথ্য দিন");

return;

}



addDoc(collection(db,"balanceRequests"),{


userId:user.uid,

amount:Number(amount),

number:number,

trx:trx,

method:method,

status:"pending",

date:new Date()


})


.then(()=>{


alert("Payment Request Sent ✅");


});


}






// ================= LOAD PAYMENT REQUEST ADMIN =================


window.loadBalanceRequests=function(){


let box=document.getElementById("balanceRequests");


if(!box)return;


box.innerHTML="";


getDocs(collection(db,"balanceRequests"))

.then(snapshot=>{


snapshot.forEach(item=>{


let d=item.data();



box.innerHTML+=`


<div class="card">


<h4>${d.method}</h4>


<p>Number: ${d.number}</p>

<p>Amount: ৳${d.amount}</p>

<p>TRX: ${d.trx}</p>

<p>Status: ${d.status}</p>


<button onclick="approvePayment('${item.id}','${d.userId}',${d.amount})">

Approve ✅

</button>


<button onclick="rejectPayment('${item.id}')">

Reject ❌

</button>


</div>


`;



});


});


}






// ================= APPROVE PAYMENT =================


window.approvePayment=async function(id,userId,amount){


let userRef=doc(db,"users",userId);


let snap=await getDoc(userRef);



if(snap.exists()){


let oldBalance=snap.data().balance || 0;


await updateDoc(userRef,{

balance:oldBalance + amount

});


}



await updateDoc(

doc(db,"balanceRequests",id),

{

status:"approved"

}

);



alert("Payment Approved ✅");


loadBalanceRequests();


}







// ================= REJECT PAYMENT =================


window.rejectPayment=function(id){


updateDoc(

doc(db,"balanceRequests",id),

{

status:"rejected"

}

)


.then(()=>{


alert("Payment Rejected ❌");


loadBalanceRequests();


});


}






// ================= FORGOT PASSWORD =================


window.forgotPassword=function(){


let email=document.getElementById("user").value;


if(!email){


alert("Email দিন");


return;


}



sendPasswordResetEmail(auth,email)


.then(()=>{


alert("Reset Link Sent ✅");


})


.catch(e=>alert(e.message));


}






// ================= LOAD BALANCE =================


window.loadBalance=async function(){


let user=auth.currentUser;


if(!user)return;


let snap=await getDoc(

doc(db,"users",user.uid)

);



if(snap.exists()){


let balance=document.getElementById("balance");


if(balance)

balance.innerHTML=snap.data().balance;


}



}
