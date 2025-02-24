document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const requestData = {
        action_type: "signup",
        email: email,
        username: username,
        password: password
    };

    try {
        const response = await fetch("http://localhost:8000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        document.getElementById('response-message').textContent = data.message;
        document.getElementById('response-message').style.color = response.ok ? "green" : "red";

    } catch (error) {
        console.error("Signup failed:", error);
        document.getElementById('response-message').textContent = "An error occurred. Please try again.";
        document.getElementById('response-message').style.color = "red";
    }
});
