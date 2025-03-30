// Includes the data needed for a login request
export type LoginData = {
    action_type: "login",
    email: string,
    password: string,
};

// Includes the data needed for signup request
export type SignupData = {
    action_type: "signup",
    email: string,
    password: string,
    first_name: string,
    last_name: string
};

// Data for profile info
export type ProfileInfo = {
  user_id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
}

// The result recieved after a login request
export type LoginResult = "success" | "user does not exist" | "password incorrect";

// The result recieved after a signup request
export type SignupResult = "success" | "duplicate email";


export const sendLoginRequest = async (login_data: LoginData): Promise<LoginResult> => {  
  // Send POST request to server
  const response = await fetch("http://localhost:8000/index.php/login", {
      method: "POST",
      credentials: "include",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(login_data)  // Extract login data from form
    }
  );

  // Check for bad response status
  if (!response.ok) throw new Error(`Response failed`);

  let response_json = await response.json();

  return response_json["result"];
};

export const sendSignupRequest = async (signup_data: SignupData): Promise<SignupResult> => {
  console.log(`Sending POST request: ${JSON.stringify(signup_data)}`);

  // Send POST request to server
  const response = await fetch("http://localhost:8000/index.php/signup", {
      method: "POST",
      credentials: "include",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(signup_data)
    }
  );

  // Check for bad response status
  if (!response.ok) throw new Error(`Response failed`);

  let response_json = await response.json();

  return response_json["result"];
};

export const sendCheckLoginRequest = async (): Promise<boolean> => {
  // Send POST request to server
  const response = await fetch("http://localhost:8000/index.php/login", {
      method: "POST",
      credentials: "include",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ action_type: "checklogin" })
    }
  );

  // Check for bad response status
  if (!response.ok) throw new Error(`Response failed`);

  let response_json = await response.json();

  console.log()

  return response_json["loggedIn"];
};

export const sendProfileInfoRequest = async (): Promise<ProfileInfo> => {
  const response = await fetch("http://localhost:8000/index.php/profile", {
      method: "POST",
      credentials: "include",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ action_type: "getprofileinfo" })
    }
  );

  // Check for bad response status
  if (!response.ok) throw new Error(`Response failed`);

  const response_json: ProfileInfo = await response.json();

  console.log(response_json);

  return response_json;
};