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
