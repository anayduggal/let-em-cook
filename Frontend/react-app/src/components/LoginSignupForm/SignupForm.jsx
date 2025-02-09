import React from 'react';
import './LoginForm.css';


const Signupform = () => {
    return (
        <form action="action_page.php" method="post">
            <div class="imgcontainer">
                <img src="img_avatar2.png" alt="Avatar" class="avatar" />
            </div>
      
        <div class="container">

          <label for="f_name"><b>First Name</b></label>
          <input type="text" placeholder="Enter Last Name" name="f_name" required />

          <label for="l_name"><b>Last Name</b></label>
          <input type="text" placeholder="Enter Last Name" name="l_name" required />

          <label for="email"><b>Email</b></label>
          <input type="text" placeholder="Enter Email" name="email" required />
      
          <label for="psw"><b>Password</b></label>
          <input type="password" placeholder="Enter Password" name="psw" required />

          <label for="psw2"><b>Re-enter Password</b></label>
          <input type="text" placeholder="Enter password" name="psw2" required />
      
          <button type="submit">Login</button>
          <label>
            <input type="checkbox" checked="checked" name="remember" /> Remember me
          </label>
        </div>
      
        <div class="container" style="background-color:#f1f1f1">
          <button type="button" class="cancelbtn">Cancel</button>
          <span class="psw"><a href="#">Forgot password?</a></span>
        </div>
      </form>
    );
};

export default SignupForm;