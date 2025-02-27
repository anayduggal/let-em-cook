async function submitSignupForm() {

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const request_data = {
        action_type: "signup",
        email: email,
        username: username,
        password: password
    };
    
    await fetch("http://localhost:8000/index.php/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request_data)
    })
    .then((response) => response.json()) 
    .then((data) => {

        const messageContainer = document.getElementById('response-message');
        messageContainer.innerHTML = '';

        const messageText = document.createElement('p');
        messageText.textContent = data.message;
        messageText.style.color = data.success ? "green" : "red";

        messageContainer.appendChild(messageText);

        if (data.success) {
            // Clear input fields if signup is successful
            document.getElementById("signup-form").reset();
        }
    })
    .catch((error) => {
        console.error("Signup failed:", error);
        const messageContainer = document.getElementById('response-message');
        messageContainer.innerHTML = '<p style="color: red;">An error occurred. Please try again.</p>';
    });
};
