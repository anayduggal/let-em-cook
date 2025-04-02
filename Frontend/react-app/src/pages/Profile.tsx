import "./Profile.css";
import TopBar from "../components/TopBar";
import {
  sendProfileInfoRequest,
  ProfileInfo,
  updateDietaryPreferences,
  updateAllergens,
  logOut,
  verifyPassword,
  changePassword,
  deleteAccount
} from "../api/userService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ProfileCard = () => {
  const navigate = useNavigate();

  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);

  // Flag for setting preferences/allergens
  const [updateDatabaseFlag, setUpdateDatabaseFlag] = useState<boolean>(false);

  useEffect(() => {
    if (updateDatabaseFlag) {
      updateDietaryPreferences(dietaryPreferences);
    }
  }, [dietaryPreferences]); // Runs after dietary preferences changes (doesn't happen immediately)

  useEffect(() => {
    if (updateDatabaseFlag) {
      updateAllergens(allergens);
    }
  }, [allergens]); // Runs after allergens changes (doesn't happen immediately)

  const dietaryOptions = ["gluten-free", "dairy-free", "vegan", "vegetarian"];
  const allergenOptions = [
    "peanuts", "tree nuts", "milk", "eggs", "fish", "shellfish", 
    "wheat", "soy", "sesame", "mustard", "celery", "sulphites"
  ];

  const handleDietaryChange = async (option: string) => {
    setDietaryPreferences((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );   
    
    console.log("new preferences: ", dietaryPreferences)
  };

  const handleAllergenChange = async (option: string) => {
    setAllergens((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );

    console.log("new allergens: ", allergens)
  };

  const handleChangePassword = async () => {
    Swal.fire({
      title: "Change Password",
      html: `
        <input type="password" id="current-password" class="swal2-input" placeholder="Current Password">
        <input type="password" id="new-password" class="swal2-input" placeholder="New Password">
        <input type="password" id="confirm-password" class="swal2-input" placeholder="Confirm New Password">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Change Password",
      preConfirm: async () => {
        const currentPassword = document.getElementById("current-password").value;
        const newPassword = document.getElementById("new-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
  
        if (!currentPassword || !newPassword || !confirmPassword) {
          Swal.showValidationMessage("Please fill in all fields.");
          return false;
        }
  
        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage("New passwords do not match.");
          return false;
        }

        const isVerified = await verifyPassword(currentPassword);
        if (!isVerified) {
          Swal.showValidationMessage("Current password incorrect.");
          return false;
        }
  
        return { currentPassword, newPassword };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        let response = await changePassword(result.value.currentPassword, result.value.newPassword);

        if (response["result"] != "success") {
          Swal.fire({
            title: "Oops!",
            text: "Something went wrong. Please try again later.",
            icon: "error",
            confirmButtonText: "OK"
          });
        } else {
          Swal.fire("Success!", "Your password has been changed.", "success");
        }
      }
    });
  };

  const handleLogOut = async () => {
    logOut();
    navigate("/")
  };

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Deleting your account is permanent and cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAccount();
        Swal.fire("Deleted!", "Your account has been deleted.", "success").then(() => {
          navigate("/");
        });
      }
    })
  };

  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getProfileInfo = async () => {
      try {
        const profileInfo: ProfileInfo = await sendProfileInfoRequest();

        setUpdateDatabaseFlag(false); // Dont change database

        const name = `${profileInfo["first_name"]} ${profileInfo["last_name"]}`;
        setUserName(name);

        const email = `${profileInfo["email"]}`;
        setUserEmail(email);

        console.log("Allergens: ", profileInfo["allergens"]);
        console.log("Preferences: ", profileInfo["preferences"]);
        
        setAllergens(profileInfo["allergens"]);
        setDietaryPreferences(profileInfo["preferences"]);

        setUpdateDatabaseFlag(true);

      } catch (error) {
        console.error("Error getting profile info:", error);
      }
    };

    getProfileInfo();
  }, []);

  return (
    <>
    <TopBar />
    <div className="profile-container">
      <div className="profile-card">

        <img className="profile-image" src="/profile.png" alt="Blank Profile Picture" />
        <h2>{userName}</h2>
        <p>Email: {userEmail}</p>

        <div className="section">
          <h3>DIETARY PREFERENCES</h3>

          {dietaryOptions.map((option) => (
            <div key={option}>
              <label>
                <input
                  type="checkbox"
                  value={option}
                  checked={dietaryPreferences.includes(option)}
                  onChange={() => handleDietaryChange(option)}
                />
                {option}
              </label>
            </div>
          ))}
        </div>

        <div className="section">
          <h3>ALLERGENS</h3>
          
          {allergenOptions.map((option) => (
            <div key={option}>
              <label>
                <input
                  type="checkbox"
                  value={option}
                  checked={allergens.includes(option)}
                  onChange={() => handleAllergenChange(option)}
                />
                {option}
              </label>
            </div>
          ))}
        </div>

        <div className="actions">
          <p onClick = {handleChangePassword} className="change-password"> Change password </p>
          <p onClick = {handleLogOut} className="log-out"> Log out </p>
          <p onClick = {handleDeleteAccount} className="delete-account"> Delete account </p>
        </div>

      </div>
    </div>
    </>
  );
}

export default ProfileCard;