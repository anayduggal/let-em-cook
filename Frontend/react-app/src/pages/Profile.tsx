import "./Profile.css";
import TopBar from "../components/TopBar";
import {
  sendProfileInfoRequest,
  ProfileInfo,
  updateDietaryPreferences,
  updateAllergens,
  logOut
} from "../api/userService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
    // TODO
  };

  const handleLogOut = async () => {
    logOut();
    navigate("/")
  };

  const handleDeleteAccount = async () => {
    // TODO
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