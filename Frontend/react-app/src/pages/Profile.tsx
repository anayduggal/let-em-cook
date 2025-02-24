import "./Profile.css";
import TopBar from "../components/TopBar";





const ProfileCard = () => {

  const handleChangeClick = () => {
    console.log ("I DONT KNOW HOW ROUTING WORKS");
  };

  const handleButtonClick = () => {localStorage
    console.log ("Different page for adding/removing? Unsure")
  }

  const userName = "Firstname Lastname";
  const userEmail = "**********@gmail.com";
  const startDate = "Aug 2024";
  const dietPref = ["Vegan", "Gluten-free"];
  const allergens = ["Gluten", "Peanuts"];


  return (
    <>
    <TopBar />
    <div className="profile-container">
      <div className="profile-card">

        <img className="profile-image" src="/profile.png" alt="Blank Profile Picture" />
        <h2>{userName}</h2>
        <p>User since {startDate}</p>
        <p>Email: {userEmail}</p>

        <div className="section">
          <h3>DIETARY PREFERENCES</h3>

          {dietPref.map(pref => (
            <p className="contents" key={pref}>{pref}</p>
          ))}
          {<br></br>}

          <button className = "action-button"> ADD / REMOVE </button>
        </div>

        <div className="section">
          <h3>ALLERGENS</h3>
          {allergens.map(allergen => (
            <p className="contents" key={allergen}>{allergen}</p>
          ))}
          {<br />}

          <button className="action-button" onClick = {handleButtonClick}> ADD / REMOVE </button>
        </div>

        <div className="actions">
          <p onClick = {handleChangeClick} className="change-password"> Change password </p>
          <p onClick = {handleChangeClick} className="delete-account"> Delete account </p>

        </div>
      </div>
    </div>
    </>
  );
}

export default ProfileCard;