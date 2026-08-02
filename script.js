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
updateDoc,
getDoc
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

.thenthen(async(userCredential)=>{

let user=userCredential.user;


await setDoc(doc(db,"users",user.uid),{

email:email,

balance:0

});


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

document.getElementById("adminPanel").style.display="block";

loadAdminProducts();

loadBalanceRequests();

}


})

.catch(e=>alert(e.message));

}





function showDashboard(email){

document.getElementById("shop").style.display="none";

document.getElementById("dashboard").style.display="block";

document.getElementById("username").innerHTML=email;

}

async function loadBalance(){

let user=auth.currentUser;

if(!user)return;


let snap=await getDoc(doc(db,"users",user.uid));


if(snap.exists()){

document.getElementById("balance").innerHTML =
snap.data().balance;

}

}




// LOGOUT

window.logout=function(){

signOut(auth).then(()=>{

dashboard.style.display="none";

shop.style.display="block";


});

}





// ADD PRODUCT ADMIN

window.addProduct=function(){

let name=document.getElementById("pname").value;

let price=document.getElementById("pprice").value;

let image=document.getElementById("pimage").value;



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
// ================= USER PRODUCTS =================


function loadProducts(){


let box=document.getElementById("products");


if(!box)return;


box.innerHTML="";


getDocs(collection(db,"products"))

.then(snapshot=>{


snapshot.forEach(item=>{


let p=item.data();


box.innerHTML+=`

<div class="card">


<img src="${p.image}">


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







// ================= ADMIN PRODUCTS =================


function loadAdminProducts(){


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


<p>Price: ৳${p.price}</p>


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


loadAdminProducts();

loadProducts();


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


let sum=0;



cart.forEach((item,index)=>{


sum += item.price;



box.innerHTML+=`

<div class="product">


<h4>${item.name}</h4>


<p>৳${item.price}</p>



<button onclick="removeCart(${index})">

Remove ❌

</button>


</div>

`;



});



count.innerHTML=cart.length;


totalBox.innerHTML=sum;


}





window.removeCart=function(index){


cart.splice(index,1);


showCart();


}







// ================= BUY NOW =================


window.buyNow=function(name,price){


cart=[];


cart.push({

name:name,

price:Number(price)

});


showCart();



document.querySelector(".checkout").scrollIntoView({

behavior:"smooth"

});


alert("Ready For Checkout ✅");


}

// ================= BALANCE REQUEST =================


window.requestBalance=function(){


let amount=document.getElementById("amount").value;

let number=document.getElementById("payNumber").value;

let trx=document.getElementById("trxId").value;

let method=document.getElementById("method").value;



let user=auth.currentUser;



if(!user){

alert("Please Login First");

return;

}



addDoc(collection(db,"balanceRequests"),{


userId:user.uid,

amount:Number(amount),

number:number,

trx:trx,

method:method,

status:"pending"


})


.then(()=>{


alert("Balance Request Sent ✅");


});


}







// ================= ADMIN BALANCE REQUEST =================


function loadBalanceRequests(){


let box=document.getElementById("balanceRequests");


if(!box)return;



box.innerHTML="";


getDocs(collection(db,"balanceRequests"))

.then(snapshot=>{


snapshot.forEach(item=>{


let d=item.data();


box.innerHTML+=`

<div class="card">


<p>

Method: ${d.method}

</p>


<p>

Number: ${d.number}

</p>


<p>

Amount: ৳${d.amount}

</p>


<p>

TRX: ${d.trx}

</p>



<p>

Status: ${d.status}

</p>



<button onclick="approve('${item.id}','${d.userId}',${d.amount})">

Approve ✅

</button>



</div>

`;



});


});


}








// ================= APPROVE BALANCE =================


window.approve=async function(id,userId,amount){



let userRef=doc(db,"users",userId);



let userData=await getDoc(userRef);



if(userData.exists()){



let oldBalance=userData.data().balance || 0;



await updateDoc(userRef,{

balance:oldBalance + amount

});


}



await updateDoc(doc(db,"balanceRequests",id),{


status:"approved"


});



alert("Balance Added Successfully ✅");


loadBalanceRequests();


}








// ================= ORDER SAVE =================


window.placeOrder=function(){



let name=document.getElementById("cname").value;

let phone=document.getElementById("phone").value;

let address=document.getElementById("address").value;



if(name=="" || phone=="" || address==""){


alert("Fill All Info");


return;

}



addDoc(collection(db,"orders"),{


customer:name,

phone:phone,

address:address,

items:cart,

total:cart.reduce((sum,item)=>sum+item.price,0),

date:new Date()


})


.then(()=>{


alert("Order Placed Successfully ✅");


cart=[];


showCart();


});



}

