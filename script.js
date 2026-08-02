// Firebase Import

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




// Firebase Config

const firebaseConfig = {

apiKey: "AIzaSyDLWjVuuRU2HB7agBy1D0W5jzuDl2jJkB4",

authDomain: "digital-shop-ebea5.firebaseapp.com",

projectId: "digital-shop-ebea5",

storageBucket: "digital-shop-ebea5.firebasestorage.app",

messagingSenderId: "643413206306",

appId: "1:643413206306:web:c232968f4dca8fbf0d317b"

};



const adminEmail = "mdrayhn3331@gmail.com";



// Firebase Start

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);





// Register

window.register=function(){


let email=document.getElementById("user").value;

let password=document.getElementById("pass").value;


if(email=="" || password==""){

alert("Fill all fields");

return;

}



createUserWithEmailAndPassword(
auth,
email,
password
)

.then(()=>{


alert("Account Created ✅");


showDashboard(email);


loadUserProducts();


})


.catch((error)=>{

alert(error.message);

});


}






// Login


window.login=function(){


let email=document.getElementById("user").value;

let password=document.getElementById("pass").value;



signInWithEmailAndPassword(
auth,
email,
password
)


.then(()=>{


alert("Login Success 🎉");


showDashboard(email);


loadUserProducts();


if(email===adminEmail){

document.getElementById("adminPanel").style.display="block";

loadProducts();

}

else{

document.getElementById("adminPanel").style.display="none";

}



})


.catch((error)=>{

alert(error.message);

});


}






// Dashboard Show

function showDashboard(email){


document.getElementById("shop").style.display="none";

document.getElementById("dashboard").style.display="block";


document.getElementById("username").innerHTML=email;


}






// Logout


window.logout=function(){


signOut(auth)


.then(()=>{


document.getElementById("dashboard").style.display="none";


document.getElementById("adminPanel").style.display="none";


document.getElementById("shop").style.display="block";


alert("Logout Success ✅");


});


}






// Add Product Admin


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

price:price,

image:image


})


.then(()=>{


alert("Product Added ✅");


loadProducts();

loadUserProducts();


});


}







// Admin Product List


window.loadProducts=function(){


let box=document.getElementById("adminProducts");


if(!box)return;


box.innerHTML="";


getDocs(collection(db,"products"))

.then((snapshot)=>{


snapshot.forEach((item)=>{


let data=item.data();


box.innerHTML+=`

<div class="card">


<img src="${data.image}" style="width:100%;border-radius:15px;">


<h3>${data.name}</h3>


<p>Price: $${data.price}</p>



<button onclick="removeProduct('${item.id}')">

Delete ❌

</button>


</div>


`;



});


});


}






// User Product Show


window.loadUserProducts=function(){


let box=document.getElementById("products");


if(!box)return;


box.innerHTML="";


getDocs(collection(db,"products"))

.then((snapshot)=>{


snapshot.forEach((item)=>{


let data=item.data();



box.innerHTML+=`

<div class="card">


<img src="${data.image}" style="width:100%;border-radius:15px;">


<h3>${data.name}</h3>


<p>Price: $${data.price}</p>



<button onclick="addCart('${data.name}',${data.price})">

Add Cart 🛒

</button>


</div>

`;



});


});


}






// Delete Product


window.removeProduct=function(id){


deleteDoc(doc(db,"products",id))


.then(()=>{


alert("Product Deleted ✅");


loadProducts();

loadUserProducts();


});


}







// Cart System


let cartCount=0;

let total=0;



window.addCart=function(name,price){


cartCount++;

total += Number(price);



document.getElementById("cartCount").innerHTML=cartCount;

document.getElementById("total").innerHTML=total;



alert(name+" Added To Cart ✅");


}






// Order


window.placeOrder=function(){


let name=document.getElementById("cname").value;

let phone=document.getElementById("phone").value;



if(name=="" || phone==""){

alert("Fill Checkout Info");

return;

}



alert("Order Placed Successfully ✅");


}
