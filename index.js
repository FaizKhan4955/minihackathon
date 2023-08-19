import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import {
  getFirestore, collection,
  query, where,
  addDoc, doc, getDoc, getDocs, setDoc,deleteDoc
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js"
const firebaseConfig = {
  apiKey: "AIzaSyCfTwjneeXFW6g87XiqY6KGT0443VhLKSY",
  authDomain: "hackathon-a8c84.firebaseapp.com",
  projectId: "hackathon-a8c84",
  storageBucket: "hackathon-a8c84.appspot.com",
  messagingSenderId: "759137592075",
  appId: "1:759137592075:web:8e321a83e2c97dfa9df80e",
  measurementId: "G-8DD9QZBD84"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const Signbtn = document.getElementById('sign_btn')
const anchor = document.getElementById('anchor')
const siganchor = document.getElementById('siganchor')
const logbtn = document.getElementById('lgnbtn')
const submitPosts = document.getElementById('submit_post')
const post_container = document.getElementById('post_container')
const Loganchor = document.getElementById('Loganchor')


Loganchor.addEventListener('click', () => {
  signOut(auth).then(() => {
    const DashBoard = document.getElementById('DashBoard')
    DashBoard.style.display = 'none'
    const bloger = document.getElementById('bloger')
    bloger.style.display = 'block'
    const sigmain = document.getElementById('sigmain')
    sigmain.style.display = 'flex'
    Loganchor.style.display = 'none'


  }).catch((error) => {
    // An error happened.
  });
})



onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    // console.log('User uid-->', user)
    const DashBoard = document.getElementById('DashBoard')
    DashBoard.style.display = 'block'
    const sigmain = document.getElementById('sigmain')
    sigmain.style.display = 'none'
    const bloger = document.getElementById('bloger')
    bloger.style.display = 'block'
    getPosts()
    anchor.style.display = 'none'
    siganchor.style.display = 'none'
    Loganchor.style.display = 'block'
    const wel=document.getElementById('welcome')
    wel.style.display='flex'
    welcome.innerHTML = `Welcome ${info.name}`

    const info = await getUserInfo(uid)

  } else {
    console.log('User is not logged in')
    const sigmain = document.getElementById('sigmain')
    sigmain.style.display = 'flex'
    anchor.style.display = 'flex'
    siganchor.style.display = 'flex'
    const bloger = document.getElementById('bloger')
    bloger.style.display = 'block'
    getPosts()

  }
});




submitPosts.addEventListener('click', async function submitPost(e) {
  e.preventDefault()
  const title = document.getElementById('post_title').value
  const description = document.getElementById('post_desc').value
  const userInfo = await getUserInfo(auth.currentUser.uid)
  const info = await getUserInfo(auth.currentUser.uid)

  console.log(userInfo);
  const postObj = {
    title,
    description,
    userUid: auth.currentUser.uid,
    userName: userInfo.name,
    created_at: new Date().getTime().toString()
  }

  const postRef = collection(db, 'Faiz_post')
  await addDoc(postRef, postObj)

  alert('submited')
  getPosts()
  post_form.reset()
})

async function getUserInfo(uid) {
  const userRef = doc(db, "faiz_users", uid)
  const docSnap = await getDoc(userRef);
  let info = null
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    info = docSnap.data()
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }

  return info
}


siganchor.addEventListener('click', (e) => {
  e.preventDefault()

  const logmain = document.getElementById('logmain')
  const sigmain = document.getElementById('sigmain')
  sigmain.style.display = 'flex'
  logmain.style.display = 'none'
})

anchor.addEventListener('click', (e) => {
  e.preventDefault()
  const logmain = document.getElementById('logmain')
  const sigmain = document.getElementById('sigmain')
  sigmain.style.display = 'none'
  logmain.style.display = 'flex'
})

Signbtn.addEventListener('click', (e) => {
  e.preventDefault()
  const email = document.getElementById('Signin_email').value
  const password = document.getElementById('Signin_password').value
  const sigmain = document.getElementById('sigmain')
  const name = document.getElementById('Firstname').value
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {

      const user = userCredential.user;
      console.log();
      alert('Wleocome user Created !')
      sigmain.style.display = 'none'
      const userInfo = {
        name,
        email,
        uid: user.uid
      }
      const userRef = doc(db, 'faiz_users', user.uid)
      await setDoc(userRef, userInfo)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
})

logbtn.addEventListener('click', (e) => {
  e.preventDefault()
  const email = document.getElementById('log_email').value
  const password = document.getElementById('log_pass').value
  const logmain = document.getElementById('logmain')

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      // alert('you are logged in ')
      const user = userCredential.user;
      logmain.style.display = 'none'

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
})



async function getPosts() {
  const q = query(collection(db, "Faiz_post"));

  const querySnapshot = await getDocs(q);
  post_container.innerHTML = null
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    const postInfo = doc.data()
    const { title, created_at, userName, description
    } = postInfo

    

    const card = `<div class="Post_card">
      <div class="card-title card-userInfo">
      <i class="fa-solid fa-clipboard-user"></i>
        <span > Post By  <span style="font-weight: bold ">${userName}</span> </span> 
        <span> ${new Date().toLocaleDateString()} </span> 
       
      </div>
      <div class="card-title">
       ${title}
      </div>
      <div class="card-body"> ${description} </div>
      <br>
      <button id="editbtn" onClick="editpost('${doc.id}')">Edit</button>
      
      <button id="deleteBlog" onClick="delpost ('${doc.id}')">Delete</button>
    </div>`

    post_container.innerHTML += card

    const ed=document.getElementById('editbtn')
  });


}
async function delpost(id){
console.log(id);
await deleteDoc(doc(db, "Faiz_post", id));
}
window.delpost=delpost


// async function editpost(id){
// console.log(id);
// // const tonRef = doc(db, "Faiz_post", id);
// const newt=prompt('add new value')

// console.log(newt);
// // Set the "capital" field of the city 'DC'
// // await updateDoc(tonRef, {
  
// // });


// }
// window.editpost=editpost
