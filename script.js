const signupBox = document.getElementById('signupBox');
const loginBox = document.getElementById('loginBox');

function showSignup(){
  loginBox.style.display='none';
  signupBox.style.display='block';
}
function showLogin(){
  signupBox.style.display='none';
  loginBox.style.display='block';
}

function signup(){
  let u = document.getElementById('signupUser').value.trim();
  let p = document.getElementById('signupPass').value.trim();
  if(!u || !p){ alert("Fill all fields"); return; }
  localStorage.setItem("username", u);
  localStorage.setItem("password", p);
  alert("Account created! Login now");
  showLogin();
}

function login(){
  let u = document.getElementById('loginUser').value.trim();
  let p = document.getElementById('loginPass').value.trim();
  if(u===localStorage.getItem("username") && p===localStorage.getItem("password")){
    localStorage.setItem("logged", true);
    window.location.href="dashboard.html";
  }else{
    alert("Invalid username or password!");
  }
}
